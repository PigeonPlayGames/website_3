// Adjust canvas size to window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Score and game state
let score = 0;
let gameOver = false;

// Function to add obstacles
function addObstacle() {
    let size = Math.random() * 30 + 10; // Random size between 10 and 40
    obstacles.push({
        x: Math.random() * (canvas.width - size),
        y: -size,
        width: size,
        height: size,
        speed: Math.random() * 2 + 1 // Random speed
    });
}

// Collision detection
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.height + rect1.y > rect2.y;
}

// Update game state
function update() {
    if (gameOver) return;

    // Player movement
    if(ktg.isPressed(ktg.key.LEFT)) player.x -= player.speed;
    if(ktg.isPressed(ktg.key.RIGHT)) player.x += player.speed;
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

    // Add obstacles
    if (Math.random() < 0.02) { // Adjust spawn rate as needed
        addObstacle();
    }

    // Move and remove obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].y += obstacles[i].speed;
        // Check for collision
        if (checkCollision(obstacles[i], player)) {
            gameOver = true;
            break;
        }
        // Remove off-screen obstacles
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
            score += 10; // Increase score for dodging obstacles
        }
    }
}

// Render the game
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw obstacles
    obstacles.forEach(obstacle => {
        ctx.fillStyle = 'red';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Display score
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 10, 30);

    // Game over screen
    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
        ctx.fillText('Tap to Restart', canvas.width / 2, canvas.height / 2 + 40);
    }
}

// Restart the game
function restartGame() {
    if (gameOver) {
        score = 0;
        gameOver = false;
        player.x = canvas.width / 2;
        obstacles = [];
    }
}

// Listen for tap to restart
canvas.addEventListener('touchstart', restartGame, false);

// Start the game loop
gameLoop();
          
