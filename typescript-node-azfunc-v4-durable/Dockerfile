# Stage: Build
FROM node:24.12.0-alpine AS builder

RUN apk upgrade --no-cache && \
    apk add --no-cache \
    ca-certificates \
    wget \
    unzip

WORKDIR /build

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci --no-audit --no-fund

COPY src ./src

RUN npm run build

RUN npm prune --production

# Stage: Production (Runtime)
FROM mcr.microsoft.com/azure-functions/node:4-node24 AS production

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true \
    NODE_ENV=production

WORKDIR /home/site/wwwroot

RUN groupadd -g 1001 appuser && \
    useradd -r -u 1001 -g appuser appuser

COPY --chown=appuser:appuser package*.json ./

COPY --chown=appuser:appuser --from=builder /build/node_modules ./node_modules

COPY --chown=appuser:appuser --from=builder /build/dist ./dist

COPY --chown=appuser:appuser host.json ./

RUN chown -R appuser:appuser /home/site/wwwroot

USER appuser

EXPOSE 7071

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:7071/api/health || exit 1


# Stage: Development (Runtime)
FROM mcr.microsoft.com/azure-functions/node:4-node24 AS development

RUN groupadd -g 1001 azurefunc && \
    useradd -r -u 1001 -g azurefunc azurefunc

WORKDIR /home/azurefunc/app

ENV NODE_ENV=development

COPY --chown=azurefunc:azurefunc package*.json ./
COPY --chown=azurefunc:azurefunc tsconfig.json ./
COPY --chown=azurefunc:azurefunc jest.config.mjs ./
COPY --chown=azurefunc:azurefunc eslint.config.mjs ./
COPY --chown=azurefunc:azurefunc .prettierrc.json ./
COPY --chown=azurefunc:azurefunc .prettierignore ./

RUN npm ci --no-audit --no-fund

COPY --chown=azurefunc:azurefunc src ./src
COPY --chown=azurefunc:azurefunc tests ./tests
COPY --chown=azurefunc:azurefunc host.json ./

USER azurefunc

EXPOSE 7071 9229

CMD ["func", "start", "--typescript"]
