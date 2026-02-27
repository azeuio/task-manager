package org.acme.resource;

import java.util.List;

import org.acme.model.projects_stats.ProjectsStatsDTO;
import org.acme.model.user.User;
import org.acme.service.ProjectService;
import org.acme.service.ProjectsStatsService;
import org.acme.service.UserService;

import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

@Path("/api/v1/projects/stats")
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public class ProjectsStatsResource {
    @Inject
    SecurityIdentity securityIdentity;
    @Inject
    ProjectsStatsService projectsStatsService;
    @Inject
    UserService userService;

    @Inject
    ProjectService projectService;

    @GET
    public List<ProjectsStatsDTO> getProjectsStats(@QueryParam("limit") Long limit, @QueryParam("offset") Long offset,
            @QueryParam("monthDelta") Long monthDelta) {

        System.out.println(
                "Getting projects stats with limit=" + limit + ", offset=" + offset + ", monthDelta=" + monthDelta);
        User currentUser = userService.findUser(securityIdentity.getPrincipal().getName());

        return projectService.getProjectsByUserId(currentUser.id).stream()
                .map(project -> projectsStatsService.toDTO(project.id, monthDelta != null ? monthDelta : 0))
                .sorted((Stats1, Stats2) -> projectsStatsService.compareStats(Stats1, Stats2))
                .skip(offset != null ? offset : 0)
                .limit(limit != null ? limit : Long.MAX_VALUE)
                .toList();
    }

}
