// script.js
let villageLevel = 1;
let armySize = 0;
let upgradeTime = 0;

document.getElementById('upgradeVillage').addEventListener('click', function() {
    upgradeVillage();
});

document.getElementById('raiseArmy').addEventListener('click', function() {
    raiseArmy();
});

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
