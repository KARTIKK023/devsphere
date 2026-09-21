FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

FROM node:22-alpine AS runtime

ENV PORT=5002

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY --from=build /app/dist ./dist
COPY --from=build /app/src ./src

EXPOSE 5002

HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=5 \
  CMD wget -qO- "http://127.0.0.1:5002/api/health" >/dev/null || exit 1

CMD ["node", "dist/server.js"]