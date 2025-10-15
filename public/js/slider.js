(function () {
  const slides = document.querySelectorAll(".slide");
  const slidesContainer = document.querySelector(".slides");
  const dots = document.querySelectorAll(".dot");
  const btnPrev = document.querySelector(".arrow-left");
  const btnNext = document.querySelector(".arrow-right");
  const totalSlides = slides.length;
  let currentIndex = 0;
  let slideInterval;
  function updateSlider(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    slidesContainer.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
      dot.setAttribute("aria-selected", i === index ? "true" : "false");
      dot.setAttribute("tabindex", i === index ? "0" : "-1");
    });
    currentIndex = index;
  }
  function nextSlide() {
    updateSlider(currentIndex + 1);
  }
  function prevSlide() {
    updateSlider(currentIndex - 1);
  }
  btnNext.addEventListener("click", () => {
    nextSlide();
    resetInterval();
  });
  btnPrev.addEventListener("click", () => {
    prevSlide();
    resetInterval();
  });
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      updateSlider(i);
      resetInterval();
    });
    dot.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        updateSlider(i);
        resetInterval();
      }
    });
  });
  function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
  }
  updateSlider(0);
  slideInterval = setInterval(nextSlide, 5000);
})();

document.addEventListener("DOMContentLoaded", function () {
  const sliderContainer = document.querySelector(".slider-container");
  const slides = document.querySelectorAll(".video-item");
  const dots = document.querySelectorAll(".slider-dot");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  let currentIndex = 0;
  const slideCount = slides.length;

  function updateSlider() {
    sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  // Next slide
  nextBtn.addEventListener("click", function () {
    currentIndex = (currentIndex + 1) % slideCount;
    updateSlider();
  });

  // Previous slide
  prevBtn.addEventListener("click", function () {
    currentIndex = (currentIndex - 1 + slideCount) % slideCount;
    updateSlider();
  });

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener("click", function () {
      currentIndex = index;
      updateSlider();
    });
  });

  // Auto slide (optional)
  setInterval(function () {
    currentIndex = (currentIndex + 1) % slideCount;
    updateSlider();
  }, 5000);
});
