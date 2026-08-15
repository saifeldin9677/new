import { borderDisputesData, continentArabic, continentByCountry, continentRussian, continentSpanish, continentUzbek, corridorsData, countryInfo, desertsForestsData, earthquakesData, ethnicGroupsData, geopoliticalBlocsData, majorCitiesData, naturalResourcesData, rivers, volcanoesData } from './data.js';
import { allCountryFeatures, colorMode, currentReligionFilter, currentSessionCode, currentStudentName, currentTransform, gAuthoringMarkers, gQuizMarkers, getMapRect, globeModeActive, globeViewBtn, lang, mapContainer, measureActive, projection, quizActive, quizStartTime, religionButtons, setActiveByAttr, setState } from './state.js';
import { fmtNum, getCleanName, getDisplayName, pluralize, t } from './i18n.js';
import { LAYER_DEFS, getActiveProjection, getCustomQuestionTargetCoords, getQuestionTargetCoords, rotateGlobeToReveal, setMode, toggleLayerByName } from './layers.js';
import { escapeHtml, exportResultsCsv, handleCreateSession, handleJoinSession, invertMapPoint, saveQuizResultsToFirestore, showClassResults, triggerDownload, updateViewResultsBtn } from './map-core.js';
import { showToast } from './ui.js';

// Module: quiz
// Extracted from app.js by scripts/split-modules.js


            // ── Quiz Mode ──

export var measureResultLabel = document.getElementById('measureResultLabel');

export var QUIZ_LAYERS = [
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

export function getItemCoords(item, layerId) {
                    if (layerId === 'countries') {
                        return item.properties?.centroid || null;
                    }
                    if (layerId === 'capitals') {
                        return item.capital_coords || null;
                    }
                    return item.coords || null;
                }

export function initQuiz() {
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
                var quizKeyHandler = null;

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
                var quizProvenanceInput = document.getElementById('quizProvenanceInput');
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
                
                var quizEndOverlay = document.getElementById('quizEndOverlay');
                var quizFinalScore = document.getElementById('quizFinalScore');
                var quizMissedList = document.getElementById('quizMissedList');
                var quizExitBtn = document.getElementById('quizExitBtn');
                var quizEndEarlyBtn = document.getElementById('quizEndEarlyBtn');
                var quizTypedAnswerInput = document.getElementById('quizTypedAnswerInput');
                var quizTypedSubmitBtn = document.getElementById('quizTypedSubmitBtn');

                // ── Timer accessibility controls (WCAG 2.2.1) ───────────────
                // Pause + extend so users who need more time can adjust the
                // countdown. Paused state persists across both built-in and
                // custom quizzes while the HUD is up.
                var quizTimerControls = document.getElementById('quizTimerControls');
                var quizTimerPauseBtn = document.getElementById('quizTimerPauseBtn');
                var quizTimerExtendBtn = document.getElementById('quizTimerExtendBtn');
                var quizTimerPaused = false;

                function refreshTimerControlsVisibility() {
                    var anyTimerOn = quizTimerEnabled || customQuizTimerEnabled;
                    if (quizTimerControls) quizTimerControls.style.display = anyTimerOn ? '' : 'none';
                }
                function refreshPauseBtnLabel() {
                    if (!quizTimerPauseBtn) return;
                    quizTimerPauseBtn.textContent = quizTimerPaused ? '▶' : '⏸';
                    quizTimerPauseBtn.setAttribute('aria-pressed', String(quizTimerPaused));
                    quizTimerPauseBtn.setAttribute('aria-label', quizTimerPaused ? t('quizTimerPaused') : t('quizTimerPause'));
                }

                function pauseOrResumeQuizTimer() {
                    quizTimerPaused = !quizTimerPaused;
                    if (quizTimerPaused) {
                        stopTimer(); stopCustomTimer();
                    } else {
                        // Resume whichever timer is enabled
                        if (quizTimerEnabled && !quizTimerInterval) {
                            quizTimerInterval = setInterval(function() { quizTimeLeft--; updateTimerDisplay(); if (quizTimeLeft <= 0) finishQuizOrReview('timeUp'); }, 1000);
                        }
                        if (customQuizTimerEnabled && !customQuizTimerInterval) {
                            customQuizTimerInterval = setInterval(function() { customQuizTimeLeft--; updateCustomTimerDisplay(); if (customQuizTimeLeft <= 0) endCustomQuiz('timeUp'); }, 1000);
                        }
                    }
                    refreshPauseBtnLabel();
                }
                function extendQuizTimer() {
                    if (quizTimerEnabled) { quizTimeLeft += 60; updateTimerDisplay(); }
                    if (customQuizTimerEnabled) { customQuizTimeLeft += 60; updateCustomTimerDisplay(); }
                }
                if (quizTimerPauseBtn) quizTimerPauseBtn.addEventListener('click', pauseOrResumeQuizTimer);
                if (quizTimerExtendBtn) quizTimerExtendBtn.addEventListener('click', extendQuizTimer);

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

                var quizSavedMapState = null;

                // ── Map state capture/restore for quiz ──
                function resetMapToNormalForQuiz() {
                    // Save current state from registry
                    quizSavedMapState = { colorMode: colorMode, currentReligionFilter: currentReligionFilter };
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
                        setState('currentReligionFilter', 'all');
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
                        setState('currentReligionFilter', s.currentReligionFilter);
                        setActiveByAttr(religionButtons, '.religion-btn[data-religion="' + s.currentReligionFilter + '"]');
                    }
                    if (s.colorMode !== colorMode) setMode(s.colorMode);
                }

                function enterQuizMode() {
                    resetMapToNormalForQuiz();
                    setState('quizActive', true);
                    if (globeViewBtn) { globeViewBtn.disabled = true; globeViewBtn.classList.add('quiz-disabled'); }
                    quizCurrentIndex = 0;
                    quizScore = 0;
                    quizResults = [];
                    setState('quizStartTime', Date.now());
                    quizQuestions = generateQuestions();
                    if (quizQuestions.length === 0) { exitQuizMode(); return; }

                    document.body.classList.add('quiz-active');
                    mapContainer.classList.add('quiz-active');
                    quizSetupOverlay.style.display = 'none';
                    quizEndOverlay.style.display = 'none';

                    quizHudOverlay.style.display = '';
                    updateQuizHud();

                    quizTimerEnabled = quizTimeModeSet.checked;
                    quizTimerPaused = false;
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
                    refreshTimerControlsVisibility();
                    refreshPauseBtnLabel();

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

                    // Keyboard users: Enter/Space on a focused country path answers
                    // the quiz the same as clicking that country on the map.
                    quizKeyHandler = function(e) {
                        if (!quizActive) return;
                        if (measureActive) return;
                        if (e.key !== 'Enter' && e.key !== ' ') return;
                        var path = e.target && e.target.closest ? e.target.closest('path[role="button"]') : null;
                        if (!path) return;
                        e.preventDefault();
                        e.stopPropagation();
                        var d = (typeof d3 !== 'undefined' ? d3.select(path).datum() : null);
                        if (!d || !d.properties) return;
                        var centroid = d3.geoCentroid(d);
                        if (!centroid || isNaN(centroid[0])) return;
                        var proj = (typeof getActiveProjection === 'function' ? getActiveProjection() : projection);
                        var pt = proj(centroid);
                        if (!pt) return;
                        var rect = getMapRect();
                        var screenPt = currentTransform.apply(pt);
                        handleQuizClick({
                            clientX: rect.left + screenPt[0],
                            clientY: rect.top + screenPt[1],
                            target: path
                        });
                    };
                    mapContainer.addEventListener('keydown', quizKeyHandler, true);
                }

                function exitQuizMode() {
                    setState('quizActive', false);
                    clearQuizMarkers();
                    if (globeViewBtn) { globeViewBtn.disabled = false; globeViewBtn.classList.remove('quiz-disabled'); }
                    if (quizBtn) { quizBtn.disabled = false; quizBtn.classList.remove('quiz-disabled'); quizBtn.removeAttribute('title'); }
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
                    if (quizKeyHandler) {
                        mapContainer.removeEventListener('keydown', quizKeyHandler, true);
                        quizKeyHandler = null;
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
                    var coords = invertMapPoint(svgPoint);
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
                    setState('quizActive', false);
                    if (globeViewBtn) { globeViewBtn.disabled = false; globeViewBtn.classList.remove('quiz-disabled'); }
                    if (quizBtn) { quizBtn.disabled = false; quizBtn.classList.remove('quiz-disabled'); quizBtn.removeAttribute('title'); }
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

                function downloadQuizBankJson() {
                    var lib = loadCustomQuestionsLibrary();
                    if (lib.length === 0) {
                        showToast(t('quizNoCustomQuestions'));
                        return;
                    }
                    var payload = {
                        app: 'lepidos-atlas',
                        kind: 'quiz-bank',
                        version: 1,
                        exportedAt: new Date().toISOString(),
                        questions: lib
                    };
                    triggerDownload('lepidos-quiz-bank-' + new Date().toISOString().slice(0, 10) + '.json', new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
                }
                function importQuizBankFromText(text) {
                    var parsed;
                    try {
                        parsed = JSON.parse(text);
                    } catch (e) {
                        showToast(t('quizImportError'));
                        return;
                    }
                    var arr = Array.isArray(parsed) ? parsed : (parsed && Array.isArray(parsed.questions) ? parsed.questions : null);
                    if (!arr) {
                        showToast(t('quizImportError'));
                        return;
                    }
                    var lib = loadCustomQuestionsLibrary();
                    var ids = {};
                    lib.forEach(function(q) { if (q && q.id) ids[q.id] = 1; });
                    var added = 0;
                    arr.forEach(function(q) {
                        if (q && q.id && typeof q.promptText === 'string' && q.promptText.trim() && !ids[q.id]) {
                            ids[q.id] = 1;
                            lib.push(q);
                            added++;
                        }
                    });
                    if (added > 0) {
                        saveCustomQuestionsLibrary(lib);
                        customQuestionsLibrary = loadCustomQuestionsLibrary();
                    }
                    initCustomQuizSetup(false);
                    showToast(added > 0 ? pluralize(added, t('quizImportOne'), t('quizImportFew'), t('quizImportMany')).replace('{count}', fmtNum(added)) : t('quizImportNothingNew'));
                }

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
                    if (quizBtn) { quizBtn.disabled = false; quizBtn.classList.remove('quiz-disabled'); quizBtn.removeAttribute('title'); }
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

                document.getElementById('quizExportBtn').addEventListener('click', function() {
                    downloadQuizBankJson();
                });
                document.getElementById('quizImportBtn').addEventListener('click', function() {
                    document.getElementById('quizImportInput').click();
                });
                document.getElementById('quizImportInput').addEventListener('change', function() {
                    var file = this.files && this.files[0];
                    this.value = '';
                    if (!file) return;
                    var reader = new FileReader();
                    reader.onload = function() {
                        importQuizBankFromText(reader.result);
                    };
                    reader.readAsText(file);
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
                    if (quizProvenanceInput) quizProvenanceInput.value = '';
                    quizAuthoringStatusRow.style.display = 'none';
                    quizAuthoringFormFields.style.display = 'none';
                    document.getElementById('quizAuthoringProvenanceRow').style.display = 'none';
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
                            var coords = invertMapPoint(svgPoint, projection);
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
                            var coords = invertMapPoint(svgPoint, projection);
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
                    document.getElementById('quizAuthoringProvenanceRow').style.display = '';
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
                    if (quizProvenanceInput && quizProvenanceInput.value.trim()) {
                        q.source = quizProvenanceInput.value.trim();
                    }
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
                    setState('quizStartTime', Date.now());

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

                    setState('quizActive', true);
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
                    quizTimerPaused = false;
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
                    refreshTimerControlsVisibility();
                    refreshPauseBtnLabel();
                }

                function exitCustomQuiz() {
                    setState('quizActive', false);
                    clearQuizMarkers();
                    if (globeViewBtn) { globeViewBtn.disabled = false; globeViewBtn.classList.remove('quiz-disabled'); }
                    if (quizBtn) { quizBtn.disabled = false; quizBtn.classList.remove('quiz-disabled'); quizBtn.removeAttribute('title'); }
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
                    setState('quizActive', false);
                    if (globeViewBtn) { globeViewBtn.disabled = false; globeViewBtn.classList.remove('quiz-disabled'); }
                    if (quizBtn) { quizBtn.disabled = false; quizBtn.classList.remove('quiz-disabled'); quizBtn.removeAttribute('title'); }
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
                    var provText = '';
                    if (item.libraryIdx !== undefined && customQuestionsLibrary[item.libraryIdx] && customQuestionsLibrary[item.libraryIdx].source) {
                        provText = t('quizProvenanceReview', { source: customQuestionsLibrary[item.libraryIdx].source });
                    }
                    var provEl = document.getElementById('quizReviewProvenance');
                    if (provEl) {
                        provEl.textContent = provText;
                        provEl.style.display = provText ? '' : 'none';
                    }
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

                document.getElementById('quizResultsExportCsvBtn').addEventListener('click', function() {
                    exportResultsCsv();
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
            }

export function renderTextBlockToImage(lines, widthPx, heightPx) {
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
