document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    let gameSpeed = 0;
    let gravity = 0.7;
    let jumping = false;
    let verticalVelocity = 0;
    const groundLevel = window.innerHeight / 2 + 100;

    // Platforms
    const platforms = [
        { x: -500, width: 2000 }, // Main ground
        { x: 600, width: 200 }, // Floating platform
        // Add more platforms as needed
    ];

    // Initialize platforms
    platforms.forEach(platform => {
        let elem = document.createElement('div');
        elem.className = 'platform';
        elem.style.width = platform.width + 'px';
        elem.style.left = platform.x + 'px';
        elem.style.bottom = '150px'; // Height from the bottom
        document.body.appendChild(elem);
        platform.elem = elem;
    });

    // Touch controls
    const leftBtn = document.getElementById('left');
    const rightBtn = document.getElementById('right');
    const jumpBtn = document.getElementById('jump');

    // Movement flags
    let movingLeft = false;
    let movingRight = false;

    // Touch event listeners
    leftBtn.addEventListener('touchstart', () => movingLeft = true);
    leftBtn.addEventListener('touchend', () => movingLeft = false);

    rightBtn.addEventListener('touchstart', () => movingRight = true);
    rightBtn.addEventListener('touchend', () => movingRight = false);

    jumpBtn.addEventListener('touchstart', jump);
    
    // Keyboard controls for non-touch devices
    document.addEventListener('keydown', (e) => {
        if (e.key === "ArrowLeft") movingLeft = true;
        if (e.key === "ArrowRight") movingRight = true;
        if (e.key === "ArrowUp") jump();
    });
    document.addEventListener('keyup', (e) => {
        if (e.key === "ArrowLeft") movingLeft = false;
        if (e.key === "ArrowRight") movingRight = false;
    });

    function jump() {
        if (!jumping) {
            verticalVelocity = -15;
            jumping = true;
        }
    }

    function gameLoop() {
        // Move platforms to simulate player movement
        if (movingLeft) {
            gameSpeed = 5;
        } else if (movingRight) {
            gameSpeed = -5;
        } else {
            gameSpeed = 0;
        }

        platforms.forEach(platform => {
            platform.x += gameSpeed;
            platform.elem.style.left = platform.x + 'px';
        });

        // Gravity and jumping mechanics
        if (jumping) {
            player.style.bottom = parseInt(player.style.bottom) + verticalVelocity + 'px';
            verticalVelocity += gravity;

            if (parseInt(player.style.bottom) <= groundLevel) {
                player.style.bottom = groundLevel + 'px';
                jumping = false;
                verticalVelocity = 0;
            }
        }

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
