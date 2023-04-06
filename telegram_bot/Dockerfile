FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 443
CMD [ "node", "server.js" ]