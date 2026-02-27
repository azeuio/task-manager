package org.acme.service;

import java.util.LinkedHashSet;
import java.util.Set;

import org.acme.model.project.Project;
import org.acme.model.project_member.ProjectMember;
import org.acme.model.project_member.ProjectMemberRole;
import org.acme.model.user.User;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserMapperServiceTest {

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
}
