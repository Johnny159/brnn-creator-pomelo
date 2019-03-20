var GateConnector = require("../protocol/GateConnector");
require("../pomelo/pomelo-client");

cc.Class({
    extends: cc.Component,

    properties: {
        buttonGuestLogin: cc.Button
    },

    // use this for initialization
    onLoad: function () { },

    onClick: function(event, customEventData){
        if(customEventData == "btn_guestLogin"){                                                  // 游客登陆
            var self = this;
            GateConnector.gateGuestLogin('127.0.0.1', 3101, function (data) {
                GateConnector.connectToConnector(function () {
                    console.log('connectToConnector');
                    self.node.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(function () {  // 直接进入游戏场景
                        var param = {
                            'token': pomelo.token,
                            'rtype': 'brnn'
                        };
                        pomelo.request('connector.entryHandler.joinRoom', param, function (data) { // 请求进入房间
                            cc.director.loadScene('BrnnRoom');
                        });
                    })));
                });
            });
        }
    }
});
