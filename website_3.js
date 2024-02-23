document.addEventListener('DOMContentLoaded', function() {
    // Slider functionality
    showSlides();
    
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
