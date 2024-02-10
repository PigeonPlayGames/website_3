// Board setup
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

// Doodler setup
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth / 2 - doodlerWidth / 2;
let doodlerY = boardHeight * 7 / 8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;

let doodler = {
    img: null,
    x: doodlerX,
    y: doodlerY,
    width: doodlerWidth,
    height: doodlerHeight
};

// Physics
let velocityX = 0;
let velocityY = 0; // Doodler jump speed
let initialVelocityY = -8; // Starting velocity Y
let gravity = 0.4;

// Platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

let score = 0;
let maxScore = 0;
let gameOver = false;

// Touch control variables
let touchStartX = 0;
let touchEndX = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    doodlerRightImg = new Image();
    doodlerRightImg.src = "./doodler-right.png";
    doodler.img = doodlerRightImg;
    doodlerRightImg.onload = function() {
        context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
    };

    doodlerLeftImg = new Image();
    doodlerLeftImg.src = "./doodler-left.png";

    platformImg = new Image();
    platformImg.src = "./platform.png";

    velocityY = initialVelocityY;
    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDoodler);

    // Add touch event listeners for mobile controls
    document.getElementById("leftBtn").addEventListener("touchstart", function(e) {
        e.preventDefault(); // Prevent scrolling or other default actions
        moveDoodler({ code: "ArrowLeft" });
    }, false);

    document.getElementById("rightBtn").addEventListener("touchstart", function(e) {
        e.preventDefault();
        moveDoodler({ code: "ArrowRight" });
    }, false);

    document.getElementById("restart").addEventListener("click", function(e) {
        if (gameOver) {
            restartGame();
        }
    }, false);

    // Ensure the restart button is correctly shown or hidden
    updateGameOverUI();
};

function restartGame() {
    doodler.x = doodlerX;
    doodler.y = doodlerY;
    velocityX = 0;
    velocityY = initialVelocityY;
    score = 0;
    maxScore = 0;
    gameOver = false;
    platformArray = [];
    placePlatforms();
    updateGameOverUI();
}

function updateGameOverUI() {
    if (gameOver) {
        document.getElementById("restartBtn").style.display = "block";
    } else {
        document.getElementById("restartBtn").style.display = "none";
    }
}

    context.clearRect(0, 0, board.width, board.height);

    // Movement and boundary checks
    doodler.x += velocityX;
    if (doodler.x > boardWidth) {
        doodler.x = 0;
    } else if (doodler.x + doodler.width < 0) {
        doodler.x = boardWidth;
    }

    // Gravity effect
    velocityY += gravity;
    doodler.y += velocityY;
    if (doodler.y > board.height) {
        gameOver = true;
    }
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    // Platforms
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (velocityY < 0 && doodler.y < boardHeight * 3 / 4) {
            platform.y -= initialVelocityY;
        }
        if (detectCollision(doodler, platform) && velocityY >= 0) {
            velocityY = initialVelocityY;
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    // Update and display score
    updateScore();
    context.fillStyle = "black";
    context.font = "16px sans-serif";
    context.fillText(score, 5, 20);

    // Game Over message
    if (gameOver) {
        context.fillText("Game Over: Tap to Restart", boardWidth / 7, boardHeight * 7 / 8);
    }
}

function moveDoodlerLeft() {
    velocityX = -4;
    doodler.img = doodlerLeftImg;
}

function moveDoodlerRight() {
    velocityX = 4;
    doodler.img = doodlerRightImg;
}

// Include the rest of your game functions here (placePlatforms, newPlatform, detectCollision, updateScore)
// Make sure to include the modified restartGame function to reset the game state
function placePlatforms() {
    platformArray = [];

    //starting platforms
    let platform = {
        img : platformImg,
        x : boardWidth/2,
        y : boardHeight - 50,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);

    // platform = {
    //     img : platformImg,
    //     x : boardWidth/2,
    //     y : boardHeight - 150,
    //     width : platformWidth,
    //     height : platformHeight
    // }
    // platformArray.push(platform);

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * boardWidth*3/4); //(0-1) * boardWidth*3/4
        let platform = {
            img : platformImg,
            x : randomX,
            y : boardHeight - 75*i - 150,
            width : platformWidth,
            height : platformHeight
        }
    
        platformArray.push(platform);
    }
}

function newPlatform() {
    let randomX = Math.floor(Math.random() * boardWidth*3/4); //(0-1) * boardWidth*3/4
    let platform = {
        img : platformImg,
        x : randomX,
        y : -platformHeight,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function updateScore() {
    let points = Math.floor(50*Math.random()); //(0-1) *50 --> (0-50)
    if (velocityY < 0) { //negative going up
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
        }
    }
    else if (velocityY >= 0) {
        maxScore -= points;
    }
}
// Additional functions for touch control handling
function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
}

function handleTouchMove(e) {
    touchEndX = e.touches[0].clientX;
}

function handleTouchEnd(e) {
    if (!gameOver) {
        if (touchEndX < touchStartX) {
            velocityX = -4; // Swipe left
            doodler.img = doodlerLeftImg;
        } else if (touchEndX > touchStartX) {
            velocityX = 4; // Swipe right
            doodler.img = doodlerRightImg;
        }
    } else {
        // Assuming a tap is a quick touch with minimal movement
        if (Math.abs(touchEndX - touchStartX) < 10) {
            restartGame();
        }
    }
}
