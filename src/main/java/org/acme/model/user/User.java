package org.acme.model.user;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import org.acme.model.project_member.ProjectMember;
import org.acme.model.user_stats.UserStats;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.hibernate.annotations.CreationTimestamp;

import io.quarkus.hibernate.orm.panache.PanacheEntity;

@Entity
@Table(name = "users")
public class User extends PanacheEntity {
    // @Column(name = "keycloak_id", nullable = false, unique = true)
    // private String keycloakId;

    // @Id
    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = true)
    private String display_name;

    @Column(nullable = true, unique = true)
    private String email;

    // @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    // private UserStats stats;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProjectMember> projectMemberships = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    // Constructors
    public User() {
    }

    public User(String username) {
        this.username = username;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDisplayName() {
        return display_name;
    }

    public void setDisplayName(String display_name) {
        this.display_name = display_name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Set<ProjectMember> getProjectMemberships() {
        return projectMemberships;
    }

    public void setProjectMemberships(Set<ProjectMember> projectMemberships) {
        this.projectMemberships = projectMemberships;
    }
}
