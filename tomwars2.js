let villageLevel = 1;
let armySize = 0;
let wallLevel = 0;
let upgradeVillageTime = 0; // Timer for upgrading village
let upgradeWallTime = 0; // Timer for upgrading wall
let raiseArmyTime = 0; // Timer for raising army
let incomingTroopsTime = 0; // Timer for incoming troops

// Function to update image sources based on current levels or sizes
function updateImageSources() {
    document.getElementById('villageImage').src = `village${villageLevel}.png`;
    document.getElementById('wallImage').src = `wall${wallLevel}.png`;
    let armyImageIndex = Math.min(Math.floor(armySize / 10) + 1, 5);
    document.getElementById('armyImage').src = `army${armyImageIndex}.png`;
}

document.getElementById('upgradeVillage').addEventListener('click', function() {
    if (upgradeVillageTime === 0 && upgradeWallTime === 0 && raiseArmyTime === 0) {
        upgradeVillage();
    }
});

document.getElementById('raiseArmy').addEventListener('click', function() {
    if (upgradeVillageTime === 0 && upgradeWallTime === 0 && raiseArmyTime === 0) {
        raiseArmy();
    }
});

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

function startIncomingTroopsTimer(duration) {
    incomingTroopsTime = duration;
    const troopsInterval = setInterval(() => {
        if (incomingTroopsTime > 0) {
            document.getElementById('timerValue').textContent = incomingTroopsTime + "s remaining until troops arrive";
            incomingTroopsTime--;
        } else {
            clearInterval(troopsInterval);
            document.getElementById('timerValue').textContent = 'Troops have arrived and are attacking!';
            incomingTroopsTime = 0;
            simulateAttack(); // Simulate an attack on the player
        }
    }, 1000);
}

function simulateAttack() {
    let attackSeverity = Math.random();
    if (wallLevel > 0 && attackSeverity < 0.7) {
        wallLevel--;
        document.getElementById('wallLevel').textContent = wallLevel;
        alert('Your wall has been damaged in the attack.');
    }
    if (villageLevel > 1 && attackSeverity < 0.5) {
        villageLevel--;
        document.getElementById('villageLevel').textContent = villageLevel;
        alert('Your village has suffered damage.');
    }
    if (armySize > 0 && attackSeverity < 0.8) {
        let troopsLost = Math.ceil(armySize * 0.1);
        armySize -= troopsLost;
        armySize = Math.max(0, armySize);
        document.getElementById('armySize').textContent = armySize;
        alert(`You lost ${troopsLost} troops in the attack.`);
    }
    updateImageSources(); // Update images to reflect the new state
}

// Example usage to start an incoming troops timer
// Uncomment the line below to test the incoming troops attack simulation
startIncomingTroopsTimer(25); // Start an incoming troops timer for 15 seconds
