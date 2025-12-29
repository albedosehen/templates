# Stage: Build
FROM node:24.12.0-alpine AS builder

WORKDIR /build

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci --no-audit --no-fund

COPY src ./src

RUN npm run build


# Stage: Production (Runtime)
FROM mcr.microsoft.com/playwright:v1.49.1-jammy AS production

RUN apt-get update && apt-get upgrade -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs -s /bin/bash -m nodejs

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

COPY --from=builder /build/node_modules ./node_modules

COPY --from=builder /build/dist ./dist

# Install Playwright browsers (must be done as root)
RUN npx playwright install --with-deps chromium

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app

USER nodejs

CMD ["node", "dist/src/index.js"]


# Stage: Development (Runtime)
FROM mcr.microsoft.com/playwright:v1.49.1-jammy AS development

RUN groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs -s /bin/bash -m nodejs

WORKDIR /app

ENV NODE_ENV=development

COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs tsconfig.json ./

RUN npm ci --no-audit --no-fund

# Install Playwright browsers
RUN npx playwright install --with-deps chromium

COPY --chown=nodejs:nodejs src ./src
COPY --chown=nodejs:nodejs tests ./tests

USER nodejs

CMD ["npm", "run", "dev:watch"]
