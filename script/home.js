let index1 = 0;
let index2 = 0;

function moveSlide(step, slide) {
    const slideWidth = (70 / 100) * window.innerWidth;
    const slides = document.querySelector('.carousel .container');
    const totalSlides = slides.children.length;
    
    const words = document.querySelector('.members .container');
    const totalWords = words.children.length;
    
    if(slide){
        index1 += step;
        if (index1 >= totalSlides) index1 = 0;
        else if(index1 < 0) index1 = totalSlides - 1;
        slides.style.transform = `translateX(${-index1 * slideWidth}px)`;
    }
    else{
        index2 += step;
        if (index2 >= totalWords) index2 = 0;
        else if(index2 < 0) index2 = totalWords - 1;
        words.style.transform = `translateX(${-index2 * slideWidth}px)`;
    }
}

setInterval(() => moveSlide(1, false), 18000);

let id = setInterval(() => moveSlide(1, true), 5000);
function resetInterval(){
    clearInterval(id);
    id = setInterval(() => moveSlide(1, true), 5000);
}

