#!/bin/bash

let global_counter=0
function waiting_for() {
  local service_name=$1
  local success_message=$2
  local timeout=$3
  echo -n "Waiting for ${service_name} to be ready"
  let counter=0
  until docker inspect -f '{{.State.Health.Status}}' ${service_name} | grep "healthy" > /dev/null 2>&1; do
    if [ $(($counter % 3)) -eq 0 ]; then
      echo -ne "\033[1K\r"
      echo -n "Waiting for ${service_name} to be ready"
    fi
    if [ $counter -ge $timeout ]; then
      echo -ne "\033[1K\r"
      echo "${service_name} is not ready after ${timeout} seconds. Exiting."
      docker compose down
      exit 1
    fi
    echo -n "."
    sleep 1
    let counter=counter+1
  done
  echo -ne "\033[1K\r"
  let global_counter=global_counter+counter
  echo "[${global_counter}s] ${success_message}"
}

echo "Starting the application..."
docker compose up -d
waiting_for quarkus-postgres "Database is ready!" 120
waiting_for keycloak "Keycloak is ready!" 120
echo "Running the application in development mode..."
./mvnw quarkus:dev && \
echo "Cleaning up..." && \
docker compose down