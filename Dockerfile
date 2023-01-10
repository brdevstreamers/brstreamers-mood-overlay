FROM node:18-alpine3.17

WORKDIR /usr/app
COPY ./ /usr/app

RUN npm install

COPY keys.json /usr/app/keys.json
COPY .env /usr/app/.env

CMD ["npm", "start"]