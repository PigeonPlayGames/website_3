document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('gameArea');
    const paddle = document.getElementById('paddle');
    const ball = document.getElementById('ball');
    const scoreDisplay = document.createElement('div');
    const levelDisplay = document.createElement('div');
    // Create elements for game over screen
    const gameOverScreen = document.createElement('div');
    const gameOverText = document.createElement('p');
    const scoreText = document.createElement('p');
    const levelText = document.createElement('p');
    const replayButton = document.createElement('button');
    const exitButton = document.createElement('button');

    // Append score and level display to game area
    gameArea.appendChild(scoreDisplay);
    gameArea.appendChild(levelDisplay);

    // Styles for game over screen and its elements
    applyStyles(gameOverScreen, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '24px',
        visibility: 'hidden'
    });
    gameOverText.textContent = 'Game Over!';
    replayButton.textContent = 'Replay';
    exitButton.textContent = 'Exit to Featured Games';

    gameOverScreen.appendChild(gameOverText);
    gameOverScreen.appendChild(scoreText); // Will be updated with score
    gameOverScreen.appendChild(levelText); // Will be updated with level
    gameOverScreen.appendChild(replayButton);
    gameOverScreen.appendChild(exitButton);
    gameArea.appendChild(gameOverScreen);

    // Adjust score and level display position
    applyStyles(scoreDisplay, { color: 'white', position: 'absolute', bottom: '10px', left: '10px' });
    applyStyles(levelDisplay, { color: 'white', position: 'absolute', bottom: '10px', right: '10px' });

    function applyStyles(element, styles) {
        Object.assign(element.style, styles);
    }

    let blocks = [];
    const blockRows = 5;
    const blockColumns = 5;
    let dx = 4; // Increased initial speed
    let dy = -4; // Increased initial speed
    let score = 0;
    let level = 1;

    function createBlocks() {
        blocks = []; // Reset blocks array
        const blockWidth = gameArea.clientWidth / blockColumns;
        const blockHeight = 20;
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
        dy *= 1.2; // Increase speed by 20%
        createBlocks(); // Recreate blocks for the new level
        updateScoreAndLevel();
    }

    function checkForLevelUp() {
        if (blocks.length === 0) {
            levelUp();
        }
    }

    function gameOver() {
        gameOverScreen.style.visibility = 'visible';
        scoreText.textContent = `Your Score: ${score}`;
        levelText.textContent = `Level Reached: ${level}`;
        // Stop the game loop
        cancelAnimationFrame(requestId);
    }

    replayButton.onclick = () => {
        document.location.reload(); // Reload the page to restart the game
    };

    exitButton.onclick = () => {
        document.location.href = 'featured_games.html'; // Navigate to featured games page
    };

    let requestId;
    function updateGame() {
        ball.style.left = `${ballX += dx}px`;
        ball.style.top = `${ballY += dy}px`;

        // Ball collision with walls
        if (ballX <= 0 || ballX + ball.offsetWidth >= gameArea.clientWidth) dx = -dx;
        if (ballY <= 0 || ballY + ball.offsetHeight >= gameArea.offsetHeight) dy = -dy; // Revert original behavior
        else if (ballY + ball.offsetHeight >= paddle.offsetTop &&
                 ballX + ball.offsetWidth >= paddle.offsetLeft &&
                 ballX <= paddle.offsetLeft + paddle.offsetWidth) {
            dy = -dy; // Reflect ball on paddle hit
        }

        // Block collisions
        checkBlockCollisions();
        checkForLevelUp();

        // Game Over check
        if (ballY > gameArea.offsetHeight) {
            gameOver();
            return; // Exit the function to stop the game loop
        }

        requestId = requestAnimationFrame(updateGame); // Continue the game loop
    }

    let gameWidth = gameArea.clientWidth;
    let paddleWidth = paddle.offsetWidth;
    let paddleX = (gameWidth - paddleWidth) / 2;
    let ballX = paddleX + paddleWidth / 2 - ball.offsetWidth / 2;
    let ballY = paddle.offsetTop - ball.offsetHeight;

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
                dy = -dy; // Reverse the ball's Y-direction upon block collision

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
    }

    window.addEventListener('resize', () => {
        gameWidth = gameArea.clientWidth;
        paddleX = Math.min(paddleX, gameWidth - paddleWidth);
        paddle.style.left = `${paddleX}px`;
    });

    updateGame(); // Start the game loop
});
        
