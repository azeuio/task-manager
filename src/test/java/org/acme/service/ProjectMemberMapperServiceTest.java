package org.acme.service;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.acme.model.project.Project;
import org.acme.model.project.ProjectStatus;
import org.acme.model.project_member.ProjectMember;
import org.acme.model.project_member.ProjectMemberDTO;
import org.acme.model.project_member.ProjectMemberRole;
import org.acme.model.user.User;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
class ProjectMemberMapperServiceTest {

    @Inject
    ProjectMemberMapperService mapper;

    @Test
    void toDTO_mapsFields() {
        User user = new User("testuser");
        user.setId(10L);
        Project project = new Project("Test", "Desc", ProjectStatus.ACTIVE, user);
        project.id = 5L;

        ProjectMember member = new ProjectMember(project, user, ProjectMemberRole.CONTRIBUTOR);
        member.id = 1L;

        ProjectMemberDTO dto = mapper.toDTO(member);

        assertEquals(1L, dto.id());
        assertEquals(5L, dto.projectId());
        assertEquals(10L, dto.userId());
        assertEquals(ProjectMemberRole.CONTRIBUTOR, dto.role());
        // username is marked ignore=true in the mapper
        assertNull(dto.username());
        assertNotNull(dto.joinedAt());
    }

    @Test
    void toDTO_ownerRole() {
        User user = new User("owner");
        user.setId(1L);
        Project project = new Project();
        project.id = 2L;

        ProjectMember member = new ProjectMember(project, user, ProjectMemberRole.OWNER);
        member.id = 3L;

        ProjectMemberDTO dto = mapper.toDTO(member);

        assertEquals(ProjectMemberRole.OWNER, dto.role());
    }

    @Test
    void toDTO_viewerRole() {
        User user = new User("viewer");
        user.setId(1L);
        Project project = new Project();
        project.id = 2L;

        ProjectMember member = new ProjectMember(project, user, ProjectMemberRole.VIEWER);
        member.id = 4L;

        ProjectMemberDTO dto = mapper.toDTO(member);

        assertEquals(ProjectMemberRole.VIEWER, dto.role());
    }

    @Test
    void toEntity_mapsFields() {
        ProjectMemberDTO dto = new ProjectMemberDTO(
                1L, 5L, 10L, "testuser", ProjectMemberRole.CONTRIBUTOR, "2024-01-01T00:00:00Z");

        ProjectMember member = mapper.toEntity(dto);

        assertEquals(1L, member.getId());
        assertEquals(5L, member.getProject().id);
        assertEquals(10L, member.getUser().id);
        assertEquals(ProjectMemberRole.CONTRIBUTOR, member.getRole());
    }

    @Test
    void toEntity_handlesNullIds() {
        ProjectMemberDTO dto = new ProjectMemberDTO(
                null, null, null, null, ProjectMemberRole.VIEWER, null);

        ProjectMember member = mapper.toEntity(dto);

        assertNull(member.getId());
        assertEquals(ProjectMemberRole.VIEWER, member.getRole());
    }

    @Test
    void toDTO_allRoles() {
        for (ProjectMemberRole role : ProjectMemberRole.values()) {
            User user = new User("user");
            user.setId(1L);
            Project project = new Project();
            project.id = 1L;

            ProjectMember member = new ProjectMember(project, user, role);
            member.id = 1L;

            ProjectMemberDTO dto = mapper.toDTO(member);
            assertEquals(role, dto.role());
        }
    }
}
