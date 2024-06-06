const c8yClientLib = require('@c8y/client');
const {getCredentials} = require("../c8y-utils/c8y-utils");

module.exports = function(RED) {
    function C8yCheckRolesNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.config = config;
        node.c8yconfig = RED.nodes.getNode(node.config.c8yconfig);
        getCredentials(RED, node);
  
        // Get properties
        try {
          const roles = RED.util.evaluateNodeProperty(
            node.config.roles,
            node.config.rolesType,
            node,
            undefined
          );
          node.debug("roles:" + JSON.stringify(roles));
        } catch (error) {
          node.error("Extracting Properties " + error);
          return;
        }
          
        node.on("input", function (msg, send, done) {
          
            if (msg && msg.req && msg.req.headers) {
              try {
                    const auth = new c8yClientLib.MicroserviceClientRequestAuth(msg.req.headers);
                    const client = new c8yClientLib.Client(auth, node.C8Y_BASEURL);
                    if (node.APPLICATION_KEY) {
                        const header = {
                          "X-Cumulocity-Application-Key":
                              node.APPLICATION_KEY,
                          };
                        client.core.defaultHeaders = Object.assign(
                        header,
                        client.core.defaultHeaders
                      );
                    }
              client.user.current().then(
                ({ data: currentUser }) => {
                  const hasRoles = client.user.hasAllRoles(
                    currentUser,
                    roles
                  );
                  if (hasRoles) {
                    send([msg, null, { payload: currentUser }]);
                  } else {
                    send([null, msg, { payload: currentUser }]);
                  }
                },
                (error) => {
                  done(error);
                }
              );
            } catch (e) {
              done(e);
            }
          } else {
            done("No request headers found");
          }
        });
    }
    RED.nodes.registerType("check-roles", C8yCheckRolesNode);
}
