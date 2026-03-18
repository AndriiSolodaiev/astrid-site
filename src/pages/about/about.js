import "./about.scss";
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { gsap } from "gsap";

const swiperComfort = new Swiper(".swiper-comfort", {
  modules: [Navigation, Pagination],
  slidesPerView: 1.1,
  spaceBetween: 20,
  speed: 800,
  // Навігація працює для обох наборів кнопок (моб і десктоп),
  // якщо у них однакові дата-атрибути
  navigation: {
    nextEl: "[data-comfort-next]",
    prevEl: "[data-comfort-prev]",
  },
  // Адаптивність
  breakpoints: {
    1024: {
      slidesPerView: "auto",
      direction: "vertical", // Стає вертикальним
      autoHeight: false,
      navigation: {
        nextEl: "[data-comfort-laptop-next]",
        prevEl: "[data-comfort-laptop-prev]",
      }, // Важливо: для вертикального краще фіксована висота
    },
  },
  on: {
    init: function (swiper) {
      updateText(swiper, true, ".about-comfort");
    },
    slideChange: function (swiper) {
      updateText(swiper, false, ".about-comfort");
    },
  },
});

function updateText(swiper, isInit, containerSelector) {
  const activeSlide = swiper.slides[swiper.activeIndex];
  const title = activeSlide.dataset.title;
  const text = activeSlide.dataset.text;
  const container = document.querySelector(containerSelector);
  const titleEl = document.querySelector(`${containerSelector}__text-wrap h3`);
  const descEl = document.querySelector(`${containerSelector}__text-wrap p`);
  const counterEl = document.querySelector(`${containerSelector}__counter`);

  // Оновлення лічильника
  const current = (swiper.activeIndex + 1).toString().padStart(2, "0");
  const total = swiper.slides.length.toString().padStart(2, "0");
  counterEl.textContent = `${current} / ${total}`;

  if (isInit) {
    titleEl.textContent = title;
    descEl.textContent = text;
  } else {
    // Анімація GSAP
    gsap
      .timeline()
      .to([titleEl, descEl], {
        opacity: 0,
        y: 15,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          titleEl.textContent = title;
          descEl.textContent = text;
        },
      })
      .to([titleEl, descEl], {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      });
  }
}

const swiperCommercial = new Swiper(".swiper-commercial", {
  modules: [Navigation, Pagination],
  slidesPerView: 1.1,
  spaceBetween: 20,
  speed: 800,
  // Навігація працює для обох наборів кнопок (моб і десктоп),
  // якщо у них однакові дата-атрибути
  navigation: {
    nextEl: "[data-commercial-next]",
    prevEl: "[data-commercial-prev]",
  },
  // Адаптивність
  breakpoints: {
    1024: {
      slidesPerView: "auto",
      direction: "vertical", // Стає вертикальним
      autoHeight: false,
      navigation: {
        nextEl: "[data-commercial-laptop-next]",
        prevEl: "[data-commercial-laptop-prev]",
      }, // Важливо: для вертикального краще фіксована висота
    },
  },
  on: {
    init: function (swiper) {
      updateText(swiper, true, ".about-commercial");
    },
    slideChange: function (swiper) {
      updateText(swiper, false, ".about-commercial");
    },
  },
});
