# Cumulocity - Node-RED flow management with thin-edge.io

This repository contains the required parts to 

* To manage the distribution of flows to edge devices that are connected to Cumulocity IoT via thin-edge.io
* Inject the distributed flow into the local node-red runtime as a thin-edge.io plugin


![Sample Image](images/c8y-nodered-sample.png)


Cumulocity IoT is a leading device management platform that provides a range of tools and services for managing IoT devices. It allows you to distribute your Node-RED flows across your edge devices and monitor them in real-time. You can also configure your devices remotely and access a wide range of analytics and reporting tools.

# Content


# Node-Red

Node-RED is a visual programming tool that allows you to build and deploy IoT applications quickly and easily. It is particularly useful for edge computing, as it allows devices to process data locally and make real-time decisions. In that context Node-RED can be used to build flows that run on edge devices and process data locally. This can improve the performance and reliability of IoT systems, especially in situations where internet connectivity is limited.

# thin-edge.io

thin-edge.io is a lightweight open source framework that is designed specifically for IoT devices. It is build to be fast, secure, and easy to use, making it a great choice for device management.

One of the key benefits of thin-edge.io is its compatibility with Cumulocity IoT, the leading device management platform. By using thin-edge.io on your devices, you can take full advantage of the tools and services provided by Cumulocity IoT, including real-time monitoring, remote configuration, software management and analytics.

With thin-edge.io and Cumulocity IoT, you can:

* Easily install and monitor software on your edge devices
* Connect your devices to cloud platforms like Cumulocity IoT, Azure IoT and AWS IoT
* Configure devices
* Collect data locally and monitor them

# Cumulocity IoT

Cumulocity IoT is a leading device management platform that provides a range of tools and services for managing IoT devices. It allows you to monitor your devices in real-time, configure them remotely, and access a wide range of analytics and reporting tools.

With Cumulocity IoT, you can:

* Monitor your devices in real-time and receive alerts when something goes wrong
* Configure your devices remotely and apply updates or patches as needed
* Use APIs and integrations to connect your devices to other platforms and systems
* Benefit from a range of security features, including secure communication, authentication, and access control
* Cumulocity IoT is designed to be scalable and flexible, whether you are managing a few hundred devices or a few million.



# Installation

This repository consists of several parts that need to be up an running:

* Node-Red locally on the device
* The Node-Red UI/Backend on Cumulocity
* The device management plugin that allows management and distribution of the node-red flows
* thin-edge.io plugin to inject or delete the flows in the local node-red runtime


## Node-red

There are several ways on how to run node-red locally on the device. However basically only two methods are mentioned here:

### Native installation via npm

Make sure that you have npm installed on your system. npm is typically installed automatically with Node.js, so if you have Node.js installed, you should already have npm. 
You can check if npm is installed by running the following command in your terminal:

```bash
npm -v
```

If npm is not installed, you can install it by following the instructions on the npm website (https://www.npmjs.com/get-npm). Once npm is installed, you can install Node-RED by running the following command in your terminal:

```bash
npm install -g node-red
```
This will install the latest version of Node-RED and make it available globally on your system.

To start the Node-RED server, run the following command in your terminal:
```bash
node-red
````

This will start the Node-RED server. Usually the webserver can be reached via port 1880.

### Running via docker

Make sure docker is installed on your system. You can download Docker from the official website (https://www.docker.com/products/docker-desktop).

Start the Docker daemon by running the following command:
```bash
sudo systemctl start docker
```
Once the Docker daemon is running, pull the latest Node-RED image from the Docker registry by running the following command:
```bash 
docker pull nodered/node-red
```
Run the Node-RED container by executing the following command:
```bash
docker run -d -p 1880:1880 --name mynodered nodered/node-red
```
This command will start the Node-RED container in detached mode (-d), bind the container's port 1880 to the host's port 1880 (-p 1880:1880), and give the container the name "mynodered".

This will start the Node-RED server in a container. Depending on your mapping (-p) the webserver can be reached via port 1880 or any other you configured.
## Node-red UI plugin

Refering to the backend/frontend implementation you can find all content, packages and tutorials here:

https://github.com/SoftwareAG/cumulocity-node-red

## Node-red flow management

You need to install the plugin for the device management application to your Cumulocity IoT Tenant:


The plugin is provided as binaries in [Releases](https://github.com/SoftwareAG/url/releases).

To install the plugin go to the Administration App -> Ecosystem -> Packages and click on "Add Application" on the top right.

> **_NOTE:_** If you don't see the Packages Menu you have to add "?beta=true" in your URL.
> Example: {{url}}/apps/administration?beta=true

Select the binaries and wait until it is uploaded.

> **_NOTE:_** We need to clone the Device Management app to add the plugin to it

After succesful upload go to "All Applications" and click on "Add Application". Select "Duplicate existing application"
and afterwards "Device Management".

![](images/Duplicate-app.png)

Now select the cloned Device Management App and go to the "Plugin" Tab. Click on "Install Plugin" and select "node-red-management plugin"

![](images/Plugin-installed.png)
## thin-edge.io plugin


### thin-edge.io


### node-red thin-edge.io plugin

### SmartRest template





