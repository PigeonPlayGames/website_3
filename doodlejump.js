// Define global variables
let board, boardWidth = 360, boardHeight = 576, context;
let doodlerWidth = 46, doodlerHeight = 46;
let doodlerX = boardWidth / 2 - doodlerWidth / 2, doodlerY = boardHeight * 7 / 8 - doodlerHeight;
let doodlerRightImg, doodlerLeftImg, doodler;
let velocityX = 0, velocityY = 0, initialVelocityY = -8, gravity = 0.4;
let platformArray = [], platformWidth = 60, platformHeight = 18, platformImg;
let score = 0, maxScore = 0, gameOver = false;
let touchStartX = 0, touchEndX = 0;
let movingRight = false, movingLeft = false;

let doodler = {
    img : null,
    x : doodlerX,
    y : doodlerY,
    width : doodlerWidth,
    height : doodlerHeight
}

//physics
let velocityX = 0; 
let velocityY = 0; //doodler jump speed
let initialVelocityY = -8; //starting velocity Y
let gravity = 0.4;

//platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

let score = 0;
let maxScore = 0;
let gameOver = false;

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

    doodler = {
        img: doodlerRightImg,
        x: doodlerX,
        y: doodlerY,
        width: doodlerWidth,
        height: doodlerHeight
    };

    velocityY = initialVelocityY;
    placePlatforms();
    requestAnimationFrame(update);

    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);
    document.addEventListener('touchend', handleTouchEnd, false);
};

function update() {
    requestAnimationFrame(update);
    if (gameOver) return;

    context.clearRect(0, 0, board.width, board.height);

    // Doodler logic
    doodler.x += velocityX;
    wrapDoodler();
    velocityY += gravity;
    doodler.y += velocityY;
    if (doodler.y > board.height) gameOver = true;
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    // Platform logic
    updatePlatforms();
    updateScore();
    if (gameOver) displayGameOver();
}

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
}

function handleTouchMove(event) {
    touchEndX = event.touches[0].clientX;
    if (touchEndX < touchStartX - 5) {
        movingLeft = true;
        movingRight = false;
    } else if (touchEndX > touchStartX + 5) {
        movingRight = true;
        movingLeft = false;
    }
    adjustDoodlerDirection();
}

function handleTouchEnd() {
    movingRight = false;
    movingLeft = false;
    velocityX = 0; // Stop the doodler's horizontal movement when the touch ends
}

function adjustDoodlerDirection() {
    if (movingRight) {
        velocityX = 4;
        doodler.img = doodlerRightImg;
    } else if (movingLeft) {
        velocityX = -4;
        doodler.img = doodlerLeftImg;
    }
}

function wrapDoodler() {
    if (doodler.x > boardWidth) {
        doodler.x = 0;
    } else if (doodler.x + doodler.width < 0) {
        doodler.x = boardWidth;
    }
}

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
