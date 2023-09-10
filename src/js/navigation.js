import { refs } from '../js/refs';
import { bodyLock, bodyUnlock } from '../js/popup';

markCurrentLink();

function markCurrentLink() {
  if (refs.menuLinks.length > 0 && refs.currentPath !== '/') {
    refs.menuLinks.forEach(link => {
      link.classList.remove('current');
      if (link.getAttribute('href') === refs.currentPath) {
        link.classList.add('current');
      }
    });
  }
}

if (refs.burger) {
  refs.burger.addEventListener('click', menuToggle);
}

refs.navigationLinks.forEach(navItem => {
  if (navItem.querySelector('ul')) {
    navItem.insertAdjacentHTML('beforeend', refs.menuArrowMarkup);
  }
});

refs.menuBackdrop.addEventListener('click', e => {
  if (window.innerWidth < 768) {
    if (e.target.classList.contains('menu-backdrop')) {
      menuToggle();
    }
    if (e.target.classList.contains('menuArrow')) {
      e.target.classList.toggle('is-hovered');
      e.target.closest('li').querySelector('ul').classList.toggle('is-hovered');
      const activeSubmenuChildren = e.target.closest('li').querySelector('ul').querySelectorAll('.is-hovered');
      activeSubmenuChildren.forEach(submenu => {
        submenu.classList.remove('is-hovered');
      });
    }
  }
});

function menuToggle() {
  refs.menuBackdrop.classList.toggle('is-open');
  refs.burger.classList.toggle('is-open');
  if (!refs.body.classList.contains('locked')) {
    bodyLock();
    return;
  }
  setTimeout(bodyUnlock, 700);
}
