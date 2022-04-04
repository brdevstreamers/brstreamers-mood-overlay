FROM 17-alpine3.14

RUN npm install

CMD ["npm", "start"]