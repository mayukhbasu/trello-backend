# Use Node.js base image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy the root package.json, lerna.json, and yarn.lock (if applicable)
COPY package.json lerna.json yarn.lock ./

# Copy all packages (including shared-lib and user-service)
COPY packages ./packages

# Install dependencies using npm workspaces
RUN npm install

# Set working directory to user-service
WORKDIR /app/packages/user-service

# Build the user-service application
RUN npm run build

# Expose the port
EXPOSE 3000

# Run the application
CMD ["node", "dist/main"]
