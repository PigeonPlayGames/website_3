// Utility: Notify the user with a message
function notify(message, color = "green") {
  const notifications = document.getElementById("notifications");
  notifications.textContent = message;
  notifications.style.color = color;

  setTimeout(() => (notifications.textContent = ""), 3000); // Clear after 3 seconds
}

// Utility: Update the game UI
function updateUI() {
  if (!window.gameState) {
    console.error("Game state is undefined!");
    return;
  }

  // Update Resources
  ["wood", "stone", "gold"].forEach((resource) => {
    document.getElementById(resource).textContent = gameState.resources[resource];
  });

  // Update Buildings
  ["lumber", "quarry", "gold"].forEach((building) => {
    const b = gameState.buildings[building];
    document.getElementById(`${building}-level`).textContent = b.level;
    document.getElementById(`${building}-rate`).textContent = b.rate;
    document.getElementById(`${building}-cost`).textContent = b.cost;
  });

  // Update Score
  gameState.score = calculateScore();
  document.getElementById("score").textContent = gameState.score;
}

// Calculate total score as the sum of all resources
function calculateScore() {
  return (
    gameState.resources.wood +
    gameState.resources.stone +
    gameState.resources.gold
  );
}

// Upgrade a building and handle its resource cost
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

    notify(`${building.charAt(0).toUpperCase() + building.slice(1)} upgraded to Level ${b.level}!`);
    updateUI();

    // Save progress to Firebase after upgrade
    if (firebase.auth().currentUser) {
      saveProgress(firebase.auth().currentUser.uid);
    }
  } else {
    notify(`Not enough ${resourceType} to upgrade ${building}!`, "red");
  }
}

// Generate resources periodically
function generateResources() {
  if (!window.gameState) return;

  // Increment resources based on building rates
  gameState.resources.wood += gameState.buildings.lumber.rate;
  gameState.resources.stone += gameState.buildings.quarry.rate;
  gameState.resources.gold += gameState.buildings.gold.rate;

  // Update the UI and save progress
  updateUI();

  if (firebase.auth().currentUser) {
    saveProgress(firebase.auth().currentUser.uid);
  }
}

// Save game progress to Firebase
function saveProgress(userId) {
  if (!userId || !window.gameState) return;

  const userRef = database.ref('users/' + userId + '/gameState');
  userRef
    .set(gameState)
    //.then(() => notify("Game progress saved successfully!"))
    .catch((error) => console.error("Error saving progress:", error));
}

// Load game progress from Firebase
function loadProgress(userId) {
  if (!userId) return;

  const userRef = database.ref('users/' + userId + '/gameState');
  userRef
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        gameState = snapshot.val();
        updateUI();
        console.log("Game state loaded:", gameState);
      } else {
        console.log("No saved game state found for user:", userId);
      }
    })
    .catch((error) => console.error("Error loading progress:", error));
}

// Fetch leaderboard from Firebase
function fetchLeaderboard() {
  const leaderboardRef = database.ref('users');

  leaderboardRef
    .orderByChild('gameState/score')
    .limitToLast(10)
    .once('value')
    .then((snapshot) => {
      const leaderboard = [];
      snapshot.forEach((child) => {
        const user = child.val();
        leaderboard.push({
          username: child.key, // Default to Firebase key; replace if username exists
          score: user.gameState?.score || 0,
        });
      });

      // Sort in descending order
      leaderboard.sort((a, b) => b.score - a.score);
      displayLeaderboard(leaderboard);
    })
    .catch((error) => console.error("Error fetching leaderboard:", error));
}

// Display leaderboard on the UI
function displayLeaderboard(leaderboard) {
  const leaderboardList = document.getElementById('leaderboard-list');
  leaderboardList.innerHTML = ''; // Clear previous entries

  leaderboard.forEach((entry) => {
    const listItem = document.createElement('li');
    listItem.textContent = `User: ${entry.username}, Score: ${entry.score}`;
    leaderboardList.appendChild(listItem);
  });
}

// Initialize Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

// Sign in anonymously
auth.signInAnonymously()
  .then(() => console.log("Player logged in anonymously"))
  .catch((error) => console.error("Authentication failed:", error));

// Authentication state change listener
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User ID:", user.uid);
    loadProgress(user.uid); // Load user progress
    fetchLeaderboard();    // Fetch leaderboard data
  }
});

// Global Game State
let gameState = {
  resources: {
    wood: 0,
    stone: 0,
    gold: 0,
  },
  buildings: {
    lumber: { level: 1, rate: 1, cost: 50 },
    quarry: { level: 1, rate: 1, cost: 50 },
    gold: { level: 1, rate: 1, cost: 50 },
  },
  score: 0,
};

// Start periodic resource generation
setInterval(generateResources, 1000); // Every second

// Initial UI setup
updateUI();
