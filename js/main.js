// ===== PRELOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('loaded');

    // Start counters after preloader fade, so users can see the animation.
    setTimeout(() => {
      animateCounters();
    }, 250);
  }, 1800);
});

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
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
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
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-content');
  if (!hero) return;
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight) {
    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    hero.style.opacity = 1 - scrolled / window.innerHeight;
  }
});

// ===== MAGNETIC BUTTON EFFECT =====
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translateY(-2px) translate(${x * 0.1}px, ${y * 0.1}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ===== TILT EFFECT ON SERVICE CARDS =====
document.querySelectorAll('.service-mini-card, .team-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-4px) perspective(1000px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
