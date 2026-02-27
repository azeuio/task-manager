package org.acme.service;

import java.util.LinkedHashSet;
import java.util.Set;

import org.acme.model.project.Project;
import org.acme.model.project_member.ProjectMember;
import org.acme.model.project_member.ProjectMemberRole;
import org.acme.model.user.User;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ProjectMapperServiceTest {

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
}
