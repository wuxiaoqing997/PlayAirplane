class GuaScene {
    constructor(game) {
        this.game = game
        this.debugModeEnabled = true
        // this.elements = []
        this.elements = {
            'sky': [],
            'cloud': [],
            'player': [],
            'enemy': [],
            'playerBullet': [],
            'enemiesBullet': [],
            'boom': [],
            'label': [],
            'particleSystem': [],
        }
        this.keys = Object.keys(this.elements)
        // log('this.keys', this.keys)
    }
    static new(game) {
        var i = new this(game)
        return i
    }
    addElement(img) {
        img.scene = this
        // log('img.type', img.type)
        var list = this.elements[img.type]
        // log('list', list)
        list.push(img)
        // log('new list', list)
    }
    draw() {
        for (var i = 0; i < this.keys.length; i++) {
            // log('hhh', this.elements.length)
            var key = this.keys[i]
            var list = this.elements[key]
            // log('list', list)
            for (var j = 0; j < list.length; j++) {
                var e = list[j]
                if (e.life) {
                    // this.game.drawImage(e)
                    e.draw()
                }
            }
        }
    }
    update() {
        if (this.debugModeEnabled) {
            for (var i = 0; i < this.elements.length; i++) {
                var e = this.elements[i]
                e.debug && e.debug()
            }
        }
        for (var i = 0; i < this.keys.length; i++) {
            var key = this.keys[i]
            var list = this.elements[key]
            // log('list', list)
            for (var j = 0; j < list.length; j++) {
                var e = list[j]
                // log('e', e)
                e.update()
            }
        }
    }
}
