/* script.js — Interactions, GSAP, Custom Cursor, Animations */
'use strict';

/* ── Register GSAP plugins ── */
gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════
   LOADER
══════════════════════════════════ */
function initLoader() {
  const loader = document.getElementById('loader');
  const fill   = document.getElementById('loaderFill');
  let pct = 0;

  const iv = setInterval(() => {
    pct += Math.random() * 11 + 2;
    if (pct >= 100) {
      pct = 100;
      clearInterval(iv);
      fill.style.width = '100%';
      setTimeout(dismissLoader, 350);
    }
    fill.style.width = Math.min(pct, 100) + '%';
  }, 70);

  function dismissLoader() {
    gsap.to(loader, {
      opacity: 0, duration: 0.55, ease: 'power2.out',
      onComplete: () => {
        loader.style.display = 'none';
        runHeroEntrance();
      }
    });
  }
}

/* ══════════════════════════════════
   HERO ENTRANCE
══════════════════════════════════ */
function runHeroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo('.hero-badge',  { opacity:0, y:18 }, { opacity:1, y:0, duration:0.6 })
    .fromTo('.h-first',     { opacity:0, y:30 }, { opacity:1, y:0, duration:0.7 }, '-=0.2')
    .fromTo('.h-last',      { opacity:0, y:30 }, { opacity:1, y:0, duration:0.7 }, '-=0.45')
    .fromTo('.hero-role',   { opacity:0, y:20 }, { opacity:1, y:0, duration:0.5 }, '-=0.25')
    .fromTo('.hero-bio',    { opacity:0, y:20 }, { opacity:1, y:0, duration:0.5 }, '-=0.25')
    .fromTo('.hero-stats',  { opacity:0, y:18 }, { opacity:1, y:0, duration:0.5 }, '-=0.2')
    .fromTo('.hero-cta',    { opacity:0, y:16 }, { opacity:1, y:0, duration:0.5 }, '-=0.2')
    .fromTo('.social-strip',{ opacity:0, y:14 }, { opacity:1, y:0, duration:0.4 }, '-=0.2')
    .fromTo('.scroll-hint', { opacity:0 },       { opacity:1, duration:0.6 },      '-=0.1');

  /* Start typewriter after entrance */
  tl.call(startTypewriter, null, '+=0.3');
}

/* ══════════════════════════════════
   TYPEWRITER
══════════════════════════════════ */
function startTypewriter() {
  const el = document.getElementById('typeTarget');
  if (!el) return;

  const strings = [
    'Bioinformatics Researcher',
    'Computational Biologist',
    'Data Science \u00d7 Life Sciences',
    'Code \u2192 Cures',
    'Biomedical Engineering Student'
  ];

  let si = 0, ci = 0, del = false;

  function tick() {
    const s = strings[si];
    if (!del) {
      el.textContent = s.substring(0, ++ci);
      if (ci === s.length) { del = true; setTimeout(tick, 1900); return; }
    } else {
      el.textContent = s.substring(0, --ci);
      if (ci === 0) { del = false; si = (si + 1) % strings.length; }
    }
    setTimeout(tick, del ? 42 : 72);
  }
  tick();
}

/* ══════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════ */
function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let rx = -100, ry = -100;

  window.addEventListener('mousemove', e => {
    /* Dot follows instantly */
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';
    /* Ring lags behind (CSS transition handles it) */
    ring.style.left = e.clientX + 'px';
    ring.style.top  = e.clientY + 'px';
  });

  document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
}

/* ══════════════════════════════════
   MAGNETIC BUTTONS
══════════════════════════════════ */
function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.22;
      const y = (e.clientY - r.top  - r.height / 2) * 0.22;
      gsap.to(el, { x, y, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1,0.45)' });
    });
  });
}

/* ══════════════════════════════════
   3D CARD TILT
══════════════════════════════════ */
function initTilt() {
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left)  / r.width  - 0.5) * 2;
      const y = ((e.clientY - r.top)   / r.height - 0.5) * 2;

      gsap.to(card, {
        rotateY: x * 10, rotateX: -y * 10,
        transformPerspective: 820,
        ease: 'power2.out', duration: 0.3
      });

      /* Spotlight position for ::after pseudo */
      card.style.setProperty('--mx', ((e.clientX - r.left)  / r.width  * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top)   / r.height * 100) + '%');
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0, rotateX: 0,
        duration: 0.85, ease: 'elastic.out(1, 0.4)'
      });
    });
  });
}

/* ══════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════ */
function initReveal() {
  document.querySelectorAll('.reveal').forEach((el, i) => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      opacity: 1, y: 0,
      duration: 0.72,
      ease: 'power2.out',
      delay: (i % 5) * 0.065
    });
  });
}

/* ══════════════════════════════════
   COUNTER ANIMATION
══════════════════════════════════ */
function initCounters() {
  document.querySelectorAll('.sv').forEach(el => {
    const target = parseInt(el.dataset.to);
    ScrollTrigger.create({
      trigger: el, start: 'top 80%', once: true,
      onEnter: () => {
        let v = 0;
        const step = target / 36;
        const iv = setInterval(() => {
          v += step;
          if (v >= target) { v = target; clearInterval(iv); }
          el.textContent = Math.floor(v);
        }, 30);
      }
    });
  });
}

/* ══════════════════════════════════
   SKILL CATEGORY FILTER
══════════════════════════════════ */
function initSkillFilter() {
  const btns  = document.querySelectorAll('.sf-btn');
  const cards = document.querySelectorAll('.skill-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;

      cards.forEach((card, i) => {
        const match = cat === 'all' || card.dataset.cat === cat;
        if (match) {
          card.classList.remove('hidden');
          gsap.fromTo(card,
            { opacity: 0, scale: 0.88 },
            { opacity: 1, scale: 1, duration: 0.38, delay: i * 0.035, ease: 'back.out(1.5)' }
          );
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ══════════════════════════════════
   HEADER — scroll + mobile + active
══════════════════════════════════ */
function initHeader() {
  const header = document.getElementById('header');
  const nav    = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  toggle?.addEventListener('click', () => nav.classList.toggle('open'));

  /* Close mobile nav on link click */
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });

  /* Active nav based on visible section */
  const sections = ['hero','about','skills','projects','contact'];
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.nav-link[data-s="${e.target.id}"]`);
        a?.classList.add('active');
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) io.observe(el);
  });
}

/* ══════════════════════════════════
   SMOOTH SCROLL
══════════════════════════════════ */
function initSmooth() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

/* ══════════════════════════════════
   BOOT
══════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initMagnetic();
  initHeader();
  initSmooth();
  initTilt();
  initReveal();
  initCounters();
  initSkillFilter();
  initLoader();   /* Loader triggers hero entrance after dismiss */
});
