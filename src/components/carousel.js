let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-image');

function changeSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length; 
    slides[currentSlide].classList.add('active');
}


setInterval(changeSlide, 5000); //5 sec interval
