// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Slider functionality
    showSlides();
@@ -11,6 +9,18 @@ document.addEventListener('DOMContentLoaded', function() {
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
