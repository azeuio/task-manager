let global_counter=0
function waiting_for_db() {
  echo -n "Waiting for the database to be ready"
  let timeout=120
  let counter=0
  until docker inspect -f '{{.State.Health.Status}}' quarkus-postgres | grep "healthy" > /dev/null 2>&1; do
    if [ $(($counter % 3)) -eq 0 ]; then
      echo -ne "\033[1K\r"
      echo -n "Waiting for the database to be ready"
    fi
    if [ $counter -ge $timeout ]; then
      echo -ne "\033[1K\r"
      echo "Database is not ready after 2 minutes. Exiting."
      docker compose down
      exit 1
    fi
    echo -n "."
    sleep 1
    let counter=counter+1
  done
  echo -ne "\033[1K\r"
  let global_counter=global_counter+counter
  echo "[${global_counter}s] Database is ready!"
}

function waiting_for_keycloak() {
  echo -n "Waiting for the keycloak to be ready"
  let timeout=120
  let counter=0
  until docker inspect -f '{{.State.Health.Status}}' keycloak | grep "healthy" > /dev/null 2>&1; do
    if [ $(($counter % 3)) -eq 0 ]; then
      echo -ne "\033[1K\r"
      echo -n "Waiting for the keycloak to be ready"
    fi
    if [ $counter -ge $timeout ]; then
      echo -ne "\033[1K\r"
      echo "Keycloak is not ready after 2 minutes. Exiting."
      docker compose down
      exit 1
    fi
    echo -n "."
    sleep 1
    let counter=counter+1
  done
  echo -ne "\033[1K\r"
  let global_counter=global_counter+counter
  echo "[${global_counter}s] Keycloak is ready!"
}

echo "Starting the application..."
docker compose up -d
waiting_for_db
waiting_for_keycloak
echo "Keycloak is ready!"
echo "Running the application in development mode..."
./mvnw quarkus:dev && \
echo "Cleaning up..." && \
docker compose down