package org.acme.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.acme.model.project.Project;
import org.acme.model.project_member.ProjectMember;
import org.acme.model.user.User;

import io.quarkus.panache.common.Parameters;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ProjectService {
    public List<Project> findByOwnerId(Long ownerId) {
        return Project.list("owner.id", ownerId);
    }

    public List<ProjectMember> findByMemberUserId(Long userId) {
        return ProjectMember.list("select m from ProjectMember m where m.user.id = ?1", userId);
    }

    public List<Project> findAll() {
        return Project.listAll();
    }

    public boolean isUserProjectMember(Long projectId, Long userId) {
        return ProjectMember.count("project.id = ?1 and user.id = ?2", projectId, userId) > 0;
    }

    public Set<User> getUsersByProjectId(Long projectId) {
        return User.find(
                "SELECT DISTINCT u FROM User u JOIN ProjectMember pm ON pm.user.id = u.id WHERE pm.project.id = :projectId",
                Parameters.with("projectId", projectId))
                .stream()
                .map(user -> (User) user)
                .collect(Collectors.toSet());
    }

    public Set<Project> getProjectsByUserId(Long userId) {
        return Project.find(
                "SELECT DISTINCT p FROM Project p JOIN ProjectMember pm ON pm.project.id = p.id WHERE pm.user.id = :userId",
                Parameters.with("userId", userId))
                .stream()
                .map(project -> (Project) project)
                .collect(Collectors.toSet());
    }
}
