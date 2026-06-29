/* Gallery page: filter tabs + lightbox */

// ── Filter ───────────────────────────────────────────────
const filterBtns  = document.querySelectorAll('.filter-btn');
const galleryGrid = document.getElementById('galleryGrid');
const galleryEmpty = document.getElementById('galleryEmpty');

function filterGallery(category) {
  const items = galleryGrid?.querySelectorAll('.masonry-item');
  if (!items) return;

  let visible = 0;
  items.forEach(item => {
    const match = category === 'all' || item.dataset.category === category;
    item.style.display = match ? '' : 'none';
    if (match) visible++;
  });

  if (galleryEmpty) {
    if (visible === 0) galleryEmpty.removeAttribute('hidden');
    else galleryEmpty.setAttribute('hidden', '');
  }
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    filterGallery(btn.dataset.filter);
  });
});

// ── Lightbox ─────────────────────────────────────────────
const lightbox        = document.getElementById('lightbox');
const lightboxBackdrop= document.getElementById('lightboxBackdrop');
const lightboxClose   = document.getElementById('lightboxClose');
const lightboxPrev    = document.getElementById('lightboxPrev');
const lightboxNext    = document.getElementById('lightboxNext');
const lightboxImg     = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxCounter = document.getElementById('lightboxCounter');

let currentIndex = 0;
let triggers = [];

function getVisibleTriggers() {
  return Array.from(document.querySelectorAll('.masonry-item:not([style*="display: none"]) .gallery-trigger'));
}

function openLightbox(index) {
  triggers = getVisibleTriggers();
  currentIndex = Math.max(0, Math.min(index, triggers.length - 1));
  showSlide(currentIndex);
  lightbox?.classList.add('open');
  lightbox?.removeAttribute('aria-hidden');
  document.body.classList.add('no-scroll');
  lightboxClose?.focus();
}

function closeLightbox() {
  lightbox?.classList.remove('open');
  lightbox?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  triggers[currentIndex]?.focus();
}

function showSlide(index) {
  const trigger = triggers[index];
  if (!trigger) return;
  const src     = trigger.dataset.src;
  const caption = trigger.dataset.caption || '';

  if (lightboxImg) {
    lightboxImg.style.opacity = '0';
    lightboxImg.src = src;
    lightboxImg.alt = caption;
    lightboxImg.onload = () => { lightboxImg.style.opacity = '1'; };
  }

  if (lightboxCaption) lightboxCaption.textContent = caption;
  if (lightboxCounter) lightboxCounter.textContent = `${index + 1} / ${triggers.length}`;
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + triggers.length) % triggers.length;
  showSlide(currentIndex);
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % triggers.length;
  showSlide(currentIndex);
}

// Attach trigger listeners
document.querySelectorAll('.gallery-trigger').forEach((btn, i) => {
  btn.addEventListener('click', () => {
    triggers = getVisibleTriggers();
    const visibleIndex = triggers.indexOf(btn);
    openLightbox(visibleIndex >= 0 ? visibleIndex : 0);
  });
});

lightboxClose?.addEventListener('click', closeLightbox);
lightboxBackdrop?.addEventListener('click', closeLightbox);
lightboxPrev?.addEventListener('click', prevSlide);
lightboxNext?.addEventListener('click', nextSlide);

document.addEventListener('keydown', (e) => {
  if (!lightbox?.classList.contains('open')) return;
  if (e.key === 'Escape')    closeLightbox();
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight')nextSlide();
});

// Touch/swipe support
let touchStartX = 0;
lightbox?.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
lightbox?.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) dx < 0 ? nextSlide() : prevSlide();
}, { passive: true });

// Focus trap
lightbox?.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab' || !lightbox.classList.contains('open')) return;
  const focusable = lightbox.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
