# Multi-stage Dockerfile for Open LMS Frontend
# Stage 1: Builder - Build the React application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with frozen lockfile for reproducibility
RUN npm ci --frozen-lockfile

# Copy source code
COPY . .

# Build the application (outputs to /app/dist)
RUN npm run build

# Stage 2: Runtime - Serve with Nginx
FROM nginx:1.26-alpine AS runtime

# Copy built static files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Create non-root user for security (nginx already runs as non-root in alpine image)
# Ensure proper permissions for nginx
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose ports
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
