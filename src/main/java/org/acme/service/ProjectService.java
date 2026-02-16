package org.acme.service;

import java.util.List;

import org.acme.model.project.Project;
import org.acme.model.project_member.ProjectMember;

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
}
