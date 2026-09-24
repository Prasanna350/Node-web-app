FROM node:24.21.0-alpine3.24 AS dependencies
WORKDIR /app
COPY package*.json .
RUN npm ci

FROM node:24.21.0-alpine3.24 AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN mkdir ./dist/public && cp -r ./public/* ./dist/public/ 

FROM node:24.21.0-alpine3.24 AS production-ready
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
RUN adduser -D newuser
COPY --chown=newuser:newuser . .
USER newuser
EXPOSE 5000
CMD ["node","dist/server.js"]
