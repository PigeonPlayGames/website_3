let villageLevel = 1;
let armySize = 0;
let wallLevel = 0;
let upgradeTime = 0; // Timer for any upgrade process

document.getElementById('upgradeVillage').addEventListener('click', function() {
    // Only start the upgrade if no other upgrade is in progress
    if (upgradeTime === 0) { 
        startUpgrade('village');
    }
});

document.getElementById('raiseArmy').addEventListener('click', function() {
    raiseArmy();
});

// Check if the wall upgrade button exists to avoid errors in case the HTML is not yet updated
const upgradeWallButton = document.getElementById('upgradeWall');
if (upgradeWallButton) {
    upgradeWallButton.addEventListener('click', function() {
        // Only start the upgrade if no other upgrade is in progress and the village is at least level 3
        if (upgradeTime === 0 && villageLevel >= 3) {
            startUpgrade('wall');
        }
    });
}

function startUpgrade(type) {
    upgradeTime = 5; // Simulate a 5-second upgrade process for both village and wall
    let interval = setInterval(() => {
        if (upgradeTime > 0) {
            // Update the timer display with the remaining time
            document.getElementById('timerValue').textContent = `${upgradeTime}s remaining for ${type} upgrade`;
            upgradeTime--;
        } else {
            clearInterval(interval);
            if (type === 'village') {
                villageLevel++;
                document.getElementById('villageLevel').textContent = villageLevel;
                // Unlock wall upgrade option when village reaches level 3
                if (villageLevel === 3) {
                    document.getElementById('wallSection').style.display = 'block';
                }
            } else if (type === 'wall') {
                wallLevel++;
                document.getElementById('wallLevel').textContent = wallLevel;
            }
            document.getElementById('timerValue').textContent = 'Upgrade complete';
            upgradeTime = 0; // Reset the timer for the next upgrade
        }
    }, 1000);
}

function raiseArmy() {
    armySize += 10; // Increment army size by 10
    document.getElementById('armySize').textContent = armySize;
}
