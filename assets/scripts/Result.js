cc.Class({
    extends: cc.Component,

    properties: {
        game: {
            default: null,
            type: cc.Node,
        }
    },

    onDestroy() {
        if (this.btn) {
            this.btn.off(cc.Node.EventType.TOUCH_START, this.onGameReStart, this);
        }
    },

    onLoad() {
        const btn = this.node.getChildByName('ResultBtn');
        this.btn = btn;
        btn.on(cc.Node.EventType.TOUCH_START, this.onGameReStart, this);
    },

    onGameReStart() {
        const game = this.game.getComponent('Game');
        game.gameReStart();
    }
});
