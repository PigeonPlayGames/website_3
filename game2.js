document.addEventListener('DOMContentLoaded', () => {
    // Basic game state
    let acceleration = 0.2;
    let friction = 0.05;
    let velocityX = 0;
    let maxSpeed = 5;
    let gravity = 0.7;
    let jumpPower = -15;
    let isJumping = false;
    let isOnGround = false;
    let verticalVelocity = 0;

    const gameArea = document.getElementById('gameArea');
    const player = document.getElementById('player');
    const groundLevel = window.innerHeight / 2 + 100; // Adjust based on game design

    player.style.bottom = groundLevel + 'px'; // Initialize player position

    // Platforms setup
    const platforms = [
        {x: 0, y: groundLevel, width: 1000}, // Base ground platform
        {x: 1200, y: groundLevel + 50, width: 300}, // Elevated platform
        // Add more platforms as needed
    ];

    // Render platforms
    platforms.forEach(platform => {
        let elem = document.createElement('div');
        elem.className = 'platform';
        elem.style.width = platform.width + 'px';
        elem.style.left = platform.x + 'px';
        elem.style.bottom = platform.y + 'px';
        gameArea.appendChild(elem);
        platform.elem = elem;
    });

    // Input event listeners
    let leftPressed = false;
    let rightPressed = false;
    document.addEventListener('keydown', e => {
        if (e.key === "ArrowLeft") leftPressed = true;
        if (e.key === "ArrowRight") rightPressed = true;
        if (e.key === "ArrowUp" && isOnGround) jump();
    });
    document.addEventListener('keyup', e => {
        if (e.key === "ArrowLeft") leftPressed = false;
        if (e.key === "ArrowRight") rightPressed = false;
    });

    function jump() {
        if (!isJumping) {
            verticalVelocity = jumpPower;
            isJumping = true;
            isOnGround = false;
        }
    }

    function gameLoop() {
        // Horizontal movement
        if (leftPressed && velocityX > -maxSpeed) {
            velocityX -= acceleration;
        } else if (rightPressed && velocityX < maxSpeed) {
            velocityX += acceleration;
        } else {
            velocityX *= (1 - friction);
        }

        // Update platform positions based on player movement
        platforms.forEach(platform => {
            platform.x -= velocityX;
            platform.elem.style.left = platform.x + 'px';
        });

        // Gravity
        player.style.bottom = (parseInt(player.style.bottom) + verticalVelocity) + 'px';
        verticalVelocity += gravity;

        // Ground check
        isOnGround = parseInt(player.style.bottom) <= groundLevel;
        if (isOnGround) {
            player.style.bottom = groundLevel + 'px';
            verticalVelocity = 0;
            isJumping = false;
        }

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
