cc.Class({
    extends: cc.Component,

    properties: {
        labelMsg: cc.Label,
    },

    // use this for initialization
    onLoad: function () { },

    onClick: function(event, customEventData){
        if(customEventData == "btn_ok"){
            this.node.removeFromParent();
        }

        if(customEventData == "btn_cancel"){
            this.node.removeFromParent();
        }
    },
});
