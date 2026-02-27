package org.acme.service;

import java.util.List;
import java.util.Set;

import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import org.acme.model.project.Project;
import org.acme.model.project.ProjectStatus;
import org.acme.model.project_member.ProjectMember;
import org.acme.model.project_member.ProjectMemberRole;
import org.acme.model.task.Task;
import org.acme.model.user.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestSecurity(user = "testuser", roles = { "user" })
class ProjectServiceTest {

    @Inject
    ProjectService projectService;

    private User owner;
    private User member;
    private Project project1;
    private Project project2;

    @BeforeEach
    @Transactional
    void setUp() {
        owner = new User("owner");
        owner.setDisplayName("Owner");
        owner.setEmail("owner@test.com");
        owner.persist();

        member = new User("member");
        member.setDisplayName("Member");
        member.setEmail("member@test.com");
        member.persist();

        project1 = new Project("Project One", "First project", ProjectStatus.ACTIVE, owner);
        project1.persist();

        project2 = new Project("Project Two", "Second project", ProjectStatus.ACTIVE, owner);
        project2.persist();

        // owner is a member of both projects
        ProjectMember ownerMembership1 = new ProjectMember(project1, owner, ProjectMemberRole.OWNER);
        ownerMembership1.persist();
        project1.addMember(ownerMembership1);

        ProjectMember ownerMembership2 = new ProjectMember(project2, owner, ProjectMemberRole.OWNER);
        ownerMembership2.persist();
        project2.addMember(ownerMembership2);

        // member is only in project1
        ProjectMember memberMembership = new ProjectMember(project1, member, ProjectMemberRole.CONTRIBUTOR);
        memberMembership.persist();
        project1.addMember(memberMembership);
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
    void findByOwnerId_returnsOwnedProjects() {
        List<Project> projects = projectService.findByOwnerId(owner.id);

        assertEquals(2, projects.size());
    }

    @Test
    void findByOwnerId_returnsEmptyForNonOwner() {
        List<Project> projects = projectService.findByOwnerId(member.id);

        assertTrue(projects.isEmpty());
    }

    @Test
    void findByMemberUserId_returnsMemberships() {
        List<ProjectMember> memberships = projectService.findByMemberUserId(owner.id);

        assertEquals(2, memberships.size());
    }

    @Test
    void findByMemberUserId_returnsSingleMembership() {
        List<ProjectMember> memberships = projectService.findByMemberUserId(member.id);

        assertEquals(1, memberships.size());
        assertEquals(ProjectMemberRole.CONTRIBUTOR, memberships.get(0).getRole());
    }

    @Test
    void findByMemberUserId_returnsEmptyForUnknownUser() {
        List<ProjectMember> memberships = projectService.findByMemberUserId(9999L);

        assertTrue(memberships.isEmpty());
    }

    @Test
    void getUsersByProjectId_returnsAllMembers() {
        Set<User> users = projectService.getUsersByProjectId(project1.id);

        assertEquals(2, users.size());
        Set<String> usernames = Set.of(
                users.stream().map(User::getUsername).toArray(String[]::new));
        assertTrue(usernames.contains("owner"));
        assertTrue(usernames.contains("member"));
    }

    @Test
    void getUsersByProjectId_returnsSingleMember() {
        Set<User> users = projectService.getUsersByProjectId(project2.id);

        assertEquals(1, users.size());
        assertEquals("owner", users.iterator().next().getUsername());
    }

    @Test
    void getProjectsByUserId_returnsMemberProjects() {
        Set<Project> projects = projectService.getProjectsByUserId(owner.id);

        assertEquals(2, projects.size());
    }

    @Test
    void getProjectsByUserId_returnsSingleProject() {
        Set<Project> projects = projectService.getProjectsByUserId(member.id);

        assertEquals(1, projects.size());
        assertEquals("Project One", projects.iterator().next().getName());
    }

    @Test
    void getProjectsByUserId_returnsEmptyForUnknownUser() {
        Set<Project> projects = projectService.getProjectsByUserId(9999L);

        assertTrue(projects.isEmpty());
    }
}
