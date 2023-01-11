FROM node:16-alpine3.17

WORKDIR /usr/app
COPY ./ /usr/app

RUN npm install

COPY gcloud.json /usr/app/gcloud.json
COPY .env /usr/app/.env

CMD ["npm", "start"]