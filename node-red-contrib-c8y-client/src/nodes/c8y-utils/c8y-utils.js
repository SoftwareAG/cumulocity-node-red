const c8yClientLib = require("@c8y/client");


let getCredentials = function getCredentials(RED, node) {
  try {
    node.c8yconfig = RED.nodes.getNode(node.config.c8yconfig);
    if (node.config.useenv === true) {
      node.C8Y_TENANT = process.env.C8Y_TENANT;
      node.C8Y_BASEURL = process.env.C8Y_BASEURL;
      node.C8Y_USER = process.env.C8Y_USER;
      node.C8Y_PASSWORD = process.env.C8Y_PASSWORD;
      node.APPLICATION_KEY = process.env.APPLICATION_KEY;
    } else {
      
      if (node.c8yconfig) {
        node.C8Y_TENANT = node.c8yconfig.c8ytenant;
        node.C8Y_TENANT = node.c8yconfig.c8ytenant;
        node.C8Y_BASEURL = node.c8yconfig.c8yurl;
        node.APPLICATION_KEY = node.c8yconfig.c8yapplicationkey;
        node.C8Y_USER = node.c8yconfig.credentials.c8yuser;
        node.C8Y_PASSWORD = node.c8yconfig.credentials.c8ypassword;
      } else {
        node.error("No config found");
        return;
      }
    }
    const auth = new c8yClientLib.BasicAuth({
      tenant: node.C8Y_TENANT,
      user: node.C8Y_USER,
      password: node.C8Y_PASSWORD,
    });
  
    node.client = new c8yClientLib.Client(auth, node.C8Y_BASEURL);
    node.client.core.tenant = node.C8Y_TENANT;
    
  } catch (error) {
    node.error(error);
  }
};
module.exports = {
  getCredentials,
};
