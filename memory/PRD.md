# ODS Group — Cinema Layer Upgrade

## Original problem statement
> "je veux que tu rejoute un coté ultra moderne a ce site (framer-motion, effet a coupé le souffle, animations) c'est un site dans l'evenementiel ... qu'il fasse star et célébrité, n'hésite pas a faire vivre ou animer le logo ou mieux gérer le preloader. carte blanche, impressionne moi."
> Source: https://github.com/Manomikus/ODS-Group · live: https://ods-group.netlify.app/

## Application
Static HTML/CSS/JS marketing site for **ODS Group** — chorégraphie, danse & spectacles haut de gamme (Côte d'Ivoire / Paris). Lead artist: **O'new Raymond**, distingué Meilleur Chorégraphe PRIMUD 2025.

## Tech stack
- HTML5 + CSS (Playfair Display, Inter, Bebas Neue)
- Vanilla JS (no framework — explicit user constraint via existing repo)
- GSAP 3.12 + ScrollTrigger + Lenis (CDN, defer)
- **Static serving via supervisor** → `/app/frontend` runs `serve` (npm) on port 3000
- Form backend: **FormSubmit.co AJAX** → `odsgroupe@gmail.com`

## Implemented (Jan 2026)

### Iteration 1 — Cinema Layer
- Cinematic preloader (curtains, % counter, status messages, ODS ray-halo, split-text title reveal, scrolling marquee).
- Animated living logo in hero (rotating ray-halo SVG, dashed orbital rings, breathing glow, 3D cursor parallax tilt).
- Hero kinetic title *"L'ÉLÉGANCE / en mouvement"* with letter-by-letter reveal & gold gradient italic.
- Hero overtitle "ODS GROUP · ABIDJAN — PARIS", infinite marquee strip, floating spotlights, particles.
- Custom magnetic cursor, scroll progress bar, film grain, vignette.
- Lenis smooth scroll.
- Section reveals (split-text titles, gold-gradient `.gold` segments, big translucent section numbers 01–06).
- Image kenburns on portfolio/about/team/media on scroll.
- Magnetic CTAs, animated nav-logo halo on hover, hover spotlight on cards.

### Iteration 2 — User refinements
- **Team section: stage-projector spotlight** (combo a + d) — replaces previous rotating gold ring.
  - Theatrical cone-shaped beam from above the card (clip-path triangle + radial gradient).
  - Hot-spot pool of light follows the cursor on the photo.
  - Hovered card brightens (`brightness 1.18 / drop-shadow gold`); siblings dim (`brightness 0.45 / blur 0.4px / opacity 0.78`) — true "premier rôle" effect.
  - Touch: tap toggles the spotlight on that card.
- **Contact form wired to FormSubmit.co (AJAX)**.
  - `action="https://formsubmit.co/ajax/odsgroupe@gmail.com"` with hidden fields `_subject`, `_template=table`, honeypot `_honey`.
  - JS does `fetch` POST with FormData, shows live status messages (`is-success` / `is-error`), success state on submit button.
  - **First-time setup** (one-time, manual by user): on the first real submission, FormSubmit will email `odsgroupe@gmail.com` with an activation link — O'new must click it once. After that, all future form submissions are delivered directly.
- **Supervisor static serving** — `/app/frontend/package.json` runs `serve -s /app -l tcp://0.0.0.0:3000` via supervisor `frontend` program. Auto-restart, survives container restarts, logs in `/var/log/supervisor/frontend.{out,err}.log`.
- **Pexels videos kept as-is** (per user feedback).

## Files
- New: `/app/css/cinema.css`, `/app/js/cinema.js`, `/app/frontend/package.json`, `/app/memory/PRD.md`.
- Edited: `/app/index.html` (CDN scripts, cinema CSS/JS, FormSubmit form), `/app/js/main.js` (FormSubmit AJAX handler, removed conflicting parallax/magnetic).

## Next Action Items / Backlog
- P1: User must click the FormSubmit activation email on first real submission to activate inbox delivery.
- P2: Replace Pexels stock videos with native ODS footage (when user uploads).
- P2: Page-transition curtain when navigating between anchors.
- P2: Audio teaser button (signature track) in hero.
- P2: Floating "Devis express" pill — 3-question mini form → WhatsApp recap to O'new.
