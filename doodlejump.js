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
    platformImg.src = "halfpipe.png"; // Ensure this path is correct

    // Set initial doodler image
    doodler.img = doodlerRightImg;

    velocityY = initialVelocityY;
    placePlatforms();
    requestAnimationFrame(update);

    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, {passive: false});
    document.addEventListener('touchend', handleTouchEnd, false);
};

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
}

function handleTouchMove(event) {
    event.preventDefault(); // Prevent scrolling on touch move
    touchEndX = event.touches[0].clientX;
}

function handleTouchEnd() {
    if (touchEndX < touchStartX - 30) { // Swipe Left
        moveDoodlerLeft();
    } else if (touchEndX > touchStartX + 30) { // Swipe Right
        moveDoodlerRight();
    }
    touchEndX = 0; // Reset for the next swipe
}

function moveDoodlerRight() {
    velocityX = 4;
    doodler.img = doodlerRightImg;
}

function moveDoodlerLeft() {
    velocityX = -4;
    doodler.img = doodlerLeftImg;
}

function update() {
    if (gameOver) {
        displayGameOver();
        return;
    }

    context.clearRect(0, 0, board.width, board.height);
    doodler.x += velocityX;
    wrapDoodler();
    velocityY += gravity;
    doodler.y += velocityY;

    if (doodler.y > board.height) {
        gameOver = true;
        return;
    }

    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
    platformArray.forEach(platform => {
        if (detectCollision(doodler, platform) && velocityY >= 0) {
            velocityY = initialVelocityY;
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    });

    updatePlatforms();
    updateScore();
    requestAnimationFrame(update);
}

// Include all other functions (updateScore, wrapDoodler, detectCollision, updatePlatforms, newPlatform, placePlatforms, displayGameOver, restartGame, setupGame, loadImages) as previously defined

function displayGameOver() {
    context.fillStyle = "red";
    context.font = "30px Arial";
    context.fillText("Game Over", boardWidth / 2 - 100, boardHeight / 2);
    context.fillText("Score: " + score, boardWidth / 2 - 50, boardHeight / 2 + 40);
    context.fillText("Tap to Restart", boardWidth / 2 - 110, boardHeight / 2 + 80);
    board.addEventListener('touchstart', restartGame, { once: true });
}

function restartGame() {
    gameOver = false;
    score = 0;
    maxScore = 0;
    platformArray = [];
    doodler.x = doodlerX;
    doodler.y = doodlerY;
    velocityX = 0;
    velocityY = initialVelocityY;
    placePlatforms();
    requestAnimationFrame(update);
}

function updateScore() {
    let points = Math.floor(50 * Math.random());
    if (velocityY < 0) { // Going up
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
        }
    }
    context.fillStyle = "black";
    context.font = "16px Arial";
    context.fillText("Score: " + score, 10, 20);
}

function wrapDoodler() {
    if (doodler.x < -doodler.width) {
        doodler.x = boardWidth;
    } else if (doodler.x > boardWidth) {
        doodler.x = -doodler.width;
    }
}

function detectCollision(doodler, platform) {
    return doodler.x < platform.x + platform.width &&
           doodler.x + doodler.width > platform.x &&
           doodler.y < platform.y + platform.height &&
           doodler.y + doodler.height > platform.y;
}

function updatePlatforms() {
    platformArray.forEach(platform => {
        if (doodler.y < boardHeight / 2 && velocityY < 0) {
            platform.y -= velocityY;
        }
    });

    // Remove platforms that have moved off screen and add new ones at the top
    while (platformArray.length > 0 && platformArray[0].y > boardHeight) {
        platformArray.shift();
        newPlatform();
    }
}

function newPlatform() {
    let newPlatformPosition = {
        img: platformImg,
        x: Math.floor(Math.random() * (boardWidth - platformWidth)),
        y: -platformHeight, // Start just above the screen
        width: platformWidth,
        height: platformHeight
    };
    platformArray.push(newPlatformPosition);
}

function placePlatforms() {
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

async function loadImages() {
    const loadImage = (src) => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });

    try {
        doodlerRightImg = await loadImage('skater_right.png');
        doodlerLeftImg = await loadImage('skater_left.png');
        platformImg = await loadImage('halfpipe.png');
        doodler.img = doodlerRightImg; // Set initial doodler image
    } catch (error) {
        console.error("Error loading images", error);
    }
}

function setupGame() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    loadImages().then(() => {
        placePlatforms();
        requestAnimationFrame(update); // Start the game loop
    });
}

// Note: The restartGame function logic remains the same as previously defined.

// Restart Game functionality
function restartGame() {
    gameOver = false; // Reset gameOver to false to restart the game
    score = 0; // Reset score
    maxScore = 0; // Reset maxScore
    platformArray = []; // Clear existing platforms
    placePlatforms(); // Initialize new platforms for the restarted game
    doodler.x = doodlerX; // Reset doodler's position to the starting X
    doodler.y = doodlerY; // Reset doodler's position to the starting Y
    velocityX = 0; // Reset horizontal velocity
    velocityY = initialVelocityY; // Reset vertical velocity to start the jump

    // Remove previous event listener to avoid multiple restarts stacking
    board.removeEventListener('touchstart', restartGame);

    // Start the game loop again
    requestAnimationFrame(update);
}

// Complete setupGame function to initialize or reset the game
function setupGame() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    loadImages().then(() => {
        doodler.img = doodlerRightImg; // Initial doodler image set after images are loaded
        placePlatforms();
        requestAnimationFrame(update); // Start the game loop
    });
}

// Ensuring that loadImages is fully defined for image preloading
async function loadImages() {
    const loadImage = (src) => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image at ${src}`));
        img.src = src;
    });

    try {
        doodlerRightImg = await loadImage('skater_right.png');
        doodlerLeftImg = await loadImage('skater_left.png');
        platformImg = await loadImage('platform.png');
    } catch (error) {
        console.error("Error loading images:", error);
    }
}

// Initialization on window load
window.onload = setupGame;
