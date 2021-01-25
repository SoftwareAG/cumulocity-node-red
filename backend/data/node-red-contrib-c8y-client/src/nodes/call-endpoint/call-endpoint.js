const c8yClientLib = require('@c8y/client');

module.exports = function(RED) {
    function EndpointCallNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        const tenant = process.env.C8Y_TENANT;
        const baseUrl = process.env.C8Y_BASEURL;
        const user = process.env.C8Y_USER;
        const password = process.env.C8Y_PASSWORD;
        const auth = new c8yClientLib.BasicAuth({tenant, user, password});

        node.on('input', function(msg) {
            node.client = new c8yClientLib.Client(auth, baseUrl);
            node.client.core.tenant = tenant;
            const fetchOptions = {
                method: msg.method || config.method || 'GET',
                body: JSON.stringify(msg.body || config.body) || undefined,
                headers: msg.headers || {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
            node.client.core.fetch(msg.endpoint || config.endpoint, fetchOptions).then(res => {
                msg.status = res.status;
                delete msg.body;
                delete msg.headers;
                return res.json().then(json => {
                    msg.payload = json;
                    node.send(msg);
                }, error => {
                    msg.paylaod = error;
                    node.send(msg);
                });
            }, error => {
                msg.paylaod = error;
                node.send(msg);
            })
        });
    }
    RED.nodes.registerType("call-endpoint", EndpointCallNode);
}
