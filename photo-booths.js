/* photo-booths.js – FAQ accordion for photo-booths.html */

const faqItems = document.querySelectorAll('.pb-faq-list .faq-item');

faqItems.forEach(item => {
  const btn = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  if (!btn || !answer) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    faqItems.forEach(other => {
      const otherBtn = other.querySelector('.faq-question');
      const otherAnswer = other.querySelector('.faq-answer');
      if (otherBtn && otherAnswer && other !== item) {
        otherBtn.setAttribute('aria-expanded', 'false');
        otherAnswer.setAttribute('hidden', '');
      }
    });

    if (isOpen) {
      btn.setAttribute('aria-expanded', 'false');
      answer.setAttribute('hidden', '');
    } else {
      btn.setAttribute('aria-expanded', 'true');
      answer.removeAttribute('hidden');
    }
  });
});
