const {
  createDeviceandAddExternalId,
  getCredentials,
} = require("../c8y-utils/c8y-utils");

module.exports = function(RED) {
    function EndpointCallNode(config) {
      RED.nodes.createNode(this, config);
      var node = this;
      node.config = config;

      node.c8yconfig = RED.nodes.getNode(node.config.c8yconfig);
      getCredentials(RED, node);
      node.on("input", function (msg) {
        // Get properties
        try {
          method = RED.util.evaluateNodeProperty(
            node.config.method,
            node.config.methodType,
            node,
            msg
            );
            node.debug("method:" +method );
          // please no body for GET
          if (method =="GET" || method =="DELETE" ) {
              body = undefined;
          }else{
              body = RED.util.evaluateNodeProperty(
                node.config.body,
                node.config.bodyType,
                node,
                msg
              );
            }
            node.debug( " body: " + body);
            endpoint = RED.util.evaluateNodeProperty(
              node.config.endpoint,
              node.config.endpointType,
              node,
              msg
            );
            node.debug(
              "Config: " +
                node.C8Y_TENANT +
                " " +
                node.C8Y_BASEURL +
                " endpoint: " +
                endpoint
            );
        } catch (error) {
          node.error("Extracting Properties " + error);
          return;
        }
        
        try {
          const fetchOptions = {
            method: method,
            body: (method =="DELETE" || method=="GET") ? undefined :  JSON.stringify(body) ,
            headers: msg.headers || {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          };
  
          node.debug("Fetching: " + JSON.stringify(fetchOptions) + " Endpoint: " + endpoint);
          node.client.core
            .fetch(endpoint, fetchOptions)
            .then(
              (res) => {
                msg.status = res.status;
                delete msg.body;
                delete msg.headers;
                // get body only if it exists
                if (res.status !== 204) {
                  return res.json().then(
                    (json) => {
                      node.debug("res:" + JSON.stringify(json));
                      msg.payload = json;
                      node.send(msg);
                    },
                    (error) => {
                      node.error(error);
                    }
                  );
                }
                node.send(msg);
              },
              (error) => {
                node.error(error);
              }
            );
          
        } catch (error) {
          node.error("Fetching: " + error);
        }
      });
    }
    RED.nodes.registerType("call-endpoint", EndpointCallNode);
}
