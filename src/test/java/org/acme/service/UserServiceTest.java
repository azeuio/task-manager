package org.acme.service;

import java.util.List;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import org.acme.model.user.User;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@QuarkusTest
@TestSecurity(user = "testuser", roles = { "user" })
class UserServiceTest {

    @Inject
    UserService userService;

    @InjectMock
    Keycloak keycloak;

    private RealmResource realmResource;
    private UsersResource usersResource;

    @BeforeEach
    void setUpMocks() {
        realmResource = mock(RealmResource.class);
        usersResource = mock(UsersResource.class);
        when(keycloak.realm("task-manager")).thenReturn(realmResource);
        when(realmResource.users()).thenReturn(usersResource);
    }

    @AfterEach
    @Transactional
    void tearDown() {
        User.deleteAll();
    }

    @Test
    void getUserByUsername_found() {
        UserRepresentation kcUser = new UserRepresentation();
        kcUser.setUsername("alice");
        kcUser.setEmail("alice@test.com");
        kcUser.setFirstName("Alice");
        kcUser.setLastName("Smith");

        when(usersResource.search("alice")).thenReturn(List.of(kcUser));

        UserRepresentation result = userService.getUserByUsername("alice");

        assertNotNull(result);
        assertEquals("alice", result.getUsername());
        assertEquals("alice@test.com", result.getEmail());
    }

    @Test
    void getUserByUsername_notFound() {
        when(usersResource.search("nonexistent")).thenReturn(List.of());

        UserRepresentation result = userService.getUserByUsername("nonexistent");

        assertNull(result);
    }

    @Test
    void getUserByUsername_filtersExactMatch() {
        UserRepresentation kcUser1 = new UserRepresentation();
        kcUser1.setUsername("bob");

        UserRepresentation kcUser2 = new UserRepresentation();
        kcUser2.setUsername("bobby");

        when(usersResource.search("bob")).thenReturn(List.of(kcUser1, kcUser2));

        UserRepresentation result = userService.getUserByUsername("bob");

        assertNotNull(result);
        assertEquals("bob", result.getUsername());
    }

    @Test
    @Transactional
    void findUser_existingUser() {
        User existing = new User("existinguser");
        existing.setDisplayName("Existing");
        existing.setEmail("existing@test.com");
        existing.persist();

        User result = userService.findUser("existinguser");

        assertNotNull(result);
        assertEquals("existinguser", result.getUsername());
        assertEquals("Existing", result.getDisplayName());
        // Keycloak should not be called for existing users
        verifyNoInteractions(keycloak);
    }

    @Test
    @Transactional
    void findUser_newUserFromKeycloak() {
        UserRepresentation kcUser = new UserRepresentation();
        kcUser.setUsername("newuser");
        kcUser.setEmail("new@test.com");
        kcUser.setFirstName("New");
        kcUser.setLastName("User");

        when(usersResource.search("newuser")).thenReturn(List.of(kcUser));

        User result = userService.findUser("newuser");

        assertNotNull(result);
        assertEquals("newuser", result.getUsername());
        assertEquals("New User", result.getDisplayName());
        assertEquals("new@test.com", result.getEmail());
        assertNotNull(result.id);
    }

    @Test
    @Transactional
    void findUser_unknownUser() {
        when(usersResource.search("ghost")).thenReturn(List.of());

        User result = userService.findUser("ghost");

        assertNull(result);
    }
}
