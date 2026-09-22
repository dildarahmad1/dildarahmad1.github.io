const menu = document.querySelector('#mobile-navigation');
const toggle = document.querySelector('.menu-toggle');
const closeButton = menu.querySelector('.menu-close');
const desktop = window.matchMedia('(min-width: 801px)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let closing = false;
let closeTimer;
function closeMenu(afterClose) {
  if (!menu.open || closing) return;
  closing = true;
  menu.classList.remove('is-open');
  closeTimer = window.setTimeout(() => {
    menu.close();
    closing = false;
    if (afterClose) afterClose();
  }, reducedMotion.matches ? 0 : 460);
}
menu.addEventListener('close', () => {
  clearTimeout(closeTimer);
  closing = false;
  menu.classList.remove('is-open');
  document.documentElement.classList.remove('menu-is-open');
  toggle.setAttribute('aria-expanded', 'false');
});
toggle.addEventListener('click', () => {
  if (menu.open || desktop.matches) return;
  menu.showModal();
  toggle.setAttribute('aria-expanded', 'true');
  document.documentElement.classList.add('menu-is-open');
  closeButton.focus();
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (menu.open && !closing) menu.classList.add('is-open');
  }));
});
closeButton.addEventListener('click', () => closeMenu());
menu.addEventListener('cancel', event => { event.preventDefault(); closeMenu(); });
menu.addEventListener('click', event => {
  if (event.target !== menu) return;
  const box = menu.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeMenu();
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', event => {
  const href = link.getAttribute('href');
  if (!href.startsWith('#')) { closeMenu(); return; }
  event.preventDefault();
  closeMenu(() => {
    const section = document.querySelector(href);
    section.setAttribute('tabindex', '-1');
    section.focus({ preventScroll: true });
    section.addEventListener('blur', () => section.removeAttribute('tabindex'), { once:true });
    history.pushState(null, '', href);
    section.scrollIntoView({ behavior:reducedMotion.matches ? 'instant' : 'smooth' });
  });
}));
desktop.addEventListener('change', event => {
  if (event.matches && menu.open) {
    menu.close();
    document.querySelector('.nav .mark').focus();
  }
});
