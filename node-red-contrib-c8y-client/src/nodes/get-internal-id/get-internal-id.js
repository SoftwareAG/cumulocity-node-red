
const {getCredentials} = require("../c8y-utils/c8y-utils");

module.exports = function(RED) {
    function GetInternalIdCallNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.config = config;
        node.c8yconfig = RED.nodes.getNode(node.config.c8yconfig);
        getCredentials(RED,node);

        node.createDeviceandAddExternalId = async function createDeviceandAddExternalId(
          node,
          mo,
          externalId,
          type
          ) {
          const fetchOptions = {
            method: "POST",
            body: JSON.stringify(mo),
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          };
          //Create Device
          const resCreateMo = await node.client.core.fetch(
            "/inventory/managedObjects",
            fetchOptions
          );
          try {
            createMoJson = await resCreateMo.json();
          } catch (error) {
            node.error(error);
            return "error";
          }
          let id = "";
          if (resCreateMo.status == 201) {
            node.trace("createMoJson: " + JSON.stringify(createMoJson));
            id = createMoJson.id;
            fetchOptions.body = JSON.stringify({
              externalId: externalId,
              type: type,
            });
            // Create External id
            if (externalId !== undefined) {
              const resCreateExternal = await node.client.core.fetch(
                "/identity/globalIds/" + id + "/externalIds",
                fetchOptions
              );
              try {
                createExtJson = await resCreateExternal.json();
              } catch (error) {
                node.error(error);
                return "error";
              }
              node.trace("createExtJson: " + JSON.stringify(createExtJson));
              if (resCreateExternal.status == 201) {
                node.log(
                  "ExternalId: " + externalId + " attached to ManagedObject: " + id
                );
              } else {
                node.error(
                  "Could not create ExternalId: " +
                    resCreateExternal.status +
                    " " +
                    resCreateExternal.statusText
                );
                return "error";
              }
            }
            return id;
          } else {
            return "error";
          }
        };

        node.on('input', async function(msg) {
          try {
            // Get properties
            externalIdType = RED.util.evaluateNodeProperty(
              node.config.externalidtype,
              node.config.externalidtypeType,
              node,
              msg
              );
            externalId = RED.util.evaluateNodeProperty(
              node.config.externalid,
              node.config.externalidType,
              node,
              msg
              );
            if (node.config.createdevice) {
              params = RED.util.evaluateNodeProperty(
                node.config.params,
                node.config.paramsType,
                node,
                msg
                );
              }
              node.debug("Config: " + node.C8Y_TENANT + node.C8Y_BASEURL + node.C8Y_PASSWORD + node.C8Y_USER);
              if (externalId === undefined) {
                node.error( "Error externalId is undefined.");
                return;
              }
              if (externalIdType === undefined) {
                node.error( "Error externalIdType is undefined.");
                return;
              }
            } catch (error) {
              node.error("Extracting Properties " +error);
              return;
            }
          try {
            const fetchOptions = {
              method: "GET",
              body: undefined,
              headers: msg.headers || {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            };
            //Get internalId from external
            const res = await node.client.core.fetch(
              "/identity/externalIds/" + externalIdType + "/" + externalId,
              fetchOptions
            );
            msg.status = res.status;
            delete msg.body;
            delete msg.headers;
  
            if (msg.status == 200) {
              try {
                json = await res.json();
                msg.payload = json.managedObject.id;
                node.debug(`Sending Message: ${JSON.stringify(msg)}`);
                node.send(msg);
              } catch (error) {
                node.error(error);
                return;
              }
            } else {
              if (msg.status == 404) {
                if (node.config.createdevice) {
                  // create deivce
                  if (params === undefined) {
                    var mo = {
                      c8y_IsDevice: {},
                      name: "Node-Red-Device-" + externalId,
                    };
                  } else {
                    var mo = {
                      c8y_IsDevice: {},
                      ...params,
                    };
                  }
                  node.debug("ManagedObject to create: ", mo);
                  msg.payload = await node.createDeviceandAddExternalId(
                    node,
                    mo,
                    externalId,
                    externalIdType
                  );
                  node.debug("Internal Id: " + msg.payload);
                  if (typeof msg.payload != "error") {
                    node.send(msg);
                    return;
                  } else {
                    node.error("ExternalId not found: " + error);
                    return;
                  }
                }else{
                node.error("Get InternalId Response: " + res.status + " " + res.statusText);
                return;
                }
              }else{
                node.error(res.statusText + " " + res.status);
              }
            }
            
          } catch (error) {
            node.error("Get-Internal-Id: " +error);
          }
      });
    }
    RED.nodes.registerType("get-internal-id", GetInternalIdCallNode);
}

