import { refs } from '../js/refs';
import throttle from 'lodash.throttle';
import { openPopupById, alertInfo, alertError } from '../js/popup';
// import axios from 'axios';

refs.inputs.forEach(input => {
  input.addEventListener('focus', clearInput);
  input.addEventListener('input', throttle(addResetIcon, 500));
});

if (refs.requestForm.length > 0) {
  refs.requestForm.forEach(form => {
    form.addEventListener('submit', requestSend);
  });
}

async function requestSend(e) {
  e.preventDefault();
  const validator = formValidation(this);
  if (validator === true) {
    openPopupById('loading');
    setTimeout(() => {
      alertInfo('FORM WAS SENT', 'Thank you for your order, <br>our manager will contact you shortly.');
      this.reset();
    }, 500);
  }
}

//form validation
export function formValidation(formId) {
  let checker = true;
  formId.querySelectorAll('[required]').forEach(required => {
    const requiredLabel = required.closest('.label');
    if (required.value.length === 0) {
      addErrorMarkup(requiredLabel, 'The field is empty!');
    } else {
      //Name
      if (required.name == 'name' && /[^A-zА-яЁё\+ ()\-]/.test(required.value)) {
        addErrorMarkup(requiredLabel, 'Name cannot contain digits!');
      }
      //type tel
      if (required.type == 'tel' && /[^0-9\+ ()\-]/.test(required.value)) {
        addErrorMarkup(requiredLabel, 'Wrong phone format!');
      }
      //email
      if (required.type == 'email' && !/^[\.A-z0-9_\-\+]+[@][A-z0-9_\-]+([.][A-z0-9_\-]+)+[A-z]{1,4}$/.test(required.value)) {
        addErrorMarkup(requiredLabel, 'Wrong E-mail format!');
      }
    }

    //add error text to markup
    function addErrorMarkup(correntLabel, text) {
      if (refs.addErrorText === true) {
        const errors = correntLabel.querySelectorAll('.label__error').length;
        if (errors < 1) {
          correntLabel.insertAdjacentHTML('beforeend', `<span class="label__error">${text}</span>`);
          setTimeout(function () {
            correntLabel.querySelector('.label__error').classList.add('active');
          }, 5);
        }
      }
      checkerFalse();
    }

    //ADD "RED" CLASS TO INPUTS
    function checkerFalse() {
      required.classList.add('red');
      checker = false;
    }
  });
  return checker;
}

function clearInput() {
  const label = this.closest('.label');
  const labelError = label.querySelector('.label__error');
  if (labelError) {
    labelError.classList.remove('active');
    setTimeout(() => {
      labelError.remove();
    }, 250);
  }
  this.classList.remove('red');
}

function addResetIcon() {
  const resetButton = this.closest('.label').querySelector('.js-input-reset');
  if (resetButton) {
    if (this.value.length > 0) {
      resetButton.classList.add('active');
      resetButton.addEventListener('click', () => {
        this.value = '';
        resetButton.classList.remove('active');
      });
      return;
    }
    resetButton.classList.remove('active');
  }
}
