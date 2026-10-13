# Astraelyx Technologies — Website

A static, responsive marketing website for **Astraelyx Technologies**, built with **HTML5, CSS3 and vanilla JavaScript** only. It has no build step and no framework.

## Run locally

You can open `index.html` directly in a browser. Using a local server is better, because relative links and query strings behave like they will in production:

```bash
python -m http.server 5173
```

Then visit <http://localhost:5173>.

## Project structure

```
├── index.html               Homepage (all main sections)
├── css/styles.css           Design tokens + all component styles (mobile-first)
├── js/script.js             Navigation, reveal animations, form, configuration
├── assets/
│   ├── logo.jpeg            Copy of the supplied logo (original Logo.jpeg is untouched)
│   └── images/              favicon.ico, favicon-32.png, apple-touch-icon.png, og-image.jpg
├── pages/
│   ├── services.html        Detail for all six services (#ai-agentic, #cloud, …)
│   ├── industries.html      Six industries (#banking, #healthcare, …)
│   ├── about.html
│   ├── insights.html        Planned articles (marked "Coming soon")
│   ├── contact.html         Contact form; supports ?service=<id> preselection
│   ├── privacy-policy.html  PLACEHOLDER: needs legal review
│   └── terms.html           PLACEHOLDER: needs legal review
└── README.md
```

## Configuration (required before launch)

All company-specific settings are in the `SITE_CONFIG` object at the top of `js/script.js`. Empty values are **not displayed**, so the site never shows invented contact details.

| Setting | Effect |
|---|---|
| `contact.email`, `contact.phone`, `contact.address` | Shown in the contact section and footer once set |
| `social.linkedin`, `x`, `github`, `youtube` | Footer social icons; only absolute `https://` URLs are rendered |
| `form.endpoint` | Enables live form submission (see below) |

### Contact form

- **Demo mode (default):** while `form.endpoint` is empty, the form validates in the browser and then shows a message saying **no message was sent**. Nothing leaves the browser.
- **Live mode:** set `form.endpoint` to a URL that accepts a JSON `POST`, such as Formspree, a serverless function or your own API. The payload is:
  ```json
  { "name": "", "email": "", "company": "", "service": "", "message": "", "submittedAt": "ISO-8601" }
  ```
  A 2xx response shows a success message. Any other response shows an error.
- The form includes a hidden honeypot field (`website`) for basic spam filtering. Add server-side validation and rate limiting in your endpoint too.
- After going live, update the footnote under the submit button in `index.html` and `pages/contact.html`. It currently says the form is in demo mode.

### SEO placeholders

- **Canonical URL** and `og:url` are commented out in every page's `<head>`. Uncomment them and replace `YOUR-DOMAIN` once the domain is confirmed.
- `og:image` points to `assets/images/og-image.jpg`, a simple placeholder made from the logo. Social platforms require an **absolute** image URL, so update it after deployment.
- Add an Organization JSON-LD block only once verified company details and the domain are available.

### Other content to complete

- `pages/about.html` has an HTML comment marking where to add verified company facts, such as founding year, leadership and locations.
- `pages/privacy-policy.html` and `pages/terms.html` are templates with `[bracketed]` placeholders. Have them reviewed before launch.
- The Insights cards are labelled **Sample article / Coming soon** and do not link to article pages. Link them once real articles exist.

## Content principles

The site deliberately avoids fabricated credibility:

- No client logos, testimonials, awards, statistics or certifications.
- The three solution showcase items are labelled **Solution Concept** and include a note that they are not completed client projects.
- Technology names are listed with a disclaimer that no partnership or certification is implied.

## Design system

- **Colours:** CSS custom properties in `:root` (`--c-primary #0756B8`, `--c-navy #082B55`, `--c-turquoise #20CDB5`, `--c-cyan #36E2CB`, etc.), plus `--grad-brand` for highlights.
- **Type:** Manrope for headings and Inter for body text, both from Google Fonts.
- **Icons:** [Lucide](https://lucide.dev) v0.460.0 from unpkg, pinned with a Subresource Integrity hash. If you change the version, update the `integrity` attribute on every page or remove it.
- **Breakpoints (mobile-first):** 481px (tablet), 769px (laptop), 1024px (desktop navigation), 1201px (desktop).
- **Reusable classes:** `.container`, `.section`, `.section-head`, `.eyebrow`, `.btn--primary/secondary`, `.card`, `.icon-tile`, `.tag`, `.chip`, `.reveal` (scroll animation, with an optional `--d` delay).

## Accessibility & behaviour

- Semantic landmarks, a skip link, logical heading order and visible `:focus-visible` outlines.
- Mobile menu: `aria-expanded`, closes on Escape or link click, and locks body scroll while open.
- Services dropdown: works with click, hover and keyboard (ArrowDown/ArrowUp, Escape).
- Form: labelled fields, inline errors linked via `aria-describedby`, `aria-invalid`, and a live status region.
- `prefers-reduced-motion` disables the marquee, reveal and hero animations.
- Without JavaScript, all content stays visible. Reveal animations only apply when JS runs.

## Editing shared header/footer

Each HTML page contains its own copy of the header and footer, so the site works without JavaScript or a build step. When you change navigation or footer links, update them in all eight HTML files.
