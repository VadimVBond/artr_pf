/* -------------------------------------------

Name:           Arter
Version:        2.0 (Refactored)
Author:         Nazar Miller (millerDigitalDesign)
Refactored by:  Component-based architecture

------------------------------------------- */

$(function() {
  "use strict";

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
      
      // Reinitialize fancybox after filtering
      function reinitFancybox() {
        if (typeof $.fancybox !== 'undefined') {
          $.fancybox.destroy();
          const fbOptions = {
            animationEffect: "zoom-in-out",
            animationDuration: 600,
            transitionDuration: 1200,
            buttons: ["zoom", "share", "slideShow", "thumbs", "close"]
          };
          $('[data-fancybox="gallery"]').fancybox(fbOptions);
        }
      }
      
      $('.art-filter a').on('click', function() {
        $('.art-filter .art-current').removeClass('art-current');
        $(this).addClass('art-current');
        $grid.isotope({ filter: $(this).data('filter') });
        setTimeout(reinitFancybox, 650);
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
      $('[data-fancybox="gallery"]').fancybox(fbOptions);
      $('[data-fancybox]:not([data-fancybox="gallery"])').fancybox(fbOptions);
      $.fancybox.defaults.hash = false;
    }

    // menu & common
    function normalizePagePath(path) {
      if (!path) return 'index.html';
      const name = path.split('?')[0].split('#')[0].split('/').pop();
      return name === '' ? 'index.html' : name.toLowerCase();
    }

    function updateMenuActiveItem() {
      const currentPage = normalizePagePath(window.location.pathname);
      let hasActive = false;

      $('.art-menu-bar nav .main-menu .menu-item').removeClass('current-menu-item');

      $('.art-menu-bar nav .main-menu a[href]').each(function() {
        const href = $(this).attr('href');
        if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

        const linkPage = normalizePagePath(href);
        if (linkPage === currentPage) {
          const menuItem = $(this).closest('.menu-item');
          const activeItem = menuItem.hasClass('menu-item-has-children')
            ? menuItem
            : menuItem.closest('.menu-item-has-children').length
              ? menuItem.closest('.menu-item-has-children')
              : menuItem;

          activeItem.addClass('current-menu-item');
          hasActive = true;
          return false;
        }
      });

      if (!hasActive && currentPage === 'index.html') {
        const homeLink = $('.art-menu-bar nav .main-menu a[href="index.html"]').first();
        if (homeLink.length) {
          homeLink.closest('.menu-item').addClass('current-menu-item');
        }
      }
    }

    updateMenuActiveItem();
    $('.art-current-page').empty();
    $('.current-menu-item > a:first-child').clone().appendTo('.art-current-page');

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

    // Language dropdown toggle
    $('.art-language-change .art-language-toggle').off().on('click', function(e) {
      e.preventDefault();
      const $parent = $(this).closest('.art-language-change');
      $parent.toggleClass('open');
      $(this).attr('aria-expanded', $parent.hasClass('open'));
    });

    // Language select
    $('.art-language-change:not(.art-theme-change) a[data-lang]').off().on('click', function(event) {
      event.preventDefault();

      const lang = $(this).data('lang');
      if (!lang || !window.i18n) return;

      window.i18n.setLanguage(lang);
      const $container = $(this).closest('.art-language-change');
      $container.find('li').removeClass('art-active-lang');
      $(this).parent().addClass('art-active-lang');
      // update toggle flag to selected
      const flagHtml = $(this).text();
      $container.find('.art-language-toggle .art-language-flag').text(flagHtml);
      $container.removeClass('open');
      $container.find('.art-language-toggle').attr('aria-expanded', 'false');
    });

    if (window.i18n) {
      const currentLang = window.i18n.getLanguage();
      $('.art-language-change:not(.art-theme-change) li').removeClass('art-active-lang');
      const $found = $(`.art-language-change:not(.art-theme-change) a[data-lang="${currentLang}"]`);
      $found.parent().addClass('art-active-lang');
      // set toggle flag to current language
      const flag = $found.length ? $found.text() : $('.art-language-change a[data-lang="en"]').text();
      $('.art-language-change .art-language-toggle .art-language-flag').text(flag);
    }

    // close language dropdown on outside click
    $(document).off('click.languageDropdown').on('click.languageDropdown', function(e) {
      if ($(e.target).closest('.art-language-change').length === 0) {
        $('.art-language-change.open').removeClass('open').find('.art-language-toggle').attr('aria-expanded', 'false');
      }
    });

    $('.art-theme-change a').off().on('click', function(event) {
      event.preventDefault();

      const theme = $(this).data('theme');
      if (!theme || !window.themeSwitcher) return;

      window.themeSwitcher.setTheme(theme);
      $('.art-theme-change li').removeClass('art-active-theme');
      $(this).parent().addClass('art-active-theme');
    });

    if (window.themeSwitcher) {
      const currentTheme = window.themeSwitcher.getTheme();
      $('.art-theme-change li').removeClass('art-active-theme');
      $(`.art-theme-change a[data-theme="${currentTheme}"]`).parent().addClass('art-active-theme');
    }

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

  // Main startup sequence
  console.log('DOM Ready. Initializing modules...');

  if (window.themeSwitcher) window.themeSwitcher.init();

  async function startArterApp() {
    console.log('✅ All components rendered. Starting Arter engine...');

    if (window.i18n) {
      await window.i18n.init();
    }

    initArter();
  }

  if (typeof window.ComponentLoader === 'function' && document.querySelector('[data-component]')) {
    const loader = new ComponentLoader();
    window.componentLoader = loader; // Make global for debugging

    window.addEventListener('componentsReady', startArterApp, { once: true });
    loader.init();
  } else {
    startArterApp();
  }

  // Preloader
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
