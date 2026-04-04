/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');
let mouseX = 0, mouseY = 0;
let curX = 0, curY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

(function animateCursor() {
  curX += (mouseX - curX) * 0.14;
  curY += (mouseY - curY) * 0.14;
  cursor.style.left = curX + 'px';
  cursor.style.top  = curY + 'px';
  requestAnimationFrame(animateCursor);
})();

/* ============================================================
   NAVBAR — scroll effect & hamburger
   ============================================================ */
const nav      = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ============================================================
   HERO CANVAS — particle field
   ============================================================ */
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];
  const PARTICLE_COUNT = 90;
  const CONNECT_DIST   = 130;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); spawnParticles(); });

  class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : H + 10;
      this.vx = (Math.random() - .5) * .4;
      this.vy = -(Math.random() * .3 + .1);
      this.r  = Math.random() * 1.5 + .5;
      this.alpha = Math.random() * .5 + .15;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10) this.reset(false);
      if (this.x < 0) this.x = W;
      if (this.x > W) this.x = 0;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99,102,241,${this.alpha})`;
      ctx.fill();
    }
  }

  function spawnParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }
  spawnParticles();

  let mouseHeroX = W / 2, mouseHeroY = H / 2;
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouseHeroX = e.clientX - r.left;
    mouseHeroY = e.clientY - r.top;
  });

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * .18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
          ctx.lineWidth = .6;
          ctx.stroke();
        }
      }
      /* mouse repel */
      const dx = particles[i].x - mouseHeroX;
      const dy = particles[i].y - mouseHeroY;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 100) {
        const force = (100 - d) / 100 * .6;
        particles[i].x += (dx / d) * force;
        particles[i].y += (dy / d) * force;
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ============================================================
   TYPEWRITER EFFECT
   ============================================================ */
(function typewriter() {
  const el = document.getElementById('typed');
  const words = [
    'web apps.',
    'AI tools.',
    'fast APIs.',
    'mobile apps.',
    'great UX.',
    'real products.',
  ];
  let wi = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 70, SPEED_DEL = 35, PAUSE = 2000;

  function tick() {
    const word = words[wi];
    if (!deleting) {
      ci++;
      el.textContent = word.slice(0, ci);
      if (ci === word.length) {
        deleting = true;
        return setTimeout(tick, PAUSE);
      }
    } else {
      ci--;
      el.textContent = word.slice(0, ci);
      if (ci === 0) {
        deleting = false;
        wi = (wi + 1) % words.length;
      }
    }
    setTimeout(tick, deleting ? SPEED_DEL : SPEED_TYPE);
  }
  setTimeout(tick, 600);
})();

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function animateCount(el) {
  const target = +el.dataset.count;
  let current = 0;
  const step = Math.ceil(target / 40);
  const t = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(t);
  }, 40);
}

/* ============================================================
   SCROLL REVEAL — Intersection Observer
   ============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* counter on hero */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-count]').forEach(animateCount);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

/* skill bars */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.classList.add('animated');
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skill-category').forEach(el => skillObserver.observe(el));

/* ============================================================
   TECH PILL CLOUD
   ============================================================ */
const techStack = [
  { label: 'React',         icon: '⚛️' },
  { label: 'Next.js',       icon: '▲' },
  { label: 'TypeScript',    icon: '🔷' },
  { label: 'Python',        icon: '🐍' },
  { label: 'Django',        icon: '🎸' },
  { label: 'FastAPI',       icon: '⚡' },
  { label: 'Node.js',       icon: '🟢' },
  { label: 'PostgreSQL',    icon: '🐘' },
  { label: 'MongoDB',       icon: '🍃' },
  { label: 'Docker',        icon: '🐳' },
  { label: 'Redis',         icon: '🔴' },
  { label: 'GraphQL',       icon: '◉' },
  { label: 'Tailwind CSS',  icon: '🎨' },
  { label: 'React Native',  icon: '📱' },
  { label: 'OpenAI API',    icon: '🤖' },
  { label: 'LangChain',     icon: '🔗' },
  { label: 'Git',           icon: '🌿' },
  { label: 'AWS',           icon: '☁️' },
  { label: 'Angular',       icon: '🔺' },
  { label: 'Firebase',      icon: '🔥' },
];

function buildTechCloud() {
  const inner = document.getElementById('tech-inner');
  if (!inner) return;
  const doubled = [...techStack, ...techStack]; // seamless loop
  inner.innerHTML = doubled.map(t =>
    `<span class="tech-pill"><span class="tech-pill-icon">${t.icon}</span>${t.label}</span>`
  ).join('');
}
buildTechCloud();

/* ============================================================
   PROJECT FILTER
   ============================================================ */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const cats = card.dataset.category || '';
      const show = filter === 'all' || cats.includes(filter);
      card.classList.toggle('hidden', !show);
    });
  });
});

/* ============================================================
   CONTACT FORM — fake submit
   ============================================================ */
const form    = document.getElementById('contact-form');
const success = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Sending…';

    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Send message';
      success.classList.add('visible');
      setTimeout(() => success.classList.remove('visible'), 4000);
    }, 1200);
  });
}

/* ============================================================
   SMOOTH ACTIVE NAV LINK on scroll
   ============================================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active-link'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active-link');
    }
  });
}, { threshold: 0.45 });

sections.forEach(s => sectionObserver.observe(s));

/* ============================================================
   3D TILT on project cards
   ============================================================ */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - .5;
    const y = (e.clientY - rect.top)  / rect.height - .5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 5}deg) rotateY(${x * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
