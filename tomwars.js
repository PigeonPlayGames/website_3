// Define initial state variables
let villageLevel = 1;
let armySize = 0;
let wallLevel = 0;
let upgradeVillageTime = 0; // Timer for upgrading village
let upgradeWallTime = 0; // Timer for upgrading wall
let raiseArmyTime = 0; // Timer for raising army

// Function to update image sources based on current levels or sizes
function updateImageSources() {
    document.getElementById('villageImage').src = `village${villageLevel}.png`;
    document.getElementById('wallImage').src = `wall${wallLevel}.png`;
    // Dynamically update the army image based on army size
    // This example assumes you have images named like "army1.png", "army2.png", etc.
    let armyImageIndex = Math.min(Math.floor(armySize / 10) + 1, 5); // Example logic to change images
    document.getElementById('armyImage').src = `army${armyImageIndex}.png`;
}

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

function upgradeVillage() {
    upgradeVillageTime = 7;
    const interval = setInterval(() => {
        if (upgradeVillageTime > 0) {
            document.getElementById('timerValue').textContent = upgradeVillageTime + "s remaining for village upgrade";
            upgradeVillageTime--;
        } else {
            clearInterval(interval);
            villageLevel++;
            document.getElementById('villageLevel').textContent = villageLevel;
            document.getElementById('timerValue').textContent = 'Village upgrade complete';
            upgradeVillageTime = 0;
            if (villageLevel >= 3) {
                document.getElementById('wallSection').style.display = 'block';
            }
            updateImageSources(); // Update images after upgrading
        }
    }, 1000);
}

function raiseArmy() {
    raiseArmyTime = 10;
    const interval = setInterval(() => {
        if (raiseArmyTime > 0) {
            document.getElementById('timerValue').textContent = raiseArmyTime + "s remaining to raise army";
            raiseArmyTime--;
        } else {
            clearInterval(interval);
            armySize += 10;
            document.getElementById('armySize').textContent = armySize;
            document.getElementById('timerValue').textContent = 'Army raised successfully';
            raiseArmyTime = 0;
            updateImageSources(); // Update images after raising army
        }
    }, 1000);
}

function upgradeWall() {
    upgradeWallTime = 5;
    const interval = setInterval(() => {
        if (upgradeWallTime > 0) {
            document.getElementById('timerValue').textContent = upgradeWallTime + "s remaining for wall upgrade";
            upgradeWallTime--;
        } else {
            clearInterval(interval);
            wallLevel++;
            document.getElementById('wallLevel').textContent = wallLevel;
            document.getElementById('timerValue').textContent = 'Wall upgraded successfully';
            upgradeWallTime = 0;
            updateImageSources(); // Update images after upgrading wall
        }
    }, 1000);
}
