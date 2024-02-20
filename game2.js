const arrow = document.getElementById('arrow');
const scoreDisplay = document.getElementById('score');
let score = 0;

const directions = ['↑', '↓', '←', '→'];
let currentDirection = '';

function setNewDirection() {
    const randomIndex = Math.floor(Math.random() * directions.length);
    currentDirection = directions[randomIndex];
    arrow.textContent = currentDirection;
}

function updateScore(isCorrectSwipe) {
    score += isCorrectSwipe ? 1 : -1;
    scoreDisplay.textContent = `Score: ${score}`;
}

function detectSwipeDirection(touchStart, touchEnd) {
    const xDiff = touchEnd.x - touchStart.x;
    const yDiff = touchEnd.y - touchStart.y;

    if (Math.abs(xDiff) > Math.abs(yDiff)) { // Horizontal swipe
        if (xDiff > 0) return '→';
        else return '←';
    } else { // Vertical swipe
        if (yDiff > 0) return '↓';
        else return '↑';
    }
}

let touchStart = {};

arrow.addEventListener('touchstart', e => {
    const touch = e.touches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
});

arrow.addEventListener('touchend', e => {
    const touch = e.changedTouches[0];
    const touchEnd = { x: touch.clientX, y: touch.clientY };
    const swipeDirection = detectSwipeDirection(touchStart, touchEnd);
    
    if (swipeDirection === currentDirection) {
        updateScore(true);
    } else {
        updateScore(false);
    }
    setNewDirection();
});

// Initialize game
setNewDirection();
