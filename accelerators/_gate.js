/* Rodney.AI — Accelerator content gate + password-protected downloads
   Shows header + first 2 cards, fades rest with CTA overlay.
   Download button requires SHA-256 password check.
   Default password: RodneyAI2026 — change the hash below to update. */

(function () {
  'use strict';

  /* ── CONFIG ─────────────────────────────────────────────── */
  var PASSWORD_HASH = '4f0eb8d9e5f785163c6d1bce5964e15a2a683772c26e3e962295633e49472afc';
  var CONTACT_EMAIL = 'advisor@rodney-ai.com';
  var SHOW_CARDS    = 2;   // cards visible before gate

  /* ── HELPERS ────────────────────────────────────────────── */
  function getPdfPath() {
    var page = window.location.pathname.split('/').pop().replace('.html', '');
    return 'downloads/' + page + '.pdf';
  }

  async function sha256(str) {
    var buf = new TextEncoder().encode(str);
    var hash = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hash)).map(function (b) {
      return b.toString(16).padStart(2, '0');
    }).join('');
  }

  /* ── DOWNLOAD BUTTON (appears in header) ────────────────── */
  function injectDownloadButton() {
    var header = document.querySelector('.header');
    if (!header) return;

    var btn = document.createElement('button');
    btn.className = 'dl-btn';
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>' +
      '<polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' +
      ' Download companion PDF';
    btn.addEventListener('click', openModal);
    header.appendChild(btn);
  }

  /* ── MODAL ──────────────────────────────────────────────── */
  var modal, pwdInput, errorMsg;

  function createModal() {
    modal = document.createElement('div');
    modal.className = 'dl-modal-overlay';
    modal.innerHTML =
      '<div class="dl-modal">' +
        '<button class="dl-modal-close" aria-label="Close">&times;</button>' +
        '<div class="dl-modal-icon">' +
          '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
          '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>' +
          '<path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' +
        '</div>' +
        '<h3>Enter access password</h3>' +
        '<p>This accelerator PDF is available to Rodney.AI clients.<br>' +
        'Don\'t have a password? <a href="mailto:' + CONTACT_EMAIL + '?subject=Accelerator%20PDF%20Access%20Request">Request access →</a></p>' +
        '<div class="dl-modal-form">' +
          '<input type="password" class="dl-pwd-input" placeholder="Password" autocomplete="off" />' +
          '<button class="dl-submit-btn">Download</button>' +
        '</div>' +
        '<div class="dl-error"></div>' +
      '</div>';
    document.body.appendChild(modal);

    pwdInput = modal.querySelector('.dl-pwd-input');
    errorMsg = modal.querySelector('.dl-error');

    modal.querySelector('.dl-modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    modal.querySelector('.dl-submit-btn').addEventListener('click', checkPassword);
    pwdInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') checkPassword();
    });
  }

  function openModal() {
    if (!modal) createModal();
    modal.classList.add('visible');
    errorMsg.textContent = '';
    pwdInput.value = '';
    setTimeout(function () { pwdInput.focus(); }, 120);
  }

  function closeModal() {
    modal.classList.remove('visible');
  }

  async function checkPassword() {
    var val = pwdInput.value.trim();
    if (!val) { errorMsg.textContent = 'Please enter a password.'; return; }

    var hash = await sha256(val);
    if (hash === PASSWORD_HASH) {
      closeModal();
      // trigger download
      var a = document.createElement('a');
      a.href = getPdfPath();
      a.download = '';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      errorMsg.textContent = 'Incorrect password. Contact ' + CONTACT_EMAIL + ' for access.';
      pwdInput.value = '';
      pwdInput.focus();
    }
  }

  /* ── CONTENT GATE (preview / fade) ──────────────────────── */
  function applyContentGate() {
    // Bypass gate with ?key=rodney
    var params = new URLSearchParams(window.location.search);
    if (params.get('key') === 'rodney') return;

    var cards = document.querySelectorAll('.card, .domain-section, .agent-card');
    if (cards.length < SHOW_CARDS + 1) return;

    var hidden = [];
    for (var i = SHOW_CARDS; i < cards.length; i++) {
      hidden.push(cards[i]);
    }
    if (!hidden.length) return;

    // Wrap hidden cards
    var wrapper = document.createElement('div');
    wrapper.className = 'gated-wrapper';
    hidden[0].parentNode.insertBefore(wrapper, hidden[0]);
    hidden.forEach(function (el) { wrapper.appendChild(el); });

    // Hide footer note
    var footerNote = document.querySelector('.footer-note');
    if (footerNote) footerNote.style.display = 'none';

    // Insert CTA
    var cta = document.createElement('div');
    cta.className = 'gate-cta';
    cta.innerHTML =
      '<h3>Want the full accelerator?</h3>' +
      '<p>This is a preview. To access the complete tool with all frameworks, models, and board-ready materials — get in touch.</p>' +
      '<a href="mailto:' + CONTACT_EMAIL + '?subject=Rodney.AI%20Accelerator%20Access" class="btn">Request full access →</a>' +
      '  <a href="../index.html#start" class="btn btn-ghost">Contact Rodney</a>';
    wrapper.parentNode.insertBefore(cta, wrapper.nextSibling);
  }

  /* ── INIT ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    injectDownloadButton();
    applyContentGate();
  });
})();
