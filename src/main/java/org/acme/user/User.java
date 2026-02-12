package org.acme.user;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import org.acme.user_stats.UserStats;
import org.acme.project_member.ProjectMember;

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

    // @ElementCollection(fetch = FetchType.EAGER)
    // @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    // @Column(name = "role")
    // private Set<String> roles = new HashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private UserStats stats;

    // @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    // private Set<Project> ownedProjects = new HashSet<>();

    // @OneToMany(mappedBy = "assignedTo", cascade = CascadeType.ALL, orphanRemoval = true)
    // private Set<Task> assignedTasks = new HashSet<>();

    // @OneToMany(mappedBy = "createdBy", cascade = CascadeType.ALL, orphanRemoval = true)
    // private Set<Task> createdTasks = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProjectMember> projectMemberships = new HashSet<>();

    // Constructors
    public User() {}

    public User(String username) {
        this.username = username;
    }

    // Getters and Setters
    // public Long getId() { return id; }
    // public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getDisplayName() { return display_name; }
    public void setDisplayName(String display_name) { this.display_name = display_name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    // public Set<String> getRoles() { return roles; }
    // public void setRoles(Set<String> roles) { this.roles = roles; }
    public Instant getCreatedAt() { return createdAt; }
    public UserStats getStats() { return stats; }
    public void setStats(UserStats stats) { this.stats = stats; }
    // public Set<Project> getOwnedProjects() { return ownedProjects; }
    // public void setOwnedProjects(Set<Project> ownedProjects) { this.ownedProjects = ownedProjects; }
    // public Set<Task> getAssignedTasks() { return assignedTasks; }
    // public void setAssignedTasks(Set<Task> assignedTasks) { this.assignedTasks = assignedTasks; }
    // public Set<Task> getCreatedTasks() { return createdTasks; }
    // public void setCreatedTasks(Set<Task> createdTasks) { this.createdTasks = createdTasks; }
    public Set<ProjectMember> getProjectMemberships() { return projectMemberships; }
    public void setProjectMemberships(Set<ProjectMember> projectMemberships) { this.projectMemberships = projectMemberships; }


    // public static User getUserFromUsername(String username) {
    //     return find("username", username).firstResult();
    // }

    // public String getEmail() {
    //     // from Keycloak
    //     return username + "@example.com";
    // }

    public static User findByUsername(String username) {
        return find("username", username).firstResult();
    }

    public static User findOrCreateUser(String keycloakId) {
        User user = findByUsername(keycloakId);
        if (user == null) {
            user = new User(keycloakId);
            persist(user);
        }
        return user;
    }
}
