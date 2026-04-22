import "./header.scss";

import device from "current-device";

import { gsap, ScrollTrigger } from "gsap/all";

import { initSmoothScrolling } from "@/shared/scripts/scroll/leniscroll";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.normalizeScroll(true);

// Допомагає уникнути стрибків при закріпленні елементів
ScrollTrigger.config({
  ignoreMobileResize: true,
  anticipatePin: 1,
});

initSmoothScrolling();

document.addEventListener("DOMContentLoaded", () => {
  const langBtn = document.querySelector("[data-lang-switcher]");
  if (!langBtn) return;

  const btnText = langBtn.querySelector("[data-lang-current]");

  // Перевіряємо, чи ми зараз на англійській версії
  const currentPath = window.location.pathname;
  const isEnglish = /^\/en(\/|$)/.test(currentPath);

  // Зберігаємо поточну мову для стилів desktop-перемикача
  langBtn.setAttribute("data-current-lang", isEnglish ? "en" : "uk");

  // Для mobile залишаємо короткий поточний напис
  if (btnText) {
    btnText.textContent = isEnglish ? "EN" : "UA";
  }

  langBtn.addEventListener("click", (e) => {
    e.preventDefault();

    let newPath;
    const clickPath = window.location.pathname;
    const isEnglishPath = /^\/en(\/|$)/.test(clickPath);

    if (isEnglishPath) {
      // Перемикаємо з EN на UA (замінюємо /en/ на /uk/)
      newPath = clickPath.replace(/^\/en(\/|$)/, "/uk$1");
    } else {
      // Перемикаємо з UA на EN (замінюємо /uk/ на /en/)
      newPath = /^\/uk(\/|$)/.test(clickPath)
        ? clickPath.replace(/^\/uk(\/|$)/, "/en$1")
        : `/en${clickPath === "/" ? "" : clickPath}`;
    }
    console.log("New path:", window.location.origin + newPath + window.location.search);
    // Очищення зайвих слешів, якщо вони виникли при заміні
    newPath = newPath.replace(/\/+/g, "/");

    window.location.href = window.location.origin + newPath + window.location.search;
  });
});

let lastScroll = 0;
const header = document.querySelector(".header");

const scrollThreshold = 10; // мінімальна зміна для реагування

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  // Якщо прокрутка незначна — нічого не робимо
  if (Math.abs(currentScroll - lastScroll) < scrollThreshold) return;

  if (currentScroll > lastScroll && currentScroll > header.offsetHeight) {
    // Користувач крутить вниз
    header.classList.add("hide");
  } else {
    // Користувач крутить вгору
    header.classList.remove("hide");
  }

  lastScroll = currentScroll;
});
const formTimeline = gsap.timeline({
  paused: true,
  defaults: { ease: "power3.out" },
});

// Використовуємо xPercent та yPercent всюди.
// Це додається ДО твого CSS translate(-50%, -50%), а не затирає його.
const formDirectionFrom =
  window.innerWidth > 1024
    ? { xPercent: 100 } // Виїзд справа (буде 100% + твої -50% з CSS)
    : { yPercent: 20, xPercent: -50 }; // Підпливання знизу на моб (буде 20% + твоє зміщення з CSS)

const formDirectionTo =
  window.innerWidth > 1024
    ? { xPercent: 0 } // Повернення до значень CSS
    : { yPercent: -50, xPercent: -50 };

formTimeline
  .fromTo(
    "[data-call-us-modal]",
    {
      ...formDirectionFrom,
      opacity: 0,
      filter: "blur(15px)",
    },
    {
      ...formDirectionTo,
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.5,
      // В кінці анімації GSAP залишить інлайново xPercent: 0 і yPercent: 0,
      // що дозволить твоїм CSS стилям працювати коректно.
    },
  )
  .fromTo(
    ".form-title, .form-descr",
    {
      yPercent: 30, // Також замінив на відсотки для стабільності
      opacity: 0,
      stagger: 0.1,
      filter: "blur(10px)",
      duration: 0.4,
    },
    {
      yPercent: 0, // Також замінив на відсотки для стабільності
      opacity: 1,
      stagger: 0.1,
      filter: "blur(0px)",
      duration: 0.4,
    },
    ">",
  )
  .from(
    ".form-field",
    {
      yPercent: 20,
      opacity: 0,
      stagger: 0.05,
      filter: "blur(8px)",
      duration: 0.4,
    },
    "-=0.3",
  );

const menuTimeline = gsap.timeline({
  paused: true,
  defaults: { ease: "power3.out", duration: 1 },
});

menuTimeline
  .to(".menu-overlay", {
    visibility: "visible",
    pointerEvents: "all",
    opacity: 1,
    duration: 0.25,
  })
  .from(".menu-container", {
    xPercent: 100,
    duration: 0.3,
    ease: "power3.out",
  })
  .from(".menu-nav-list .menu-main-link", {
    yPercent: -50,
    stagger: 0.1,
    duration: 0.5,
    opacity: 0,
    ease: "power3.out",
    filter: "blur(10px)",
  })
  .from(
    ".socials-block__title",
    {
      xPercent: -50,
      opacity: 0,
      ease: "power3.out",
      filter: "blur(10px)",
    },
    "<",
  )
  .from(
    ".socials-list .social-link ",
    {
      xPercent: -50,
      stagger: 0.1,
      duration: 0.3,
      opacity: 0,
      ease: "power3.out",
      filter: "blur(10px)",
    },
    "<",
  );

document.body.addEventListener("click", function (evt) {
  const close = evt.target.closest("[data-call-us-modal-close]");
  const form = evt.target.closest("[data-call-us-modal]");
  const btn = evt.target.closest("[data-call-us-btn]");
  const overflow = document.querySelector("[data-call-us__overflow]");
  const btnMob = evt.target.closest("[data-mob-call-btn]");
  const overflowMob = document.querySelector("[data-mob-call__overflow]");
  const closeMob = evt.target.closest("[data-mob-call-close]");
  const countryList = evt.target.closest(".iti__country-list");
  const btnUp = evt.target.closest("[data-btn-up]");
  const btnMenuTarget = evt.target.closest("[data-menu-button]");
  const btnMenuClose = evt.target.closest("[data-menu-close]");
  const menu = document.querySelector("[data-menu]");
  const menuItem = evt.target.closest(".menu-item");
  const submitBtn = evt.target.closest("[data-btn-submit]");
  const tyPopup = document.querySelector("[data-ty-popup]");
  if (btnMenuTarget || menuItem) {
    const isHidden = menu.classList.contains("hidden");

    if (isHidden) {
      window.dispatchEvent(new Event("stop-scroll"));
      menu.classList.remove("hidden");
      header.classList.add("menu-is-open");

      menuTimeline.play();
    } else {
      window.dispatchEvent(new Event("start-scroll"));
      menuTimeline.reverse();
      setTimeout(() => {
        menu.classList.add("hidden");
      }, 300);

      header.classList.remove("menu-is-open");
    }

    return;
  }
  if (btnMenuClose || evt.target === menu) {
    window.dispatchEvent(new Event("start-scroll"));
    menuTimeline.reverse();
    setTimeout(() => {
      menu.classList.add("hidden");
    }, 300);

    header.classList.remove("menu-is-open");
  }
  if (btnUp) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  if (btn) {
    if (overflow.classList.contains("hidden")) {
      window.dispatchEvent(new Event("stop-scroll"));
      overflowMob.classList.add("hidden");
      formTimeline.play();
      return overflow.classList.remove("hidden");
    }
    return;
  }

  if (close) {
    window.dispatchEvent(new Event("start-scroll"));
    formTimeline.reverse();
    tyPopup.classList.add("hidden");
    setTimeout(() => {
      overflow.classList.add("hidden");
    }, 300);
    return;
  }
  if (evt.target === overflow) {
    window.dispatchEvent(new Event("start-scroll"));
    formTimeline.reverse();
    tyPopup.classList.add("hidden");
    setTimeout(() => {
      overflow.classList.add("hidden");
    }, 300);
    return;
  }

  if (btnMob) {
    if (overflowMob.classList.contains("hidden")) {
      window.dispatchEvent(new Event("stop-scroll"));

      return overflowMob.classList.remove("hidden");
    }
    return;
  }
  if (closeMob) {
    window.dispatchEvent(new Event("start-scroll"));

    return overflowMob.classList.add("hidden");
  }

  if (evt.target === overflowMob) {
    window.dispatchEvent(new Event("start-scroll"));

    return overflowMob.classList.add("hidden");
  }
});
