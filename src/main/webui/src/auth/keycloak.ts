import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "http://localhost:8443",
    realm: "task-manager",
    clientId: "frontend"
});

export default keycloak;
