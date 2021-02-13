const c8yClientLib = require('@c8y/client');
const MicroserviceClientRequestAuth = require('./c8yRequestHeaderAuth');

module.exports = function(RED) {
    function C8yCheckRolesNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        const baseUrl = process.env.C8Y_BASEURL;
        try {
            const roles = JSON.parse(config.roles);
            node.on('input', function(msg, send, done) {
                if (msg && msg.req && msg.req.headers) {
                    try {
                        const auth = new MicroserviceClientRequestAuth(msg.req.headers);
                        const client = new c8yClientLib.Client(auth, baseUrl);
                        if (process.env.APPLICATION_KEY) {
                            const header = {'X-Cumulocity-Application-Key': process.env.APPLICATION_KEY};
                            client.core.defaultHeaders = Object.assign(header, client.core.defaultHeaders);
                        }
                        client.user.current().then(({data: currentUser}) => {
                            const hasRoles = client.user.hasAllRoles(currentUser, roles);
                            if (hasRoles) {
                                send([msg, null, {payload: currentUser}]);
                            } else {
                                send([null, msg, {payload: currentUser}]);
                            }
                        }, error => {
                            done(error);
                        });
                    } catch (e) {
                        done(e);
                    }
                } else {
                    done('No request headers found');
                }
            });
        } catch (e) {
            node.error(e, "Failed to parse roles array");
        }
    }
    RED.nodes.registerType("c8y-check-roles", C8yCheckRolesNode);
}
