FROM node:10-alpine

WORKDIR /app
COPY / ./
RUN yarn install && yarn build

CMD [ "yarn", "serve", "-s", "build" ]
