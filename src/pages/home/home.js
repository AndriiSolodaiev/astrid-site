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
ScrollTrigger.normalizeScroll(true);

// Допомагає уникнути стрибків при закріпленні елементів
ScrollTrigger.config({
  ignoreMobileResize: true,
  anticipatePin: 1,
});
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
    allowTouchMove: false,
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

document.addEventListener("DOMContentLoaded", () => {
  // Реєструємо ScrollTrigger, якщо він знадобиться для інших блоків

  const tl = gsap.timeline({
    defaults: {
      ease: "power2.out", // Плавне сповільнення в кінці
      duration: 1.2,
    },
  });

  // Робимо елементи видимими перед початком
  tl.set(
    ".header, .home-hero__img-wrap, .home-hero__block, .home-hero__text-block, .home-location__img-block, .home-location__block",
    {
      visibility: "visible",
    },
  );

  // 1. Анімація Header (зверху вниз)
  tl.from(
    ".header",
    {
      y: -100,
      opacity: 0,
      duration: 1,
    },
    0,
  ); // Починаємо в 0 секунд

  // 2. Анімація головного зображення (зверху вниз + легкий scale)
  tl.from(
    ".home-hero__img-wrap",
    {
      y: -50,
      scale: 1.1,
      opacity: 0,
      duration: 1.5,
    },
    0.2,
  ); // Починаємо з невеликою затримкою від старту

  // 3. Анімація лівого блоку (Заголовок та кнопка "Гортай")
  // Використовуємо stagger: 0.2 для послідовної появи
  tl.from(
    ".home-hero__block > *",
    {
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.2,
      clipPath: "inset(0% 0% 100% 0%)",
    },
    "-=0.8",
  ); // Починаємо раніше, ніж закінчиться попередня анімація

  // 4. Анімація правого блоку з текстом та декоративною іконкою
  tl.from(
    ".home-hero__text-block > *",
    {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      clipPath: "inset(0% 0% 100% 0%)",
    },
    "-=0.6",
  );

  ScrollTrigger.create({
    trigger: ".home-hero",
    start: "top top",
    end: "bottom top",
    pin: true, // "Приклеюємо" блок
    pinSpacing: false, // Наступний блок ігнорує простір і наїжджає
  });
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".home-hero__bg",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    })
    .to(".home-hero__img-wrap img", {
      yPercent: -10, // Ефект паралаксу
      ease: "none",
    })
    .to(
      ".home-hero__bg",
      {
        opacity: 1,
        ease: "none",
      },
      "<",
    );

  const bannerSection = document.querySelector("#section_2.banner");
  const bannerImg = bannerSection.querySelector(".banner__img-wrap img");

  // 1. АНІМАЦІЯ ВІДДАЛЕННЯ (Scale 1.2 -> 1)
  // Використовуємо fromTo, щоб гарантувати старт з 1.2
  gsap.fromTo(
    bannerImg,
    { scale: 1.2 },
    {
      scale: 1,
      ease: "none",
      scrollTrigger: {
        trigger: bannerSection,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    },
  );

  // Заголовок: поява знизу з легким нахилом

  const selectors = [
    ".banner__content h2",
    ".banner__bottom-wrap p",
    ".banner__bottom-wrap .general-btn",
    ".section-title",
    ".home-location__subblock h2",
    ".slogan__img-wrap ",
    ".slogan__text",
    ".home-location__img-wrap img",
    ".home-location__text-wrap p",
    ".home-advantages>h2",
    ".home-advantages>p",
    ".swiper__counter",
    ".home-gallery__subblock h2",
    ".home-progress__title-wrap h2",
    ".home-progress__descr-wrap p",
    ".home-progress__descr-wrap .general-btn",
    ".home-progress__title-wrap h2",
  ];

  selectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);

    elements.forEach((el) => {
      // Анімація через clip-path (імітація overflow: hidden)
      gsap.fromTo(
        el,
        {
          yPercent: 100,
          // Обрізаємо елемент знизу (маска закрита)
          clipPath: "inset(0% 0% 100% 0%)",
        },
        {
          yPercent: 0,
          clipPath: "inset(-3%)", // Маска повністю відкрита
          duration: 1,

          ease: "power3.out", // Більш плавний фініш для преміального вигляду
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
            // will-change допомагає уникнути "мигтіння" при роботі з clip-path
            onEnter: () => (el.style.willChange = "transform, clip-path"),
            onComplete: () => (el.style.willChange = "auto"),
          },
        },
      );
    });
  });
  const advantageItems = document.querySelectorAll(".advantages-item");

  advantageItems.forEach((item, index) => {
    // Фіксуємо початковий випадковий нахил для фази появи
    const startRotation = gsap.utils.random(-8, 8);

    // 1. ЕТАП: ПОЯВА (Intro)
    // Закінчується, коли центр картки досягає 60% екрана
    gsap
      .timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 95%", // Початок появи знизу
          end: "top 40%", // Фініш появи на 60% висоти в'юпорту
          scrub: 0.5, // М'яка прив'язка до скролу під час появи
        },
      })
      .from(item, {
        opacity: 0,
        y: 120,
        rotation: startRotation,
        ease: "power2.out",
      })
      .from(
        item.querySelector("img"),
        {
          scale: 1.1,
        },
        "<",
      );
    const isEven = (index + 1) % 2 === 0;
    // 2. ЕТАП: ПОСТІЙНИЙ ПЛИН ТА ПІДКРУЧУВАННЯ (Scrub Loop)
    // Починається ПІСЛЯ того, як картка пройшла позначку 60%

    gsap
      .timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 40%", // Початок фази плину (стикується з кінцем появи)
          end: "bottom top", // До повного зникнення зверху
          scrub: 0.5, // Більша інерція для ефекту "невагомості"
        },
      })
      .to(item, {
        // Продовжує плисти вгору
        // Пливемо далі вгору
        x: isEven ? 10 : -5,

        // rotation: isEven ? 2 : -2, // Легке додаткове підкручування
        ease: "none",
      })
      .to(
        item.querySelector("img"),
        {
          filter: "grayscale(30%)",
        },
        "<",
      );
  });
  ScrollTrigger.create({
    trigger: ".home-advantages",
    start: "bottom bottom", // Закріплюємо, коли верх секції торкнувся верху екрана
    pin: true, // Секція застигає
    pinSpacing: false, // Важливо: наступна секція буде ігнорувати простір і наповзати
    end: "bottom top",
    // Тримаємо, поки наступна секція повністю не перекриє
  });

  ScrollTrigger.create({
    trigger: ".home-progress",
    start: "bottom bottom", // Закріплюємо, коли верх секції торкнувся верху екрана
    pin: true, // Секція застигає
    pinSpacing: false, // Важливо: наступна секція буде ігнорувати простір і наповзати
    end: "bottom top",
    // Тримаємо, поки наступна секція повністю не перекриє
  });
  ScrollTrigger.create({
    trigger: ".home-news",
    start: "bottom bottom", // Закріплюємо, коли верх секції торкнувся верху екрана
    pin: true, // Секція застигає
    pinSpacing: false, // Важливо: наступна секція буде ігнорувати простір і наповзати
    end: "bottom top",
    // Тримаємо, поки наступна секція повністю не перекриє
  });
  // 3. ОКРЕМА АНІМАЦІЯ ДЛЯ ФОНУ/КОНТЕЙНЕРА ГАЛЕРЕЇ
  // Це створює відчуття "підтягування" вмісту секції
  gsap.from(".home-gallery__laptop-list li", {
    opacity: 0, // Починаємо з позорості
    yPercent: 50, // Починаємо зміщеними вниз на 100% своєї висоти
    duration: 1.2, // Трохи довша тривалість для плавності
    stagger: 0.15, // Каскадна поява (один за одним)
    ease: "power2.out", // Плавне сповільнення в кінці
    scrollTrigger: {
      trigger: ".home-gallery__laptop-list", // Тригер — увесь список
      start: "top 85%", // Починаємо, коли верх списку на 85% висоти екрана
      toggleActions: "play none none none", // Програти один раз
      // will-change для оптимізації продуктивності під час руху
    },
  });
  gsap.from(".swiper-gallery .swiper-slide", {
    opacity: 0, // Починаємо з позорості
    xPercent: 50, // Починаємо зміщеними вниз на 100% своєї висоти
    duration: 1.2, // Трохи довша тривалість для плавності
    stagger: 0.15, // Каскадна поява (один за одним)
    ease: "power2.out", // Плавне сповільнення в кінці
    scrollTrigger: {
      trigger: ".swiper-gallery", // Тригер — увесь список
      start: "top 85%", // Починаємо, коли верх списку на 85% висоти екрана
      toggleActions: "play none none none", // Програти один раз
      // will-change для оптимізації продуктивності під час руху
    },
  });
  gsap.from(".swiper-progress>.swiper-wrapper>.swiper-slide", {
    opacity: 0, // Починаємо з позорості
    xPercent: 50, // Починаємо зміщеними вниз на 100% своєї висоти
    duration: 1.2, // Трохи довша тривалість для плавності
    stagger: 0.15, // Каскадна поява (один за одним)
    ease: "power2.out", // Плавне сповільнення в кінці
    scrollTrigger: {
      trigger: ".swiper-progress", // Тригер — увесь список
      start: "top 85%", // Починаємо, коли верх списку на 85% висоти екрана
      toggleActions: "play none none none", // Програти один раз
      // will-change для оптимізації продуктивності під час руху
    },
  });
  gsap.from(".swiper-news>.swiper-wrapper>.swiper-slide", {
    opacity: 0, // Починаємо з позорості
    xPercent: 50, // Починаємо зміщеними вниз на 100% своєї висоти
    duration: 1.2, // Трохи довша тривалість для плавності
    stagger: 0.15, // Каскадна поява (один за одним)
    ease: "power2.out", // Плавне сповільнення в кінці
    scrollTrigger: {
      trigger: ".swiper-progress", // Тригер — увесь список
      start: "top 85%", // Починаємо, коли верх списку на 85% висоти екрана
      toggleActions: "play none none none", // Програти один раз
      // will-change для оптимізації продуктивності під час руху
    },
  });
});
