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
    let dx = 4; // Increased the ball's standard speed
    let dy = -4; // Increased the ball's standard speed
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

    class Block {
        constructor(element, hits) {
            this.element = element;
            this.hits = hits; // Number of hits to destroy the block
        }
    }

    let blocks = [];
    const blockRows = 4;
    const blockColumns = 5;

    function createBlocks() {
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
                blocks.push(new Block(block, 2)); // Each block requires 2 hits
            }
        }
    }

    function movePaddle(e) {
        let clientX;

        if (e.type === "touchmove") {
            e.preventDefault();
            clientX = e.touches[0].clientX;
        } else {
            clientX = e.clientX;
        }

        let paddleX = clientX - gameArea.getBoundingClientRect().left - paddleWidth / 2;
        if (paddleX < 0) paddleX = 0;
        else if (paddleX + paddleWidth > gameWidth) paddleX = gameWidth - paddleWidth;
        paddle.style.left = `${paddleX}px`;
    }

    function updateGame() {
        ball.style.left = `${ballX}px`;
        ball.style.bottom = `${gameHeight - ballY - ballDiameter}px`;

        ballX += dx;
        ballY += dy;

        // Wall collision
        if (ballX <= 0 || ballX + ballDiameter >= gameWidth) dx = -dx;
        if (ballY <= 0) dy = -dy;

        // Paddle collision
        let paddleTop = gameHeight - paddleHeight;
        if (ballY < paddleTop && ballY + ballDiameter > paddleTop &&
            ballX + ballDiameter > paddle.offsetLeft && ballX < paddle.offsetLeft + paddleWidth) {
            dy = -Math.abs(dy); // Always bounce up
        }

        // Block collision
        blocks.forEach((block, index) => {
            if (block.element) {
                const blockRect = block.element.getBoundingClientRect();
                const ballRect = ball.getBoundingClientRect();
                if (
                    ballRect.left < blockRect.right && ballRect.right > blockRect.left &&
                    ballRect.top < blockRect.bottom && ballRect.bottom > blockRect.top
                ) {
                    block.hits -= 1;
                    if (block.hits === 0) {
                        gameArea.removeChild(block.element);
                        blocks[index] = null; // Remove the block from the array
                    } else {
                        // Change color to red to indicate it's been hit once
                        block.element.style.backgroundColor = 'red';
                    }
                    dy = -dy;
                    score += 10;
                    updateScoreAndLevel();
                }
            }
        });

        if (blocks.every(block => block === null)) {
            levelUp();
        }

        if (ballY + ballDiameter > gameHeight) {
            gameOver();
        }

        requestAnimationFrame(updateGame);
    }

    function levelUp() {
        level++;
        dx *= 1.1;
        dy *= 1.1;
        initGame();
    }

    function gameOver() {
        gameOverOverlay.style.display = 'flex';
    }

    function initGame() {
        ballX = gameWidth / 2 - ballDiameter / 2;
        ballY = 30;
        dx = 4; // Reset to initial speed for new game
        dy = -4; // Reset to initial speed for new game
        score = 0;
        level = 1;
        blocks.forEach(block => block && block.element && block.element.remove());
        blocks = [];
        createBlocks();
        updateScoreAndLevel();
        gameOverOverlay.style.display = 'none';
        requestAnimationFrame(updateGame);
    }

    function updateScoreAndLevel() {
        scoreDisplay.textContent = `Score: ${score}`;
        levelDisplay.textContent = `Level: ${level}`;
    }

    gameArea.addEventListener('mousemove', movePaddle);
    gameArea.addEventListener('touchmove', movePaddle, { passive: false });

    tryAgainButton.addEventListener('click', initGame);
    quitButton.addEventListener('click', () => window.location.href = 'index.html');

    initGame(); // Start the game
});
