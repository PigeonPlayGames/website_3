document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('gameArea');
    const paddle = document.getElementById('paddle');
    const ball = document.getElementById('ball');
    const scoreDisplay = document.createElement('div');
    const levelDisplay = document.createElement('div');
    gameArea.appendChild(scoreDisplay);
    gameArea.appendChild(levelDisplay);

    let gameWidth = gameArea.clientWidth;
    let paddleWidth = paddle.offsetWidth;
    let paddleX = (gameWidth - paddleWidth) / 2;
    let ballX = paddleX + paddleWidth / 2 - ball.offsetWidth / 2;
    let ballY = paddle.offsetTop - ball.offsetHeight;
    let dx = 2; // Ball movement speed on the X axis
    let dy = -2; // Ball movement speed on the Y axis
    let score = 0;
    let level = 1;
    let powerUpActive = false;

    // Apply initial styles for score and level displays
    applyStyles(scoreDisplay, { color: 'white', position: 'absolute', top: '10px', left: '10px' });
    applyStyles(levelDisplay, { color: 'white', position: 'absolute', top: '10px', right: '10px' });

    function applyStyles(element, styles) {
        for (const property in styles) {
            element.style[property] = styles[property];
        }
    }

    // Updates the score and level display
    function updateScoreAndLevel() {
        scoreDisplay.textContent = `Score: ${score}`;
        levelDisplay.textContent = `Level: ${level}`;
    }
    updateScoreAndLevel();

    // Adjust game elements on window resize
    window.addEventListener('resize', () => {
        gameWidth = gameArea.clientWidth;
        paddleX = Math.min(paddleX, gameWidth - paddleWidth);
        ballX = paddleX + paddleWidth / 2 - ball.offsetWidth / 2;
        paddle.style.left = `${paddleX}px`;
        ball.style.left = `${ballX}px`;
    });

    // Handle touch move for paddle control
    gameArea.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const touchX = e.touches[0].clientX - gameArea.getBoundingClientRect().left;
        paddleX = touchX - paddleWidth / 2;
        if (paddleX < 0) paddleX = 0;
        if (paddleX + paddleWidth > gameWidth) paddleX = gameWidth - paddleWidth;
        paddle.style.left = `${paddleX}px`;
    }, { passive: false });

    // Power-up activation
    function activatePowerUp() {
        if (!powerUpActive) {
            powerUpActive = true;
            paddle.style.width = '150px'; // Increase paddle size
            paddleWidth = 150;
            setTimeout(() => {
                paddle.style.width = '100px'; // Reset paddle size
                paddleWidth = 100;
                powerUpActive = false;
            }, 10000); // Power-up lasts for 10 seconds
        }
    }

    // Game update loop
    function updateGame() {
        ballX += dx;
        ballY += dy;

        // Ball collision with walls
        if (ballX <= 0 || ballX + ball.offsetWidth >= gameWidth) dx = -dx;
        if (ballY <= 0) {
            dy = -dy;
        } else if (ballY + ball.offsetHeight >= paddle.offsetTop &&
                   ballX + ball.offsetWidth >= paddle.offsetLeft &&
                   ballX <= paddle.offsetLeft + paddle.offsetWidth) {
            dy = -dy;
            score += 10; // Increase score when the ball hits the paddle
            updateScoreAndLevel();
            activatePowerUp(); // Uncomment to activate power-up
        }

        // Ball falls below paddle
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
