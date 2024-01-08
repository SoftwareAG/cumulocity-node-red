FROM nodered/node-red:3.1.3-18-minimal
USER root
RUN chown -R root:root /data/
RUN cd /data && npm install @c8y/client@1018.0.143 && npm install node-red-dashboard@3.6.0
COPY ./data /data
# compile typescript to javascript and afterwards remove node_modules to reduce container size
RUN cd /data/node-red-c8y-storage-plugin && npm install && npm run build && npx rimraf node_modules

RUN cd /data && npm init -y
RUN cd /data && npm install ./node-red-contrib-c8y-client
RUN cd /data && npm install ./node-red-c8y-storage-plugin

# https://github.com/npm/cli/issues/4095
RUN chown -R root:root /usr/src/node-red

EXPOSE 80/tcp
ENTRYPOINT ["npm", "start", "--cache", "/data/.npm", "--", "--userDir", "/data"]
