const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const backToTop = document.querySelector("[data-back-to-top]");
const toast = document.querySelector("[data-toast]");
const modal = document.querySelector("[data-modal]");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll("[data-nav-links] a").forEach((link) => {
  const current = window.location.pathname.split("/").pop() || "index.html";
  const href = link.getAttribute("href") || "";
  const target = href.split("/").pop() || "index.html";
  if (target === current || (current === "index.html" && href === "./")) {
    link.classList.add("is-active");
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll("[data-animate]").forEach((element) => observer.observe(element));

const animateCounter = (element) => {
  const target = Number(element.dataset.count || "0");
  const suffix = element.dataset.suffix || "";
  const duration = 1300;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.floor(target * (1 - Math.pow(1 - progress, 3)));
    element.textContent = `${value.toLocaleString("es-BO")}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll("[data-count]").forEach((counter) => counterObserver.observe(counter));

document.querySelectorAll("[data-faq-question]").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const open = item.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(open));
  });
});

const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
};

document.querySelectorAll("[data-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let isValid = true;

    form.querySelectorAll("[required]").forEach((field) => {
      const wrapper = field.closest(".field");
      const valid = field.type === "email"
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())
        : field.value.trim().length > 0;

      wrapper?.classList.toggle("has-error", !valid);
      if (!valid) isValid = false;
    });

    if (!isValid) {
      showToast("Revisa los campos marcados antes de continuar.");
      return;
    }

    form.reset();
    document.querySelectorAll(".time-option").forEach((option) => option.classList.remove("is-selected"));
    showToast("Solicitud recibida. El equipo de ITAQIN te contactará pronto.");
  });
});

document.querySelectorAll("[data-open-modal]").forEach((button) => {
  button.addEventListener("click", () => modal?.classList.add("is-open"));
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", () => modal?.classList.remove("is-open"));
});

modal?.addEventListener("click", (event) => {
  if (event.target === modal) modal.classList.remove("is-open");
});

document.querySelectorAll(".time-option").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".time-option").forEach((option) => option.classList.remove("is-selected"));
    button.classList.add("is-selected");
    const input = document.querySelector("#hora");
    if (input) input.value = button.textContent.trim();
  });
});

window.addEventListener("scroll", () => {
  backToTop?.classList.toggle("is-visible", window.scrollY > 700);
});

backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
