// Define global variables
let board, boardWidth = 360, boardHeight = 576, context;
let doodlerWidth = 46, doodlerHeight = 46;
let doodlerX = boardWidth / 2 - doodlerWidth / 2, doodlerY = boardHeight * 7 / 8 - doodlerHeight;
let doodlerRightImg, doodlerLeftImg, platformImg;
let velocityX = 0, velocityY = 0, initialVelocityY = -8, gravity = 0.4;
let platformArray = [], platformWidth = 60, platformHeight = 18;
let score = 0, maxScore = 0, gameOver = false;
let touchStartX = 0, touchEndX = 0;
let movingRight = false, movingLeft = false;

let doodler = {
    img: null,
    x: doodlerX,
    y: doodlerY,
    width: doodlerWidth,
    height: doodlerHeight
};

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    doodlerRightImg = new Image();
    doodlerRightImg.src = "skater_right.png";
    doodlerLeftImg = new Image();
    doodlerLeftImg.src = "skater_left.png";
    platformImg = new Image();
    platformImg.src = "platform.png"; // Ensure this path is correct

    // Set initial doodler image
    doodler.img = doodlerRightImg;

    velocityY = initialVelocityY;
    placePlatforms();
    requestAnimationFrame(update);

    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);
    document.addEventListener('touchend', handleTouchEnd, false);
};

function update() {
    if (gameOver) return;

    context.clearRect(0, 0, board.width, board.height);
    doodler.x += velocityX;
    wrapDoodler();
    velocityY += gravity;
    doodler.y += velocityY;

    if (doodler.y > board.height) {
        gameOver = true;
        context.fillText("Game Over", 50, 50); // Display game over message
        return;
    }

    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
    platformArray.forEach(platform => {
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    });

    updateScore();
    requestAnimationFrame(update);
}

function updateScore() {
    // This simplistic scoring system increases score based on the doodler's jumps
    let points = Math.floor(50 * Math.random()); // Random points for each jump
    if (velocityY < 0) { // If moving up, increase score
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
        }
    } else if (velocityY >= 0) { // If moving down, no change in score
        // Optional: Decrease score if you want a penalty for falling
    }
    // Display the score
    context.fillStyle = "black";
    context.font = "16px Arial";
    context.fillText("Score: " + score, 10, 20);
}

function wrapDoodler() {
    // Wraps doodler to the opposite side of the screen when it goes off one side
    if (doodler.x < -doodler.width) {
        doodler.x = boardWidth;
    } else if (doodler.x > boardWidth) {
        doodler.x = -doodler.width;
    }
}

function detectCollision(doodler, platform) {
    // Simple AABB collision detection
    return doodler.x < platform.x + platform.width &&
           doodler.x + doodler.width > platform.x &&
           doodler.y < platform.y + platform.height &&
           doodler.y + doodler.height > platform.y;
}

function updatePlatforms() {
    platformArray.forEach(platform => {
        // Move platforms down to simulate the doodler's upward movement
        if (doodler.y < boardHeight / 2 && velocityY < 0) {
            platform.y -= velocityY;
        }

        // Check for collision with platforms
        if (detectCollision(doodler, platform) && velocityY > 0) {
            velocityY = initialVelocityY; // Cause the doodler to jump
        }

        // Draw the platform
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    });

    // Remove platforms that have moved off screen and add new ones at the top
    if (platformArray[0].y > boardHeight) {
        platformArray.shift(); // Remove the first platform
        newPlatform(); // Add a new platform at the top
    }
}

function newPlatform() {
    let newPlatformPosition = {
        img: platformImg,
        x: Math.floor(Math.random() * (boardWidth - platformWidth)),
        y: platformArray[platformArray.length - 1].y - (boardHeight / platformArray.length),
        width: platformWidth,
        height: platformHeight
    };
    platformArray.push(newPlatformPosition);
}

function placePlatforms() {
    // Initially place platforms on the screen
    platformArray = [];
    for (let i = 0; i < 5; i++) {
        let platformPosition = {
            img: platformImg,
            x: Math.floor(Math.random() * (boardWidth - platformWidth)),
            y: boardHeight / 5 * i,
            width: platformWidth,
            height: platformHeight
        };
        platformArray.push(platformPosition);
    }
}

function displayGameOver() {
    // Show game over message and score
    context.fillStyle = "red";
    context.font = "24px Arial";
    context.fillText("Game Over", boardWidth / 2 - 70, boardHeight / 2);
    context.fillText("Final Score: " + score, boardWidth / 2 - 70, boardHeight / 2 + 30);
    // Optionally, add a restart feature here
}

function adjustDoodlerDirection() {
    if (movingRight) {
        velocityX = 4;
        doodler.img = doodlerRightImg;
    } else if (movingLeft) {
        velocityX = -4;
        doodler.img = doodlerLeftImg;
    } else {
        velocityX = 0; // Stop the doodler when there's no touch movement
    }
}

function update() {
    context.clearRect(0, 0, boardWidth, boardHeight); // Clear the canvas

    // Movement and drawing logic for doodler
    doodler.x += velocityX;
    wrapDoodler();
    doodler.y += velocityY;
    velocityY += gravity; // Apply gravity to the doodler's vertical velocity
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    // Update platforms
    updatePlatforms();

    // Check for game over condition
    if (doodler.y > boardHeight) {
        gameOver = true;
        displayGameOver();
        return; // Stop the game loop
    }

    // Update and display score
    updateScore();

    // Continue the animation loop
    requestAnimationFrame(update);
}

function displayGameOver() {
    // Display game over message
    context.fillStyle = "red";
    context.font = "30px Arial";
    context.fillText("Game Over", boardWidth / 2 - 100, boardHeight / 2);
    context.fillText("Score: " + score, boardWidth / 2 - 50, boardHeight / 2 + 40);
    context.fillText("Tap to Restart", boardWidth / 2 - 110, boardHeight / 2 + 80);

    // Listen for a tap to restart the game
    board.addEventListener('touchstart', restartGame, { once: true });
}

function restartGame() {
    // Reset game state
    doodler.x = doodlerX;
    doodler.y = doodlerY;
    velocityY = initialVelocityY;
    score = 0;
    maxScore = 0;
    gameOver = false;
    platformArray = []; // Clear existing platforms
    placePlatforms(); // Place new platforms
    requestAnimationFrame(update); // Restart the game loop
}

// Initial game setup
window.onload = function() {
    setupGame();
};

function setupGame() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Load images and then start the game
    loadImages().then(() => {
        placePlatforms();
        requestAnimationFrame(update); // Start the game loop
    });
}

async function loadImages() {
    // Helper function to load an image
    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    try {
        doodlerRightImg = await loadImage('skater_right.png');
        doodlerLeftImg = await loadImage('skater_left.png');
        platformImg = await loadImage('platform.png');
        doodler.img = doodlerRightImg; // Set initial doodler image
    } catch (error) {
        console.error("Error loading images", error);
    }
}

