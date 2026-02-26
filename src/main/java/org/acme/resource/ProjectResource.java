package org.acme.resource;

import java.util.List;
import java.util.Set;

import org.acme.model.project.Project;
import org.acme.model.project.ProjectDTO;
import org.acme.model.project_member.ProjectMember;
import org.acme.model.project_member.ProjectMemberRole;
import org.acme.model.user.User;
import org.acme.model.user.UserDTO;
import org.acme.service.ProjectMapperService;
import org.acme.service.ProjectMemberMapperService;
import org.acme.service.ProjectService;
import org.acme.service.UserMapperService;
import org.acme.service.UserService;
import org.eclipse.microprofile.jwt.JsonWebToken;

import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

@Path("/api/v1/projects")
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public class ProjectResource {
    @Inject
    SecurityIdentity securityIdentity;

    @Inject
    JsonWebToken jwt;

    @Inject
    ProjectMapperService projectMapper;

    @Inject
    ProjectMemberMapperService projectMemberMapper;

    @Inject
    UserService userService;

    @Inject
    ProjectService projectService;

    @Inject
    UserMapperService userMapper;

    @GET
    @Transactional // because of lazy loading of members
    public List<ProjectDTO> getProjects(@QueryParam("limit") Integer limit) {
        System.out.println("Fetching projects with limit: " + limit);
        User currentUser = userService.findUser(securityIdentity.getPrincipal().getName());
        List<ProjectMember> projects = projectService.findByMemberUserId(currentUser.id);
        List<ProjectDTO> projectDTOs = projects.stream()
                .map(pm -> projectMapper.toDTO(pm.getProject()))
                .limit(limit != null ? limit : Long.MAX_VALUE)
                .toList();
        return projectDTOs;

    }

    @GET
    @Path("/{id}")
    public ProjectDTO getProject(@PathParam("id") Long id) {
        Project project = Project.findById(id);
        return projectMapper.toDTO(project);
    }

    @POST
    @Transactional
    public ProjectDTO createProject(ProjectDTO projectDTO) {
        User owner = userService.findUser(securityIdentity.getPrincipal().getName());
        Project project = projectMapper.toEntity(projectDTO);
        ProjectMember ownerMembership = new ProjectMember(project, owner, ProjectMemberRole.OWNER);
        project.setOwner(owner);
        project.addMember(ownerMembership);

        project.persist();
        return projectMapper.toDTO(project);
    }

    @PATCH
    @Path("/{id}")
    @Transactional
    public ProjectDTO updateProject(@PathParam("id") Long id, ProjectDTO projectDTO) {
        Project project = Project.findById(id);
        if (project == null) {
            throw new RuntimeException("Project not found");
        }
        if (projectDTO.name() != null) {
            project.setName(projectDTO.name());
        }
        if (projectDTO.description() != null) {
            project.setDescription(projectDTO.description());
        }
        if (projectDTO.color() != null) {
            project.setColor(projectDTO.color());
        }
        if (projectDTO.status() != null) {
            project.setStatus(projectDTO.status());
        }
        project.persist();
        return projectMapper.toDTO(project);
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public void deleteProject(@PathParam("id") Long id) {
        Project.deleteById(id);
    }

    @GET
    @Path("/{projectId}/users")
    public Set<UserDTO> getProjectUsers(@PathParam("projectId") Long projectId) {
        return projectService.getUsersByProjectId(projectId).stream()
                .map(user -> userMapper.toDTO(user))
                .collect(java.util.stream.Collectors.toSet());
    }

}
