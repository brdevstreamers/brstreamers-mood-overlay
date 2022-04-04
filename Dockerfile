FROM node:17-alpine3.14

WORKDIR /usr/app
COPY ./ /usr/app

RUN npm install

CMD ["npm", "start"]