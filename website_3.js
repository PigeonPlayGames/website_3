// Remove the loading spinner once the page has fully loaded
window.addEventListener('load', function () {
    document.getElementById('loading-spinner').style.display = 'none';
});

// Scroll Progress Indicator
window.onscroll = function () {
    scrollProgress();
};

function scrollProgress() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    document.getElementById('scroll-indicator').style.width = scrolled + '%';
}

// Hamburger menu toggle for mobile view
const hamburger = document.querySelector('.hamburger-menu');
const navUL = document.querySelector('nav ul');
hamburger.addEventListener('click', () => {
    navUL.classList.toggle('show');
});

// Visit Counter - Uses local storage to count visits
if (typeof(Storage) !== 'undefined') {
    if (localStorage.visitCount) {
        localStorage.visitCount = Number(localStorage.visitCount) + 1;
    } else {
        localStorage.visitCount = 1;
    }
    document.getElementById('visitCount').innerHTML = 'Visit Count: ' + localStorage.visitCount;
} else {
    document.getElementById('visitCount').innerHTML = 'Sorry, your browser does not support web storage...';
}

// Game Slider Functionality
let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName('game-slide');
    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    slides[slideIndex - 1].style.display = 'block';
}

// Google Analytics Event Tracking for Game Clicks
document.querySelectorAll('.hero-images a').forEach(function (link) {
    link.addEventListener('click', function () {
        gtag('event', 'game_click', {
            'event_category': 'Games',
            'event_label': link.querySelector('img').alt,
            'value': 1
        });
    });
});

// Lazy loading images for performance optimization
document.addEventListener('DOMContentLoaded', function () {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        img.addEventListener('load', function () {
            img.classList.add('fade-in');
        });
    });
});

// Add a fade-in effect for lazy-loaded images
const fadeInStyle = document.createElement('style');
fadeInStyle.innerHTML = `
    .fade-in {
        animation: fadeIn 0.5s ease-in-out;
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(fadeInStyle);
