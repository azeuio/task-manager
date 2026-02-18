package org.acme.resource;

import org.acme.model.user.User;
import org.acme.model.user.UserDTO;
import org.acme.service.UserMapperService;
import org.acme.service.UserService;
import org.eclipse.microprofile.jwt.JsonWebToken;

import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
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
    UserMapperService userMapper;

    @Inject
    UserService userService;

    @GET
    @Path("/me")
    @Transactional
    public UserDTO getCurrentUser() {
        String username = securityIdentity.getPrincipal().getName();
        User user = userService.findUser(username);

        return userMapper.toDTO(user);
    }

    @GET
    @Path("/count")
    @RolesAllowed("admin")
    public long getUserCount() {
        return User.count();
    }

    @GET
    @Path("/{id}")
    public UserDTO getUserById(@PathParam("id") Long id) {
        User user = User.findById(id);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        return userMapper.toDTO(user);
    }
}
