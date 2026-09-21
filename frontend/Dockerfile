FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx/config.js.template /etc/nginx/config.js.template
COPY docker-entrypoint.d/ /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/*.sh

RUN apk add --no-cache gettext

# Runtime override, not baked at build time: the entrypoint renders config.js
# from this value (see docker-entrypoint.d/30-inject-api-url.sh).
ENV VITE_API_URL="http://localhost:5002/api"

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=5 \
  CMD wget -qO- "http://127.0.0.1:80/" >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]