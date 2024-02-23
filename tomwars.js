// Define initial state variables
let villageLevel = 1;
let armySize = 0;
let wallLevel = 0; // Initialize wall level at 0
let upgradeTime = 0;

// Event listener for upgrading the village
document.getElementById('upgradeVillage').addEventListener('click', function() {
    upgradeVillage();
});

// Event listener for raising an army
document.getElementById('raiseArmy').addEventListener('click', function() {
    raiseArmy();
});

// Initially, the wall upgrade option is not available until the village reaches level 3
// Check if the wall upgrade button exists before adding an event listener to avoid errors
const upgradeWallButton = document.getElementById('upgradeWall');
if (upgradeWallButton) {
    upgradeWallButton.addEventListener('click', function() {
        upgradeWall();
    });
}

// Function to upgrade the village
function upgradeVillage() {
    if (upgradeTime === 0) { // Ensure no concurrent upgrades
        upgradeTime = 5; // Example upgrade time in seconds
        const interval = setInterval(() => {
            if (upgradeTime > 0) {
                document.getElementById('timerValue').textContent = upgradeTime--;
            } else {
                clearInterval(interval);
                villageLevel++;
                document.getElementById('villageLevel').textContent = villageLevel;
                document.getElementById('timerValue').textContent = '0';
                upgradeTime = 0; // Reset upgrade timer
                if (villageLevel === 3) {
                    // Unlock wall upgrade option at village level 3
                    document.getElementById('wallSection').style.display = 'block';
                }
            }
        }, 1000);
    }
}

// Function to upgrade the wall
function upgradeWall() {
    wallLevel++; // Increment wall level
    document.getElementById('wallLevel').textContent = wallLevel;
}

// Function to raise an army
function raiseArmy() {
    armySize += 10; // Simplified army size increment
    document.getElementById('armySize').textContent = armySize;
}
