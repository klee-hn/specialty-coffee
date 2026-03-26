// Make sidebar nav section titles navigate directly to their section page.
// If already on that section's page, toggle the accordion instead.
document.querySelectorAll('.sidebar-nav details > summary').forEach(function (summary) {
  var details = summary.parentElement;
  var firstLink = details.querySelector('ul li:first-child a');
  if (!firstLink) return;
  var href = firstLink.getAttribute('href');

  summary.addEventListener('click', function (e) {
    e.preventDefault();
    var current = window.location.pathname.replace(/\/$/, '');
    var target = href.replace(/\/$/, '');
    if (current === target) {
      // Already on this page — just toggle accordion
      details.open ? details.removeAttribute('open') : details.setAttribute('open', '');
    } else {
      window.location.href = href;
    }
  });
});
