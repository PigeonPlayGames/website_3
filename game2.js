document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const gameArea = document.getElementById('gameArea');
    gameArea.style.left = '0px'; // Initialize gameArea position

    const platform = document.createElement('div');
    platform.style.width = '200px';
    platform.style.height = '20px';
    platform.style.position = 'absolute';
    platform.style.bottom = '100px';
    platform.style.left = '150px';
    platform.style.backgroundColor = 'green';
    gameArea.appendChild(platform);

    let playerPos = { x: 100, y: 0 };
    let velocity = { x: 0, y: 0 };
    const gravity = 0.5;
    let isJumping = false;

    document.getElementById('left').addEventListener('touchstart', function() { velocity.x = -5; });
    document.getElementById('right').addEventListener('touchstart', function() { velocity.x = 5; });
    document.getElementById('jump').addEventListener('touchstart', function() {
        if (!isJumping) {
            isJumping = true;
            velocity.y = 10;
        }
    });

    function gameLoop() {
        // Update the player's position
        playerPos.x += velocity.x;
        playerPos.y += velocity.y;
        velocity.y -= gravity; // Apply gravity effect

        // Collision detection with the ground
        if (playerPos.y <= 0) {
            playerPos.y = 0;
            velocity.y = 0;
            isJumping = false;
        }

        // Platform collision detection
        let platformBottom = parseInt(platform.style.bottom.replace('px', ''));
        let platformTop = platformBottom + parseInt(platform.style.height.replace('px', ''));
        let platformLeft = parseInt(platform.style.left.replace('px', ''));
        let platformRight = platformLeft + parseInt(platform.style.width.replace('px', ''));

        // Check if the player is above the platform and within its x bounds to land on it
        if (playerPos.x < platformRight && playerPos.x + 50 > platformLeft && playerPos.y <= platformTop && playerPos.y + 50 > platformBottom) {
            if (velocity.y < 0) { // Falling
                playerPos.y = platformTop;
                velocity.y = 0;
                isJumping = false;
            }
        }

        // Prevent player from moving out of gameArea bounds
        if (playerPos.x < 0) playerPos.x = 0;
        if (playerPos.x + 50 > gameArea.offsetWidth) playerPos.x = gameArea.offsetWidth - 50;

        // Camera follow effect (Horizontal only)
        const cameraLeftBoundary = window.innerWidth / 4;
        const cameraRightBoundary = window.innerWidth * 3 / 4;
        const playerScreenPositionX = playerPos.x + parseInt(gameArea.style.left);

        if (playerScreenPositionX < cameraLeftBoundary) {
            gameArea.style.left = `${parseInt(gameArea.style.left) + cameraLeftBoundary - playerScreenPositionX}px`;
        } else if (playerScreenPositionX > cameraRightBoundary) {
            gameArea.style.left = `${parseInt(gameArea.style.left) - (playerScreenPositionX - cameraRightBoundary)}px`;
        }

        // Ensure gameArea does not move beyond its boundaries
        const maxLeft = 0;
        const maxRight = -gameArea.offsetWidth + window.innerWidth;
        gameArea.style.left = `${Math.min(maxLeft, Math.max(maxRight, parseInt(gameArea.style.left)))}px`;

        // Update the player's style to move it
        player.style.left = playerPos.x + 'px';
        player.style.bottom = playerPos.y + 'px';

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
