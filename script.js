
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* ---------- Mobile menu ---------- */
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent =
  new Date().getFullYear();

/* ---------- Cat eyes follow cursor ---------- */
const cat = document.getElementById("cat");
const pupils = cat.querySelectorAll(".pupil");
const maxMove = 8;

function lookAt(x, y) {
  const box = cat.getBoundingClientRect();

  const dx = x - (box.left + box.width / 2);
  const dy = y - (box.top + box.height * 0.42);

  const dist = Math.hypot(dx, dy) || 1;
  const k = Math.min(1, dist / 250) * maxMove;

  const moveX = (dx / dist) * k;
  const moveY = (dy / dist) * k;

  pupils.forEach((p) => {
    p.style.transform =
      `translate(${moveX}px, ${moveY}px)`;
  });
}

/* ---------- Paw print cursor trail ---------- */
const canHover = window.matchMedia(
  "(hover: hover) and (pointer: fine)"
).matches;

let lastPaw = 0;
let flip = false;

function dropPaw(x, y) {
  const now = performance.now();

  if (now - lastPaw < 140) return;

  lastPaw = now;
  flip = !flip;

  const paw = document.createElement("span");

  paw.className = "trail-paw";
  paw.textContent = "🐾";
  paw.style.left = x + (flip ? 8 : -8) + "px";
  paw.style.top = y + 10 + "px";

  document.body.appendChild(paw);

  paw.addEventListener("animationend", () => paw.remove());
}

window.addEventListener("pointermove", (e) => {
  lookAt(e.clientX, e.clientY);

  if (canHover && !reduceMotion) {
    dropPaw(e.clientX, e.clientY);
  }
});

/* ---------- Scroll progress bar ---------- */
const progress = document.getElementById("progress");

function updateProgress() {
  const max =
    document.documentElement.scrollHeight - window.innerHeight;

  const ratio = max > 0 ? window.scrollY / max : 0;

  progress.style.transform = `scaleX(${ratio})`;
}

window.addEventListener("scroll", updateProgress, {
  passive: true
});

updateProgress();

/* ---------- Typing animation ---------- */
const typed = document.getElementById("typed");

const roles = [
  "Python developer",
  "machine learning learner",
  "problem solver",
  "curious cat 🐱"
];

if (reduceMotion) {
  typed.textContent = roles[0];
} else {
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    const word = roles[roleIndex];

    charIndex += deleting ? -1 : 1;

    typed.textContent = word.slice(0, charIndex);

    let delay = deleting ? 45 : 85;

    if (!deleting && charIndex === word.length) {
      deleting = true;
      delay = 1400;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 350;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ---------- Scroll reveal ---------- */
const revealGroups = [
  ".hero-copy > *",
  ".section h2, .section-sub, .section-heading",
  ".about-copy p",
  ".skill-card",
  ".intern-card",
  ".cert-card",
  ".project-card",
  ".contact-panel"
];

const revealTargets = [];

revealGroups.forEach((selector) => {
  document.querySelectorAll(selector).forEach((el) => {
    if (!el.classList.contains("reveal")) {
      el.classList.add("reveal");
      revealTargets.push(el);
    }
  });
});

/* Stagger animations */
document.querySelectorAll(
  ".skill-grid, .project-grid, .cert-grid, .intern-list, .hero-copy"
).forEach((group) => {
  [...group.children].forEach((child, i) => {
    child.style.setProperty("--d", `${i * 0.08}s`);
  });
});

/* Intersection observer */
if ("IntersectionObserver" in window && !reduceMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealTargets.forEach((el) => observer.observe(el));

} else {
  revealTargets.forEach((el) => el.classList.add("in"));
}

/* ---------- Gentle 3D pointer tilt ---------- */
const tiltTargets = document.querySelectorAll(
  ".hero-art,.skill-card,.project-card,.cert-card"
);

if (canHover && !reduceMotion) {
  tiltTargets.forEach((el) => {

    el.addEventListener("pointermove", (event) => {
      const r = el.getBoundingClientRect();

      const x = (event.clientX - r.left) / r.width - 0.5;
      const y = (event.clientY - r.top) / r.height - 0.5;

      const strength = el.classList.contains("hero-art") ? 7 : 4;

      el.style.transform =
        `perspective(900px)
         rotateX(${-y * strength}deg)
         rotateY(${x * strength}deg)
         translateY(-3px)`;
    });

    el.addEventListener("pointerleave", () => {
      el.style.transform = "";
    });

  });
}

/* ---------- Heading interaction ---------- */
document.querySelectorAll(".section h2").forEach((heading) => {

  heading.addEventListener("pointerenter", () => {
    heading.classList.add("heading-purr");
  });

  heading.addEventListener("pointerleave", () => {
    heading.classList.remove("heading-purr");
  });

});
