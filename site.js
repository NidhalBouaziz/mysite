// Shared site JS: header hide on scroll, mobile nav toggle, accessibility helpers
(function(){
  // Header hide on scroll
  let lastScrollY = window.scrollY;
  const header = document.querySelector('header.glass-header');
  window.addEventListener('scroll', function() {
    if (!header) return;
    if (window.scrollY > lastScrollY && window.scrollY > 60) {
      header.classList.add('hide-on-scroll');
    } else {
      header.classList.remove('hide-on-scroll');
    }
    lastScrollY = window.scrollY;
  });

  // Mobile nav toggle
  const hamburger = document.createElement('button');
  hamburger.className = 'hamburger';
  hamburger.setAttribute('aria-label','Ouvrir le menu');
  hamburger.setAttribute('aria-expanded','false');
  hamburger.innerHTML = '<span></span><span></span><span></span>';
  document.body.appendChild(hamburger);

  const nav = document.querySelector('header.glass-header nav');
  hamburger.addEventListener('click', function(){
    if (!nav) return;
    const open = nav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Close nav when link clicked (mobile)
  if (nav) {
    nav.addEventListener('click', function(e){
      if (e.target.tagName === 'A' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        hamburger.setAttribute('aria-expanded','false');
      }
    });
  }

  // Keyboard: close mobile nav with Escape
  window.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && nav && nav.classList.contains('open')) {
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded','false');
      hamburger.focus();
    }
  });
})();

// Register service worker if supported
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(reg) {
      // registration successful
    }).catch(function(err) {
      // registration failed
      console.warn('SW registration failed:', err);
    });
  });
}

// Experience page: Voir plus toggle logic
document.addEventListener('DOMContentLoaded', function() {
  for (let i = 1; i <= 4; i++) {
    const btn = document.getElementById('voirPlusBtn' + (i === 1 ? '' : i));
    const list = document.getElementById('experienceList' + (i === 1 ? '' : i));
    if (btn && list) {
      btn.addEventListener('click', function() {
        const isHidden = list.style.display === 'none' || list.style.display === '';
        list.style.display = isHidden ? 'block' : 'none';
        btn.textContent = isHidden ? 'Voir moins' : 'Voir plus';
      });
    }
  }
});
