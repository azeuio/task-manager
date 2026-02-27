package org.acme.resource;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import io.restassured.http.ContentType;

@QuarkusTest
@TestSecurity(user = "testuser", roles = { "user" })
class ProjectMemberResourceTest {

    @InjectMock
    UserService userService;

    private User testUser;
    private User secondUser;
    private Long testProjectId;

    @BeforeEach
    @Transactional
    void setUp() {
        testUser = new User("testuser");
        testUser.setDisplayName("Test User");
        testUser.setEmail("test@example.com");
        testUser.persist();

        secondUser = new User("seconduser");
        secondUser.setDisplayName("Second User");
        secondUser.setEmail("second@example.com");
        secondUser.persist();

        Project project = new Project("Test Project", "Test", ProjectStatus.ACTIVE, testUser);
        project.persist();
        testProjectId = project.id;

        ProjectMember ownerMembership = new ProjectMember(project, testUser, ProjectMemberRole.OWNER);
        project.addMember(ownerMembership);
        ownerMembership.persist();

        when(userService.findUser("testuser")).thenReturn(testUser);
        when(userService.findUser("seconduser")).thenReturn(secondUser);
    }

    @AfterEach
    @Transactional
    void tearDown() {
        ProjectMember.deleteAll();
        Project.deleteAll();
        User.deleteAll();
    }

    @Test
    void getProjectMembers() {
        given()
                .when().get("/api/v1/projects/" + testProjectId + "/members")
                .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("$", hasSize(1))
                .body("[0].role", is("OWNER"));
    }

    @Test
    void getCurrentUserProjectMembership() {
        given()
                .when().get("/api/v1/projects/" + testProjectId + "/members/user/me")
                .then()
                .statusCode(200)
                .body("role", is("OWNER"));
    }

    @Test
    void getProjectMemberByUserId() {
        given()
                .when().get("/api/v1/projects/" + testProjectId + "/members/user/" + testUser.id)
                .then()
                .statusCode(200)
                .body("role", is("OWNER"));
    }

    @Test
    void addProjectMember() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                        {"username": "seconduser", "role": "CONTRIBUTOR"}
                        """)
                .when().post("/api/v1/projects/" + testProjectId + "/members")
                .then()
                .statusCode(200)
                .body("role", is("CONTRIBUTOR"));

        // Verify the member was added
        given()
                .when().get("/api/v1/projects/" + testProjectId + "/members")
                .then()
                .statusCode(200)
                .body("$", hasSize(2));
    }

    @Test
    void updateProjectMemberRole() {
        // First add a member
        given()
                .contentType(ContentType.JSON)
                .body("""
                        {"username": "seconduser", "role": "CONTRIBUTOR"}
                        """)
                .when().post("/api/v1/projects/" + testProjectId + "/members")
                .then()
                .statusCode(200);

        // Then update their role
        given()
                .contentType(ContentType.JSON)
                .body("""
                        {"role": "VIEWER"}
                        """)
                .when().patch("/api/v1/projects/" + testProjectId + "/members/user/" + secondUser.id)
                .then()
                .statusCode(200)
                .body("role", is("VIEWER"));
    }

    @Test
    void removeProjectMember() {
        // First add a member
        given()
                .contentType(ContentType.JSON)
                .body("""
                        {"username": "seconduser", "role": "CONTRIBUTOR"}
                        """)
                .when().post("/api/v1/projects/" + testProjectId + "/members")
                .then()
                .statusCode(200);

        // Then remove them
        given()
                .when().delete("/api/v1/projects/" + testProjectId + "/members/user/" + secondUser.id)
                .then()
                .statusCode(204);

        // Verify removal
        given()
                .when().get("/api/v1/projects/" + testProjectId + "/members")
                .then()
                .statusCode(200)
                .body("$", hasSize(1));
    }
}
