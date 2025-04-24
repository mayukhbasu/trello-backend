# Stage 1: Build
FROM node:20-slim as builder

WORKDIR /app

# Install all deps including NestJS CLI
COPY package*.json ./
RUN npm install && npm install -g @nestjs/cli

COPY . .
RUN nest build

# Stage 2: Run
FROM node:20-slim

WORKDIR /app

# Only install production deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy built app from builder
COPY --from=builder /app/dist ./dist

# Set up application
EXPOSE 8080
CMD ["node", "dist/main.js"]
