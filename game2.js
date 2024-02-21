document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('gameArea');
    const paddle = document.getElementById('paddle');
    const ball = document.getElementById('ball');
    const scoreDisplay = document.createElement('div');
    const levelDisplay = document.createElement('div');
    gameArea.appendChild(scoreDisplay);
    gameArea.appendChild(levelDisplay);

    let blocks = [];
    const blockRows = 5;
    const blockColumns = 5;
    const blockWidth = gameArea.clientWidth / blockColumns;
    const blockHeight = 20;

    let gameWidth = gameArea.clientWidth;
    let paddleWidth = paddle.offsetWidth;
    let paddleX = (gameWidth - paddleWidth) / 2;
    let ballX = paddleX + paddleWidth / 2 - ball.offsetWidth / 2;
    let ballY = paddle.offsetTop - ball.offsetHeight;
    let dx = 4; // Increased initial speed
    let dy = -4; // Increased initial speed
    let score = 0;
    let level = 1;

    applyStyles(scoreDisplay, { color: 'white', position: 'absolute', top: '10px', left: '10px' });
    applyStyles(levelDisplay, { color: 'white', position: 'absolute', top: '10px', right: '10px' });

    function applyStyles(element, styles) {
        Object.assign(element.style, styles);
    }

    function createBlocks() {
        blocks = []; // Reset blocks array
        for (let row = 0; row < blockRows; row++) {
            for (let col = 0; col < blockColumns; col++) {
                const block = document.createElement('div');
                block.className = 'block';
                applyStyles(block, {
                    width: `${blockWidth - 5}px`,
                    height: `${blockHeight}px`,
                    backgroundColor: 'blue',
                    position: 'absolute',
                    top: `${row * (blockHeight + 5)}px`,
                    left: `${col * (blockWidth)}px`
                });
                gameArea.appendChild(block);
                blocks.push({ block, hits: 0 });
            }
        }
    }
    createBlocks();

    function updateScoreAndLevel() {
        scoreDisplay.textContent = `Score: ${score}`;
        levelDisplay.textContent = `Level: ${level}`;
    }
    updateScoreAndLevel();

    function levelUp() {
        level++;
        dx *= 1.2; // Increase speed by 20%
        dy *= -1.2; // Increase speed by 20% and reverse direction
        createBlocks(); // Recreate blocks for the new level
        updateScoreAndLevel();
    }

    function checkForLevelUp() {
        if (blocks.length === 0) {
            levelUp();
        }
    }

    window.addEventListener('resize', () => {
        gameWidth = gameArea.clientWidth;
        paddleX = Math.min(paddleX, gameWidth - paddleWidth);
        ballX = paddleX + paddleWidth / 2 - ball.offsetWidth / 2;
        paddle.style.left = `${paddleX}px`;
        ball.style.left = `${ballX}px`;
    });

    gameArea.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const touchX = e.touches[0].clientX - gameArea.getBoundingClientRect().left;
        paddleX = touchX - paddleWidth / 2;
        if (paddleX < 0) paddleX = 0;
        if (paddleX + paddleWidth > gameWidth) paddleX = gameWidth - paddleWidth;
        paddle.style.left = `${paddleX}px`;
    }, { passive: false });

    function checkBlockCollisions() {
        blocks.forEach((item, index) => {
            const block = item.block;
            const blockRect = block.getBoundingClientRect();
            const ballRect = ball.getBoundingClientRect();

            if (ballRect.right > blockRect.left && ballRect.left < blockRect.right &&
                ballRect.bottom > blockRect.top && ballRect.top < blockRect.bottom) {
                dy = -dy;

                item.hits += 1;
                if (item.hits === 1) {
                    block.style.backgroundColor = 'red';
                } else {
                    block.parentNode.removeChild(block);
                    blocks.splice(index, 1);
                }

                score += 10;
                updateScoreAndLevel();
            }
        });
        checkForLevelUp();
    }

    function updateGame() {
        ballX += dx;
        ballY += dy;

        if (ballX <= 0 || ballX + ball.offsetWidth >= gameWidth) dx = -dx;
        if (ballY <= 0) dy = -dy;
        else if (ballY + ball.offsetHeight >= paddle.offsetTop &&
                 ballX + ball.offsetWidth >= paddle.offsetLeft &&
                 ballX <= paddle.offsetLeft + paddle.offsetWidth) {
            dy = -dy;
        }

        checkBlockCollisions();

        if (ballY + ball.offsetHeight > gameArea.offsetHeight) {
            alert("Game Over!");
            document.location.reload();
        }

        ball.style.left = `${ballX}px`;
        ball.style.top = `${ballY}px`;

        requestAnimationFrame(updateGame);
    }

    updateGame(); // Start the game loop
});
                
