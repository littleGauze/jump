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
            this.btn.off(cc.Node.EventType.TOUCH_START, this.onGameStart, this);
        }
    },

    onLoad() {
        const btn = this.node.getChildByName('MenuBtn');
        this.btn = btn;
        btn.on(cc.Node.EventType.TOUCH_START, this.onGameStart, this);
    },

    onGameStart() {
        const game = this.game.getComponent('Game');
        game.gameStart();
    }
});
