package org.acme.model.project;

import java.util.List;

import org.acme.model.project_member.ProjectMember;
import org.acme.model.project_member.ProjectMemberRole;
import org.acme.model.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ProjectTest {

    private Project project;
    private User user;

    @BeforeEach
    void setUp() {
        project = new Project();
        project.setName("Test Project");
        user = new User("testuser");
    }

    @Test
    void defaultStatus_isActive() {
        Project p = new Project();
        assertEquals(ProjectStatus.ACTIVE, p.getStatus());
    }

    @Test
    void constructor_parameterized() {
        User owner = new User("owner");
        Project p = new Project("My Project", "A description", ProjectStatus.ARCHIVED, owner);
        assertEquals("My Project", p.getName());
        assertEquals("A description", p.getDescription());
        assertEquals(ProjectStatus.ARCHIVED, p.getStatus());
        assertEquals(owner, p.getOwner());
    }

    @Test
    void constructor_default() {
        Project p = new Project();
        assertNull(p.getName());
        assertNull(p.getDescription());
        assertEquals(ProjectStatus.ACTIVE, p.getStatus());
        assertNull(p.getOwner());
        assertNotNull(p.getMembers());
        assertTrue(p.getMembers().isEmpty());
    }

    @Test
    void addMember() {
        ProjectMember member = new ProjectMember(null, user, ProjectMemberRole.CONTRIBUTOR);

        project.addMember(member);

        assertTrue(project.getMembers().contains(member));
        assertEquals(project, member.getProject());
    }

    @Test
    void addMember_multipleMembers() {
        User user2 = new User("user2");
        ProjectMember member1 = new ProjectMember(null, user, ProjectMemberRole.OWNER);
        ProjectMember member2 = new ProjectMember(null, user2, ProjectMemberRole.VIEWER);

        project.addMember(member1);
        project.addMember(member2);

        assertEquals(2, project.getMembers().size());
        assertTrue(project.getMembers().contains(member1));
        assertTrue(project.getMembers().contains(member2));
    }

    @Test
    void removeMember() {
        ProjectMember member = new ProjectMember(null, user, ProjectMemberRole.CONTRIBUTOR);
        project.addMember(member);

        project.removeMember(member);

        assertFalse(project.getMembers().contains(member));
        assertNull(member.getProject());
    }

    @Test
    void removeMember_leavesOtherMembers() {
        User user2 = new User("user2");
        ProjectMember member1 = new ProjectMember(null, user, ProjectMemberRole.OWNER);
        ProjectMember member2 = new ProjectMember(null, user2, ProjectMemberRole.VIEWER);

        project.addMember(member1);
        project.addMember(member2);
        project.removeMember(member1);

        assertEquals(1, project.getMembers().size());
        assertTrue(project.getMembers().contains(member2));
    }

    @Test
    void settersAndGetters() {
        project.setName("Updated Name");
        project.setDescription("Updated Description");
        project.setColor("#FF0000");
        project.setStatus(ProjectStatus.ARCHIVED);

        assertEquals("Updated Name", project.getName());
        assertEquals("Updated Description", project.getDescription());
        assertEquals("#FF0000", project.getColor());
        assertEquals(ProjectStatus.ARCHIVED, project.getStatus());
    }

    @Test
    void customStatuses() {
        assertNull(project.getCustomStatuses());

        project.setCustomStatuses(List.of("review", "blocked"));
        assertEquals(2, project.getCustomStatuses().size());
        assertEquals("review", project.getCustomStatuses().get(0));
        assertEquals("blocked", project.getCustomStatuses().get(1));
    }

    @Test
    void owner() {
        assertNull(project.getOwner());

        User owner = new User("owner");
        project.setOwner(owner);
        assertEquals(owner, project.getOwner());
    }

    @Test
    void createdAt_defaultNotNull() {
        assertNotNull(project.getCreatedAt());
    }
}
