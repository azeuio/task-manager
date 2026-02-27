package org.acme.resource;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import jakarta.transaction.Transactional;

import org.acme.model.project.Project;
import org.acme.model.project.ProjectStatus;
import org.acme.model.project_member.ProjectMember;
import org.acme.model.project_member.ProjectMemberRole;
import org.acme.model.task.Task;
import org.acme.model.user.User;
import org.acme.service.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import io.restassured.http.ContentType;

@QuarkusTest
@TestSecurity(user = "testuser", roles = { "user" })
class ProjectsStatsResourceTest {

    @InjectMock
    UserService userService;

    private User testUser;

    @BeforeEach
    @Transactional
    void setUp() {
        testUser = new User("testuser");
        testUser.setDisplayName("Test User");
        testUser.setEmail("test@example.com");
        testUser.persist();

        // Project with tasks
        Project projectWithTasks = new Project("Active Project", "Has tasks", ProjectStatus.ACTIVE, testUser);
        projectWithTasks.persist();
        ProjectMember membership1 = new ProjectMember(projectWithTasks, testUser, ProjectMemberRole.OWNER);
        projectWithTasks.addMember(membership1);
        membership1.persist();

        // Create tasks: 1 todo, 1 in-progress, 1 done, 1 overdue
        Task todoTask = new Task("Todo", "A todo task", 0, 1, projectWithTasks, testUser);
        todoTask.persist();

        Task inProgressTask = new Task("In Progress", "Working on it", 1, 2, projectWithTasks, testUser);
        inProgressTask.persist();

        Task doneTask = new Task("Done", "Finished", 2, 1, projectWithTasks, testUser);
        doneTask.persist();

        Task overdueTask = new Task("Overdue", "Past due", 0, 3, projectWithTasks, testUser);
        overdueTask.setDueDate(Instant.now().minus(7, ChronoUnit.DAYS));
        overdueTask.persist();

        // Empty project (no tasks)
        Project emptyProject = new Project("Empty Project", "No tasks", ProjectStatus.ACTIVE, testUser);
        emptyProject.persist();
        ProjectMember membership2 = new ProjectMember(emptyProject, testUser, ProjectMemberRole.OWNER);
        emptyProject.addMember(membership2);
        membership2.persist();

        when(userService.findUser("testuser")).thenReturn(testUser);
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
    void getProjectsStats_returnsStatsForAllUserProjects() {
        given()
                .when().get("/api/v1/projects/stats")
                .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("$", hasSize(2));
    }

    @Test
    void getProjectsStats_containsCorrectFields() {
        given()
                .when().get("/api/v1/projects/stats")
                .then()
                .statusCode(200)
                .body("[0].projectId", notNullValue())
                .body("[0].projectName", notNullValue())
                .body("[0].from", notNullValue())
                .body("[0].to", notNullValue())
                .body("[0].totalTasks", notNullValue())
                .body("[0].tasksCreated", notNullValue())
                .body("[0].completedTasks", notNullValue())
                .body("[0].overdueTasks", notNullValue())
                .body("[0].totalMembers", notNullValue())
                .body("[0].membersJoined", notNullValue());
    }

    @Test
    void getProjectsStats_projectWithTasks_hasCorrectCounts() {
        // The active project has 4 tasks, 1 completed, 1 overdue
        // It should be sorted first because it has the most tasksCreated
        given()
                .when().get("/api/v1/projects/stats")
                .then()
                .statusCode(200)
                .body("find { it.projectName == 'Active Project' }.totalTasks", is(4))
                .body("find { it.projectName == 'Active Project' }.completedTasks", is(1))
                .body("find { it.projectName == 'Active Project' }.overdueTasks", is(1))
                .body("find { it.projectName == 'Active Project' }.totalMembers", is(1));
    }

    @Test
    void getProjectsStats_emptyProject_hasZeroCounts() {
        given()
                .when().get("/api/v1/projects/stats")
                .then()
                .statusCode(200)
                .body("find { it.projectName == 'Empty Project' }.totalTasks", is(0))
                .body("find { it.projectName == 'Empty Project' }.completedTasks", is(0))
                .body("find { it.projectName == 'Empty Project' }.overdueTasks", is(0));
    }

    @Test
    void getProjectsStats_sortedByActivity() {
        // Active Project has more tasks created, so it should come first
        given()
                .when().get("/api/v1/projects/stats")
                .then()
                .statusCode(200)
                .body("[0].projectName", is("Active Project"))
                .body("[1].projectName", is("Empty Project"));
    }

    @Test
    void getProjectsStats_withMonthDelta() {
        // monthDelta=6 looks at data from 6 months ago - no recent tasks should match
        given()
                .queryParam("monthDelta", 6)
                .when().get("/api/v1/projects/stats")
                .then()
                .statusCode(200)
                .body("$", hasSize(2))
                .body("find { it.projectName == 'Active Project' }.tasksCreated", is(0))
                .body("find { it.projectName == 'Active Project' }.totalTasks", is(0));
    }

    @Test
    void getProjectsStats_withLimit() {
        given()
                .queryParam("limit", 1)
                .when().get("/api/v1/projects/stats")
                .then()
                .statusCode(200)
                .body("$", hasSize(1));
    }

    @Test
    void getProjectsStats_withOffset() {
        given()
                .queryParam("offset", 1)
                .when().get("/api/v1/projects/stats")
                .then()
                .statusCode(200)
                .body("$", hasSize(1))
                .body("[0].projectName", is("Empty Project"));
    }

    @Test
    void getProjectsStats_withLimitAndOffset() {
        given()
                .queryParam("limit", 1)
                .queryParam("offset", 1)
                .when().get("/api/v1/projects/stats")
                .then()
                .statusCode(200)
                .body("$", hasSize(1))
                .body("[0].projectName", is("Empty Project"));
    }

    @Test
    void getProjectsStats_offsetBeyondResults_returnsEmpty() {
        given()
                .queryParam("offset", 100)
                .when().get("/api/v1/projects/stats")
                .then()
                .statusCode(200)
                .body("$", hasSize(0));
    }

    @Test
    void getProjectsStats_memberCountsReflectJoined() {
        given()
                .when().get("/api/v1/projects/stats")
                .then()
                .statusCode(200)
                .body("find { it.projectName == 'Active Project' }.membersJoined",
                        greaterThanOrEqualTo(1));
    }
}
