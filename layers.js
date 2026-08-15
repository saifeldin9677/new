import { CB_COLORS, CB_PATTERNS, MAP_COLORS, additionalWaterwaysData, arabicNames, borderDisputesData, continentByCountry, corridorsData, countryInfo, denominationArabic, denominationColors, denominationRussian, denominationSpanish, denominationUzbek, densityByCountry, densitySpotEnglish, densitySpotRussian, densitySpotSpanish, densitySpotUzbek, densitySpots, desertsForestsData, earthquakesData, elevationByCountry, ethnicGroupsData, featureRussian, featureSpanish, featureUzbek, gdpByCountry, geopoliticalBlocsData, governmentByCountry, hdiByCountry, i18n, labelPositions, majorCitiesData, mountainRanges, naturalResourcesData, oceanCurrentsData, precipitationByCountry, religionArabic, religionColors, religionRussian, religionSpanish, religionUzbek, rivers, tectonicPlatesData, tempByCountry, volcanoesData, windsData } from './data.js';
import { _adminBakeDirty, _adminBoundariesRedrawTimeout, _frozenCitySize, _isZooming, _tooltipRAFPending, additionalWaterwaysVisible, adminBoundariesCanvas, adminBoundariesCentroids, adminBoundariesCtx, adminBoundariesData, adminBoundariesLoading, adminBoundariesMerged, adminBoundariesVisible, adminNameTranslations, adminNameTranslationsLoading, allCountryFeatures, annotateActive, announce, borderDisputesVisible, capitalsVisible, colorMode, colorblindMode, compareCountry, coordsToggle, coordsVisible, copyNotification, corridorsToggle, corridorsVisible, countryLabelSelection, countryPanel, countryPaths, currentReligionFilter, currentTransform, densityCanvas, densityCtx, densitySpotsMode, densitySpotsToggle, desertsForestsVisible, earthquakesVisible, ethnicGroupsVisible, gAdminBoundaries, gBorderDisputes, gCapitals, gCorridors, gCountries, gCountryLabels, gDesertsForests, gEarthquakes, gEthnicGroups, gGeopoliticalBlocs, gGraticule, gMajorCities, gMap, gMeasure, gNaturalResources, gOcean, gOceanCurrents, gPhysical, gTimezones, gVolcanoes, gWinds, geopoliticalBlocsVisible, getMapRect, globeDrag, globeModeActive, globeProjection, globeRedrawPending, globeRotation, globeViewBtn, isMobile, labelsToggle, lang, legendEl, majorCitiesVisible, measurePoints, modeButtons, naturalResourcesVisible, oceanCurrentsVisible, panelContent, pathGen, prefersReducedMotion, projection, quizActive, riversVisible, sectMode, sectToggle, selectedBloc, selectedCountry, selectedFeature, selectedFeatureType, setActiveByAttr, setState, showLabels, svg, timezonesVisible, tooltip, volcanoesVisible, windsVisible, zoomBehavior } from './state.js';
import { fmtNum, getAdminDisplayName, getCleanName, getDenomination, getDisplayName, getReligion, t } from './i18n.js';
import { _flushTooltipPosition, applyMapTransform, clearAnnotationsView, clearMeasurement, drawGraticule, getContainerDimensions, handleCountryActivate, redrawAnnotations, redrawMeasureLayer, renderCountryPanel, resetLayersAndModes, setupProjection, syncCountryGlow, toggleAnnotationMode, updateCoordinatesDisplay, updateHash, updateHashDebounced } from './map-core.js';
import { QUIZ_LAYERS, getItemCoords } from './quiz.js';

// Module: layers
// Extracted from app.js by scripts/split-modules.js


            // ── Layer definitions registry ──

export const LAYER_DEFS = {
                labels:              { getFlag: function(){ return showLabels; },              setFlag: function(v){ setState('showLabels', v); },              btnId: 'labelsToggle',              drawFn: null, hashKey: 'labels', skip: true },
                sect:                { getFlag: function(){ return sectMode; },                setFlag: function(v){ setState('sectMode', v); },                btnId: 'sectToggle',                drawFn: null, hashKey: 'sect', skip: true },
                corridors:           { getFlag: function(){ return corridorsVisible; },        setFlag: function(v){ setState('corridorsVisible', v); },        btnId: 'corridorsToggle',           drawFn: null, hashKey: 'corridors', skip: true },
                rivers:              { getFlag: function(){ return riversVisible; },           setFlag: function(v){ setState('riversVisible', v); },           btnId: 'riversToggle',              drawFn: drawPhysicalFeatures, hashKey: 'rivers' },
                densitySpots:        { getFlag: function(){ return densitySpotsMode; },        setFlag: function(v){ setState('densitySpotsMode', v); },        btnId: 'densitySpotsToggle',        drawFn: null, hashKey: 'spots', skip: true },
                capitals:            { getFlag: function(){ return capitalsVisible; },         setFlag: function(v){ setState('capitalsVisible', v); },         btnId: 'capitalsToggle',            drawFn: drawCapitals, postDrawFn: drawPointLayersCanvas, hashKey: 'capitals' },
                timezones:           { getFlag: function(){ return timezonesVisible; },        setFlag: function(v){ setState('timezonesVisible', v); },        btnId: 'timezonesToggle',           drawFn: drawTimezones, hashKey: 'timezones' },
                majorCities:         { getFlag: function(){ return majorCitiesVisible; },      setFlag: function(v){ setState('majorCitiesVisible', v); },      btnId: 'majorCitiesToggle',         drawFn: drawMajorCities, postDrawFn: drawPointLayersCanvas, hashKey: 'majorcities' },
                naturalResources:    { getFlag: function(){ return naturalResourcesVisible; }, setFlag: function(v){ setState('naturalResourcesVisible', v); }, btnId: 'naturalResourcesToggle',    drawFn: drawNaturalResources, hashKey: 'natres', setNorm: true },
                ethnicGroups:        { getFlag: function(){ return ethnicGroupsVisible; },     setFlag: function(v){ setState('ethnicGroupsVisible', v); },     btnId: 'ethnicGroupsToggle',        drawFn: drawEthnicGroups, hashKey: 'ethnic', setNorm: true },
                oceanCurrents:       { getFlag: function(){ return oceanCurrentsVisible; },    setFlag: function(v){ setState('oceanCurrentsVisible', v); },    btnId: 'oceanCurrentsToggle',       drawFn: drawOceanCurrents, hashKey: 'currents', setNorm: true },
                winds:               { getFlag: function(){ return windsVisible; },           setFlag: function(v){ setState('windsVisible', v); },            btnId: 'windsToggle',               drawFn: drawWinds, hashKey: 'winds', setNorm: true },
                earthquakes:         { getFlag: function(){ return earthquakesVisible; },      setFlag: function(v){ setState('earthquakesVisible', v); },      btnId: 'earthquakesToggle',         drawFn: drawEarthquakes, hashKey: 'quakes', setNorm: true },
                volcanoes:           { getFlag: function(){ return volcanoesVisible; },        setFlag: function(v){ setState('volcanoesVisible', v); },        btnId: 'volcanoesToggle',           drawFn: drawVolcanoes, hashKey: 'volcanoes' },
                geopoliticalBlocs:   { getFlag: function(){ return geopoliticalBlocsVisible; },setFlag: function(v){ setState('geopoliticalBlocsVisible', v); },btnId: 'geopoliticalBlocsToggle',   drawFn: drawGeopoliticalBlocs, hashKey: 'blocs', setNorm: true,
                    on: function(state) { if (!state) { setState('selectedBloc', 'all'); var bs = document.getElementById('blocSelect'); if (bs) bs.value = 'all'; } } },
                desertsForests:      { getFlag: function(){ return desertsForestsVisible; },   setFlag: function(v){ setState('desertsForestsVisible', v); },   btnId: 'desertsForestsToggle',      drawFn: drawDesertsForests, hashKey: 'deserts', setNorm: true },
                borderDisputes:      { getFlag: function(){ return borderDisputesVisible; },   setFlag: function(v){ setState('borderDisputesVisible', v); },   btnId: 'borderDisputesToggle',      drawFn: drawBorderDisputes, hashKey: 'borderdisputes', setNorm: true },
                adminBoundaries:    { getFlag: function(){ return adminBoundariesVisible; }, setFlag: function(v){ setState('adminBoundariesVisible', v); }, btnId: 'adminBoundariesToggle',    drawFn: drawAdminBoundaries, hashKey: 'adminbounds' },
                coords:              { getFlag: function(){ return coordsVisible; },          setFlag: function(v){ setState('coordsVisible', v); },           btnId: 'coordsToggle',              drawFn: null, hashKey: 'coords', skip: true,
                    on: function(state) { var cd = document.getElementById('coordinatesDisplay'); if (cd) cd.classList.toggle('hidden', !state); } }
            };

export const SKIP_LAYER_TOGGLE_FNS = {
                labels: toggleLabels,
                sect: toggleSect,
                corridors: toggleRoutes,
                densitySpots: toggleDensitySpots,
                coords: toggleCoords
            };

export function toggleLayerByName(name) {
                var def = LAYER_DEFS[name];
                if (!def) return;
                if (def.skip) {
                    var fn = SKIP_LAYER_TOGGLE_FNS[name];
                    if (fn) fn();
                    return;
                }
                toggleLayer(name);
            }

export function toggleLayer(name) {
                 var def = LAYER_DEFS[name];
                 if (!def || def.skip) return;
                 var state = !def.getFlag();
                 def.setFlag(state);
                 var btn = document.getElementById(def.btnId);
                 if (btn) {
                     btn.classList.toggle('toggle-on', state);
                     btn.setAttribute('aria-pressed', String(state));
                 }
                 if (state && def.setNorm) setMode('normal');
                 if (def.drawFn) def.drawFn();
                 if (def.postDrawFn) def.postDrawFn();
                 if (def.on) def.on(state, btn);
                 updateLegend();
                 updateHash();
                 updateActiveLayerCount();
             }

export var _layerLoadingChips = {};

export var _layerNoticeTimer = null;

export function showDataLayerLoading(name) {
                hideDataLayerLoading(name);
                var chip = document.createElement('div');
                chip.style.cssText = 'position:fixed;bottom:64px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:8px;background:rgba(15,20,30,0.92);color:#e8f1ff;padding:6px 16px;border-radius:999px;font-size:0.75em;z-index:200;pointer-events:none;border:1px solid rgba(128,200,255,0.35);box-shadow:0 4px 16px rgba(0,0,0,0.4);';
                var spinner = document.createElement('span');
                spinner.style.cssText = 'width:14px;height:14px;border:2px solid rgba(255,255,255,0.25);border-top-color:#80c8ff;border-radius:50%;animation:export-spin 0.8s linear infinite;flex:none;';
                var label = document.createElement('span');
                label.textContent = t('dataLayerLoading');
                chip.appendChild(spinner);
                chip.appendChild(label);
                document.body.appendChild(chip);
                _layerLoadingChips[name] = chip;
            }

export function hideDataLayerLoading(name) {
                var chip = _layerLoadingChips[name];
                if (chip) { chip.remove(); delete _layerLoadingChips[name]; }
            }

export function failLayerData(name, msgText) {
                hideDataLayerLoading(name);
                var def = LAYER_DEFS[name];
                 if (def) {
                     if (def.getFlag() === true) def.setFlag(false);
                     var btn = document.getElementById(def.btnId);
                     if (btn) { btn.classList.remove('toggle-on'); btn.setAttribute('aria-pressed', 'false'); }
                 }
                if (copyNotification) {
                    copyNotification.textContent = msgText;
                    copyNotification.classList.add('show');
                    clearTimeout(_layerNoticeTimer);
                    _layerNoticeTimer = setTimeout(function() { copyNotification.classList.remove('show'); }, 3000);
                }
                updateLegend();
                updateHash();
                updateActiveLayerCount();
            }

export function getElevation(name) {
                if (!name) return null;
                if (elevationByCountry[name] !== undefined) return elevationByCountry[name];
                const clean = getCleanName(name);
                if (elevationByCountry[clean] !== undefined) return elevationByCountry[clean];
                return null;
            }

export function getDensity(name) {
                if (!name) return null;
                if (densityByCountry[name] !== undefined) return densityByCountry[name];
                const clean = getCleanName(name);
                if (densityByCountry[clean] !== undefined) return densityByCountry[clean];
                for (let [k, v] of Object.entries(densityByCountry))
                    if (clean.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(clean.toLowerCase()))
                        return v;
                return null;
            }

export function getPrecipitation(name) {
                if (!name) return null;
                if (precipitationByCountry[name] !== undefined) return precipitationByCountry[name];
                const clean = getCleanName(name);
                if (precipitationByCountry[clean] !== undefined) return precipitationByCountry[clean];
                return null;
            }

export function getTemperature(name, d) {
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

// Constant screen-size label helper (Google-Maps style):
// Text inside the zoomable <g> scales with the map; dividing the font-size by k
// keeps the on-screen label the same size at every zoom level. base = intended
// px size on screen; result is clamped to stay within [minPx, maxPx].
function labelPx(k, base, minPx, maxPx) {
                if (isNaN(k) || k <= 0) return base;
                return Math.max(minPx, Math.min(maxPx, base / k));
            }

// Return the active sequential palette: CB_COLORS when colorblind mode is
// on, otherwise the default MAP_COLORS array. Shared by all mode color getters.
function _pal(key) {
                return (colorblindMode && CB_COLORS[key]) ? CB_COLORS[key] : MAP_COLORS[key];
            }

// ── Colorblind pattern defs ─────────────────────────────────────────
// Builds (once, then re-uses) an SVG <defs> containing one <pattern> per
// categorical country color. Each pattern is a base fill of the CB hue plus
// a distinct monochrome mark (hatch / dots / cross), so category identity does
// not depend on color perception. Rebuilt whenever colorblindMode toggles.
var _cbPatternsBuilt = false;
var _cbPatternsKey = '';
export function clearCBPatterns() {
                _cbPatternsBuilt = false;
                _cbPatternsKey = '';
                if (svg && svg.select) svg.selectAll('defs pattern[id^="cbpat-"]').remove();
            }

export function ensureCBPatternDefs() {
                if (typeof d3 === 'undefined' || !svg || !svg.select) return;
                var cats = sectMode ? CB_COLORS.denomination : CB_COLORS.religion;
                var keySig = 'cb:' + (sectMode ? 'sect' : 'rel') + ':' + colorblindMode;
                if (_cbPatternsBuilt && _cbPatternsKey === keySig &&
                    !svg.select('defs').empty() && !svg.select('#cbpat-' + Object.keys(cats)[0]).empty()) {
                    return; // already built for this set & this SVG
                }
                var defs = svg.select('defs');
                if (defs.empty()) defs = svg.append('defs');
                defs.selectAll('pattern[id^="cbpat-"]').remove();
                Object.keys(cats).forEach(function(key) {
                    var base = cats[key];
                    var spec = CB_PATTERNS[key] || { type: 'none' };
                    var p = defs.append('pattern')
                        .attr('id', 'cbpat-' + key)
                        .attr('width', 6).attr('height', 6)
                        .attr('patternUnits', 'userSpaceOnUse')
                        .attr('patternTransform', spec.angle ? 'rotate(' + spec.angle + ')' : null);
                    p.append('rect').attr('width', 6).attr('height', 6).attr('fill', base);
                    var ink = 'rgba(0,0,0,0.55)';
                    if (spec.type === 'hatchDiag' || spec.type === 'hatchH' || spec.type === 'hatchV') {
                        p.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 6)
                            .attr('stroke', ink).attr('stroke-width', 1.4);
                    } else if (spec.type === 'dots') {
                        var r = spec.density === 'dense' ? 0.9 : 0.55;
                        p.append('circle').attr('cx', 3).attr('cy', 3).attr('r', r).attr('fill', ink);
                        if (spec.density === 'dense') p.append('circle').attr('cx', 0).attr('cy', 0).attr('r', 0.5).attr('fill', ink);
                    } else if (spec.type === 'cross') {
                        p.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 6).attr('stroke', ink).attr('stroke-width', 1);
                        p.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 6).attr('y2', 0).attr('stroke', ink).attr('stroke-width', 1);
                    }
                });
                _cbPatternsBuilt = true;
                _cbPatternsKey = keySig;
            }

export function getTerrainColor(elev) {
                var C = _pal('terrain');
                if (elev == null || isNaN(elev)) return C[0];
                if (elev < 0) return C[1];
                if (elev < 50) return C[2];
                if (elev < 200) return C[3];
                if (elev < 400) return C[4];
                if (elev < 700) return C[5];
                if (elev < 1200) return C[6];
                if (elev < 2000) return C[7];
                if (elev < 3000) return C[8];
                if (elev < 4000) return C[9];
                return C[10];
            }

export function getDensityColor(dens) {
                var C = _pal('density');
                if (dens == null || isNaN(dens)) return C[0];
                if (dens < 1) return C[1];
                if (dens < 10) return C[2];
                if (dens < 50) return C[3];
                if (dens < 100) return C[4];
                if (dens < 200) return C[5];
                if (dens < 500) return C[6];
                if (dens < 1000) return C[7];
                return C[8];
            }

export function getPrecipitationColor(prec) {
                var C = _pal('precipitation');
                if (prec == null || isNaN(prec)) return C[0];
                if (prec < 100) return C[1];
                if (prec < 300) return C[2];
                if (prec < 600) return C[3];
                if (prec < 1000) return C[4];
                if (prec < 1500) return C[5];
                if (prec < 2000) return C[6];
                if (prec < 3000) return C[7];
                return C[8];
            }

export function getTempColor(temp) {
                var C = _pal('temperature');
                if (temp == null || isNaN(temp)) return C[0];
                if (temp < -10) return C[1];
                if (temp < 0) return C[2];
                if (temp < 10) return C[3];
                if (temp < 15) return C[4];
                if (temp < 20) return C[5];
                if (temp < 25) return C[6];
                if (temp < 30) return C[7];
                return C[8];
            }

export function getTimezoneColor(offset) {
                var tzColors = _pal('timezones');
                if (offset == null) return tzColors[4];
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

export function getGDPColor(gdp) {
                var C = _pal('gdp');
                if (gdp == null || isNaN(gdp)) return C[0];
                if (gdp < 1000) return C[1];
                if (gdp < 3000) return C[2];
                if (gdp < 7000) return C[3];
                if (gdp < 15000) return C[4];
                if (gdp < 30000) return C[5];
                if (gdp < 50000) return C[6];
                if (gdp < 80000) return C[7];
                return C[8];
            }

export function getHDIColor(hdi) {
                var C = _pal('hdi');
                if (hdi == null || isNaN(hdi)) return C[0];
                if (hdi < 0.55) return C[1];
                if (hdi < 0.70) return C[2];
                if (hdi < 0.80) return C[3];
                if (hdi < 0.90) return C[4];
                return C[5];
            }

export function getGDP(name) {
                if (!name) return null;
                if (gdpByCountry[name] !== undefined) return gdpByCountry[name];
                const clean = getCleanName(name);
                if (gdpByCountry[clean] !== undefined) return gdpByCountry[clean];
                return null;
            }

export function getHDI(name) {
                if (!name) return null;
                if (hdiByCountry[name] !== undefined) return hdiByCountry[name];
                const clean = getCleanName(name);
                if (hdiByCountry[clean] !== undefined) return hdiByCountry[clean];
                return null;
            }

export function getCountryInfo(name) {
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

export function hashStringToUnit(str) {
                let h = 0;
                for (let i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) | 0; }
                return (Math.abs(h) % 1000) / 1000;
            }

export function getNormalCountryColor(name) {
                if (colorblindMode) {
                    const base = d3.color(CB_COLORS.country.normal);
                    const t = hashStringToUnit(name || '');
                    const offset = (t - 0.5) * 0.16;
                    return offset >= 0 ? base.brighter(offset * 1.6).toString() : base.darker(-offset * 1.6).toString();
                }
                const base = d3.color(MAP_COLORS.country.normal);
                const t = hashStringToUnit(name || '');
                const offset = (t - 0.5) * 0.16;
                return offset >= 0 ? base.brighter(offset * 1.6).toString() : base.darker(-offset * 1.6).toString();
            }

export function getCountryFilterAttr() {
                return colorMode === 'normal' ? 'url(#countryShadow)' : null;
            }

export function getCountryFill(d) {
                const name = d.properties?.name || '';
                if (colorMode === 'normal' || colorMode === 'terrain' || colorMode === 'density' ||
                    colorMode === 'precipitation' || colorMode === 'temperature' || colorMode === 'gdp' || colorMode === 'hdi') {
                    if (colorMode === 'normal') return getNormalCountryColor(name);
                    if (colorMode === 'terrain') return getTerrainColor(getElevation(name));
                    if (colorMode === 'density') return getDensityColor(getDensity(name));
                    if (colorMode === 'precipitation') return getPrecipitationColor(getPrecipitation(name));
                    if (colorMode === 'temperature') return getTempColor(getTemperature(name, d));
                    if (colorMode === 'gdp') return getGDPColor(getGDP(name));
                    if (colorMode === 'hdi') return getHDIColor(getHDI(name));
                }

                // Categorical: religion or denomination (sect) mode
                let catKey, baseColor;
                if (sectMode) {
                    catKey = getDenomination(name);
                    baseColor = colorblindMode ? (CB_COLORS.denomination[catKey] || CB_COLORS.denomination.other)
                                               : (denominationColors[catKey] || MAP_COLORS.country.defaultFill);
                } else {
                    catKey = getReligion(name);
                    baseColor = colorblindMode ? (CB_COLORS.religion[catKey] || CB_COLORS.religion.unknown)
                                               : (religionColors[catKey] || MAP_COLORS.country.defaultFill);
                }

                // Religion filter highlights the matching category, dims others
                if (currentReligionFilter !== 'all') {
                    const rel = getReligion(name);
                    if (rel === currentReligionFilter) return d3.color(baseColor).brighter(0.6).toString();
                    return colorblindMode ? CB_COLORS.country.filterDim : MAP_COLORS.country.filterDim;
                }

                // Colorblind categorical mode: encode category as pattern fill so the
                // information does not rely on color alone (WCAG 1.4.1).
                if (colorblindMode) {
                    ensureCBPatternDefs();
                    return 'url(#cbpat-' + catKey + ')';
                }
                return baseColor;
            }

export function getStroke(d) {
                if (colorMode === 'normal') return MAP_COLORS.country.normalStroke;
                const name = d.properties?.name || '';
                if (currentReligionFilter !== 'all' && getReligion(name) === currentReligionFilter) return '#fff';
                return MAP_COLORS.country.dimStroke;
            }

export function getStrokeWidth(d) { return 0.8; }

export function getOpacity(d) {
                if (colorMode === 'normal') return 0.95;
                if (currentReligionFilter === 'all') return 0.9;
                return (getReligion(d.properties?.name || '') === currentReligionFilter) ? 1 : 0.35;
            }

export function getCorridorColor() {
                if (colorMode === 'terrain') return MAP_COLORS.corridor.terrain;
                if (colorMode === 'density') return MAP_COLORS.corridor.density;
                if (colorMode === 'precipitation') return MAP_COLORS.corridor.precipitation;
                if (colorMode === 'temperature') return MAP_COLORS.corridor.temperature;
                if (colorMode === 'normal') return MAP_COLORS.corridor.normal;
                return MAP_COLORS.corridor.other;
            }

export function showEthnicGroupDetail(d) {
                setState('selectedFeature', d);
                setState('selectedFeatureType', 'ethnicGroup');
                var displayName = lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en;
                var html = '<h3>👥 '+displayName+'</h3>';
                if (d.population_ar||d.population_en) html += '<p><strong>'+t('populationTitle')+':</strong> '+(lang==='ar'?d.population_ar:lang==='ru'?(d.population_ru||d.population_en):lang==='uz'?(d.population_uz||d.population_en):lang==='es'?(d.population_es||d.population_en):d.population_en)+'</p>';
                if (d.countries_ar||d.countries_en) html += '<p><strong>'+t('featureCountries')+':</strong> '+(lang==='ar'?d.countries_ar:lang==='ru'?(d.countries_ru||d.countries_en):lang==='uz'?(d.countries_uz||d.countries_en):lang==='es'?(d.countries_es||d.countries_en):d.countries_en)+'</p>';
                if (d.language_ar||d.language_en) html += '<p><strong>'+t('languageTitle')+':</strong> '+(lang==='ar'?d.language_ar:lang==='ru'?(d.language_ru||d.language_en):lang==='uz'?(d.language_uz||d.language_en):lang==='es'?(d.language_es||d.language_en):d.language_en)+'</p>';
                if (d.religion_ar||d.religion_en) html += '<p><strong>'+t('tooltipReligion')+':</strong> '+(lang==='ar'?d.religion_ar:lang==='ru'?(d.religion_ru||d.religion_en):lang==='uz'?(d.religion_uz||d.religion_en):lang==='es'?(d.religion_es||d.religion_en):d.religion_en)+'</p>';
                if (d.description_ar||d.description_en) html += '<p><strong>'+t('featureDescription')+':</strong> '+(lang==='ar'?d.description_ar:lang==='ru'?(d.description_ru||d.description_en):lang==='uz'?(d.description_uz||d.description_en):lang==='es'?(d.description_es||d.description_en):d.description_en)+'</p>';
                setState('_lastPanelRenderTime', performance.now());
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                countryPanel.setAttribute('aria-hidden', 'false');
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }

export function translateResourceValue(val) {
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

export function getContinent(name) {
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

export function getGovernment(name) {
                if (!name) return 'Unknown';
                const clean = getCleanName(name);
                if (governmentByCountry[clean]) return governmentByCountry[clean];
                if (governmentByCountry[name]) return governmentByCountry[name];
                return 'Unknown';
            }

export function showRouteDetail(d) {
                setState('selectedFeature', d);
                setState('selectedFeatureType', 'route');
                var displayName = lang==='ar'?d.name_ar:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en;
                var icon = d.type==='land'?'🚛':d.type==='sea'?'🚢':d.type==='air'?'✈️':d.type==='pipeline'?'🛢️':d.type==='canal'?'🚰':'🌊';
                var html = '<h3>'+icon+' '+displayName+'</h3>';
                if (d.length_km) html += '<p><strong>'+t('featureLength')+':</strong> '+d.length_km+' '+t('featureKm')+'</p>';
                if (d.countries_ar||d.countries_en) html += '<p><strong>'+t('featureCountries')+':</strong> '+(lang==='ar'?d.countries_ar:lang==='ru'?(d.countries_ru||d.countries_en):lang==='uz'?(d.countries_uz||d.countries_en):lang==='es'?(d.countries_es||d.countries_en):d.countries_en)+'</p>';
                var typeLabel = d.type==='land'?t('landRoute'):d.type==='sea'?t('seaRoute'):d.type==='canal'?t('canal'):d.type==='strait'?t('strait'):d.type==='air'?t('airRoute'):d.type==='pipeline'?t('pipeline'):d.type;
                html += '<p><strong>'+t('routeType')+':</strong> '+typeLabel+'</p>';
                setState('_lastPanelRenderTime', performance.now());
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                countryPanel.setAttribute('aria-hidden', 'false');
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }

export function drawRoutes(skipFadeIn) {
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

export function drawCorridors() { drawRoutes(); }

export function drawAdditionalWaterways() { drawRoutes(); }

export function drawCapitals() {
                gCapitals.selectAll('*').remove();
            }

export function drawMajorCities() {
                gMajorCities.selectAll('*').remove();
            }

export var timezoneData = null;

export var timezoneDataLoading = null;

export function ensureTimezoneDataLoaded() {
                if (timezoneData) return Promise.resolve(timezoneData);
                if (timezoneDataLoading) return timezoneDataLoading;
                var basePath = window.location.pathname.replace(/\/[^\/]*$/, '/');
                timezoneDataLoading = fetch(basePath + 'timezone-data.json')
                    .then(function(r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
                    .then(function(entries) {
                        timezoneData = entries.map(function(e) {
                            var rings = e.rings.map(function(ring) {
                                if (d3.geoArea({ type: 'Polygon', coordinates: [ring] }) > 2 * Math.PI) {
                                    ring = ring.slice().reverse();
                                }
                                return ring;
                            });
                            return {
                                tz: e.tz,
                                rings: rings,
                                zone: computeTzOffset(e.tz),
                                label: e.tz,
                                places: tzShortName(e.tz)
                            };
                        });
                        return timezoneData;
                    })
                    .catch(function(err) {
                        console.error('Failed to load timezone data:', err);
                        timezoneDataLoading = null;
                        failLayerData('timezones', t('timezoneLoadError'));
                        return [];
                    });
                return timezoneDataLoading;
            }

export function computeTzOffset(tzid) {
                var et = tzid.match(/^Etc\/GMT([+-]?\d+)$/) || tzid.match(/^Etc\/UTC([+-]?\d+)$/);
                if (et) return -parseFloat(et[1]);
                var num = tzid.match(/^([+-])(\d{2}):?(\d{2})$/);
                if (num) return (num[1] === '-' ? -1 : 1) * (parseInt(num[2], 10) + parseInt(num[3], 10) / 60);
                try {
                    var fmt = new Intl.DateTimeFormat('en-US', { timeZone: tzid, timeZoneName: 'longOffset' });
                    var parts = fmt.formatToParts(new Date());
                    var off = '';
                    parts.forEach(function(p) { if (p.type === 'timeZoneName') off = p.value; });
                    var m = off.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
                    if (m) return (m[1] === '-' ? -1 : 1) * (parseInt(m[2], 10) + parseInt(m[3] || '0', 10) / 60);
                } catch (e) {}
                return null;
            }

export function tzShortName(tzid) {
                var i = tzid.lastIndexOf('/');
                var name = i >= 0 ? tzid.slice(i + 1) : tzid;
                return name.replace(/_/g, ' ');
            }

export function formatUtcOffset(offset) {
                if (offset == null) return 'UTC?';
                var sign = offset >= 0 ? '+' : '-';
                var abs = Math.abs(offset);
                var h = Math.floor(abs);
                var m = Math.round((abs - h) * 60);
                return 'UTC' + sign + (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
            }

export function drawTimezones(skipFadeIn) {
                if (!gTimezones) return;
                gTimezones.selectAll('*').remove();
                gTimezones.on('.timezone', null);
                if (!timezonesVisible || !timezoneData) return;
                var items = [];
                timezoneData.forEach(function(entry) {
                    entry.rings.forEach(function(ring) {
                        var geoFeature = { type: 'Feature', geometry: { type: 'Polygon', coordinates: [ring] }, properties: { tz: entry.tz, zone: entry.zone, label: entry.label } };
                        geoFeature._entry = entry;
                        items.push(geoFeature);
                    });
                });
                var sel = gTimezones.selectAll('path').data(items).enter().append('path')
                    .attr('d', pathGen)
                    .attr('fill', function(d) { return getTimezoneColor(d.properties.zone); })
                    .attr('fill-opacity', 0.38)
                    .attr('stroke', function(d) { return getTimezoneColor(d.properties.zone); })
                    .attr('stroke-width', 1)
                    .attr('stroke-opacity', 0.9)
                    .attr('vector-effect', 'non-scaling-stroke')
                    .style('fill-rule', 'evenodd')
                    .style('cursor', 'pointer');
                if (skipFadeIn) sel.attr('opacity', 1);
                else sel.attr('opacity', 0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity', 1);

                function entryFromEvent(event) {
                    if (!event || !event.target || !event.target.closest) return null;
                    var el = event.target.closest('path');
                    return el && el.__data__ ? (el.__data__._entry || el.__data__.properties) : null;
                }
                gTimezones.on('mouseover.timezone', function(event) {
                    var props = entryFromEvent(event);
                    if (!props) return;
                    var tz = props.tz || props.properties.tz;
                    var zone = props.zone || props.properties.zone;
                    var label = props.label || props.properties.label;
                    var now = '';
                    try {
                        now = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date());
                    } catch (e) {}
                    tooltip.textContent = label + ' \u2014 ' + formatUtcOffset(zone) + (now ? ' (' + now + ')' : '');
                    tooltip.classList.add('visible');
                });
                gTimezones.on('mousemove.timezone', function(event) {
                    if (!entryFromEvent(event)) return;
                    setState('_pendingTooltipEvent', event);
                    if (!_tooltipRAFPending) {
                        setState('_tooltipRAFPending', true);
                        requestAnimationFrame(_flushTooltipPosition);
                    }
                });
                gTimezones.on('mouseout.timezone', function() {
                    tooltip.classList.remove('visible');
                });
                gTimezones.on('click.timezone', function(event) {
                    var entry = entryFromEvent(event);
                    if (entry) showFeatureDetail('timezone', entry._entry || entry);
                });
            }

export function drawPhysicalFeatures() {
                gPhysical.selectAll('*').remove();
                var proj = getActiveProjection();

                const showMountains = (colorMode === 'terrain');
                const showRivers   = (colorMode === 'terrain') || riversVisible;
                if (!showMountains && !showRivers) return;

                if (showMountains) {
                    mountainRanges.forEach(m => {
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
                            .attr('opacity', 0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity', 0.45);
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
                            .attr('opacity', 0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity', 0.95);
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
                                .attr('opacity', 0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity', 0.9);
                        });
                        grp.on('mouseenter', function() { mainPath.attr('stroke', MAP_COLORS.physical.mountainHover).attr('opacity', 1); })
                            .on('mouseleave', function() { mainPath.attr('stroke', w === 3 ? MAP_COLORS.physical.mountainMajor : w === 2 ? MAP_COLORS.physical.mountainImportant : MAP_COLORS.physical.mountainMinor).attr('opacity', 0.95); })
                            .on('click', function(e) { e.stopPropagation(); showFeatureDetail('mountain', m); });
                    });
                }

                if (showRivers) {
                    [1, 2, 3].forEach(wLevel => {
                        rivers.filter(r => (r.weight || 1) === wLevel).forEach(r => {
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
                                .attr('opacity', 0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity', 0.3);
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
                                .attr('opacity', 0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity', 0.88);
                            grp.on('mouseenter', function() { mainPath.attr('stroke', MAP_COLORS.physical.riverHover).attr('opacity', 1); })
                                .on('mouseleave', function() { mainPath.attr('stroke', w === 3 ? MAP_COLORS.physical.riverMajor : w === 2 ? MAP_COLORS.physical.riverImportant : MAP_COLORS.physical.riverMinor).attr('opacity', 0.88); })
                                .on('click', function(e) { e.stopPropagation(); showFeatureDetail('river', r); });
                        });
                    });
                }
            }

export function showResourceDetail(d) {
                setState('selectedFeature', d);
                setState('selectedFeatureType', 'resource');
                var displayName = lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en;
                var typeLabel = d.type==='oil'?'🛢️':d.type==='gas'?'🔥':d.type==='coal'?'⛏️':d.type==='metal'?'🔩':d.type==='precious'?'💎':d.type==='nuclear'?'☢️':d.type==='renewable'?'♻️':d.type==='water'?'💧':d.type==='forest'?'🌲':'🗿';
                var html = '<h3>'+typeLabel+' '+displayName+'</h3>';
                if (d.countries_ar||d.countries_en) html += '<p><strong>'+t('featureCountries')+':</strong> '+(lang==='ar'?d.countries_ar:lang==='ru'?(d.countries_ru||d.countries_en):lang==='uz'?(d.countries_uz||d.countries_en):lang==='es'?(d.countries_es||d.countries_en):d.countries_en)+'</p>';
                if (d.reserves) html += '<p><strong>'+t('reserves')+':</strong> '+translateResourceValue(d.reserves)+'</p>';
                if (d.production) html += '<p><strong>'+t('production')+':</strong> '+translateResourceValue(d.production)+'</p>';
                if (d.capacity) html += '<p><strong>'+t('capacity')+':</strong> '+translateResourceValue(d.capacity)+'</p>';
                if (d.description_ar||d.description_en) html += '<p><strong>'+t('featureDescription')+':</strong> '+(lang==='ar'?d.description_ar:lang==='ru'?(d.description_ru||d.description_en):lang==='uz'?(d.description_uz||d.description_en):lang==='es'?(d.description_es||d.description_en):d.description_en)+'</p>';
                setState('_lastPanelRenderTime', performance.now());
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                countryPanel.setAttribute('aria-hidden', 'false');
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }

export function drawNaturalResources() {
                gNaturalResources.selectAll('*').remove();
                if (!naturalResourcesVisible) return;
                var k = Math.max(0.4, currentTransform.k);
                var resourceColorMap = MAP_COLORS.naturalResources;
                // Base radius scales smoothly with zoom so markers stay visible
                var r = Math.max(4, Math.min(14, (isMobile ? 6 : 8) * Math.pow(k, 0.4)));
                // Labels: constant screen size (Google Maps approach). 13px base on
                // desktop (10% larger than the old 12px), floor of 8px for legibility.
                var fontSize = labelPx(k, isMobile ? 10 : 13, 8, 16);
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
                    // Single clean marker: colored dot + white ring, no translucent halo
                    gNaturalResources.append('circle')
                        .attr('cx', xy[0]).attr('cy', xy[1]).attr('r', r)
                        .attr('fill', color).attr('stroke', '#fff').attr('stroke-width', 1.2)
                        .style('cursor', 'pointer')
                        .attr('opacity', 0)
                        .transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity', 0.9);
                    gNaturalResources.append('text')
                        .attr('x', xy[0] + r + 4 / k).attr('y', xy[1] + 3 / k)
                        .text(function(){return lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en;})
                        .attr('fill', '#fff').attr('font-size', fontSize + 'px').attr('font-weight', 'bold')
                        .attr('opacity', 0)
                        .transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity', 0.9)
                        .style('pointer-events', 'none');
                });
            }

export function drawEthnicGroups() {
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
                    var fs = labelPx(k, isMobile ? 10 : 13, 8, 16);
                    gEthnicGroups.append('circle').attr('cx',xy[0]).attr('cy',xy[1]).attr('r',r*1.8).attr('fill',color).style('pointer-events','none').attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.18);
                    gEthnicGroups.append('circle').datum(d).attr('cx',xy[0]).attr('cy',xy[1]).attr('r',r).attr('fill',color).attr('stroke','#fff').attr('stroke-width',1).style('cursor','pointer').attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.6);
                    gEthnicGroups.append('text').attr('x',xy[0]+r+3/k).attr('y',xy[1]+2/k).text(function(){return lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en;}).attr('fill','#fff').attr('font-size',fs+'px').attr('font-weight','bold').style('pointer-events','none');
                });
            }

export function showOceanCurrentDetail(d) {
                setState('selectedFeature', d);
                setState('selectedFeatureType', 'oceanCurrent');
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
                    if (d.depth) html += '<p><strong>'+t('trenchDepth')+':</strong> '+fmtNum(d.depth)+' '+t('elevationUnit')+'</p>';
                }
                if (d.description_ar||d.description_en) html += '<p><strong>'+t('featureDescription')+':</strong> '+(lang==='ar'?d.description_ar:lang==='ru'?(d.description_ru||d.description_en):lang==='uz'?(d.description_uz||d.description_en):lang==='es'?(d.description_es||d.description_en):d.description_en)+'</p>';
                setState('_lastPanelRenderTime', performance.now());
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                countryPanel.setAttribute('aria-hidden', 'false');
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }

export function drawOceanCurrents(skipFadeIn) {
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

export function drawWinds(skipFadeIn) {
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

export function showEarthquakeDetail(d) {
                setState('selectedFeature', d);
                setState('selectedFeatureType', 'earthquake');
                var displayName = lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en;
                var html = '<h3>🏚️ '+displayName+'</h3>';
                if (d.magnitude) html += '<p><strong>'+t('magnitude')+':</strong> '+d.magnitude+'</p>';
                if (d.year) html += '<p><strong>'+t('year')+':</strong> '+d.year+'</p>';
                if (d.plate_ar||d.plate_en) html += '<p><strong>'+t('tectonicPlate')+':</strong> '+(lang==='ar'?d.plate_ar:lang==='ru'?(d.plate_ru||d.plate_en):lang==='uz'?(d.plate_uz||d.plate_en):lang==='es'?(d.plate_es||d.plate_en):d.plate_en)+'</p>';
                if (d.description_ar||d.description_en) html += '<p><strong>'+t('featureDescription')+':</strong> '+(lang==='ar'?d.description_ar:lang==='ru'?(d.description_ru||d.description_en):lang==='uz'?(d.description_uz||d.description_en):lang==='es'?(d.description_es||d.description_en):d.description_en)+'</p>';
                setState('_lastPanelRenderTime', performance.now());
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                countryPanel.setAttribute('aria-hidden', 'false');
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }

export function showTectonicPlateDetail(d) {
                setState('selectedFeature', d);
                setState('selectedFeatureType', 'tectonicPlate');
                var displayName = lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en;
                var html = '<h3>🗿 '+displayName+'</h3>';
                html += '<p>'+t('tectonicPlates')+'</p>';
                setState('_lastPanelRenderTime', performance.now());
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                countryPanel.setAttribute('aria-hidden', 'false');
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }

export function drawEarthquakes(skipFadeIn) {
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

export function showVolcanoDetail(d) {
                setState('selectedFeature', d);
                setState('selectedFeatureType', 'volcano');
                var displayName = lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en;
                var html = '<h3>🌋 '+displayName+'</h3>';
                if (d.elevation) html += '<p><strong>'+t('tooltipElevation')+':</strong> '+fmtNum(d.elevation)+' '+t('elevationUnit')+'</p>';
                if (d.type) html += '<p><strong>'+t('volcanoType')+':</strong> '+(lang==='ar'?d.type_ar||d.type:lang==='ru'?(d.type_ru||d.type_en||d.type):lang==='uz'?(d.type_uz||d.type_en||d.type):lang==='es'?(d.type_es||d.type_en||d.type):d.type_en||d.type)+'</p>';
                if (d.lastEruption) html += '<p><strong>'+t('lastEruption')+':</strong> '+d.lastEruption+'</p>';
                if (d.description_ar||d.description_en) html += '<p><strong>'+t('featureDescription')+':</strong> '+(lang==='ar'?d.description_ar:lang==='ru'?(d.description_ru||d.description_en):lang==='uz'?(d.description_uz||d.description_en):lang==='es'?(d.description_es||d.description_en):d.description_en)+'</p>';
                setState('_lastPanelRenderTime', performance.now());
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                countryPanel.setAttribute('aria-hidden', 'false');
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }

export function drawVolcanoes(skipFadeIn) {
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

export function drawGeopoliticalBlocs(skipFadeIn) {
                gGeopoliticalBlocs.selectAll('*').remove();
                if (!geopoliticalBlocsVisible) return;
                if (selectedBloc !== 'all') {
                    var bloc = geopoliticalBlocsData.find(function(b){return b.name_en===selectedBloc||b.name===selectedBloc;});
                    if (bloc && bloc.members && bloc.members.length) {
                        var blocColor = bloc.color || MAP_COLORS.blocDefault;
                        var k = Math.max(0.4, currentTransform.k);
                        var fs = labelPx(k, isMobile ? 9 : 11, 8, 15);
                        allCountryFeatures.forEach(function(f){
                            var name = f.properties?.name;
                            var cleanName = getCleanName(name);
                            if (bloc.members.some(function(m){return getCleanName(m)===cleanName;})) {
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

export function getCityCountryName(city) {
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

export function getCityCategoryRank(city) {
                const sameCategory = majorCitiesData.filter(c => c.category === city.category);
                sameCategory.sort((a, b) => (b.pop || 0) - (a.pop || 0));
                const rank = sameCategory.findIndex(c => c === city) + 1;
                return { rank: rank, total: sameCategory.length };
            }

export function showCityDetail(city) {
                setState('selectedFeature', city);
                setState('selectedFeatureType', 'city');
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
                setState('_lastPanelRenderTime', performance.now());
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                countryPanel.setAttribute('aria-hidden', 'false');
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }

export function showDesertForestDetail(d) {
                setState('selectedFeature', d);
                setState('selectedFeatureType', 'desertForest');
                var displayName = lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en;
                var typeIcon = d.type==='desert'?'🏜️':'🌲';
                var html = '<h3>'+typeIcon+' '+displayName+'</h3>';
                if (d.area_km2) html += '<p><strong>'+t('areaTitle')+':</strong> '+fmtNum(d.area_km2)+' '+t('km2')+'</p>';
                if (d.countries_ar||d.countries_en) html += '<p><strong>'+t('featureCountries')+':</strong> '+(lang==='ar'?d.countries_ar:lang==='ru'?(d.countries_ru||d.countries_en):lang==='uz'?(d.countries_uz||d.countries_en):lang==='es'?(d.countries_es||d.countries_en):d.countries_en)+'</p>';
                if (d.biome_ar||d.biome_en) html += '<p><strong>'+t('biome')+':</strong> '+(lang==='ar'?d.biome_ar:lang==='ru'?(d.biome_ru||d.biome_en):lang==='uz'?(d.biome_uz||d.biome_en):lang==='es'?(d.biome_es||d.biome_en):d.biome_en)+'</p>';
                if (d.description_ar||d.description_en) html += '<p><strong>'+t('featureDescription')+':</strong> '+(lang==='ar'?d.description_ar:lang==='ru'?(d.description_ru||d.description_en):lang==='uz'?(d.description_uz||d.description_en):lang==='es'?(d.description_es||d.description_en):d.description_en)+'</p>';
                setState('_lastPanelRenderTime', performance.now());
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                countryPanel.setAttribute('aria-hidden', 'false');
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }

export function drawDesertsForests(skipFadeIn) {
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
                        gDesertsForests.append('path').datum({type:'LineString', coordinates:expanded, _data:d}).attr('d', pathGen).attr('fill','none').attr('stroke',haloColor).attr('stroke-width',(isMobile?4:7)).attr('vector-effect','non-scaling-stroke').style('pointer-events','none');
                        gDesertsForests.append('path').datum({type:'LineString', coordinates:expanded, _data:d}).attr('d', pathGen).attr('fill','none').attr('stroke',color).attr('stroke-width',isMobile?2:4).attr('stroke-opacity',1).attr('stroke-dasharray','6,3').attr('vector-effect','non-scaling-stroke').style('cursor','pointer').on('click',function(e,dd){showDesertForestDetail(dd._data);});
                        var mid = d.coords[Math.floor(d.coords.length/2)];
                        var mxy = proj(mid);
                        if (mxy && !isNaN(mxy[0])) {
                            var labelText = lang === 'ar' ? d.name : lang === 'ru' ? (d.name_ru || d.name_en) : lang === 'uz' ?(d.name_uz || d.name_en): lang === 'es' ?(d.name_es || d.name_en) : d.name_en;
                            var fontSize = labelPx(k, isMobile ? 10 : 13, 8, 15);
                            var _sel = gDesertsForests.append('text').attr('x',mxy[0]).attr('y',mxy[1]).text(labelText).attr('fill','#fff').attr('font-size',fontSize).attr('font-weight','bold').attr('text-anchor','middle').style('pointer-events','none');
                            if (skipFadeIn) _sel.attr('opacity',0.95); else _sel.attr('opacity',0).transition().duration(prefersReducedMotion() ? 0 : 300).attr('opacity',0.95);
                            gDesertsForests.append('circle').datum(d).attr('cx',mxy[0]).attr('cy',mxy[1]).attr('r',isMobile?20:30).attr('fill','transparent').style('cursor','pointer').on('click',function(e,dd){showDesertForestDetail(dd);});
                        }
                    }
                });
            }

export function drawBorderDisputes(skipFadeIn) {
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
                    var fs = labelPx(k, isMobile ? 9 : 12, 8, 14);
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

export function showBorderDisputeDetail(d) {
                if (!d) return;
                var content = document.getElementById('panelContent');
                if (!content) return;
                var typeIcon = d.type === 'active' ? '⚔️' : d.type === 'ceasefire' ? '☮️' : '🌊';
                var typeLabel = d.type === 'active' ? (lang==='ar'?'نزاع نشط':lang==='ru'?'Активный конфликт':lang==='uz'?'Faol nizo':lang==='es'?'Conflicto activo':'Active Conflict') : d.type === 'ceasefire' ? (lang==='ar'?'وقف إطلاق نار':lang==='ru'?'Перемирие':lang==='uz'?'O\'t ochishni to\'xtatish':lang==='es'?'Alto el fuego':'Ceasefire') : (lang==='ar'?'نزاع بحري':lang==='ru'?'Морской спор':lang==='uz'?'Dengiz nizosi':lang==='es'?'Disputa marítima':'Maritime Dispute');
                var html = '<h3>'+(lang==='ar'?d.name_ar:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en)+'</h3>';
                html += '<div style="margin-bottom:8px"><span style="font-size:1.4em">'+typeIcon+'</span> <strong style="color:'+(d.type==='active'?MAP_COLORS.borderDisputes.active:d.type==='ceasefire'?MAP_COLORS.borderDisputes.ceasefire:MAP_COLORS.borderDisputes.maritime)+'">'+typeLabel+'</strong></div>';
                html += '<p><strong>'+t('featureCountries')+':</strong> '+(lang==='ar'?d.countries_ar:lang==='ru'?(d.countries_ru||d.countries_en):lang==='uz'?(d.countries_uz||d.countries_en):lang==='es'?(d.countries_es||d.countries_en):d.countries_en)+'</p>';
                html += '<p><strong>'+(lang==='ar'?'الأسباب':lang==='ru'?'Причины':lang==='uz'?'Sabablar':lang==='es'?'Causas':'Causes')+':</strong> '+(lang==='ar'?d.causes_ar:lang==='ru'?(d.causes_ru||d.causes_en):lang==='uz'?(d.causes_uz||d.causes_en):lang==='es'?(d.causes_es||d.causes_en):d.causes_en)+'</p>';
                setState('_lastPanelRenderTime', performance.now());
                content.innerHTML = html;
                var panel = document.getElementById('countryPanel');
                if (panel) { panel.style.display = 'block';
                requestAnimationFrame(function(){requestAnimationFrame(function(){panel.classList.add('visible');});}); }
                setState('selectedFeature', d);
                setState('selectedFeatureType', 'borderDispute');
            }

export function ensureAdminBoundariesLoaded() {
                if (adminBoundariesData) return Promise.resolve(adminBoundariesData);
                if (adminBoundariesLoading) return adminBoundariesLoading;
                var basePath = window.location.pathname.replace(/\/[^\/]*$/, '/');
                setState('adminBoundariesLoading', fetch(basePath + 'admin-boundaries-data.json')
                    .then(function(r) { return r.json(); })
                    .then(function(data) { setState('adminBoundariesData', data); hideDataLayerLoading('adminBoundaries'); try { getAdminLabelMeta(data); } catch(e) {} return data; })
                    .catch(function(err) {
                        console.error('Failed to load admin boundaries:', err);
                        setState('adminBoundariesLoading', null);
                        failLayerData('adminBoundaries', t('adminBoundariesLoadError'));
                        return [];
                    }));
                return adminBoundariesLoading;
            }

export function ensureAdminNameTranslationsLoaded() {
                if (adminNameTranslations) return Promise.resolve(adminNameTranslations);
                if (adminNameTranslationsLoading) return adminNameTranslationsLoading;
                var basePath = window.location.pathname.replace(/\/[^\/]*$/, '/');
                setState('adminNameTranslationsLoading', fetch(basePath + 'admin-name-translations.json')
                    .then(function(r) { return r.ok ? r.json() : {}; })
                    .then(function(data) { setState('adminNameTranslations', data || {}); return adminNameTranslations; })
                    .catch(function(err) {
                        console.error('Failed to load admin name translations:', err);
                        setState('adminNameTranslationsLoading', null);
                        setState('adminNameTranslations', {});
                        return adminNameTranslations;
                    }));
                return adminNameTranslationsLoading;
            }

export function getMergedAdminBoundaries(features) {
                if (!adminBoundariesMerged) {
                    setState('adminBoundariesMerged', {
                        type: 'GeometryCollection',
                        geometries: features.map(function(f) {
                            return { type: f.type, coordinates: f.coordinates };
                        })
                    });
                }
                return adminBoundariesMerged;
            }

export function getAdminBoundariesCentroids(features) {
                if (!adminBoundariesCentroids) {
                    setState('adminBoundariesCentroids', features.map(function(f) {
                        return {
                            name: f.name,
                            centroid: d3.geoCentroid({ type: 'Feature', geometry: { type: f.type, coordinates: f.coordinates } })
                        };
                    }));
                }
                return adminBoundariesCentroids;
            }

export let adminLabelMeta = null;

export let adminLabelMetaFeatures = null;

export function getAdminLabelMeta(features) {
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

export const ADMIN_TIER_STEPS = [[4, 0.12], [6, 0.25], [8, 0.4], [10, 0.55], [13, 0.7], [17, 0.85], [21, 0.97], [24, 1]];

export function adminTierCount(k, total) {
                var frac = 0;
                for (var s = 0; s < ADMIN_TIER_STEPS.length; s++) {
                    if (k >= ADMIN_TIER_STEPS[s][0]) frac = ADMIN_TIER_STEPS[s][1];
                }
                return Math.max(1, Math.round(total * frac));
            }

export function drawAdminBoundariesDebounced() {
                clearTimeout(_adminBoundariesRedrawTimeout);
                setState('_adminBoundariesRedrawTimeout', setTimeout(function() {
                    if (globeModeActive) {
                        gAdminBoundaries.selectAll('*').remove();
                        ensureAdminBoundariesLoaded().then(drawAdminBoundariesCanvas);
                    } else {
                        drawAdminBoundaries();
                    }
                }, 200));
            }

export function drawAdminBoundaries() {
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

export var _adminBakedCanvas = null;

export var _adminBakedCtx = null;

export var _adminBakedTransform = null;

export var _adminRingBounds = null;

export var _adminRingBoundsProj = null;

export var _adminRingBoundsFeatures = null;

export var _adminLandMask = null;

export var _adminLandMaskProj = null;

export var _adminLandMaskCell = 0;

export var _adminLandMaskW = 0;

export var _adminLandMaskH = 0;

export function _adminBuildLandMask(proj, rect) {
                if (_adminLandMask && _adminLandMaskProj === proj) {
                    return { mask: _adminLandMask, w: _adminLandMaskW, h: _adminLandMaskH, cell: _adminLandMaskCell };
                }
                if (!allCountryFeatures || !allCountryFeatures.length) return null;
                var cell = 2;
                var mw = Math.max(1, Math.ceil(rect.width / cell) + 2);
                var mh = Math.max(1, Math.ceil(rect.height / cell) + 2);
                var cv = document.createElement('canvas');
                cv.width = mw;
                cv.height = mh;
                var c = cv.getContext('2d');
                c.setTransform(1 / cell, 0, 0, 1 / cell, cell, cell);
                c.fillStyle = '#000';
                c.fillRect(-cell, -cell, rect.width + cell * 2, rect.height + cell * 2);
                var gen = d3.geoPath(proj, c);
                c.fillStyle = '#fff';
                for (var i = 0; i < allCountryFeatures.length; i++) {
                    c.beginPath();
                    gen(allCountryFeatures[i]);
                    c.fill();
                }
                var img = c.getImageData(0, 0, mw, mh);
                var px = img.data;
                var mask = new Uint8Array(mw * mh);
                for (var j = 0; j < mw * mh; j++) {
                    mask[j] = px[j * 4] > 128 ? 1 : 0;
                }
                var R = 4;
                if (R > 0) {
                    var dil = new Uint8Array(mw * mh);
                    for (var y = 0; y < mh; y++) {
                        for (var x = 0; x < mw; x++) {
                            if (!mask[y * mw + x]) continue;
                            for (var dy = -R; dy <= R; dy++) {
                                for (var dx = -R; dx <= R; dx++) {
                                    if (dx * dx + dy * dy > R * R) continue;
                                    var nx = x + dx, ny = y + dy;
                                    if (nx < 0 || ny < 0 || nx >= mw || ny >= mh) continue;
                                    dil[ny * mw + nx] = 1;
                                }
                            }
                        }
                    }
                    mask = dil;
                }
                _adminLandMask = mask;
                _adminLandMaskProj = proj;
                _adminLandMaskCell = cell;
                _adminLandMaskW = mw;
                _adminLandMaskH = mh;
                return { mask: mask, w: mw, h: mh, cell: cell };
            }

export function adminProjectGeometryToPathMasked(path, proj, geom, maskInfo) {
                if (!geom || !maskInfo) return;
                function isLand(x, y) {
                    if (!isFinite(x) || !isFinite(y)) return false;
                    var gx = Math.floor(x / maskInfo.cell) + 1;
                    var gy = Math.floor(y / maskInfo.cell) + 1;
                    if (gx < 0 || gy < 0 || gx >= maskInfo.w || gy >= maskInfo.h) return false;
                    return maskInfo.mask[gy * maskInfo.w + gx] !== 0;
                }
                function drawLine(line) {
                    if (!line || !line.length) return;
                    var started = false;
                    var prevP = null;
                    var pending = null;
                    for (var i = 0; i < line.length; i++) {
                        var p = proj(line[i]);
                        if (!isFinite(p[0]) || !isFinite(p[1])) { started = false; prevP = null; pending = null; continue; }
                        if (!started) {
                            if (isLand(p[0], p[1])) {
                                path.moveTo(p[0], p[1]);
                                started = true;
                                pending = null;
                            } else {
                                pending = p;
                            }
                            prevP = p;
                            continue;
                        }
                        var keep = isLand(prevP[0], prevP[1]) || isLand(p[0], p[1]) || isLand((prevP[0] + p[0]) / 2, (prevP[1] + p[1]) / 2);
                        if (keep) {
                            path.lineTo(p[0], p[1]);
                        } else {
                            started = false;
                            pending = p;
                        }
                        prevP = p;
                    }
                }
                function drawRings(rings) {
                    for (var r = 0; r < rings.length; r++) {
                        drawLine(rings[r]);
                    }
                }
                var t = geom.type;
                if (t === 'Polygon') {
                    drawRings(geom.coordinates);
                } else if (t === 'MultiPolygon') {
                    for (var pi = 0; pi < geom.coordinates.length; pi++) {
                        drawRings(geom.coordinates[pi]);
                    }
                } else if (t === 'LineString') {
                    drawLine(geom.coordinates);
                } else if (t === 'MultiLineString') {
                    for (var li = 0; li < geom.coordinates.length; li++) {
                        drawLine(geom.coordinates[li]);
                    }
                }
            }

export function _adminBakeInvalidate() { setState('_adminBakeDirty', true); }

export function _adminRingBoundsFor(features) {
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
                var out = new Array(features.length);
                for (var i = 0; i < features.length; i++) {
                    collector.reset();
                    adminProjectGeometryToPath(collector, proj, { type: features[i].type, coordinates: features[i].coordinates });
                    out[i] = isFinite(collector.minX) ? [collector.minX, collector.minY, collector.maxX, collector.maxY] : null;
                }
                _adminRingBounds = out;
                _adminRingBoundsProj = proj;
                _adminRingBoundsFeatures = features;
                return out;
            }

export function _adminNeedsRebake() {
                if (_adminBakeDirty) return true;
                if (!_adminBakedCanvas || !_adminBakedTransform) return true;
                return false;
            }

export function adminProjectLineToPath(path, proj, line) {
                if (!line || !line.length) return;
                var moved = false;
                for (var i = 0; i < line.length; i++) {
                    var p = proj(line[i]);
                    if (isFinite(p[0]) && isFinite(p[1])) {
                        if (moved) {
                            path.lineTo(p[0], p[1]);
                        } else {
                            path.moveTo(p[0], p[1]);
                            moved = true;
                        }
                    }
                }
            }

export function adminProjectRingsToPath(path, proj, rings) {
                for (var r = 0; r < rings.length; r++) {
                    adminProjectLineToPath(path, proj, rings[r]);
                    path.closePath();
                }
            }

export function adminProjectGeometryToPath(path, proj, geom) {
                if (!geom) return;
                var t = geom.type;
                if (t === 'Polygon') {
                    adminProjectRingsToPath(path, proj, geom.coordinates);
                } else if (t === 'MultiPolygon') {
                    for (var pi = 0; pi < geom.coordinates.length; pi++) {
                        adminProjectRingsToPath(path, proj, geom.coordinates[pi]);
                    }
                } else if (t === 'LineString') {
                    adminProjectLineToPath(path, proj, geom.coordinates);
                } else if (t === 'MultiLineString') {
                    for (var li = 0; li < geom.coordinates.length; li++) {
                        adminProjectLineToPath(path, proj, geom.coordinates[li]);
                    }
                }
            }

export function _adminSeamSplitGeometries(geom, proj, jumpPx) {
                var split = function(ring) {
                    var pieces = [];
                    var cur = [];
                    var prevP = null;
                    var prevGeo = null;
                    for (var i = 0; i < ring.length; i++) {
                        var p = proj(ring[i]);
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

export function bakeAdminBoundariesCanvas(features) {
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
                var proj = getActiveProjection();
                var seamJumpPx = Math.min(rect.width, rect.height) * 0.55;
                var mapDiag = Math.max(rect.width, rect.height);
                var maskInfo = _adminBuildLandMask(proj, rect);
                var visibleGeoms = [];
                for (var bi = 0; bi < features.length; bi++) {
                    var bb = bounds[bi];
                    if (!bb) continue;
                    if (bb[0] <= vx1 && bb[1] <= vy1 && bb[2] >= vx0 && bb[3] >= vy0) {
                        var g = { type: features[bi].type, coordinates: features[bi].coordinates };
                        var bw = bb[2] - bb[0], bh = bb[3] - bb[1];
                        if (bw > mapDiag * 0.15 || bh > mapDiag * 0.15) {
                            var splitG = _adminSeamSplitGeometries(g, proj, seamJumpPx);
                            if (Array.isArray(splitG)) {
                                visibleGeoms.push.apply(visibleGeoms, splitG);
                            } else {
                                visibleGeoms.push(splitG || g);
                            }
                        } else {
                            visibleGeoms.push(g);
                        }
                    }
                }
                _adminBakedCtx.strokeStyle = MAP_COLORS.adminBoundaries.stroke;
                _adminBakedCtx.lineWidth = (isMobile ? 0.4 : 0.6) / k;
                _adminBakedCtx.globalAlpha = 0.5;
                _adminBakedCtx.setLineDash([2 / k, 2 / k]);
                var BATCH = 90;
                for (var bi2 = 0; bi2 < visibleGeoms.length; bi2 += BATCH) {
                    _adminBakedCtx.beginPath();
                    var end = Math.min(bi2 + BATCH, visibleGeoms.length);
                    for (var vj = bi2; vj < end; vj++) {
                        if (maskInfo) {
                            adminProjectGeometryToPathMasked(_adminBakedCtx, proj, visibleGeoms[vj], maskInfo);
                        } else {
                            adminProjectGeometryToPath(_adminBakedCtx, proj, visibleGeoms[vj]);
                        }
                    }
                    _adminBakedCtx.stroke();
                }
                _adminBakedTransform = { k: k, tx: tx, ty: ty };
                setState('_adminBakeDirty', false);
            }

export function drawAdminBoundariesCanvas2D(features) {
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

export function scheduleAdminBoundariesRedraw() {
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

export function drawAdminBoundariesCanvas(features) {
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
                var proj = getActiveProjection();
                adminBoundariesCtx.save();
                adminBoundariesCtx.beginPath();
                for (var gi = 0; gi < features.length; gi++) {
                    adminProjectGeometryToPath(adminBoundariesCtx, proj, { type: features[gi].type, coordinates: features[gi].coordinates });
                }
                adminBoundariesCtx.strokeStyle = MAP_COLORS.adminBoundaries.stroke;
                adminBoundariesCtx.lineWidth = isMobile ? 0.4 : 0.6;
                adminBoundariesCtx.globalAlpha = 0.5;
                adminBoundariesCtx.setLineDash([2, 2]);
                adminBoundariesCtx.stroke();
                adminBoundariesCtx.restore();
            }

export function toggleNaturalResources() { toggleLayer('naturalResources'); }

export function toggleEthnicGroups()     { toggleLayer('ethnicGroups'); }

export function toggleOceanCurrents()    { toggleLayer('oceanCurrents'); }

export function toggleWinds()            { toggleLayer('winds'); }

export function toggleEarthquakes()      { toggleLayer('earthquakes'); }

export function toggleVolcanoes()        { toggleLayer('volcanoes'); }

export function toggleDesertsForests()   { toggleLayer('desertsForests'); }

export function toggleBorderDisputes()   { toggleLayer('borderDisputes'); }

export function toggleAdminBoundaries() {
                var turningOn = !adminBoundariesVisible;
                toggleLayer('adminBoundaries');
                if (turningOn && !adminBoundariesData && !adminBoundariesLoading) showDataLayerLoading('adminBoundaries');
            }

export function toggleRivers()           { toggleLayer('rivers'); }

export function toggleGeopoliticalBlocs() { toggleLayer('geopoliticalBlocs'); }

export function showWindDetail(d) {
                setState('selectedFeature', d);
                setState('selectedFeatureType', 'wind');
                var displayName = lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):lang==='uz'?(d.name_uz||d.name_en):lang==='es'?(d.name_es||d.name_en):d.name_en;
                var typeLabels = {trade: lang==='ar'?'تجارية':lang==='ru'?'Пассаты':lang==='uz'?'Passatlar':lang==='es'?'Vientos alisios':'Trade Winds', westerly: lang==='ar'?'غربية':lang==='ru'?'Западные':lang==='uz'?'G\'arbiy':lang==='es'?'Vientos del oeste':'Westerlies', polar: lang==='ar'?'قطبية':lang==='ru'?'Полярные':lang==='uz'?'Qutbiy':lang==='es'?'Vientos polares':'Polar Easterlies', monsoon: lang==='ar'?'موسمية':lang==='ru'?'Муссоны':lang==='uz'?'Mussonlar':lang==='es'?'Monzones':'Monsoon', seasonal: lang==='ar'?'موسمية':lang==='ru'?'Сезонные':lang==='uz'?'Mevsimiy':lang==='es'?'Estacional':'Seasonal'};
                var html = '<h3>💨 '+displayName+'</h3>';
                html += '<p><strong>'+t('windType')+':</strong> '+(typeLabels[d.type]||d.type)+'</p>';
                if (d.description_ar||d.description_en) html += '<p><strong>'+t('featureDescription')+':</strong> '+(lang==='ar'?d.description_ar:lang==='ru'?(d.description_ru||d.description_en):lang==='uz'?(d.description_uz||d.description_en):lang==='es'?(d.description_es||d.description_en):d.description_en)+'</p>';
                setState('_lastPanelRenderTime', performance.now());
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                countryPanel.setAttribute('aria-hidden', 'false');
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }

export function showFeatureDetail(type, data) {
                setState('selectedFeature', data);
                setState('selectedFeatureType', type);
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
                    var _tzNow = '';
                    try { _tzNow = new Intl.DateTimeFormat('en-US', { timeZone: data.tz, hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date()); } catch (e) {}
                    var tzHtml = '<h3>' + t('timezonesLegend') + ': ' + data.label + '</h3>';
                    tzHtml += '<p><strong>' + t('timezonePlaces') + ':</strong> ' + data.places + '</p>';
                    tzHtml += '<p><strong>' + t('timezoneOffset') + ':</strong> ' + formatUtcOffset(data.zone) + (_tzNow ? ' &nbsp;(' + _tzNow + ')' : '') + '</p>';
                    panelContent.innerHTML = tzHtml;
                    countryPanel.style.display = 'block';
                    countryPanel.setAttribute('aria-hidden', 'false');
                    requestAnimationFrame(function() {
                        requestAnimationFrame(function() {
                            countryPanel.classList.add('visible');
                        });
                    });
                    return;
                }

                const isMountain = (type === 'mountain');
                const displayName = lang === 'ar' ? data.name : lang === 'ru' ? (data.name_ru || data.name_en || data.name) : lang === 'uz' ?(data.name_uz || data.name_en || data.name): lang === 'es' ?(data.name_es || data.name_en || data.name) : (data.name_en || data.name);
                let html = `<h3>${isMountain ? t('featureMountainTitle') : t('featureRiverTitle')}: ${displayName}</h3>`;
                if (data.length) {
                    html += `<p><strong>${t('featureLength')}:</strong> ${fmtNum(data.length)} ${t('featureKm')}</p>`;
                }
                if (isMountain) {
                    if (data.highestPeak) {
                        const peakName = lang === 'ar' ? data.highestPeak : lang === 'ru' ? (data.highestPeak_ru || data.highestPeak_en || data.highestPeak) : lang === 'uz' ?(data.highestPeak_uz || data.highestPeak_en || data.highestPeak): lang === 'es' ?(data.highestPeak_es || data.highestPeak_en || data.highestPeak) : (data.highestPeak_en || data.highestPeak);
                        html += `<p><strong>${t('featureHighestPeak')}:</strong> ${peakName}`;
                        if (data.highestElevation) html += ` (${fmtNum(data.highestElevation)} ${t('elevationUnit')})`;
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
                        html += `<p><strong>${t('featureDischarge')}:</strong> ${fmtNum(data.discharge)} ${t('featureM3s')}</p>`;
                    }
                    if (data.basinArea) {
                        html += `<p><strong>${t('featureBasinArea')}:</strong> ${fmtNum(data.basinArea)} ${t('featureKm2')}</p>`;
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
                setState('_lastPanelRenderTime', performance.now());
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                countryPanel.setAttribute('aria-hidden', 'false');
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        countryPanel.classList.add('visible');
                    });
                });
            }

export function closeFeatureDetail() {
                setState('selectedFeature', null);
                setState('selectedFeatureType', null);
            }

export function drawPointLayersCanvas() {
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
                    // Text scales with zoom so it stays readable, rounded to nearest integer for sharp canvas text
                    var fontSize = 13; // const-base density spot label
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
                        const color = s.density > 10000 ? _pal('densitySpots').high : s.density > 4000 ? _pal('densitySpots').medium : _pal('densitySpots').low;
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
                    const fontSize = 14; // constant screen size for capital labels
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
                        const capSize = Math.max(5.5, Math.min(20, (isMobile ? 9 : 11)));
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
                        citySize = Math.max(5, Math.min(18, isMobile ? 10 : 12));
                        setState('_frozenCitySize', citySize);
                    } else {
                        citySize = _frozenCitySize !== null ? _frozenCitySize : Math.max(5, Math.min(18, isMobile ? 10 : 12));
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
                    if (!adminNameTranslations) ensureAdminNameTranslationsLoaded();
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

export function getAreaThreshold() {
                const zoom = currentTransform.k;
                if (zoom > 1.5) return -1;
                let threshold = 0.001 / (zoom + 0.1);
                if (isMobile) threshold *= 1.2;
                return threshold;
            }

export function getLabelFontSize() {
                const zoom = currentTransform.k || 1;
                const minScreenPx = isMobile ? 12 : 16;
                const maxScreenPx = isMobile ? 18 : 24;
                const screenPx = Math.max(minScreenPx, Math.min(maxScreenPx, minScreenPx * Math.pow(zoom, 0.45)));
                return screenPx / zoom;
            }

export function drawCountryLabels(features) {
                if (countryLabelSelection) {
                    countryLabelSelection.remove();
                    setState('countryLabelSelection', null);
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
                setState('countryLabelSelection', labelGroup.selectAll('.country-label'));
            }

export function updateLabels() {
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

export function toggleLabels() {
                 setState('showLabels', !showLabels);
                 labelsToggle.classList.toggle('toggle-on', showLabels);
                 labelsToggle.setAttribute('aria-pressed', String(showLabels));
                 if (countryLabelSelection) {
                    countryLabelSelection.remove();
                    setState('countryLabelSelection', null);
                }
                if (showLabels) {
                    drawCountryLabels(allCountryFeatures);
                } else {
                    gCountryLabels.selectAll('.country-label-group').remove();
                    setState('countryLabelSelection', null);
                }
                updateLegend();
                updateHash();
                updateActiveLayerCount();
            }

export function updateAllStyles() {
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
                    setState('countryLabelSelection', null);
                }
                drawCountryLabels(allCountryFeatures);
                drawPhysicalFeatures();
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
                updateLegend();
                if (selectedCountry && countryPanel.style.display === 'block' && !compareCountry) renderCountryPanel(
                    selectedCountry);
                if (selectedFeature && countryPanel.style.display === 'block' && !selectedCountry && !compareCountry) {
                    showFeatureDetail(selectedFeatureType, selectedFeature);
                }
                if (selectedCountry) highlightSelectedCountry(selectedCountry);
                updateHash();
            }

export function highlightSelectedCountry(d) {
                countryPaths.classed('highlighted-country', false);
                countryPaths.attr('stroke', d => getStroke(d)).attr('stroke-width', d => getStrokeWidth(d));
                countryPaths.each(function() { this.style.removeProperty('filter'); });
                if (d) {
                    countryPaths.filter(p => p === d).classed('highlighted-country', true);
                }
                syncCountryGlow();
            }

export function updateActiveLayerCount() {
                var counter = document.getElementById('layerCounter');
                if (!counter) return;
                var count = 0;
                var toggles = document.querySelectorAll('.layers-row .btn.toggle-on');
                if (toggles) count = toggles.length;
                counter.textContent = count;
            }

export function updateLegend() {
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
                     const stops = _pal('gdp').slice(1).join(',');
                    html += `<div class="legend-gradient-labels"><span>&lt;$1k</span><span>&gt;$80k</span></div>`;
                    html += `<div class="legend-gradient-bar" style="background:linear-gradient(to right,${stops})"></div>`;
                    html += `<div style="font-size:0.8em;color:var(--text-secondary);margin-top:2px">${t('gdpUnit')}</div>`;
                } else if (colorMode === 'hdi') {
                     html += `<div style="font-weight:700;margin-bottom:4px">${t('hdiLegend')}</div>`;
                     const stops = _pal('hdi').slice(1).join(',');
                    html += `<div class="legend-gradient-labels"><span>&lt;0.55</span><span>&gt;0.90</span></div>`;
                    html += `<div class="legend-gradient-bar" style="background:linear-gradient(to right,${stops})"></div>`;
                } else if (colorMode === 'normal') {
                    html += `<div>${t('normalLegend')}</div>`;
                } else {
                    html += `<div style="font-weight:700;margin-bottom:4px">${t('religionLegend')}</div>`;
                    const legendColors = colorblindMode
                        ? (sectMode ? CB_COLORS.denomination : CB_COLORS.religion)
                        : (sectMode ? denominationColors : religionColors);
                    if (colorblindMode) ensureCBPatternDefs();
                    Object.entries(legendColors).forEach(([k, v]) => {
                        const label = sectMode ? (lang === 'ar' ? (denominationArabic[k] || k) : lang === 'ru' ? (denominationRussian[k] || k) : lang === 'uz' ?(denominationUzbek[k] || k): lang === 'es' ?(denominationSpanish[k] || k) : k) : (lang === 'ar' ? (religionArabic[k] || k) : lang === 'ru' ? (religionRussian[k] || k) : lang === 'uz' ?(religionUzbek[k] || k): lang === 'es' ?(religionSpanish[k] || k) : k);
                        // In CB mode, show the same pattern swatch used on the map
                        // so the legend's non-color encoding matches the choropleth.
                        const swatch = colorblindMode
                            ? `<svg class="legend-color" width="14" height="14" aria-hidden="true" style="flex-shrink:0"><rect width="14" height="14" fill="${v}"/><rect width="14" height="14" fill="url(#cbpat-${k})"/></svg>`
                            : `<span class="legend-color" style="background:${v}"></span>`;
                        html +=
                            `<div class="legend-item">${swatch}${label}</div>`;
                    });
                }
                if (corridorsVisible||additionalWaterwaysVisible) html += `<div>🛣️ ${t('routes')}</div>`;
                if (riversVisible) html += `<div>${t('riversOn')}</div>`;
                if (densitySpotsMode && colorMode === 'density') html += `<div>${t('spotsOn')}</div>`;
                if (capitalsVisible) html += `<div>${t('capitalsOn')}</div>`;
                if (timezonesVisible) {
                     html += '<div style="font-weight:700;margin-bottom:4px">' + t('timezonesLegend') + '</div>';
                     var tzStops = _pal('timezones').join(',');
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
                if (colorMode === 'terrain' || riversVisible) html += `<div style="margin-top:4px;font-size:0.85em;color:var(--text-secondary)">${t('featureClickHint')}</div>`;
                legendEl.innerHTML = html;
            }

export function setMode(mode) {
                if (colorMode === mode) return;
                const previousMode = colorMode;
                setState('colorMode', mode);
                if (previousMode === 'density' && mode !== 'density' && densitySpotsMode) {
                    setState('densitySpotsMode', false);
                    densitySpotsToggle.classList.remove('toggle-on');
                    densitySpotsToggle.setAttribute('aria-pressed', 'false');
                    if (densityCtx) densityCtx.clearRect(0, 0, densityCanvas.width, densityCanvas.height);
                }
                setActiveByAttr(modeButtons, `.mode-btn[data-mode="${mode}"]`);
                announce(t('modeChangeAnnouncement', { mode: t('mode_' + mode) }));
                requestAnimationFrame(function() { updateAllStyles(); });
                updateCoordinatesDisplay({ clientX: 0, clientY: 0 });
            }

export function toggleSect() {
                 setState('sectMode', !sectMode);
                 sectToggle.classList.toggle('toggle-on', sectMode);
                 sectToggle.setAttribute('aria-pressed', String(sectMode));
                 if (sectMode && colorMode !== 'religion') setMode('religion');
                else updateAllStyles();
                updateActiveLayerCount();
            }

export function toggleRoutes() {
                 setState('corridorsVisible', !corridorsVisible);
                 setState('additionalWaterwaysVisible', corridorsVisible);
                 corridorsToggle.classList.toggle('toggle-on', corridorsVisible);
                 corridorsToggle.setAttribute('aria-pressed', String(corridorsVisible));
                drawRoutes();
                updateLegend();
                updateActiveLayerCount();
            }

export function toggleCorridors() { toggleRoutes(); }

export function toggleAdditionalWaterways() { toggleRoutes(); }

export function toggleDensitySpots() {
                 setState('densitySpotsMode', !densitySpotsMode);
                 densitySpotsToggle.classList.toggle('toggle-on', densitySpotsMode);
                 densitySpotsToggle.setAttribute('aria-pressed', String(densitySpotsMode));
                if (densitySpotsMode && colorMode !== 'density') {
                    setMode('density');
                } else {
                    drawPointLayersCanvas();
                    updateLegend();
                }
                updateActiveLayerCount();
            }

export function toggleCapitals() { toggleLayer('capitals'); }

export function toggleTimezones() {
                var turningOn = !timezonesVisible;
                toggleLayer('timezones');
                if (turningOn) {
                    if (!timezoneData && !timezoneDataLoading) showDataLayerLoading('timezones');
                    ensureTimezoneDataLoaded().then(function() {
                        hideDataLayerLoading('timezones');
                        if (timezonesVisible) drawTimezones(true);
                    });
                }
            }

export function toggleMajorCities() { toggleLayer('majorCities'); }

export function toggleCoords() {
                 setState('coordsVisible', !coordsVisible);
                 if (coordsToggle) {
                     coordsToggle.classList.toggle('toggle-on', coordsVisible);
                     coordsToggle.setAttribute('aria-pressed', String(coordsVisible));
                 }
                var cd = document.getElementById('coordinatesDisplay');
                if (cd) cd.classList.toggle('hidden', !coordsVisible);
                updateActiveLayerCount();
                 updateHash();
            }

// ── Colorblind mode toggle ─────────────────────────────────────────
// Switch all map palettes to colorblind-safe colors + patterns and refresh
// every layer. Persisted to localStorage + URL hash.
export function toggleColorblindMode() {
                setState('colorblindMode', !colorblindMode);
                try { localStorage.setItem('cbMode', colorblindMode ? '1' : '0'); } catch (e) {}
                var btn = document.getElementById('colorblindToggleBtn');
                if (btn) {
                    btn.classList.toggle('toggle-on', colorblindMode);
                    btn.setAttribute('aria-pressed', String(colorblindMode));
                }
                // Rebuild pattern defs for the active categorical set (religion vs sect)
                clearCBPatterns();
                // Refresh all fills, redraw layers, update legend + hash
                updateAllStyles();
            }

export function getActiveProjection() {
                return globeModeActive && globeProjection ? globeProjection : projection;
            }

export function rebuildPathGen() {
                setState('pathGen', d3.geoPath(getActiveProjection()));
                pathGen.pointRadius(isMobile ? 1.5 : 3);
            }

export function isPointVisibleOnGlobe(lonLat) {
                if (!globeModeActive) return true;
                var rotation = globeProjection.rotate();
                var center = [-rotation[0], -rotation[1]];
                var distance = d3.geoDistance(lonLat, center);
                return distance < Math.PI / 2;
            }

export function getQuestionTargetCoords(q) {
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

export function getCustomQuestionTargetCoords(cq) {
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

export function rotateGlobeToReveal(lonLat, duration, onComplete) {
                if (!globeModeActive || !globeProjection || !lonLat) { if (onComplete) onComplete(); return; }
                var targetRotation = [-lonLat[0], -lonLat[1] * 0.6];
                var current = globeProjection.rotate();
                if (isPointVisibleOnGlobe(lonLat) && d3.geoDistance(lonLat, [-current[0], -current[1]]) < Math.PI / 3) {
                    if (onComplete) onComplete();
                    return;
                }
                if (prefersReducedMotion()) {
                    setState('globeRotation', targetRotation);
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
                    setState('globeRotation', interpolateRotation(eased));
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

export function initGlobeProjection() {
                var dims = getContainerDimensions();
                var size = Math.min(dims.width, dims.height);
                setState('globeProjection', d3.geoOrthographic()
                    .scale(size * 0.42)
                    .translate([dims.width / 2, dims.height / 2])
                    .rotate(globeRotation)
                    .clipAngle(90));
            }

export function ensureGlobeSvgDefs() {
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

export function drawGlobeFrame(isDragging) {
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
                gCountries.selectAll('path')
                    .attr('d', pathGen)
                    .attr('fill', isDragging ? 'var(--panel-bg, #3a4a5c)' : function(d) { return getCountryFill(d); })
                    .attr('stroke', isDragging ? 'rgba(255,255,255,0.5)' : function(d) { return getStroke(d); })
                    .attr('stroke-width', isDragging ? 0.6 : function(d) { return getStrokeWidth(d); })
                    .attr('opacity', isDragging ? 0.9 : function(d) { return getOpacity(d); });

                if (!isDragging) {
                    if (countryLabelSelection) { countryLabelSelection.remove(); setState('countryLabelSelection', null); }
                    syncCountryGlow();
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
                } else if (gTimezones && timezonesVisible) {
                    gTimezones.selectAll('*').remove();
                }
            }

export function requestGlobeRedraw() {
                if (globeRedrawPending) return;
                setState('globeRedrawPending', true);
                requestAnimationFrame(function() {
                    setState('globeRedrawPending', false);
                    drawGlobeFrame(true);
                });
            }

export function fullGlobeRedraw() {
                drawGlobeFrame(false);
            }

export function toggleGlobeMode() {
                resetLayersAndModes();
                setState('_adminBakeDirty', true);
                setState('globeModeActive', !globeModeActive);
                if (globeViewBtn) globeViewBtn.classList.toggle('toggle-on', globeModeActive);

                if (globeModeActive) {
                    var quizBtnEl = document.getElementById('quizBtn');
                    if (quizBtnEl) { quizBtnEl.disabled = true; quizBtnEl.classList.add('quiz-disabled'); quizBtnEl.title = t('quizUnavailableOnGlobe'); }
                    clearMeasurement();
                    if (annotateActive) toggleAnnotationMode();
                    clearAnnotationsView();
                    var lbl = document.getElementById('headerProjectionLabel');
                    if (lbl) { lbl.setAttribute('data-i18n', 'globeProjectionType'); lbl.textContent = t('globeProjectionType'); }
                    initGlobeProjection();
                    ensureGlobeSvgDefs();
                    setState('projection', globeProjection);
                    rebuildPathGen();
                    setState('currentTransform', d3.zoomIdentity);
                    applyMapTransform(d3.zoomIdentity);
                    svg.on('.zoom', null);
                    if (globeDrag) svg.call(globeDrag); else {
                        setState('globeDrag', d3.drag()
                            .on('start', function() { setState('globeDragging', true); })
                            .on('drag', function(e) {
                                var rotateSpeed = 0.25;
                                globeRotation[0] += e.dx * rotateSpeed;
                                globeRotation[1] = Math.max(-90, Math.min(90, globeRotation[1] - e.dy * rotateSpeed));
                                globeProjection.rotate(globeRotation);
                                requestGlobeRedraw();
                            })
                            .on('end', function() { setState('globeDragging', false); fullGlobeRedraw(); }));
                        svg.call(globeDrag);
                    }
                    gGraticule.selectAll('*').remove();
                    gCountries.selectAll('*').remove();
                    if (countryLabelSelection) { countryLabelSelection.remove(); setState('countryLabelSelection', null); }
                    if (allCountryFeatures && allCountryFeatures.length) {
                         setState('countryPaths', gCountries.selectAll('path')
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
                             .attr('aria-label', function(d) { return getDisplayName(d.properties?.name || ''); })
                             .on('click', handleCountryActivate)
                             .on('keydown', function(e, d) {
                                 if (e.key === 'Enter' || e.key === ' ') {
                                     e.preventDefault();
                                     handleCountryActivate(e, d);
                                 }
                             }));
                     }
                     if (measurePoints.length > 0) { if (!gMeasure) setState('gMeasure', gMap.append('g').attr('class', 'measure-layer')); redrawMeasureLayer(); }
                    syncCountryGlow();
                    fullGlobeRedraw();
                } else {
                    var quizBtnEl2 = document.getElementById('quizBtn');
                    if (quizBtnEl2) { quizBtnEl2.disabled = false; quizBtnEl2.classList.remove('quiz-disabled'); quizBtnEl2.removeAttribute('title'); }
                    clearMeasurement();
                    var lbl = document.getElementById('headerProjectionLabel');
                    if (lbl) { lbl.setAttribute('data-i18n', 'headerProjectionType'); lbl.textContent = t('headerProjectionType'); }
                    svg.on('.drag', null);
                    if (zoomBehavior) svg.call(zoomBehavior);
                    var dims = getContainerDimensions();
                    setState('projection', setupProjection(dims.width, dims.height));
                    rebuildPathGen();
                    gOcean.selectAll('*').remove();
                    gOcean.append('rect')
                        .attr('x', -500).attr('y', -500)
                        .attr('width', dims.width + 1000).attr('height', dims.height + 1000)
                        .attr('fill', 'url(#oceanGradient)');
                    gGraticule.selectAll('*').remove();
                    drawGraticule();
                    if (allCountryFeatures && allCountryFeatures.length) {
                        gCountries.selectAll('*').remove();
                        setState('countryPaths', gCountries.selectAll('path')
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
                            .attr('aria-label', function(d) { return getDisplayName(d.properties?.name || ''); }));
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
                         }).on('click', handleCountryActivate)
                         .on('keydown', function(e, d) {
                             if (e.key === 'Enter' || e.key === ' ') {
                                 e.preventDefault();
                                 handleCountryActivate(e, d);
                             }
                         });
                    }
                    if (countryLabelSelection) { countryLabelSelection.remove(); setState('countryLabelSelection', null); }
                    drawCountryLabels(allCountryFeatures);
                    syncCountryGlow();
                    redrawAnnotations();
                    updateHashDebounced();
                }
            }
