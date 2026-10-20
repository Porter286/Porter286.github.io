// Content stays readable and all section links work without JavaScript.
(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  const links = [...navigation.querySelectorAll('a')];
  const mobile = window.matchMedia('(max-width: 720px)');

  function closeMenu(restoreFocus = false) {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    if (restoreFocus) menuButton.focus();
  }

  function syncMenu() {
    menuButton.hidden = !mobile.matches;
    closeMenu();
  }

  document.documentElement.classList.add('js-ready');
  syncMenu();
  mobile.addEventListener('change', syncMenu);
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(expanded));
    navigation.classList.toggle('is-open', expanded);
  });
  navigation.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    const target = document.querySelector(link.getAttribute('href'));
    closeMenu();
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navigation.classList.contains('is-open')) closeMenu(true);
  });

  function markCurrent(id) {
    links.forEach((link) => {
      if (link.hash === `#${id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  let scheduled = false;
  function updateCurrent() {
    const sections = [...document.querySelectorAll('main > section[id]')];
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 150) current = section;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5) current = sections.at(-1);
    markCurrent(current.id);
    scheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; window.requestAnimationFrame(updateCurrent); }
  }, { passive: true });
  window.addEventListener('resize', updateCurrent);
  updateCurrent();
  document.querySelector('#year').textContent = String(new Date().getFullYear());
})();
