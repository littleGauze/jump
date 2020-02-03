
cc.Class({
    extends: cc.Component,

    properties: {
        pickRadius: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    getPlayerDistance() {
        const playerPos = this.game.player.getPosition();
        const dist = this.node.position.sub(playerPos).mag();
        return dist;
    },

    onPicked() {
        this.game.spawnNewStar();
        this.game.gainScore();
        this.node.destroy();
    },

    start() {

    },

    update(dt) {
        if (this.getPlayerDistance() < this.pickRadius) {
            this.onPicked();
            return;
        }

        const opacityRatio = 1 - this.game.timer / this.game.startDuration;
        const minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
    },
});
