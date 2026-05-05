// ===== PRELOADER =====
// NOTE: Preloader DOM and reveal timeline are handled by /js/cinema.js
// We only keep counter trigger here, executed after cinema curtain reveal.
window.addEventListener('load', () => {
  setTimeout(() => {
    animateCounters();
  }, 3200);
});

// ===== THEME TOGGLE =====
const THEME_STORAGE_KEY = 'ods-theme';
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
  const nextTheme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', nextTheme);

  if (!themeToggle) return;
  const targetThemeLabel = nextTheme === 'light' ? 'sombre' : 'clair';
  themeToggle.setAttribute('aria-label', `Activer le mode ${targetThemeLabel}`);
  themeToggle.setAttribute('title', `Basculer le mode ${targetThemeLabel}`);

  const label = themeToggle.querySelector('.theme-toggle-label');
  if (label) {
    label.textContent = targetThemeLabel.charAt(0).toUpperCase() + targetThemeLabel.slice(1);
  }
}

function resolveInitialTheme() {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

applyTheme(resolveInitialTheme());

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  });
}

// ===== PARTICLES =====
function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  const colors = ['rgba(201,168,76,0.6)', 'rgba(46,139,60,0.5)', 'rgba(224,200,114,0.4)'];

  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    const size = Math.random() * 4 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 8 + 6}s;
      animation-delay: ${Math.random() * 8}s;
      box-shadow: 0 0 ${size * 2}px ${color};
    `;
    container.appendChild(particle);
  }
}
createParticles();

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

function updateNavbarState() {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
}

window.addEventListener('scroll', updateNavbarState);
updateNavbarState();

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('open');
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 150;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
}

// ===== SCROLL ANIMATIONS (AOS-like) =====
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-aos-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}
initAOS();

// ===== COUNTER ANIMATION =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        const duration = 2000;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          entry.target.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ===== SERVICE TABS =====
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.getAttribute('data-tab');

    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    tabContents.forEach(content => {
      content.classList.remove('active');
      if (content.id === 'tab-' + tab) {
        content.classList.add('active');
      }
    });
  });
});

// ===== MEDIA FILTERS =====
const filterBtns = document.querySelectorAll('.filter-btn');
const mediaItems = document.querySelectorAll('.media-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');

    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    mediaItems.forEach(item => {
      if (filter === 'all' || item.getAttribute('data-type') === filter) {
        item.classList.remove('hidden');
        item.style.animation = 'fadeIn 0.5s ease forwards';
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ===== PORTFOLIO MODAL =====
const portfolioCards = document.querySelectorAll('.portfolio-item[data-portfolio-id]');
const portfolioModal = document.getElementById('portfolioModal');
const portfolioModalCat = document.getElementById('portfolioModalCat');
const portfolioModalTitle = document.getElementById('portfolioModalTitle');
const portfolioModalLead = document.getElementById('portfolioModalLead');
const portfolioModalMainImage = document.getElementById('portfolioModalMainImage');
const portfolioModalThumbs = document.getElementById('portfolioModalThumbs');
const portfolioModalText = document.getElementById('portfolioModalText');
const portfolioModalVideoWrap = document.getElementById('portfolioModalVideoWrap');
const portfolioModalVideo = document.getElementById('portfolioModalVideo');
const portfolioModalCloseBtns = document.querySelectorAll('[data-portfolio-close]');

let portfolioVideoStopTimer = null;
let lastPortfolioTrigger = null;
const PRIMUD_VIDEO_ID = '0zY86odLV94';
const PRIMUD_VIDEO_START = 27 * 60;
const PRIMUD_VIDEO_END = 29 * 60 + 30;

function buildYouTubeSegmentUrl(videoId, startSeconds, endSeconds) {
  const params = new URLSearchParams({
    start: String(startSeconds),
    end: String(endSeconds),
    autoplay: '1',
    controls: '1',
    enablejsapi: '1',
    playsinline: '1',
    rel: '0',
    modestbranding: '1'
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

const portfolioDetails = {
  'primud-2025': {
    category: 'Cérémonie PRIMUD 2025',
    title: 'Cérémonie de remise du prix du meilleur chorégraphe 2025',
    lead: "Un moment fort de reconnaissance artistique qui a mis en lumière l'excellence chorégraphique d'O'new Raymond.",
    story: [
      "La cérémonie PRIMUD 2025 a réuni les plus grands acteurs de la scène urbaine et du spectacle vivant ivoirien dans une soirée de prestige.",
      "Lors de la remise du prix du meilleur chorégraphe 2025, O'new Raymond a été distingué pour la qualité de ses créations, son impact sur la scène et sa capacité à valoriser l'identité culturelle à travers la danse.",
      "Cet événement marque une étape majeure pour ODS Group et confirme le positionnement du collectif parmi les références de la chorégraphie événementielle en Côte d'Ivoire."
    ],
    images: [
      { src: 'img/IMG_3332.JPG', alt: 'O\'new Raymond pendant la cérémonie PRIMUD 2025' },
      { src: 'img/IMG_3331.JPG', alt: 'Portrait O\'new Raymond PRIMUD 2025' },
      { src: 'img/IMG_3333.JPG', alt: 'Moment officiel PRIMUD 2025' },
      { src: 'img/IMG_3334.JPG', alt: 'O\'new Raymond en tenue traditionnelle lors de PRIMUD 2025' },
      { src: 'img/IMG_3335.JPG', alt: 'Scène et ambiance cérémonie PRIMUD 2025' }
    ],
    videoEmbedUrl: buildYouTubeSegmentUrl(PRIMUD_VIDEO_ID, PRIMUD_VIDEO_START, PRIMUD_VIDEO_END),
    videoStopAfterMs: (PRIMUD_VIDEO_END - PRIMUD_VIDEO_START) * 1000
  },
  'performance-contemporaine': {
    category: 'Chorégraphie',
    title: 'Performance contemporaine',
    lead: 'Une création scénique pensée pour offrir un impact émotionnel fort et un storytelling visuel élégant.',
    story: [
      "Cette performance contemporaine a été conçue autour d'une direction artistique sobre, précise et immersive.",
      "Le travail chorégraphique a mis l'accent sur la musicalité, la fluidité des transitions et l'interprétation des danseurs.",
      "Le résultat : un tableau scénique premium, calibré pour un public exigeant et des événements d'exception."
    ],
    images: [
      { src: 'https://images.pexels.com/photos/33911218/pexels-photo-33911218.jpeg?auto=compress&cs=tinysrgb&w=1400', alt: 'Performance contemporaine sur scène' },
      { src: 'https://images.pexels.com/photos/34752634/pexels-photo-34752634.jpeg?auto=compress&cs=tinysrgb&w=1400', alt: 'Danse en scène pour événement premium' },
      { src: 'https://images.pexels.com/photos/34042750/pexels-photo-34042750.jpeg?auto=compress&cs=tinysrgb&w=1400', alt: 'Show chorégraphique devant un public' }
    ]
  },
  'scene-action': {
    category: 'Cinéma',
    title: "Scène d'action",
    lead: "Une direction technique orientée sécurité, rythme et lisibilité visuelle pour l'écran.",
    story: [
      "La chorégraphie de combat a été préparée avec un découpage précis des mouvements et des intentions de jeu.",
      "Chaque enchaînement a été ajusté pour conserver l'intensité dramatique tout en garantissant la sécurité des interprètes.",
      "Le dispositif a permis une captation propre, dynamique et adaptée aux standards de production audiovisuelle."
    ],
    images: [
      { src: 'https://images.pexels.com/photos/32439172/pexels-photo-32439172.jpeg?auto=compress&cs=tinysrgb&w=1400', alt: "Équipe de tournage sur une scène d'action" },
      { src: 'https://images.pexels.com/photos/30433578/pexels-photo-30433578.jpeg?auto=compress&cs=tinysrgb&w=1400', alt: 'Public et effets de lumière en tournage' },
      { src: 'https://images.pexels.com/photos/33115381/pexels-photo-33115381.jpeg?auto=compress&cs=tinysrgb&w=1400', alt: 'Mise en place scénique et coordination technique' }
    ]
  },
  'ouverture-bal': {
    category: 'Mariage',
    title: 'Ouverture de bal',
    lead: 'Un moment chorégraphié sur mesure pour créer une entrée mémorable et émotionnelle.',
    story: [
      "L'ouverture de bal a été construite selon la personnalité des mariés et le rythme de la soirée.",
      "Le travail a combiné élégance, fluidité et effets de scène pour surprendre les invités dès les premières notes.",
      "Cette prestation a transformé la piste en véritable scène de spectacle, avec une narration chorégraphique cohérente."
    ],
    images: [
      { src: 'https://images.pexels.com/photos/32142661/pexels-photo-32142661.jpeg?auto=compress&cs=tinysrgb&w=1400', alt: 'Ouverture de bal chorégraphiée' },
      { src: 'https://images.pexels.com/photos/10048500/pexels-photo-10048500.jpeg?auto=compress&cs=tinysrgb&w=1400', alt: 'Animation danse pendant un événement privé' },
      { src: 'https://images.pexels.com/photos/30271349/pexels-photo-30271349.jpeg?auto=compress&cs=tinysrgb&w=1400', alt: 'Public pendant la prestation de mariage' }
    ]
  },
  'show-hiphop': {
    category: 'Spectacle',
    title: 'Show hip-hop',
    lead: "Une création originale à haute énergie, conçue pour festival et grands formats live.",
    story: [
      "Ce show hip-hop repose sur une écriture collective puissante, entre précision technique et présence scénique.",
      "La mise en scène exploite les contrastes de tempo, les formations de groupe et une forte interaction avec le public.",
      "La performance a été pensée pour s'adapter aux grands plateaux et maximiser l'impact visuel en configuration festival."
    ],
    images: [
      { src: 'https://images.pexels.com/photos/34042750/pexels-photo-34042750.jpeg?auto=compress&cs=tinysrgb&w=1600', alt: 'Show hip-hop en festival' },
      { src: 'https://images.pexels.com/photos/52977/crowd-audience-band-concert-52977.jpeg?auto=compress&cs=tinysrgb&w=1600', alt: 'Ambiance concert et public' },
      { src: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1600', alt: 'Performance dance sur scène' }
    ]
  },
  'primud-backstage': {
    category: 'PRIMUD 2025',
    title: 'Backstage & aftermovie de la cérémonie',
    lead: "Coulisses, montée en pression et moments exclusifs autour de la distinction d'O'new Raymond.",
    story: [
      "Ce volet backstage retrace l'envers du décor : préparation, coordination technique et ambiance avant le passage sur scène.",
      "On y retrouve les échanges clés avec l'équipe, les moments de concentration et les séquences de célébration juste après la remise du prix.",
      "Cette immersion complète le récit PRIMUD 2025 et met en valeur la dimension humaine derrière la performance artistique."
    ],
    images: [
      { src: 'img/IMG_3331.JPG', alt: 'Backstage PRIMUD 2025 - O\'new Raymond' },
      { src: 'img/IMG_3332.JPG', alt: 'Cérémonie PRIMUD 2025 - remise de prix' },
      { src: 'img/IMG_3333.JPG', alt: 'Échanges en coulisses PRIMUD 2025' },
      { src: 'img/IMG_3334.JPG', alt: 'Tenue traditionnelle - moment PRIMUD 2025' },
      { src: 'img/IMG_3335.JPG', alt: 'Clôture de soirée PRIMUD 2025' }
    ],
    videoEmbedUrl: buildYouTubeSegmentUrl(PRIMUD_VIDEO_ID, PRIMUD_VIDEO_START, PRIMUD_VIDEO_END),
    videoStopAfterMs: (PRIMUD_VIDEO_END - PRIMUD_VIDEO_START) * 1000
  }
};

function clearPortfolioVideo() {
  clearTimeout(portfolioVideoStopTimer);
  portfolioVideoStopTimer = null;
  if (portfolioModalVideo) {
    portfolioModalVideo.onload = null;
    portfolioModalVideo.src = '';
  }
}

function setPortfolioMainImage(image, index = 0) {
  if (!portfolioModalMainImage) return;
  portfolioModalMainImage.src = image.src;
  portfolioModalMainImage.alt = image.alt || 'Photo de l\'événement';

  if (!portfolioModalThumbs) return;
  const thumbButtons = portfolioModalThumbs.querySelectorAll('.portfolio-thumb-btn');
  thumbButtons.forEach((btn, i) => btn.classList.toggle('active', i === index));
}

function renderPortfolioThumbs(images) {
  if (!portfolioModalThumbs) return;
  portfolioModalThumbs.innerHTML = '';

  images.forEach((image, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'portfolio-thumb-btn';
    btn.setAttribute('aria-label', `Voir la photo ${index + 1}`);

    const thumbImage = document.createElement('img');
    thumbImage.src = image.src;
    thumbImage.alt = image.alt || `Photo ${index + 1}`;
    btn.appendChild(thumbImage);

    btn.addEventListener('click', () => setPortfolioMainImage(image, index));
    portfolioModalThumbs.appendChild(btn);
  });
}

function openPortfolioModal(portfolioId, triggerEl) {
  if (!portfolioModal) return;
  const details = portfolioDetails[portfolioId];
  if (!details) return;

  lastPortfolioTrigger = triggerEl || null;
  portfolioModalCat.textContent = details.category || '';
  portfolioModalTitle.textContent = details.title || '';
  portfolioModalLead.textContent = details.lead || '';

  const images = Array.isArray(details.images) && details.images.length > 0
    ? details.images
    : [{ src: '', alt: '' }];

  renderPortfolioThumbs(images);
  setPortfolioMainImage(images[0], 0);

  portfolioModalText.innerHTML = '';
  (details.story || []).forEach((paragraph) => {
    const p = document.createElement('p');
    p.textContent = paragraph;
    portfolioModalText.appendChild(p);
  });

  clearPortfolioVideo();
  if (details.videoEmbedUrl) {
    portfolioModalVideoWrap.hidden = false;

    portfolioModalVideo.onload = () => {
      portfolioModalVideo.contentWindow?.postMessage(JSON.stringify({
        event: 'command',
        func: 'playVideo',
        args: []
      }), '*');
    };

    portfolioModalVideo.src = details.videoEmbedUrl;

    if (details.videoStopAfterMs) {
      portfolioVideoStopTimer = setTimeout(() => {
        portfolioModalVideo.contentWindow?.postMessage(JSON.stringify({
          event: 'command',
          func: 'pauseVideo',
          args: []
        }), '*');
      }, details.videoStopAfterMs);
    }
  } else {
    portfolioModalVideoWrap.hidden = true;
  }

  portfolioModal.classList.add('open');
  portfolioModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closePortfolioModal() {
  if (!portfolioModal || !portfolioModal.classList.contains('open')) return;
  portfolioModal.classList.remove('open');
  portfolioModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  clearPortfolioVideo();

  if (lastPortfolioTrigger) {
    lastPortfolioTrigger.focus();
  }
}

portfolioCards.forEach((card) => {
  const portfolioId = card.getAttribute('data-portfolio-id');
  if (!portfolioId) return;

  card.addEventListener('click', () => openPortfolioModal(portfolioId, card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPortfolioModal(portfolioId, card);
    }
  });
});

portfolioModalCloseBtns.forEach((btn) => {
  btn.addEventListener('click', closePortfolioModal);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePortfolioModal();
});

// ===== TESTIMONIALS SLIDER =====
const testimonialsSlider = document.querySelector('.testimonials-slider');
const testCards = document.querySelectorAll('.testimonial-card');
const testNavBtns = document.querySelectorAll('.test-nav-btn');
let currentTest = 0;
let autoSlide;

function syncTestimonialsHeight() {
  if (!testimonialsSlider || testCards.length === 0) return;

  let maxHeight = 0;
  testCards.forEach((card) => {
    maxHeight = Math.max(maxHeight, card.scrollHeight);
  });

  testimonialsSlider.style.height = `${Math.max(maxHeight, 280)}px`;
}

function showTestimonial(index) {
  testCards.forEach((card, i) => {
    card.classList.remove('active');
    card.style.transform = i < index ? 'translateX(-40px)' : 'translateX(40px)';
  });
  testCards[index].classList.add('active');
  testCards[index].style.transform = 'translateX(0)';

  testNavBtns.forEach(btn => btn.classList.remove('active'));
  testNavBtns[index].classList.add('active');
  currentTest = index;
  syncTestimonialsHeight();
}

testNavBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    showTestimonial(parseInt(btn.getAttribute('data-index')));
    resetAutoSlide();
  });
});

function nextTestimonial() {
  const next = (currentTest + 1) % testCards.length;
  showTestimonial(next);
}

function resetAutoSlide() {
  clearInterval(autoSlide);
  autoSlide = setInterval(nextTestimonial, 5000);
}

autoSlide = setInterval(nextTestimonial, 5000);

if (testimonialsSlider && testCards.length > 0) {
  syncTestimonialsHeight();
  window.addEventListener('resize', syncTestimonialsHeight);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncTestimonialsHeight).catch(() => {});
  }
}

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span>Message envoy\u00e9 !</span>';
    btn.style.background = 'linear-gradient(135deg, var(--green), var(--green-dark))';

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });
}

// ===== SMOOTH SCROLL =====
// Handled by Lenis in /js/cinema.js for buttery smooth scroll.
// Fallback only if Lenis is not available.
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    if (typeof window.Lenis !== 'undefined') return; // cinema.js handles it
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = navbar.offsetHeight + 20;
      const position = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: position, behavior: 'smooth' });
    }
  });
});

// ===== PARALLAX EFFECT ON HERO =====
// Disabled: handled by GSAP ScrollTrigger in /js/cinema.js.

// ===== MAGNETIC BUTTON EFFECT =====
// Disabled: handled by GSAP magnetic in /js/cinema.js.

// ===== TILT EFFECT ON SERVICE CARDS =====
document.querySelectorAll('.service-mini-card, .team-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty('--mx', ((x + 0.5) * 100) + '%');
    card.style.setProperty('--my', ((y + 0.5) * 100) + '%');
    card.style.transform = `translateY(-4px) perspective(1000px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// Track mouse for portfolio/media spotlight effect (CSS uses --mx/--my)
document.querySelectorAll('.portfolio-item, .media-item').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});
