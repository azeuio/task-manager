package org.acme.user;

import java.util.Set;

import org.eclipse.microprofile.jwt.JsonWebToken;

import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
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

    @GET
    @Path("/me")
    @Transactional
    public User getCurrentUser() {
        String username = securityIdentity.getPrincipal().getName();
        User user = User.findOrCreateUser(username);
        Set<String> claims = jwt.getClaimNames();
        if (claims.contains("email")) {
            String email = jwt.getClaim("email");
            user.setEmail(email);
        }
        if (claims.contains("preferred_username")) {
            String displayName = jwt.getClaim("preferred_username");
            user.setDisplayName(displayName);
        }

        return user;
    }
}
