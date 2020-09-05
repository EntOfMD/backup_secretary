FROM node:12 as builder

WORKDIR /app

COPY ./package.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "start"]
