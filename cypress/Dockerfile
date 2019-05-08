FROM cypress/base:8

WORKDIR /app

COPY package.json .
COPY yarn.lock .

ENV CI=1
ENV NO_POSTINSTALL=1

RUN yarn install
RUN yarn cypress verify

COPY cypress cypress
COPY cypress.json .
