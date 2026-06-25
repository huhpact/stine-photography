/* Shared script for sub-pages (gallery.html, kontakt.html, photo-booths.html).
   Handles: nav scroll, mobile drawer, cookie consent,
   back-to-top, scroll progress, footer year, AOS init. */

// ── AOS + hero load ──────────────────────────────────────
window.addEventListener('load', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });
  }
  document.querySelector('.page-hero')?.classList.add('is-loaded');
});

// ── DOM refs ─────────────────────────────────────────────
const scrollProgress   = document.getElementById('scrollProgress');
const siteHeader       = document.getElementById('siteHeader');
const hamburger        = document.getElementById('hamburger');
const navDrawer        = document.getElementById('navDrawer');
const drawerOverlay    = document.getElementById('drawerOverlay');
const drawerClose      = document.getElementById('drawerClose');
const backToTop        = document.getElementById('backToTop');
const footerYear       = document.getElementById('footerYear');

// ── Footer year ──────────────────────────────────────────
if (footerYear) footerYear.textContent = new Date().getFullYear();

// ── Hero detection for transparent nav ───────────────────
const heroEl = document.querySelector('.page-hero, .pb-hero');
const heroHeight = heroEl ? heroEl.offsetHeight : 0;

// ── Scroll progress ──────────────────────────────────────
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollProgress && docHeight > 0) {
    scrollProgress.style.width = (scrollTop / docHeight) * 100 + '%';
  }
}

// ── Nav scroll behavior ──────────────────────────────────
let lastScrollY = 0;

function updateNav() {
  const scrollY = window.scrollY;

  if (heroEl) {
    const inHero = scrollY < heroHeight - 80;
    siteHeader?.classList.toggle('hero-mode', inHero);
    siteHeader?.classList.toggle('scrolled', !inHero || scrollY > 10);
  } else {
    siteHeader?.classList.toggle('scrolled', scrollY > 10);
  }

  if (scrollY > 300) {
    if (scrollY > lastScrollY + 5 && scrollY > 200) {
      siteHeader?.classList.add('hidden');
    } else if (scrollY < lastScrollY - 5) {
      siteHeader?.classList.remove('hidden');
    }
  } else {
    siteHeader?.classList.remove('hidden');
  }

  lastScrollY = scrollY;
  backToTop?.classList.toggle('visible', scrollY > 400);
}

// ── Mobile drawer ────────────────────────────────────────
function openDrawer() {
  navDrawer?.classList.add('open');
  drawerOverlay?.classList.add('active');
  navDrawer?.removeAttribute('aria-hidden');
  drawerOverlay?.removeAttribute('aria-hidden');
  document.body.classList.add('no-scroll');
  hamburger?.setAttribute('aria-expanded', 'true');
  drawerClose?.focus();
}

function closeDrawer() {
  navDrawer?.classList.remove('open');
  drawerOverlay?.classList.remove('active');
  navDrawer?.setAttribute('aria-hidden', 'true');
  drawerOverlay?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  hamburger?.setAttribute('aria-expanded', 'false');
  hamburger?.focus();
}

hamburger?.addEventListener('click', openDrawer);
drawerClose?.addEventListener('click', closeDrawer);
drawerOverlay?.addEventListener('click', closeDrawer);

document.querySelectorAll('.drawer-link').forEach(link => {
  link.addEventListener('click', closeDrawer);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (navDrawer?.classList.contains('open')) closeDrawer();
    if (cookieModalOverlay?.classList.contains('active')) closeCookieModal();
  }
});

navDrawer?.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab' || !navDrawer.classList.contains('open')) return;
  const focusable = navDrawer.querySelectorAll('button, a, input, [tabindex]:not([tabindex="-1"])');
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

// ── Back to top ──────────────────────────────────────────
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Smooth scroll anchor links ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = siteHeader ? siteHeader.offsetHeight : 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Cookie Consent ───────────────────────────────────────
const cookieBanner       = document.getElementById('cookieBanner');
const cookieModalOverlay = document.getElementById('cookieModalOverlay');
const cookieModal        = document.getElementById('cookieModal');
const cookieModalClose   = document.getElementById('cookieModalClose');
const cookieAcceptAll    = document.getElementById('cookieAcceptAll');
const cookieNecessaryOnly= document.getElementById('cookieNecessaryOnly');
const cookieSettingsBtn  = document.getElementById('cookieSettings');
const cookieSavePrefs    = document.getElementById('cookieSavePrefs');
const cookieAcceptAllModal = document.getElementById('cookieAcceptAllModal');
const footerCookieBtn    = document.getElementById('footerCookieBtn');
const cookieStatistics   = document.getElementById('cookieStatistics');
const cookieMarketing    = document.getElementById('cookieMarketing');

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
  if (prefs.statistics) { /* load analytics */ }
  if (prefs.marketing)  { /* load meta pixel */ }
}

function showBanner() { cookieBanner?.removeAttribute('hidden'); }
function hideBanner()  { cookieBanner?.setAttribute('hidden', ''); }

function openCookieModal() {
  const consent = getConsent();
  if (consent) {
    if (cookieStatistics) cookieStatistics.checked = !!consent.statistics;
    if (cookieMarketing)  cookieMarketing.checked  = !!consent.marketing;
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

cookieModal?.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  const focusable = cookieModal.querySelectorAll('button, input, a, [tabindex]:not([tabindex="-1"])');
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

cookieModalOverlay?.addEventListener('click', (e) => {
  if (e.target === cookieModalOverlay) closeCookieModal();
});

cookieModalClose?.addEventListener('click', closeCookieModal);
cookieAcceptAll?.addEventListener('click', () => saveConsent({ necessary: true, statistics: true, marketing: true }));
cookieNecessaryOnly?.addEventListener('click', () => saveConsent({ necessary: true, statistics: false, marketing: false }));
cookieSettingsBtn?.addEventListener('click', () => { hideBanner(); openCookieModal(); });
footerCookieBtn?.addEventListener('click', openCookieModal);

cookieSavePrefs?.addEventListener('click', () => {
  saveConsent({
    necessary: true,
    statistics: cookieStatistics?.checked ?? false,
    marketing:  cookieMarketing?.checked  ?? false,
  });
  closeCookieModal();
});

cookieAcceptAllModal?.addEventListener('click', () => {
  if (cookieStatistics) cookieStatistics.checked = true;
  if (cookieMarketing)  cookieMarketing.checked  = true;
  saveConsent({ necessary: true, statistics: true, marketing: true });
  closeCookieModal();
});

(function initConsent() {
  const consent = getConsent();
  if (!consent) setTimeout(showBanner, 1200);
  else applyConsent(consent);
})();

// ── Combined scroll listener ─────────────────────────────
window.addEventListener('scroll', () => {
  updateScrollProgress();
  updateNav();
}, { passive: true });

updateNav();
updateScrollProgress();
