document.addEventListener('keydown', movePlayer);
const player = document.getElementById('player');
let playerX = window.innerWidth / 2;
let playerY = window.innerHeight / 2;
const speed = 5; // Change speed as needed

function movePlayer(event) {
    switch(event.key) {
        case "ArrowUp":
            playerY -= speed;
            break;
        case "ArrowDown":
            playerY += speed;
            break;
        case "ArrowLeft":
            playerX -= speed;
            break;
        case "ArrowRight":
            playerX += speed;
            break;
        default:
            return; // Quit when this doesn't handle the key event
    }

    // Update player position
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;

    // Prevent default action to avoid moving the page
    event.preventDefault();
}
