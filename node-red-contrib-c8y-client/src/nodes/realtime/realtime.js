const c8yClientLib = require('@c8y/client');
const {getCredentials} = require("../c8y-utils/c8y-utils");

module.exports = function(RED) {
    function RealtimeNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.subscription = undefined;
        node.config = config;
        node.c8yconfig = RED.nodes.getNode(node.config.c8yconfig);
        node.active = config.active === null || typeof config.active === "undefined" || config.active;
        getCredentials(RED, node);
        node.topic = '/' + config.api + '/' + (config.deviceId || '*');
        node.log("node.active: " + node.active);
        
        node.subscriberealtime = function () {
          node.log(
            `Subscribing to: ${node.topic} on tenant: ${node.C8Y_TENANT} and url: ${node.C8Y_BASEURL}`
            )
        
          node.subscription = node.client.realtime.subscribe(
            node.topic,
            (evt) => {
              const msg = {
                payload: evt,
              };
              node.send(msg);
            }
          );
        }

        node.unsubscriberealtime = function () {
          if (node.client && node.subscription) {
            node.log(
              `Unsubscribe from: ${node.topic} on tenant: ${node.C8Y_TENANT} and url: ${node.C8Y_BASEURL}`
            );
            node.client.realtime.unsubscribe(node.subscription);
            //node.subscription = undefined;
          }
        }

        setNodeState(node, true);

        //node.active ? node.subscriberealtime() : node.unsubscriberealtime();

        node.on('close', function() {
            node.log("on CLOSE");
            node.unsubscriberealtime();
        });
    }


    RED.nodes.registerType("realtime", RealtimeNode);

    // State
    RED.httpAdmin.get(
      "/realtime/:id/:state",
      RED.auth.needsPermission("realtime.write"),
      function (req, res) {
        console.log(
          "id: " + req.params.id + " state: " + req.params.state
        );
        var state = req.params.state;
        if (state !== "enable" && state !== "disable") {
          res.sendStatus(404);
          return;
        }
        var node = RED.nodes.getNode(req.params.id);
        if (node !== null && typeof node !== "undefined") {
          setNodeState(node, state === "enable");
          res.sendStatus(state === "enable" ? 200 : 201);
        } else {
          res.sendStatus(404);
        }
      }
    );
    function setNodeState(node,state) {
        if (state) {
            node.active = true;
            node.subscriberealtime();
            node.status({
              fill: "green",
              shape: "dot",
              text: `Connected`,
            });
          } else {
            node.active = false;
            node.status({
              fill: "red",
              shape: "dot",
              text: `Disconnected`,
            });
            node.unsubscriberealtime();
        }
    }
}
