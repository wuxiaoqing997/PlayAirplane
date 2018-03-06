class GuaLabel {
    constructor(game, text) {
        this.game = game
        this.text = text
        this.type = 'label'
        this.life = true
    }
    static new(game, text) {
        return new this(game, text)
    }
    draw() {
        this.game.context.fillStyle = "black"
        this.game.context.fillText(this.text, 100, 190)
    }
    update() {

    }
}

class SceneTitle extends GuaScene {
    constructor(game) {
        super(game)
        log('this.elements', this.elements)
        this.keys = Object.keys(this.elements)
        var label = GuaLabel.new(game, '按 k 开始游戏，游戏按键为awsd，j为发射子弹')
        this.addElement(label)
        game.registerAction('k', function(){
            var s = Scene.new(game)
            game.replaceScene(s)
        })
        log('this.elements', this.elements)

        /*var ps = GuaParticleSystem.new(game)
        this.addElement(ps)*/
    }
}
