/* Delegated once: survives Shopify section reloads without duplicated handlers. */
(() => {
  if (window.pawmedalInitialized) return;
  window.pawmedalInitialized = true;
  document.addEventListener('click', (event) => {
    const swatch = event.target.closest('[data-pawmedal-design]');
    if (swatch) {
      const studio = swatch.closest('.pawmedal');
      const preview = studio.querySelector('.pawmedal-design-preview');
      if (!preview) return;
      preview.removeAttribute('srcset');
      preview.src = swatch.dataset.pawmedalDesign;
      preview.alt = `${swatch.dataset.pawmedalLabel} — supplied Max artwork sample`;
      studio.querySelectorAll('[data-pawmedal-design]').forEach(button => button.setAttribute('aria-pressed', String(button === swatch)));
      studio.querySelector('[data-pawmedal-caption]').textContent = `${swatch.dataset.pawmedalLabel} · supplied Max sample`;
    }
    const opener = event.target.closest('[data-pawmedal-video-open]');
    if (opener) opener.closest('.pawmedal').querySelector('[data-pawmedal-video]').showModal();
    const close = event.target.closest('[data-pawmedal-video-close]');
    if (close) close.closest('dialog').close();
    const toggle = event.target.closest('[data-pawmedal-menu]');
    if (toggle) {
      const nav = document.getElementById(toggle.getAttribute('aria-controls'));
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      nav.dataset.open = String(open);
    }
    if (event.target.closest('.pawmedal-review-nav a')) closeMenu(false);
  });
  function closeMenu(focus) {
    const toggle = document.querySelector('[data-pawmedal-menu]');
    if (!toggle || toggle.getAttribute('aria-expanded') !== 'true') return;
    toggle.setAttribute('aria-expanded', 'false');
    document.getElementById(toggle.getAttribute('aria-controls')).dataset.open = 'false';
    if (focus) toggle.focus();
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(true); });
  document.addEventListener('close', e => {
    if (!e.target.matches('[data-pawmedal-video]')) return;
    e.target.querySelectorAll('video').forEach(video => video.pause());
    e.target.closest('.pawmedal').querySelector('[data-pawmedal-video-open]')?.focus();
  }, true);
  document.addEventListener('shopify:section:unload', e => e.target.querySelectorAll('video').forEach(video => video.pause()));
})();
