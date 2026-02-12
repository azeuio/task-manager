package org.acme.task;

import java.time.Instant;

public record TaskDTO(
        Long id,
        String title,
        String description,
        int status,
        int priority,
        long projectId,
        Instant dueDate) {
}
