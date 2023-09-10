import jQuery from 'jquery';

var winWidth,
  winHeight,
  scrollOffset,
  popuped = false,
  scrollPos = 0,
  animDuration = 400,
  offsetElem = jQuery('header'),
  popupedPos,
  formTitle = '',
  bodyOffset = 0,
  pricePack = '',
  rootPath = '',
  serviceName = '',
  siteName = '',
  emailsArr = '',
  pageName = '';

jQuery(document).ready(function () {
  jQuery.extend({
    getQueryParameters: function (str) {
      return (str || document.location.search)
        .replace(/(^\?)/, '')
        .split('&')
        .map(
          function (n) {
            return (n = n.split('=')), (this[n[0]] = n[1]), this;
          }.bind({})
        )[0];
    },
  });

  if (document.location.search.indexOf('?') != -1) {
    var pricePack = $.getQueryParameters();
    pricePack = pricePack['package'];
  } else {
    pricePack = '-';
  }
  if (serviceName) {
    serviceName = serviceName + ' - ';
  }
  jQuery('body').find('.scroll-animate__fade').addClass('scroll-animate__fade--hidden');
  winWidth = jQuery(window).width();
  winHeight = jQuery(window).height();
  scrollPos = jQuery(window).scrollTop();
  bodyOffset = offsetElem.outerHeight();

  // отступ прокрутки для "начать проект"
  function scrollOffsetDefine() {
    if (winWidth > 800) {
      scrollOffset = 20;
    } else {
      scrollOffset = 70;
    }
  }
  scrollOffsetDefine();

  jQuery('.btn--2.btn--right').each(function () {
    jQuery(this).append('<span>&nbsp;</span>');
  });

  jQuery('.btn--2.btn--left, .btn--attach').each(function () {
    jQuery(this).prepend('<span>&nbsp;</span>');
  });

  // разделение заголовков на строки
  jQuery('.break-lines').each(function () {
    jQuery(this).attr('data-lines-text', jQuery(this).html());
  });
  jQuery('.break-lines').each(function () {
    var lines = jQuery(this);

    jQuery(window).on('resize', function () {
      lines.html(lines.attr('data-lines-text'));
      lines.splitLines({
        tag: '<div class="break-lines__line"><div class="break-lines__inner"><span class="break-lines__text"></span></div></div>',
      });
      lines.find('.break-lines__inner').each(function () {
        jQuery(this).append('<div class="break-lines__over" />');
      });
      if (lines.hasClass('animate-in')) {
        lines.find('.break-lines__line').addClass('animated');
      }
    });
  });

  // слайдер на главной
  jQuery('.slider').each(function () {
    var slider = jQuery(this),
      slides = slider.find('.slider-item'),
      sliderLength = slides.length,
      sliderStart = 1,
      sliderCurrent = sliderStart,
      sliderPrev = sliderCurrent - 1,
      sliderNext = sliderCurrent + 1,
      sliderInt;

    if (sliderPrev < 1) {
      sliderPrev = sliderLength;
    }
    if (sliderNext > sliderLength) {
      sliderNext = 1;
    }

    slider.append('<ul class="slider-pages" />');

    slides.each(function (index) {
      var page = index + 1;
      jQuery(this).attr('data-slider-item', page);
      slider.find('.slider-pages').append('<li class="slider-page" data-slider-item="' + page + '">' + page + '</li>');
    });

    jQuery('.slider-page').on('click', function () {
      var target = +jQuery(this).attr('data-slider-item');
      goToSlide(target, 1000);
    });

    jQuery('.slider-control').on('click', function () {
      var control = jQuery(this),
        target;
      if (control.hasClass('slider-control--prev')) {
        target = sliderPrev;
      }
      if (control.hasClass('slider-control--next')) {
        target = sliderNext;
      }
      goToSlide(target, 1000);
    });

    if (!device.desktop()) {
      // свайп на мобильных
      slider.swipe({
        swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
          if (direction == 'left') {
            goToSlide(sliderNext, 1000);
          }
          if (direction == 'right') {
            goToSlide(sliderPrev, 1000);
          }
        },
        threshold: 60,
        allowPageScroll: 'vertical',
      });
    }

    slider.on('slider.start', function () {
      goToSlide(sliderCurrent, 0);
    });

    function goToSlide(target, delay) {
      var slideAuto = 8000 + delay;

      clearInterval(sliderInt);

      slider.removeClass('animate-in');
      slides.find('.break-lines').removeClass('animate-in').find('.break-lines__line').removeClass('animated');
      jQuery('.slider-page').removeClass('active');

      setTimeout(function () {
        slides.removeClass('active');
        slider.find('.slider-item[data-slider-item="' + sliderCurrent + '"]').addClass('active');
        slider.addClass('animate-in');
        slider
          .find('.slider-item[data-slider-item="' + sliderCurrent + '"]')
          .find('.break-lines')
          .addClass('animate-in')
          .find('.break-lines__line')
          .each(function (index) {
            var line = jQuery(this);
            setTimeout(function () {
              line.addClass('animated');
            }, index * 300);
          });
        jQuery('.slider-page[data-slider-item="' + sliderCurrent + '"]').addClass('active');
      }, delay);

      sliderCurrent = target;
      sliderPrev = sliderCurrent - 1;
      sliderNext = sliderCurrent + 1;

      if (sliderPrev < 1) {
        sliderPrev = sliderLength;
      }
      if (sliderNext > sliderLength) {
        sliderNext = 1;
      }

      sliderInt = setTimeout(function () {
        goToSlide(sliderNext, 1000);
      }, slideAuto);
    }
  });

  // ползунок выбора бюджета
  jQuery('.start-budget__slider').slider({
    animate: true,
    range: true,
    values: [300, 700],
    min: 100,
    max: 2000,
    step: 50,
    slide: function (e, ui) {
      jQuery('[name="budget_from"]').val(ui.values[0]);
      jQuery('[name="budget_to"]').val(ui.values[1]);
      jQuery('.start-budget__from').html(ui.values[0]);
      jQuery('.start-budget__to').html(ui.values[1]);
    },
    change: function (e, ui) {
      jQuery('[name="budget_from"]').val(ui.values[0]);
      jQuery('[name="budget_to"]').val(ui.values[1]);
      jQuery('.start-budget__from').html(ui.values[0]);
      jQuery('.start-budget__to').html(ui.values[1]);
    },
    create: function () {
      jQuery('[name="budget_from"]').val(jQuery(this).slider('option', 'values')[0]);
      jQuery('[name="budget_to"]').val(jQuery(this).slider('option', 'values')[1]);
    },
  });

  // навигация в "начать проект"
  jQuery('.start-block').each(function () {
    var start = jQuery(this),
      progress = start.find('.start-progress'),
      progressSteps = progress.find('.start-bar__step'),
      progressHeight = progress.outerHeight(),
      startBtns = start.find('.start-btns'),
      startSections = start.find('.start-section'),
      startLength = startSections.length,
      startFirst = 1,
      startCurrent = startFirst,
      startPrev = startCurrent - 1,
      startNext = startCurrent + 1;

    if (startPrev < 1) {
      startPrev = 1;
    }
    if (startNext > startLength) {
      startNext = startLength;
    }

    startSections.each(function (index) {
      jQuery(this).attr('data-start', index + 1);
    });

    jQuery(window).on('resize', function () {
      progress.css(
        'top',
        start
          .find('.start-section[data-start="' + startCurrent + '"]')
          .find('.title')
          .outerHeight() + 'px'
      );
    });

    jQuery('body').on('page.loaded', function () {
      goToSection(startCurrent, 'next');
    });
    start.on('start.sent', function () {
      goToSection(startLength, 'next');
    });

    start.find('.btn--start').on('click', function () {
      var target = 0,
        direction = '';
      if (jQuery(this).hasClass('btn--start-prev')) {
        target = startPrev;
        direction = 'prev';
      }
      if (jQuery(this).hasClass('btn--start-next')) {
        var fields = start.find('.start-section[data-start="' + startCurrent + '"]').find('.start-fields');
        var valid = formValidator(fields.get(0));
        if (valid != false) {
          target = startNext;
          direction = 'next';
        } else {
          return false;
        }
      }
      goToSection(target, direction);
    });

    function goToSection(sec, direction) {
      if (!progress.hasClass('start-progress--active')) {
        progress.addClass('start-progress--active');
      }
      jQuery('html, body').animate({
        scrollTop: start.offset().top - scrollOffset,
      });

      if (sec == startLength) {
        progress.hide();
        startBtns.hide();
      }

      start.find('.start-section.active').addClass('passing passing-' + direction);
      setTimeout(function () {
        start
          .find('.start-section.active')
          .removeClass('animated active passing passing-' + direction)
          .find('.break-lines--noscroll')
          .removeClass('animate-in')
          .find('.break-lines__line')
          .removeClass('animated');
        start.find('.start-section[data-start="' + sec + '"]').addClass('active animated');
        progress.css(
          'top',
          start
            .find('.start-section[data-start="' + sec + '"]')
            .find('.title')
            .outerHeight() + 'px'
        );

        progressSteps.removeClass('active');
        progressSteps.each(function (index) {
          if (index + 1 <= sec) {
            jQuery(this).addClass('active');
          }
        });

        if (sec == startLength - 1) {
          startBtns.find('.start-btns__right--next').removeClass('active');
          startBtns.find('.start-btns__right--send').addClass('active');
        } else {
          startBtns.find('.start-btns__right--next').addClass('active');
          startBtns.find('.start-btns__right--send').removeClass('active');
        }
        if (sec == 1) {
          startBtns.find('.start-btns__left').removeClass('active');
        } else {
          startBtns.find('.start-btns__left').addClass('active');
        }

        start
          .find('.start-section[data-start="' + sec + '"]')
          .find('.break-lines--noscroll')
          .addClass('animate-in')
          .find('.break-lines__line')
          .each(function (index) {
            var line = jQuery(this);
            setTimeout(function () {
              line.addClass('animated');
            }, index * 300);
          });
      }, 400);

      (startCurrent = sec), (startPrev = startCurrent - 1), (startNext = startCurrent + 1);

      if (startPrev < 1) {
        startPrev = 1;
      }
      if (startNext > startLength) {
        startNext = startLength;
      }
    }
  });

  // прикрепление файлов
  jQuery('.start-attach').each(function () {
    var attach = jQuery(this),
      list = attach.find('.start-attach__list'),
      btn = attach.find('.start-attach__btn'),
      fieldClass = 'start-attach__item', // класс поля
      attachedClass = 'start-attach__item--attached', // класс поля с файлом
      fields = attach.find('.' + fieldClass).length, // начальное кол-во полей
      fieldsAttached = 0, // начальное кол-во полей с файлами
      itemStr =
        '<div class="start-attach__item"><input type="file" name="file[]" class="start-attach__input" /><div class="start-attach__filename"></div><div class="start-attach__remove"></div></div>';

    btn.on('click', function () {
      attach.find('.start-attach__item:not(.start-attach__item--attached)').last().find('.start-attach__input').trigger('click');
    });

    attach.on('change', '.start-attach__input', function (e) {
      var item = attach.find('.start-attach__item:not(.start-attach__item--attached)').last(),
        fileName = '';
      if (e.target.value) {
        // если value инпута не пустое
        fileName = e.target.value.split('\\').pop(); // оставляем только имя файла и записываем в переменную
      }
      if (fileName) {
        // если имя файла не пустое
        item.find('.start-attach__filename').text(fileName); // подставляем в поле имя файла
        if (!item.hasClass(attachedClass)) {
          // если в поле до этого не было файла
          item.addClass(attachedClass); // отмечаем поле классом
          fieldsAttached++;
        }
        if (fields < 10 && fields == fieldsAttached) {
          // если полей меньше 10 и кол-во полей равно
          jQuery('.start-attach__btn').hide();
        }
      } else {
        // если имя файла пустое
        jQuery(this).val('');
        fieldsAttached--;
      }
    });
    // При нажатии на "Удалить"
    attach.on('click', '.start-attach__remove', function () {
      var item = jQuery(this).closest('.' + fieldClass);
      item.removeClass(attachedClass);
      item.find('.start-attach__input').val();
      jQuery('.start-attach__btn').show();
      fieldsAttached--;
    });
  });

  // анимация при скролле
  jQuery('.scroll-animate').each(function () {
    var block = jQuery(this);
    jQuery(window).on('scroll', function () {
      var top = block.offset().top;
      var bottom = block.height() + top;
      top = top - jQuery(window).height();
      var scroll_top = jQuery(this).scrollTop() - winHeight * 0.33;
      setTimeout(function () {
        if (scroll_top > top && scroll_top < bottom) {
          if (!block.hasClass('animate')) {
            block.addClass('animate');
            block.trigger('animateIn');
          }
        }
      }, 300);
    });
  });
  jQuery('.scroll-animate').on('animateIn', function () {
    jQuery(this)
      .find('.break-lines')
      .not('.break-lines--noscroll')
      .addClass('animate-in')
      .find('.break-lines__line')
      .each(function (index) {
        var line = jQuery(this);
        setTimeout(function () {
          line.addClass('animated');
        }, index * 300);
      });
    jQuery(this)
      .find('.scroll-animate__fade--hidden')
      .each(function (index) {
        var block = jQuery(this);
        setTimeout(function () {
          block.removeClass('scroll-animate__fade--hidden');
        }, index * 300);
      });
  });
  jQuery('.about-skills').on('animateIn', function () {
    jQuery('.about-skill').each(function (index) {
      var bar = jQuery(this).find('.about-skill__bar'),
        fill = bar.find('.about-skill__fill'),
        fillPerc = +fill.attr('data-fill');
      setTimeout(function () {
        fill.width(fillPerc + '%');
      }, index * 200);
    });
  });
  jQuery('.home').on('animateIn', function () {
    jQuery('.slider').trigger('slider.start');
  });
  jQuery('.services').on('animateIn', function () {
    jQuery('.services').find('.services-block').trigger('show.serv', ['branding']);
  });

  // при выборе видов деятельности в "начать проект" один из пунктов всегда выделен
  jQuery('.label--type input').on('change', function () {
    var types = jQuery(this).closest('.form__types');
    if (!types.find('input[type="checkbox"]:checked').length) {
      jQuery(this).prop('checked', true);
    }
  });

  // открытие/закрытие мобильного меню
  jQuery('.menu-toggle').on('click', function () {
    if (!jQuery('body').hasClass('body--menu-opened')) {
      jQuery('body').toggleClass('body--menu-opened');
      popupedPos = jQuery(window).scrollTop();
      jQuery('html').addClass('html--popuped');
    } else {
      jQuery('body').removeClass('body--menu-opened');
      jQuery('html').removeClass('html--popuped');
      if (device.ios()) {
        jQuery(window).scrollTop(popupedPos);
      }
    }
  });

  // навигация между страницами
  jQuery('.nav-link, .menu-item a').on('click', function (e) {
    var link = jQuery(this);
    e.preventDefault();
    e.stopPropagation();
    jQuery('body').addClass('body--animate-in');
    jQuery('body').removeClass('body--page-loaded');
    var linkHref = this.href;
    jQuery('body').removeClass('body--menu-opened');
    jQuery('html').removeClass('html--popuped');
    setTimeout(function () {
      if (link.hasClass('start-close') && !!(window.history && history.pushState)) {
        window.history.back();
      } else {
        window.location = linkHref;
      }
    }, 300);
  });

  // Прокрутка к элементу
  jQuery('.scrollTo').on('click', function (e) {
    e.preventDefault();
    var target = jQuery(this).attr('data-scrollto');
    if (target) {
      var targetPos =
        jQuery('[data-scrollto="' + target + '"]')
          .not(jQuery(this))
          .offset().top - scrollOffset;
      jQuery('html, body').animate({ scrollTop: targetPos }, 1000);
    }
  });

  jQuery('.project-video__block').on('click', function () {
    var block = jQuery(this),
      inner = block.find('.project-video__inner'),
      videoUrl = block.attr('data-video-url');

    block.addClass('active');
    inner.append('<iframe src="' + videoUrl + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
  });

  jQuery('.services-block').each(function () {
    var serv = jQuery(this),
      leftItems = serv.find('.services-left-item'),
      rightItems = serv.find('.services-item'),
      rightLinks = serv.find('.services-item-link'),
      servST;

    rightLinks.on('mouseover', function () {
      var link = jQuery(this),
        servName = link.attr('data-services-item');

      if (!link.hasClass('active')) {
        showServ(servName);
      }
    });

    serv.on('show.serv', function (i, a) {
      showServ(a);
    });

    function showServ(id) {
      clearTimeout(servST);

      leftItems
        .not('[data-services-item="' + id + '"]')
        .removeClass('animate-in')
        .addClass('animate-out');
      rightLinks.removeClass('active');

      serv.find('.services-item-link[data-services-item="' + id + '"]').addClass('active');

      servST = setTimeout(function () {
        leftItems.removeClass('active animate-out');
        serv.find('.services-left-item[data-services-item="' + id + '"]').addClass('active animate-in');
      }, 700);
    }
  });

  jQuery(window).resize(function () {
    winWidth = jQuery(window).width();
    winHeight = jQuery(window).height();
    scrollPos = jQuery(window).scrollTop();
    bodyOffset = offsetElem.outerHeight();

    scrollOffsetDefine();
  });
  jQuery(window).scroll(function () {
    scrollPos = jQuery(window).scrollTop();
  });
  jQuery(window).trigger('resize');

  if (device.desktop()) {
    // параллакс в "о нас"
    jQuery('.about-skills, .about-descr').paroller();
  } else {
  }

  // Добавляем текст ошибок для полей
  jQuery('.form--validate').each(function () {
    var form = jQuery(this);
    form.find('.form__field').each(function () {
      jQuery(this).append('<div class="form-errors" />');
    });
    form.find('.form__field--required').find('.form-errors').append('<p class="form-errors__item form-errors__item-required">Обязательное поле</p>');
  });

  // Добавляем * для всех обязательных к заполнению полей
  jQuery('.form--validate')
    .find('.form__field--required')
    .each(function () {
      jQuery(this).find('.placeholder').append(' *');
    });

  // РАБОТА С ИНПУТАМИ
  // "Плавающий" placeholder
  jQuery('.label--input, .label--meet, .label--details').each(function () {
    var label = jQuery(this);
    var input = jQuery(this).find('input, textarea');
    var field = jQuery(this).closest('.form__field');

    // фокус на инпуте/тексэйрии
    input
      .on('focus', function () {
        label.addClass('active focused');
      })
      .on('focusout blur change keyup input', function () {
        var value = jQuery(this).val();
        if (value == '') {
          if (!input.is(':focus')) {
            label.removeClass('active');
          }
        } else {
          label.addClass('active');
          field.removeClass('form__field--error');
        }
      })
      .on('focusout', function () {
        label.removeClass('focused');
      });
  });

  // Ограничение длины ввода в поле type="number"
  jQuery('input[type="number"]').on('input change paste keyup', function () {
    var max = parseInt(jQuery(this).attr('data-max'));
    var val = jQuery(this).val();
    if (val.length > max) {
      jQuery(this).val(val.slice(0, max));
    }
  });

  // Запрет ввода любых символов, кроме 0-9, (), -, +
  jQuery('input.input-phone_number, .form-validate .form__field[data-field-type="phone"] input').on('input change paste keyup', function () {
    jQuery(this).val(this.value.replace(/[^0-9\+ ()\-]/, ''));
  });

  // Добавляем в попап кнопку закрытия
  jQuery('.popup__content').each(function () {
    jQuery(this).prepend('<div class="popup__close noselect" />');
  });
  jQuery('.popup__close').on('click', function () {
    popupClose();
  });

  // Закрытие попапа при клике на фон
  jQuery('.popup').on('click', function (e) {
    if (jQuery(e.target).closest('.popup__content').length) {
    } else {
      popupClose();
      e.stopPropagation();
    }
  });

  // Закрытие попапа по нажатию на Esc
  jQuery(document).keydown(function (e) {
    if ((popuped = true)) {
      if (e.which == 27) {
        popupClose();
      }
    }
  });

  // ОТПРАВКА ДАННЫХ ИЗ ФОРМЫ
  jQuery('.btn--sendform').on('click', function () {
    var form = jQuery(this).closest('form'),
      valid = formValidator(form.get(0)),
      sbt = jQuery(this).attr('data-form-type');
    if (valid != false) {
      var formData = new FormData(form.get(0));
      formData.append('submit', sbt);
      if (sbt == 'startproject') {
        formData.append('package', pricePack);
      }
      //jQuery('body').find('.form__field--error').removeClass('form__field--error');
      //jQuery('body').find('textarea, input').val('').trigger('change');
      // setTimeout(function(){ga('send', 'event', ''+sbt, ''+sbt);}, 30);
      // setTimeout(function(){yaCounter41805234.reachGoal(''+sbt);}, 30); // меняем XXXXXXXXX на номер счетчика
      if (sbt == 'startproject') {
        jQuery('.start-block').trigger('start.sent');
      } else if (sbt == 'subscribe') {
        form.find('.form__field').hide();
        form.find('.form__field--subscribe-thx').fadeIn(400);
      } else if (sbt == 'message') {
        form.find('.form__field--btn').hide();
        form.find('.contacts-thx').fadeIn(400);
      }
    } else {
      if (sbt != 'startproject') {
        form.find('.form__field-error').first().find('input, textarea').focus();
      }
    }
  });

  var map,
    myPlacemark,
    mapIcon = '../wp-content/themes/brainst/images/icon--marker.png';

  function initYMap(coords) {
    map = new ymaps.Map('contacts-map', {
      center: coords,
      zoom: 16,
    });

    myPlacemark = new ymaps.Placemark(
      coords,
      {
        balloonContentHeader: 'Brainst Agency',
        balloonContentBody: 'Москва, ул.&nbsp;Большая Новодмитровская&nbsp;36, стр.&nbsp;4',
        hintContent: 'Brainst Agency',
      },
      {
        iconLayout: 'default#image',
        iconImageHref: mapIcon,
        iconImageSize: [40, 40],
        iconImageOffset: [-20, -40],
      }
    );

    map.geoObjects.add(myPlacemark);
    map.controls.add(new ymaps.control.ZoomControl());
    map.behaviors.disable('scrollZoom');
  }
});

jQuery(window).on('load', function () {
  // начало анимации "шторок"
  setTimeout(function () {
    jQuery('.shutters').addClass('shutters--sliding-in');
    jQuery('body').addClass('body--page-loaded');
  }, 500);
  // триггер для анимации блоков по завершению анимации "шторок"
  setTimeout(function () {
    jQuery('body').trigger('page.loaded').addClass('body--page-loaded');
    jQuery(window).trigger('scroll');
  }, 1000);
  // скрытие "шторок"
  setTimeout(function () {
    jQuery('.shutters').addClass('shutters--done');
  }, 1500);
});

// Валидатор формы
function formValidator(form) {
  var $form = jQuery(form);
  var valid = true;
  if ($form.find('.form__field--required').length) {
    $form.find('.form__field--required').each(function () {
      var errorClass = 'form__field--error';
      var type = jQuery(this).attr('data-field-type');
      var val;
      if (jQuery(this).find('input').length) {
        val = jQuery(this).find('input').val();
      } else {
        val = jQuery(this).find('textarea').val();
      }

      if (!val) {
        jQuery(this).addClass(errorClass);
        jQuery(this).find('.form-errors__item--type').remove();
        jQuery(this).find('.form-errors__item--required').show();
        valid = false;
      } else {
        jQuery(this).removeClass(errorClass);
        jQuery(this).find('.form-errors__item--required').hide();

        if (type == 'email') {
          var errorText = 'Неверный формат e-mail';
          if (!/^[\.A-z0-9_\-\+]+[@][A-z0-9_\-]+([.][A-z0-9_\-]+)+[A-z]{1,4}$/.test(val)) {
            jQuery(this)
              .find('.form-errors')
              .append('<p class="form-errors__item--type">' + errorText + '</p>');
            jQuery(this).addClass(errorClass);
            valid = false;
          } else {
            jQuery(this).find('.form-errors_item--type').remove();
            jQuery(this).removeClass(errorClass);
          }
        }

        if (type == 'phone') {
          var errorText = 'Неверный формат номера телефона';
          if (/[^0-9\+ ()\-]/.test(val)) {
            jQuery(this)
              .find('.form-errors')
              .append('<p class="form-errors__item--type">' + errorText + '</p>');
            jQuery(this).addClass(errorClass);
            valid = false;
          } else {
            jQuery(this).find('.form-errors__item--type').remove();
            jQuery(this).removeClass(errorClass);
          }
        }
      }
    });
  }

  if (valid != true) {
    return false;
  }
}
