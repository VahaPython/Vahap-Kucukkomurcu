/* script.js — Interactions, GSAP, and animations */
'use strict';

/* ── Register GSAP plugins ── */
gsap.registerPlugin(ScrollTrigger);

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
      opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
      duration: 0.9,
      ease: 'power3.out',
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
   HERO — scroll-expanding media
══════════════════════════════════ */
function initHeroExpand() {
  const scrim = document.getElementById('heroScrim');

  const isMobile = () => window.innerWidth < 768;
  const fadeTargets = document.querySelectorAll('.hero-bio, .hero-stats, .hero-cta, .social-strip');
  const firstWord = document.querySelector('.h-first');
  const lastWord  = document.querySelector('.h-last');

  ScrollTrigger.create({
    trigger: '.s-hero',
    start: 'top top',
    end: () => '+=' + (isMobile() ? 550 : 1000),
    pin: true,
    scrub: 0.6,
    invalidateOnRefresh: true,
    onUpdate: self => {
      const p = self.progress;

      if (typeof window.setHeroDNAProgress === 'function') {
        window.setHeroDNAProgress(p);
      }
      if (scrim) scrim.style.opacity = String(Math.min(p * 0.95, 0.7));

      gsap.set(fadeTargets, { opacity: 1 - p * 0.9, y: -p * 16 });
      if (firstWord) gsap.set(firstWord, { x: -p * 40 });
      if (lastWord)  gsap.set(lastWord,  { x:  p * 40 });
    }
  });
}

/* ══════════════════════════════════
   NAV PILL — sliding hover indicator
══════════════════════════════════ */
function initNavPill() {
  const nav  = document.getElementById('nav');
  const pill = document.getElementById('navPill');
  if (!nav || !pill) return;

  const links = [...nav.querySelectorAll('.nav-link')];

  function moveTo(link) {
    if (!link) { pill.style.opacity = '0'; return; }
    const navRect  = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    pill.style.width     = linkRect.width + 'px';
    pill.style.transform = `translateX(${linkRect.left - navRect.left}px)`;
    pill.style.opacity   = '1';
  }

  links.forEach(link => {
    link.addEventListener('mouseenter', () => moveTo(link));
  });

  nav.addEventListener('mouseleave', () => {
    moveTo(nav.querySelector('.nav-link.active'));
  });

  /* keep pill synced with active link as scroll position changes */
  const sync = new MutationObserver(() => {
    if (!nav.matches(':hover')) moveTo(nav.querySelector('.nav-link.active'));
  });
  links.forEach(l => sync.observe(l, { attributes: true, attributeFilter: ['class'] }));

  window.addEventListener('resize', () => {
    moveTo(nav.querySelector('.nav-link.active') || links[0]);
  });
}

/* ══════════════════════════════════
   PROJECT LINK PIN BEACONS
══════════════════════════════════ */
function initPinLinks() {
  document.querySelectorAll('.pj-link').forEach(link => {
    const beacon = document.createElement('span');
    beacon.className = 'pj-pin-beacon';
    beacon.setAttribute('aria-hidden', 'true');
    beacon.innerHTML =
      '<span class="pj-pin-ring"></span>' +
      '<span class="pj-pin-ring"></span>' +
      '<span class="pj-pin-ring"></span>' +
      '<span class="pj-pin-dot"></span>';
    link.appendChild(beacon);
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
   HERO ATMOSPHERE — preserve battery when this tab is not visible
══════════════════════════════════ */
function initHeroAtmosphere() {
  const dna = document.querySelector('.hero-dna');
  if (!dna) return;

  function syncMotion() {
    dna.classList.toggle('motion-paused', document.hidden);
  }
  document.addEventListener('visibilitychange', syncMotion);
  syncMotion();
}

/* ══════════════════════════════════
   BOOT
══════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initMagnetic();
  initHeader();
  initHeroExpand();
  initNavPill();
  initPinLinks();
  initSmooth();
  initTilt();
  initReveal();
  initCounters();
  initSkillFilter();
  initHeroAtmosphere();
});
