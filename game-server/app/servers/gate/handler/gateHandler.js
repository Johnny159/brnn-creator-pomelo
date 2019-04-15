var UToken = require('../../../game/UToken.js');
var GMResponse = require('../../../game/GMResponse.js');
var logger = require('pomelo-logger').getLogger('pomelo', __filename);

module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
    this.app = app;
};

var handler = Handler.prototype;

handler.queryEntry = function (msg, session, next) {
    var userid = msg.userid;
    if (!userid) {
        next(null, {
            code: 500
        });
        return;
    }

    var connectors = this.app.getServersByType('connector');
    if (!connectors || connectors.length === 0) {
        next(null, {
            code: 500
        });
        return;
    }
    var res = connectors[0];
    next(null, {
        code: 200,
        host: res.host,
        port: res.clientPort
    });
};

handler.guestLogin = function (msg, session, next) { // 游客登陆
    var sqlHelper = this.app.get('sqlHelper');
    sqlHelper.guestLogin(function (err, userinfo) {
        logger.info("游客登陆信息 userinfo =", userinfo);
        var tokenString = new UToken(userinfo.userid).encrypt();
        if (err) {
            next(null, {
                code: -101,
                msg: '游客登录失败，请重试'
            });
        } else {
            var connectors = this.app.getServersByType('connector');
            if (!connectors || connectors.length === 0) {
                var response = new GMResponse(-103, '没有找到connector');
                next(null, response);
                return;
            }
            var res = connectors[0];
            var data = {
                userinfo: userinfo,
                token: tokenString,
                localConnector: {host: res.host, port: res.clientPort},
                remoteConnector: {host: '39.108.83.192', port: res.clientPort},
            };
            var response = new GMResponse(1, 'ok', data);
            next(null, response);
        }
    }.bind(this));
};


handler.refreshToken = function (msg, session, next) {
    var tokenStr = msg.token;
    var token = new UToken();
    console.log(tokenStr);
    token.decrypt(tokenStr);
    if (token.isValid() == false) {
        next(null, new GMResponse(-101, '非法token'));
        return;
    }
    token.refresh();
    var sqlHelper = this.app.get('sqlHelper');
    sqlHelper.queryUserInfo(token.userid, function (err, userinfo) {
        if (userinfo) {
            // get all connectors
            var connectors = this.app.getServersByType('connector');
            if (!connectors || connectors.length === 0) {
                var response = new GMResponse(-103, '没有找到connector');
                next(null, response);
                return;
            }
            // here we just start `ONE` connector server, so we return the connectors[0]
            var res = connectors[0];
            var tokenString = token.encrypt();
            var data = {
                userinfo: userinfo,
                token: tokenString,
                localConnector: {host: res.host, port: res.clientPort},
                remoteConnector: {host: '39.108.83.192', port: res.clientPort},
            };
            var response = new GMResponse(1, 'ok', data);
            next(null, response);
        } else {
            next(null, new GMResponse(-102, '无此用户数据'));
        }
    }.bind(this));
};