FROM nodered/node-red:latest-minimal
RUN cd /data && npm install @c8y/client
COPY ./data /data
RUN cd /data && npm install ./node-red-contrib-c8y-client
RUN cd /data && npm install ./node-red-c8y-storage-plugin
USER root
EXPOSE 80/tcp
ENTRYPOINT ["npm", "start", "--cache", "/data/.npm", "--", "--userDir", "/data"]