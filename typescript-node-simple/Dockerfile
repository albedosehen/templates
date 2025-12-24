# Build stage - compile TypeScript and prepare artifacts
FROM node:24.12.0-alpine AS builder

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


# Production stage - minimal runtime image with non-root user
FROM node:24.12.0-alpine AS production

# Install security updates
RUN apk upgrade --no-cache

# Create non-root user and group
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Set working directory
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy package files for reference
COPY --chown=nodejs:nodejs package*.json ./

# Copy production dependencies from builder
COPY --chown=nodejs:nodejs --from=builder /build/node_modules ./node_modules

# Copy built application from builder
COPY --chown=nodejs:nodejs --from=builder /build/dist ./dist

# Switch to non-root user
USER nodejs

# Expose application port
EXPOSE 3000

# Health check (optional but recommended)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Start the application
CMD ["node", "dist/src/index.js"]


# Development stage - for local development with hot reload
FROM node:24.12.0-alpine AS development

# Create non-root user for development
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Set working directory
WORKDIR /app

# Set development environment
ENV NODE_ENV=development

# Copy package files
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs tsconfig.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci --no-audit --no-fund

# Copy source and test files
COPY --chown=nodejs:nodejs src ./src
COPY --chown=nodejs:nodejs tests ./tests

# Switch to non-root user
USER nodejs

# Expose application and debug ports
EXPOSE 3000 9229

# Start development server with watch mode
CMD ["npm", "run", "dev:watch"]
