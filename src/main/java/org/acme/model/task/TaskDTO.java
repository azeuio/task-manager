package org.acme.model.task;

import java.time.Instant;

public record TaskDTO(
        Long id,
        String title,
        String description,
        Integer status,
        Integer priority,
        long projectId,
        Instant dueDate,
        Integer createdById,
        Integer assignedToId,
        Instant createdAt,
        Instant updatedAt) {
}
