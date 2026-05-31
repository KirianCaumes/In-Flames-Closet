FROM node:24.16.0-alpine

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY package*.json ./

RUN npm ci

# Create non-root user for security
RUN adduser -D -u 10001 usr
RUN chown usr:usr /app

COPY --chown=usr:usr . .

RUN npm run build

USER usr

EXPOSE 3000

CMD ["npm", "run", "start"]