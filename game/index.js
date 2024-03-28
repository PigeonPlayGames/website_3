const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d"); // canvas context
const buildingCoordinates = {
    x: 200, // Example x-coordinate
    y: 300, // Example y-coordinate
    width: 50, // Example width
    height: 50 // Example height
};


canvas.width = 1024;
canvas.height = 576;

// create 2D array of collisions
const collisionsMap = [];
for (let i=0; i<collisions.length; i+=70){
    collisionsMap.push(collisions.slice(i, 70 + i));
}

// create 2D array of battleZones
const battleZonesMap = [];
for (let i=0; i<battleZonesData.length; i+=70){
    battleZonesMap.push(battleZonesData.slice(i, 70 + i));
}

const boundaries = [];
const offset = {
    x: 250,
    y: 100,
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) boundaries.push(new Boundary({position: {x:j*Boundary.width+offset.x, y:i*Boundary.height+offset.y}}))
    })
})

const battleZones = [];
battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) battleZones.push(new Boundary({position: {x:j*Boundary.width+offset.x, y:i*Boundary.height+offset.y}}))
    })
})

const bgImage = new Image();
bgImage.src = "./img/Galley_hill.png";

const foregroundImage = new Image();
foregroundImage.src = "./img/foreground_images2.png";

const playerUpImage = new Image();
playerUpImage.src = "./img/playerUp.png";
const playerLeftImage = new Image();
playerLeftImage.src = "./img/playerLeft.png";
const playerDownImage = new Image();
playerDownImage.src = "./img/playerDown.png";
const playerRightImage = new Image();
playerRightImage.src = "./img/playerRight.png";

const player = new Sprite({
    position: {
        x: canvas.width/2 - 192/4/2, 
        y: canvas.height/2 - 68/2,
    },
    image: playerDownImage,
    frames: {max:4, hold:10},
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        down: playerDownImage,
        right: playerRightImage
    }
})

const background = new Sprite({ 
    position: {x:offset.x, y:offset.y},
    image: bgImage,
});

const foreground = new Sprite({ 
    position: {x:offset.x, y:offset.y},
    image: foregroundImage,
});

const keys = {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false },
}

const movables = [background, ...boundaries, foreground, ...battleZones]; // spread operator to take all items within the array, so there's no 2D arrays

function rectangularCollision({rectangle1, rectangle2}){
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x && // if right side of player > left side of box == colliding (on left side of box)
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width && // check left side of player vs right side of box
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height && // check top of player and bottom of box
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y // check bottom of player and top of box
    )
}

const battle = {
    initiated: false
}
function checkBuildingCollision() {
    if (
        player.position.x < buildingCoordinates.x + buildingCoordinates.width &&
        player.position.x + player.width > buildingCoordinates.x &&
        player.position.y < buildingCoordinates.y + buildingCoordinates.height &&
        player.position.y + player.height > buildingCoordinates.y
    ) {
        enterBuilding();
    }
}
function enterBuilding() {
    console.log("Entering building...");
    // Add logic to transition to interior map or state
    // Define shop inventory
const shopInventory = [
    { name: "Potion", price: 50, effect: { health: 20 } },
    { name: "Revive", price: 100, effect: { revive: true } },
    // Add more items as needed
];

// Define player inventory
let playerInventory = [];

function enterBuilding() {
    // Display shop interface
    displayShopInterface();
}

function displayShopInterface() {
    // Clear canvas and draw shop interface
    c.clearRect(0, 0, canvas.width, canvas.height);

    // Draw shop background or UI elements
    // Example: Draw shop background image or UI elements

    // Draw available items for purchase
    drawShopItems();

    // Draw UI elements for buying items
    // Example: Draw buttons or text for buying items

    // Add event listeners for buying items
    canvas.addEventListener('click', buyItem);

    // Draw UI element for leaving shop
    // Example: Draw button or text for leaving shop
    // Add event listener for leaving shop
    canvas.addEventListener('click', leaveShop);
}

function drawShopItems() {
    // Draw available items for purchase
    shopInventory.forEach((item, index) => {
        // Example: Draw images or text representing items
        c.fillText(`${index + 1}. ${item.name} - $${item.price}`, x, y + index * lineHeight);
    });
}

function buyItem(event) {
    // Determine which item the player clicked
    const clickX = event.clientX - canvas.offsetLeft;
    const clickY = event.clientY - canvas.offsetTop;
    const itemIndex = Math.floor((clickY - startY) / lineHeight);

    if (itemIndex >= 0 && itemIndex < shopInventory.length) {
        const selectedItem = shopInventory[itemIndex];
        // Check if the player has enough currency to buy the item
        if (player.currency >= selectedItem.price) {
            // Deduct the item price from the player's currency
            player.currency -= selectedItem.price;
            // Add the item to the player's inventory
            playerInventory.push(selectedItem);
            // Update player's stats if needed (e.g., health restoration)
            applyItemEffect(selectedItem);
            // Notify the player of the successful purchase
            console.log(`You purchased ${selectedItem.name}`);
        } else {
            // Notify the player of insufficient funds
            console.log("You don't have enough money to buy this item.");
        }
    }
}

function applyItemEffect(item) {
    // Apply item effects to the player
    // Example: Restore health, revive player, etc.
    if (item.effect.health) {
        player.health += item.effect.health;
    }
    if (item.effect.revive) {
        player.health = player.maxHealth; // Revive with full health
    }
}

function leaveShop() {
    // Clear shop interface
    c.clearRect(0, 0, canvas.width, canvas.height);

    // Remove event listeners
    canvas.removeEventListener('click', buyItem);
    canvas.removeEventListener('click', leaveShop);

    // Redraw game environment
    // Example: Redraw map, player character, etc.
    // Return to normal game loop
    // Example: Call gameLoop() function
}

}


function animate() {
    const animationId = window.requestAnimationFrame(animate);
    background.draw();
    // draw boundaries before player so player moves above boundaries
    boundaries.forEach(boundary => {
        boundary.draw();
    })
    battleZones.forEach(battleZone => {
        battleZone.draw();
    })
    player.draw();
    foreground.draw();

    let moving = true;
    player.animate = false;

    // console.log(animationId)
    if (battle.initiated) return;
    // activate a battle
    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed || touchedButtonUp === true || touchedButtonLeft === true || touchedButtonDown === true || touchedButtonRight === true){
        for (let i=0; i<battleZones.length; i++){
            const battleZone = battleZones[i];
            const overlappingArea = (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) - Math.max(player.position.x, battleZone.position.x)) * (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) - Math.max(player.position.y, battleZone.position.y));
            if ( 
                rectangularCollision({
                    rectangle1: player, 
                    rectangle2: battleZone 
                }) &&
                overlappingArea > (player.width * player.height)/3 // require player to be at least 33% on the battleZone area
                && Math.random() < 0.01 // 1% chance to activate battle
            ){ 
                // console.log(`activate battle`)
                // deactivate current animation loop
                window.cancelAnimationFrame(animationId);
                audio.Map.stop();
                audio.initBattle.play();
                audio.battle.play();
                battle.initiated = true;
                // https://greensock.com/docs/
                gsap.to("#overlappingDiv", {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.4,
                    onComplete(){
                        gsap.to("#overlappingDiv", {
                            opacity: 1,
                            duration: 0.4,
                            onComplete(){
                                // activate a new animation loop
                                initBattle()
                                animateBattle()
                                gsap.to("#overlappingDiv", {
                                    opacity: 0,
                                    duration: 0.4
                                })
                            }
                        })
                    }
                })
                break;
            };
        }
    }

    if (keys.w.pressed && lastKey === 'w' || touchedButtonUp === true){
        player.animate = true;
        player.image = player.sprites.up;
        for (let i=0; i<boundaries.length; i++){
            const boundary = boundaries[i];
            if ( 
                rectangularCollision({
                    rectangle1: player, 
                    rectangle2: {...boundary, position: { // `...` to create clone of boundary obj w/o rewriting original obj
                        x: boundary.position.x,
                        y: boundary.position.y + 5
                    }} 
                }) 
            ){ 
                moving = false;
                break;
            };
        }
        if (moving) movables.forEach(movable => movable.position.y += 5);
    } else if (keys.a.pressed && lastKey === 'a' || touchedButtonLeft === true){
        player.animate = true;
        player.image = player.sprites.left;
        for (let i=0; i<boundaries.length; i++){
            const boundary = boundaries[i];
            if ( 
                rectangularCollision({
                    rectangle1: player, 
                    rectangle2: {...boundary, position: { // `...` to create clone of boundary obj w/o rewriting original obj
                        x: boundary.position.x + 5,
                        y: boundary.position.y
                    }} 
                }) 
            ){ 
                moving = false;
                break;
            };
        }
        if (moving) movables.forEach(movable => movable.position.x += 5);
    } else if (keys.s.pressed && lastKey === 's' || touchedButtonDown === true){
        player.animate = true;
        player.image = player.sprites.down;
        for (let i=0; i<boundaries.length; i++){
            const boundary = boundaries[i];
            if ( 
                rectangularCollision({
                    rectangle1: player, 
                    rectangle2: {...boundary, position: { // `...` to create clone of boundary obj w/o rewriting original obj
                        x: boundary.position.x,
                        y: boundary.position.y - 5
                    }} 
                }) 
            ){ 
                moving = false;
                break;
            };
        }
        if (moving) movables.forEach(movable => movable.position.y -= 5)
    } else if (keys.d.pressed && lastKey === 'd' || touchedButtonRight === true){
        player.animate = true;
        player.image = player.sprites.right;
        for (let i=0; i<boundaries.length; i++){
            const boundary = boundaries[i];
            if ( 
                rectangularCollision({
                    rectangle1: player, 
                    rectangle2: {...boundary, position: { // `...` to create clone of boundary obj w/o rewriting original obj
                        x: boundary.position.x - 5,
                        y: boundary.position.y
                    }} 
                }) 
            ){ 
                moving = false;
                break;
            };
        }
        if (moving) movables.forEach(movable => movable.position.x -= 5)
    } 
}
// animate();

let lastKey = '';
window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = true;
            lastKey = 'w';
            break;
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a';
            break;
        case 's':
            keys.s.pressed = true;
            lastKey = 's';
            break;
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd';
            break;
    }
});

window.addEventListener("keyup", (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
});

let clicked = false;
addEventListener("click", ()=>{
    if (!clicked) {
        audio.Map.play();
        clicked = true;
    }
})

// START SCREEN click to continue
document.querySelector("#startButton").addEventListener("click", ()=>{
    document.querySelector("#startScreen").style.display = 'none';
} )

// initialize adventurer
let adv;

// declare variables for selected nft stats
let selectedStr;
let selectedAgi;
let selectedWis;

// random number generator from 1 to input value
function generateStat(num) {
    return Math.ceil(Math.random() * num);
}

// Randomize character's stats + show it on character screen
document.querySelector("#rollStats").addEventListener("click", (e)=>{
    
    // randomize character stats
    selectedStr = generateStat(10);
    selectedAgi = generateStat(10);
    selectedWis = generateStat(10);

    // show the stats on UI
    document.querySelector("#showStatsStr").innerHTML = `STR: ${selectedStr}`;
    document.querySelector("#showStatsAgi").innerHTML = `AGI: ${selectedAgi}`;
    document.querySelector("#showStatsWis").innerHTML = `WIS: ${selectedWis}`;

    // display 
    document.querySelector("#showStats").style.display = "block";
})

// SET CHARACTER SCREEN click to continue
document.querySelector("#heroButton").addEventListener("click", ()=>{
    document.querySelector("#startScreen2").style.display = 'none'; // hide this screen

    // set adventurer's name
    let advName = document.getElementById("chooseName").value;
    document.querySelector("#nameOverlay").innerHTML = `${advName}`;
    
    // set adventurer's attributes
    let advStr;
    let advAgi;
    let advWis;
    if (selectedStr === "" || selectedStr === undefined ){
        // if no nft selected, generate random values from 1 to 10
        advStr = generateStat(10);
        advAgi = generateStat(10);
        advWis = generateStat(10);
    } else {
        // if nft selected, use those values. random roll (if clicked) stats will then replace prior values.
        advStr = selectedStr;
        advAgi = selectedAgi;
        advWis = selectedWis;
    }
    
    // create new Adventurer player
    adv = new Adventurer(advName, advStr, advAgi, advWis);
    console.log(adv);
    
    // // GOD MODE FOR SPEEDING UP GAME FOR TESTING
    // adv.attr.level = 3;
    // adv.attr.xp = 145;
    // adv.attr.strength = 15;
    // adv.attr.agility = 15;
    // adv.attr.wisdom = 15;
    // console.log(`god mode enabled!`)
} )

// in SET CHARACTER SCREEN, click "(View)" to LOAD and SHOW nfts
document.querySelector("#viewNft").addEventListener("click", ()=>{
    document.querySelector("#nftScreen").style.display = "flex"; // show nft gallery

    // call function in `nft.js` which will:
    // a) connect player's Metamask to website, and 
    // b) load nfts of adv collection that are owned by this player
    main();
})

// click to close nft gallery
document.querySelector("#nftScreenButton").addEventListener("click", ()=>{

    // get stats from selected nft
    selectedStr = Number(document.querySelector("#selectStr").innerHTML);
    selectedAgi = Number(document.querySelector("#selectAgi").innerHTML);
    selectedWis = Number(document.querySelector("#selectWis").innerHTML);

    // if an nft was selected,
    if (selectedStr !== undefined){
        // change the #chooseNft select box selected option to `Adventurer NFT`
        const selected = document.querySelector('#chooseNft');
        selected.value = '2'
    }

    // hide nft screen
    document.querySelector("#nftScreen").style.display = "none";

    // empty the content
    document.querySelector("#showNfts").replaceChildren(); 
    // TODO: how to prevent Loading NFTs more than once?
    // it does delete the targeted DIVs, but when click #viewNft again, it loads the old "deleted" divs too

    // display stats on UI
    document.querySelector("#showStatsStr").innerHTML = `STR: ${selectedStr}`;
    document.querySelector("#showStatsAgi").innerHTML = `AGI: ${selectedAgi}`;
    document.querySelector("#showStatsWis").innerHTML = `WIS: ${selectedWis}`;
    document.querySelector("#showStats").style.display = "block";
})

// LEVEL UP SCREEN click to confirm/continue
document.querySelector("#levelUpButton").addEventListener("click", ()=>{
    // close levelUpOverlay
    document.querySelector("#levelUpOverlay").style.display = 'none';

    // levelUp logic

    // level 2: select class
    if (adv.attr.level === 2){
        let inputClass = document.getElementById("chooseClass").value;
        adv.class = inputClass;
        document.querySelector("#nameOverlay").innerHTML = `${adv.name} (${inputClass})`;

        // increase adventurer's mainStat attribute
        if (adv.class === "Swordsman") adv.attr.strength += 2;
        else if (adv.class === "Archer") adv.attr.agility += 2;
        else if (adv.class === "Wizard") adv.attr.wisdom += 2;

        // logs
        console.log(`Selected Class: ${adv.class}. Added +1 to class' mainStat`);
        console.log(`new attributes after select class: ${adv.attr.strength}, ${adv.attr.agility}, ${adv.attr.wisdom}`);
    }
    
    // level 4++: add total 3 stats points to any combination of attributes every level
    if (adv.attr.level >= 4){
        // get input values
        let strToAdd = Number(document.querySelector("#addStr").value);
        let agiToAdd = Number(document.querySelector("#addAgi").value);
        let wisToAdd = Number(document.querySelector("#addWis").value);
        // log
        console.log(strToAdd, agiToAdd, wisToAdd);

        if (strToAdd+agiToAdd+wisToAdd === 9) {
            // if sum is exactly 3, increase adventurer attributes
            adv.attr.strength += strToAdd;
            adv.attr.agility += agiToAdd;
            adv.attr.wisdom += wisToAdd;
            
            // logs
            console.log(`ADDED ${strToAdd}STR, ${agiToAdd}AGI, ${wisToAdd}WIS`);
            console.log(`new attributes after add stats: ${adv.attr.strength}, ${adv.attr.agility}, ${adv.attr.wisdom}`);
        } else { 
            // otherwise keep showing this screen and prompt user
            document.querySelector("#levelUpOverlay").style.display = 'block';
            alert(`STR + AGI + WIS must be EQUAL TO 9`);
        } 
    }

    // level 5: equip class weapon if available
    if (adv.attr.level === 5){
        // get data added on dom from battleScene.js
        let inputWeapon = document.getElementById("equipWeapon").value;

        if (inputWeapon !== `none`){            
            // if there's data (i.e. weapon is available), do the following:
            
            // check if adv.gear (object) is empty
            // https://bobbyhadz.com/blog/javascript-check-if-object-is-empty
            const obj = adv.gear;
            if (Object.keys(obj).length === 0) {
                // if empty, equip weapon:

                // manage inventory
                adv.gear[`${inputWeapon}`] = 1; // add weapon to gear
                adv.bag[`${inputWeapon}`] -= 1; // deduct 1 from bag
                console.log(`attached ${inputWeapon} to gear`)

                // manage stats increase
                const classAttrMap = {
                    Swordsman: "strength",
                    Archer: "agility",
                    Wizard: "wisdom"
                }
                adv.attr[classAttrMap[adv.class]] += 3;
                // if (adv.class === "Swordsman") adv.attr.strength += 3;
                // else if (adv.class === "Archer") adv.attr.agility += 3;
                // else if (adv.class === "Wizard") adv.attr.wisdom += 3;

                // logs
                console.log(`increase mainStat by 3`);
                console.log(`new attributes after weapon equip: ${adv.attr.strength}, ${adv.attr.agility}, ${adv.attr.wisdom}`);
            }   
        }
    }

    // other levelUp logic @ battleScene.js initBattle()

})

// click button to close penalty screen
document.querySelector("#penaltyButton").addEventListener("click", ()=>{
    document.querySelector("#penaltyOverlay").style.display = 'none';
})

// record when control buttons are being touched/clicked
let touchedButtonUp = false;
let touchedButtonLeft = false;
let touchedButtonDown = false;
let touchedButtonRight = false;

// get button elements
let buttonUp = document.getElementById("moveButtonUp");
let buttonLeft = document.getElementById("moveButtonLeft");
let buttonDown = document.getElementById("moveButtonDown");
let buttonRight = document.getElementById("moveButtonRight");

// add event listeners for touch events on game buttons
buttonUp.addEventListener("touchstart", () => { touchedButtonUp = true; });
buttonLeft.addEventListener("touchstart", () => { touchedButtonLeft = true; });
buttonDown.addEventListener("touchstart", () => { touchedButtonDown = true; });
buttonRight.addEventListener("touchstart", () => { touchedButtonRight = true; });

buttonUp.addEventListener("touchend", () => { touchedButtonUp = false; });
buttonLeft.addEventListener("touchend", () => { touchedButtonLeft = false; });
buttonDown.addEventListener("touchend", () => { touchedButtonDown = false; });
buttonRight.addEventListener("touchend", () => { touchedButtonRight = false; });

// add event listeners for mouse events on game buttons
buttonUp.addEventListener("mousedown", () => { touchedButtonUp = true; });
buttonLeft.addEventListener("mousedown", () => { touchedButtonLeft = true; });
buttonDown.addEventListener("mousedown", () => { touchedButtonDown = true; });
buttonRight.addEventListener("mousedown", () => { touchedButtonRight = true; });

buttonUp.addEventListener("mouseup", () => { touchedButtonUp = false; });
buttonLeft.addEventListener("mouseup", () => { touchedButtonLeft = false; });
buttonDown.addEventListener("mouseup", () => { touchedButtonDown = false; });
buttonRight.addEventListener("mouseup", () => { touchedButtonRight = false; });
