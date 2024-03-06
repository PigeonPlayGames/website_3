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

    function initGame() {
        paddleX = (gameWidth - paddleWidth) / 2;
        ballX = paddleX + paddleWidth / 2 - ball.offsetWidth / 2;
        ballY = paddle.offsetTop - ball.offsetHeight;
        dx = 4;
        dy = -4;
        score = 0;
        level = 1;
        blocks = [];
        createBlocks();
        updateScoreAndLevel();
        gameOverOverlay.style.display = 'none';
        requestAnimationFrame(updateGame);
    }

    applyStyles(scoreDisplay, { color: 'white', position: 'absolute', top: '10px', left: '10px' });
    applyStyles(levelDisplay, { color: 'white', position: 'absolute', top: '10px', right: '10px' });

    function applyStyles(element, styles) {
        Object.keys(styles).forEach(key => {
            element.style[key] = styles[key];
        });
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
                    top: `${row * (20 + 5)}px`,
                    left: `${col * (gameWidth / blockColumns)}px`
                });
                gameArea.appendChild(block);
                blocks.push(block);
            }
        }
    }

    function updateScoreAndLevel() {
        scoreDisplay.textContent = `Score: ${score}`;
        levelDisplay.textContent = `Level: ${level}`;
    }

    tryAgainButton.addEventListener('click', initGame);
    quitButton.addEventListener('click', () => window.location.href = 'index.html');

    gameArea.addEventListener('mousemove', function(e) {
        let relativeX = e.clientX - gameArea.getBoundingClientRect().left;
        if (relativeX > 0 && relativeX < gameWidth) {
            paddleX = relativeX - paddleWidth / 2;
            if (paddleX < 0) {
                paddleX = 0;
            } else if (paddleX + paddleWidth > gameWidth) {
                paddleX = gameWidth - paddleWidth;
            }
            paddle.style.left = paddleX + 'px';
        }
    });

    function collisionWithBlocks() {
        for (let i = 0; i < blocks.length; i++) {
            let block = blocks[i];
            if (block) {
                let blockRect = block.getBoundingClientRect();
                let ballRect = ball.getBoundingClientRect();

                if (ballRect.left < blockRect.right && ballRect.right > blockRect.left &&
                    ballRect.top < blockRect.bottom && ballRect.bottom > blockRect.top) {
                    blocks.splice(i, 1);
                    gameArea.removeChild(block);
                    dy = -dy;
                    score += 10;
                    updateScoreAndLevel();
                    break;
                }
            }
        }
    }

    function updateGame() {
        ballX += dx;
        ballY += dy;

        if (ballX <= 0 || ballX + ball.offsetWidth >= gameWidth) dx = -dx;
        if (ballY <= 0) dy = -dy;

        if (ballY + ball.offsetHeight >= paddle.offsetTop &&
            ballX + ball.offsetWidth >= paddle.offsetLeft &&
            ballX <= paddle.offsetLeft + paddle.offsetWidth) {
            dy = -dy;
        }

        collisionWithBlocks();

        if (ballY + ball.offsetHeight > gameArea.offsetHeight) {
            gameOverOverlay.style.display = 'flex';
            return; // Stop the game loop
        }

        ball.style.left = `${ballX}px`;
        ball.style.top = `${ballY}px`;

        requestAnimationFrame(updateGame);
    }

    initGame(); // Initialize and start the game
});
            
