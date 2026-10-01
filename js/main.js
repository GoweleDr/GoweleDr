/* =========================================================
   CODER DAV — PORTFOLIO SCRIPTS
   ========================================================= */

/* ---------- 1. Your personal details — edit these! ---------- */
const CONFIG = {
  email: "goweledr25@gmail.com",
  whatsapp: "255622857649", // country code + number, no "+" or spaces
  whatsappDisplay: "+255 622 857 649",
  socials: {
    github: "https://github.com/your-username",
    linkedin: "https://linkedin.com/in/your-username",
    behance: "https://behance.net/your-username",
    dribbble: "https://dribbble.com/your-username",
    instagram: "https://instagram.com/your-username",
  },
  roles: [
    "digital experiences",
    "React interfaces",
    "UI/UX that converts",
    "bold brand visuals",
    "responsive websites",
  ],
};

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 2. Fill in contact & social links ---------- */
(function applyConfig() {
  const emailLink = $("#emailLink");
  emailLink.href = `mailto:${CONFIG.email}`;
  emailLink.textContent = CONFIG.email;

  const waLink = $("#whatsappLink");
  waLink.href = `https://wa.me/${CONFIG.whatsapp}`;
  waLink.target = "_blank";
  waLink.rel = "noopener";
  waLink.textContent = CONFIG.whatsappDisplay;

  $$("[data-social]").forEach((a) => {
    const url = CONFIG.socials[a.dataset.social];
    if (url) {
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
    }
  });

  $("#year").textContent = new Date().getFullYear();
})();

/* ---------- 3. Theme toggle (remembers your choice) ---------- */
(function theme() {
  const root = document.documentElement;
  const btn = $("#themeToggle");
  const icon = btn.querySelector("i");

  let saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch (e) {}
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  setTheme(saved || (prefersLight ? "light" : "dark"));

  btn.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  });

  function setTheme(mode) {
    root.dataset.theme = mode;
    icon.className = mode === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
})();

/* ---------- 4. Navbar: scroll state, mobile menu, active link ---------- */
(function nav() {
  const nav = $("#nav");
  const burger = $("#burger");
  const links = $("#navLinks");
  const progress = $(".scroll-progress");

  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 30);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const toggleMenu = (open) => {
    burger.classList.toggle("is-open", open);
    links.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  };

  burger.addEventListener("click", () => toggleMenu(!links.classList.contains("is-open")));
  $$("a", links).forEach((a) => a.addEventListener("click", () => toggleMenu(false)));
  window.addEventListener("keydown", (e) => e.key === "Escape" && toggleMenu(false));

  // Highlight the nav link of the section in view
  const navLinks = $$(".nav__link");
  const sections = navLinks.map((l) => $(l.getAttribute("href"))).filter(Boolean);
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((l) =>
          l.classList.toggle("is-active", l.getAttribute("href") === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));
})();

/* ---------- 5. Typing effect in the hero ---------- */
(function typing() {
  const el = $("#typed");
  if (!el || reduceMotion) return;

  const words = CONFIG.roles;
  let wordIndex = 0;
  let charIndex = words[0].length;
  let deleting = true;

  setTimeout(tick, 2200);

  function tick() {
    const word = words[wordIndex];
    charIndex += deleting ? -1 : 1;
    el.textContent = word.slice(0, charIndex);

    let delay = deleting ? 45 : 85;

    if (!deleting && charIndex === word.length) {
      deleting = true;
      delay = 2000;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 350;
    }
    setTimeout(tick, delay);
  }
})();

/* ---------- 6. Reveal on scroll (with stagger) ---------- */
(function reveal() {
  const items = $$(".reveal");

  // Stagger siblings that share a parent
  const groups = new Map();
  items.forEach((el) => {
    const list = groups.get(el.parentElement) || [];
    list.push(el);
    groups.set(el.parentElement, list);
  });
  groups.forEach((list) =>
    list.forEach((el, i) => el.style.setProperty("--delay", `${Math.min(i * 0.08, 0.4)}s`))
  );

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add("is-visible");
          io.unobserve(el);
          // Once revealed, hand control back to the element's own hover transitions
          el.addEventListener(
            "transitionend",
            () => {
              el.classList.remove("reveal", "is-visible");
              el.style.removeProperty("--delay");
            },
            { once: true }
          );
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  items.forEach((el) => io.observe(el));
})();

/* ---------- 7. Project filter ---------- */
(function filters() {
  const buttons = $$(".filter");
  const projects = $$(".project");

  buttons.forEach((btn) =>
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      buttons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", active);
      });

      projects.forEach((p) => {
        const match = filter === "all" || p.dataset.category.split(" ").includes(filter);
        p.classList.toggle("is-hidden", !match);
        if (match && !reduceMotion) {
          p.animate(
            [
              { opacity: 0, transform: "translateY(24px) scale(0.98)" },
              { opacity: 1, transform: "none" },
            ],
            { duration: 500, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
          );
        }
      });
    })
  );
})();

/* ---------- 8. Custom cursor, magnetic buttons, card glow ---------- */
(function interactions() {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!finePointer || reduceMotion) return;

  document.body.classList.add("has-cursor");
  const cursor = $(".cursor");
  const dot = $(".cursor-dot");
  let x = 0, y = 0, cx = 0, cy = 0;

  window.addEventListener("mousemove", (e) => {
    x = e.clientX;
    y = e.clientY;
    dot.style.transform = `translate(${x}px, ${y}px)`;
  });

  (function loop() {
    cx += (x - cx) * 0.18;
    cy += (y - cy) * 0.18;
    cursor.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(loop);
  })();

  $$("a, button, .project, input, select, textarea").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
  });

  // Magnetic buttons
  $$(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const mx = e.clientX - r.left - r.width / 2;
      const my = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${mx * 0.25}px, ${my * 0.35}px)`;
    });
    btn.addEventListener("mouseleave", () => (btn.style.transform = ""));
  });

  // Glow + tilt that follows the mouse on service cards
  $$(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", `${px * 100}%`);
      card.style.setProperty("--my", `${py * 100}%`);
      card.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 6}deg) rotateY(${(px - 0.5) * 6}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => (card.style.transform = ""));
  });
})();

/* ---------- 9. Contact form (opens the visitor's email app) ---------- */
(function contactForm() {
  const form = $("#contactForm");
  const note = $("#formNote");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fields = $$("input, select, textarea", form);
    let valid = true;

    fields.forEach((f) => {
      const ok =
        f.value.trim() !== "" &&
        (f.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
      f.closest(".field").classList.toggle("is-invalid", !ok);
      if (!ok) valid = false;
    });

    if (!valid) {
      note.textContent = "Please fill in every field with valid details.";
      note.className = "form__note is-error";
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    const subject = encodeURIComponent(`New project enquiry — ${data.service}`);
    const body = encodeURIComponent(
      `Hi Dav,\n\n${data.message}\n\n— ${data.name}\n${data.email}`
    );

    window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;

    note.textContent = "Thanks! Your email app is opening so you can send the message.";
    note.className = "form__note is-success";
    form.reset();
  });

  $$("input, select, textarea", form).forEach((f) =>
    f.addEventListener("input", () => f.closest(".field").classList.remove("is-invalid"))
  );
})();
