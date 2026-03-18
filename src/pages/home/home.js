import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Swiper from "swiper";
import { Navigation, Autoplay } from "swiper/modules";
import "@shared/scripts/liquid-glass-animation/liquid-glass-animation";
import "./home.scss";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

// Ініціалізація

gsap.registerPlugin(ScrollTrigger);

const formatNumber = (num) => String(num).padStart(2, "0");

/**
 * Функція оновлення HTML лічильника
 */
const updateCounterUI = (current, total) => {
  const counter = document.querySelector(".swiper__counter"); // або ваш селектор лічильника
  if (counter) {
    counter.innerHTML = `
      <span>${formatNumber(current)}</span>
      <span>/</span>
      <span>${formatNumber(total)}</span>
    `;
  }
};

const initLaptopGalleryCounter = () => {
  const galleryList = document.querySelector(".home-gallery__laptop-list");
  const items = document.querySelectorAll(".home-gallery__laptop-list li");

  if (!galleryList || items.length === 0) return;

  // Початкова ініціалізація (01 / всього)
  updateCounterUI(1, items.length);

  const observerOptions = {
    root: null, // null означає відстеження відносно в'юпорту (вікна)
    rootMargin: "0px",
    threshold: 0.7, // Елемент вважається активним, якщо 70% його площі видно
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Отримуємо індекс поточного <li> серед усіх сусідів
        const index = Array.from(items).indexOf(entry.target) + 1;
        updateCounterUI(index, items.length);
      }
    });
  }, observerOptions);

  // Починаємо спостереження за кожним li
  items.forEach((item) => observer.observe(item));
};

// Запуск після завантаження DOM
document.addEventListener("DOMContentLoaded", initLaptopGalleryCounter);

let swiperInstance = null;
const breakpoint = window.matchMedia("(min-width: 1024px)");

const initSwiper = () => {
  // Якщо екран більше 1024px і слайдер існує — знищуємо його
  if (breakpoint.matches) {
    if (swiperInstance !== null) {
      swiperInstance.destroy(true, true);
      swiperInstance = null;
    }
    return;
  }

  // Якщо екран менше або дорівнює 1024px і слайдер ще не створений
  if (swiperInstance === null) {
    swiperInstance = new Swiper(".swiper-gallery", {
      modules: [Autoplay],
      loop: true,
      allowTouchMove: true,
      speed: 1000,
      slidesPerView: 1.1,
      spaceBetween: 12,
      breakpoints: {
        768: {
          slidesPerView: 1.2,
          spaceBetween: 20,
        },
      },
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
    });
  }
};
initSwiper();

// Fancybox.bind('.swiper-slide:not(.swiper-slide-duplicate) [data-fancybox="gallery"]', {
//   dragToClose: false,
//   Image: {
//     zoom: true,
//     showCaption: false,
//   },
// });
// Fancybox.bind('.home-gallery__laptop-list li [data-fancybox="gallery"]', {
//   dragToClose: false,
//   Image: {
//     zoom: true,
//     showCaption: false,
//   },
// });

new Swiper(".swiper-progress", {
  modules: [Navigation, Autoplay],

  allowTouchMove: true,
  slidesPerView: "auto",
  spaceBetween: 12,
  breakpoints: {
    768: {
      spaceBetween: 20,
    },
  },
  speed: 1000,

  navigation: {
    prevEl: "[data-progress-prev]",
    nextEl: "[data-progress-next]",
  },
});
new Swiper(".swiper-news", {
  modules: [Navigation, Autoplay],

  allowTouchMove: true,
  slidesPerView: "auto",
  spaceBetween: 12,
  breakpoints: {
    768: {
      spaceBetween: 20,
    },
  },
  speed: 1000,

  navigation: {
    prevEl: "[data-news-prev]",
    nextEl: "[data-news-next]",
  },
});

Fancybox.bind("[data-fancybox]", {
  Hash: false,
  Thumbs: { autoStart: false },
  tpl: { caption: "" }, // приховуємо підписи
  Image: {
    zoom: true,
    showCaption: false,
  },
});
const initIsolatedGalleries = () => {
  // Шукаємо всі обгортки зображень у картках
  const cardSliders = document.querySelectorAll(".js-inner-slider");

  cardSliders.forEach((slider, index) => {
    // Створюємо унікальне ім'я для цієї конкретної картки
    const uniqueId = `gallery-progress-${index}`;

    // Знаходимо всі посилання всередині ЦІЄЇ картки
    const links = slider.querySelectorAll("a[data-fancybox]");

    links.forEach((link) => {
      // Перезаписуємо атрибут унікальним значенням
      link.setAttribute("data-fancybox", uniqueId);
    });
  });
};

// Викликаємо функцію
initIsolatedGalleries();
// 2. Ініціалізація внутрішніх слайдерів
document.querySelectorAll(".js-inner-slider").forEach((sliderContainer, index) => {
  const counter = sliderContainer.querySelector(".js-inner-counter");
  const prevEl = sliderContainer.querySelector(".js-inner-prev");
  const nextEl = sliderContainer.querySelector(".js-inner-next");

  // Автоматично присвоюємо унікальний ID для кожної галереї в картці
  const galleryId = `gallery-${index}`;
  sliderContainer.querySelectorAll(".js-fancybox-item").forEach((link) => {
    link.setAttribute("data-fancybox", galleryId);
  });
  if (!counter) return;
  new Swiper(sliderContainer, {
    modules: [Navigation],
    nested: true, // щоб не конфліктувати з головним слайдером
    slidesPerView: 1,

    navigation: {
      nextEl: nextEl,
      prevEl: prevEl,
    },
    on: {
      init(s) {
        counter.textContent = `${formatNumber(s.realIndex + 1)} / ${formatNumber(s.slides.length)}`;
      },
      slideChange(s) {
        counter.textContent = `${formatNumber(s.realIndex + 1)} / ${formatNumber(s.slides.length)}`;
      },
    },
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".btn-down").addEventListener("click", () => {
    if (window.innerWidth < 1024) {
      window.location.href = "/home#section2";
    }
  });
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });
});
