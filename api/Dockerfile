FROM node:22-alpine
WORKDIR /usr/src/app

RUN apk add make gcc
RUN npm install -g node-gyp

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

CMD node --experimental-require-module dist/main.js
