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
    let paddleX = (gameWidth - paddleWidth) / 2;
    let ballX = paddleX + paddleWidth / 2 - ball.offsetWidth / 2;
    let ballY = paddle.offsetTop - ball.offsetHeight;
    let dx = 4;
    let dy = -4;
    let score = 0;
    let level = 1;

    applyStyles(scoreDisplay, { color: 'white', position: 'absolute', top: '10px', left: '10px' });
    applyStyles(levelDisplay, { color: 'white', position: 'absolute', top: '10px', right: '10px' });

    function applyStyles(element, styles) {
        Object.keys(styles).forEach(key => {
            element.style[key] = styles[key];
        });
    }

    function createBlocks() {
        blocks = [];
        for (let row = 0; row < blockRows; row++) {
            for (let col = 0; col < blockColumns; col++) {
                const block = document.createElement('div');
                block.className = 'block';
                applyStyles(block, {
                    width: `${gameWidth / blockColumns - 5}px`,
                    height: '20px',
                    backgroundColor: 'blue',
                    position: 'absolute',
                    top: `${row * (20 + 5)}px`,
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
        score = 0;
        level = 1;
        paddleX = (gameWidth - paddleWidth) / 2;
        ballX = paddleX + paddleWidth / 2 - ball.offsetWidth / 2;
        ballY = paddle.offsetTop - ball.offsetHeight;
        dx = 4;
        dy = -4;
        createBlocks();
        updateScoreAndLevel();
        requestAnimationFrame(updateGame);
    }

    function updateScoreAndLevel() {
        scoreDisplay.textContent = `Score: ${score}`;
        levelDisplay.textContent = `Level: ${level}`;
    }

    tryAgainButton.addEventListener('click', resetGame);
    quitButton.addEventListener('click', () => window.location.href = 'index.html');

    gameArea.addEventListener('mousemove', e => {
        paddleX = e.clientX - gameArea.getBoundingClientRect().left - paddleWidth / 2;
        if (paddleX < 0) paddleX = 0;
        if (paddleX + paddleWidth > gameWidth) paddleX = gameWidth - paddleWidth;
        paddle.style.left = `${paddleX}px`;
    });

    function checkCollisions() {
        // Ball collision with walls
        if (ballX <= 0 || ballX + ball.offsetWidth >= gameWidth) dx = -dx;
        if (ballY <= 0) dy = -dy;

        // Ball collision with paddle
        if (ballX < paddleX + paddleWidth && ballX + ball.offsetWidth > paddleX && ballY < paddle.offsetTop + paddle.offsetHeight && ballY + ball.offsetHeight > paddle.offsetTop) {
            dy = -dy;
            ballY = paddle.offsetTop - ball.offsetHeight;
        }

        // Ball collision with blocks
        blocks.forEach((block, index) => {
            if (!block) return;
            const rect = block.getBoundingClientRect();
            if (ballX < rect.right && ballX + ball.offsetWidth > rect.left && ballY < rect.bottom && ballY + ball.offsetHeight > rect.top) {
                blocks.splice(index, 1);
                block.parentNode.removeChild(block);
                dy = -dy;
                score += 10;
                updateScoreAndLevel();
            }
        });

        if (blocks.length === 0) {
            levelUp();
        }
    }

    function levelUp() {
        createBlocks();
        level++;
        dx *= 1.1;
        dy = Math.abs(dy) * 1.1 * (dy / Math.abs(dy)); // Increase speed and maintain direction
        updateScoreAndLevel();
    }

    function updateGame() {
        ballX += dx;
        ballY += dy;

        checkCollisions();

        // Update ball position
        ball.style.left = `${ballX}px`;
        ball.style.top = `${ballY}px`;

        // Game over condition
        if (ballY + ball.offsetHeight > gameArea.offsetHeight) {
            showGameOver();
            return; // Stop the game loop
        }

        requestAnimationFrame(updateGame);
    }

    function showGameOver() {
        gameOverOverlay.style.display = 'flex';
    }

    resetGame(); // Start the game
});
                          
