cc.Class({
    extends: cc.Component,

    properties: {
        starPrefab: {
            default: null,
            type: cc.Prefab,
        },

        maxStarDuration: 0,
        minStarDuration: 0,

        ground: {
            default: null,
            type: cc.Node,
        },

        player: {
            default: null,
            type: cc.Node,
        },

        scoreDisplay: {
            default: null,
            type: cc.Label,
        },

        resultScore: {
            default: null,
            type: cc.Label
        },

        scoreAudio: {
            default: null,
            type: cc.AudioClip,
        },

        menu: {
            default: null,
            type: cc.Node,
        },

        result: {
            default: null,
            type: cc.Node,
        }
    },

    onLoad() {
        this.Player = this.player.getComponent('Player');
        this.groundY = this.ground.y + this.ground.height / 2;

        this.timer = 0;
        this.startDuration = 0;
        this.score = 0;
    },

    spawnNewStar() {
        const newStar = cc.instantiate(this.starPrefab);
        this.node.addChild(newStar);
        newStar.setPosition(this.getNewStarPosition());
        newStar.getComponent('Star').game = this;

        this.startDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },

    getNewStarPosition() {
        const randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
        const randX = (Math.random() - 0.5) * 2 * this.node.width / 2;

        return cc.v2(randX, randY);
    },

    update(dt) {
        if (!this.running) return;

        if (this.timer > this.startDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    },

    gainScore() {
        this.score += 1;
        this.scoreDisplay.string = `Score: ${this.score}`;
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    gameOver() {
        this.running = false;
        this.player.stopAllActions();

        // score calculate
        this.resultScore.string = `Score: ${this.score}`;

        // pullup the result page
        const move = cc.moveBy(1, 0, -960).easing(cc.easeBackIn());
        const cb = cc.callFunc(function () {
            // reset the score
            this.scoreDisplay.string = 'Score: 0';
        }.bind(this));

        this.result.runAction(cc.sequence(move, cb));

        // remove all stars
        const compos = this.node.getComponentsInChildren('Star');
        compos.forEach(cmp => cmp.node.destroy());
    },

    runGame() {
        this.score = 0;
        this.running = true;
        this.spawnNewStar();
        this.Player.startJump();
    },

    gameStart() {
        // pullup the menu page
        const move = cc.moveBy(1, 0, 960).easing(cc.easeBackOut());

        // start the game
        const cb = cc.callFunc(function () {
            this.runGame();
        }.bind(this));

        this.menu.runAction(cc.sequence(move, cb));
    },

    gameReStart() {
        // pullup the menu page
        const move = cc.moveBy(1, 0, 960).easing(cc.easeBackOut());

        // start the game
        const cb = cc.callFunc(function () {
            this.runGame();
        }.bind(this));

        this.result.runAction(cc.sequence(move, cb));
    }
});
