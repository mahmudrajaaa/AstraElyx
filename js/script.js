/* ==========================================================================
   Astraelyx Technologies — Site Script (vanilla JS, no dependencies)
   ========================================================================== */

/* --------------------------------------------------------------------------
   SITE CONFIGURATION
   Fill in verified company details here. Anything left empty ("") or null is
   simply NOT displayed on the site — no placeholder contact data is shown.
   -------------------------------------------------------------------------- */
const SITE_CONFIG = {
  contact: {
    email: "",          // e.g. "hello@your-domain.com"
    phone: "",          // e.g. "+44 20 0000 0000"
    address: ""         // e.g. "City, Country"
  },
  social: {
    linkedin: "",       // full URL, e.g. "https://www.linkedin.com/company/your-company"
    x: "",
    github: "",
    youtube: ""
  },
  form: {
    /* Set to a real endpoint (Formspree, a serverless function, your API...)
       to enable live submissions. The form POSTs JSON:
       { name, email, company, service, message, submittedAt }
       While empty, the form runs in clearly-labelled DEMO mode and sends nothing. */
    endpoint: ""
  }
};

/* Mark that JS is running (enables reveal animations in CSS) */
document.documentElement.classList.add("js");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("DOMContentLoaded", () => {
  initIcons();
  initHeader();
  initMobileNav();
  initDropdowns();
  initActiveSection();
  initReveal();
  initBackToTop();
  initConfigContent();
  initContactForm();
  initYear();
});

/* ---------- Lucide icons (loaded via CDN; fails gracefully if offline) ---------- */
function initIcons() {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons({ attrs: { "aria-hidden": "true" } });
  }
}

/* ---------- Sticky header: add shadow once the page scrolls ---------- */
function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

/* ---------- Mobile navigation (hamburger) ---------- */
function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  const desktopMQ = window.matchMedia("(min-width: 1024px)");

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Close after choosing a link (important for same-page anchors)
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a") && !desktopMQ.matches) setOpen(false);
  });

  // Escape closes the menu and returns focus to the toggle
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Reset state when resizing up to desktop
  desktopMQ.addEventListener("change", (e) => { if (e.matches) setOpen(false); });
}

/* ---------- Services dropdown: click/tap, keyboard and hover friendly ---------- */
function initDropdowns() {
  document.querySelectorAll(".has-dropdown").forEach((item) => {
    const btn = item.querySelector(".nav-dropdown-toggle");
    const menu = item.querySelector(".dropdown");
    if (!btn || !menu) return;

    const setOpen = (open) => {
      btn.setAttribute("aria-expanded", String(open));
      menu.classList.toggle("is-open", open);
    };

    btn.addEventListener("click", () => setOpen(btn.getAttribute("aria-expanded") !== "true"));

    // Arrow-down from the toggle moves into the menu
    btn.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
        menu.querySelector("a")?.focus();
      }
    });

    // Arrow keys within the menu; Escape closes it
    menu.addEventListener("keydown", (e) => {
      const links = [...menu.querySelectorAll("a")];
      const i = links.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); links[(i + 1) % links.length].focus(); }
      if (e.key === "ArrowUp") { e.preventDefault(); links[(i - 1 + links.length) % links.length].focus(); }
      if (e.key === "Escape") { setOpen(false); btn.focus(); }
    });

    // Close when focus or a click leaves the dropdown
    item.addEventListener("focusout", (e) => {
      if (!item.contains(e.relatedTarget)) setOpen(false);
    });
    document.addEventListener("click", (e) => {
      if (!item.contains(e.target)) setOpen(false);
    });
  });
}

/* ---------- Highlight the nav link for the section currently in view ---------- */
function initActiveSection() {
  // Section links only ("#top" is the whole page, so it is excluded)
  const links = [...document.querySelectorAll('.nav-link[href^="#"]:not([href="#top"])')];
  if (!links.length || !("IntersectionObserver" in window)) return;

  const map = new Map();
  links.forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));
    if (section) map.set(section, link);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((l) => { l.classList.remove("is-active"); l.removeAttribute("aria-current"); });
      const link = map.get(entry.target);
      if (link) { link.classList.add("is-active"); link.setAttribute("aria-current", "true"); }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  map.forEach((_, section) => observer.observe(section));
}

/* ---------- Reveal-on-scroll with IntersectionObserver ---------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  items.forEach((el) => observer.observe(el));
}

/* ---------- Back-to-top button ---------- */
function initBackToTop() {
  const btn = document.querySelector(".back-to-top");
  if (!btn) return;
  const update = () => btn.classList.toggle("is-visible", window.scrollY > 900);
  update();
  window.addEventListener("scroll", update, { passive: true });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    document.getElementById("main")?.focus({ preventScroll: true });
  });
}

/* ---------- Render contact details & social links only when configured ---------- */
function initConfigContent() {
  const { contact, social } = SITE_CONFIG;

  // Elements: <li data-config="email" hidden><a data-config-link>…</a></li>
  document.querySelectorAll("[data-config]").forEach((el) => {
    const key = el.dataset.config;
    const value = contact[key];
    if (!value) return; // stays hidden
    const target = el.querySelector("[data-config-value]");
    if (target) {
      target.textContent = value;
      if (target.tagName === "A") {
        if (key === "email") target.href = `mailto:${value}`;
        if (key === "phone") target.href = `tel:${value.replace(/[^\d+]/g, "")}`;
      }
    }
    el.hidden = false;
  });

  // Show wrappers that contain at least one configured item
  document.querySelectorAll("[data-config-group]").forEach((group) => {
    group.hidden = !group.querySelector("[data-config]:not([hidden])");
  });

  // Social links
  const labels = { linkedin: "LinkedIn", x: "X (Twitter)", github: "GitHub", youtube: "YouTube" };
  const icons = { linkedin: "linkedin", x: "twitter", github: "github", youtube: "youtube" };
  document.querySelectorAll("[data-social-links]").forEach((list) => {
    // Only accept absolute http(s) URLs from the config
    const entries = Object.entries(social).filter(([, url]) => /^https?:\/\//i.test(url || ""));
    if (!entries.length) { list.hidden = true; return; }
    list.innerHTML = entries.map(([key, url]) =>
      `<li><a href="${encodeURI(url)}" target="_blank" rel="noopener noreferrer" aria-label="Astraelyx Technologies on ${labels[key]}"><i data-lucide="${icons[key]}"></i></a></li>`
    ).join("");
    list.hidden = false;
  });
  initIcons();
}

/* ---------- Contact form: validation + demo / live submission ---------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = form.querySelector(".form-status");
  const submitBtn = form.querySelector('button[type="submit"]');
  const submitLabel = submitBtn.innerHTML;

  // Pre-select a service from ?service=… (used by service page CTAs)
  const preset = new URLSearchParams(window.location.search).get("service");
  if (preset && form.service) {
    const opt = [...form.service.options].find((o) => o.value === preset);
    if (opt) form.service.value = preset;
  }

  const rules = {
    name: (v) => (v.trim().length >= 2 ? "" : "Please enter your full name."),
    email: (v) => {
      if (!v.trim()) return "Please enter your business email.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address, e.g. name@company.com.";
    },
    company: (v) => (v.trim().length >= 2 ? "" : "Please enter your company name."),
    service: (v) => (v ? "" : "Please choose a service of interest."),
    message: (v) => (v.trim().length >= 20 ? "" : "Please describe your requirements (at least 20 characters).")
  };

  const validateField = (field) => {
    const rule = rules[field.name];
    if (!rule) return true;
    const msg = rule(field.value);
    const wrapper = field.closest(".field");
    const errorEl = wrapper.querySelector(".field-error span");
    wrapper.classList.toggle("has-error", Boolean(msg));
    field.setAttribute("aria-invalid", msg ? "true" : "false");
    if (errorEl) errorEl.textContent = msg;
    return !msg;
  };

  // Validate on blur; re-validate live once a field has shown an error
  Object.keys(rules).forEach((name) => {
    const field = form.elements[name];
    if (!field) return;
    field.addEventListener("blur", () => { if (field.value) validateField(field); });
    field.addEventListener("input", () => {
      if (field.closest(".field").classList.contains("has-error")) validateField(field);
    });
  });

  const showStatus = (type, title, text) => {
    status.className = `form-status form-status--${type} is-visible`;
    status.innerHTML = `<i data-lucide="${type === "success" ? "circle-check" : "circle-alert"}"></i><p><strong>${title}</strong>${text}</p>`;
    initIcons();
    status.focus();
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.className = "form-status";

    // Honeypot: bots fill hidden fields; silently ignore
    if (form.elements.website && form.elements.website.value) return;

    const fields = Object.keys(rules).map((n) => form.elements[n]).filter(Boolean);
    const invalid = fields.filter((f) => !validateField(f));
    if (invalid.length) {
      invalid[0].focus();
      showStatus("error", "Please check the highlighted fields.", ` ${invalid.length} field${invalid.length > 1 ? "s need" : " needs"} attention.`);
      invalid[0].focus();
      return;
    }

    const payload = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      company: form.elements.company.value.trim(),
      service: form.elements.service.value,
      message: form.elements.message.value.trim(),
      submittedAt: new Date().toISOString()
    };

    submitBtn.disabled = true;
    submitBtn.innerHTML = "Submitting…";

    try {
      if (!SITE_CONFIG.form.endpoint) {
        // DEMO MODE — nothing is transmitted anywhere.
        await new Promise((r) => setTimeout(r, 700));
        showStatus(
          "success",
          "Demo submission complete — no message was sent.",
          " This form is running in demo mode because no email service or API endpoint has been configured yet. Your details were validated in the browser only."
        );
        form.reset();
        return;
      }

      // LIVE MODE — POST JSON to the configured endpoint
      const res = await fetch(SITE_CONFIG.form.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showStatus("success", "Thank you — your enquiry has been sent.", " We'll review your requirements and get back to you.");
      form.reset();
    } catch (err) {
      showStatus("error", "Sorry, your enquiry could not be sent.", " Please try again in a moment.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = submitLabel;
      initIcons();
    }
  });
}

/* ---------- Dynamic copyright year ---------- */
function initYear() {
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
}
