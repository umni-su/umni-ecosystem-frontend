# Сборка фронтенда
#FROM node:22-alpine AS build
FROM --platform=$BUILDPLATFORM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install -g npm@12.2.1
RUN npm ci

COPY . .
RUN npm run build

# Раздача статики
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
