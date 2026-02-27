package org.acme.resource;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import org.acme.model.project.Project;
import org.acme.model.project.ProjectStatus;
import org.acme.model.project_member.ProjectMember;
import org.acme.model.project_member.ProjectMemberRole;
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
class ProjectResourceTest {

        @InjectMock
        UserService userService;

        private User testUser;
        private Long testProjectId;

        @BeforeEach
        @Transactional
        void setUp() {
                testUser = new User("testuser");
                testUser.setDisplayName("Test User");
                testUser.setEmail("test@example.com");
                testUser.persist();

                Project project = new Project("Test Project", "A test project", ProjectStatus.ACTIVE, testUser);
                project.persist();

                ProjectMember membership = new ProjectMember(project, testUser, ProjectMemberRole.OWNER);
                project.addMember(membership);
                membership.persist();

                testProjectId = project.id;

                when(userService.findUser("testuser")).thenReturn(testUser);
        }

        @AfterEach
        @Transactional
        void tearDown() {
                ProjectMember.deleteAll();
                // Use native query to avoid cascade issues
                Project.deleteAll();
                User.deleteAll();
        }

        @Test
        void getProjects_returnsCurrentUserProjects() {
                given()
                                .when().get("/api/v1/projects")
                                .then()
                                .statusCode(200)
                                .contentType(ContentType.JSON)
                                .body("$", hasSize(1))
                                .body("[0].name", is("Test Project"));
        }

        @Test
        void getProjects_withLimit() {
                given()
                                .queryParam("limit", 1)
                                .when().get("/api/v1/projects")
                                .then()
                                .statusCode(200)
                                .body("$", hasSize(1));
        }

        @Test
        void getProject_byId() {
                given()
                                .when().get("/api/v1/projects/" + testProjectId)
                                .then()
                                .statusCode(200)
                                .body("name", is("Test Project"))
                                .body("description", is("A test project"))
                                .body("status", is("ACTIVE"));
        }

        @Test
        void createProject() {
                given()
                                .contentType(ContentType.JSON)
                                .body("""
                                                {"name": "New Project", "description": "Created via test"}
                                                """)
                                .when().post("/api/v1/projects")
                                .then()
                                .statusCode(200)
                                .body("name", is("New Project"))
                                .body("description", is("Created via test"));
        }

        @Test
        void updateProject() {
                given()
                                .contentType(ContentType.JSON)
                                .body("""
                                                {"name": "Updated Name", "color": "#00FF00"}
                                                """)
                                .when().patch("/api/v1/projects/" + testProjectId)
                                .then()
                                .statusCode(200)
                                .body("name", is("Updated Name"))
                                .body("color", is("#00FF00"));
        }

        @Test
        void updateProject_partialUpdate_preservesExistingFields() {
                given()
                                .contentType(ContentType.JSON)
                                .body("""
                                                {"color": "#0000FF"}
                                                """)
                                .when().patch("/api/v1/projects/" + testProjectId)
                                .then()
                                .statusCode(200)
                                .body("name", is("Test Project"))
                                .body("color", is("#0000FF"));
        }

        @Test
        void deleteProject() {
                given()
                                .when().delete("/api/v1/projects/" + testProjectId)
                                .then()
                                .statusCode(204);

                given()
                                .when().get("/api/v1/projects")
                                .then()
                                .statusCode(200)
                                .body("$", hasSize(0));
        }

        @Test
        void getProjectUsers() {
                given()
                                .when().get("/api/v1/projects/" + testProjectId + "/users")
                                .then()
                                .statusCode(200)
                                .body("$", hasSize(1));
        }
}
