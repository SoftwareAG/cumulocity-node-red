FROM nodered/node-red:1.2.9-12-minimal
RUN cd /data && npm install @c8y/client
COPY ./data /data
USER root
# compile typescript to javascript and afterwards remove node_modules to reduce container size
RUN cd /data/node-red-c8y-storage-plugin && npm install && npm run build && npx rimraf node_modules

RUN cd /data && npm install ./node-red-contrib-c8y-client
RUN cd /data && npm install ./node-red-c8y-storage-plugin
EXPOSE 80/tcp
ENTRYPOINT ["npm", "start", "--cache", "/data/.npm", "--", "--userDir", "/data"]