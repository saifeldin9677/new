import { countryInfo, geopoliticalBlocsData } from './data.js';
import { a11yDialogWasOpen, a11yLastOutside, adminBoundariesToggle, applyTheme, capitalsToggle, closePanelBtn, controlsBar, coordsToggle, corridorsToggle, countryNamesList, dataTableBtn, dataTableClose, dataTableOverlay, dataTableSearch, dataTableSortAsc, dataTableSortKey, densitySpotsToggle, exportBtn, geopoliticalBlocsVisible, globeViewBtn, labelsToggle, lang, langDropdownMenu, langToggle, layersModal, layersModalBackdrop, layersModalClose, layersToggleBtn, majorCitiesToggle, mapContainer, measureKind, measurePoints, menuToggle, modeButtons, onWindowResize, positionLangDropdown, prefersReducedMotion, presentationModeActive, quizActive, resetBtn, sectToggle, selectedBloc, selectedCountry, setState, shareBtn, shortcutsBtn, shortcutsClose, shortcutsOverlay, svg, timezonesToggle, zoomBehavior, zoomInBtn, zoomOutBtn, zoomResetBtn } from './state.js';
import { getCleanName, getDisplayName, setLanguage, t } from './i18n.js';
import { drawGeopoliticalBlocs, getDensity, setMode, toggleAdminBoundaries, toggleBorderDisputes, toggleCapitals, toggleColorblindMode, toggleCoords, toggleCorridors, toggleDensitySpots, toggleDesertsForests, toggleEarthquakes, toggleEthnicGroups, toggleGeopoliticalBlocs, toggleGlobeMode, toggleLabels, toggleMajorCities, toggleNaturalResources, toggleOceanCurrents, toggleRivers, toggleSect, toggleTimezones, toggleVolcanoes, toggleWinds, updateLegend } from './layers.js';
import { cancelAnnotationStroke, clearAllAnnotations, clearAnnotationDrawing, clearMeasurement, closeAnnotationHelpModal, closeAnnotationsModal, closeCountryPanel, finishAnnotationTool, flyToCountry, getCountryFlag, handleAnnotationClick, handleMeasureClick, init, onAnnotationPointerDown, onAnnotationPointerMove, onAnnotationPointerUp, openAnnotationHelpModal, openAnnotationsModal, redrawMeasureLayer, resetAll, resetZoom, setAnnotationColor, setAnnotationFontSize, setPanSpaceHeld, shareMap, stepAnnotationFontSize, toggleAnnotationKind, toggleAnnotationMode, toggleMeasureCalcMode, toggleMeasureKind, toggleMeasureMode, togglePresentationMode, updateHash } from './map-core.js';
import { exportMapPDF } from './export.js';
import { A11Y_DIALOG_SELECTOR, A11Y_FOCUSABLE, a11yIsVisible, a11yOpenDialog, a11ySkipLink, aboutBtn, aboutModal, aboutModalBackdrop, aboutModalClose, annotateBtn, annotationClearBtn2, annotationColorSwatches, annotationFinishBtn2, annotationFontLargeBtn, annotationFontMediumBtn, annotationFontSmallBtn, annotationHelpBtn, annotationHelpClose, annotationKindArrowBtn, annotationKindDrawBtn, annotationKindPinBtn, annotationKindRegionBtn, annotationManageBtn2, annotationsModal, annotationsModalBackdrop, annotationsModalClose, blocSelect, closeAboutModal, closeDataTable, closeLayersModal, closeMobileToolsMenu, closePresetsModal, maybeShowProjectionExplainer, measureClearBtn2, measureFinishBtn2, measureGeodesicBtn2, measureKindAreaBtn, measureKindDistBtn, measurePlanarBtn2, mobileAboutBtn, mobileAnnotateBtn, mobileCoordsBtn, mobileFilterBtns, mobileLangBtn, mobileLayersBtn, mobileModeBtn, mobileModeBtns, mobileOnboardBtn, mobilePdfBtn, mobilePresetsBtn, mobileResetBtn2, mobileSearchInput, mobileShareBtn, mobileShortcutsBtn, mobileToolsBtn, mobileToolsMenu, modeSheet, modeSheetBackdrop, modeSheetClose, onboardBtn, openAboutModal, openDataTable, openLayersModal, openPresetsModal, presetsBtn, presetsModal, presetsModalBackdrop, presetsModalClose, renderDataTable, riversToggle, setupReligionButtons } from './ui.js';

// Entry module: owns all top-level wiring / executable statements
// extracted from the original app.js monolith.


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

if (dataTableOverlay) {
                 dataTableOverlay.querySelectorAll('th[data-sort-key]').forEach(function(th) {
                     var btn = th.querySelector('.th-sort-btn');
                     var trigger = btn || th;
                     // Only add attributes if we DON'T have a real <button> (ARIA-safe fallback)
                     if (!btn) {
                         th.setAttribute('tabindex', '0');
                         th.setAttribute('role', 'button');
                     }
                     function sortBy() {
                         var key = th.getAttribute('data-sort-key');
                         if (key === dataTableSortKey) {
                             setState('dataTableSortAsc', !dataTableSortAsc);
                         } else {
                             setState('dataTableSortKey', key);
                             setState('dataTableSortAsc', true);
                         }
                         renderDataTable();
                     }
                     trigger.addEventListener('click', sortBy);
                     trigger.addEventListener('keydown', function(e) {
                         if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sortBy(); }
                     });
                 });
             }

if (onboardBtn) {
                onboardBtn.addEventListener('click', function() {
                    maybeShowProjectionExplainer(true);
                });
            }

modeButtons.forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));

labelsToggle.addEventListener('click', toggleLabels);

sectToggle.addEventListener('click', toggleSect);

corridorsToggle.addEventListener('click', toggleCorridors);

if (riversToggle) riversToggle.addEventListener('click', toggleRivers);

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

if (adminBoundariesToggle) adminBoundariesToggle.addEventListener('click', toggleAdminBoundaries);

if (globeViewBtn) globeViewBtn.addEventListener('click', function() {
                if (quizActive) return;
                toggleGlobeMode();
            });

geopoliticalBlocsData.forEach(function(b) {
                var opt = document.createElement('option');
                opt.value = b.name_en;
                opt.textContent = (lang === 'ar' ? b.name : lang === 'ru' ? (b.name_ru || b.name_en) : lang === 'uz' ?(b.name_uz || b.name_en): lang === 'es' ?(b.name_es || b.name_en) : b.name_en) + ' (' + (lang === 'ar' ? b.members_ar : lang === 'ru' ? (b.members_ru || b.members_en) : lang === 'uz' ?(b.members_uz || b.members_en): lang === 'es' ?(b.members_es || b.members_en) : b.members_en) + ')';
                blocSelect.appendChild(opt);
            });

blocSelect.addEventListener('change', function() {
                setState('selectedBloc', this.value);
                if (geopoliticalBlocsVisible) drawGeopoliticalBlocs();
                if (geopoliticalBlocsVisible && selectedBloc !== 'all') setMode('normal');
                updateLegend();
                updateHash();
            });

langToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                var ldm = document.getElementById('langDropdownMenu');
                if (ldm) {
                    if (!ldm.classList.contains('visible')) positionLangDropdown();
                    ldm.classList.toggle('visible');
                }
            });

onWindowResize(function() {
                if (langDropdownMenu && langDropdownMenu.classList.contains('visible')) positionLangDropdown();
            });

document.getElementById('themeToggleBtn').addEventListener('click', function() {
                 var current = document.documentElement.getAttribute('data-theme');
                 applyTheme(current === 'light' ? 'dark' : 'light');
                 updateHash();
             });

var cbBtn = document.getElementById('colorblindToggleBtn');
if (cbBtn) cbBtn.addEventListener('click', toggleColorblindMode);

document.getElementById('measureToolBtn').addEventListener('click', toggleMeasureMode);

if (measureKindDistBtn) measureKindDistBtn.addEventListener('click', function() { toggleMeasureKind('distance'); });

if (measureKindAreaBtn) measureKindAreaBtn.addEventListener('click', function() { toggleMeasureKind('area'); });

if (measureGeodesicBtn2) measureGeodesicBtn2.addEventListener('click', toggleMeasureCalcMode);

if (measurePlanarBtn2) measurePlanarBtn2.addEventListener('click', toggleMeasureCalcMode);

if (measureFinishBtn2) measureFinishBtn2.addEventListener('click', function() {
                if (measureKind === 'area' && measurePoints.length >= 3) {
                    setState('measureFinalized', true);
                    redrawMeasureLayer();
                }
            });

if (measureClearBtn2) measureClearBtn2.addEventListener('click', clearMeasurement);

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

setupReligionButtons();

zoomInBtn.addEventListener('click', () => { svg.transition().duration(prefersReducedMotion() ? 0 : 300).ease(d3.easeCubicOut).call(zoomBehavior.scaleBy,
                1.35); });

zoomOutBtn.addEventListener('click', () => { svg.transition().duration(prefersReducedMotion() ? 0 : 300).ease(d3.easeCubicOut).call(zoomBehavior.scaleBy,
                0.74); });

zoomResetBtn.addEventListener('click', resetZoom);

shareBtn.addEventListener('click', shareMap);

resetBtn.addEventListener('click', resetAll);

document.getElementById('pdfExportBtn').addEventListener('click', exportMapPDF);

if (aboutBtn) aboutBtn.addEventListener('click', openAboutModal);

if (presetsBtn) presetsBtn.addEventListener('click', openPresetsModal);

if (mobileLangBtn) mobileLangBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                document.querySelectorAll('.lang-dropdown-menu.visible').forEach(function(m) { m.classList.remove('visible'); });
                var mm = document.getElementById('mobileLangDropdownMenu');
                if (mm) mm.classList.toggle('visible');
            });

if (mobileSearchInput) (function() {
                let activeIdx = -1;
                const ms = document.getElementById('mobileSuggestionsList');
                function closeMobileSuggestions() {
                    if (ms) ms.style.display = 'none';
                    mobileSearchInput.setAttribute('aria-expanded', 'false');
                    mobileSearchInput.removeAttribute('aria-activedescendant');
                    activeIdx = -1;
                }
                function setActive(idx) {
                    const opts = ms.querySelectorAll('[role="option"]');
                    activeIdx = idx;
                    opts.forEach(function(o, i) { o.classList.toggle('active', i === idx); o.setAttribute('aria-selected', i === idx ? 'true' : 'false'); });
                    if (idx >= 0 && opts[idx]) { mobileSearchInput.setAttribute('aria-activedescendant', opts[idx].id); }
                    else { mobileSearchInput.removeAttribute('aria-activedescendant'); }
                }
                mobileSearchInput.addEventListener('input', function() {
                    var val = this.value.trim().toLowerCase();
                    if (!ms) return;
                    ms.innerHTML = '';
                    activeIdx = -1;
                    if (!val) { closeMobileSuggestions(); return; }
                    var matches = countryNamesList.filter(function(n) {
                        return n.toLowerCase().includes(val) || getDisplayName(n).toLowerCase().includes(val);
                    }).slice(0, 6);
                    if (matches.length) {
                        matches.forEach(function(m, idx) {
                            var li = document.createElement('li');
                            li.id = 'msOpt-' + idx;
                            li.setAttribute('role', 'option');
                            li.setAttribute('aria-selected', 'false');
                            li.setAttribute('data-name', m);
                            var flag = getCountryFlag(m);
                            var span2 = document.createElement('span');
                            span2.className = 'flag-icon';
                            span2.setAttribute('aria-hidden', 'true');
                            span2.textContent = flag;
                            li.appendChild(span2);
                            li.appendChild(document.createTextNode(' ' + getDisplayName(m)));
                            var doSel = function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                mobileSearchInput.value = '';
                                closeMobileSuggestions();
                                mobileSearchInput.blur();
                                flyToCountry(m);
                            };
                            li.addEventListener('touchend', doSel, { passive: false });
                            li.addEventListener('mousedown', doSel);
                            li.addEventListener('mousemove', function() { if (activeIdx !== idx) setActive(idx); });
                            ms.appendChild(li);
                        });
                        ms.style.display = 'block';
                        mobileSearchInput.setAttribute('aria-expanded', 'true');
                    } else {
                        closeMobileSuggestions();
                    }
                });
                mobileSearchInput.addEventListener('keydown', function(e) {
                    const opts = ms.querySelectorAll('[role="option"]');
                    if (!opts.length) {
                        if (e.key === 'Escape') closeMobileSuggestions();
                        return;
                    }
                    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(activeIdx + 1 >= opts.length ? 0 : activeIdx + 1); }
                    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(activeIdx <= 0 ? opts.length - 1 : activeIdx - 1); }
                    else if (e.key === 'Enter' && activeIdx >= 0) {
                        e.preventDefault();
                        var sel = opts[activeIdx];
                        var name = sel.getAttribute('data-name') || sel.textContent.trim();
                        closeMobileSuggestions();
                        mobileSearchInput.value = '';
                        mobileSearchInput.blur();
                        flyToCountry(name);
                    } else if (e.key === 'Escape') closeMobileSuggestions();
                });
                mobileSearchInput.addEventListener('blur', function() {
                    setTimeout(function() { if (ms) closeMobileSuggestions(); }, 200);
                });
            })();

if (mobileShareBtn) mobileShareBtn.addEventListener('click', shareMap);

if (mobileModeBtn) mobileModeBtn.addEventListener('click', function() { modeSheet.classList.add('visible'); });

if (mobileLayersBtn) mobileLayersBtn.addEventListener('click', function() { openLayersModal(); });

if (mobileResetBtn2) mobileResetBtn2.addEventListener('click', function() { closeMobileToolsMenu(); resetAll(); });

if (mobileCoordsBtn) mobileCoordsBtn.addEventListener('click', function() { closeMobileToolsMenu(); toggleCoords(); });

if (mobileToolsBtn) mobileToolsBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                closeMobileToolsMenu();
                if (mobileToolsMenu) mobileToolsMenu.classList.toggle('open');
            });

if (mobileOnboardBtn) mobileOnboardBtn.addEventListener('click', function() { closeMobileToolsMenu(); maybeShowProjectionExplainer(true); });

if (mobileAboutBtn) mobileAboutBtn.addEventListener('click', function() { closeMobileToolsMenu(); openAboutModal(); });

if (mobilePresetsBtn) mobilePresetsBtn.addEventListener('click', function() { closeMobileToolsMenu(); openPresetsModal(); });

if (mobileShortcutsBtn) mobileShortcutsBtn.addEventListener('click', function() { closeMobileToolsMenu(); shortcutsOverlay.classList.add('visible'); });

if (mobilePdfBtn) mobilePdfBtn.addEventListener('click', function() { closeMobileToolsMenu(); exportMapPDF(); });

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

if (layersToggleBtn) layersToggleBtn.addEventListener('click', openLayersModal);

if (layersModalClose) layersModalClose.addEventListener('click', closeLayersModal);

if (layersModalBackdrop) layersModalBackdrop.addEventListener('click', closeLayersModal);

document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && layersModal && layersModal.classList.contains('visible')) {
                    closeLayersModal();
                }
                if (e.key === 'Escape' && aboutModal && aboutModal.classList.contains('visible')) {
                    closeAboutModal();
                }
                if (e.key === 'Escape' && presetsModal && presetsModal.classList.contains('visible')) {
                    closePresetsModal();
                }
                if (e.key === 'Escape' && annotationsModal && annotationsModal.classList.contains('visible')) {
                    closeAnnotationsModal();
                }
                if (e.key === 'Escape' && presentationModeActive) {
                    togglePresentationMode();
                }
                if (e.key === 'Escape') {
                    document.querySelectorAll('.lang-dropdown-menu.visible').forEach(function(m) { m.classList.remove('visible'); });
                }
            });

if (a11ySkipLink) {
                a11ySkipLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    var mapEl = document.getElementById('mapContainer');
                    if (mapEl) { mapEl.focus(); }
                });
            }

document.addEventListener('keydown', function(e) {
                if (e.key !== 'Tab') return;
                var dlg = a11yOpenDialog();
                if (!dlg) return;
                var focusables = Array.prototype.filter.call(dlg.querySelectorAll(A11Y_FOCUSABLE), a11yIsVisible);
                if (!focusables.length) return;
                var first = focusables[0];
                var last = focusables[focusables.length - 1];
                var active = document.activeElement;
                if (e.shiftKey) {
                    if (active === first || !dlg.contains(active)) { e.preventDefault(); last.focus(); }
                } else {
                    if (active === last || !dlg.contains(active)) { e.preventDefault(); first.focus(); }
                }
            });

document.addEventListener('focusin', function(e) {
                if (e.target && e.target.closest && !e.target.closest(A11Y_DIALOG_SELECTOR)) {
                    setState('a11yLastOutside', e.target);
                }
            });

new MutationObserver(function() {
                if (!a11yDialogWasOpen) return;
                if (!a11yOpenDialog()) {
                    setState('a11yDialogWasOpen', false);
                    if (a11yLastOutside && a11yLastOutside.isConnected && a11yLastOutside !== document.activeElement) {
                        a11yLastOutside.focus();
                    }
                }
            }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });

document.addEventListener('focusin', function() {
                if (a11yOpenDialog()) setState('a11yDialogWasOpen', true);
            });

if (aboutModalClose) aboutModalClose.addEventListener('click', closeAboutModal);

if (aboutModalBackdrop) aboutModalBackdrop.addEventListener('click', closeAboutModal);

if (presetsModalClose) presetsModalClose.addEventListener('click', closePresetsModal);

if (presetsModalBackdrop) presetsModalBackdrop.addEventListener('click', closePresetsModal);

if (annotationsModalClose) annotationsModalClose.addEventListener('click', closeAnnotationsModal);

if (annotationsModalBackdrop) annotationsModalBackdrop.addEventListener('click', closeAnnotationsModal);

if (annotateBtn) annotateBtn.addEventListener('click', toggleAnnotationMode);

if (annotationKindPinBtn) annotationKindPinBtn.addEventListener('click', function() { toggleAnnotationKind('pin'); });

if (annotationKindRegionBtn) annotationKindRegionBtn.addEventListener('click', function() { toggleAnnotationKind('region'); });

if (annotationKindDrawBtn) annotationKindDrawBtn.addEventListener('click', function() { toggleAnnotationKind('freehand'); });

if (annotationKindArrowBtn) annotationKindArrowBtn.addEventListener('click', function() { toggleAnnotationKind('arrow'); });

if (annotationFinishBtn2) annotationFinishBtn2.addEventListener('click', finishAnnotationTool);

if (annotationClearBtn2) annotationClearBtn2.addEventListener('click', clearAllAnnotations);

if (annotationManageBtn2) annotationManageBtn2.addEventListener('click', openAnnotationsModal);

annotationColorSwatches.forEach(function(sw) { sw.addEventListener('click', function() { setAnnotationColor(sw.getAttribute('data-color')); }); });

if (annotationFontSmallBtn) annotationFontSmallBtn.addEventListener('click', function() { stepAnnotationFontSize(-1); });

if (annotationFontMediumBtn) annotationFontMediumBtn.addEventListener('click', function() { setAnnotationFontSize(10); });

if (annotationFontLargeBtn) annotationFontLargeBtn.addEventListener('click', function() { stepAnnotationFontSize(1); });

if (annotationHelpBtn) annotationHelpBtn.addEventListener('click', openAnnotationHelpModal);

if (annotationHelpClose) annotationHelpClose.addEventListener('click', closeAnnotationHelpModal);

mapContainer.addEventListener('click', handleAnnotationClick, true);

// Freehand/arrow stroke drawing: pointer capture on the map canvas
mapContainer.addEventListener('pointerdown', onAnnotationPointerDown, true);
mapContainer.addEventListener('pointermove', onAnnotationPointerMove, true);
mapContainer.addEventListener('pointerup', onAnnotationPointerUp, true);
mapContainer.addEventListener('pointercancel', onAnnotationPointerUp, true);

document.addEventListener('keydown', function(e) {
    if (e.key === ' ') setPanSpaceHeld(true);
});
document.addEventListener('keyup', function(e) {
    if (e.key === ' ') setPanSpaceHeld(false);
});

if (mobileAnnotateBtn) mobileAnnotateBtn.addEventListener('click', function() { closeMobileToolsMenu(); toggleAnnotationMode(); });

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

(function() {
                var overlay = document.getElementById('langOverlay');
                if (!overlay) { init(); maybeShowProjectionExplainer(); return; }
                var overlayTitle = overlay.querySelector('.lang-overlay-title');
                if (overlayTitle) overlayTitle.textContent = t('appName');
                var overlaySubtitle = overlay.querySelector('.lang-overlay-subtitle');
                if (overlaySubtitle) overlaySubtitle.textContent = t('langOverlaySubtitle');
                var savedLang = null;
                try { savedLang = localStorage.getItem('mapLang'); } catch(e) {}
                if (savedLang && ['ar','en','ru','uz','es'].includes(savedLang)) {
                    overlay.remove();
                    init();
                    maybeShowProjectionExplainer();
                    return;
                }
                // Language overlay is showing → fresh start → clear onboard flag
                try { localStorage.removeItem('onboardDone'); } catch(e) {}
                overlay.querySelectorAll('.lang-overlay-btn').forEach(function(btn) {
                    btn.addEventListener('click', function() {
                        var code = this.dataset.lang;
                        setState('lang', code);
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
                        maybeShowProjectionExplainer();
                    });
                });
            })();
