import "./documents.scss";
import { gsap } from "gsap";
const updateFileSizes = async () => {
  const fileLinks = document.querySelectorAll(".js-file-link");

  fileLinks.forEach(async (link) => {
    const sizeSpan = link.querySelector(".document-card__size");
    const fileUrl = link.getAttribute("href");

    if (!fileUrl || !sizeSpan) return;

    try {
      // Робимо HEAD запит, щоб отримати тільки заголовки
      const response = await fetch(fileUrl, { method: "HEAD" });
      const sizeInBytes = response.headers.get("content-length");

      if (sizeInBytes) {
        // Конвертація: Байти -> Кілобайти -> Мегабайти
        const sizeInMb = (sizeInBytes / (1024 * 1024)).toFixed(2);
        sizeSpan.textContent = `${sizeInMb} MB`;
      } else {
        sizeSpan.textContent = "--- MB";
      }
    } catch (error) {
      console.error("Помилка отримання розміру файлу:", error);
      sizeSpan.textContent = "Error";
    }
  });
};

document.addEventListener("DOMContentLoaded", updateFileSizes);

const newsFunctional = () => {
  const newsSection = document.querySelector(".documents");
  const newsList = document.querySelector(".documents__list");
  const cards = Array.from(document.querySelectorAll(".document-card"));
  const loadMoreBtnWrap = document.querySelector(".load-more-btn-wrap");
  const loadMoreBtn = document.querySelector(".load-more-btn");
  const btnText = loadMoreBtn?.querySelector("span");

  if (!newsList || cards.length === 0 || !loadMoreBtn) return;

  const getStep = () => 6;
  let currentShown = getStep();

  const checkBtnPersistence = () => {
    if (cards.length <= getStep()) {
      loadMoreBtnWrap.style.display = "none";
    } else {
      loadMoreBtnWrap.style.display = "flex";
    }
  };

  const updateVisibility = (isInitial = false) => {
    const newlyAdded = [];

    cards.forEach((card, index) => {
      if (index < currentShown) {
        if (card.style.display === "none" || isInitial) {
          card.style.display = "flex";
          if (!isInitial) newlyAdded.push(card);
        }
      } else {
        card.style.display = "none";
      }
    });

    if (newlyAdded.length > 0) {
      gsap.fromTo(
        newlyAdded,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          clearProps: "all",
        },
      );
    }

    if (currentShown >= cards.length) {
      btnText.textContent = "Згорнути";
      loadMoreBtn.classList.add("is-full");
    } else {
      btnText.textContent = "Завантажити ще";
      loadMoreBtn.classList.remove("is-full");
    }
  };

  loadMoreBtn.addEventListener("click", () => {
    const step = getStep();

    if (currentShown >= cards.length) {
      // 1. Повертаємо початкову кількість
      currentShown = step;

      // 2. Використовуємо Lenis для скролу вгору
      // window.lenis — це стандартне ім'я змінної, де лежить екземпляр Lenis
      if (window.lenis) {
        window.lenis.scrollTo(newsSection, {
          offset: -50, // Невеликий відступ зверху
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Стандартний Lenis easing
        });
      } else {
        // Fallback якщо Lenis не ініціалізовано
        newsSection.scrollIntoView({ behavior: "smooth" });
      }

      // 3. Оновлюємо видимість ПІСЛЯ початку скролу або з невеликою затримкою
      setTimeout(() => {
        updateVisibility();
      }, 100);
    } else {
      currentShown += step;
      updateVisibility();
    }
  });

  checkBtnPersistence();
  updateVisibility(true);
};

newsFunctional();
