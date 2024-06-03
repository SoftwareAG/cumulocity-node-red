#!/bin/sh
if [[ $(c8y microservices list  --name node-red) ]]; then
    c8y microservices list  --name node-red | c8y microservices createBinary --file node-red.zip --timeout 360
else
    c8y microservices create --file node-red.zip
fi
