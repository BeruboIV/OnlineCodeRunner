# FROM node:16.17.0-bullseye-slim
FROM node:14.16.0-alpine3.13
WORKDIR /CodeRunner
RUN apk update && apk add g++
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
