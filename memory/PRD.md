# ODS Group — Cinema Layer Upgrade

## Original problem statement
> "je veux que tu rejoute un coté ultra moderne a ce site (framer-motion, effet a coupé le souffle, animations) c'est un site dans l'evenementiel ... qu'il fasse star et célébrité, n'hésite pas a faire vivre ou animer le logo ou mieux gérer le preloader. carte blanche, impressionne moi."
> Source: https://github.com/Manomikus/ODS-Group · live: https://ods-group.netlify.app/

## Application
Static HTML/CSS/JS marketing site for **ODS Group** — chorégraphie, danse & spectacles haut de gamme (Côte d'Ivoire / Paris). Lead artist: **O'new Raymond**, distingué Meilleur Chorégraphe PRIMUD 2025.

## Tech stack
- HTML5 + CSS (Playfair Display, Inter, Bebas Neue)
- Vanilla JS (no framework — explicit user constraint via existing repo)
- **NEW**: GSAP 3.12 + ScrollTrigger + Lenis (loaded via CDN, defer)
- Served via `python3 -m http.server 3000` (port 3000 maps to Emergent ingress)

## What was implemented (Jan 2026)
- **Cinematic preloader** (`/js/cinema.js` + `/css/cinema.css`): gold ODS logo with rotating SVG ray-halo, % counter (0→100), status messages cycling, "ODS GROUP" split-text title reveal letter-by-letter, scrolling brand marquee, two-panel curtain reveal that slides off to expose the page.
- **Animated logo & halo** in hero: 64-line conic-rays SVG halo continuously rotating, two dashed orbital rings counter-rotating, breathing glow drop-shadow, 3D parallax tilt that follows cursor (rotateX/Y/translate).
- **Hero kinetic title** "L'ÉLÉGANCE / en mouvement" with split-text yPercent + rotateX stagger reveal, gold gradient text-clip on italic line.
- **Hero overtitle** ("ODS GROUP · ABIDJAN — PARIS") with gold connecting lines.
- **Hero marquee strip**: infinite scrolling "★ CHORÉGRAPHIE ★ DANSE ★ SPECTACLES ★ CINÉMA ★ ..." in gold serif.
- **Hero spotlights**: 3 floating radial-gradient blobs (gold/green/cream) with screen blend-mode, drifting, react to cursor.
- **Custom cursor**: gold dot + outline ring with elastic follow, expands on interactive elements, hidden on touch.
- **Scroll progress bar** (gold gradient, top of viewport).
- **Film grain** SVG-noise overlay + radial vignette across the page (theme-aware).
- **Lenis smooth scroll** integrated with ScrollTrigger; in-page anchors hijacked.
- **Section reveals**: section titles split-text into letters with gold gradient on `.gold` segments; section tags slide-in; big translucent section numbers ("01"–"06") parallax behind each section.
- **Image kenburns** on portfolio / about / team / media images on scroll-enter.
- **Magnetic buttons & social links** with elastic spring back.
- **Nav-logo** with conic-gradient halo on hover + subtle floating bob.
- **Hover spotlight** on cards (mouse-tracked radial gradient via CSS variables).
- **Theme toggle** preserved (dark/light/Clair). All cinema effects adapt to both themes.
- **Reduced motion** respected (animations disabled).

## Files touched
- `/app/index.html` — added GSAP/ScrollTrigger/Lenis CDN + Bebas Neue + cinema.css/cinema.js scripts.
- `/app/css/cinema.css` *(new, ~530 lines)* — cinema layer styles.
- `/app/js/cinema.js` *(new, ~470 lines)* — preloader, cursor, hero, reveals.
- `/app/js/main.js` — disabled old preloader timeout, old parallax & magnetic to avoid conflicts; kept tilt, theme, modal, slider, form, AOS observer.

## Next Action Items / Backlog (P1 / P2)
- P1: Migrate the static server from ad-hoc `python -m http.server` to a supervisor program for true production-ready hosting.
- P2: Replace placeholder Pexels videos in Médias with locally hosted ODS clips.
- P2: Add an audio teaser button (mute/unmute heartbeat / signature track) tied to the brand.
- P2: Page-transition curtain when navigating between anchors.
- P2: Real backend for the contact form (currently fakes a success message).
