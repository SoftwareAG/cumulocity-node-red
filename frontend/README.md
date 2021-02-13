# Cumulocity - Node-RED frontend
This angular application is an optional addition to the Node-RED microservice.
You are also able to directly access the Node-RED frontend without this application by navigation to the `/service/node-red/` endpoint of your tenant.

The only purpose of this app is to integrate the Node-RED UI via an iframe into an Cumulocity app to allow seamless navigation between the different apps of a tenant.

## How to build & deploy

install project dependencies
```shell script
npm install
```
build the frontend application
```shell script
npm run build
```
deploy the frontend application to your Cumulocity tenant
```shell script
npm run deploy
```

In case you would like to have a distributable ZIP file of the application, just go ahead and ZIP the content of the `./dist/apps/node-red-ui` folder.
The resulting ZIP file should have the following file structure within its root:
```bash
├── assets
│   ├── ..
│   └── app-icon.png
├── ..
├── cumulocity.json
├── ..
├── index.html
└── ..
```