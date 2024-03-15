document.addEventListener('DOMContentLoaded', () => {
    // Game settings and state
    let gameSpeed = 5;
    let gravity = 0.5;
    let jumpPower = 10;
    let jumping = false;
    let verticalSpeed = 0;
    let groundLevel = window.innerHeight / 2;

    // Player setup
    const player = document.getElementById('player');
    player.style.bottom = groundLevel + 'px'; // Set initial player position at ground level

    // Game environment
    const platforms = [
        {x: -200, width: 400}, // Example platform, add as many as needed
        {x: 400, width: 300},
        // Add more platforms here
    ];

    // Initialize platforms
    const gameArea = document.getElementById('gameArea');
    platforms.forEach(platform => {
        let elem = document.createElement('div');
        elem.classList.add('platform');
        elem.style.width = platform.width + 'px';
        elem.style.left = platform.x + 'px';
        elem.style.bottom = '100px'; // Example height, adjust as needed
        gameArea.appendChild(elem);
        platform.elem = elem; // Store reference for movement updates
    });

    // Control setup
    document.getElementById('left').addEventListener('touchstart', () => gameSpeed = -5);
    document.getElementById('right').addEventListener('touchstart', () => gameSpeed = 5);
    document.getElementById('jump').addEventListener('touchstart', jump);

    function jump() {
        if (!jumping) {
            jumping = true;
            verticalSpeed = jumpPower;
        }
    }

    function gameLoop() {
        // Update platforms based on movement
        platforms.forEach(platform => {
            platform.x += gameSpeed;
            platform.elem.style.left = platform.x + 'px';
        });

        // Gravity and jumping
        if (jumping) {
            player.style.bottom = (parseInt(player.style.bottom) + verticalSpeed) + 'px';
            verticalSpeed -= gravity;

            if (parseInt(player.style.bottom) <= groundLevel) {
                player.style.bottom = groundLevel + 'px';
                jumping = false;
                verticalSpeed = 0;
            }
        }

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});

