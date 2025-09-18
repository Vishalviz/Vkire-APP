# Multi-stage build for production optimization
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Development stage
FROM base AS dev
WORKDIR /app

# Install development dependencies
RUN apk add --no-cache git python3 make g++

# Install Expo CLI globally
RUN npm install -g @expo/cli

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY . .

# Expose ports
EXPOSE 8081 19000 19001 19002

# Start in development mode
CMD ["npx", "expo", "start", "--tunnel", "--host", "0.0.0.0"]

# Build stage
FROM base AS builder
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git python3 make g++

# Install Expo CLI
RUN npm install -g @expo/cli

# Copy package files
COPY package*.json ./
RUN npm ci

# Install web dependencies for Expo
RUN npx expo install react-dom react-native-web

# Copy source code
COPY . .

# Build the app
RUN npx expo export --platform web

# Production stage
FROM nginx:alpine AS production
WORKDIR /usr/share/nginx/html

# Copy built files from builder stage
COPY --from=builder /app/dist .

# Copy nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
