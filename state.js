import { t } from './i18n.js';

// Module: state
// Extracted from app.js by scripts/split-modules.js


            // ── Global error safety net ─────────────────────────────────
            // Catches anything that escapes the app's specific try/catch and
            // .catch(...) paths and surfaces a single non-blocking, dismissible
            // strip per session. Never a modal/full-page takeover, and it does
            // not replace the existing per-feature error states. Anchored above
            // the bottom-centre copy-notification (bottom:20px) and the
            // toolbar/menu-toggle (bottom:30px) so it does not overlap them.

export const BASE = window.__BASE_PATH || './';

export const APP_VERSION = '1.0.0';

export var _globalErrorNoticeShown = false;

export function showGlobalErrorNotice() {
                if (_globalErrorNoticeShown) return;
                _globalErrorNoticeShown = true;
                try {
                    var notice = document.createElement('div');
                    notice.style.cssText = 'position:fixed;bottom:96px;left:50%;transform:translateX(-50%);z-index:10000;background:rgba(20,20,25,0.95);color:#fff;padding:12px 20px;border-radius:12px;font-size:0.9em;display:flex;align-items:center;gap:10px;box-shadow:0 4px 20px rgba(0,0,0,0.4);border:1px solid rgba(255,90,90,0.4);max-width:90vw;';
                    var text = document.createElement('span');
                    text.textContent = t('unexpectedErrorNotice');
                    var dismissBtn = document.createElement('button');
                    dismissBtn.textContent = '✕';
                    dismissBtn.style.cssText = 'background:none;border:none;color:#9dd0ff;cursor:pointer;font-size:1em;padding:0 4px;';
                    dismissBtn.addEventListener('click', function() { notice.remove(); });
                    notice.appendChild(text);
                    notice.appendChild(dismissBtn);
                    document.body.appendChild(notice);
                } catch (err) {}
            }

window.addEventListener('error', function(e) {
                console.error('Unhandled error:', e.error || e.message);
                showGlobalErrorNotice();
            });

window.addEventListener('unhandledrejection', function(e) {
                console.error('Unhandled promise rejection:', e.reason);
                showGlobalErrorNotice();
            });

export function debounce(fn, delay) {
                let timer;
                return function(...args) {
                    clearTimeout(timer);
                    timer = setTimeout(() => fn.apply(this, args), delay);
                };
            }

// ── Screen reader announcer ──────────────────────────────────
// Posts a message to the visually-hidden #srAnnouncer live region so assistive
// technologies hear state changes that have no visual text (e.g. "Mode:
// Religion", "Country selected: Egypt"). Debounced to avoid spam.
export function announce(message) {
                try {
                    var el = document.getElementById('srAnnouncer');
                    if (!el) return;
                    el.textContent = '';
                    // Force re-announcement of identical consecutive messages
                    void el.offsetWidth;
                    el.textContent = message;
                } catch (e) {}
            }

export function prefersReducedMotion() {
                return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            }

export function applyTheme(theme) {
                document.documentElement.setAttribute('data-theme', theme);
                try { localStorage.setItem('theme', theme); } catch (e) {}
            }

export function getInitialTheme() {
                var saved = null;
                try { saved = localStorage.getItem('theme'); } catch (e) {}
                if (saved === 'light' || saved === 'dark') return saved;
                return (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
            }

applyTheme(getInitialTheme());

export const svgEl = document.getElementById('mapSvg');

export const tooltip = document.getElementById('tooltip');

export const legendEl = document.getElementById('legend');

export const infoOverlay = document.getElementById('infoOverlay');

export const coordinatesDisplay = document.getElementById('coordinatesDisplay');

export const copyNotification = document.getElementById('copyNotification');

export const langToggle = document.getElementById('langToggle');

export var langDropdownMenu = document.getElementById('langDropdownMenu');

if (langDropdownMenu) {
                document.body.appendChild(langDropdownMenu);
                langDropdownMenu.style.position = 'fixed';
            }

export var _resizeCallbacks = [];

export var _resizeTimer = null;

export function onWindowResize(callback) {
                _resizeCallbacks.push(callback);
            }

export function _runResizeHandlers() {
                _resizeCallbacks.forEach(function(fn) { try { fn(); } catch(e) {} });
            }

export function _scheduleResizeDispatch() {
                clearTimeout(_resizeTimer);
                _resizeTimer = setTimeout(_runResizeHandlers, 80);
            }

window.addEventListener('resize', _scheduleResizeDispatch);

export function positionLangDropdown() {
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

export function setActiveByAttr(buttons, selector) {
                buttons.forEach(function(b) { b.classList.remove('active'); });
                document.querySelectorAll(selector).forEach(function(b) { b.classList.add('active'); });
            }

export const modeButtons = document.querySelectorAll('.mode-btn');

export var religionButtons = [];

export const labelsToggle = document.getElementById('labelsToggle');

export const sectToggle = document.getElementById('sectToggle');

export const corridorsToggle = document.getElementById('routesToggle');

export const densitySpotsToggle = document.getElementById('densitySpotsToggle');

export const capitalsToggle = document.getElementById('capitalsToggle');

export const timezonesToggle = document.getElementById('timezonesToggle');

export const majorCitiesToggle = document.getElementById('majorCitiesToggle');

export const coordsToggle = document.getElementById('coordsToggle');

export const adminBoundariesToggle = document.getElementById('adminBoundariesToggle');

export const globeViewBtn = document.getElementById('globeViewBtn');

export const shareBtn = document.getElementById('shareBtn');

export const resetBtn = document.getElementById('resetBtn');

export const zoomInBtn = document.getElementById('zoomInBtn');

export const zoomOutBtn = document.getElementById('zoomOutBtn');

export const zoomResetBtn = document.getElementById('zoomResetBtn');

export const searchInput = document.getElementById('searchInput');

export const suggestionsList = document.getElementById('suggestionsList');

export const countryPanel = document.getElementById('countryPanel');

export const panelContent = document.getElementById('panelContent');

export const closePanelBtn = document.getElementById('closePanelBtn');

export const exportBtn = document.getElementById('exportBtn');

export const menuToggle = document.getElementById('menuToggle');

export const controlsBar = document.getElementById('controlsBar');

export const layersToggleBtn = document.getElementById('layersToggleBtn');

export const layersModal = document.getElementById('layersModal');

export const layersModalBackdrop = document.getElementById('layersModalBackdrop');

export const layersModalClose = document.getElementById('layersModalClose');

export const shortcutsOverlay = document.getElementById('shortcutsOverlay');

export const shortcutsBtn = document.getElementById('shortcutsBtn');

export const shortcutsClose = document.getElementById('shortcutsClose');

export const dataTableOverlay = document.getElementById('dataTableOverlay');

export const dataTableBtn = document.getElementById('dataTableBtn');

export const dataTableClose = document.getElementById('dataTableClose');

export const dataTableSearch = document.getElementById('dataTableSearch');

export const dataTableBody = document.getElementById('dataTableBody');

export const onboardingHint = document.getElementById('onboardingHint');

export const mapContainer = document.getElementById('mapContainer');

export const densityCanvas = document.getElementById('densityCanvas');

export let densityCtx = null;

export const adminBoundariesCanvas = document.getElementById('adminBoundariesCanvas');

export let adminBoundariesCtx = null;

export function initDensityCanvas() {
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

export let currentReligionFilter = 'all';

export let colorMode = 'normal';

export let selectedBloc = 'all';

export let showLabels = false;

export let sectMode = false;

export let corridorsVisible = false;

export let riversVisible = false;

export let densitySpotsMode = false;

export let capitalsVisible = false;

export let timezonesVisible = false;

export let majorCitiesVisible = false;

export let naturalResourcesVisible = false;

export let ethnicGroupsVisible = false;

export let oceanCurrentsVisible = false;

export let windsVisible = false;

export let earthquakesVisible = false;

export let volcanoesVisible = false;

export let additionalWaterwaysVisible = false;

export let geopoliticalBlocsVisible = false;

export let desertsForestsVisible = false;

export let borderDisputesVisible = false;

export let adminBoundariesVisible = false;

export let globeModeActive = false;

export let globeProjection = null;

export let globeRotation = [0, -20];

export let globeDragging = false;

export let globeRedrawPending = false;

export let globeDrag = null;

export let globeShadingGroup = null;

export let quizActive = false;

export let measureActive = false;

export let measurePoints = [];

export let measureKind = 'distance';

export let measureGeodesic = true;

export let measureFinalized = false;

export let gMeasure = null;

export let annotateActive = false;

export let annotateKind = 'pin';

export let annotateColor = '#eab308';

export let annotateFontSize = 'medium';

export let annotatePoints = [];

export let gAnnotations = null;

export let annotationsList = [];

export let presentationModeActive = false;

export let exportInProgress = false;

export let currentSessionCode = null;

export let currentStudentName = null;

export let lastQuizResults = null;

export let quizStartTime = null;

// Pending annotation being edited via inline dialog (replaces window.prompt)
export let pendingAnnotation = null;

export let coordsVisible = true;

export let colorblindMode = false;

export let adminBoundariesData = null;

export let adminBoundariesLoading = null;

export let adminBoundariesMerged = null;

export let adminBoundariesCentroids = null;

export let adminNameTranslations = null;

export let adminNameTranslationsLoading = null;

export let _adminBoundariesRedrawTimeout = null;

export let lang = (function() { var s = localStorage.getItem('mapLang'); return s && ['ar','en','ru','uz','es'].includes(s) ? s : 'ar'; })();

export let allCountryFeatures = [];

export let countryPaths = null;

export let selectedCountry = null;

export let compareCountry = null;

export let _lastPanelRenderTime = 0;

export let selectedFeature = null;

export let dataTableSortKey = 'name';

export let dataTableSortAsc = true;

export let selectedFeatureType = null;

export let gCapitals, gTimezones, gMajorCities, gNaturalResources, gEthnicGroups, gOceanCurrents, gWinds, gEarthquakes, gVolcanoes, gBorderDisputes, gAdminBoundaries, gGeopoliticalBlocs, gDesertsForests;

export let projection, pathGen;

export let svg, gMap, gCountries, gCountryGlow, gCountryLabels, gGraticule, gOcean, gCorridors, gPhysical, gTemperature, gAuthoringMarkers, gQuizMarkers;

export let currentTransform = d3.zoomIdentity;

export let _tooltipSize = { w: 180, h: 60 };

export let lastCanvasTransform = d3.zoomIdentity;

export let compareProjectionType = 'mercator';

export let compareSvg = null, compareG = null, compareCountriesG = null, compareZoomBehavior = null;

export let compareInitialized = false;

export let _isZooming = false;

export let _frozenCitySize = null;

export let zoomBehavior;

export let countryNamesList = [];

export let highlightTimeout = null;

export let countryLabelSelection = null;

export let _mapRectCache = null;

export let _mapRectFrame = 0;

export function getMapRect() {
                const frame = performance.now();
                if (_mapRectCache && Math.abs(frame - _mapRectFrame) < 16) return _mapRectCache;
                _mapRectCache = mapContainer.getBoundingClientRect();
                _mapRectFrame = frame;
                return _mapRectCache;
            }

export const MOBILE_BREAKPOINT = 768;

export let isMobile = window.innerWidth < MOBILE_BREAKPOINT;

export var _adminBakeDirty = true;

export let _tooltipRAFPending = false;

export let _pendingTooltipEvent = null;

export var a11yLastOutside = null;

export var a11yDialogWasOpen = false;

// State mutation gateway: ES module imports are read-only bindings, so all
// cross-module state writes are routed through this function.
export function setState(name, value) {
    switch (name) {
        case '_adminBakeDirty': _adminBakeDirty = value; return value;
        case '_adminBoundariesRedrawTimeout': _adminBoundariesRedrawTimeout = value; return value;
        case '_frozenCitySize': _frozenCitySize = value; return value;
        case '_globalErrorNoticeShown': _globalErrorNoticeShown = value; return value;
        case '_isZooming': _isZooming = value; return value;
        case '_lastPanelRenderTime': _lastPanelRenderTime = value; return value;
        case '_mapRectCache': _mapRectCache = value; return value;
        case '_mapRectFrame': _mapRectFrame = value; return value;
        case '_pendingTooltipEvent': _pendingTooltipEvent = value; return value;
        case '_resizeCallbacks': _resizeCallbacks = value; return value;
        case '_resizeTimer': _resizeTimer = value; return value;
        case '_tooltipRAFPending': _tooltipRAFPending = value; return value;
        case '_tooltipSize': _tooltipSize = value; return value;
        case 'a11yDialogWasOpen': a11yDialogWasOpen = value; return value;
        case 'a11yLastOutside': a11yLastOutside = value; return value;
        case 'additionalWaterwaysVisible': additionalWaterwaysVisible = value; return value;
        case 'adminBoundariesCentroids': adminBoundariesCentroids = value; return value;
        case 'adminBoundariesCtx': adminBoundariesCtx = value; return value;
        case 'adminBoundariesData': adminBoundariesData = value; return value;
        case 'adminBoundariesLoading': adminBoundariesLoading = value; return value;
        case 'adminBoundariesMerged': adminBoundariesMerged = value; return value;
        case 'adminBoundariesVisible': adminBoundariesVisible = value; return value;
        case 'adminNameTranslations': adminNameTranslations = value; return value;
        case 'adminNameTranslationsLoading': adminNameTranslationsLoading = value; return value;
        case 'allCountryFeatures': allCountryFeatures = value; return value;
        case 'annotateActive': annotateActive = value; return value;
        case 'annotateKind': annotateKind = value; return value;
        case 'annotateColor': annotateColor = value; return value;
        case 'annotateFontSize': annotateFontSize = value; return value;
        case 'annotatePoints': annotatePoints = value; return value;
        case 'annotationsList': annotationsList = value; return value;
        case 'borderDisputesVisible': borderDisputesVisible = value; return value;
        case 'capitalsVisible': capitalsVisible = value; return value;
        case 'colorMode': colorMode = value; return value;
        case 'compareCountriesG': compareCountriesG = value; return value;
        case 'compareCountry': compareCountry = value; return value;
        case 'compareG': compareG = value; return value;
        case 'compareInitialized': compareInitialized = value; return value;
        case 'compareProjectionType': compareProjectionType = value; return value;
        case 'compareSvg': compareSvg = value; return value;
        case 'compareZoomBehavior': compareZoomBehavior = value; return value;
        case 'coordsVisible': coordsVisible = value; return value;
        case 'colorblindMode': colorblindMode = value; return value;
        case 'corridorsVisible': corridorsVisible = value; return value;
        case 'countryLabelSelection': countryLabelSelection = value; return value;
        case 'countryNamesList': countryNamesList = value; return value;
        case 'countryPaths': countryPaths = value; return value;
        case 'currentReligionFilter': currentReligionFilter = value; return value;
        case 'currentSessionCode': currentSessionCode = value; return value;
        case 'currentStudentName': currentStudentName = value; return value;
        case 'currentTransform': currentTransform = value; return value;
        case 'dataTableSortAsc': dataTableSortAsc = value; return value;
        case 'dataTableSortKey': dataTableSortKey = value; return value;
        case 'densityCtx': densityCtx = value; return value;
        case 'densitySpotsMode': densitySpotsMode = value; return value;
        case 'desertsForestsVisible': desertsForestsVisible = value; return value;
        case 'earthquakesVisible': earthquakesVisible = value; return value;
        case 'ethnicGroupsVisible': ethnicGroupsVisible = value; return value;
        case 'exportInProgress': exportInProgress = value; return value;
        case 'gAdminBoundaries': gAdminBoundaries = value; return value;
        case 'gAnnotations': gAnnotations = value; return value;
        case 'gAuthoringMarkers': gAuthoringMarkers = value; return value;
        case 'gBorderDisputes': gBorderDisputes = value; return value;
        case 'gCapitals': gCapitals = value; return value;
        case 'gCorridors': gCorridors = value; return value;
        case 'gCountries': gCountries = value; return value;
        case 'gCountryGlow': gCountryGlow = value; return value;
        case 'gCountryLabels': gCountryLabels = value; return value;
        case 'gDesertsForests': gDesertsForests = value; return value;
        case 'gEarthquakes': gEarthquakes = value; return value;
        case 'gEthnicGroups': gEthnicGroups = value; return value;
        case 'gGeopoliticalBlocs': gGeopoliticalBlocs = value; return value;
        case 'gGraticule': gGraticule = value; return value;
        case 'gMajorCities': gMajorCities = value; return value;
        case 'gMap': gMap = value; return value;
        case 'gMeasure': gMeasure = value; return value;
        case 'gNaturalResources': gNaturalResources = value; return value;
        case 'gOcean': gOcean = value; return value;
        case 'gOceanCurrents': gOceanCurrents = value; return value;
        case 'gPhysical': gPhysical = value; return value;
        case 'gQuizMarkers': gQuizMarkers = value; return value;
        case 'gTemperature': gTemperature = value; return value;
        case 'gTimezones': gTimezones = value; return value;
        case 'gVolcanoes': gVolcanoes = value; return value;
        case 'gWinds': gWinds = value; return value;
        case 'geopoliticalBlocsVisible': geopoliticalBlocsVisible = value; return value;
        case 'globeDrag': globeDrag = value; return value;
        case 'globeDragging': globeDragging = value; return value;
        case 'globeModeActive': globeModeActive = value; return value;
        case 'globeProjection': globeProjection = value; return value;
        case 'globeRedrawPending': globeRedrawPending = value; return value;
        case 'globeRotation': globeRotation = value; return value;
        case 'globeShadingGroup': globeShadingGroup = value; return value;
        case 'highlightTimeout': highlightTimeout = value; return value;
        case 'isMobile': isMobile = value; return value;
        case 'lang': lang = value; return value;
        case 'langDropdownMenu': langDropdownMenu = value; return value;
        case 'lastCanvasTransform': lastCanvasTransform = value; return value;
        case 'lastQuizResults': lastQuizResults = value; return value;
        case 'pendingAnnotation': pendingAnnotation = value; return value;
        case 'majorCitiesVisible': majorCitiesVisible = value; return value;
        case 'measureActive': measureActive = value; return value;
        case 'measureFinalized': measureFinalized = value; return value;
        case 'measureGeodesic': measureGeodesic = value; return value;
        case 'measureKind': measureKind = value; return value;
        case 'measurePoints': measurePoints = value; return value;
        case 'naturalResourcesVisible': naturalResourcesVisible = value; return value;
        case 'oceanCurrentsVisible': oceanCurrentsVisible = value; return value;
        case 'pathGen': pathGen = value; return value;
        case 'presentationModeActive': presentationModeActive = value; return value;
        case 'projection': projection = value; return value;
        case 'quizActive': quizActive = value; return value;
        case 'quizStartTime': quizStartTime = value; return value;
        case 'religionButtons': religionButtons = value; return value;
        case 'riversVisible': riversVisible = value; return value;
        case 'sectMode': sectMode = value; return value;
        case 'selectedBloc': selectedBloc = value; return value;
        case 'selectedCountry': selectedCountry = value; return value;
        case 'selectedFeature': selectedFeature = value; return value;
        case 'selectedFeatureType': selectedFeatureType = value; return value;
        case 'showLabels': showLabels = value; return value;
        case 'svg': svg = value; return value;
        case 'timezonesVisible': timezonesVisible = value; return value;
        case 'volcanoesVisible': volcanoesVisible = value; return value;
        case 'windsVisible': windsVisible = value; return value;
        case 'zoomBehavior': zoomBehavior = value; return value;
        default: throw new Error("setState: unknown state name " + name);
    }
}
