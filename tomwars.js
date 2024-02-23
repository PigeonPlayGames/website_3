// Updated script.js
let villageLevel = 1;
let armySize = 0;
let wallLevel = 0; // Initialize wall level
let upgradeTime = 0;

document.getElementById('upgradeVillage').addEventListener('click', function() {
    upgradeVillage();
});

document.getElementById('raiseArmy').addEventListener('click', function() {
    raiseArmy();
});

// Check for village level to unlock upgradeWall
function checkForWallUpgrade() {
    if (villageLevel >= 3) {
        document.getElementById('upgradeWall').style.display = 'block'; // Show the upgrade wall button
    } else {
        document.getElementById('upgradeWall').style.display = 'none'; // Hide the upgrade wall button
    }
}

function upgradeVillage() {
    if (upgradeTime === 0) { // Ensures that another upgrade can't start while one is in progress
        upgradeTime = 5; // Set upgrade time in seconds
        const interval = setInterval(() => {
            if (upgradeTime > 0) {
                document.getElementById('timerValue').textContent = upgradeTime--;
            } else {
                clearInterval(interval);
                villageLevel++;
                document.getElementById('villageLevel').textContent = villageLevel;
                checkForWallUpgrade(); // Check if wall upgrade is available after upgrading village
                document.getElementById('timerValue').textContent = '0';
                upgradeTime = 0; // Reset upgrade timer
            }
        }, 1000);
    }
}

function raiseArmy() {
    armySize += 10; // Increase army size by 10 for simplicity
    document.getElementById('armySize').textContent = armySize;
}

// New function for upgrading the wall
function upgradeWall() {
    if (villageLevel >= 3) { // Ensure the village is at the required level
        wallLevel++; // Increment wall level
        document.getElementById('wallLevel').textContent = wallLevel; // Update wall level display
    }
}

document.getElementById('upgradeWall').addEventListener('click', function() {
    upgradeWall();
});

// Initial check to hide the upgrade wall button if village level is below 3
checkForWallUpgrade();
