// Collision detection
function rectangularCollision({rect1, rect2}) {
    return ((rect1.attackBox.position.x + rect1.attackBox.width) >= rect2.position.x 
        && rect1.attackBox.position.x <= (rect2.position.x + rect2.width)
        && (rect1.attackBox.position.y + rect1.attackBox.height) >= rect2.position.y 
        && rect1.attackBox.position.y <= (rect2.position.y + rect2.height));   
}

function determineWinner({p1, p2, timerId}) {
    clearTimeout(timerId)
    message.style.display = 'flex'
    if (p1.health === p2.health) {
        message.innerHTML = 'Tie!'
    }
    if (p1.health > p2.health) {
        message.innerHTML = 'P1 Wins!'
    }
    if (p1.health < p2.health) {
        message.innerHTML = 'P2 Wins!'
    }
}

// Timer Function
function decreaseTimer() {
    if(counter > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        counter--
        timer.innerHTML = counter;
    }
    if (counter === 0) {
        determineWinner({p1, p2, timerId})
    }
}

// Animation Function
function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    p1.update()
    p2.update()

    // Free movement
    if(keys.a.isPressed && p1.lastKey === 'a') {
        p1.velocity.x = -5
    } else if (keys.d.isPressed && p1.lastKey === 'd') {
        p1.velocity.x = 5
    }

    if(keys.ArrowLeft.isPressed && p2.lastKey === 'ArrowLeft') {
        p2.velocity.x = -5
    } else if (keys.ArrowRight.isPressed && p2.lastKey === 'ArrowRight') {
        p2.velocity.x = 5
    } 

    // Collision Detection
    if (rectangularCollision({rect1: p1, rect2: p2}) && p1.isAttacking) {
        p1.isAttacking = false
        p2.health -= 5
        healthP2.style.width = (p2.health) + '%' 
    }
    if (rectangularCollision({rect1: p2, rect2: p1}) && p2.isAttacking) {
        p2.isAttacking = false
        p1.health -= 5
        healthP1.style.width = (p1.health) + '%' 
    }

    // End Game - Health
    if (p1.health <= 0 || p2.health <= 0) {
        determineWinner({p1, p2, timerId})
    }
}
