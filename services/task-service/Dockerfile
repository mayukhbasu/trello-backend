# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy all files to the container
COPY . .

# Expose the port (modify per service)
EXPOSE 4002  

# Command to run the service
CMD ["npm", "start"]
