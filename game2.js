const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let fruits = [];
let score = 0;
let gameRunning = true;

// Function to add fruits
function addFruit() {
    fruits.push({
        x: Math.random() * canvas.width,
        y: canvas.height,
        speed: 2 + Math.random() * 3, // Adjust speed for challenge
        radius: 20 // Adjust size if needed
    });
}

// Function to draw fruits
function drawFruit() {
    fruits.forEach(fruit => {
        ctx.beginPath();
        ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'red'; // Change colors for fun
        ctx.fill();
        ctx.closePath();
    });
}

// Function to update game state
function updateGame() {
    if (!gameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFruit();
    // Move fruits
    fruits.forEach(fruit => {
        fruit.y -= fruit.speed;
    });
    requestAnimationFrame(updateGame);
}

canvas.addEventListener('touchstart', function(e) {
    const touchX = e.touches[0].clientX - canvas.offsetLeft;
    const touchY = e.touches[0].clientY - canvas.offsetTop;
    // Check collision with fruits
    fruits = fruits.filter(fruit => {
        const distance = Math.sqrt((fruit.x - touchX) ** 2 + (fruit.y - touchY) ** 2);
        if (distance < fruit.radius) {
            score++;
            return false; // Remove fruit if touched
        }
        return true;
    });
});

// Start game
function startGame() {
    gameRunning = true;
    setInterval(addFruit, 1000); // Adjust frequency of fruits appearing
    updateGame();
}

startGame();
