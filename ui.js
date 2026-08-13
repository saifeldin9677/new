import { religionArabic, religionRussian, religionSpanish, religionUzbek } from './data.js';
import { APP_VERSION, borderDisputesVisible, capitalsVisible, corridorsVisible, countryNamesList, countryPanel, currentReligionFilter, dataTableBody, dataTableOverlay, dataTableSearch, dataTableSortAsc, dataTableSortKey, densitySpotsMode, desertsForestsVisible, earthquakesVisible, ethnicGroupsVisible, geopoliticalBlocsVisible, lang, layersModal, majorCitiesVisible, naturalResourcesVisible, oceanCurrentsVisible, prefersReducedMotion, quizActive, religionButtons, riversVisible, selectedBloc, setActiveByAttr, setState, shortcutsOverlay, svg, timezonesVisible, volcanoesVisible, windsVisible, zoomBehavior } from './state.js';
import { fmtDate, fmtNum, getDisplayName, getReligion, htmlEscape, t } from './i18n.js';
import { LAYER_DEFS, getContinent, getCountryInfo, getDensity, getGDP, getHDI, setMode, toggleBorderDisputes, toggleCapitals, toggleCorridors, toggleDensitySpots, toggleDesertsForests, toggleEarthquakes, toggleEthnicGroups, toggleGeopoliticalBlocs, toggleLabels, toggleMajorCities, toggleNaturalResources, toggleOceanCurrents, toggleRivers, toggleSect, toggleTimezones, toggleVolcanoes, toggleWinds, updateActiveLayerCount, updateAllStyles } from './layers.js';
import { closeCountryPanel, updateHash } from './map-core.js';

// Module: ui
// Extracted from app.js by scripts/split-modules.js


            // ── Data table overlay listeners ──

export function openDataTable() {
                renderDataTable();
                dataTableOverlay.classList.add('visible');
            }

export function closeDataTable() {
                dataTableOverlay.classList.remove('visible');
            }

export function getTranslatedReligion(key) {
                if (!key) return t('unknown');
                if (lang === 'ar') return religionArabic[key] || key;
                if (lang === 'ru') return religionRussian[key] || key;
                if (lang === 'uz') return religionUzbek[key] || key;
                if (lang === 'es') return religionSpanish[key] || key;
                return key;
            }

export function renderDataTable() {
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
                    html += '<td>' + htmlEscape(r.continent) + '</td>';
                    html += '<td>' + (r.population != null ? fmtNum(r.population) : t('unknown')) + '</td>';
                    html += '<td>' + (r.area != null ? fmtNum(r.area) : t('unknown')) + '</td>';
                    html += '<td>' + (r.density != null ? r.density + ' ' + t('densityUnit') : t('unknown')) + '</td>';
                    html += '<td>' + (r.gdp != null ? '$' + fmtNum(r.gdp) : t('unknown')) + '</td>';
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

export var onboardBtn = document.getElementById('onboardBtn');

export function isAnyOverlayOpen() {
                // Reuses the same state checks as the Escape-key close logic.
                if (dataTableOverlay && dataTableOverlay.classList.contains('visible')) return true;
                if (shortcutsOverlay && shortcutsOverlay.classList.contains('visible')) return true;
                if (layersModal && layersModal.classList.contains('visible')) return true;
                var overlayCompareEl = document.getElementById('projectionCompareOverlay');
                if (overlayCompareEl && overlayCompareEl.style.display === 'flex') return true;
                if (countryPanel && countryPanel.classList.contains('visible')) return true;
                var overlayOnboardEl = document.getElementById('onboardOverlay');
                if (overlayOnboardEl && overlayOnboardEl.classList.contains('active')) return true;
                // Quiz setup / builder / review / results screens (quizActive is guarded separately).
                var overlayQuizIds = ['quizModeChoiceOverlay', 'quizSetupOverlay', 'quizCustomSetupOverlay', 'quizAuthoringOverlay', 'quizReviewOverlay', 'quizEndOverlay', 'quizResultsOverlay'];
                for (var overlayQi = 0; overlayQi < overlayQuizIds.length; overlayQi++) {
                    var overlayQEl = document.getElementById(overlayQuizIds[overlayQi]);
                    if (overlayQEl && overlayQEl.style.display !== 'none') return true;
                }
                return false;
            }

export function setupKeyboard() {
                document.addEventListener('keydown', function(e) {
                    var tag = e.target.tagName;
                    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
                    if (quizActive) return;
                    // Don't fire map shortcuts while any overlay/panel is open.
                    // Exempt Escape so it can still close the open overlay (see Escape branch below).
                    if (isAnyOverlayOpen() && e.code !== 'Escape') return;
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
                        toggleSect(); } else if (code === 'Digit1') { setState('currentReligionFilter', 'all');
                        updateReligionButtons();
                        updateAllStyles(); } else if (code === 'Digit2') { setState('currentReligionFilter', 'muslim');
                        updateReligionButtons();
                        updateAllStyles(); } else if (code === 'Digit3') { setState('currentReligionFilter', 'christian');
                        updateReligionButtons();
                        updateAllStyles(); } else if (code === 'Digit4') { setState('currentReligionFilter', 'hindu');
                        updateReligionButtons();
                        updateAllStyles(); } else if (code === 'Digit5') { setState('currentReligionFilter', 'buddhist');
                        updateReligionButtons();
                        updateAllStyles(); } else if (code === 'Digit6') { setState('currentReligionFilter', 'jewish');
                        updateReligionButtons();
                        updateAllStyles(); } else if (code === 'Digit7') { setState('currentReligionFilter', 'other');
                        updateReligionButtons();
                        updateAllStyles();                         } else if (code === 'Escape') {
                            // Close the topmost open overlay/panel only. If nothing is open,
                            // Escape is a no-op — it must never trigger a full reset.
                            var escapeQuizOverlays = ['quizModeChoiceOverlay', 'quizSetupOverlay', 'quizCustomSetupOverlay', 'quizAuthoringOverlay', 'quizReviewOverlay', 'quizEndOverlay', 'quizResultsOverlay'];
                            var escapeQuizOpen = null;
                            for (var escapeQi = 0; escapeQi < escapeQuizOverlays.length && !escapeQuizOpen; escapeQi++) {
                                var escapeQEl = document.getElementById(escapeQuizOverlays[escapeQi]);
                                if (escapeQEl && escapeQEl.style.display !== 'none') escapeQuizOpen = escapeQEl;
                            }
                            if (escapeQuizOpen) {
                                escapeQuizOpen.style.display = 'none';
                            } else if (layersModal && layersModal.classList.contains('visible')) {
                                closeLayersModal();
                            } else if (dataTableOverlay && dataTableOverlay.classList.contains('visible')) {
                                closeDataTable();
                            } else if (shortcutsOverlay.classList.contains('visible')) {
                                shortcutsOverlay.classList.remove('visible');
                            } else {
                                var escapeCompareEl = document.getElementById('projectionCompareOverlay');
                                if (escapeCompareEl && escapeCompareEl.style.display === 'flex') {
                                    if (window.closeProjectionCompare) window.closeProjectionCompare();
                                } else if (countryPanel.classList.contains('visible')) {
                                    closeCountryPanel();
                                } else {
                                    var escapeOnboardEl = document.getElementById('onboardOverlay');
                                    if (escapeOnboardEl && escapeOnboardEl.classList.contains('active') && window.closeOnboarding) {
                                        window.closeOnboarding();
                                    }
                                }
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

export function updateReligionButtons() {
                setActiveByAttr(religionButtons, `.religion-btn[data-religion="${currentReligionFilter}"]`);
            }

export const riversToggle = document.getElementById('riversToggle');

export const blocSelect = document.getElementById('blocSelect');

export function toggleLangDropdown(btn, menu) {
                var isVisible = menu.classList.contains('visible');
                document.querySelectorAll('.lang-dropdown-menu.visible').forEach(function(m) { m.classList.remove('visible'); });
                if (!isVisible) menu.classList.toggle('visible');
            }

export const measureKindDistBtn = document.getElementById('measureKindDist');

export const measureKindAreaBtn = document.getElementById('measureKindArea');

export const measureGeodesicBtn2 = document.getElementById('measureGeodesicBtn');

export const measurePlanarBtn2 = document.getElementById('measurePlanarBtn');

export const measureFinishBtn2 = document.getElementById('measureFinishBtn');

export const measureClearBtn2 = document.getElementById('measureClearBtn');

export function setupReligionButtons() {
                setState('religionButtons', document.querySelectorAll('.religion-btn'));
                religionButtons.forEach(function(b) {
                    b.addEventListener('click', function() {
                        setState('currentReligionFilter', b.dataset.religion);
                        setActiveByAttr(religionButtons, '.religion-btn[data-religion="' + b.dataset.religion + '"]');
                        updateAllStyles();
                    });
                });
            }

export var aboutBtn = document.getElementById('aboutBtn');

export var presetsBtn = document.getElementById('presetsBtn');

export var mobileLangBtn = document.getElementById('mobileLangToggle');

export var mobileSearchInput = document.getElementById('mobileSearchInput');

export var mobileShareBtn = document.getElementById('mobileShareBtn');

export var mobileModeBtn = document.getElementById('mobileModeBtn');

export var mobileLayersBtn = document.getElementById('mobileLayersBtn');

export var mobileResetBtn2 = document.getElementById('mobileResetBtn2');

export var mobileToolsBtn = document.getElementById('mobileToolsBtn');

export var mobileToolsMenu = document.getElementById('mobileToolsMenu');

export var mobileOnboardBtn = document.getElementById('mobileOnboardBtn');

export var mobileShortcutsBtn = document.getElementById('mobileShortcutsBtn');

export var mobilePdfBtn = document.getElementById('mobilePdfBtn');

export var mobileCoordsBtn = document.getElementById('mobileCoordsBtn');

export var modeSheet = document.getElementById('mobileModeSheet');

export var modeSheetBackdrop = document.getElementById('mobileModeSheetBackdrop');

export var modeSheetClose = document.getElementById('mobileModeSheetClose');

export var mobileModeBtns = document.querySelectorAll('#mobileModeButtons .mode-btn');

export var mobileFilterBtns = document.querySelectorAll('#mobileFilterButtons .religion-btn');

export var mobileAboutBtn = document.getElementById('mobileAboutBtn');

export var mobilePresetsBtn = document.getElementById('mobilePresetsBtn');

export function closeMobileToolsMenu() { if (mobileToolsMenu) mobileToolsMenu.classList.remove('open'); }

// ── Accessibility: dialog focus management ─────────────────────────
// ARIA best practice: when a dialog opens, focus moves into it;
// when it closes, focus returns to the element that opened it.
// Also mark background landmarks aria-hidden so screen readers
// don't navigate to content behind the modal.

// Module-level state (not exported for direct writing — use the helpers)
var _a11yDialogTrigger = null;
var _a11yBackgroundSiblings = null;

export function _setA11yDialogTrigger(el) {
    _a11yDialogTrigger = el;
}

export function _a11yFocusFirstInDialog(dialogEl) {
    if (!dialogEl) return;
    var selectors = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';
    var focusables = Array.prototype.filter.call(dialogEl.querySelectorAll(selectors), a11yIsVisible);
    if (focusables.length) {
        focusables[0].focus();
    }
}

export function _a11yHideBackground(dialogEl) {
    // Remove aria-hidden from any prior conversation
    _a11yRestoreBackground();
    var siblings = [];
    var parent = dialogEl.parentElement;
    if (parent) {
        Array.prototype.forEach.call(parent.children, function(child) {
            if (child !== dialogEl && a11yIsVisible(child)) {
                // Only hide meaningful landmarks, not empty containers
                if (child.matches('header, .header, .controls-bar, .legend, #mapContainer, .zoom-controls, .coordinates-display, .mobile-topbar, .mobile-bottom-nav, .menu-toggle, .layers-toggle, .country-panel, .tooltip, .copy-notification, .onboarding-hint, .presentation-exit-btn, .quiz-overlay, .quiz-feedback, .quiz-authoring-banner, .layers-modal, .shortcuts-overlay, .data-table-overlay, .export-blocking-overlay, .lang-overlay, .onboard-overlay, .quiz-custom-panels, .projection-compare-dock, .lang-dropdown-menu, .mobile-tools-menu, .mobile-mode-sheet, .suggestions-list, .border-disputes-counter, .info-overlay, .measure-toolbar, .annotation-toolbar, .measure-result-label')) {
                    child.setAttribute('aria-hidden', 'true');
                    siblings.push(child);
                }
            }
        });
    } else {
        // Fallback: hide body children except the dialog
        Array.prototype.forEach.call(document.body.children, function(child) {
            if (child !== dialogEl && a11yIsVisible(child)) {
                child.setAttribute('aria-hidden', 'true');
                siblings.push(child);
            }
        });
    }
    _a11yBackgroundSiblings = siblings;
}

export function _a11yRestoreBackground() {
    if (_a11yBackgroundSiblings) {
        _a11yBackgroundSiblings.forEach(function(el) {
            el.removeAttribute('aria-hidden');
        });
        _a11yBackgroundSiblings = null;
    }
}

export function _a11yRestoreFocus() {
    _a11yRestoreBackground();
    if (_a11yDialogTrigger && _a11yDialogTrigger.isConnected) {
        _a11yDialogTrigger.focus();
    }
    _a11yDialogTrigger = null;
}

export function openLayersModal() {
                var layersRow = document.querySelector('.layers-row');
                var body = document.getElementById('layersModalBody');
                if (layersRow && body) {
                    var btnRow = document.createElement('div');
                    btnRow.style.cssText = 'display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap;';
                    var allOffBtn = document.createElement('button');
                    allOffBtn.className = 'btn';
                    allOffBtn.textContent = t('allOff');
                    allOffBtn.addEventListener('click', function() {
                        document.querySelectorAll('.layers-row .btn.toggle-on').forEach(function(b) { b.click(); });
                        updateActiveLayerCount();
                        closeLayersModal();
                    });
                    btnRow.appendChild(allOffBtn);
                    var resetLayersBtn = document.createElement('button');
                    resetLayersBtn.className = 'btn';
                    resetLayersBtn.textContent = t('resetLayers');
                    resetLayersBtn.addEventListener('click', function() {
                        if (corridorsVisible) toggleCorridors();
                        if (riversVisible) toggleRivers();
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
                            setState('selectedBloc', 'all');
                            document.getElementById('blocSelect').value = 'all';
                        }
                        updateActiveLayerCount();
                        closeLayersModal();
                    });
                    btnRow.appendChild(resetLayersBtn);
                    body.appendChild(btnRow);
                    var categories = [
                        { label: t('catGeneral'), ids: ['labelsToggle','sectToggle','coordsToggle'] },
                        { label: t('catPopulation'), ids: ['capitalsToggle','majorCitiesToggle','timezonesToggle','densitySpotsToggle'] },
                        { label: t('catTransport'), ids: ['routesToggle','riversToggle'] },
                        { label: t('catPolitics'), ids: ['geopoliticalBlocsToggle','blocSelect','borderDisputesToggle'] },
                        { label: t('catEnvironment'), ids: ['naturalResourcesToggle','ethnicGroupsToggle','desertsForestsToggle'] },
                        { label: t('catClimate'), ids: ['oceanCurrentsToggle','windsToggle','earthquakesToggle','volcanoesToggle'] },
                    ];
                    body.innerHTML = '';
                    var temp = document.createDocumentFragment();
                    categories.forEach(function(cat) {
                    var catDiv = document.createElement('div');
                    catDiv.className = 'layers-category';
                    var h4 = document.createElement('h3');
                    h4.textContent = cat.label;
                    catDiv.appendChild(h4);
                        var itemsDiv = document.createElement('div');
                        itemsDiv.className = 'layers-items';
                        cat.ids.forEach(function(id) {
                            var el = document.getElementById(id);
                            if (el && layersRow.contains(el)) {
                                itemsDiv.appendChild(el);
                            }
                        });
                        if (itemsDiv.children.length) {
                            catDiv.appendChild(itemsDiv);
                            temp.appendChild(catDiv);
                        }
                    });
                    var remaining = [].slice.call(layersRow.children);
                    remaining.forEach(function(el) {
                        var catDiv = document.createElement('div');
                        catDiv.className = 'layers-category';
                        var itemsDiv = document.createElement('div');
                        itemsDiv.className = 'layers-items';
                        itemsDiv.appendChild(el);
                        catDiv.appendChild(itemsDiv);
                        temp.appendChild(catDiv);
                    });
                    body.appendChild(temp);
                }
                layersModal.classList.add('visible');
                 _setA11yDialogTrigger(document.activeElement);
                 setTimeout(function() { _a11yFocusFirstInDialog(layersModal); _a11yHideBackground(layersModal); }, 0);
             }

export function closeLayersModal() {
                 var layersRow = document.querySelector('.layers-row');
                var body = document.getElementById('layersModalBody');
                if (layersRow && body) {
                    var all = body.querySelectorAll('.btn, .bloc-select');
                    Array.prototype.forEach.call(all, function(el) { layersRow.appendChild(el); });
                 body.innerHTML = '';
                 }
                 layersModal.classList.remove('visible');
                 _a11yRestoreFocus();
             }

export const aboutModal = document.getElementById('aboutModal');

export const aboutModalBackdrop = document.getElementById('aboutModalBackdrop');

export const aboutModalClose = document.getElementById('aboutModalClose');

export const A11Y_DIALOG_SELECTOR = '[role="dialog"], .layers-modal, .quiz-overlay, .quiz-custom-panels, .shortcuts-overlay, .data-table-overlay, .mobile-mode-sheet';

export const A11Y_FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), iframe';

export function a11yIsVisible(el) {
                if (!el || !el.isConnected) return false;
                var st = getComputedStyle(el);
                if (st.display === 'none' || st.visibility === 'hidden' || el.getAttribute('aria-hidden') === 'true') return false;
                return true;
            }

export function a11yOpenDialog() {
                var els = document.querySelectorAll(A11Y_DIALOG_SELECTOR);
                for (var i = els.length - 1; i >= 0; i--) {
                    if (a11yIsVisible(els[i])) return els[i];
                }
                return null;
            }

export var a11ySkipLink = document.querySelector('.skip-link');

export const LAYER_META = [
                { id: 'base',      nameKey: 'layerMetaBaseName',      srcKey: 'layerMetaBaseSource',      licKey: 'layerMetaBaseLicense',      dateKey: 'layerMetaBaseDate',      accKey: 'layerMetaBaseAccuracy',      layers: [] },
                { id: 'admin',     nameKey: 'layerMetaAdminName',     srcKey: 'layerMetaAdminSource',     licKey: 'layerMetaAdminLicense',     dateKey: 'layerMetaAdminDate',     accKey: 'layerMetaAdminAccuracy',     layers: ['adminBoundaries'] },
                { id: 'rivers',    nameKey: 'layerMetaRiversName',    srcKey: 'layerMetaRiversSource',    licKey: 'layerMetaRiversLicense',    dateKey: 'layerMetaRiversDate',    accKey: 'layerMetaRiversAccuracy',    layers: ['rivers'] },
                { id: 'landforms', nameKey: 'layerMetaLandformsName', srcKey: 'layerMetaLandformsSource', licKey: 'layerMetaLandformsLicense', dateKey: 'layerMetaLandformsDate', accKey: 'layerMetaLandformsAccuracy', layers: ['desertsForests', 'densitySpots'] },
                { id: 'human',     nameKey: 'layerMetaHumanName',     srcKey: 'layerMetaHumanSource',     licKey: 'layerMetaHumanLicense',     dateKey: 'layerMetaHumanDate',     accKey: 'layerMetaHumanAccuracy',     layers: ['capitals', 'majorCities', 'ethnicGroups', 'geopoliticalBlocs', 'borderDisputes', 'naturalResources'] },
                { id: 'ocean',     nameKey: 'layerMetaOceanName',     srcKey: 'layerMetaOceanSource',     licKey: 'layerMetaOceanLicense',     dateKey: 'layerMetaOceanDate',     accKey: 'layerMetaOceanAccuracy',     layers: ['oceanCurrents', 'winds'] },
                { id: 'hazards',   nameKey: 'layerMetaHazardsName',   srcKey: 'layerMetaHazardsSource',   licKey: 'layerMetaHazardsLicense',   dateKey: 'layerMetaHazardsDate',   accKey: 'layerMetaHazardsAccuracy',   layers: ['earthquakes', 'volcanoes'] },
                { id: 'timezone',  nameKey: 'layerMetaTimezoneName',  srcKey: 'layerMetaTimezoneSource',  licKey: 'layerMetaTimezoneLicense',  dateKey: 'layerMetaTimezoneDate',  accKey: 'layerMetaTimezoneAccuracy',  layers: ['timezones'] }
            ];

export function getActiveLayerMetaGroups() {
                const active = [];
                LAYER_META.forEach(function(g) {
                    let on = g.layers.length === 0;
                    if (!on) {
                        on = g.layers.some(function(id) {
                            const def = LAYER_DEFS[id];
                            return def ? !!def.getFlag() : false;
                        });
                    }
                    if (on) active.push(g);
                });
                return active;
            }

export function renderAboutModal() {
                const body = document.getElementById('aboutModalBody');
                if (!body) return;
                body.innerHTML = '';
                const section = (key, lines) => {
                    const s = document.createElement('div');
                    s.className = 'about-section';
                    const h = document.createElement('h3');
                    h.className = 'about-section-title';
                    h.textContent = t(key);
                    s.appendChild(h);
                    lines.forEach(function(txt) {
                        const p = document.createElement('p');
                        p.textContent = txt;
                        s.appendChild(p);
                    });
                    body.appendChild(s);
                };
                section('aboutIntro', [t('aboutVersion', { version: APP_VERSION })]);
                section('aboutDataSources', [
                    t('aboutSrcBorders'),
                    t('aboutSrcPhysical'),
                    t('aboutSrcHuman'),
                    t('aboutSrcHazards'),
                    t('aboutSrcTimezone'),
                    t('aboutNotes')
                ]);
                section('layerMetaTitle', [t('layerMetaIntro')]);
                const table = document.createElement('table');
                table.className = 'about-meta-table';
                const thead = document.createElement('thead');
                const hr = document.createElement('tr');
                [t('layerMetaColLayer'), t('layerMetaColSource'), t('layerMetaColLicense'), t('layerMetaColDate'), t('layerMetaColAccuracy')].forEach(function(h) {
                    const th = document.createElement('th');
                    th.textContent = h;
                    hr.appendChild(th);
                });
                thead.appendChild(hr);
                table.appendChild(thead);
                const tbody = document.createElement('tbody');
                LAYER_META.forEach(function(g) {
                    const tr = document.createElement('tr');
                    [t(g.nameKey), t(g.srcKey), t(g.licKey), t(g.dateKey), t(g.accKey)].forEach(function(v, i) {
                        const td = document.createElement('td');
                        td.textContent = v;
                        if (i === 0) td.className = 'about-meta-layer';
                        tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                });
                table.appendChild(tbody);
                body.appendChild(table);
            }

export function openAboutModal() {
                 if (!aboutModal) return;
                 renderAboutModal();
                 aboutModal.classList.add('visible');
                 _setA11yDialogTrigger(document.activeElement);
                 setTimeout(function() { _a11yFocusFirstInDialog(aboutModal); _a11yHideBackground(aboutModal); }, 0);
             }

export function closeAboutModal() {
                 if (aboutModal) { aboutModal.classList.remove('visible'); _a11yRestoreFocus(); }
             }

export const presetsModal = document.getElementById('presetsModal');

export const presetsModalBackdrop = document.getElementById('presetsModalBackdrop');

export const presetsModalClose = document.getElementById('presetsModalClose');

export const PRESETS_KEY = 'lepPresets';

export function showToast(text) {
                const n = document.getElementById('copyNotification');
                if (!n) return;
                n.textContent = text;
                n.classList.add('show');
                clearTimeout(n._toastTimer);
                n._toastTimer = setTimeout(function() { n.classList.remove('show'); }, 2000);
            }

export function getPresets() {
                try {
                    const raw = localStorage.getItem(PRESETS_KEY);
                    if (!raw) return [];
                    const arr = JSON.parse(raw);
                    return Array.isArray(arr) ? arr : [];
                } catch (e) { return []; }
            }

export function persistPresets(list) {
                try { localStorage.setItem(PRESETS_KEY, JSON.stringify(list.slice(0, 50))); } catch (e) {}
            }

export function renderPresetsModal() {
                const body = document.getElementById('presetsModalBody');
                if (!body) return;
                body.innerHTML = '';
                const list = getPresets();
                const saveRow = document.createElement('div');
                saveRow.style.cssText = 'display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;';
                const nameInput = document.createElement('input');
                nameInput.type = 'text';
                nameInput.id = 'presetsNameInput';
                nameInput.placeholder = t('presetsNamePlaceholder');
                nameInput.style.cssText = 'flex:1;min-width:140px;padding:6px 10px;border-radius:var(--radius-sm);background:var(--btn-bg);color:var(--text);border:1px solid var(--border);font-size:0.78em;font-family:inherit;';
                const saveBtn = document.createElement('button');
                saveBtn.className = 'btn';
                saveBtn.textContent = t('presetsSave');
                saveBtn.addEventListener('click', function() {
                    const name = (nameInput.value || '').trim();
                    if (!name) return;
                    updateHash();
                    let hash = window.location.hash || '';
                    if (!hash.startsWith('#')) hash = '#' + hash;
                    const next = getPresets();
                    next.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name: name, hash: hash, created: Date.now() });
                    persistPresets(next);
                    showToast(t('presetsSavedToast'));
                    renderPresetsModal();
                });
                nameInput.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') saveBtn.click();
                });
                saveRow.appendChild(nameInput);
                saveRow.appendChild(saveBtn);
                body.appendChild(saveRow);
                if (!list.length) {
                    const empty = document.createElement('p');
                    empty.style.cssText = 'color:var(--text-secondary);font-size:0.78em;';
                    empty.textContent = t('presetsEmpty');
                    body.appendChild(empty);
                    return;
                }
                const wrap = document.createElement('div');
                list.slice().reverse().forEach(function(p) {
                    const row = document.createElement('div');
                    row.className = 'preset-row';
                    const info = document.createElement('div');
                    info.className = 'preset-info';
                    const nameEl = document.createElement('span');
                    nameEl.className = 'preset-name';
                    nameEl.textContent = p.name || '\u2014';
                    const dateEl = document.createElement('span');
                    dateEl.className = 'preset-date';
                    dateEl.textContent = p.created ? fmtDate(p.created) : '';
                    info.appendChild(nameEl);
                    info.appendChild(dateEl);
                    const loadBtn = document.createElement('button');
                    loadBtn.className = 'btn';
                    loadBtn.textContent = t('presetsLoad');
                    loadBtn.addEventListener('click', function() {
                        if (p.hash) window.location.hash = p.hash;
                        window.location.reload();
                    });
                    const delBtn = document.createElement('button');
                    delBtn.className = 'btn preset-delete';
                    delBtn.textContent = t('presetsDelete');
                    delBtn.addEventListener('click', function() {
                        persistPresets(getPresets().filter(function(x) { return x.id !== p.id; }));
                        showToast(t('presetsDeletedToast'));
                        renderPresetsModal();
                    });
                    const actions = document.createElement('div');
                    actions.className = 'preset-actions';
                    actions.appendChild(loadBtn);
                    actions.appendChild(delBtn);
                    row.appendChild(info);
                    row.appendChild(actions);
                    wrap.appendChild(row);
                });
                body.appendChild(wrap);
            }

export function openPresetsModal() {
                 if (!presetsModal) return;
                 renderPresetsModal();
                 presetsModal.classList.add('visible');
                 _setA11yDialogTrigger(document.activeElement);
                 setTimeout(function() { _a11yFocusFirstInDialog(presetsModal); _a11yHideBackground(presetsModal); }, 0);
             }

export function closePresetsModal() {
                 if (presetsModal) { presetsModal.classList.remove('visible'); _a11yRestoreFocus(); }
             }

export const annotationsModal = document.getElementById('annotationsModal');

export const annotationsModalBackdrop = document.getElementById('annotationsModalBackdrop');

export const annotationsModalClose = document.getElementById('annotationsModalClose');

export const annotateBtn = document.getElementById('annotateBtn');

export const annotationKindPinBtn = document.getElementById('annotationKindPin');

export const annotationKindRegionBtn = document.getElementById('annotationKindRegion');

export const annotationKindDrawBtn = document.getElementById('annotationKindDraw');

export const annotationKindArrowBtn = document.getElementById('annotationKindArrow');

export const annotationFinishBtn2 = document.getElementById('annotationFinishBtn');

export const annotationClearBtn2 = document.getElementById('annotationClearBtn');

export const annotationManageBtn2 = document.getElementById('annotationManageBtn');

export const annotationHelpBtn = document.getElementById('annotationHelpBtn');

export const annotationHelpClose = document.getElementById('annotationHelpClose');

export const annotationFontSmallBtn = document.getElementById('annotationFontSmallBtn');

export const annotationFontMediumBtn = document.getElementById('annotationFontMediumBtn');

export const annotationFontLargeBtn = document.getElementById('annotationFontLargeBtn');

export const annotationColorSwatches = Array.prototype.slice.call(document.querySelectorAll('#annotationToolbar .annotation-color-swatch'));

export const mobileAnnotateBtn = document.getElementById('mobileAnnotateBtn');

export function maybeShowProjectionExplainer(force) {
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
