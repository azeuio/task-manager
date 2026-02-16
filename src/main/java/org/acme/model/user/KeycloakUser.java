package org.acme.model.user;

public record KeycloakUser(
        String id,
        String username,
        String email,
        String displayName) {
}
