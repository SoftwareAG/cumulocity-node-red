# Cumulocity - Node-RED backend
This docker image provides Node-RED as a microservice to Cumulocity.
You are also able to directly access the Node-RED frontend by navigation to the `/service/node-red/` endpoint of your tenant. Additionally there is an optional frontend application within this repository to integrate the Node-RED frontend seamlessly into Cumulocity.

## How to build & deploy

build the docker image from the Dockerfile
```shell script
docker build -t node-red-ms .
```
store the docker image in tar archive
```shell script
docker save node-red-ms -o image.tar
```
ZIP the docker image and the application manifest (`cumulocity.json`). Depending on your operating system, you can do so by executing:
```shell script
zip node-red cumulocity.json image.tar
```
or
```shell script
tar -a -c -f node-red.zip image.tar cumulocity.json
```

Make sure that the name of the resulting ZIP file is `node-red.zip` as the file name is also being used a application key within Cumulocity.
The structure of the resulting ZIP file should then look like this:
```bash
├── cumulocity.json
└── image.tar
```
## Run locally
To run the docker container within your local environment for testing purposes, you can create a copy of the `env.list.default` file and rename it to `env.list`. This file contains some of the environment variables that will be provided to the microservice once it is running within Cumulocity. Please edit those variables to match your tenant.
Afterwards you can start a new container by executing:
```shell script
docker run -it -p 80:80 --name mynodered --env-file env.list node-red-ms
```
## Access Rights
This microservice provides two roles which you can use to limit the access rights to Node-RED. 
There is an `ROLE_NODE_RED_READ` role, which allows read access (`GET` method) to all endpoints.
The other role is `ROLE_NODE_RED_ADMIN`, which is required for all other methods then `GET`.
Some endpoints/directories like `/red/images` and `/icons/` are freely accessible because they only contain images/icons. 

Within the `cumulocity.json` you can find underneath the `requiredRoles` attribute an array of roles that are provided to the microservices user. This array currently only contains **READ** and **ADMIN** rights for the usual device APIs:

- ROLE_INVENTORY_READ
- ROLE_INVENTORY_ADMIN
- ROLE_EVENT_READ
- ROLE_EVENT_ADMIN
- ROLE_ALARM_READ
- ROLE_ALARM_ADMIN
- ROLE_DEVICE_CONTROL_READ
- ROLE_DEVICE_CONTROL_ADMIN
- ROLE_MEASUREMENT_READ
- ROLE_MEASUREMENT_ADMIN

You can add all the desired roles to this array in case you need more.

## Data persistence
To persist the created flows and store settings the microservice uses a [custom storage plugin](data/node-red-c8y-storage-plugin/README.md) for Node-RED to store those settings within Cumulocity's inventory.

## :bangbang: Credential encryption :bangbang:
As credentials are as well stored within cumulocity (encrypted tenant option), please make sure that all users who somehow have access to the those encrypted tenant options are also allowed to see those credentials.
Encrypted tenant options can only be decrypted by using a service user to access them.
Additionally to the encryption done with the encrypted tenant option, the tenant option is aswell encrypted via the Node-RED itself.
This additional encryption can be configured using the [settings.js](data/settings.js) file, you just need to modify the value of `credentialSecret`. By default a very weak secret is used, so please change it so something different and stronger.

## Connecting to the tenant via MQTT
If you want to use MQTT to connect to your Cumulocity tenant, you can use the credentials which are provided in the following environment variables: `MQTT_USER` and `MQTT_PASSWORD`.
You can use these environment variables directly within the your MQTT credentials by placing `$(MQTT_USER)` and `$(MQTT_PASSWORD)` in the Username and Password input fields.
The `MQTT_USER` follows the following schema: `<tenantId>/<username>`.

## Default nodes
Prepackaged with this Node-RED microservice you are also receiving some [basic Cumulocity nodes](data/node-red-contrib-c8y-client/README.md).