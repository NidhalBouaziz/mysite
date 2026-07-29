/* =====================================================================
   Nidhal Bouaziz — Portfolio interactions
   ===================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js-enabled');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme ---------- */
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#eef3fb' : '#060915');
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
      btn.setAttribute('aria-label', theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair');
    });
  }
  function initTheme() {
    var saved;
    try { saved = localStorage.getItem('theme'); } catch (e) {}
    applyTheme(saved || root.getAttribute('data-theme') || 'dark');
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
      });
    });
  }

  /* ---------- Animated background ---------- */
  function initBackground() {
    if (document.querySelector('.bg-layer')) return;
    var layer = document.createElement('div');
    layer.className = 'bg-layer';
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML =
      '<div class="aurora aurora-1"></div>' +
      '<div class="aurora aurora-2"></div>' +
      '<div class="aurora aurora-3"></div>' +
      '<canvas class="constellation"></canvas>';
    document.body.appendChild(layer);

    var grid = document.createElement('div');
    grid.className = 'bg-grid';
    grid.setAttribute('aria-hidden', 'true');
    document.body.appendChild(grid);

    if (!reduceMotion) initConstellation(layer.querySelector('.constellation'));
  }

  function initConstellation(canvas) {
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, particles = [], raf = null, running = true;
    var mouse = { x: -9999, y: -9999 };

    function color() {
      return root.getAttribute('data-theme') === 'light'
        ? { dot: 'rgba(37,99,235,', line: 'rgba(37,99,235,' }
        : { dot: 'rgba(120,190,255,', line: 'rgba(120,190,255,' };
    }

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var target = Math.min(90, Math.floor((w * h) / 16000));
      particles = [];
      for (var i = 0; i < target; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.6 + 0.6
        });
      }
    }

    function step() {
      if (!running) return;
      var c = color();
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        var dxm = p.x - mouse.x, dym = p.y - mouse.y;
        var dm = dxm * dxm + dym * dym;
        if (dm < 14000) {
          var f = (14000 - dm) / 14000 * 0.04;
          p.x += dxm * f; p.y += dym * f;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = c.dot + '0.7)';
        ctx.fill();

        for (var j = i + 1; j < particles.length; j++) {
          var q = particles[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var d = dx * dx + dy * dy;
          if (d < 16000) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = c.line + (0.16 * (1 - d / 16000)).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(step);
    }

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    }, { passive: true });

    window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    window.addEventListener('mouseout', function () { mouse.x = -9999; mouse.y = -9999; }, { passive: true });

    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
      if (running && !raf) step();
      else if (!running && raf) { cancelAnimationFrame(raf); raf = null; }
    });

    resize();
    step();
  }

  /* ---------- Header scroll + progress ---------- */
  function initHeaderScroll() {
    var header = document.querySelector('header.glass-header');
    var progress = document.createElement('div');
    progress.className = 'scroll-progress';
    document.body.appendChild(progress);

    var lastY = window.scrollY, ticking = false;
    function onScroll() {
      var y = window.scrollY;
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';

      if (header && !header.classList.contains('menu-open')) {
        if (y > lastY && y > 120) header.classList.add('hide-on-scroll');
        else header.classList.remove('hide-on-scroll');
      }
      lastY = y;
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  function initMobileMenu() {
    var header = document.querySelector('header.glass-header');
    var nav = header ? header.querySelector('nav') : null;
    var hamburger = header ? header.querySelector('.hamburger') : null;
    if (!header || !nav || !hamburger) return;

    if (!nav.id) nav.id = 'primary-nav';
    hamburger.setAttribute('aria-controls', nav.id);
    hamburger.setAttribute('aria-expanded', 'false');

    function setMenu(open) {
      nav.classList.toggle('open', open);
      header.classList.toggle('menu-open', open);
      document.body.classList.toggle('menu-open', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      hamburger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      if (!open) header.classList.remove('hide-on-scroll');
    }
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      setMenu(!nav.classList.contains('open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') && nav.classList.contains('open')) setMenu(false);
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !header.contains(e.target)) setMenu(false);
    });
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); hamburger.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 720 && nav.classList.contains('open')) setMenu(false);
    }, { passive: true });
  }

  /* ---------- Scroll reveal + counters + language bars ---------- */
  function initReveal() {
    var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
    var bars = Array.prototype.slice.call(document.querySelectorAll('.lang-fill[data-level]'));

    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
      counters.forEach(function (el) { renderStat(el, el.getAttribute('data-count'), el.getAttribute('data-suffix') || ''); });
      bars.forEach(function (el) { el.style.width = el.getAttribute('data-level') + '%'; });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-visible');
        if (el.hasAttribute('data-count')) runCounter(el);
        if (el.classList.contains('lang-fill')) el.style.width = el.getAttribute('data-level') + '%';
        io.unobserve(el);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
    counters.forEach(function (el) { el.textContent = '0'; io.observe(el); });
    bars.forEach(function (el) { io.observe(el); });
  }

  function renderStat(el, numStr, suffix) {
    el.innerHTML = numStr + (suffix ? '<span class="suffix">' + suffix + '</span>' : '');
  }

  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) { renderStat(el, String(target), suffix); return; }
    var dur = 1400, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      renderStat(el, String(target % 1 === 0 ? Math.round(val) : val.toFixed(1)), suffix);
      if (p < 1) requestAnimationFrame(tick);
      else renderStat(el, String(target), suffix);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Rotating roles (typing) ---------- */
  function initRoles() {
    var el = document.getElementById('roles');
    if (!el) return;
    var roles;
    try { roles = JSON.parse(el.getAttribute('data-roles')); } catch (e) { roles = []; }
    if (!roles.length) return;

    var span = document.createElement('span');
    span.className = 'role';
    var cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.textContent = '|';
    el.textContent = '';
    el.appendChild(span);
    el.appendChild(cursor);

    if (reduceMotion) { span.textContent = roles[0]; return; }

    var i = 0, ch = 0, deleting = false;
    function loop() {
      var word = roles[i];
      span.textContent = word.substring(0, ch);
      if (!deleting && ch < word.length) { ch++; setTimeout(loop, 65); }
      else if (!deleting && ch === word.length) { deleting = true; setTimeout(loop, 1500); }
      else if (deleting && ch > 0) { ch--; setTimeout(loop, 32); }
      else { deleting = false; i = (i + 1) % roles.length; setTimeout(loop, 300); }
    }
    loop();
  }

  /* ---------- "Voir plus" toggles (experience + project) ---------- */
  function initToggles() {
    document.querySelectorAll('[data-toggle]').forEach(function (button) {
      var target = document.getElementById(button.getAttribute('data-toggle'));
      if (!target) return;
      target.hidden = true;
      target.style.display = 'none';
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', target.id);
      var more = button.getAttribute('data-label-more') || 'Voir plus';
      var less = button.getAttribute('data-label-less') || 'Voir moins';
      button.addEventListener('click', function () {
        var expand = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', expand ? 'true' : 'false');
        button.textContent = expand ? less : more;
        target.hidden = !expand;
        target.style.display = expand ? '' : 'none';
      });
    });
  }

  /* ---------- Events carousel ---------- */
  function initCarousel() {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.event-card-carousel'));
    var prev = document.getElementById('prevEvent');
    var next = document.getElementById('nextEvent');
    var carousel = document.querySelector('.events-carousel');
    var dotsWrap = document.querySelector('.event-dots');
    if (!cards.length || !prev || !next || !carousel) return;

    var index = 0, startX = null;
    prev.setAttribute('aria-label', 'Événement précédent');
    next.setAttribute('aria-label', 'Événement suivant');

    var dots = [];
    if (dotsWrap) {
      cards.forEach(function (_, k) {
        var d = document.createElement('button');
        d.type = 'button';
        d.setAttribute('aria-label', 'Aller à l\'événement ' + (k + 1));
        d.addEventListener('click', function () { show(k); });
        dotsWrap.appendChild(d);
        dots.push(d);
      });
    }

    function show(n) {
      index = (n + cards.length) % cards.length;
      cards.forEach(function (card, k) {
        var active = k === index;
        card.style.display = active ? '' : 'none';
        card.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
      dots.forEach(function (d, k) { d.classList.toggle('active', k === index); });
    }
    prev.addEventListener('click', function () { show(index - 1); });
    next.addEventListener('click', function () { show(index + 1); });
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(index - 1);
      else if (e.key === 'ArrowRight') show(index + 1);
    });
    carousel.addEventListener('touchstart', function (e) { startX = e.changedTouches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) show(dx < 0 ? index + 1 : index - 1);
      startX = null;
    }, { passive: true });
    show(0);
  }

  /* ---------- Project filters ---------- */
  function initFilters() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('.filter-btn'));
    var tiles = Array.prototype.slice.call(document.querySelectorAll('.project-tile[data-cat]'));
    if (!buttons.length || !tiles.length) return;
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        var f = btn.getAttribute('data-filter');
        tiles.forEach(function (t) {
          var show = f === 'all' || (t.getAttribute('data-cat') || '').split(' ').indexOf(f) !== -1;
          t.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Project tile pointer glow ---------- */
  function initTileGlow() {
    if (reduceMotion || window.matchMedia('(hover: none)').matches) return;
    document.querySelectorAll('.project-tile').forEach(function (tile) {
      tile.addEventListener('mousemove', function (e) {
        var r = tile.getBoundingClientRect();
        tile.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        tile.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- Back to top ---------- */
  function initToTop() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'to-top';
    btn.setAttribute('aria-label', 'Remonter en haut');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(btn);
    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });
    window.addEventListener('scroll', function () {
      btn.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
  }

  /* ---------- Certificate lightbox ---------- */
  function initLightbox() {
    var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
    if (!triggers.length) return;

    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Aperçu du certificat');
    box.innerHTML =
      '<button class="lightbox-close" type="button" aria-label="Fermer">&times;</button>' +
      '<img alt="">' +
      '<span class="lightbox-hint">Cliquez à l\'extérieur ou appuyez sur Échap pour fermer</span>';
    document.body.appendChild(box);

    var img = box.querySelector('img');
    var closeBtn = box.querySelector('.lightbox-close');
    var lastFocus = null;

    function open(src, alt) {
      img.src = src;
      img.alt = alt || 'Certificat';
      box.classList.add('open');
      lastFocus = document.activeElement;
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }
    function close() {
      box.classList.remove('open');
      document.body.style.overflow = '';
      img.src = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    triggers.forEach(function (t) {
      t.addEventListener('click', function () {
        var inner = t.querySelector('img');
        open(t.getAttribute('data-lightbox'), inner ? inner.alt : t.getAttribute('aria-label'));
      });
    });
    closeBtn.addEventListener('click', close);
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && box.classList.contains('open')) close();
    });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    initTheme();
    initBackground();
    initHeaderScroll();
    initMobileMenu();
    initReveal();
    initRoles();
    initToggles();
    initCarousel();
    initFilters();
    initTileGlow();
    initLightbox();
    initToTop();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* ---------- Service worker ---------- */
  if ('serviceWorker' in navigator && window.isSecureContext && /^https?:$/.test(window.location.protocol)) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js').catch(function (err) {
        console.warn('SW registration failed:', err);
      });
    });
  }
})();
