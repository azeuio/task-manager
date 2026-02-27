package org.acme.resource;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import jakarta.transaction.Transactional;

import org.acme.model.project.Project;
import org.acme.model.project.ProjectStatus;
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
class TaskResourceTest {

        @InjectMock
        UserService userService;

        private User testUser;
        private Long testProjectId;
        private Long testTaskId;

        @BeforeEach
        @Transactional
        void setUp() {
                testUser = new User("testuser");
                testUser.setDisplayName("Test User");
                testUser.setEmail("test@example.com");
                testUser.persist();

                Project project = new Project("Test Project", "Test", ProjectStatus.ACTIVE, testUser);
                project.persist();
                testProjectId = project.id;

                Task task = new Task("Existing Task", "Existing description", 0, 1, project, testUser);
                task.persist();
                testTaskId = task.id;

                when(userService.findUser("testuser")).thenReturn(testUser);
        }

        @AfterEach
        @Transactional
        void tearDown() {
                Task.deleteAll();
                Project.deleteAll();
                User.deleteAll();
        }

        @Test
        void getTasks() {
                given()
                                .when().get("/api/v1/projects/" + testProjectId + "/tasks")
                                .then()
                                .statusCode(200)
                                .contentType(ContentType.JSON)
                                .body("$", hasSize(1))
                                .body("[0].title", is("Existing Task"));
        }

        @Test
        void getTask_byId() {
                given()
                                .when().get("/api/v1/projects/" + testProjectId + "/tasks/" + testTaskId)
                                .then()
                                .statusCode(200)
                                .body("title", is("Existing Task"))
                                .body("description", is("Existing description"))
                                .body("status", is(0))
                                .body("priority", is(1));
        }

        @Test
        void createTask() {
                given()
                                .contentType(ContentType.JSON)
                                .body("""
                                                {"title": "New Task", "description": "New task desc", "status": 0, "priority": 2}
                                                """)
                                .when().post("/api/v1/projects/" + testProjectId + "/tasks")
                                .then()
                                .statusCode(200)
                                .body("title", is("New Task"))
                                .body("description", is("New task desc"))
                                .body("status", is(0))
                                .body("priority", is(2));
        }

        @Test
        void createTask_defaultValues() {
                given()
                                .contentType(ContentType.JSON)
                                .body("{}")
                                .when().post("/api/v1/projects/" + testProjectId + "/tasks")
                                .then()
                                .statusCode(200)
                                .body("title", is("Untitled Task"))
                                .body("status", is(0))
                                .body("priority", is(0));
        }

        @Test
        void updateTask() {
                given()
                                .contentType(ContentType.JSON)
                                .body("""
                                                {"title": "Updated Title", "status": 1, "priority": 3}
                                                """)
                                .when().patch("/api/v1/projects/" + testProjectId + "/tasks/" + testTaskId)
                                .then()
                                .statusCode(200)
                                .body("title", is("Updated Title"))
                                .body("status", is(1))
                                .body("priority", is(3));
        }

        @Test
        void updateTask_partialUpdate() {
                given()
                                .contentType(ContentType.JSON)
                                .body("""
                                                {"description": "Updated description only"}
                                                """)
                                .when().patch("/api/v1/projects/" + testProjectId + "/tasks/" + testTaskId)
                                .then()
                                .statusCode(200)
                                .body("title", is("Existing Task"))
                                .body("description", is("Updated description only"));
        }

        @Test
        void deleteTask() {
                given()
                                .when().delete("/api/v1/projects/" + testProjectId + "/tasks/" + testTaskId)
                                .then()
                                .statusCode(204);

                given()
                                .when().get("/api/v1/projects/" + testProjectId + "/tasks")
                                .then()
                                .statusCode(200)
                                .body("$", hasSize(0));
        }

        @Test
        void getTasks_emptyProject() {
                // Delete the existing task first
                given()
                                .when().delete("/api/v1/projects/" + testProjectId + "/tasks/" + testTaskId)
                                .then()
                                .statusCode(204);

                given()
                                .when().get("/api/v1/projects/" + testProjectId + "/tasks")
                                .then()
                                .statusCode(200)
                                .body("$", hasSize(0));
        }
}
