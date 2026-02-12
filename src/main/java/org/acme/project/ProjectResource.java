package org.acme.project;

import java.util.List;

import org.acme.user.User;
import org.eclipse.microprofile.jwt.JsonWebToken;

import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
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
    ProjectMapper projectMapper;

    @GET
    public List<ProjectDTO> getProjects() {
        List<Project> projects = Project.listAll();
        return projects.stream().map(projectMapper::toDTO).toList();
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
        User owner = User.findOrCreateUser(securityIdentity.getPrincipal().getName(), jwt);
        Project project = new Project(projectDTO.name(), projectDTO.description(), ProjectStatus.ACTIVE, owner);

        project.persist();
        return projectMapper.toDTO(project);
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public void deleteProject(@PathParam("id") Long id) {
        Project.deleteById(id);
    }
}
