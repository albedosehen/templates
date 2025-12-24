# Stage: Build
FROM node:24.12.0-alpine AS builder

WORKDIR /build

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci --no-audit --no-fund

COPY src ./src

RUN npm run build

RUN npm prune --production


# Stage: Production (Runtime)
FROM node:24.12.0-alpine AS production

RUN apk upgrade --no-cache

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

WORKDIR /app

ENV NODE_ENV=production

COPY --chown=nodejs:nodejs package*.json ./

COPY --chown=nodejs:nodejs --from=builder /build/node_modules ./node_modules

COPY --chown=nodejs:nodejs --from=builder /build/dist ./dist

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

CMD ["node", "dist/src/index.js"]


# Stage: Development (Runtime)
FROM node:24.12.0-alpine AS development

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

WORKDIR /app

ENV NODE_ENV=development

COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs tsconfig.json ./

RUN npm ci --no-audit --no-fund

COPY --chown=nodejs:nodejs src ./src
COPY --chown=nodejs:nodejs tests ./tests

USER nodejs

EXPOSE 3000 9229

CMD ["npm", "run", "dev:watch"]
