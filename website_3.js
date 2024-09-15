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
        if (n > slides.length) {slideIndex = 1}
        if (n < 1) {slideIndex = slides.length}
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slides[slideIndex-1].style.display = "block";
    }

    // Event listeners for slider controls
    document.querySelector('.prev').addEventListener('click', () => plusSlides(-1));
    document.querySelector('.next').addEventListener('click', () => plusSlides(1));

    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger-menu');
    const navUL = document.querySelector('nav ul');
    hamburger.addEventListener('click', () => {
        navUL.classList.toggle('show');
    });

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
            gtag('event', 'game_click', {
                'event_category': 'Games',
                'event_label': link.querySelector('img').alt,
                'value': 1
            });
        });
    });
});
