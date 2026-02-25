package org.acme.model.projects_stats;

import java.time.Instant;

public record ProjectsStatsDTO(
        long projectId,
        String projectName,
        Instant from,
        Instant to,
        long totalTasks,
        long tasksCreated,
        long completedTasks,
        long overdueTasks,
        long totalMembers,
        long membersJoined) {
}
