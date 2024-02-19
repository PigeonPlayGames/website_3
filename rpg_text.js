let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const images = {
  townSquare: 'town_square.png',
  store: 'path/to/store.png',
  cave: 'path/to/cave.png',
  slime: 'path/to/slime.png',
  beast: 'path/to/fanged_beast.png',
  dragon: 'path/to/dragon.png'
  // Add more as needed
};

const weapons = [
  { name: 'stick', power: 5 },
  { name: 'dagger', power: 30 },
  { name: 'claw hammer', power: 50 },
  { name: 'sword', power: 100 }
];

const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60
  },
  {
    name: "dragon",
    level: 20,
    health: 300
  }
];

const locations = [
  // Locations array as you defined previously, unchanged
];

// Function definitions
function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
  // Optionally update the image when updating location
  if(location.name && images[location.name]) {
    updateImage(location.name);
  }
}

function updateImage(imageKey) {
  const gameImage = document.querySelector('#gameImage');
  gameImage.src = images[imageKey] || ''; // Fallback to an empty string if no image found
}

// Modify goTown, goStore, goCave, goFight and other functions to update images as needed
function goTown() {
  update(locations[0]);
  updateImage('townSquare');
}

function goStore() {
  update(locations[1]);
  updateImage('store');
}

function goCave() {
  update(locations[2]);
  updateImage('cave');
}

function goFight() {
  update(locations[3]);
  let imageKey = '';
  switch (monsters[fighting].name) {
    case 'slime': imageKey = 'slime'; break;
    case 'fanged beast': imageKey = 'beast'; break;
    case 'dragon': imageKey = 'dragon'; break;
  }
  updateImage(imageKey);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

// All other functions remain as you defined them, ensuring they call updateImage when appropriate.

// Example: Modify fightSlime, fightBeast, and fightDragon to update the image when fighting specific monsters.
function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

// Initialize the game to the town square view.
goTown();
