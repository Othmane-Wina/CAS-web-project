let index = 0;
const slideWidth = 800; // Updated width

function moveSlide(step) {
    const slides = document.querySelector('.carousel .container');
    const totalSlides = slides.children.length;
    
    index += step;
    if (index >= totalSlides) index = 0;
    if (index < 0) index = totalSlides - 1;
    
    slides.style.transform = `translateX(${-index * slideWidth}px)`;
}

// Auto-slide every 3 seconds
setInterval(() => moveSlide(1), 3000);
