package org.acme.service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.acme.model.project.Project;
import org.acme.model.project.ProjectDTO;
import org.acme.model.project.ProjectStatus;
import org.acme.model.project_member.ProjectMember;
import org.acme.model.project_member.ProjectMemberRole;
import org.acme.model.user.User;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
class ProjectMapperServiceTest {

    @Inject
    ProjectMapperService mapper;

    // --- Static helper method tests ---

    @Test
    void projectMembersToMemberIds_withMembers() {
        User user1 = new User("user1");
        user1.setId(10L);
        User user2 = new User("user2");
        user2.setId(20L);
        User user3 = new User("user3");
        user3.setId(30L);

        Project project = new Project();

        Set<ProjectMember> members = new LinkedHashSet<>();
        members.add(new ProjectMember(project, user1, ProjectMemberRole.OWNER));
        members.add(new ProjectMember(project, user2, ProjectMemberRole.CONTRIBUTOR));
        members.add(new ProjectMember(project, user3, ProjectMemberRole.VIEWER));

        Long[] ids = ProjectMapperService.projectMembersToMemberIds(members);

        assertEquals(3, ids.length);
        Set<Long> idSet = Set.of(ids);
        assertTrue(idSet.contains(10L));
        assertTrue(idSet.contains(20L));
        assertTrue(idSet.contains(30L));
    }

    @Test
    void projectMembersToMemberIds_empty() {
        Long[] ids = ProjectMapperService.projectMembersToMemberIds(Set.of());

        assertNotNull(ids);
        assertEquals(0, ids.length);
    }

    @Test
    void projectMembersToMemberIds_singleMember() {
        User user = new User("user1");
        user.setId(42L);
        Project project = new Project();

        Set<ProjectMember> members = Set.of(
                new ProjectMember(project, user, ProjectMemberRole.OWNER));

        Long[] ids = ProjectMapperService.projectMembersToMemberIds(members);

        assertEquals(1, ids.length);
        assertEquals(42L, ids[0]);
    }

    // --- toDTO tests ---

    @Test
    void toDTO_mapsAllFields() {
        User owner = new User("owner");
        owner.setId(5L);

        User member1User = new User("member1");
        member1User.setId(10L);

        Project project = new Project("My Project", "A description", ProjectStatus.ACTIVE, owner);
        project.id = 1L;
        project.setColor("#FF0000");
        project.setCustomStatuses(List.of("review", "blocked"));

        ProjectMember member = new ProjectMember(project, member1User, ProjectMemberRole.CONTRIBUTOR);
        project.getMembers().add(member);

        ProjectDTO dto = mapper.toDTO(project);

        assertEquals(1L, dto.id());
        assertEquals("My Project", dto.name());
        assertEquals("A description", dto.description());
        assertEquals("#FF0000", dto.color());
        assertEquals(ProjectStatus.ACTIVE, dto.status());
        assertEquals(5L, dto.ownerId());
        assertNotNull(dto.memberIds());
        assertEquals(1, dto.memberIds().length);
        assertEquals(10L, dto.memberIds()[0]);
        assertArrayEquals(new String[] { "review", "blocked" }, dto.customStatuses());
    }

    @Test
    void toDTO_archivedProject() {
        User owner = new User("owner");
        owner.setId(1L);

        Project project = new Project("Archived", "Old project", ProjectStatus.ARCHIVED, owner);
        project.id = 2L;

        ProjectDTO dto = mapper.toDTO(project);

        assertEquals(ProjectStatus.ARCHIVED, dto.status());
    }

    @Test
    void toDTO_emptyMembers() {
        User owner = new User("owner");
        owner.setId(1L);

        Project project = new Project("Empty", "No members", ProjectStatus.ACTIVE, owner);
        project.id = 3L;

        ProjectDTO dto = mapper.toDTO(project);

        assertNotNull(dto.memberIds());
        assertEquals(0, dto.memberIds().length);
    }

    @Test
    void toDTO_nullOwner() {
        Project project = new Project();
        project.id = 4L;
        project.setName("Orphan");

        ProjectDTO dto = mapper.toDTO(project);

        assertNull(dto.ownerId());
    }

    // --- toEntity tests ---

    @Test
    void toEntity_mapsFields() {
        ProjectDTO dto = new ProjectDTO(
                1L, "Restored Project", "Desc", "#00FF00",
                ProjectStatus.ACTIVE, 5L,
                new Long[] {}, new String[] { "custom1" },
                "2024-01-01T00:00:00Z");

        Project project = mapper.toEntity(dto);

        assertEquals(1L, project.id);
        assertEquals("Restored Project", project.getName());
        assertEquals("Desc", project.getDescription());
        assertEquals("#00FF00", project.getColor());
        assertEquals(ProjectStatus.ACTIVE, project.getStatus());
        assertEquals(5L, project.getOwner().id);
        // members are ignored in toEntity
        assertTrue(project.getMembers().isEmpty());
    }

    @Test
    void toEntity_handlesNullOwnerId() {
        ProjectDTO dto = new ProjectDTO(
                null, "No Owner", null, null,
                ProjectStatus.ACTIVE, null,
                null, null, null);

        Project project = mapper.toEntity(dto);

        assertEquals("No Owner", project.getName());
        // MapStruct creates the intermediate User object even when ownerId is null
        assertNull(project.getOwner().getId());
    }
}
