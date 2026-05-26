FROM node:24.15.0-slim

WORKDIR /app

COPY ./ ./

RUN npm ci
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]