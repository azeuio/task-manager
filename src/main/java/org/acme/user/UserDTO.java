package org.acme.user;

public record UserDTO(
        Long id,
        String username,
        String displayName,
        String email) {

}
