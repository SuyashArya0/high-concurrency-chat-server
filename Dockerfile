# Use lightweight Node.js Alpine base image
FROM node:20-alpine

# Set production environment
ENV NODE_ENV=production

# Set working directory inside container
WORKDIR /app

# Copy package manifests first for optimal Docker layer caching
COPY package*.json ./

# Install only production dependencies cleanly
RUN npm ci --only=production

# Copy application source code
COPY . .

# Expose server port
EXPOSE 3000

# Start server
CMD ["npm", "start"]