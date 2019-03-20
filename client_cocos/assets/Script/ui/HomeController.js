/**
 * 暂时废弃掉
 */
var GateConnector = require("../protocol/GateConnector");
require("../pomelo/pomelo-client");

cc.Class({
    extends: cc.Component,

    properties: {
        buttonBrnnRoom: cc.Button,
        roomCreated: null,
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        GateConnector.connectToConnector(function () {
            console.log('Connect to connector Success');
            this.node.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(function () {
                self.buttonBrnnRoomTap();
            })));
        });
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

    buttonCreateNNTap: function () {
        var param = {
            'token': pomelo.token,
            'rtype': 'jdnn',
            'userid': pomelo.userinfo.userid
        };
        var self = this;
        pomelo.request('connector.entryHandler.createRoom', param, function (data) {
            var roomid = data.data.roomid;
            self.roomid = roomid;
        });
    },

    buttonJoinNNTap: function () {
        var param = {
            userid: pomelo.userinfo.userid,
            roomid: this.roomid,
            rtype: 'jdnn',
            token: pomelo.token
        };
        console.log(param);
        pomelo.request('connector.entryHandler.joinRoom', param, function (data) {
            console.log(data);
        });
    },

    buttonReadyNNTap: function () {
        var param = {
            userid: pomelo.userinfo.userid,
            roomid: this.roomid,
            ready: 1
        };
        pomelo.request('jdnn.jdnnHandler.ready', param, function (data) {
            console.log(data);
        });
    },
});
