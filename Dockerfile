FROM node:18-alpine As deps
WORKDIR /usr/src/app
COPY --chown=root:root ./yarn.lock ./
COPY --chown=root:root ./package.json ./
COPY --chown=root:root ./node-red-contrib-c8y-client/package.json ./node-red-contrib-c8y-client/
COPY --chown=root:root ./node-red-c8y-storage-plugin/package.json ./node-red-c8y-storage-plugin/


RUN yarn install --frozen-lockfile --immutable --non-interactive --prefer-offline

USER root

FROM node:18-alpine As build
WORKDIR /usr/src/app

COPY --chown=root:root ./ ./
#COPY --chown=root:root --from=deps /usr/src/app/node-red-contrib-c8y-client/node_modules/ ./node-red-contrib-c8y-client/node_modules/
#COPY --chown=root:root --from=deps /usr/src/app/node-red-c8y-storage-plugin/node_modules/ ./node-red-c8y-storage-plugin/node_modules/
COPY --chown=root:root --from=deps /usr/src/app/node_modules/ ./node_modules/

RUN yarn run build

USER root

FROM node:18-alpine As prodDeps
WORKDIR /usr/src/app

COPY --chown=root:root ./yarn.lock ./
COPY --chown=root:root ./package.json ./
COPY --chown=root:root ./node-red-contrib-c8y-client/package.json ./node-red-contrib-c8y-client/
COPY --chown=root:root ./node-red-c8y-storage-plugin/package.json ./node-red-c8y-storage-plugin/

ENV NODE_ENV production
ENV NO_COLOR true

RUN yarn install --frozen-lockfile --immutable --non-interactive --prefer-offline --production && yarn cache clean --force

USER root

FROM node:18-alpine As prod
WORKDIR /usr/src/app

COPY --chown=root:root --from=prodDeps /usr/src/app/ ./
COPY --chown=root:root ./ ./
#COPY --chown=root:root --from=build /usr/src/app/node-red-contrib-c8y-client/dist/ ./node-red-contrib-c8y-client/dist/
COPY --chown=root:root --from=build /usr/src/app/node-red-c8y-storage-plugin/lib/ ./node-red-c8y-storage-plugin/lib/

ENV NODE_ENV production
ENV NO_COLOR true

# https://github.com/npm/cli/issues/4095
RUN chown -R root:root /usr/src/app

USER root

CMD [ "yarn", "start" ]

EXPOSE 80
