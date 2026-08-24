        (function() {
            const BASE = window.__BASE_PATH || './';

            // Build-version self-heal: if the served HTML belongs to a newer
            // build than this app.js bundle (stale service-worker or CDN
            // cache), reload once so the fresh bundle takes over.
            const BUILD_ID = '2026-08-19A';
            if (window.APP_BUILD && window.APP_BUILD !== BUILD_ID && sessionStorage.getItem('lepidosBuildChecked') !== '1') {
                sessionStorage.setItem('lepidosBuildChecked', '1');
                location.reload();
            }

            // ──────────────────────────────────────────────────────────
            //  TABLE OF CONTENTS — app.js
            //
            //   1.  Utility: debounce
            //   2.  DOM refs
            //   3.  Density canvas setup
            //   4.  State variables
            //   5.  i18n helper
            //   6.  Name resolution & localization helpers
            //   7.  Data getters & color mappers
            //   8.  Country style computation
            //   9.  Ethnic group & resource detail panels
            //  10.  Resource translation & continent/government lookup
            //  11.  D3 projection & SVG setup
            //  12.  Graticule & reference lines
            //  13.  Routes & corridors
            //  14.  Timezone overlay
            //  15.  Physical features (mountains & rivers)
            //  16.  New layer drawing functions
            //  17.  Toggle functions
            //  18.  Feature detail panels (wind, resources)
            //  19.  Canvas point layer drawing
            //  20.  Country labels
            //  21.  Tooltip & coordinates display
            //  22.  Style update & legend rendering
            //  23.  Color mode switching
            //  24.  Additional toggle functions
            //  25.  Language switching & UI i18n
            //  26.  Info overlay & reset zoom
            //  27.  Search & autocomplete
            //  28.  Country flag emoji map
            //  29.  Fly to country / highlight
            //  30.  Country info panel
            //  31.  Map transform & overlay positioning
            //  32.  D3 zoom behavior setup
            //  33.  Load world data & render countries
            //  34.  URL hash state management
            //  35.  Share / Reset
            //  36.  Keyboard shortcuts
            //  37.  init()
            //  38.  Interactive Onboarding Tutorial
            //  39.  Quiz Mode
            //  40.  Custom Questions localStorage
            //  41.  Quiz Mode Choice Screen
            //  42.  Custom Quiz Setup
            //  43.  Authoring Mode
            //  44.  Custom Quiz Run
            //  45.  Existing selective quiz event listeners
            //  46.  Map state capture/restore for quiz
            //  47.  Export Map to PDF
            //  48.  Event wiring & button listeners
            //  49.  Mobile UI event wiring
            //  50.  Menu toggle & panel buttons
            //  51.  Projection Explainer
            //  52.  Language overlay (i18n bootstrapper)
            // ──────────────────────────────────────────────────────────

            // ── Utility: debounce ──
            function debounce(fn, delay) {
                let timer;
                return function(...args) {
                    clearTimeout(timer);
                    timer = setTimeout(() => fn.apply(this, args), delay);
                };
            }
            function prefersReducedMotion() {
                return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            }
            function applyTheme(theme) {
                document.documentElement.setAttribute('data-theme', theme);
                try { localStorage.setItem('theme', theme); } catch (e) {}
            }
            function getInitialTheme() {
                var saved = null;
                try { saved = localStorage.getItem('theme'); } catch (e) {}
                if (saved === 'light' || saved === 'dark') return saved;
                return (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
            }
            applyTheme(getInitialTheme());

            // ── DOM refs ──
            const svgEl = document.getElementById('mapSvg');
            const tooltip = document.getElementById('tooltip');
            const legendEl = document.getElementById('legend');
            const infoOverlay = document.getElementById('infoOverlay');
            const coordinatesDisplay = document.getElementById('coordinatesDisplay');
            const copyNotification = document.getElementById('copyNotification');
            const langToggle = document.getElementById('langToggle');
            var langDropdownMenu = document.getElementById('langDropdownMenu');
            if (langDropdownMenu) {
                document.body.appendChild(langDropdownMenu);
                langDropdownMenu.style.position = 'fixed';
            }
            function positionLangDropdown() {
                if (!langToggle || !langDropdownMenu) return;
                var rect = langToggle.getBoundingClientRect();
                langDropdownMenu.style.top = (rect.bottom + 4) + 'px';
                if (document.documentElement.dir === 'rtl') {
                    langDropdownMenu.style.right = (window.innerWidth - rect.right) + 'px';
                    langDropdownMenu.style.left = 'auto';
                } else {
                    langDropdownMenu.style.left = rect.left + 'px';
                    langDropdownMenu.style.right = 'auto';
                }
            }
            function setActiveByAttr(buttons, selector) {
                buttons.forEach(function(b) {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                document.querySelectorAll(selector).forEach(function(b) {
                    b.classList.add('active');
                    b.setAttribute('aria-pressed', 'true');
                });
            }
            const modeButtons = document.querySelectorAll('.mode-btn');
            var religionButtons = [];
            const labelsToggle = document.getElementById('labelsToggle');
            const sectToggle = document.getElementById('sectToggle');
            const corridorsToggle = document.getElementById('routesToggle');
            const densitySpotsToggle = document.getElementById('densitySpotsToggle');
            const capitalsToggle = document.getElementById('capitalsToggle');
            const timezonesToggle = document.getElementById('timezonesToggle');
            const majorCitiesToggle = document.getElementById('majorCitiesToggle');
            const coordsToggle = document.getElementById('coordsToggle');
            const adminBoundariesToggle = document.getElementById('adminBoundariesToggle');
            const globeViewBtn = document.getElementById('globeViewBtn');
            const shareBtn = document.getElementById('shareBtn');
            const resetBtn = document.getElementById('resetBtn');
            const zoomInBtn = document.getElementById('zoomInBtn');
            const zoomOutBtn = document.getElementById('zoomOutBtn');
            const zoomResetBtn = document.getElementById('zoomResetBtn');
            const searchInput = document.getElementById('searchInput');
            const suggestionsList = document.getElementById('suggestionsList');
            const countryPanel = document.getElementById('countryPanel');
            const panelContent = document.getElementById('panelContent');
            const closePanelBtn = document.getElementById('closePanelBtn');
            const exportBtn = document.getElementById('exportBtn');
            const menuToggle = document.getElementById('menuToggle');
            const controlsBar = document.getElementById('controlsBar');
            const layersModal = document.getElementById('layersModal');
            const divisionPopover = document.getElementById('divisionPopover');
            const shortcutsOverlay = document.getElementById('shortcutsOverlay');
            const shortcutsBtn = document.getElementById('shortcutsBtn');
            const shortcutsClose = document.getElementById('shortcutsClose');
            const dataTableOverlay = document.getElementById('dataTableOverlay');
            const dataTableBtn = document.getElementById('dataTableBtn');
            const dataTableClose = document.getElementById('dataTableClose');
            const dataTableSearch = document.getElementById('dataTableSearch');
            const dataTableBody = document.getElementById('dataTableBody');
            const onboardingHint = document.getElementById('onboardingHint');
            const mapContainer = document.getElementById('mapContainer');

            /* ── Focus-trap utility (WCAG 2.2 modal dialogs) ─────────────────── */
            function trapFocus(dialogEl) {
                var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
                function getFocusables() {
                    return Array.prototype.slice.call(dialogEl.querySelectorAll(FOCUSABLE)).filter(function(el) {
                        return el.offsetParent !== null;
                    });
                }
                var previouslyFocused = document.activeElement;
                function handleKeydown(e) {
                    if (e.key !== 'Tab') return;
                    var focusables = getFocusables();
                    if (!focusables.length) return;
                    var first = focusables[0], last = focusables[focusables.length - 1];
                    if (e.shiftKey && document.activeElement === first) {
                        e.preventDefault(); last.focus();
                    } else if (!e.shiftKey && (document.activeElement === last || !dialogEl.contains(document.activeElement))) {
                        e.preventDefault(); first.focus();
                    }
                }
                dialogEl.addEventListener('keydown', handleKeydown);
                if (!dialogEl.contains(document.activeElement)) {
                    var initial = getFocusables();
                    if (initial.length) initial[0].focus();
                }
                return function release() {
                    dialogEl.removeEventListener('keydown', handleKeydown);
                    if (previouslyFocused && typeof previouslyFocused.focus === 'function' && previouslyFocused.isConnected &&
                        previouslyFocused.offsetParent !== null) {
                        previouslyFocused.focus();
                    }
                };
            }
            function watchDialogFocusTrap(dialogEl) {
                if (!dialogEl) return;
                var releaseFn = null;
                new MutationObserver(function() {
                    var visible = dialogEl.classList.contains('visible');
                    if (visible && !releaseFn) {
                        releaseFn = trapFocus(dialogEl);
                    } else if (!visible && releaseFn) {
                        releaseFn();
                        releaseFn = null;
                    }
                }).observe(dialogEl, { attributes: true, attributeFilter: ['class', 'style'] });
            }
            [
                'countryPanel', 'layersModal', 'divisionPopover', 'annotationsModal',
                'annotationLabelModal', 'annotationPlaceModal', 'mobileModeSheet', 'shortcutsOverlay', 'dataTableOverlay'
            ].forEach(function(id) { watchDialogFocusTrap(document.getElementById(id)); });
            document.addEventListener('keydown', function(e) {
                if (e.key !== 'Escape') return;
                function isVisible(id) {
                    var el = document.getElementById(id);
                    return !!(el && el.classList.contains('visible'));
                }
                var higherOverlay = isVisible('layersModal') || isVisible('divisionPopover') ||
                    isVisible('annotationsModal') || isVisible('annotationLabelModal');
                if (!higherOverlay && isVisible('dataTableOverlay')) {
                    e.stopImmediatePropagation();
                    document.getElementById('dataTableOverlay').classList.remove('visible');
                    return;
                }
                if (!higherOverlay && isVisible('shortcutsOverlay')) {
                    e.stopImmediatePropagation();
                    document.getElementById('shortcutsOverlay').classList.remove('visible');
                    return;
                }
                if (isVisible('annotationPlaceModal')) {
                    var placeModal = document.getElementById('annotationPlaceModal');
                    if (placeModal && typeof placeModal._placeCleanup === 'function') placeModal._placeCleanup();
                    e.stopImmediatePropagation();
                    return;
                }
                if (isVisible('annotationLabelModal')) {
                    var lblInput = document.getElementById('annotationLabelInput');
                    if (lblInput && typeof lblInput.onkeydown === 'function') {
                        lblInput.onkeydown({ key: 'Escape', preventDefault: function() {} });
                    }
                    e.stopImmediatePropagation();
                    return;
                }
                if (!higherOverlay && isVisible('countryPanel')) {
                    e.stopImmediatePropagation();
                    closeCountryPanel();
                    return;
                }
                if (!higherOverlay && isVisible('mobileModeSheet')) {
                    e.stopImmediatePropagation();
                    document.getElementById('mobileModeSheet').classList.remove('visible');
                }
            }, true);
            const densityCanvas = document.getElementById('densityCanvas');
            let densityCtx = null;
            const adminBoundariesCanvas = document.getElementById('adminBoundariesCanvas');
            let adminBoundariesCtx = null;

            // ── Density canvas setup ──
            function initDensityCanvas() {
                const rect = mapContainer.getBoundingClientRect();
                const dpr = window.devicePixelRatio || 1;
                densityCanvas.width = rect.width * dpr;
                densityCanvas.height = rect.height * dpr;
                densityCanvas.style.width = rect.width + 'px';
                densityCanvas.style.height = rect.height + 'px';
                densityCtx = densityCanvas.getContext('2d');
                densityCtx.scale(dpr, dpr);
                if (adminBoundariesCanvas) {
                    adminBoundariesCanvas.width = rect.width * dpr;
                    adminBoundariesCanvas.height = rect.height * dpr;
                    adminBoundariesCanvas.style.width = rect.width + 'px';
                    adminBoundariesCanvas.style.height = rect.height + 'px';
                    adminBoundariesCtx = adminBoundariesCanvas.getContext('2d');
                    adminBoundariesCtx.scale(dpr, dpr);
                }
            }

            // ── State variables ──
            let currentReligionFilter = 'all';
            let colorMode = 'normal';
            let selectedBloc = 'all';
            let showLabels = false;
            let sectMode = false;
            let corridorsVisible = false;
            let riversGlaciersVisible = false;
            let cbPatternsVisible = false;
            let densitySpotsMode = false;
            let capitalsVisible = false;
            let timezonesVisible = false;
            let majorCitiesVisible = false;
            let naturalResourcesVisible = false;
            let ethnicGroupsVisible = false;
            let oceanCurrentsVisible = false;
            let windsVisible = false;
            let earthquakesVisible = false;
            let volcanoesVisible = false;
            let additionalWaterwaysVisible = false;
            let historicalRoutesVisible = false;
            let geopoliticalBlocsVisible = false;
            let desertsForestsVisible = false;
            let borderDisputesVisible = false;
            let adminBoundariesVisible = false;
            let globeModeActive = false;
            let globeProjection = null;
            let globeRotation = [0, -20];
            let globeDragging = false;
            let globeRedrawPending = false;
            let globeDrag = null;
            let globeShadingGroup = null;
            let quizActive = false;
            let historyActive = false;
            let historyWarId = null;
            let historyScenarioId = null;
            let historySavedState = null;
            let historicalErasData = null;
            let historicalErasLoading = null;
            let historyTab = 'wars';
            let historyEraId = null;
            let currentSection = 'geo';
            let historyRegionFilter = 'all';
            let measureActive = false;
            let measurePoints = [];
            let gMeasure = null;
            let annotateActive = false;
            let annotateKind = 'pin';
            let annotateColor = '#eab308';
            let annotateFontSize = 10;
            let annotatePoints = [];
            let gAnnotations = null;
            let annotationsList = [];
            var ANNOT_FONT_LEVELS = [8, 10, 12, 14, 16, 20, 24];
            var _annotStrokePoints = null;
            var _annotStrokeActive = false;
            var _annotStrokePointerId = null;
            var _annotStrokeStartScreen = null;
            var _annotStrokePrevScreen = null;
            var _annotStrokePathLen = 0;
            var _annotStrokeAccum = null;
            var _annotStrokeRAF = null;
            var _annotPreviewEl = null;
            var _panSpaceHeld = false;
            let presentationModeActive = false;
            let exportInProgress = false;
            let currentSessionCode = null;
            let currentStudentName = null;
            let quizStartTime = null;
            let coordsVisible = true;
            let adminBoundariesData = null;
            let adminBoundariesLoading = null;
            let glaciatedAreasData = null;
            let glaciatedAreasLoading = null;
            let adminBoundariesMerged = null;
            let adminBoundariesCentroids = null;
            let adminNameTranslations = null;
            let adminNameTranslationsLoading = null;
            let _adminBoundariesRedrawTimeout = null;
            let lang = (function() { var s = localStorage.getItem('mapLang'); return s && ['ar','en','ru','uz','es'].includes(s) ? s : 'ar'; })();
            let allCountryFeatures = [];
            let countryPaths = null;
            let gCBPatterns = null;
            let selectedCountry = null;
            let compareCountry = null;
            let _lastPanelRenderTime = 0;
            let selectedFeature = null;
            let dataTableSortKey = 'name';
            let dataTableSortAsc = true;
            let selectedFeatureType = null; // 'mountain' | 'river' | null
            let gCapitals, gTimezones, gMajorCities, gNaturalResources, gEthnicGroups, gOceanCurrents, gWinds, gEarthquakes, gVolcanoes, gBorderDisputes, gAdminBoundaries, gGlaciatedAreas, gGeopoliticalBlocs, gDesertsForests, gHistoryOverlay, gHistoricalRoutes;
            let projection, pathGen;
            let svg, gMap, gCountries, gCountryLabels, gGraticule, gIceCap, gOcean, gCorridors, gPhysical, gTemperature, gAuthoringMarkers, gQuizMarkers;
            let currentTransform = d3.zoomIdentity;
            let _tooltipSize = { w: 180, h: 60 };
            let lastCanvasTransform = d3.zoomIdentity;
            let compareProjectionType = 'mercator';
            let compareSvg = null, compareG = null, compareCountriesG = null, compareZoomBehavior = null;
            let compareInitialized = false;
            let _isZooming = false;
            let _frozenCitySize = null;
            let zoomBehavior;
            let countryNamesList = [];
            let highlightTimeout = null;
            let countryLabelSelection = null;
            let _mapRectCache = null;
            let _mapRectFrame = 0;
            function getMapRect() {
                const frame = performance.now();
                if (_mapRectCache && Math.abs(frame - _mapRectFrame) < 16) return _mapRectCache;
                _mapRectCache = mapContainer.getBoundingClientRect();
                _mapRectFrame = frame;
                return _mapRectCache;
            }
            const MOBILE_BREAKPOINT = 768;
            let isMobile = window.innerWidth < MOBILE_BREAKPOINT;

            // ── Layer definitions registry ──
            //  Adding a new layer = adding one entry here + a draw function.
            //  The generic toggleLayer(), updateHash(), loadFromHash(),
            //  resetMapToNormalForQuiz() and restoreMapStateAfterQuiz() all
            //  read from this registry automatically.
            //
            //  Fields:
            //    var     – the boolean state variable name (string)
            //    btnId   – DOM id of the toggle button
            //    draw    – name of the draw function to call when toggled
            //    setNorm – if true, calling setMode('normal') when layer turns on
            //    hashKey – key used in the URL hash ('0'/'1')
            //    on      – (optional) extra callback(state, btn) after toggle
            //    skip    – (optional) if true, generic toggleLayer skips this;
            //              its toggle function is hand-written (labels, sect,
            //              routes, densitySpots, coords)
            const LAYER_DEFS = {
                labels:              { getFlag: function(){ return showLabels; },              setFlag: function(v){ showLabels = v; },              btnId: 'labelsToggle',              drawFn: null, hashKey: 'labels', skip: true },
                sect:                { getFlag: function(){ return sectMode; },                setFlag: function(v){ sectMode = v; },                btnId: 'sectToggle',                drawFn: null, hashKey: 'sect', skip: true },
                corridors:           { getFlag: function(){ return corridorsVisible; },        setFlag: function(v){ corridorsVisible = v; },        btnId: 'corridorsToggle',           drawFn: null, hashKey: 'corridors', skip: true },
                historicalRoutes:    { getFlag: function(){ return historicalRoutesVisible; }, setFlag: function(v){ historicalRoutesVisible = v; }, btnId: 'historicalRoutesToggle',    drawFn: drawHistoricalRoutes, hashKey: 'histroutes', setNorm: true },
                riversAndGlaciers:   { getFlag: function(){ return riversGlaciersVisible; },  setFlag: function(v){ riversGlaciersVisible = v; },  btnId: 'riversGlaciersToggle',      drawFn: function() { drawPhysicalFeatures(); drawGlaciatedAreas(); }, hashKey: 'riversglaciers', setNorm: true },
                densitySpots:        { getFlag: function(){ return densitySpotsMode; },        setFlag: function(v){ densitySpotsMode = v; },        btnId: 'densitySpotsToggle',        drawFn: null, hashKey: 'spots', skip: true },
                capitals:            { getFlag: function(){ return capitalsVisible; },         setFlag: function(v){ capitalsVisible = v; },         btnId: 'capitalsToggle',            drawFn: drawCapitals, postDrawFn: drawPointLayersCanvas, hashKey: 'capitals' },
                timezones:           { getFlag: function(){ return timezonesVisible; },        setFlag: function(v){ timezonesVisible = v; },        btnId: 'timezonesToggle',           drawFn: drawTimezones, hashKey: 'timezones' },
                majorCities:         { getFlag: function(){ return majorCitiesVisible; },      setFlag: function(v){ majorCitiesVisible = v; },      btnId: 'majorCitiesToggle',         drawFn: drawMajorCities, postDrawFn: drawPointLayersCanvas, hashKey: 'majorcities' },
                naturalResources:    { getFlag: function(){ return naturalResourcesVisible; }, setFlag: function(v){ naturalResourcesVisible = v; }, btnId: 'naturalResourcesToggle',    drawFn: drawNaturalResources, hashKey: 'natres', setNorm: true },
                ethnicGroups:        { getFlag: function(){ return ethnicGroupsVisible; },     setFlag: function(v){ ethnicGroupsVisible = v; },     btnId: 'ethnicGroupsToggle',        drawFn: drawEthnicGroups, hashKey: 'ethnic', setNorm: true },
                oceanCurrents:       { getFlag: function(){ return oceanCurrentsVisible; },    setFlag: function(v){ oceanCurrentsVisible = v; },    btnId: 'oceanCurrentsToggle',       drawFn: drawOceanCurrents, hashKey: 'currents', setNorm: true },
                winds:               { getFlag: function(){ return windsVisible; },           setFlag: function(v){ windsVisible = v; },            btnId: 'windsToggle',               drawFn: drawWinds, hashKey: 'winds', setNorm: true },
                earthquakes:         { getFlag: function(){ return earthquakesVisible; },      setFlag: function(v){ earthquakesVisible = v; },      btnId: 'earthquakesToggle',         drawFn: drawEarthquakes, hashKey: 'quakes', setNorm: true },
                volcanoes:           { getFlag: function(){ return volcanoesVisible; },        setFlag: function(v){ volcanoesVisible = v; },        btnId: 'volcanoesToggle',           drawFn: drawVolcanoes, hashKey: 'volcanoes' },
                geopoliticalBlocs:   { getFlag: function(){ return geopoliticalBlocsVisible; },setFlag: function(v){ geopoliticalBlocsVisible = v; },btnId: 'geopoliticalBlocsToggle',   drawFn: drawGeopoliticalBlocs, hashKey: 'blocs', setNorm: true,
                    on: function(state) { if (!state) { selectedBloc = 'all'; var bs = document.getElementById('blocSelect'); if (bs) bs.value = 'all'; } } },
                desertsForests:      { getFlag: function(){ return desertsForestsVisible; },   setFlag: function(v){ desertsForestsVisible = v; },   btnId: 'desertsForestsToggle',      drawFn: drawDesertsForests, hashKey: 'deserts', setNorm: true },
                borderDisputes:      { getFlag: function(){ return borderDisputesVisible; },   setFlag: function(v){ borderDisputesVisible = v; },   btnId: 'borderDisputesToggle',      drawFn: drawBorderDisputes, hashKey: 'borderdisputes', setNorm: true },
                adminBoundaries:    { getFlag: function(){ return adminBoundariesVisible; }, setFlag: function(v){ adminBoundariesVisible = v; }, btnId: 'adminBoundariesToggle',    drawFn: drawAdminBoundaries, hashKey: 'adminbounds' },
                coords:              { getFlag: function(){ return coordsVisible; },          setFlag: function(v){ coordsVisible = v; },           btnId: 'coordsToggle',              drawFn: null, hashKey: 'coords', skip: true,
                    on: function(state) { var cd = document.getElementById('coordinatesDisplay'); if (cd) cd.classList.toggle('hidden', !state); } }
            };

            const SKIP_LAYER_TOGGLE_FNS = {
                labels: toggleLabels,
                sect: toggleSect,
                corridors: toggleRoutes,
                densitySpots: toggleDensitySpots,
                coords: toggleCoords
            };

            function toggleLayerByName(name) {
                var def = LAYER_DEFS[name];
                if (!def) return;
                if (def.skip) {
                    var fn = SKIP_LAYER_TOGGLE_FNS[name];
                    if (fn) fn();
                    return;
                }
                toggleLayer(name);
            }

            function toggleLayer(name) {
                var def = LAYER_DEFS[name];
                if (!def || def.skip) return;
                var state = !def.getFlag();
                def.setFlag(state);
                var btn = document.getElementById(def.btnId);
                if (btn) {
                    btn.classList.toggle('toggle-on', state);
                    btn.setAttribute('aria-pressed', state ? 'true' : 'false');
                }
                if (state && def.setNorm) setMode('normal');
                if (def.drawFn) def.drawFn();
                if (def.postDrawFn) def.postDrawFn();
                if (def.on) def.on(state, btn);
                updateLegend();
                updateHash();
                updateActiveLayerCount();
            }

            // ── i18n helper ──
            function t(key, params = {}) {
                let s = i18n[lang]?.[key] || i18n.en[key] || key;
                for (let [k, v] of Object.entries(params)) s = s.replace(`{${k}}`, v);
                return s;
            }

            function locField(obj, base) {
                if (!obj) return '';
                var v = obj[base + '_' + lang];
                if (v === undefined || v === null) v = base ? obj[base] : undefined;
                if (v === undefined || v === null) v = obj[base + '_en'];
                if (v === undefined || v === null) v = obj[base + '_ar'];
                if (v === undefined || v === null) v = '';
                return String(v);
            }

            // ── Name resolution & localization helpers ──
            function htmlEscape(str) {
                const div = document.createElement('div');
                div.textContent = str;
                return div.innerHTML;
            }

            function getCleanName(rawName) {
                if (!rawName) return '';
                return rawName.replace(/^(Islamic Republic of|Republic of|State of|Kingdom of|Federal Republic of|Democratic Republic of|Commonwealth of|People's Republic of|United States of America|United Kingdom of Great Britain and Northern Ireland)\s+/i, '')
                    .replace(/\s*\(.*\)\s*/g, '').replace(/^Rep\.\s*/i, '').trim();
            }

            const NAME_ALIASES = {
                'czech republic': 'czechia',
                'dr congo': 'dem. rep. congo',
                'ivory coast': "côte d'ivoire",
                'south sudan': 's. sudan',
                'north macedonia': 'macedonia',
                'east timor': 'timor-leste',
                'cape verde': 'cabo verde',
                'burma': 'myanmar',
                'holland': 'netherlands',
                'swaziland': 'eswatini',
                'united states': 'united states of america',
                'czechia': 'czechia',
                'central african republic': 'central african rep.',
                'equatorial guinea': 'eq. guinea',
                'dominican republic': 'dominican rep.'
            };
            function canonicalName(rawName) {
                var c = getCleanName(rawName).toLowerCase();
                return NAME_ALIASES[c] || c;
            }
            function boundarySubstring(shorter, longer) {
                var idx = longer.indexOf(shorter);
                while (idx !== -1) {
                    if (idx === 0 || /[\s.\-]/.test(longer.charAt(idx - 1))) return true;
                    idx = longer.indexOf(shorter, idx + 1);
                }
                return false;
            }
            function namesMatch(a, b) {
                if (!a || !b) return false;
                return canonicalName(a) === canonicalName(b);
            }

            function getArabicName(enName) {
                if (!enName) return '';
                let clean = getCleanName(enName);
                if (arabicNames[clean]) return arabicNames[clean];
                if (arabicNames[enName]) return arabicNames[enName];
                for (let [k, v] of Object.entries(arabicNames))
                    if (clean.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(clean.toLowerCase()))
                        return v;
                return enName;
            }

            function getRussianName(enName) {
                if (!enName) return '';
                let clean = getCleanName(enName);
                if (russianNames[clean]) return russianNames[clean];
                if (russianNames[enName]) return russianNames[enName];
                for (let [k, v] of Object.entries(russianNames))
                    if (clean.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(clean.toLowerCase()))
                        return v;
                return enName;
            }

            function getUzbekName(enName) {
                if (!enName) return '';
                let clean = getCleanName(enName);
                if (uzbekNames[clean]) return uzbekNames[clean];
                if (uzbekNames[enName]) return uzbekNames[enName];
                for (let [k, v] of Object.entries(uzbekNames))
                    if (clean.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(clean.toLowerCase()))
                        return v;
                return enName;
            }

            function getSpanishName(enName) {
                if (!enName) return '';
                let clean = getCleanName(enName);
                if (spanishNames[clean]) return spanishNames[clean];
                if (spanishNames[enName]) return spanishNames[enName];
                for (let [k, v] of Object.entries(spanishNames))
                    if (clean.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(clean.toLowerCase()))
                        return v;
                return enName;
            }

            function getDisplayName(name) {
                if (!name) return '';
                if (lang === 'ar') return getArabicName(name);
                if (lang === 'ru') return getRussianName(name);
                if (lang === 'uz') return getUzbekName(name);
                if (lang === 'es') return getSpanishName(name);
                return name;
            }

            function getAdminDisplayName(enName) {
                if (!enName) return '';
                if (adminNameTranslations && adminNameTranslations[lang]) {
                    var trMap = adminNameTranslations[lang];
                    var tr = trMap[enName] || trMap[getCleanName(enName)];
                    if (tr) return tr;
                }
                let clean = getCleanName(enName);
                let exact = null;
                if (lang === 'ar') exact = arabicNames[clean] || arabicNames[enName];
                else if (lang === 'ru') exact = russianNames[clean] || russianNames[enName];
                else if (lang === 'uz') exact = uzbekNames[clean] || uzbekNames[enName];
                else if (lang === 'es') exact = spanishNames[clean] || spanishNames[enName];
                return exact || enName;
            }

            function getReligion(name) {
                if (!name) return 'unknown';
                if (religionByCountry[name]) return religionByCountry[name];
                const clean = getCleanName(name);
                if (religionByCountry[clean]) return religionByCountry[clean];
                for (let [k, v] of Object.entries(religionByCountry))
                    if (clean.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(clean.toLowerCase()))
                        return v;
                return 'unknown';
            }

            function getDenomination(name) {
                if (!name) return getReligion(name);
                if (denominationByCountry[name]) return denominationByCountry[name];
                const clean = getCleanName(name);
                if (denominationByCountry[clean]) return denominationByCountry[clean];
                for (let [k, v] of Object.entries(denominationByCountry))
                    if (clean.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(clean.toLowerCase()))
                        return v;
                return getReligion(name);
            }

            // ── Data getters & color mappers ──
            function getElevation(name) {
                if (!name) return null;
                if (elevationByCountry[name] !== undefined) return elevationByCountry[name];
                const clean = getCleanName(name);
                if (elevationByCountry[clean] !== undefined) return elevationByCountry[clean];
                return null;
            }

            function getDensity(name) {
                if (!name) return null;
                if (densityByCountry[name] !== undefined) return densityByCountry[name];
                const clean = getCleanName(name);
                if (densityByCountry[clean] !== undefined) return densityByCountry[clean];
                for (let [k, v] of Object.entries(densityByCountry))
                    if (clean.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(clean.toLowerCase()))
                        return v;
                return null;
            }

            function getPrecipitation(name) {
                if (!name) return null;
                if (precipitationByCountry[name] !== undefined) return precipitationByCountry[name];
                const clean = getCleanName(name);
                if (precipitationByCountry[clean] !== undefined) return precipitationByCountry[clean];
                return null;
            }

            function getTemperature(name, d) {
                if (!name) return null;
                if (tempByCountry[name] !== undefined) return tempByCountry[name];
                const clean = getCleanName(name);
                if (tempByCountry[clean] !== undefined) return tempByCountry[clean];
                if (d && d.geometry) {
                    const centroid = d3.geoCentroid(d);
                    if (centroid && !isNaN(centroid[1])) {
                        const lat = Math.abs(centroid[1]);
                        let est = 28 - lat * 0.8;
                        if (lat > 60) est = 28 - 60 * 0.8 - (lat - 60) * 1.2;
                        if (lat > 80) est = -20;
                        return Math.round(est);
                    }
                }
                return null;
            }

            function getTerrainColor(elev) {
                if (elev == null || isNaN(elev)) return MAP_COLORS.terrain[0];
                if (elev < 0) return MAP_COLORS.terrain[1];
                if (elev < 50) return MAP_COLORS.terrain[2];
                if (elev < 200) return MAP_COLORS.terrain[3];
                if (elev < 400) return MAP_COLORS.terrain[4];
                if (elev < 700) return MAP_COLORS.terrain[5];
                if (elev < 1200) return MAP_COLORS.terrain[6];
                if (elev < 2000) return MAP_COLORS.terrain[7];
                if (elev < 3000) return MAP_COLORS.terrain[8];
                if (elev < 4000) return MAP_COLORS.terrain[9];
                return MAP_COLORS.terrain[10];
            }

            function getDensityColor(dens) {
                if (dens == null || isNaN(dens)) return MAP_COLORS.density[0];
                if (dens < 1) return MAP_COLORS.density[1];
                if (dens < 10) return MAP_COLORS.density[2];
                if (dens < 50) return MAP_COLORS.density[3];
                if (dens < 100) return MAP_COLORS.density[4];
                if (dens < 200) return MAP_COLORS.density[5];
                if (dens < 500) return MAP_COLORS.density[6];
                if (dens < 1000) return MAP_COLORS.density[7];
                return MAP_COLORS.density[8];
            }

            function getPrecipitationColor(prec) {
                if (prec == null || isNaN(prec)) return MAP_COLORS.precipitation[0];
                if (prec < 100) return MAP_COLORS.precipitation[1];
                if (prec < 300) return MAP_COLORS.precipitation[2];
                if (prec < 600) return MAP_COLORS.precipitation[3];
                if (prec < 1000) return MAP_COLORS.precipitation[4];
                if (prec < 1500) return MAP_COLORS.precipitation[5];
                if (prec < 2000) return MAP_COLORS.precipitation[6];
                if (prec < 3000) return MAP_COLORS.precipitation[7];
                return MAP_COLORS.precipitation[8];
            }

            function getTempColor(temp) {
                if (temp == null || isNaN(temp)) return MAP_COLORS.temperature[0];
                if (temp < -10) return MAP_COLORS.temperature[1];
                if (temp < 0) return MAP_COLORS.temperature[2];
                if (temp < 10) return MAP_COLORS.temperature[3];
                if (temp < 15) return MAP_COLORS.temperature[4];
                if (temp < 20) return MAP_COLORS.temperature[5];
                if (temp < 25) return MAP_COLORS.temperature[6];
                if (temp < 30) return MAP_COLORS.temperature[7];
                return MAP_COLORS.temperature[8];
            }

            function getTimezoneColor(offset) {
                var tzColors = MAP_COLORS.timezones;
                if (offset <= -12) return tzColors[0];
                if (offset <= -9) return tzColors[1];
                if (offset <= -6) return tzColors[2];
                if (offset <= -3) return tzColors[3];
                if (offset <= 0) return tzColors[4];
                if (offset <= 3) return tzColors[5];
                if (offset <= 6) return tzColors[6];
                if (offset <= 9) return tzColors[7];
                return tzColors[8];
            }

            function getGDPColor(gdp) {
                if (gdp == null || isNaN(gdp)) return MAP_COLORS.gdp[0];
                if (gdp < 1000) return MAP_COLORS.gdp[1];
                if (gdp < 3000) return MAP_COLORS.gdp[2];
                if (gdp < 7000) return MAP_COLORS.gdp[3];
                if (gdp < 15000) return MAP_COLORS.gdp[4];
                if (gdp < 30000) return MAP_COLORS.gdp[5];
                if (gdp < 50000) return MAP_COLORS.gdp[6];
                if (gdp < 80000) return MAP_COLORS.gdp[7];
                return MAP_COLORS.gdp[8];
            }

            function getHDIColor(hdi) {
                if (hdi == null || isNaN(hdi)) return MAP_COLORS.hdi[0];
                if (hdi < 0.55) return MAP_COLORS.hdi[1];
                if (hdi < 0.70) return MAP_COLORS.hdi[2];
                if (hdi < 0.80) return MAP_COLORS.hdi[3];
                if (hdi < 0.90) return MAP_COLORS.hdi[4];
                return MAP_COLORS.hdi[5];
            }

            function getGDP(name) {
                if (!name) return null;
                if (gdpByCountry[name] !== undefined) return gdpByCountry[name];
                const clean = getCleanName(name);
                if (gdpByCountry[clean] !== undefined) return gdpByCountry[clean];
                return null;
            }

            function getHDI(name) {
                if (!name) return null;
                if (hdiByCountry[name] !== undefined) return hdiByCountry[name];
                const clean = getCleanName(name);
                if (hdiByCountry[clean] !== undefined) return hdiByCountry[clean];
                return null;
            }

            function getCountryInfo(name) {
                if (!name) return null;
                const cleanName = getCleanName(name);
                let info = countryInfo[name] || countryInfo[cleanName];
                if (!info) {
                    const altNames = {
                        'United States': 'United States of America',
                        'USA': 'United States of America',
                        'United States of America': 'United States',
                        'UK': 'United Kingdom',
                        'Great Britain': 'United Kingdom',
                        'Britain': 'United Kingdom',
                        'Russia': 'Russian Federation',
                        'Congo': 'Republic of the Congo',
                        'DR Congo': 'Democratic Republic of the Congo',
                        'Dem. Rep. Congo': 'Democratic Republic of the Congo',
                        'Czechia': 'Czech Republic',
                        'Ivory Coast': "Côte d'Ivoire",
                        'Western Sahara': 'W. Sahara'
                    };
                    if (altNames[name]) info = countryInfo[altNames[name]];
                    if (!info && altNames[cleanName]) info = countryInfo[altNames[cleanName]];
                    if (!info) {
                        for (let [k, v] of Object.entries(arabicNames)) {
                            if (v === name || v === cleanName) {
                                info = countryInfo[k];
                                break;
                            }
                        }
                    }
                }
                return info || null;
            }

            // ── Country style computation ──
            function hashStringToUnit(str) {
                let h = 0;
                for (let i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) | 0; }
                return (Math.abs(h) % 1000) / 1000;
            }
            function getNormalCountryColor(name) {
                const base = d3.color(MAP_COLORS.country.normal);
                const t = hashStringToUnit(name || '');
                const offset = (t - 0.5) * 0.16;
                return offset >= 0 ? base.brighter(offset * 1.6).toString() : base.darker(-offset * 1.6).toString();
            }
            function getCountryFilterAttr() {
                return colorMode === 'normal' ? 'url(#countryShadow)' : null;
            }

            function getCountryFill(d) {
                const name = d.properties?.name || '';
                if (colorMode === 'normal') return getNormalCountryColor(name);

                let base;
                if (colorMode === 'terrain') base = getTerrainColor(getElevation(name));
                else if (colorMode === 'density') base = getDensityColor(getDensity(name));
                else if (colorMode === 'precipitation') base = getPrecipitationColor(getPrecipitation(name));
                else if (colorMode === 'temperature') base = getTempColor(getTemperature(name, d));
                else if (colorMode === 'gdp') base = getGDPColor(getGDP(name));
                else if (colorMode === 'hdi') base = getHDIColor(getHDI(name));
                else if (sectMode) base = denominationColors[getDenomination(name)] || MAP_COLORS.country.defaultFill;
                else {
                    const rel0 = getReligion(name);
                    base = religionColors[rel0] || MAP_COLORS.country.defaultFill;
                }

                if (currentReligionFilter === 'all') return base;
                const rel = getReligion(name);
                if (rel === currentReligionFilter) return d3.color(base).brighter(0.6).toString();
                return MAP_COLORS.country.filterDim;
            }

            function getStroke(d) {
                if (colorMode === 'normal') return MAP_COLORS.country.normalStroke;
                const name = d.properties?.name || '';
                if (currentReligionFilter !== 'all' && getReligion(name) === currentReligionFilter) return '#fff';
                return MAP_COLORS.country.dimStroke;
            }

            function getStrokeWidth(d) { return 0.8; }

            function getOpacity(d) {
                if (colorMode === 'normal') return 0.95;
                if (currentReligionFilter === 'all') return 0.9;
                return (getReligion(d.properties?.name || '') === currentReligionFilter) ? 1 : 0.35;
            }

            /* ── Color-blind-safe pattern overlay (Stage 4) ──────────────────
               Adds a shape encoding (8 distinct repeating marks, dual-tone so
               they read on light and dark fills) on top of the choropleth fill,
               keyed to each mode's category/bucket index. */
            function ensureColorblindDefs() {
                var defs = svg.select('defs');
                if (!defs.empty() && !defs.select('#cbpat-0').empty()) return;
                var shapes = [
                    'M0,12 L12,0 M-6,6 L6,-6 M6,18 L18,6',          // 0 diagonal ↘
                    'M3,3 L3,3.01 M9,9 L9,9.01',                    // 1 dot grid (round caps)
                    'M0,0 L12,12 M12,0 L0,12',                      // 2 crosshatch
                    'M0,3 L12,3 M0,9 L12,9',                        // 3 horizontal
                    'M3,0 L3,12 M9,0 L9,12',                        // 4 vertical
                    'M0,0 L12,12 M-6,-6 L6,6 M6,18 L18,6',          // 5 diagonal ↗ dense
                    'M6,2.2 L6,2.21',                               // 6 small ring (circle below)
                    'M3,9 L6,4 L9,9'                                // 7 chevron
                ];
                for (var i = 0; i < shapes.length; i++) {
                    var p = defs.append('pattern')
                        .attr('id', 'cbpat-' + i)
                        .attr('width', 12).attr('height', 12)
                        .attr('patternUnits', 'userSpaceOnUse');
                    var inner = '';
                    if (i === 1) {
                        inner = '<circle cx="3" cy="3" r="1.7" fill="rgba(255,255,255,0.6)"/><circle cx="9" cy="9" r="1.7" fill="rgba(255,255,255,0.6)"/>' +
                                '<circle cx="3" cy="3" r="0.9" fill="rgba(0,0,0,0.5)"/><circle cx="9" cy="9" r="0.9" fill="rgba(0,0,0,0.5)"/>';
                    } else if (i === 6) {
                        inner = '<g stroke="rgba(255,255,255,0.55)" stroke-width="2.2" fill="none"><circle cx="6" cy="6" r="3"/></g>' +
                                '<g stroke="rgba(0,0,0,0.45)" stroke-width="1" fill="none"><circle cx="6" cy="6" r="3"/></g>';
                    } else {
                        inner = '<g transform="translate(0.8,0.8)" stroke="rgba(255,255,255,0.55)" stroke-width="2.4" fill="none" stroke-linecap="round">' +
                                '<path d="' + shapes[i] + '"/></g>' +
                                '<g stroke="rgba(0,0,0,0.45)" stroke-width="1" fill="none" stroke-linecap="round">' +
                                '<path d="' + shapes[i] + '"/></g>';
                    }
                    p.html(inner);
                }
            }
            function getCBBucket(d) {
                const name = d.properties?.name || '';
                if (colorMode === 'normal') return -1;
                if (currentReligionFilter !== 'all' && colorMode !== 'terrain' &&
                    getReligion(name) !== currentReligionFilter) return -1; // dimmed by filter: no pattern
                let idx = -1;
                if (colorMode === 'terrain') {
                    const elev = getElevation(name);
                    if (elev == null || isNaN(elev)) return -1;
                    const c = getTerrainColor(elev);
                    idx = MAP_COLORS.terrain.indexOf(c);
                } else if (colorMode === 'density') {
                    const v = getDensity(name);
                    idx = (v == null || isNaN(v)) ? -1 : MAP_COLORS.density.indexOf(getDensityColor(v));
                } else if (colorMode === 'precipitation') {
                    const v = getPrecipitation(name);
                    idx = (v == null || isNaN(v)) ? -1 : MAP_COLORS.precipitation.indexOf(getPrecipitationColor(v));
                } else if (colorMode === 'temperature') {
                    const v = getTemperature(name, d);
                    idx = (v == null || isNaN(v)) ? -1 : MAP_COLORS.temperature.indexOf(getTempColor(v));
                } else if (colorMode === 'gdp') {
                    const v = getGDP(name);
                    idx = (v == null || isNaN(v)) ? -1 : MAP_COLORS.gdp.indexOf(getGDPColor(v));
                } else if (colorMode === 'hdi') {
                    const v = getHDI(name);
                    idx = (v == null || isNaN(v)) ? -1 : MAP_COLORS.hdi.indexOf(getHDIColor(v));
                } else if (sectMode) {
                    const den = getDenomination(name);
                    idx = (den && denominationColors[den]) ? Object.keys(denominationColors).indexOf(den) : -1;
                } else {
                    const rel = getReligion(name);
                    idx = (rel && religionColors[rel]) ? Object.keys(religionColors).indexOf(rel) : -1;
                }
                return idx;
            }
            function drawColorblindOverlay() {
                if (!gCBPatterns || !countryPaths) return;
                if (!cbPatternsVisible || colorMode === 'normal') {
                    gCBPatterns.selectAll('path.cbpat').remove();
                    return;
                }
                ensureColorblindDefs();
                var data = allCountryFeatures.filter(function(d) { return getCBBucket(d) >= 0; });
                var sel = gCBPatterns.selectAll('path.cbpat').data(data, function(d) { return d.properties && d.properties.name || ''; });
                sel.exit().remove();
                sel.enter().append('path').attr('class', 'cbpat').attr('stroke', 'none').style('pointer-events', 'none');
                gCBPatterns.selectAll('path.cbpat')
                    .attr('d', function(d) { return pathGen(d); })
                    .attr('fill', function(d) { return 'url(#cbpat-' + (((getCBBucket(d) % 8) + 8) % 8) + ')'; });
            }
            function toggleColorblind() {
                cbPatternsVisible = !cbPatternsVisible;
                try { localStorage.setItem('cbPatterns', cbPatternsVisible ? '1' : '0'); } catch (e) {}
                var btn = document.getElementById('colorblindToggle');
                if (btn) {
                    btn.classList.toggle('toggle-on', cbPatternsVisible);
                    btn.setAttribute('aria-pressed', cbPatternsVisible ? 'true' : 'false');
                }
                drawColorblindOverlay();
                updateActiveLayerCount();
            }

            function getCorridorColor() {
                if (colorMode === 'terrain') return MAP_COLORS.corridor.terrain;
                if (colorMode === 'density') return MAP_COLORS.corridor.density;
                if (colorMode === 'precipitation') return MAP_COLORS.corridor.precipitation;
                if (colorMode === 'temperature') return MAP_COLORS.corridor.temperature;
                if (colorMode === 'normal') return MAP_COLORS.corridor.normal;
                return MAP_COLORS.corridor.other;
            }




            // ── Ethnic group & resource detail panels ──
            function showEthnicGroupDetail(d) {
                selectedFeature = d;
                selectedFeatureType = 'ethnicGroup';
                var displayName = lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en;
                var html = '<h3>👥 '+displayName+'</h3>';
                if (d.population_ar||d.population_en) html += '<p><strong>'+t('populationTitle')+':</strong> '+(lang==='ar'?d.population_ar:lang==='ru'?(d.population_ru||d.population_en):lang==='uz'?(d.population_uz||d.population_en):lang==='es'?(d.population_es||d.population_en):d.population_en)+'</p>';
                if (d.countries_ar||d.countries_en) html += '<p><strong>'+t('featureCountries')+':</strong> '+(lang==='ar'?d.countries_ar:lang==='ru'?(d.countries_ru||d.countries_en):lang==='uz'?(d.countries_uz||d.countries_en):lang==='es'?(d.countries_es||d.countries_en):d.countries_en)+'</p>';
                if (d.language_ar||d.language_en) html += '<p><strong>'+t('languageTitle')+':</strong> '+(lang==='ar'?d.language_ar:lang==='ru'?(d.language_ru||d.language_en):lang==='uz'?(d.language_uz||d.language_en):lang==='es'?(d.language_es||d.language_en):d.language_en)+'</p>';
                if (d.religion_ar||d.religion_en) html += '<p><strong>'+t('tooltipReligion')+':</strong> '+(lang==='ar'?d.religion_ar:lang==='ru'?(d.religion_ru||d.religion_en):lang==='uz'?(d.religion_uz||d.religion_en):lang==='es'?(d.religion_es||d.religion_en):d.religion_en)+'</p>';
                if (d.description_ar||d.description_en) html += '<p><strong>'+t('featureDescription')+':</strong> '+(lang==='ar'?d.description_ar:lang==='ru'?(d.description_ru||d.description_en):lang==='uz'?(d.description_uz||d.description_en):lang==='es'?(d.description_es||d.description_en):d.description_en)+'</p>';
                _lastPanelRenderTime = performance.now();
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }




            function translateResourceValue(val) {
                if (!val || lang === 'ar') return val;
                var match = val.match(/^([\d,.+]+)\s+(.+)$/);
                if (!match) return val;
                var num = match[1], unit = match[2];
                var u = i18n[lang] || {};
                var unitMap = {
                    'مليار برميل': u.unitBillionBarrels,
                    'تريليون م³': u.unitTrillionM3,
                    'تريليون م³/سنة': u.unitTrillionM3Year,
                    'تريليون متر مكعب': u.unitTrillionCubicMeters,
                    'جيجاواط': u.unitGigawatts,
                    'طن': u.unitTons,
                    'طن/سنة': u.unitTonsYear,
                    'مليون برميل/يوم': u.unitMillionBarrelsDay,
                    'ملايين برميل/يوم': u.unitMillionBarrelsDayPlural,
                    'مليون طن': u.unitMillionTons,
                    'ملايين طن': u.unitMillionTonsPlural,
                    'مليون طن/سنة': u.unitMillionTonsYear,
                    'ملايين طن/سنة': u.unitMillionTonsYearPlural,
                    'مليار طن': u.unitBillionTons,
                    'مليار طن/سنة': u.unitBillionTonsYear,
                    'مليار قيراط': u.unitBillionCarats,
                    'مليار م³/سنة': u.unitBillionM3Year,
                    'مليار متر مكعب/سنة': u.unitBillionCubicMetersYear,
                    'مليارات هكتار': u.unitBillionHectares,
                    'مليون قيراط': u.unitMillionCarats,
                    'مليون قيراط/سنة': u.unitMillionCaratsYear
                };
                var translated = unitMap[unit];
                return translated ? num + ' ' + translated : val;
            }

            // ── Resource translation & continent/government lookup ──
            function getContinent(name) {
                if (!name) return 'Unknown';
                const clean = getCleanName(name);
                if (continentByCountry[clean]) return continentByCountry[clean];
                if (continentByCountry[name]) return continentByCountry[name];
                const feature = allCountryFeatures.find(f => f.properties?.name === name || getCleanName(f.properties
                    ?.name) === clean);
                if (feature && feature.geometry) {
                    const centroid = d3.geoCentroid(feature);
                    if (centroid && !isNaN(centroid[0])) {
                        const lat = centroid[1],
                            lon = centroid[0];
                        if (lat > 60) return 'Europe';
                        if (lat < -50) return 'Antarctica';
                        if (lon > -25 && lon < 50 && lat > -35 && lat < 37) return 'Africa';
                        if (lon > -130 && lon < -60 && lat > 20) return 'North America';
                        if (lon > -85 && lon < -30 && lat < 10) return 'South America';
                        if (lon > 70 && lon < 150 && lat > 10) return 'Asia';
                        if (lon > 110 && lon < 180 && lat < -10) return 'Oceania';
                        if (lon > -10 && lon < 40 && lat > 35) return 'Europe';
                    }
                }
                return 'Unknown';
            }

            function getGovernment(name) {
                if (!name) return 'Unknown';
                const clean = getCleanName(name);
                if (governmentByCountry[clean]) return governmentByCountry[clean];
                if (governmentByCountry[name]) return governmentByCountry[name];
                return 'Unknown';
            }


            // ── D3 projection & SVG setup ──
            function getContainerDimensions() {
                const r = mapContainer.getBoundingClientRect();
                return { width: r.width, height: r.height };
            }

            function setupProjection(w, h) {
                const precision = isMobile ? 0.8 : 0.3;
                const proj = d3.geoPolyhedralWaterman()
                    .scale(Math.min(w, h) * 0.38)
                    .translate([w / 2, h / 2])
                    .rotate([0, 0])
                    .precision(precision);
                // Fit the full butterfly silhouette — poles included (the
                // polyhedral Waterman covers 90°N..90°S; there is no latitude
                // clip) — inside the viewport, so the Arctic lobe and both
                // polar vertices are never cut off by the container's
                // overflow clipping at the default view.
                try {
                    const bounds = d3.geoPath(proj).bounds({ type: 'Sphere' });
                    const bw = bounds[1][0] - bounds[0][0];
                    const bh = bounds[1][1] - bounds[0][1];
                    if (bw > 0 && bh > 0) {
                        proj.scale(proj.scale() * Math.min(w / bw, h / bh) * 0.96);
                    }
                } catch (e) {}
                return proj;
            }

            function createSvg() {
                const { width, height } = getContainerDimensions();
                svgEl.setAttribute('viewBox', `0 0 ${width} ${height}`);
                svgEl.setAttribute('width', width);
                svgEl.setAttribute('height', height);
                svg = d3.select(svgEl);
                svg.selectAll('*').remove();

                const defs = svg.append('defs');
                defs.append('radialGradient')
                    .attr('id', 'oceanGradient')
                    .attr('cx', '50%').attr('cy', '50%').attr('r', '70%')
                    .selectAll('stop')
                    .data(MAP_COLORS.oceanGradient.map(function(c, i) {
                        return { offset: ['0%','15%','20%','100%'][i], color: c };
                    }))
                    .join('stop')
                    .attr('offset', d => d.offset)
                    .attr('stop-color', d => d.color);

                const shadowFilter = defs.append('filter')
                    .attr('id', 'countryShadow')
                    .attr('x', '-20%').attr('y', '-20%')
                    .attr('width', '140%').attr('height', '140%')
                    .attr('color-interpolation-filters', 'sRGB');
                if (isMobile) {
                    shadowFilter.append('feFlood').attr('flood-color', 'transparent');
                } else {
                    shadowFilter.append('feDropShadow')
                        .attr('dx', 0)
                        .attr('dy', 1.5)
                        .attr('stdDeviation', 2.5)
                        .attr('flood-color', '#000000')
                        .attr('flood-opacity', 0.35);
                }

                gOcean = svg.append('g');
                gOcean.append('rect')
                    .attr('x', -500).attr('y', -500)
                    .attr('width', width + 1000).attr('height', height + 1000)
                    .attr('fill', 'url(#oceanGradient)');

                gGraticule = svg.append('g');
                gIceCap = svg.append('g');
                gCountries = svg.append('g');
                gCBPatterns = svg.append('g').attr('id', 'gColorblindPatterns');
                gCountryLabels = svg.append('g');

                // Ocean ↔ canvas unification: read the terminal stop of the
                // live ocean gradient and stamp that exact color onto the map
                // container and the page, so the projection's boundary can
                // never drift from the surrounding background (the ocean is a
                // <rect fill="url(#oceanGradient)"> — there is no fill-able
                // path.sphere here, so we read the SVG gradient instead of a
                // computed path fill).
                function syncOceanBackground() {
                    var grad = document.getElementById('oceanGradient');
                    var stops = grad ? grad.querySelectorAll('stop') : [];
                    var last = stops[stops.length - 1];
                    var color = last ? last.getAttribute('stop-color') : null;
                    if (!color || color === 'none') return;
                    var container = document.getElementById('mapContainer');
                    if (container) container.style.backgroundColor = color;
                    document.body.style.backgroundColor = color;
                }
                window.syncOceanBackground = syncOceanBackground;
                gPhysical = svg.append('g');
                gCorridors = svg.append('g');
                gHistoricalRoutes = svg.append('g').attr('id', 'historicalRoutesLayer');
                gTemperature = svg.append('g');
                gCapitals = svg.append('g');
                gTimezones = svg.append('g');
                gMajorCities = svg.append('g');
                gNaturalResources = svg.append('g');
                gEthnicGroups = svg.append('g');
                gOceanCurrents = svg.append('g');
                gWinds = svg.append('g');
                gEarthquakes = svg.append('g');
                gVolcanoes = svg.append('g');
                gGeopoliticalBlocs = svg.append('g');
                gHistoryOverlay = svg.append('g').attr('id', 'historyOverlayLayer');
                gDesertsForests = svg.append('g');
                gBorderDisputes = svg.append('g');
                gAdminBoundaries = svg.append('g');
                gGlaciatedAreas = svg.append('g');
                gAuthoringMarkers = svg.append('g');
                gQuizMarkers = svg.append('g');

                gMap = svg.append('g').attr('class', 'map-transform-group');
                [gOcean, gGraticule, gIceCap, gCountries, gCBPatterns, gAdminBoundaries, gGlaciatedAreas, gCountryLabels, gPhysical, gCorridors, gHistoricalRoutes, gTemperature, gCapitals, gTimezones, gMajorCities, gNaturalResources, gEthnicGroups, gOceanCurrents, gWinds, gEarthquakes, gVolcanoes, gGeopoliticalBlocs, gHistoryOverlay, gDesertsForests, gBorderDisputes, gAuthoringMarkers, gQuizMarkers]
                    .forEach(g => gMap.append(() => g.node()));

                projection = setupProjection(width, height);
                pathGen = d3.geoPath(projection);
                pathGen.pointRadius(isMobile ? 1.5 : 3);
            }

            function smoothedLinePath(coords) {
                var proj = getActiveProjection();
                var projected = coords.map(function(c) { return proj(c); }).filter(function(p) { return p && !isNaN(p[0]); });
                if (projected.length < 2) return '';
                var lineGen = d3.line().x(function(p){return p[0];}).y(function(p){return p[1];}).curve(d3.curveCatmullRom.alpha(0.5));
                return lineGen(projected);
            }

            // ── Graticule & reference lines ──
            function drawGraticule() {
                gGraticule.selectAll('*').remove();

                const graticule = d3.geoGraticule10();
                gGraticule.append('path')
                    .datum(graticule)
                    .attr('fill', 'none')
                    .attr('stroke', MAP_COLORS.graticule.line)
                    .attr('stroke-width', 0.5)
                    .attr('d', pathGen);

                const equator = {
                    type: 'LineString',
                    coordinates: d3.range(-180, 181, 10).map(lon => [lon, 0])
                };
                gGraticule.append('path')
                    .datum(equator)
                    .attr('fill', 'none')
                    .attr('stroke', MAP_COLORS.graticule.equator)
                    .attr('stroke-width', 1.2)
                    .attr('stroke-dasharray', '4,4')
                    .attr('opacity', 0.6)
                    .attr('d', pathGen);

                const tropicCancer = {
                    type: 'LineString',
                    coordinates: d3.range(-180, 181, 5).map(lon => [lon, 23.44])
                };
                gGraticule.append('path')
                    .datum(tropicCancer)
                    .attr('fill', 'none')
                    .attr('stroke', MAP_COLORS.graticule.tropic)
                    .attr('stroke-width', 0.8)
                    .attr('stroke-dasharray', '6,3')
                    .attr('opacity', 0.5)
                    .attr('d', pathGen);

                const tropicCapricorn = {
                    type: 'LineString',
                    coordinates: d3.range(-180, 181, 5).map(lon => [lon, -23.44])
                };
                gGraticule.append('path')
                    .datum(tropicCapricorn)
                    .attr('fill', 'none')
                    .attr('stroke', MAP_COLORS.graticule.tropic)
                    .attr('stroke-width', 0.8)
                    .attr('stroke-dasharray', '6,3')
                    .attr('opacity', 0.5)
                    .attr('d', pathGen);

                const primeMeridian = {
                    type: 'LineString',
                    coordinates: [
                        [0, -90],
                        [0, 90]
                    ]
                };
                gGraticule.append('path')
                    .datum(primeMeridian)
                    .attr('fill', 'none')
                    .attr('stroke', MAP_COLORS.graticule.meridian)
                    .attr('stroke-width', 0.8)
                    .attr('opacity', 0.4)
                    .attr('d', pathGen);

                const dateLine = {
                    type: 'LineString',
                    coordinates: [
                        [180, -90],
                        [180, 90]
                    ]
                };
                gGraticule.append('path')
                    .datum(dateLine)
                    .attr('fill', 'none')
                    .attr('stroke', MAP_COLORS.graticule.meridian)
                    .attr('stroke-width', 0.8)
                    .attr('opacity', 0.4)
                    .attr('d', pathGen);

                const arcticCircle = {
                    type: 'LineString',
                    coordinates: d3.range(-180, 181, 5).map(lon => [lon, 66.56])
                };
                gGraticule.append('path')
                    .datum(arcticCircle)
                    .attr('fill', 'none')
                    .attr('stroke', MAP_COLORS.graticule.polar)
                    .attr('stroke-width', 0.6)
                    .attr('stroke-dasharray', '2,6')
                    .attr('opacity', 0.4)
                    .attr('d', pathGen);

                const antarcticCircle = {
                    type: 'LineString',
                    coordinates: d3.range(-180, 181, 5).map(lon => [lon, -66.56])
                };
                gGraticule.append('path')
                    .datum(antarcticCircle)
                    .attr('fill', 'none')
                    .attr('stroke', MAP_COLORS.graticule.polar)
                    .attr('stroke-width', 0.6)
                    .attr('stroke-dasharray', '2,6')
                    .attr('opacity', 0.4)
                    .attr('d', pathGen);

                gGraticule.append('path')
                    .datum({ type: 'Sphere' })
                    .attr('fill', 'none')
                    .attr('stroke', MAP_COLORS.graticule.sphere)
                    .attr('stroke-width', 0.6)
                    .attr('opacity', 0.25)
                    .attr('d', pathGen);
            }

            // ── Arctic ice cap ──
            // The polar region above the Arctic Circle (66.56°N) drawn as a
            // solid ice region under the country layer, so coastlines stay
            // crisp on top of it. It is a real, clickable map feature: hover
            // shows a tooltip, click opens the Arctic feature panel.
            function drawIceCap() {
                if (!gIceCap) return;
                gIceCap.selectAll('*').remove();
                const cap = d3.geoCircle().center([0, 90]).radius(23.44).precision(1)();
                const proj = getActiveProjection();
                const jumpPx = Math.min(getMapRect().width, getMapRect().height) * 0.55;
                const splitResult = _adminSeamSplitGeometries(cap, proj, jumpPx);
                const pieces = Array.isArray(splitResult) ? splitResult : [cap];
                pieces.forEach(function(piece, i) {
                    const ringCoords = (piece.type === 'Polygon') ? piece.coordinates[0] : piece.coordinates;
                    const sample = ringCoords[Math.floor(ringCoords.length / 2)];
                    const featureReligion = getReligionAtPoint(sample);
                    const matchesFilter = (currentReligionFilter === 'all') || (featureReligion === currentReligionFilter);
                    const targetOpacity = matchesFilter ? 1 : 0.35;
                    gIceCap.append('path')
                        .datum(piece)
                        .attr('class', 'arctic-ice')
                        .attr('d', pathGen)
                        .style('opacity', targetOpacity)
                        .attr('tabindex', i === 0 ? 0 : -1)
                        .attr('role', 'button')
                        .attr('aria-label', function() { return t('arcticName'); })
                        .on('mouseenter', function(e) {
                            if (quizActive || measureActive || annotateActive) return;
                            tooltip.textContent = '';
                            const tmpDiv = document.createElement('div');
                            tmpDiv.innerHTML = '<div><strong>' + t('arcticName') + '</strong></div>';
                            while (tmpDiv.firstChild) tooltip.appendChild(tmpDiv.firstChild);
                            _pendingTooltipEvent = e;
                            _flushTooltipPosition();
                            tooltip.classList.add('visible');
                        })
                        .on('mousemove', function(e) {
                            if (quizActive || measureActive || annotateActive) return;
                            _pendingTooltipEvent = e;
                            if (!_tooltipRAFPending) {
                                _tooltipRAFPending = true;
                                requestAnimationFrame(_flushTooltipPosition);
                            }
                        })
                        .on('mouseleave', function() {
                            tooltip.classList.remove('visible');
                        })
                        .on('click', function(e) {
                            if (quizActive || measureActive || annotateActive) return;
                            e.stopPropagation();
                            showArcticDetail();
                        })
                        .on('keydown', function(e) {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                showArcticDetail();
                            }
                        });
                });
            }

            function showArcticDetail() {
                closeFeatureDetail();
                _lastPanelRenderTime = performance.now();
                let html = '<h3>🧊 ' + t('arcticName') + '</h3>';
                html += '<p><strong>' + t('arcticArea') + ':</strong> 14,056,000 ' + t('km2') + '</p>';
                html += '<p><strong>' + t('arcticAvgDepth') + ':</strong> ~1,205 m</p>';
                html += '<p><strong>' + t('arcticMaxDepth') + ':</strong> 5,549 m</p>';
                html += '<p>' + t('arcticDesc') + '</p>';
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                requestAnimationFrame(function() {
                    requestAnimationFrame(function() {
                        countryPanel.classList.add('visible');
                    });
                });
            }

            // ── Routes & corridors ──
            function showRouteDetail(d) {
                selectedFeature = d;
                selectedFeatureType = 'route';
                var displayName = lang==='ar'?d.name_ar:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en;
                var icon = d.type==='land'?'🚛':d.type==='sea'?'🚢':d.type==='air'?'✈️':d.type==='pipeline'?'🛢️':d.type==='canal'?'🚰':'🌊';
                var html = '<h3>'+icon+' '+displayName+'</h3>';
                if (d.length_km) html += '<p><strong>'+t('featureLength')+':</strong> '+d.length_km+' '+t('featureKm')+'</p>';
                if (d.countries_ar||d.countries_en) html += '<p><strong>'+t('featureCountries')+':</strong> '+(lang==='ar'?d.countries_ar:lang==='ru'?(d.countries_ru||d.countries_en):lang==='uz'?(d.countries_uz||d.countries_en):lang==='es'?(d.countries_es||d.countries_en):d.countries_en)+'</p>';
                var typeLabel = d.type==='land'?t('landRoute'):d.type==='sea'?t('seaRoute'):d.type==='canal'?t('canal'):d.type==='strait'?t('strait'):d.type==='air'?t('airRoute'):d.type==='pipeline'?t('pipeline'):d.type;
                html += '<p><strong>'+t('routeType')+':</strong> '+typeLabel+'</p>';
                _lastPanelRenderTime = performance.now();
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }
            function drawRoutes(skipFadeIn) {
                gCorridors.selectAll('*').remove();
                if (!corridorsVisible && !additionalWaterwaysVisible) return;
                var proj = getActiveProjection();
                var renderList = [];
                if (corridorsVisible) renderList = renderList.concat(corridorsData);
                if (additionalWaterwaysVisible) {
                    var existingNames = new Set(renderList.map(function(c) { return c.name_en; }));
                    var deduped = additionalWaterwaysData.filter(function(w) { return !existingNames.has(w.name_en); });
                    renderList = renderList.concat(deduped.map(function(w){
                        return { name_ar: w.name, name_en: w.name_en, name_ru: w.name_ru || featureRussian.corridors[w.name_en] || w.name_en, name_uz: w.name_uz || featureUzbek.corridors[w.name_en] || w.name_en, name_es: w.name_es || (typeof featureSpanish!=='undefined'&&featureSpanish.corridors&&featureSpanish.corridors[w.name_en]) || w.name_en, coords: w.coords, type: w.type==='canal'?'canal':w.type==='strait'?'strait':'sea', length_km: w.length_km, countries_ar: w.countries_ar, countries_en: w.countries_en, countries_ru: w.countries_ru || w.countries_en, countries_uz: w.countries_uz || w.countries_en, countries_es: w.countries_es || w.countries_en };
                    }));
                }
                renderList.forEach(function(c) {
                    var color = MAP_COLORS.routes[c.type] || MAP_COLORS.routes.other;
                    var points = c.coords;
                    var _sel = gCorridors.append('path').datum({type:'LineString', coordinates:points}).attr('d',pathGen).attr('fill','none').attr('stroke',color).attr('stroke-width',isMobile?7:10).attr('vector-effect','non-scaling-stroke').style('cursor','pointer').on('click',function(){showRouteDetail(c);});
                    if (skipFadeIn) _sel.attr('opacity',0.35); else _sel.attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.35);
                    _sel = gCorridors.append('path').datum({type:'LineString', coordinates:points}).attr('d',pathGen).attr('fill','none').attr('stroke',color).attr('stroke-width',isMobile?2.5:3).attr('vector-effect','non-scaling-stroke').style('pointer-events','none');
                    if (skipFadeIn) _sel.attr('opacity',1); else _sel.attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',1);
                    var first = points[0], last = points[points.length-1];
                    [first,last].forEach(function(p){
                        var xy = proj(p);
                        if (!xy||isNaN(xy[0])) return;
                        var _sel2 = gCorridors.append('circle').attr('cx',xy[0]).attr('cy',xy[1]).attr('r',isMobile?2.5:3.5).attr('fill',color).attr('stroke','#fff').attr('stroke-width',0.5).attr('vector-effect','non-scaling-stroke').style('pointer-events','none');
                        if (skipFadeIn) _sel2.attr('opacity',1); else _sel2.attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',1);
                    });
                    var mid = points[Math.floor(points.length/2)];
                    var mxy = proj(mid);
                    if (mxy&&!isNaN(mxy[0])) {
                        var _sel3 = gCorridors.append('text').attr('x',mxy[0]).attr('y',mxy[1]-4).text(function(){return lang==='ar'?c.name_ar:lang==='ru'?(c.name_ru||c.name_en):lang==='uz'?(c.name_uz||c.name_en):lang==='es'?(c.name_es||c.name_en):c.name_en;}).attr('fill','#fff').attr('font-size',isMobile?6:8).attr('text-anchor','middle').style('pointer-events','none');
                        if (skipFadeIn) _sel3.attr('opacity',0.85); else _sel3.attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.85);
                    }
                });
            }
            // Legacy draw functions redirect to unified drawRoutes
            function drawCorridors() { drawRoutes(); }
            function drawAdditionalWaterways() { drawRoutes(); }

            function showHistoricalRouteDetail(d) {
                selectedFeature = d;
                selectedFeatureType = 'histRoute';
                var displayName = locField(d, 'name');
                var html = '<h3>📜 ' + htmlEscape(displayName) + '</h3>';
                var era = locField(d, 'era');
                if (era) html += '<p><strong>' + t('histRouteEra') + ':</strong> ' + htmlEscape(era) + '</p>';
                var desc = locField(d, 'desc');
                if (desc) html += '<p>' + htmlEscape(desc) + '</p>';
                if (d.src) html += '<p class="hist-disclaimer-mini"><strong>' + t('histRouteSource') + ':</strong> ' + htmlEscape(d.src) + '</p>';
                _lastPanelRenderTime = performance.now();
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }
            window.drawHistoricalRoutes = drawHistoricalRoutes;
            function drawHistoricalRoutes(skipFadeIn) {
                gHistoricalRoutes.selectAll('*').remove();
                if (!historicalRoutesVisible) return;
                var proj = getActiveProjection();
                var dur = prefersReducedMotion() ? 0 : 300;
                var histYear = null;
                if (historyActive) {
                    if (historyTab === 'eras' && historicalErasData) {
                        var _he = historicalErasData.find(function(x) { return x.id === historyEraId; }) || historicalErasData[0];
                        if (_he) histYear = _he.sort;
                    } else if (historyTab === 'wars') {
                        var _hw = historicalWarsData.find(function(x) { return x.id === historyWarId; });
                        if (_hw) {
                            var _hs = _hw.scenarios.find(function(x) { return x.id === historyScenarioId; }) || _hw.scenarios[0];
                            if (_hs) { var _hn = parseInt(_hs.year, 10); if (!isNaN(_hn)) histYear = _hn; }
                        }
                    }
                }
                historicalRoutesData.forEach(function(r) {
                    if (histYear !== null && ((r.from !== undefined && histYear < r.from) || (r.to !== undefined && r.to !== null && histYear > r.to))) return;
                    var points = r.coords;
                    var halo = gHistoricalRoutes.append('path').datum({type:'LineString', coordinates:points}).attr('d',pathGen).attr('fill','none').attr('stroke',r.color).attr('stroke-width',isMobile?8:11).attr('stroke-opacity',0.22).attr('vector-effect','non-scaling-stroke').style('cursor','pointer').on('click',function(){showHistoricalRouteDetail(r);});
                    var line = gHistoricalRoutes.append('path').datum({type:'LineString', coordinates:points}).attr('d',pathGen).attr('fill','none').attr('stroke',r.color).attr('stroke-width',isMobile?2.5:3).attr('stroke-dasharray','10,6').attr('vector-effect','non-scaling-stroke').style('pointer-events','none');
                    var first = points[0], last = points[points.length-1];
                    [first,last].forEach(function(p){
                        var xy = proj(p);
                        if (!xy||isNaN(xy[0])) return;
                        gHistoricalRoutes.append('circle').attr('cx',xy[0]).attr('cy',xy[1]).attr('r',isMobile?2.5:3.5).attr('fill',r.color).attr('stroke','#fff').attr('stroke-width',0.6).attr('vector-effect','non-scaling-stroke').style('pointer-events','none');
                    });
                    var mid = points[Math.floor(points.length/2)];
                    var mxy = proj(mid);
                    if (mxy&&!isNaN(mxy[0])) {
                        gHistoricalRoutes.append('text').attr('x',mxy[0]).attr('y',mxy[1]-5).text(function(){return locField(r,'name');}).attr('fill',r.color).attr('font-size',isMobile?7:9).attr('font-weight','bold').attr('text-anchor','middle').attr('paint-order','stroke').attr('stroke','rgba(0,0,0,0.7)').attr('stroke-width',2.5).style('pointer-events','none');
                    }
                    if (skipFadeIn) { halo.attr('opacity',1); line.attr('opacity',0.95); }
                    else {
                        halo.attr('opacity',0).transition().duration(dur).attr('opacity',1);
                        line.attr('opacity',0).transition().duration(dur).attr('opacity',0.95);
                    }
                });
            }

            function drawCapitals() {
                gCapitals.selectAll('*').remove();
            }

            function drawMajorCities() {
                gMajorCities.selectAll('*').remove();
            }

            // ── Timezone overlay ──
            function drawTimezones(skipFadeIn) {
                gTimezones.selectAll('*').remove();
                if (!timezonesVisible) return;
                timezoneBoundariesData.forEach(function(tz) {
                    var rings = tz.coordinates;
                    var lineGeometry = rings.length > 1
                        ? { type: 'MultiLineString', coordinates: rings }
                        : { type: 'LineString', coordinates: rings[0] };
                    var geoFeature = { type: 'Feature', geometry: lineGeometry, properties: { zone: tz.zone, label: tz.label, places: tz.places } };
                    var color = getTimezoneColor(tz.zone);

                    // Halo (soft, wide, low-opacity)
                    gTimezones.append('path')
                        .datum(geoFeature)
                        .attr('d', pathGen)
                        .attr('fill', 'none')
                        .attr('stroke', color)
                        .attr('stroke-width', isMobile ? 3 : 5)
                        .attr('stroke-opacity', 0.25)
                        .attr('vector-effect', 'non-scaling-stroke')
                        .style('pointer-events', 'none');

                    // Main boundary line
                    var mainPath = gTimezones.append('path')
                        .datum(geoFeature)
                        .attr('d', pathGen)
                        .attr('fill', 'none')
                        .attr('stroke', color)
                        .attr('stroke-width', isMobile ? 1.2 : 1.8)
                        .attr('stroke-opacity', 0.9)
                        .attr('vector-effect', 'non-scaling-stroke')
                        .style('cursor', 'pointer')
                        .on('mouseenter', function(e) {
                            mainPath.attr('stroke-width', isMobile ? 2 : 3);
                            tooltip.textContent = tz.label + ' — ' + tz.places;
                            tooltip.classList.add('visible');
                        })
                        .on('mousemove', function(e) {
                            _pendingTooltipEvent = e;
                            if (!_tooltipRAFPending) {
                                _tooltipRAFPending = true;
                                requestAnimationFrame(_flushTooltipPosition);
                            }
                        })
                        .on('mouseleave', function() {
                            mainPath.attr('stroke-width', isMobile ? 1.2 : 1.8);
                            tooltip.classList.remove('visible');
                        })
                        .on('click', function() { showFeatureDetail('timezone', tz); });

                    // Clickable centroid marker — compute in lon/lat, then project
                    var centroidLonLat = d3.geoCentroid(geoFeature);
                    if (centroidLonLat && !isNaN(centroidLonLat[0]) && !isNaN(centroidLonLat[1])) {
                        var centroid = getActiveProjection()(centroidLonLat);
                        if (centroid && !isNaN(centroid[0]) && !isNaN(centroid[1])) {
                            gTimezones.append('circle')
                                .attr('cx', centroid[0])
                                .attr('cy', centroid[1])
                                .attr('r', isMobile ? 3 : 4)
                                .attr('fill', color)
                                .attr('fill-opacity', 0.85)
                                .attr('stroke', '#fff')
                                .attr('stroke-width', 0.5)
                                .style('cursor', 'pointer')
                                .on('mouseenter', function(e) {
                                    mainPath.attr('stroke-width', isMobile ? 2 : 3);
                                    tooltip.textContent = tz.label + ' — ' + tz.places;
                                    tooltip.classList.add('visible');
                                })
                                .on('mousemove', function(e) {
                                    _pendingTooltipEvent = e;
                                    if (!_tooltipRAFPending) {
                                        _tooltipRAFPending = true;
                                        requestAnimationFrame(_flushTooltipPosition);
                                    }
                                })
                                .on('mouseleave', function() {
                                    mainPath.attr('stroke-width', isMobile ? 1.2 : 1.8);
                                    tooltip.classList.remove('visible');
                                })
                                .on('click', function() { showFeatureDetail('timezone', tz); });
                        }
                    }
                });
            }

            // ── Physical features (mountains & rivers) ──
            function getReligionAtPoint(coord) {
                if (!coord) return 'unknown';
                for (let i = 0; i < allCountryFeatures.length; i++) {
                    try {
                        if (d3.geoContains(allCountryFeatures[i], coord)) {
                            return getReligion(allCountryFeatures[i].properties?.name || '');
                        }
                    } catch (e) {}
                }
                return 'unknown';
            }

            function drawPhysicalFeatures() {
                gPhysical.selectAll('*').remove();
                var proj = getActiveProjection();

                const showMountains = (colorMode === 'terrain');
                const showRivers   = (colorMode === 'terrain') || riversGlaciersVisible;
                if (!showMountains && !showRivers) return;

                if (showMountains) {
                    mountainRanges.forEach(m => {
                        const featureReligion = getReligionAtPoint(m.coords[Math.floor(m.coords.length / 2)]);
                        const matchesFilter = (currentReligionFilter === 'all') || (featureReligion === currentReligionFilter);
                        const targetOpacity = matchesFilter ? 1 : 0.35;
                        const w = m.weight || 1;
                        const grp = gPhysical.append('g')
                            .attr('class', 'terrain-feature')
                            .style('cursor', 'pointer');
                        grp.append('path')
                            .datum({type:'LineString', coordinates: m.coords})
                            .attr('d', pathGen)
                            .attr('fill', 'none')
                            .attr('stroke', MAP_COLORS.physical.mountainShadow)
                            .attr('stroke-width', w * (isMobile ? 2.2 : 3.8))
                            .attr('stroke-linecap', 'round')
                            .attr('stroke-linejoin', 'round')
                            .attr('vector-effect', 'non-scaling-stroke')
                            .attr('opacity', 0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity', 0.45 * targetOpacity);
                        const mainPath = grp.append('path')
                            .datum({type:'LineString', coordinates: m.coords})
                            .attr('d', pathGen)
                            .attr('fill', 'none')
                            .attr('stroke', w === 3 ? MAP_COLORS.physical.mountainMajor : w === 2 ? MAP_COLORS.physical.mountainImportant : MAP_COLORS.physical.mountainMinor)
                            .attr('stroke-width', w * (isMobile ? 1.1 : 1.8))
                            .attr('stroke-linecap', 'round')
                            .attr('stroke-linejoin', 'round')
                            .attr('vector-effect', 'non-scaling-stroke')
                            .attr('data-feature', 'mountain')
                            .attr('data-name', m.name)
                            .attr('opacity', 0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity', 0.95 * targetOpacity);
                        const step = w === 3 ? 1 : 2;
                        m.coords.forEach((coord, i) => {
                            if (i % step !== 0) return;
                            const pr = proj(coord);
                            if (!pr || isNaN(pr[0])) return;
                            const [px, py] = pr;
                            const s = w * (isMobile ? 2 : 3.2);
                            grp.append('path')
                                .attr('d', `M${px},${py - s} L${px - s * 0.75},${py + s * 0.55} L${px + s * 0.75},${py + s * 0.55} Z`)
                                .attr('fill', w === 3 ? MAP_COLORS.physical.mountainPeakMajor : w === 2 ? MAP_COLORS.physical.mountainPeakImportant : MAP_COLORS.physical.mountainPeakMinor)
                                .attr('stroke', MAP_COLORS.physical.mountainShadow)
                                .attr('stroke-width', 0.3)
                                .attr('opacity', 0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity', 0.9 * targetOpacity);
                        });
                        grp.on('mouseenter', function() { mainPath.attr('stroke', MAP_COLORS.physical.mountainHover).attr('opacity', Math.min(1, targetOpacity)); })
                            .on('mouseleave', function() { mainPath.attr('stroke', w === 3 ? MAP_COLORS.physical.mountainMajor : w === 2 ? MAP_COLORS.physical.mountainImportant : MAP_COLORS.physical.mountainMinor).attr('opacity', 0.95 * targetOpacity); })
                            .on('click', function(e) { e.stopPropagation(); showFeatureDetail('mountain', m); });
                    });
                }

                if (showRivers) {
                    [1, 2, 3].forEach(wLevel => {
                        rivers.filter(r => (r.weight || 1) === wLevel).forEach(r => {
                            const featureReligion = getReligionAtPoint(r.coords[Math.floor(r.coords.length / 2)]);
                            const matchesFilter = (currentReligionFilter === 'all') || (featureReligion === currentReligionFilter);
                            const targetOpacity = matchesFilter ? 1 : 0.35;
                            const w = r.weight || 1;
                            const grp = gPhysical.append('g')
                                .attr('class', 'terrain-feature')
                                .style('cursor', 'pointer');
                            grp.append('path')
                                .datum({type:'LineString', coordinates: r.coords})
                                .attr('d', pathGen)
                                .attr('fill', 'none')
                                .attr('stroke', MAP_COLORS.physical.riverHalo)
                                .attr('stroke-width', w * (isMobile ? 1.8 : 2.8))
                                .attr('stroke-linecap', 'round')
                                .attr('stroke-linejoin', 'round')
                                .attr('vector-effect', 'non-scaling-stroke')
                                .attr('opacity', 0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity', 0.3 * targetOpacity);
                            const mainPath = grp.append('path')
                                .datum({type:'LineString', coordinates: r.coords})
                                .attr('d', pathGen)
                                .attr('fill', 'none')
                                .attr('stroke', w === 3 ? MAP_COLORS.physical.riverMajor : w === 2 ? MAP_COLORS.physical.riverImportant : MAP_COLORS.physical.riverMinor)
                                .attr('stroke-width', w * (isMobile ? 0.9 : 1.4))
                                .attr('stroke-linecap', 'round')
                                .attr('stroke-linejoin', 'round')
                                .attr('vector-effect', 'non-scaling-stroke')
                                .attr('data-feature', 'river')
                                .attr('data-name', r.name)
                                .attr('opacity', 0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity', 0.88 * targetOpacity);
                            grp.on('mouseenter', function() { mainPath.attr('stroke', MAP_COLORS.physical.riverHover).attr('opacity', Math.min(1, targetOpacity)); })
                                .on('mouseleave', function() { mainPath.attr('stroke', w === 3 ? MAP_COLORS.physical.riverMajor : w === 2 ? MAP_COLORS.physical.riverImportant : MAP_COLORS.physical.riverMinor).attr('opacity', 0.88 * targetOpacity); })
                                .on('click', function(e) { e.stopPropagation(); showFeatureDetail('river', r); });
                        });
                    });
                }
            }

            // ── New layer drawing functions ──
            function showResourceDetail(d) {
                selectedFeature = d;
                selectedFeatureType = 'resource';
                var displayName = lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en;
                var typeLabel = d.type==='oil'?'🛢️':d.type==='gas'?'🔥':d.type==='coal'?'⛏️':d.type==='metal'?'🔩':d.type==='precious'?'💎':d.type==='nuclear'?'☢️':d.type==='renewable'?'♻️':d.type==='water'?'💧':d.type==='forest'?'🌲':'🗿';
                var html = '<h3>'+typeLabel+' '+displayName+'</h3>';
                if (d.countries_ar||d.countries_en) html += '<p><strong>'+t('featureCountries')+':</strong> '+(lang==='ar'?d.countries_ar:lang==='ru'?(d.countries_ru||d.countries_en):lang==='uz'?(d.countries_uz||d.countries_en):lang==='es'?(d.countries_es||d.countries_en):d.countries_en)+'</p>';
                if (d.reserves) html += '<p><strong>'+t('reserves')+':</strong> '+translateResourceValue(d.reserves)+'</p>';
                if (d.production) html += '<p><strong>'+t('production')+':</strong> '+translateResourceValue(d.production)+'</p>';
                if (d.capacity) html += '<p><strong>'+t('capacity')+':</strong> '+translateResourceValue(d.capacity)+'</p>';
                if (d.description_ar||d.description_en) html += '<p><strong>'+t('featureDescription')+':</strong> '+(lang==='ar'?d.description_ar:lang==='ru'?(d.description_ru||d.description_en):lang==='uz'?(d.description_uz||d.description_en):lang==='es'?(d.description_es||d.description_en):d.description_en)+'</p>';
                _lastPanelRenderTime = performance.now();
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }
            function drawNaturalResources() {
                gNaturalResources.selectAll('*').remove();
                if (!naturalResourcesVisible) return;
                var k = Math.max(0.4, currentTransform.k);
                var resourceColorMap = MAP_COLORS.naturalResources;
                var r = Math.max(4, Math.min(14, (isMobile ? 6 : 8) * Math.pow(k, 0.4)));
                var fontSize = Math.max(3, Math.min(16, (isMobile ? 9 : 12) / k));
                if (!gNaturalResources.on('click')) {
                    gNaturalResources.on('click', function(e) {
                        if (e.target.tagName === 'circle') {
                            var dd = d3.select(e.target).datum();
                            if (dd) showResourceDetail(dd);
                        }
                    });
                }
                var proj = getActiveProjection();
                naturalResourcesData.forEach(function(d) {
                    var xy = proj(Array.isArray(d.coords[0]) ? d.coords[0] : d.coords);
                    if (!xy || isNaN(xy[0])) return;
                    var color = resourceColorMap[d.type] || MAP_COLORS.naturalResources.default;
                    gNaturalResources.append('circle').attr('cx',xy[0]).attr('cy',xy[1]).attr('r',r*1.8).attr('fill',color).style('pointer-events','none').attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.18);
                    gNaturalResources.append('circle').datum(d).attr('cx',xy[0]).attr('cy',xy[1]).attr('r',r).attr('fill',color).attr('stroke','#fff').attr('stroke-width',1.2).style('cursor','pointer').attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.85);
                    gNaturalResources.append('text').attr('x',xy[0]+r+3/k).attr('y',xy[1]+2/k).text(function(){return lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en;}).attr('fill','#fff').attr('font-size',fontSize+'px').attr('font-weight','bold').style('pointer-events','none');
                });
            }
            function drawEthnicGroups() {
                gEthnicGroups.selectAll('*').remove();
                if (!ethnicGroupsVisible) return;
                var ethnicColors = MAP_COLORS.ethnicGroups;
                if (!gEthnicGroups.on('click')) {
                    gEthnicGroups.on('click', function(e) {
                        if (e.target.tagName === 'circle') {
                            var dd = d3.select(e.target).datum();
                            if (dd) showEthnicGroupDetail(dd);
                        }
                    });
                }
                var proj = getActiveProjection();
                ethnicGroupsData.forEach(function(d,i) {
                    var xy = proj(Array.isArray(d.coords[0]) ? d.coords[0] : d.coords);
                    if (!xy || isNaN(xy[0])) return;
                    var k = Math.max(0.4, currentTransform.k);
                    var color = ethnicColors[i%ethnicColors.length];
                    var r = Math.max(4, Math.min(14, (isMobile ? 6 : 8) * Math.pow(k, 0.4)));
                    var fs = Math.max(3, Math.min(16, (isMobile?9:12)/k));
                    gEthnicGroups.append('circle').attr('cx',xy[0]).attr('cy',xy[1]).attr('r',r*1.8).attr('fill',color).style('pointer-events','none').attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.18);
                    gEthnicGroups.append('circle').datum(d).attr('cx',xy[0]).attr('cy',xy[1]).attr('r',r).attr('fill',color).attr('stroke','#fff').attr('stroke-width',1).style('cursor','pointer').attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.6);
                    gEthnicGroups.append('text').attr('x',xy[0]+r+3/k).attr('y',xy[1]+2/k).text(function(){return lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en;}).attr('fill','#fff').attr('font-size',fs+'px').attr('font-weight','bold').style('pointer-events','none');
                });
            }
            function showOceanCurrentDetail(d) {
                selectedFeature = d;
                selectedFeatureType = 'oceanCurrent';
                var displayName = lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en;
                var html = '<h3>🌊 '+displayName+'</h3>';
                if (d.type==='warm'||d.type==='cold') {
                    var typeLabel = d.type==='warm'?t('warmCurrent'):t('coldCurrent');
                    html += '<p><strong>'+t('currentType')+':</strong> '+typeLabel+'</p>';
                    if (d.temperature) html += '<p><strong>'+t('temperature')+':</strong> '+d.temperature+'°C</p>';
                    if (d.speed) html += '<p><strong>'+t('speed')+':</strong> '+d.speed+' '+t('speedUnit')+'</p>';
                } else if (d.type==='gyre') {
                    html += '<p><strong>'+t('currentType')+':</strong> '+t('gyre')+'</p>';
                } else if (d.type==='trench') {
                    html += '<p><strong>'+t('currentType')+':</strong> '+t('trenchDepth')+'</p>';
                    if (d.depth) html += '<p><strong>'+t('trenchDepth')+':</strong> '+d.depth.toLocaleString('en')+' '+t('elevationUnit')+'</p>';
                }
                if (d.description_ar||d.description_en) html += '<p><strong>'+t('featureDescription')+':</strong> '+(lang==='ar'?d.description_ar:lang==='ru'?(d.description_ru||d.description_en):lang==='uz'?(d.description_uz||d.description_en):lang==='es'?(d.description_es||d.description_en):d.description_en)+'</p>';
                _lastPanelRenderTime = performance.now();
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }
            function drawOceanCurrents(skipFadeIn) {
                gOceanCurrents.selectAll('*').remove();
                if (!oceanCurrentsVisible) return;
                var proj = getActiveProjection();
                oceanCurrentsData.forEach(function(d) {
                    if (d.type==='trench') {
                        var xy = proj(Array.isArray(d.coords[0])?d.coords[0]:d.coords);
                        if (!xy||isNaN(xy[0])) return;
                        var s = isMobile?10:16;
                        gOceanCurrents.append('rect').attr('x',xy[0]-s-6).attr('y',xy[1]-s-6).attr('width',(s+6)*2).attr('height',(s+6)*2).attr('fill','transparent').style('cursor','pointer').on('click',function(){showOceanCurrentDetail(d);});
                        var _sel = gOceanCurrents.append('path').attr('d','M'+(xy[0]-s)+','+(xy[1]-s)+' L'+(xy[0]+s)+','+(xy[1]+s)+' M'+(xy[0]-s)+','+(xy[1]+s)+' L'+(xy[0]+s)+','+(xy[1]-s)).attr('stroke',MAP_COLORS.oceanCurrents.trench).attr('stroke-width',isMobile?3:4).style('pointer-events','none');
                        if (skipFadeIn) _sel.attr('opacity',0.9); else _sel.attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.9);
                        _sel = gOceanCurrents.append('text').attr('x',xy[0]+s+6).attr('y',xy[1]+3).text(function(){return lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en;}).attr('fill',MAP_COLORS.oceanCurrents.trench).attr('font-size',isMobile?8:11).attr('font-weight','bold').style('pointer-events','none');
                        if (skipFadeIn) _sel.attr('opacity',1); else _sel.attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',1);
                        return;
                    }
                    if (d.type==='gyre') {
                        var color = MAP_COLORS.oceanCurrents.gyre;
                        var line = gOceanCurrents.append('path').datum({type:'LineString', coordinates:d.coords}).attr('d', pathGen).attr('fill','none').attr('stroke',color).attr('stroke-width',isMobile?2.5:4).attr('stroke-dasharray','4,8').attr('vector-effect','non-scaling-stroke').style('cursor','pointer').on('click',function(){showOceanCurrentDetail(d);});
                        if (skipFadeIn) line.attr('opacity',0.6); else line.attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.6);
                        var expanded = d.coords.slice();
                        if (expanded.length>1) { expanded.push(d.coords[d.coords.length-2]); expanded.push(d.coords[d.coords.length-1]); }
                        gOceanCurrents.append('path').datum({type:'LineString', coordinates:d.coords}).attr('d', pathGen).attr('fill','none').attr('stroke','transparent').attr('stroke-width',isMobile?16:24).style('cursor','pointer').on('click',function(){showOceanCurrentDetail(d);});
                        var mid = d.coords[Math.floor(d.coords.length/2)];
                        var mxy = proj(mid);
                        if (mxy&&!isNaN(mxy[0])) {
                            var _sel2 = gOceanCurrents.append('text').attr('x',mxy[0]).attr('y',mxy[1]-10).text(function(){return lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en;}).attr('fill',color).attr('font-size',isMobile?8:11).attr('font-weight','bold').attr('text-anchor','middle').style('pointer-events','none');
                            if (skipFadeIn) _sel2.attr('opacity',1); else _sel2.attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',1);
                        }
                        return;
                    }
                    var color = d.type === 'warm' ? MAP_COLORS.oceanCurrents.warm : MAP_COLORS.oceanCurrents.cold;
                    var arrow = d.type === 'warm' ? '▶' : '◀';
                    var line = gOceanCurrents.append('path').datum({type:'LineString', coordinates:d.coords}).attr('d', pathGen).attr('fill','none').attr('stroke',color).attr('stroke-width',isMobile?3:5).attr('stroke-dasharray','8,4').attr('vector-effect','non-scaling-stroke').style('cursor','pointer').on('click',function(){showOceanCurrentDetail(d);});
                    if (skipFadeIn) line.attr('opacity',0.8); else line.attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.8);
                    gOceanCurrents.append('path').datum({type:'LineString', coordinates:d.coords}).attr('d', pathGen).attr('fill','none').attr('stroke','transparent').attr('stroke-width',isMobile?18:28).style('cursor','pointer').on('click',function(){showOceanCurrentDetail(d);});
                    var last = d.coords[d.coords.length-1];
                    var xy = proj(last);
                    if (xy && !isNaN(xy[0])) {
                        var _sel3 = gOceanCurrents.append('text').attr('x',xy[0]).attr('y',xy[1]).text(arrow).attr('fill',color).attr('font-size',isMobile?16:22).style('pointer-events','none');
                        if (skipFadeIn) _sel3.attr('opacity',0.9); else _sel3.attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.9);
                        var first = d.coords[0];
                        var fxy = proj(first);
                        if (fxy && !isNaN(fxy[0])) {
                            var mid = d.coords[Math.floor(d.coords.length/2)];
                            var mxy = proj(mid);
                            if (mxy && !isNaN(mxy[0])) {
                                var _sel4 = gOceanCurrents.append('text').attr('x',mxy[0]-10).attr('y',mxy[1]-6).text(function(){return lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en;}).attr('fill','#fff').attr('font-size',isMobile?7:10).attr('font-weight','bold').style('pointer-events','none');
                                if (skipFadeIn) _sel4.attr('opacity',0.95); else _sel4.attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.95);
                            }
                        }
                    }
                });
            }
            function drawWinds(skipFadeIn) {
                gWinds.selectAll('*').remove();
                if (!windsVisible) return;
                var proj = getActiveProjection();
                windsData.forEach(function(d) {
                    var color = d.type === 'trade' ? MAP_COLORS.winds.trade : d.type === 'westerly' ? MAP_COLORS.winds.westerly : d.type === 'polar' ? MAP_COLORS.winds.polar : d.type === 'monsoon' ? MAP_COLORS.winds.monsoon : MAP_COLORS.winds.other;
                    var line = gWinds.append('path').datum({type:'LineString', coordinates:d.coords}).attr('d', pathGen).attr('fill','none').attr('stroke',color).attr('stroke-width',isMobile?3:5).attr('stroke-dasharray','5,5').attr('vector-effect','non-scaling-stroke').style('cursor','pointer').on('click',function(){showFeatureDetail('wind',d);});
                    if (skipFadeIn) line.attr('opacity',0.7); else line.attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.7);
                    gWinds.append('path').datum({type:'LineString', coordinates:d.coords}).attr('d', pathGen).attr('fill','none').attr('stroke','transparent').attr('stroke-width',isMobile?16:24).style('cursor','pointer').on('click',function(){showFeatureDetail('wind',d);});
                    var last = d.coords[d.coords.length-1];
                    var xy = proj(last);
                    if (xy && !isNaN(xy[0])) {
                        var _sel = gWinds.append('text').attr('x',xy[0]).attr('y',xy[1]).text('➤').attr('fill',color).attr('font-size',isMobile?14:20).style('pointer-events','none').style('cursor','pointer');
                        if (skipFadeIn) _sel.attr('opacity',0.85); else _sel.attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.85);
                    }
                    var mid = d.coords[Math.floor(d.coords.length/2)];
                    var mxy = proj(mid);
                    if (mxy && !isNaN(mxy[0])) {
                        var _sel2 = gWinds.append('text').attr('x',mxy[0]).attr('y',mxy[1]-8).text(function(){return lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en;}).attr('fill','#fff').attr('font-size',isMobile?9:13).attr('font-weight','bold').style('pointer-events','none').style('text-shadow','0 0 5px rgba(0,0,0,0.7)');
                        if (skipFadeIn) _sel2.attr('opacity',0.95); else _sel2.attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.95);
                    }
                });
            }
            function showEarthquakeDetail(d) {
                selectedFeature = d;
                selectedFeatureType = 'earthquake';
                var displayName = lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en;
                var html = '<h3>🏚️ '+displayName+'</h3>';
                if (d.magnitude) html += '<p><strong>'+t('magnitude')+':</strong> '+d.magnitude+'</p>';
                if (d.year) html += '<p><strong>'+t('year')+':</strong> '+d.year+'</p>';
                if (d.plate_ar||d.plate_en) html += '<p><strong>'+t('tectonicPlate')+':</strong> '+(lang==='ar'?d.plate_ar:lang==='ru'?(d.plate_ru||d.plate_en):lang==='uz'?(d.plate_uz||d.plate_en):lang==='es'?(d.plate_es||d.plate_en):d.plate_en)+'</p>';
                if (d.description_ar||d.description_en) html += '<p><strong>'+t('featureDescription')+':</strong> '+(lang==='ar'?d.description_ar:lang==='ru'?(d.description_ru||d.description_en):lang==='uz'?(d.description_uz||d.description_en):lang==='es'?(d.description_es||d.description_en):d.description_en)+'</p>';
                _lastPanelRenderTime = performance.now();
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }
            function showTectonicPlateDetail(d) {
                selectedFeature = d;
                selectedFeatureType = 'tectonicPlate';
                var displayName = lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en;
                var html = '<h3>🗿 '+displayName+'</h3>';
                html += '<p>'+t('tectonicPlates')+'</p>';
                _lastPanelRenderTime = performance.now();
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }
            function drawEarthquakes(skipFadeIn) {
                gEarthquakes.selectAll('*').remove();
                if (!earthquakesVisible) return;
                var proj = getActiveProjection();
                var plateColors = MAP_COLORS.tectonicPlates;
                tectonicPlatesData.forEach(function(p,i){
                    var pathD = pathGen({type:'Polygon',coordinates:[p.coords]});
                    if (pathD) {
                        var _sel = gEarthquakes.append('path').attr('d',pathD).attr('fill',plateColors[i%plateColors.length]).attr('stroke',plateColors[i%plateColors.length]).attr('stroke-width',1).attr('stroke-dasharray','3,3').attr('vector-effect','non-scaling-stroke').style('cursor','pointer').on('click',function(){showTectonicPlateDetail(p);});
                        if (skipFadeIn) _sel.attr('opacity',0.04); else _sel.attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.04);
                        var mid = p.coords[Math.floor(p.coords.length/2)];
                        var mxy = proj(mid);
                        if (mxy&&!isNaN(mxy[0])) {
                            var _sel2 = gEarthquakes.append('text').attr('x',mxy[0]).attr('y',mxy[1]).text(function(){return lang==='ar'?p.name:lang==='ru'?(p.name_ru||p.name_en):lang==='uz'?(p.name_uz||p.name_en):lang==='es'?(p.name_es||p.name_en):p.name_en;}).attr('fill','#fff').attr('font-size',isMobile?8:11).attr('text-anchor','middle').style('pointer-events','none');
                            if (skipFadeIn) _sel2.attr('opacity',0.7); else _sel2.attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.7);
                        }
                    }
                });
                earthquakesData.forEach(function(d) {
                    var coordsList = Array.isArray(d.coords[0]) ? d.coords : [d.coords];
                    var mainCoord = coordsList[0];
                    var xy = proj(mainCoord);
                    if (!xy || isNaN(xy[0])) return;
                    var eqColor = d.magnitude >= 9 ? MAP_COLORS.earthquakes.major9 : d.magnitude >= 8 ? MAP_COLORS.earthquakes.major8 : d.magnitude >= 7 ? MAP_COLORS.earthquakes.major7 : d.magnitude >= 6 ? MAP_COLORS.earthquakes.major6 : MAP_COLORS.earthquakes.below6;
                    var r = isMobile ? 8 : 12;
                    var _sel3 = gEarthquakes.append('circle').attr('cx',xy[0]).attr('cy',xy[1]).attr('r',r).attr('fill',eqColor).attr('stroke','#fff').attr('stroke-width',1.5).style('cursor','pointer').on('click',function(){showEarthquakeDetail(d);});
                    if (skipFadeIn) _sel3.attr('opacity',0.85); else _sel3.attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.85);
                    gEarthquakes.append('circle').attr('cx',xy[0]).attr('cy',xy[1]).attr('r',r+4).attr('fill','transparent').style('cursor','pointer').on('click',function(){showEarthquakeDetail(d);});
                });
            }
            function showVolcanoDetail(d) {
                selectedFeature = d;
                selectedFeatureType = 'volcano';
                var displayName = lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en;
                var html = '<h3>🌋 '+displayName+'</h3>';
                if (d.elevation) html += '<p><strong>'+t('tooltipElevation')+':</strong> '+d.elevation.toLocaleString('en')+' '+t('elevationUnit')+'</p>';
                if (d.type) html += '<p><strong>'+t('volcanoType')+':</strong> '+(lang==='ar'?d.type_ar||d.type:lang==='ru'?(d.type_ru||d.type_en||d.type):lang==='uz'?(d.type_uz||d.type_en||d.type):lang==='es'?(d.type_es||d.type_en||d.type):d.type_en||d.type)+'</p>';
                if (d.lastEruption) html += '<p><strong>'+t('lastEruption')+':</strong> '+d.lastEruption+'</p>';
                if (d.description_ar||d.description_en) html += '<p><strong>'+t('featureDescription')+':</strong> '+(lang==='ar'?d.description_ar:lang==='ru'?(d.description_ru||d.description_en):lang==='uz'?(d.description_uz||d.description_en):lang==='es'?(d.description_es||d.description_en):d.description_en)+'</p>';
                _lastPanelRenderTime = performance.now();
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }
            function drawVolcanoes(skipFadeIn) {
                gVolcanoes.selectAll('*').remove();
                if (!volcanoesVisible) return;
                var proj = getActiveProjection();
                volcanoesData.forEach(function(d) {
                    var xy = proj(Array.isArray(d.coords[0]) ? d.coords[0] : d.coords);
                    if (!xy || isNaN(xy[0])) return;
                    var px = xy[0], py = xy[1];
                    var s = isMobile ? 8 : 13;
                    var group = gVolcanoes.append('g').style('cursor','pointer').on('click',function(){showVolcanoDetail(d);});
                    var _sel = group.append('path').attr('d','M'+px+','+(py-s)+' L'+(px-s*0.7)+','+(py+s*0.5)+' L'+(px+s*0.7)+','+(py+s*0.5)+' Z').attr('fill',MAP_COLORS.volcanoes.fill).attr('stroke',MAP_COLORS.volcanoes.stroke).attr('stroke-width',1);
                    if (skipFadeIn) _sel.attr('opacity',0.9); else _sel.attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.9);
                    _sel = group.append('circle').attr('cx',px).attr('cy',py-s*0.2).attr('r',isMobile?3:4).attr('fill',MAP_COLORS.volcanoes.glow);
                    if (skipFadeIn) _sel.attr('opacity',0.8); else _sel.attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.8);
                    group.append('text').attr('x',px+s+3).attr('y',py+2).text(function(){return lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en;}).attr('fill',MAP_COLORS.volcanoes.fill).attr('font-size',isMobile?9:12).attr('font-weight','bold').style('pointer-events','none');
                });
            }
            function drawGeopoliticalBlocs(skipFadeIn) {
                gGeopoliticalBlocs.selectAll('*').remove();
                if (!geopoliticalBlocsVisible) return;
                if (selectedBloc !== 'all') {
                    var bloc = geopoliticalBlocsData.find(function(b){return b.name_en===selectedBloc||b.name===selectedBloc;});
                    if (bloc && bloc.members && bloc.members.length) {
                        var blocColor = bloc.color || MAP_COLORS.blocDefault;
                        var k = Math.max(0.4, currentTransform.k);
                        var fs = Math.max(3, Math.min(15, (isMobile ? 7 : 10) / k));
                        allCountryFeatures.forEach(function(f){
                            var name = f.properties?.name;
                            if (bloc.members.some(function(m){return namesMatch(name, m);})) {
                                var pathData = pathGen(f);
                                if (pathData) {
                                    var _sel = gGeopoliticalBlocs.append('path').attr('d',pathData).attr('fill',blocColor).attr('stroke',blocColor).attr('stroke-width',1.5).attr('vector-effect','non-scaling-stroke').style('pointer-events','none');
                                    if (skipFadeIn) _sel.attr('opacity',0.3); else _sel.attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.3);
                                    var centroid = d3.geoPath().projection(getActiveProjection()).centroid(f);
                                    if (centroid && !isNaN(centroid[0])) {
                                        var _sel2 = gGeopoliticalBlocs.append('text').attr('x',centroid[0]).attr('y',centroid[1]).text(function(){return getDisplayName(name);}).attr('fill','#fff').attr('font-size',fs).attr('font-weight','bold').attr('text-anchor','middle').attr('pointer-events','none');
                                        if (skipFadeIn) _sel2.attr('opacity',0.9); else _sel2.attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.9);
                                    }
                                }
                            }
                        });
                    }
                }
            }
            function getCityCountryName(city) {
                for (let i = 0; i < allCountryFeatures.length; i++) {
                    const f = allCountryFeatures[i];
                    try {
                        if (d3.geoContains(f, city.coords)) {
                            return getDisplayName(f.properties?.name || '');
                        }
                    } catch (e) { /* ignore malformed geometry, just skip it */ }
                }
                return null;
            }
            function getCityCategoryRank(city) {
                const sameCategory = majorCitiesData.filter(c => c.category === city.category);
                sameCategory.sort((a, b) => (b.pop || 0) - (a.pop || 0));
                const rank = sameCategory.findIndex(c => c === city) + 1;
                return { rank: rank, total: sameCategory.length };
            }
            function showCityDetail(city) {
                selectedFeature = city;
                selectedFeatureType = 'city';
                var displayName = lang === 'ar' ? city.name
                    : lang === 'ru' ? (city.name_ru || city.name_en || city.name)
                    : lang === 'uz' ? (city.name_uz || city.name_en || city.name)
                    : lang === 'es' ? (city.name_es || city.name_en || city.name)
                    : (city.name_en || city.name);
                var catKey = 'cityCategory' + city.category.charAt(0).toUpperCase() + city.category.slice(1);
                var catLabel = t(catKey) || city.category;
                var dotColor = MAP_COLORS.cities[city.category] || MAP_COLORS.cities.other;
                var html = '<h3>🏙️ ' + displayName + '</h3>';
                html += '<p><strong>' + t('featureCategory') + ':</strong> <span style="color:' + dotColor + '">●</span> ' + catLabel + '</p>';
                var countryName = getCityCountryName(city);
                if (countryName) html += '<p><strong>' + t('featureCountry') + ':</strong> ' + countryName + '</p>';
                var rankInfo = getCityCategoryRank(city);
                if (rankInfo.rank > 0) html += '<p><strong>' + t('categoryRank') + ':</strong> ' + rankInfo.rank + ' / ' + rankInfo.total + '</p>';
                if (city.pop) html += '<p><strong>' + t('population') + ':</strong> ' + city.pop + ' ' + t('millionPeople') + '</p>';
                _lastPanelRenderTime = performance.now();
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }
            function showDesertForestDetail(d) {
                selectedFeature = d;
                selectedFeatureType = 'desertForest';
                var displayName = lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en;
                var typeIcon = d.type==='desert'?'🏜️':'🌲';
                var html = '<h3>'+typeIcon+' '+displayName+'</h3>';
                if (d.area_km2) html += '<p><strong>'+t('areaTitle')+':</strong> '+d.area_km2.toLocaleString('en')+' '+t('km2')+'</p>';
                if (d.countries_ar||d.countries_en) html += '<p><strong>'+t('featureCountries')+':</strong> '+(lang==='ar'?d.countries_ar:lang==='ru'?(d.countries_ru||d.countries_en):lang==='uz'?(d.countries_uz||d.countries_en):lang==='es'?(d.countries_es||d.countries_en):d.countries_en)+'</p>';
                if (d.biome_ar||d.biome_en) html += '<p><strong>'+t('biome')+':</strong> '+(lang==='ar'?d.biome_ar:lang==='ru'?(d.biome_ru||d.biome_en):lang==='uz'?(d.biome_uz||d.biome_en):lang==='es'?(d.biome_es||d.biome_en):d.biome_en)+'</p>';
                if (d.description_ar||d.description_en) html += '<p><strong>'+t('featureDescription')+':</strong> '+(lang==='ar'?d.description_ar:lang==='ru'?(d.description_ru||d.description_en):lang==='uz'?(d.description_uz||d.description_en):lang==='es'?(d.description_es||d.description_en):d.description_en)+'</p>';
                _lastPanelRenderTime = performance.now();
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }
            function drawDesertsForests(skipFadeIn) {
                gDesertsForests.selectAll('*').remove();
                if (!desertsForestsVisible) return;
                var proj = getActiveProjection();
                var k = Math.max(0.4, currentTransform.k);
                desertsForestsData.forEach(function(d) {
                    var color = d.type === 'desert' ? MAP_COLORS.desertsForests.desert : MAP_COLORS.desertsForests.forest;
                    var haloColor = d.type === 'desert' ? MAP_COLORS.desertsForests.desertHalo : MAP_COLORS.desertsForests.forestHalo;
                    if (Array.isArray(d.coords[0])) {
                        var coords = d.coords;
                        var expanded = [];
                        coords.forEach(function(c){expanded.push(c);});
                        expanded.push(coords[0]);
                        gDesertsForests.append('path').datum({type:'Polygon', coordinates:[expanded], _data:d}).attr('d', pathGen).attr('fill','none').attr('stroke',haloColor).attr('stroke-width',(isMobile?4:7)).attr('vector-effect','non-scaling-stroke').style('pointer-events','none');
                        gDesertsForests.append('path').datum({type:'Polygon', coordinates:[expanded], _data:d}).attr('d', pathGen).attr('fill','none').attr('stroke',color).attr('stroke-width',isMobile?2:4).attr('stroke-opacity',1).attr('stroke-dasharray','6,3').attr('vector-effect','non-scaling-stroke').style('cursor','pointer').on('click',function(e,dd){showDesertForestDetail(dd._data);});
                        var mid = d.coords[Math.floor(d.coords.length/2)];
                        var mxy = proj(mid);
                        if (mxy && !isNaN(mxy[0])) {
                            var labelText = lang === 'ar' ? d.name : lang === 'ru' ? (d.name_ru || d.name_en) : lang === 'uz' ?(d.name_uz || d.name_en): lang === 'es' ?(d.name_es || d.name_en) : d.name_en;
                            var fontSize = Math.max(3, Math.min(15, (isMobile ? 9 : 12) / k));
                            var _sel = gDesertsForests.append('text').attr('x',mxy[0]).attr('y',mxy[1]).text(labelText).attr('fill','#fff').attr('font-size',fontSize).attr('font-weight','bold').attr('text-anchor','middle').style('pointer-events','none');
                            if (skipFadeIn) _sel.attr('opacity',0.95); else _sel.attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.95);
                            gDesertsForests.append('circle').datum(d).attr('cx',mxy[0]).attr('cy',mxy[1]).attr('r',isMobile?20:30).attr('fill','transparent').style('cursor','pointer').on('click',function(e,dd){showDesertForestDetail(dd);});
                        }
                    }
                });
            }
            function drawBorderDisputes(skipFadeIn) {
                gBorderDisputes.selectAll('*').remove();
                var counterEl = document.getElementById('borderDisputesCounter');
                if (!borderDisputesVisible) { if (counterEl) counterEl.style.display = 'none'; return; }
                var proj = getActiveProjection();
                borderDisputesData.forEach(function(d) {
                    var p = proj(d.coords);
                    if (!p || isNaN(p[0])) return;
                    var color = d.type === 'active' ? MAP_COLORS.borderDisputes.active : d.type === 'ceasefire' ? MAP_COLORS.borderDisputes.ceasefire : MAP_COLORS.borderDisputes.maritime;
                    var k = Math.max(0.4, currentTransform.k);
                    var rBase = isMobile ? 7 : 11;
                    var r = rBase / k;
                    var x = p[0], y = p[1];
                    var _sel = gBorderDisputes.append('circle').attr('cx',x).attr('cy',y).attr('r',Math.max(2, r*2.2)).attr('fill',color).attr('vector-effect','non-scaling-stroke').style('pointer-events','none');
                    if (skipFadeIn) _sel.attr('opacity',0.12); else _sel.attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.12);
                    _sel = gBorderDisputes.append('circle').attr('cx',x).attr('cy',y).attr('r',Math.max(1.5, r*1.4)).attr('fill',color).attr('vector-effect','non-scaling-stroke').style('pointer-events','none');
                    if (skipFadeIn) _sel.attr('opacity',0.2); else _sel.attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.2);
                    _sel = gBorderDisputes.append('circle').datum(d).attr('cx',x).attr('cy',y).attr('r',Math.max(1, r)).attr('fill',color).attr('stroke','#fff').attr('stroke-width',(isMobile?1:1.5)).attr('vector-effect','non-scaling-stroke').style('cursor','pointer').on('click',function(e,dd){showBorderDisputeDetail(dd);});
                    if (skipFadeIn) _sel.attr('opacity',0.9); else _sel.attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.9);
                    _sel = gBorderDisputes.append('circle').attr('cx',x).attr('cy',y).attr('r',Math.max(3, r*3)).attr('fill','transparent').attr('stroke',color).attr('stroke-width',(isMobile?0.8:1.2)).attr('vector-effect','non-scaling-stroke').style('pointer-events','none');
                    if (skipFadeIn) _sel.attr('opacity',0.25); else _sel.attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.25);
                    var labelText = lang === 'ar' ? d.name_ar : lang === 'ru' ? (d.name_ru || d.name_en) : lang === 'uz' ?(d.name_uz || d.name_en): lang === 'es' ?(d.name_es || d.name_en) : d.name_en;
                    var fs = Math.max(3, Math.min(14, (isMobile ? 7 : 10) / k));
                    gBorderDisputes.append('text').attr('x',x).attr('y',y-r-3/k).text(labelText).attr('fill',color).attr('font-size',fs).attr('font-weight','bold').attr('text-anchor','middle').style('pointer-events','none');
                });
                var activeCount = borderDisputesData.filter(function(d){return d.type==='active';}).length;
                var ceasefireCount = borderDisputesData.filter(function(d){return d.type==='ceasefire';}).length;
                var maritimeCount = borderDisputesData.filter(function(d){return d.type==='maritime';}).length;
                if (counterEl) {
                    counterEl.textContent = '⚔️ ' + activeCount + '  ☮️ ' + ceasefireCount + '  🌊 ' + maritimeCount;
                    counterEl.style.display = '';
                }
            }
            function showBorderDisputeDetail(d) {
                if (!d) return;
                var content = document.getElementById('panelContent');
                if (!content) return;
                var typeIcon = d.type === 'active' ? '⚔️' : d.type === 'ceasefire' ? '☮️' : '🌊';
                var typeLabel = d.type === 'active' ? (lang==='ar'?'نزاع نشط':lang==='ru'?'Активный конфликт':lang==='uz'?'Faol nizo':lang==='es'?'Conflicto activo':'Active Conflict') : d.type === 'ceasefire' ? (lang==='ar'?'وقف إطلاق نار':lang==='ru'?'Перемирие':lang==='uz'?'O\'t ochishni to\'xtatish':lang==='es'?'Alto el fuego':'Ceasefire') : (lang==='ar'?'نزاع بحري':lang==='ru'?'Морской спор':lang==='uz'?'Dengiz nizosi':lang==='es'?'Disputa marítima':'Maritime Dispute');
                var html = '<h3>'+(lang==='ar'?d.name_ar:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en)+'</h3>';
                html += '<div style="margin-bottom:8px"><span style="font-size:1.4em">'+typeIcon+'</span> <strong style="color:'+(d.type==='active'?MAP_COLORS.borderDisputes.active:d.type==='ceasefire'?MAP_COLORS.borderDisputes.ceasefire:MAP_COLORS.borderDisputes.maritime)+'">'+typeLabel+'</strong></div>';
                html += '<p><strong>'+t('featureCountries')+':</strong> '+(lang==='ar'?d.countries_ar:lang==='ru'?(d.countries_ru||d.countries_en):lang==='uz'?(d.countries_uz||d.countries_en):lang==='es'?(d.countries_es||d.countries_en):d.countries_en)+'</p>';
                html += '<p><strong>'+(lang==='ar'?'الأسباب':lang==='ru'?'Причины':lang==='uz'?'Sabablar':lang==='es'?'Causas':'Causes')+':</strong> '+(lang==='ar'?d.causes_ar:lang==='ru'?(d.causes_ru||d.causes_en):lang==='uz'?(d.causes_uz||d.causes_en):lang==='es'?(d.causes_es||d.causes_en):d.causes_en)+'</p>';
                _lastPanelRenderTime = performance.now();
                content.innerHTML = html;
                var panel = document.getElementById('countryPanel');
                if (panel) { panel.style.display = 'block';
                requestAnimationFrame(function(){requestAnimationFrame(function(){panel.classList.add('visible');});}); }
                selectedFeature = d;
                selectedFeatureType = 'borderDispute';
            }

            function ensureAdminBoundariesLoaded() {
                if (adminBoundariesData) return Promise.resolve(adminBoundariesData);
                if (adminBoundariesLoading) return adminBoundariesLoading;
                var basePath = window.location.pathname.replace(/\/[^\/]*$/, '/');
                adminBoundariesLoading = fetch(basePath + 'admin-boundaries-data.json')
                    .then(function(r) { return r.json(); })
                    .then(function(data) { adminBoundariesData = data; try { getAdminLabelMeta(data); } catch(e) {} return data; })
                    .catch(function(err) {
                        console.error('Failed to load admin boundaries:', err);
                        adminBoundariesLoading = null;
                        copyNotification.textContent = t('adminBoundariesLoadError');
                        copyNotification.classList.add('show');
                        setTimeout(function() { copyNotification.classList.remove('show'); }, 3000);
                        return [];
                    });
                return adminBoundariesLoading;
            }

            function ensureGlaciatedAreasLoaded() {
                if (glaciatedAreasData) return Promise.resolve(glaciatedAreasData);
                if (glaciatedAreasLoading) return glaciatedAreasLoading;
                if (copyNotification) {
                    copyNotification.textContent = t('glaciatedAreasLoading');
                    copyNotification.classList.add('show');
                }
                var basePath = window.location.pathname.replace(/\/[^\/]*$/, '/');
                glaciatedAreasLoading = fetch(basePath + 'glaciated-areas-data.json')
                    .then(function(r) { return r.json(); })
                    .then(function(data) {
                        glaciatedAreasData = data || [];
                        if (copyNotification) copyNotification.classList.remove('show');
                        return glaciatedAreasData;
                    })
                    .catch(function(err) {
                        console.error('Failed to load glaciated areas:', err);
                        glaciatedAreasLoading = null;
                        if (copyNotification) {
                            copyNotification.textContent = t('glaciatedAreasLoadError');
                            setTimeout(function() { copyNotification.classList.remove('show'); }, 3000);
                        }
                        return [];
                    });
                return glaciatedAreasLoading;
            }

            function drawGlaciatedAreas(skipFadeIn) {
                gGlaciatedAreas.selectAll('*').remove();
                if (!riversGlaciersVisible) return;
                ensureGlaciatedAreasLoaded().then(function(features) {
                    if (!features || !features.length || !riversGlaciersVisible || globeModeActive) return;
                    var proj = getActiveProjection();
                    var jumpPx = Math.min(getMapRect().width, getMapRect().height) * 0.55;
                    var strokeW = isMobile ? 1 : 1.4;
                    features.forEach(function(f) {
                        var splitResult = _adminSeamSplitGeometries({ type: f.type, coordinates: f.coordinates }, proj, jumpPx);
                        var geoms = Array.isArray(splitResult) ? splitResult : [splitResult];
                        geoms.forEach(function(g) {
                            var lines;
                            if (g.type === 'LineString') lines = [g.coordinates];
                            else if (g.type === 'MultiLineString') lines = g.coordinates;
                            else if (g.type === 'Polygon') lines = [g.coordinates[0]];
                            else if (g.type === 'MultiPolygon') { lines = []; for (var pi = 0; pi < g.coordinates.length; pi++) lines.push(g.coordinates[pi][0]); }
                            else return;
                            lines.forEach(function(ring) {
                                var pts = ring.map(function(c) { return proj(c); }).filter(function(p) { return p && !isNaN(p[0]); });
                                if (pts.length < 2) return;
                                var d = 'M' + pts.map(function(p) { return p[0] + ',' + p[1]; }).join('L');
                                gGlaciatedAreas.append('path').attr('d', d).attr('fill', 'none')
                                    .attr('stroke', MAP_COLORS.glaciatedAreas.halo).attr('stroke-width', strokeW + (isMobile ? 2.5 : 3.5))
                                    .attr('vector-effect', 'non-scaling-stroke').style('pointer-events', 'none');
                                gGlaciatedAreas.append('path').attr('d', d).attr('fill', 'none')
                                    .attr('stroke', MAP_COLORS.glaciatedAreas.stroke).attr('stroke-width', strokeW).attr('stroke-opacity', 0.95)
                                    .attr('vector-effect', 'non-scaling-stroke').style('pointer-events', 'none');
                            });
                        });
                    });
                });
            }

            function ensureAdminNameTranslationsLoaded() {
                if (adminNameTranslations) return Promise.resolve(adminNameTranslations);
                if (adminNameTranslationsLoading) return adminNameTranslationsLoading;
                var basePath = window.location.pathname.replace(/\/[^\/]*$/, '/');
                adminNameTranslationsLoading = fetch(basePath + 'admin-name-translations.json')
                    .then(function(r) { return r.ok ? r.json() : {}; })
                    .then(function(data) { adminNameTranslations = data || {}; return adminNameTranslations; })
                    .catch(function(err) {
                        console.error('Failed to load admin name translations:', err);
                        adminNameTranslationsLoading = null;
                        adminNameTranslations = {};
                        return adminNameTranslations;
                    });
                return adminNameTranslationsLoading;
            }

            function getMergedAdminBoundaries(features) {
                if (!adminBoundariesMerged) {
                    adminBoundariesMerged = {
                        type: 'GeometryCollection',
                        geometries: features.map(function(f) {
                            return { type: f.type, coordinates: f.coordinates };
                        })
                    };
                }
                return adminBoundariesMerged;
            }
            function getAdminBoundariesCentroids(features) {
                if (!adminBoundariesCentroids) {
                    adminBoundariesCentroids = features.map(function(f) {
                        return {
                            name: f.name,
                            centroid: d3.geoCentroid({ type: 'Feature', geometry: { type: f.type, coordinates: f.coordinates } })
                        };
                    });
                }
                return adminBoundariesCentroids;
            }
            let adminLabelMeta = null;
            let adminLabelMetaFeatures = null;
            function getAdminLabelMeta(features) {
                if (adminLabelMeta && adminLabelMetaFeatures === features) return adminLabelMeta;
                var items = features.map(function(f, fi) {
                    return {
                        i: fi,
                        name: f.name,
                        centroid: d3.geoCentroid({ type: 'Feature', geometry: { type: f.type, coordinates: f.coordinates } }),
                        area: d3.geoArea({ type: 'Feature', geometry: { type: f.type, coordinates: f.coordinates } })
                    };
                });
                items.sort(function(a, b) { return b.area - a.area; });
                adminLabelMeta = { items: items, total: items.length };
                adminLabelMetaFeatures = features;
                return adminLabelMeta;
            }
            const ADMIN_TIER_STEPS = [[4, 0.12], [6, 0.25], [8, 0.4], [10, 0.55], [13, 0.7], [17, 0.85], [21, 0.97], [24, 1]];
            function adminTierCount(k, total) {
                var frac = 0;
                for (var s = 0; s < ADMIN_TIER_STEPS.length; s++) {
                    if (k >= ADMIN_TIER_STEPS[s][0]) frac = ADMIN_TIER_STEPS[s][1];
                }
                return Math.max(1, Math.round(total * frac));
            }
            function drawAdminBoundariesDebounced() {
                clearTimeout(_adminBoundariesRedrawTimeout);
                _adminBoundariesRedrawTimeout = setTimeout(function() {
                    if (globeModeActive) {
                        gAdminBoundaries.selectAll('*').remove();
                        ensureAdminBoundariesLoaded().then(drawAdminBoundariesCanvas);
                    } else {
                        drawAdminBoundaries();
                    }
                }, 200);
            }
            function drawAdminBoundaries() {
                gAdminBoundaries.selectAll('*').remove();
                if (!adminBoundariesVisible) {
                    if (adminBoundariesCtx) {
                        var clearRect = getMapRect();
                        adminBoundariesCtx.setTransform((window.devicePixelRatio || 1), 0, 0, (window.devicePixelRatio || 1), 0, 0);
                        adminBoundariesCtx.clearRect(0, 0, clearRect.width, clearRect.height);
                    }
                    return;
                }
                ensureAdminBoundariesLoaded().then(function(features) {
                    if (!features || !features.length || !adminBoundariesVisible) return;
                    if (globeModeActive) {
                        drawAdminBoundariesCanvas(features);
                        return;
                    }
                    drawAdminBoundariesCanvas2D(features);
                });
            }
            var _adminBakedCanvas = null;
            var _adminBakedCtx = null;
            var _adminBakedTransform = null;
            var _adminBakeDirty = true;
            var _adminRingBounds = null;
            var _adminRingBoundsProj = null;
            var _adminRingBoundsFeatures = null;
            function _adminBakeInvalidate() { _adminBakeDirty = true; }
            function _adminRingBoundsFor(features) {
                var proj = getActiveProjection();
                if (_adminRingBounds && _adminRingBoundsProj === proj && _adminRingBoundsFeatures === features) {
                    return _adminRingBounds;
                }
                var collector = {
                    minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity,
                    moveTo: function(x, y) { if (x < this.minX) this.minX = x; if (x > this.maxX) this.maxX = x; if (y < this.minY) this.minY = y; if (y > this.maxY) this.maxY = y; },
                    lineTo: function(x, y) { if (x < this.minX) this.minX = x; if (x > this.maxX) this.maxX = x; if (y < this.minY) this.minY = y; if (y > this.maxY) this.maxY = y; },
                    closePath: function() {},
                    reset: function() { this.minX = Infinity; this.minY = Infinity; this.maxX = -Infinity; this.maxY = -Infinity; }
                };
                var boundsGen = d3.geoPath(proj, collector);
                var out = new Array(features.length);
                for (var i = 0; i < features.length; i++) {
                    collector.reset();
                    var b = boundsGen({ type: 'Feature', geometry: { type: features[i].type, coordinates: features[i].coordinates } });
                    out[i] = isFinite(collector.minX) ? [collector.minX, collector.minY, collector.maxX, collector.maxY] : null;
                }
                _adminRingBounds = out;
                _adminRingBoundsProj = proj;
                _adminRingBoundsFeatures = features;
                return out;
            }
            function _adminNeedsRebake() {
                if (_adminBakeDirty) return true;
                if (!_adminBakedCanvas || !_adminBakedTransform) return true;
                return false;
            }
            function bakeAdminBoundariesCanvas(features) {
                var rect = getMapRect();
                var dpr = window.devicePixelRatio || 1;
                if (!_adminBakedCanvas) {
                    _adminBakedCanvas = document.createElement('canvas');
                    _adminBakedCtx = _adminBakedCanvas.getContext('2d');
                }
                var targetW = Math.max(1, Math.round(rect.width * dpr));
                var targetH = Math.max(1, Math.round(rect.height * dpr));
                if (_adminBakedCanvas.width !== targetW || _adminBakedCanvas.height !== targetH) {
                    _adminBakedCanvas.width = targetW;
                    _adminBakedCanvas.height = targetH;
                }
                var k = (currentTransform && currentTransform.k) || 1;
                var tx = (currentTransform && currentTransform.x) || 0;
                var ty = (currentTransform && currentTransform.y) || 0;
                _adminBakedCtx.setTransform(k * dpr, 0, 0, k * dpr, tx * dpr, ty * dpr);
                _adminBakedCtx.clearRect(-rect.width, -rect.height, rect.width * 3, rect.height * 3);
                var rect2 = getMapRect();
                var margin = 8 / k;
                var vx0 = -tx / k - margin, vy0 = -ty / k - margin, vx1 = (rect2.width - tx) / k + margin, vy1 = (rect2.height - ty) / k + margin;
                var bounds = _adminRingBoundsFor(features);
                var visibleGeoms = [];
                for (var bi = 0; bi < features.length; bi++) {
                    var bb = bounds[bi];
                    if (!bb) continue;
                    if (bb[0] <= vx1 && bb[1] <= vy1 && bb[2] >= vx0 && bb[3] >= vy0) {
                        visibleGeoms.push({ type: features[bi].type, coordinates: features[bi].coordinates });
                    }
                }
                var merged = { type: 'GeometryCollection', geometries: visibleGeoms };
                var proj = getActiveProjection();
                var originalPrecision = proj.precision();
                proj.precision(5);
                var canvasPathGen = d3.geoPath(proj, _adminBakedCtx);
                _adminBakedCtx.beginPath();
                canvasPathGen(merged);
                _adminBakedCtx.strokeStyle = MAP_COLORS.adminBoundaries.stroke;
                _adminBakedCtx.lineWidth = (isMobile ? 0.4 : 0.6) / k;
                _adminBakedCtx.globalAlpha = 0.5;
                _adminBakedCtx.setLineDash([2 / k, 2 / k]);
                _adminBakedCtx.stroke();
                proj.precision(originalPrecision);
                _adminBakedTransform = { k: k, tx: tx, ty: ty };
                _adminBakeDirty = false;
            }
            function drawAdminBoundariesCanvas2D(features) {
                if (!adminBoundariesCtx) return;
                var rect = getMapRect();
                var dpr = window.devicePixelRatio || 1;
                var targetW = rect.width * dpr;
                var targetH = rect.height * dpr;
                if (adminBoundariesCanvas.width !== targetW || adminBoundariesCanvas.height !== targetH) {
                    adminBoundariesCanvas.width = targetW;
                    adminBoundariesCanvas.height = targetH;
                }
                adminBoundariesCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
                adminBoundariesCtx.clearRect(0, 0, rect.width, rect.height);
                if (!adminBoundariesVisible) return;
                if (_adminNeedsRebake()) bakeAdminBoundariesCanvas(features);
                if (!_adminBakedCanvas) return;
                var k = (currentTransform && currentTransform.k) || 1;
                var tx = (currentTransform && currentTransform.x) || 0;
                var ty = (currentTransform && currentTransform.y) || 0;
                var b = _adminBakedTransform;
                var s = k / b.k;
                adminBoundariesCtx.save();
                adminBoundariesCtx.beginPath();
                adminBoundariesCtx.rect(0, 0, rect.width, rect.height);
                adminBoundariesCtx.clip();
                adminBoundariesCtx.globalAlpha = 1;
                adminBoundariesCtx.setTransform(s * dpr, 0, 0, s * dpr, (tx - s * b.tx) * dpr, (ty - s * b.ty) * dpr);
                adminBoundariesCtx.drawImage(_adminBakedCanvas, 0, 0);
                adminBoundariesCtx.restore();
                adminBoundariesCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
            }
            function scheduleAdminBoundariesRedraw() {
                if (!adminBoundariesVisible || globeModeActive) return;
                if (scheduleAdminBoundariesRedraw.pending) return;
                scheduleAdminBoundariesRedraw.pending = true;
                requestAnimationFrame(function() {
                    scheduleAdminBoundariesRedraw.pending = false;
                    if (!adminBoundariesVisible || globeModeActive) return;
                    ensureAdminBoundariesLoaded().then(function(features) {
                        if (features && features.length && adminBoundariesVisible && !globeModeActive) {
                            drawAdminBoundariesCanvas2D(features);
                        }
                    });
                });
            }
            function drawAdminBoundariesCanvas(features) {
                if (!adminBoundariesCtx) return;
                var rect = getMapRect();
                var dpr = window.devicePixelRatio || 1;
                var targetW = rect.width * dpr;
                var targetH = rect.height * dpr;
                if (adminBoundariesCanvas.width !== targetW || adminBoundariesCanvas.height !== targetH) {
                    adminBoundariesCanvas.width = targetW;
                    adminBoundariesCanvas.height = targetH;
                    adminBoundariesCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
                }
                adminBoundariesCtx.clearRect(0, 0, rect.width, rect.height);
                if (!adminBoundariesVisible) return;
                var merged = getMergedAdminBoundaries(features);
                var proj = getActiveProjection();
                var originalPrecision = proj.precision();
                proj.precision(5);
                var canvasPathGen = d3.geoPath(proj, adminBoundariesCtx);
                adminBoundariesCtx.save();
                adminBoundariesCtx.beginPath();
                canvasPathGen(merged);
                adminBoundariesCtx.strokeStyle = MAP_COLORS.adminBoundaries.stroke;
                adminBoundariesCtx.lineWidth = isMobile ? 0.4 : 0.6;
                adminBoundariesCtx.globalAlpha = 0.5;
                adminBoundariesCtx.setLineDash([2, 2]);
                adminBoundariesCtx.stroke();
                adminBoundariesCtx.restore();
                proj.precision(originalPrecision);
            }

            // ── Toggle functions ──
            function toggleNaturalResources() { toggleLayer('naturalResources'); }
            function toggleEthnicGroups()     { toggleLayer('ethnicGroups'); }
            function toggleOceanCurrents()    { toggleLayer('oceanCurrents'); }
            function toggleWinds()            { toggleLayer('winds'); }
            function toggleEarthquakes()      { toggleLayer('earthquakes'); }
            function toggleVolcanoes()        { toggleLayer('volcanoes'); }
            function toggleDesertsForests()   { toggleLayer('desertsForests'); }
            function toggleBorderDisputes()   { toggleLayer('borderDisputes'); }
            function toggleAdminBoundaries() { toggleLayer('adminBoundaries'); }
            function toggleRiversGlaciers()  { toggleLayer('riversAndGlaciers'); }

            function toggleGeopoliticalBlocs() { toggleLayer('geopoliticalBlocs'); }

            // ── Feature detail panels ──
            function showWindDetail(d) {
                selectedFeature = d;
                selectedFeatureType = 'wind';
                var displayName = lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en;
                var typeLabels = {trade: lang==='ar'?'تجارية':lang==='ru'?'Пассаты':lang==='uz'?'Passatlar':lang==='es'?'Vientos alisios':'Trade Winds', westerly: lang==='ar'?'غربية':lang==='ru'?'Западные':lang==='uz'?'G\'arbiy':lang==='es'?'Vientos del oeste':'Westerlies', polar: lang==='ar'?'قطبية':lang==='ru'?'Полярные':lang==='uz'?'Qutbiy':lang==='es'?'Vientos polares':'Polar Easterlies', monsoon: lang==='ar'?'موسمية':lang==='ru'?'Муссоны':lang==='uz'?'Mussonlar':lang==='es'?'Monzones':'Monsoon', seasonal: lang==='ar'?'موسمية':lang==='ru'?'Сезонные':lang==='uz'?'Mevsimiy':lang==='es'?'Estacional':'Seasonal'};
                var html = '<h3>💨 '+displayName+'</h3>';
                html += '<p><strong>'+t('windType')+':</strong> '+(typeLabels[d.type]||d.type)+'</p>';
                if (d.description_ar||d.description_en) html += '<p><strong>'+t('featureDescription')+':</strong> '+(lang==='ar'?d.description_ar:lang==='ru'?(d.description_ru||d.description_en):lang==='uz'?(d.description_uz||d.description_en):lang==='es'?(d.description_es||d.description_en):d.description_en)+'</p>';
                _lastPanelRenderTime = performance.now();
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }
            function showFeatureDetail(type, data) {
                selectedFeature = data;
                selectedFeatureType = type;
                if (type === 'resource') { showResourceDetail(data); return; }
                if (type === 'ethnicGroup') { showEthnicGroupDetail(data); return; }
                if (type === 'oceanCurrent') { showOceanCurrentDetail(data); return; }
                if (type === 'earthquake') { showEarthquakeDetail(data); return; }
                if (type === 'volcano') { showVolcanoDetail(data); return; }
                if (type === 'tectonicPlate') { showTectonicPlateDetail(data); return; }
                if (type === 'desertForest') { showDesertForestDetail(data); return; }
                if (type === 'route') { showRouteDetail(data); return; }
                if (type === 'wind') { showWindDetail(data); return; }
                if (type === 'timezone') {
                    var tzHtml = '<h3>' + t('timezonesLegend') + ': ' + data.label + '</h3>';
                    tzHtml += '<p><strong>' + t('timezonePlaces') + ':</strong> ' + data.places + '</p>';
                    tzHtml += '<p><strong>' + t('timezoneOffset') + ':</strong> UTC' + (data.zone >= 0 ? '+' : '') + data.zone + '</p>';
                    var contentEl = document.getElementById('featureContent');
                    if (contentEl) contentEl.innerHTML = tzHtml;
                    var panel = document.getElementById('featurePanel');
                    if (panel) { panel.classList.remove('visible'); panel.style.display = 'block'; requestAnimationFrame(function(){requestAnimationFrame(function(){panel.classList.add('visible');});}); }
                    return;
                }

                const isMountain = (type === 'mountain');
                const displayName = lang === 'ar' ? data.name : lang === 'ru' ? (data.name_ru || data.name_en || data.name) : lang === 'uz' ?(data.name_uz || data.name_en || data.name): lang === 'es' ?(data.name_es || data.name_en || data.name) : (data.name_en || data.name);
                let html = `<h3>${isMountain ? t('featureMountainTitle') : t('featureRiverTitle')}: ${displayName}</h3>`;
                if (data.length) {
                    html += `<p><strong>${t('featureLength')}:</strong> ${data.length.toLocaleString('en')} ${t('featureKm')}</p>`;
                }
                if (isMountain) {
                    if (data.highestPeak) {
                        const peakName = lang === 'ar' ? data.highestPeak : lang === 'ru' ? (data.highestPeak_ru || data.highestPeak_en || data.highestPeak) : lang === 'uz' ?(data.highestPeak_uz || data.highestPeak_en || data.highestPeak): lang === 'es' ?(data.highestPeak_es || data.highestPeak_en || data.highestPeak) : (data.highestPeak_en || data.highestPeak);
                        html += `<p><strong>${t('featureHighestPeak')}:</strong> ${peakName}`;
                        if (data.highestElevation) html += ` (${data.highestElevation.toLocaleString('en')} ${t('elevationUnit')})`;
                        html += `</p>`;
                    }
                } else {
                    if (data.source_ar || data.source_en) {
                        const src = lang === 'ar' ? data.source_ar : lang === 'ru' ? (data.source_ru || data.source_en) : lang === 'uz' ?(data.source_uz || data.source_en): lang === 'es' ?(data.source_es || data.source_en) : data.source_en;
                        html += `<p><strong>${t('featureSource')}:</strong> ${src}</p>`;
                    }
                    if (data.mouth_ar || data.mouth_en) {
                        const mth = lang === 'ar' ? data.mouth_ar : lang === 'ru' ? (data.mouth_ru || data.mouth_en) : lang === 'uz' ?(data.mouth_uz || data.mouth_en): lang === 'es' ?(data.mouth_es || data.mouth_en) : data.mouth_en;
                        html += `<p><strong>${t('featureMouth')}:</strong> ${mth}</p>`;
                    }
                    if (data.discharge) {
                        html += `<p><strong>${t('featureDischarge')}:</strong> ${data.discharge.toLocaleString('en')} ${t('featureM3s')}</p>`;
                    }
                    if (data.basinArea) {
                        html += `<p><strong>${t('featureBasinArea')}:</strong> ${data.basinArea.toLocaleString('en')} ${t('featureKm2')}</p>`;
                    }
                }
                if (data.countries_ar || data.countries_en) {
                    const cnt = lang === 'ar' ? data.countries_ar : lang === 'ru' ? (data.countries_ru || data.countries_en) : lang === 'uz' ?(data.countries_uz || data.countries_en): lang === 'es' ?(data.countries_es || data.countries_en) : data.countries_en;
                    html += `<p><strong>${t('featureCountries')}:</strong> ${cnt}</p>`;
                }
                if (data.description_ar || data.description_en) {
                    const desc = lang === 'ar' ? data.description_ar : lang === 'ru' ? (data.description_ru || data.description_en) : lang === 'uz' ?(data.description_uz || data.description_en): lang === 'es' ?(data.description_es || data.description_en) : data.description_en;
                    html += `<p><strong>${t('featureDescription')}:</strong> ${desc}</p>`;
                }
                _lastPanelRenderTime = performance.now();
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        countryPanel.classList.add('visible');
                    });
                });
            }

            function closeFeatureDetail() {
                selectedFeature = null;
                selectedFeatureType = null;
            }

            // ── Canvas point layer drawing ──
            function drawPointLayersCanvas() {
                if (!densityCtx) return;
                const rect = getMapRect();
                const dpr = window.devicePixelRatio || 1;
                const targetW = rect.width * dpr;
                const targetH = rect.height * dpr;
                if (densityCanvas.width !== targetW || densityCanvas.height !== targetH) {
                    densityCanvas.width = targetW;
                    densityCanvas.height = targetH;
                    densityCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
                }
                densityCtx.clearRect(0, 0, rect.width, rect.height);
                const proj = getActiveProjection();
                const k = Math.max(0.4, currentTransform.k);
                const tx = currentTransform.x;
                const ty = currentTransform.y;
                var hasAny = false;

                // ── Density spots ──
                if (colorMode === 'density' && densitySpotsMode) {
                    hasAny = true;
                    const spots = isMobile ? densitySpots.filter((d, i) => i % Math.ceil(densitySpots.length / 40) === 0) : densitySpots;
                    const fontSize = Math.max(11, Math.min(22, 13 * Math.pow(k, 0.4)));
                    if (!_isZooming) {
                        densityCtx.font = 'bold ' + fontSize + 'px -apple-system, BlinkMacSystemFont, "Noto Sans Arabic", Tahoma, sans-serif';
                        densityCtx.textBaseline = 'middle';
                    }
                    spots.forEach(s => {
                        if (globeModeActive && !isPointVisibleOnGlobe(s.coords)) return;
                        const [x, y] = proj(s.coords);
                        if (isNaN(x) || isNaN(y)) return;
                        const sx = x * k + tx;
                        const sy = y * k + ty;
                        const margin = 60;
                        if (sx < -margin || sx > rect.width + margin || sy < -margin || sy > rect.height + margin) return;
                        const baseR = Math.max(3, Math.sqrt(s.density) / (isMobile ? 40 : 30));
                        const color = s.density > 10000 ? MAP_COLORS.densitySpots.high : s.density > 4000 ? MAP_COLORS.densitySpots.medium : MAP_COLORS.densitySpots.low;
                        const r1 = Math.max(3, baseR / k);
                        if (!_isZooming) {
                            const r2 = Math.max(5, baseR * 1.8 / k);
                            const r3 = Math.max(8, baseR * 3 / k);
                            densityCtx.beginPath();
                            densityCtx.arc(sx, sy, r3, 0, Math.PI * 2);
                            densityCtx.fillStyle = color;
                            densityCtx.globalAlpha = 0.12;
                            densityCtx.fill();
                            densityCtx.beginPath();
                            densityCtx.arc(sx, sy, r2, 0, Math.PI * 2);
                            densityCtx.globalAlpha = 0.35;
                            densityCtx.fill();
                        }
                        densityCtx.beginPath();
                        densityCtx.arc(sx, sy, r1, 0, Math.PI * 2);
                        densityCtx.fillStyle = color;
                        densityCtx.globalAlpha = 0.95;
                        densityCtx.fill();
                        densityCtx.strokeStyle = MAP_COLORS.ui.white;
                        densityCtx.lineWidth = 1.2;
                        densityCtx.stroke();
                        densityCtx.globalAlpha = 1;
                        if (!_isZooming) {
                            var label = lang === 'ar' ? s.name : lang === 'ru' ? (densitySpotRussian[s.name] || densitySpotEnglish[s.name] || s.name) : lang === 'uz' ?(densitySpotUzbek[s.name] || densitySpotEnglish[s.name] || s.name): lang === 'es' ?(densitySpotSpanish[s.name] || densitySpotEnglish[s.name] || s.name) : (densitySpotEnglish[s.name] || s.name);
                            densityCtx.lineWidth = 3;
                            densityCtx.strokeStyle = MAP_COLORS.ui.textStroke;
                            densityCtx.lineJoin = 'round';
                            densityCtx.strokeText(label, sx + r1 + 3 / k, sy);
                            densityCtx.fillStyle = MAP_COLORS.ui.white;
                            densityCtx.fillText(label, sx + r1 + 3 / k, sy);
                        }
                    });
                }

                // ── Capitals ──
                if (capitalsVisible) {
                    hasAny = true;
                    const fontSize = Math.max(11, Math.min(22, 14 * Math.pow(k, 0.4)));
                    if (!_isZooming) {
                        densityCtx.font = 'bold ' + fontSize + 'px -apple-system, BlinkMacSystemFont, "Noto Sans Arabic", Tahoma, sans-serif';
                        densityCtx.textBaseline = 'middle';
                        densityCtx.textAlign = 'center';
                    }
                    Object.entries(countryInfo).forEach(([name, info]) => {
                        if (!info.capital_coords) return;
                        if (globeModeActive && !isPointVisibleOnGlobe(info.capital_coords)) return;
                        const [x, y] = proj(info.capital_coords);
                        if (isNaN(x) || isNaN(y)) return;
                        const sx = x * k + tx;
                        const sy = y * k + ty;
                        const margin = 60;
                        if (sx < -margin || sx > rect.width + margin || sy < -margin || sy > rect.height + margin) return;
                        const capSize = Math.max(5.5, Math.min(20, (isMobile ? 9 : 11) * Math.pow(k, 0.4)));
                        const capColor = '#ffd700';
                        if (!_isZooming) {
                            densityCtx.beginPath();
                            densityCtx.arc(sx, sy, capSize * 1.9, 0, Math.PI * 2);
                            densityCtx.fillStyle = capColor;
                            densityCtx.globalAlpha = 0.12;
                            densityCtx.fill();
                            densityCtx.beginPath();
                            densityCtx.arc(sx, sy, capSize * 1.35, 0, Math.PI * 2);
                            densityCtx.globalAlpha = 0.3;
                            densityCtx.fill();
                        }
                        densityCtx.beginPath();
                        densityCtx.arc(sx, sy, capSize, 0, Math.PI * 2);
                        densityCtx.fillStyle = capColor;
                        densityCtx.globalAlpha = 0.9;
                        densityCtx.fill();
                        densityCtx.strokeStyle = MAP_COLORS.ui.white;
                        densityCtx.lineWidth = 1.2;
                        densityCtx.stroke();
                        densityCtx.globalAlpha = 1;
                        if (!_isZooming) {
                            const label = lang === 'ar' ? info.capital_ar : lang === 'ru' ? (info.capital_ru || info.capital_en) : lang === 'uz' ?(info.capital_uz || info.capital_en): lang === 'es' ?(info.capital_es || info.capital_en) : info.capital_en;
                            densityCtx.lineWidth = 3;
                            densityCtx.strokeStyle = MAP_COLORS.ui.textStroke;
                            densityCtx.lineJoin = 'round';
                            densityCtx.strokeText(label, sx, sy);
                            densityCtx.fillStyle = MAP_COLORS.ui.white;
                            densityCtx.fillText(label, sx, sy);
                        }
                    });
                }

                // ── Major cities ──
                if (majorCitiesVisible) {
                    hasAny = true;
                    let citySize;
                    if (!_isZooming) {
                        citySize = Math.max(5, Math.min(18, (isMobile ? 8 : 10) * Math.pow(k, 0.4)));
                        _frozenCitySize = citySize;
                    } else {
                        citySize = _frozenCitySize !== null ? _frozenCitySize : Math.max(5, Math.min(18, (isMobile ? 8 : 10) * Math.pow(k, 0.4)));
                    }
                    const cityCatColors = MAP_COLORS.cities;
                    majorCitiesData.forEach(city => {
                        if (globeModeActive && !isPointVisibleOnGlobe(city.coords)) return;
                        const [x, y] = proj(city.coords);
                        if (isNaN(x) || isNaN(y)) return;
                        const sx = x * k + tx;
                        const sy = y * k + ty;
                        const margin = 60;
                        if (sx < -margin || sx > rect.width + margin || sy < -margin || sy > rect.height + margin) return;
                        const fillColor = cityCatColors[city.category] || MAP_COLORS.cities.other;
                        if (!_isZooming) {
                            densityCtx.beginPath();
                            densityCtx.arc(sx, sy, citySize * 1.9, 0, Math.PI * 2);
                            densityCtx.fillStyle = fillColor;
                            densityCtx.globalAlpha = 0.12;
                            densityCtx.fill();
                            densityCtx.beginPath();
                            densityCtx.arc(sx, sy, citySize * 1.35, 0, Math.PI * 2);
                            densityCtx.globalAlpha = 0.3;
                            densityCtx.fill();
                        }
                        densityCtx.beginPath();
                        densityCtx.arc(sx, sy, citySize, 0, Math.PI * 2);
                        densityCtx.fillStyle = fillColor;
                        densityCtx.globalAlpha = 0.9;
                        densityCtx.fill();
                        densityCtx.strokeStyle = MAP_COLORS.ui.white;
                        densityCtx.lineWidth = 1.2;
                        densityCtx.stroke();
                    });
                }

                // ── Admin boundary labels ──
                if (adminBoundariesVisible && adminBoundariesData && currentTransform.k >= 4) {
                    hasAny = true;
                    if (!_isZooming) {
                        const meta = getAdminLabelMeta(adminBoundariesData);
                        const limit = adminTierCount(k, meta.total);
                        const ringBounds = _adminRingBoundsFor(adminBoundariesData);
                        const cell = 32;
                        const grid = new Map();
                        function overlaps(x0, y0, x1, y1) {
                            const gx0 = Math.floor(x0 / cell), gy0 = Math.floor(y0 / cell);
                            const gx1 = Math.floor(x1 / cell), gy1 = Math.floor(y1 / cell);
                            for (let gx = gx0; gx <= gx1; gx++) {
                                for (let gy = gy0; gy <= gy1; gy++) {
                                    const cellRects = grid.get(gx + ',' + gy);
                                    if (cellRects) {
                                        for (let r = 0; r < cellRects.length; r++) {
                                            const rr = cellRects[r];
                                            if (rr.x0 < x1 && rr.x1 > x0 && rr.y0 < y1 && rr.y1 > y0) return true;
                                        }
                                    }
                                }
                            }
                            return false;
                        }
                        function addRect(x0, y0, x1, y1) {
                            const gx0 = Math.floor(x0 / cell), gy0 = Math.floor(y0 / cell);
                            const gx1 = Math.floor(x1 / cell), gy1 = Math.floor(y1 / cell);
                            for (let gx = gx0; gx <= gx1; gx++) {
                                for (let gy = gy0; gy <= gy1; gy++) {
                                    const key = gx + ',' + gy;
                                    let arr = grid.get(key);
                                    if (!arr) { arr = []; grid.set(key, arr); }
                                    arr.push({ x0: x0, y0: y0, x1: x1, y1: y1 });
                                }
                            }
                        }
                        densityCtx.textBaseline = 'middle';
                        densityCtx.textAlign = 'center';
                        densityCtx.lineWidth = 3;
                        densityCtx.strokeStyle = MAP_COLORS.ui.textStroke;
                        densityCtx.fillStyle = 'rgba(255,255,255,0.9)';
                        densityCtx.lineJoin = 'round';
                        const fontFamily = '-apple-system, BlinkMacSystemFont, "Noto Sans Arabic", Tahoma, sans-serif';
                        const pad = 60;
                        for (let oi = 0; oi < meta.items.length && oi < limit; oi++) {
                            const it = meta.items[oi];
                            const bb = ringBounds[it.i];
                            if (!bb) continue;
                            const cx = (bb[0] + bb[2]) / 2, cy = (bb[1] + bb[3]) / 2;
                            if (isNaN(cx) || isNaN(cy)) continue;
                            const sx = cx * k + tx, sy = cy * k + ty;
                            if (sx < -pad || sx > rect.width + pad || sy < -pad || sy > rect.height + pad) continue;
                            if (globeModeActive && !isPointVisibleOnGlobe(it.centroid)) continue;
                            const label = getAdminDisplayName(it.name);
                            if (!label) continue;
                            const wpx = (bb[2] - bb[0]) * k, hpx = (bb[3] - bb[1]) * k;
                            if (wpx < 2 || hpx < 2) continue;
                            let fs = Math.min(wpx / (label.length * 0.6), hpx / 1.5, 16);
                            if (fs < 9) continue;
                            densityCtx.font = fs + 'px ' + fontFamily;
                            const tw = densityCtx.measureText(label).width;
                            if (tw > wpx) {
                                fs = Math.floor(fs * wpx / tw);
                                if (fs < 9) continue;
                                densityCtx.font = fs + 'px ' + fontFamily;
                            }
                            const th = fs * 1.4;
                            const lx0 = sx - tw / 2 - 2, ly0 = sy - th / 2 - 2;
                            const lx1 = sx + tw / 2 + 2, ly1 = sy + th / 2 + 2;
                            if (overlaps(lx0, ly0, lx1, ly1)) continue;
                            addRect(lx0, ly0, lx1, ly1);
                            densityCtx.strokeText(label, sx, sy);
                            densityCtx.fillText(label, sx, sy);
                        }
                    }
                }
            }

                // ── Country labels ──
            function getAreaThreshold() {
                const zoom = currentTransform.k;
                if (zoom > 1.5) return -1;
                let threshold = 0.001 / (zoom + 0.1);
                if (isMobile) threshold *= 1.2;
                return threshold;
            }

            function getLabelFontSize() {
                const zoom = currentTransform.k || 1;
                const minScreenPx = isMobile ? 12 : 16;
                const maxScreenPx = isMobile ? 18 : 24;
                const screenPx = Math.max(minScreenPx, Math.min(maxScreenPx, minScreenPx * Math.pow(zoom, 0.45)));
                return screenPx / zoom;
            }

            function drawCountryLabels(features) {
                if (countryLabelSelection) {
                    countryLabelSelection.remove();
                    countryLabelSelection = null;
                }
                if (!showLabels) return;

                const threshold = getAreaThreshold();
                const fontSize = getLabelFontSize();
                const proj = getActiveProjection();
                const labelGroup = gCountryLabels.append('g').attr('class', 'country-label-group');
                const featuresToLabel = isMobile ? features.filter(d => d3.geoArea(d) > 0.005) : features;
                featuresToLabel.forEach(d => {
                    const name = d.properties?.name || '';
                    const displayName = getDisplayName(name);
                    const area = d3.geoArea(d);
                    if (threshold >= 0 && area < threshold) return;

                    let centroid;
                    if (labelPositions[name]) {
                        const [lon, lat] = labelPositions[name];
                        centroid = proj([lon, lat]);
                    } else {
                        const c = d3.geoCentroid(d);
                        centroid = proj(c);
                    }
                    if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1])) {
                        try {
                            const c = d3.geoPath(proj).centroid(d);
                            if (c && !isNaN(c[0]) && !isNaN(c[1])) centroid = c;
                        } catch (e) {}
                    }
                    if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1])) return;

                    const x = centroid[0],
                        y = centroid[1];
                    const text = labelGroup.append('text')
                        .attr('x', x).attr('y', y)
                        .attr('class', 'country-label')
                        .text(displayName)
                        .attr('font-size', fontSize + 'px')
                        .attr('fill', MAP_COLORS.ui.white)
                        .attr('font-weight', 600)
                        .attr('text-anchor', 'middle')
                        .attr('dominant-baseline', 'central')
                        .attr('vector-effect', 'non-scaling-stroke')
                        .attr('style', 'text-shadow: 0 1px 3px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.7); letter-spacing: 0.3px;');
                    text.datum({ feature: d, area: area, name: name, displayName: displayName });
                });
                countryLabelSelection = labelGroup.selectAll('.country-label');
            }

            function updateLabels() {
                if (!countryLabelSelection) return;
                if (!showLabels) {
                    countryLabelSelection.style('opacity', 0);
                    return;
                }
                const threshold = getAreaThreshold();
                const fontSize = getLabelFontSize();
                countryLabelSelection.each(function(d) {
                    const el = d3.select(this);
                    const data = el.datum();
                    if (!data) return;
                    const area = data.area;
                    el.attr('font-size', fontSize + 'px');
                    if (threshold < 0) {
                        el.style('opacity', 1);
                    } else if (area < threshold) {
                        el.style('opacity', 0);
                    } else {
                        el.style('opacity', 1);
                    }
                    const newDisplay = getDisplayName(data.name);
                    if (el.text() !== newDisplay) el.text(newDisplay);
                });
            }

            function toggleLabels() {
                showLabels = !showLabels;
                labelsToggle.classList.toggle('toggle-on', showLabels);
                labelsToggle.setAttribute('aria-pressed', showLabels ? 'true' : 'false');
                if (countryLabelSelection) {
                    countryLabelSelection.remove();
                    countryLabelSelection = null;
                }
                if (showLabels) {
                    drawCountryLabels(allCountryFeatures);
                } else {
                    gCountryLabels.selectAll('.country-label-group').remove();
                    countryLabelSelection = null;
                }
                updateLegend();
                updateHash();
                updateActiveLayerCount();
            }

            // ── Tooltip & coordinates display ──
            let _coordsRAFPending = false;
            let _pendingMouseEvent = null;
            let _tooltipRAFPending = false;
            let _pendingTooltipEvent = null;
            function _flushTooltipPosition() {
                _tooltipRAFPending = false;
                if (!_pendingTooltipEvent) return;
                const e = _pendingTooltipEvent;
                _pendingTooltipEvent = null;
                const r = getMapRect();
                const tx = e.clientX - r.left;
                const ty = e.clientY - r.top;
                const tw = _tooltipSize.w;
                const th = _tooltipSize.h;
                const margin = 16;
                let lx = tx + margin;
                let ly = ty - th - margin;
                if (lx + tw > r.width) lx = tx - tw - margin;
                if (ly < 0) ly = ty + margin;
                if (lx < 0) lx = margin;
                tooltip.style.left = lx + 'px';
                tooltip.style.top = ly + 'px';
            }
            function _flushCoords() {
                _coordsRAFPending = false;
                if (!_pendingMouseEvent) return;
                var ev = _pendingMouseEvent;
                _pendingMouseEvent = null;
                if (!coordsVisible) {
                    coordinatesDisplay.classList.add('hidden');
                    return;
                }
                coordinatesDisplay.classList.remove('hidden');
                const rect = getMapRect();
                const x = ev.clientX - rect.left;
                const y = ev.clientY - rect.top;
                const svgPoint = currentTransform.invert([x, y]);
                const coords = projection.invert(svgPoint);
                const modeLabel = t(`mode_${colorMode}`) || colorMode;
                const filterLabel = t(`religion_${currentReligionFilter}`) || currentReligionFilter;
                const zoom = currentTransform.k.toFixed(1);
                if (coords && !isNaN(coords[0]) && !isNaN(coords[1])) {
                    const lon = coords[0].toFixed(2);
                    const lat = coords[1].toFixed(2);
                    coordinatesDisplay.textContent =
                        `${t('lon')}: ${lon} | ${t('lat')}: ${lat} | ${t('zoom')}: ${zoom}x | ${t('mode')}: ${modeLabel} | ${t('filter')}: ${filterLabel}`;
                } else {
                    coordinatesDisplay.textContent =
                        `${t('lon')}: — | ${t('lat')}: — | ${t('zoom')}: ${currentTransform.k.toFixed(1)}x | ${t('mode')}: ${modeLabel} | ${t('filter')}: ${filterLabel}`;
                }
            }
            function updateCoordinatesDisplay(event) {
                _pendingMouseEvent = event;
                if (_coordsRAFPending) return;
                _coordsRAFPending = true;
                requestAnimationFrame(_flushCoords);
            }

            // ── Style update & legend rendering ──
            function updateAllStyles() {
                if (!countryPaths) return;
                countryPaths.transition().duration(prefersReducedMotion() ? 0 : 400)
                    .attr('fill', d => getCountryFill(d))
                    .attr('opacity', d => getOpacity(d));
                countryPaths.attr('stroke', d => getStroke(d))
                    .attr('stroke-width', d => getStrokeWidth(d))
                    .attr('filter', getCountryFilterAttr)
                    .attr('aria-label', d => getDisplayName(d.properties?.name || ''));
                if (countryLabelSelection) {
                    countryLabelSelection.remove();
                    countryLabelSelection = null;
                }
                drawCountryLabels(allCountryFeatures);
                drawColorblindOverlay();
                drawPhysicalFeatures();
                drawIceCap();
                drawCorridors();
                drawPointLayersCanvas();
                drawCapitals();
                drawTimezones();
                drawMajorCities();
                drawNaturalResources();
                drawEthnicGroups();
                drawOceanCurrents();
                drawWinds();
                drawEarthquakes();
                drawVolcanoes();
                drawGeopoliticalBlocs();
                drawDesertsForests();
                drawBorderDisputes();
                if (!(_annotStrokePoints && _annotStrokePoints.length)) {
                    try { redrawAnnotations(); if (annotateKind === 'region' && annotatePoints && annotatePoints.length > 0) redrawAnnotationDrawing(); } catch (e) {}
                }
                updateLegend();
                if (selectedCountry && countryPanel.style.display === 'block' && !compareCountry) renderCountryPanel(
                    selectedCountry);
                if (selectedFeature && countryPanel.style.display === 'block' && !selectedCountry && !compareCountry) {
                    showFeatureDetail(selectedFeatureType, selectedFeature);
                }
                if (selectedCountry) highlightSelectedCountry(selectedCountry);
                updateHash();
            }

            function highlightSelectedCountry(d) {
                countryPaths.classed('highlighted-country', false);
                countryPaths.attr('stroke', d => getStroke(d)).attr('stroke-width', d => getStrokeWidth(d));
                countryPaths.each(function() { this.style.removeProperty('filter'); });
                if (d) {
                    countryPaths.filter(p => p === d).classed('highlighted-country', true);
                }
            }

            function updateActiveLayerCount() {
                var counter = document.getElementById('layerCounter');
                if (!counter) return;
                var count = 0;
                var toggles = document.querySelectorAll('#layersModalBody .btn.toggle-on');
                if (toggles) count = toggles.length;
                counter.textContent = count;
            }

            function updateLegend() {
                let html = '';
                if (colorMode === 'terrain') {
                    html += `<div style="font-weight:700;margin-bottom:4px">${t('terrainLegend')}</div>`;
                    const unit = t('elevationUnit');
                    [
                        { l: `<0${unit}`, c: getTerrainColor(-1) },
                        { l: `0-200`, c: getTerrainColor(100) },
                        { l: `200-700`, c: getTerrainColor(500) },
                        { l: `700-2000`, c: getTerrainColor(1500) },
                        { l: `>3000`, c: getTerrainColor(3500) }
                    ].forEach(r => html +=
                        `<div class="legend-item"><span class="legend-color" style="background:${r.c}"></span>${r.l}</div>`
                        );
                } else if (colorMode === 'density') {
                    html += `<div style="font-weight:700;margin-bottom:4px">${t('densityLegend')}</div>`;
                    const stops = [getDensityColor(1),getDensityColor(20),getDensityColor(80),getDensityColor(250),getDensityColor(700)].join(',');
                    html += `<div class="legend-gradient-labels"><span>&lt;1</span><span>&gt;500</span></div>`;
                    html += `<div class="legend-gradient-bar" style="background:linear-gradient(to right,${stops})"></div>`;
                    html += `<div style="font-size:0.8em;color:var(--text-secondary);margin-top:2px">${t('densityUnit')}</div>`;
                } else if (colorMode === 'precipitation') {
                    html += `<div style="font-weight:700;margin-bottom:4px">${t('precipitationLegend')}</div>`;
                    const stops = [getPrecipitationColor(30),getPrecipitationColor(200),getPrecipitationColor(700),getPrecipitationColor(1800),getPrecipitationColor(3200)].join(',');
                    html += `<div class="legend-gradient-labels"><span>&lt;100</span><span>&gt;3000</span></div>`;
                    html += `<div class="legend-gradient-bar" style="background:linear-gradient(to right,${stops})"></div>`;
                    html += `<div style="font-size:0.8em;color:var(--text-secondary);margin-top:2px">${t('precipYear')}</div>`;
                } else if (colorMode === 'temperature') {
                    html += `<div style="font-weight:700;margin-bottom:4px">${t('temperatureLegend')}</div>`;
                    const stops = [getTempColor(-15),getTempColor(-3),getTempColor(8),getTempColor(18),getTempColor(28),getTempColor(35)].join(',');
                    html += `<div class="legend-gradient-labels"><span>&lt;0°</span><span>&gt;30°</span></div>`;
                    html += `<div class="legend-gradient-bar" style="background:linear-gradient(to right,${stops})"></div>`;
                    html += `<div style="font-size:0.8em;color:var(--text-secondary);margin-top:2px">${t('celsiusLabel')}</div>`;
                } else if (colorMode === 'gdp') {
                    html += `<div style="font-weight:700;margin-bottom:4px">${t('gdpLegend')}</div>`;
                    const stops = MAP_COLORS.gdp.slice(1).join(',');
                    html += `<div class="legend-gradient-labels"><span>&lt;$1k</span><span>&gt;$80k</span></div>`;
                    html += `<div class="legend-gradient-bar" style="background:linear-gradient(to right,${stops})"></div>`;
                    html += `<div style="font-size:0.8em;color:var(--text-secondary);margin-top:2px">${t('gdpUnit')}</div>`;
                } else if (colorMode === 'hdi') {
                    html += `<div style="font-weight:700;margin-bottom:4px">${t('hdiLegend')}</div>`;
                    const stops = MAP_COLORS.hdi.slice(1).join(',');
                    html += `<div class="legend-gradient-labels"><span>&lt;0.55</span><span>&gt;0.90</span></div>`;
                    html += `<div class="legend-gradient-bar" style="background:linear-gradient(to right,${stops})"></div>`;
                } else if (colorMode === 'normal') {
                    html += `<div>${t('normalLegend')}</div>`;
                } else {
                    html += `<div style="font-weight:700;margin-bottom:4px">${t('religionLegend')}</div>`;
                    Object.entries(sectMode ? denominationColors : religionColors).forEach(([k, v]) => {
                        const label = sectMode ? (lang === 'ar' ? (denominationArabic[k] || k) : lang === 'ru' ? (denominationRussian[k] || k) : lang === 'uz' ?(denominationUzbek[k] || k): lang === 'es' ?(denominationSpanish[k] || k) : k) : (lang === 'ar' ? (religionArabic[k] || k) : lang === 'ru' ? (religionRussian[k] || k) : lang === 'uz' ?(religionUzbek[k] || k): lang === 'es' ?(religionSpanish[k] || k) : k);
                        html +=
                            `<div class="legend-item"><span class="legend-color" style="background:${v}"></span>${label}</div>`;
                    });
                }
                if (corridorsVisible||additionalWaterwaysVisible) html += `<div>🛣️ ${t('routes')}</div>`;
                if (riversGlaciersVisible) html += `<div>${t('riversOn')}</div>`;
                if (densitySpotsMode && colorMode === 'density') html += `<div>${t('spotsOn')}</div>`;
                if (capitalsVisible) html += `<div>${t('capitalsOn')}</div>`;
                if (timezonesVisible) {
                    html += '<div style="font-weight:700;margin-bottom:4px">' + t('timezonesLegend') + '</div>';
                    var tzStops = MAP_COLORS.timezones.join(',');
                    html += '<div class="legend-gradient-labels"><span>UTC-12</span><span>UTC+14</span></div>';
                    html += '<div class="legend-gradient-bar" style="background:linear-gradient(to right,' + tzStops + ')"></div>';
                }
                if (majorCitiesVisible) {
                    html += `<div style="font-weight:700;margin-bottom:4px">${t('cityLegend')}</div>`;
                    var cityCatColors = MAP_COLORS.cities;
                    var cityCatLabels = { tourist: t('cityCategoryTourist'), commercial: t('cityCategoryCommercial'), industrial: t('cityCategoryIndustrial'), agricultural: t('cityCategoryAgricultural') };
                    Object.entries(cityCatColors).forEach(function(e) {
                        html += `<div class="legend-item"><span class="legend-color" style="background:${e[1]}"></span>${cityCatLabels[e[0]]}</div>`;
                    });
                }
                if (naturalResourcesVisible) {
                    html += `<div style="font-weight:700;margin-bottom:4px">${t('naturalResourcesLegend')}</div>`;
                    var resLegendColors = {};
                    Object.keys(MAP_COLORS.naturalResources).forEach(function(k) {
                        if (k !== 'default') resLegendColors[k] = MAP_COLORS.naturalResources[k];
                    });
                    var resLabels = {
                        oil: t('resourceOil'), gas: t('resourceGas'), coal: t('resourceCoal'),
                        copper: t('resourceCopper'), gold: t('resourceGold'), iron: t('resourceIron'),
                        diamond: t('resourceDiamond'), phosphate: t('resourcePhosphate'), uranium: t('resourceUranium'),
                        lithium: t('resourceLithium'), cobalt: t('resourceCobalt'), rareEarth: t('resourceRareEarths'),
                        silver: t('resourceSilver'), platinum: t('resourcePlatinum'), bauxite: t('resourceBauxite'),
                        nickel: t('resourceNickel'), tin: t('resourceTin'), zinc: t('resourceZinc'),
                        potash: t('resourcePotash'), renewable: t('resourceRenewable'), water: t('resourceWater'),
                        forest: t('resourceForest')
                    };
                    Object.entries(resLegendColors).forEach(function(e) {
                        html += `<div class="legend-item"><span class="legend-color" style="background:${e[1]}"></span>${resLabels[e[0]]}</div>`;
                    });
                }
                if (ethnicGroupsVisible) {
                    html += `<div style="font-weight:700;margin-bottom:4px">${t('ethnicGroupsLegend')}</div>`;
                    html += `<div style="font-size:0.8em;color:var(--text-secondary)">${t('ethnicLegendDesc')}</div>`;
                }
                if (oceanCurrentsVisible) {
                    html += `<div style="font-weight:700;margin-bottom:4px">${t('oceanCurrentsLegend')}</div>`;
                    var currentLegendItems = [
                        { c: MAP_COLORS.oceanCurrents.warm, l: t('warmCurrent') },
                        { c: MAP_COLORS.oceanCurrents.cold, l: t('coldCurrent') },
                        { c: MAP_COLORS.oceanCurrents.gyre, l: t('gyre') },
                        { c: MAP_COLORS.oceanCurrents.trench, l: t('oceanTrench') }
                    ];
                    currentLegendItems.forEach(function(it){ html += `<div class="legend-item"><span class="legend-color" style="background:${it.c}"></span>${it.l}</div>`; });
                }
                if (windsVisible) {
                    html += `<div style="font-weight:700;margin-bottom:4px">${t('windsLegend')}</div>`;
                    var windLegendItems = [
                        { c: MAP_COLORS.winds.trade, l: t('tradeWinds') },
                        { c: MAP_COLORS.winds.westerly, l: t('westerlyWinds') },
                        { c: MAP_COLORS.winds.polar, l: t('polarWinds') },
                        { c: MAP_COLORS.winds.monsoon, l: t('monsoonWinds') }
                    ];
                    windLegendItems.forEach(function(it){ html += `<div class="legend-item"><span class="legend-color" style="background:${it.c}"></span>${it.l}</div>`; });
                }
                if (earthquakesVisible) {
                    html += `<div style="font-weight:700;margin-bottom:4px">${t('earthquakesLegend')}</div>`;
                    var quakeLegendItems = [
                        { c: MAP_COLORS.earthquakes.major9, l: t('magAbove9') },
                        { c: MAP_COLORS.earthquakes.major8, l: '8.0 – 8.9' },
                        { c: MAP_COLORS.earthquakes.major7, l: '7.0 – 7.9' },
                        { c: MAP_COLORS.earthquakes.major6, l: '6.0 – 6.9' },
                        { c: MAP_COLORS.earthquakes.below6, l: t('belowMag6') }
                    ];
                    quakeLegendItems.forEach(function(it){ html += `<div class="legend-item"><span class="legend-color" style="background:${it.c}"></span>${it.l}</div>`; });
                }
                if (volcanoesVisible) {
                    html += `<div style="font-weight:700;margin-bottom:4px">${t('volcanoesLegend')}</div>`;
                    html += `<div style="font-size:0.8em;color:var(--text-secondary)">${t('volcanoLegendDesc')}</div>`;
                }
                if (geopoliticalBlocsVisible) {
                    html += `<div style="font-weight:700;margin-bottom:4px">${t('geopoliticalBlocsLegend')}</div>`;
                    if (selectedBloc !== 'all') {
                        var selBloc = geopoliticalBlocsData.find(function(b){return b.name_en===selectedBloc||b.name===selectedBloc;});
                        if (selBloc) html += `<div style="font-size:0.85em;color:${selBloc.color};margin-top:2px">◉ ${lang==='ar'?selBloc.name:lang==='ru'?(selBloc.name_ru||selBloc.name_en):lang==='uz'?(selBloc.name_uz||selBloc.name_en):lang==='es'?(selBloc.name_es||selBloc.name_en):selBloc.name_en}</div>`;
                    } else {
                        html += `<div style="font-size:0.8em;color:var(--text-secondary)">${t('geopoliticalBlocHint')}</div>`;
                    }
                }
                if (desertsForestsVisible) {
                    html += `<div style="font-weight:700;margin-bottom:4px">${t('desertsForestsLegend')}</div>`;
                    html += `<div class="legend-item"><span class="legend-color" style="background:${MAP_COLORS.desertsForests.desert}"></span>${t('desertLabel')}</div>`;
                    html += `<div class="legend-item"><span class="legend-color" style="background:${MAP_COLORS.desertsForests.forest}"></span>${t('forestLabel')}</div>`;
                }
                if (borderDisputesVisible) {
                    html += `<div style="font-weight:700;margin-bottom:4px">${t('borderDisputesLegend')}</div>`;
                    html += `<div class="legend-item"><span class="legend-color" style="background:${MAP_COLORS.borderDisputes.active}"></span>${t('activeConflict')}</div>`;
                    html += `<div class="legend-item"><span class="legend-color" style="background:${MAP_COLORS.borderDisputes.ceasefire}"></span>${t('ceasefireLabel')}</div>`;
                    html += `<div class="legend-item"><span class="legend-color" style="background:${MAP_COLORS.borderDisputes.maritime}"></span>${t('maritimeDispute')}</div>`;
                }
                if (colorMode === 'terrain' || riversGlaciersVisible) html += `<div style="margin-top:4px;font-size:0.85em;color:var(--text-secondary)">${t('featureClickHint')}</div>`;
                legendEl.innerHTML = html;
            }

            // ── Color mode switching ──
            function setMode(mode) {
                if (colorMode === mode) return;
                const previousMode = colorMode;
                colorMode = mode;
                if (previousMode === 'density' && mode !== 'density' && densitySpotsMode) {
                    densitySpotsMode = false;
                    densitySpotsToggle.classList.remove('toggle-on');
                    if (densityCtx) densityCtx.clearRect(0, 0, densityCanvas.width, densityCanvas.height);
                }
                setActiveByAttr(modeButtons, `.mode-btn[data-mode="${mode}"]`);
                requestAnimationFrame(function() { updateAllStyles(); });
                updateCoordinatesDisplay({ clientX: 0, clientY: 0 });
            }

            // ── Additional toggle functions ──
            function toggleSect() {
                sectMode = !sectMode;
                sectToggle.classList.toggle('toggle-on', sectMode);
                sectToggle.setAttribute('aria-pressed', sectMode ? 'true' : 'false');
                if (sectMode && colorMode !== 'religion') setMode('religion');
                else updateAllStyles();
                updateActiveLayerCount();
            }

            function toggleRoutes() {
                corridorsVisible = !corridorsVisible;
                additionalWaterwaysVisible = corridorsVisible;
                corridorsToggle.classList.toggle('toggle-on', corridorsVisible);
                corridorsToggle.setAttribute('aria-pressed', corridorsVisible ? 'true' : 'false');
                drawRoutes();
                updateLegend();
                updateActiveLayerCount();
            }
            function toggleCorridors() { toggleRoutes(); }
            function toggleAdditionalWaterways() { toggleRoutes(); }

            function toggleDensitySpots() {
                densitySpotsMode = !densitySpotsMode;
                densitySpotsToggle.classList.toggle('toggle-on', densitySpotsMode);
                densitySpotsToggle.setAttribute('aria-pressed', densitySpotsMode ? 'true' : 'false');
                if (densitySpotsMode && colorMode !== 'density') {
                    setMode('density');
                } else {
                    drawPointLayersCanvas();
                    updateLegend();
                }
                updateActiveLayerCount();
            }

            function toggleCapitals() { toggleLayer('capitals'); }
            function toggleTimezones() { toggleLayer('timezones'); }
            function toggleMajorCities() { toggleLayer('majorCities'); }

            function toggleCoords() {
                coordsVisible = !coordsVisible;
                if (coordsToggle) {
                    coordsToggle.classList.toggle('toggle-on', coordsVisible);
                    coordsToggle.setAttribute('aria-pressed', coordsVisible ? 'true' : 'false');
                }
                var cd = document.getElementById('coordinatesDisplay');
                if (cd) cd.classList.toggle('hidden', !coordsVisible);
                updateActiveLayerCount();
                updateHash();
            }

            /* ── Globe mode ─────────────────────────────────── */
            function getActiveProjection() {
                return globeModeActive && globeProjection ? globeProjection : projection;
            }

            function rebuildPathGen() {
                pathGen = d3.geoPath(getActiveProjection());
                pathGen.pointRadius(isMobile ? 1.5 : 3);
            }

            function isPointVisibleOnGlobe(lonLat) {
                if (!globeModeActive) return true;
                var rotation = globeProjection.rotate();
                var center = [-rotation[0], -rotation[1]];
                var distance = d3.geoDistance(lonLat, center);
                return distance < Math.PI / 2;
            }

            function getQuestionTargetCoords(q) {
                var layer = QUIZ_LAYERS.find(function(l) { return l.id === q.layerId; });
                if (!layer) return null;
                if (layer.checkType === 'polygon') {
                    try { return d3.geoCentroid(q.item); } catch (e) { return null; }
                }
                if (layer.checkType === 'bloc') {
                    return q.item.coords || null;
                }
                if (layer.checkType === 'line' && q.item.coords && q.item.coords.length >= 2) {
                    var mid = Math.floor(q.item.coords.length / 2);
                    return q.item.coords[mid];
                }
                return getItemCoords(q.item, q.layerId) || null;
            }

            function getCustomQuestionTargetCoords(cq) {
                var q = cq.question;
                if (!q.coords) return null;
                if (q.type === 'line' && Array.isArray(q.coords[0])) {
                    var mid = Math.floor(q.coords.length / 2);
                    return q.coords[mid];
                }
                if (Array.isArray(q.coords) && q.coords.length >= 2 && !Array.isArray(q.coords[0])) {
                    return q.coords;
                }
                return null;
            }

            function rotateGlobeToReveal(lonLat, duration, onComplete) {
                if (!globeModeActive || !globeProjection || !lonLat) { if (onComplete) onComplete(); return; }
                var targetRotation = [-lonLat[0], -lonLat[1] * 0.6];
                var current = globeProjection.rotate();
                if (isPointVisibleOnGlobe(lonLat) && d3.geoDistance(lonLat, [-current[0], -current[1]]) < Math.PI / 3) {
                    if (onComplete) onComplete();
                    return;
                }
                if (prefersReducedMotion()) {
                    globeRotation = targetRotation;
                    globeProjection.rotate(globeRotation);
                    drawGlobeFrame(false);
                    if (onComplete) onComplete();
                    return;
                }
                var interpolateRotation = d3.interpolate(current, targetRotation);
                var start = null;
                function step(timestamp) {
                    if (!start) start = timestamp;
                    var t = Math.min(1, (timestamp - start) / (duration || 600));
                    var eased = t * (2 - t);
                    globeRotation = interpolateRotation(eased);
                    globeProjection.rotate(globeRotation);
                    if (t < 1) {
                        drawGlobeFrame(true);
                        requestAnimationFrame(step);
                    } else {
                        drawGlobeFrame(false);
                        if (onComplete) onComplete();
                    }
                }
                requestAnimationFrame(step);
            }

            function initGlobeProjection() {
                var dims = getContainerDimensions();
                var size = Math.min(dims.width, dims.height);
                globeProjection = d3.geoOrthographic()
                    .scale(size * 0.42)
                    .translate([dims.width / 2, dims.height / 2])
                    .rotate(globeRotation)
                    .clipAngle(90);
            }

            function ensureGlobeSvgDefs() {
                if (document.getElementById('globeShading')) return;
                var defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs');
                var grad = defs.append('radialGradient')
                    .attr('id', 'globeShading')
                    .attr('cx', '35%').attr('cy', '35%').attr('r', '70%');
                grad.append('stop').attr('offset', '0%').attr('stop-color', '#2a5580');
                grad.append('stop').attr('offset', '100%').attr('stop-color', '#0d1e30');

                var glowGrad = defs.append('radialGradient')
                    .attr('id', 'atmosphereGlow')
                    .attr('cx', '50%').attr('cy', '50%').attr('r', '50%');
                glowGrad.append('stop').attr('offset', '85%').attr('stop-color', 'transparent');
                glowGrad.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(70,160,255,0.25)');

                var blurFilter = defs.append('filter').attr('id', 'atmosphereBlur')
                    .attr('x', '-20%').attr('y', '-20%').attr('width', '140%').attr('height', '140%');
                blurFilter.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', '6');
            }

            function drawGlobeFrame(isDragging) {
                if (!globeModeActive || !globeProjection) return;
                rebuildPathGen();
                gOcean.selectAll('*').remove();
                var dims = getContainerDimensions();
                var r = globeProjection.scale();

                gOcean.append('circle')
                    .attr('cx', dims.width / 2)
                    .attr('cy', dims.height / 2)
                    .attr('r', r + 12)
                    .attr('fill', 'url(#atmosphereGlow)')
                    .attr('filter', 'url(#atmosphereBlur)');

                gOcean.append('circle')
                    .attr('cx', dims.width / 2)
                    .attr('cy', dims.height / 2)
                    .attr('r', r)
                    .attr('fill', 'url(#globeShading)');

                drawGraticule();
                drawIceCap();
                gCountries.selectAll('path')
                    .attr('d', pathGen)
                    .attr('fill', isDragging ? 'var(--panel-bg, #3a4a5c)' : function(d) { return getCountryFill(d); })
                    .attr('stroke', isDragging ? 'rgba(255,255,255,0.5)' : function(d) { return getStroke(d); })
                    .attr('stroke-width', isDragging ? 0.6 : function(d) { return getStrokeWidth(d); })
                    .attr('opacity', isDragging ? 0.9 : function(d) { return getOpacity(d); });

                if (!isDragging) {
                    if (countryLabelSelection) { countryLabelSelection.remove(); countryLabelSelection = null; }
                    drawCountryLabels(allCountryFeatures);
                    drawPhysicalFeatures();
                    drawCorridors();
                    drawTimezones();
                    drawGeopoliticalBlocs();
                    drawDesertsForests();
                    drawBorderDisputes();
                    drawAdminBoundariesDebounced();
                    drawNaturalResources();
                    drawEthnicGroups();
                    drawOceanCurrents();
                    drawWinds();
                    drawEarthquakes();
                    drawVolcanoes();
                    drawPointLayersCanvas();
                }
            }

            function requestGlobeRedraw() {
                if (globeRedrawPending) return;
                globeRedrawPending = true;
                requestAnimationFrame(function() {
                    globeRedrawPending = false;
                    drawGlobeFrame(true);
                });
            }

            function fullGlobeRedraw() {
                drawGlobeFrame(false);
            }

            function toggleGlobeMode() {
                resetLayersAndModes();
                _adminBakeDirty = true;
                globeModeActive = !globeModeActive;
                if (globeViewBtn) globeViewBtn.classList.toggle('toggle-on', globeModeActive);

                if (globeModeActive) {
                    var quizBtnEl = document.getElementById('quizBtn');
                    if (quizBtnEl) { quizBtnEl.disabled = true; quizBtnEl.classList.add('quiz-disabled'); quizBtnEl.title = t('quizUnavailableOnGlobe'); }
                    clearMeasurement();
                    var lbl = document.getElementById('headerProjectionLabel');
                    if (lbl) { lbl.setAttribute('data-i18n', 'globeProjectionType'); lbl.textContent = t('globeProjectionType'); }
                    initGlobeProjection();
                    ensureGlobeSvgDefs();
                    projection = globeProjection;
                    rebuildPathGen();
                    currentTransform = d3.zoomIdentity;
                    applyMapTransform(d3.zoomIdentity);
                    svg.on('.zoom', null);
                    if (globeDrag) svg.call(globeDrag); else {
                        globeDrag = d3.drag()
                            .on('start', function() { globeDragging = true; })
                            .on('drag', function(e) {
                                var rotateSpeed = 0.25;
                                globeRotation[0] += e.dx * rotateSpeed;
                                globeRotation[1] = Math.max(-90, Math.min(90, globeRotation[1] - e.dy * rotateSpeed));
                                globeProjection.rotate(globeRotation);
                                requestGlobeRedraw();
                            })
                            .on('end', function() { globeDragging = false; fullGlobeRedraw(); });
                        svg.call(globeDrag);
                    }
                    gGraticule.selectAll('*').remove();
                    gCountries.selectAll('*').remove();
                    if (countryLabelSelection) { countryLabelSelection.remove(); countryLabelSelection = null; }
                    if (allCountryFeatures && allCountryFeatures.length) {
                        countryPaths = gCountries.selectAll('path')
                            .data(allCountryFeatures)
                            .join('path')
                            .attr('d', pathGen)
                            .attr('fill', function(d) { return getCountryFill(d); })
                            .attr('stroke', function(d) { return getStroke(d); })
                            .attr('stroke-width', function(d) { return getStrokeWidth(d); })
                            .attr('opacity', function(d) { return getOpacity(d); })
                            .attr('filter', getCountryFilterAttr)
                            .attr('cursor', 'pointer')
                            .attr('vector-effect', 'non-scaling-stroke')
                            .on('click', handleCountryActivate);
                    }
                    if (measurePoints.length > 0) { if (!gMeasure) gMeasure = gMap.append('g').attr('class', 'measure-layer'); redrawMeasureLayer(); }
                    clearAnnotationsView();
                    fullGlobeRedraw();
                } else {
                    var quizBtnEl2 = document.getElementById('quizBtn');
                    if (quizBtnEl2) { quizBtnEl2.disabled = false; quizBtnEl2.classList.remove('quiz-disabled'); quizBtnEl2.title = t('quizMode'); }
                    clearMeasurement();
                    var lbl = document.getElementById('headerProjectionLabel');
                    if (lbl) { lbl.setAttribute('data-i18n', 'headerProjectionType'); lbl.textContent = t('headerProjectionType'); }
                    svg.on('.drag', null);
                    if (zoomBehavior) svg.call(zoomBehavior);
                    var dims = getContainerDimensions();
                    projection = setupProjection(dims.width, dims.height);
                    rebuildPathGen();
                    gOcean.selectAll('*').remove();
                    gOcean.append('rect')
                        .attr('x', -500).attr('y', -500)
                        .attr('width', dims.width + 1000).attr('height', dims.height + 1000)
                        .attr('fill', 'url(#oceanGradient)');
                    gGraticule.selectAll('*').remove();
                    drawGraticule();
                drawIceCap();
                    if (allCountryFeatures && allCountryFeatures.length) {
                        gCountries.selectAll('*').remove();
                        countryPaths = gCountries.selectAll('path')
                            .data(allCountryFeatures)
                            .join('path')
                            .attr('d', pathGen)
                            .attr('fill', function(d) { return getCountryFill(d); })
                            .attr('stroke', function(d) { return getStroke(d); })
                            .attr('stroke-width', function(d) { return getStrokeWidth(d); })
                            .attr('opacity', function(d) { return getOpacity(d); })
                            .attr('filter', getCountryFilterAttr)
                            .attr('cursor', 'pointer')
                            .attr('vector-effect', 'non-scaling-stroke')
                            .attr('tabindex', 0)
                            .attr('role', 'button')
                            .attr('aria-label', function(d) { return getDisplayName(d.properties?.name || ''); });
                        countryPaths.on('mouseenter', function(e, d) {
                            if (quizActive) return;
                            var name = d.properties?.name || '';
                            var displayName = getDisplayName(name);
                            var rel = getReligion(name);
                            var denom = sectMode ? getDenomination(name) : null;
                            var html = '<div class="country-name"><strong>' + displayName + '</strong></div>';
                            if (colorMode === 'religion') {
                                var relLabel = lang === 'ar' ? (religionArabic[rel] || rel) : lang === 'ru' ? (religionRussian[rel] || rel) : lang === 'uz' ? (religionUzbek[rel] || rel) : lang === 'es' ? (religionSpanish[rel] || rel) : rel;
                                html += '<div>' + t('tooltipReligion') + ': ' + relLabel + '</div>';
                            }
                            tooltip.innerHTML = html;
                            tooltip.classList.add('visible');
                            d3.select(this).transition().duration(prefersReducedMotion() ? 0 : 120).attr('stroke', '#fff').attr('stroke-width', 1.5);
                        }).on('mousemove', function(e) {
                            tooltip.style.left = (e.offsetX + 14) + 'px';
                            tooltip.style.top = (e.offsetY - 10) + 'px';
                            updateCoordinatesDisplay(e);
                        }).on('mouseleave', function() {
                            tooltip.classList.remove('visible');
                            var _leaving = d3.select(this).datum();
                            if (_leaving !== selectedCountry) {
                                d3.select(this).transition().duration(prefersReducedMotion() ? 0 : 120)
                                    .attr('stroke', function(d) { return getStroke(d); })
                                    .attr('stroke-width', function(d) { return getStrokeWidth(d); });
                            }
                        }).on('click', handleCountryActivate);
                    }
                    if (countryLabelSelection) { countryLabelSelection.remove(); countryLabelSelection = null; }
                    drawCountryLabels(allCountryFeatures);
                    drawColorblindOverlay();
                    try { redrawAnnotations(); } catch (e) {}
                    updateHashDebounced();
                }
            }

            // ── Language switching & UI i18n ──
            function setLanguage(l) {
                lang = l;
                try { localStorage.setItem('mapLang', l); } catch(e) {}
                applyLanguage();
            }

            function setBtnText(el, text) {
                if (!el) return;
                var span = el.querySelector('.btn-text');
                if (span) { span.textContent = text; }
                else { el.textContent = text; }
            }
            function applyDataI18nAttributes() {
                document.querySelectorAll('[data-i18n]').forEach(function(el) {
                    var key = el.dataset.i18n;
                    setBtnText(el, t(key));
                });
                document.querySelectorAll('[data-i18n-title]').forEach(function(el) {
                    var key = el.dataset.i18nTitle;
                    el.title = t(key);
                    el.setAttribute('data-tooltip', t(key));
                });
                document.querySelectorAll('.btn[title]').forEach(function(el) {
                    if (!el.getAttribute('data-tooltip')) {
                        el.setAttribute('data-tooltip', el.title);
                    }
                });
                document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
                    var key = el.dataset.i18nPlaceholder;
                    el.placeholder = t(key);
                });
                document.querySelectorAll('[data-i18n-aria-label]').forEach(function(el) {
                    var key = el.dataset.i18nAriaLabel;
                    el.setAttribute('aria-label', t(key));
                });
            }
            function applyLanguage() {
                applyDataI18nAttributes();
                document.documentElement.setAttribute('lang', lang === 'ar' ? 'ar' : lang === 'ru' ? 'ru' : lang === 'uz' ? 'uz' : lang === 'es' ? 'es' : 'en');
                document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
                document.title = t('appName');
                document.querySelectorAll('.lang-option').forEach(function(opt) {
                    opt.classList.toggle('active', opt.dataset.lang === lang);
                });
                var blocSelect = document.getElementById('blocSelect');
                var currentVal = blocSelect.value;
                blocSelect.options.length = 1;
                geopoliticalBlocsData.forEach(function(b) {
                    var opt = document.createElement('option');
                    opt.value = b.name_en;
opt.textContent = (lang === 'ar' ? b.name : lang === 'ru' ? (b.name_ru || b.name_en) : lang === 'uz' ?(b.name_uz || b.name_en): lang === 'es' ?(b.name_es || b.name_en) : b.name_en) + ' (' + (lang === 'ar' ? b.members_ar : lang === 'ru' ? (b.members_ru || b.members_en) : lang === 'uz' ?(b.members_uz || b.members_en): lang === 'es' ?(b.members_es || b.members_en) : b.members_en) + ')';
                    blocSelect.appendChild(opt);
                });
                blocSelect.options[0].textContent = t('blocAll');
                blocSelect.value = currentVal;
                modeButtons.forEach(b => {
                    setBtnText(b, t(`mode_${b.dataset.mode}`));
                    b.title = t(`mode_${b.dataset.mode}_tip`) || b.textContent;
                });
                religionButtons.forEach(b => {
                    b.textContent = t(`religion_${b.dataset.religion}`);
                    b.title = t(`filter_${b.dataset.religion}_tip`) || b.textContent;
                });
                var mCoText = document.querySelector('#mobileCoordsBtn .btn-text');
                if (mCoText) mCoText.textContent = t('coordsToggle').replace(/^.{1,2}\s*/, '');
                updateInfoOverlay();
                if (allCountryFeatures.length) {
                    if (countryLabelSelection) {
                        countryLabelSelection.remove();
                        countryLabelSelection = null;
                    }
                    drawCountryLabels(allCountryFeatures);
                }
                updateAllStyles();
                // Re-draw any active data layers that have a draw function
                Object.keys(LAYER_DEFS).forEach(function(name) {
                    var def = LAYER_DEFS[name];
                    if (def.drawFn && def.getFlag()) def.drawFn();
                });
                drawPointLayersCanvas();
                updateCoordinatesDisplay({ clientX: 0, clientY: 0 });
                // Re-render data table if open (language changed)
                if (dataTableOverlay && dataTableOverlay.classList.contains('visible')) {
                    renderDataTable();
                }
                // Re-render History Mode UI if active (language changed)
                if (window.historyIsActive && window.historyIsActive()) {
                    window.renderHistoryBar();
                    window.drawHistoryScenario(true);
                    if (selectedCountry && selectedFeatureType === 'history' && countryPanel.classList.contains('visible')) {
                        window.openHistoryPanel(selectedCountry);
                    }
                }
            }

            // ── Info overlay & reset zoom ──
            function updateInfoOverlay() {
                infoOverlay.textContent = t('infoOverlay', { zoom: currentTransform.k.toFixed(1) });
            }

            function resetZoom() {
                svg.transition().duration(prefersReducedMotion() ? 0 : 600).ease(d3.easeCubicInOut).call(zoomBehavior.transform, d3.zoomIdentity);
            }

            // ── Search & autocomplete ──
            function setupSearch() {
                searchInput.addEventListener('input', function() {
                    const val = this.value.trim().toLowerCase();
                    suggestionsList.innerHTML = '';
                    if (!val) { suggestionsList.style.display = 'none'; return; }
                    const matches = countryNamesList.filter(n => {
                        const localized = getDisplayName(n).toLowerCase();
                        return n.toLowerCase().includes(val) || localized.includes(val);
                    }).slice(0, isMobile ? 6 : 8);
                    if (matches.length) {
                        matches.forEach(m => {
                            const li = document.createElement('li');
                            const flag = getCountryFlag(m);
                            const span = document.createElement('span');
                            span.className = 'flag-icon';
                            span.textContent = flag;
                            li.appendChild(span);
                            li.appendChild(document.createTextNode(' ' + getDisplayName(m)));

                            // دالة موحّدة للتنفيذ
                            const doSelect = (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                searchInput.value = '';
                                suggestionsList.style.display = 'none';
                                searchInput.blur();
                                flyToCountry(m);
                            };

                            // mousedown: يُطلق قبل blur على الحاسوب فلا تختفي القائمة قبل الأوان
                            li.addEventListener('mousedown', doSelect);
                            // touchend: أكثر موثوقية من click على الهاتف
                            li.addEventListener('touchend', doSelect, { passive: false });

                            suggestionsList.appendChild(li);
                        });
                        suggestionsList.style.display = 'block';
                    } else {
                        suggestionsList.style.display = 'none';
                    }
                });
                searchInput.addEventListener('blur', () => setTimeout(() => suggestionsList.style.display = 'none',
                200));
            }

            // ── Country flag emoji map ──
            function getCountryFlag(name) {
                const map = {
                    'Afghanistan': '🇦🇫',
                    'Albania': '🇦🇱',
                    'Algeria': '🇩🇿',
                    'Angola': '🇦🇴',
                    'Argentina': '🇦🇷',
                    'Armenia': '🇦🇲',
                    'Australia': '🇦🇺',
                    'Austria': '🇦🇹',
                    'Azerbaijan': '🇦🇿',
                    'Bahrain': '🇧🇭',
                    'Bangladesh': '🇧🇩',
                    'Belarus': '🇧🇾',
                    'Belgium': '🇧🇪',
                    'Belize': '🇧🇿',
                    'Benin': '🇧🇯',
                    'Bhutan': '🇧🇹',
                    'Bolivia': '🇧🇴',
                    'Bosnia': '🇧🇦',
                    'Botswana': '🇧🇼',
                    'Brazil': '🇧🇷',
                    'Brunei': '🇧🇳',
                    'Bulgaria': '🇧🇬',
                    'Burkina Faso': '🇧🇫',
                    'Burundi': '🇧🇮',
                    'Cambodia': '🇰🇭',
                    'Cameroon': '🇨🇲',
                    'Canada': '🇨🇦',
                    'Cape Verde': '🇨🇻',
                    'Central African Republic': '🇨🇫',
                    'Chad': '🇹🇩',
                    'Chile': '🇨🇱',
                    'China': '🇨🇳',
                    'Colombia': '🇨🇴',
                    'Comoros': '🇰🇲',
                    'Congo': '🇨🇬',
                    'Costa Rica': '🇨🇷',
                    'Croatia': '🇭🇷',
                    'Cuba': '🇨🇺',
                    'Cyprus': '🇨🇾',
                    'Czech Republic': '🇨🇿',
                    'Denmark': '🇩🇰',
                    'Djibouti': '🇩🇯',
                    'Dominican Republic': '🇩🇴',
                    'DR Congo': '🇨🇩',
                    'Ecuador': '🇪🇨',
                    'Egypt': '🇪🇬',
                    'El Salvador': '🇸🇻',
                    'Equatorial Guinea': '🇬🇶',
                    'Eritrea': '🇪🇷',
                    'Estonia': '🇪🇪',
                    'Eswatini': '🇸🇿',
                    'Ethiopia': '🇪🇹',
                    'Fiji': '🇫🇯',
                    'Finland': '🇫🇮',
                    'France': '🇫🇷',
                    'Gabon': '🇬🇦',
                    'Gambia': '🇬🇲',
                    'Georgia': '🇬🇪',
                    'Germany': '🇩🇪',
                    'Ghana': '🇬🇭',
                    'Greece': '🇬🇷',
                    'Greenland': '🇬🇱',
                    'Guatemala': '🇬🇹',
                    'Guinea': '🇬🇳',
                    'Guinea-Bissau': '🇬🇼',
                    'Guyana': '🇬🇾',
                    'Haiti': '🇭🇹',
                    'Honduras': '🇭🇳',
                    'Hungary': '🇭🇺',
                    'Iceland': '🇮🇸',
                    'India': '🇮🇳',
                    'Indonesia': '🇮🇩',
                    'Iran': '🇮🇷',
                    'Iraq': '🇮🇶',
                    'Ireland': '🇮🇪',
                    'Israel': '🇮🇱',
                    'Italy': '🇮🇹',
                    'Jamaica': '🇯🇲',
                    'Japan': '🇯🇵',
                    'Jordan': '🇯🇴',
                    'Kazakhstan': '🇰🇿',
                    'Kenya': '🇰🇪',
                    'Kuwait': '🇰🇼',
                    'Kyrgyzstan': '🇰🇬',
                    'Laos': '🇱🇦',
                    'Latvia': '🇱🇻',
                    'Lebanon': '🇱🇧',
                    'Lesotho': '🇱🇸',
                    'Liberia': '🇱🇷',
                    'Libya': '🇱🇾',
                    'Lithuania': '🇱🇹',
                    'Luxembourg': '🇱🇺',
                    'Madagascar': '🇲🇬',
                    'Malawi': '🇲🇼',
                    'Malaysia': '🇲🇾',
                    'Maldives': '🇲🇻',
                    'Mali': '🇲🇱',
                    'Malta': '🇲🇹',
                    'Mauritania': '🇲🇷',
                    'Mauritius': '🇲🇺',
                    'Mexico': '🇲🇽',
                    'Moldova': '🇲🇩',
                    'Mongolia': '🇲🇳',
                    'Montenegro': '🇲🇪',
                    'Morocco': '🇲🇦',
                    'Mozambique': '🇲🇿',
                    'Myanmar': '🇲🇲',
                    'Namibia': '🇳🇦',
                    'Nepal': '🇳🇵',
                    'Netherlands': '🇳🇱',
                    'New Zealand': '🇳🇿',
                    'Nicaragua': '🇳🇮',
                    'Niger': '🇳🇪',
                    'Nigeria': '🇳🇬',
                    'North Korea': '🇰🇵',
                    'North Macedonia': '🇲🇰',
                    'Norway': '🇳🇴',
                    'Oman': '🇴🇲',
                    'Pakistan': '🇵🇰',
                    'Palestine': '🇵🇸',
                    'Panama': '🇵🇦',
                    'Papua New Guinea': '🇵🇬',
                    'Paraguay': '🇵🇾',
                    'Peru': '🇵🇪',
                    'Philippines': '🇵🇭',
                    'Poland': '🇵🇱',
                    'Portugal': '🇵🇹',
                    'Qatar': '🇶🇦',
                    'Romania': '🇷🇴',
                    'Russia': '🇷🇺',
                    'Rwanda': '🇷🇼',
                    'Saudi Arabia': '🇸🇦',
                    'Senegal': '🇸🇳',
                    'Serbia': '🇷🇸',
                    'Sierra Leone': '🇸🇱',
                    'Singapore': '🇸🇬',
                    'Slovakia': '🇸🇰',
                    'Slovenia': '🇸🇮',
                    'Somalia': '🇸🇴',
                    'South Africa': '🇿🇦',
                    'South Korea': '🇰🇷',
                    'South Sudan': '🇸🇸',
                    'Spain': '🇪🇸',
                    'Sri Lanka': '🇱🇰',
                    'Sudan': '🇸🇩',
                    'Suriname': '🇸🇷',
                    'Sweden': '🇸🇪',
                    'Switzerland': '🇨🇭',
                    'Syria': '🇸🇾',
                    'Taiwan': '🇹🇼',
                    'Tajikistan': '🇹🇯',
                    'Tanzania': '🇹🇿',
                    'Thailand': '🇹🇭',
                    'Timor-Leste': '🇹🇱',
                    'Togo': '🇹🇬',
                    'Tonga': '🇹🇴',
                    'Trinidad and Tobago': '🇹🇹',
                    'Tunisia': '🇹🇳',
                    'Turkey': '🇹🇷',
                    'Turkmenistan': '🇹🇲',
                    'Uganda': '🇺🇬',
                    'Ukraine': '🇺🇦',
                    'United Arab Emirates': '🇦🇪',
                    'United Kingdom': '🇬🇧',
                    'United States': '🇺🇸',
                    'United States of America': '🇺🇸',
                    'Uruguay': '🇺🇾',
                    'Uzbekistan': '🇺🇿',
                    'Vanuatu': '🇻🇺',
                    'Venezuela': '🇻🇪',
                    'Vietnam': '🇻🇳',
                    'Yemen': '🇾🇪',
                    'Zambia': '🇿🇲',
                    'Zimbabwe': '🇿🇼',
                    'Kosovo': '🇽🇰',
                    'Western Sahara': '🇪🇭',
                    'Czechia': '🇨🇿',
                    'Ivory Coast': '🇨🇮',
                    'Puerto Rico': '🇵🇷',
                    'Samoa': '🇼🇸',
                    'Solomon Islands': '🇸🇧',
                    'Seychelles': '🇸🇨',
                    'Bahamas': '🇧🇸',
                    'Antarctica': '🇦🇶'
                };
                const clean = getCleanName(name);
                if (map[name]) return map[name];
                if (map[clean]) return map[clean];
                for (let [k, v] of Object.entries(map)) {
                    if (clean.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(clean.toLowerCase()))
                        return v;
                }
                return '🌍';
            }

            // ── Fly to country / highlight ──
            function flyToCountry(name) {
                const feature = allCountryFeatures.find(f => f.properties?.name === name);
                if (!feature) {
                    for (let f of allCountryFeatures) {
                        if (getDisplayName(f.properties?.name) === name) {
                            flyToCountry(f.properties?.name);
                            return;
                        }
                    }
                    return;
                }
                const centroid = d3.geoCentroid(feature);
                if (!centroid || isNaN(centroid[0])) return;
                const { width, height } = getContainerDimensions();
                const [px, py] = projection(centroid);
                const targetX = width / 2 - px * 3;
                const targetY = height / 2 - py * 3;
                const transform = d3.zoomIdentity.translate(targetX, targetY).scale(3);
                svg.transition().duration(prefersReducedMotion() ? 0 : 800).ease(d3.easeCubicInOut).call(zoomBehavior.transform, transform)
                    .on('end', () => {
                        highlightCountry(feature);
                    });
            }

            function highlightCountry(feature) {
                if (!feature || !countryPaths) return;
                countryPaths.classed('highlighted-country', false);
                const path = countryPaths.filter(d => d === feature);
                path.classed('highlighted-country', true);
                if (highlightTimeout) clearTimeout(highlightTimeout);
                highlightTimeout = setTimeout(() => {
                    countryPaths.classed('highlighted-country', false);
                }, 3000);
            }

            // ── Country info panel ──
            function openCountryPanel(d) {
                closeFeatureDetail();
                renderCountryPanel(d);
                // على الهاتف: إخفاء أزرار الزوم والأسطورة لأنها تتعارض مع اللوحة
                if (isMobile) {
                    const zoomControls = document.querySelector('.zoom-controls');
                    if (zoomControls) zoomControls.style.opacity = '0';
                    if (zoomControls) zoomControls.style.pointerEvents = 'none';
                    legendEl.style.opacity = '0';
                    legendEl.style.pointerEvents = 'none';
                }
                // Trigger CSS transition after display:block
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        countryPanel.classList.add('visible');
                    });
                });
            }

            function closeCountryPanel() {
                countryPanel.classList.remove('visible');
                // إعادة الأزرار والأسطورة
                if (isMobile) {
                    const zoomControls = document.querySelector('.zoom-controls');
                    if (zoomControls) zoomControls.style.opacity = '';
                    if (zoomControls) zoomControls.style.pointerEvents = '';
                    legendEl.style.opacity = '';
                    legendEl.style.pointerEvents = '';
                }
                // Wait for transition before hiding
                setTimeout(() => {
                    if (!countryPanel.classList.contains('visible')) {
                        countryPanel.style.display = 'none';
                    }
                }, 220);
                selectedCountry = null;
                compareCountry = null;
                highlightSelectedCountry(null);
                closeFeatureDetail();
            }

            function renderCountryPanel(d) {
                _lastPanelRenderTime = performance.now();
                const name = d.properties?.name || '';
                const cleanName = getCleanName(name);
                let info = getCountryInfo(name);

                const displayName = getDisplayName(name);

                let population = info ? info.population_2026 : null;
                let area = info ? info.area : null;
                let density = getDensity(name);
                let capital = info ? (lang === 'ar' ? info.capital_ar : lang === 'ru' ? (info.capital_ru || info.capital_en) : lang === 'uz' ?(info.capital_uz || info.capital_en): lang === 'es' ?(info.capital_es || info.capital_en) : info.capital_en) : t('unknown');
                let language = info ? (lang === 'ar' ? info.lang_ar : lang === 'ru' ? (info.lang_ru || info.lang_en) : lang === 'uz' ?(info.lang_uz || info.lang_en): lang === 'es' ?(info.lang_es || info.lang_en) : info.lang_en) : t('unknown');

                let localTimeStr = t('unknown');
                if (info && info.capital_coords) {
                    let baseOffset;
                    const tzStr = timezoneOffsets[name] || timezoneOffsets[cleanName];
                    if (tzStr) {
                        const match = tzStr.match(/UTC([+-])(\d+)(?::(\d+))?/);
                        if (match) {
                            baseOffset = parseInt(match[2]) + (match[3] ? parseInt(match[3]) / 60 : 0);
                            if (match[1] === '-') baseOffset = -baseOffset;
                        }
                    }
                    if (baseOffset === undefined) baseOffset = Math.round(info.capital_coords[0] / 15);
                    const now = new Date();
                    const month = now.getUTCMonth();
                    const dstCountriesList = new Set([
                        'Albania', 'Andorra', 'Austria', 'Belgium', 'Bosnia and Herzegovina', 'Bosnia and Herz.',
                        'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Czechia',
                        'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland',
                        'Ireland', 'Italy', 'Latvia', 'Liechtenstein',
                        'Lithuania', 'Luxembourg', 'Malta', 'Moldova', 'Monaco', 'Montenegro', 'Netherlands',
                        'North Macedonia', 'Norway', 'Poland', 'Portugal',
                        'Romania', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland',
                        'Ukraine', 'United Kingdom', 'Vatican City',
                        'United States', 'Canada', 'Mexico', 'Bahamas', 'Bermuda', 'Cuba', 'Haiti', 'Turks and Caicos',
                        'Australia', 'New Zealand', 'Fiji', 'Samoa', 'Tonga', 'Vanuatu', 'New Caledonia',
                        'Chile', 'Paraguay', 'Uruguay', 'Brazil', 'Bolivia',
                        'Egypt', 'Israel', 'Jordan', 'Lebanon', 'Syria', 'Iran', 'Morocco', 'Western Sahara',
                        'W. Sahara',
                        'Greenland', 'Puerto Rico'
                    ]);
                    const observesDST = dstCountriesList.has(name) || dstCountriesList.has(cleanName);
                    let isDST = false;
                    if (observesDST) {
                        const isNorth = baseOffset >= -5 && baseOffset <= 4;
                        if (isNorth) {
                            isDST = (month >= 2 && month <= 9);
                        } else {
                            isDST = (month <= 2 || month >= 9);
                        }
                    }
                    const currentOffset = observesDST && isDST ? baseOffset + 1 : baseOffset;
                    const sign = currentOffset >= 0 ? '+' : '';
                    const utcHours = now.getUTCHours() + currentOffset;
                    const localHours = ((utcHours % 24) + 24) % 24;
                    const localMinutes = String(now.getUTCMinutes()).padStart(2, '0');
                    let dstInfo = '';
                    if (observesDST) {
                        const stdSign = baseOffset >= 0 ? '+' : '';
                        const dstSign = (baseOffset + 1) >= 0 ? '+' : '';
                        if (isDST) {
                            dstInfo =
                                ` (${t('dstActive')}، UTC${stdSign}${baseOffset} ${t('dstInactive')} -> UTC${dstSign}${baseOffset+1} ${t('dstActive')})`;
                        } else {
                            dstInfo =
                                ` (${t('dstInactive')}، UTC${dstSign}${baseOffset+1} ${t('dstActive')} -> UTC${stdSign}${baseOffset} ${t('dstInactive')})`;
                        }
                    }
                    localTimeStr = `${String(localHours).padStart(2, '0')}:${localMinutes} (UTC${sign}${currentOffset}${dstInfo})`;
                }

                const continent = getContinent(name);
                const government = getGovernment(name);
                const continentLabel = lang === 'ar' ? (continentArabic[continent] || continent) : lang === 'ru' ? (continentRussian[continent] || continent) : lang === 'uz' ?(continentUzbek[continent] || continent): lang === 'es' ?(continentSpanish[continent] || continent) : continent;
                const govLabel = lang === 'ar' ? (governmentArabic[government] || government) : lang === 'ru' ? (governmentRussian[government] || government) : lang === 'uz' ?(governmentUzbek[government] || government): lang === 'es' ?(governmentSpanish[government] || government) : government;

                const flagEmoji = getCountryFlag(name);
                let html = `<h3>${flagEmoji} ${displayName}</h3>`;
                html += `<p><strong>${t('continent')}:</strong> ${continentLabel}</p>`;
                html += `<p><strong>${t('government')}:</strong> ${govLabel}</p>`;
                html += `<p><strong>${t('capital')}:</strong> ${capital}</p>`;
                html +=
                    `<p><strong>${t('areaTitle')}:</strong> ${area ? area.toLocaleString('en') : t('unknown')} ${t('km2')}</p>`;
                html +=
                    `<p><strong>${t('densityTitle')}:</strong> ${density !== null ? density + ' ' + t('densityUnit') : t('unknown')}</p>`;
                html +=
                    `<p><strong>${t('populationTitle')}:</strong> ${population ? '~' + population + ' ' + t('million') : t('unknown')}</p>`;
                html += `<p><strong>${t('languageTitle')}:</strong> ${language}</p>`;
                html += `<p><strong>🕒 ${t('localTime')}:</strong> ${localTimeStr}</p>`;
                const gdpVal = getGDP(name);
                if (gdpVal !== null) html += `<p><strong>💰 ${t('tooltipGDP')}:</strong> $${gdpVal.toLocaleString('en-US')}</p>`;
                const hdiVal = getHDI(name);
                if (hdiVal !== null) html += `<p><strong>📊 ${t('tooltipHDI')}:</strong> ${hdiVal.toFixed(3)}</p>`;
                const tzLabel = timezoneOffsets[name] || timezoneOffsets[cleanName];
                if (tzLabel) html += `<p><strong>🕐 ${t('timezone')}:</strong> ${tzLabel}</p>`;

                html += `<br><button class="btn" id="compareBtn" title="${t('compareWith')}">📊 ${t('compareTitle')}</button>`;
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';

                document.getElementById('compareBtn')?.addEventListener('click', () => {
                    const existing = panelContent.querySelector('.compare-search-container');
                    if (existing) existing.remove();

                    const compareInput = document.createElement('input');
                    compareInput.type = 'text';
                    compareInput.placeholder = t('searchPlaceholder');
                    compareInput.style.cssText =
                        'width:100%;margin:6px 0;padding:4px;border-radius:6px;border:1px solid #555;background:#2a2d35;color:#fff;';
                    const container = document.createElement('div');
                    container.className = 'compare-search-container';
                    container.style.marginTop = '8px';
                    container.appendChild(compareInput);
                    panelContent.appendChild(container);
                    compareInput.focus();

                    // See setupSearch() for the proven pattern this mirrors
                    let _compareSelecting = false;
                    const _onCompareSelect = (e, item) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const name = item.getAttribute('data-name');
                        if (!name || _compareSelecting) return;
                        _compareSelecting = true;
                        const feature = allCountryFeatures.find(f => f.properties?.name === name);
                        if (feature) {
                            compareCountry = feature;
                            renderComparePanel(selectedCountry, feature);
                        } else {
                            _compareSelecting = false;
                        }
                    };
                    container.addEventListener('mousedown', function(e) {
                        const item = e.target.closest('.suggest-item');
                        if (!item) return;
                        _onCompareSelect(e, item);
                    });
                    container.addEventListener('touchend', function(e) {
                        const item = e.target.closest('.suggest-item');
                        if (!item) return;
                        _onCompareSelect(e, item);
                    }, { passive: false });
                    compareInput.addEventListener('input', function() {
                        const val = this.value.trim().toLowerCase();
                        const matches = countryNamesList.filter(n => {
                            const localized = getDisplayName(n).toLowerCase();
                            return (n.toLowerCase().includes(val) || localized.includes(val)) && n !== name;
                        }).slice(0, isMobile ? 4 : 6);
                        const old = container.querySelectorAll('.suggest-item');
                        old.forEach(el => el.remove());
                        matches.forEach(m => {
                            const div = document.createElement('div');
                            div.className = 'suggest-item';
                            div.setAttribute('data-name', m);
                            div.style.cssText =
                                'padding:4px 8px;cursor:pointer;border-bottom:1px solid #333;display:flex;align-items:center;gap:6px;';
                            const flag = getCountryFlag(m);
                            const span3 = document.createElement('span');
                            span3.textContent = flag;
                            div.appendChild(span3);
                            div.appendChild(document.createTextNode(' ' + getDisplayName(m)));
                            container.appendChild(div);
                        });
                    });
                });
            }

            function renderComparePanel(d1, d2) {
                _lastPanelRenderTime = performance.now();
                const name1 = d1.properties?.name || '';
                const name2 = d2.properties?.name || '';
                const displayName1 = getDisplayName(name1);
                const displayName2 = getDisplayName(name2);
                const info1 = countryInfo[name1] || countryInfo[getCleanName(name1)];
                const info2 = countryInfo[name2] || countryInfo[getCleanName(name2)];
                const area1 = info1 ? info1.area : null;
                const area2 = info2 ? info2.area : null;
                const dens1 = getDensity(name1);
                const dens2 = getDensity(name2);
                const pop1 = info1 ? info1.population_2026 : null;
                const pop2 = info2 ? info2.population_2026 : null;
                const rel1 = getReligion(name1);
                const rel2 = getReligion(name2);
                const relLabel1 = lang === 'ar' ? (religionArabic[rel1] || rel1) : lang === 'ru' ? (religionRussian[rel1] || rel1) : lang === 'uz' ?(religionUzbek[rel1] || rel1): lang === 'es' ?(religionSpanish[rel1] || rel1) : rel1;
                const relLabel2 = lang === 'ar' ? (religionArabic[rel2] || rel2) : lang === 'ru' ? (religionRussian[rel2] || rel2) : lang === 'uz' ?(religionUzbek[rel2] || rel2): lang === 'es' ?(religionSpanish[rel2] || rel2) : rel2;

                const maxArea = Math.max(area1 || 1, area2 || 1);
                const maxPop = Math.max(pop1 || 1, pop2 || 1);
                const maxDens = Math.max(dens1 || 1, dens2 || 1);

                const e = htmlEscape;
                let html = '<h3>📊 ' + e(t('compareTitle')) + ' ' + e(displayName1) + ' ↔ ' + e(displayName2) + '</h3>';
                html += '<table style="width:100%;font-size:0.85em;text-align:center;border-collapse:collapse;">';
                html += '<tr><th style="padding:4px;"></th><th style="padding:4px;">' + e(displayName1) + '</th><th style="padding:4px;">' + e(displayName2) + '</th></tr>';

                const bar1Area = area1 ? (area1 / maxArea * 100) : 0;
                const bar2Area = area2 ? (area2 / maxArea * 100) : 0;
                html += '<tr><td style="padding:4px;">' + e(t('areaTitle')) + '</td>' +
                    '<td style="padding:4px;">' + (area1 ? e(area1.toLocaleString('en')) + ' km²' : '?') + '<br><span class="compare-bar" style="width:' + bar1Area + '%;background:#42a5f5;"></span></td>' +
                    '<td style="padding:4px;">' + (area2 ? e(area2.toLocaleString('en')) + ' km²' : '?') + '<br><span class="compare-bar" style="width:' + bar2Area + '%;background:#42a5f5;"></span></td></tr>';

                const bar1Dens = dens1 ? (dens1 / maxDens * 100) : 0;
                const bar2Dens = dens2 ? (dens2 / maxDens * 100) : 0;
                html += '<tr><td style="padding:4px;">' + e(t('densityTitle')) + '</td>' +
                    '<td style="padding:4px;">' + (dens1 ? e('' + dens1) : '?') + ' ' + e(t('densityUnit')) + '<br><span class="compare-bar" style="width:' + bar1Dens + '%;background:#ffa726;"></span></td>' +
                    '<td style="padding:4px;">' + (dens2 ? e('' + dens2) : '?') + ' ' + e(t('densityUnit')) + '<br><span class="compare-bar" style="width:' + bar2Dens + '%;background:#ffa726;"></span></td></tr>';

                const bar1Pop = pop1 ? (pop1 / maxPop * 100) : 0;
                const bar2Pop = pop2 ? (pop2 / maxPop * 100) : 0;
                html += '<tr><td style="padding:4px;">' + e(t('populationTitle')) + '</td>' +
                    '<td style="padding:4px;">' + (pop1 ? '~' + pop1 + ' ' + e(t('million')) : '?') + '<br><span class="compare-bar" style="width:' + bar1Pop + '%;background:#66bb6a;"></span></td>' +
                    '<td style="padding:4px;">' + (pop2 ? '~' + pop2 + ' ' + e(t('million')) : '?') + '<br><span class="compare-bar" style="width:' + bar2Pop + '%;background:#66bb6a;"></span></td></tr>';

                html += '<tr><td style="padding:4px;">' + e(t('tooltipReligion')) + '</td>' +
                    '<td style="padding:4px;">' + e(relLabel1) + '</td>' +
                    '<td style="padding:4px;">' + e(relLabel2) + '</td></tr>';
                const gdp1 = getGDP(name1);
                const gdp2 = getGDP(name2);
                html += '<tr><td style="padding:4px;">💰 ' + e(t('tooltipGDP')) + '</td>' +
                    '<td style="padding:4px;">' + (gdp1 !== null ? '$' + e(gdp1.toLocaleString('en-US')) : '?') + '</td>' +
                    '<td style="padding:4px;">' + (gdp2 !== null ? '$' + e(gdp2.toLocaleString('en-US')) : '?') + '</td></tr>';
                const hdi1 = getHDI(name1);
                const hdi2 = getHDI(name2);
                html += '<tr><td style="padding:4px;">📊 ' + e(t('tooltipHDI')) + '</td>' +
                    '<td style="padding:4px;">' + (hdi1 !== null ? e(hdi1.toFixed(3)) : '?') + '</td>' +
                    '<td style="padding:4px;">' + (hdi2 !== null ? e(hdi2.toFixed(3)) : '?') + '</td></tr>';
                const tz1 = timezoneOffsets[name1] || timezoneOffsets[getCleanName(name1)] || '?';
                const tz2 = timezoneOffsets[name2] || timezoneOffsets[getCleanName(name2)] || '?';
                html += '<tr><td style="padding:4px;">🕐 ' + e(t('timezone')) + '</td>' +
                    '<td style="padding:4px;">' + e(tz1) + '</td>' +
                    '<td style="padding:4px;">' + e(tz2) + '</td></tr>';
                html += '</table>';

                html += '<br><button class="btn" id="closeCompareBtn">' + e(t('closeCompare')) + '</button>';
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                requestAnimationFrame(() => requestAnimationFrame(() => countryPanel.classList.add('visible')));

                document.getElementById('closeCompareBtn')?.addEventListener('click', () => {
                    compareCountry = null;
                    if (selectedCountry) { renderCountryPanel(selectedCountry); requestAnimationFrame(() => requestAnimationFrame(() => countryPanel.classList.add('visible'))); }
                });
            }

            // ── Map transform & overlay positioning ──
            function applyMapTransform(t) {
                // Use SVG transform attribute (not CSS transform).
                // CSS transform on a will-change element creates a separate GPU
                // compositor layer that can exceed mobile texture memory limits,
                // causing black flickering when the layer is dropped/recreated.
                // SVG native transform renders at display resolution without an
                // oversized intermediate GPU layer — more stable on mobile.
                gMap.attr('transform', t.toString());
            }

            function fastUpdateLabels(el, circles, k, r, fs, offX, offY) {
                var circleNodes = circles.nodes();
                var textNodes = el.node().querySelectorAll('text');
                var rVal = Math.max(0.3, r);
                var fsVal = fs;
                var ox = offX / k, oy = offY / k;
                for (var i = 0; i < circleNodes.length; i++) {
                    var isHalo = (i % 2 === 0);
                    circleNodes[i].setAttribute('r', isHalo ? rVal * 1.8 : rVal);
                }
                for (var i = 0; i < textNodes.length; i++) {
                    var t = textNodes[i];
                    t.setAttribute('font-size', fsVal + 'px');
                    var c = circleNodes[i * 2 + 1];
                    if (c) {
                        t.setAttribute('x', parseFloat(c.getAttribute('cx')) + rVal + ox);
                        t.setAttribute('y', parseFloat(c.getAttribute('cy')) + oy);
                    }
                }
            }

            function updateOverlayPositions() {
                const k = Math.max(0.4, currentTransform.k);
                if (naturalResourcesVisible) {
                    const r2 = Math.max(4, Math.min(14, (isMobile ? 6 : 8) * Math.pow(k, 0.4)));
                    const fs2 = Math.max(3, Math.min(16, (isMobile ? 9 : 12) / k));
                    fastUpdateLabels(gNaturalResources, gNaturalResources.selectAll('circle'), k, r2, fs2, 3, 2);
                }
                if (ethnicGroupsVisible) {
                    const r3 = Math.max(4, Math.min(14, (isMobile ? 6 : 8) * Math.pow(k, 0.4)));
                    const fs3 = Math.max(3, Math.min(16, (isMobile ? 9 : 12) / k));
                    fastUpdateLabels(gEthnicGroups, gEthnicGroups.selectAll('circle'), k, r3, fs3, 3, 2);
                }
            }

            // ── D3 zoom behavior setup ──
            function setupZoom() {
                const { width, height } = getContainerDimensions();
                let _pointLayersRAFPending = false;
                let _zoomEndTimeout = null;

                function schedulePointLayersRedraw() {
                    if (_pointLayersRAFPending) return;
                    _pointLayersRAFPending = true;
                    requestAnimationFrame(function() {
                        _pointLayersRAFPending = false;
                        drawPointLayersCanvas();
                    });
                }

                zoomBehavior = d3.zoom().scaleExtent([0.5, 24]).translateExtent([
                    [-width * 2, -height * 2],
                    [width * 3, height * 3]
                ]).on('zoom', function(e) {
                    if (!_isZooming) {
                        _isZooming = true;
                        gMap.classed('zooming-active', true);
                    }
                    currentTransform = e.transform;
                    applyMapTransform(currentTransform);
                    updateInfoOverlay();
                    updateHashDebounced();
                    schedulePointLayersRedraw();
                    scheduleAdminBoundariesRedraw();
                }).on('end', function() {
                    clearTimeout(_zoomEndTimeout);
                    _zoomEndTimeout = setTimeout(function() {
                        _isZooming = false;
                        gMap.classed('zooming-active', false);
                        updateOverlayPositions();
                        updateLabels();
                        drawPointLayersCanvas();
                        _adminBakeDirty = true;
                        scheduleAdminBoundariesRedraw();
                        var _pendingLayers = [
                            [corridorsVisible || additionalWaterwaysVisible, function() { drawRoutes(true); }],
                            [borderDisputesVisible, function() { drawBorderDisputes(true); }],
                            [desertsForestsVisible, function() { drawDesertsForests(true); }],
                            [riversGlaciersVisible, function() { drawPhysicalFeatures(); drawGlaciatedAreas(true); }],
                            [cbPatternsVisible, function() { drawColorblindOverlay(); }],
                            [geopoliticalBlocsVisible, function() { drawGeopoliticalBlocs(true); }],
                            [oceanCurrentsVisible, function() { drawOceanCurrents(true); }],
                            [windsVisible, function() { drawWinds(true); }],
                            [earthquakesVisible, function() { drawEarthquakes(true); }],
                            [volcanoesVisible, function() { drawVolcanoes(true); }],
                            [timezonesVisible, function() { drawTimezones(true); }]
                        ].filter(function(p) { return p[0]; });
                        var _li = 0;
                        (function runNextLayer() {
                            if (_li >= _pendingLayers.length) return;
                            _pendingLayers[_li][1]();
                            _li++;
                            requestAnimationFrame(runNextLayer);

        })();
                    }, 200);
                });
                svg.call(zoomBehavior);
                svg.on('dblclick.zoom', null);
            }

            // ── Load world data & render countries ──
            async function loadWorld() {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 15000);
                try {
                    const basePath = window.location.pathname.replace(/\/[^\/]*$/, '/');
                    const response = await fetch(basePath + 'countries-110m.json', { signal: controller.signal });
                    if (!response.ok) throw new Error('HTTP ' + response.status);
                    const data = await response.json();
                    return topojson.feature(data, data.objects.countries).features;
                } finally {
                    clearTimeout(timeout);
                }
            }

            function haversineDistanceKm(coord1, coord2) {
                    var R = 6371;
                    var toRad = function(d) { return d * Math.PI / 180; };
                    var dLat = toRad(coord2[1] - coord1[1]);
                    var dLon = toRad(coord2[0] - coord1[0]);
                    var lat1 = toRad(coord1[1]);
                    var lat2 = toRad(coord2[1]);
                    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    return R * c;
                }
                function clearMeasurement() {
                    measurePoints = [];
                    if (gMeasure) gMeasure.selectAll('*').remove();
                    measureResultLabel.style.display = 'none';
                }
                function toggleMeasureMode() {
                    measureActive = !measureActive;
                    document.getElementById('measureToolBtn').classList.toggle('toggle-on', measureActive);
                    clearMeasurement();
                    document.body.classList.toggle('measure-active', measureActive);
                    if (measureActive && annotateActive) toggleAnnotationMode();
                }
                function togglePresentationMode() {
                    presentationModeActive = !presentationModeActive;
                    document.body.classList.toggle('presentation-mode', presentationModeActive);
                    document.getElementById('presentationExitBtn').style.display = presentationModeActive ? '' : 'none';
                    if (presentationModeActive) {
                        if (controlsBar.classList.contains('active')) {
                            controlsBar.classList.remove('active');
                            menuToggle.classList.remove('active');
                        }
                    } else {
                        if (measureActive) toggleMeasureMode();
                        if (annotateActive) toggleAnnotationMode();
                    }
                }

                // ── Quiz Session Management ──
                function generateSessionCode() {
                    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
                    var code = '';
                    for (var i = 0; i < 6; i++) {
                        code += chars.charAt(Math.floor(Math.random() * chars.length));
                    }
                    return code;
                }

                async function handleCreateSession(studentNameInput, codeInput, createdSpan, createBtn) {
                    var studentName = studentNameInput.value.trim();
                    var sessionCode = codeInput.value.trim().toUpperCase();
                    if (!studentName) { studentNameInput.focus(); return; }
                    if (!sessionCode) {
                        sessionCode = generateSessionCode();
                        codeInput.value = sessionCode;
                    }
                    if (typeof window.firebaseCreateSession === 'function') {
                        createBtn.disabled = true;
                        var ok = await window.firebaseCreateSession(sessionCode, { createdAt: Date.now() });
                        createBtn.disabled = false;
                        if (!ok) { alert(t('sessionCreateFailed')); return; }
                    }
                    currentSessionCode = sessionCode;
                    currentStudentName = studentName;
                    createdSpan.textContent = t('quizSessionCreated') + ': ' + sessionCode;
                    createdSpan.style.display = '';
                    createBtn.style.display = 'none';
                    updateViewResultsBtn();
                }

                function handleJoinSession(studentNameInput, codeInput) {
                    var studentName = studentNameInput.value.trim();
                    var sessionCode = codeInput.value.trim().toUpperCase();
                    if (!studentName || !sessionCode) return;
                    currentSessionCode = sessionCode;
                    currentStudentName = studentName;
                }

                function updateViewResultsBtn() {
                    var btn = document.getElementById('quizViewResultsBtn');
                    if (currentSessionCode) {
                        btn.style.display = '';
                        btn.textContent = t('quizViewResults') + ' (' + currentSessionCode + ')';
                    } else {
                        btn.style.display = 'none';
                    }
                }

                async function saveQuizResultsToFirestore(results, score, total, timeTaken) {
                    if (!currentSessionCode || !currentStudentName || typeof window.firebaseSaveQuizResult !== 'function') return;
                    var answers = results.map(function(r) {
                        return {
                            questionId: r.questionId !== undefined ? r.questionId : r.questionIndex,
                            layerType: r.layerType || null,
                            promptText: r.promptText || null,
                            correct: r.correct,
                            status: r.status || (r.correct === true ? 'correct' : r.correct === false ? 'incorrect' : 'skipped')
                        };
                    });
                    await window.firebaseSaveQuizResult(currentSessionCode, currentStudentName, score, total, timeTaken, answers);
                }

                async function showClassResults(sessionCode) {
                    if (typeof window.firebaseGetResultsForSession !== 'function') return;
                    var results = await window.firebaseGetResultsForSession(sessionCode);
                    var overlay = document.getElementById('quizResultsOverlay');
                    var body = document.getElementById('quizResultsBody');
                    document.getElementById('quizResultsSessionCode').innerHTML = t('quizSessionCode') + ': <strong>' + sessionCode + '</strong>';
                    document.getElementById('quizResultsTitle').textContent = t('quizViewResults');
                    document.getElementById('quizResultsSummaryTab').textContent = t('quizResultsSummary');
                    document.getElementById('quizResultsDetailTab').textContent = t('quizResultsDetail');
                    document.getElementById('quizResultsCloseBtn').textContent = t('quizResultsClose');

                    if (results.length === 0) {
                        body.innerHTML = '<div class="quiz-results-empty">' + t('quizResultsEmpty') + '</div>';
                    } else {
                        showResultsSummary(body, results);
                    }

                    overlay.style.display = '';

                    document.getElementById('quizResultsSummaryTab').onclick = function() {
                        this.classList.add('active');
                        document.getElementById('quizResultsDetailTab').classList.remove('active');
                        showResultsSummary(body, results);
                    };
                    document.getElementById('quizResultsDetailTab').onclick = function() {
                        this.classList.add('active');
                        document.getElementById('quizResultsSummaryTab').classList.remove('active');
                        showResultsDetail(body, results);
                    };
                }

                function showResultsSummary(container, results) {
                    var total = results.length;
                    var avgScore = 0;
                    var html = '<table class="quiz-results-table"><thead><tr>';
                    html += '<th>' + t('quizStudentName') + '</th>';
                    html += '<th>' + t('quizFinalScore') + '</th>';
                    html += '</tr></thead><tbody>';
                    results.forEach(function(r) {
                        var pct = r.total > 0 ? Math.round(r.score / r.total * 100) : 0;
                        avgScore += pct;
                        html += '<tr><td>' + escapeHtml(r.studentName) + '</td>';
                        html += '<td class="quiz-results-score">' + r.score + '/' + r.total + ' (' + pct + '%)</td></tr>';
                    });
                    if (total > 1) {
                        var avg = Math.round(avgScore / total);
                        html += '<tr style="font-weight:700;border-top:2px solid var(--border)"><td>' + t('quizResultsAverage') + '</td>';
                        html += '<td class="quiz-results-score">' + avg + '%</td></tr>';
                    }
                    html += '</tbody></table>';
                    container.innerHTML = html;
                }

                function showResultsDetail(container, results) {
                    container.innerHTML = '';
                    results.forEach(function(r) {
                        var card = document.createElement('div');
                        card.className = 'quiz-results-detail-card';
                        var meta = r.total > 0 ? r.score + '/' + r.total + ' (' + Math.round(r.score / r.total * 100) + '%)' : '—';
                        card.innerHTML = '<div class="quiz-results-detail-name">' + escapeHtml(r.studentName) + '</div>' +
                            '<div class="quiz-results-detail-meta">' + meta + (r.timeTaken ? ' | ' + formatTimeTaken(r.timeTaken) : '') + '</div>';
                        if (r.answers && r.answers.length > 0) {
                            var answersDiv = document.createElement('div');
                            answersDiv.className = 'quiz-results-detail-answers';
                            r.answers.forEach(function(a) {
                                var status = a.correct === true ? 'correct' : a.correct === false ? 'incorrect' : 'skipped';
                                var icon = a.correct === true ? '✓' : a.correct === false ? '✗' : '—';
                                var answerEl = document.createElement('div');
                                answerEl.className = 'quiz-results-detail-answer ' + status;
                                answerEl.innerHTML = '<span class="quiz-results-detail-status">' + icon + '</span><span class="quiz-results-detail-prompt">' + escapeHtml(a.promptText || a.layerType || 'Question') + '</span>';
                                answersDiv.appendChild(answerEl);
                            });
                            card.appendChild(answersDiv);
                        }
                        container.appendChild(card);
                    });
                }

                function formatTimeTaken(seconds) {
                    var m = Math.floor(seconds / 60);
                    var s = seconds % 60;
                    return m + ':' + (s < 10 ? '0' : '') + s;
                }

                function escapeHtml(str) {
                    if (!str) return '';
                    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
                }
                function handleMeasureClick(e) {
                    if (!measureActive) return;
                    var rect = getMapRect();
                    var clickX = e.clientX - rect.left;
                    var clickY = e.clientY - rect.top;
                    var svgPoint = currentTransform.invert([clickX, clickY]);
                    var coords = getActiveProjection().invert(svgPoint);
                    if (!coords || isNaN(coords[0]) || isNaN(coords[1])) return;

                    if (measurePoints.length >= 2) clearMeasurement();
                    measurePoints.push(coords);
                    redrawMeasureLayer();
                }

                function redrawMeasureLayer() {
                    if (!gMeasure) gMeasure = gMap.append('g').attr('class', 'measure-layer');
                    gMeasure.selectAll('*').remove();
                    var proj = getActiveProjection();
                    measurePoints.forEach(function(pt) {
                        var xy = proj(pt);
                        if (!xy || isNaN(xy[0])) return;
                        gMeasure.append('circle')
                            .attr('cx', xy[0]).attr('cy', xy[1]).attr('r', 5)
                            .attr('fill', 'var(--brand-accent, #14B8A6)').attr('stroke', '#fff').attr('stroke-width', 1.5);
                    });
                    if (measurePoints.length === 2) {
                        var xy1 = proj(measurePoints[0]);
                        var xy2 = proj(measurePoints[1]);
                        if (xy1 && xy2 && !isNaN(xy1[0]) && !isNaN(xy2[0])) {
                            gMeasure.insert('line', ':first-child')
                                .attr('x1', xy1[0]).attr('y1', xy1[1])
                                .attr('x2', xy2[0]).attr('y2', xy2[1])
                                .attr('stroke', 'var(--brand-accent, #14B8A6)').attr('stroke-width', 2).attr('stroke-dasharray', '6,4');
                            var distanceKm = haversineDistanceKm(measurePoints[0], measurePoints[1]);
                            var midX = (xy1[0] + xy2[0]) / 2;
                            var midY = (xy1[1] + xy2[1]) / 2;
                            var screenMid = currentTransform.apply([midX, midY]);
                            var rect = getMapRect();
                            measureResultLabel.textContent = Math.round(distanceKm).toLocaleString() + ' ' + t('measureKmUnit');
                            measureResultLabel.style.left = (rect.left + screenMid[0]) + 'px';
                            measureResultLabel.style.top = (rect.top + screenMid[1]) + 'px';
                            measureResultLabel.style.display = '';
                        }
                    }
                }

                function handleCountryActivate(e, d) {
                    if (measureActive) return;
                    if (annotateActive) return;
                    if (window.historyIsActive && window.historyIsActive()) { window.openHistoryPanel(d); return; }
                    if (e.shiftKey && selectedCountry) {
                        compareCountry = d;
                        renderComparePanel(selectedCountry, compareCountry);
                    } else {
                        selectedCountry = d;
                        compareCountry = null;
                        openCountryPanel(d);
                        highlightSelectedCountry(d);
                    }
                }

                // ── Annotation Mode (Explanation / Annotate) ──
                const ANNOTATIONS_KEY = 'lepidosAnnotations';

                // One-time cleanup: the North Pole was originally drawn as a
                // hand-drawn region annotation with very few points, which tears
                // across projection seams. It is replaced by the real Glaciated
                // Areas data layer; strip only that entry from saved sessions.
                function _removeLegacyNorthPoleAnnotation() {
                    try {
                        if (_removeLegacyNorthPoleAnnotation.done) return;
                        _removeLegacyNorthPoleAnnotation.done = true;
                        var raw = localStorage.getItem(ANNOTATIONS_KEY);
                        if (!raw) return;
                        var arr = JSON.parse(raw);
                        if (!Array.isArray(arr)) return;
                        var filtered = arr.filter(function(a) {
                            if (!a || a.type !== 'region') return true;
                            var lbl = String(a.label || '').toLowerCase();
                            if (lbl.indexOf('north pole') !== -1 || lbl.indexOf('القطب الشمالي') !== -1 ||
                                lbl.indexOf('северный полюс') !== -1 || lbl.indexOf('shimoliy qutb') !== -1 ||
                                lbl.indexOf('polo norte') !== -1) {
                                return false;
                            }
                            if (Array.isArray(a.coords) && a.coords.length > 0 && a.coords.length <= 14) {
                                var latSum = 0, minLat = 90;
                                for (var i = 0; i < a.coords.length; i++) {
                                    latSum += a.coords[i][1];
                                    if (a.coords[i][1] < minLat) minLat = a.coords[i][1];
                                }
                                if (latSum / a.coords.length > 86 && minLat > 82) return false;
                            }
                            return true;
                        });
                        if (filtered.length !== arr.length) localStorage.setItem(ANNOTATIONS_KEY, JSON.stringify(filtered));
                    } catch (e) {}
                }
                _removeLegacyNorthPoleAnnotation();

                function annotateToast(text) {
                    if (copyNotification) {
                        copyNotification.textContent = text;
                        copyNotification.classList.add('show');
                        setTimeout(function() { copyNotification.classList.remove('show'); }, 2000);
                    }
                }

                function loadAnnotations() {
                    _removeLegacyNorthPoleAnnotation();
                    try {
                        var raw = localStorage.getItem(ANNOTATIONS_KEY);
                        var arr = raw ? JSON.parse(raw) : [];
                        return Array.isArray(arr) ? arr : [];
                    } catch (e) { return []; }
                }

                function saveAnnotations() {
                    try { localStorage.setItem(ANNOTATIONS_KEY, JSON.stringify(annotationsList)); } catch (e) {}
                }

                // The Waterman butterfly projection has a singular vertex at the map center
                // (the polyhedral net's central seam): `invert` returns null/NaN for the exact
                // center pixel, silently swallowing clicks/answers there. Nudge a few pixels
                // and retry so interaction still works everywhere on the map.
                function invertMapPoint(svgPoint, proj) {
                    proj = proj || getActiveProjection();
                    var coords = proj.invert(svgPoint);
                    if (coords && !isNaN(coords[0]) && !isNaN(coords[1])) return coords;
                    var offsets = [[2, 0], [-2, 0], [0, 2], [0, -2], [2, 2], [-2, 2], [2, -2], [-2, -2], [4, 0], [0, 4]];
                    for (var i = 0; i < offsets.length; i++) {
                        var c = proj.invert([svgPoint[0] + offsets[i][0], svgPoint[1] + offsets[i][1]]);
                        if (c && !isNaN(c[0]) && !isNaN(c[1])) return c;
                    }
                    return coords;
                }

                function _annotClientToLonLat(clientX, clientY) {
                    var rect = getMapRect();
                    var svgPoint = currentTransform.invert([clientX - rect.left, clientY - rect.top]);
                    var coords = invertMapPoint(svgPoint);
                    if (!coords || isNaN(coords[0]) || isNaN(coords[1])) return null;
                    return [coords[0], coords[1]];
                }

                // Splits projected geometries into visually-contiguous pieces across
                // the Waterman butterfly seams (same mechanism as the admin
                // boundaries layer). Returns the original geometry when no piece
                // jumps more than jumpPx, otherwise an array of LineString pieces.
                function _adminSeamSplitGeometries(geom, proj, jumpPx) {
                    var split = function(ring) {
                        var pieces = [];
                        var cur = [];
                        var prevP = null;
                        var prevGeo = null;
                        for (var i = 0; i < ring.length; i++) {
                            var p = proj(ring[i]);
                            if (!p || isNaN(p[0])) {
                                if (cur.length >= 2) pieces.push(cur);
                                cur = [];
                                prevGeo = null;
                                prevP = null;
                                continue;
                            }
                            if (prevGeo && Math.sqrt(Math.pow(p[0] - prevP[0], 2) + Math.pow(p[1] - prevP[1], 2)) > jumpPx) {
                                if (cur.length >= 2) pieces.push(cur);
                                cur = [ring[i]];
                            } else {
                                cur.push(ring[i]);
                            }
                            prevGeo = ring[i];
                            prevP = p;
                        }
                        if (cur.length >= 2) pieces.push(cur);
                        return pieces;
                    };
                    var results = [];
                    var anyJump = false;
                    var forEachRing = function(rings) {
                        for (var r = 0; r < rings.length; r++) {
                            var pieces = split(rings[r]);
                            if (pieces.length > 1) {
                                anyJump = true;
                                for (var q = 0; q < pieces.length; q++) results.push({ type: 'LineString', coordinates: pieces[q] });
                            } else {
                                results.push({ type: 'LineString', coordinates: rings[r] });
                            }
                        }
                    };
                    if (geom.type === 'Polygon') {
                        forEachRing(geom.coordinates);
                        return anyJump ? results : geom;
                    }
                    if (geom.type === 'MultiPolygon') {
                        var keepPieces = [];
                        for (var m = 0; m < geom.coordinates.length; m++) {
                            var polyRings = geom.coordinates[m];
                            var localOut = [];
                            var localJump = false;
                            for (var rr = 0; rr < polyRings.length; rr++) {
                                var pieces2 = split(polyRings[rr]);
                                if (pieces2.length > 1) {
                                    localJump = true;
                                    for (var q2 = 0; q2 < pieces2.length; q2++) localOut.push({ type: 'LineString', coordinates: pieces2[q2] });
                                } else {
                                    localOut.push({ type: 'LineString', coordinates: polyRings[rr] });
                                }
                            }
                            if (localJump) {
                                for (var qq = 0; qq < localOut.length; qq++) keepPieces.push(localOut[qq]);
                            } else {
                                keepPieces.push({ type: 'MultiPolygon', coordinates: [polyRings] });
                            }
                        }
                        return geom.coordinates.length === keepPieces.length ? (keepPieces.length && keepPieces[0].type === 'MultiPolygon' ? geom : keepPieces) : keepPieces;
                    }
                    if (geom.type === 'LineString') {
                        var linePieces = split(geom.coordinates);
                        if (linePieces.length > 1) {
                            var lineResults = [];
                            for (var lp = 0; lp < linePieces.length; lp++) lineResults.push({ type: 'LineString', coordinates: linePieces[lp] });
                            return lineResults;
                        }
                        return geom;
                    }
                    if (geom.type === 'MultiLineString') {
                        var mlResults = [];
                        var mlJump = false;
                        for (var ml = 0; ml < geom.coordinates.length; ml++) {
                            var mlPieces = split(geom.coordinates[ml]);
                            if (mlPieces.length > 1) {
                                mlJump = true;
                                for (var mq = 0; mq < mlPieces.length; mq++) mlResults.push({ type: 'LineString', coordinates: mlPieces[mq] });
                            } else {
                                mlResults.push({ type: 'LineString', coordinates: geom.coordinates[ml] });
                            }
                        }
                        return mlJump ? mlResults : geom;
                    }
                    return geom;
                }

                // Splits a projected line into contiguous pieces across projection
                // seams (same visual mechanism as the admin boundaries layer).
                function _projectAnnotationParts(coordsArr, proj) {
                    var pieces = [];
                    var cur = [];
                    coordsArr.forEach(function(c) {
                        var p = proj(c);
                        if (!p || isNaN(p[0])) {
                            if (cur.length >= 2) pieces.push(cur);
                            cur = [];
                        } else {
                            cur.push(p);
                        }
                    });
                    if (cur.length >= 2) pieces.push(cur);
                    return pieces;
                }

                function _annotationTypeLabel(a) {
                    if (a.type === 'pin') return t('annotationPin');
                    if (a.type === 'region') return t('annotationRegion');
                    if (a.type === 'arrow') return t('annotationArrow');
                    return t('annotationDraw');
                }

                function _annotNormalizeSize(v) {
                    if (v === 'small') return 8;
                    if (v === 'large') return 16;
                    if (v === 'medium' || v === null || v === undefined || v === '') return 10;
                    var n = parseInt(String(v), 10);
                    return isNaN(n) ? 10 : n;
                }

                function redrawAnnotations() {
                    if (!gAnnotations) gAnnotations = gMap.append('g').attr('class', 'annotation-layer');
                    gAnnotations.selectAll('*').remove();
                    var proj = getActiveProjection();
                    var parts = null;
                    var zoomStroke = Math.min(4, Math.max(1, currentTransform.k));
                    function itemScale(a) { return _annotNormalizeSize(a && a.size) / 10; }
                    annotationsList.forEach(function(a) {
                        if (a.hidden) return;
                        var col = a.color || '#eab308';
                        var scale = itemScale(a);
                        if (a.type === 'pin') {
                            var xy = proj(a.coords);
                            if (!xy || isNaN(xy[0])) return;
                            gAnnotations.append('circle').attr('class', 'annotation-pin-circle').attr('cx', xy[0]).attr('cy', xy[1]).attr('r', 6 * scale).style('fill', col).style('stroke-width', 1.5 * scale * zoomStroke);
                            if (a.label) {
                                gAnnotations.append('text').attr('class', 'annotation-pin-label').attr('x', xy[0] + 9).attr('y', xy[1] + 4).text(a.label);
                            }
                        } else if (a.type === 'region' && Array.isArray(a.coords) && a.coords.length >= 3) {
                            var ring = a.coords.slice();
                            if (ring.length && (ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1])) {
                                ring.push(ring[0]);
                            }
                            var jumpPx = Math.min(getMapRect().width, getMapRect().height) * 0.55;
                            var geom = { type: 'Polygon', coordinates: [ring] };
                            var splitResult = _adminSeamSplitGeometries(geom, proj, jumpPx);
                            var polys = Array.isArray(splitResult) ? splitResult : [geom];
                            var anyDrawn = false;
                            polys.forEach(function(g) {
                                var ringCoords = (g.type === 'Polygon') ? g.coordinates[0] : g.coordinates;
                                var pts = ringCoords.map(function(c) { return proj(c); }).filter(function(p) { return p && !isNaN(p[0]); });
                                if (pts.length < 3) return;
                                var d = 'M' + pts.map(function(p) { return p[0] + ',' + p[1]; }).join('L') + 'Z';
                                gAnnotations.append('path').attr('class', 'annotation-region-poly').attr('d', d).style('stroke', col).style('fill', col + '26').style('stroke-width', 2 * scale * zoomStroke);
                                anyDrawn = true;
                            });
                            if (anyDrawn && a.label) {
                                var labelPts = a.coords.map(function(c) { return proj(c); }).filter(function(p) { return p && !isNaN(p[0]); });
                                if (labelPts.length) {
                                    var cx = 0, cy = 0;
                                    labelPts.forEach(function(p) { cx += p[0]; cy += p[1]; });
                                    cx /= labelPts.length; cy /= labelPts.length;
                                    gAnnotations.append('text').attr('class', 'annotation-pin-label').attr('x', cx).attr('y', cy).attr('text-anchor', 'middle').text(a.label);
                                }
                            }
                        } else if (a.type === 'freehand' && Array.isArray(a.coords) && a.coords.length >= 2) {
                            parts = _projectAnnotationParts(a.coords, proj);
                            if (!parts.length) return;
                            var freeLabelPos = null;
                            parts.forEach(function(part) {
                                var pd = 'M' + part.map(function(p) { return p[0] + ',' + p[1]; }).join('L');
                                gAnnotations.append('path').attr('class', 'annotation-freehand-path').attr('d', pd).style('stroke', col).style('stroke-width', 2.5 * scale * zoomStroke);
                                if (!freeLabelPos && part.length) freeLabelPos = part[0];
                            });
                            if (a.label && freeLabelPos) {
                                gAnnotations.append('text').attr('class', 'annotation-pin-label').attr('x', freeLabelPos[0] + 9).attr('y', freeLabelPos[1] + 4).text(a.label);
                            }
                        } else if (a.type === 'arrow' && Array.isArray(a.coords) && a.coords.length >= 2) {
                            parts = _projectAnnotationParts(a.coords, proj);
                            if (!parts.length) return;
                            var headCoords = a.coords[a.coords.length - 1];
                            var arrowLabelPos = null;
                            parts.forEach(function(part) {
                                var pd = 'M' + part.map(function(p) { return p[0] + ',' + p[1]; }).join('L');
                                gAnnotations.append('path').attr('class', 'annotation-arrow-line').attr('d', pd).style('stroke', col).style('stroke-width', 2.5 * scale * zoomStroke);
                                if (part.length > 1) arrowLabelPos = part[0];
                            });
                            var headProj = proj(headCoords);
                            if (headProj && !isNaN(headProj[0])) {
                                var hp = null;
                                var tailOfHead = null;
                                parts.forEach(function(part) {
                                    if (part.length < 2) return;
                                    var last = part[part.length - 1];
                                    if (Math.abs(last[0] - headProj[0]) < 0.5 && Math.abs(last[1] - headProj[1]) < 0.5) {
                                        hp = last;
                                        tailOfHead = part[part.length - 2];
                                    }
                                });
                                if (!hp) { hp = headProj; tailOfHead = parts[parts.length - 1][parts[parts.length - 1].length - 2]; }
                                var ang = Math.atan2(hp[1] - tailOfHead[1], hp[0] - tailOfHead[0]);
                                var AL = 13 * scale, AW = 6 * scale;
                                var ax1 = hp[0], ay1 = hp[1];
                                var bxp = ax1 - AL * Math.cos(ang), byp = ay1 - AL * Math.sin(ang);
                                var perpx = -Math.sin(ang), perpy = Math.cos(ang);
                                gAnnotations.append('path').attr('class', 'annotation-arrow-head').attr('d',
                                    'M' + ax1 + ',' + ay1 + 'L' + (bxp + AW * perpx) + ',' + (byp + AW * perpy) + 'L' + (bxp - AW * perpx) + ',' + (byp - AW * perpy) + 'Z').style('fill', col);
                                if (a.label && arrowLabelPos) {
                                    gAnnotations.append('text').attr('class', 'annotation-pin-label').attr('x', arrowLabelPos[0] + 9).attr('y', arrowLabelPos[1] + 4).text(a.label);
                                }
                            }
                        }
                    });
                }

                function clearAnnotationsView() {
                    if (gAnnotations) gAnnotations.selectAll('*').remove();
                }

                function redrawAnnotationDrawing() {
                    if (!gAnnotations) gAnnotations = gMap.append('g').attr('class', 'annotation-layer');
                    gAnnotations.selectAll('.annotation-draw-vertex, .annotation-draw-poly').remove();
                    var proj = getActiveProjection();
                    var finishBtn = document.getElementById('annotationFinishBtn');
                    if (finishBtn) finishBtn.style.display = (annotatePoints.length >= 3) ? '' : 'none';
                    var fontScale = _annotNormalizeSize(annotateFontSize) / 10;
                    var zoomStroke = Math.min(4, Math.max(1, currentTransform.k));
                    annotatePoints.forEach(function(c) {
                        var xy = proj(c);
                        if (!xy || isNaN(xy[0])) return;
                        gAnnotations.append('circle').attr('class', 'annotation-region-vertex annotation-draw-vertex').attr('cx', xy[0]).attr('cy', xy[1]).attr('r', 4 * fontScale).style('fill', annotateColor);
                    });
                    if (annotatePoints.length >= 2) {
                        var pts = annotatePoints.map(function(c) { return proj(c); }).filter(function(p) { return p && !isNaN(p[0]); });
                        if (pts.length >= 2) {
                            var d = 'M' + pts.map(function(p) { return p[0] + ',' + p[1]; }).join('L');
                            if (annotatePoints.length >= 3) d += 'Z';
                            gAnnotations.append('path').attr('class', 'annotation-region-poly annotation-draw-poly').attr('d', d).style('stroke', annotateColor).style('fill', annotateColor + '1f').style('stroke-width', 2 * fontScale * zoomStroke);
                        }
                    }
                }

                function _annotStrokeKilometers(pts) {
                    var km = 0;
                    for (var i = 1; i < pts.length; i++) {
                        var r = d3.geoDistance(pts[i - 1], pts[i]);
                        if (isNaN(r)) continue;
                        km += r * 6371;
                    }
                    return Math.round(km);
                }

                function _annotFlushSamples() {
                    _annotStrokeRAF = null;
                    if (!_annotStrokeActive || !_annotStrokeAccum) return;
                    var acc = _annotStrokeAccum;
                    _annotStrokeAccum = null;
                    if (!_annotStrokePoints.length) {
                        _annotStrokePoints.push(_annotClientToLonLat(acc[0], acc[1]));
                        _annotStrokePrevScreen = acc;
                        return;
                    }
                    var rect = getMapRect();
                    var dx = acc[0] - _annotStrokePrevScreen[0];
                    var dy = acc[1] - _annotStrokePrevScreen[1];
                    var d = Math.sqrt(dx * dx + dy * dy);
                    _annotStrokePathLen += d;
                    if (d >= 2) {
                        var ll = _annotClientToLonLat(acc[0], acc[1]);
                        if (ll) {
                            _annotStrokePoints.push(ll);
                            _annotStrokePrevScreen = acc;
                            _annotStrokeUpdatePreview();
                        }
                    }
                }

                function _annotStrokeUpdatePreview() {
                    if (!_annotStrokePoints || !_annotStrokePoints.length) return;
                    if (!gAnnotations) gAnnotations = gMap.append('g').attr('class', 'annotation-layer');
                    var proj = getActiveProjection();
                    var finishBtn = document.getElementById('annotationFinishBtn');
                    if (!_annotPreviewEl || !_annotPreviewEl.isConnected) {
                        if (!_annotStrokePoints.length) return;
                        gAnnotations.selectAll('.annotation-draw-poly').remove();
                        _annotPreviewEl = gAnnotations.append('path').attr('class', 'annotation-region-poly annotation-draw-poly').node();
                        _annotPreviewEl.style.stroke = annotateColor;
                        _annotPreviewEl.style.fill = annotateColor + '1f';
                        _annotPreviewEl.style.strokeWidth = String((annotateKind === 'region' ? 2 : 2.5) * (_annotNormalizeSize(annotateFontSize) / 10) * Math.min(4, Math.max(1, currentTransform.k)));
                    }
                    if (finishBtn) finishBtn.style.display = '';
                    var d;
                    if (annotateKind === 'arrow' && _annotStrokePoints.length >= 2) {
                        var p0 = proj(_annotStrokePoints[0]);
                        var p1 = proj(_annotStrokePoints[_annotStrokePoints.length - 1]);
                        if (p0 && p1 && !isNaN(p0[0]) && !isNaN(p1[0])) {
                            d = 'M' + p0[0] + ',' + p0[1] + 'L' + p1[0] + ',' + p1[1];
                            if (_annotPreviewEl && !_annotPreviewEl.style.stroke) _annotPreviewEl.style.stroke = annotateColor;
                        }
                    } else if (annotateKind === 'freehand' && _annotStrokePoints.length >= 2) {
                        var parts = _projectAnnotationParts(_annotStrokePoints, proj);
                        d = parts.map(function(part) { return 'M' + part.map(function(p) { return p[0] + ',' + p[1]; }).join('L'); }).join('');
                    }
                    if (d) {
                        _annotPreviewEl.setAttribute('d', d);
                        _annotPreviewEl.style.strokeWidth = String((annotateKind === 'region' ? 2 : 2.5) * (_annotNormalizeSize(annotateFontSize) / 10) * Math.min(4, Math.max(1, currentTransform.k)));
                    }
                }

                function clearAnnotationDrawing() {
                    if (_annotStrokeRAF) { cancelAnimationFrame(_annotStrokeRAF); _annotStrokeRAF = null; }
                    _annotStrokeActive = false;
                    _annotStrokePointerId = null;
                    _annotStrokePoints = null;
                    _annotStrokeStartScreen = null;
                    _annotStrokePrevScreen = null;
                    _annotStrokePathLen = 0;
                    _annotStrokeAccum = null;
                    _annotPreviewEl = null;
                    annotatePoints = [];
                    var finishBtn = document.getElementById('annotationFinishBtn');
                    if (finishBtn) finishBtn.style.display = 'none';
                    redrawAnnotations();
                }

                function cancelAnnotationStroke() {
                    if (!_annotStrokeActive && (!_annotStrokePoints || !_annotStrokePoints.length)) return false;
                    clearAnnotationDrawing();
                    annotateToast(t('annotationStrokeCancelled'));
                    return true;
                }

                function setPanSpaceHeld(v) { _panSpaceHeld = v; }

                function _annotFinalizeStroke(silent) {
                    if (!_annotStrokePoints || !_annotStrokePoints.length) return;
                    var pts = _annotStrokePoints.filter(function(p) { return p; });
                    var moving = _annotStrokePathLen >= 10;
                    var isArrow = annotateKind === 'arrow';
                    if (!moving) {
                        clearAnnotationDrawing();
                        return;
                    }
                    if (pts.length < 2) {
                        clearAnnotationDrawing();
                        return;
                    }
                    _annotStrokeActive = false;
                    if (_annotStrokeRAF) { cancelAnimationFrame(_annotStrokeRAF); _annotStrokeRAF = null; }
                    var coords = isArrow ? [pts[0], pts[pts.length - 1]] : pts;
                    var distanceKm = isArrow ? _annotStrokeKilometers(coords) : _annotStrokeKilometers(pts);
                    _annotPreviewEl = null;
                    annotatePoints = [];
                    clearAnnotationDrawing();
                    annotationsList.push({
                        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                        type: isArrow ? 'arrow' : 'freehand',
                        coords: coords,
                        label: '',
                        color: annotateColor,
                        size: annotateFontSize,
                        distanceKm: distanceKm,
                        createdAt: Date.now()
                    });
                    saveAnnotations();
                    redrawAnnotations();
                    annotateToast(t('annotationAdded'));
                    if (silent) return;
                    annotateToast(t('annotationLengthLabel').replace('{km}', distanceKm.toLocaleString('en')));
                }

                function finishAnnotationTool() {
                    if (!annotateActive) return;
                    if (annotateKind === 'region') { finishAnnotationRegion(); return; }
                    if (annotateKind === 'freehand' || annotateKind === 'arrow') {
                        if (_annotStrokeActive || (_annotStrokePoints && _annotStrokePoints.length >= 2)) _annotFinalizeStroke(false);
                    }
                }

                function _annotStrokeIsDrawKind() { return annotateActive && (annotateKind === 'freehand' || annotateKind === 'arrow'); }

                function onAnnotationPointerDown(e) {
                    if (!_annotStrokeIsDrawKind()) return;
                    if (!e.target || !e.target.closest || !e.target.closest('#mapSvg')) return;
                    if (_panSpaceHeld || e.button === 2 || e.button === 1) return;
                    if (_annotStrokeActive) {
                        _annotStrokeActive = false;
                        cancelAnnotationStroke();
                        return;
                    }
                    if (e.pointerType === 'touch' && !e.isPrimary) return;
                    e.preventDefault();
                    e.stopPropagation();
                    _annotStrokePointerId = e.pointerId;
                    _annotStrokeActive = true;
                    _annotStrokeStartScreen = [e.clientX, e.clientY];
                    _annotStrokePrevScreen = [e.clientX, e.clientY];
                    _annotStrokePathLen = 0;
                    _annotStrokePoints = [];
                    _annotStrokeAccum = [e.clientX, e.clientY];
                    _annotFlushSamples();
                    if (_annotStrokePoints.length) _annotStrokeUpdatePreview();
                }

                function onAnnotationPointerMove(e) {
                    if (!_annotStrokeActive || e.pointerId !== _annotStrokePointerId) return;
                    if (!e.target || !e.target.closest || !e.target.closest('#mapSvg')) { endAnnotationStroke(e); return; }
                    e.preventDefault();
                    e.stopPropagation();
                    _annotStrokeAccum = [e.clientX, e.clientY];
                    if (!_annotStrokeRAF) _annotStrokeRAF = requestAnimationFrame(_annotFlushSamples);
                }

                function onAnnotationPointerUp(e) {
                    if (!_annotStrokeActive || e.pointerId !== _annotStrokePointerId) return;
                    e.preventDefault();
                    e.stopPropagation();
                    endAnnotationStroke(e);
                }

                function endAnnotationStroke(e) {
                    if (!_annotStrokeActive) return;
                    _annotStrokeActive = false;
                    _annotStrokePointerId = null;
                    if (_annotStrokeRAF) { cancelAnimationFrame(_annotStrokeRAF); _annotStrokeRAF = null; }
                    if (_annotStrokeAccum) {
                        var acc = _annotStrokeAccum;
                        _annotStrokeAccum = null;
                        var rect = getMapRect();
                        var dxAcc = acc[0] - _annotStrokePrevScreen[0];
                        var dyAcc = acc[1] - _annotStrokePrevScreen[1];
                        _annotStrokePathLen += Math.sqrt(dxAcc * dxAcc + dyAcc * dyAcc);
                        var ll = _annotClientToLonLat(acc[0], acc[1]);
                        if (ll) _annotStrokePoints.push(ll);
                        _annotStrokeUpdatePreview();
                    }
                    _annotFinalizeStroke(false);
                }

                function finishAnnotationRegion() {
                    if (annotatePoints.length < 3) return;
                    var pendingCoords = annotatePoints.slice();
                    annotatePoints = [];
                    annotationsList.push({
                        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                        type: 'region', coords: pendingCoords, label: '', color: annotateColor, size: annotateFontSize, createdAt: Date.now()
                    });
                    saveAnnotations();
                    redrawAnnotations();
                    annotateToast(t('annotationAdded'));
                }

                function handleAnnotationClick(e) {
                    if (!annotateActive) return;
                    if (e.target && e.target.closest && !e.target.closest('#mapSvg')) return;
                    if (e.target && e.target.closest && e.target.closest('.annotation-pin-circle, .annotation-pin-label, .annotation-region-poly')) return;
                    var rect = getMapRect();
                    var clickX = e.clientX - rect.left;
                    var clickY = e.clientY - rect.top;
                    var svgPoint = currentTransform.invert([clickX, clickY]);
                    var coords = invertMapPoint(svgPoint);
                    if (!coords || isNaN(coords[0]) || isNaN(coords[1])) return;
                    if (annotateKind === 'pin') {
                        annotationsList.push({
                            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                            type: 'pin', coords: [coords[0], coords[1]],
                            label: '', color: annotateColor, size: annotateFontSize, createdAt: Date.now()
                        });
                        saveAnnotations();
                        redrawAnnotations();
                        annotateToast(t('annotationAdded'));
                    } else if (annotateKind === 'region') {
                        annotatePoints.push([coords[0], coords[1]]);
                        redrawAnnotationDrawing();
                    }
                }

                function maybeStartAnnotationTutorial() {
                    try { if (localStorage.getItem('annotateExplained') === '1') return; } catch (e) {}
                    setTimeout(function() { if (window.startAnnotationTutorial) window.startAnnotationTutorial(); }, 300);
                }

                function setAnnotationToolbarActive() {
                    var pinBtn = document.getElementById('annotationKindPin');
                    var regionBtn = document.getElementById('annotationKindRegion');
                    var drawBtn = document.getElementById('annotationKindDraw');
                    var arrowBtn = document.getElementById('annotationKindArrow');
                    if (pinBtn) { pinBtn.classList.toggle('toggle-on', annotateKind === 'pin'); pinBtn.setAttribute('aria-pressed', String(annotateKind === 'pin')); }
                    if (regionBtn) { regionBtn.classList.toggle('toggle-on', annotateKind === 'region'); regionBtn.setAttribute('aria-pressed', String(annotateKind === 'region')); }
                    if (drawBtn) { drawBtn.classList.toggle('toggle-on', annotateKind === 'freehand'); drawBtn.setAttribute('aria-pressed', String(annotateKind === 'freehand')); }
                    if (arrowBtn) { arrowBtn.classList.toggle('toggle-on', annotateKind === 'arrow'); arrowBtn.setAttribute('aria-pressed', String(annotateKind === 'arrow')); }
                    document.querySelectorAll('#annotationToolbar .annotation-color-swatch').forEach(function(s) {
                        var on = s.getAttribute('data-color') === annotateColor;
                        s.classList.toggle('toggle-on', on);
                        s.setAttribute('aria-pressed', String(on));
                    });
                    var cur = _annotNormalizeSize(annotateFontSize);
                    var pressed = {};
                    pressed.small = (cur === ANNOT_FONT_LEVELS[0]);
                    pressed.medium = (cur === 10);
                    pressed.large = (cur === ANNOT_FONT_LEVELS[ANNOT_FONT_LEVELS.length - 1]);
                    Object.keys(pressed).forEach(function(size) {
                        var b = document.getElementById('annotationFont' + size.charAt(0).toUpperCase() + size.slice(1) + 'Btn');
                        if (b) { b.classList.toggle('toggle-on', pressed[size]); b.setAttribute('aria-pressed', String(pressed[size])); }
                    });
                    var fv = document.getElementById('annotationFontValue');
                    if (fv) fv.textContent = String(cur);
                    if (annotateKind === 'region' && annotatePoints.length > 0) redrawAnnotationDrawing(); else redrawAnnotations();
                }

                function toggleAnnotationMode() {
                    annotateActive = !annotateActive;
                    var btn = document.getElementById('annotateBtn');
                    if (btn) {
                        btn.classList.toggle('toggle-on', annotateActive);
                        btn.setAttribute('aria-pressed', String(annotateActive));
                    }
                    var mbtn = document.getElementById('mobileAnnotateBtn');
                    if (mbtn) {
                        mbtn.classList.toggle('toggle-on', annotateActive);
                        mbtn.setAttribute('aria-pressed', String(annotateActive));
                    }
                    document.body.classList.toggle('annotate-active', annotateActive);
                    var toolbar = document.getElementById('annotationToolbar');
                    if (toolbar) {
                        toolbar.style.display = annotateActive ? 'flex' : 'none';
                        toolbar.setAttribute('aria-hidden', String(!annotateActive));
                    }
                    if (annotateActive) {
                        annotationsList = [];
                        clearAnnotationDrawing();
                        clearAnnotationsView();
                        if (measureActive) toggleMeasureMode();
                        setAnnotationToolbarActive();
                        annotateToast(t('annotationModeOn'));
                        maybeStartAnnotationTutorial();
                    } else {
                        saveAnnotations();
                        annotationsList = [];
                        clearAnnotationDrawing();
                        clearAnnotationsView();
                        annotateToast(t('annotationModeOff'));
                    }
                }

                function restorePreviousAnnotations() {
                    var saved = loadAnnotations();
                    if (!saved || !saved.length) {
                        annotateToast(t('annotationNoSavedSession'));
                        return;
                    }
                    annotationsList = saved;
                    redrawAnnotations();
                    if (renderAnnotationsModal) renderAnnotationsModal();
                    annotateToast(t('annotationSessionRestored'));
                }

                function openAnnotationLabelDialog(title, defaultValue, onSave, allowEmpty) {
                    var modal = document.getElementById('annotationLabelModal');
                    var input = document.getElementById('annotationLabelInput');
                    var saveBtn = document.getElementById('annotationLabelSave');
                    var cancelBtn = document.getElementById('annotationLabelCancel');
                    var closeBtn = document.getElementById('annotationLabelClose');
                    if (!modal || !input) return;
                    var triggerEl = document.activeElement;
                    var lbl = document.getElementById('annotationLabelPrompt');
                    if (lbl) lbl.textContent = title || '';
                    input.value = (defaultValue !== null && defaultValue !== undefined) ? String(defaultValue) : '';
                    modal.classList.add('visible');
                    modal.style.display = 'flex';
                    if (saveBtn) saveBtn.textContent = t('addLabel');
                    if (cancelBtn) cancelBtn.textContent = t('quizCancel');
                    input.focus();
                    input.select();

                    function cleanup() {
                        modal.classList.remove('visible');
                        modal.style.display = 'none';
                        if (triggerEl && triggerEl.isConnected) triggerEl.focus(); else if (document.getElementById('mapContainer')) document.getElementById('mapContainer').focus();
                    }

                    function commit() { var v = input.value.trim(); if ((v || allowEmpty) && onSave) onSave(v); cleanup(); }
                    if (saveBtn) saveBtn.onclick = commit;
                    if (cancelBtn) cancelBtn.onclick = cleanup;
                    if (closeBtn) closeBtn.onclick = cleanup;
                    input.onkeydown = function(e) {
                        if (e.key === 'Enter') { e.preventDefault(); commit(); }
                        if (e.key === 'Escape') { cleanup(); }
                    };
                    input.onblur = function() { /* do not auto-close on blur */ };
                    modal.addEventListener('click', function(e) { if (e.target === modal.querySelector('.layers-modal-backdrop') || e.target === modal) cleanup(); }, { once: true });
                }

                /* ── Stage 5: keyboard alternative for pin/region annotations ──
                   Reuses the country-search dataset (countryNamesList +
                   getDisplayName + getCountryFlag). Pin → centroid; region →
                   bounding-box polygon. */
                function openAnnotationPlaceDialog(kind) {
                    var modal = document.getElementById('annotationPlaceModal');
                    var input = document.getElementById('annotationPlaceInput');
                    var list = document.getElementById('annotationPlaceResults');
                    var noRes = document.getElementById('annotationPlaceNoResults');
                    var cancelBtn = document.getElementById('annotationPlaceCancel');
                    var closeBtn = document.getElementById('annotationPlaceClose');
                    var titleEl = document.getElementById('annotationPlaceTitle');
                    if (!modal || !input || !list) return;
                    var triggerEl = document.activeElement;
                    if (titleEl) titleEl.textContent = t(kind === 'region' ? 'placeModalTitleRegion' : 'placeModalTitlePin');
                    input.value = '';
                    list.innerHTML = '';
                    list.style.display = 'none';
                    if (noRes) noRes.style.display = 'none';
                    input.setAttribute('aria-expanded', 'false');
                    modal.classList.add('visible');
                    modal.style.display = 'flex';

                    function matches(val) {
                        return countryNamesList.filter(function(n) {
                            var localized = getDisplayName(n).toLowerCase();
                            return n.toLowerCase().includes(val) || localized.includes(val);
                        }).slice(0, 8);
                    }
                    function renderResults() {
                        var val = input.value.trim().toLowerCase();
                        list.innerHTML = '';
                        if (!val) { list.style.display = 'none'; if (noRes) noRes.style.display = 'none'; input.setAttribute('aria-expanded', 'false'); return; }
                        var ms = matches(val);
                        ms.forEach(function(m, i) {
                            var li = document.createElement('li');
                            li.setAttribute('role', 'option');
                            li.id = 'placeOpt-' + i;
                            var b = document.createElement('button');
                            b.type = 'button';
                            b.className = 'place-result-btn quiz-suggestion';
                            b.style.cssText = 'display:flex;width:100%;text-align:' + (document.documentElement.dir === 'rtl' ? 'right' : 'left') + ';gap:6px;align-items:center;padding:6px 10px;background:none;border:none;cursor:pointer;color:inherit;font:inherit;';
                            b.textContent = getCountryFlag(m) + ' ' + getDisplayName(m);
                            b.addEventListener('click', function() { commit(m); });
                            li.appendChild(b);
                            list.appendChild(li);
                        });
                        list.style.display = 'block';
                        input.setAttribute('aria-expanded', 'true');
                        input.setAttribute('aria-activedescendant', ms.length ? 'placeOpt-0' : '');
                        if (noRes) noRes.style.display = ms.length ? 'none' : 'block';
                    }
                    function cleanup() {
                        modal.classList.remove('visible');
                        modal.style.display = 'none';
                        modal._placeCleanup = null;
                        if (triggerEl && triggerEl.isConnected && triggerEl.offsetParent !== null) triggerEl.focus();
                        else if (document.getElementById('annotateBtn')) document.getElementById('annotateBtn').focus();
                    }
                    function commit(name) {
                        var feature = allCountryFeatures.find(function(f) { return f.properties && f.properties.name === name; });
                        if (feature) {
                            if (kind === 'pin') {
                                var c = d3.geoCentroid(feature);
                                if (c && !isNaN(c[0])) {
                                    annotationsList.push({
                                        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                                        type: 'pin', coords: [c[0], c[1]], label: getDisplayName(name),
                                        color: annotateColor, size: annotateFontSize, createdAt: Date.now()
                                    });
                                }
                            } else {
                                var bb = d3.geoBounds(feature);
                                if (bb && !isNaN(bb[0][0])) {
                                    var w = bb[0][0], n = bb[0][1], ee = bb[1][0], s = bb[1][1];
                                    if (w > ee) { var tmp = w; w = ee; ee = tmp; }
                                    annotationsList.push({
                                        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                                        type: 'region',
                                        coords: [[w, s], [ee, s], [ee, n], [w, n]],
                                        label: getDisplayName(name),
                                        color: annotateColor, size: annotateFontSize, createdAt: Date.now()
                                    });
                                }
                            }
                            saveAnnotations();
                            redrawAnnotations();
                            annotateToast(t('annotationAdded'));
                        }
                        cleanup();
                    }
                    modal._placeCleanup = cleanup;
                    if (cancelBtn) cancelBtn.onclick = cleanup;
                    if (closeBtn) closeBtn.onclick = cleanup;
                    input.onkeydown = function(e) {
                        if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            var first = list.querySelector('button');
                            if (first) first.focus();
                        } else if (e.key === 'Enter') {
                            e.preventDefault();
                            var bs = list.querySelectorAll('button');
                            if (bs.length === 1) commit(matches(input.value.trim().toLowerCase())[0]);
                            else if (bs.length) { e.preventDefault(); bs[0].focus(); }
                        } else if (e.key === 'Escape') {
                            e.preventDefault();
                            cleanup();
                        }
                    };
                    list.addEventListener('keydown', function(e) {
                        var btns = [...list.querySelectorAll('button')];
                        var i = btns.indexOf(document.activeElement);
                        if (e.key === 'ArrowDown') { e.preventDefault(); if (i > -1 && i < btns.length - 1) btns[i + 1].focus(); else if (btns.length) btns[0].focus(); }
                        else if (e.key === 'ArrowUp') { e.preventDefault(); if (i > 0) btns[i - 1].focus(); else input.focus(); }
                        else if (e.key === 'Escape') { e.preventDefault(); cleanup(); }
                    });
                    modal.addEventListener('click', function(e) { if (e.target === modal.querySelector('.layers-modal-backdrop') || e.target === modal) cleanup(); }, { once: true });
                    input.addEventListener('input', renderResults);
                    input.focus();
                    renderResults();
                }

                function setAnnotationColor(color) {
                    if (!/^#[0-9a-f]{6}$/i.test(color)) return;
                    annotateColor = color;
                    try { localStorage.setItem('annotateColor', color); } catch (e) {}
                    setAnnotationToolbarActive();
                }

                function stepAnnotationFontSize(delta) {
                    var cur = _annotNormalizeSize(annotateFontSize);
                    var idx = ANNOT_FONT_LEVELS.indexOf(cur);
                    if (idx === -1) idx = ANNOT_FONT_LEVELS.indexOf(10);
                    idx = Math.max(0, Math.min(ANNOT_FONT_LEVELS.length - 1, idx + delta));
                    setAnnotationFontSize(ANNOT_FONT_LEVELS[idx]);
                }

                function setAnnotationFontSize(size) {
                    if (ANNOT_FONT_LEVELS.indexOf(size) === -1) return;
                    annotateFontSize = size;
                    try { localStorage.setItem('annotateFontSize', String(size)); } catch (e) {}
                    setAnnotationToolbarActive();
                    var scale = size / 10;
                    if (_annotPreviewEl && _annotStrokeActive) {
                        _annotPreviewEl.style.strokeWidth = String((annotateKind === 'region' ? 2 : 2.5) * scale * Math.min(4, Math.max(1, currentTransform.k)));
                    } else if (annotateKind === 'region' && annotatePoints.length > 0) {
                        redrawAnnotationDrawing();
                    }
                }

                function undoLastAnnotation() {
                    if (!annotationsList.length) { annotateToast(t('annotationModeEmpty')); return; }
                    annotationsList.pop();
                    saveAnnotations();
                    clearAnnotationDrawing();
                    redrawAnnotations();
                    renderAnnotationsModal();
                    annotateToast(t('annotationUndone'));
                }

                function clearAllAnnotations() {
                    if (!annotationsList.length) { annotateToast(t('annotationModeEmpty')); return; }
                    var msg = t('annotationClearConfirm');
                    if (!window.confirm(msg)) return;
                    annotationsList = [];
                    saveAnnotations();
                    clearAnnotationDrawing();
                    clearAnnotationsView();
                    renderAnnotationsModal();
                    annotateToast(t('annotationCleared'));
                }

                function toggleAnnotationKind(kind) {
                    if (['pin', 'region', 'freehand', 'arrow'].indexOf(kind) === -1) return;
                    annotateKind = kind;
                    annotatePoints = [];
                    clearAnnotationDrawing();
                    setAnnotationToolbarActive();
                    var kindLabel = kind === 'pin' ? t('annotationPin') : kind === 'region' ? t('annotationRegion') : kind === 'arrow' ? t('annotationArrow') : t('annotationDraw');
                    annotateToast(t('annotationToolActive').replace('{tool}', kindLabel));
                }

                function exportAnnotationsFile() {
                    if (!annotationsList.length) { annotateToast(t('annotationExportEmpty')); return; }
                    var payload = { app: 'lepidos-atlas', kind: 'annotations', version: 1, exportedAt: new Date().toISOString(), annotations: annotationsList };
                    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                    var url = URL.createObjectURL(blob);
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = 'lepidos_annotations_' + new Date().toISOString().slice(0, 10) + '.json';
                    a.click();
                    setTimeout(function() { URL.revokeObjectURL(url); }, 500);
                    annotateToast(t('annotationExport') + ' ✓');
                }
                function importAnnotationsFile(file) {
                    if (!file) return;
                    var reader = new FileReader();
                    reader.onload = function() {
                        try {
                            var data = JSON.parse(reader.result);
                            var arr = Array.isArray(data) ? data : (data && Array.isArray(data.annotations) ? data.annotations : null);
                            if (!arr) throw new Error('bad shape');
                            var valid = arr.filter(function(a) {
                                return a && ['pin', 'region', 'freehand', 'arrow'].indexOf(a.type) !== -1 && Array.isArray(a.coords) && a.coords.length;
                            }).map(function(a) {
                                return {
                                    id: a.id || ('ann_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7)),
                                    type: a.type,
                                    coords: a.coords,
                                    label: typeof a.label === 'string' ? a.label : '',
                                    color: /^#[0-9a-fA-F]{3,8}$/.test(a.color || '') ? a.color : '#eab308',
                                    size: typeof a.size === 'number' && isFinite(a.size) ? a.size : 10,
                                    distanceKm: typeof a.distanceKm === 'number' ? a.distanceKm : null,
                                    hidden: !!a.hidden,
                                    createdAt: a.createdAt || Date.now()
                                };
                            });
                            if (!valid.length) { annotateToast(t('annotationImportError')); return; }
                            var existing = new Set(annotationsList.map(function(a) { return a.id; }));
                            var added = 0;
                            valid.forEach(function(a) { if (!existing.has(a.id)) { annotationsList.push(a); added++; } });
                            saveAnnotations();
                            redrawAnnotations();
                            renderAnnotationsModal();
                            annotateToast(t('annotationImported').replace('{n}', added));
                        } catch (e) {
                            annotateToast(t('annotationImportError'));
                        }
                    };
                    reader.onerror = function() { annotateToast(t('annotationImportError')); };
                    reader.readAsText(file);
                }
                function appendAnnotationTransferRow(body) {
                    var wrap = document.createElement('div');
                    wrap.style.display = 'flex';
                    wrap.style.flexWrap = 'wrap';
                    wrap.style.gap = '8px';
                    wrap.style.justifyContent = 'center';
                    wrap.style.marginTop = '10px';
                    var exportBtn = document.createElement('button');
                    exportBtn.className = 'btn annotation-export-btn';
                    exportBtn.textContent = t('annotationExport');
                    exportBtn.addEventListener('click', exportAnnotationsFile);
                    var importBtn = document.createElement('button');
                    importBtn.className = 'btn annotation-import-btn';
                    importBtn.textContent = t('annotationImport');
                    var fileInput = document.createElement('input');
                    fileInput.type = 'file';
                    fileInput.accept = '.json,application/json';
                    fileInput.style.display = 'none';
                    fileInput.addEventListener('change', function() {
                        if (fileInput.files && fileInput.files[0]) importAnnotationsFile(fileInput.files[0]);
                        fileInput.value = '';
                    });
                    importBtn.addEventListener('click', function() { fileInput.click(); });
                    wrap.appendChild(exportBtn);
                    wrap.appendChild(importBtn);
                    wrap.appendChild(fileInput);
                    body.appendChild(wrap);
                }

                function renderAnnotationsModal() {
                    var body = document.getElementById('annotationsModalBody');
                    if (!body) return;
                    if (annotationsList.length === 0) {
                        var stored = loadAnnotations();
                        var html = '<p style="color:var(--text-secondary);font-size:0.78em;text-align:center;">' + t('annotationEmpty') + '</p>';
                        if (stored && stored.length) {
                            html += '<button class="btn annotation-restore-btn" id="annotationRestoreBtn" data-i18n="annotationRestoreSession">' + t('annotationRestoreSession') + '</button>';
                        }
                        body.innerHTML = html;
                        var restoreBtn = document.getElementById('annotationRestoreBtn');
                        if (restoreBtn) restoreBtn.addEventListener('click', restorePreviousAnnotations);
                        appendAnnotationTransferRow(body);
                        return;
                    }
                    body.innerHTML = '';
                    annotationsList.forEach(function(a, idx) {
                        var label = escapeHtml(a.label || _annotationTypeLabel(a));
                        var typeLabel = escapeHtml(_annotationTypeLabel(a));
                        var distBadge = (a.type === 'freehand' || a.type === 'arrow') && a.distanceKm ? ' <span class="annotation-item-dist">' + escapeHtml(a.distanceKm.toLocaleString('en')) + ' km</span>' : '';
                        var hiddenBadge = a.hidden ? ' <span class="annotation-hidden-label">' + escapeHtml(t('annotationHidden')) + '</span>' : '';
                        var row = document.createElement('div');
                        row.className = 'annotation-item';
                        var typeEl = document.createElement('span');
                        typeEl.className = 'annotation-item-type';
                        typeEl.textContent = typeLabel;
                        var labelEl = document.createElement('span');
                        labelEl.className = 'annotation-item-label';
                        labelEl.innerHTML = escapeHtml(label) + distBadge + hiddenBadge;
                        var actions = document.createElement('div');
                        actions.className = 'annotation-item-actions';
                        var labelBtn = document.createElement('button');
                        labelBtn.className = 'annotation-label-btn';
                        labelBtn.textContent = t('annotationLabelTitle');
                        labelBtn.addEventListener('click', function() {
                            openAnnotationLabelDialog(t('annotationLabelTitle'), a.label || '', function(v) {
                                annotationsList[idx].label = v;
                                saveAnnotations();
                                renderAnnotationsModal();
                                redrawAnnotations();
                            }, false);
                        });
                        var visBtn = document.createElement('button');
                        visBtn.className = 'annotation-vis-btn';
                        visBtn.textContent = t('annotationShow');
                        visBtn.addEventListener('click', function() {
                            annotationsList[idx].hidden = !annotationsList[idx].hidden;
                            saveAnnotations();
                            renderAnnotationsModal();
                            redrawAnnotations();
                        });
                        var delBtn = document.createElement('button');
                        delBtn.className = 'annotation-del-btn';
                        delBtn.textContent = t('annotationDelete');
                        delBtn.addEventListener('click', function() {
                            if (!window.confirm(t('annotationDeleteConfirm', { label: a.label || typeLabel }))) return;
                            annotationsList.splice(idx, 1);
                            saveAnnotations();
                            renderAnnotationsModal();
                            redrawAnnotations();
                        });
                        actions.appendChild(labelBtn);
                        actions.appendChild(visBtn);
                        actions.appendChild(delBtn);
                        row.appendChild(typeEl);
                        row.appendChild(labelEl);
                        row.appendChild(actions);
                        body.appendChild(row);
                    });
                    var actionsWrap = document.createElement('div');
                    actionsWrap.style.display = 'flex';
                    actionsWrap.style.flexWrap = 'wrap';
                    actionsWrap.style.gap = '8px';
                    actionsWrap.style.justifyContent = 'center';
                    actionsWrap.style.marginTop = '12px';
                    var deleteAllBtn = document.createElement('button');
                    deleteAllBtn.className = 'btn annotation-del-all-btn';
                    deleteAllBtn.id = 'annotationDeleteAllBtn';
                    deleteAllBtn.textContent = t('annotationDeleteAll');
                    deleteAllBtn.addEventListener('click', clearAllAnnotations);
                    actionsWrap.appendChild(deleteAllBtn);
                    body.appendChild(actionsWrap);
                    var stored = loadAnnotations();
                    var restoreWrap = document.createElement('div');
                    restoreWrap.style.textAlign = 'center';
                    restoreWrap.style.marginTop = '10px';
                    var restoreBtn = document.createElement('button');
                    restoreBtn.className = 'btn annotation-restore-btn';
                    restoreBtn.id = 'annotationRestoreBtn';
                    restoreBtn.textContent = t('annotationRestoreSession');
                    restoreBtn.disabled = !(stored && stored.length);
                    restoreBtn.addEventListener('click', restorePreviousAnnotations);
                    restoreWrap.appendChild(restoreBtn);
                    body.appendChild(restoreWrap);
                    appendAnnotationTransferRow(body);
                }

                function openAnnotationsModal() {
                    renderAnnotationsModal();
                    var modal = document.getElementById('annotationsModal');
                    if (modal) modal.classList.add('visible');
                }

                function closeAnnotationsModal() {
                    var modal = document.getElementById('annotationsModal');
                    if (modal) modal.classList.remove('visible');
                }

            function renderCountries(features) {
                const bahrainFeature = {
                    type: 'Feature',
                    properties: { name: 'Bahrain' },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [
                            [
                                [50.3, 26.5],
                                [50.7, 26.5],
                                [50.7, 26.0],
                                [50.3, 26.0],
                                [50.3, 26.5]
                            ]
                        ]
                    }
                };
                features.push(bahrainFeature);

                const extraIslands = [
                    { name: 'Hokkaido', coords: [142.0, 43.0] },
                    { name: 'Honshu', coords: [138.0, 37.0] },
                    { name: 'Shikoku', coords: [133.5, 33.5] },
                    { name: 'Kyushu', coords: [131.0, 33.0] },
                    { name: 'Okinawa', coords: [127.5, 26.5] },
                    { name: 'Sumatra', coords: [101.0, -1.0] },
                    { name: 'Java', coords: [110.0, -7.0] },
                    { name: 'Kalimantan', coords: [115.0, -1.0] },
                    { name: 'Sulawesi', coords: [121.0, -2.0] },
                    { name: 'West Papua', coords: [136.0, -4.0] },
                    { name: 'Bali', coords: [115.2, -8.4] },
                    { name: 'Lombok', coords: [116.5, -8.6] },
                    { name: 'Luzon', coords: [121.0, 16.0] },
                    { name: 'Mindanao', coords: [125.0, 7.0] },
                    { name: 'Palawan', coords: [118.5, 9.5] },
                    { name: 'Cebu', coords: [123.9, 10.3] },
                    { name: 'Mindoro', coords: [121.0, 12.5] },
                    { name: 'Negros', coords: [123.0, 10.0] },
                    { name: 'Rhodes', coords: [28.2, 36.2] },
                    { name: 'Lesbos', coords: [26.2, 39.2] },
                    { name: 'Chios', coords: [26.0, 38.4] },
                    { name: 'Samos', coords: [26.8, 37.7] },
                    { name: 'Cyclades', coords: [25.0, 37.0] },
                    { name: 'Crete', coords: [24.5, 35.2] },
                    { name: 'Dominica', coords: [-61.4, 15.4] },
                    { name: 'Saint Lucia', coords: [-60.9, 13.9] },
                    { name: 'Grenada', coords: [-61.7, 12.1] },
                    { name: 'Barbados', coords: [-59.6, 13.1] },
                    { name: 'Solomon Is.', coords: [160.0, -9.0] },
                    { name: 'Vanuatu', coords: [167.0, -16.0] },
                    { name: 'Fiji', coords: [178.0, -17.0] },
                    { name: 'Socotra', coords: [53.5, 12.5] },
                    { name: 'Azores', coords: [-27.0, 38.5] },
                    { name: 'Canary Is.', coords: [-15.5, 28.0] }
                ];
                extraIslands.forEach(island => {
                    features.push({
                        type: 'Feature',
                        properties: { name: island.name },
                        geometry: { type: 'Point', coordinates: island.coords }
                    });
                });

                allCountryFeatures = features;
                countryNamesList = features.map(f => f.properties?.name || '').filter(n => n);
                extraIslands.forEach(is => {
                    if (!countryNamesList.includes(is.name)) countryNamesList.push(is.name);
                });
                if (!countryNamesList.includes('Bahrain')) countryNamesList.push('Bahrain');

                gCountries.selectAll('*').remove();
                countryPaths = gCountries.selectAll('path')
                    .data(features)
                    .join('path')
                    .attr('d', pathGen)
                    .attr('fill', d => getCountryFill(d))
                    .attr('stroke', d => getStroke(d))
                    .attr('stroke-width', d => getStrokeWidth(d))
                    .attr('opacity', d => getOpacity(d))
                    .attr('filter', getCountryFilterAttr)
                    .attr('cursor', 'pointer')
                    .attr('vector-effect', 'non-scaling-stroke')
                    .attr('tabindex', 0)
                    .attr('role', 'button')
                    .attr('aria-label', d => getDisplayName(d.properties?.name || ''));

                countryPaths.on('mouseenter', function(e, d) {
                    if (quizActive) return;
                    const name = d.properties?.name || '';
                    let displayName = getDisplayName(name);
                    const rel = getReligion(name);
                    const denom = sectMode ? getDenomination(name) : null;
                    let html = `<div class="country-name"><strong>${displayName}</strong></div>`;
                    if (colorMode === 'religion' && sectMode && denom) {
                        const denomLabel = lang === 'ar' ? (denominationArabic[denom] || religionArabic[rel] || denom) : lang === 'ru' ? (denominationRussian[denom] || religionRussian[rel] || denom) : lang === 'uz' ?(denominationUzbek[denom] || religionUzbek[rel] || denom): lang === 'es' ?(denominationSpanish[denom] || religionSpanish[rel] || denom) : denom;
                        html += `<div>${t('tooltipDenom')}: ${denomLabel}</div>`;
                    } else if (colorMode === 'religion') {
                        const relLabel = lang === 'ar' ? (religionArabic[rel] || rel) : lang === 'ru' ? (religionRussian[rel] || rel) : lang === 'uz' ?(religionUzbek[rel] || rel): lang === 'es' ?(religionSpanish[rel] || rel) : rel;
                        html += `<div>${t('tooltipReligion')}: ${relLabel}</div>`;
                    }
                    if (colorMode === 'terrain') {
                        const elev = getElevation(name);
                        html +=
                            `<div>${t('tooltipElevation')}: ${elev !== null ? elev + ' ' + t('elevationUnit') : t('unknown')}</div>`;
                    }
                    if (colorMode === 'density') {
                        const dens = getDensity(name);
                        html +=
                            `<div>${t('tooltipDensity')}: ${dens !== null ? dens + ' ' + t('densityUnit') : t('unknown')}</div>`;
                    }
                    if (colorMode === 'precipitation') {
                        const prec = getPrecipitation(name);
                        html +=
                            `<div>${t('tooltipPrecipitation')}: ${prec !== null ? prec + ' ' + t('precipitationUnit') : t('unknown')}</div>`;
                    }
                    if (colorMode === 'temperature') {
                        const temp = getTemperature(name, d);
                        html +=
                            `<div>${t('temperature')}: ${temp !== null ? temp + '°C' : t('unknown')}</div>`;
                    }
                    if (colorMode === 'gdp') {
                        const gdp = getGDP(name);
                        html +=
                            `<div>${t('tooltipGDP')}: ${gdp !== null ? '$' + gdp.toLocaleString('en-US') : t('unknown')}</div>`;
                    }
                    if (colorMode === 'hdi') {
                        const hdi = getHDI(name);
                        html +=
                            `<div>${t('tooltipHDI')}: ${hdi !== null ? hdi.toFixed(3) : t('unknown')}</div>`;
                    }
                    tooltip.textContent = '';
                    const tmpDiv = document.createElement('div');
                    tmpDiv.innerHTML = html;
                    while (tmpDiv.firstChild) tooltip.appendChild(tmpDiv.firstChild);
                    tooltip.classList.add('visible');
                    _tooltipSize.w = tooltip.offsetWidth || 180;
                    _tooltipSize.h = tooltip.offsetHeight || 60;
                    d3.select(this).transition().duration(prefersReducedMotion() ? 0 : 120).attr('stroke', '#fff').attr('stroke-width', 1.5);
                }).on('mousemove', function(e, d) {
                    _pendingTooltipEvent = e;
                    if (!_tooltipRAFPending) {
                        _tooltipRAFPending = true;
                        requestAnimationFrame(_flushTooltipPosition);
                    }
                    updateCoordinatesDisplay(e);
                }).on('mouseleave', function() {
                    tooltip.classList.remove('visible');
                    const _leaving = d3.select(this).datum();
                    if (_leaving !== selectedCountry) {
                        d3.select(this).transition().duration(prefersReducedMotion() ? 0 : 120)
                            .attr('stroke', d => getStroke(d))
                            .attr('stroke-width', d => getStrokeWidth(d));
                    }
                }).on('click', handleCountryActivate)
                .on('keydown', function(e, d) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCountryActivate(e, d);
                    }
                });

                // ── Touch support (mobile peek tooltip) ──
                // القاعدة: D3 يستمع على touchstart.zoom بمستوى SVG.
                // أي stopPropagation على المسار يمنع الحدث من الوصول لـ D3 فيتعطل التحريك والزوم.
                // الحل: لا نوقف الانتشار إطلاقاً — نسجل اللمس ونعرض تلميح خاطف فقط.
                // فتح اللوحة يتم عبر حدث 'click' الذي يعمل على الحاسوب والهاتف معاً.
                let _touchStartX = 0, _touchStartY = 0, _peekTimer = null;

                countryPaths.on('touchstart.peek', function(e, d) {
                    if (e.touches.length !== 1) return; // تجاهل الإيماءات المتعددة
                    _touchStartX = e.touches[0].clientX;
                    _touchStartY = e.touches[0].clientY;
                    clearTimeout(_peekTimer);
                    _peekTimer = setTimeout(() => {
                        const name = d.properties?.name || '';
                        const displayName = getDisplayName(name);
                        const rel = getReligion(name);
                        const relLabel = lang === 'ar' ? (religionArabic[rel] || rel) : lang === 'ru' ? (religionRussian[rel] || rel) : lang === 'uz' ?(religionUzbek[rel] || rel): lang === 'es' ?(religionSpanish[rel] || rel) : rel;
                        let html = `<div><strong>${displayName}</strong></div>`;
                        if (colorMode === 'religion') html += `<div>${t('tooltipReligion')}: ${relLabel}</div>`;
                        tooltip.textContent = '';
                        const tmpDiv2 = document.createElement('div');
                        tmpDiv2.innerHTML = html;
                        while (tmpDiv2.firstChild) tooltip.appendChild(tmpDiv2.firstChild);
                        const r = getMapRect();
                        const tx = _touchStartX - r.left;
                        const ty = _touchStartY - r.top;
                        tooltip.style.left = Math.min(tx + 12, r.width - 180) + 'px';
                        tooltip.style.top = Math.max(ty - 72, 4) + 'px';
                        tooltip.classList.add('visible');
                    }, 160); // تأخير قصير لتمييز الضغط من التحريك
                }, { passive: true })
                .on('touchmove.peek', function(e) {
                    if (e.touches.length !== 1) return;
                    const dx = e.touches[0].clientX - _touchStartX;
                    const dy = e.touches[0].clientY - _touchStartY;
                    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
                        // المستخدم يسحب — إلغاء التلميح وترك D3 يتحكم
                        clearTimeout(_peekTimer);
                        tooltip.classList.remove('visible');
                    }
                }, { passive: true })
                .on('touchend.peek touchcancel.peek', function() {
                    clearTimeout(_peekTimer);
                    tooltip.classList.remove('visible');
                }, { passive: true });

                drawCountryLabels(features);
                drawCorridors();
                drawPhysicalFeatures();
                drawPointLayersCanvas();
                drawCapitals();
                drawTimezones();
                drawMajorCities();
                updateLegend();
                updateCoordinatesDisplay({ clientX: 0, clientY: 0 });
            }

            // ── URL hash state management ──
            function updateHash() {
                const hash = new URLSearchParams();
                hash.set('lang', lang);
                hash.set('mode', colorMode);
                hash.set('filter', currentReligionFilter);
                // Serialize all layer flags from registry
                Object.keys(LAYER_DEFS).forEach(function(name) {
                    var def = LAYER_DEFS[name];
                    hash.set(def.hashKey, def.getFlag() ? '1' : '0');
                });
                if (selectedBloc !== 'all') hash.set('bloc', selectedBloc);
                if (currentSection === 'history') {
                    hash.set('sec', 'history');
                    if (historyTab === 'eras') {
                        if (historyEraId) hash.set('era', historyEraId);
                    } else {
                        if (historyWarId) hash.set('war', historyWarId);
                        if (historyScenarioId) hash.set('scen', historyScenarioId);
                    }
                }
                hash.set('k', currentTransform.k.toFixed(2));
                hash.set('x', currentTransform.x.toFixed(0));
                hash.set('y', currentTransform.y.toFixed(0));
                history.replaceState(null, '', '#' + hash.toString());
            }
            // Debounced version used during zoom to avoid 60 writes/sec
            const updateHashDebounced = debounce(updateHash, 300);
            window.updateHash = updateHash;

            const VALID_MODES = ['religion', 'terrain', 'density', 'precipitation', 'temperature', 'gdp', 'hdi', 'normal'];
            const VALID_FILTERS = ['all', 'muslim', 'christian', 'hindu', 'buddhist', 'jewish', 'other'];
            const VALID_LANGS = ['ar', 'en', 'ru', 'uz', 'es'];

            function loadFromHash() {
                try {
                    const hash = new URLSearchParams(window.location.hash.substring(1));
                    const langVal = hash.get('lang');
                    if (langVal && VALID_LANGS.includes(langVal)) setLanguage(langVal);
                    const modeVal = hash.get('mode');
                    if (modeVal && VALID_MODES.includes(modeVal)) setMode(modeVal);
                    const filterVal = hash.get('filter');
                    if (filterVal && VALID_FILTERS.includes(filterVal)) {
                        currentReligionFilter = filterVal;
                        setActiveByAttr(religionButtons, `.religion-btn[data-religion="${currentReligionFilter}"]`);
                    }
                    // Restore layer flags from hash using registry
                    Object.keys(LAYER_DEFS).forEach(function(name) {
                        var def = LAYER_DEFS[name];
                        // Coords is ON by default — only turn OFF if hash says '0'
                        if (name === 'coords') {
                            if (hash.get('coords') === '0' && def.getFlag()) toggleLayerByName('coords');
                            return;
                        }
                        if (hash.get(def.hashKey) === '1' && !def.getFlag()) {
                            toggleLayerByName(name);
                        }
                    });
                    if (hash.has('bloc')) {
                        const blocVal = hash.get('bloc');
                        const blocSelect = document.getElementById('blocSelect');
                        const blocOpt = Array.from(blocSelect.options).find(function(o) { return o.value === blocVal; });
                        if (blocOpt) {
                            selectedBloc = blocVal;
                            blocSelect.value = blocVal;
                        }
                    }
                    if (hash.get('sec') === 'history') {
                        var eraVal = hash.get('era');
                        var warVal = hash.get('war');
                        var scenVal = hash.get('scen');
                        if (window.applySectionWhenReady) {
                            window.applySectionWhenReady('history', function() {
                                if (eraVal) {
                                    historyTab = 'eras';
                                    historyEraId = eraVal;
                                } else if (warVal && historicalWarsData) {
                                    historyTab = 'wars';
                                    historyWarId = warVal;
                                    var w = historicalWarsData.find(function(x) { return x.id === warVal; });
                                    if (w) historyScenarioId = (scenVal && w.scenarios.some(function(x) { return x.id === scenVal; })) ? scenVal : w.scenarios[0].id;
                                }
                                if (window.renderHistoryBar) window.renderHistoryBar();
                                if (window.drawHistoryScenario) window.drawHistoryScenario(true);
                            });
                        }
                    }
                    if (hash.has('k') && hash.has('x') && hash.has('y')) {
                        const k = +hash.get('k'),
                            x = +hash.get('x'),
                            y = +hash.get('y');
                        if (isFinite(k) && isFinite(x) && isFinite(y) && k >= 0.5 && k <= 12)
                            svg.call(zoomBehavior.transform, d3.zoomIdentity.translate(x, y).scale(k));
                    }
                    updateActiveLayerCount();
                } catch (e) {}
            }

            // ── Share / Reset ──
            function copyCurrentLink() {
                const url = window.location.href.split('#')[0] + window.location.hash;
                navigator.clipboard.writeText(url).then(() => {
                    copyNotification.textContent = t('copySuccess');
                    copyNotification.classList.add('show');
                    setTimeout(() => copyNotification.classList.remove('show'), 2000);
                }).catch(() => {
                    copyNotification.textContent = t('copyFail');
                    copyNotification.classList.add('show');
                    setTimeout(() => copyNotification.classList.remove('show'), 2000);
                });
            }

            function shareMap() {
                const url = window.location.href.split('#')[0] + window.location.hash;
                const modeLabel = t(`mode_${colorMode}`) || colorMode;
                const text = t('shareText', { mode: modeLabel });
                if (navigator.share) {
                    navigator.share({
                        title: t('shareTitle'),
                        text: text,
                        url: url
                    }).catch(() => {});
                } else {
                    copyCurrentLink();
                }
            }

            function resetLayersAndModes() {
                currentReligionFilter = 'all';
                setActiveByAttr(religionButtons, '.religion-btn[data-religion="all"]');
                setMode('religion');
                if (showLabels) toggleLabels();
                if (sectMode) toggleSect();
                if (cbPatternsVisible) toggleColorblind();
                if (corridorsVisible) toggleCorridors();
                if (riversGlaciersVisible) toggleRiversGlaciers();
                if (densitySpotsMode) toggleDensitySpots();
                if (capitalsVisible) toggleCapitals();
                if (timezonesVisible) toggleTimezones();
                if (majorCitiesVisible) toggleMajorCities();
                if (naturalResourcesVisible) toggleNaturalResources();
                if (ethnicGroupsVisible) toggleEthnicGroups();
                if (oceanCurrentsVisible) toggleOceanCurrents();
                if (windsVisible) toggleWinds();
                if (earthquakesVisible) toggleEarthquakes();
                if (volcanoesVisible) toggleVolcanoes();
                if (geopoliticalBlocsVisible) toggleGeopoliticalBlocs();
                if (selectedBloc !== 'all') {
                    selectedBloc = 'all';
                    document.getElementById('blocSelect').value = 'all';
                }
                if (desertsForestsVisible) toggleDesertsForests();
                if (borderDisputesVisible) toggleBorderDisputes();
            }

            function resetAll() {
                resetLayersAndModes();
                if (globeModeActive) toggleGlobeMode();
                if (!coordsVisible) toggleCoords();
                resetZoom();
                selectedCountry = null;
                compareCountry = null;
                highlightSelectedCountry(null);
                closeCountryPanel();
            }

            // ── Keyboard shortcuts ──
            // Shortcuts overlay listeners
            if (shortcutsBtn) {
                shortcutsBtn.addEventListener('click', () => shortcutsOverlay.classList.add('visible'));
            }
            if (shortcutsClose) {
                shortcutsClose.addEventListener('click', () => shortcutsOverlay.classList.remove('visible'));
            }
            if (shortcutsOverlay) {
                shortcutsOverlay.addEventListener('click', function(e) {
                    if (e.target === shortcutsOverlay) shortcutsOverlay.classList.remove('visible');
                });
            }

            // ── Data table overlay listeners ──
            function openDataTable() {
                renderDataTable();
                dataTableOverlay.classList.add('visible');
            }
            function closeDataTable() {
                dataTableOverlay.classList.remove('visible');
            }
            if (dataTableBtn) {
                dataTableBtn.addEventListener('click', openDataTable);
            }
            if (dataTableClose) {
                dataTableClose.addEventListener('click', closeDataTable);
            }
            if (dataTableOverlay) {
                dataTableOverlay.addEventListener('click', function(e) {
                    if (e.target === dataTableOverlay) closeDataTable();
                });
            }
            if (dataTableSearch) {
                dataTableSearch.addEventListener('input', function() {
                    renderDataTable();
                });
            }

            function getTranslatedReligion(key) {
                if (!key) return t('unknown');
                if (lang === 'ar') return religionArabic[key] || key;
                if (lang === 'ru') return religionRussian[key] || key;
                if (lang === 'uz') return religionUzbek[key] || key;
                if (lang === 'es') return religionSpanish[key] || key;
                return key;
            }

            function renderDataTable() {
                if (!dataTableBody) return;
                const searchTerm = dataTableSearch ? dataTableSearch.value.trim().toLowerCase() : '';
                let rows = [];
                countryNamesList.forEach(function(name) {
                    const info = getCountryInfo(name);
                    if (!info) return;
                    const displayName = getDisplayName(name);
                    if (searchTerm && !displayName.toLowerCase().includes(searchTerm)) return;
                    const population = info ? info.population_2026 : null;
                    const area = info ? info.area : null;
                    const density = getDensity(name);
                    const gdp = getGDP(name);
                    const hdi = getHDI(name);
                    const religion = getReligion(name);
                    const continent = getContinent(name);
                    rows.push({
                        name: displayName,
                        continent: continent,
                        population: population,
                        area: area,
                        density: density,
                        gdp: gdp,
                        hdi: hdi,
                        religion: religion,
                        religionLabel: getTranslatedReligion(religion)
                    });
                });
                // Sort: nulls always go to the end
                rows.sort(function(a, b) {
                    let va = a[dataTableSortKey];
                    let vb = b[dataTableSortKey];
                    if (dataTableSortKey === 'name' || dataTableSortKey === 'continent' || dataTableSortKey === 'religion') {
                        va = (va || '').toString();
                        vb = (vb || '').toString();
                        if (!va && !vb) return 0;
                        if (!va) return 1;
                        if (!vb) return -1;
                        const cmp = va.localeCompare(vb, undefined, { sensitivity: 'base' });
                        return dataTableSortAsc ? cmp : -cmp;
                    }
                    // Numeric columns
                    if (va == null && vb == null) return 0;
                    if (va == null) return 1;
                    if (vb == null) return -1;
                    const cmp = va - vb;
                    return dataTableSortAsc ? cmp : -cmp;
                });
                // Build HTML
                let html = '';
                rows.forEach(function(r) {
                    html += '<tr>';
                    html += '<td>' + htmlEscape(r.name) + '</td>';
                    const continentLabel = lang === 'ar' ? (continentArabic[r.continent] || r.continent) : lang === 'ru' ? (continentRussian[r.continent] || r.continent) : lang === 'uz' ? (continentUzbek[r.continent] || r.continent) : lang === 'es' ? (continentSpanish[r.continent] || r.continent) : r.continent;
                    html += '<td>' + htmlEscape(continentLabel) + '</td>';
                    html += '<td>' + (r.population != null ? r.population.toLocaleString('en-US') : t('unknown')) + '</td>';
                    html += '<td>' + (r.area != null ? r.area.toLocaleString('en-US') : t('unknown')) + '</td>';
                    html += '<td>' + (r.density != null ? r.density + ' ' + t('densityUnit') : t('unknown')) + '</td>';
                    html += '<td>' + (r.gdp != null ? '$' + r.gdp.toLocaleString('en-US') : t('unknown')) + '</td>';
                    html += '<td>' + (r.hdi != null ? r.hdi.toFixed(3) : t('unknown')) + '</td>';
                    html += '<td>' + htmlEscape(r.religionLabel) + '</td>';
                    html += '</tr>';
                });
                dataTableBody.innerHTML = html;
                // Update aria-sort on headers
                var headers = dataTableOverlay.querySelectorAll('th[data-sort-key]');
                headers.forEach(function(th) {
                    var key = th.getAttribute('data-sort-key');
                    if (key === dataTableSortKey) {
                        th.setAttribute('aria-sort', dataTableSortAsc ? 'ascending' : 'descending');
                    } else {
                        th.removeAttribute('aria-sort');
                    }
                });
            }

            // Sort click handlers
            if (dataTableOverlay) {
                dataTableOverlay.querySelectorAll('th[data-sort-key]').forEach(function(th) {
                    th.addEventListener('click', function() {
                        var key = th.getAttribute('data-sort-key');
                        if (key === dataTableSortKey) {
                            dataTableSortAsc = !dataTableSortAsc;
                        } else {
                            dataTableSortKey = key;
                            dataTableSortAsc = true;
                        }
                        renderDataTable();
                    });
                });
            }

            // Onboard replay button
            var onboardBtn = document.getElementById('onboardBtn');
            if (onboardBtn) {
                onboardBtn.addEventListener('click', function() {
                    maybeShowProjectionExplainer(true);
                });
            }

            function setupKeyboard() {
                document.addEventListener('keydown', function(e) {
                    if (e.target.tagName === 'INPUT') return;
                    if (quizActive) return;
                    if (layersModal && layersModal.classList.contains('visible')) return;
                    if (divisionPopover && divisionPopover.classList.contains('visible')) return;
                    if (annotationsModal && annotationsModal.classList.contains('visible')) return;
                    if ((e.ctrlKey || e.metaKey || e.altKey) && !(e.ctrlKey && e.code === 'KeyS')) return;
                    const code = e.code;
                    if (code === 'KeyR') setMode('religion');
                    else if (code === 'KeyT') setMode('terrain');
                    else if (code === 'KeyD' && !e.shiftKey) setMode('density');
                    else if (code === 'KeyP') setMode('precipitation');
                    else if (code === 'KeyH') setMode('temperature');
                    else if (code === 'KeyW') setMode('gdp');
                    else if (code === 'KeyI') setMode('hdi');
                    else if (code === 'KeyN' && !e.shiftKey) setMode('normal');
                    else if (code === 'KeyA') toggleCapitals();
                    else if (code === 'KeyZ') toggleTimezones();
                    else if (code === 'KeyL') toggleLabels();
                    else if (code === 'KeyM') toggleMajorCities();
                    else if (code === 'KeyC') toggleCorridors();
                    else if (code === 'KeyB' && !e.shiftKey) toggleDensitySpots();
                    else if (code === 'Slash' || code === 'KeySlash') {
                        // ? key for shortcuts
                        shortcutsOverlay.classList.toggle('visible');
                    }
                    else if (code === 'KeyS' && e.ctrlKey) { e.preventDefault();
                        toggleSect(); } else if (code === 'Digit1') { currentReligionFilter = 'all';
                        updateReligionButtons();
                        updateAllStyles(); } else if (code === 'Digit2') { currentReligionFilter = 'muslim';
                        updateReligionButtons();
                        updateAllStyles(); } else if (code === 'Digit3') { currentReligionFilter = 'christian';
                        updateReligionButtons();
                        updateAllStyles(); } else if (code === 'Digit4') { currentReligionFilter = 'hindu';
                        updateReligionButtons();
                        updateAllStyles(); } else if (code === 'Digit5') { currentReligionFilter = 'buddhist';
                        updateReligionButtons();
                        updateAllStyles(); } else if (code === 'Digit6') { currentReligionFilter = 'jewish';
                        updateReligionButtons();
                        updateAllStyles(); } else if (code === 'Digit7') { currentReligionFilter = 'other';
                        updateReligionButtons();
                        updateAllStyles();                         } else if (code === 'Escape') {
                            if (dataTableOverlay && dataTableOverlay.classList.contains('visible')) {
                                closeDataTable();
                            } else if (shortcutsOverlay.classList.contains('visible')) {
                                shortcutsOverlay.classList.remove('visible');
                            } else {
                                resetBtn.click();
                            }
                        } else if (code ===
                        'Equal' || code === 'NumpadAdd') { svg.transition().duration(prefersReducedMotion() ? 0 : 300).ease(d3.easeCubicOut).call(zoomBehavior
                        .scaleBy, 1.35); } else if (code === 'Minus' || code === 'NumpadSubtract') { svg
                        .transition().duration(prefersReducedMotion() ? 0 : 300).ease(d3.easeCubicOut).call(zoomBehavior.scaleBy, 0.74); }
                        // ── New layer shortcuts (Shift+letter for less frequent layers) ──
                        else if (code === 'KeyE') toggleEarthquakes();
                        else if (code === 'KeyV') toggleVolcanoes();
                        else if (code === 'KeyO') toggleOceanCurrents();
                        else if (code === 'KeyG') toggleGeopoliticalBlocs();
                        else if (code === 'KeyY') toggleEthnicGroups();
                        else if (code === 'KeyN' && e.shiftKey) toggleNaturalResources();
                        else if (code === 'KeyD' && e.shiftKey) toggleDesertsForests();
                        else if (code === 'KeyB' && e.shiftKey) toggleBorderDisputes();
                });
            }

            // ── Religion button state ──
            function updateReligionButtons() {
                setActiveByAttr(religionButtons, `.religion-btn[data-religion="${currentReligionFilter}"]`);
            }

            // ── init() ──
            async function init() {
                isMobile = window.innerWidth < 768;

                // Unified dock silhouette: measure the 4-buttons section and
                // build an SVG path mask (data URI) so the stepped shape —
                // with the concave fillet at the junction — is cut out of the
                // shared container exactly where the two sections meet.
                function syncDockMask() {
                    var g = document.querySelector('.stepped-dock-group');
                    var f = document.getElementById('filterRow');
                    if (!g || !f) return;
                    var W = g.offsetWidth;
                    var H = g.offsetHeight;
                    if (window.innerWidth < 1024 || W === 0 || H === 0) {
                        g.style.webkitMaskImage = 'none';
                        g.style.maskImage = 'none';
                        return;
                    }
                    var gr = g.getBoundingClientRect();
                    var fr = f.getBoundingClientRect();
                    var rtl = getComputedStyle(g).direction === 'rtl';
                    var jx = Math.round((rtl ? fr.right : fr.left) - gr.left);
                    // Resolve the fluid --dock-radius token (clamp()/vw) to
                    // its computed pixel value via the group's own radius,
                    // so the mask arcs always match the CSS corners.
                    var R = parseFloat(getComputedStyle(g).borderBottomLeftRadius) || 12;
                    var B = 1 + f.offsetHeight;
                    var p;
                    if (rtl) {
                        // RTL: the dock anchors flush to the top-right viewport
                        // boundary — the bottom-start (physical bottom-right)
                        // corner stays SHARP, no arc, so the silhouette sits
                        // flush against the screen edge.
                        p = 'M0 0 H' + W + ' V' + H +
                            ' H' + jx + ' V' + (B + R) +
                            ' A' + R + ' ' + R + ' 0 0 0 ' + (jx - R) + ' ' + B +
                            ' H' + R +
                            ' A' + R + ' ' + R + ' 0 0 1 0 ' + (B - R) +
                            ' V0 Z';
                    } else {
                        p = 'M0 0 H' + W + ' V' + (B - R) +
                            ' A' + R + ' ' + R + ' 0 0 0 ' + (W - R) + ' ' + B +
                            ' H' + (jx + R) +
                            ' A' + R + ' ' + R + ' 0 0 0 ' + jx + ' ' + (B + R) +
                            ' V' + H + ' H' + R +
                            ' A' + R + ' ' + R + ' 0 0 1 0 ' + (H - R) +
                            ' V0 Z';
                    }
                    var uri = 'url("data:image/svg+xml;utf8,' + encodeURIComponent(
                        '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 ' +
                        W + ' ' + H + '"><path d="' + p + '" fill="white"/></svg>') + '")';
                    g.style.webkitMaskImage = uri;
                    g.style.maskImage = uri;
                }
                if (!window.__dockMaskSynced && typeof ResizeObserver !== 'undefined') {
                    var dockGroupEl = document.querySelector('.stepped-dock-group');
                    var filterRowEl = document.getElementById('filterRow');
                    if (dockGroupEl && filterRowEl) {
                        var dockRO = new ResizeObserver(syncDockMask);
                        dockRO.observe(dockGroupEl);
                        dockRO.observe(filterRowEl);
                        window.__dockMaskSynced = true;
                        syncDockMask();
                    }
                }

                // Patch name_ru onto features from lookup maps
                if (typeof featureRussian !== 'undefined') {
                    corridorsData.forEach(function(d) { d.name_ru = d.name_ru || featureRussian.corridors[d.name_en]; });
                    mountainRanges.forEach(function(d) { d.name_ru = d.name_ru || featureRussian.mountains[d.name_en]; });
                    rivers.forEach(function(d) { d.name_ru = d.name_ru || featureRussian.rivers[d.name_en]; });
                    naturalResourcesData.forEach(function(d) { d.name_ru = d.name_ru || featureRussian.resources[d.name_en]; });
                    ethnicGroupsData.forEach(function(d) { d.name_ru = d.name_ru || featureRussian.ethnicGroups[d.name_en]; });
                    oceanCurrentsData.forEach(function(d) { d.name_ru = d.name_ru || featureRussian.currents[d.name_en]; });
                    windsData.forEach(function(d) { d.name_ru = d.name_ru || featureRussian.winds[d.name_en]; });
                    earthquakesData.forEach(function(d) { d.name_ru = d.name_ru || featureRussian.earthquakes[d.name_en]; });
                    volcanoesData.forEach(function(d) { d.name_ru = d.name_ru || featureRussian.volcanoes[d.name_en]; });
                    tectonicPlatesData.forEach(function(d) { d.name_ru = d.name_ru || featureRussian.plates[d.name_en]; });
                    desertsForestsData.forEach(function(d) { d.name_ru = d.name_ru || featureRussian.deserts[d.name_en]; });
                    borderDisputesData.forEach(function(d) { d.name_ru = d.name_ru || featureRussian.disputes[d.name_en]; });
                }
                if (typeof featureUzbek !== 'undefined') {
                    corridorsData.forEach(function(d) { d.name_uz = d.name_uz || featureUzbek.corridors[d.name_en]; });
                    mountainRanges.forEach(function(d) { d.name_uz = d.name_uz || featureUzbek.mountains[d.name_en]; });
                    rivers.forEach(function(d) { d.name_uz = d.name_uz || featureUzbek.rivers[d.name_en]; });
                    naturalResourcesData.forEach(function(d) { d.name_uz = d.name_uz || featureUzbek.resources[d.name_en]; });
                    ethnicGroupsData.forEach(function(d) { d.name_uz = d.name_uz || featureUzbek.ethnicGroups[d.name_en]; });
                    oceanCurrentsData.forEach(function(d) { d.name_uz = d.name_uz || featureUzbek.currents[d.name_en]; });
                    windsData.forEach(function(d) { d.name_uz = d.name_uz || featureUzbek.winds[d.name_en]; });
                    earthquakesData.forEach(function(d) { d.name_uz = d.name_uz || featureUzbek.earthquakes[d.name_en]; });
                    volcanoesData.forEach(function(d) { d.name_uz = d.name_uz || featureUzbek.volcanoes[d.name_en]; });
                    tectonicPlatesData.forEach(function(d) { d.name_uz = d.name_uz || featureUzbek.plates[d.name_en]; });
                    desertsForestsData.forEach(function(d) { d.name_uz = d.name_uz || featureUzbek.deserts[d.name_en]; });
                    borderDisputesData.forEach(function(d) { d.name_uz = d.name_uz || featureUzbek.disputes[d.name_en]; });
                    if (featureUzbek.earthquakePlates) {
                        earthquakesData.forEach(function(d) { d.plate_uz = d.plate_uz || featureUzbek.earthquakePlates[d.plate_en]; });
                    }
                    if (featureUzbek.volcanoTypes) {
                        volcanoesData.forEach(function(d) { d.type_uz = d.type_uz || featureUzbek.volcanoTypes[d.type_en]; });
                    }
                    if (featureUzbek.countries) {
                        var cMap = featureUzbek.countries;
                        var translateCountries = function(str) {
                            if (!str) return str;
                            return str.split(',').map(function(s) { return (cMap[s.trim()] || s.trim()); }).join(', ');
                        };
                        earthquakesData.forEach(function(d) { d.description_uz = d.description_uz || d.description_en; });
                        volcanoesData.forEach(function(d) { d.description_uz = d.description_uz || d.description_en; });
                        naturalResourcesData.forEach(function(d) { d.countries_uz = d.countries_uz || translateCountries(d.countries_en); d.description_uz = d.description_uz || d.description_en; });
                        ethnicGroupsData.forEach(function(d) {
                            d.countries_uz = d.countries_uz || translateCountries(d.countries_en);
                            d.description_uz = d.description_uz || d.description_en;
                        });
                        mountainRanges.forEach(function(d) { d.countries_uz = d.countries_uz || translateCountries(d.countries_en); d.description_uz = d.description_uz || d.description_en; });
                        rivers.forEach(function(d) { d.countries_uz = d.countries_uz || translateCountries(d.countries_en); d.description_uz = d.description_uz || d.description_en; });
                        desertsForestsData.forEach(function(d) { d.countries_uz = d.countries_uz || translateCountries(d.countries_en); d.description_uz = d.description_uz || d.description_en; });
                        additionalWaterwaysData.forEach(function(d) { d.countries_uz = d.countries_uz || translateCountries(d.countries_en); });
                    }
                    if (featureUzbek.biomes) {
                        desertsForestsData.forEach(function(d) { d.biome_uz = d.biome_uz || featureUzbek.biomes[d.biome_en]; d.description_uz = d.description_uz || d.description_en; });
                    }
                    if (featureUzbek.ethnicPopulation) {
                        ethnicGroupsData.forEach(function(d) { d.population_uz = d.population_uz || featureUzbek.ethnicPopulation[d.population_en]; });
                    }
                    if (featureUzbek.ethnicLanguages) {
                        ethnicGroupsData.forEach(function(d) { d.language_uz = d.language_uz || featureUzbek.ethnicLanguages[d.language_en]; });
                    }
                    if (featureUzbek.ethnicReligions) {
                        ethnicGroupsData.forEach(function(d) { d.religion_uz = d.religion_uz || featureUzbek.ethnicReligions[d.religion_en]; });
                    }
                    if (featureUzbek.riverSources) {
                        rivers.forEach(function(d) { d.source_uz = d.source_uz || featureUzbek.riverSources[d.source_en]; });
                    }
                    if (featureUzbek.riverMouths) {
                        rivers.forEach(function(d) { d.mouth_uz = d.mouth_uz || featureUzbek.riverMouths[d.mouth_en]; });
                    }
                    if (featureUzbek.mountainPeaks) {
                        mountainRanges.forEach(function(d) { d.highestPeak_uz = d.highestPeak_uz || featureUzbek.mountainPeaks[d.highestPeak_en]; });
                    }
                    if (featureUzbek.disputeCauses) {
                        borderDisputesData.forEach(function(d) { d.causes_uz = d.causes_uz || d.causes_en; });
                    }
                    if (featureUzbek.oceanCurrentDescriptions) {
                        oceanCurrentsData.forEach(function(d) { d.description_uz = d.description_uz || featureUzbek.oceanCurrentDescriptions[d.description_en] || d.description_en; });
                    }
                    if (featureUzbek.resourceDescriptions) {
                        naturalResourcesData.forEach(function(d) { d.description_uz = d.description_uz || featureUzbek.resourceDescriptions[d.description_en] || d.description_en; });
                    }
                    oceanCurrentsData.forEach(function(d) { d.description_uz = d.description_uz || d.description_en; });
                    windsData.forEach(function(d) { d.description_uz = d.description_uz || d.description_en; });
                    borderDisputesData.forEach(function(d) { d.causes_uz = d.causes_uz || d.causes_en; });
                }
                if (typeof featureSpanish !== 'undefined') {
                    corridorsData.forEach(function(d) { d.name_es = d.name_es || featureSpanish.corridors[d.name_en]; });
                    mountainRanges.forEach(function(d) { d.name_es = d.name_es || featureSpanish.mountains[d.name_en]; });
                    rivers.forEach(function(d) { d.name_es = d.name_es || featureSpanish.rivers[d.name_en]; });
                    naturalResourcesData.forEach(function(d) { d.name_es = d.name_es || featureSpanish.resources[d.name_en]; });
                    ethnicGroupsData.forEach(function(d) { d.name_es = d.name_es || featureSpanish.ethnicGroups[d.name_en]; });
                    oceanCurrentsData.forEach(function(d) { d.name_es = d.name_es || featureSpanish.currents[d.name_en]; });
                    windsData.forEach(function(d) { d.name_es = d.name_es || featureSpanish.winds[d.name_en]; });
                    earthquakesData.forEach(function(d) { d.name_es = d.name_es || featureSpanish.earthquakes[d.name_en]; });
                    volcanoesData.forEach(function(d) { d.name_es = d.name_es || featureSpanish.volcanoes[d.name_en]; });
                    tectonicPlatesData.forEach(function(d) { d.name_es = d.name_es || featureSpanish.plates[d.name_en]; });
                    desertsForestsData.forEach(function(d) { d.name_es = d.name_es || featureSpanish.deserts[d.name_en]; });
                    borderDisputesData.forEach(function(d) { d.name_es = d.name_es || featureSpanish.disputes[d.name_en]; });
                    if (featureSpanish.earthquakePlates) {
                        earthquakesData.forEach(function(d) { d.plate_es = d.plate_es || featureSpanish.earthquakePlates[d.plate_en]; });
                    }
                    if (featureSpanish.volcanoTypes) {
                        volcanoesData.forEach(function(d) { d.type_es = d.type_es || featureSpanish.volcanoTypes[d.type_en]; });
                    }
                    if (featureSpanish.countries) {
                        var cMapEs = featureSpanish.countries;
                        var translateCountriesEs = function(str) {
                            if (!str) return str;
                            return str.split(',').map(function(s) { return (cMapEs[s.trim()] || s.trim()); }).join(', ');
                        };
                        if (featureSpanish.earthquakeDescriptions) {
                            earthquakesData.forEach(function(d) { d.description_es = d.description_es || featureSpanish.earthquakeDescriptions[d.description_en] || d.description_en; });
                        }
                        if (featureSpanish.volcanoDescriptions) {
                            volcanoesData.forEach(function(d) { d.description_es = d.description_es || featureSpanish.volcanoDescriptions[d.description_en] || d.description_en; });
                        }
                        if (featureSpanish.desertForestDescriptions) {
                            desertsForestsData.forEach(function(d) { d.description_es = d.description_es || featureSpanish.desertForestDescriptions[d.description_en] || d.description_en; });
                        }
                        naturalResourcesData.forEach(function(d) { d.countries_es = d.countries_es || translateCountriesEs(d.countries_en); d.description_es = d.description_es || d.description_en; });
                        ethnicGroupsData.forEach(function(d) {
                            d.countries_es = d.countries_es || translateCountriesEs(d.countries_en);
                            d.description_es = d.description_es || d.description_en;
                        });
                        mountainRanges.forEach(function(d) { d.countries_es = d.countries_es || translateCountriesEs(d.countries_en); d.description_es = d.description_es || d.description_en; });
                        rivers.forEach(function(d) { d.countries_es = d.countries_es || translateCountriesEs(d.countries_en); d.description_es = d.description_es || d.description_en; });
                        desertsForestsData.forEach(function(d) { d.countries_es = d.countries_es || translateCountriesEs(d.countries_en); d.description_es = d.description_es || d.description_en; });
                        borderDisputesData.forEach(function(d) { d.countries_es = d.countries_es || translateCountriesEs(d.countries_en); });
                        additionalWaterwaysData.forEach(function(d) { d.countries_es = d.countries_es || translateCountriesEs(d.countries_en); });
                    }
                    if (featureSpanish.biomes) {
                        desertsForestsData.forEach(function(d) { d.biome_es = d.biome_es || featureSpanish.biomes[d.biome_en]; });
                    }
                    if (featureSpanish.ethnicPopulation) {
                        ethnicGroupsData.forEach(function(d) { d.population_es = d.population_es || featureSpanish.ethnicPopulation[d.population_en]; });
                    }
                    if (featureSpanish.ethnicLanguages) {
                        ethnicGroupsData.forEach(function(d) { d.language_es = d.language_es || featureSpanish.ethnicLanguages[d.language_en]; });
                    }
                    if (featureSpanish.ethnicReligions) {
                        ethnicGroupsData.forEach(function(d) { d.religion_es = d.religion_es || featureSpanish.ethnicReligions[d.religion_en]; });
                    }
                    if (featureSpanish.riverSources) {
                        rivers.forEach(function(d) { d.source_es = d.source_es || featureSpanish.riverSources[d.source_en]; });
                    }
                    if (featureSpanish.riverMouths) {
                        rivers.forEach(function(d) { d.mouth_es = d.mouth_es || featureSpanish.riverMouths[d.mouth_en]; });
                    }
                    if (featureSpanish.mountainPeaks) {
                        mountainRanges.forEach(function(d) { d.highestPeak_es = d.highestPeak_es || featureSpanish.mountainPeaks[d.highestPeak_en]; });
                    }
                    if (featureSpanish.causeTranslations) {
                        borderDisputesData.forEach(function(d) { d.causes_es = d.causes_es || featureSpanish.causeTranslations[d.causes_en] || d.causes_en; });
                    }
                    if (featureSpanish.oceanCurrentDescriptions) {
                        oceanCurrentsData.forEach(function(d) { d.description_es = d.description_es || featureSpanish.oceanCurrentDescriptions[d.description_en] || d.description_en; });
                    }
                    if (featureSpanish.resourceDescriptions) {
                        naturalResourcesData.forEach(function(d) { d.description_es = d.description_es || featureSpanish.resourceDescriptions[d.description_en] || d.description_en; });
                    }
                    oceanCurrentsData.forEach(function(d) { d.description_es = d.description_es || d.description_en; });
                    windsData.forEach(function(d) { d.description_es = d.description_es || d.description_en; });
                }
                if (typeof densitySpotEnglish !== 'undefined') {
                    densitySpots.forEach(function(d) { d.name_en = densitySpotEnglish[d.name]; d.name_ru = densitySpotRussian[d.name]; d.name_uz = densitySpotUzbek[d.name]; d.name_es = densitySpotSpanish[d.name]; });
                    majorCitiesData.forEach(function(d) { d.name_en = d.name_en || densitySpotEnglish[d.name]; d.name_ru = d.name_ru || densitySpotRussian[d.name]; d.name_uz = d.name_uz || densitySpotUzbek[d.name]; d.name_es = d.name_es || densitySpotSpanish[d.name]; });
                }
                if (typeof capitalsRussian !== 'undefined') {
                    Object.keys(countryInfo).forEach(function(c) {
                        var info = countryInfo[c];
                        info.capital_ru = info.capital_ru || capitalsRussian[info.capital_en];
                        info.lang_ru = info.lang_ru || langsRussian[info.lang_en];
                    });
                }
                if (typeof capitalsUzbek !== 'undefined') {
                    Object.keys(countryInfo).forEach(function(c) {
                        var info = countryInfo[c];
                        info.capital_uz = info.capital_uz || capitalsUzbek[info.capital_en];
                        info.lang_uz = info.lang_uz || langsUzbek[info.lang_en];
                    });
                }
                if (typeof capitalsSpanish !== 'undefined') {
                    Object.keys(countryInfo).forEach(function(c) {
                        var info = countryInfo[c];
                        info.capital_es = info.capital_es || capitalsSpanish[info.capital_en];
                        info.lang_es = info.lang_es || langsSpanish[info.lang_en];
                    });
                }
                if (typeof featureRussian !== 'undefined' && featureRussian.blocs) {
                    geopoliticalBlocsData.forEach(function(b) { b.name_ru = b.name_ru || featureRussian.blocs[b.name_en]; b.members_ru = b.members_ru || b.members_en; });
                }
                if (typeof featureUzbek !== 'undefined' && featureUzbek.blocs) {
                    geopoliticalBlocsData.forEach(function(b) { b.name_uz = b.name_uz || featureUzbek.blocs[b.name_en]; b.members_uz = b.members_uz || b.members_en; });
                }
                if (typeof featureSpanish !== 'undefined' && featureSpanish.blocs) {
                    geopoliticalBlocsData.forEach(function(b) { b.name_es = b.name_es || featureSpanish.blocs[b.name_en]; b.members_es = b.members_es || b.members_en; });
                }

                if (typeof lucide !== 'undefined' && lucide.createIcons) {
                    lucide.createIcons();
                }
                createSvg();
                if (typeof window.syncOceanBackground === 'function') {
                    window.syncOceanBackground();
                }
                initDensityCanvas();
                setupZoom();
                drawGraticule();
                drawIceCap();
                setupSearch();
                setupKeyboard();

                const loadingMsg = document.createElement('div');
                loadingMsg.style.cssText =
                    'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:1em;z-index:5;background:rgba(0,0,0,0.55);padding:16px 28px;border-radius:16px;display:flex;flex-direction:column;align-items:center;gap:10px;backdrop-filter:blur(6px);';
                const spinner = document.createElement('div');
                spinner.style.cssText = 'width:36px;height:36px;border:3px solid rgba(255,255,255,0.2);border-top-color:#80c8ff;border-radius:50%;animation:spin 0.8s linear infinite;';
                const spinStyle = document.createElement('style');
                spinStyle.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
                const loadText = document.createElement('span');
                loadText.textContent = t('loadingMap');
                loadingMsg.appendChild(spinner);
                loadingMsg.appendChild(loadText);
                loadingMsg.appendChild(spinStyle);
                mapContainer.appendChild(loadingMsg);

                let features;
                try {
                    features = await loadWorld();
                } catch (err) {
                    loadingMsg.remove();
                    const errorBox = document.createElement('div');
                    errorBox.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:0.95em;z-index:5;background:rgba(20,20,25,0.95);padding:24px 28px;border-radius:16px;display:flex;flex-direction:column;align-items:center;gap:12px;max-width:320px;text-align:center;border:1px solid rgba(255,90,90,0.4);box-shadow:0 8px 32px rgba(0,0,0,0.5);';
                    const errorIcon = document.createElement('div');
                    errorIcon.style.cssText = 'font-size:2em;';
                    errorIcon.textContent = '⚠️';
                    const errorText = document.createElement('div');
                    errorText.textContent = t('errorLoadingMap');
                    const retryBtn = document.createElement('button');
                    retryBtn.textContent = t('retryBtn');
                    retryBtn.style.cssText = 'padding:8px 20px;border-radius:20px;border:1px solid rgba(255,255,255,0.3);background:#2a3a58;color:#9dd0ff;cursor:pointer;font-size:1em;font-family:inherit;';
                    retryBtn.addEventListener('click', function() { location.reload(); });
                    errorBox.appendChild(errorIcon);
                    errorBox.appendChild(errorText);
                    errorBox.appendChild(retryBtn);
                    mapContainer.appendChild(errorBox);
                    return;
                }
                loadingMsg.remove();

                renderCountries(features);
                // New session starts with a blank annotation canvas; the
                // previous session stays stored for explicit restore.
                annotationsList = [];
                try {
                    var savedColor = localStorage.getItem('annotateColor');
                    if (savedColor && /^#[0-9a-f]{6}$/i.test(savedColor)) annotateColor = savedColor;
                    var savedFont = localStorage.getItem('annotateFontSize');
                    if (savedFont && ANNOT_FONT_LEVELS.indexOf(_annotNormalizeSize(savedFont)) !== -1) annotateFontSize = _annotNormalizeSize(savedFont);
                } catch (e) {}
                try { redrawAnnotations(); } catch (e) { console.error('annotation draw error:', e); }
                ensureAdminNameTranslationsLoaded();
                try { loadFromHash(); } catch(e) {}
                try { applyLanguage(); } catch(e) { console.error('applyLanguage error:', e); }
                try { updateHash(); } catch(e) {}

                mapContainer.addEventListener('mousemove', updateCoordinatesDisplay);

                // Click-outside to close country panel
                // Guard: if the panel was just (re)rendered within the last 50ms (inside the
                // same click bubble phase), skip the contains check — the target may have been
                // a child element detached by innerHTML replacement mid-propagation.
                mapContainer.addEventListener('click', function(e) {
                    if (countryPanel.style.display === 'block' &&
                        !countryPanel.contains(e.target) &&
                        (performance.now() - _lastPanelRenderTime) > 50) {
                        closeCountryPanel();
                    }
                });
                mapContainer.addEventListener('click', function(e) {
                    if (!majorCitiesVisible) return;
                    const rect = getMapRect();
                    const clickX = e.clientX - rect.left;
                    const clickY = e.clientY - rect.top;
                    const k = Math.max(0.4, currentTransform.k);
                    const tx = currentTransform.x;
                    const ty = currentTransform.y;
                    const hitRadius = (_isZooming && _frozenCitySize !== null ? _frozenCitySize : Math.max(5, Math.min(18, (isMobile ? 8 : 10) * Math.pow(k, 0.4)))) + 6;
                    let closest = null;
                    let closestDist = hitRadius;
                    majorCitiesData.forEach(function(city) {
                        if (globeModeActive && !isPointVisibleOnGlobe(city.coords)) return;
                        const [x, y] = getActiveProjection()(city.coords);
                        if (isNaN(x) || isNaN(y)) return;
                        const sx = x * k + tx;
                        const sy = y * k + ty;
                        const dist = Math.sqrt((clickX - sx) ** 2 + (clickY - sy) ** 2);
                        if (dist < closestDist) {
                            closestDist = dist;
                            closest = city;
                        }
                    });
                    if (closest) {
                        e.stopPropagation();
                        showCityDetail(closest);
                    }
                }, true);

                // First-run onboarding hint (once per session)
                if (!sessionStorage.getItem('map_onboarded')) {
                    onboardingHint.style.display = 'block';
                    setTimeout(() => {
                        onboardingHint.classList.add('fade-out');
                        setTimeout(() => {
                            onboardingHint.style.display = 'none';
                        }, 600);
                    }, 5000);
                    sessionStorage.setItem('map_onboarded', '1');
                } else {
                    onboardingHint.style.display = 'none';
                }

                // ── Interactive Onboarding Tutorial ──
                (function() {
                    var overlay = document.getElementById('onboardOverlay');
                    var glow = document.getElementById('onboardGlow');
                    var card = document.getElementById('onboardCard');
                    var cardIcon = document.getElementById('onboardCardIcon');
                    var cardTitle = document.getElementById('onboardCardTitle');
                    var cardText = document.getElementById('onboardCardText');
                    var cardDots = document.getElementById('onboardCardDots');
                    var skipBtn = document.getElementById('onboardSkip');
                    var nextBtn = document.getElementById('onboardNext');
                    if (!overlay || !glow || !card) return;

                    var steps = [
                        { getEl: function() {
                            var mb = window.innerWidth <= 768;
                            return document.querySelector(mb ? '#mobileSearchInput' : '.search-box');
                        }, icon: '🔍', titleKey: 'onboardStep1Title', textKey: 'onboardStep1Text' },
                        { getEl: function() {
                            var mb = window.innerWidth <= 768;
                            return document.querySelector(mb ? '#mobileLangToggle' : '#langToggle');
                        }, icon: '🌐', titleKey: 'onboardStep2Title', textKey: 'onboardStep2Text' },
                        { getEl: function() {
                            var mb = window.innerWidth <= 768;
                            if (mb) return document.querySelector('#mobileToolsBtn');
                            var first = document.querySelector('#toolsBtn');
                            var last = document.querySelector('#toolsBtn');
                            if (!first || !last) return null;
                            var r1 = first.getBoundingClientRect();
                            var r2 = last.getBoundingClientRect();
                            var t = document.getElementById('onboardToolZone');
                            if (!t) { t = document.createElement('div'); t.id = 'onboardToolZone'; t.style.cssText = 'position:fixed;pointer-events:none;z-index:-1;'; document.body.appendChild(t); }
                            var l = Math.min(r1.left, r2.left);
                            var tp = Math.min(r1.top, r2.top);
                            var w = Math.max(r1.right, r2.right) - l;
                            var h = Math.max(r1.bottom, r2.bottom) - tp;
                            t.style.left = l + 'px'; t.style.top = tp + 'px'; t.style.width = w + 'px'; t.style.height = h + 'px';
                            return t;
                        }, icon: '🔧', titleKey: 'onboardStep3Title', textKey: 'onboardStep3Text' },
                        { getEl: function() {
                            var mb = window.innerWidth <= 768;
                            return document.querySelector(mb ? '#mobileModeBtn' : '#modeButtons');
                        }, icon: '🎨', titleKey: 'onboardStep4Title', textKey: 'onboardStep4Text' },
                        { getEl: function() {
                            var mb = window.innerWidth <= 768;
                            if (mb) return document.querySelector('#mobileModeBtn');
                            return document.querySelector('#barDivisionBtn') || document.querySelector('#filterRow');
                        }, icon: '🎯', titleKey: 'onboardStep5Title', textKey: 'onboardStep5Text' },
                        { getEl: function() {
                            var mb = window.innerWidth <= 768;
                            if (mb) return document.querySelector('#mobileLayersBtn');
                            return document.querySelector('#barLayersBtn') || document.querySelector('#layersToggleBtn');
                        }, icon: '🗂️', titleKey: 'onboardStep6Title', textKey: 'onboardStep6Text' },
                        { getEl: function() {
                            var lg = document.querySelector('#legend');
                            if (lg && lg.innerHTML.trim().length > 5) return lg;
                            return document.querySelector('#mapSvg');
                        }, icon: '📋', titleKey: 'onboardStep7Title', textKey: 'onboardStep7Text' },
                        { getEl: function() { return document.querySelector('.zoom-controls'); }, icon: '🔍', titleKey: 'onboardStep8Title', textKey: 'onboardStep8Text' },
                        { getEl: function() {
                            var cp = document.querySelector('.country-panel');
                            if (cp && getComputedStyle(cp).display !== 'none') return cp;
                            return document.querySelector('#mapSvg');
                        }, icon: '🌍', titleKey: 'onboardStep9Title', textKey: 'onboardStep9Text' },
                        { getEl: function() {
                            var mb = window.innerWidth <= 768;
                            return document.querySelector(mb ? '#mobileToolsBtn' : '#quizBtn');
                        }, icon: '🎯', titleKey: 'onboardStep10Title', textKey: 'onboardStep10Text' },
                        { getEl: function() {
                            var mb = window.innerWidth <= 768;
                            return document.querySelector(mb ? '#mobileToolsBtn' : '#globeViewBtn');
                        }, icon: '🌏', titleKey: 'onboardStep11Title', textKey: 'onboardStep11Text' },
                        { getEl: function() {
                            var mb = window.innerWidth <= 768;
                            return document.querySelector(mb ? '#mobileToolsBtn' : '#compareProjectionsBtn');
                        }, icon: '📐', titleKey: 'onboardStep12Title', textKey: 'onboardStep12Text' },
                        { getEl: function() {
                            var mb = window.innerWidth <= 768;
                            return document.querySelector(mb ? '#mobileToolsBtn' : '#annotateBtn');
                        }, icon: '✏️', titleKey: 'onboardStep13Title', textKey: 'onboardStep13Text' }
                    ];
                    var currentStep = 0;
                    var isOpen = false;

                    function positionGlow(el) {
                        if (!el) return;
                        var r = el.getBoundingClientRect();
                        var pad = 8;
                        glow.style.left = (r.left - pad) + 'px';
                        glow.style.top = (r.top - pad) + 'px';
                        glow.style.width = (r.width + pad * 2) + 'px';
                        glow.style.height = (r.height + pad * 2) + 'px';
                    }

                    function positionCard(el) {
                        if (!el) return;
                        var r = el.getBoundingClientRect();
                        var cw = card.offsetWidth || 300;
                        var ch = card.offsetHeight || 200;
                        var vw = window.innerWidth;
                        var vh = window.innerHeight;
                        var left, top;
                        // Try below first
                        top = r.bottom + 14;
                        left = r.left + r.width / 2 - cw / 2;
                        // If below goes off screen, try above
                        if (top + ch > vh - 10) {
                            top = r.top - ch - 14;
                        }
                        // If above goes off screen, put at center
                        if (top < 10) {
                            top = vh / 2 - ch / 2;
                            left = vw / 2 - cw / 2;
                        }
                        // Clamp horizontal
                        if (left < 10) left = 10;
                        if (left + cw > vw - 10) left = vw - cw - 10;
                        card.style.left = left + 'px';
                        card.style.top = top + 'px';
                    }

                    function renderStep() {
                        var step = steps[currentStep];
                        var el = step.getEl ? step.getEl() : null;
                        if (el) {
                            glow.style.display = '';
                            card.style.transform = '';
                        } else {
                            glow.style.display = 'none';
                            card.style.left = '50%';
                            card.style.top = '50%';
                            card.style.transform = 'translate(-50%,-50%)';
                        }
                        cardIcon.textContent = step.icon;
                        cardTitle.textContent = t(step.titleKey);
                        cardText.textContent = t(step.textKey);
                        // Dots
                        cardDots.innerHTML = '';
                        steps.forEach(function(_, i) {
                            var dot = document.createElement('span');
                            dot.className = 'onboard-dot' + (i === currentStep ? ' active' : '');
                            cardDots.appendChild(dot);
                        });
                        // Button labels
                        skipBtn.textContent = t('onboardSkip');
                        if (currentStep === steps.length - 1) {
                            nextBtn.textContent = t('onboardFinish');
                        } else {
                            nextBtn.textContent = t('onboardNext');
                        }
                        // RTL arrow adjustment
                        if (lang === 'ar') {
                            nextBtn.textContent = nextBtn.textContent.replace('←', '→');
                        } else {
                            nextBtn.textContent = nextBtn.textContent.replace('→', '→');
                        }
                        if (el) {
                            positionGlow(el);
                            positionCard(el);
                        }
                    }

                    function nextStep() {
                        currentStep++;
                        if (currentStep >= steps.length) { closeTutorial(); return; }
                        card.style.animation = 'none';
                        card.offsetHeight;
                        card.style.animation = 'onboardCardIn 0.35s ease both';
                        renderStep();
                    }

                    function closeTutorial() {
                        overlay.classList.remove('active');
                        isOpen = false;
                        glow.style.width = '0';
                        glow.style.height = '0';
                        glow.style.opacity = '0';
                        try { localStorage.setItem('onboardDone', '1'); } catch(e) {}
                    }

                    function openTutorial() {
                        currentStep = 0;
                        overlay.classList.add('active');
                        isOpen = true;
                        glow.style.opacity = '1';
                        renderStep();
                    }

                    skipBtn.addEventListener('click', function() {
                        if (annotationTutorialActive) { closeAnnotationTutorial(); return; }
                        closeTutorial();
                    });
                    nextBtn.addEventListener('click', function() {
                        if (annotationTutorialActive) { nextAnnotateStep(); return; }
                        nextStep();
                    });
                    overlay.addEventListener('click', function(e) {
                        if (e.target === overlay) {
                            if (annotationTutorialActive) closeAnnotationTutorial();
                            closeTutorial();
                        }
                    });

                    // Expose for replay button
                    window.startOnboarding = openTutorial;

                    // Auto-show on first visit
                    var alreadyDone = false;
                    try { alreadyDone = localStorage.getItem('onboardDone') === '1'; } catch(e) {}
                    if (!alreadyDone) {
                        setTimeout(openTutorial, 800);
                    }

                    // Reposition on resize
                    window.addEventListener('resize', function() {
                        if (isOpen && steps[currentStep]) {
                            var el = steps[currentStep].getEl ? steps[currentStep].getEl() : null;
                            if (el) { positionGlow(el); positionCard(el); }
                        }
                    });

                    // ── Annotation Tutorial (first time annotation mode is entered) ──
                    var annotationTutorialActive = false;
                    var annotateStep = 0;
                    var annotateSteps = [
                        { el: function() { return document.getElementById('annotateBtn'); }, textKey: 'annotationTutorialIntro' },
                        { el: function() { return document.getElementById('annotationKindRegion'); }, textKey: 'annotationTutorialRegion' },
                        { el: function() { return document.getElementById('annotationKindDraw'); }, textKey: 'annotationTutorialDraw' },
                        { el: function() { return document.getElementById('annotationManageBtn'); }, textKey: 'annotationTutorialManage' },
                        { el: function() { return document.getElementById('annotationKindPin'); }, textKey: 'annotationTutorialPin' }
                    ];

                    function renderAnnotateStep() {
                        var step = annotateSteps[annotateStep];
                        cardIcon.textContent = '📝';
                        cardTitle.textContent = t('annotationTutorialTitle');
                        cardText.textContent = t(step.textKey);
                        cardDots.innerHTML = '';
                        annotateSteps.forEach(function(_, i) {
                            var dot = document.createElement('span');
                            dot.className = 'onboard-dot' + (i === annotateStep ? ' active' : '');
                            cardDots.appendChild(dot);
                        });
                        skipBtn.textContent = t('onboardSkip');
                        nextBtn.textContent = (annotateStep === annotateSteps.length - 1) ? t('onboardFinish') : t('onboardNext');
                        if (lang === 'ar') {
                            nextBtn.textContent = nextBtn.textContent.replace('←', '→');
                        } else {
                            nextBtn.textContent = nextBtn.textContent.replace('→', '→');
                        }
                        var anEl = step.el();
                        if (anEl) {
                            positionGlow(anEl);
                            positionCard(anEl);
                        }
                    }

                    function startAnnotationTutorial() {
                        if (!overlay || !glow || !card) return;
                        if (annotationTutorialActive) return;
                        annotationTutorialActive = true;
                        annotateStep = 0;
                        renderAnnotateStep();
                        overlay.classList.add('active');
                    }

                    function closeAnnotationTutorial() {
                        if (!annotationTutorialActive) return;
                        annotationTutorialActive = false;
                        overlay.classList.remove('active');
                        glow.style.width = '0';
                        glow.style.height = '0';
                        glow.style.opacity = '0';
                        try { localStorage.setItem('annotateExplained', '1'); } catch(e) {}
                    }

                    function nextAnnotateStep() {
                        annotateStep++;
                        if (annotateStep >= annotateSteps.length) { closeAnnotationTutorial(); return; }
                        card.style.animation = 'none';
                        card.offsetHeight;
                        card.style.animation = 'onboardCardIn 0.35s ease both';
                        renderAnnotateStep();
                    }

                    window.startAnnotationTutorial = startAnnotationTutorial;
                    window.closeAnnotationTutorial = closeAnnotationTutorial;
            })();

            // ── Quiz Mode ──
            (function() {
                var quizQuestions = [];
                var quizCurrentIndex = 0;
                var quizScore = 0;
                var quizResults = [];
                var quizTimerInterval = null;
                var quizTimeLeft = 0;
                var quizTimerEnabled = false;
                var quizQuestionStartTime = 0;
                var quizFeedbackTimeout = null;
                var quizAdvanceTimeout = null;
                var quizClickHandler = null;

                var quizBtn = document.getElementById('quizBtn');

                var quizModeChoiceOverlay = document.getElementById('quizModeChoiceOverlay');
                var quizChoiceSelective = document.getElementById('quizChoiceSelective');
                var quizChoiceCustom = document.getElementById('quizChoiceCustom');
                var quizCustomSetupOverlay = document.getElementById('quizCustomSetupOverlay');
                var quizCustomCloseBtn = document.getElementById('quizCustomCloseBtn');
                var quizCustomList = document.getElementById('quizCustomList');
                var quizCustomEmptyMsg = document.getElementById('quizCustomEmptyMsg');
                var quizCustomStartBtn = document.getElementById('quizCustomStartBtn');
                var quizCreateBtn = document.getElementById('quizCreateBtn');
                var quizCustomSearch = document.getElementById('quizCustomSearch');
                var quizClearAllBtn = document.getElementById('quizClearAllBtn');
                var quizCustomTimeNone = document.getElementById('quizCustomTimeNone');
                var quizCustomTimeSet = document.getElementById('quizCustomTimeSet');
                var quizCustomTimeInputWrap = document.getElementById('quizCustomTimeInputWrap');
                var quizCustomTimeInput = document.getElementById('quizCustomTimeInput');
                var quizAuthoringBanner = document.getElementById('quizAuthoringBanner');
                var quizAuthoringInstruction = document.getElementById('quizAuthoringInstruction');
                var quizCancelAuthoringBtn = document.getElementById('quizCancelAuthoringBtn');
                var quizAuthoringOverlay = document.getElementById('quizAuthoringOverlay');
                var quizAuthoringStatusRow = document.getElementById('quizAuthoringStatusRow');
                var quizAuthoringStatus = document.getElementById('quizAuthoringStatus');
                var quizAuthoringFormFields = document.getElementById('quizAuthoringFormFields');
                var quizAuthoringActions = document.getElementById('quizAuthoringActions');
                var quizMarkerPoint = document.getElementById('quizMarkerPoint');
                var quizMarkerLine = document.getElementById('quizMarkerLine');
                var quizPromptInput = document.getElementById('quizPromptInput');
                var quizSaveQuestionBtn = document.getElementById('quizSaveQuestionBtn');
                var quizSaveCancelBtn = document.getElementById('quizSaveCancelBtn');
                var quizAuthoringAnswerFormatRow = document.getElementById('quizAuthoringAnswerFormatRow');
                var quizAnswerFormatTF = document.getElementById('quizAnswerFormatTF');
                var quizAnswerFormatWritten = document.getElementById('quizAnswerFormatWritten');
                var quizAnswerFormatMC = document.getElementById('quizAnswerFormatMC');
                var quizAuthoringMCChoicesRow = document.getElementById('quizAuthoringMCChoicesRow');
                var quizAuthoringChoicesList = document.getElementById('quizAuthoringChoicesList');
                var quizAddChoiceBtn = document.getElementById('quizAddChoiceBtn');
                var quizHudWrittenRow = document.getElementById('quizHudWrittenRow');
                var quizWrittenInput = document.getElementById('quizWrittenInput');
                var quizWrittenSubmitBtn = document.getElementById('quizWrittenSubmitBtn');
                var quizHudMCRow = document.getElementById('quizHudMCRow');
                var quizAuthoringTFAnswerRow = document.getElementById('quizAuthoringTFAnswerRow');
                var quizTFAnswerTrue = document.getElementById('quizTFAnswerTrue');
                var quizTFAnswerFalse = document.getElementById('quizTFAnswerFalse');
                var quizHudTFRow = document.getElementById('quizHudTFRow');
                var quizTFTrueBtn = document.getElementById('quizTFTrueBtn');
                var quizTFFalseBtn = document.getElementById('quizTFFalseBtn');
                var quizReviewOverlay = document.getElementById('quizReviewOverlay');
                var quizReviewProgress = document.getElementById('quizReviewProgress');
                var quizReviewCard = document.getElementById('quizReviewCard');
                var quizReviewPrompt = document.getElementById('quizReviewPrompt');
                var quizReviewClickInfo = document.getElementById('quizReviewClickInfo');
                var quizReviewCorrectBtn = document.getElementById('quizReviewCorrectBtn');
                var quizReviewIncorrectBtn = document.getElementById('quizReviewIncorrectBtn');
                var quizReviewDone = document.getElementById('quizReviewDone');
                var quizReviewBackBtn = document.getElementById('quizReviewBackBtn');

                var customQuestionsLibrary = [];
                var customQuizSelected = [];
                var sessionNewQuestionIds = [];
                var customQuizQuestions = [];
                var customQuizResults = [];
                var customQuizCurrentIndex = 0;
                var customQuizScore = 0;
                var customQuizClickHandler = null;
                var customQuizTimerInterval = null;
                var customQuizTimeLeft = 0;
                var customQuizTimerEnabled = false;
                var customQuizFeedbackTimeout = null;
                var customQuizAdvanceTimeout = null;

                var authoringActive = false;
                var authoringMarkerType = 'point';
                var authoringLinePoints = [];
                var authoringClickHandler = null;
                var authoringLineClickHandler = null;
                var authoringDblClickHandler = null;
                var authoringChoices = [];

                var reviewPendingItems = [];
                var reviewCurrentIndex = 0;
                var reviewOnComplete = null;

                var quizSetupOverlay = document.getElementById('quizSetupOverlay');
                var quizScopeChips = document.getElementById('quizScopeChips');
                var quizScopeTabs = document.getElementById('quizScopeTabs');
                var quizContinentsList = document.getElementById('quizContinentsList');
                var quizCountriesList = document.getElementById('quizCountriesList');
                var quizCountryChecklist = document.getElementById('quizCountryChecklist');
                var quizCountrySearch = document.getElementById('quizCountrySearch');
                var quizBlocsList = document.getElementById('quizBlocsList');
                var quizLayerCheckboxes = document.getElementById('quizLayerCheckboxes');
                var quizNumInput = document.getElementById('quizNumInput');
                var quizTimeModeSet = document.getElementById('quizTimeModeSet');
                var quizTimeInputWrap = document.getElementById('quizTimeInputWrap');
                var quizTimeInput = document.getElementById('quizTimeInput');
                var quizStartBtn = document.getElementById('quizStartBtn');
                var quizHudOverlay = document.getElementById('quizHudOverlay');
                var quizHudQuestion = document.getElementById('quizHudQuestion');
                var quizHudPrompt = document.getElementById('quizHudPrompt');
                var quizHudScore = document.getElementById('quizHudScore');
                var quizHudTimer = document.getElementById('quizHudTimer');
                var quizFeedback = document.getElementById('quizFeedback');
                var measureResultLabel = document.getElementById('measureResultLabel');
                var quizEndOverlay = document.getElementById('quizEndOverlay');
                var quizFinalScore = document.getElementById('quizFinalScore');
                var quizMissedList = document.getElementById('quizMissedList');
                var quizExitBtn = document.getElementById('quizExitBtn');
                var quizEndEarlyBtn = document.getElementById('quizEndEarlyBtn');
                var quizTypedAnswerInput = document.getElementById('quizTypedAnswerInput');
                var quizTypedSubmitBtn = document.getElementById('quizTypedSubmitBtn');

                var quizScope = { continents: [], countries: [], blocs: [] };

                function getContinentList() {
                    var seen = {};
                    Object.values(continentByCountry).forEach(function(c) { seen[c] = true; });
                    return Object.keys(seen).sort();
                }

                function getCountryList() {
                    var countries = Object.keys(continentByCountry);
                    countries.sort();
                    return countries;
                }

                function getBlocList() {
                    return geopoliticalBlocsData.map(function(b) { return b.name_en; }).sort();
                }

                function getLocalizedName(enName) {
                    return getDisplayName(enName) || enName;
                }

                function getContinentDisplayName(continentEn) {
                    if (lang === 'ar') return continentArabic[continentEn] || continentEn;
                    if (lang === 'ru') return continentRussian[continentEn] || continentEn;
                    if (lang === 'uz') return continentUzbek[continentEn] || continentEn;
                    if (lang === 'es') return continentSpanish[continentEn] || continentEn;
                    return continentEn;
                }

                function getBlocLocalizedName(enName) {
                    var b = geopoliticalBlocsData.find(function(x) { return x.name_en === enName; });
                    if (!b) return enName;
                    return lang === 'ar' ? b.name : lang === 'ru' ? (b.name_ru || b.name_en) : lang === 'uz' ? (b.name_uz || b.name_en) : lang === 'es' ? (b.name_es || b.name_en) : b.name_en;
                }

                function addScopeItem(type, enName) {
                    if (quizScope[type].indexOf(enName) === -1) {
                        quizScope[type].push(enName);
                    }
                    renderScopeChips();
                    syncScopeCheckboxes();
                }

                function removeScopeItem(type, enName) {
                    quizScope[type] = quizScope[type].filter(function(x) { return x !== enName; });
                    renderScopeChips();
                    syncScopeCheckboxes();
                }

                function toggleScopeItem(type, enName) {
                    if (quizScope[type].indexOf(enName) !== -1) {
                        removeScopeItem(type, enName);
                    } else {
                        addScopeItem(type, enName);
                    }
                }

                function renderScopeChips() {
                    quizScopeChips.innerHTML = '';
                    var items = [];
                    quizScope.continents.forEach(function(c) { items.push({ type: 'continents', enName: c, label: getLocalizedName(c) }); });
                    quizScope.countries.forEach(function(c) { items.push({ type: 'countries', enName: c, label: getLocalizedName(c) }); });
                    quizScope.blocs.forEach(function(b) { items.push({ type: 'blocs', enName: b, label: getBlocLocalizedName(b) }); });
                    items.forEach(function(item) {
                        var chip = document.createElement('span');
                        chip.className = 'quiz-scope-chip';
                        chip.textContent = item.label + ' ';
                        var remove = document.createElement('span');
                        remove.className = 'quiz-scope-chip-remove';
                        remove.textContent = '\u00d7';
                        remove.addEventListener('click', (function(t, n) {
                            return function(e) { e.stopPropagation(); removeScopeItem(t, n); };
                        })(item.type, item.enName));
                        chip.appendChild(remove);
                        quizScopeChips.appendChild(chip);
                    });
                }

                function syncScopeCheckboxes() {
                    quizContinentsList.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
                        cb.checked = quizScope.continents.indexOf(cb.value) !== -1;
                    });
                    quizCountryChecklist.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
                        cb.checked = quizScope.countries.indexOf(cb.value) !== -1;
                    });
                    quizBlocsList.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
                        cb.checked = quizScope.blocs.indexOf(cb.value) !== -1;
                    });
                }

                function buildScopeLists() {
                    quizContinentsList.innerHTML = '';
                    getContinentList().forEach(function(c) {
                        var label = document.createElement('label');
                        label.className = 'quiz-scope-item';
                        var cb = document.createElement('input');
                        cb.type = 'checkbox';
                        cb.value = c;
                        cb.checked = quizScope.continents.indexOf(c) !== -1;
                        cb.addEventListener('change', (function(cont) {
                            return function() { toggleScopeItem('continents', cont); };
                        })(c));
                        label.appendChild(cb);
                        label.appendChild(document.createTextNode(' ' + getContinentDisplayName(c)));
                        quizContinentsList.appendChild(label);
                    });

                    quizCountryChecklist.innerHTML = '';
                    if (quizCountrySearch) quizCountrySearch.value = '';
                    getCountryList().forEach(function(c) {
                        var label = document.createElement('label');
                        label.className = 'quiz-scope-item';
                        var cb = document.createElement('input');
                        cb.type = 'checkbox';
                        cb.value = c;
                        cb.checked = quizScope.countries.indexOf(c) !== -1;
                        cb.addEventListener('change', (function(country) {
                            return function() { toggleScopeItem('countries', country); };
                        })(c));
                        label.appendChild(cb);
                        label.appendChild(document.createTextNode(' ' + getLocalizedName(c)));
                        quizCountryChecklist.appendChild(label);
                    });

                    quizBlocsList.innerHTML = '';
                    getBlocList().forEach(function(b) {
                        var label = document.createElement('label');
                        label.className = 'quiz-scope-item';
                        var cb = document.createElement('input');
                        cb.type = 'checkbox';
                        cb.value = b;
                        cb.checked = quizScope.blocs.indexOf(b) !== -1;
                        cb.addEventListener('change', (function(bloc) {
                            return function() { toggleScopeItem('blocs', bloc); };
                        })(b));
                        label.appendChild(cb);
                        label.appendChild(document.createTextNode(' ' + getBlocLocalizedName(b)));
                        quizBlocsList.appendChild(label);
                    });
                }

                var _scopeTabsInitialized = false;
                function initScopeTabs() {
                    if (_scopeTabsInitialized) return;
                    _scopeTabsInitialized = true;
                    var tabs = quizScopeTabs.querySelectorAll('.quiz-scope-tab');
                    var panels = [quizContinentsList, quizCountriesList, quizBlocsList];
                    tabs.forEach(function(tab, idx) {
                        tab.addEventListener('click', function() {
                            tabs.forEach(function(t) { t.classList.remove('active'); });
                            tab.classList.add('active');
                            panels.forEach(function(p, pIdx) { p.style.display = pIdx === idx ? '' : 'none'; });
                        });
                    });

                    quizCountrySearch.addEventListener('input', function(e) {
                        var query = e.target.value.trim().toLowerCase();
                        quizCountryChecklist.querySelectorAll('.quiz-scope-item').forEach(function(label) {
                            var text = label.textContent.trim().toLowerCase();
                            label.style.display = (query === '' || text.indexOf(query) !== -1) ? '' : 'none';
                        });
                    });
                }

                function reverseGeocodeCountry(coords) {
                    if (!coords || coords.length < 2) return null;
                    var point = Array.isArray(coords[0]) ? coords[0] : coords;
                    if (typeof point[0] !== 'number') return null;
                    for (var i = 0; i < allCountryFeatures.length; i++) {
                        var f = allCountryFeatures[i];
                        try {
                            if (d3.geoContains(f, point)) {
                                return f.properties?.name || null;
                            }
                        } catch (e) {}
                    }
                    return null;
                }

                function getItemCountryNames(item, layerId) {
                    if (layerId === 'countries') {
                        return [item.properties?.name || ''];
                    }
                    if (layerId === 'capitals') {
                        var cn = reverseGeocodeCountry(item.capital_coords);
                        return cn ? [cn] : [];
                    }
                    if (layerId === 'geopoliticalBlocs') {
                        return item.members || [];
                    }
                    var countriesField = item.countries_en || item.countries_ar || '';
                    if (countriesField) {
                        return countriesField.split(',').map(function(s) { return s.trim(); }).filter(Boolean);
                    }
                    var coords = getItemCoords(item, layerId);
                    if (coords) {
                        var cn2 = reverseGeocodeCountry(coords);
                        return cn2 ? [cn2] : [];
                    }
                    return [];
                }

                function isInQuizScope(item, layerId, scope) {
                    var noScope = scope.continents.length === 0 && scope.countries.length === 0 && scope.blocs.length === 0;
                    if (noScope) return true;
                    var itemCountries = getItemCountryNames(item, layerId);
                    return itemCountries.some(function(countryName) {
                        if (scope.countries.indexOf(countryName) !== -1) return true;
                        if (scope.continents.indexOf(continentByCountry[countryName]) !== -1) return true;
                        return scope.blocs.some(function(blocName) {
                            var bloc = geopoliticalBlocsData.find(function(b) { return b.name_en === blocName; });
                            return bloc && bloc.members.indexOf(countryName) !== -1;
                        });
                    });
                }

                var QUIZ_LAYERS = [
                    { id: 'countries', labelKey: 'quizCountries', checkType: 'polygon' },
                    { id: 'naturalResources', labelKey: 'quizNaturalResources', checkType: 'point' },
                    { id: 'ethnicGroups', labelKey: 'quizEthnicGroups', checkType: 'point' },
                    { id: 'corridors', labelKey: 'quizCorridors', checkType: 'line' },
                    { id: 'borderDisputes', labelKey: 'quizBorderDisputes', checkType: 'point' },
                    { id: 'desertsForests', labelKey: 'quizDesertsForests', checkType: 'polygon' },
                    { id: 'geopoliticalBlocs', labelKey: 'quizGeopoliticalBlocs', checkType: 'bloc' },
                    { id: 'volcanoes', labelKey: 'quizVolcanoes', checkType: 'point' },
                    { id: 'earthquakes', labelKey: 'quizEarthquakes', checkType: 'point' },
                    { id: 'majorCities', labelKey: 'quizMajorCities', checkType: 'point' },
                    { id: 'capitals', labelKey: 'quizCapitals', checkType: 'point' },
                    { id: 'rivers', labelKey: 'quizRivers', checkType: 'line' }
                ];

                function getItemName(item, layerId) {
                    if (layerId === 'countries') {
                        return getDisplayName(item.properties?.name || '');
                    }
                    if (layerId === 'capitals') {
                        return lang === 'ar' ? item.capital_ar : lang === 'ru' ? (item.capital_ru || item.capital_en) : lang === 'uz' ? (item.capital_uz || item.capital_en) : lang === 'es' ? (item.capital_es || item.capital_en) : item.capital_en;
                    }
                    if (layerId === 'corridors') {
                        return lang === 'ar' ? item.name_ar : lang === 'ru' ? (item.name_ru || item.name_en) : lang === 'uz' ? (item.name_uz || item.name_en) : lang === 'es' ? (item.name_es || item.name_en) : item.name_en;
                    }
                    if (layerId === 'borderDisputes') {
                        return lang === 'ar' ? item.name_ar : lang === 'ru' ? (item.name_ru || item.name_en) : lang === 'uz' ? (item.name_uz || item.name_en) : lang === 'es' ? (item.name_es || item.name_en) : item.name_en;
                    }
                    if (layerId === 'geopoliticalBlocs') {
                        return lang === 'ar' ? item.name : lang === 'ru' ? (item.name_ru || item.name_en) : lang === 'uz' ? (item.name_uz || item.name_en) : lang === 'es' ? (item.name_es || item.name_en) : item.name_en;
                    }
                    return lang === 'ar' ? item.name : lang === 'ru' ? (item.name_ru || item.name_en) : lang === 'uz' ? (item.name_uz || item.name_en) : lang === 'es' ? (item.name_es || item.name_en) : (item.name_en || item.name);
                }

                function getItemCoords(item, layerId) {
                    if (layerId === 'countries') {
                        return item.properties?.centroid || null;
                    }
                    if (layerId === 'capitals') {
                        return item.capital_coords || null;
                    }
                    return item.coords || null;
                }

                function getLayerData(layerId) {
                    if (layerId === 'countries') return allCountryFeatures || [];
                    if (layerId === 'naturalResources') return naturalResourcesData || [];
                    if (layerId === 'ethnicGroups') return ethnicGroupsData || [];
                    if (layerId === 'corridors') return corridorsData || [];
                    if (layerId === 'borderDisputes') return borderDisputesData || [];
                    if (layerId === 'desertsForests') return desertsForestsData || [];
                    if (layerId === 'geopoliticalBlocs') return geopoliticalBlocsData || [];
                    if (layerId === 'volcanoes') return volcanoesData || [];
                    if (layerId === 'earthquakes') return earthquakesData || [];
                    if (layerId === 'majorCities') return majorCitiesData || [];
                    if (layerId === 'capitals') {
                        var caps = [];
                        Object.entries(countryInfo).forEach(function(entry) {
                            var info = entry[1];
                            if (info.capital_coords) {
                                caps.push({ name: entry[0], capital_ar: info.capital_ar, capital_en: info.capital_en, capital_ru: info.capital_ru, capital_uz: info.capital_uz, capital_es: info.capital_es, capital_coords: info.capital_coords });
                            }
                        });
                        return caps;
                    }
                    if (layerId === 'rivers') return rivers || [];
                    return [];
                }

                function isInRegion(item, layerId, bloc) {
                    if (!bloc) return true;
                    if (layerId === 'countries') {
                        var cname = item.properties?.name || '';
                        return bloc.members.some(function(m) {
                            return getCleanName(m) === getCleanName(cname);
                        });
                    }
                    var countriesField = (item.countries_en || item.countries_ar || '');
                    if (countriesField) {
                        return bloc.members.some(function(m) {
                            return countriesField.toLowerCase().indexOf(m.toLowerCase()) !== -1;
                        });
                    }
                    var coords = getItemCoords(item, layerId);
                    if (coords && coords.length >= 2) {
                        var point = Array.isArray(coords[0]) ? coords[0] : coords;
                        if (typeof point[0] === 'number') {
                            for (var i = 0; i < allCountryFeatures.length; i++) {
                                var f = allCountryFeatures[i];
                                if (bloc.members.some(function(m) { return getCleanName(m) === getCleanName(f.properties?.name || ''); })) {
                                    try { if (d3.geoContains(f, point)) return true; } catch(e) {}
                                }
                            }
                        }
                    }
                    return false;
                }

                function initQuizSetup() {
                    buildScopeLists();
                    initScopeTabs();
                    renderScopeChips();

                    var tabs = quizScopeTabs.querySelectorAll('.quiz-scope-tab');
                    tabs[0].textContent = t('quizTabContinents');
                    tabs[1].textContent = t('quizTabCountries');
                    tabs[2].textContent = t('quizTabBlocs');

                    quizLayerCheckboxes.innerHTML = '';
                    QUIZ_LAYERS.forEach(function(layer) {
                        var label = document.createElement('label');
                        label.className = 'quiz-checkbox-label';
                        var cb = document.createElement('input');
                        cb.type = 'checkbox';
                        cb.value = layer.id;
                        cb.checked = true;
                        label.appendChild(cb);
                        label.appendChild(document.createTextNode(' ' + t(layer.labelKey)));
                        quizLayerCheckboxes.appendChild(label);
                    });

                    document.getElementById('quizSetupTitle').textContent = t('quizSetup');
                    document.getElementById('quizRegionLabel').textContent = t('quizRegion');
                    document.getElementById('quizLayersLabel').textContent = t('quizLayers');
                    document.getElementById('quizNumLabel').textContent = t('quizNumQuestions');
                    document.getElementById('quizTimeLabel').textContent = t('quizTimeLimit');
                    document.getElementById('quizNoLimitText').textContent = t('quizNoLimit');
                    document.getElementById('quizSetLimitText').textContent = t('quizSetLimitText');
                    document.getElementById('quizMinutesText').textContent = t('quizMinutes');
                    quizStartBtn.textContent = t('quizStart');
                    document.getElementById('quizEndEarlyBtn').textContent = t('quizEndEarlyBtn');
                    quizTypedSubmitBtn.textContent = t('quizTypedAnswerSubmit');
                    if (quizCountrySearch) quizCountrySearch.placeholder = t('quizSearchCountry');

                    document.getElementById('quizStudentNameInput').placeholder = t('quizStudentNamePlaceholder');
                    document.getElementById('quizSessionCodeInput').placeholder = t('quizSessionCodePlaceholder');
                    var createBtn = document.getElementById('quizCreateSessionBtn');
                    createBtn.textContent = t('quizCreateSession');
                    createBtn.style.display = '';
                    document.getElementById('quizSessionCreated').style.display = 'none';
                    if (currentSessionCode) {
                        document.getElementById('quizSessionCodeInput').value = currentSessionCode;
                        document.getElementById('quizStudentNameInput').value = currentStudentName || '';
                    }
                    updateViewResultsBtn();
                }

                function generateQuestions() {
                    var selectedLayers = [];
                    quizLayerCheckboxes.querySelectorAll('input[type="checkbox"]:checked').forEach(function(cb) {
                        selectedLayers.push(cb.value);
                    });
                    if (selectedLayers.length === 0) return [];

                    var numQ = parseInt(quizNumInput.value) || 10;
                    numQ = Math.max(5, Math.min(30, numQ));

                    var pool = [];
                    selectedLayers.forEach(function(layerId) {
                        var data = getLayerData(layerId);
                        data.forEach(function(item) {
                            if (!isInQuizScope(item, layerId, quizScope)) return;
                            var name = getItemName(item, layerId);
                            if (!name) return;
                            pool.push({ item: item, layerId: layerId, name: name });
                        });
                    });

                    if (pool.length === 0) return [];

                    // De-duplicate: keep only the first entry per unique (layer, name) combination,
                    // so the same-named feature (e.g. multiple "Uranium" deposits) can't be asked twice.
                    var seenKeys = {};
                    var dedupedPool = [];
                    pool.forEach(function(entry) {
                        var key = entry.layerId + '::' + entry.name.trim().toLowerCase();
                        if (seenKeys[key]) return;
                        seenKeys[key] = true;
                        dedupedPool.push(entry);
                    });

                    var shuffled = dedupedPool.sort(function() { return Math.random() - 0.5; });
                    return shuffled.slice(0, Math.min(numQ, shuffled.length));
                }

                // ── History Mode (WWI & WWII alignment scenarios) ──
                var histBtnEl = null;

                function pickHistNote(o) { return o ? (o[lang] !== undefined && o[lang] !== null ? o[lang] : (o.en !== undefined ? o.en : '')) : ''; }
                function histRoleKey(role) { return 'histRole' + role.charAt(0).toUpperCase() + role.slice(1); }
                function histFamily(side) { return (side === 'central' || side === 'axis') ? 'red' : 'blue'; }
                function histColorFor(p) {
                    if (!p || p.role === 'neutral') return null;
                    if (p.role === 'occupied') return histOccupiedColor;
                    var pal = histRoleColorPalettes[histFamily(p.side)];
                    return pal[p.role] || '#8d97a5';
                }
                function getHistWar() {
                    return historicalWarsData.find(function(w) { return w.id === historyWarId; }) || historicalWarsData[0];
                }
                function getHistScenario(war) {
                    war = war || getHistWar();
                    return war.scenarios.find(function(s) { return s.id === historyScenarioId; }) || war.scenarios[0];
                }
                function histMatchName(cleanName, candidate) {
                    var c = getCleanName(candidate);
                    if (!cleanName || !c) return false;
                    if (c === cleanName) return true;
                    var a = cleanName.toLowerCase(), b = c.toLowerCase();
                    if (Math.min(a.length, b.length) < 4) return false;
                    function boundaryHit(shorter, longer) {
                        var idx = longer.indexOf(shorter);
                        while (idx !== -1) {
                            if (idx === 0 || /[\s.\-]/.test(longer.charAt(idx - 1))) return true;
                            idx = longer.indexOf(shorter, idx + 1);
                        }
                        return false;
                    }
                    return a.length <= b.length ? boundaryHit(a, b) : boundaryHit(b, a);
                }
                function findHistParticipant(scenario, cleanName) {
                    var i, j, emp;
                    for (i = 0; i < scenario.participants.length; i++) {
                        if (histMatchName(cleanName, scenario.participants[i].c)) return scenario.participants[i];
                    }
                    for (i = 0; i < (scenario.empires || []).length; i++) {
                        emp = scenario.empires[i];
                        for (j = 0; j < emp.members.length; j++) {
                            if (histMatchName(cleanName, emp.members[j])) return { side: emp.side, role: emp.role, n: null, yr: emp.joinYr || null, _empire: emp };
                        }
                    }
                    return null;
                }
                function drawHistoryScenario(skipFadeIn) {
                    if (historyTab === 'eras') { drawEraScene(skipFadeIn); return; }
                    if (!gHistoryOverlay) return;
                    gHistoryOverlay.selectAll('*').remove();
                    if (!historyActive) return;
                    var sc = getHistScenario();
                    if (!sc) return;
                    var k = Math.max(0.4, currentTransform.k);
                    var fs = Math.max(4, Math.min(16, (isMobile ? 8 : 11) / k));
                    var dur = prefersReducedMotion() ? 0 : 300;

                    (sc.empires || []).forEach(function(emp) {
                        var col = histColorFor(emp) || '#7b8794';
                        var sx = 0, sy = 0, sw = 0, found = false;
                        emp.members.forEach(function(m) {
                            var f = allCountryFeatures.find(function(ff) { return histMatchName(getCleanName(ff.properties && ff.properties.name), m); });
                            if (!f) return;
                            var pd = pathGen(f);
                            if (pd) {
                                var s = gHistoryOverlay.append('path').attr('d', pd).attr('fill', col)
                                    .attr('stroke', '#ffffff').attr('stroke-width', 1.2).attr('stroke-dasharray', '5,3')
                                    .attr('vector-effect', 'non-scaling-stroke').style('pointer-events', 'none');
                                if (skipFadeIn) s.attr('opacity', 0.42); else s.attr('opacity', 0).transition().duration(dur).attr('opacity', 0.42);
                            }
                            try {
                                var cen = d3.geoCentroid(f);
                                var area = Math.max(0.001, d3.geoArea(f));
                                var xy = getActiveProjection()(cen);
                                if (xy && !isNaN(xy[0])) { sx += xy[0] * area; sy += xy[1] * area; sw += area; found = true; }
                            } catch (err) {}
                        });
                        if (found) {
                            var nm = locField(histEmpireNames[emp.id], 'name');
                            var suffix = emp.joinYr ? ' (' + emp.joinYr + ')' : (emp.endYr ? ' (†' + emp.endYr + ')' : '');
                            var lbl = gHistoryOverlay.append('text')
                                .attr('x', sx / sw).attr('y', sy / sw)
                                .text(nm + suffix)
                                .attr('fill', '#ffffff').attr('font-size', fs).attr('font-weight', 'bold')
                                .attr('text-anchor', 'middle').attr('pointer-events', 'none')
                                .attr('paint-order', 'stroke').attr('stroke', 'rgba(0,0,0,0.75)').attr('stroke-width', 3);
                            if (skipFadeIn) lbl.attr('opacity', 0.95); else lbl.attr('opacity', 0).transition().duration(dur).attr('opacity', 0.95);
                        }
                    });

                    sc.participants.forEach(function(p) {
                        var col = histColorFor(p);
                        if (!col) return;
                        allCountryFeatures.forEach(function(f) {
                            var cn = getCleanName((f.properties && f.properties.name) || '');
                            if (!histMatchName(cn, p.c)) return;
                            var pd = pathGen(f);
                            if (!pd) return;
                            var isSoft = (p.role === 'protectorate' || p.role === 'colony' || p.role === 'dominion');
                            var s = gHistoryOverlay.append('path').attr('d', pd).attr('fill', col)
                                .attr('stroke', col).attr('stroke-width', isSoft ? 2.2 : 1.2)
                                .attr('vector-effect', 'non-scaling-stroke').style('pointer-events', 'none');
                            if (skipFadeIn) s.attr('opacity', 0.45); else s.attr('opacity', 0).transition().duration(dur).attr('opacity', 0.45);
                        });
                    });
               
                    if (historicalRoutesVisible && window.drawHistoricalRoutes) window.drawHistoricalRoutes(true);
                }
                function renderHistoryBar() {
                    var war = getHistWar();
                    var tabs = document.getElementById('histWarTabs');
                    tabs.innerHTML = '';
                    historicalWarsData.forEach(function(w) {
                        var b = document.createElement('button');
                        b.type = 'button';
                        b.className = 'btn history-war-tab' + (historyTab === 'wars' && w.id === historyWarId ? ' active' : '');
                        b.setAttribute('role', 'tab');
                        b.setAttribute('aria-selected', historyTab === 'wars' && w.id === historyWarId ? 'true' : 'false');
                        b.textContent = locField(w, 'name') + ' (' + locField(w, 'years') + ')';
                        b.addEventListener('click', function() {
                            historyTab = 'wars';
                            historyWarId = w.id;
                            historyScenarioId = w.scenarios[0].id;
                            renderHistoryBar();
                            drawHistoryScenario();
                        });
                        tabs.appendChild(b);
                    });
                    var erasTab = document.createElement('button');
                    erasTab.type = 'button';
                    erasTab.className = 'btn history-war-tab history-eras-tab' + (historyTab === 'eras' ? ' active' : '');
                    erasTab.setAttribute('role', 'tab');
                    erasTab.setAttribute('aria-selected', historyTab === 'eras' ? 'true' : 'false');
                    erasTab.textContent = t('histTabEras');
                    erasTab.addEventListener('click', function() { selectHistoryTab('eras'); });
                    tabs.appendChild(erasTab);
                    if (historyTab === 'eras') { renderEraTabContent(); return; }
                    var tlWars = document.getElementById('histTimeline');
                    if (tlWars) tlWars.style.display = 'none';
                    var row = document.getElementById('histScenarioBtns');
                    row.innerHTML = '';
                    war.scenarios.forEach(function(s) {
                        var b = document.createElement('button');
                        b.type = 'button';
                        b.className = 'btn history-scenario-btn' + (s.id === historyScenarioId ? ' active' : '');
                        b.textContent = s.year + ' · ' + locField(s, 'title');
                        b.title = locField(s, 'desc');
                        b.addEventListener('click', function() {
                            historyScenarioId = s.id;
                            renderHistoryBar();
                            drawHistoryScenario();
                            if (selectedCountry && countryPanel.classList.contains('visible')) openHistoryPanel(selectedCountry);
                        });
                        row.appendChild(b);
                    });
                    var seen = {}, chips = [];
                    war.scenarios.forEach(function(s) {
                        if (s.id !== historyScenarioId) return;
                        s.participants.forEach(function(p) {
                            var key = p.side + '_' + p.role;
                            if (seen[key]) return;
                            seen[key] = true;
                            chips.push({ key: key, side: p.side, role: p.role, color: histColorFor(p) });
                        });
                        (s.empires || []).forEach(function(emp) {
                            var key = emp.side + '_' + emp.role;
                            if (seen[key]) return;
                            seen[key] = true;
                            chips.push({ key: key, side: emp.side, role: emp.role, color: histColorFor(emp), dashed: true });
                        });
                    });
                    var leg = document.getElementById('histLegend');
                    leg.innerHTML = '<span class="control-label">' + t('histLegendLabel') + '</span>';
                    chips.forEach(function(ch) {
                        var chip = document.createElement('span');
                        chip.className = 'hist-chip';
                        var hasSide = !!war.sides[ch.side];
                        var fullSide = hasSide ? t(war.sides[ch.side]) : '';
                        var shortSide = fullSide ? fullSide.split('—')[0].trim() : '';
                        chip.title = shortSide ? (shortSide + ' — ' + t(histRoleKey(ch.role))) : t(histRoleKey(ch.role));
                        var sw = document.createElement('span');
                        sw.className = 'hist-chip-swatch';
                        sw.style.background = ch.color || 'transparent';
                        if (!ch.color) { sw.style.border = '1px solid #9aa5b1'; }
                        if (ch.dashed) { sw.style.backgroundImage = 'repeating-linear-gradient(45deg, rgba(255,255,255,.85) 0 2px, transparent 2px 5px)'; }
                        chip.appendChild(sw);
                        chip.appendChild(document.createTextNode(shortSide ? (t(histRoleKey(ch.role)) + ' · ' + shortSide) : t(histRoleKey(ch.role))));
                        leg.appendChild(chip);
                    });
                    var sp = document.getElementById('histSourcesPanel');
                    sp.innerHTML = '<h4>' + htmlEscape(t('histSourcesTitle')) + '</h4><ul>' +
                        war.sources.map(function(s) { return '<li>' + htmlEscape(s) + '</li>'; }).join('') +
                        '</ul>';
                    if (historyActive && window.updateHash) window.updateHash();
                }
                function openHistoryPanel(f) {
                    if (historyTab === 'eras') { openEraPanelForFeature(f); return; }
                    var panelContent = document.getElementById('panelContent');
                    var countryPanel = document.getElementById('countryPanel');
                    if (!panelContent || !countryPanel) return;
                    closeFeatureDetail();
                    selectedCountry = f;
                    selectedFeatureType = 'history';
                    var name = (f.properties && f.properties.name) || '';
                    var cn = getCleanName(name);
                    var sc = getHistScenario();
                    var war = getHistWar();
                    var p = findHistParticipant(sc, cn);
                    var dispName = getDisplayName(name);
                    var flag = getCountryFlag(name);
                    var html = '<h3>' + (flag || '📜') + ' ' + htmlEscape(dispName) + '</h3>';
                    html += '<p class="hist-panel-context"><strong>' + htmlEscape(locField(war, 'name')) + '</strong> — ' + sc.year + ' · ' + htmlEscape(locField(sc, 'title')) + '</p>';
                    if (!p) {
                        html += '<p class="hist-note">' + htmlEscape(t('histNoData')) + '</p>';
                    } else {
                        var col = histColorFor(p) || '#9aa5b1';
                        var roleLbl = t(histRoleKey(p.role));
                        var sideLbl = p.side !== 'neutral' && war.sides[p.side] ? t(war.sides[p.side]) : '';
                        html += '<div class="hist-status-block" style="border-inline-start-color:' + col + '">' +
                            '<div class="hist-status-role"><span class="hist-chip-swatch" style="background:' + col + '"></span> <strong>' + htmlEscape(roleLbl) + '</strong></div>' +
                            (sideLbl ? '<div class="hist-status-side">' + htmlEscape(sideLbl) + (p.yr ? ' · ' + htmlEscape(p.yr) : '') + '</div>' : '') +
                            '</div>';
                        if (p.n && histNotes[p.n]) {
                            html += '<p class="hist-note">' + htmlEscape(pickHistNote(histNotes[p.n])) + '</p>';
                        }
                        if (p._empire) {
                            var emp = p._empire;
                            var membersStr = emp.members.map(function(m) { return getDisplayName(m); }).join('، ');
                            html += '<div class="hist-empire-box">';
                            html += '<strong>' + htmlEscape(locField(histEmpireNames[emp.id], 'name')) + '</strong>';
                            html += '<div class="hist-empire-members">' + htmlEscape(t('histCompositionLabel')) + ' ' + htmlEscape(membersStr) + '</div>';
                            var partial = locField(emp, 'partial');
                            if (partial) html += '<div class="hist-empire-partial">' + htmlEscape(t('histPartialNoteLabel')) + ' ' + htmlEscape(partial) + '.</div>';
                            html += '</div>';
                        }
                    }
                    html += '<details class="hist-sources-mini"><summary>' + htmlEscape(t('histSourcesBtn')) + ' (' + htmlEscape(t('histSourcesTitle')) + ')</summary><ul>' +
                        war.sources.map(function(s) { return '<li>' + htmlEscape(s) + '</li>'; }).join('') + '</ul></details>';
                    html += '<p class="hist-disclaimer-mini">' + htmlEscape(t('histDisclaimer')) + '</p>';
                    _lastPanelRenderTime = performance.now();
                    panelContent.innerHTML = html;
                    countryPanel.style.display = 'block';
                    requestAnimationFrame(function() { requestAnimationFrame(function() { countryPanel.classList.add('visible'); }); });
                }
                function enterHistoryMode() {
                    if (quizActive || historyActive) return;
                    historySavedState = { colorMode: colorMode, currentReligionFilter: currentReligionFilter };
                    Object.keys(LAYER_DEFS).forEach(function(nm) {
                        historySavedState[nm] = LAYER_DEFS[nm].getFlag();
                    });
                    Object.keys(LAYER_DEFS).forEach(function(nm) {
                        if (LAYER_DEFS[nm].getFlag()) toggleLayerByName(nm);
                    });
                    if (currentReligionFilter !== 'all') {
                        currentReligionFilter = 'all';
                        setActiveByAttr(religionButtons, '.religion-btn[data-religion="all"]');
                    }
                    if (colorMode !== 'normal') setMode('normal');
                    if (!historyWarId || !historicalWarsData.some(function(w) { return w.id === historyWarId; })) {
                        historyWarId = historicalWarsData[0].id;
                    }
                    var _cw = getHistWar();
                    if (!historyScenarioId || !_cw.scenarios.some(function(x) { return x.id === historyScenarioId; })) {
                        historyScenarioId = _cw.scenarios[0].id;
                    }
                    historyActive = true;
                    renderHistoryBar();
                    drawHistoryScenario();
                }
                function exitHistoryMode(restore) {
                    historyActive = false;
                    if (gHistoryOverlay) gHistoryOverlay.selectAll('*').remove();
                    var sp2 = document.getElementById('histSourcesPanel');
                    if (sp2) sp2.style.display = 'none';
                    if (selectedFeatureType === 'history' && countryPanel.classList.contains('visible')) closeCountryPanel();
                    if (restore !== false && historySavedState) {
                        var s = historySavedState;
                        Object.keys(LAYER_DEFS).forEach(function(nm) {
                            if (s[nm] && !LAYER_DEFS[nm].getFlag()) toggleLayerByName(nm);
                        });
                        if (s.currentReligionFilter !== 'all') {
                            currentReligionFilter = s.currentReligionFilter;
                            setActiveByAttr(religionButtons, '.religion-btn[data-religion="' + s.currentReligionFilter + '"]');
                        }
                        if (s.colorMode !== colorMode) setMode(s.colorMode);
                    }
                    historySavedState = null;
                }
                function updateSectionToggleUI() {
                    var isHist = currentSection === 'history';
                    document.body.classList.toggle('section-history', isHist);
                    document.body.classList.toggle('section-geo', !isHist);
                    var g = document.getElementById('sectionGeoBtn');
                    var h = document.getElementById('sectionHistoryBtn');
                    if (g) { g.classList.toggle('active', !isHist); g.setAttribute('aria-pressed', !isHist ? 'true' : 'false'); }
                    if (h) { h.classList.toggle('active', isHist); h.setAttribute('aria-pressed', isHist ? 'true' : 'false'); }
                }
                function applySection(section, persist) {
                    if (section !== 'geo' && section !== 'history') return;
                    if (quizActive && section === 'geo') return;
                    if (section === currentSection) { updateSectionToggleUI(); return; }
                    if (section === 'history') {
                        enterHistoryMode();
                        currentSection = 'history';
                    } else {
                        exitHistoryMode();
                        currentSection = 'geo';
                        if (historicalRoutesVisible && window.drawHistoricalRoutes) window.drawHistoricalRoutes(true);
                    }
                    if (persist !== false) { try { localStorage.setItem('lepidosSection', section); } catch (e) {} }
                    updateSectionToggleUI();
                    if (window.updateHash) window.updateHash();
                }
                window.applySection = applySection;
                window.applySectionWhenReady = function(section, cb) {
                    var tries = 0;
                    (function wait() {
                        if (window.applySection) { window.applySection(section, false); if (cb) cb(); return; }
                        if (++tries > 150) return;
                        setTimeout(wait, 60);
                    })();
                };
                window.enterHistoryMode = enterHistoryMode;
                window.exitHistoryMode = exitHistoryMode;
                window.renderHistoryBar = renderHistoryBar;
                window.drawHistoryScenario = drawHistoryScenario;
                window.drawEraScene = drawEraScene;
                window.openHistoryPanel = openHistoryPanel;
                window.historyIsActive = function() { return historyActive; };
                if (typeof zoomBehavior !== 'undefined' && zoomBehavior) {
                    zoomBehavior.on('end.histzoom', function() {
                        if (historyActive && window.drawHistoryScenario) window.drawHistoryScenario(true);
                    });
                }
                window.historyModeIsEras = function() { return historyTab === 'eras'; };

                function fetchHistoricalEras() {
                    if (historicalErasData) return Promise.resolve(historicalErasData);
                    if (!historicalErasLoading) {
                        historicalErasLoading = fetch(BASE + 'historical-eras-data.json')
                            .then(function(r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
                            .then(function(d) { historicalErasData = d.eras || []; return historicalErasData; })
                            .catch(function(e) { historicalErasLoading = null; throw e; });
                    }
                    return historicalErasLoading;
                }
                function getHistEra() {
                    if (!historicalErasData || !historicalErasData.length) return null;
                    return historicalErasData.find(function(e) { return e.id === historyEraId; }) || historicalErasData[0];
                }
                function normalizeEraRing(ring) {
                    while (Array.isArray(ring) && ring.length === 1 && Array.isArray(ring[0])) ring = ring[0];
                    if (Array.isArray(ring) && typeof ring[0] === 'number') {
                        var out = [];
                        for (var i = 0; i + 1 < ring.length; i += 2) out.push([ring[i], ring[i + 1]]);
                        ring = out;
                    }
                    return ring;
                }
                function getCurrentHistoryYear() {
                    if (historyTab === 'eras') {
                        var e = getHistEra();
                        return e ? e.sort : null;
                    }
                    var sc = getHistScenario();
                    if (!sc) return null;
                    var n = parseInt(sc.year, 10);
                    return isNaN(n) ? null : n;
                }
                function buildEraFeature(p) {
                    var rings = (p.rings || []).map(function(ring) {
                        var r = normalizeEraRing(ring);
                        try {
                            if (d3.geoArea({ type: 'Polygon', coordinates: [r] }) > Math.PI * 2) r = r.slice().reverse();
                        } catch (e) {}
                        return r;
                    });
                    return { type: 'MultiPolygon', coordinates: rings.map(function(r) { return [r]; }) };
                }
                function drawEraScene(skipFadeIn) {
                    if (!gHistoryOverlay) return;
                    gHistoryOverlay.selectAll('*').remove();
                    if (!historyActive || historyTab !== 'eras') return;
                    var era = getHistEra();
                    if (!era) return;
                    var k = Math.max(0.4, currentTransform.k);
                    var fs = Math.max(4, Math.min(15, (isMobile ? 8 : 11) / k));
                    var dur = prefersReducedMotion() ? 0 : 300;
                    era.polities.forEach(function(p) {
                        var feature = buildEraFeature(p);
                        var pd = pathGen(feature);
                        if (pd) {
                            var s = gHistoryOverlay.append('path').attr('d', pd).attr('fill', p.color)
                                .attr('stroke', p.color).attr('stroke-width', 1.8).attr('stroke-dasharray', '7,4')
                                .attr('vector-effect', 'non-scaling-stroke').style('cursor', 'pointer')
                                .on('click', function() { showEraPolityPanel(p, era); });
                            if (skipFadeIn) s.attr('opacity', 0.42); else s.attr('opacity', 0).transition().duration(dur).attr('opacity', 0.42);
                        }
                    });
                    era.polities.forEach(function(p) {
                        var xy = getActiveProjection()(p.label);
                        if (!xy || isNaN(xy[0])) return;
                        var lbl = gHistoryOverlay.append('text').attr('x', xy[0]).attr('y', xy[1])
                            .text(locField(p, 'name')).attr('fill', '#ffffff').attr('font-size', fs)
                            .attr('font-weight', 'bold').attr('text-anchor', 'middle').attr('pointer-events', 'none')
                            .attr('paint-order', 'stroke').attr('stroke', 'rgba(0,0,0,0.75)').attr('stroke-width', 3);
                        if (skipFadeIn) lbl.attr('opacity', 0.95); else lbl.attr('opacity', 0).transition().duration(dur).attr('opacity', 0.95);
                    });
                    if (historicalRoutesVisible && window.drawHistoricalRoutes) window.drawHistoricalRoutes(true);
                }
                function showEraPolityPanel(p, era) {
                    var panelContent = document.getElementById('panelContent');
                    var countryPanel = document.getElementById('countryPanel');
                    if (!panelContent || !countryPanel) return;
                    closeFeatureDetail();
                    selectedCountry = null;
                    selectedFeatureType = 'history';
                    var html = '<h3>🏛️ ' + htmlEscape(locField(p, 'name')) + '</h3>';
                    html += '<p class="hist-panel-context"><strong>' + htmlEscape(locField(era, 'title')) + '</strong> — ' + htmlEscape(era.yearLabel || '') + '</p>';
                    var desc = locField(era, 'desc');
                    if (desc) html += '<p class="hist-note">' + htmlEscape(desc) + '</p>';
                    html += '<p class="hist-note"><em>' + htmlEscape(t('histEraApprox')) + '</em></p>';
                    html += '<details class="hist-sources-mini"><summary>' + htmlEscape(t('histSourcesBtn')) + '</summary><ul>' +
                        (era.sources || []).map(function(s) { return '<li>' + htmlEscape(s) + '</li>'; }).join('') + '</ul></details>';
                    html += '<p class="hist-disclaimer-mini">' + htmlEscape(t('histEraDisclaimer')) + '</p>';
                    _lastPanelRenderTime = performance.now();
                    panelContent.innerHTML = html;
                    countryPanel.style.display = 'block';
                    requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
                }
                function openEraPanelForFeature(f) {
                    var panelContent = document.getElementById('panelContent');
                    var countryPanel = document.getElementById('countryPanel');
                    if (!panelContent || !countryPanel) return;
                    closeFeatureDetail();
                    selectedCountry = f;
                    selectedFeatureType = 'history';
                    var era = getHistEra();
                    var name = (f.properties && f.properties.name) || '';
                    var dispName = getDisplayName(name);
                    var flag = getCountryFlag(name);
                    var html = '<h3>' + (flag || '📜') + ' ' + htmlEscape(dispName) + '</h3>';
                        if (era) {
                            html += '<p class="hist-panel-context"><strong>' + htmlEscape(locField(era, 'title')) + '</strong> — ' + htmlEscape(era.yearLabel || '') + '</p>';
                            var centroids = [];
                            try {
                                if (f.geometry && f.geometry.type === 'MultiPolygon') {
                                    f.geometry.coordinates.forEach(function(poly) {
                                        try {
                                            var c = d3.geoCentroid({ type: 'Polygon', coordinates: poly });
                                            if (c && !isNaN(c[0])) centroids.push(c);
                                        } catch (e) {}
                                    });
                                } else {
                                    var c0 = d3.geoCentroid(f);
                                    if (c0 && !isNaN(c0[0])) centroids.push(c0);
                                }
                            } catch (e) {}
                            if (!centroids.length) { try { var cf = d3.geoCentroid(f); if (cf && !isNaN(cf[0])) centroids.push(cf); } catch (e) {} }
                            var hit = null;
                            for (var ci = 0; ci < centroids.length && !hit; ci++) {
                                var cpt = centroids[ci];
                                for (var i = 0; i < era.polities.length && !hit; i++) {
                                    var pol = era.polities[i];
                                    for (var j = 0; j < (pol.rings || []).length && !hit; j++) {
                                        try {
                                            if (d3.geoContains({ type: 'Polygon', coordinates: [normalizeEraRing(pol.rings[j])] }, cpt)) hit = pol;
                                        } catch (e) {}
                                    }
                                }
                            }
                            if (hit) {
                                showEraPolityPanel(hit, era);
                                return;
                            }
                        }
                    html += '<p class="hist-note">' + htmlEscape(t('histNoData')) + '</p>';
                    _lastPanelRenderTime = performance.now();
                    panelContent.innerHTML = html;
                    countryPanel.style.display = 'block';
                    requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
                }
                function renderEraTabContent() {
                    var row = document.getElementById('histScenarioBtns');
                    var leg = document.getElementById('histLegend');
                    var sp = document.getElementById('histSourcesPanel');
                    var tl = document.getElementById('histTimeline');
                    var era = getHistEra();
                    row.innerHTML = '';
                    var regionSel = document.createElement('select');
                    regionSel.className = 'history-region-select';
                    regionSel.setAttribute('aria-label', t('regionAll'));
                    var regionOpts = [{ v: 'all', k: 'regionAll' }, { v: 'me', k: 'regionME' }, { v: 'europe', k: 'regionEU' }, { v: 'asia', k: 'regionAS' }, { v: 'africa', k: 'regionAF' }, { v: 'americas', k: 'regionAM' }];
                    var present = {};
                    (historicalErasData || []).forEach(function(e) { present[e.region] = true; });
                    regionOpts.forEach(function(o) {
                        if (o.v !== 'all' && !present[o.v]) return;
                        var op = document.createElement('option');
                        op.value = o.v;
                        op.textContent = t(o.k);
                        if (o.v === historyRegionFilter) op.selected = true;
                        regionSel.appendChild(op);
                    });
                    regionSel.addEventListener('change', function() {
                        historyRegionFilter = this.value;
                        renderEraTabContent();
                    });
                    row.appendChild(regionSel);
                    if (!era) {
                        row.innerHTML = '<span class="history-loading">' + htmlEscape(t('histEraLoading')) + '</span>';
                        leg.innerHTML = '';
                        tl.style.display = 'none';
                        sp.innerHTML = '';
                        fetchHistoricalEras().then(function() {
                            if (historyTab !== 'eras') return;
                            if (!historyEraId && historicalErasData.length) historyEraId = historicalErasData[0].id;
                            renderHistoryBar();
                            drawEraScene();
                        }).catch(function() {
                            if (historyTab !== 'eras') return;
                            var r2 = document.getElementById('histScenarioBtns');
                            if (r2) r2.innerHTML = '<span class="history-loading">' + htmlEscape(t('histEraLoadError')) + '</span>';
                        });
                        return;
                    }
                    var filtered = historicalErasData.filter(function(e) {
                        return historyRegionFilter === 'all' || e.region === historyRegionFilter || e.region === 'world';
                    });
                    filtered.forEach(function(e) {
                        var b = document.createElement('button');
                        b.type = 'button';
                        b.className = 'btn history-scenario-btn' + (e.id === historyEraId ? ' active' : '');
                        b.textContent = (e.yearLabel || '') + ' · ' + locField(e, 'title');
                        b.title = locField(e, 'desc');
                        b.addEventListener('click', function() {
                            historyEraId = e.id;
                            renderHistoryBar();
                            drawEraScene();
                            if (selectedCountry && selectedFeatureType === 'history' && countryPanel.classList.contains('visible')) openHistoryPanel(selectedCountry);
                        });
                        row.appendChild(b);
                    });
                    var min = -600, max = 1650;
                    tl.style.display = 'block';
                    tl.innerHTML = '';
                    filtered.forEach(function(e) {
                        var dot = document.createElement('button');
                        dot.type = 'button';
                        dot.className = 'history-tl-dot' + (e.id === historyEraId ? ' active' : '');
                        dot.style.left = Math.max(0, Math.min(100, (e.sort - min) / (max - min) * 100)) + '%';
                        dot.title = (e.yearLabel || '') + ' · ' + locField(e, 'title');
                        dot.setAttribute('aria-label', dot.title);
                        dot.addEventListener('click', function() {
                            historyEraId = e.id;
                            renderHistoryBar();
                            drawEraScene();
                        });
                        tl.appendChild(dot);
                    });
                    leg.innerHTML = '<span class="control-label">' + t('histLegendLabel') + '</span>';
                    era.polities.forEach(function(p) {
                        var chip = document.createElement('span');
                        chip.className = 'hist-chip';
                        chip.title = locField(p, 'name');
                        var sw = document.createElement('span');
                        sw.className = 'hist-chip-swatch';
                        sw.style.background = p.color;
                        chip.appendChild(sw);
                        chip.appendChild(document.createTextNode(locField(p, 'name')));
                        leg.appendChild(chip);
                    });
                    sp.innerHTML = '<h4>' + htmlEscape(t('histSourcesTitle')) + '</h4><ul>' +
                        (era.sources || []).map(function(s) { return '<li>' + htmlEscape(s) + '</li>'; }).join('') + '</ul>';
                    if (historyActive && window.updateHash) window.updateHash();
                }
                function selectHistoryTab(tab) {
                    historyTab = tab;
                    if (tab === 'eras') {
                        if (!historicalErasData) {
                            historyEraId = null;
                            renderHistoryBar();
                            if (gHistoryOverlay) gHistoryOverlay.selectAll('*').remove();
                            fetchHistoricalEras().then(function() {
                                if (historyTab !== 'eras') return;
                                if (!historyEraId && historicalErasData.length) historyEraId = historicalErasData[0].id;
                                renderHistoryBar();
                                drawEraScene();
                            }).catch(function() {
                                var row = document.getElementById('histScenarioBtns');
                                if (row && historyTab === 'eras') row.innerHTML = '<span class="history-loading">' + htmlEscape(t('histEraLoadError')) + '</span>';
                            });
                            return;
                        }
                        if (!historyEraId && historicalErasData.length) historyEraId = historicalErasData[0].id;
                        renderHistoryBar();
                        drawEraScene();
                        return;
                    }
                    renderHistoryBar();
                    drawHistoryScenario();
                }

                var quizSavedMapState = null;

                // ── Map state capture/restore for quiz ──
                function resetMapToNormalForQuiz() {
                    // Save current state from registry
                    quizSavedMapState = { colorMode: colorMode, currentReligionFilter: currentReligionFilter };
                    if (window.historyIsActive && window.historyIsActive()) exitHistoryMode(true);
                    Object.keys(LAYER_DEFS).forEach(function(name) {
                        quizSavedMapState[name] = LAYER_DEFS[name].getFlag();
                    });
                    // Turn off every active layer via its toggle function
                    Object.keys(LAYER_DEFS).forEach(function(name) {
                        if (LAYER_DEFS[name].getFlag()) {
                            toggleLayerByName(name);
                        }
                    });
                    if (currentReligionFilter !== 'all') {
                        currentReligionFilter = 'all';
                        setActiveByAttr(religionButtons, '.religion-btn[data-religion="all"]');
                    }
                    if (colorMode !== 'normal') setMode('normal');
                }

                function restoreMapStateAfterQuiz() {
                    if (!quizSavedMapState) return;
                    var s = quizSavedMapState;
                    quizSavedMapState = null;
                    // Restore every layer that was on before the quiz
                    Object.keys(LAYER_DEFS).forEach(function(name) {
                        if (s[name] && !LAYER_DEFS[name].getFlag()) {
                            toggleLayerByName(name);
                        }
                    });
                    if (s.currentReligionFilter !== 'all') {
                        currentReligionFilter = s.currentReligionFilter;
                        setActiveByAttr(religionButtons, '.religion-btn[data-religion="' + s.currentReligionFilter + '"]');
                    }
                    if (s.colorMode !== colorMode) setMode(s.colorMode);
                }

                function enterQuizMode() {
                    resetMapToNormalForQuiz();
                    quizActive = true;
                    if (globeViewBtn) { globeViewBtn.disabled = true; globeViewBtn.classList.add('quiz-disabled'); }
                    quizCurrentIndex = 0;
                    quizScore = 0;
                    quizResults = [];
                    quizStartTime = Date.now();
                    quizQuestions = generateQuestions();
                    if (quizQuestions.length === 0) { exitQuizMode(); return; }

                    document.body.classList.add('quiz-active');
                    mapContainer.classList.add('quiz-active');
                    quizSetupOverlay.style.display = 'none';
                    quizEndOverlay.style.display = 'none';

                    quizHudOverlay.style.display = '';
                    updateQuizHud();

                    quizTimerEnabled = quizTimeModeSet.checked;
                    if (quizTimerEnabled) {
                        quizTimeLeft = (parseInt(quizTimeInput.value) || 5) * 60;
                        quizHudTimer.style.display = '';
                        updateTimerDisplay();
                        quizTimerInterval = setInterval(function() {
                            quizTimeLeft--;
                            updateTimerDisplay();
                            if (quizTimeLeft <= 0) {
                                finishQuizOrReview('timeUp');
                            }
                        }, 1000);
                    } else {
                        quizHudTimer.style.display = 'none';
                    }

                    quizClickHandler = function(e) {
                        if (!quizActive) return;
                        if (measureActive) return;
                        if (e.target.closest('.quiz-overlay, .quiz-hud-prompt-banner, .quiz-hud-meta-row, .quiz-feedback')) {
                            return;
                        }
                        e.preventDefault();
                        e.stopPropagation();
                        handleQuizClick(e);
                    };
                    mapContainer.addEventListener('click', quizClickHandler, true);
                    quizQuestionStartTime = performance.now();
                }

                function exitQuizMode() {
                    quizActive = false;
                    clearQuizMarkers();
                    if (globeViewBtn) { globeViewBtn.disabled = false; globeViewBtn.classList.remove('quiz-disabled'); }
                    if (quizBtn) { quizBtn.disabled = false; quizBtn.classList.remove('quiz-disabled'); quizBtn.title = t('quizMode'); }
                    document.body.classList.remove('quiz-active');
                    mapContainer.classList.remove('quiz-active');
                    quizSetupOverlay.style.display = 'none';
                    quizHudOverlay.style.display = 'none';
                    quizEndOverlay.style.display = 'none';
                    quizFeedback.style.display = 'none';
                    stopTimer();
                    restoreMapStateAfterQuiz();
                    if (quizClickHandler) {
                        mapContainer.removeEventListener('click', quizClickHandler, true);
                        quizClickHandler = null;
                    }
                    clearTimeout(quizFeedbackTimeout);
                    clearTimeout(quizAdvanceTimeout);
                }

                function updateQuizHud() {
                    var q = quizQuestions[quizCurrentIndex];
                    quizHudQuestion.textContent = t('quizQuestionOf', { current: quizCurrentIndex + 1, total: quizQuestions.length });
                    quizHudPrompt.textContent = t('quizFind') + ': ' + q.name;
                    quizHudScore.textContent = t('quizScore') + ': ' + quizScore;
                    quizTypedAnswerInput.value = '';
                    if (globeModeActive) {
                        var targetCoords = getQuestionTargetCoords(q);
                        if (targetCoords) rotateGlobeToReveal(targetCoords);
                    }
                }

                function updateTimerDisplay() {
                    var m = Math.floor(quizTimeLeft / 60);
                    var s = quizTimeLeft % 60;
                    quizHudTimer.textContent = t('quizTimeRemaining') + ': ' + m + ':' + (s < 10 ? '0' : '') + s;
                }

                function stopTimer() {
                    if (quizTimerInterval) { clearInterval(quizTimerInterval); quizTimerInterval = null; }
                }

                function handleQuizClick(e) {
                    var rect = getMapRect();
                    var clickX = e.clientX - rect.left;
                    var clickY = e.clientY - rect.top;
                    var svgPoint = currentTransform.invert([clickX, clickY]);
                    var coords = getActiveProjection().invert(svgPoint);
                    if (!coords || isNaN(coords[0]) || isNaN(coords[1])) return;

                    var q = quizQuestions[quizCurrentIndex];
                    var correct = checkAnswer(q, coords, clickX, clickY);

                    var timeTaken = (performance.now() - quizQuestionStartTime) / 1000;
                    quizResults.push({
                        questionId: quizCurrentIndex,
                        layerType: q.layerId,
                        studentAnswer: { x: coords[0], y: coords[1] },
                        correct: correct,
                        timeTakenSeconds: Math.round(timeTaken * 10) / 10
                    });

                    if (correct) {
                        quizScore++;
                        showFeedback(true, q);
                    } else {
                        showFeedback(false, q);
                    }
                }

                function checkAnswer(q, coords, clickX, clickY) {
                    var layer = QUIZ_LAYERS.find(function(l) { return l.id === q.layerId; });
                    if (!layer) return false;
                    var item = q.item;

                    if (layer.checkType === 'polygon') {
                        return checkPolygon(item, q.layerId, coords);
                    }
                    if (layer.checkType === 'bloc') {
                        return checkBloc(item, coords);
                    }
                    if (layer.checkType === 'line') {
                        return checkLine(item, coords, clickX, clickY);
                    }
                    return checkPoint(item, q.layerId, clickX, clickY);
                }

                function checkPolygon(item, layerId, coords) {
                    if (layerId === 'desertsForests' && item.coords) {
                        var pts = item.coords;
                        if (pts.length >= 3) {
                            var polyCoords = pts.concat([pts[0]]);
                            var poly = { type: 'Polygon', coordinates: [polyCoords] };
                            try { if (d3.geoContains(poly, coords)) return true; } catch(e) {}
                        }
                    }
                    if (layerId === 'countries') {
                        try { if (d3.geoContains(item, coords)) return true; } catch(e) {}
                    }
                    return false;
                }

                function checkBloc(bloc, coords) {
                    for (var i = 0; i < allCountryFeatures.length; i++) {
                        var f = allCountryFeatures[i];
                        var fname = f.properties?.name || '';
                        if (bloc.members.some(function(m) { return getCleanName(m) === getCleanName(fname); })) {
                            try { if (d3.geoContains(f, coords)) return true; } catch(e) {}
                        }
                    }
                    return false;
                }

                function checkPoint(item, layerId, clickX, clickY) {
                    var pt = getItemCoords(item, layerId);
                    if (!pt || pt.length < 2) return false;
                    var projected = getActiveProjection()(pt);
                    if (!projected || isNaN(projected[0])) return false;
                    var k = Math.max(0.4, currentTransform.k);
                    var tx = currentTransform.x;
                    var ty = currentTransform.y;
                    var sx = projected[0] * k + tx;
                    var sy = projected[1] * k + ty;
                    var dist = Math.sqrt(Math.pow(clickX - sx, 2) + Math.pow(clickY - sy, 2));
                    return dist < 32;
                }

                function checkLine(item, coords, clickX, clickY) {
                    var pts = item.coords;
                    if (!pts || pts.length < 2) return false;
                    var proj = getActiveProjection();
                    var k = Math.max(0.4, currentTransform.k);
                    var tx = currentTransform.x;
                    var ty = currentTransform.y;
                    var minDist = Infinity;
                    for (var i = 0; i < pts.length - 1; i++) {
                        var pa = proj(pts[i]);
                        var pb = proj(pts[i + 1]);
                        if (!pa || !pb || isNaN(pa[0]) || isNaN(pb[0])) continue;
                        var ax = pa[0] * k + tx;
                        var ay = pa[1] * k + ty;
                        var bx = pb[0] * k + tx;
                        var by = pb[1] * k + ty;
                        var dx = bx - ax, dy = by - ay;
                        var lenSq = dx * dx + dy * dy;
                        var t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, ((clickX - ax) * dx + (clickY - ay) * dy) / lenSq));
                        var projX = ax + t * dx;
                        var projY = ay + t * dy;
                        var d = Math.sqrt(Math.pow(clickX - projX, 2) + Math.pow(clickY - projY, 2));
                        if (d < minDist) minDist = d;
                    }
                    return minDist < 20;
                }

                function showFeedback(correct, q) {
                    clearTimeout(quizFeedbackTimeout);
                    clearTimeout(quizAdvanceTimeout);
                    quizFeedback.style.display = '';
                    quizFeedback.className = 'quiz-feedback ' + (correct ? 'correct' : 'incorrect');
                    quizFeedback.textContent = correct ? t('quizCorrect') : t('quizIncorrect') + ' ' + t('quizTheAnswerWas') + ' ' + q.name;

                    var delay = correct ? 1500 : 2500;
                    quizAdvanceTimeout = setTimeout(function() {
                        quizFeedback.style.display = 'none';
                        quizCurrentIndex++;
                        if (quizCurrentIndex >= quizQuestions.length) {
                            finishQuizOrReview('completed');
                        } else {
                            quizQuestionStartTime = performance.now();
                            updateQuizHud();
                        }
                    }, delay);
                }

                function showFeedbackPending() {
                    clearTimeout(quizFeedbackTimeout);
                    clearTimeout(quizAdvanceTimeout);
                    quizFeedback.style.display = '';
                    quizFeedback.className = 'quiz-feedback pending';
                    quizFeedback.textContent = t('quizAnswerSubmittedPending');
                    quizAdvanceTimeout = setTimeout(function() {
                        quizFeedback.style.display = 'none';
                        quizCurrentIndex++;
                        if (quizCurrentIndex >= quizQuestions.length) {
                            finishQuizOrReview('completed');
                        } else {
                            quizQuestionStartTime = performance.now();
                            updateQuizHud();
                        }
                    }, 1200);
                }

                function handleQuizTypedSubmit() {
                    if (!quizActive) return;
                    var answerText = quizTypedAnswerInput.value.trim();
                    if (!answerText) return;
                    var q = quizQuestions[quizCurrentIndex];
                    var timeTaken = (performance.now() - quizQuestionStartTime) / 1000;
                    quizResults.push({
                        questionId: quizCurrentIndex,
                        layerType: q.layerId,
                        studentAnswer: answerText,
                        correct: null,
                        status: 'pending',
                        promptText: t('quizFind') + ': ' + q.name,
                        timeTakenSeconds: Math.round(timeTaken * 10) / 10
                    });
                    quizTypedAnswerInput.value = '';
                    showFeedbackPending();
                }

                function finishQuizOrReview(exitType) {
                    var pending = quizResults.filter(function(r) { return r.status === 'pending'; });
                    if (pending.length > 0) {
                        enterReviewMode(pending, function() {
                            quizReviewOverlay.style.display = 'none';
                            endQuiz(exitType);
                        });
                    } else {
                        endQuiz(exitType);
                    }
                }

                function endQuiz(exitType) {
                    stopTimer();
                    quizActive = false;
                    if (globeViewBtn) { globeViewBtn.disabled = false; globeViewBtn.classList.remove('quiz-disabled'); }
                    if (quizBtn) { quizBtn.disabled = false; quizBtn.classList.remove('quiz-disabled'); quizBtn.title = t('quizMode'); }
                    clearTimeout(quizFeedbackTimeout);
                    clearTimeout(quizAdvanceTimeout);
                    if (quizClickHandler) {
                        mapContainer.removeEventListener('click', quizClickHandler, true);
                        quizClickHandler = null;
                    }

                    if (exitType === 'endedEarly') {
                        for (var qi = quizCurrentIndex; qi < quizQuestions.length; qi++) {
                            quizResults.push({
                                questionId: qi,
                                layerType: quizQuestions[qi].layerId,
                                studentAnswer: null,
                                correct: null,
                                status: 'skipped'
                            });
                        }
                    }

                    var answered = quizResults.filter(function(r) { return r.status !== 'skipped'; });
                    var answeredCorrect = quizResults.filter(function(r) { return r.correct === true; });
                    var skipped = quizResults.filter(function(r) { return r.status === 'skipped'; });

                    document.body.classList.remove('quiz-active');
                    mapContainer.classList.remove('quiz-active');
                    quizHudOverlay.style.display = 'none';
                    quizFeedback.style.display = 'none';

                    quizEndOverlay.style.display = '';
                    var titleEl = document.getElementById('quizEndTitle');
                    if (exitType === 'endedEarly') {
                        titleEl.textContent = t('quizEndedEarly');
                    } else if (exitType === 'timeUp') {
                        titleEl.textContent = t('quizTimeUp');
                    } else {
                        titleEl.textContent = t('quizComplete');
                    }
                    quizFinalScore.textContent = t('quizFinalScore') + ': ' + answeredCorrect.length + '/' + answered.length + ' ' + t('quizAnswered');

                    quizMissedList.innerHTML = '';
                    var missed = quizResults.filter(function(r) { return r.correct === false; });
                    if (missed.length > 0) {
                        document.getElementById('quizMissedLabel').textContent = t('quizMissedQuestions');
                        missed.forEach(function(r) {
                            var q = quizQuestions[r.questionId];
                            var layerLabel = t(QUIZ_LAYERS.find(function(l) { return l.id === q.layerId; }).labelKey);
                            var div = document.createElement('div');
                            div.className = 'quiz-missed-item';
                            div.innerHTML = '<div>' + escapeHtml(q.name) + '</div><div class="quiz-missed-layer">' + escapeHtml(layerLabel) + '</div>';
                            quizMissedList.appendChild(div);
                        });
                    } else {
                        document.getElementById('quizMissedLabel').textContent = '';
                    }

                    var timeTaken = quizStartTime ? Math.round((Date.now() - quizStartTime) / 1000) : null;
                    saveQuizResultsToFirestore(quizResults, answeredCorrect.length, answered.length, timeTaken);
                }
                function saveCustomQuestionsLibrary(lib) {
                    try { localStorage.setItem('lepidosCustomQuestions', JSON.stringify(lib)); } catch(e) {}
                }
                function loadCustomQuestionsLibrary() {
                    try {
                        var raw = localStorage.getItem('lepidosCustomQuestions');
                        return raw ? JSON.parse(raw) : [];
                    } catch(e) { return []; }
                }
                customQuestionsLibrary = loadCustomQuestionsLibrary();

                function exitAllQuizOverlays() {
                    quizSetupOverlay.style.display = 'none';
                    quizModeChoiceOverlay.style.display = 'none';
                    quizCustomSetupOverlay.style.display = 'none';
                    quizAuthoringOverlay.style.display = 'none';
                    quizAuthoringBanner.style.display = 'none';
                    quizReviewOverlay.style.display = 'none';
                    quizEndOverlay.style.display = 'none';
                    quizHudOverlay.style.display = 'none';
                    quizFeedback.style.display = 'none';
                }

                function exitQuizModeClean() {
                    if (globeViewBtn) { globeViewBtn.disabled = false; globeViewBtn.classList.remove('quiz-disabled'); }
                    if (quizBtn) { quizBtn.disabled = false; quizBtn.classList.remove('quiz-disabled'); quizBtn.title = t('quizMode'); }
                    exitAllQuizOverlays();
                    exitAuthoringMode();
                    exitCustomQuiz();
                    document.body.classList.remove('quiz-active');
                    mapContainer.classList.remove('quiz-active');
                }

                // ── Quiz Mode Choice Screen ──
                quizBtn.addEventListener('click', function() {
                    if (quizActive) return;
                    if (globeViewBtn) { globeViewBtn.disabled = true; globeViewBtn.classList.add('quiz-disabled'); }
                    exitAllQuizOverlays();
                    quizHudPrompt.textContent = '';
                    quizHudQuestion.textContent = '';
                    quizHudScore.textContent = '';
                    quizHudTimer.textContent = '';
                    initI18nQuizChoice();
                    quizModeChoiceOverlay.style.display = '';
                });

                quizModeChoiceOverlay.addEventListener('click', function(e) {
                    if (e.target === quizModeChoiceOverlay) exitQuizModeClean();
                });

                function initI18nQuizChoice() {
                    document.getElementById('quizModeChoiceTitle').textContent = t('quizModeChoiceTitle');
                    document.getElementById('quizSelectiveQuestionsLabel').textContent = t('quizSelectiveQuestions');
                    document.getElementById('quizSelectiveDescLabel').textContent = t('quizSelectiveDesc');
                    document.getElementById('quizSetQuestionsLabel').textContent = t('quizSetQuestions');
                    document.getElementById('quizSetDescLabel').textContent = t('quizSetDesc');
                }

                quizChoiceSelective.addEventListener('click', function() {
                    quizModeChoiceOverlay.style.display = 'none';
                    initQuizSetup();
                    quizSetupOverlay.style.display = '';
                });

                quizChoiceCustom.addEventListener('click', function() {
                    quizModeChoiceOverlay.style.display = 'none';
                    initCustomQuizSetup(true);
                    quizCustomSetupOverlay.style.display = '';
                });

                quizCustomCloseBtn.addEventListener('click', function() {
                    exitQuizModeClean();
                });

                // ── Custom Quiz Setup ──
                function initCustomQuizSetup(isFreshOpen) {
                    document.getElementById('quizCustomSetupTitle').textContent = t('quizCustomSetup');
                    document.getElementById('quizTimeLabel2').textContent = t('quizTimeLimit');
                    document.getElementById('quizNoLimitText2').textContent = t('quizNoLimit');
                    document.getElementById('quizSetLimitText2').textContent = t('quizSetLimitText');
                    document.getElementById('quizMinutesText2').textContent = t('quizMinutes');
                    document.getElementById('quizSelectedLabel').textContent = t('quizSelectedQuestions');
                    document.getElementById('quizCustomSelectedEmpty').textContent = t('quizClickToAdd');
                    document.getElementById('quizLibraryTitle').textContent = t('quizLibrary');
                    document.getElementById('quizSessionNewLabel').textContent = t('quizSessionNewLabel');
                    document.getElementById('quizSessionNewEmpty').textContent = t('quizSessionNewEmpty');
                    quizCustomStartBtn.textContent = t('quizStartCustomQuiz');
                    quizCustomSearch.placeholder = t('quizSearchQuestions');
                    quizClearAllBtn.textContent = t('quizClearAll');
                    quizCustomSearch.value = '';
                    customQuestionsLibrary = loadCustomQuestionsLibrary();
                    if (isFreshOpen) {
                        customQuizSelected = [];
                        sessionNewQuestionIds = [];
                    }
                    renderCustomQuestionsList();
                    renderSessionNewQuestionsList();
                    renderCustomSelectedList();

                    document.getElementById('quizCustomStudentNameInput').placeholder = t('quizStudentNamePlaceholder');
                    document.getElementById('quizCustomSessionCodeInput').placeholder = t('quizSessionCodePlaceholder');
                    var customCreateBtn = document.getElementById('quizCustomCreateSessionBtn');
                    customCreateBtn.textContent = t('quizCreateSession');
                    customCreateBtn.style.display = '';
                    document.getElementById('quizCustomSessionCreated').style.display = 'none';
                    if (currentSessionCode) {
                        document.getElementById('quizCustomSessionCodeInput').value = currentSessionCode;
                        document.getElementById('quizCustomStudentNameInput').value = currentStudentName || '';
                    }
                }

                function renderCustomQuestionsList() {
                    quizCustomList.innerHTML = '';
                    if (customQuestionsLibrary.length === 0) {
                        quizCustomEmptyMsg.style.display = '';
                        quizClearAllBtn.style.display = 'none';
                        return;
                    }
                    quizCustomEmptyMsg.style.display = 'none';
                    quizClearAllBtn.style.display = '';
                    customQuestionsLibrary.forEach(function(q, idx) {
                        if (sessionNewQuestionIds.indexOf(q.id) !== -1) return;
                        var item = document.createElement('div');
                        item.className = 'quiz-custom-item';
                        item.dataset.idx = idx;

                        var check = document.createElement('span');
                        check.className = 'quiz-custom-item-check';
                        if (customQuizSelected.indexOf(idx) !== -1) {
                            item.classList.add('quiz-custom-item-selected');
                            var mark = document.createElement('span');
                            mark.className = 'quiz-custom-item-check-mark';
                            mark.textContent = '\u2713';
                            check.appendChild(mark);
                        }

                        var text = document.createElement('span');
                        text.className = 'quiz-custom-item-text';
                        text.textContent = q.promptText || ('Q' + (idx + 1));

                        var typeBadge = document.createElement('span');
                        typeBadge.className = 'quiz-custom-item-type';
                        typeBadge.textContent = q.type === 'line' ? '\u2504' : '\u25CF';

                        var delBtn = document.createElement('button');
                        delBtn.className = 'quiz-custom-item-delete';
                        delBtn.textContent = '\u00d7';
                        delBtn.addEventListener('click', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            customQuestionsLibrary.splice(idx, 1);
                            saveCustomQuestionsLibrary(customQuestionsLibrary);
                            customQuizSelected = customQuizSelected.filter(function(si) {
                                return si !== idx;
                            }).map(function(si) { return si > idx ? si - 1 : si; });
                            renderCustomQuestionsList();
                            renderCustomSelectedList();
                        });

                        item.addEventListener('click', function(e) {
                            if (e.target === delBtn || e.target.closest('.quiz-custom-item-delete')) return;
                            toggleQuestionSelection(idx);
                        });

                        item.appendChild(check);
                        item.appendChild(text);
                        item.appendChild(typeBadge);
                        item.appendChild(delBtn);
                        quizCustomList.appendChild(item);
                    });
                    updateCustomStartBtn();
                }

                function toggleQuestionSelection(idx) {
                    var pos = customQuizSelected.indexOf(idx);
                    if (pos === -1) {
                        customQuizSelected.push(idx);
                    } else {
                        customQuizSelected.splice(pos, 1);
                    }
                    renderCustomQuestionsList();
                    renderCustomSelectedList();
                    updateCustomStartBtn();
                }

                function renderCustomSelectedList() {
                    var container = document.getElementById('quizCustomSelectedList');
                    var emptyMsg = document.getElementById('quizCustomSelectedEmpty');
                    container.innerHTML = '';
                    if (customQuizSelected.length === 0) {
                        emptyMsg.style.display = '';
                        return;
                    }
                    emptyMsg.style.display = 'none';
                    customQuizSelected.forEach(function(idx) {
                        var q = customQuestionsLibrary[idx];
                        if (!q) return;
                        var tag = document.createElement('span');
                        tag.className = 'quiz-selected-tag';
                        var label = document.createElement('span');
                        label.className = 'quiz-selected-tag-text';
                        label.textContent = q.promptText || ('Q' + (idx + 1));
                        var remove = document.createElement('span');
                        remove.className = 'quiz-selected-tag-remove';
                        remove.textContent = '\u00d7';
                        remove.addEventListener('click', function(e) {
                            e.stopPropagation();
                            toggleQuestionSelection(idx);
                        });
                        tag.appendChild(label);
                        tag.appendChild(remove);
                        container.appendChild(tag);
                    });
                }

                function updateCustomStartBtn() {
                    quizCustomStartBtn.disabled = (customQuizSelected.length === 0 && sessionNewQuestionIds.length === 0);
                }

                function renderSessionNewQuestionsList() {
                    var container = document.getElementById('quizSessionNewList');
                    var emptyMsg = document.getElementById('quizSessionNewEmpty');
                    if (!container || !emptyMsg) return;
                    container.innerHTML = '';
                    if (sessionNewQuestionIds.length === 0) {
                        emptyMsg.style.display = '';
                        return;
                    }
                    emptyMsg.style.display = 'none';
                    sessionNewQuestionIds.forEach(function(qid) {
                        var idx = customQuestionsLibrary.findIndex(function(q) { return q.id === qid; });
                        if (idx === -1) return;
                        var q = customQuestionsLibrary[idx];
                        var item = document.createElement('div');
                        item.className = 'quiz-session-new-item';
                        var text = document.createElement('span');
                        text.className = 'quiz-session-new-item-text';
                        text.textContent = q.promptText || ('Q' + (idx + 1));
                        var remove = document.createElement('span');
                        remove.className = 'quiz-session-new-item-remove';
                        remove.textContent = '\u00d7';
                        remove.addEventListener('click', function(e) {
                            e.stopPropagation();
                            customQuestionsLibrary.splice(idx, 1);
                            saveCustomQuestionsLibrary(customQuestionsLibrary);
                            sessionNewQuestionIds = sessionNewQuestionIds.filter(function(id) { return id !== qid; });
                            renderCustomQuestionsList();
                            renderSessionNewQuestionsList();
                            renderCustomSelectedList();
                            updateCustomStartBtn();
                        });
                        item.appendChild(text);
                        item.appendChild(remove);
                        container.appendChild(item);
                    });
                }

                quizCreateBtn.addEventListener('click', function() {
                    quizCustomSetupOverlay.style.display = 'none';
                    enterAuthoringMode();
                });

                quizCustomTimeSet.addEventListener('change', function() {
                    quizCustomTimeInputWrap.style.display = quizCustomTimeSet.checked ? '' : 'none';
                });
                quizCustomTimeNone.addEventListener('change', function() {
                    quizCustomTimeInputWrap.style.display = 'none';
                });

                quizCustomStartBtn.addEventListener('click', function() {
                    handleJoinSession(
                        document.getElementById('quizCustomStudentNameInput'),
                        document.getElementById('quizCustomSessionCodeInput')
                    );
                    startCustomQuiz();
                });

                quizCustomSearch.addEventListener('input', function(e) {
                    var query = e.target.value.trim().toLowerCase();
                    quizCustomList.querySelectorAll('.quiz-custom-item').forEach(function(item) {
                        var text = item.querySelector('.quiz-custom-item-text').textContent.toLowerCase();
                        item.style.display = (query === '' || text.indexOf(query) !== -1) ? '' : 'none';
                    });
                });

                quizClearAllBtn.addEventListener('click', function() {
                    if (customQuestionsLibrary.length === 0) return;
                    var confirmed = confirm(t('quizClearAllConfirm', { count: customQuestionsLibrary.length }));
                    if (!confirmed) return;
                    customQuestionsLibrary = [];
                    customQuizSelected = [];
                    saveCustomQuestionsLibrary(customQuestionsLibrary);
                    renderCustomQuestionsList();
                    renderCustomSelectedList();
                    updateCustomStartBtn();
                });

                // ── Authoring Mode ──
                function clearAuthoringMarkers() {
                    gAuthoringMarkers.selectAll('*').remove();
                }
                function drawAuthoringMarker(coords, kind) {
                    var xy = projection(coords);
                    if (!xy || isNaN(xy[0])) return;
                    if (kind === 'point') {
                        gAuthoringMarkers.append('circle')
                            .attr('cx', xy[0]).attr('cy', xy[1]).attr('r', 8)
                            .attr('fill', 'var(--brand-accent)').attr('stroke', '#fff').attr('stroke-width', 2)
                            .attr('vector-effect', 'non-scaling-stroke');
                    } else if (kind === 'line-start') {
                        gAuthoringMarkers.append('circle')
                            .attr('class', 'authoring-line-start')
                            .attr('cx', xy[0]).attr('cy', xy[1]).attr('r', 6)
                            .attr('fill', 'var(--brand-accent)').attr('stroke', '#fff').attr('stroke-width', 2)
                            .attr('vector-effect', 'non-scaling-stroke');
                    } else if (kind === 'line-end') {
                        gAuthoringMarkers.append('circle')
                            .attr('cx', xy[0]).attr('cy', xy[1]).attr('r', 6)
                            .attr('fill', 'var(--brand-accent)').attr('stroke', '#fff').attr('stroke-width', 2)
                            .attr('vector-effect', 'non-scaling-stroke');
                        var start = projection(authoringLinePoints[0]);
                        gAuthoringMarkers.append('line')
                            .attr('x1', start[0]).attr('y1', start[1])
                            .attr('x2', xy[0]).attr('y2', xy[1])
                            .attr('stroke', 'var(--brand-accent)').attr('stroke-width', 3)
                            .attr('vector-effect', 'non-scaling-stroke');
                    }
                }
                function clearQuizMarkers() {
                    gQuizMarkers.selectAll('*').remove();
                }
                function drawQuizMarker(coords, kind) {
                    var proj = getActiveProjection();
                    var xy = proj(coords);
                    if (!xy || isNaN(xy[0])) return;
                    if (kind === 'point') {
                        gQuizMarkers.append('circle')
                            .attr('cx', xy[0]).attr('cy', xy[1]).attr('r', 8)
                            .attr('fill', 'var(--brand-accent)').attr('stroke', '#fff').attr('stroke-width', 2)
                            .attr('vector-effect', 'non-scaling-stroke');
                    } else if (kind === 'line-start') {
                        gQuizMarkers.append('circle')
                            .attr('cx', xy[0]).attr('cy', xy[1]).attr('r', 6)
                            .attr('fill', 'var(--brand-accent)').attr('stroke', '#fff').attr('stroke-width', 2)
                            .attr('vector-effect', 'non-scaling-stroke');
                    } else if (kind === 'line-end') {
                        gQuizMarkers.append('circle')
                            .attr('cx', xy[0]).attr('cy', xy[1]).attr('r', 6)
                            .attr('fill', 'var(--brand-accent)').attr('stroke', '#fff').attr('stroke-width', 2)
                            .attr('vector-effect', 'non-scaling-stroke');
                        var start = proj(coords._startCoords);
                        if (start && !isNaN(start[0])) {
                            gQuizMarkers.append('line')
                                .attr('x1', start[0]).attr('y1', start[1])
                                .attr('x2', xy[0]).attr('y2', xy[1])
                                .attr('stroke', 'var(--brand-accent)').attr('stroke-width', 3)
                                .attr('vector-effect', 'non-scaling-stroke');
                        }
                    }
                }
                function drawQuizLineMarker(lineCoords) {
                    if (!lineCoords || lineCoords.length < 2) return;
                    var proj = getActiveProjection();
                    for (var i = 0; i < lineCoords.length; i++) {
                        var kind = i === 0 ? 'line-start' : 'line-end';
                        if (i === lineCoords.length - 1 && i > 0) {
                            kind = 'line-end';
                            var marker = { _startCoords: lineCoords[0] };
                            var xy = proj(lineCoords[i]);
                            if (!xy || isNaN(xy[0])) continue;
                            gQuizMarkers.append('circle')
                                .attr('cx', xy[0]).attr('cy', xy[1]).attr('r', 6)
                                .attr('fill', 'var(--brand-accent)').attr('stroke', '#fff').attr('stroke-width', 2)
                                .attr('vector-effect', 'non-scaling-stroke');
                            var start = proj(lineCoords[0]);
                            gQuizMarkers.append('line')
                                .attr('x1', start[0]).attr('y1', start[1])
                                .attr('x2', xy[0]).attr('y2', xy[1])
                                .attr('stroke', 'var(--brand-accent)').attr('stroke-width', 3)
                                .attr('vector-effect', 'non-scaling-stroke');
                        } else {
                            drawQuizMarker(lineCoords[i], kind);
                        }
                    }
                }
                function enterAuthoringMode() {
                    authoringActive = true;
                    clearAuthoringMarkers();
                    authoringMarkerType = 'point';
                    authoringLinePoints = [];
                    authoringChoices = [{ text: '', correct: false }, { text: '', correct: false }];
                    quizMarkerPoint.checked = true;
                    quizAnswerFormatTF.checked = false;
                    quizAnswerFormatWritten.checked = false;
                    quizAnswerFormatMC.checked = false;
                    quizPromptInput.value = '';
                    quizAuthoringStatusRow.style.display = 'none';
                    quizAuthoringFormFields.style.display = 'none';
                    quizAuthoringTFAnswerRow.style.display = 'none';
                    quizAuthoringMCChoicesRow.style.display = 'none';
                    quizAuthoringActions.style.display = 'none';

                    document.getElementById('quizAuthoringTitle').textContent = t('quizCreateTitle');
                    document.getElementById('quizMarkerTypeLabel').textContent = t('quizMarkerType');
                    document.getElementById('quizPointMarkerLabel').textContent = t('quizPointMarker');
                    document.getElementById('quizLineMarkerLabel').textContent = t('quizLineMarker');
                    document.getElementById('quizPromptLabel').textContent = t('quizPromptLabel');
                    quizPromptInput.placeholder = t('quizPromptPlaceholder');
                    document.getElementById('quizAnswerFormatLabel').textContent = t('quizAnswerFormat');
                    document.getElementById('quizTrueFalseStatementLabel').textContent = t('quizTrueFalseStatement');
                    document.getElementById('quizWrittenAnswerLabel').textContent = t('quizWrittenAnswerLabel');
                    document.getElementById('quizMultipleChoiceLabel').textContent = t('quizMultipleChoiceLabel');
                    document.getElementById('quizChoicesLabel').textContent = t('quizChoicesLabel');
                    document.getElementById('quizCorrectAnswerLabel').textContent = t('quizCorrectAnswer');
                    document.getElementById('quizTrueLabel').textContent = t('quizTrue');
                    document.getElementById('quizFalseLabel').textContent = t('quizFalse');
                    quizTFAnswerTrue.checked = true;
                    renderAuthoringChoices();

                    quizSaveQuestionBtn.textContent = t('quizSaveQuestion');
                    quizSaveCancelBtn.textContent = t('quizCancel');
                    quizAddChoiceBtn.textContent = '+' + ' ' + t('quizAddChoiceLabel');

                    quizAuthoringBanner.style.display = '';
                    updateAuthoringInstruction();
                    quizAuthoringOverlay.style.display = '';

                    document.body.classList.add('quiz-active');
                    mapContainer.classList.add('quiz-active');

                    startAuthoringClicks();
                }

                function updateAuthoringInstruction() {
                    if (authoringMarkerType === 'line' && authoringLinePoints.length > 0) {
                        quizAuthoringInstruction.textContent = t('quizClickMapLineInstruction') + ' (' + authoringLinePoints.length + ')';
                    } else if (authoringMarkerType === 'line') {
                        quizAuthoringInstruction.textContent = t('quizClickMapLineInstruction');
                    } else {
                        quizAuthoringInstruction.textContent = t('quizClickMapInstruction');
                    }
                }

                function startAuthoringClicks() {
                    stopAuthoringClicks();
                    if (authoringMarkerType === 'line') {
                        authoringLineClickHandler = function(e) {
                            if (!authoringActive) return;
                            if (e.target.closest('.quiz-overlay, .quiz-authoring-banner, .quiz-feedback')) return;
                            e.preventDefault();
                            e.stopPropagation();
                            var rect = getMapRect();
                            var clickX = e.clientX - rect.left;
                            var clickY = e.clientY - rect.top;
                            var svgPoint = currentTransform.invert([clickX, clickY]);
                            var coords = projection.invert(svgPoint);
                            if (!coords || isNaN(coords[0]) || isNaN(coords[1])) return;
                            authoringLinePoints.push(coords);
                            drawAuthoringMarker(coords, authoringLinePoints.length === 1 ? 'line-start' : 'line-end');
                            if (authoringLinePoints.length >= 2) {
                                finalizeAuthoring();
                            } else {
                                updateAuthoringInstruction();
                            }
                        };
                        mapContainer.addEventListener('click', authoringLineClickHandler, true);
                    } else {
                        authoringClickHandler = function(e) {
                            if (!authoringActive) return;
                            if (e.target.closest('.quiz-overlay, .quiz-authoring-banner, .quiz-feedback')) return;
                            e.preventDefault();
                            e.stopPropagation();
                            var rect = getMapRect();
                            var clickX = e.clientX - rect.left;
                            var clickY = e.clientY - rect.top;
                            var svgPoint = currentTransform.invert([clickX, clickY]);
                            var coords = projection.invert(svgPoint);
                            if (!coords || isNaN(coords[0]) || isNaN(coords[1])) return;
                            drawAuthoringMarker(coords, 'point');
                            finalizeAuthoring(coords);
                        };
                        mapContainer.addEventListener('click', authoringClickHandler, true);
                    }
                }

                function stopAuthoringClicks() {
                    if (authoringClickHandler) { mapContainer.removeEventListener('click', authoringClickHandler, true); authoringClickHandler = null; }
                    if (authoringLineClickHandler) { mapContainer.removeEventListener('click', authoringLineClickHandler, true); authoringLineClickHandler = null; }
                    if (authoringDblClickHandler) { mapContainer.removeEventListener('dblclick', authoringDblClickHandler, true); authoringDblClickHandler = null; }
                }

                function finalizeAuthoring(pointCoords) {
                    if (pointCoords) {
                        authoringLinePoints = [pointCoords];
                    }
                    stopAuthoringClicks();
                    authoringActive = false;
                    quizAuthoringBanner.style.display = 'none';
                    quizAuthoringStatusRow.style.display = '';
                    quizAuthoringStatus.textContent = t('quizMarkerPlaced');
                    quizAuthoringFormFields.style.display = '';
                    quizAuthoringAnswerFormatRow.style.display = '';
                    quizAnswerFormatTF.checked = false;
                    quizAnswerFormatWritten.checked = false;
                    quizAnswerFormatMC.checked = false;
                    quizAuthoringTFAnswerRow.style.display = 'none';
                    quizAuthoringMCChoicesRow.style.display = 'none';
                    quizAuthoringActions.style.display = '';
                }

                function exitAuthoringMode() {
                    authoringActive = false;
                    authoringLinePoints = [];
                    authoringChoices = [{ text: '', correct: false }, { text: '', correct: false }];
                    stopAuthoringClicks();
                    clearAuthoringMarkers();
                    quizAuthoringBanner.style.display = 'none';
                    quizAuthoringOverlay.style.display = 'none';
                    quizAuthoringAnswerFormatRow.style.display = 'none';
                    quizAuthoringMCChoicesRow.style.display = 'none';
                    document.body.classList.remove('quiz-active');
                    mapContainer.classList.remove('quiz-active');
                }

                quizMarkerPoint.addEventListener('change', function() {
                    if (quizMarkerPoint.checked) {
                        authoringMarkerType = 'point';
                        authoringLinePoints = [];
                        updateAuthoringInstruction();
                        stopAuthoringClicks();
                        startAuthoringClicks();
                    }
                });
                quizMarkerLine.addEventListener('change', function() {
                    if (quizMarkerLine.checked) {
                        authoringMarkerType = 'line';
                        authoringLinePoints = [];
                        updateAuthoringInstruction();
                        stopAuthoringClicks();
                        startAuthoringClicks();
                    }
                });

                function updateAnswerFormatUI() {
                    var fmt = quizAnswerFormatTF.checked ? 'true_false' : quizAnswerFormatWritten.checked ? 'written' : quizAnswerFormatMC.checked ? 'mc' : null;
                    quizAuthoringTFAnswerRow.style.display = fmt === 'true_false' ? '' : 'none';
                    quizAuthoringMCChoicesRow.style.display = fmt === 'mc' ? '' : 'none';
                    if (fmt === 'true_false') {
                        quizPromptInput.placeholder = t('quizTrueFalsePlaceholder');
                    } else {
                        quizPromptInput.placeholder = t('quizPromptPlaceholder');
                    }
                }
                quizAnswerFormatTF.addEventListener('change', updateAnswerFormatUI);
                quizAnswerFormatWritten.addEventListener('change', updateAnswerFormatUI);
                quizAnswerFormatMC.addEventListener('change', updateAnswerFormatUI);

                function renderAuthoringChoices() {
                    quizAuthoringChoicesList.innerHTML = '';
                    authoringChoices.forEach(function(choice, i) {
                        var row = document.createElement('div');
                        row.className = 'quiz-choice-row' + (choice.correct ? ' correct-selected' : '');

                        var radio = document.createElement('input');
                        radio.type = 'radio';
                        radio.name = 'quizChoiceCorrect';
                        radio.checked = choice.correct;
                        radio.addEventListener('change', function() {
                            authoringChoices.forEach(function(c) { c.correct = false; });
                            choice.correct = true;
                            quizAuthoringChoicesList.querySelectorAll('.quiz-choice-row').forEach(function(r) {
                                r.classList.remove('correct-selected');
                            });
                            row.classList.add('correct-selected');
                        });

                        var input = document.createElement('input');
                        input.type = 'text';
                        input.className = 'quiz-input quiz-choice-input';
                        input.value = choice.text;
                        input.placeholder = t('quizChoicePlaceholder', { n: i + 1 });
                        input.addEventListener('input', function() { choice.text = input.value; });

                        row.appendChild(radio);
                        row.appendChild(input);

                        if (authoringChoices.length > 2) {
                            var removeBtn = document.createElement('button');
                            removeBtn.type = 'button';
                            removeBtn.className = 'btn quiz-choice-remove';
                            removeBtn.textContent = '\u2715';
                            removeBtn.addEventListener('click', function() {
                                authoringChoices.splice(i, 1);
                                if (!authoringChoices.some(function(c) { return c.correct; })) {
                                    authoringChoices[0].correct = true;
                                }
                                renderAuthoringChoices();
                            });
                            row.appendChild(removeBtn);
                        }
                        quizAuthoringChoicesList.appendChild(row);
                    });
                    quizAddChoiceBtn.style.display = (authoringChoices.length >= 4) ? 'none' : '';
                    document.getElementById('quizChoicesInstruction').textContent = t('quizSelectCorrectInstruction');
                }
                quizAddChoiceBtn.addEventListener('click', function() {
                    if (authoringChoices.length >= 4) return;
                    authoringChoices.push({ text: '', correct: false });
                    renderAuthoringChoices();
                });

                function currentAnswerFormat() {
                    if (quizAnswerFormatTF.checked) return 'true_false';
                    if (quizAnswerFormatWritten.checked) return 'written';
                    if (quizAnswerFormatMC.checked) return 'mc';
                    return null;
                }

                function shuffleArray(arr) {
                    for (var i = arr.length - 1; i > 0; i--) {
                        var j = Math.floor(Math.random() * (i + 1));
                        var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
                    }
                    return arr;
                }

                function renderMCChoices(question) {
                    quizHudMCRow.innerHTML = '';
                    quizHudMCRow.style.display = '';
                    var choices = question.choices.slice();
                    var correctText = question.correctChoiceText;
                    var shuffled = shuffleArray(choices);
                    shuffled.forEach(function(text) {
                        var btn = document.createElement('button');
                        btn.className = 'btn quiz-mc-btn';
                        btn.textContent = text;
                        btn.addEventListener('click', function(e) {
                            e.stopPropagation();
                            handleMCAnswer(text, question);
                        });
                        quizHudMCRow.appendChild(btn);
                    });
                }

                function handleMCAnswer(chosenText, question) {
                    var cq = customQuizQuestions[customQuizCurrentIndex];
                    var isCorrect = (chosenText === question.correctChoiceText);
                    customQuizResults.push({
                        questionIndex: customQuizCurrentIndex,
                        libraryIdx: cq.libraryIdx,
                        clickCoords: null,
                        studentAnswer: chosenText,
                        correct: isCorrect,
                        status: 'graded',
                        promptText: question.promptText
                    });
                    if (isCorrect) customQuizScore++;
                    showCustomFeedback(isCorrect, question);
                    quizHudMCRow.style.display = 'none';
                }

                function handleWrittenAnswerSubmit() {
                    var text = quizWrittenInput.value.trim();
                    if (!text) return;
                    var cq = customQuizQuestions[customQuizCurrentIndex];
                    customQuizResults.push({
                        questionIndex: customQuizCurrentIndex,
                        libraryIdx: cq.libraryIdx,
                        clickCoords: null,
                        studentAnswer: text,
                        correct: null,
                        status: 'pending',
                        promptText: cq.question.promptText
                    });
                    quizWrittenInput.value = '';
                    showCustomFeedbackManual();
                }
                quizWrittenSubmitBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    handleWrittenAnswerSubmit();
                });
                quizWrittenInput.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') { e.stopPropagation(); handleWrittenAnswerSubmit(); }
                });

                quizCancelAuthoringBtn.addEventListener('click', function() {
                    exitAuthoringMode();
                    initCustomQuizSetup(false);
                    quizCustomSetupOverlay.style.display = '';
                });

                quizSaveCancelBtn.addEventListener('click', function() {
                    exitAuthoringMode();
                    initCustomQuizSetup(false);
                    quizCustomSetupOverlay.style.display = '';
                });

                quizSaveQuestionBtn.addEventListener('click', function() {
                    var prompt = quizPromptInput.value.trim();
                    if (!prompt) {
                        alert(t('quizPromptRequired'));
                        return;
                    }
                    var fmt = currentAnswerFormat();
                    if (!fmt) {
                        alert(t('quizAnswerFormatRequired'));
                        return;
                    }
                    if (fmt === 'mc') {
                        var validChoices = authoringChoices.filter(function(c) { return c.text.trim().length > 0; });
                        if (validChoices.length < 2 || validChoices.length > 4) {
                            alert(t('quizChoicesRequired'));
                            return;
                        }
                        var correctOne = authoringChoices.find(function(c) { return c.correct && c.text.trim().length > 0; });
                        if (!correctOne) {
                            alert(t('quizMustMarkCorrect'));
                            return;
                        }
                    }
                    var q = {
                        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                        type: authoringMarkerType,
                        coords: authoringMarkerType === 'line' ? authoringLinePoints.slice() : (authoringLinePoints.length > 0 ? authoringLinePoints[0] : []),
                        answerFormat: fmt,
                        promptText: prompt,
                        createdAt: Date.now()
                    };
                    if (fmt === 'true_false') {
                        q.correctAnswer = quizTFAnswerTrue.checked;
                    }
                    if (fmt === 'mc') {
                        var validChoicesFinal = authoringChoices.filter(function(c) { return c.text.trim().length > 0; });
                        var correctFinal = authoringChoices.find(function(c) { return c.correct && c.text.trim().length > 0; });
                        q.choices = validChoicesFinal.map(function(c) { return c.text.trim(); });
                        q.correctChoiceText = correctFinal.text.trim();
                    }
                    customQuestionsLibrary.push(q);
                    sessionNewQuestionIds.push(q.id);
                    saveCustomQuestionsLibrary(customQuestionsLibrary);
                    exitAuthoringMode();
                    initCustomQuizSetup(false);
                    quizCustomSetupOverlay.style.display = '';
                });

                quizReviewBackBtn.addEventListener('click', function() {
                    quizReviewOverlay.style.display = 'none';
                    if (typeof reviewOnComplete === 'function') reviewOnComplete();
                });

                // ── Custom Quiz Run ──
                function startCustomQuiz() {
                    resetMapToNormalForQuiz();
                    customQuizQuestions = [];
                    customQuizResults = [];
                    customQuizCurrentIndex = 0;
                    customQuizScore = 0;
                    quizStartTime = Date.now();

                    customQuizSelected.forEach(function(idx) {
                        if (customQuestionsLibrary[idx]) {
                            customQuizQuestions.push({ libraryIdx: idx, question: customQuestionsLibrary[idx] });
                        }
                    });
                    sessionNewQuestionIds.forEach(function(qid) {
                        var idx = customQuestionsLibrary.findIndex(function(q) { return q.id === qid; });
                        if (idx !== -1 && customQuizSelected.indexOf(idx) === -1) {
                            customQuizQuestions.push({ libraryIdx: idx, question: customQuestionsLibrary[idx] });
                        }
                    });
                    if (customQuizQuestions.length === 0) return;

                    quizActive = true;
                    if (globeViewBtn) { globeViewBtn.disabled = true; globeViewBtn.classList.add('quiz-disabled'); }
                    quizCustomSetupOverlay.style.display = 'none';
                    document.body.classList.add('quiz-active');
                    mapContainer.classList.add('quiz-active');

                    quizHudOverlay.style.display = '';
                    quizTFTrueBtn.textContent = t('quizTrue');
                    quizTFFalseBtn.textContent = t('quizFalse');
                    quizHudTFRow.style.display = 'none';
                    updateCustomQuizHud();

                    customQuizTimerEnabled = quizCustomTimeSet.checked;
                    if (customQuizTimerEnabled) {
                        customQuizTimeLeft = (parseInt(quizCustomTimeInput.value) || 5) * 60;
                        quizHudTimer.style.display = '';
                        updateCustomTimerDisplay();
                        customQuizTimerInterval = setInterval(function() {
                            customQuizTimeLeft--;
                            updateCustomTimerDisplay();
                            if (customQuizTimeLeft <= 0) {
                                endCustomQuiz('timeUp');
                            }
                        }, 1000);
                    } else {
                        quizHudTimer.style.display = 'none';
                    }
                }

                function exitCustomQuiz() {
                    quizActive = false;
                    clearQuizMarkers();
                    if (globeViewBtn) { globeViewBtn.disabled = false; globeViewBtn.classList.remove('quiz-disabled'); }
                    if (quizBtn) { quizBtn.disabled = false; quizBtn.classList.remove('quiz-disabled'); quizBtn.title = t('quizMode'); }
                    if (customQuizClickHandler) {
                        mapContainer.removeEventListener('click', customQuizClickHandler, true);
                        customQuizClickHandler = null;
                    }
                    stopCustomTimer();
                    clearTimeout(customQuizFeedbackTimeout);
                    clearTimeout(customQuizAdvanceTimeout);
                    quizHudOverlay.style.display = 'none';
                    quizFeedback.style.display = 'none';
                    quizEndOverlay.style.display = 'none';
                    restoreMapStateAfterQuiz();
                    document.body.classList.remove('quiz-active');
                    mapContainer.classList.remove('quiz-active');
                }

                function stopCustomTimer() {
                    if (customQuizTimerInterval) { clearInterval(customQuizTimerInterval); customQuizTimerInterval = null; }
                }

                function updateCustomQuizHud() {
                    var cq = customQuizQuestions[customQuizCurrentIndex];
                    var q = cq.question;
                    quizHudQuestion.textContent = t('quizQuestionOf', { current: customQuizCurrentIndex + 1, total: customQuizQuestions.length });
                    quizHudPrompt.textContent = q.promptText;
                    quizHudScore.textContent = t('quizScore') + ': ' + customQuizScore;
                    clearQuizMarkers();
                    quizHudTFRow.style.display = 'none';
                    quizHudWrittenRow.style.display = 'none';
                    quizHudMCRow.style.display = 'none';

                    quizWrittenSubmitBtn.textContent = t('quizSubmitAnswer');
                    quizWrittenInput.placeholder = t('quizWrittenAnswerPlaceholder');
                    if (q.answerFormat === 'true_false') {
                        quizHudTFRow.style.display = '';
                    } else if (q.answerFormat === 'written') {
                        quizHudWrittenRow.style.display = '';
                        quizWrittenInput.value = '';
                        quizWrittenInput.focus();
                    } else if (q.answerFormat === 'mc') {
                        renderMCChoices(q);
                    }

                    function drawCustomQuizMarkers() {
                        if (q.answerFormat === 'true_false') {
                            if (q.type === 'line' && q.coords && q.coords.length >= 2) {
                                drawQuizLineMarker(q.coords);
                            } else if (q.coords && q.coords.length >= 2) {
                                drawQuizMarker(q.coords, 'point');
                            }
                        } else if (q.answerFormat === 'written') {
                            if (q.type === 'line' && q.coords && q.coords.length >= 2) {
                                drawQuizLineMarker(q.coords);
                            } else if (q.coords && q.coords.length >= 2) {
                                drawQuizMarker(q.coords, 'point');
                            }
                        }
                    }

                    if (globeModeActive) {
                        var targetCoords = getCustomQuestionTargetCoords(cq);
                        if (targetCoords) {
                            rotateGlobeToReveal(targetCoords, undefined, drawCustomQuizMarkers);
                        } else {
                            drawCustomQuizMarkers();
                        }
                    } else {
                        drawCustomQuizMarkers();
                    }
                }

                function updateCustomTimerDisplay() {
                    var m = Math.floor(customQuizTimeLeft / 60);
                    var s = customQuizTimeLeft % 60;
                    quizHudTimer.textContent = t('quizTimeRemaining') + ': ' + m + ':' + (s < 10 ? '0' : '') + s;
                }

                function handleTFAnswer(studentChoice) {
                    if (!quizActive || customQuizQuestions.length === 0) return;
                    var cq = customQuizQuestions[customQuizCurrentIndex];
                    var q = cq.question;
                    var isCorrect = (studentChoice === q.correctAnswer);
                    customQuizResults.push({
                        questionIndex: customQuizCurrentIndex,
                        libraryIdx: cq.libraryIdx,
                        clickCoords: null,
                        studentAnswer: studentChoice,
                        correct: isCorrect,
                        status: 'graded',
                        promptText: q.promptText
                    });
                    if (isCorrect) customQuizScore++;
                    showCustomFeedback(isCorrect, q);
                }
                quizTFTrueBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    handleTFAnswer(true);
                });
                quizTFFalseBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    handleTFAnswer(false);
                });

                function showCustomFeedback(correct, q) {
                    clearTimeout(customQuizFeedbackTimeout);
                    clearTimeout(customQuizAdvanceTimeout);
                    clearQuizMarkers();
                    quizFeedback.style.display = '';
                    quizFeedback.className = 'quiz-feedback ' + (correct ? 'correct' : 'incorrect');
                    quizFeedback.textContent = correct ? t('quizCorrect') : t('quizIncorrect');
                    var delay = correct ? 1500 : 2500;
                    customQuizAdvanceTimeout = setTimeout(function() {
                        quizFeedback.style.display = 'none';
                        customQuizCurrentIndex++;
                        if (customQuizCurrentIndex >= customQuizQuestions.length) {
                            endCustomQuiz('completed');
                        } else {
                            updateCustomQuizHud();
                        }
                    }, delay);
                }

                function showCustomFeedbackManual() {
                    clearTimeout(customQuizFeedbackTimeout);
                    clearTimeout(customQuizAdvanceTimeout);
                    quizFeedback.style.display = '';
                    quizFeedback.className = 'quiz-feedback correct';
                    quizFeedback.textContent = t('quizRecordedPending');
                    customQuizAdvanceTimeout = setTimeout(function() {
                        quizFeedback.style.display = 'none';
                        customQuizCurrentIndex++;
                        if (customQuizCurrentIndex >= customQuizQuestions.length) {
                            endCustomQuiz('completed');
                        } else {
                            updateCustomQuizHud();
                        }
                    }, 1800);
                }

                function endCustomQuiz(exitType) {
                    stopCustomTimer();
                    quizActive = false;
                    if (globeViewBtn) { globeViewBtn.disabled = false; globeViewBtn.classList.remove('quiz-disabled'); }
                    if (quizBtn) { quizBtn.disabled = false; quizBtn.classList.remove('quiz-disabled'); quizBtn.title = t('quizMode'); }
                    clearTimeout(customQuizFeedbackTimeout);
                    clearTimeout(customQuizAdvanceTimeout);
                    clearQuizMarkers();
                    quizHudTFRow.style.display = 'none';
                    quizHudWrittenRow.style.display = 'none';
                    quizHudMCRow.style.display = 'none';
                    quizHudMCRow.innerHTML = '';
                    if (customQuizClickHandler) {
                        mapContainer.removeEventListener('click', customQuizClickHandler, true);
                        customQuizClickHandler = null;
                    }

                    if (exitType === 'endedEarly') {
                        for (var qi = customQuizCurrentIndex; qi < customQuizQuestions.length; qi++) {
                            customQuizResults.push({
                                questionIndex: qi,
                                libraryIdx: customQuizQuestions[qi].libraryIdx,
                                clickCoords: null,
                                correct: null,
                                status: 'skipped',
                                promptText: customQuizQuestions[qi].question.promptText
                            });
                        }
                    }

                    document.body.classList.remove('quiz-active');
                    mapContainer.classList.remove('quiz-active');
                    quizHudOverlay.style.display = 'none';
                    quizFeedback.style.display = 'none';

                    var graded = customQuizResults.filter(function(r) { return r.status === 'graded'; });
                    var gradedCorrect = customQuizResults.filter(function(r) { return r.correct === true; });
                    var pending = customQuizResults.filter(function(r) { return r.status === 'pending'; });
                    var skipped = customQuizResults.filter(function(r) { return r.status === 'skipped'; });

                    quizEndOverlay.style.display = '';
                    var titleEl = document.getElementById('quizEndTitle');
                    if (exitType === 'endedEarly') {
                        titleEl.textContent = t('quizEndedEarly');
                    } else if (exitType === 'timeUp') {
                        titleEl.textContent = t('quizTimeUp');
                    } else {
                        titleEl.textContent = t('quizComplete');
                    }

                    var scoreText = t('quizFinalScore') + ': ' + gradedCorrect.length + '/' + graded.length + ' ' + t('quizGradedQuestions');
                    if (pending.length > 0) {
                        scoreText += ' | ' + pending.length + ' ' + t('quizPendingReview');
                    }
                    quizFinalScore.textContent = scoreText;

                    quizMissedList.innerHTML = '';
                    var missed = customQuizResults.filter(function(r) { return r.correct === false; });
                    if (missed.length > 0) {
                        document.getElementById('quizMissedLabel').textContent = t('quizMissedQuestions');
                        missed.forEach(function(r) {
                            var div = document.createElement('div');
                            div.className = 'quiz-missed-item';
                            div.innerHTML = '<div>' + escapeHtml(r.promptText || 'Q') + '</div>';
                            quizMissedList.appendChild(div);
                        });
                    } else {
                        document.getElementById('quizMissedLabel').textContent = '';
                    }

                    if (pending.length > 0) {
                        var existingReviewBtn = document.getElementById('quizDynamicReviewBtn');
                        if (existingReviewBtn) existingReviewBtn.remove();
                        var reviewBtn = document.createElement('button');
                        reviewBtn.id = 'quizDynamicReviewBtn';
                        reviewBtn.className = 'btn quiz-start-btn';
                        reviewBtn.style.marginTop = '10px';
                        reviewBtn.textContent = t('quizReviewPendingAnswers');
                        reviewBtn.addEventListener('click', function() {
                            quizEndOverlay.style.display = 'none';
                            enterReviewMode(pending);
                        });
                        quizEndOverlay.querySelector('.quiz-form-actions').appendChild(reviewBtn);
                    } else {
                        var existingReviewBtn2 = document.getElementById('quizDynamicReviewBtn');
                        if (existingReviewBtn2) existingReviewBtn2.remove();
                    }

                    var customTimeTaken = quizStartTime ? Math.round((Date.now() - quizStartTime) / 1000) : null;
                    saveQuizResultsToFirestore(customQuizResults, gradedCorrect.length, graded.length, customTimeTaken);
                }

                function enterReviewMode(pendingItems, onComplete) {
                    reviewPendingItems = pendingItems.slice();
                    reviewCurrentIndex = 0;
                    reviewOnComplete = onComplete || function() {
                        quizReviewOverlay.style.display = 'none';
                        initCustomQuizSetup(false);
                        quizCustomSetupOverlay.style.display = '';
                    };
                    quizReviewOverlay.style.display = '';
                    document.getElementById('quizReviewTitle').textContent = t('quizReviewPendingAnswers');
                    document.getElementById('quizReviewDisclaimer').textContent = t('quizReviewDisclaimer');
                    quizReviewDone.style.display = 'none';
                    quizReviewCard.style.display = '';
                    quizReviewCorrectBtn.parentElement.style.display = '';
                    renderReviewItem();
                }

                function renderReviewItem() {
                    if (reviewCurrentIndex >= reviewPendingItems.length) {
                        quizReviewCard.style.display = 'none';
                        quizReviewCorrectBtn.parentElement.style.display = 'none';
                        quizReviewDone.style.display = '';
                        document.getElementById('quizReviewCompleteMsg').textContent = t('quizReviewComplete');
                        quizReviewBackBtn.textContent = t('quizBackToSetupBtn');
                        return;
                    }
                    var item = reviewPendingItems[reviewCurrentIndex];
                    quizReviewProgress.textContent = t('quizReviewOf', { current: reviewCurrentIndex + 1, total: reviewPendingItems.length });
                    quizReviewPrompt.textContent = item.promptText || 'Q';
                    if (item.clickCoords) {
                        quizReviewClickInfo.textContent = 'Click: ' + item.clickCoords[0].toFixed(2) + ', ' + item.clickCoords[1].toFixed(2);
                    } else if (item.studentAnswer) {
                        quizReviewClickInfo.textContent = t('quizAnswered') + ': ' + item.studentAnswer;
                    } else {
                        quizReviewClickInfo.textContent = t('quizAnswered') + ': —';
                    }
                    quizReviewCorrectBtn.textContent = t('quizMarkCorrect');
                    quizReviewIncorrectBtn.textContent = t('quizMarkIncorrect');
                }

                quizReviewCorrectBtn.addEventListener('click', function() {
                    if (reviewCurrentIndex >= reviewPendingItems.length) return;
                    reviewPendingItems[reviewCurrentIndex].correct = true;
                    reviewPendingItems[reviewCurrentIndex].status = 'graded';
                    reviewCurrentIndex++;
                    renderReviewItem();
                });

                quizReviewIncorrectBtn.addEventListener('click', function() {
                    if (reviewCurrentIndex >= reviewPendingItems.length) return;
                    reviewPendingItems[reviewCurrentIndex].correct = false;
                    reviewPendingItems[reviewCurrentIndex].status = 'graded';
                    reviewCurrentIndex++;
                    renderReviewItem();
                });

                quizReviewOverlay.addEventListener('click', function(e) {
                    if (e.target === quizReviewOverlay) {
                        quizReviewOverlay.style.display = 'none';
                    }
                });

                // ── Existing selective quiz event listeners ──
                quizEndEarlyBtn.addEventListener('click', function() {
                    if (!quizActive) return;
                    if (confirm(t('quizEndEarlyConfirm'))) {
                        if (customQuizQuestions.length > 0) {
                            endCustomQuiz('endedEarly');
                        } else {
                            finishQuizOrReview('endedEarly');
                        }
                    }
                });

                quizTypedSubmitBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    handleQuizTypedSubmit();
                });
                quizTypedAnswerInput.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleQuizTypedSubmit();
                    }
                });

                quizStartBtn.addEventListener('click', function() {
                    handleJoinSession(
                        document.getElementById('quizStudentNameInput'),
                        document.getElementById('quizSessionCodeInput')
                    );
                    quizSetupOverlay.style.display = 'none';
                    enterQuizMode();
                });

                document.getElementById('quizCreateSessionBtn').addEventListener('click', function() {
                    handleCreateSession(
                        document.getElementById('quizStudentNameInput'),
                        document.getElementById('quizSessionCodeInput'),
                        document.getElementById('quizSessionCreated'),
                        this
                    );
                });

                document.getElementById('quizCustomCreateSessionBtn').addEventListener('click', function() {
                    handleCreateSession(
                        document.getElementById('quizCustomStudentNameInput'),
                        document.getElementById('quizCustomSessionCodeInput'),
                        document.getElementById('quizCustomSessionCreated'),
                        this
                    );
                });

                document.getElementById('quizViewResultsBtn').addEventListener('click', function() {
                    if (currentSessionCode) showClassResults(currentSessionCode);
                });

                document.getElementById('quizResultsCloseBtn').addEventListener('click', function() {
                    document.getElementById('quizResultsOverlay').style.display = 'none';
                });

                document.getElementById('quizResultsOverlay').addEventListener('click', function(e) {
                    if (e.target === this) this.style.display = 'none';
                });

                quizTimeModeSet.addEventListener('change', function() {
                    quizTimeInputWrap.style.display = quizTimeModeSet.checked ? '' : 'none';
                });
                document.getElementById('quizTimeModeNone').addEventListener('change', function() {
                    quizTimeInputWrap.style.display = 'none';
                });

                quizExitBtn.addEventListener('click', function() {
                    exitQuizMode();
                });

                quizSetupOverlay.addEventListener('click', function(e) {
                    if (e.target === quizSetupOverlay) exitQuizMode();
                });

                quizEndOverlay.addEventListener('click', function(e) {
                    if (e.target === quizEndOverlay) exitQuizMode();
                });
            })();

            /* ── Projection Comparison Lens ─────────────────── */
            (function() {
                var projectionCompareOverlay = document.getElementById('projectionCompareOverlay');
                var projectionCompareSvg = document.getElementById('projectionCompareSvg');
                var projTabMercator = document.getElementById('projTabMercator');
                var projTabRobinson = document.getElementById('projTabRobinson');
                var compareProjectionsBtn = document.getElementById('compareProjectionsBtn');

                function initProjectionCompareIfNeeded() {
                    if (compareInitialized) return;
                    var rect = projectionCompareSvg.getBoundingClientRect();
                    var w = rect.width || 800, h = rect.height || 500;
                    compareSvg = d3.select(projectionCompareSvg)
                        .attr('viewBox', '0 0 ' + w + ' ' + h)
                        .attr('width', w)
                        .attr('height', h);
                    compareG = compareSvg.append('g');
                    compareCountriesG = compareG.append('g');
                    compareG.append('path')
                        .datum(d3.geoGraticule10())
                        .attr('class', 'compare-graticule')
                        .attr('fill', 'none')
                        .attr('stroke', 'rgba(255,255,255,0.08)')
                        .attr('stroke-width', 0.5);
                    compareZoomBehavior = d3.zoom()
                        .scaleExtent([1, 12])
                        .on('zoom', function(e) {
                            compareG.attr('transform', e.transform);
                        });
                    compareSvg.call(compareZoomBehavior);
                    compareInitialized = true;
                }

                function buildCompareProjection(type, width, height) {
                    var proj = type === 'robinson' ? d3.geoRobinson() : d3.geoMercator();
                    proj.fitSize([width, height], { type: 'FeatureCollection', features: allCountryFeatures });
                    return proj;
                }

                function renderCompareProjection() {
                    if (!compareInitialized) return;
                    var rect = projectionCompareSvg.getBoundingClientRect();
                    var w = rect.width || 800, h = rect.height || 500;
                    projectionCompareSvg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
                    projectionCompareSvg.setAttribute('width', w);
                    projectionCompareSvg.setAttribute('height', h);
                    var proj = buildCompareProjection(compareProjectionType, w, h);
                    var pathGen = d3.geoPath(proj);
                    compareG.select('.compare-graticule').attr('d', pathGen);
                    compareCountriesG.selectAll('path')
                        .data(allCountryFeatures)
                        .join('path')
                        .attr('d', pathGen)
                        .attr('fill', function(d) { return getCountryFill(d); })
                        .attr('stroke', function(d) { return getStroke(d); })
                        .attr('stroke-width', function(d) { return getStrokeWidth(d); })
                        .attr('opacity', function(d) { return getOpacity(d); });
                    compareG.attr('transform', null);
                    if (compareZoomBehavior) compareSvg.call(compareZoomBehavior.transform, d3.zoomIdentity);
                }

                function openProjectionCompare() {
                    projectionCompareOverlay.style.display = 'flex';
                    compareProjectionType = 'mercator';
                    projTabMercator.classList.add('active');
                    projTabRobinson.classList.remove('active');
                    initProjectionCompareIfNeeded();
                    renderCompareProjection();
                }

                function closeProjectionCompare() {
                    projectionCompareOverlay.style.display = 'none';
                }

                if (compareProjectionsBtn) {
                    compareProjectionsBtn.addEventListener('click', openProjectionCompare);
                }
                var projectionCompareCloseBtn = document.getElementById('projectionCompareCloseBtn');
                if (projectionCompareCloseBtn) {
                    projectionCompareCloseBtn.addEventListener('click', closeProjectionCompare);
                }
                var projectionCompareRefreshBtn = document.getElementById('projectionCompareRefreshBtn');
                if (projectionCompareRefreshBtn) {
                    projectionCompareRefreshBtn.addEventListener('click', function() { renderCompareProjection(); });
                }
                projTabMercator.addEventListener('click', function() {
                    compareProjectionType = 'mercator';
                    projTabMercator.classList.add('active');
                    projTabRobinson.classList.remove('active');
                    renderCompareProjection();
                });
                projTabRobinson.addEventListener('click', function() {
                    compareProjectionType = 'robinson';
                    projTabRobinson.classList.add('active');
                    projTabMercator.classList.remove('active');
                    renderCompareProjection();
                });
                window.addEventListener('resize', function() {
                    if (projectionCompareOverlay.style.display === 'flex' && compareInitialized) renderCompareProjection();
                });
            })();

                // Swipe-down to close country panel on mobile
                let panelTouchStartY = 0;
                countryPanel.addEventListener('touchstart', function(e) {
                    panelTouchStartY = e.touches[0].clientY;
                }, { passive: true });
                countryPanel.addEventListener('touchend', function(e) {
                    const dy = e.changedTouches[0].clientY - panelTouchStartY;
                    if (dy > 60) closeCountryPanel(); // سحب 60px لأسفل يغلق
                }, { passive: true });

                let _lastResizeWidth = window.innerWidth;
                let _resizeTimer = null;

                var resizeObserver = new ResizeObserver(function(entries) {
                    var newWidth = window.innerWidth;
                    var widthChanged = Math.abs(newWidth - _lastResizeWidth) > 5;

                    if (!widthChanged && isMobile) {
                        applyMapTransform(currentTransform);
                        return;
                    }

                    _lastResizeWidth = newWidth;

                    clearTimeout(_resizeTimer);
                    _resizeTimer = setTimeout(function() {
                        var wasMobile = isMobile;
                        isMobile = window.innerWidth < MOBILE_BREAKPOINT;
                        var dims = getContainerDimensions();
                        var width = dims.width, height = dims.height;
                        svgEl.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
                        svgEl.setAttribute('width', width);
                        svgEl.setAttribute('height', height);
                        projection = setupProjection(width, height);
                        _adminBakeDirty = true;
                        if (globeModeActive) {
                            initGlobeProjection();
                            projection = globeProjection;
                            rebuildPathGen();
                        } else {
                            pathGen = d3.geoPath(projection);
                            pathGen.pointRadius(isMobile ? 1.5 : 3);
                        }
                        if (globeModeActive) {
                            fullGlobeRedraw();
                        } else {
                            gOcean.select('rect').attr('width', width + 1000).attr('height', height + 1000);
                            drawGraticule();
                drawIceCap();
                            if (allCountryFeatures.length) {
                                gCountries.selectAll('path').attr('d', pathGen);
                                if (countryLabelSelection) {
                                    countryLabelSelection.remove();
                                    countryLabelSelection = null;
                                }
                                drawCountryLabels(allCountryFeatures);
                            }
                            drawPhysicalFeatures();
                            drawCorridors();
                            drawPointLayersCanvas();
                            drawCapitals();
                            drawTimezones();
                            drawMajorCities();
                            svg.call(zoomBehavior.transform, currentTransform);
                        }
                    }, 80);
                });
                resizeObserver.observe(mapContainer);

                var toolsRow = document.getElementById('toolsRowStart');
                var headerEl = document.querySelector('.header');
                var headerRightGroup = document.querySelector('.header-right-group');
                var controlsBarEl = document.getElementById('controlsBar');
                function syncToolsRowPosition() {
                    if (!toolsRow || !headerEl || !headerRightGroup || !controlsBarEl) return;
                    if (window.innerWidth >= 1024) {
                        if (toolsRow.parentElement !== headerRightGroup) headerRightGroup.appendChild(toolsRow);
                    } else if (window.innerWidth <= 768) {
                        if (toolsRow.parentElement !== controlsBarEl) controlsBarEl.insertBefore(toolsRow, controlsBarEl.firstChild);
                    } else {
                        if (toolsRow.parentElement !== headerRightGroup) headerRightGroup.appendChild(toolsRow);
                    }
                }
                syncToolsRowPosition();
                window.addEventListener('resize', syncToolsRowPosition);

                function syncHeaderHeight() {
                    var hdr = document.querySelector('.header');
                    if (hdr) document.documentElement.style.setProperty('--header-height', hdr.offsetHeight + 'px');
                }
                if (typeof ResizeObserver !== 'undefined') {
                    var headerEl = document.querySelector('.header');
                    if (headerEl) {
                        var headerRO = new ResizeObserver(function() { syncHeaderHeight(); });
                        headerRO.observe(headerEl);
                    }
                }
                window.addEventListener('load', syncHeaderHeight);
                syncHeaderHeight();

                if ('serviceWorker' in navigator) {
                    try {
                        const basePath = window.location.pathname.replace(/\/[^\/]*$/, '/');
                        navigator.serviceWorker.register(basePath + 'sw.js', { scope: basePath })
                            .then(reg => console.log('✅ Service Worker:', reg))
                            .catch(() => {});
                    } catch (e) {}
                }

                updateActiveLayerCount();
            }

            var pdfLibsRequested = false;
            function loadVendorScript(name) {
                return new Promise(function(resolve, reject) {
                    var s = document.createElement('script');
                    var basePath = window.location.pathname.replace(/\/[^\/]*$/, '/');
                    s.src = basePath + 'vendor/' + name;
                    s.onload = function() { resolve(); };
                    s.onerror = function() { reject(new Error('Failed to load ' + name)); };
                    document.head.appendChild(s);
                });
            }
            function ensurePdfLibs() {
                var loads = [];
                if (typeof html2canvas !== 'function') loads.push(loadVendorScript('html2canvas.min.js'));
                if (!window.jspdf) loads.push(loadVendorScript('jspdf.umd.min.js'));
                return Promise.all(loads);
            }

            function renderTextBlockToImage(lines, widthPx, heightPx) {
                var div = document.createElement('div');
                div.style.cssText = 'position:fixed;left:-9999px;top:0;width:' + widthPx + 'px;height:' + heightPx + 'px;' +
                    'background:#f0f0f0;display:flex;flex-direction:column;justify-content:center;padding:0 12px;' +
                    'font-family:Inter,Arial,sans-serif;box-sizing:border-box;direction:' + (lang === 'ar' ? 'rtl' : 'ltr') + ';';
                lines.forEach(function(line, i) {
                    var el = document.createElement('div');
                    el.style.cssText = i === 0
                        ? 'font-size:20px;font-weight:700;color:#282828;'
                        : 'font-size:13px;color:#505050;margin-top:2px;';
                    el.textContent = line;
                    div.appendChild(el);
                });
                document.body.appendChild(div);
                return html2canvas(div, { scale: 3, backgroundColor: '#f0f0f0', logging: false }).then(function(c) {
                    document.body.removeChild(div);
                    return c.toDataURL('image/png');
                });
            }

            // ── Export Map to PDF ──
            function exportMapPDF() {
                if (exportInProgress) return;
                if (typeof html2canvas !== 'function' || !window.jspdf) {
                    if (!pdfLibsRequested) {
                        pdfLibsRequested = true;
                        ensurePdfLibs().then(function() { exportMapPDF(); }).catch(function(e) {
                            pdfLibsRequested = false;
                            console.error('PDF libraries failed to load:', e);
                        });
                    }
                    return;
                }
                exportInProgress = true;
                const exportOverlay = document.getElementById('exportBlockingOverlay');
                if (exportOverlay) exportOverlay.style.display = 'flex';

                // Read legend data BEFORE hiding UI chrome
                var legendEl = document.getElementById('legend');
                var swatches = [];
                var gradStops = [];
                if (legendEl) {
                    legendEl.querySelectorAll('.legend-item').forEach(function(item) {
                        var colorEl = item.querySelector('.legend-color');
                        var label = item.textContent.trim();
                        if (colorEl && label) swatches.push({ color: colorEl.style.background || colorEl.style.backgroundColor, label: label });
                    });
                    var gradBar = legendEl.querySelector('.legend-gradient-bar');
                    if (gradBar) {
                        var bg = gradBar.style.background;
                        var m = bg && bg.match(/linear-gradient\(to right,\s*(.+)\)/);
                        if (m) gradStops = m[1].split(',').map(function(s) { return s.trim(); });
                    }
                }

                // Hide UI chrome before capture
                const overlayEls = [tooltip, legendEl, countryPanel, coordinatesDisplay];
                const qEls = [
                    document.querySelector('.zoom-controls'),
                    document.getElementById('copyNotification'),
                    document.querySelector('.menu-toggle'),
                    document.getElementById('onboardingHint'),
                    document.getElementById('shortcutsOverlay'),
                    controlsBar,
                    document.querySelector('.mobile-topbar'),
                    document.querySelector('.mobile-bottom-nav'),
                    document.querySelector('.mobile-mode-sheet'),
                ];
                const saved = [];
                [...overlayEls, ...qEls].forEach(function(el) {
                    if (el) {
                        saved.push({ el: el, display: el.style.display });
                        el.style.display = 'none';
                    }
                });

                var savedTransform = currentTransform;
                if (!globeModeActive) {
                    gMap.attr('transform', null);
                    currentTransform = d3.zoomIdentity;
                    if (zoomBehavior) svg.call(zoomBehavior.transform, d3.zoomIdentity);
                }

                // Render text blocks as images (supports Arabic/Cyrillic/Unicode)
                var headerDate = new Date().toLocaleDateString();
                var exportProjKey = globeModeActive ? 'globeProjectionType' : 'headerProjectionType';
                var headerImgPromise = renderTextBlockToImage(
                    [t('appName'), t(exportProjKey) + ' \u2014 ' + headerDate],
                    800, 80
                );
                var citationText = t('pdfCitationLabel').replace('{date}', headerDate);
                var footerImgPromise = renderTextBlockToImage([citationText], 800, 36);

                Promise.all([headerImgPromise, footerImgPromise]).then(function(imgs) {
                    var headerImgData = imgs[0];
                    var footerImgData = imgs[1];

                    requestAnimationFrame(function() {
                    requestAnimationFrame(function() {
                    html2canvas(document.getElementById('mapContainer'), {
                        scale: 3,
                        backgroundColor: MAP_COLORS.ui.pdfBg,
                        useCORS: true,
                        logging: false,
                        ignoreElements: function(el) {
                            return el.id === 'exportBlockingOverlay';
                        },
                    }).then(function(canvas) {
                        var imgData = canvas.toDataURL('image/png');
                        var { jsPDF } = window.jspdf;
                        var pdf = new jsPDF('l', 'mm', 'a4');
                        var pw = pdf.internal.pageSize.getWidth();
                        var ph = pdf.internal.pageSize.getHeight();
                        var ratio = canvas.width / canvas.height;
                        var imgH = ph - 32;
                        var imgW = imgH * ratio;
                        if (imgW > pw) { imgW = pw; imgH = imgW / ratio; }

                        // Header band
                        pdf.setFillColor(240, 240, 240);
                        pdf.rect(0, 0, pw, 18, 'F');
                        var headerAspect = 800 / 80;
                        var hdrW = 120;
                        var hdrH = hdrW / headerAspect;
                        if (hdrH > 14) { hdrH = 14; hdrW = hdrH * headerAspect; }
                        pdf.addImage(headerImgData, 'PNG', 8, 9 - hdrH / 2, hdrW, hdrH);

                        // Map image
                        pdf.addImage(imgData, 'PNG', (pw - imgW) / 2, 18, imgW, imgH);

                        // Footer band
                        pdf.setFillColor(240, 240, 240);
                        pdf.rect(0, ph - 14, pw, 14, 'F');

                        // Legend swatches (vector rects — no text, no glyph issue)
                        var legendX = 8;
                        var labelPromises = [];
                        swatches.forEach(function(s) {
                            var rgb = s.color.replace(/rgb\(|rgba\(|\)/g, '').split(',').map(function(v) { return parseInt(v.trim()); });
                            if (rgb.length >= 3) {
                                pdf.setFillColor(rgb[0], rgb[1], rgb[2]);
                                pdf.rect(legendX, ph - 11, 3, 3, 'F');
                            }
                            var thisLegendX = legendX;
                            labelPromises.push(
                                renderTextBlockToImage([s.label], 200, 24).then(function(labelImg) {
                                    var labelW = Math.min(pdf.getTextWidth(s.label) * 1.8, 40);
                                    return { labelImg: labelImg, labelW: labelW, x: thisLegendX };
                                })
                            );
                            legendX += 36;
                        });

                        return Promise.all(labelPromises).then(function(labelResults) {
                            labelResults.forEach(function(r) {
                                pdf.addImage(r.labelImg, 'PNG', r.x + 4, ph - 12, r.labelW, 5);
                            });

                            // Gradient bar
                            if (gradStops.length >= 2) {
                                var gradW = pw - legendX - 8;
                                if (gradW > 20) {
                                    gradStops.forEach(function(c, i) {
                                        var rgb = c.replace(/rgb\(|rgba\(|\)/g, '').split(',').map(function(v) { return parseInt(v.trim()); });
                                        if (rgb.length >= 3) {
                                            pdf.setFillColor(rgb[0], rgb[1], rgb[2]);
                                            var segW = gradW / gradStops.length;
                                            pdf.rect(legendX + i * segW, ph - 11, segW + 0.5, 3, 'F');
                                        }
                                    });
                                }
                            }

                            // Footer citation as image
                            var footerAspect = 800 / 36;
                            var ftrW = 140;
                            var ftrH = ftrW / footerAspect;
                            if (ftrH > 8) { ftrH = 8; ftrW = ftrH * footerAspect; }
                            pdf.addImage(footerImgData, 'PNG', (pw - ftrW) / 2, ph - 7 - ftrH / 2, ftrW, ftrH);

                            pdf.setProperties({
                                title: t('appName'),
                                author: 'Lepidos Atlas',
                                subject: t(exportProjKey),
                                keywords: 'waterman, butterfly, map, atlas, lepidos'
                            });
                            pdf.save('Waterman_Map_Export.pdf');
                        }).catch(function(err) {
                            console.error('PDF legend label error:', err);
                            pdf.save('Waterman_Map_Export.pdf');
                        });
                    }).catch(function(err) {
                        console.error('PDF export error:', err);
                    }).finally(function() {
                        // Restore UI chrome
                        saved.forEach(function(s) { s.el.style.display = s.display; });
                        if (!globeModeActive) {
                            gMap.attr('transform', savedTransform);
                            currentTransform = savedTransform;
                            if (zoomBehavior && savedTransform) svg.call(zoomBehavior.transform, savedTransform);
                        }
                        exportInProgress = false;
                        if (exportOverlay) exportOverlay.style.display = 'none';
                    });
                    });
                    });
                }).catch(function(err) {
                    console.error('PDF text render error:', err);
                    // Cleanup on text-render failure too
                    saved.forEach(function(s) { s.el.style.display = s.display; });
                    if (!globeModeActive) {
                        gMap.attr('transform', savedTransform);
                        currentTransform = savedTransform;
                        if (zoomBehavior && savedTransform) svg.call(zoomBehavior.transform, savedTransform);
                    }
                    exportInProgress = false;
                    if (exportOverlay) exportOverlay.style.display = 'none';
                });
            }

            // ── Event wiring & button listeners ──
            modeButtons.forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
            labelsToggle.addEventListener('click', toggleLabels);
            sectToggle.addEventListener('click', toggleSect);
            corridorsToggle.addEventListener('click', toggleCorridors);

            const riversGlaciersToggle = document.getElementById('riversGlaciersToggle');
            if (riversGlaciersToggle) riversGlaciersToggle.addEventListener('click', toggleRiversGlaciers);
            const colorblindToggle = document.getElementById('colorblindToggle');
            if (colorblindToggle) colorblindToggle.addEventListener('click', toggleColorblind);
            try {
                if (localStorage.getItem('cbPatterns') === '1' && !cbPatternsVisible) toggleColorblind();
            } catch (e) {}
            densitySpotsToggle.addEventListener('click', toggleDensitySpots);
            capitalsToggle.addEventListener('click', toggleCapitals);
            timezonesToggle.addEventListener('click', toggleTimezones);
            majorCitiesToggle.addEventListener('click', toggleMajorCities);
            coordsToggle.addEventListener('click', toggleCoords);
            document.getElementById('naturalResourcesToggle').addEventListener('click', toggleNaturalResources);
            document.getElementById('ethnicGroupsToggle').addEventListener('click', toggleEthnicGroups);
            document.getElementById('oceanCurrentsToggle').addEventListener('click', toggleOceanCurrents);
            document.getElementById('windsToggle').addEventListener('click', toggleWinds);
            document.getElementById('earthquakesToggle').addEventListener('click', toggleEarthquakes);
            document.getElementById('volcanoesToggle').addEventListener('click', toggleVolcanoes);
            document.getElementById('geopoliticalBlocsToggle').addEventListener('click', toggleGeopoliticalBlocs);
            document.getElementById('desertsForestsToggle').addEventListener('click', toggleDesertsForests);
            document.getElementById('borderDisputesToggle').addEventListener('click', toggleBorderDisputes);
            const historicalRoutesToggleBtn = document.getElementById('historicalRoutesToggle');
            if (historicalRoutesToggleBtn) historicalRoutesToggleBtn.addEventListener('click', function() { toggleLayerByName('historicalRoutes'); });
            if (adminBoundariesToggle) adminBoundariesToggle.addEventListener('click', toggleAdminBoundaries);
            if (globeViewBtn) globeViewBtn.addEventListener('click', function() {
                if (quizActive) return;
                if (window.historyIsActive && window.historyIsActive()) { window.exitHistoryMode(); }
                toggleGlobeMode();
            });

            const blocSelect = document.getElementById('blocSelect');
            geopoliticalBlocsData.forEach(function(b) {
                var opt = document.createElement('option');
                opt.value = b.name_en;
                opt.textContent = (lang === 'ar' ? b.name : lang === 'ru' ? (b.name_ru || b.name_en) : lang === 'uz' ?(b.name_uz || b.name_en): lang === 'es' ?(b.name_es || b.name_en) : b.name_en) + ' (' + (lang === 'ar' ? b.members_ar : lang === 'ru' ? (b.members_ru || b.members_en) : lang === 'uz' ?(b.members_uz || b.members_en): lang === 'es' ?(b.members_es || b.members_en) : b.members_en) + ')';
                blocSelect.appendChild(opt);
            });
            blocSelect.addEventListener('change', function() {
                selectedBloc = this.value;
                if (!geopoliticalBlocsVisible) {
                    geopoliticalBlocsVisible = true;
                    var blocsBtn = document.getElementById('geopoliticalBlocsToggle');
                    if (blocsBtn) { blocsBtn.classList.add('toggle-on'); blocsBtn.setAttribute('aria-pressed', 'true'); }
                    drawGeopoliticalBlocs();
                    setMode('normal');
                } else {
                    if (selectedBloc !== 'all') setMode('normal');
                    drawGeopoliticalBlocs();
                }
                updateLegend();
                updateHash();
                updateActiveLayerCount();
            });

            var sectionGeoBtnEl = document.getElementById('sectionGeoBtn');
            if (sectionGeoBtnEl) {
                sectionGeoBtnEl.addEventListener('click', function() {
                    if (window.applySection) window.applySection('geo');
                });
            }
            var sectionHistoryBtnEl = document.getElementById('sectionHistoryBtn');
            if (sectionHistoryBtnEl) {
                sectionHistoryBtnEl.addEventListener('click', function() {
                    if (quizActive) return;
                    if (window.applySection) window.applySection('history');
                });
            }
            var histTerrainBtnEl = document.getElementById('histTerrainBtn');
            if (histTerrainBtnEl) {
                histTerrainBtnEl.addEventListener('click', function() {
                    setMode(colorMode === 'terrain' ? 'normal' : 'terrain');
                    this.classList.toggle('toggle-on', colorMode === 'terrain');
                });
            }
            var histSourcesBtnEl = document.getElementById('histSourcesBtn');
            if (histSourcesBtnEl) {
                histSourcesBtnEl.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var sp = document.getElementById('histSourcesPanel');
                    if (sp) sp.style.display = sp.style.display === 'none' ? 'block' : 'none';
                });
            }

            function toggleLangDropdown(btn, menu) {
                var isVisible = menu.classList.contains('visible');
                document.querySelectorAll('.lang-dropdown-menu.visible').forEach(function(m) { m.classList.remove('visible'); });
                if (!isVisible) menu.classList.toggle('visible');
            }
            langToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                var ldm = document.getElementById('langDropdownMenu');
                if (ldm) {
                    if (!ldm.classList.contains('visible')) positionLangDropdown();
                    ldm.classList.toggle('visible');
                }
            });
            window.addEventListener('resize', function() {
                if (langDropdownMenu && langDropdownMenu.classList.contains('visible')) positionLangDropdown();
            });
            document.getElementById('themeToggleBtn').addEventListener('click', function() {
                var current = document.documentElement.getAttribute('data-theme');
                applyTheme(current === 'light' ? 'dark' : 'light');
            });
            document.getElementById('measureToolBtn').addEventListener('click', toggleMeasureMode);
            document.getElementById('presentationModeBtn').addEventListener('click', togglePresentationMode);
            document.getElementById('presentationExitBtn').addEventListener('click', togglePresentationMode);
            mapContainer.addEventListener('click', handleMeasureClick, true);
            document.querySelectorAll('.lang-option').forEach(function(opt) {
                opt.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var code = this.dataset.lang;
                    if (code !== lang) setLanguage(code);
                    document.querySelectorAll('.lang-dropdown-menu.visible').forEach(function(m) { m.classList.remove('visible'); });
                });
            });
            document.addEventListener('click', function() {
                document.querySelectorAll('.lang-dropdown-menu.visible').forEach(function(m) { m.classList.remove('visible'); });
            });

            // ── Header Tools app-grid popover ──
            document.addEventListener('DOMContentLoaded', function() {
                const toolsBtn = document.getElementById('toolsBtn');
                const toolsMenu = document.getElementById('toolsDropdownMenu');

                if (!toolsBtn || !toolsMenu) {
                    console.error('Tools elements not found:', { toolsBtn, toolsMenu });
                    return;
                }

                if (toolsBtn.dataset.menuBound) return;
                toolsBtn.dataset.menuBound = '1';

                function toggleToolsMenu(e) {
                    e.stopPropagation();
                    const isVisible = toolsMenu.classList.contains('visible');

                    if (isVisible) {
                        toolsMenu.classList.remove('visible');
                        toolsMenu.setAttribute('hidden', '');
                        toolsBtn.setAttribute('aria-expanded', 'false');
                    } else {
                        toolsMenu.classList.add('visible');
                        toolsMenu.removeAttribute('hidden');
                        toolsBtn.setAttribute('aria-expanded', 'true');
                    }
                }

                toolsBtn.addEventListener('click', toggleToolsMenu);

                toolsMenu.addEventListener('click', (e) => {
                    e.stopPropagation();
                });

                document.addEventListener('click', () => {
                    toolsMenu.classList.remove('visible');
                    toolsMenu.setAttribute('hidden', '');
                    toolsBtn.setAttribute('aria-expanded', 'false');
                });
            });

            function setupReligionButtons() {
                religionButtons = document.querySelectorAll('.religion-btn');
                religionButtons.forEach(function(b) {
                    b.addEventListener('click', function() {
                        currentReligionFilter = b.dataset.religion;
                        setActiveByAttr(religionButtons, '.religion-btn[data-religion="' + b.dataset.religion + '"]');
                        updateAllStyles();
                    });
                });
            }
            setupReligionButtons();

            zoomInBtn.addEventListener('click', () => { svg.transition().duration(prefersReducedMotion() ? 0 : 300).ease(d3.easeCubicOut).call(zoomBehavior.scaleBy,
                1.35); });
            zoomOutBtn.addEventListener('click', () => { svg.transition().duration(prefersReducedMotion() ? 0 : 300).ease(d3.easeCubicOut).call(zoomBehavior.scaleBy,
                0.74); });
            zoomResetBtn.addEventListener('click', resetZoom);
            shareBtn.addEventListener('click', shareMap);
            resetBtn.addEventListener('click', resetAll);
            document.getElementById('pdfExportBtn').addEventListener('click', exportMapPDF);

            // ── Mobile UI event wiring ──
            var mobileLangBtn = document.getElementById('mobileLangToggle');
            var mobileSearchInput = document.getElementById('mobileSearchInput');
            var mobileShareBtn = document.getElementById('mobileShareBtn');
            var mobileModeBtn = document.getElementById('mobileModeBtn');
            var mobileLayersBtn = document.getElementById('mobileLayersBtn');
            var mobileResetBtn2 = document.getElementById('mobileResetBtn2');
            var mobileToolsBtn = document.getElementById('mobileToolsBtn');
            var mobileToolsMenu = document.getElementById('mobileToolsMenu');
            var mobileOnboardBtn = document.getElementById('mobileOnboardBtn');
            var mobileShortcutsBtn = document.getElementById('mobileShortcutsBtn');
            var mobilePdfBtn = document.getElementById('mobilePdfBtn');
            var mobileCoordsBtn = document.getElementById('mobileCoordsBtn');
            var modeSheet = document.getElementById('mobileModeSheet');
            var modeSheetBackdrop = document.getElementById('mobileModeSheetBackdrop');
            var modeSheetClose = document.getElementById('mobileModeSheetClose');
            var mobileModeBtns = document.querySelectorAll('#mobileModeButtons .mode-btn');
            var mobileFilterBtns = document.querySelectorAll('#mobileFilterButtons .religion-btn');

            if (mobileLangBtn) mobileLangBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                document.querySelectorAll('.lang-dropdown-menu.visible').forEach(function(m) { m.classList.remove('visible'); });
                var mm = document.getElementById('mobileLangDropdownMenu');
                if (mm) mm.classList.toggle('visible');
            });
            if (mobileSearchInput) mobileSearchInput.addEventListener('input', function() {
                var val = this.value.trim().toLowerCase();
                var ms = document.getElementById('mobileSuggestionsList');
                if (!ms) return;
                ms.innerHTML = '';
                if (!val) { ms.style.display = 'none'; return; }
                var matches = countryNamesList.filter(function(n) {
                    return n.toLowerCase().includes(val) || getDisplayName(n).toLowerCase().includes(val);
                }).slice(0, 6);
                if (matches.length) {
                    matches.forEach(function(m) {
                        var li = document.createElement('li');
                        var flag = getCountryFlag(m);
                        var span2 = document.createElement('span');
                        span2.className = 'flag-icon';
                        span2.textContent = flag;
                        li.appendChild(span2);
                        li.appendChild(document.createTextNode(' ' + getDisplayName(m)));
                        li.addEventListener('touchend', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            mobileSearchInput.value = '';
                            ms.style.display = 'none';
                            mobileSearchInput.blur();
                            flyToCountry(m);
                        }, { passive: false });
                        li.addEventListener('mousedown', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            mobileSearchInput.value = '';
                            ms.style.display = 'none';
                            mobileSearchInput.blur();
                            flyToCountry(m);
                        });
                        ms.appendChild(li);
                    });
                    ms.style.display = 'block';
                } else {
                    ms.style.display = 'none';
                }
            });
            if (mobileSearchInput) mobileSearchInput.addEventListener('blur', function() {
                setTimeout(function() {
                    var ms = document.getElementById('mobileSuggestionsList');
                    if (ms) ms.style.display = 'none';
                }, 200);
            });
            if (mobileShareBtn) mobileShareBtn.addEventListener('click', shareMap);
            if (mobileModeBtn) mobileModeBtn.addEventListener('click', function() { modeSheet.classList.add('visible'); });
            if (mobileResetBtn2) mobileResetBtn2.addEventListener('click', function() { closeMobileToolsMenu(); resetAll(); });
            if (mobileCoordsBtn) mobileCoordsBtn.addEventListener('click', function() { closeMobileToolsMenu(); toggleCoords(); });
            if (mobileToolsBtn) mobileToolsBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                closeMobileToolsMenu();
                if (mobileToolsMenu) mobileToolsMenu.classList.toggle('open');
            });
            if (mobileOnboardBtn) mobileOnboardBtn.addEventListener('click', function() { closeMobileToolsMenu(); maybeShowProjectionExplainer(true); });
            if (mobileShortcutsBtn) mobileShortcutsBtn.addEventListener('click', function() { closeMobileToolsMenu(); shortcutsOverlay.classList.add('visible'); });
            if (mobilePdfBtn) mobilePdfBtn.addEventListener('click', function() { closeMobileToolsMenu(); exportMapPDF(); });
            function closeMobileToolsMenu() { if (mobileToolsMenu) mobileToolsMenu.classList.remove('open'); }
            document.addEventListener('click', function(e) {
                if (mobileToolsMenu && mobileToolsMenu.classList.contains('open') && !mobileToolsMenu.contains(e.target) && e.target !== mobileToolsBtn && !mobileToolsBtn.contains(e.target)) {
                    closeMobileToolsMenu();
                }
            });
            if (modeSheetBackdrop) modeSheetBackdrop.addEventListener('click', function() { modeSheet.classList.remove('visible'); });
            if (modeSheetClose) modeSheetClose.addEventListener('click', function() { modeSheet.classList.remove('visible'); });
            mobileModeBtns.forEach(function(b) {
                b.addEventListener('click', function() {
                    var mode = this.dataset.mode;
                    var desktopBtn = document.querySelector('#modeButtons .mode-btn[data-mode="' + mode + '"]');
                    if (desktopBtn) desktopBtn.click();
                    modeSheet.classList.remove('visible');
                });
            });
            mobileFilterBtns.forEach(function(b) {
                b.addEventListener('click', function() {
                    var rel = this.dataset.religion;
                    var desktopBtn = document.querySelector('#religionButtons .religion-btn[data-religion="' + rel + '"]');
                    if (desktopBtn) desktopBtn.click();
                });
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && annotationsModal && annotationsModal.classList.contains('visible')) {
                    closeAnnotationsModal();
                }
                if (e.key === 'Escape' && typeof window.closeAnnotationTutorial === 'function') {
                    window.closeAnnotationTutorial();
                }
                if (e.key === 'Escape' && presentationModeActive) {
                    togglePresentationMode();
                }
                if (e.key === 'Escape') {
                    document.querySelectorAll('.lang-dropdown-menu.visible').forEach(function(m) { m.classList.remove('visible'); });
                }
            });

            // ── Annotation controls wiring ──
            var annotateBtn = document.getElementById('annotateBtn');
            var mobileAnnotateBtn = document.getElementById('mobileAnnotateBtn');
            var annotationsModal = document.getElementById('annotationsModal');
            if (annotateBtn) annotateBtn.addEventListener('click', toggleAnnotationMode);
            if (mobileAnnotateBtn) mobileAnnotateBtn.addEventListener('click', function() {
                var mobileMenu = document.getElementById('mobileToolsMenu');
                if (mobileMenu && mobileMenu.classList.contains('open')) mobileMenu.classList.remove('open');
                toggleAnnotationMode();
            });
            var annotationKindBtns = {
                pin: document.getElementById('annotationKindPin'),
                region: document.getElementById('annotationKindRegion'),
                draw: document.getElementById('annotationKindDraw'),
                arrow: document.getElementById('annotationKindArrow')
            };
            var annotationAddByNameBtn = document.getElementById('annotationAddByNameBtn');
            if (annotationAddByNameBtn) annotationAddByNameBtn.addEventListener('click', function() {
                if (!annotateActive) return;
                if (annotateKind !== 'pin' && annotateKind !== 'region') {
                    annotateToast(t('placeKindToast'));
                    return;
                }
                openAnnotationPlaceDialog(annotateKind);
            });

            Object.keys(annotationKindBtns).forEach(function(kind) {
                var b = annotationKindBtns[kind];
                if (b) b.addEventListener('click', function() { toggleAnnotationKind(kind === 'draw' ? 'freehand' : kind); });
            });
            var annotationFinishBtn = document.getElementById('annotationFinishBtn');
            if (annotationFinishBtn) annotationFinishBtn.addEventListener('click', finishAnnotationTool);
            var annotationClearBtn = document.getElementById('annotationClearBtn');
            if (annotationClearBtn) annotationClearBtn.addEventListener('click', function() {
                if (!cancelAnnotationStroke()) {
                    undoLastAnnotation();
                }
            });
            var annotationManageBtn = document.getElementById('annotationManageBtn');
            if (annotationManageBtn) annotationManageBtn.addEventListener('click', openAnnotationsModal);
            var annotationHelpBtn = document.getElementById('annotationHelpBtn');
            if (annotationHelpBtn) annotationHelpBtn.addEventListener('click', function() { if (window.startAnnotationTutorial) window.startAnnotationTutorial(); });
            document.querySelectorAll('#annotationToolbar .annotation-color-swatch').forEach(function(s) {
                s.addEventListener('click', function() { setAnnotationColor(s.getAttribute('data-color')); });
            });
            var fontSmall = document.getElementById('annotationFontSmallBtn');
            var fontMedium = document.getElementById('annotationFontMediumBtn');
            var fontLarge = document.getElementById('annotationFontLargeBtn');
            if (fontSmall) fontSmall.addEventListener('click', function() { stepAnnotationFontSize(-1); });
            if (fontMedium) fontMedium.addEventListener('click', function() { setAnnotationFontSize(10); });
            if (fontLarge) fontLarge.addEventListener('click', function() { stepAnnotationFontSize(1); });
            var annotationsModalClose = document.getElementById('annotationsModalClose');
            var annotationsModalBackdrop = document.getElementById('annotationsModalBackdrop');
            if (annotationsModalClose) annotationsModalClose.addEventListener('click', closeAnnotationsModal);
            if (annotationsModalBackdrop) annotationsModalBackdrop.addEventListener('click', closeAnnotationsModal);
            var mapSvg = document.getElementById('mapSvg');
            window.__annotDebug = function() {
                return {
                    annotateActive: annotateActive,
                    annotateKind: annotateKind,
                    annotateColor: annotateColor,
                    annotateFontSize: annotateFontSize,
                    panSpaceHeld: _panSpaceHeld,
                    strokeActive: _annotStrokeActive,
                    strokePoints: _annotStrokePoints ? _annotStrokePoints.length : 0,
                    pathLen: _annotStrokePathLen,
                    kindPinOn: !!(document.getElementById('annotationKindPin') && document.getElementById('annotationKindPin').classList.contains('toggle-on'))
                };
            };
            if (mapSvg) {
                mapSvg.addEventListener('pointerdown', onAnnotationPointerDown);
                mapSvg.addEventListener('pointermove', onAnnotationPointerMove);
                mapSvg.addEventListener('pointerup', onAnnotationPointerUp);
                mapSvg.addEventListener('pointercancel', onAnnotationPointerUp);
            }
            if (mapContainer) mapContainer.addEventListener('click', handleAnnotationClick, true);
            // Space-to-pan support (holds current pan state while drawing freehand/arrows)
            document.addEventListener('keydown', function(e) {
                if (e.code === 'Space' && !e.repeat && e.target && e.target.tagName !== 'INPUT') setPanSpaceHeld(true);
            });
            document.addEventListener('keyup', function(e) {
                if (e.code === 'Space') setPanSpaceHeld(false);
            });
            document.addEventListener('blur', function() { setPanSpaceHeld(false); });

            // ── Menu toggle & panel buttons ──
            closePanelBtn.addEventListener('click', () => {
                closeCountryPanel();
            });
            exportBtn.addEventListener('click', function() {
                if (!selectedCountry) return;
                const name = selectedCountry.properties?.name || '';
                const info = countryInfo[name] || countryInfo[getCleanName(name)];
                let text = `${t('continent')}: ${getDisplayName(name)}\n`;
                if (info) {
                    text += `${t('capital')}: ${lang==='ar'?(info.capital_ar||info.capital_en):lang==='ru'?(info.capital_ru||info.capital_en):lang==='uz'?(info.capital_uz||info.capital_en):lang==='es'?(info.capital_es||info.capital_en):info.capital_en}\n`;
                    text += `${t('areaTitle')}: ${info.area} ${t('km2')}\n`;
                    text += `${t('populationTitle')}: ${info.population_2026} ${t('million')}\n`;
                    text += `${t('languageTitle')}: ${lang==='ar'?(info.lang_ar||info.lang_en):lang==='ru'?(info.lang_ru||info.lang_en):lang==='uz'?(info.lang_uz||info.lang_en):lang==='es'?(info.lang_es||info.lang_en):info.lang_en}\n`;
                    text += `${t('densityTitle')}: ${getDensity(name)} ${t('densityUnit')}\n`;
                }
                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${t('exportFilename')}_${name.replace(/\s/g,'_')}.txt`;
                a.click();
                URL.revokeObjectURL(url);
            });

            if (menuToggle) {
                menuToggle.addEventListener('click', function() {
                    const isActive = controlsBar.classList.toggle('active');
                    this.classList.toggle('active');
                    const legend = document.getElementById('legend');
                    if (isActive) {
                        legend.style.display = 'none';
                    } else {
                        legend.style.display = 'flex';
                    }
                });
            }

            // ── Projection Explainer ──
            function maybeShowProjectionExplainer(force) {
                var projOverlay = document.getElementById('projectionOverlay');
                var projDone = false;
                if (!force) {
                    try { projDone = localStorage.getItem('projectionExplainerDone') === '1'; } catch(e) {}
                }
                if (!projOverlay || (projDone && !force)) return;

                var projTitle = document.getElementById('projectionTitle');
                var projBody = document.getElementById('projectionBody');
                var projContinue = document.getElementById('projectionContinue');
                if (projTitle) projTitle.textContent = t('projectionTitle');
                if (projBody) projBody.innerHTML = t('projectionBody');
                if (projContinue) projContinue.textContent = t('onboardNext');
                projOverlay.classList.add('active');

                function closeProjection() {
                    projOverlay.classList.remove('active');
                    try { localStorage.setItem('projectionExplainerDone', '1'); } catch(e) {}
                    if (typeof window.startOnboarding === 'function') {
                        try { localStorage.removeItem('onboardDone'); } catch(e) {}
                        setTimeout(function() { window.startOnboarding(); }, 300);
                    }
                }
                if (projContinue) projContinue.addEventListener('click', closeProjection);
                projOverlay.addEventListener('click', function(e) {
                    if (e.target === projOverlay) closeProjection();
                });
            }

            // ── Section picker (first launch, after language) ──
            window.applySectionWhenReady = applySectionWhenReady;
            function applySectionWhenReady(section, cb) {
                var tries = 0;
                (function wait() {
                    if (window.applySection) { window.applySection(section, false); if (cb) cb(); return; }
                    if (++tries > 150) return;
                    setTimeout(wait, 60);
                })();
            }
            function maybeShowSectionPicker() {
                var chosen = null;
                try { chosen = localStorage.getItem('lepidosSection'); } catch (e) {}
                if (chosen === 'geo' || chosen === 'history') {
                    applySectionWhenReady(chosen, maybeShowProjectionExplainer);
                    return;
                }
                var ov = document.getElementById('sectionPickerOverlay');
                if (!ov) { maybeShowProjectionExplainer(); return; }
                ov.style.display = 'flex';
                var done = false;
                function finish(section) {
                    if (done) return;
                    done = true;
                    var remember = document.getElementById('sectionRemember');
                    var persist = !remember || remember.checked;
                    if (persist) { try { localStorage.setItem('lepidosSection', section); } catch (e) {} }
                    try { localStorage.setItem('lepidosSectionChoice', '1'); } catch (e) {}
                    ov.style.display = 'none';
                    applySectionWhenReady(section, maybeShowProjectionExplainer);
                }
                ov.querySelectorAll('.section-card').forEach(function(card) {
                    card.addEventListener('click', function() { finish(this.dataset.section); });
                });
            }

            // ── Language overlay ──
            (function() {
                var overlay = document.getElementById('langOverlay');
                if (!overlay) { init(); maybeShowSectionPicker(); return; }
                // The startup/modal title is always the fixed English brand
                // name, never localized or derived from map state.
                var modalTitle = document.getElementById('langModalTitle');
                if (modalTitle) {
                    modalTitle.textContent = 'Lepidos Atlas';
                }
                var savedLang = null;
                try { savedLang = localStorage.getItem('mapLang'); } catch(e) {}
                if (savedLang && ['ar','en','ru','uz','es'].includes(savedLang)) {
                    overlay.remove();
                    init();
                    maybeShowSectionPicker();
                    return;
                }
                // Language overlay is showing → fresh start → clear onboard flag
                try { localStorage.removeItem('onboardDone'); } catch(e) {}
                overlay.querySelectorAll('.lang-overlay-btn').forEach(function(btn) {
                    btn.addEventListener('click', function() {
                        var code = this.dataset.lang;
                        lang = code;
                        try { localStorage.setItem('mapLang', code); } catch(e) {}
                        overlay.style.cssText = 'display:none !important;visibility:hidden;pointer-events:none;opacity:0;z-index:-1;';
                        overlay.classList.add('hidden');
                        overlay.remove();

                        // Temporarily mark tutorial as done so init() doesn't auto-start it
                        var projDoneCheck = false;
                        try { projDoneCheck = localStorage.getItem('projectionExplainerDone') === '1'; } catch(e) {}
                        if (!projDoneCheck) {
                            try { localStorage.setItem('onboardDone', '1'); } catch(e) {}
                        }

                        init();
                        maybeShowSectionPicker();
                    });
                });

        })();
            // ── Anchored Layers / Divisions popovers ──
            var layersToggleBtn = document.getElementById('layersToggleBtn');
            var barLayersBtn = document.getElementById('barLayersBtn');
            var barDivisionBtn = document.getElementById('barDivisionBtn');

            function positionPopover(modal, triggerEl) {
                if (!modal || !triggerEl) return;
                var r = triggerEl.getBoundingClientRect();
                var pw = modal.offsetWidth;
                var ph = modal.offsetHeight;
                var vw = window.innerWidth;
                var vh = window.innerHeight;
                var margin = 8;
                var rtl = document.documentElement.dir === 'rtl';
                var left = rtl ? r.right - pw : r.left;
                left = Math.max(margin, Math.min(left, vw - pw - margin));
                var top = r.bottom + margin;
                var flipped = false;
                if (top + ph > vh - margin && r.top - ph - margin >= margin) {
                    top = r.top - ph - margin;
                    flipped = true;
                }
                top = Math.max(margin, Math.min(top, vh - ph - margin));
                modal.style.left = left + 'px';
                modal.style.top = top + 'px';
                modal.style.transformOrigin = (flipped ? 'bottom' : 'top') + ' ' + (rtl ? 'right' : 'left');
            }

            function buildLayersGrid() {
                var body = document.getElementById('layersModalBody');
                if (!body || body.dataset.gridBuilt) return;
                var btnRow = document.createElement('div');
                btnRow.className = 'menu-popover-actions';
                var allOffBtn = document.createElement('button');
                allOffBtn.className = 'btn';
                allOffBtn.id = 'btn-turn-off-all';
                allOffBtn.setAttribute('data-i18n', 'allOff');
                allOffBtn.textContent = t('allOff');
                allOffBtn.addEventListener('click', function() {
                    body.querySelectorAll('.btn.toggle-on').forEach(function(b) { b.click(); });
                    updateActiveLayerCount();
                });
                btnRow.appendChild(allOffBtn);
                var resetLayersBtn = document.createElement('button');
                resetLayersBtn.className = 'btn';
                resetLayersBtn.id = 'btn-reset-layers';
                resetLayersBtn.setAttribute('data-i18n', 'resetLayers');
                resetLayersBtn.textContent = t('resetLayers');
                resetLayersBtn.addEventListener('click', function() {
                    if (corridorsVisible) toggleCorridors();
                    if (cbPatternsVisible) toggleColorblind();
                    if (riversGlaciersVisible) toggleRiversGlaciers();
                    if (densitySpotsMode) toggleDensitySpots();
                    if (capitalsVisible) toggleCapitals();
                    if (timezonesVisible) toggleTimezones();
                    if (majorCitiesVisible) toggleMajorCities();
                    if (naturalResourcesVisible) toggleNaturalResources();
                    if (ethnicGroupsVisible) toggleEthnicGroups();
                    if (oceanCurrentsVisible) toggleOceanCurrents();
                    if (windsVisible) toggleWinds();
                    if (earthquakesVisible) toggleEarthquakes();
                    if (volcanoesVisible) toggleVolcanoes();
                    if (geopoliticalBlocsVisible) toggleGeopoliticalBlocs();
                    if (desertsForestsVisible) toggleDesertsForests();
                        if (borderDisputesVisible) toggleBorderDisputes();
                    if (selectedBloc !== 'all') {
                        selectedBloc = 'all';
                        document.getElementById('blocSelect').value = 'all';
                    }
                    updateActiveLayerCount();
                });
                btnRow.appendChild(resetLayersBtn);
                var controls = [].slice.call(body.children);
                body.innerHTML = '';
                body.appendChild(btnRow);
                var grid = document.createElement('div');
                grid.className = 'layers-flat-grid';
                var blocsCompound = null;
                controls.forEach(function(el) {
                    if (el.tagName === 'SELECT') {
                        if (blocsCompound) { blocsCompound.appendChild(el); return; }
                        grid.appendChild(el);
                        return;
                    }
                    if (el.id === 'geopoliticalBlocsToggle') {
                        blocsCompound = document.createElement('div');
                        blocsCompound.className = 'blocs-compound-card';
                        el.classList.add('blocs-toggle-btn');
                        var blocsIcon = el.querySelector('.lucide-icon');
                        if (blocsIcon) {
                            var blocsIconWrap = document.createElement('span');
                            blocsIconWrap.className = 'layer-icon';
                            blocsIcon.replaceWith(blocsIconWrap);
                            blocsIconWrap.appendChild(blocsIcon);
                        }
                        var blocsLabel = el.querySelector('.btn-text');
                        if (blocsLabel) {
                            var blocsLabelWrap = document.createElement('span');
                            blocsLabelWrap.className = 'layer-title';
                            blocsLabel.replaceWith(blocsLabelWrap);
                            blocsLabelWrap.appendChild(blocsLabel);
                        }
                        blocsCompound.appendChild(el);
                        grid.appendChild(blocsCompound);
                        var blocsObserver = new MutationObserver(function() {
                            blocsCompound.classList.toggle('active', el.classList.contains('toggle-on'));
                        });
                        blocsObserver.observe(el, { attributes: true, attributeFilter: ['class'] });
                        return;
                    }
                    el.classList.add('layer-card');
                    var icon = el.querySelector('.lucide-icon');
                    if (icon) {
                        var iconWrap = document.createElement('span');
                        iconWrap.className = 'layer-icon';
                        icon.replaceWith(iconWrap);
                        iconWrap.appendChild(icon);
                    }
                    var label = el.querySelector('.btn-text');
                    if (label) {
                        var labelWrap = document.createElement('span');
                        labelWrap.className = 'layer-title';
                        label.replaceWith(labelWrap);
                        labelWrap.appendChild(label);
                    }
                    grid.appendChild(el);
                });
                body.appendChild(grid);
                body.dataset.gridBuilt = '1';
            }

            function setPopoverA11y(triggerEl, open) {
                if (triggerEl) triggerEl.setAttribute('aria-expanded', open ? 'true' : 'false');
            }

            function openLayersModal(triggerEl) {
                if (layersModal.classList.contains('visible')) { closeLayersModal(); return; }
                buildLayersGrid();
                closeDivisionPopover();
                layersModal.classList.add('visible');
                positionPopover(layersModal, triggerEl || barLayersBtn || layersToggleBtn);
                setPopoverA11y(triggerEl, true);
                var first = layersModal.querySelector('.layers-modal-body .btn, .layers-modal-body .bloc-select');
                if (first) setTimeout(function() { first.focus(); }, 60);
            }

            function closeLayersModal() {
                if (!layersModal.classList.contains('visible')) return;
                layersModal.classList.remove('visible');
                setPopoverA11y(barLayersBtn, false);
                setPopoverA11y(layersToggleBtn, false);
                setPopoverA11y(mobileLayersBtn, false);
            }

            function openDivisionPopover(triggerEl) {
                if (divisionPopover.classList.contains('visible')) { closeDivisionPopover(); return; }
                closeLayersModal();
                divisionPopover.classList.add('visible');
                positionPopover(divisionPopover, triggerEl || barDivisionBtn);
                setPopoverA11y(triggerEl, true);
                var first = divisionPopover.querySelector('.layers-modal-body .btn');
                if (first) setTimeout(function() { first.focus(); }, 60);
            }

            function closeDivisionPopover() {
                if (!divisionPopover.classList.contains('visible')) return;
                divisionPopover.classList.remove('visible');
                setPopoverA11y(barDivisionBtn, false);
            }

            if (layersToggleBtn) layersToggleBtn.addEventListener('click', function() { openLayersModal(this); });
            if (barLayersBtn) barLayersBtn.addEventListener('click', function() { openLayersModal(this); });
            if (mobileLayersBtn) mobileLayersBtn.addEventListener('click', function() { openLayersModal(this); });
            if (barDivisionBtn) barDivisionBtn.addEventListener('click', function() { openDivisionPopover(this); });
            var layersModalCloseBtn = document.getElementById('layersModalClose');
            var divisionPopoverCloseBtn = document.getElementById('divisionPopoverClose');
            if (layersModalCloseBtn) layersModalCloseBtn.addEventListener('click', closeLayersModal);
            if (divisionPopoverCloseBtn) divisionPopoverCloseBtn.addEventListener('click', closeDivisionPopover);

            document.addEventListener('click', function(e) {
                if (layersModal && layersModal.classList.contains('visible')) {
                    if (layersModal.contains(e.target)) return;
                    if (e.target === layersToggleBtn || (layersToggleBtn && layersToggleBtn.contains(e.target)) ||
                        e.target === barLayersBtn || (barLayersBtn && barLayersBtn.contains(e.target)) ||
                        e.target === mobileLayersBtn || (mobileLayersBtn && mobileLayersBtn.contains(e.target))) return;
                    closeLayersModal();
                }
                if (divisionPopover && divisionPopover.classList.contains('visible')) {
                    if (divisionPopover.contains(e.target)) return;
                    if (barDivisionBtn && (e.target === barDivisionBtn || barDivisionBtn.contains(e.target))) return;
                    closeDivisionPopover();
                }
            });

            document.addEventListener('keydown', function(e) {
                if (e.key !== 'Escape') return;
                if (layersModal && layersModal.classList.contains('visible')) closeLayersModal();
                if (divisionPopover && divisionPopover.classList.contains('visible')) closeDivisionPopover();
            });

            var popoverResizeTimer = null;
            window.addEventListener('resize', function() {
                clearTimeout(popoverResizeTimer);
                popoverResizeTimer = setTimeout(function() {
                    if (layersModal.classList.contains('visible')) positionPopover(layersModal, barLayersBtn || layersToggleBtn);
                    if (divisionPopover.classList.contains('visible')) positionPopover(divisionPopover, barDivisionBtn);
                }, 80);
            });


        })();
