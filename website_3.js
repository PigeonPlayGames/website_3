// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Slider functionality
    showSlides();
    
    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger-menu');
    const navUL = document.querySelector('nav ul');
    
    hamburger.addEventListener('click', () => {
        navUL.classList.toggle('show');
    });
});

// Enhanced slider functionality from previous steps
let slideIndex = 0;

function showSlides() {
    let slides = document.getElementsByClassName("game-slide");
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}
    slides[slideIndex-1].style.display = "block";
    setTimeout(showSlides, 4000); // Change image every 4 seconds
}
