// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Simple slider logic will go here
    console.log("Website loaded and ready!");

// Enhanced slider functionality
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

document.addEventListener('DOMContentLoaded', function() {
    showSlides();
});
