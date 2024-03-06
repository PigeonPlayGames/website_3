document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('gameArea');
    const paddle = document.getElementById('paddle');
    const ball = document.getElementById('ball');
    const gameOverOverlay = document.getElementById('gameOverOverlay');
    const tryAgainButton = document.getElementById('tryAgainButton');
    const quitButton = document.getElementById('quitButton');
    const scoreDisplay = document.createElement('div');
    const levelDisplay = document.createElement('div');
    gameArea.appendChild(scoreDisplay);
    gameArea.appendChild(levelDisplay);

    let gameWidth = gameArea.clientWidth;
    let gameHeight = gameArea.clientHeight;
    let paddleWidth = 100;
    let paddleHeight = 20;
    let ballDiameter = 20;
    let ballX = gameWidth / 2 - ballDiameter / 2;
    let ballY = gameHeight - paddleHeight - ballDiameter - 30; // Slightly above paddle
    let dx = 2; // Ball's horizontal speed
    let dy = -2; // Ball's vertical speed
    let paddleX = gameWidth / 2 - paddleWidth / 2;
    let score = 0;
    let level = 1;

    scoreDisplay.style.color = 'white';
    levelDisplay.style.color = 'white';
    scoreDisplay.style.position = 'absolute';
    scoreDisplay.style.top = '10px';
    scoreDisplay.style.left = '10px';
    levelDisplay.style.position = 'absolute';
    levelDisplay.style.top = '10px';
    levelDisplay.style.right = '10px';

    let blocks = [];
    const blockRows = 4;
    const blockColumns = 5;
    let blocksRemaining = blockRows * blockColumns;

    function createBlocks() {
        blocksRemaining = blockRows * blockColumns;
        for (let row = 0; row < blockRows; row++) {
            for (let col = 0; col < blockColumns; col++) {
                const block = document.createElement('div');
                block.className = 'block';
                block.style.backgroundColor = 'blue';
                block.style.position = 'absolute';
                block.style.width = `${gameArea.clientWidth / blockColumns - 5}px`;
                block.style.height = '20px';
                block.style.top = `${row * 25}px`;
                block.style.left = `${col * (gameArea.clientWidth / blockColumns)}px`;
                gameArea.appendChild(block);
                blocks.push(block);
            }
        }
    }

    function movePaddle(e) {
        paddleX = e.clientX - gameArea.getBoundingClientRect().left - paddleWidth / 2;
        if (paddleX < 0) paddleX = 0;
        else if (paddleX + paddleWidth > gameWidth) paddleX = gameWidth - paddleWidth;
        paddle.style.left = `${paddleX}px`;
    }

    function updateGame() {
        ballX += dx;
        ballY += dy;

        // Wall collision
        if (ballX <= 0 || ballX + ballDiameter >= gameWidth) dx = -dx;
        if (ballY <= 0) dy = -dy;

        // Paddle collision
        if (ballX > paddleX && ballX < paddleX + paddleWidth && ballY + ballDiameter >= gameHeight - paddleHeight - 30) {
            dy = -dy;
            ballY = gameHeight - paddleHeight - ballDiameter - 30; // Prevent sticking to paddle
        }

        // Block collision
        blocks.forEach((block, index) => {
            if (block) {
                const blockRect = block.getBoundingClientRect();
                const ballRect = ball.getBoundingClientRect();

                if (
                    ballRect.left < blockRect.right &&
                    ballRect.right > blockRect.left &&
                    ballRect.top < blockRect.bottom &&
                    ballRect.bottom > blockRect.top
                ) {
                    gameArea.removeChild(block);
                    blocks[index] = null; // Mark block as removed
                    dy = -dy;
                    score += 10;
                    blocksRemaining--;
                    updateScoreAndLevel();

                    if (blocksRemaining === 0) {
                        levelUp();
                    }
                }
            }
        });

        if (ballY + ballDiameter > gameHeight) {
            // Game over
            gameOver();
        }

        ball.style.left = `${ballX}px`;
        ball.style.top = `${ballY}px`;

        requestAnimationFrame(updateGame);
    }

    function levelUp() {
        level++;
        dx *= 1.2;
        dy = Math.abs(dy) * 1.2; // Increase speed while keeping direction
        initGame(); // Re-initialize to start next level
    }

    function gameOver() {
        gameOverOverlay.style.display = 'flex';
        // Stop the game loop by not calling requestAnimationFrame(updateGame) again
    }

    function initGame() {
        score = 0; // Reset score for simplicity; adjust as needed
        createBlocks();
        ballX = gameWidth / 2 - ballDiameter / 2;
        ballY = gameHeight - paddleHeight - ballDiameter - 30;
        dx = 2;
        dy = -2;
        updateScoreAndLevel();
        gameOverOverlay.style.display = 'none';
        requestAnimationFrame(updateGame);
    }

    function updateScoreAndLevel() {
        scoreDisplay.textContent = `Score: ${score}`;
        levelDisplay.textContent = `Level: ${level}`;
    }

    tryAgainButton.addEventListener('click', () => {
        gameOverOverlay.style.display = 'none';
        initGame();
    });

    quitButton.addEventListener('click', () => window.location.href = 'index.html');

    gameArea.addEventListener('mousemove', movePaddle);

    initGame(); // Start the game
});
