FROM node:10-alpine

WORKDIR /app
COPY / ./
RUN yarn install && yarn build

EXPOSE 5000

CMD [ "yarn", "serve", "-s", "build" ]
