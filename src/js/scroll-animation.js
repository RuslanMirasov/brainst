import { refs } from './refs';
import throttle from 'lodash.throttle';

window.addEventListener('scroll', throttle(animate, 150));
window.addEventListener('resize', throttle(animate, 150));

export function animate() {
  if (window.scrollY > 0) {
    refs.header.classList.add('fix');
  } else {
    refs.header.classList.remove('fix');
  }
  refs.amimateElements.forEach(element => {
    const windowHeight = window.innerHeight;
    const animationRepeat = element.dataset.repeat;
    const animationDelay = element.dataset.delay;
    const elementScrolltop = element.getBoundingClientRect().top;
    const elementScrollbottom = elementScrolltop + element.offsetHeight;
    let delay = 0;
    if (animationDelay) {
      delay = animationDelay;
    }
    if (elementScrollbottom > 0 && elementScrolltop < windowHeight) {
      setTimeout(function () {
        element.classList.add('animate');
      }, delay);
    } else {
      if (animationRepeat) {
        element.classList.remove('animate');
      }
    }
  });
}
