cc.Class({
    extends: cc.Component,

    properties: {
        jumpHeight: 0,
        jumpDuration: 0,
        maxMoveSpeed: 0,
        accel: 0,

        jumpAudio: {
            default: null,
            type: cc.AudioClip,
        },

        game: {
            default: null,
            type: cc.Node,
        }
    },

    setJumpAction() {
        const jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        const jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        const callback = cc.callFunc(this.playJumpSound, this);

        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
    },

    playJumpSound() {
        this.jumpAudio && cc.audioEngine.playEffect(this.jumpAudio, false);
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    onLoad() {
        this.Game = this.game.getComponent('Game');
        this.accLeft = false;
        this.accRight = false;
        this.inintailPos = this.node.position;
        this.xSpeed = 0;
        this.boundary = this.node.parent.x;

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        // touch events
        this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.parent.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    },

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyDown, this);

        this.node.parent.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.parent.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    },

    onTouchStart(t) {
        this.startPos = t.getLocation();
    },

    onTouchMove(t) {
        this.currentPos = t.getLocation();
        const dirVec = this.currentPos.sub(this.startPos);
        const dir = dirVec.dot(cc.Vec2.RIGHT);

        if (dir > 0) {
            if (!this.accRight) {
                this.accLeft = false;
                this.accRight = true;
            }
        } else {
            if (!this.accLeft) {
                this.accRight = false;
                this.accLeft = true;
            }
        }
    },

    onKeyDown(evt) {
        switch (evt.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = true;
                break;
            case cc.macro.KEY.d:
                this.accRight = true;
                break;
        }
    },

    onKeyUp(evt) {
        switch (evt.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = false;
                break;
            case cc.macro.KEY.d:
                this.accRight = false;
                break;
        }
    },

    update(dt) {
        if (!this.Game.running) return;

        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }

        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }
        this.node.x = Math.min(Math.max(-this.boundary, this.node.x + this.xSpeed * dt), this.boundary);
    },

    startJump() {
        this.node.setPosition(this.inintailPos);
        this.jumpAction = this.setJumpAction();
        this.node.runAction(this.jumpAction);
    },
});
