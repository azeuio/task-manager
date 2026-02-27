package org.acme.service;

import java.util.LinkedHashSet;
import java.util.Set;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.acme.model.project.Project;
import org.acme.model.project_member.ProjectMember;
import org.acme.model.project_member.ProjectMemberRole;
import org.acme.model.user.User;
import org.acme.model.user.UserDTO;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
class UserMapperServiceTest {

    @Inject
    UserMapperService mapper;

    // --- Static helper method tests ---

    @Test
    void projectMembershipsToProjectIds_withMemberships() {
        Project project1 = new Project();
        project1.id = 100L;
        Project project2 = new Project();
        project2.id = 200L;
        Project project3 = new Project();
        project3.id = 300L;

        User user = new User("testuser");

        Set<ProjectMember> memberships = new LinkedHashSet<>();
        memberships.add(new ProjectMember(project1, user, ProjectMemberRole.OWNER));
        memberships.add(new ProjectMember(project2, user, ProjectMemberRole.CONTRIBUTOR));
        memberships.add(new ProjectMember(project3, user, ProjectMemberRole.VIEWER));

        Long[] ids = UserMapperService.projectMembershipsToProjectIds(memberships);

        assertEquals(3, ids.length);
        Set<Long> idSet = Set.of(ids);
        assertTrue(idSet.contains(100L));
        assertTrue(idSet.contains(200L));
        assertTrue(idSet.contains(300L));
    }

    @Test
    void projectMembershipsToProjectIds_empty() {
        Long[] ids = UserMapperService.projectMembershipsToProjectIds(Set.of());

        assertNotNull(ids);
        assertEquals(0, ids.length);
    }

    @Test
    void projectMembershipsToProjectIds_singleMembership() {
        Project project = new Project();
        project.id = 55L;
        User user = new User("testuser");

        Set<ProjectMember> memberships = Set.of(
                new ProjectMember(project, user, ProjectMemberRole.CONTRIBUTOR));

        Long[] ids = UserMapperService.projectMembershipsToProjectIds(memberships);

        assertEquals(1, ids.length);
        assertEquals(55L, ids[0]);
    }

    // --- toDTO tests ---

    @Test
    void toDTO_mapsAllFields() {
        User user = new User("alice");
        user.setId(1L);
        user.setDisplayName("Alice Smith");
        user.setEmail("alice@test.com");

        Project project = new Project();
        project.id = 10L;
        ProjectMember membership = new ProjectMember(project, user, ProjectMemberRole.OWNER);
        user.getProjectMemberships().add(membership);

        UserDTO dto = mapper.toDTO(user);

        assertEquals(1L, dto.id());
        assertEquals("alice", dto.username());
        assertEquals("Alice Smith", dto.displayName());
        assertEquals("alice@test.com", dto.email());
        assertNotNull(dto.projectIds());
        assertEquals(1, dto.projectIds().length);
        assertEquals(10L, dto.projectIds()[0]);
        assertNotNull(dto.createdAt());
    }

    @Test
    void toDTO_noMemberships() {
        User user = new User("bob");
        user.setId(2L);
        user.setDisplayName("Bob");

        UserDTO dto = mapper.toDTO(user);

        assertEquals("bob", dto.username());
        assertNotNull(dto.projectIds());
        assertEquals(0, dto.projectIds().length);
    }

    @Test
    void toDTO_multipleMemberships() {
        User user = new User("charlie");
        user.setId(3L);

        Project p1 = new Project();
        p1.id = 10L;
        Project p2 = new Project();
        p2.id = 20L;

        user.getProjectMemberships().add(new ProjectMember(p1, user, ProjectMemberRole.OWNER));
        user.getProjectMemberships().add(new ProjectMember(p2, user, ProjectMemberRole.CONTRIBUTOR));

        UserDTO dto = mapper.toDTO(user);

        assertEquals(2, dto.projectIds().length);
        Set<Long> idSet = Set.of(dto.projectIds());
        assertTrue(idSet.contains(10L));
        assertTrue(idSet.contains(20L));
    }

    // --- toEntity tests ---

    @Test
    void toEntity_mapsFields() {
        UserDTO dto = new UserDTO(1L, "dave", "Dave Jones", "dave@test.com",
                new Long[] { 10L, 20L }, "2024-01-01T00:00:00Z");

        User user = mapper.toEntity(dto);

        assertEquals(1L, user.getId());
        assertEquals("dave", user.getUsername());
        assertEquals("Dave Jones", user.getDisplayName());
        assertEquals("dave@test.com", user.getEmail());
        // projectMemberships are ignored in toEntity
        assertTrue(user.getProjectMemberships().isEmpty());
    }

    @Test
    void toEntity_handlesNulls() {
        UserDTO dto = new UserDTO(null, "minimal", null, null, null, null);

        User user = mapper.toEntity(dto);

        assertEquals("minimal", user.getUsername());
        assertNull(user.getDisplayName());
        assertNull(user.getEmail());
    }
}
