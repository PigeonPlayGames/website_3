class Tamagotchi {
    constructor(name) {
        this.name = name;
        this.hunger = 50; // Initial hunger level
        this.energy = 50; // Initial energy level
        this.mood = 50;  // Initial mood level
        this.cleanliness = 50; // Initial cleanliness level
        this.health = 100; // Initial health level, set to 100 for better survivability
        this.timer = null;
        this.movementTimer = null;
    }

    startLifeCycle() {
        this.timer = setInterval(() => {
            this.hunger = Math.min(100, this.hunger + 1);
            this.energy = Math.max(0, this.energy - 1);
            this.mood = Math.max(0, this.mood - 1);
            this.cleanliness = Math.max(0, this.cleanliness - 1);
            this.health = this.calculateHealth();
            this.updateUI();
            this.checkStatus();
        }, 1000); // Update every second

        this.startRandomMovement();
    }

    feed() {
        this.hunger = Math.max(0, this.hunger - 20);
        this.mood += 5;
        this.updateUI();
    }

    play() {
        if (this.energy > 5) {
            this.energy -= 5;
            this.mood += 10;
            this.updateUI();
        }
    }

    sleep() {
        this.energy += 15;
        this.mood += 5;
        this.updateUI();
    }

    clean() {
        this.cleanliness = 100;
        this.health += 5; // Direct improvement to health
        this.updateUI();
    }

    calculateHealth() {
        let baseHealth = 50;
        baseHealth += this.cleanliness - (100 - this.energy) - this.hunger;
        return Math.max(0, Math.min(100, baseHealth));
    }

    checkStatus() {
        if (this.health <= 0 || this.hunger >= 100) {
            clearInterval(this.timer);
            clearInterval(this.movementTimer);
            alert(`${this.name} has passed away.`);
        }
    }

    updateUI() {
        document.getElementById('hunger').textContent = `Hunger: ${this.hunger}`;
        document.getElementById('energy').textContent = `Energy: ${this.energy}`;
        document.getElementById('mood').textContent = `Mood: ${this.mood}`;
        document.getElementById('cleanliness').textContent = `Cleanliness: ${this.cleanliness}`;
        document.getElementById('health').textContent = `Health: ${this.health}`;
    }

    startRandomMovement() {
        this.movementTimer = setInterval(() => {
            const pet = document.getElementById('pet');
            const maxX = pet.parentElement.offsetWidth - pet.offsetWidth;
            const maxY = pet.parentElement.offsetHeight - pet.offsetHeight;
            const newX = Math.random() * maxX;
            const newY = Math.random() * maxY;
            pet.style.left = `${newX}px`;
            pet.style.top = `${newY}px`;
        }, 2000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const myPet = new Tamagotchi('Fluffy');
    myPet.startLifeCycle();
    document.getElementById('feed-button').addEventListener('click', () => myPet.feed());
    document.getElementById('play-button').addEventListener('click', () => myPet.play());
    document.getElementById('sleep-button').addEventListener('click', () => myPet.sleep());
    document.getElementById('clean-button').addEventListener('click', () => myPet.clean());
});
