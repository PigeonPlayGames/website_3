document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('gameArea');
    const paddle = document.getElementById('paddle');
    const ball = document.getElementById('ball');
    let scoreDisplay = document.createElement('div');
    let levelDisplay = document.createElement('div');
    gameArea.appendChild(scoreDisplay);
    gameArea.appendChild(levelDisplay);

    let gameWidth = gameArea.clientWidth;
    let paddleWidth = paddle.offsetWidth;
    let paddleX = (gameWidth - paddleWidth) / 2;
    let ballX = paddleX + paddleWidth / 2 - ball.offsetWidth / 2;
    let ballY = paddle.offsetTop - ball.offsetHeight;
    let dx = 0; // Initially, the ball does not move
    let dy = 0; // Initially, the ball does not move
    let score = 0;
    let level = 1;
    let isGameStarted = false;

    scoreDisplay.style.color = 'white';
    scoreDisplay.style.position = 'absolute';
    scoreDisplay.style.top = '10px';
    scoreDisplay.style.left = '10px';
    levelDisplay.style.color = 'white';
    levelDisplay.style.position = 'absolute';
    levelDisplay.style.top = '10px';
    levelDisplay.style.right = '10px';

    function updateScoreAndLevel() {
        scoreDisplay.textContent = `Score: ${score}`;
        levelDisplay.textContent = `Level: ${level}`;
    }

    updateScoreAndLevel();

    window.addEventListener('resize', () => {
        gameWidth = gameArea.clientWidth;
        paddleWidth = paddle.offsetWidth;
        paddleX = Math.min(paddleX, gameWidth - paddleWidth);
        ballX = Math.min(ballX, gameWidth - ball.offsetWidth);
        paddle.style.left = `${paddleX}px`;
        ball.style.left = `${ballX}px`;
    });

    gameArea.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const touchX = e.touches[0].clientX;
        const gameAreaRect = gameArea.getBoundingClientRect();
        paddleX = touchX - gameAreaRect.left - paddleWidth / 2;
        if (paddleX < 0) paddleX = 0;
        if (paddleX + paddleWidth > gameWidth) paddleX = gameWidth - paddleWidth;
        paddle.style.left = `${paddleX}px`;
    }, { passive: false });

    function startGame() {
        if (!isGameStarted) {
            dx = 2; // Set initial ball movement speed
            dy = -2;
            isGameStarted = true; // Prevents the game from restarting while running
            updateGame(); // Start or continue the game loop
        }
    }

    document.addEventListener('click', startGame);
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' && !isGameStarted) {
            startGame();
        }
    });

    function updateGame() {
        if (!isGameStarted) return; // Stop the function if the game hasn't started

        ballX += dx;
        ballY += dy;

        // Collision detection with game area bounds
        if (ballX <= 0 || ballX + ball.offsetWidth >= gameWidth) dx = -dx;
        if (ballY <= 0) dy = -dy;
        if (ballY + ball.offsetHeight >= gameArea.clientHeight) {
            alert("Game Over!");
            document.location.reload(); // Restart the game
        }

        // Collision detection with the paddle
        if (ballX > paddleX && ballX < paddleX + paddleWidth && ballY + ball.offsetHeight >= paddle.offsetTop) {
            dy = -dy;
        }

        ball.style.left = `${ballX}px`;
        ball.style.top = `${ballY}px`;

        requestAnimationFrame(updateGame); // Continues the game loop
    }
});
                          
