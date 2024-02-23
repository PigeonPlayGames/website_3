// Define initial state variables
let villageLevel = 1;
let armySize = 0;
let wallLevel = 0;
let upgradeVillageTime = 0; // Timer for upgrading village
let upgradeWallTime = 0; // Timer for upgrading wall
let raiseArmyTime = 0; // Timer for raising army

// Reference to the timer sprite animation container
const timerImage = document.getElementById('timerImage');

// Event listener for upgrading the village
document.getElementById('upgradeVillage').addEventListener('click', function() {
    if (upgradeVillageTime === 0 && upgradeWallTime === 0 && raiseArmyTime === 0) {
        upgradeVillage();
    }
});

// Event listener for raising an army
document.getElementById('raiseArmy').addEventListener('click', function() {
    if (upgradeVillageTime === 0 && upgradeWallTime === 0 && raiseArmyTime === 0) {
        raiseArmy();
    }
});

// Event listener for upgrading the wall
document.getElementById('upgradeWall').addEventListener('click', function() {
    if (villageLevel >= 3 && upgradeVillageTime === 0 && upgradeWallTime === 0 && raiseArmyTime === 0) {
        upgradeWall();
    }
});

// Function to manage showing the timer sprite animation
function showTimerSprite() {
    timerImage.style.display = 'block'; // Show the sprite animation
}

// Function to manage hiding the timer sprite animation
function hideTimerSprite() {
    timerImage.style.display = 'none'; // Hide the sprite animation
}

// Function to upgrade the village with timer and sprite animation
function upgradeVillage() {
    upgradeVillageTime = 7; // 7 seconds to upgrade
    showTimerSprite();
    const interval = setInterval(() => {
        if (upgradeVillageTime > 0) {
            document.getElementById('timerValue').textContent = upgradeVillageTime + "s remaining for village upgrade";
            upgradeVillageTime--;
        } else {
            clearInterval(interval);
            villageLevel++;
            document.getElementById('villageLevel').textContent = villageLevel;
            document.getElementById('timerValue').textContent = 'Village upgrade complete';
            hideTimerSprite();
            upgradeVillageTime = 0;
            if (villageLevel >= 3) {
                document.getElementById('wallSection').style.display = 'block';
            }
        }
    }, 1000);
}

// Function to raise an army with timer and sprite animation
function raiseArmy() {
    raiseArmyTime = 10; // 10 seconds to raise
    showTimerSprite();
    const interval = setInterval(() => {
        if (raiseArmyTime > 0) {
            document.getElementById('timerValue').textContent = raiseArmyTime + "s remaining to raise army";
            raiseArmyTime--;
        } else {
            clearInterval(interval);
            armySize += 10; // Increment army size by 10
            document.getElementById('armySize').textContent = armySize;
            document.getElementById('timerValue').textContent = 'Army raised successfully';
            hideTimerSprite();
            raiseArmyTime = 0;
        }
    }, 1000);
}

// Function to upgrade the wall with timer and sprite animation
function upgradeWall() {
    upgradeWallTime = 5; // 5 seconds to upgrade
    showTimerSprite();
    const interval = setInterval(() => {
        if (upgradeWallTime > 0) {
            document.getElementById('timerValue').textContent = upgradeWallTime + "s remaining for wall upgrade";
            upgradeWallTime--;
        } else {
            clearInterval(interval);
            wallLevel++;
            document.getElementById('wallLevel').textContent = wallLevel;
            document.getElementById('timerValue').textContent = 'Wall upgraded successfully';
            hideTimerSprite();
            upgradeWallTime = 0;
        }
    }, 1000);
}
