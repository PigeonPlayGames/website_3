class Tamagotchi {
    constructor(name) {
        this.name = name;
        this.hunger = 50; // Initial hunger level
        this.energy = 50; // Initial energy level
        this.mood = 50;  // Initial mood level
        this.cleanliness = 50; // Initial cleanliness level
        this.health = 50; // Initial health level
        this.timer = null;
    }

    startLifeCycle() {
        this.timer = setInterval(() => {
            this.hunger += 2;
            this.energy -= 2;
            this.mood -= 1;
            this.cleanliness -= 3;
            this.health = this.calculateHealth();
            this.updateUI();
            this.checkStatus();
        }, 1000); // Update every second
    }

    feed() {
        this.hunger = Math.max(0, this.hunger - 30);
        this.updateUI();
    }

    play() {
        if (this.energy > 10) {
            this.energy -= 10;
            this.mood += 20;
            this.updateUI();
        }
    }

    sleep() {
        this.energy += 20;
        this.updateUI();
    }

    clean() {
        this.cleanliness = 100;
        this.updateUI();
    }

    calculateHealth() {
        return Math.max(0, Math.min(100, this.health + (this.cleanliness / 2) - (this.hunger / 5)));
    }

    checkStatus() {
        if (this.health <= 0 || this.hunger >= 100) {
            clearInterval(this.timer);
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
}

const myPet = new Tamagotchi('Fluffy');

document.addEventListener('DOMContentLoaded', () => {
    myPet.startLifeCycle();
    document.getElementById('feed-button').addEventListener('click', () => myPet.feed());
    document.getElementById('play-button').addEventListener('click', () => myPet.play());
    document.getElementById('sleep-button').addEventListener('click', () => myPet.sleep());
    document.getElementById('clean-button').addEventListener('click', () => myPet.clean());
});
