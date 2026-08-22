window.APP_BUILD='2026-08-19A';(function(){try{var s=localStorage.getItem('lepidosBuildSeen');if(s!==null&&s!==window.APP_BUILD){localStorage.setItem('lepidosBuildSeen',window.APP_BUILD);location.reload();}else{localStorage.setItem('lepidosBuildSeen',window.APP_BUILD);}}catch(e){}})();
window.addEventListener('DOMContentLoaded', function () {
  var btn = document.getElementById('toolsBtn');
  var menu = document.getElementById('toolsDropdownMenu');
  if (btn && menu && !btn.dataset.menuBound) {
    btn.dataset.menuBound = '1';
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = menu.classList.contains('visible');
      menu.classList.toggle('visible', !open);
      menu.removeAttribute('hidden');
      btn.setAttribute('aria-expanded', String(!open));
    });
    menu.addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('click', function () {
      menu.classList.remove('visible');
      menu.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
    });
  }
});
if ('serviceWorker' in navigator) { window.addEventListener('load', function () { navigator.serviceWorker.register('./sw.js').catch(function () {}); }); }
