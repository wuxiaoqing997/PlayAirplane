class SceneEnd extends GuaScene {
    constructor(game) {
        super(game)
        game.registerAction('r', function(){
            var s = SceneTitle.new(game)
            game.replaceScene(s)
        })
    }
    draw() {
        // draw label
        this.game.context.fillText('game over！', 75, 200)
        this.game.context.fillText('按 r 返回标题界面', 100, 290)
    }
}
