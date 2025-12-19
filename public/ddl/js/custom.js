(function () {
  'use strict';

  /* =========================
     TINY SLIDER
  ========================= */
  if (document.querySelectorAll('.testimonial-slider').length) {
    tns({
      container: '.testimonial-slider',
      items: 1,
      axis: "horizontal",
      controlsContainer: "#testimonial-nav",
      swipeAngle: false,
      speed: 700,
      nav: true,
      controls: true,
      autoplay: true,
      autoplayHoverPause: true,
      autoplayTimeout: 3500,
      autoplayButtonOutput: false
    });
  }

  /* =========================
     PLUS / MINUS
  ========================= */
  var quantityContainers = document.getElementsByClassName('quantity-container');

  for (var i = 0; i < quantityContainers.length; i++) {
    (function (container) {
      var input = container.getElementsByClassName('quantity-amount')[0];
      var inc = container.getElementsByClassName('increase')[0];
      var dec = container.getElementsByClassName('decrease')[0];

      inc.addEventListener('click', function () {
        var val = parseInt(input.value, 10) || 0;
        input.value = val + 1;
      });

      dec.addEventListener('click', function () {
        var val = parseInt(input.value, 10) || 0;
        input.value = val > 0 ? val - 1 : 0;
      });
    })(quantityContainers[i]);
  }

  /* =========================
     VIDEO SOUND TOGGLE
  ========================= */
  window.toggleSound = function (e, videoId) {
    e.stopPropagation();

    var video = document.getElementById(videoId);
    if (!video) return;

    video.muted = !video.muted;
    e.currentTarget.textContent = video.muted ? '🔇' : '🔊';
  };

})();