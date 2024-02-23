// Define initial state variables
let villageLevel = 1;
let armySize = 0;
let wallLevel = 0;
let upgradeVillageTime = 0; // Timer for upgrading village
let upgradeWallTime = 0; // Timer for upgrading wall
let raiseArmyTime = 0; // Timer for raising army

// Event listener for upgrading the village
document.getElementById('upgradeVillage').addEventListener('click', function() {
    if (upgradeVillageTime === 0 && upgradeWallTime === 0 && raiseArmyTime === 0) { // Check no other process is running
        upgradeVillage();
    }
});

// Event listener for raising an army
document.getElementById('raiseArmy').addEventListener('click', function() {
    if (upgradeVillageTime === 0 && upgradeWallTime === 0 && raiseArmyTime === 0) { // Check no other process is running
        raiseArmy();
    }
});

// Event listener for upgrading the wall
document.getElementById('upgradeWall').addEventListener('click', function() {
    if (villageLevel >= 3 && upgradeVillageTime === 0 && upgradeWallTime === 0 && raiseArmyTime === 0) { // Check no other process is running and village level is adequate
        upgradeWall();
    }
});

// Function to upgrade the village
function upgradeVillage() {
    upgradeVillageTime = 7; // Set upgrade time in seconds
    const interval = setInterval(() => {
        if (upgradeVillageTime > 0) {
            document.getElementById('timerValue').textContent = upgradeVillageTime + "s remaining for village upgrade";
            upgradeVillageTime--;
        } else {
            clearInterval(interval);
            villageLevel++;
            document.getElementById('villageLevel').textContent = villageLevel;
            document.getElementById('timerValue').textContent = 'Village upgrade complete';
            upgradeVillageTime = 0; // Reset timer
            // Automatically check and display wall upgrade option if village level is 3 or above
            if (villageLevel >= 3) {
                document.getElementById('wallSection').style.display = 'block';
            }
        }
    }, 1000);
}

// Function to raise an army with timer
function raiseArmy() {
    raiseArmyTime = 10; // Set raising time in seconds
    const interval = setInterval(() => {
        if (raiseArmyTime > 0) {
            document.getElementById('timerValue').textContent = raiseArmyTime + "s remaining to raise army";
            raiseArmyTime--;
        } else {
            clearInterval(interval);
            armySize += 10; // Increment army size
            document.getElementById('armySize').textContent = armySize;
            document.getElementById('timerValue').textContent = 'Army raised successfully';
            raiseArmyTime = 0; // Reset timer
        }
    }, 1000);
}

// Function to upgrade the wall with timer
function upgradeWall() {
    upgradeWallTime = 5; // Set upgrade time in seconds
    const interval = setInterval(() => {
        if (upgradeWallTime > 0) {
            document.getElementById('timerValue').textContent = upgradeWallTime + "s remaining for wall upgrade";
            upgradeWallTime--;
        } else {
            clearInterval(interval);
            wallLevel++;
            document.getElementById('wallLevel').textContent = wallLevel;
            document.getElementById('timerValue').textContent = 'Wall upgraded successfully';
            upgradeWallTime = 0; // Reset timer
        }
    }, 1000);
}
