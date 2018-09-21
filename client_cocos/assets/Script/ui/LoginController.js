var GateConnector = require("../protocol/GateConnector");
require("../pomelo/pomelo-client");

cc.Class({
    extends: cc.Component,

    properties: {

        buttonGuestLogin: {
            default: null,
            type: cc.Button
        },
    },

    // use this for initialization
    onLoad: function () {
        this.buttonGuestLogin.node.on('click', this.btnGuestLoginTap, this);
    },

    // called every frame
    update: function (dt) {
    },

    btnGuestLoginTap: function () {
        // var token = cc.sys.localStorage.getItem('token');
        // if (token) {
        //     GateConnector.gateRefreshToken('39.108.83.192', 3101, function (data) {
        //         cc.director.loadScene('Home');
        //     });
        // } else {
        var self = this;
        GateConnector.gateGuestLogin('127.0.0.1', 3101, function (data) {
            // cc.director.loadScene('Home');

            GateConnector.connectToConnector(function () {
                console.log('Connect Success');
            });

            //直接进入游戏场景
            self.node.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(function () {
                self.buttonBrnnRoomTap();
            })));

        });
        // }
    },

    buttonBrnnRoomTap: function () {
        var param = {
            'token': pomelo.token,
            'rtype': 'brnn'
        };
        pomelo.request('connector.entryHandler.joinRoom', param, function (data) {
            cc.director.loadScene('BrnnRoom');
        });
    },
});
