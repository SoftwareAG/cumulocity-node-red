FROM node:18-alpine As deps
WORKDIR /usr/src/app
COPY --chown=node:node ./yarn.lock ./
COPY --chown=node:node ./package.json ./
COPY --chown=node:node ./node-red-contrib-c8y-client/package.json ./node-red-contrib-c8y-client/
COPY --chown=node:node ./node-red-c8y-storage-plugin/package.json ./node-red-c8y-storage-plugin/


RUN yarn install --frozen-lockfile --immutable --non-interactive --prefer-offline

FROM node:18-alpine As build
WORKDIR /usr/src/app

COPY --chown=node:node ./ ./
#COPY --chown=node:node --from=deps /usr/src/app/node-red-contrib-c8y-client/node_modules/ ./node-red-contrib-c8y-client/node_modules/
#COPY --chown=node:node --from=deps /usr/src/app/node-red-c8y-storage-plugin/node_modules/ ./node-red-c8y-storage-plugin/node_modules/
COPY --chown=node:node --from=deps /usr/src/app/node_modules/ ./node_modules/

RUN yarn run build

FROM node:18-alpine As prodDeps
WORKDIR /usr/src/app

COPY --chown=node:node ./yarn.lock ./
COPY --chown=node:node ./package.json ./
COPY --chown=node:node ./node-red-contrib-c8y-client/package.json ./node-red-contrib-c8y-client/
COPY --chown=node:node ./node-red-c8y-storage-plugin/package.json ./node-red-c8y-storage-plugin/

ENV NODE_ENV production
ENV NO_COLOR true

RUN yarn install --frozen-lockfile --immutable --non-interactive --prefer-offline --production && yarn cache clean --force

FROM node:18-alpine As prod
WORKDIR /usr/src/app

COPY --chown=node:node --from=prodDeps /usr/src/app/ ./
COPY --chown=node:node ./ ./
#COPY --chown=node:node --from=build /usr/src/app/node-red-contrib-c8y-client/dist/ ./node-red-contrib-c8y-client/dist/
COPY --chown=node:node --from=build /usr/src/app/node-red-c8y-storage-plugin/lib/ ./node-red-c8y-storage-plugin/lib/

ENV NODE_ENV production
ENV NO_COLOR true

CMD [ "yarn", "start" ]

EXPOSE 80
