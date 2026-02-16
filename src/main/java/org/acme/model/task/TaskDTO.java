package org.acme.model.task;

import java.time.Instant;

public record TaskDTO(
        Long id,
        String title,
        String description,
        int status,
        int priority,
        long projectId,
        Instant dueDate,
        int createdById,
        int assignedToId,
        Instant createdAt,
        Instant updatedAt) {
}
