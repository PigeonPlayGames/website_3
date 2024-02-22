const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const healthP1 = document.querySelectorAll('.health')[0]
const healthP2 = document.querySelectorAll('.health')[1]
const timer = document.querySelector('.timer')
const message = document.querySelector('.message')

let counter = 10
let timerId

canvas.width = 1024;
canvas.height = 576;
const gravity = 0.7

const keys = {
    // p1
    'w' : {isPressed : false},
    'a' : {isPressed : false},
    's' : {isPressed : false},
    'd' : {isPressed : false},
    // p2
    'ArrowUp' : {isPressed : false},
    'ArrowLeft' : {isPressed : false},
    'ArrowDown' : {isPressed : false},
    'ArrowRight' : {isPressed : false}
}

// Background
const background = new Sprite({
    position: {
        x: 0, y: 0
    },
    imageSrc: './img/background.png'
})

// Shop
const shop = new Sprite({
    position: {
        x: 600, y: 223 
    },
    imageSrc: './img/shop.png',
    scale: 2,
    framesMax: 6
})
// Players
const p1 = new Fighter({
    position: {
        x: 100, y: 50
    },
    imageSrc: './img/samuriMack.png',
    velocity: {
        x: 0, y: 0
    },
    offset: {
        x: 0, y:0
    }
})

const p2 = new Fighter({
    position: {
        x: 300, y: 100
    },
    imageSrc: './img/kenji.png',
    velocity: {
        x: 0, y: 0
    },
    offset: {
        x: -50, y:0
    }
})

// Timer
decreaseTimer()
// Animation frame
animate()


// ==================================== Event Listeners ================================
window.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'w':
            p1.velocity.y = -20
            keys.w.isPressed = true
            p1.lastKey = 'w'
            break
        case 'a':
            keys.a.isPressed = true
            p1.lastKey = 'a'
            break
        case 's':
            p1.isAttacking = true
            keys.s.isPressed = true
            p1.lastKey = 's'
            break
        case 'd':
            keys.d.isPressed = true
            p1.lastKey = 'd'
            break
        // Player 2
        case 'ArrowUp':
            p2.velocity.y = -20
            keys.ArrowUp.isPressed = true
            p2.lastKey = 'ArrowUp'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.isPressed = true
            p2.lastKey = 'ArrowLeft'
            break
        case 'ArrowDown':
            p2.isAttacking = true
            keys.ArrowDown.isPressed = true
            p2.lastKey = 'ArrowDown'
            break
        case 'ArrowRight':
            keys.ArrowRight.isPressed = true
            p2.lastKey = 'ArrowRight'
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch(event.key) {
        case 'w':
            keys.w.isPressed = false
            break
        case 'a':
            p1.velocity.x = 0
            keys.a.isPressed = false
            break
        case 's':
            p1.isAttacking = false
            p1.lastKey = 's'
            keys.s.isPressed = false
            break
        case 'd':
            p1.velocity.x = 0
            keys.d.isPressed = false
            break
        // p1.velocity.x = 0
        case 'ArrowUp':
            keys.ArrowUp.isPressed = false
            break
        case 'ArrowLeft':
            p2.velocity.x = 0
            keys.ArrowLeft.isPressed = false
            break
        case 'ArrowDown':
            p2.isAttacking = false
            p2.lastKey = 'ArrowDown'
            keys.ArrowDown.isPressed = false
            break
        case 'ArrowRight':
            p2.velocity.x = 0
            keys.ArrowRight.isPressed = false
            break
    }
})
