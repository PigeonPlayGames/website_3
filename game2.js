const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let bird = {
    x: 50,
    y: canvas.height / 2,
    size: 20,
    gravity: 0.6,
    lift: -15,
    velocity: 0
};

let obstacles = [];
let powerUps = [];
let score = 0;
let frames = 0;
let gameOver = false;

function drawBird() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.size, 0, Math.PI * 2);
    ctx.fill();
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.velocity *= 0.9; // Air resistance
    bird.y += bird.velocity;

    if (bird.y >= canvas.height - bird.size) {
        bird.y = canvas.height - bird.size;
        bird.velocity = 0;
    }

    if (bird.y <= bird.size) {
        bird.y = bird.size;
        bird.velocity = 0;
    }
}

function handleTouch() {
    bird.velocity += bird.lift;
}

function generateObstacles() {
    if (frames % 150 === 0) { // Adjust frequency based on score for difficulty
        let gapSize = 200 - Math.min(score, 150); // Decrease gap size to increase difficulty
        let obstaclePosition = Math.random() * (canvas.height - gapSize - 200) + 100;
        obstacles.push({
            x: canvas.width,
            topY: obstaclePosition - gapSize,
            bottomY: obstaclePosition + gapSize,
            width: 30
        });
    }
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = 'green';
        ctx.fillRect(obstacle.x, 0, obstacle.width, obstacle.topY);
        ctx.fillRect(obstacle.x, obstacle.bottomY, obstacle.width, canvas.height - obstacle.bottomY);
    });
}

function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x -= 3; // Move obstacles to the left
    });
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

function checkCollision() {
    obstacles.forEach(obstacle => {
        if (bird.x + bird.size > obstacle.x && bird.x - bird.size < obstacle.x + obstacle.width) {
            if (bird.y - bird.size < obstacle.topY || bird.y + bird.size > obstacle.bottomY) {
                gameOver = true;
            }
        }
    });
}

function generatePowerUps() {
    if (frames % 500 === 0) { // Generate power-ups less frequently
        powerUps.push({
            x: canvas.width,
            y: Math.random() * canvas.height,
            size: 15
        });
    }
}

function drawPowerUps() {
    powerUps.forEach(powerUp => {
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(powerUp.x, powerUp.y, powerUp.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

function updatePowerUps() {
    powerUps.forEach(powerUp => {
        powerUp.x -= 3; // Move power-ups to the left
    });
    powerUps = powerUps.filter(powerUp => powerUp.x + powerUp.size > 0);
}

function checkPowerUpCollision() {
    powerUps.forEach((powerUp, index) => {
        let distance = Math.sqrt((powerUp.x - bird.x) ** 2 + (powerUp.y - bird.y) ** 2);
        if (distance < powerUp.size + bird.size) {
            // Implement power-up effect (e.g., temporary invincibility)
            powerUps.splice(index, 1);
            score += 10; // Example effect: increase score
        }
    });
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 20, 30);
}

function updateGame() {
    frames++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    generateObstacles();
    drawObstacles();
    updateObstacles();

    generatePowerUps();
    drawPowerUps();
    updatePowerUps();

    drawBird();
    updateBird();

    checkCollision();
    checkPowerUpCollision();

    if (!gameOver) {
        drawScore();
        score++;
        requestAnimationFrame(updateGame);
    } else {
        ctx.fillStyle = 'red';
        ctx.font = '48px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
    }
}

canvas.addEventListener('touchstart', handleTouch);

updateGame();
