// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Slider functionality
    let slideIndex = 1;
    showSlides(slideIndex);

    function plusSlides(n) {
        showSlides(slideIndex += n);
    }

    function showSlides(n) {
        let slides = document.getElementsByClassName("game-slide");
        if (n > slides.length) { slideIndex = 1 }
        if (n < 1) { slideIndex = slides.length }
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slides[slideIndex - 1].style.display = "block";
    }

    // Event listeners for slider controls
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    if (prevButton) {
        prevButton.addEventListener('click', () => plusSlides(-1));
    }
    if (nextButton) {
        nextButton.addEventListener('click', () => plusSlides(1));
    }

    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger-menu');
    const navUL = document.querySelector('nav ul');
    if (hamburger && navUL) {
        hamburger.addEventListener('click', () => {
            navUL.classList.toggle('show');
        });
    }

    // Visit counter
    if (typeof(Storage) !== "undefined") {
        if (localStorage.visitCount) {
            localStorage.visitCount = Number(localStorage.visitCount) + 1;
        } else {
            localStorage.visitCount = 1;
        }
        document.getElementById("visitCount").innerHTML = "Visit Count: " + localStorage.visitCount;
    } else {
        document.getElementById("visitCount").innerHTML = "Sorry, your browser does not support web storage...";
    }

    // Google Analytics Event Tracking for Game Clicks
    document.querySelectorAll('.hero-images a').forEach(function(link) {
        link.addEventListener('click', function() {
            if (typeof gtag === 'function') {
                gtag('event', 'game_click', {
                    'event_category': 'Games',
                    'event_label': link.querySelector('img').alt,
                    'value': 1
                });
            }
        });
    });

    // Snowfall effect
    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = '❄'; // Use a snowflake emoji
        document.body.appendChild(snowflake);

        // Randomize position and animation duration
        snowflake.style.left = Math.random() * window.innerWidth + 'px';
        snowflake.style.animationDuration = (Math.random() * 3 + 2) + 's'; // 2 to 5 seconds
        snowflake.style.opacity = Math.random();

        // Remove snowflake after animation
        snowflake.addEventListener('animationend', () => {
            snowflake.remove();
        });
    }

    // Generate snowflakes at intervals
    setInterval(createSnowflake, 300); // Adjust frequency of snowflakes

    // Holiday greeting pop-up
    if (!localStorage.greetingShown) {
        alert("Welcome to our Winter Wonderland! Enjoy your stay!");
        localStorage.greetingShown = true; // Prevent showing again
    }

    // Optional: Background music
    // const audio = new Audio('path/to/your/music.mp3'); // Replace with your music file path
    // audio.loop = true; // Loop the music
    // audio.play(); // Start playing the music (ensure user interaction for autoplay)
});
