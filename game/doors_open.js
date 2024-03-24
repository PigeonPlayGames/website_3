// Define images for doors
const doorImage = new Image();
doorImage.src = "./img/door.png";

// Define Sprite for doors
const door = new Sprite({
    position: {x: 400, y: 200}, // Example position, adjust as needed
    image: doorImage
});

// Event listener for when player approaches the door
function checkForDoorInteraction(playerPosition) {
    const doorPosition = door.position;

    // Calculate distance between player and door
    const distance = Math.sqrt(Math.pow(playerPosition.x - doorPosition.x, 2) + Math.pow(playerPosition.y - doorPosition.y, 2));

    // Threshold distance for interaction
    const interactionThreshold = 30; // Adjust as needed

    // If player is close enough to the door
    if (distance < interactionThreshold) {
        openDoor();
    }
}

// Function to open the door
function openDoor() {
    // Display black screen animation (fade into black)
    gsap.to("#overlappingDiv", {
        opacity: 1, // Adjust as needed
        onComplete: () => {
            // Additional logic to execute after the screen fades into black
            // For example, you might want to transition to another scene or load a new level
            // Once the transition is complete, fade back out
            gsap.to("#overlappingDiv", {
                opacity: 0, // Adjust as needed
                onComplete: () => {
                    // Additional logic after the screen fades out (if needed)
                }
            })
        }
    })
}

// Example usage: Call this function when the player's position changes (e.g., when they move)
function playerPositionChanged(newPosition) {
    checkForDoorInteraction(newPosition);
}
