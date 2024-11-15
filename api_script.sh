#!/bin/bash

# Configuration
BASE_URL_USER_SERVICE="http://localhost:8082"
BASE_URL_BOARD_SERVICE="http://localhost:8081"

# Globals
TOKEN=""
BOARD_ID=""

# Function to check if a user already exists
check_user_exists() {
  local email="$1"
  response=$(curl -s -X GET "$BASE_URL_USER_SERVICE/users?email=$email")
  if [[ $response == *"id"* ]]; then
    echo "User $email already exists."
    return 0
  else
    return 1
  fi
}

# Register a user function
register_user() {
  local username="$1"
  local email="$2"
  local password="$3"

  if check_user_exists "$email"; then
    echo "Skipping registration for $username ($email)."
    return
  fi

  echo "Registering user: $username"
  curl -s -X POST "$BASE_URL_USER_SERVICE/users/register" \
    -H "Content-Type: application/json" \
    -d '{
      "username": "'"$username"'",
      "email": "'"$email"'",
      "password": "'"$password"'",
      "roles": ["USER"]
    }'
  echo -e "\nUser registered successfully."
}

# Login function to get Bearer token
login_user() {
  local email="$1"
  local password="$2"

  echo "Logging in user: $email"
  TOKEN=$(curl -s -X POST "$BASE_URL_USER_SERVICE/users/login" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "'"$email"'",
      "password": "'"$password"'"
    }' | jq -r '.token')

  if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
    echo "Failed to login and retrieve token. Exiting."
    exit 1
  fi

  echo "Token retrieved: $TOKEN"
}

# Function to check if a board already exists
check_board_exists() {
  local board_name="$1"
  response=$(curl -s -X GET "$BASE_URL_BOARD_SERVICE/boards" \
    -H "Authorization: Bearer $TOKEN")

  BOARD_ID=$(echo "$response" | jq -r ".boards[] | select(.name == \"$board_name\") | .id")

  if [ -n "$BOARD_ID" ] && [ "$BOARD_ID" != "null" ]; then
    echo "Board '$board_name' already exists with ID: $BOARD_ID"
    return 0
  else
    return 1
  fi
}

# Function to create a board
create_board() {
  local board_name="$1"
  local description="$2"
  local visibility="$3"

  if check_board_exists "$board_name"; then
    echo "Skipping board creation for '$board_name'. Using existing board ID: $BOARD_ID"
    return
  fi

  echo "Creating board: $board_name"
  BOARD_ID=$(curl -s -X POST "$BASE_URL_BOARD_SERVICE/boards" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
      "name": "'"$board_name"'",
      "description": "'"$description"'",
      "visibility": "'"$visibility"'"
    }' | jq -r '.id')

  if [ -n "$BOARD_ID" ] && [ "$BOARD_ID" != "null" ]; then
    echo "Board created successfully with ID: $BOARD_ID"
  else
    echo "Failed to create board."
    exit 1
  fi
}

# Function to add a collaborator to the board
add_collaborator() {
  local collaborator_id="$1"
  local role="$2"

  echo "Adding collaborator with ID: $collaborator_id"
  response=$(curl -s -X POST "$BASE_URL_BOARD_SERVICE/boards/$BOARD_ID/collaborators" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
      "userId": "'"$collaborator_id"'",
      "role": "'"$role"'"
    }')

  if [[ $response == *"collaborators"* ]]; then
    echo "Collaborator added successfully."
  else
    echo "Failed to add collaborator: $response"
  fi
}

# Main script starts here

# Register the board owner
register_user "board_owner" "board_owner@example.com" "test12345"

# Login the board owner and get the token
login_user "board_owner@example.com" "test12345"

# Create a board with the token
create_board "Project Board" "Board for project management" "public"

# Register the collaborator user
register_user "collaborator_user" "collaborator_user@example.com" "test12345"

# Login the collaborator user to get the user ID (optional, but useful for validation)
login_user "collaborator_user@example.com" "test12345"

# Add the collaborator to the board using the board ID
add_collaborator "97618457-2da5-4543-b1b8-bfff4a86c948" "editor"

echo "All API calls completed successfully."
