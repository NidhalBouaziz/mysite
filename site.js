// Shared site JS: mobile-first navigation, interactions, and page behavior
(function () {
  document.documentElement.classList.add('js-enabled');

  const header = document.querySelector('header.glass-header');
  const nav = header ? header.querySelector('nav') : null;

  let lastScrollY = window.scrollY;
  let isTicking = false;

  function updateHeaderOnScroll() {
    if (!header || header.classList.contains('menu-open')) {
      return;
    }

    const isScrollingDown = window.scrollY > lastScrollY;
    if (isScrollingDown && window.scrollY > 60) {
      header.classList.add('hide-on-scroll');
    } else {
      header.classList.remove('hide-on-scroll');
    }
    lastScrollY = window.scrollY;
  }

  function initMobileMenu() {
    if (!header || !nav) {
      return;
    }

    if (!nav.id) {
      nav.id = 'primary-nav';
    }

    const hamburger = document.createElement('button');
    hamburger.type = 'button';
    hamburger.className = 'hamburger';
    hamburger.setAttribute('aria-label', 'Ouvrir le menu');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', nav.id);
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    header.appendChild(hamburger);

    function setMenuState(open) {
      nav.classList.toggle('open', open);
      header.classList.toggle('menu-open', open);
      document.body.classList.toggle('menu-open', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      hamburger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      if (!open) {
        header.classList.remove('hide-on-scroll');
      }
    }

    hamburger.addEventListener('click', function (event) {
      event.stopPropagation();
      setMenuState(!nav.classList.contains('open'));
    });

    nav.addEventListener('click', function (event) {
      const link = event.target.closest('a');
      if (link && nav.classList.contains('open')) {
        setMenuState(false);
      }
    });

    document.addEventListener('click', function (event) {
      if (nav.classList.contains('open') && !header.contains(event.target)) {
        setMenuState(false);
      }
    });

    window.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        setMenuState(false);
        hamburger.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 700 && nav.classList.contains('open')) {
        setMenuState(false);
      }
    }, { passive: true });
  }

  if (header) {
    window.addEventListener('scroll', function () {
      if (isTicking) {
        return;
      }
      isTicking = true;
      window.requestAnimationFrame(function () {
        updateHeaderOnScroll();
        isTicking = false;
      });
    }, { passive: true });
  }

  initMobileMenu();
})();

function initExperienceToggles() {
  for (let i = 1; i <= 4; i++) {
    const suffix = i === 1 ? '' : String(i);
    const button = document.getElementById('voirPlusBtn' + suffix);
    const list = document.getElementById('experienceList' + suffix);

    if (!button || !list) {
      continue;
    }

    if (!list.id) {
      list.id = 'experienceList' + suffix;
    }

    list.hidden = true;
    list.style.display = 'none';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', list.id);

    button.addEventListener('click', function () {
      const shouldExpand = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', shouldExpand ? 'true' : 'false');
      button.textContent = shouldExpand ? 'Voir moins' : 'Voir plus';
      list.hidden = !shouldExpand;
      list.style.display = shouldExpand ? 'block' : 'none';
    });
  }
}

function initProjectToggle() {
  const button = document.getElementById('voirPlusProjetBtn');
  const list = document.getElementById('fonctionnalitesProjet');

  if (!button || !list) {
    return;
  }

  if (!list.id) {
    list.id = 'fonctionnalitesProjet';
  }

  list.hidden = true;
  list.style.display = 'none';
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', list.id);

  button.addEventListener('click', function () {
    const shouldExpand = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', shouldExpand ? 'true' : 'false');
    button.textContent = shouldExpand ? 'Voir moins' : 'Voir plus';
    list.hidden = !shouldExpand;
    list.style.display = shouldExpand ? '' : 'none';
  });
}

function initEventsCarousel() {
  const cards = Array.from(document.querySelectorAll('.event-card-carousel'));
  const prevButton = document.getElementById('prevEvent');
  const nextButton = document.getElementById('nextEvent');
  const carousel = document.querySelector('.events-carousel');

  if (!cards.length || !prevButton || !nextButton || !carousel) {
    return;
  }

  let currentIndex = 0;
  let touchStartX = null;

  prevButton.setAttribute('aria-label', 'Événement précédent');
  nextButton.setAttribute('aria-label', 'Événement suivant');

  function showCard(index) {
    cards.forEach(function (card, cardIndex) {
      const isActive = cardIndex === index;
      card.style.display = isActive ? '' : 'none';
      card.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });
  }

  function goNext() {
    currentIndex = (currentIndex + 1) % cards.length;
    showCard(currentIndex);
  }

  function goPrevious() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    showCard(currentIndex);
  }

  prevButton.addEventListener('click', goPrevious);
  nextButton.addEventListener('click', goNext);

  carousel.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') {
      goPrevious();
    } else if (event.key === 'ArrowRight') {
      goNext();
    }
  });

  carousel.addEventListener('touchstart', function (event) {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  carousel.addEventListener('touchend', function (event) {
    if (touchStartX === null) {
      return;
    }

    const touchEndX = event.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    const swipeThreshold = 45;

    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX < 0) {
        goNext();
      } else {
        goPrevious();
      }
    }

    touchStartX = null;
  }, { passive: true });

  showCard(currentIndex);
}

function createFloatingParticles() {
  const main = document.querySelector('main');
  if (!main || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const particleCount = window.matchMedia('(max-width: 700px)').matches ? 1 : 3;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'floating-particle';
    particle.style.width = particle.style.height = (24 + Math.random() * 44) + 'px';
    particle.style.left = (Math.random() * 90) + '%';
    particle.style.top = (Math.random() * 80) + '%';
    particle.style.background = 'radial-gradient(circle, rgba(56, 189, 248, 0.55) 0%, rgba(37, 99, 235, 0) 100%)';
    particle.style.animationDuration = (10 + Math.random() * 7) + 's';
    main.appendChild(particle);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  initExperienceToggles();
  initProjectToggle();
  initEventsCarousel();
  createFloatingParticles();
});

// Register service worker if supported and in a secure context
if ('serviceWorker' in navigator && window.isSecureContext && /^https?:$/.test(window.location.protocol)) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./sw.js').catch(function (error) {
      console.warn('SW registration failed:', error);
    });
  });
}
