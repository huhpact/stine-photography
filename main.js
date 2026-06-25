/* ─── All functionality for Stine Photography ─── */

// ── Init AOS ─────────────────────────────────────────────
window.addEventListener('load', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
    });
  }
});

// ── Scroll Progress Bar ──────────────────────────────────
const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = pct + '%';
}

// ── Navigation ──────────────────────────────────────────
const siteHeader = document.getElementById('siteHeader');
const hamburger = document.getElementById('hamburger');
const navDrawer = document.getElementById('navDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const drawerClose = document.getElementById('drawerClose');
const drawerLinks = document.querySelectorAll('.drawer-link');
const backToTop = document.getElementById('backToTop');

let lastScrollY = 0;
let heroHeight = 0;

function updateHeroHeight() {
  const hero = document.querySelector('.hero');
  heroHeight = hero ? hero.offsetHeight : window.innerHeight;
}

function updateNav() {
  const scrollY = window.scrollY;
  const isScrolled = scrollY > 50;
  const isAtHero = scrollY < heroHeight - 80;

  siteHeader.classList.toggle('scrolled', isScrolled);
  siteHeader.classList.toggle('hero-mode', isAtHero);

  // Hide/show on scroll direction (only after hero)
  if (scrollY > heroHeight) {
    if (scrollY > lastScrollY + 5 && scrollY > 200) {
      siteHeader.classList.add('hidden');
    } else if (scrollY < lastScrollY - 5) {
      siteHeader.classList.remove('hidden');
    }
  } else {
    siteHeader.classList.remove('hidden');
  }

  lastScrollY = scrollY;

  // Back to top
  if (backToTop) backToTop.classList.toggle('visible', scrollY > heroHeight);
}

// Mobile drawer
function openDrawer() {
  navDrawer.classList.add('open');
  drawerOverlay.classList.add('active');
  navDrawer.removeAttribute('aria-hidden');
  drawerOverlay.removeAttribute('aria-hidden');
  document.body.classList.add('no-scroll');
  hamburger.setAttribute('aria-expanded', 'true');
  drawerClose.focus();
}

function closeDrawer() {
  navDrawer.classList.remove('open');
  drawerOverlay.classList.remove('active');
  navDrawer.setAttribute('aria-hidden', 'true');
  drawerOverlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.focus();
}

hamburger?.addEventListener('click', openDrawer);
drawerClose?.addEventListener('click', closeDrawer);
drawerOverlay?.addEventListener('click', closeDrawer);

drawerLinks.forEach(link => {
  link.addEventListener('click', closeDrawer);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (navDrawer.classList.contains('open')) closeDrawer();
    if (cookieModalOverlay?.classList.contains('active')) closeCookieModal();
  }
});

// Focus trap for drawer
navDrawer?.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab' || !navDrawer.classList.contains('open')) return;
  const focusable = navDrawer.querySelectorAll('button, a, input, [tabindex]:not([tabindex="-1"])');
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault(); last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault(); first.focus();
  }
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  const scrollY = window.scrollY + (siteHeader ? siteHeader.offsetHeight : 72);
  let currentId = '';
  sections.forEach(section => {
    if (section.offsetTop <= window.scrollY + 120) {
      currentId = section.id;
    }
  });
  navLinks.forEach(link => {
    const href = link.getAttribute('href')?.replace('#', '');
    link.classList.toggle('active', href === currentId);
  });
}

// Back to top
backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Hero Slideshow ──────────────────────────────────────
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.slide-dot');
let currentSlide = 0;
let slideshowTimer = null;

function goToSlide(index) {
  slides[currentSlide]?.classList.remove('active');
  dots[currentSlide]?.classList.remove('active');
  dots[currentSlide]?.setAttribute('aria-selected', 'false');

  currentSlide = (index + slides.length) % slides.length;

  slides[currentSlide]?.classList.add('active');
  dots[currentSlide]?.classList.add('active');
  dots[currentSlide]?.setAttribute('aria-selected', 'true');
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function startSlideshow() {
  slideshowTimer = setInterval(nextSlide, 4500);
}

function resetSlideshow(index) {
  clearInterval(slideshowTimer);
  goToSlide(index);
  startSlideshow();
}

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => resetSlideshow(i));
});

startSlideshow();

// ── FAQ Accordion ────────────────────────────────────────
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const btn = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  if (!btn || !answer) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    // Close all others
    faqItems.forEach(other => {
      const otherBtn = other.querySelector('.faq-question');
      const otherAnswer = other.querySelector('.faq-answer');
      if (otherBtn && otherAnswer && other !== item) {
        otherBtn.setAttribute('aria-expanded', 'false');
        otherAnswer.setAttribute('hidden', '');
      }
    });

    // Toggle this one
    if (isOpen) {
      btn.setAttribute('aria-expanded', 'false');
      answer.setAttribute('hidden', '');
    } else {
      btn.setAttribute('aria-expanded', 'true');
      answer.removeAttribute('hidden');
    }
  });

  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
});

// ── Stats Counter ────────────────────────────────────────
const statNumbers = document.querySelectorAll('.stat-number[data-count]');
let statsAnimated = false;

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'), 10);
  const duration = 1800;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }

  requestAnimationFrame(update);
}

function tryAnimateStats() {
  if (statsAnimated) return;
  const statsSection = document.querySelector('.stats-strip');
  if (!statsSection) return;
  const rect = statsSection.getBoundingClientRect();
  if (rect.top < window.innerHeight - 80) {
    statsAnimated = true;
    statNumbers.forEach(el => animateCounter(el));
  }
}

// ── Process timeline line animation ─────────────────────
const processLineFill = document.getElementById('processLineFill');
let processAnimated = false;

function tryAnimateProcess() {
  if (processAnimated || !processLineFill) return;
  const rect = processLineFill.getBoundingClientRect();
  if (rect.top < window.innerHeight - 80) {
    processAnimated = true;
    setTimeout(() => {
      processLineFill.style.width = '100%';
    }, 200);
  }
}

// ── Cookie Consent ──────────────────────────────────────
const cookieBanner = document.getElementById('cookieBanner');
const cookieModalOverlay = document.getElementById('cookieModalOverlay');
const cookieModal = document.getElementById('cookieModal');
const cookieModalClose = document.getElementById('cookieModalClose');
const cookieAcceptAll = document.getElementById('cookieAcceptAll');
const cookieNecessaryOnly = document.getElementById('cookieNecessaryOnly');
const cookieSettingsBtn = document.getElementById('cookieSettings');
const cookieSavePrefs = document.getElementById('cookieSavePrefs');
const cookieAcceptAllModal = document.getElementById('cookieAcceptAllModal');
const footerCookieBtn = document.getElementById('footerCookieBtn');
const cookieStatistics = document.getElementById('cookieStatistics');
const cookieMarketing = document.getElementById('cookieMarketing');

const COOKIE_KEY = 'stine_cookie_consent';

function getConsent() {
  try { return JSON.parse(localStorage.getItem(COOKIE_KEY)); } catch { return null; }
}

function saveConsent(prefs) {
  localStorage.setItem(COOKIE_KEY, JSON.stringify({ ...prefs, timestamp: Date.now() }));
  hideBanner();
  applyConsent(prefs);
}

function applyConsent(prefs) {
  // Gate analytics/marketing scripts here
  if (prefs.statistics) {
    // placeholder: loadGoogleAnalytics();
  }
  if (prefs.marketing) {
    // placeholder: loadMetaPixel();
  }
}

function showBanner() {
  if (cookieBanner) cookieBanner.removeAttribute('hidden');
}

function hideBanner() {
  if (cookieBanner) cookieBanner.setAttribute('hidden', '');
}

function openCookieModal() {
  const consent = getConsent();
  if (consent) {
    if (cookieStatistics) cookieStatistics.checked = !!consent.statistics;
    if (cookieMarketing) cookieMarketing.checked = !!consent.marketing;
  }
  cookieModalOverlay?.classList.add('active');
  cookieModalOverlay?.removeAttribute('aria-hidden');
  document.body.classList.add('no-scroll');
  setTimeout(() => cookieModalClose?.focus(), 100);
}

function closeCookieModal() {
  cookieModalOverlay?.classList.remove('active');
  cookieModalOverlay?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}

// Focus trap for modal
cookieModal?.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  const focusable = cookieModal.querySelectorAll('button, input, a, [tabindex]:not([tabindex="-1"])');
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault(); last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault(); first.focus();
  }
});

cookieModalOverlay?.addEventListener('click', (e) => {
  if (e.target === cookieModalOverlay) closeCookieModal();
});

cookieModalClose?.addEventListener('click', closeCookieModal);

cookieAcceptAll?.addEventListener('click', () => {
  saveConsent({ necessary: true, statistics: true, marketing: true });
  hideBanner();
});

cookieNecessaryOnly?.addEventListener('click', () => {
  saveConsent({ necessary: true, statistics: false, marketing: false });
});

cookieSettingsBtn?.addEventListener('click', () => {
  hideBanner();
  openCookieModal();
});

cookieSavePrefs?.addEventListener('click', () => {
  saveConsent({
    necessary: true,
    statistics: cookieStatistics?.checked ?? false,
    marketing: cookieMarketing?.checked ?? false,
  });
  closeCookieModal();
});

cookieAcceptAllModal?.addEventListener('click', () => {
  if (cookieStatistics) cookieStatistics.checked = true;
  if (cookieMarketing) cookieMarketing.checked = true;
  saveConsent({ necessary: true, statistics: true, marketing: true });
  closeCookieModal();
});

footerCookieBtn?.addEventListener('click', openCookieModal);

// Show banner if no consent stored
(function initConsent() {
  const consent = getConsent();
  if (!consent) {
    setTimeout(showBanner, 1200);
  } else {
    applyConsent(consent);
  }
})();

// ── Footer year ──────────────────────────────────────────
const yearEl = document.getElementById('footerYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Smooth scroll for anchor links ──────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').replace('#', '');
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = siteHeader ? siteHeader.offsetHeight : 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Scroll listener (combined) ───────────────────────────
function onScroll() {
  updateScrollProgress();
  updateNav();
  updateActiveLink();
  tryAnimateStats();
  tryAnimateProcess();
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', updateHeroHeight, { passive: true });

// ── Gallery Preview Lightbox ──────────────────────────────
const previewTriggers   = document.querySelectorAll('.gallery-preview-trigger');
const previewLightbox   = document.getElementById('previewLightbox');
const previewLbImg      = document.getElementById('previewLightboxImg');
const previewLbCaption  = document.getElementById('previewLightboxCaption');
const previewLbCounter  = document.getElementById('previewLightboxCounter');
const previewLbClose    = document.getElementById('previewLightboxClose');
const previewLbPrev     = document.getElementById('previewLightboxPrev');
const previewLbNext     = document.getElementById('previewLightboxNext');
const previewLbBackdrop = document.getElementById('previewLightboxBackdrop');

const previewImages = Array.from(previewTriggers).map(t => ({
  src: t.dataset.src,
  caption: t.dataset.caption,
  alt: t.querySelector('img')?.alt || '',
}));

let previewCurrentIdx = 0;

function openPreviewLightbox(index) {
  previewCurrentIdx = index;
  showPreviewSlide(index);
  previewLightbox?.classList.add('open');
  previewLightbox?.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  setTimeout(() => previewLbClose?.focus(), 50);
}

function closePreviewLightbox() {
  previewLightbox?.classList.remove('open');
  previewLightbox?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}

function showPreviewSlide(index) {
  const item = previewImages[index];
  if (!item || !previewLbImg) return;
  previewLbImg.style.opacity = '0';
  previewLbImg.src = item.src;
  previewLbImg.alt = item.alt;
  previewLbImg.onload = () => { previewLbImg.style.opacity = '1'; };
  if (previewLbCaption) previewLbCaption.textContent = item.caption || '';
  if (previewLbCounter) previewLbCounter.textContent = `${index + 1} / ${previewImages.length}`;
}

function prevPreview() {
  previewCurrentIdx = (previewCurrentIdx - 1 + previewImages.length) % previewImages.length;
  showPreviewSlide(previewCurrentIdx);
}

function nextPreview() {
  previewCurrentIdx = (previewCurrentIdx + 1) % previewImages.length;
  showPreviewSlide(previewCurrentIdx);
}

previewTriggers.forEach((btn, i) => {
  btn.addEventListener('click', () => openPreviewLightbox(i));
});

previewLbClose?.addEventListener('click', closePreviewLightbox);
previewLbPrev?.addEventListener('click', prevPreview);
previewLbNext?.addEventListener('click', nextPreview);
previewLbBackdrop?.addEventListener('click', closePreviewLightbox);

document.addEventListener('keydown', (e) => {
  if (!previewLightbox?.classList.contains('open')) return;
  if (e.key === 'ArrowLeft')  { e.preventDefault(); prevPreview(); }
  if (e.key === 'ArrowRight') { e.preventDefault(); nextPreview(); }
  if (e.key === 'Escape')     { closePreviewLightbox(); }
});

// Initial calls
updateHeroHeight();
updateNav();
updateScrollProgress();
