# ================================
# Build Stage
# ================================
FROM node:20-alpine AS build

# Set working directory
WORKDIR /build

# Install Azure Functions Core Tools dependencies
RUN apk add --no-cache \
    ca-certificates \
    wget \
    unzip

# Copy package files for dependency installation
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY src ./src

# Build TypeScript code
RUN npm run build

# ================================
# Production Stage
# ================================
FROM mcr.microsoft.com/azure-functions/node:4-node20 AS production

# Set working directory to Azure Functions default
ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

WORKDIR /home/site/wwwroot

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built artifacts from build stage
COPY --from=build /build/dist ./dist
COPY host.json ./

# Expose Azure Functions default port
EXPOSE 7071

# Azure Functions runtime will start the host automatically
