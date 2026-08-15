document.addEventListener('DOMContentLoaded', function() {

/* ========== CAL.COM EMBED ========== */
(function(){
  var calEl = document.getElementById('cal-embed');
  if (!calEl) return;
  var CAL_USERNAME = 'rodney.ai';
  var CAL_EVENT = '30min';
  var iframe = document.createElement('iframe');
  iframe.src = 'https://cal.eu/' + CAL_USERNAME + '/' + CAL_EVENT + '?embed=true&theme=light';
  iframe.style.cssText = 'width:100%;height:500px;border:none;border-radius:inherit';
  iframe.loading = 'lazy';
  iframe.title = 'Book a consultation with Rodney Coutinho';
  calEl.innerHTML = '';
  calEl.appendChild(iframe);
})();

/* ========== MAIN SITE SCRIPTS ========== */
(function(){
  'use strict';

  /* Hijri date */
  try {
    var now = new Date();
    var greg = now.toLocaleDateString('en-US', {day:'numeric', month:'long', year:'numeric'});
    var hijri = now.toLocaleDateString('ar-SA-u-ca-islamic-umalqura', {day:'numeric', month:'long', year:'numeric'});
    var el = document.getElementById('hijriDate');
    if (el) el.innerHTML = greg + ' &nbsp;·&nbsp; ' + '<span class="hijri">' + hijri + '</span>';
  } catch(e) {}

  /* Scroll reveal */
  var revealEls = document.querySelectorAll(
    '.sf-row, .svc-card, .service-card, .insight-card, .acc-card, .resource-card, .faq-item, ' +
    '.about-highlight, .fr-part, .fr-scoreboard-card, .cred-item, .contact-card'
  );
  var revealObs = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(function(el){
    el.classList.add('reveal');
    revealObs.observe(el);
  });

  /* Stagger delays for grids */
  document.querySelectorAll('.sf-rows, .services-grid, .insights-grid, .acc-grid, .resources-grid, .faq-grid, .about-highlights, .fr-parts').forEach(function(grid){
    var children = grid.children;
    for(var i = 0; i < children.length; i++){
      children[i].classList.add('reveal-delay-' + Math.min(i % 4 + 1, 4));
    }
  });

  /* Nav scroll state */
  var nav = document.getElementById('mainNav');
  var backToTop = document.getElementById('backToTop');
  var stickyCta = document.getElementById('stickyCta');
  window.addEventListener('scroll', function(){
    var y = window.scrollY || document.documentElement.scrollTop;
    if(y > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
    if(y > 500) { backToTop.classList.add('show'); if(stickyCta) stickyCta.classList.add('show'); }
    else { backToTop.classList.remove('show'); if(stickyCta) stickyCta.classList.remove('show'); }
  }, { passive: true });

  /* Mobile drawer */
  var hamburger = document.getElementById('hamburger');
  var drawer = document.getElementById('mobileDrawer');
  var overlay = document.getElementById('drawerOverlay');
  function toggleDrawer(){
    var isOpen = drawer.classList.toggle('open');
    overlay.classList.toggle('open', isOpen);
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
  function closeDrawer(){
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }
  hamburger.addEventListener('click', toggleDrawer);
  overlay.addEventListener('click', closeDrawer);
  drawer.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', closeDrawer);
  });

  /* Smooth anchor scrolling (only for same-page anchors) */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if(target){
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();

/* ========== DATA STORY ANIMATIONS ========== */
(function(){
  var scenes = document.querySelectorAll('.ds-scene');
  if (!scenes.length) return;

  function animateValue(el, target, suffix, prefix, duration) {
    prefix = prefix || '';
    suffix = suffix || '';
    var start = 0;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = (target % 1 === 0) ? Math.round(eased * target) : (eased * target).toFixed(1);
      el.textContent = prefix + current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function animateScene(scene) {
    if (scene.dataset.animated) return;
    scene.dataset.animated = '1';
    scene.classList.add('ds-visible');

    // Animate big numbers
    var bigNum = scene.querySelector('.ds-big-num');
    if (bigNum) {
      var t = parseFloat(bigNum.dataset.target);
      animateValue(bigNum, t, bigNum.dataset.suffix || '', bigNum.dataset.prefix || '', 1800);
    }

    // Animate lever bars + values
    var bars = scene.querySelectorAll('.ds-lever-bar');
    bars.forEach(function(bar, i) {
      setTimeout(function() {
        bar.style.height = bar.dataset.height + 'px';
      }, i * 150);
    });
    var leverVals = scene.querySelectorAll('.ds-lever-val');
    leverVals.forEach(function(el, i) {
      setTimeout(function() {
        animateValue(el, parseFloat(el.dataset.target), el.dataset.suffix || '', '', 1200);
      }, i * 150);
    });

    // Animate ring fills + ring nums
    var rings = scene.querySelectorAll('.ds-ring-fill');
    rings.forEach(function(ring) {
      var pct = parseFloat(ring.dataset.fill) / 100;
      var circumference = 2 * Math.PI * 52;
      setTimeout(function() {
        ring.style.strokeDashoffset = circumference * (1 - pct);
      }, 300);
    });
    var ringNums = scene.querySelectorAll('.ds-ring-num');
    ringNums.forEach(function(el) {
      setTimeout(function() {
        animateValue(el, parseFloat(el.dataset.target), el.dataset.suffix || '', '', 1500);
      }, 400);
    });
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateScene(entry.target);
      }
    });
  }, { threshold: 0.3 });

  scenes.forEach(function(s) { observer.observe(s); });
})();

});
