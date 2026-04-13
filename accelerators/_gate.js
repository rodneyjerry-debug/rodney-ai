/* Rodney.AI — Accelerator content gate
   Shows the header + first 2 cards, then fades out with a CTA overlay. */
document.addEventListener('DOMContentLoaded', function () {
  // Bypass gate with ?key=rodney
  var params = new URLSearchParams(window.location.search);
  if (params.get('key') === 'rodney') return;

  var cards = document.querySelectorAll('.card, .domain-section, .agent-card');
  if (cards.length < 3) return;               // too short to gate

  var showCount = 2;                           // cards visible before gate
  var hidden = [];

  for (var i = showCount; i < cards.length; i++) {
    hidden.push(cards[i]);
  }
  if (!hidden.length) return;

  // Wrap hidden cards in a gated-wrapper div
  var wrapper = document.createElement('div');
  wrapper.className = 'gated-wrapper';
  hidden[0].parentNode.insertBefore(wrapper, hidden[0]);
  hidden.forEach(function (el) { wrapper.appendChild(el); });

  // Hide the footer-note too
  var footerNote = document.querySelector('.footer-note');
  if (footerNote) footerNote.style.display = 'none';

  // Insert CTA after the wrapper
  var cta = document.createElement('div');
  cta.className = 'gate-cta';
  cta.innerHTML =
    '<h3>Want the full accelerator?</h3>' +
    '<p>This is a preview. To access the complete tool with all frameworks, models, and board-ready materials — get in touch.</p>' +
    '<a href="mailto:rodneyjerry@yahoo.com?subject=Rodney.AI%20Accelerator%20Access" class="btn">Request full access →</a>' +
    '  <a href="../index.html#contact" class="btn btn-ghost">Contact Rodney</a>';
  wrapper.parentNode.insertBefore(cta, wrapper.nextSibling);
});