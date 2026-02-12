package org.acme.project;

public record ProjectDTO(
        Long id,
        String name,
        String description,
        String status,
        Long ownerId) {
}
