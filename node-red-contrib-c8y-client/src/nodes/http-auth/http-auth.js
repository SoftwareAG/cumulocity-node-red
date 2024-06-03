const c8yClientLib = require('@c8y/client');
const { getCredentials } = require("../c8y-utils/c8y-utils");

module.exports = function(RED) {
    function C8yHTTPAuthNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.config = config;
        node.c8yconfig = RED.nodes.getNode(node.config.c8yconfig);
        getCredentials(RED, node);
        
        try {
            const auth = new c8yClientLib.BasicAuth({tenant: node.C8Y_TENANT, user: node.C8Y_USER, password: node.C8Y_PASSWORD});
            node.on('input', function(msg) {
                node.send(auth.getFetchOptions(msg));
            });
            
        } catch (error) {
            node.error(error);
        }
    }
    RED.nodes.registerType("http-auth", C8yHTTPAuthNode);
}
