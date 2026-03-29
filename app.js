/* ═══════════════════════════════════════════════
   Hoblie Link-in-Bio — app.js
═══════════════════════════════════════════════ */

/* ─── 1. Copy discount code ────────────────── */
function copyDiscountCode() {
  const btn = document.getElementById('copy-btn');
  const code = document.getElementById('discount-code').textContent.trim();

  navigator.clipboard.writeText(code).then(function () {
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(function () {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 2000);
  }).catch(function () {
    // Fallback for browsers without clipboard API (older iOS)
    const el = document.createElement('textarea');
    el.value = code;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(function () {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 2000);
  });
}

/* ─── 2. Carousel ──────────────────────────── */
(function () {
  var track = document.getElementById('carousel-track');
  var dots = document.querySelectorAll('#carousel-dots .dot');
  var totalSlides = dots.length;
  var current = 0;
  var touchStartX = 0;
  var touchStartY = 0;
  var isDragging = false;
  var dragStartX = 0;

  function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;
    current = index;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === current);
      dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  }

  // Expose globally for onclick handlers in HTML
  window.goToSlide = goToSlide;

  window.prevSlide = function () { goToSlide(current - 1); };
  window.nextSlide = function () { goToSlide(current + 1); };

  /* Touch swipe */
  track.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    // Only treat as horizontal swipe if horizontal delta dominates
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) {
      if (dx < 0) goToSlide(current + 1);
      else goToSlide(current - 1);
    }
  }, { passive: true });

  /* Mouse drag (desktop) */
  track.addEventListener('mousedown', function (e) {
    isDragging = true;
    dragStartX = e.clientX;
    track.style.transition = 'none';
  });

  document.addEventListener('mouseup', function (e) {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = '';
    var dx = e.clientX - dragStartX;
    if (Math.abs(dx) > 45) {
      if (dx < 0) goToSlide(current + 1);
      else goToSlide(current - 1);
    }
  });

  /* Keyboard navigation when carousel is focused */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') goToSlide(current - 1);
    if (e.key === 'ArrowRight') goToSlide(current + 1);
  });
})();

/* ─── 3. Brand accordion ───────────────────── */
function toggleBrand(btn) {
  var drawerId = btn.getAttribute('aria-controls');
  var drawer = document.getElementById(drawerId);
  var isExpanded = btn.getAttribute('aria-expanded') === 'true';

  // Close all other open drawers first
  document.querySelectorAll('.brand-card[aria-expanded="true"]').forEach(function (otherBtn) {
    if (otherBtn !== btn) {
      var otherId = otherBtn.getAttribute('aria-controls');
      var otherDrawer = document.getElementById(otherId);
      otherBtn.setAttribute('aria-expanded', 'false');
      otherDrawer.classList.remove('expanded');
    }
  });

  // Toggle this one
  btn.setAttribute('aria-expanded', String(!isExpanded));
  drawer.classList.toggle('expanded', !isExpanded);
}

/* ─── 4. Scroll fade-in ────────────────────── */
(function () {
  var elements = document.querySelectorAll('.fade-in');
  if (!('IntersectionObserver' in window)) {
    // Fallback: just show everything immediately
    elements.forEach(function (el) { el.classList.add('visible'); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(function (el) { observer.observe(el); });
})();
