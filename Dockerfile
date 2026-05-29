FROM node:24.16.0-alpine

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY ./ ./

RUN npm ci
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]