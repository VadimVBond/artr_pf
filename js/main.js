/* -------------------------------------------

Name: 		Arter
Version:  1.0
Author:		Nazar Miller (millerDigitalDesign)
Portfolio:  https://themeforest.net/user/millerdigitaldesign/portfolio?ref=MillerDigitalDesign

p.s. I am available for Freelance hire (UI design, web development). mail: miller.themes@gmail.com

------------------------------------------- */
$(function() {
  "use strict";

  // swup js
  const options = {
    containers: ["#swup", "#swupMenu"],
    animateHistoryBrowsing: true,
  };
  const swup = new Swup(options);

  // Main Initialization Function
  function initArter() {
    // scrollbar
    Scrollbar.use(OverscrollPlugin);
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

    // counters
    if ($('.art-counter-frame').length) {
      anime({
        targets: '.art-counter-frame',
        opacity: [0, 1],
        duration: 800,
        delay: 300,
        easing: 'linear',
      });

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

    // line progressbars
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

    // sliders
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

    // isotope
    if ($('.art-grid').length) {
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
    const fbOptions = {
      animationEffect: "zoom-in-out",
      animationDuration: 600,
      transitionDuration: 1200,
      buttons: ["zoom", "share", "slideShow", "thumbs", "close"]
    };
    $('[data-fancybox]').fancybox(fbOptions);
    $.fancybox.defaults.hash = false;

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
        var tl = anime.timeline({ easing: 'easeOutExpo' });
        tl.add({ targets: '.art-submit', opacity: 0, scale: .5 })
          .add({ targets: '.art-success', scale: 1, height: '45px' });
      });
      return false;
    });
  }

  // Preloader
  $(document).ready(function() {
    anime({
      targets: '.art-preloader .art-preloader-content',
      opacity: [0, 1],
      delay: 200,
      duration: 600,
      easing: 'linear'
    });
    anime({
      targets: '.art-preloader',
      opacity: [1, 0],
      delay: 2200,
      duration: 400,
      easing: 'linear',
      complete: () => $('.art-preloader').css('display', 'none')
    });

    if (document.getElementById('preloader')) {
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

  // Wait for components if any
  if (document.querySelectorAll('[data-component]').length > 0) {
    window.addEventListener('componentsReady', initArter);
  } else {
    initArter();
  }

  // Swup Re-init
  swup.on('contentReplaced', initArter);

});
