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
    let ballY = paddle.offsetTop - ball.offsetHeight - 30; // Start position above the paddle
    let dx = 0; // Initial horizontal movement; set to 0 to keep the ball still
    let dy = 0; // Initial vertical movement; set to 0 to keep the ball still
    let score = 0;
    let level = 1;
    let isGameStarted = false;

    // Brick configuration
    let bricks = [];
    let brickRowCount = 3;
    let brickColumnCount = 5;
    let brickWidth = 75;
    let brickHeight = 20;
    let brickPadding = 10;
    let brickOffsetTop = 30;
    let brickOffsetLeft = 30;

    // Initialize and draw bricks
    function initBricks() {
        bricks = [];
        for(let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for(let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
    }

    function drawBricks() {
        for(let c = 0; c < brickColumnCount; c++) {
            for(let r = 0; r < brickRowCount; r++) {
                if(bricks[c][r].status == 1) {
                    let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    let brickElement = document.createElement('div');
                    brickElement.style.position = 'absolute';
                    brickElement.style.left = `${brickX}px`;
                    brickElement.style.top = `${brickY}px`;
                    brickElement.style.width = `${brickWidth}px`;
                    brickElement.style.height = `${brickHeight}px`;
                    brickElement.style.backgroundColor = 'blue';
                    brickElement.classList.add('brick');
                    gameArea.appendChild(brickElement);
                }
            }
        }
    }

    function collisionDetection() {
        for(let c = 0; c < brickColumnCount; c++) {
            for(let r = 0; r < brickRowCount; r++) {
                let b = bricks[c][r];
                if(b.status == 1) {
                    if(ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0; // Brick is hit
                        score++;
                        if(score == brickRowCount * brickColumnCount) {
                            alert("Congratulations! Proceeding to next level.");
                            level++;
                            initLevel(); // Initialize next level
                        }
                    }
                }
            }
        }
    }

    // Initialize the next level
    function initLevel() {
        brickRowCount++; // Increase the row count for added difficulty
        initBricks();
        drawBricks();
        dx = dy = 0; // Reset ball movement until the player starts the level
        isGameStarted = false; // Allow the player to start the new level
    }

    function startGame() {
        if(!isGameStarted) {
            dx = 2;
            dy = -2;
            isGameStarted = true;
            updateGame();
        }
    }

    // Styling for score and level display
    scoreDisplay.id = 'scoreDisplay';
    levelDisplay.id = 'levelDisplay';
    updateScoreAndLevel();

    // Event listeners for paddle movement and game start
    gameArea.addEventListener('click', startGame);
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            startGame();
        }
    });

    gameArea.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touchX = e.touches[0].clientX;
        const gameAreaRect = gameArea.getBoundingClientRect();
        paddleX = touchX - gameAreaRect.left - paddleWidth / 2;
        if (paddleX < 0) paddleX = 0;
        if (paddleX + paddleWidth > gameWidth) paddleX = gameWidth - paddleWidth;
        paddle.style.left = `${paddleX}px`;
    }, { passive: false });

    function updateScoreAndLevel() {
        scoreDisplay.textContent = `Score: ${score}`;
        levelDisplay.textContent = `Level: ${level}`;
    }

    function updateGame() {
        if(isGameStarted) {
            ballX += dx;
            ballY += dy;

            // Collision detection with game area bounds
            if (ballX <= 0 || ballX + ball.offsetWidth >= gameWidth) dx = -dx;
            if (ballY <= 0) dy = -dy;
            if (ballY + ball.offsetHeight >= gameArea.clientHeight) {
                alert("Game Over!");
                document.location.reload(); // Restart the game
            }

            // Collision detection with the paddle
            if (ballX > paddleX && ballX < paddleX + paddleWidth && ballY + ball.offsetHeight >= paddle.offsetTop) {
                dy = -dy;
            }

            collisionDetection();

            ball.style.left = `${ballX}px`;
            ball.style.top = `${ballY}px`;
        }

        requestAnimationFrame(updateGame);
    }

    // Initialize game setup
    initBricks();
    drawBricks();
    updateGame(); // Start the game loop
});
                          
