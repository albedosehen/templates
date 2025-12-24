# Builder stage - compile TypeScript and prepare artifacts
FROM node:24.12.0-alpine AS builder

# Install necessary build tools
RUN apk upgrade --no-cache && \
    apk add --no-cache \
    ca-certificates \
    wget \
    unzip

# Set working directory
WORKDIR /build

# Copy package files for dependency installation
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --no-audit --no-fund

# Copy source code
COPY src ./src

# Build the application
RUN npm run build

# Remove dev dependencies to reduce size
RUN npm prune --production


# Production stage - Azure Functions runtime with non-root user
FROM mcr.microsoft.com/azure-functions/node:4-node24 AS production

# Set Azure Functions environment variables
ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true \
    NODE_ENV=production

# Set working directory (Azure Functions convention)
WORKDIR /home/site/wwwroot

# Create non-root user for Azure Functions
# Using UID/GID that doesn't conflict with common Azure services
RUN groupadd -g 1001 appuser && \
    useradd -r -u 1001 -g appuser appuser

# Copy package files
COPY --chown=appuser:appuser package*.json ./

# Copy production dependencies from builder
COPY --chown=appuser:appuser --from=builder /build/node_modules ./node_modules

# Copy built application from builder
COPY --chown=appuser:appuser --from=builder /build/dist ./dist

# Copy Azure Functions configuration
COPY --chown=appuser:appuser host.json ./

# Ensure the appuser has proper permissions on the working directory
RUN chown -R appuser:appuser /home/site/wwwroot

# Switch to non-root user
USER appuser

# Expose Azure Functions default port
EXPOSE 7071

# Health check for Azure Functions
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:7071/api/health || exit 1
