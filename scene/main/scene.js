const config = {
    player_speed: 10,
    cloud_speed: 1,
    enemy_speed: 5,
    bullet_speed: 5,
    fire_cooldown: 9,
}

class Bullet extends GuaImage {
    constructor(game, type, bulletSpeed) {
        super(game, 'bullet')
        this.setup(bulletSpeed)
        this.type = type
    }
    static new(game, name, bulletSpeed) {
        var i = new this(game, name, bulletSpeed)
        return i
    }
    setup(bulletSpeed) {
        // log('bulletSpeed', bulletSpeed)
        this.speed = bulletSpeed || config.bullet_speed
    }
    update() {
        if (!this.life) {
            return
        }
        var elements = this.scene.elements

        if (this.type === 'playerBullet') {
            this.y -= this.speed
            // 判断 己方子弹 和 敌方飞机 的碰撞
            var enemies = elements.enemy
            // log('enemies', enemies)
            for (var i = 0; i < enemies.length; i++) {
                var enemy = enemies[i]
                if (this.collide(enemy)) {
                    log('己方子弹 与 敌方飞机 相撞')
                    this.kill(enemy)
                    var ps = GuaParticleSystem.new(this.game)
                    ps.x = enemy.x
                    ps.y = enemy.y
                    this.scene.addElement(ps)
                }
            }

            // 判断 己方子弹 和 敌方子弹 的碰撞
            var enemiesBullet = elements.enemiesBullet
            // log('enemies', enemies)
            for (var i = 0; i < enemiesBullet.length; i++) {
                var enemy = enemiesBullet[i]
                if (this.collide(enemy)) {
                    log('己方子弹 与 敌方子弹 相撞')
                    this.kill(enemy)
                }
            }
        } else {
            this.y += this.speed
            // 判断 敌方子弹 和 己方飞机 的碰撞
            var player = elements.player
            // log('enemies', enemies)
            for (var i = 0; i < player.length; i++) {
                var enemy = player[i]
                if (this.collide(enemy)) {
                    log('敌方子弹 与 己方飞机 相撞')
                    var s = SceneEnd.new(this.game)
                    this.game.replaceScene(s)
                }
            }
        }
    }
}

class Boom extends GuaImage {
    constructor(game) {
        super(game, 'boom')
        this.setup()
        this.time = 60
    }
    setup() {
    }
    update() {
        if (!this.life) {
            return
        }

        if (this.time > 0) {
            this.time--
        }

        this.x = this.scene.player.x - this.scene.player.w / 2
        this.y = this.scene.player.y - this.h

        var elements = this.scene.elements

        // 判断 己方子弹 和 敌方飞机 的碰撞
        var enemies = elements.enemy
        // log('enemies', enemies)
        for (var i = 0; i < enemies.length; i++) {
            var enemy = enemies[i]
            if (this.collide(enemy)) {
                log('己方子弹 与 敌方飞机 相撞')
                this.kill(enemy)
                this.life = true

                var ps = GuaParticleSystem.new(this.game)
                ps.x = enemy.x
                ps.y = enemy.y
                this.scene.addElement(ps)
            }
        }

        // 判断 己方子弹 和 敌方子弹 的碰撞
        var enemiesBullet = elements.enemiesBullet
        // log('enemies', enemies)
        for (var i = 0; i < enemiesBullet.length; i++) {
            var enemy = enemiesBullet[i]
            if (this.collide(enemy)) {
                log('己方子弹 与 敌方子弹 相撞')
                this.kill(enemy)
                this.life = true
            }
        }

        if (this.time === 0) {
            this.life = false
        }
    }
}

class Player extends GuaImage {
    constructor(game) {
        super(game, 'player')
        this.setup()
    }
    setup() {
        this.w *= 0.4
        this.h *= 0.4
        this.speed = 10
        this.cooldown = 0
        this.boomdown = 0
    }
    update() {
        this.speed = config.player_speed
        if (this.cooldown > 0) {
            this.cooldown--
        }

        if (this.boomdown > 0) {
            this.boomdown--
        }

        // log('this.scene.elements', this.scene.elements)
        var elements = this.scene.elements

        // 判断 己方飞机 和 敌方飞机 的碰撞
        var enemies = elements.enemy
        // log('enemies', enemies)
        for (var i = 0; i < enemies.length; i++) {
            var enemy = enemies[i]
            if (this.collide(enemy)) {
                log('己方飞机 与 敌方飞机 相撞')
                var s = SceneEnd.new(this.game)
                this.game.replaceScene(s)
            }
        }
    }
    fire() {
        if (this.cooldown === 0) {
            this.cooldown = config.fire_cooldown
            var x = this.x + this.w / 10
            var y = this.y
            var b = Bullet.new(this.game, 'playerBullet')
            b.x = x
            b.y = y
            this.scene.addElement(b)
        }
    }
    boom() {
        if (this.cooldown === 0) {
            this.cooldown = 10
            var x = this.x
            var y = this.y
            var b = Boom.new(this.game)
            log('f' , b)
            b.x = x - this.w / 2
            b.y = y - b.h
            this.scene.addElement(b)
        }
    }
    moveLeft() {
        this.x -= this.speed
    }
    moveRight() {
        this.x += this.speed
    }
    moveUp() {
        this.y -= this.speed
    }
    moveDown() {
        this.y += this.speed
    }
}

class Enemy extends GuaImage {
    constructor(game) {
        var type = randomBetween(0, 2)
        var name = 'enemy' + type
        // log('enemy name', type, name)
        super(game, name)
        this.setup()
    }
    setup() {
        this.type = 'enemy'
        this.cooldown = 0
        this.fireCooldown = randomBetween(20, 40)
        this.speed = randomBetween(2, 5)
        this.bulletSpeed = randomBetween(1, 3) + this.speed
        this.x = randomBetween(0, 350)
        this.y = -(randomBetween(0, 200))
    }
    update() {
        if (this.life) {
            if (this.cooldown > 0) {
                this.cooldown--
            }

            this.y += this.speed
            if (this.y > 600) {
                this.setup()
            }

            // 自动开火
            this.fire()
        }
    }
    fire() {
        if (this.cooldown === 0) {
            this.cooldown = this.fireCooldown
            var x = this.x + this.w / 10
            // log('this.x', this.x, this.w)
            var y = this.y
            var b = Bullet.new(this.game, 'enemiesBullet', this.bulletSpeed)
            b.x = x
            b.y = y
            this.scene.addElement(b)
        }
    }
}

class Cloud extends GuaImage {
    constructor(game) {
        super(game, 'cloud')
        this.setup()
    }
    setup() {
        this.speed = 1
        this.x = randomBetween(0, 350)
        this.y = -(randomBetween(0, 200))
    }
    update() {
        this.speed = config.cloud_speed
        this.y += this.speed
        if (this.y > 600) {
            this.setup()
        }

    }
}

class Scene extends GuaScene {
    constructor(game) {
        super(game)
        this.setup()
        this.setupInputs()
    }
    setup() {
        this.numberOfEnemies = 10
        this.sky = GuaImage.new(this.game, 'sky')
        this.sky.w = 400
        this.sky.h = 500

        this.cloud = Cloud.new(this.game)

        this.player = Player.new(this.game)
        this.player.x = 100
        this.player.y = 350

        this.addElement(this.sky)
        this.addElement(this.cloud)
        this.addElement(this.player)

        this.addEnemies()
    }
    addEnemies() {
        var es = []
        for (var i = 0; i < this.numberOfEnemies; i++) {
            var e = Enemy.new(this.game)
            // log('enemy speed', e.speed)
            es.push(e)
            this.addElement(e)
        }
        this.enemies = es
    }
    setupInputs() {
        var g = this.game
        var s = this
        g.registerAction('a', function(){
            s.player.moveLeft()
        })
        g.registerAction('d', function(){
            s.player.moveRight()
        })
        g.registerAction('w', function(){
            s.player.moveUp()
        })
        g.registerAction('s', function(){
            s.player.moveDown()
        })
        g.registerAction('j', function(){
            s.player.fire()
        })
    }
    update() {
        super.update()
    }
}
