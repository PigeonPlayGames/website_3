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

    // Brick configuration
    let bricks = [];
    let brickRowCount = 3;
    let brickColumnCount = 5;
    let brickWidth = 75;
    let brickHeight = 20;
    let brickPadding = 10;
    let brickOffsetTop = 30;
    let brickOffsetLeft = 30;

    // Initialize bricks
    function initBricks() {
        bricks = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r] = { x: brickX, y: brickY, status: 1 };
            }
        }
    }

    // Draw bricks
    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status == 1) {
                    let brickElement = document.createElement('div');
                    brickElement.style.position = 'absolute';
                    brickElement.style.left = `${bricks[c][r].x}px`;
                    brickElement.style.top = `${bricks[c][r].y}px`;
                    brickElement.style.width = `${brickWidth}px`;
                    brickElement.style.height = `${brickHeight}px`;
                    brickElement.style.backgroundColor = 'blue';
                    brickElement.classList.add('brick');
                    gameArea.appendChild(brickElement);
                }
            }
        }
    }

    // Check collision with bricks
    function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                let b = bricks[c][r];
                if (b.status == 1) {
                    if (ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        if (score == brickRowCount * brickColumnCount * level) { // Adjust for level progression
                            alert("Congratulations! Proceeding to next level.");
                            level++;
                            brickRowCount += 1; // Increase difficulty
                            initLevel(); // Initialize next level
                        }
                        updateScoreAndLevel();
                    }
                }
            }
        }
    }

    // Initialize the next level
    function initLevel() {
        initBricks();
        drawBricks();
        // Optionally reset or adjust game settings for new level
    }

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

    // Initialize game
    initBricks();
    drawBricks();
    updateScoreAndLevel();

    // Existing event listeners...

    function updateGame() {
        // Existing game update logic...

        collisionDetection(); // Added collision detection with bricks

        // Existing rendering and game logic...

        requestAnimationFrame(updateGame);
    }

    updateGame(); // Start the game loop
});
        
