FROM nodered/node-red:1.2.7-12-minimal
RUN cd /data && npm install @c8y/client
COPY ./data /data
USER root
# compile typescript to javascript and afterwards remove typescript devDependencies to reduce size
RUN cd /data/node-red-c8y-storage-plugin && npm install && npm run build && npm prune --production
RUN cd /data && npm install ./node-red-contrib-c8y-client
RUN cd /data && npm install ./node-red-c8y-storage-plugin
EXPOSE 80/tcp
ENTRYPOINT ["npm", "start", "--cache", "/data/.npm", "--", "--userDir", "/data"]