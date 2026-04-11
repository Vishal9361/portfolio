const roles = [
  "Frontend Developer",
  "Full-stack Developer",
  "MERN Stack Developer"
];

const typedText = document.getElementById("typed-text");
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentRole = roles[roleIndex];
  const visibleText = isDeleting
    ? currentRole.substring(0, charIndex--)
    : currentRole.substring(0, charIndex++);

  typedText.textContent = visibleText;

  let speed = isDeleting ? 45 : 90;

  if (!isDeleting && charIndex === currentRole.length + 1) {
    speed = 1300;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    speed = 300;
  }

  setTimeout(typeEffect, speed);
}

function revealOnScroll() {
  const revealEls = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index % 8, 7) * 70}ms`;
    observer.observe(el);
  });
}

function activateNavOnScroll() {
  const sections = document.querySelectorAll("section, header");
  const navLinks = document.querySelectorAll(".nav-link");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        navLinks.forEach((link) => link.classList.remove("active"));
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) {
          activeLink.classList.add("active");
        }
      });
    },
    { threshold: 0.6 }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

function smoothScrollNavigation() {
  const navAndActionLinks = document.querySelectorAll('a[href^="#"]');
  const navbarCollapse = document.getElementById("mainNav");
  const collapseInstance = navbarCollapse
    ? bootstrap.Collapse.getOrCreateInstance(navbarCollapse, { toggle: false })
    : null;

  navAndActionLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") {
        return;
      }

      const targetEl = document.querySelector(targetId);
      if (!targetEl) {
        return;
      }

      event.preventDefault();
      targetEl.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      if (navbarCollapse && navbarCollapse.classList.contains("show")) {
        collapseInstance.hide();
      }
    });
  });
}

function sectionTransitionOnScroll() {
  const sections = document.querySelectorAll("section, header");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-in-view");
          entry.target.classList.remove("section-out-view");
        } else {
          entry.target.classList.add("section-out-view");
          entry.target.classList.remove("section-in-view");
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach((section) => {
    section.classList.add("section-out-view");
    observer.observe(section);
  });
}

function navbarScrollEffect() {
  const navbar = document.querySelector(".glass-nav");
  if (!navbar) {
    return;
  }

  const updateNavbar = () => {
    if (window.scrollY > 24) {
      navbar.classList.add("nav-scrolled");
    } else {
      navbar.classList.remove("nav-scrolled");
    }
  };

  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });
}

function parallaxOrbs() {
  const orbs = document.querySelectorAll(".bg-orb");
  if (!orbs.length) {
    return;
  }

  let rafId = null;
  let nextX = 0;
  let nextY = 0;

  const applyParallax = () => {
    orbs.forEach((orb, idx) => {
      const depth = (idx + 1) * 0.45;
      orb.style.transform = `translate3d(${nextX * depth}px, ${nextY * depth}px, 0)`;
    });
    rafId = null;
  };

  window.addEventListener(
    "mousemove",
    (event) => {
      nextX = (event.clientX / window.innerWidth - 0.5) * 16;
      nextY = (event.clientY / window.innerHeight - 0.5) * 16;

      if (!rafId) {
        rafId = window.requestAnimationFrame(applyParallax);
      }
    },
    { passive: true }
  );
}

function initContactForm() {
  const form = document.querySelector(".contact-form");
  const successEl = document.getElementById("contact-success");
  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const to = form.getAttribute("data-mail-to");
    if (!to) {
      return;
    }

    const name = document.getElementById("name")?.value.trim() ?? "";
    const email = document.getElementById("email")?.value.trim() ?? "";
    const subject = document.getElementById("subject")?.value.trim() ?? "";
    const message = document.getElementById("message")?.value.trim() ?? "";

    const body = [`Name: ${name}`, `Reply-to: ${email}`, "", message].join("\n");
    const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;

    if (successEl) {
      successEl.classList.remove("d-none");
      successEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
typeEffect();
revealOnScroll();
activateNavOnScroll();
smoothScrollNavigation();
sectionTransitionOnScroll();
navbarScrollEffect();
parallaxOrbs();
initContactForm();
