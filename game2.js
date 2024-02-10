document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('gameArea');
    const paddle = document.getElementById('paddle');
    const ball = document.getElementById('ball');
    let gameWidth = gameArea.clientWidth;
    let paddleWidth = paddle.offsetWidth;
    let paddleX = (gameWidth - paddleWidth) / 2;
    let ballX = paddleX + paddleWidth / 2 - ball.offsetWidth / 2;
    let ballY = paddle.offsetTop - ball.offsetHeight;
    let dx = 2; // Ball movement speed on the X axis
    let dy = -2; // Ball movement speed on the Y axis

    // Update game size on window resize for responsiveness
    window.addEventListener('resize', () => {
        gameWidth = gameArea.clientWidth;
        paddleWidth = paddle.offsetWidth;
        // Adjust paddle and ball position based on new game area size
        paddleX = Math.min(paddleX, gameWidth - paddleWidth);
        ballX = Math.min(ballX, gameWidth - ball.offsetWidth);
        // Ensure ball and paddle stay within game boundaries
        paddle.style.left = `${paddleX}px`;
        ball.style.left = `${ballX}px`;
    });

    // Touch control for the paddle
    gameArea.addEventListener('touchmove', function(e) {
        // Prevent the screen from scrolling
        e.preventDefault();
        const touchX = e.touches[0].clientX;
        const gameAreaRect = gameArea.getBoundingClientRect();
        paddleX = touchX - gameAreaRect.left - paddleWidth / 2;
        // Keep paddle within game area
        if (paddleX < 0) paddleX = 0;
        if (paddleX + paddleWidth > gameWidth) paddleX = gameWidth - paddleWidth;
        paddle.style.left = `${paddleX}px`;
    }, { passive: false });

    function updateGame() {
        // Update ball position
        ballX += dx;
        ballY += dy;

        // Collision detection with walls
        if (ballX <= 0 || ballX + ball.offsetWidth >= gameWidth) dx = -dx;
        if (ballY <= 0) dy = -dy;

        // Improved collision detection with the paddle
        let ballBottom = ballY + ball.offsetHeight;
        let paddleTop = paddle.offsetTop;
        let paddleLeft = paddle.offsetLeft;
        let paddleRight = paddleLeft + paddle.offsetWidth;

        // Check for collision with the paddle
        if (ballBottom >= paddleTop && ballY <= paddleTop && ballX + ball.offsetWidth >= paddleLeft && ballX <= paddleRight) {
            dy = -dy; // Reverse the ball's Y-direction
            // Adjust the ball's Y position to prevent it from "sticking" to the paddle
            ballY = paddleTop - ball.offsetHeight;
        }

        // Game over condition adjustment
        if (ballBottom > gameArea.offsetHeight) {
            alert("Game Over!");
            document.location.reload(); // Reset the game for simplicity
        }

        // Update ball element position
        ball.style.left = `${ballX}px`;
        ball.style.top = `${ballY}px`;

        requestAnimationFrame(updateGame);
    }

    updateGame(); // Start the game loop
});
