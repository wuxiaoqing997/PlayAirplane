class GuaImage {
    constructor(game, name) {
        this.game = game
        this.texture = game.textureByName(name)
        // log('this.texture', this.texture)

        this.life = true
        this.type = name

        this.x = 0
        this.y = 0
        this.w = this.texture.width
        this.h = this.texture.height
    }
    static new(game, name) {
        var i = new this(game, name)
        return i
    }
    draw() {
        this.game.drawImage(this)
    }
    update() {

    }
    aInb(x, x1, x2) {
        return x >= x1 && x <= x2
    }
    collide(img) {
        var a = this
        var b = img
        if (this.life === false || img.life === false) {
            // 检测是否死亡
        } else if (this.aInb(a.x, b.x, b.x + b.w) || this.aInb(b.x, a.x, a.x + a.w)) {
            if (this.aInb(a.y, b.y, b.y + b.h) || this.aInb(b.y, a.y, a.y + a.h)) {
                return true
            }
        }
        return false
    }
    kill(img) {
        this.life = false
        img.life = false
    }
}
