#!/bin/bash

# Variables
APP_NAME="Singnify 2.0" # Change to your PM2 app name
APP_DIR="/var/app/singnify" # Update to the directory of your Next.js project
START_SCRIPT="npm run start" # Command to start your Next.js app

# Navigate to the application directory
cd "$APP_DIR" || { echo "Directory $APP_DIR not found. Exiting."; exit 1; }

# Stop any existing PM2 process with the same app name
echo "Stopping any existing PM2 process for $APP_NAME..."
pm2 stop "$APP_NAME" > /dev/null 2>&1 || echo "No existing process found for $APP_NAME."

# Delete the PM2 process (optional, ensures a fresh start)
echo "Deleting existing PM2 process for $APP_NAME..."
pm2 delete "$APP_NAME" > /dev/null 2>&1 || echo "No process to delete for $APP_NAME."

# Start a new PM2 process
echo "Starting a new PM2 process for $APP_NAME..."
pm2 start "$START_SCRIPT" --name "$APP_NAME"

# Save the PM2 process list
echo "Saving the PM2 process list..."
pm2 save

# Display PM2 status
pm2 status

echo "Singnify v2.0 app has been restarted successfully in PM2."
