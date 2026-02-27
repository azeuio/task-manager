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
import static org.mockito.Mockito.when;

import io.restassured.http.ContentType;

@QuarkusTest
@TestSecurity(user = "testuser", roles = { "user" })
class UserResourceTest {

    @InjectMock
    UserService userService;

    private User testUser;
    private Long testUserId;

    @BeforeEach
    @Transactional
    void setUp() {
        testUser = new User("testuser");
        testUser.setDisplayName("Test User");
        testUser.setEmail("test@example.com");
        testUser.persist();
        testUserId = testUser.id;

        Project project = new Project("Test Project", "Test", ProjectStatus.ACTIVE, testUser);
        project.persist();
        ProjectMember membership = new ProjectMember(project, testUser, ProjectMemberRole.OWNER);
        project.addMember(membership);
        membership.persist();

        Task task = new Task("Assigned Task", "desc", 0, 1, project, testUser);
        task.setAssignedTo(testUser);
        task.persist();

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
    void getCurrentUser() {
        given()
                .when().get("/api/v1/users/me")
                .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("username", is("testuser"))
                .body("displayName", is("Test User"))
                .body("email", is("test@example.com"));
    }

    @Test
    void getUserById() {
        given()
                .when().get("/api/v1/users/" + testUserId)
                .then()
                .statusCode(200)
                .body("username", is("testuser"));
    }

    @Test
    void getUserByUsername() {
        given()
                .when().get("/api/v1/users/username/testuser")
                .then()
                .statusCode(200)
                .body("username", is("testuser"))
                .body("email", is("test@example.com"));
    }

    @Test
    void getUserProjectMemberships() {
        given()
                .when().get("/api/v1/users/" + testUserId + "/projects-memberships")
                .then()
                .statusCode(200)
                .body("$", hasSize(1))
                .body("[0].role", is("OWNER"));
    }

    @Test
    void getUserTasks() {
        given()
                .when().get("/api/v1/users/" + testUserId + "/tasks")
                .then()
                .statusCode(200)
                .body("$", hasSize(1))
                .body("[0].title", is("Assigned Task"));
    }

    @Test
    void getUserTasks_withPagination() {
        given()
                .queryParam("limit", "10")
                .queryParam("offset", "0")
                .when().get("/api/v1/users/" + testUserId + "/tasks")
                .then()
                .statusCode(200)
                .body("$", hasSize(1));
    }

    @Test
    @TestSecurity(user = "admin", roles = { "admin" })
    void getUserCount_asAdmin() {
        when(userService.findUser("admin")).thenReturn(testUser);

        given()
                .when().get("/api/v1/users/count")
                .then()
                .statusCode(200);
    }

    @Test
    void getUserCount_asRegularUser_forbidden() {
        given()
                .when().get("/api/v1/users/count")
                .then()
                .statusCode(403);
    }
}
