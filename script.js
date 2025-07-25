// ===================== NAV ACTIVE TAB HIGHLIGHT ON SCROLL =====================
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

// Returns the index of the current section in the viewport
function getCurrentSection() {
  let index = sections.length - 1;
  for (let i = 0; i < sections.length; i++) {
    if (window.scrollY + 130 < sections[i].offsetTop) {
      index = i - 1;
      break;
    }
  }
  return index < 0 ? 0 : index;
}

// Update navigation highlight on scroll
function updateNavHighlight() {
  const currentIndex = getCurrentSection();
  navLinks.forEach((link, i) => {
    link.classList.toggle('active', i === currentIndex);
  });
}

window.addEventListener('scroll', updateNavHighlight);

// Smooth scroll for nav links
navLinks.forEach((link, idx) => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target.scrollIntoView({ behavior: 'smooth' });
    navLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});

// Initial highlight on load
updateNavHighlight();


// ===================== PARALLAX BACKGROUND MOTION JS =====================
// Extra parallax effect by moving .bg-parallax with scroll
const bgParallax = document.querySelector('.bg-parallax');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  // Parallax: vertical & diagonal shift, feel free to adjust factor!
  bgParallax.style.backgroundPosition = `${y * 0.13}px ${y * 0.18}px, ${y * 0.28}px ${y * 0.36}px`;
});

// ===================== SCROLL TO TOP BUTTON =====================
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
// Hide button if already at top
window.addEventListener('scroll', () => {
  scrollToTopBtn.style.display = window.scrollY > 240 ? 'block' : 'none';
});
// Initial hide
scrollToTopBtn.style.display = 'none';
