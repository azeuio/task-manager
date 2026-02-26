package org.acme.resource;

import java.util.List;

import org.acme.model.project.Project;
import org.acme.model.project_member.ProjectMember;
import org.acme.model.project_member.ProjectMemberDTO;
import org.acme.model.user.User;
import org.acme.service.ProjectMemberMapperService;
import org.acme.service.UserService;

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

@Path("/api/v1/projects/{projectId}/members")
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public class ProjectMemberResource {
    @Inject
    SecurityIdentity securityIdentity;

    @Inject
    ProjectMemberMapperService projectMemberMapper;

    @Inject
    UserService userService;

    @GET
    public List<ProjectMemberDTO> getProjectMembers(@PathParam("projectId") Long projectId) {
        List<ProjectMember> projectMembers = ProjectMember.findByProjectId(projectId);
        List<ProjectMemberDTO> projectMemberDTOs = projectMembers.stream().map(projectMemberMapper::toDTO).toList();

        // print project members for debugging
        System.out.println("Project members for project " + projectId + ":");
        projectMemberDTOs.forEach(pm -> System.out.println("- " + pm.userId() + " (" + pm.role() + ")"));

        return projectMemberDTOs;
    }

    @GET
    @Path("/user/me")
    public ProjectMemberDTO getCurrentUserProjectMembership(@PathParam("projectId") Long projectId) {
        Long userIdLong = userService.findUser(securityIdentity.getPrincipal().getName()).id;
        return getProjectMembersByUserId(userIdLong, projectId);
    }

    @GET
    @Path("/user/{userId}")
    public ProjectMemberDTO getProjectMembersByUserId(@PathParam("userId") Long userId,
            @PathParam("projectId") Long projectId) {
        ProjectMember projectMember = ProjectMember.findByProjectIdAndUserId(projectId, userId);
        if (projectMember == null) {
            throw new RuntimeException("Project member not found");
        }
        return projectMemberMapper.toDTO(projectMember);
    }

    @PATCH
    @Path("/user/{userId}")
    @Transactional
    public ProjectMemberDTO updateProjectMember(@PathParam("userId") Long userId,
            @PathParam("projectId") Long projectId, ProjectMemberDTO projectMemberDTO) {
        ProjectMember projectMember = ProjectMember.findByProjectIdAndUserId(projectId, userId);
        if (projectMember == null) {
            throw new RuntimeException("Project member not found");
        }
        if (projectMemberDTO.role() != null) {
            projectMember.setRole(projectMemberDTO.role());
        }
        projectMember.persist();
        return projectMemberMapper.toDTO(projectMember);
    }

    @POST
    @Transactional
    public ProjectMemberDTO addProjectMember(@PathParam("projectId") Long projectId,
            ProjectMemberDTO projectMemberDTO) {
        Project project = Project.findById(projectId);
        User user = User.findById(projectMemberDTO.userId());
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
    @Path("/{id}")
    @Transactional
    public void removeProjectMember(@PathParam("projectId") Long projectId, @PathParam("id") Long id) {
        ProjectMember projectMember = ProjectMember.findById(id);
        if (projectMember == null || !projectMember.getProject().id.equals(projectId)) {
            throw new RuntimeException("Project member not found");
        }
        projectMember.delete();
    }
}
