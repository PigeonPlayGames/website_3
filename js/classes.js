// Sprite (Graphics) 
class Sprite {
    constructor({position, imageSrc, scale=1, framesMax = 1}) {
        this.position = position
        this.width = 50
        this.height = 100
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        // Sprite animation
        this.framesMax = framesMax
        this.framesCurrent = 0
        // Frame rate
        this.framesHold = 5
        this.framesElapsed = 0
    }

    draw() {
        c.drawImage(
            this.image,
            // Cropping
            this.framesCurrent * (this.image.width/ this.framesMax),
            0,
            this.image.width/ this.framesMax,
            this.image.height,
            // Drawing 
            this.position.x, 
            this.position.y, 
            this.image.width / this.framesMax * this.scale,
            this.image.height * this.scale)
    }

    update() {
        this.draw()
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
            if(this.framesCurrent < this.framesMax-1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }
}

// Player Character
class Fighter {
    constructor({position, velocity, color='red', offset}) {
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 100
        this.color = color
        this.lastKey
        this.isAttacking = false
        this.attackBox = {
            position : {
                x: this.position.x,
                y: this.position.y
            },
            width : 100,
            height : 50,
            offset,
            color : 'green'
        }
        this.health = 100
    }

    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
        // Weapon
        if (this.isAttacking) {
            c.fillStyle = this.attackBox.color
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        }
    }

    update() {
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        
        if (this.position.y + this.height + this.velocity.y >= canvas.height-95) {
            this.velocity.y = 0
        } else { 
            this.velocity.y += gravity
        }
    }
}