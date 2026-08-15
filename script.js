/* =========================================================
   BAILYNBNB — shared behavior
   ========================================================= */

/* ---------- Accordion ---------- */
document.addEventListener('click', function (e) {
  const trigger = e.target.closest('.accordion-trigger');
  if (!trigger) return;
  const item = trigger.closest('.accordion-item');
  const panel = item.querySelector('.accordion-panel');
  const isOpen = item.classList.contains('open');

  // close siblings in the same group
  const group = item.closest('.accordion-group');
  if (group) {
    group.querySelectorAll('.accordion-item.open').forEach(function (other) {
      if (other !== item) {
        other.classList.remove('open');
        other.querySelector('.accordion-panel').style.maxHeight = null;
      }
    });
  }

  if (isOpen) {
    item.classList.remove('open');
    panel.style.maxHeight = null;
  } else {
    item.classList.add('open');
    panel.style.maxHeight = panel.scrollHeight + 'px';
  }
});

/* ---------- Image fallback (shows a placeholder if a photo file is missing) ---------- */
function attachImageFallback(root) {
  (root || document).querySelectorAll('img[data-fallback]').forEach(function (img) {
    img.addEventListener('error', function () {
      if (img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = '1';
      const wrap = document.createElement('div');
      wrap.className = 'img-fallback';
      wrap.style.width = '100%';
      wrap.style.height = '100%';
      wrap.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-4 4-3-3-4 4"/></svg><span>Photo coming soon</span>';
      img.replaceWith(wrap);
    }, { once: true });
  });
}
attachImageFallback(document);

/* ---------- Gallery + Lightbox ----------
   Usage on a property page:
     initGallery('westParkImages', westParkImages)
   `images` is an array of filenames (strings), all sitting in the
   same folder as the HTML file. Add more by adding lines to that array.
------------------------------------------------------------------ */
function initGallery(images, altPrefix) {
  const lightbox = document.getElementById('lightbox');
  const stageImg = document.getElementById('lightbox-img');
  const countEl = document.getElementById('lightbox-count');
  const thumbsEl = document.getElementById('lightbox-thumbs');
  if (!lightbox || !images || !images.length) return;

  let current = 0;

  function renderThumbs() {
    thumbsEl.innerHTML = '';
    images.forEach(function (src, i) {
      const t = document.createElement('img');
      t.src = src;
      t.alt = altPrefix + ' photo ' + (i + 1);
      t.dataset.fallback = '1';
      if (i === current) t.classList.add('active');
      t.addEventListener('click', function () { show(i); });
      thumbsEl.appendChild(t);
    });
    attachImageFallback(thumbsEl);
  }

  function show(i) {
    current = (i + images.length) % images.length;
    stageImg.src = images[current];
    stageImg.alt = altPrefix + ' photo ' + (current + 1);
    countEl.textContent = (current + 1) + ' / ' + images.length;
    thumbsEl.querySelectorAll('img').forEach(function (t, idx) {
      t.classList.toggle('active', idx === current);
    });
  }

  function open(i) {
    renderThumbs();
    show(i || 0);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-open-gallery]').forEach(function (el) {
    el.addEventListener('click', function () {
      const idx = parseInt(el.dataset.openGallery, 10) || 0;
      open(idx);
    });
  });

  document.getElementById('lightbox-close').addEventListener('click', close);
  document.getElementById('lightbox-prev').addEventListener('click', function () { show(current - 1); });
  document.getElementById('lightbox-next').addEventListener('click', function () { show(current + 1); });
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft') show(current - 1);
  });

  // build the below-the-fold thumbnail strip too
  const stripEl = document.getElementById('thumb-strip');
  if (stripEl) {
    images.forEach(function (src, i) {
      const t = document.createElement('img');
      t.src = src;
      t.alt = altPrefix + ' photo ' + (i + 1);
      t.dataset.fallback = '1';
      t.addEventListener('click', function () { open(i); });
      stripEl.appendChild(t);
    });
    attachImageFallback(stripEl);
  }
}

/* ---------- Calendar ----------
   blockedDates: array of 'YYYY-MM-DD' strings that are NOT available.
   Renders `monthsAhead` months starting from the current month.
   Edit the blockedDates array on each property page to keep this current.
------------------------------------------------------------------ */
function renderCalendar(containerId, blockedDates, monthsAhead) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const blocked = new Set(blockedDates || []);
  const dowNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const today = new Date();
  container.innerHTML = '';

  for (let m = 0; m < (monthsAhead || 2); m++) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() + m, 1);
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const box = document.createElement('div');
    box.className = 'cal-month';
    const h4 = document.createElement('h4');
    h4.textContent = monthNames[month] + ' ' + year;
    box.appendChild(h4);

    const grid = document.createElement('div');
    grid.className = 'cal-grid';
    dowNames.forEach(function (d) {
      const el = document.createElement('div');
      el.className = 'dow';
      el.textContent = d;
      grid.appendChild(el);
    });
    for (let i = 0; i < firstDow; i++) {
      const el = document.createElement('div');
      el.className = 'day empty';
      grid.appendChild(el);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const el = document.createElement('div');
      const iso = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
      const isBlocked = blocked.has(iso);
      el.className = 'day ' + (isBlocked ? 'blocked' : 'open');
      el.textContent = d;
      grid.appendChild(el);
    }
    box.appendChild(grid);
    container.appendChild(box);
  }
}

/* ---------- Booking sidebar tabs (Request to Book / Pay Deposit) ---------- */
document.addEventListener('click', function (e) {
  const tab = e.target.closest('[data-booking-tab]');
  if (!tab) return;
  const tabs = tab.parentElement;
  tabs.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
  tab.classList.add('active');
  const panelGroup = tabs.parentElement;
  panelGroup.querySelectorAll('.booking-panel').forEach(function (p) {
    p.classList.toggle('active', p.dataset.panel === tab.dataset.bookingTab);
  });
});

/* ---------- Inquiry form status message (FormSubmit posts, then redirects;
   this just gives instant feedback before the redirect happens) ---------- */
document.addEventListener('submit', function (e) {
  const form = e.target.closest('form[data-inquiry-form]');
  if (!form) return;
  const status = form.querySelector('.form-status');
  if (status) {
    status.textContent = 'Sending your request to Bailyn…';
    status.classList.add('show');
  }
});

/* ---------- Stripe payment link button ----------
   Set the STRIPE_PAYMENT_LINK constant on each property page.
   If it hasn't been set yet, the button explains what to do instead
   of leading the guest to a dead link.
------------------------------------------------------------------ */
function wireStripeButton(buttonId, stripeLink) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;
  if (!stripeLink || stripeLink.indexOf('PASTE_YOUR') !== -1) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      alert('Online payment isn\'t turned on yet. Use "Request to Book" below and Bailyn will confirm your reservation and send a secure payment link.');
    });
  } else {
    btn.href = stripeLink;
    btn.target = '_blank';
    btn.rel = 'noopener';
  }
}
