package org.acme.model.project_member;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.List;

import org.acme.model.project.Project;
import org.acme.model.user.User;

import io.quarkus.hibernate.orm.panache.PanacheEntity;

@Entity
@Table(name = "project_members", uniqueConstraints = @UniqueConstraint(columnNames = { "project_id", "user_id" }))
public class ProjectMember extends PanacheEntity {

    @ManyToOne(optional = false)
    private Project project;

    @ManyToOne(optional = false)
    private User user;

    @Column
    private ProjectMemberRole role; // project-specific role

    @Column(name = "joined_at", updatable = false)
    private Instant joinedAt = Instant.now();

    // Constructors
    public ProjectMember() {
    }

    public ProjectMember(Project project, User user, ProjectMemberRole role) {
        this.project = project;
        this.user = user;
        this.role = role;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ProjectMemberRole getRole() {
        return role;
    }

    public void setRole(ProjectMemberRole role) {
        this.role = role;
    }

    public Instant getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(Instant joinedAt) {
        this.joinedAt = joinedAt;
    }

    // Static query methods
    public static List<ProjectMember> findByUserId(Long userId) {
        return list("user.id", userId);
    }

    public static List<ProjectMember> findByProjectId(Long projectId) {
        return list("project.id", projectId);
    }

    public static ProjectMember findByProjectIdAndUserId(Long projectId, Long userId) {
        return find("project.id = ?1 and user.id = ?2", projectId, userId).firstResult();
    }
}
