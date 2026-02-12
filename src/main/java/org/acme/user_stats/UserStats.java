package org.acme.user_stats;

import jakarta.persistence.*;
import java.time.Instant;

import org.acme.user.User;

@Entity
@Table(name = "user_stats")
public class UserStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "tasks_completed", nullable = false)
    private int tasksCompleted = 0;

    @Column(name = "tasks_created", nullable = false)
    private int tasksCreated = 0;

    @Column(name = "last_active_at")
    private Instant lastActiveAt;

    // Constructors
    public UserStats() {}

    public UserStats(User user) {
        this.user = user;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public int getTasksCompleted() { return tasksCompleted; }
    public void setTasksCompleted(int tasksCompleted) { this.tasksCompleted = tasksCompleted; }
    public int getTasksCreated() { return tasksCreated; }
    public void setTasksCreated(int tasksCreated) { this.tasksCreated = tasksCreated; }
    public Instant getLastActiveAt() { return lastActiveAt; }
    public void setLastActiveAt(Instant lastActiveAt) { this.lastActiveAt = lastActiveAt; }
}
