package org.acme.model.project;

public record ProjectDTO(
        Long id,
        String name,
        String description,
        String color,
        ProjectStatus status,
        Long ownerId,
        Long[] memberIds,
        String[] customStatuses,
        String createdAt) {
}
