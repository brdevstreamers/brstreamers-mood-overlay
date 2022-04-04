FROM node:17-alpine3.14

WORKDIR /usr/app
COPY ./ /usr/app

RUN npm install

COPY keys.json /usr/app/keys.json
COPY .env /usr/app/.env

CMD ["npm", "start"]