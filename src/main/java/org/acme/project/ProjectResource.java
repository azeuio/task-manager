package org.acme.project;

import java.util.List;

import org.acme.user.User;

import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/api/v1/projects")
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public class ProjectResource {
    @Inject
    SecurityIdentity securityIdentity;

    @GET
    public List<Project> getProjects() {
        return Project.listAll();
    }

    @GET
    @Path("/{id}")
    public Project getProject(Long id) {
        return Project.findById(id);
    }

    @POST
    @Transactional
    public ProjectResponse createProject(Project project) {
        User owner = User.findByUsername(securityIdentity.getPrincipal().getName());

        project.setOwner(owner);
        project.persist();
        return new ProjectResponse(project);
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public void deleteProject(Long id) {
        Project.deleteById(id);
    }
}
