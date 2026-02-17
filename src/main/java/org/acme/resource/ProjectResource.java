package org.acme.resource;

import java.util.List;
import java.util.Set;

import org.acme.model.project.Project;
import org.acme.model.project.ProjectDTO;
import org.acme.model.project.ProjectStatus;
import org.acme.model.project_member.ProjectMember;
import org.acme.model.project_member.ProjectMemberDTO;
import org.acme.model.project_member.ProjectMemberRole;
import org.acme.model.user.User;
import org.acme.service.ProjectMapperService;
import org.acme.service.ProjectMemberMapperService;
import org.acme.service.ProjectService;
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

    @GET
    @Transactional // because of lazy loading of members
    public List<ProjectDTO> getProjects() {
        User currentUser = userService.findUser(securityIdentity.getPrincipal().getName());
        List<ProjectMember> projects = projectService.findByMemberUserId(currentUser.id);
        List<ProjectDTO> projectDTOs = projects.stream()
                .map(pm -> projectMapper.toDTO(pm.getProject()))
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
    @Path("/members")
    public List<ProjectMemberDTO> getProjectMembers() {
        List<ProjectMember> projectMembers = ProjectMember.listAll();
        return projectMembers.stream().map(projectMemberMapper::toDTO).toList();
    }

    @GET
    @Path("/{projectId}/members")
    public List<ProjectMemberDTO> getProjectMembers(@PathParam("projectId") Long projectId) {
        List<ProjectMember> projectMembers = ProjectMember.findByProjectId(projectId);
        return projectMembers.stream().map(projectMemberMapper::toDTO).toList();
    }

    @GET
    @Path("/{projectId}/members/user/{userId}")
    public ProjectMemberDTO getProjectMembersByUserId(@PathParam("userId") Long userId,
            @PathParam("projectId") Long projectId) {
        ProjectMember projectMember = ProjectMember.findByProjectIdAndUserId(projectId, userId);
        if (projectMember == null) {
            throw new RuntimeException("Project member not found");
        }
        return projectMemberMapper.toDTO(projectMember);
    }

    @POST
    @Path("/{projectId}/members")
    @Transactional
    public ProjectMemberDTO addProjectMember(@PathParam("projectId") Long projectId,
            ProjectMemberDTO projectMemberDTO) {
        Project project = Project.findById(projectId);
        User user = userService.findUser(projectMemberDTO.username());
        if (project == null || user == null) {
            throw new RuntimeException("Project or User not found");
        }
        System.out.println("Adding user " + user.getUsername() + " to project " + project.getName() + " with role "
                + projectMemberDTO.role());
        ProjectMember projectMember = projectMemberMapper.toEntity(projectMemberDTO);
        projectMember.setProject(project);
        projectMember.setUser(user);
        projectMember.persist();
        project.addMember(projectMember);
        project.persist();
        return projectMemberMapper.toDTO(projectMember);
    }

    @DELETE
    @Path("/{projectId}/members/{id}")
    @Transactional
    public void removeProjectMember(@PathParam("projectId") Long projectId, @PathParam("id") Long id) {
        ProjectMember projectMember = ProjectMember.findById(id);
        if (projectMember == null || !projectMember.getProject().id.equals(projectId)) {
            throw new RuntimeException("Project member not found");
        }
        projectMember.delete();
    }
}
