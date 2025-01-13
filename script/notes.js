let index = 0;

function moveSlide(step, arrow) {
    const slideWidth = (70 / 100) * window.innerWidth;
    const slides = document.querySelector('.notes .container');
    const totalSlides = slides.children.length;
    
    index += step;
    if(arrow){
        if (index >= totalSlides - 1){
            document.querySelector('.next').innerHTML = ` `;
        }
        else{
            document.querySelector('.next').innerHTML = `<button class="move" onclick="moveSlide(1, true)">&#10095;</button>`;
        }
        if(index < 1){
            document.querySelector('.prev').innerHTML = ` `;
        }
        else{
            document.querySelector('.prev').innerHTML = `<button class="move" onclick="moveSlide(-1, true)">&#10094;</button>`;
        }
    }
    else{
        index = step;
        if(index == totalSlides -1){
            document.querySelector('.next').innerHTML = ` `;
            document.querySelector('.prev').innerHTML = `<button class="move" onclick="moveSlide(-1, true)">&#10094;</button>`;
        }
        else if(index == 0){
            document.querySelector('.prev').innerHTML = ` `;
            document.querySelector('.next').innerHTML = `<button class="move" onclick="moveSlide(1, true)">&#10095;</button>`;
        }
        else{
            document.querySelector('.prev').innerHTML = `<button class="move" onclick="moveSlide(-1, true)">&#10094;</button>`;
            document.querySelector('.next').innerHTML = `<button class="move" onclick="moveSlide(1, true)">&#10095;</button>`;
        }
    }
    slides.style.transform = `translateX(${-index * slideWidth}px)`;
}

