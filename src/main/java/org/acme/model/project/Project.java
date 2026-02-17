package org.acme.model.project;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.acme.model.project_member.ProjectMember;
import org.acme.model.project_member.ProjectMemberRole;
import org.acme.model.user.User;
import org.hibernate.annotations.CreationTimestamp;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "projects")
public class Project extends PanacheEntity {
    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private String color;

    @Column
    private ProjectStatus status = ProjectStatus.ACTIVE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = true, updatable = false)
    private User owner;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProjectMember> members = new HashSet<>();

    private List<String> customStatuses;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    // Constructors
    public Project() {
    }

    public Project(String name, String description, ProjectStatus status, User owner) {
        this.name = name;
        this.description = description;
        this.status = status;
        this.owner = owner;
    }

    // Getters and setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public Set<ProjectMember> getMembers() {
        return members;
    }

    public void setMembers(Set<ProjectMember> members) {
        this.members = members;
    }

    public List<String> getCustomStatuses() {
        return customStatuses;
    }

    public void setCustomStatuses(List<String> customStatuses) {
        this.customStatuses = customStatuses;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    // Helper methods
    public void addMember(ProjectMember member) {
        members.add(member);
        member.setProject(this);
    }

    public void removeMember(ProjectMember member) {
        members.remove(member);
        member.setProject(null);
    }

    // public static List<Project> findByOwnerId(Long ownerId) {
    // return list("owner.id", ownerId);
    // }

    // public static List<Project> findByMemberUserId(Long userId) {
    // return list("select m.project from ProjectMember m where m.user.id = ?1",
    // userId);
    // }
}
