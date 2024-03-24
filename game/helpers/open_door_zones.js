const openDoorZones = [
    // Define the world grid here
    // Each number represents a specific tile or zone in your game world
    // Use "0" for regular tiles and "1" for open door zones

    // Example grid:
    [0, 0, 0, 0, 0], // Row 1
    [0, 0, 0, 0, 0], // Row 2
    [0, 0, 1, 0, 0], // Row 3 - Open door zone
    [0, 0, 0, 0, 0], // Row 4
    [0, 0, 0, 0, 0], // Row 5
    // Add more rows as needed
];

// Function to check if a player is in an open door zone
function isInOpenDoorZone(x, y) {
    // Check the value at the specified coordinates in the openDoorZones array
    // If the value is 1, it means it's an open door zone
    return openDoorZones[y][x] === 1;
}

// Example usage:
// Call this function whenever the player's position changes
function checkPlayerPosition(x, y) {
    if (isInOpenDoorZone(x, y)) {
        // Player is in an open door zone, trigger door opening logic
        openDoor();
    }
}
