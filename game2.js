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
    let dx = 2; // Ball movement speed on the X axis
    let dy = -2; // Ball movement speed on the Y axis
    let score = 0;
    let level = 1;
    let powerUpActive = false;

    // Styling for score and level display
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

    // Initialize score and level
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

    function updateGame() {
        ballX += dx;
        ballY += dy;

        let ballBottom = ballY + ball.offsetHeight;
        let paddleTop = paddle.offsetTop;
        let paddleLeft = paddle.offsetLeft;
        let paddleRight = paddleLeft + paddle.offsetWidth;

        if (ballX <= 0 || ballX + ball.offsetWidth >= gameWidth) dx = -dx;
        if (ballY <= 0) {
            dy = -dy;
        } else if (ballBottom >= paddleTop && ballY <= paddleTop && ballX + ball.offsetWidth >= paddleLeft && ballX <= paddleRight) {
            dy = -dy;
            score += 10; // Increase score when the ball hits the paddle
            updateScoreAndLevel(); // Update score display
            // Optional: activate power-up on certain conditions
            // activatePowerUp();
        }

        if (ballBottom > gameArea.offsetHeight) {
            alert("Game Over!");
            document.location.reload();
        }

        ball.style.left = `${ballX}px`;
        ball.style.top = `${ballY}px`;

        requestAnimationFrame(updateGame);
    }

    updateGame(); // Start the game loop
});
    
