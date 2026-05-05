/* =====================================================================
 * ODS GROUP — CINEMA LAYER
 * Ultra-modern motion layer powered by GSAP + ScrollTrigger + Lenis.
 * Adds: cinematic preloader, custom cursor, scroll progress, animated
 * logo halo, split-text reveals, magnetic CTAs, kinetic marquee, etc.
 * ===================================================================*/
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  // GSAP / ScrollTrigger / Lenis load via <script defer>, so they may not be
  // ready when this IIFE first evaluates. We resolve them right before bootstrap.
  let hasGSAP = false;
  let hasST = false;
  function detectMotionLibs() {
    hasGSAP = typeof window.gsap !== 'undefined';
    hasST = hasGSAP && typeof window.ScrollTrigger !== 'undefined';
    if (hasST && !detectMotionLibs._registered) {
      gsap.registerPlugin(ScrollTrigger);
      detectMotionLibs._registered = true;
    }
  }

  /* ---------- Helper: split a string into <span> letters ---------- */
  function splitText(el, opts = {}) {
    if (!el) return [];
    const className = opts.className || 'split-letter';
    const text = el.getAttribute('data-text') || el.textContent;
    el.setAttribute('aria-label', text.trim());
    el.innerHTML = '';
    const frag = document.createDocumentFragment();
    const letters = [];
    Array.from(text).forEach((ch) => {
      const span = document.createElement('span');
      span.className = className;
      if (ch === ' ') {
        span.classList.add('split-space');
        span.innerHTML = '&nbsp;';
      } else {
        span.textContent = ch;
      }
      span.setAttribute('aria-hidden', 'true');
      frag.appendChild(span);
      letters.push(span);
    });
    el.appendChild(frag);
    return letters;
  }

  /* ============================================================
   * 1. CINEMATIC PRELOADER
   * ==========================================================*/
  function buildPreloader() {
    const old = document.getElementById('preloader');
    if (!old) return;

    old.classList.add('preloader-cinema');
    old.innerHTML = `
      <div class="preloader-grain" aria-hidden="true"></div>
      <div class="preloader-vignette" aria-hidden="true"></div>
      <div class="preloader-spotlight" aria-hidden="true"></div>

      <div class="preloader-marquee preloader-marquee-top" aria-hidden="true">
        <div class="preloader-marquee-track">
          <span>SHOW · CHORÉGRAPHIE · DANSE · SPECTACLES · CINÉMA · ÉVÉNEMENTIEL ·&nbsp;</span>
          <span>SHOW · CHORÉGRAPHIE · DANSE · SPECTACLES · CINÉMA · ÉVÉNEMENTIEL ·&nbsp;</span>
        </div>
      </div>

      <div class="preloader-stage">
        <div class="preloader-row preloader-row-top">
          <span class="preloader-meta preloader-meta-left">EST. 2014 — ABIDJAN · CI</span>
          <span class="preloader-meta preloader-meta-right">PRIMUD&nbsp;·&nbsp;Meilleur Chorégraphe 2025</span>
        </div>

        <div class="preloader-mid">
          <div class="preloader-counter">
            <span class="preloader-counter-num" id="preCounterNum">0</span><span class="preloader-counter-pct">%</span>
          </div>

          <div class="preloader-logo-wrap" aria-hidden="true">
            <svg class="preloader-logo-rays" viewBox="0 0 200 200">
              <g stroke="currentColor" stroke-linecap="round">
                ${Array.from({ length: 32 }).map((_, i) => {
                  const a = (i / 32) * Math.PI * 2;
                  const r1 = 70, r2 = i % 2 === 0 ? 92 : 84;
                  const x1 = 100 + Math.cos(a) * r1;
                  const y1 = 100 + Math.sin(a) * r1;
                  const x2 = 100 + Math.cos(a) * r2;
                  const y2 = 100 + Math.sin(a) * r2;
                  return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke-width="${i % 2 === 0 ? 1.4 : 0.9}" />`;
                }).join('')}
              </g>
            </svg>
            <img src="img/image.png" alt="" class="preloader-logo-img">
            <div class="preloader-logo-glow"></div>
          </div>

          <div class="preloader-status" id="preStatus">CALIBRATING&nbsp;LIGHTS</div>
        </div>

        <h1 class="preloader-title" id="preTitle" data-text="ODS GROUP"></h1>
        <p class="preloader-tagline" id="preTagline" data-text="L’art du mouvement"></p>

        <div class="preloader-bar"><div class="preloader-bar-fill" id="preBarFill"></div></div>
      </div>

      <div class="preloader-curtain preloader-curtain-top"></div>
      <div class="preloader-curtain preloader-curtain-bottom"></div>
    `;

    const titleLetters = splitText(document.getElementById('preTitle'), { className: 'pre-letter' });
    const tagWords = splitText(document.getElementById('preTagline'), { className: 'pre-tag-letter' });

    const counterEl = document.getElementById('preCounterNum');
    const barFill = document.getElementById('preBarFill');
    const statusEl = document.getElementById('preStatus');
    const statusMessages = ['CALIBRATING\u00a0LIGHTS', 'CUEING\u00a0DANCERS', 'PREPARING\u00a0STAGE', 'ROLLING\u00a0CAMERA'];

    if (!hasGSAP || reduceMotion) {
      // Fallback: just hide
      old.classList.add('loaded');
      return Promise.resolve();
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Initial state
    gsap.set(titleLetters, { yPercent: 110, opacity: 0, rotateX: -50 });
    gsap.set(tagWords, { opacity: 0, y: 20 });
    gsap.set('.preloader-logo-rays', { scale: 0.6, opacity: 0, rotate: -30 });
    gsap.set('.preloader-logo-img', { scale: 0.7, opacity: 0 });
    gsap.set('.preloader-logo-glow', { opacity: 0, scale: 0.6 });
    gsap.set('.preloader-meta-left, .preloader-meta-right', { opacity: 0, y: -10 });
    gsap.set('.preloader-counter, .preloader-status, .preloader-bar', { opacity: 0, y: 14 });
    gsap.set('.preloader-spotlight', { opacity: 0 });

    tl.to('.preloader-spotlight', { opacity: 1, duration: 0.8 }, 0)
      .to('.preloader-meta-left, .preloader-meta-right', { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, 0.1)
      .to('.preloader-counter, .preloader-bar, .preloader-status', { opacity: 1, y: 0, duration: 0.5, stagger: 0.06 }, 0.2)
      .to('.preloader-logo-rays', { scale: 1, opacity: 0.95, rotate: 0, duration: 1.2, ease: 'power2.out' }, 0.35)
      .to('.preloader-logo-img', { scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(1.4)' }, 0.55)
      .to('.preloader-logo-glow', { opacity: 1, scale: 1, duration: 0.9 }, 0.55)
      .to(titleLetters, { yPercent: 0, opacity: 1, rotateX: 0, duration: 0.9, stagger: 0.045, ease: 'expo.out' }, 0.7)
      .to(tagWords, { opacity: 1, y: 0, duration: 0.5, stagger: 0.02 }, 1.05);

    // Counter + bar progress
    const progress = { v: 0 };
    tl.to(progress, {
      v: 100,
      duration: 2.2,
      ease: 'power1.inOut',
      onUpdate: () => {
        const v = Math.round(progress.v);
        counterEl.textContent = v;
        barFill.style.transform = `scaleX(${v / 100})`;
        const mi = Math.min(statusMessages.length - 1, Math.floor(progress.v / 25));
        statusEl.innerHTML = statusMessages[mi];
      }
    }, 0.4);

    // Continuous slow rotation of rays during preloader
    gsap.to('.preloader-logo-rays', { rotate: 360, duration: 14, ease: 'none', repeat: -1 });

    // Curtain reveal
    return new Promise((resolve) => {
      tl.add(() => {}, 2.5)
        .to('.preloader-stage', { opacity: 0, scale: 1.04, duration: 0.5, ease: 'power2.in' }, '+=0.25')
        .to('.preloader-marquee', { opacity: 0, duration: 0.4 }, '<')
        .to('.preloader-curtain-top', { yPercent: -100, duration: 0.95, ease: 'power4.inOut' }, '<+=0.05')
        .to('.preloader-curtain-bottom', { yPercent: 100, duration: 0.95, ease: 'power4.inOut' }, '<')
        .to(old, { autoAlpha: 0, duration: 0.2, onComplete: () => { old.style.display = 'none'; resolve(); } }, '-=0.1');
    });
  }

  /* ============================================================
   * 2. CUSTOM CURSOR
   * ==========================================================*/
  function initCursor() {
    if (isTouch) return;
    const cursor = document.createElement('div');
    cursor.className = 'ods-cursor';
    cursor.innerHTML = `<div class="ods-cursor-dot"></div><div class="ods-cursor-ring"></div>`;
    document.body.appendChild(cursor);
    document.documentElement.classList.add('has-custom-cursor');

    const dot = cursor.querySelector('.ods-cursor-dot');
    const ring = cursor.querySelector('.ods-cursor-ring');
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let dx = mx, dy = my;

    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    document.addEventListener('mouseleave', () => cursor.classList.add('is-out'));
    document.addEventListener('mouseenter', () => cursor.classList.remove('is-out'));

    function tick() {
      dx += (mx - dx) * 0.45;
      dy += (my - dy) * 0.45;
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dot.style.transform = `translate3d(${dx}px,${dy}px,0) translate(-50%,-50%)`;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%) scale(${cursor.classList.contains('is-active') ? 1.7 : 1})`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    const interactive = 'a, button, .btn, .tab-btn, .filter-btn, .portfolio-item, .service-mini-card, .team-card, .media-item, [role="button"], input, textarea, select, label';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest && e.target.closest(interactive)) cursor.classList.add('is-active');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest && e.target.closest(interactive)) cursor.classList.remove('is-active');
    });
    document.addEventListener('mousedown', () => cursor.classList.add('is-down'));
    document.addEventListener('mouseup', () => cursor.classList.remove('is-down'));
  }

  /* ============================================================
   * 3. SCROLL PROGRESS BAR
   * ==========================================================*/
  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'ods-scroll-progress';
    bar.innerHTML = '<div class="ods-scroll-progress-fill"></div>';
    document.body.appendChild(bar);
    const fill = bar.firstElementChild;
    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      fill.style.transform = `scaleX(${ratio})`;
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ============================================================
   * 4. FILM GRAIN / VIGNETTE OVERLAY
   * ==========================================================*/
  function initGrain() {
    if (document.querySelector('.ods-grain')) return;
    const grain = document.createElement('div');
    grain.className = 'ods-grain';
    grain.setAttribute('aria-hidden', 'true');
    document.body.appendChild(grain);

    const vignette = document.createElement('div');
    vignette.className = 'ods-vignette';
    vignette.setAttribute('aria-hidden', 'true');
    document.body.appendChild(vignette);
  }

  /* ============================================================
   * 5. SMOOTH SCROLL (Lenis)
   * ==========================================================*/
  /* ============================================================
   * 5. SMOOTH SCROLL — disabled (native browser scroll is snappier
   *    and the anchor jumps need to feel instant on click).
   * ==========================================================*/
  let lenis = null;
  function initSmoothScroll() {
    // No Lenis. Use native browser scrolling everywhere.
    // Anchor clicks: scroll to target with a small offset for the navbar.
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const navbar = document.getElementById('navbar');
        const offset = (navbar?.offsetHeight || 0) + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        // Use 'auto' (instant) by default. Switch to 'smooth' if you want a
        // brief easing — feel free to tweak per-anchor.
        window.scrollTo({ top, behavior: 'auto' });
      });
    });
  }

  /* ============================================================
   * 6. HERO ENHANCEMENTS — animated logo halo, kinetic title,
   *    spotlight follow, marquee, parallax tilt
   * ==========================================================*/
  function buildHeroLogoIntro(hero) {
    if (!hero) return null;

    const existing = hero.querySelector('.hero-logo-intro');
    if (existing) return existing;

    const heroLogo = hero.querySelector('.hero-logo');
    if (!heroLogo) return null;

    const intro = document.createElement('div');
    intro.className = 'hero-logo-intro';
    intro.setAttribute('aria-hidden', 'true');

    const particles = Array.from({ length: 18 }).map((_, i) => {
      const angle = (i / 18) * Math.PI * 2;
      const radius = i % 3 === 0 ? 180 : (i % 2 === 0 ? 132 : 96);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * (radius * 0.42);
      const size = i % 4 === 0 ? 7 : (i % 3 === 0 ? 5 : 3);
      return `<span class="hero-logo-intro__particle" data-x="${x.toFixed(1)}" data-y="${y.toFixed(1)}" style="--p-size:${size}px"></span>`;
    }).join('');

    intro.innerHTML = `
      <div class="hero-logo-intro__stage">
        <div class="hero-logo-intro__beam hero-logo-intro__beam-left"></div>
        <div class="hero-logo-intro__beam hero-logo-intro__beam-right"></div>
        <div class="hero-logo-intro__depth"></div>
        <div class="hero-logo-intro__halo"></div>
        <div class="hero-logo-intro__ring hero-logo-intro__ring-a"></div>
        <div class="hero-logo-intro__ring hero-logo-intro__ring-b"></div>
        <div class="hero-logo-intro__particles">${particles}</div>
        <img src="${heroLogo.getAttribute('src')}" alt="" class="hero-logo-intro__logo">
      </div>
    `;

    const heroContent = hero.querySelector('.hero-content');
    if (heroContent) hero.insertBefore(intro, heroContent);
    else hero.appendChild(intro);

    return intro;
  }

  function prepareHero() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // --- Halo SVG behind logo
    const logoWrap = hero.querySelector('.hero-logo-wrapper');
    if (logoWrap && !logoWrap.querySelector('.hero-logo-halo')) {
      const halo = document.createElement('div');
      halo.className = 'hero-logo-halo';
      halo.innerHTML = `
        <svg class="hero-halo-rays" viewBox="0 0 400 400" aria-hidden="true">
          <g stroke="currentColor" stroke-linecap="round">
            ${Array.from({ length: 64 }).map((_, i) => {
              const a = (i / 64) * Math.PI * 2;
              const r1 = 138, r2 = i % 2 === 0 ? 178 : 158;
              const x1 = 200 + Math.cos(a) * r1;
              const y1 = 200 + Math.sin(a) * r1;
              const x2 = 200 + Math.cos(a) * r2;
              const y2 = 200 + Math.sin(a) * r2;
              return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke-width="${i % 2 === 0 ? 1.6 : 1}" />`;
            }).join('')}
          </g>
        </svg>
        <svg class="hero-halo-orbit" viewBox="0 0 400 400" aria-hidden="true">
          <circle cx="200" cy="200" r="184" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="2 8" />
        </svg>
        <svg class="hero-halo-orbit hero-halo-orbit-2" viewBox="0 0 400 400" aria-hidden="true">
          <circle cx="200" cy="200" r="170" fill="none" stroke="currentColor" stroke-width="0.6" stroke-dasharray="1 14" />
        </svg>
      `;
      logoWrap.insertBefore(halo, logoWrap.firstChild);
    }
    buildHeroLogoIntro(hero);

    // --- Overtitle
    const heroContent = hero.querySelector('.hero-content');
    if (heroContent && !heroContent.querySelector('.hero-overtitle')) {
      const over = document.createElement('div');
      over.className = 'hero-overtitle';
      over.innerHTML = `
        <span class="hero-overtitle-line"></span>
        <span class="hero-overtitle-text">ODS GROUP &nbsp;·&nbsp; ABIDJAN — PARIS</span>
        <span class="hero-overtitle-line"></span>
      `;
      heroContent.insertBefore(over, heroContent.firstChild);
    }

    if (heroContent && !heroContent.querySelector('.hero-kinetic-title')) {
      const k = document.createElement('h1');
      k.className = 'hero-kinetic-title';
      k.innerHTML = `
        <span class="hero-kinetic-line" data-text="L’ÉLÉGANCE"></span>
        <span class="hero-kinetic-line hero-kinetic-line-italic" data-text="en mouvement"></span>
      `;
      // Insert BEFORE the logo wrapper so title sits above the star (the logo)
      heroContent.insertBefore(k, logoWrap);
    }

    // --- Marquee strip
    if (heroContent && !heroContent.querySelector('.hero-marquee')) {
      const m = document.createElement('div');
      m.className = 'hero-marquee';
      const items = '★ CHORÉGRAPHIE ★ DANSE ★ SPECTACLES ★ CINÉMA ★ ÉVÉNEMENTIEL ★ COUPÉ-DÉCALÉ ★ HIP-HOP ★ MARIAGES ★ ';
      m.innerHTML = `
        <div class="hero-marquee-track">
          <span>${items}</span><span>${items}</span><span>${items}</span>
        </div>
      `;
      heroContent.appendChild(m);
    }

    // Spotlights
    if (!hero.querySelector('.hero-spotlights')) {
      const sp = document.createElement('div');
      sp.className = 'hero-spotlights';
      sp.innerHTML = `<div class="hero-spot hero-spot-1"></div>
                      <div class="hero-spot hero-spot-2"></div>
                      <div class="hero-spot hero-spot-3"></div>`;
      hero.querySelector('.hero-bg').appendChild(sp);
    }

    // Split kinetic title
    const lines = hero.querySelectorAll('.hero-kinetic-line');
    lines.forEach((l) => splitText(l, { className: 'hero-kinetic-letter' }));

    // Initial hidden state — set early so no FOUC when curtain opens
    if (hasGSAP && !reduceMotion) {
      const allLetters = hero.querySelectorAll('.hero-kinetic-letter');
      const intro = hero.querySelector('.hero-logo-intro');
      gsap.set(allLetters, { yPercent: 110, rotateX: -60, opacity: 0 });
      const overtitle = hero.querySelector('.hero-overtitle');
      if (overtitle) gsap.set(overtitle, { opacity: 0, y: -20 });
      gsap.set([
        hero.querySelector('.hero-tagline'),
        hero.querySelector('.hero-cta'),
        hero.querySelector('.hero-stats'),
        hero.querySelector('.hero-marquee'),
        hero.querySelector('.hero-scroll')
      ].filter(Boolean), { opacity: 0, y: 30 });
      gsap.set(hero.querySelector('.hero-logo'), { scale: 0.92, opacity: 0, rotate: 0 });
      gsap.set(hero.querySelector('.hero-halo-rays'), { scale: 0.6, opacity: 0, rotate: -30 });
      gsap.set(hero.querySelectorAll('.hero-halo-orbit'), { scale: 0.7, opacity: 0 });
      if (intro) {
        gsap.set(intro, { autoAlpha: 1, scale: 1 });
        gsap.set(intro.querySelector('.hero-logo-intro__stage'), {
          scale: 0.8,
          y: 18,
          rotateX: 8,
          rotateZ: -1.8,
          transformPerspective: 1200
        });
        gsap.set(intro.querySelector('.hero-logo-intro__logo'), {
          opacity: 0,
          scale: 0.86,
          y: 24,
          clipPath: 'inset(0% 48% 0% 48%)',
          filter: 'drop-shadow(0 0 22px rgba(201,168,76,0.28)) brightness(0.96)'
        });
        gsap.set(intro.querySelectorAll('.hero-logo-intro__beam, .hero-logo-intro__halo, .hero-logo-intro__depth, .hero-logo-intro__ring'), {
          opacity: 0,
          scale: 0.72
        });
        gsap.set(intro.querySelectorAll('.hero-logo-intro__particle'), {
          opacity: 0,
          x: 0,
          y: 0,
          scale: 0.25
        });
      }
    } else {
      hero.classList.add('hero-logo-intro-complete');
    }
  }

  function animateHero() {
    const hero = document.querySelector('.hero');
    if (!hero || !hasGSAP || reduceMotion) return;

    const allLetters = hero.querySelectorAll('.hero-kinetic-letter');
    const overtitle = hero.querySelector('.hero-overtitle');
    const tagline = hero.querySelector('.hero-tagline');
    const cta = hero.querySelector('.hero-cta');
    const stats = hero.querySelector('.hero-stats');
    const marquee = hero.querySelector('.hero-marquee');
    const scrollEl = hero.querySelector('.hero-scroll');
    const heroLogo = hero.querySelector('.hero-logo');
    const heroHaloRays = hero.querySelector('.hero-halo-rays');
    const heroHaloOrbits = hero.querySelectorAll('.hero-halo-orbit');
    const heroIntro = hero.querySelector('.hero-logo-intro');
    const introStage = heroIntro?.querySelector('.hero-logo-intro__stage');
    const introLogo = heroIntro?.querySelector('.hero-logo-intro__logo');
    const introBeams = heroIntro?.querySelectorAll('.hero-logo-intro__beam');
    const introHalo = heroIntro?.querySelector('.hero-logo-intro__halo');
    const introDepth = heroIntro?.querySelector('.hero-logo-intro__depth');
    const introRings = heroIntro?.querySelectorAll('.hero-logo-intro__ring');
    const introParticles = heroIntro?.querySelectorAll('.hero-logo-intro__particle');

    const heroIn = gsap.timeline({ delay: 0.05, defaults: { ease: 'expo.out' } });
    heroIn.add(() => {
      hero.classList.add('hero-logo-intro-active');
      hero.classList.remove('hero-logo-intro-complete');
    }, 0);

    if (heroIntro && introStage && introLogo) {
      heroIn
        .to(introDepth, { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' }, 0)
        .to(introHalo, { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' }, 0.05)
        .to(introBeams, { opacity: 0.78, scale: 1, rotate: 0, duration: 1.05, stagger: 0.08, ease: 'power3.out' }, 0.08)
        .to(introRings, { opacity: 0.58, scale: 1, duration: 1.05, stagger: 0.12, ease: 'power3.out' }, 0.12)
        .to(introStage, { scale: 1, y: 0, rotateX: 0, rotateZ: 0, duration: 1.15, ease: 'power4.out' }, 0.05)
        .to(introLogo, {
          opacity: 1,
          scale: 1.06,
          y: 0,
          clipPath: 'inset(0% 0% 0% 0%)',
          filter: 'drop-shadow(0 0 42px rgba(201,168,76,0.48)) drop-shadow(0 0 26px rgba(46,139,60,0.34)) brightness(1.06)',
          duration: 0.95,
          ease: 'power4.out'
        }, 0.12)
        .to(introParticles, {
          opacity: (i) => (i % 3 === 0 ? 0.95 : 0.72),
          x: (_, el) => Number(el.dataset.x) || 0,
          y: (_, el) => Number(el.dataset.y) || 0,
          scale: (i) => (i % 4 === 0 ? 1 : 0.75),
          duration: 0.95,
          stagger: { amount: 0.38, from: 'center' },
          ease: 'power3.out'
        }, 0.28)
        .to(introStage, { rotateZ: 0.7, y: -3, duration: 0.65, ease: 'sine.inOut' }, 0.95)
        .to(introLogo, { scale: 1.12, duration: 0.65, ease: 'sine.inOut' }, 0.95)
        .to(introParticles, { opacity: 0, scale: 0.3, duration: 0.55, stagger: { amount: 0.18, from: 'edges' }, ease: 'power2.in' }, 1.18)
        .to(introLogo, {
          scale: 1,
          filter: 'drop-shadow(0 0 32px rgba(201,168,76,0.36)) drop-shadow(0 0 18px rgba(46,139,60,0.24)) brightness(1)',
          duration: 0.48,
          ease: 'power3.out'
        }, 1.42)
        .to(heroIntro, { autoAlpha: 0, scale: 0.98, duration: 0.55, ease: 'power2.inOut' }, 1.52);
    }

    heroIn
      .to(heroHaloRays, { scale: 1, opacity: 0.85, rotate: 0, duration: 1.35 }, 1.2)
      .to(heroHaloOrbits, { scale: 1, opacity: 0.6, duration: 1.1, stagger: 0.15 }, 1.28)
      .to(heroLogo, { scale: 1, opacity: 1, rotate: 0, duration: 0.7, ease: 'power3.out' }, 1.45)
      .to(overtitle, { opacity: 1, y: 0, duration: 0.65 }, 1.62)
      .to(allLetters, { yPercent: 0, rotateX: 0, opacity: 1, duration: 0.95, stagger: 0.035 }, 1.78)
      .to(tagline, { opacity: 1, y: 0, duration: 0.7 }, 2.18)
      .to(cta, { opacity: 1, y: 0, duration: 0.7 }, 2.32)
      .to(stats, { opacity: 1, y: 0, duration: 0.7 }, 2.46)
      .to(marquee, { opacity: 1, y: 0, duration: 0.6 }, 2.58)
      .to(scrollEl, { opacity: 1, y: 0, duration: 0.5 }, 2.68)
      .add(() => {
        hero.classList.remove('hero-logo-intro-active');
        hero.classList.add('hero-logo-intro-complete');
        if (heroIntro) gsap.set(heroIntro, { display: 'none' });
      }, 2.1);

    // Continuous halo rotation — paused when hero is off-screen to save CPU.
    const haloRays = gsap.to('.hero-halo-rays', { rotate: 360, duration: 80, ease: 'none', repeat: -1 });
    const haloOrbit1 = gsap.to('.hero-halo-orbit', { rotate: -360, duration: 60, ease: 'none', repeat: -1 });
    const haloOrbit2 = gsap.to('.hero-halo-orbit-2', { rotate: 360, duration: 90, ease: 'none', repeat: -1 });
    const heroAnims = [haloRays, haloOrbit1, haloOrbit2];

    // Logo breathing glow — also off-screen aware
    const breathing = gsap.to(heroLogo, {
      filter: 'drop-shadow(0 0 60px rgba(201,168,76,0.55)) drop-shadow(0 0 25px rgba(46,139,60,0.3))',
      duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1
    });
    heroAnims.push(breathing);

    if (hasST) {
      ScrollTrigger.create({
        trigger: hero,
        start: 'top bottom',
        end: 'bottom top',
        onEnter:    () => heroAnims.forEach((t) => t.play()),
        onEnterBack:() => heroAnims.forEach((t) => t.play()),
        onLeave:    () => heroAnims.forEach((t) => t.pause()),
        onLeaveBack:() => heroAnims.forEach((t) => t.pause())
      });
    }

    // Parallax cursor tilt for logo + halo (rAF-throttled so rapid mouse
    // motion doesn't spawn 100s of tweens per second).
    if (!isTouch) {
      const tiltTarget = hero.querySelector('.hero-logo-wrapper');
      let rafQueued = false;
      let lastX = 0, lastY = 0;
      const onMove = (e) => {
        const rect = hero.getBoundingClientRect();
        lastX = (e.clientX - rect.left) / rect.width - 0.5;
        lastY = (e.clientY - rect.top) / rect.height - 0.5;
        if (rafQueued) return;
        rafQueued = true;
        requestAnimationFrame(() => {
          rafQueued = false;
          gsap.to(tiltTarget, {
            rotateY: lastX * 12, rotateX: -lastY * 10,
            x: lastX * 12, y: lastY * 8,
            duration: 0.6, ease: 'power2.out', transformPerspective: 1000, overwrite: 'auto'
          });
        });
      };
      hero.addEventListener('mousemove', onMove, { passive: true });
      hero.addEventListener('mouseleave', () => {
        gsap.to(tiltTarget, { rotateY: 0, rotateX: 0, x: 0, y: 0, duration: 0.9, ease: 'power3.out', overwrite: 'auto' });
      });
    }

    // Hero parallax on scroll — REMOVED
    // (was creating GPU work on every scroll frame; native scroll feels
    // way snappier without it).
  }

  /* ============================================================
   * 7. SECTION REVEALS (split-text titles, slide-in tags, image masks)
   * ==========================================================*/
  function initSectionReveals() {
    if (!hasST || reduceMotion) return;

    // Big background numbers — STATIC fade-in (no scrub = no per-frame cost)
    const sections = ['#about', '#services', '#portfolio', '#team', '#media', '#contact'];
    sections.forEach((sel, idx) => {
      const sec = document.querySelector(sel);
      if (!sec || sec.querySelector('.section-bignum')) return;
      const num = document.createElement('div');
      num.className = 'section-bignum';
      num.setAttribute('aria-hidden', 'true');
      num.textContent = String(idx + 1).padStart(2, '0');
      sec.appendChild(num);

      gsap.fromTo(num,
        { opacity: 0 },
        { opacity: 0.07, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: sec, start: 'top 80%' }
        }
      );
    });

    // Section titles split-text
    document.querySelectorAll('.section-title').forEach((title) => {
      // Preserve nested gold span
      const goldSpans = title.querySelectorAll('.gold');
      const goldTexts = [];
      goldSpans.forEach((g) => goldTexts.push(g.textContent));

      // Build wrappers: split into words, then letters, keeping gold class on its segment
      const original = title.innerHTML;
      // Simple approach: split each direct text node into letters
      title.classList.add('section-title-split');
      const html = title.innerHTML;
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      const out = [];
      tmp.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          out.push(letterize(node.textContent, ''));
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const cls = node.getAttribute('class') || '';
          out.push(letterize(node.textContent, cls));
        }
      });
      title.innerHTML = out.join('');

      const letters = title.querySelectorAll('.st-letter');
      gsap.set(letters, { yPercent: 110, opacity: 0, rotateX: -50 });
      gsap.to(letters, {
        yPercent: 0, opacity: 1, rotateX: 0,
        duration: 0.85, ease: 'expo.out', stagger: 0.025,
        scrollTrigger: { trigger: title, start: 'top 85%' }
      });
    });

    // Section tag stagger
    document.querySelectorAll('.section-tag').forEach((tag) => {
      gsap.fromTo(tag, { x: -30, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: tag, start: 'top 90%' }
      });
    });

    // Generic [data-aos] elements are handled by main.js initAOS +
    // style.css transitions — we don't override them here to keep them reliable.

    // Image kenburns REMOVED — was creating one ScrollTrigger per image
    // (~12 of them) with continuous filter/transform updates.

    // About badge floating animation REMOVED — was running 24/7.

    // Refresh ScrollTrigger after preloader curtain
    setTimeout(() => ScrollTrigger.refresh(), 200);
  }

  function letterize(text, parentClass) {
    const cls = parentClass ? parentClass + ' st-segment' : 'st-segment';
    let html = `<span class="${cls}">`;
    Array.from(text).forEach((ch) => {
      if (ch === ' ') html += '<span class="st-letter st-space">&nbsp;</span>';
      else html += `<span class="st-letter">${ch}</span>`;
    });
    html += '</span>';
    return html;
  }

  /* ============================================================
   * 8. MAGNETIC BUTTONS + SHIMMER
   * ==========================================================*/
  function initMagnetic() {
    if (isTouch) return;
    const targets = document.querySelectorAll('.btn, .hero-scroll, .nav-logo, .social-link');
    targets.forEach((el) => {
      el.classList.add('is-magnetic');
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        const strength = el.classList.contains('btn') ? 0.35 : 0.25;
        if (hasGSAP) gsap.to(el, { x: x * strength, y: y * strength, duration: 0.6, ease: 'power3.out' });
      });
      el.addEventListener('mouseleave', () => {
        if (hasGSAP) gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.4)' });
      });
    });
  }

  /* ============================================================
   * 9. NAV LOGO LIVE — subtle floating + halo on hover
   * ==========================================================*/
  function initNavLogo() {
    // Nav-logo subtle floating REMOVED — kept hover halo only (CSS).
    return;
  }

  /* ============================================================
   * 10. TEAM — STAGE SPOTLIGHT PROJECTOR
   * Cursor-tracked beam + hot spot, with "premier rôle" dim.
   * ==========================================================*/
  function initTeamSpotlight() {
    const grid = document.querySelector('.team-grid');
    if (!grid) return;
    const cards = grid.querySelectorAll('.team-card');
    if (!cards.length) return;

    cards.forEach((card) => {
      // Initial spotlight position (center-top)
      card.style.setProperty('--spot-x', '50%');
      card.style.setProperty('--spot-y', '28%');
      card.style.setProperty('--spot-strength', '0');

      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const px = ((e.clientX - rect.left) / rect.width) * 100;
        const py = ((e.clientY - rect.top) / rect.height) * 100;
        // Clamp so beam doesn't escape the cone
        const x = Math.max(15, Math.min(85, px));
        const y = Math.max(10, Math.min(70, py));
        card.style.setProperty('--spot-x', x + '%');
        card.style.setProperty('--spot-y', y + '%');
      };

      const onEnter = () => {
        grid.classList.add('has-spot');
        card.classList.add('is-spot');
        card.style.setProperty('--spot-strength', '1');
      };

      const onLeave = () => {
        card.classList.remove('is-spot');
        // If no other card is spot, remove grid state
        if (!grid.querySelector('.team-card.is-spot')) {
          grid.classList.remove('has-spot');
        }
        // Fade beam out
        card.style.setProperty('--spot-strength', '0');
      };

      // Touch: tap toggles spotlight on the tapped card
      const onTouch = (e) => {
        if (card.classList.contains('is-spot')) {
          onLeave();
        } else {
          // Clear other cards
          cards.forEach((c) => c !== card && c.classList.remove('is-spot') && c.style.setProperty('--spot-strength', '0'));
          onEnter();
          // Default move to center
          card.style.setProperty('--spot-x', '50%');
          card.style.setProperty('--spot-y', '32%');
        }
      };

      if (!isTouch) {
        card.addEventListener('mouseenter', onEnter);
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
      } else {
        card.addEventListener('touchstart', onTouch, { passive: true });
      }
    });
  }

  /* ============================================================
   * BOOTSTRAP
   * ==========================================================*/
  function bootstrapEarly() {
    detectMotionLibs();
    initGrain();
    initScrollProgress();
    // initCursor();  // disabled — caused "mouse doesn't follow" on some setups.
    initSmoothScroll();
    initMagnetic();
    initNavLogo();
    prepareHero();
    initTeamSpotlight();
  }

  function bootstrapAfterReveal() {
    detectMotionLibs();
    animateHero();
    initSectionReveals();
  }

  // Take over preloader: hide it via cinema timeline, then run reveals.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      bootstrapEarly();
      window.addEventListener('load', () => {
        const p = buildPreloader();
        if (p && typeof p.then === 'function') p.then(bootstrapAfterReveal);
        else bootstrapAfterReveal();
      });
    });
  } else {
    bootstrapEarly();
    window.addEventListener('load', () => {
      const p = buildPreloader();
      if (p && typeof p.then === 'function') p.then(bootstrapAfterReveal);
      else bootstrapAfterReveal();
    });
  }
})();
