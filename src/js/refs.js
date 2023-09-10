export const refs = {
  body: document.querySelector('.body'),
  main: document.querySelector('.main'),
  header: document.querySelector('.header'),
  dataBase: 'https://tasty-treats-backend.p.goit.global/api',

  //menu
  burger: document.querySelector('.burger'),
  menuBackdrop: document.querySelector('.menu-backdrop'),
  menuArrowMarkup: `<div class="menuArrow"><svg class="menuList__arrow" viewBox="0 0 16 16"><polygon points="3.81 4.38 8 8.57 12.19 4.38 13.71 5.91 8 11.62 2.29 5.91 3.81 4.38"/></svg></div>`,
  navigationLinks: document.querySelectorAll('.menu__list li'),
  switcher: document.querySelectorAll('.theme-switcher'),
  menuLinks: document.querySelectorAll('.menu__list li a'),
  currentPath: window.location.pathname,

  //popups
  openPopupButtons: document.querySelectorAll('[data-popup]'),
  allCustomPopups: document.querySelectorAll('.custom-popup'),
  fixedElements: [].filter.call(document.all, e => getComputedStyle(e).position == 'fixed'),

  //forms
  inputs: document.querySelectorAll('.input'),
  requestForm: document.querySelectorAll('.form--request'),
  addErrorText: true,

  //scroll to block
  scrollLinks: document.querySelectorAll('[data-scrollto]'),
  amimateElements: document.querySelectorAll('[data-animation]'),
};
