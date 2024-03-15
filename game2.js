document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const gameArea = document.getElementById('gameArea');
    let platforms = []; // Array to hold platforms

    // Set game area wider to simulate a larger world
    gameArea.style.width = '3000px'; // Example width, adjust as needed

    // Initial player setup
    const playerWidth = 50; // Match CSS
    const playerHeight = 50; // Match CSS
    let playerPos = window.innerWidth / 2 - playerWidth / 2; // Center player on screen
    player.style.left = playerPos + 'px'; // Center player

    // Initialize platforms (example)
    createPlatform(150, 100, 200, 20); // Parameters: x, y, width, height
    createPlatform(400, 200, 250, 20);

    // Game variables
    let isJumping = false;
    let velocity = { x: 0, y: 0 };
    const gravity = 0.5;

    // Touch controls
    document.getElementById('left').addEventListener('touchstart', () => velocity.x = -5);
    document.getElementById('right').addEventListener('touchstart', () => velocity.x = 5);
    document.getElementById('jump').addEventListener('touchstart', jump);

    function jump() {
        if (!isJumping) {
            isJumping = true;
            velocity.y = 10; // Adjust jump strength as needed
        }
    }

    function createPlatform(x, y, width, height) {
        const platform = document.createElement('div');
        platform.style.position = 'absolute';
        platform.style.left = x + 'px';
        platform.style.bottom = y + 'px';
        platform.style.width = width + 'px';
        platform.style.height = height + 'px';
        platform.style.backgroundColor = 'green';
        gameArea.appendChild(platform);
        platforms.push({ platform, x, y, width, height });
    }

    function gameLoop() {
        // Update horizontal movement based on velocity
        platforms.forEach(p => {
            p.x += velocity.x;
            p.platform.style.left = p.x + 'px';
        });

        // Gravity effect
        if (isJumping) {
            velocity.y -= gravity;
            playerPos += velocity.y;
            if (playerPos < window.innerHeight / 2 - playerHeight / 2) {
                playerPos = window.innerHeight / 2 - playerHeight / 2; // Simulate landing (reset position)
                isJumping = false;
            }
            player.style.bottom = playerPos + 'px';
        }

        // Prevent scrolling beyond game area bounds
        platforms.forEach(p => {
            if (p.x < 0 || p.x + p.width > parseInt(gameArea.style.width)) {
                velocity.x = 0; // Stop horizontal movement at bounds
            }
        });

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
