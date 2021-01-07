#Cumulocity - Node Red

This repository contains the required parts to run node red within a Cumulocity tenant.

The repository is splitted into two parts ([backend](backend/README.md) and [frontend](frontend/README.md)).
The backend folder contains all the required bits to run node red as a microservice within Cumulocity.
The frontend folder contains an optional [Cumulocity WebSDK](https://cumulocity.com/guides/web/angular/) based angular app, which has been created to serve the node red frontend (hosted in the microservice) within an iframe.


![Sample Image](images/c8y-nodered-sample.png)

## TODOs
- Currently the microservice uses the `PER_TENANT` isolation level. In future I might want to think about solutions to let this microservice run with `MULTI_TENANT` isolation level, so a single microservice instance can be used by multiple tenants to save costs.
- Create more nodes for simpler integration of Cumulocity.
- Look for solution to handle the basic auth popup when the application is opened initially. This does not happen on tenants which use the CookieAuth strategy (OAuth).
- Better handling on encrypting credentials that have been used within node red flows.