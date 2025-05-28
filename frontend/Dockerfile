# Stage 1: Builder with all dependencies
FROM node:18 as builder

RUN apt-get update && apt-get install -y \
    build-essential \
    libvips-dev

WORKDIR /app
COPY package*.json ./
RUN npm install --include=optional
COPY . .
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./

EXPOSE 3000
CMD ["npm", "start"]