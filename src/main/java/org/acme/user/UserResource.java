package org.acme.user;

import java.util.Set;

import org.eclipse.microprofile.jwt.JsonWebToken;

import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/api/v1/users")
@Authenticated
@Produces(MediaType.APPLICATION_JSON)
public class UserResource {

    @Inject
    SecurityIdentity securityIdentity;

    @Inject
    JsonWebToken jwt;

    @Inject
    UserMapper userMapper;

    @GET
    @Path("/me")
    @Transactional
    public UserDTO getCurrentUser() {
        String username = securityIdentity.getPrincipal().getName();
        User user = User.findOrCreateUser(username, jwt);

        return userMapper.toDTO(user);
    }

    @GET
    @Path("/count")
    @RolesAllowed("admin")
    public long getUserCount() {
        return User.count();
    }
}
