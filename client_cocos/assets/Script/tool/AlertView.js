/**
 * 
 */
cc.Class({
    extends: cc.Component,

    properties: {
        labelMsg: cc.Label,

        btnCancel: cc.Button,
        btnOK: cc.Button,
    },

    // use this for initialization
    onLoad: function () {
        this.btnCancel.node.on('click', this.dismiss, this);
        this.btnOK.node.on('click', this.dismiss, this);
    },

    dismiss: function () {
        this.node.removeFromParent();
    }
});
