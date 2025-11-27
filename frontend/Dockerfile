# Build Stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
# IMPORTANT: We set the API URL to the Pi's IP address at runtime or build time.
# For now, we'll use a placeholder that can be replaced or set via env var if Vite supports it.
# Since Vite env vars are baked in at build time, we need to know the Pi's IP.
# However, for a generic build, we might need a runtime config solution or ask the user to rebuild.
# For simplicity in this PWA, we'll assume relative paths or a specific env var.
# But wait, the user is deploying to a specific IP: 192.168.1.141
ENV VITE_API_BASE_URL=http://192.168.1.141:8001
RUN npm run build

# Production Stage
FROM nginx:alpine

# Copy build artifacts
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
