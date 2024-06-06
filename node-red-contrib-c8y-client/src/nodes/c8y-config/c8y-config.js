
module.exports = function(RED) {
    function GetInternalIdCallNode(config) {
        RED.nodes.createNode(this,config);
        this.c8ytenant = config.c8ytenant;
        this.c8yurl = config.c8yurl;
        this.c8yapplicationkey = config.c8yapplicationkey;
    }
    RED.nodes.registerType("c8yconfig", GetInternalIdCallNode, {
      credentials: {
        c8yuser: { type: "text" },
        c8ypassword: { type: "password" },
      },
    });
}

