const c8yClientLib = require('@c8y/client');

module.exports = function(RED) {
    function C8yHTTPAuthNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        const tenant = process.env.C8Y_TENANT;
        const user = process.env.C8Y_USER;
        const password = process.env.C8Y_PASSWORD;
        const auth = new c8yClientLib.BasicAuth({tenant, user, password});

        node.on('input', function(msg) {
            node.send(auth.getFetchOptions(msg));
        });
    }
    RED.nodes.registerType("c8y-http-auth", C8yHTTPAuthNode);
}
