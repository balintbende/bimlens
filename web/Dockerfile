FROM node:24-alpine AS build
WORKDIR /app
# Install as its own layer so it's cached unless the lockfile changes.
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.29-alpine AS final
# Where /api is proxied to (prefix stripped), same as the Vite dev proxy.
ENV API_UPSTREAM=http://api:8080
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
# Runs as non-root (nginx-unprivileged listens on 8080).
EXPOSE 8080
