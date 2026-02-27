package org.acme.service;

import java.time.Duration;
import java.time.Instant;

import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import org.acme.model.project.Project;
import org.acme.model.project.ProjectStatus;
import org.acme.model.project_member.ProjectMember;
import org.acme.model.project_member.ProjectMemberRole;
import org.acme.model.projects_stats.ProjectsStatsDTO;
import org.acme.model.task.Task;
import org.acme.model.user.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestSecurity(user = "testuser", roles = { "user" })
class ProjectsStatsServiceIntegrationTest {

    @Inject
    ProjectsStatsService statsService;

    private Long projectId;

    @BeforeEach
    @Transactional
    void setUp() {
        User user = new User("statsuser");
        user.setDisplayName("Stats User");
        user.setEmail("stats@test.com");
        user.persist();

        Project project = new Project("Stats Project", "For stats testing", ProjectStatus.ACTIVE, user);
        project.persist();
        projectId = project.id;

        ProjectMember membership = new ProjectMember(project, user, ProjectMemberRole.OWNER);
        membership.persist();

        // Create some tasks with different statuses
        Task todo = new Task("Todo Task", "Not started", 0, 1, project, user);
        todo.persist();

        Task inProgress = new Task("In Progress Task", "Working on it", 1, 2, project, user);
        inProgress.persist();

        Task done = new Task("Done Task", "Completed", 2, 1, project, user);
        done.persist();

        // Create an overdue task: past due date and not completed
        Task overdue = new Task("Overdue Task", "Late", 0, 3, project, user);
        overdue.setDueDate(Instant.now().minus(Duration.ofDays(7)));
        overdue.persist();
    }

    @AfterEach
    @Transactional
    void tearDown() {
        Task.deleteAll();
        ProjectMember.deleteAll();
        Project.deleteAll();
        User.deleteAll();
    }

    @Test
    void toDTO_currentMonth() {
        ProjectsStatsDTO stats = statsService.toDTO(projectId, 0L);

        assertNotNull(stats);
        assertEquals(projectId, stats.projectId());
        assertEquals("Stats Project", stats.projectName());
        assertEquals(4, stats.totalTasks());
        assertEquals(4, stats.tasksCreated());
        assertEquals(1, stats.completedTasks());
        assertEquals(1, stats.overdueTasks());
        assertEquals(1, stats.totalMembers());
        assertEquals(1, stats.membersJoined());
    }

    @Test
    void toDTO_futureMonthDelta_noRecentData() {
        // monthDelta=6 means looking at data from ~7 months ago to ~6 months ago
        ProjectsStatsDTO stats = statsService.toDTO(projectId, 6L);

        assertNotNull(stats);
        assertEquals(projectId, stats.projectId());
        assertEquals(0, stats.totalTasks());
        assertEquals(0, stats.tasksCreated());
        assertEquals(0, stats.completedTasks());
        assertEquals(0, stats.overdueTasks());
        assertEquals(0, stats.totalMembers());
        assertEquals(0, stats.membersJoined());
    }

    @Test
    void toDTO_setsTimeRange() {
        ProjectsStatsDTO stats = statsService.toDTO(projectId, 0L);

        assertNotNull(stats.from());
        assertNotNull(stats.to());
        assertTrue(stats.from().isBefore(stats.to()));
    }

    @Test
    void toDTO_emptyProject() {
        // Create an empty project (no tasks, no extra members beyond setup)
        Long emptyProjectId;
        emptyProjectId = createEmptyProject();

        ProjectsStatsDTO stats = statsService.toDTO(emptyProjectId, 0L);

        assertNotNull(stats);
        assertEquals(0, stats.totalTasks());
        assertEquals(0, stats.tasksCreated());
        assertEquals(0, stats.completedTasks());
        assertEquals(0, stats.overdueTasks());
    }

    @Transactional
    Long createEmptyProject() {
        User user = User.find("username", "statsuser").firstResult();
        Project empty = new Project("Empty Project", "No tasks", ProjectStatus.ACTIVE, user);
        empty.persist();
        return empty.id;
    }
}
