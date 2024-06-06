# @c8y/node-red-client 

This package provides nodes to connect to Cumulocity IoT Platform. They can be used inside the Node-Red Cumulocity Micorservice or standalone.

## Authentication

All nodes can be configured with Cumulocity IoT credentials either via a configuration node or environment variables. In case of running inside of Cumulocity as a microservice the environment variables are automatically injected on runtime and enabeling the Use Env checkbox in the configuration dialog will use those values.

    C8Y_TENANT=c8ytenantid
    C8Y_USER=c8yusername
    C8Y_PASSWORD=c8ypwd
    C8Y_APPLICATION_KEY=optional (when set requests are not treated as a device call)

# Concept

Blocks are designed to handle most authentiction and configuration for Cumulocity IoT. 
The intention of those nodes is not to cover all Cumulocity API [https://cumulocity.com/api/core/](https://cumulocity.com/api/core/)
Most requests can be done using the call-endpoint node. Please look at the examples how to prepare requests using a function node and execute them using the call-endpoint node.
In addition Realtime (UI-like) and Notificaiton (Notification 2.0) nodes enable you to get realtime events from cumulocity.
For more information have a look at the node-help inside node-red. 

## Dev

You can install the package after checkout like that:

    cd ~.node-red
    npm install <full path to git repo>/cumulocity-node-red/@c8y/node-red-client

This will create a link in the node-red node-modules dir.
To test and restart node-red on file changes in development you can use nodemon in the node-red-client dir of the repo like that:

    nodemon --watch ./ -e js,html,json --exec "node-red"

To test Use Env switch you can edit env.list.default to your values and source the file like . ./env.list.default



