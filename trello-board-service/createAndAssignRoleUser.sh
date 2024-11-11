#!/bin/bash

# Base URL for the API
BASE_URL="http://localhost:8080/api"

# Array to store generated user IDs
user_ids=()

# Create additional users
echo "Creating 5 additional users..."

for i in {3..7}; do
  # Create user and capture the response containing the ID
  response=$(curl -s -X POST "$BASE_URL/users" \
    -H "Content-Type: application/json" \
    -d "{
      \"username\": \"user_$i\",
      \"email\": \"user_$i@example.com\",
      \"password\": \"securepassword$i\"
    }")

  # Extract the ID from the response
  user_id=$(echo $response | jq -r '.id')

  # Check if ID was retrieved successfully
  if [ "$user_id" != "null" ]; then
    echo "Created user_$i with ID: $user_id"
    user_ids+=("$user_id") # Store ID in the array
  else
    echo "Failed to create user_$i"
  fi
done

# Assign roles to users in an alternating pattern
echo "Assigning roles to users..."

for index in "${!user_ids[@]}"; do
  user_id=${user_ids[$index]}

  # Assign ADMIN role for odd index, USER role for even index
  if (( index % 2 == 0 )); then
    ROLE_ID=1  # ADMIN role
  else
    ROLE_ID=2  # USER role
  fi

  # Assign role to user
  curl -s -X POST "$BASE_URL/users/assign/$user_id/$ROLE_ID"
  echo "Assigned role ID $ROLE_ID to user with ID: $user_id"
done

echo "All users created and roles assigned."
