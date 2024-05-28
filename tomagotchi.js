const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const BALL_RADIUS = 10;
const balls = [];
const walls = [];
let animationFrameId;
let gameRunning = false;

document.getElementById('startButton').addEventListener('click', () => {
    if (!gameRunning) {
        startGame();
    }
});

canvas.addEventListener('click', (event) => {
    if (gameRunning) {
        createWall(event.offsetX, event.offsetY);
    }
});

function startGame() {
    gameRunning = true;
    balls.push(createBall());
    balls.push(createBall());
    animate();
}

function createBall() {
    return {
        x: canvas.width / 2,
        y: canvas.height / 2,
        dx: (Math.random() < 0.5 ? -1 : 1) * (2 + Math.random() * 3),
        dy: (Math.random() < 0.5 ? -1 : 1) * (2 + Math.random() * 3)
    };
}

function createWall(x, y) {
    walls.push({ x, y, length: 0, growing: true });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBalls();
    drawWalls();
    updateBalls();
    updateWalls();
    animationFrameId = requestAnimationFrame(animate);
}

function drawBalls() {
    ctx.fillStyle = 'red';
    balls.forEach(ball => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}

function drawWalls() {
    ctx.strokeStyle = 'white';
    walls.forEach(wall => {
        ctx.beginPath();
        ctx.moveTo(wall.x, wall.y);
        ctx.lineTo(wall.x + wall.length, wall.y);
        ctx.stroke();
        ctx.closePath();
    });
}

function updateBalls() {
    balls.forEach(ball => {
        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.x + BALL_RADIUS > canvas.width || ball.x - BALL_RADIUS < 0) {
            ball.dx = -ball.dx;
        }
        if (ball.y + BALL_RADIUS > canvas.height || ball.y - BALL_RADIUS < 0) {
            ball.dy = -ball.dy;
        }

        walls.forEach(wall => {
            if (ball.x > wall.x && ball.x < wall.x + wall.length && Math.abs(ball.y - wall.y) < BALL_RADIUS) {
                ball.dy = -ball.dy;
            }
        });
    });
}

function updateWalls() {
    walls.forEach(wall => {
        if (wall.growing) {
            wall.length += 2;
            if (wall.length > canvas.width / 2) {
                wall.growing = false;
            }
        }
    });
}
