FROM node:10-alpine

ARG BACKEND_HOST
ARG BACKEND_PORT

WORKDIR /app
COPY / ./
RUN yarn install && REACT_APP_BACKEND_HOST=${BACKEND_HOST} REACT_APP_BACKEND_PORT=${BACKEND_PORT} yarn build

CMD [ "yarn", "serve", "-s", "build" ]
