package org.acme.service;

import org.acme.model.user.User;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.UserRepresentation;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class UserService {
    @Inject
    Keycloak keycloak;

    public UserRepresentation getUserByUsername(String username) {
        return keycloak.realm("task-manager").users().search(username).stream()
                .filter(user -> user.getUsername().equals(username))
                .findFirst()
                .orElse(null);
    }

    public User findUser(String keycloakUsername) {
        User user = User.find("username", keycloakUsername).firstResult();
        if (user == null) {
            UserRepresentation kcUser = getUserByUsername(keycloakUsername);
            if (kcUser != null) {
                user = new User(keycloakUsername);
                user.setDisplayName(kcUser.getFirstName() + " " + kcUser.getLastName());
                user.setEmail(kcUser.getEmail());
                user.persist();
            }
        }
        return user;
    }
}
