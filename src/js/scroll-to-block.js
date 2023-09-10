import { refs } from '../js/refs';

// const menu = document.querySelector('.menu-backdrop');
// const burger = document.querySelector('.burger');

// SCROLL TO BLOCK
refs.scrollLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    let distance = document.querySelector('.' + this.dataset.scrollto).offsetTop - refs.header.getBoundingClientRect().height;
    window.scrollTo({ top: distance, left: 0, behavior: 'smooth' });
    //  if (refs.body.classList.contains('locked')) {
    //    menu.classList.toggle('is-open');
    //    burger.classList.toggle('is-open');
    //    refs.body.classList.toggle('locked');
    //  }
  });
});
