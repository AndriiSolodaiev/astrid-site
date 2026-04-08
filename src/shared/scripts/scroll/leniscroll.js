// eslint-disable-next-line import/no-extraneous-dependencies
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.normalizeScroll(true);

// Допомагає уникнути стрибків при закріпленні елементів
ScrollTrigger.config({
  ignoreMobileResize: true,
  anticipatePin: 1,
});
// Define a variable that will store the Lenis smooth scrolling object
let lenis;

let isInited = false;
export const initSmoothScrolling = () => {
  // Instantiate the Lenis object with specified properties
  if (isInited) return lenis;

  lenis = new Lenis({
    lerp: 0.1,
    infinite: false, // Lower values create a smoother scroll effect
    smoothWheel: true, // Enables smooth scrolling for mouse wheel events
  });

  // Update ScrollTrigger each time the user scrolls
  lenis.on("scroll", () => ScrollTrigger.update());
  window.lenis = lenis;
  window.addEventListener("stop-scroll", () => {
    document.body.style.overflow = "hidden";
    lenis.stop();
  });
  window.addEventListener("start-scroll", () => {
    document.body.style.overflow = "visible";
    lenis.start();
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);

      if (target) {
        setTimeout(() => {
          lenis.scrollTo(target, {
            offset: -10,
            duration: 1, // в секундах
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
          });
        }, 10);
      }
    });
  });
  // Define a function to run at each animation frame
  const scrollFn = (time) => {
    lenis.raf(time); // Run Lenis' requestAnimationFrame method
    requestAnimationFrame(scrollFn); // Recursively call scrollFn on each frame
  };
  // Start the animation frame loop
  requestAnimationFrame(scrollFn);
  isInited = true;
  return lenis;
};

initSmoothScrolling();
