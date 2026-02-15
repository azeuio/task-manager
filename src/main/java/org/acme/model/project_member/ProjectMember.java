package org.acme.model.project_member;

import jakarta.persistence.*;
import java.time.Instant;

import org.acme.model.project.Project;
import org.acme.model.user.User;

@Entity
@Table(name = "project_members")
public class ProjectMember {

    @EmbeddedId
    private ProjectMemberId id = new ProjectMemberId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("projectId")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    private User user;

    @Column
    private String role; // project-specific role

    @Column(name = "joined_at")
    private Instant joinedAt = Instant.now();

    // Constructors
    public ProjectMember() {
    }

    public ProjectMember(Project project, User user, String role) {
        this.project = project;
        this.user = user;
        this.role = role;
        this.id = new ProjectMemberId(project.id, user.id);
    }

    // Getters and Setters
    public ProjectMemberId getId() {
        return id;
    }

    public void setId(ProjectMemberId id) {
        this.id = id;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Instant getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(Instant joinedAt) {
        this.joinedAt = joinedAt;
    }
}
