import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "http://localhost:8081",
    realm: "task-manager",
    clientId: "frontend"
});

export default keycloak;
