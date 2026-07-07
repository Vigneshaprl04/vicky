(() => {
  "use strict";

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function $all(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function isEmailValid(email) {
    // Simple, practical email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
  }

  function ensureStatusEl(form) {
    const existing = $(".form-status", form);
    if (existing) return existing;

    const el = document.createElement("div");
    el.className = "form-status";
    el.setAttribute("role", "status");
    el.style.marginTop = "12px";
    el.style.fontWeight = "600";
    el.style.fontSize = "0.95rem";
    el.style.display = "none";

    form.appendChild(el);
    return el;
  }

  function setStatus(form, message, type) {
    const statusEl = ensureStatusEl(form);
    statusEl.textContent = message;
    statusEl.style.display = "block";
    statusEl.style.color = type === "error" ? "#fecaca" : "#bbf7d0";
  }

  function clearStatus(form) {
    const statusEl = $(".form-status", form);
    if (!statusEl) return;
    statusEl.textContent = "";
    statusEl.style.display = "none";
  }

  function setupMobileNav() {
    const hamburger = $(".hamburger");
    const navLinks = $(".nav-links");
    if (!hamburger || !navLinks) return;

    // We'll toggle an active class. If no CSS exists for it,
    // we fall back to inline style for robustness.
    function toggleNav() {
      const isActive = navLinks.classList.toggle("active");

      // Fallback: on small screens, style.css hides it by default.
      // This ensures it works even without additional CSS edits.
      if (window.matchMedia("(max-width: 768px)").matches) {
        navLinks.style.display = isActive ? "flex" : "none";
        navLinks.style.flexDirection = "column";
        navLinks.style.gap = "1rem";
        navLinks.style.position = "absolute";
        navLinks.style.top = "64px";
        navLinks.style.right = "20px";
        navLinks.style.padding = "1rem 1.25rem";
        navLinks.style.borderRadius = "12px";
        navLinks.style.background = "rgba(15, 23, 42, 0.98)";
        navLinks.style.boxShadow = "0 10px 30px rgba(0,0,0,0.35)";
      }
    }

    hamburger.addEventListener("click", toggleNav);

    // Close when clicking outside (small screens)
    document.addEventListener("click", (e) => {
      if (!window.matchMedia("(max-width: 768px)").matches) return;
      const target = e.target;
      if (!(target instanceof Element)) return;

      const clickedHamburger = target.closest(".hamburger");
      const clickedNav = target.closest(".nav-links");
      if (!clickedHamburger && !clickedNav) {
        navLinks.classList.remove("active");
        navLinks.style.display = "none";
      }
    });

    // Ensure initial state on load
    if (window.matchMedia("(max-width: 768px)").matches) {
      navLinks.style.display = "none";
    }

    // Keep state consistent when resizing
    window.addEventListener("resize", () => {
      if (!window.matchMedia("(max-width: 768px)").matches) {
        navLinks.classList.remove("active");
        navLinks.style.display = "";
        navLinks.style.position = "";
        navLinks.style.top = "";
        navLinks.style.right = "";
        navLinks.style.padding = "";
        navLinks.style.borderRadius = "";
        navLinks.style.background = "";
        navLinks.style.boxShadow = "";
        navLinks.style.flexDirection = "";
        navLinks.style.gap = "";
      }
    });

    // Close on nav link click
    $all(".nav-links a").forEach((a) => {
      a.addEventListener("click", () => {
        if (!window.matchMedia("(max-width: 768px)").matches) return;
        navLinks.classList.remove("active");
        navLinks.style.display = "none";
      });
    });
  }

  function setupContactForm() {
    const form = $("#contactForm");
    if (!form) return;

    const nameEl = $("#name", form);
    const emailEl = $("#email", form);
    const messageEl = $("#message", form);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearStatus(form);

      const name = nameEl ? nameEl.value.trim() : "";
      const email = emailEl ? emailEl.value.trim() : "";
      const message = messageEl ? messageEl.value.trim() : "";

      // Basic validations
      if (!name) {
        setStatus(form, "Please enter your name.", "error");
        if (nameEl) nameEl.focus();
        return;
      }

      if (!email || !isEmailValid(email)) {
        setStatus(form, "Please enter a valid email address.", "error");
        if (emailEl) emailEl.focus();
        return;
      }

      if (!message || message.length < 10) {
        setStatus(form, "Message must be at least 10 characters.", "error");
        if (messageEl) messageEl.focus();
        return;
      }

      // Demo submit behavior (no backend in this repo)
      setStatus(form, "Sending message...", "success");

      try {
        // Simulate network delay
        await new Promise((r) => setTimeout(r, 800));

        setStatus(form, "Message sent successfully! ", "success");
        form.reset();
      } catch (err) {
        setStatus(form, "Something went wrong. Please try again.", "error");
      }
    });
  }

  function setupSmoothAnchors() {
    // Optional: ensure smooth scroll works even in environments where CSS isn't applied.
    // Also closes mobile nav handled elsewhere.
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      const link = target.closest("a[href^='#']");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const id = href.slice(1);
      const section = document.getElementById(id);
      if (!section) return;

      e.preventDefault();
      section.scrollIntoView({ behavior: "smooth", block: "start" });

      // Update URL hash without jumping
      history.pushState(null, "", href);
    });
  }

  // Init
  document.addEventListener("DOMContentLoaded", () => {
    setupMobileNav();
    setupContactForm();
    setupSmoothAnchors();
  });
})();

