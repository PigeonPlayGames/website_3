document.addEventListener('DOMContentLoaded', () => {
    // Player and game state variables
    let playerVelocity = 0;
    let playerAcceleration = 0.2;
    let friction = 0.1;
    let gravity = 0.7;
    let jumpPower = -15;
    let isJumping = false;
    let verticalSpeed = 0;
    let groundLevel = window.innerHeight / 2 + 100; // Set ground level

    // Setup player element
    const player = document.getElementById('player');
    player.style.bottom = `${groundLevel}px`; // Initial player ground position

    // Define platforms (x position, width)
    const platformsData = [
        { x: -500, width: 2000 }, // Example: Long ground platform
        { x: 800, width: 300 }   // Example: Floating platform
        // Add more platform data as needed
    ];

    // Render platforms
    platformsData.forEach(platform => {
        const elem = document.createElement('div');
        elem.className = 'platform';
        elem.style.width = `${platform.width}px`;
        elem.style.left = `${platform.x}px`;
        elem.style.bottom = '150px'; // Platform height from the bottom
        document.body.appendChild(elem);
        platform.elem = elem; // Keep a reference to the element
    });

    // Touch and keyboard control setup
    const controls = {
        left: false,
        right: false
    };

    setupControls();

    function setupControls() {
        // Touch controls
        document.getElementById('left').addEventListener('touchstart', () => controls.left = true, { passive: true });
        document.getElementById('left').addEventListener('touchend', () => controls.left = false, { passive: true });

        document.getElementById('right').addEventListener('touchstart', () => controls.right = true, { passive: true });
        document.getElementById('right').addEventListener('touchend', () => controls.right = false, { passive: true });

        document.getElementById('jump').addEventListener('touchstart', jump, { passive: true });

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') controls.left = true;
            if (e.key === 'ArrowRight') controls.right = true;
            if (e.key === 'ArrowUp' || e.key === ' ') jump();
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft') controls.left = false;
            if (e.key === 'ArrowRight') controls.right = false;
        });
    }

    function jump() {
        if (!isJumping) {
            verticalSpeed = jumpPower;
            isJumping = true;
        }
    }

    function gameLoop() {
        // Horizontal movement
        if (controls.left) {
            playerVelocity -= playerAcceleration;
        } else if (controls.right) {
            playerVelocity += playerAcceleration;
        } else {
            playerVelocity *= (1 - friction);
        }

        // Update platforms positions to simulate player movement
        platformsData.forEach(platform => {
            platform.x -= playerVelocity;
            platform.elem.style.left = `${platform.x}px`;
        });

        // Gravity and jumping
        if (isJumping) {
            verticalSpeed += gravity;
            let newBottom = parseInt(player.style.bottom) + verticalSpeed;
            if (newBottom <= groundLevel) {
                newBottom = groundLevel;
                isJumping = false;
                verticalSpeed = 0;
            }
            player.style.bottom = `${newBottom}px`;
        }

        requestAnimationFrame(gameLoop);
    }

    gameLoop(); // Start the game loop
});
