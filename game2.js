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

    let blocks = [];
    const blockRows = 5;
    const blockColumns = 5;
    let gameWidth = gameArea.clientWidth;
    let paddleWidth = paddle.offsetWidth;
    let paddleX, ballX, ballY, dx, dy, score, level;

    function applyStyles(element, styles) {
        for (const property in styles) {
            element.style[property] = styles[property];
        }
    }

    function createBlocks() {
        for (let row = 0; row < blockRows; row++) {
            for (let col = 0; col < blockColumns; col++) {
                const block = document.createElement('div');
                block.className = 'block';
                applyStyles(block, {
                    width: `${gameWidth / blockColumns - 5}px`,
                    height: '20px',
                    backgroundColor: 'blue',
                    position: 'absolute',
                    top: `${row * 25}px`,
                    left: `${col * (gameWidth / blockColumns)}px`
                });
                gameArea.appendChild(block);
                blocks.push(block);
            }
        }
    }

    function resetGame() {
        gameOverOverlay.style.display = 'none';
        blocks.forEach(block => block.remove());
        blocks = [];
        createBlocks();

        score = 0;
        level = 1;
        dx = 4;
        dy = -4;
        paddleX = gameWidth / 2 - paddleWidth / 2;
        ballX = paddleX + paddleWidth / 2 - ball.offsetWidth / 2;
        ballY = paddle.offsetTop - ball.offsetHeight;

        applyStyles(ball, { left: `${ballX}px`, top: `${ballY}px` });
        applyStyles(paddle, { left: `${paddleX}px` });
        applyStyles(scoreDisplay, { color: 'white', position: 'absolute', top: '10px', left: '10px' });
        applyStyles(levelDisplay, { color: 'white', position: 'absolute', top: '10px', right: '10px' });

        updateScoreAndLevel();
        requestAnimationFrame(updateGame);
    }

    function updateScoreAndLevel() {
        scoreDisplay.textContent = `Score: ${score}`;
        levelDisplay.textContent = `Level: ${level}`;
    }

    function showGameOver() {
        gameOverOverlay.style.display = 'flex';
    }

    tryAgainButton.addEventListener('click', resetGame);
    quitButton.addEventListener('click', () => window.location.href = 'index.html');

    function collisionDetection() {
        // Implementation of collision detection with blocks and updating game state
    }

    function updateGame() {
        // Implementation of the game update logic including movement, collision detection, etc.
        ballX += dx;
        ballY += dy;

        // Implement collision detection with walls, paddle, and blocks here
        collisionDetection();

        // Example game over condition
        if (ballY + ball.offsetHeight > gameArea.offsetHeight) {
            showGameOver(); // Instead of directly resetting the game
            return; // Stop the game loop
        }

        applyStyles(ball, { left: `${ballX}px`, top: `${ballY}px` });
        requestAnimationFrame(updateGame);
    }

    resetGame(); // Initialize the game
});
                    
