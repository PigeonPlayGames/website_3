// Utility: Update Notifications
function notify(message, color = "green") {
  const notifications = document.getElementById("notifications");
  notifications.textContent = message;
  notifications.style.color = color;

  setTimeout(() => (notifications.textContent = ""), 3000); // Clear after 3 seconds
}

// Utility: Update UI
function updateUI() {
  // Ensure gameState is defined and accessible before updating UI
  if (!window.gameState) return;

  // Update Resources
  document.getElementById("wood").textContent = gameState.resources.wood;
  document.getElementById("stone").textContent = gameState.resources.stone;
  document.getElementById("gold").textContent = gameState.resources.gold;

  // Update Buildings
  ["lumber", "quarry", "gold"].forEach((building) => {
    const b = gameState.buildings[building];
    document.getElementById(`${building}-level`).textContent = b.level;
    document.getElementById(`${building}-rate`).textContent = b.rate;
    document.getElementById(`${building}-cost`).textContent = b.cost;
  });
}

// Upgrade a Building
function upgradeBuilding(building) {
  if (!window.gameState) return;

  const b = gameState.buildings[building];
  const resourceType = building === "lumber" ? "wood" : building === "quarry" ? "stone" : "gold";

  if (gameState.resources[resourceType] >= b.cost) {
    // Deduct Resources
    gameState.resources[resourceType] -= b.cost;

    // Upgrade Building
    b.level += 1;
    b.rate += 1;
    b.cost = Math.floor(b.cost * 1.5);

    notify(`${building} upgraded to Level ${b.level}!`);
    updateUI();

    // Save progress to Firebase after upgrade
    if (firebase.auth().currentUser) {
      saveProgress(firebase.auth().currentUser.uid);
    }
  } else {
    notify(`Not enough ${resourceType} to upgrade ${building}!`, "red");
  }
}

// Generate Resources Over Time
function generateResources() {
  if (!window.gameState) return;

  gameState.resources.wood += gameState.buildings.lumber.rate;
  gameState.resources.stone += gameState.buildings.quarry.rate;
  gameState.resources.gold += gameState.buildings.gold.rate;

  updateUI();

  // Save progress periodically to Firebase
  if (firebase.auth().currentUser) {
    saveProgress(firebase.auth().currentUser.uid);
  }
}

// Initialize Game
updateUI();
setInterval(generateResources, 1000); // Generate resources every second
