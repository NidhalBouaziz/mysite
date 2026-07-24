# Nidhal Bouaziz — Portfolio

A fast, dependency-free personal portfolio (static HTML/CSS/JS) for Nidhal Bouaziz —
IT support technician, web & mobile developer, and Cisco-certified Ethical Hacker.

**Live:** https://nidhalbouaziz.github.io/mysite/

## Design

- **Dark-first, aurora-lit theme** with an interactive constellation background (canvas),
  glassmorphism surfaces and glow accents.
- **Light / dark toggle** — the choice is saved in `localStorage` and applied before paint
  (no flash of the wrong theme).
- **Motion with respect** — scroll-reveal, animated counters, language bars, a typing hero
  and a project-card pointer glow, all disabled under `prefers-reduced-motion`.
- **Fully responsive** with an accessible mobile menu, skip link, focus states and ARIA labels.
- **PWA** — installable, offline-capable via a service worker (`sw.js`) + `manifest.json`.

## Pages

| File | Content |
| --- | --- |
| `index.html` | Hero, animated stats, featured projects, certifications preview, education, events |
| `a-propos.html` | Bio, language proficiency, associative life (Enactus, Touche d'Art), interests |
| `experience.html` | Vertical timeline of 4 professional experiences (expandable) |
| `projets.html` | Filterable gallery of 15+ real projects + Wondertech Scan case study |
| `competences.html` | Skills grid + certifications showcase (Cisco Ethical Hacker, etc.) |

## Structure

```
style.css   → design system (tokens, components, responsive, reduced-motion)
site.js     → theme, background/constellation, reveals, counters, roles, carousel, filters
sw.js       → offline cache (bump CACHE_VERSION when core assets change)
manifest.json, sitemap.xml, robots.txt
icons/      → tech-stack SVG logos
Nidhal_Bouaziz_CV.pdf → downloadable CV
```

The animated background, theme toggle, back-to-top button and scroll-progress bar are
injected by `site.js`, so every page stays lean and consistent.

## Local preview

Any static server works, e.g.:

```bash
npx serve .
# or
python -m http.server 8000
```

Then open http://localhost:8000. (Opening `index.html` directly works too, but the service
worker only registers over http/https.)

## Maintenance notes

- Update the CV by replacing `Nidhal_Bouaziz_CV.pdf`.
- When you change `style.css`, `site.js` or a core page, bump `CACHE_VERSION` in `sw.js`
  so returning visitors get the new version.
- Contact email and links live in the footer of each page and in the hero of `index.html`.
