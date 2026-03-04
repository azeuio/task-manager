package org.acme.resource;

import org.acme.model.projects_stats.MostCompletedDTO;
import org.acme.model.projects_stats.MostNewMembersDTO;
import org.acme.model.projects_stats.MostNewTasksDTO;
import org.acme.service.ProjectsStatsService;

import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/api/v1/projects/stats")
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public class ProjectsStatsResource {
    @Inject
    ProjectsStatsService projectsStatsService;

    @GET
    @Path("/most-new-tasks")
    public MostNewTasksDTO getMostNewTasks() {
        MostNewTasksDTO result = projectsStatsService.mostNewTasksInPastMonth();
        if (result == null) {
            throw new NotFoundException("No tasks created this month");
        }
        return result;
    }

    @GET
    @Path("/most-new-members")
    public MostNewMembersDTO getMostNewMembers() {
        MostNewMembersDTO result = projectsStatsService.mostNewMembersInPastMonth();
        if (result == null) {
            throw new NotFoundException("No members joined this month");
        }
        return result;
    }

    @GET
    @Path("/most-completed")
    public MostCompletedDTO getMostCompleted() {
        MostCompletedDTO result = projectsStatsService.mostCompletedInPastMonth();
        if (result == null) {
            throw new NotFoundException("No tasks completed this month");
        }
        return result;
    }
}
