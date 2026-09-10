(function (window, document) {
  if (window.FixOnceTravelWidget) return;

  var script = document.currentScript;
  if (!script || !script.src) return;

  var scriptUrl = new URL(script.src, document.baseURI);
  var iframe = document.createElement('iframe');

  iframe.src = new URL('/', scriptUrl.origin).href;
  iframe.title = 'Travel assistance chat';
  iframe.setAttribute('aria-label', 'Travel assistance chat');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = 'min(430px, 100vw)';
  iframe.style.height = 'min(720px, 100vh)';
  iframe.style.border = '0';
  iframe.style.background = 'transparent';
  iframe.style.zIndex = '2147483647';
  iframe.style.colorScheme = 'dark';

  document.body.appendChild(iframe);
  window.FixOnceTravelWidget = iframe;
})(window, document);
