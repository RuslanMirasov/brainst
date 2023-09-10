import Inputmask from 'inputmask';
const phones = document.querySelectorAll('input[type="tel"]');
const phoneMask = new Inputmask('+38 (999) 999-99-99');
phones.forEach(phone => {
  phoneMask.mask(phone);
});
