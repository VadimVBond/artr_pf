/* -------------------------------------------

Name:           Arter
Version:        2.0 (Refactored)
Author:         Nazar Miller (millerDigitalDesign)
Refactored by:  Component-based architecture

------------------------------------------- */

$(function() {
  "use strict";

  // Initialize modules
  const modules = {
    theme: window.themeSwitcher,
    i18n: window.i18n,
    loader: null,
    listRenderer: null
  };

  // Wait for all components to be ready before initializing
  function waitForComponents(callback) {
    if (document.querySelectorAll('[data-component]').length > 0) {
      window.addEventListener('componentsReady', callback, { once: true });
    } else {
      callback();
    }
  }

  // Main Initialization Function
  function initArter() {
    console.log('Initializing Arter...');

    // scrollbar
if (typeof Scrollbar !== 'undefined') {
  // Проверяем, загрузился ли плагин
  if (typeof OverscrollPlugin !== 'undefined') {
    Scrollbar.use(OverscrollPlugin);
  } else {
    console.warn('⚠️ OverscrollPlugin not found, skipping.');
  }

  // Инициализация скроллбара
  if (document.querySelector('#scrollbar')) {
    Scrollbar.init(document.querySelector('#scrollbar'), {
      damping: 0.05,
      renderByPixel: true,
      continuousScrolling: true,
    });
  }
  if (document.querySelector('#scrollbar2')) {
    Scrollbar.init(document.querySelector('#scrollbar2'), {
      damping: 0.05,
      renderByPixel: true,
      continuousScrolling: true,
    });
  }
}

    // counters animation
    if ($('.art-counter-frame').length) {
      if (typeof anime !== 'undefined') {
        anime({
          targets: '.art-counter-frame',
          opacity: [0, 1],
          duration: 800,
          delay: 300,
          easing: 'linear',
        });
      }

      $('.art-counter').each(function() {
        $(this).prop('Counter', 0).animate({
          Counter: $(this).text()
        }, {
          duration: 2000,
          easing: 'linear',
          step: function(now) {
            $(this).text(Math.ceil(now));
          }
        });
      });
    }

    // circle progressbars
    if (typeof ProgressBar !== 'undefined') {
      const circleBars = [
        { id: 'circleprog1', value: 1.0, delay: 2500 },
        { id: 'circleprog2', value: 0.9, delay: 2600 },
        { id: 'circleprog3', value: 0.7, delay: 2700 }
      ];

      circleBars.forEach(config => {
        const el = document.getElementById(config.id);
        if (el) {
          var bar = new ProgressBar.Circle(el, {
            strokeWidth: 7,
            easing: 'easeInOut',
            duration: 1400,
            delay: config.delay,
            trailWidth: 7,
            step: function(state, circle) {
              var value = Math.round(circle.value() * 100);
              circle.setText(value === 0 ? '' : value);
            }
          });
          bar.animate(config.value);
        }
      });
    }

    // line progressbars
    if (typeof ProgressBar !== 'undefined') {
      const lineBars = [
        { id: 'lineprog1', value: 0.90, delay: 2800 },
        { id: 'lineprog2', value: 0.95, delay: 2900 },
        { id: 'lineprog3', value: 0.75, delay: 3000 },
        { id: 'lineprog4', value: 0.65, delay: 3100 },
        { id: 'lineprog5', value: 0.85, delay: 3200 }
      ];

      lineBars.forEach(config => {
        const el = document.getElementById(config.id);
        if (el) {
          var bar = new ProgressBar.Line(el, {
            strokeWidth: 1.72,
            easing: 'easeInOut',
            duration: 1400,
            delay: config.delay,
            trailWidth: 1.72,
            svgStyle: { width: '100%', height: '100%' },
            step: (state, bar) => {
              bar.setText(Math.round(bar.value() * 100) + ' %');
            }
          });
          bar.animate(config.value);
        }
      });
    }

    // sliders
    if (typeof Swiper !== 'undefined') {
      const sliderConfigs = [
        { class: '.art-testimonial-slider', perView: 3, breakpoints: { 1500: 2, 1200: 2, 992: 1 } },
        { class: '.art-works-slider', perView: 3, breakpoints: { 1500: 2, 1200: 2, 992: 1 }, autoplay: true },
        { class: '.art-blog-slider', perView: 3, breakpoints: { 1500: 3, 1200: 2, 992: 1 }, autoplay: true }
      ];

      sliderConfigs.forEach(conf => {
        if ($(conf.class).length) {
          new Swiper(conf.class, {
            slidesPerView: conf.perView,
            spaceBetween: 30,
            speed: 1400,
            autoplay: conf.autoplay ? { delay: 4000 } : false,
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: {
              nextEl: conf.class.replace('slider', 'swiper-next'),
              prevEl: conf.class.replace('slider', 'swiper-prev'),
            },
            breakpoints: Object.fromEntries(Object.entries(conf.breakpoints).map(([k, v]) => [k, { slidesPerView: v }]))
          });
        }
      });
    }

    // isotope
    if (typeof Isotope !== 'undefined' && $('.art-grid').length) {
      var $grid = $('.art-grid').isotope({
        itemSelector: '.art-grid-item',
        transitionDuration: '.6s',
      });
      $('.art-filter a').on('click', function() {
        $('.art-filter .art-current').removeClass('art-current');
        $(this).addClass('art-current');
        $grid.isotope({ filter: $(this).data('filter') });
        return false;
      });
    }

    // fancybox
    if (typeof $.fancybox !== 'undefined') {
      const fbOptions = {
        animationEffect: "zoom-in-out",
        animationDuration: 600,
        transitionDuration: 1200,
        buttons: ["zoom", "share", "slideShow", "thumbs", "close"]
      };
      $('[data-fancybox]').fancybox(fbOptions);
      $.fancybox.defaults.hash = false;
    }

    // menu & common
    $('.art-current-page').empty();
    $('.current-menu-item a').clone().appendTo('.art-current-page');

    $('.art-info-bar-btn').off().on('click', function() {
      $('.art-info-bar, .art-menu-bar-btn').toggleClass('art-active art-disabled');
      $('.art-content').toggleClass('art-active');
    });

    $('.art-menu-bar-btn').off().on('click', function() {
      $('.art-menu-bar-btn, .art-menu-bar, .art-info-bar-btn').toggleClass('art-active art-disabled');
      $('.art-content').toggleClass('art-active');
    });

    $('.art-curtain, .art-mobile-top-bar').off().on('click', function() {
      $('.art-menu-bar-btn, .art-menu-bar, .art-info-bar, .art-content, .art-info-bar-btn').removeClass('art-active art-disabled');
    });

    $('.menu-item').off().on('click', function() {
      if ($(this).hasClass('menu-item-has-children')) {
        $(this).children('.sub-menu').toggleClass('art-active');
      } else {
        $('.art-menu-bar-btn, .art-menu-bar, .art-info-bar, .art-content, .art-info-bar-btn').removeClass('art-active art-disabled');
      }
    });

    // Form
    $('.art-input').keyup(function() {
      $(this).toggleClass('art-active', !!$(this).val());
    });

    $("#form").off().submit(function() {
      $.ajax({ type: "POST", url: "mail.php", data: $(this).serialize() }).done(function() {
        if (typeof anime !== 'undefined') {
          var tl = anime.timeline({ easing: 'easeOutExpo' });
          tl.add({ targets: '.art-submit', opacity: 0, scale: .5 })
            .add({ targets: '.art-success', scale: 1, height: '45px' });
        }
      });
      return false;
    });

    console.log('✓ Arter initialized');
  }

  // Preloader
$(document).ready(function() {
  console.log('DOM Ready. Initializing modules...');

  // 1. Initialize Theme & i18n immediately
  if (window.themeSwitcher) window.themeSwitcher.init();
  if (window.i18n) window.i18n.init();

  // 2. Initialize Component Loader
  const loader = new ComponentLoader();
  window.componentLoader = loader; // Make global for debugging
  loader.init();

  // 3. Animate Preloader (Visuals)
  if (typeof anime !== 'undefined') {
    anime({
      targets: '.art-preloader .art-preloader-content',
      opacity: [0, 1],
      delay: 200,
      duration: 600,
      easing: 'linear'
    });
    
    // Hide preloader after a fixed time or when components are ready
    setTimeout(() => {
      anime({
        targets: '.art-preloader',
        opacity: [1, 0],
        duration: 400,
        easing: 'linear',
        complete: () => $('.art-preloader').css('display', 'none')
      });
    }, 1500);
  }

  // Progress bar for preloader (if exists)
  if (document.getElementById('preloader') && typeof ProgressBar !== 'undefined') {
    var preBar = new ProgressBar.Line('#preloader', {
      strokeWidth: 1.7,
      easing: 'easeInOut',
      duration: 1400,
      delay: 750,
      trailWidth: 1.7,
      svgStyle: { width: '100%', height: '100%' },
      step: (state, bar) => bar.setText(Math.round(bar.value() * 100) + ' %')
    });
    preBar.animate(1);
  }
});

// 4. MAIN INITIALIZATION TRIGGER
// This function waits for the custom event fired by ComponentLoader
function waitForComponents(callback) {
  // Check if components are already rendered (edge case)
  if (document.querySelectorAll('[data-component]').length === 0) {
    callback();
    return;
  }

  window.addEventListener('componentsReady', () => {
    console.log('✅ All components rendered. Starting Arter engine...');
    callback();
  }, { once: true });
}

  // Wait for components then init
  waitForComponents(initArter);

});
