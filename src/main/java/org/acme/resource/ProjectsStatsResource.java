package org.acme.resource;

import java.util.List;

import org.acme.model.project_member.ProjectMember;
import org.acme.model.projects_stats.MostCompletedDTO;
import org.acme.model.projects_stats.MostNewMembersDTO;
import org.acme.model.projects_stats.MostNewTasksDTO;
import org.acme.model.projects_stats.ProjectsStatsDTO;
import org.acme.model.user.User;
import org.acme.service.ProjectService;
import org.acme.service.ProjectsStatsService;
import org.acme.service.UserService;

import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

@Path("/api/v1/projects/stats")
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public class ProjectsStatsResource {
    @Inject
    ProjectsStatsService projectsStatsService;

    @Inject
    SecurityIdentity securityIdentity;

    @Inject
    UserService userService;

    @Inject
    ProjectService projectService;

    @GET
    @Transactional
    public List<ProjectsStatsDTO> getStats(@QueryParam("limit") Integer limit) {
        User currentUser = userService.findUser(securityIdentity.getPrincipal().getName());
        List<ProjectMember> memberships = projectService.findByMemberUserId(currentUser.id);

        return memberships.stream()
                .map(pm -> projectsStatsService.toDTO(pm.getProject().id, 0L))
                .sorted(projectsStatsService::compareStats)
                .limit(limit != null ? limit : Long.MAX_VALUE)
                .toList();
    }

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
