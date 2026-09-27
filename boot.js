// Storage resilience proxy for private/incognito browsing and strict cookie environments
(function() {
  function createMemoryStorage() {
    var store = {};
    return {
      getItem: function(key) { return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null; },
      setItem: function(key, val) { store[key] = String(val); },
      removeItem: function(key) { delete store[key]; },
      clear: function() { store = {}; },
      key: function(i) { return Object.keys(store)[i] || null; },
      get length() { return Object.keys(store).length; }
    };
  }
  function wrapStorage(name) {
    var rawStorage = null;
    try {
      rawStorage = window[name];
      var testKey = '__storage_test__';
      rawStorage.setItem(testKey, '1');
      rawStorage.removeItem(testKey);
    } catch (e) {
      rawStorage = null;
    }
    if (!rawStorage) {
      var memStore = createMemoryStorage();
      try {
        Object.defineProperty(window, name, {
          value: memStore,
          configurable: true,
          writable: true
        });
      } catch (e) {
        window[name] = memStore;
      }
    } else {
      var origSetItem = rawStorage.setItem.bind(rawStorage);
      var origGetItem = rawStorage.getItem.bind(rawStorage);
      var origRemoveItem = rawStorage.removeItem.bind(rawStorage);
      var origClear = rawStorage.clear.bind(rawStorage);
      rawStorage.setItem = function(k, v) {
        try { return origSetItem(k, v); } catch (err) { console.warn('Storage setItem prevented error:', err); }
      };
      rawStorage.getItem = function(k) {
        try { return origGetItem(k); } catch (err) { return null; }
      };
      rawStorage.removeItem = function(k) {
        try { return origRemoveItem(k); } catch (err) {}
      };
      rawStorage.clear = function() {
        try { return origClear(); } catch (err) {}
      };
    }
  }
  wrapStorage('localStorage');
  wrapStorage('sessionStorage');
})();
window.APP_BUILD='2026-09-18A';(function(){try{var s=localStorage.getItem('lepidosBuildSeen');if(s!==null&&s!==window.APP_BUILD){localStorage.setItem('lepidosBuildSeen',window.APP_BUILD);location.reload();}else{localStorage.setItem('lepidosBuildSeen',window.APP_BUILD);}}catch(e){}})();
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
