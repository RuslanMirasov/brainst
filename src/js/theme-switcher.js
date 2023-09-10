import { refs } from '../js/refs';

console.log(refs.switcher.length);

if (refs.switcher.length > 0) {
  swicherDefaultPosition();
  refs.switcher.forEach(switcherBtn => {
    switcherBtn.addEventListener('click', swicherChange);
  });
}

function swicherDefaultPosition() {
  if (localStorage.theme === 'dark') {
    refs.body.classList.add('dark');
    themeSwitcherOn();
  }
}

function swicherChange() {
  if (!refs.body.classList.contains('dark')) {
    refs.body.classList.add('dark');
    localStorage.theme = 'dark';
    themeSwitcherOn();
    return;
  }
  refs.body.classList.remove('dark');
  localStorage.theme = 'light';
  themeSwitcherOff();
}

function themeSwitcherOn() {
  refs.switcher.forEach(switcherBtn => {
    switcherBtn.classList.add('active');
  });
}

function themeSwitcherOff() {
  refs.switcher.forEach(switcherBtn => {
    switcherBtn.classList.remove('active');
  });
}
