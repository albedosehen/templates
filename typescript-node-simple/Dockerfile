FROM node:25.2.1-alpine AS build

WORKDIR /build

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci

COPY src ./src

RUN npm run build

FROM node:25.2.1-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --only=production

COPY --from=build /build/dist ./dist

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

CMD ["node", "dist/src/index.js"]

FROM node:25.2.1-alpine AS development

WORKDIR /app

ENV NODE_ENV=development

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci

COPY src ./src
COPY tests ./tests

EXPOSE 3000 9229

CMD ["npm", "run", "dev:watch"]
