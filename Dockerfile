FROM node:10-alpine

ARG SERVER_ADDRESS

WORKDIR /app
COPY / ./
RUN yarn install && REACT_APP_SERVER_ADDRESS=${SERVER_ADDRESS} yarn build

CMD [ "yarn", "serve", "-s", "build" ]
