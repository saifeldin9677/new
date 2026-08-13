import { MAP_COLORS, additionalWaterwaysData, borderDisputesData, capitalsRussian, capitalsSpanish, capitalsUzbek, continentArabic, continentRussian, continentSpanish, continentUzbek, corridorsData, countryInfo, denominationArabic, denominationRussian, denominationSpanish, denominationUzbek, densitySpotEnglish, densitySpotRussian, densitySpotSpanish, densitySpotUzbek, densitySpots, desertsForestsData, earthquakesData, ethnicGroupsData, featureRussian, featureSpanish, featureUzbek, geopoliticalBlocsData, governmentArabic, governmentRussian, governmentSpanish, governmentUzbek, langsRussian, langsSpanish, langsUzbek, majorCitiesData, mountainRanges, naturalResourcesData, oceanCurrentsData, religionArabic, religionRussian, religionSpanish, religionUzbek, rivers, tectonicPlatesData, timezoneOffsets, volcanoesData, windsData } from './data.js';
import { MOBILE_BREAKPOINT, _frozenCitySize, _isZooming, _lastPanelRenderTime, _pendingTooltipEvent, _tooltipRAFPending, _tooltipSize, additionalWaterwaysVisible, allCountryFeatures, annotateActive, annotateColor, annotateFontSize, annotateKind, annotatePoints, annotationsList, announce, applyTheme, borderDisputesVisible, capitalsVisible, colorMode, colorblindMode, compareCountriesG, compareCountry, compareG, compareInitialized, compareProjectionType, compareSvg, compareZoomBehavior, controlsBar, coordinatesDisplay, coordsVisible, copyNotification, corridorsVisible, countryLabelSelection, countryNamesList, countryPanel, countryPaths, currentReligionFilter, currentSessionCode, currentStudentName, currentTransform, debounce, densitySpotsMode, desertsForestsVisible, earthquakesVisible, ethnicGroupsVisible, gAdminBoundaries, gAnnotations, gAuthoringMarkers, gBorderDisputes, gCapitals, gCorridors, gCountries, gCountryGlow, gCountryLabels, gDesertsForests, gEarthquakes, gEthnicGroups, gGeopoliticalBlocs, gGraticule, gMajorCities, gMap, gMeasure, gNaturalResources, gOcean, gOceanCurrents, gPhysical, gQuizMarkers, gTemperature, gTimezones, gVolcanoes, gWinds, geopoliticalBlocsVisible, getMapRect, globeModeActive, globeProjection, highlightTimeout, infoOverlay, initDensityCanvas, isMobile, lang, lastQuizResults, legendEl, majorCitiesVisible, mapContainer, measureActive, measureFinalized, measureGeodesic, measureKind, measurePoints, menuToggle, naturalResourcesVisible, oceanCurrentsVisible, onWindowResize, onboardingHint, panelContent, pathGen, prefersReducedMotion, presentationModeActive, projection, quizActive, religionButtons, riversVisible, searchInput, sectMode, selectedBloc, selectedCountry, setActiveByAttr, setState, showLabels, suggestionsList, svg, svgEl, timezonesVisible, tooltip, volcanoesVisible, windsVisible, zoomBehavior } from './state.js';
import { applyLanguage, fmtNum, getCleanName, getDenomination, getDisplayName, getReligion, htmlEscape, setLanguage, t } from './i18n.js';
import { LAYER_DEFS, _adminSeamSplitGeometries, closeFeatureDetail, drawBorderDisputes, drawCapitals, drawCorridors, drawCountryLabels, drawDesertsForests, drawEarthquakes, drawGeopoliticalBlocs, drawMajorCities, drawOceanCurrents, drawPhysicalFeatures, drawPointLayersCanvas, drawRoutes, drawTimezones, drawVolcanoes, drawWinds, fullGlobeRedraw, getActiveProjection, getContinent, getCountryFill, getCountryFilterAttr, getCountryInfo, getDensity, getElevation, getGDP, getGovernment, getHDI, getOpacity, getPrecipitation, getStroke, getStrokeWidth, getTemperature, highlightSelectedCountry, initGlobeProjection, isPointVisibleOnGlobe, rebuildPathGen, scheduleAdminBoundariesRedraw, setMode, showCityDetail, toggleBorderDisputes, toggleCapitals, toggleColorblindMode, toggleCoords, toggleCorridors, toggleDensitySpots, toggleDesertsForests, toggleEarthquakes, toggleEthnicGroups, toggleGeopoliticalBlocs, toggleGlobeMode, toggleLabels, toggleLayerByName, toggleMajorCities, toggleNaturalResources, toggleOceanCurrents, toggleRivers, toggleSect, toggleTimezones, toggleVolcanoes, toggleWinds, updateActiveLayerCount, updateLabels, updateLegend } from './layers.js';
import { initQuiz, measureResultLabel } from './quiz.js';
import { setupKeyboard, showToast, _a11yRestoreFocus, _a11yFocusFirstInDialog, _a11yHideBackground, _a11yRestoreBackground, _setA11yDialogTrigger } from './ui.js';

// Module: map-core
// Extracted from app.js by scripts/split-modules.js


            // ── D3 projection & SVG setup ──

export function getContainerDimensions() {
                const r = mapContainer.getBoundingClientRect();
                return { width: r.width, height: r.height };
            }

export function setupProjection(w, h) {
                const precision = isMobile ? 0.8 : 0.3;
                return d3.geoPolyhedralWaterman().scale(Math.min(w, h) * 0.38).translate([w / 2, h / 2]).rotate([0, 0])
                    .precision(precision);
            }

export function createSvg() {
                const { width, height } = getContainerDimensions();
                svgEl.setAttribute('viewBox', `0 0 ${width} ${height}`);
                svgEl.setAttribute('width', width);
                svgEl.setAttribute('height', height);
                setState('svg', d3.select(svgEl));
                svg.selectAll('*').remove();

                const defs = svg.append('defs');
                defs.append('radialGradient')
                    .attr('id', 'oceanGradient')
                    .attr('cx', '50%').attr('cy', '50%').attr('r', '70%')
                    .selectAll('stop')
                    .data(MAP_COLORS.oceanGradient.map(function(c, i) {
                        return { offset: ['0%','30%','60%','100%'][i], color: c };
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

                setState('gOcean', svg.append('g'));
                gOcean.append('rect')
                    .attr('x', -500).attr('y', -500)
                    .attr('width', width + 1000).attr('height', height + 1000)
                    .attr('fill', 'url(#oceanGradient)');

                setState('gGraticule', svg.append('g'));
                setState('gCountries', svg.append('g'));
                setState('gCountryGlow', svg.append('g').attr('class', 'country-glow-layer'));
                setState('gCountryLabels', svg.append('g'));
                setState('gPhysical', svg.append('g'));
                setState('gCorridors', svg.append('g'));
                setState('gTemperature', svg.append('g'));
                setState('gCapitals', svg.append('g'));
                setState('gTimezones', svg.append('g'));
                setState('gMajorCities', svg.append('g'));
                setState('gNaturalResources', svg.append('g'));
                setState('gEthnicGroups', svg.append('g'));
                setState('gOceanCurrents', svg.append('g'));
                setState('gWinds', svg.append('g'));
                setState('gEarthquakes', svg.append('g'));
                setState('gVolcanoes', svg.append('g'));
                setState('gGeopoliticalBlocs', svg.append('g'));
                setState('gDesertsForests', svg.append('g'));
                setState('gBorderDisputes', svg.append('g'));
                setState('gAdminBoundaries', svg.append('g'));
                setState('gAuthoringMarkers', svg.append('g'));
                setState('gQuizMarkers', svg.append('g'));

                setState('gMap', svg.append('g').attr('class', 'map-transform-group'));
                [gOcean, gGraticule, gCountries, gCountryGlow, gAdminBoundaries, gCountryLabels, gPhysical, gCorridors, gTemperature, gCapitals, gTimezones, gMajorCities, gNaturalResources, gEthnicGroups, gOceanCurrents, gWinds, gEarthquakes, gVolcanoes, gGeopoliticalBlocs, gDesertsForests, gBorderDisputes, gAuthoringMarkers, gQuizMarkers]
                    .forEach(g => gMap.append(() => g.node()));

                setState('projection', setupProjection(width, height));
                setState('pathGen', d3.geoPath(projection));
                pathGen.pointRadius(isMobile ? 1.5 : 3);
            }

export function smoothedLinePath(coords) {
                var proj = getActiveProjection();
                var projected = coords.map(function(c) { return proj(c); }).filter(function(p) { return p && !isNaN(p[0]); });
                if (projected.length < 2) return '';
                var lineGen = d3.line().x(function(p){return p[0];}).y(function(p){return p[1];}).curve(d3.curveCatmullRom.alpha(0.5));
                return lineGen(projected);
            }

export function drawGraticule() {
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

export let _coordsRAFPending = false;

export let _pendingMouseEvent = null;

export function _flushTooltipPosition() {
                setState('_tooltipRAFPending', false);
                if (!_pendingTooltipEvent) return;
                const e = _pendingTooltipEvent;
                setState('_pendingTooltipEvent', null);
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

export function _flushCoords() {
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

export function updateCoordinatesDisplay(event) {
                _pendingMouseEvent = event;
                if (_coordsRAFPending) return;
                _coordsRAFPending = true;
                requestAnimationFrame(_flushCoords);
            }

export function updateInfoOverlay() {
                infoOverlay.textContent = t('infoOverlay', { zoom: currentTransform.k.toFixed(1) });
            }

export function resetZoom() {
                svg.transition().duration(prefersReducedMotion() ? 0 : 600).ease(d3.easeCubicInOut).call(zoomBehavior.transform, d3.zoomIdentity);
            }

export function positionSuggestionsList() {
                var rect = searchInput.getBoundingClientRect();
                suggestionsList.style.position = 'fixed';
                suggestionsList.style.top = rect.bottom + 'px';
                suggestionsList.style.left = rect.left + 'px';
                suggestionsList.style.width = rect.width + 'px';
                suggestionsList.style.right = 'auto';
            }

export function setupSearch() {
                let activeIdx = -1;
                function closeSuggestions() {
                    suggestionsList.style.display = 'none';
                    searchInput.setAttribute('aria-expanded', 'false');
                    activeIdx = -1;
                    searchInput.removeAttribute('aria-activedescendant');
                }
                function setActive(idx) {
                    const options = suggestionsList.querySelectorAll('[role="option"]');
                    activeIdx = idx;
                    options.forEach(function(opt, i) {
                        opt.classList.toggle('active', i === idx);
                        opt.setAttribute('aria-selected', i === idx ? 'true' : 'false');
                    });
                    if (idx >= 0 && options[idx]) {
                        searchInput.setAttribute('aria-activedescendant', options[idx].id);
                        options[idx].scrollIntoView({ block: 'nearest' });
                    } else {
                        searchInput.removeAttribute('aria-activedescendant');
                    }
                }
                searchInput.addEventListener('input', function() {
                    const val = this.value.trim().toLowerCase();
                    suggestionsList.innerHTML = '';
                    activeIdx = -1;
                    if (!val) { closeSuggestions(); return; }
                    const matches = countryNamesList.filter(n => {
                        const localized = getDisplayName(n).toLowerCase();
                        return n.toLowerCase().includes(val) || localized.includes(val);
                    }).slice(0, isMobile ? 6 : 8);
                    if (matches.length) {
                        matches.forEach(function(m, idx) {
                            const li = document.createElement('li');
                            li.id = 'searchOpt-' + idx;
                            li.setAttribute('role', 'option');
                            li.setAttribute('aria-selected', 'false');
                            li.setAttribute('data-name', m);
                            const flag = getCountryFlag(m);
                            const span = document.createElement('span');
                            span.className = 'flag-icon';
                            span.setAttribute('aria-hidden', 'true');
                            span.textContent = flag;
                            li.appendChild(span);
                            li.appendChild(document.createTextNode(' ' + getDisplayName(m)));

                            // دالة موحّدة للتنفيذ
                            const doSelect = (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                searchInput.value = '';
                                closeSuggestions();
                                searchInput.blur();
                                flyToCountry(m);
                            };

                            // mousedown: يُطلق قبل blur على الحاسوب فلا تختفي القائمة قبل الأوان
                            li.addEventListener('mousedown', doSelect);
                            // touchend: أكثر موثوقية من click على الهاتف
                            li.addEventListener('touchend', doSelect, { passive: false });
                            // mouse hover also moves keyboard highlight (keeps both in sync)
                            li.addEventListener('mousemove', function() { if (activeIdx !== idx) setActive(idx); });

                            suggestionsList.appendChild(li);
                        });
                        positionSuggestionsList();
                        suggestionsList.style.display = 'block';
                        searchInput.setAttribute('aria-expanded', 'true');
                    } else {
                        closeSuggestions();
                    }
                });
                searchInput.addEventListener('keydown', function(e) {
                    const options = suggestionsList.querySelectorAll('[role="option"]');
                    if (!options.length) {
                        if (e.key === 'Escape') closeSuggestions();
                        return;
                    }
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setActive(activeIdx + 1 >= options.length ? 0 : activeIdx + 1);
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        setActive(activeIdx <= 0 ? options.length - 1 : activeIdx - 1);
                    } else if (e.key === 'Enter' && activeIdx >= 0) {
                        e.preventDefault();
                        const sel = options[activeIdx];
                        const name = sel.getAttribute('data-name') || sel.textContent.trim();
                        closeSuggestions();
                        searchInput.value = '';
                        searchInput.blur();
                        flyToCountry(name);
                    } else if (e.key === 'Escape') {
                        closeSuggestions();
                    } else if (e.key === 'Tab') {
                        closeSuggestions();
                    }
                });
                searchInput.addEventListener('blur', () => setTimeout(closeSuggestions, 200));
                onWindowResize(() => {
                    if (suggestionsList.style.display === 'block') positionSuggestionsList();
                });
            }

export function getCountryFlag(name) {
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

export function flyToCountry(name) {
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

export function highlightCountry(feature) {
                if (!feature || !countryPaths) return;
                countryPaths.classed('highlighted-country', false);
                const path = countryPaths.filter(d => d === feature);
                path.classed('highlighted-country', true);
                syncCountryGlow();
                if (highlightTimeout) clearTimeout(highlightTimeout);
                setState('highlightTimeout', setTimeout(() => {
                    countryPaths.classed('highlighted-country', false);
                    syncCountryGlow();
                }, 3000));
            }

export function syncCountryGlow() {
                if (!gCountryGlow || !countryPaths) return;
                gCountryGlow.selectAll('*').remove();
                const highlighted = countryPaths.filter('.highlighted-country');
                if (highlighted.empty()) return;
                const node = highlighted.node();
                const dAttr = node ? node.getAttribute('d') : null;
                if (!dAttr) return;
                gCountryGlow.append('path')
                    .attr('d', dAttr)
                    .attr('fill', 'none')
                    .attr('stroke', '#ffd700')
                    .attr('stroke-width', isMobile ? 7 : 9)
                    .attr('stroke-opacity', 0.35)
                    .attr('vector-effect', 'non-scaling-stroke')
                    .attr('stroke-linecap', 'round')
                    .attr('stroke-linejoin', 'round')
                    .attr('pointer-events', 'none');
            }

export function openCountryPanel(d) {
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
                 countryPanel.setAttribute('aria-hidden', 'false');
                 // Announce the opened country to screen readers
                 try {
                     var _nm = (d && d.properties) ? (getDisplayName(d.properties.name || '') || d.properties.name) : '';
                     if (_nm) announce(t('countrySelectedAnnouncement', { name: _nm }));
                 } catch (e) {}
                 // Trigger CSS transition after display:block
                 requestAnimationFrame(() => {
                     requestAnimationFrame(() => {
                         countryPanel.classList.add('visible');
                         updateHash();
                     });
                 });
             }

export function closeCountryPanel() {
                 countryPanel.classList.remove('visible');
                 countryPanel.setAttribute('aria-hidden', 'true');
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
                 setState('selectedCountry', null);
                 setState('compareCountry', null);
                 highlightSelectedCountry(null);
                 closeFeatureDetail();
                 updateHash();
             }

export function renderCountryPanel(d) {
                setState('_lastPanelRenderTime', performance.now());
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
                let html = `<h2>${flagEmoji} ${displayName}</h2>`;
                html += `<p><strong>${t('continent')}:</strong> ${continentLabel}</p>`;
                html += `<p><strong>${t('government')}:</strong> ${govLabel}</p>`;
                html += `<p><strong>${t('capital')}:</strong> ${capital}</p>`;
                html +=
                    `<p><strong>${t('areaTitle')}:</strong> ${area ? fmtNum(area) : t('unknown')} ${t('km2')}</p>`;
                html +=
                    `<p><strong>${t('densityTitle')}:</strong> ${density !== null ? density + ' ' + t('densityUnit') : t('unknown')}</p>`;
                html +=
                    `<p><strong>${t('populationTitle')}:</strong> ${population ? '~' + population + ' ' + t('million') : t('unknown')}</p>`;
                html += `<p><strong>${t('languageTitle')}:</strong> ${language}</p>`;
                html += `<p><strong>🕒 ${t('localTime')}:</strong> ${localTimeStr}</p>`;
                const gdpVal = getGDP(name);
                if (gdpVal !== null) html += `<p><strong>💰 ${t('tooltipGDP')}:</strong> $${fmtNum(gdpVal)}</p>`;
                const hdiVal = getHDI(name);
                if (hdiVal !== null) html += `<p><strong>📊 ${t('tooltipHDI')}:</strong> ${hdiVal.toFixed(3)}</p>`;
                const tzLabel = timezoneOffsets[name] || timezoneOffsets[cleanName];
                if (tzLabel) html += `<p><strong>🕐 ${t('timezone')}:</strong> ${tzLabel}</p>`;

                html += `<br><button class="btn" id="compareBtn" title="${t('compareWith')}">📊 ${t('compareTitle')}</button>`;
                 panelContent.innerHTML = html;
                 countryPanel.style.display = 'block';
                 countryPanel.setAttribute('aria-hidden', 'false');

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
                            setState('compareCountry', feature);
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

export function renderComparePanel(d1, d2) {
                setState('_lastPanelRenderTime', performance.now());
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
                let html = '<h2>📊 ' + e(t('compareTitle')) + ' ' + e(displayName1) + ' ↔ ' + e(displayName2) + '</h2>';
                html += '<table style="width:100%;font-size:0.85em;text-align:center;border-collapse:collapse;">';
                html += '<tr><th style="padding:4px;"></th><th style="padding:4px;">' + e(displayName1) + '</th><th style="padding:4px;">' + e(displayName2) + '</th></tr>';

                const bar1Area = area1 ? (area1 / maxArea * 100) : 0;
                const bar2Area = area2 ? (area2 / maxArea * 100) : 0;
                html += '<tr><td style="padding:4px;">' + e(t('areaTitle')) + '</td>' +
                    '<td style="padding:4px;">' + (area1 ? e(fmtNum(area1)) + ' km²' : '?') + '<br><span class="compare-bar" style="width:' + bar1Area + '%;background:#42a5f5;"></span></td>' +
                    '<td style="padding:4px;">' + (area2 ? e(fmtNum(area2)) + ' km²' : '?') + '<br><span class="compare-bar" style="width:' + bar2Area + '%;background:#42a5f5;"></span></td></tr>';

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
                    '<td style="padding:4px;">' + (gdp1 !== null ? '$' + e(fmtNum(gdp1)) : '?') + '</td>' +
                    '<td style="padding:4px;">' + (gdp2 !== null ? '$' + e(fmtNum(gdp2)) : '?') + '</td></tr>';
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
                 countryPanel.setAttribute('aria-hidden', 'false');
                 requestAnimationFrame(() => requestAnimationFrame(() => countryPanel.classList.add('visible')));

                document.getElementById('closeCompareBtn')?.addEventListener('click', () => {
                    setState('compareCountry', null);
                    if (selectedCountry) { renderCountryPanel(selectedCountry); requestAnimationFrame(() => requestAnimationFrame(() => countryPanel.classList.add('visible'))); }
                });
            }

export function applyMapTransform(t) {
                // Use SVG transform attribute (not CSS transform).
                // CSS transform on a will-change element creates a separate GPU
                // compositor layer that can exceed mobile texture memory limits,
                // causing black flickering when the layer is dropped/recreated.
                // SVG native transform renders at display resolution without an
                // oversized intermediate GPU layer — more stable on mobile.
                gMap.attr('transform', t.toString());
            }

export function fastUpdateLabels(el, circles, k, r, fs, offX, offY) {
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

export function updateOverlayPositions() {
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

export function setupZoom() {
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

                setState('zoomBehavior', d3.zoom().scaleExtent([0.5, 24]).translateExtent([
                    [-width * 2, -height * 2],
                    [width * 3, height * 3]
                ]).on('zoom', function(e) {
                    if (!_isZooming) {
                        setState('_isZooming', true);
                        gMap.classed('zooming-active', true);
                    }
                    setState('currentTransform', e.transform);
                    applyMapTransform(currentTransform);
                    updateInfoOverlay();
                    updateHashDebounced();
                    schedulePointLayersRedraw();
                    scheduleAdminBoundariesRedraw();
                }).on('end', function() {
                    clearTimeout(_zoomEndTimeout);
                    _zoomEndTimeout = setTimeout(function() {
                        setState('_isZooming', false);
                        gMap.classed('zooming-active', false);
                        updateOverlayPositions();
                        updateLabels();
                        drawPointLayersCanvas();
                        setState('_adminBakeDirty', true);
                        scheduleAdminBoundariesRedraw();
                        var _pendingLayers = [
                            [corridorsVisible || additionalWaterwaysVisible, function() { drawRoutes(true); }],
                            [borderDisputesVisible, function() { drawBorderDisputes(true); }],
                            [desertsForestsVisible, function() { drawDesertsForests(true); }],
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
                }));
                svg.call(zoomBehavior);
                svg.on('dblclick.zoom', null);

                // Keyboard pan/zoom for the map canvas (WCAG 2.1.1 / 2.1.2):
                // arrow keys pan, +/− zoom, Home resets. Active when the map
                // container or a country path receives focus via keyboard.
                mapContainer.addEventListener('keydown', function(e) {
                    // Freehand/arrow stroke controls: Enter finalizes, Escape
                    // cancels — but only while the map itself has focus, so
                    // keyboard users can still activate toolbar buttons.
                    var mapFocused = document.activeElement === mapContainer || document.activeElement === document.getElementById('mapSvg') || document.activeElement === document.body || document.activeElement === null;
                    if (_annotStrokeIsDrawKind() && mapFocused) {
                        if (e.key === 'Enter') { e.preventDefault(); finishAnnotationTool(); return; }
                        if (e.key === 'Escape') { e.preventDefault(); cancelAnnotationStroke(); return; }
                    }
                    _panSpaceHeld = (e.key === ' ' || e.key === 'Spacebar');
                    if (!_panSpaceHeld && _annotStrokeIsDrawKind() && !_annotStrokeActive && _annotStrokePoints && _annotStrokePoints.length && (e.key === 'Delete' || e.key === 'Backspace')) {
                        cancelAnnotationStroke();
                        return;
                    }
                    if (globeModeActive || quizActive) return;
                    const step = 80 * (e.shiftKey ? 3 : 1);
                    let handled = false;
                    let dx = 0, dy = 0;
                    if (e.key === 'ArrowLeft')      { dx = step; handled = true; }
                    else if (e.key === 'ArrowRight')  { dx = -step; handled = true; }
                    else if (e.key === 'ArrowUp')     { dy = step; handled = true; }
                    else if (e.key === 'ArrowDown')   { dy = -step; handled = true; }
                    else if (e.key === '+' || e.key === '=' || e.key === 'Add') {
                        handled = true;
                        svg.transition().duration(prefersReducedMotion() ? 0 : 250).call(zoomBehavior.scaleBy, 1.3, [getMapRect().width/2, getMapRect().height/2]);
                    }
                    else if (e.key === '-' || e.key === '_' || e.key === 'Subtract') {
                        handled = true;
                        svg.transition().duration(prefersReducedMotion() ? 0 : 250).call(zoomBehavior.scaleBy, 0.77, [getMapRect().width/2, getMapRect().height/2]);
                    }
                    else if (e.key === 'Home') { handled = true; resetZoom(); }
                    if (handled) {
                        e.preventDefault();
                        if (dx || dy) {
                            const t = currentTransform.translate(dx, dy);
                            svg.transition().duration(prefersReducedMotion() ? 0 : 120).call(zoomBehavior.transform, t);
                        }
                    }
                });
            }

export async function loadWorld() {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 15000);
                try {
                    var basePath = window.location.pathname.replace(/\/[^\/]*$/, '/');
                    const localUrl = basePath + 'countries-110m.json';
                    const response = await fetch(localUrl, { signal: controller.signal });
                    if (!response.ok) throw new Error('HTTP ' + response.status);
                    const data = await response.json();
                    return topojson.feature(data, data.objects.countries).features;
                } finally {
                    clearTimeout(timeout);
                }
            }

export function haversineDistanceKm(coord1, coord2) {
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

export function projectedScaleKmPerUnit(proj, center) {
                    if (!center || isNaN(center[0]) || isNaN(center[1])) return 0;
                    var p0 = proj(center);
                    var p1 = proj([center[0] + 0.001, center[1]]);
                    if (!p0 || !p1 || isNaN(p0[0]) || isNaN(p0[1]) || isNaN(p1[0]) || isNaN(p1[1])) return 0;
                    var dProj = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
                    if (dProj === 0) return 0;
                    return haversineDistanceKm(center, [center[0] + 0.001, center[1]]) / dProj;
                }

export function planarDistanceKm(p1, p2, proj) {
                    var xy1 = proj(p1), xy2 = proj(p2);
                    if (!xy1 || !xy2 || isNaN(xy1[0]) || isNaN(xy2[0])) return NaN;
                    var mid = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
                    var scale = projectedScaleKmPerUnit(proj, mid);
                    if (scale === 0) return NaN;
                    return Math.hypot(xy2[0] - xy1[0], xy2[1] - xy1[1]) * scale;
                }

export function geodesicPolygonAreaKm2(points) {
                    if (points.length < 3) return 0;
                    var R = 6371;
                    var toRad = function(d) { return d * Math.PI / 180; };
                    var sum = 0;
                    for (var i = 0; i < points.length; i++) {
                        var p1 = points[i];
                        var p2 = points[(i + 1) % points.length];
                        sum += (toRad(p2[0]) - toRad(p1[0])) * (2 + Math.sin(toRad(p1[1])) + Math.sin(toRad(p2[1])));
                    }
                    return Math.abs(sum) * R * R / 2;
                }

export function planarPolygonAreaKm2(points, proj) {
                    if (points.length < 3) return 0;
                    var xy = points.map(function(p) { return proj(p); });
                    if (xy.some(function(v) { return !v || isNaN(v[0]) || isNaN(v[1]); })) return NaN;
                    var sum = 0;
                    for (var i = 0; i < xy.length; i++) {
                        var a = xy[i], b = xy[(i + 1) % xy.length];
                        sum += a[0] * b[1] - b[0] * a[1];
                    }
                    var mid = [0, 0];
                    points.forEach(function(p) { mid[0] += p[0]; mid[1] += p[1]; });
                    mid[0] /= points.length; mid[1] /= points.length;
                    var scale = projectedScaleKmPerUnit(proj, mid);
                    if (scale === 0) return NaN;
                    return Math.abs(sum) / 2 * scale * scale;
                }

export function measureDistanceKm(p1, p2, proj) {
                    return measureGeodesic ? haversineDistanceKm(p1, p2) : planarDistanceKm(p1, p2, proj);
                }

export function measurePolygonAreaKm2(points, proj) {
                    return measureGeodesic ? geodesicPolygonAreaKm2(points) : planarPolygonAreaKm2(points, proj);
                }

export function clearMeasurement() {
                    setState('measurePoints', []);
                    setState('measureFinalized', false);
                    if (gMeasure) gMeasure.selectAll('*').remove();
                    measureResultLabel.style.display = 'none';
                    var finishBtn = document.getElementById('measureFinishBtn');
                    if (finishBtn) finishBtn.style.display = 'none';
                }

export function setMeasureToolbarActive() {
                    var kd = document.getElementById('measureKindDist');
                    var ka = document.getElementById('measureKindArea');
                    var gb = document.getElementById('measureGeodesicBtn');
                    var pb = document.getElementById('measurePlanarBtn');
                    if (kd) kd.classList.toggle('toggle-on', measureKind === 'distance');
                    if (ka) ka.classList.toggle('toggle-on', measureKind === 'area');
                    if (gb) gb.classList.toggle('toggle-on', measureGeodesic);
                    if (pb) pb.classList.toggle('toggle-on', !measureGeodesic);
                }

export function toggleMeasureKind(kind) {
                    if (!measureActive) return;
                    if (measureKind === kind) return;
                    setState('measureKind', kind);
                    setState('measureFinalized', false);
                    clearMeasurement();
                    setMeasureToolbarActive();
                }

export function toggleMeasureCalcMode() {
                    if (!measureActive) return;
                    setState('measureGeodesic', !measureGeodesic);
                    setState('measureFinalized', false);
                    clearMeasurement();
                    setMeasureToolbarActive();
                }

export function toggleMeasureMode() {
                    setState('measureActive', !measureActive);
                    document.getElementById('measureToolBtn').classList.toggle('toggle-on', measureActive);
                    clearMeasurement();
                    document.body.classList.toggle('measure-active', measureActive);
                    var toolbar = document.getElementById('measureToolbar');
                    if (toolbar) toolbar.style.display = measureActive ? 'flex' : 'none';
                    if (measureActive) {
                        if (annotateActive) toggleAnnotationMode();
                        setMeasureToolbarActive();
                    }
                }

export const ANNOTATIONS_KEY = 'lepidosAnnotations';

export function loadAnnotations() {
                    try {
                        var raw = localStorage.getItem(ANNOTATIONS_KEY);
                        var arr = raw ? JSON.parse(raw) : [];
                        return Array.isArray(arr) ? arr : [];
                    } catch(e) { return []; }
                }

export function saveAnnotations() {
                    try { localStorage.setItem(ANNOTATIONS_KEY, JSON.stringify(annotationsList)); } catch(e) {}
                }

// Splits a projected line into visually-contiguous pieces across the
// Waterman butterfly seams (same mechanism as admin boundaries).
function _projectAnnotationParts(coordsArr, proj) {
                    var jumpPx = Math.min(getMapRect().width, getMapRect().height) * 0.55;
                    var g = { type: 'LineString', coordinates: coordsArr };
                    var splitR = _adminSeamSplitGeometries(g, proj, jumpPx);
                    var pieces = Array.isArray(splitR) ? splitR : [splitR];
                    return pieces.map(function(p) {
                        return p.coordinates.map(function(c) { return proj(c); }).filter(function(pt) { return pt && !isNaN(pt[0]); });
                    }).filter(function(pts) { return pts.length >= 2; });
                }

function _annotationTypeLabel(a) {
                    if (a.type === 'pin') return t('annotationPin');
                    if (a.type === 'region') return t('annotationRegion');
                    if (a.type === 'arrow') return t('annotationArrow');
                    return t('annotationDraw');
                }

export function redrawAnnotations() {
                     if (!gAnnotations) setState('gAnnotations', gMap.append('g').attr('class', 'annotation-layer'));
                     gAnnotations.selectAll('*').remove();
                     var proj = getActiveProjection();
                     var parts = null;
                     var fontScale = annotateFontSize === 'small' ? 0.7 : annotateFontSize === 'large' ? 1.5 : 1;
                     annotationsList.forEach(function(a) {
                         if (a.hidden) return;
                         var col = a.color || '#eab308';
                         if (a.type === 'pin') {
                             var xy = proj(a.coords);
                             if (!xy || isNaN(xy[0])) return;
                             gAnnotations.append('circle').attr('class', 'annotation-pin-circle').attr('cx', xy[0]).attr('cy', xy[1]).attr('r', 6 * fontScale).style('fill', col).style('stroke-width', 1.5 * fontScale);
                             if (a.label) {
                                 gAnnotations.append('text').attr('class', 'annotation-pin-label').attr('x', xy[0] + 9).attr('y', xy[1] + 4).text(a.label);
                             }
                         } else if (a.type === 'region' && Array.isArray(a.coords) && a.coords.length >= 3) {
                             var pts = a.coords.map(function(c) { return proj(c); });
                             if (pts.some(function(p) { return !p || isNaN(p[0]); })) return;
                             var d = 'M' + pts.map(function(p) { return p[0] + ',' + p[1]; }).join('L') + 'Z';
                             gAnnotations.append('path').attr('class', 'annotation-region-poly').attr('d', d).style('stroke', col).style('fill', col + '26').style('stroke-width', 2 * fontScale);
                             if (a.label) {
                                 var cx = 0, cy = 0;
                                 pts.forEach(function(p) { cx += p[0]; cy += p[1]; });
                                 cx /= pts.length; cy /= pts.length;
                                 gAnnotations.append('text').attr('class', 'annotation-pin-label').attr('x', cx).attr('y', cy).attr('text-anchor', 'middle').text(a.label);
                             }
                         } else if (a.type === 'freehand' && Array.isArray(a.coords) && a.coords.length >= 2) {
                             parts = _projectAnnotationParts(a.coords, proj);
                             if (!parts.length) return;
                             var freeLabelPos = null;
                             parts.forEach(function(part) {
                                 var pd = 'M' + part.map(function(p) { return p[0] + ',' + p[1]; }).join('L');
                                 gAnnotations.append('path').attr('class', 'annotation-freehand-path').attr('d', pd).style('stroke', col).style('stroke-width', 2.5 * fontScale);
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
                                 gAnnotations.append('path').attr('class', 'annotation-arrow-line').attr('d', pd).style('stroke', col).style('stroke-width', 2.5 * fontScale);
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
                                 var AL = 13 * fontScale, AW = 6 * fontScale;
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

export function clearAnnotationsView() {
                    if (gAnnotations) gAnnotations.selectAll('*').remove();
                }

export function redrawAnnotationDrawing() {
                    if (!gAnnotations) setState('gAnnotations', gMap.append('g').attr('class', 'annotation-layer'));
                    gAnnotations.selectAll('.annotation-draw-vertex, .annotation-draw-poly').remove();
                    var proj = getActiveProjection();
                    var finishBtn = document.getElementById('annotationFinishBtn');
                    if (finishBtn) finishBtn.style.display = (annotatePoints.length >= 3) ? '' : 'none';
                    var fontScale = annotateFontSize === 'small' ? 0.7 : annotateFontSize === 'large' ? 1.5 : 1;
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
                            gAnnotations.append('path').attr('class', 'annotation-region-poly annotation-draw-poly').attr('d', d).style('stroke', annotateColor).style('fill', annotateColor + '1f').style('stroke-width', 2 * fontScale);
                        }
                    }
                }

// ── Freehand / arrow stroke drawing state ──
var _annotStrokePoints = null;          // lat/lon points of the in-progress stroke
var _annotStrokeActive = false;
var _annotStrokePointerId = null;
var _annotStrokeStartScreen = null;     // [x, y] at pointerdown
var _annotStrokePrevScreen = null;      // [x, y] of last flushed sample
var _annotStrokePathLen = 0;            // accumulated screen distance (px)
var _annotStrokeAccum = null;           // pending client coords awaiting RAF flush
var _annotStrokeRAF = null;
var _annotPreviewEl = null;             // live <path> shown while drawing
var _panSpaceHeld = false;

function _annotStrokeKilometers(pts) {
                    var km = 0;
                    for (var i = 1; i < pts.length; i++) {
                        var r = d3.geoDistance(pts[i - 1], pts[i]);
                        if (isNaN(r)) continue;
                        km += r * 6371;
                    }
                    return Math.round(km);
                }

function _annotClientToLonLat(clientX, clientY) {
                    var rect = getMapRect();
                    var svgPoint = currentTransform.invert([clientX - rect.left, clientY - rect.top]);
                    var coords = getActiveProjection().invert(svgPoint);
                    if (!coords || isNaN(coords[0]) || isNaN(coords[1])) return null;
                    return [coords[0], coords[1]];
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
                    if (!gAnnotations) setState('gAnnotations', gMap.append('g').attr('class', 'annotation-layer'));
                    var proj = getActiveProjection();
                    var finishBtn = document.getElementById('annotationFinishBtn');
                    if (!_annotPreviewEl || !_annotPreviewEl.isConnected) {
                        if (!_annotStrokePoints.length) return;
                        gAnnotations.selectAll('.annotation-draw-poly').remove();
                        _annotPreviewEl = gAnnotations.append('path').attr('class', 'annotation-region-poly annotation-draw-poly').node();
                        _annotPreviewEl.style.stroke = annotateColor;
                        _annotPreviewEl.style.fill = annotateColor + '1f';
                        _annotPreviewEl.style.strokeWidth = (annotateKind === 'region' ? 2 : 2.5) * (annotateFontSize === 'small' ? 0.7 : annotateFontSize === 'large' ? 1.5 : 1);
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
                    if (d) _annotPreviewEl.setAttribute('d', d);
                }

export function clearAnnotationDrawing() {
                    if (_annotStrokeRAF) { cancelAnimationFrame(_annotStrokeRAF); _annotStrokeRAF = null; }
                    _annotStrokeActive = false;
                    _annotStrokePointerId = null;
                    _annotStrokePoints = null;
                    _annotStrokeStartScreen = null;
                    _annotStrokePrevScreen = null;
                    _annotStrokePathLen = 0;
                    _annotStrokeAccum = null;
                    _annotPreviewEl = null;
                    setState('annotatePoints', []);
                    var finishBtn = document.getElementById('annotationFinishBtn');
                    if (finishBtn) finishBtn.style.display = 'none';
                    redrawAnnotations();
                }

export function cancelAnnotationStroke() {
                    if (!_annotStrokeActive && (!_annotStrokePoints || !_annotStrokePoints.length)) return false;
                    clearAnnotationDrawing();
                    announce(t('annotationStrokeCancelled'));
                    return true;
                }

function _annotFinalizeStroke(silent) {
                    if (!_annotStrokePoints || !_annotStrokePoints.length) return;
                    var pts = _annotStrokePoints.filter(function(p) { return p; });
                    var moving = _annotStrokePathLen >= 10;   // ignore accidental taps
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
                     setState('annotatePoints', []);
                     clearAnnotationDrawing();
                     annotationsList.push({
                         id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                         type: isArrow ? 'arrow' : 'freehand',
                         coords: coords,
                         label: '',
                         color: annotateColor,
                         distanceKm: distanceKm,
                         createdAt: Date.now()
                     });
                     saveAnnotations();
                     redrawAnnotations();
                     announce(t('annotationAdded'));
                     if (silent) return;
                     showToast(t('annotationLengthLabel').replace('{km}', fmtNum(distanceKm)));
                 }

export function finishAnnotationTool() {
                    if (!annotateActive) return;
                    if (annotateKind === 'region') { finishAnnotationRegion(); return; }
                    if (annotateKind === 'freehand' || annotateKind === 'arrow') {
                        if (_annotStrokeActive || (_annotStrokePoints && _annotStrokePoints.length >= 2)) _annotFinalizeStroke(false);
                    }
                }

function _annotStrokeIsDrawKind() { return annotateActive && (annotateKind === 'freehand' || annotateKind === 'arrow'); }

export function onAnnotationPointerDown(e) {
                    if (!_annotStrokeIsDrawKind()) return;
                    if (!e.target || !e.target.closest || !e.target.closest('#mapSvg')) return;
                    if (_panSpaceHeld || e.button === 2 || e.button === 1) return;   // spacebar / right / middle → pan passes through
                    if (_annotStrokeActive) {
                        // Second pointer while drawing: cancel the stroke (v1 scope)
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

export function onAnnotationPointerMove(e) {
                    if (!_annotStrokeActive || e.pointerId !== _annotStrokePointerId) return;
                    if (!e.target || !e.target.closest || !e.target.closest('#mapSvg')) { endAnnotationStroke(e); return; }
                    e.preventDefault();
                    e.stopPropagation();
                    _annotStrokeAccum = [e.clientX, e.clientY];
                    if (!_annotStrokeRAF) _annotStrokeRAF = requestAnimationFrame(_annotFlushSamples);
                }

export function onAnnotationPointerUp(e) {
                    if (!_annotStrokeActive || e.pointerId !== _annotStrokePointerId) return;
                    e.preventDefault();
                    e.stopPropagation();
                    endAnnotationStroke(e);
                }

export function endAnnotationStroke(e) {
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

export function setPanSpaceHeld(v) { _panSpaceHeld = v; }

export function finishAnnotationRegion() {
                     if (annotatePoints.length < 3) return;
                     // Place the region immediately — the teacher draws during
                     // interactive explanation and shouldn't be forced to label.
                     var pendingCoords = annotatePoints.slice();
                     setState('annotatePoints', []);
                     annotationsList.push({
                         id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                         type: 'region', coords: pendingCoords, label: '', color: annotateColor, createdAt: Date.now()
                     });
                     saveAnnotations();
                     redrawAnnotations();
                     announce(t('annotationAdded'));
                     showToast(t('annotationAdded'));
                 }

export function handleAnnotationClick(e) {
                     if (!annotateActive) return;
                     if (e.target && e.target.closest && !e.target.closest('#mapSvg')) return;
                     if (e.target && e.target.closest && e.target.closest('.annotation-pin-circle, .annotation-pin-label, .annotation-region-poly')) return;
                     var rect = getMapRect();
                     var clickX = e.clientX - rect.left;
                     var clickY = e.clientY - rect.top;
                     var svgPoint = currentTransform.invert([clickX, clickY]);
                     var coords = getActiveProjection().invert(svgPoint);
                     if (!coords || isNaN(coords[0]) || isNaN(coords[1])) return;
if (annotateKind === 'pin') {
                         // Place the pin immediately — teachers draw during
                         // interactive explanation without forced labeling.
                         annotationsList.push({
                             id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                             type: 'pin', coords: [coords[0], coords[1]],
                             label: '', color: annotateColor, createdAt: Date.now()
                         });
                         saveAnnotations();
                         redrawAnnotations();
                         announce(t('annotationAdded'));
                         showToast(t('annotationAdded'));
                     } else if (annotateKind === 'region') {
                          annotatePoints.push([coords[0], coords[1]]);
                          redrawAnnotationDrawing();
                      }
                  }

export function toggleAnnotationMode() {
                     setState('annotateActive', !annotateActive);
                     var btn = document.getElementById('annotateBtn');
                     if (btn) {
                         btn.classList.toggle('toggle-on', annotateActive);
                         btn.setAttribute('aria-pressed', String(annotateActive));
                     }
                     document.body.classList.toggle('annotate-active', annotateActive);
                     var toolbar = document.getElementById('annotationToolbar');
                     if (toolbar) {
                         toolbar.style.display = annotateActive ? 'flex' : 'none';
                         toolbar.setAttribute('aria-hidden', String(!annotateActive));
                     }
                     if (annotateActive) {
                         // New session: start with a blank annotation canvas.
                         // The previous session stays stored for explicit restore.
                         setState('annotationsList', []);
                         clearAnnotationDrawing();
                         clearAnnotationsView();
                         if (measureActive) toggleMeasureMode();
                         setAnnotationToolbarActive();
                         announce(t('annotationModeOn'));
                         openAnnotationHelpModal();
                     } else {
                         // End of session: keep the drawn markers stored, then
                         // clear the canvas so reopening starts blank.
                         saveAnnotations();
                         setState('annotationsList', []);
                         clearAnnotationDrawing();
                         clearAnnotationsView();
                         announce(t('annotationModeOff'));
                     }
                 }

export function restorePreviousAnnotations() {
                     var saved = loadAnnotations();
                     if (!saved || !saved.length) {
                         announce(t('annotationNoSavedSession'));
                         showToast(t('annotationNoSavedSession'));
                         return;
                     }
                     setState('annotationsList', saved);
                     redrawAnnotations();
                     if (renderAnnotationsModal) renderAnnotationsModal();
                     announce(t('annotationSessionRestored'));
                     showToast(t('annotationSessionRestored'));
                 }

// ── Accessible annotation label dialog ──────────────────────────────────
// Replaces window.prompt() so annotation labels can be entered by keyboard
// and screen readers. Focus is trapped inside the modal; restore on dismiss.
export function openAnnotationLabelDialog(title, defaultValue, onSave, allowEmpty) {
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
                          // Restore focus to the button or element that opened us
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
                      // Backdrop click dismisses
                       modal.addEventListener('click', function(e) { if (e.target === modal.querySelector('.layers-modal-backdrop') || e.target === modal) cleanup(); }, { once: true });
                  }

export function setAnnotationToolbarActive() {
                    var pinBtn = document.getElementById('annotationKindPin');
                    var regionBtn = document.getElementById('annotationKindRegion');
                    var drawBtn = document.getElementById('annotationKindDraw');
                    var arrowBtn = document.getElementById('annotationKindArrow');
                    if (pinBtn) pinBtn.classList.toggle('toggle-on', annotateKind === 'pin');
                    if (regionBtn) regionBtn.classList.toggle('toggle-on', annotateKind === 'region');
                    if (drawBtn) drawBtn.classList.toggle('toggle-on', annotateKind === 'freehand');
                    if (arrowBtn) arrowBtn.classList.toggle('toggle-on', annotateKind === 'arrow');
                    document.querySelectorAll('#annotationToolbar .annotation-color-swatch').forEach(function(s) {
                        s.classList.toggle('toggle-on', s.getAttribute('data-color') === annotateColor);
                    });
                    ['small', 'medium', 'large'].forEach(function(size) {
                        var b = document.getElementById('annotationFont' + size.charAt(0).toUpperCase() + size.slice(1) + 'Btn');
                        if (b) { b.classList.toggle('toggle-on', annotateFontSize === size); b.setAttribute('aria-pressed', String(annotateFontSize === size)); }
                    });
                    if (annotateKind === 'region' && annotatePoints.length > 0) redrawAnnotationDrawing(); else redrawAnnotations();
                }

export function setAnnotationColor(color) {
                    if (!/^#[0-9a-f]{6}$/i.test(color)) return;
                    setState('annotateColor', color);
                    try { localStorage.setItem('annotateColor', color); } catch (e) {}
                    setAnnotationToolbarActive();
                }

export function setAnnotationFontSize(size) {
                    if (['small', 'medium', 'large'].indexOf(size) === -1) return;
                    setState('annotateFontSize', size);
                    try { localStorage.setItem('annotateFontSize', size); } catch (e) {}
                    setAnnotationToolbarActive();
                    redrawAnnotations();
                    if (annotateKind === 'region' && annotatePoints.length > 0) redrawAnnotationDrawing();
                }

export function clearAllAnnotations() {
                    if (!annotationsList.length) { announce(t('annotationModeEmpty')); return; }
                    var msg = t('annotationClearConfirm');
                    if (!window.confirm(msg)) return;
                    setState('annotationsList', []);
                    saveAnnotations();
                    clearAnnotationDrawing();
                    clearAnnotationsView();
                    announce(t('annotationCleared'));
                    showToast(t('annotationCleared'));
                }

export function openAnnotationHelpModal() {
                    var modal = document.getElementById('annotationHelpModal');
                    if (!modal) return;
                    var body = document.getElementById('annotationHelpBody');
                    if (body) {
                        var items = [
                            ['annotationKindPin', 'annotationHelpPinText'],
                            ['annotationKindRegion', 'annotationHelpRegionText'],
                            ['annotationKindDraw', 'annotationHelpDrawText'],
                            ['annotationKindArrow', 'annotationHelpArrowText'],
                            ['annotationHelpColors', 'annotationHelpColorsText'],
                            ['annotationHelpFonts', 'annotationHelpFontsText'],
                            ['annotationHelpClear', 'annotationHelpClearText'],
                            ['annotationHelpManage', 'annotationHelpManageText']
                        ];
                        body.innerHTML = items.map(function(pair) {
                            return '<div class="annotation-help-item"><strong>' + t(pair[0]) + '</strong><span>' + t(pair[1]) + '</span></div>';
                        }).join('') +
                        '<div class="annotation-help-footer"><button class="btn quiz-start-btn" id="annotationHelpGotIt" data-i18n="annotationHelpGotIt">' + t('annotationHelpGotIt') + '</button></div>';
                        var gotIt = document.getElementById('annotationHelpGotIt');
                        if (gotIt) gotIt.addEventListener('click', closeAnnotationHelpModal);
                    }
                    modal.style.display = 'flex';
                    modal.classList.add('visible');
                    _setA11yDialogTrigger(document.activeElement);
                    setTimeout(function() { _a11yFocusFirstInDialog(modal); _a11yHideBackground(modal); }, 0);
                }

export function closeAnnotationHelpModal() {
                    var modal = document.getElementById('annotationHelpModal');
                    if (modal) { modal.style.display = 'none'; modal.classList.remove('visible'); _a11yRestoreFocus(); }
                }

export function toggleAnnotationKind(kind) {
                    if (['pin', 'region', 'freehand', 'arrow'].indexOf(kind) === -1) return;
                    setState('annotateKind', kind);
                    setState('annotatePoints', []);
                    clearAnnotationDrawing();
                    setAnnotationToolbarActive();
                    var kindLabel = kind === 'pin' ? t('annotationPin') : kind === 'region' ? t('annotationRegion') : kind === 'arrow' ? t('annotationArrow') : t('annotationDraw');
                    announce(t('annotationToolActive').replace('{tool}', kindLabel));
                }

export function renderAnnotationsModal() {
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
                         return;
                     }
                    body.innerHTML = '';
                    annotationsList.forEach(function(a, idx) {
                        var label = escapeHtml(a.label || _annotationTypeLabel(a));
                        var typeLabel = escapeHtml(_annotationTypeLabel(a));
                        var distBadge = (a.type === 'freehand' || a.type === 'arrow') && a.distanceKm ? ' <span class="annotation-item-dist">' + escapeHtml(fmtNum(a.distanceKm)) + ' km</span>' : '';
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
actions.appendChild(visBtn);
                     actions.appendChild(delBtn);
                     row.appendChild(typeEl);
                     row.appendChild(labelEl);
                     row.appendChild(actions);
                     body.appendChild(row);
                     });
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
                 }

export function openAnnotationsModal() {
                     renderAnnotationsModal();
                     var modal = document.getElementById('annotationsModal');
                     if (modal) modal.classList.add('visible');
                     _setA11yDialogTrigger(document.activeElement);
                     setTimeout(function() { _a11yFocusFirstInDialog(modal); _a11yHideBackground(modal); }, 0);
                 }

export function closeAnnotationsModal() {
                     var modal = document.getElementById('annotationsModal');
                     if (modal) { modal.classList.remove('visible'); _a11yRestoreFocus(); }
                 }

export function togglePresentationMode() {
                    setState('presentationModeActive', !presentationModeActive);
                    document.body.classList.toggle('presentation-mode', presentationModeActive);
                    document.getElementById('presentationExitBtn').style.display = presentationModeActive ? '' : 'none';
                    if (presentationModeActive) {
                        if (controlsBar.classList.contains('active')) {
                            controlsBar.classList.remove('active');
                            menuToggle.classList.remove('active');
                        }
                    } else {
                        if (measureActive) toggleMeasureMode();
                    }
                }

export function generateSessionCode() {
                    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
                    var code = '';
                    for (var i = 0; i < 6; i++) {
                        code += chars.charAt(Math.floor(Math.random() * chars.length));
                    }
                    return code;
                }

export async function handleCreateSession(studentNameInput, codeInput, createdSpan, createBtn) {
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
                    setState('currentSessionCode', sessionCode);
                    setState('currentStudentName', studentName);
                    createdSpan.textContent = t('quizSessionCreated') + ': ' + sessionCode;
                    createdSpan.style.display = '';
                    createBtn.style.display = 'none';
                    updateViewResultsBtn();
                }

export function handleJoinSession(studentNameInput, codeInput) {
                    var studentName = studentNameInput.value.trim();
                    var sessionCode = codeInput.value.trim().toUpperCase();
                    if (!studentName || !sessionCode) return;
                    setState('currentSessionCode', sessionCode);
                    setState('currentStudentName', studentName);
                }

export function updateViewResultsBtn() {
                    var btn = document.getElementById('quizViewResultsBtn');
                    if (currentSessionCode) {
                        btn.style.display = '';
                        btn.textContent = t('quizViewResults') + ' (' + currentSessionCode + ')';
                    } else {
                        btn.style.display = 'none';
                    }
                }

export async function saveQuizResultsToFirestore(results, score, total, timeTaken) {
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

export async function showClassResults(sessionCode) {
                    if (typeof window.firebaseGetResultsForSession !== 'function') return;
                    var results = await window.firebaseGetResultsForSession(sessionCode);
                    setState('lastQuizResults', results);
                    var overlay = document.getElementById('quizResultsOverlay');
                    var body = document.getElementById('quizResultsBody');
                    var csvBtn = document.getElementById('quizResultsExportCsvBtn');
                    document.getElementById('quizResultsSessionCode').innerHTML = t('quizSessionCode') + ': <strong>' + sessionCode + '</strong>';
                    document.getElementById('quizResultsTitle').textContent = t('quizViewResults');
                    document.getElementById('quizResultsSummaryTab').textContent = t('quizResultsSummary');
                    document.getElementById('quizResultsDetailTab').textContent = t('quizResultsDetail');
                    document.getElementById('quizResultsCloseBtn').textContent = t('quizResultsClose');
                    if (csvBtn) {
                        csvBtn.textContent = t('quizExportCsv');
                        csvBtn.style.display = results.length > 0 ? '' : 'none';
                    }

                    if (results.length === 0) {
                        body.innerHTML = '<div class="quiz-results-empty">' + t('quizResultsEmpty') + '</div>';
                    } else {
                        showResultsSummary(body, results);
                    }

                    overlay.style.display = '';

                    var summaryTab = document.getElementById('quizResultsSummaryTab');
                    var detailTab = document.getElementById('quizResultsDetailTab');

                    function activateTab(activeTab, otherTab, renderer) {
                        activeTab.classList.add('active');
                        activeTab.setAttribute('aria-selected', 'true');
                        activeTab.setAttribute('tabindex', '0');
                        otherTab.classList.remove('active');
                        otherTab.setAttribute('aria-selected', 'false');
                        otherTab.setAttribute('tabindex', '-1');
                        body.setAttribute('aria-labelledby', activeTab.id);
                        renderer(body, results);
                    }

                    summaryTab.onclick = function() {
                        activateTab(summaryTab, detailTab, showResultsSummary);
                    };
                    detailTab.onclick = function() {
                        activateTab(detailTab, summaryTab, showResultsDetail);
                    };
                    // Arrow-key navigation between tabs (ARIA practice)
                    [summaryTab, detailTab].forEach(function(tab, idx, arr) {
                        tab.addEventListener('keydown', function(e) {
                            var i = null;
                            if (e.key === 'ArrowRight') i = 1;
                            else if (e.key === 'ArrowLeft') i = -1;
                            else if (e.key === 'Home') i = -idx;
                            else if (e.key === 'End') i = arr.length - 1 - idx;
                            else return;
                            e.preventDefault();
                            var target = arr[(idx + i + arr.length) % arr.length];
                            target.focus();
                            target.click();
                        });
                    });
                }

export function showResultsSummary(container, results) {
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

export function showResultsDetail(container, results) {
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

export function formatTimeTaken(seconds) {
                    var m = Math.floor(seconds / 60);
                    var s = seconds % 60;
                    return m + ':' + (s < 10 ? '0' : '') + s;
                }

export function escapeHtml(str) {
                    if (!str) return '';
                    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
                }

export function triggerDownload(filename, blob) {
                    var url = URL.createObjectURL(blob);
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(function() { URL.revokeObjectURL(url); a.remove(); }, 200);
                }

export function exportResultsCsv() {
                    if (!lastQuizResults || lastQuizResults.length === 0) return;
                    var rows = [[t('quizStudentName'), t('quizFinalScore'), t('quizExportCsvQuestion'), t('quizExportCsvStatus'), t('quizExportCsvAnswer')]];
                    lastQuizResults.forEach(function(r) {
                        var scoreCell = r.total > 0 ? (r.score + '/' + r.total) : '';
                        if (r.answers && r.answers.length > 0) {
                            r.answers.forEach(function(a) {
                                rows.push([r.studentName, scoreCell, a.promptText || a.layerType || '', a.correct === true ? t('quizCorrect') : a.correct === false ? t('quizIncorrect') : t('quizSkipped'), a.answerText || '']);
                            });
                        } else {
                            rows.push([r.studentName, scoreCell, '', '', '']);
                        }
                    });
                    var csv = '\uFEFF' + rows.map(function(row) {
                        return row.map(function(cell) {
                            var s = String(cell == null ? '' : cell);
                            if (/[",\n\r]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
                            return s;
                        }).join(',');
                    }).join('\r\n');
                    triggerDownload('quiz-results-' + (currentSessionCode || 'export') + '.csv', new Blob([csv], { type: 'text/csv;charset=utf-8' }));
                }

export function handleMeasureClick(e) {
                    if (!measureActive) return;
                    if (e.target && e.target.closest && e.target.closest('.measure-toolbar')) return;
                    if (measureKind === 'area' && measureFinalized) return;
                    var rect = getMapRect();
                    var clickX = e.clientX - rect.left;
                    var clickY = e.clientY - rect.top;
                    var svgPoint = currentTransform.invert([clickX, clickY]);
                    var coords = getActiveProjection().invert(svgPoint);
                    if (!coords || isNaN(coords[0]) || isNaN(coords[1])) return;

                    if (measureKind === 'distance') {
                        if (measurePoints.length >= 2) clearMeasurement();
                    } else {
                        if (measurePoints.length >= 24) return;
                    }
                    measurePoints.push(coords);
                    redrawMeasureLayer();
                }

export function redrawMeasureLayer() {
                    if (!gMeasure) setState('gMeasure', gMap.append('g').attr('class', 'measure-layer'));
                    gMeasure.selectAll('*').remove();
                    var proj = getActiveProjection();
                    var finishBtn = document.getElementById('measureFinishBtn');
                    if (finishBtn) finishBtn.style.display = (measureKind === 'area' && measurePoints.length >= 3 && !measureFinalized) ? '' : 'none';

                    measurePoints.forEach(function(pt) {
                        var xy = proj(pt);
                        if (!xy || isNaN(xy[0])) return;
                        gMeasure.append('circle')
                            .attr('cx', xy[0]).attr('cy', xy[1]).attr('r', 5)
                            .attr('fill', 'var(--brand-accent, #14B8A6)').attr('stroke', '#fff').attr('stroke-width', 1.5);
                    });

                    if (measureKind === 'area' && measurePoints.length >= 2) {
                        var linePoints = measurePoints.map(function(pt) { return proj(pt); });
                        if (linePoints.some(function(v) { return !v || isNaN(v[0]); })) return;
                        if (measureFinalized) {
                            var closePts = linePoints.concat([linePoints[0]]);
                            var polyStr = closePts.map(function(v) { return v[0] + ',' + v[1]; }).join(' ');
                            gMeasure.insert('polygon', ':first-child')
                                .attr('points', polyStr)
                                .attr('fill', 'rgba(20,184,166,0.15)')
                                .attr('stroke', 'var(--brand-accent, #14B8A6)')
                                .attr('stroke-width', 2);
                        } else {
                            var openStr = linePoints.map(function(v) { return v[0] + ',' + v[1]; }).join(' ');
                            gMeasure.insert('polyline', ':first-child')
                                .attr('points', openStr)
                                .attr('fill', 'none')
                                .attr('stroke', 'var(--brand-accent, #14B8A6)')
                                .attr('stroke-width', 2)
                                .attr('stroke-dasharray', '6,4');
                            gMeasure.insert('line', ':first-child')
                                .attr('x1', linePoints[0][0]).attr('y1', linePoints[0][1])
                                .attr('x2', linePoints[linePoints.length - 1][0]).attr('y2', linePoints[linePoints.length - 1][1])
                                .attr('stroke', 'var(--brand-accent, #14B8A6)')
                                .attr('stroke-width', 1.5)
                                .attr('stroke-dasharray', '3,4');
                        }
                        if (measurePoints.length >= 3) {
                            var areaKm2 = measurePolygonAreaKm2(measurePoints, proj);
                            if (isFinite(areaKm2) && areaKm2 > 0) {
                                var cx = 0, cy = 0;
                                linePoints.forEach(function(v) { cx += v[0]; cy += v[1]; });
                                cx /= linePoints.length; cy /= linePoints.length;
                                var screenMid = currentTransform.apply([cx, cy]);
                                var rect = getMapRect();
                                measureResultLabel.textContent = fmtNum(Math.round(areaKm2)) + ' ' + t('measureAreaUnit');
                                measureResultLabel.style.left = (rect.left + screenMid[0]) + 'px';
                                measureResultLabel.style.top = (rect.top + screenMid[1]) + 'px';
                                measureResultLabel.style.display = '';
                            }
                        } else if (measurePoints.length === 2) {
                            var dKm = measureDistanceKm(measurePoints[0], measurePoints[1], proj);
                            if (isFinite(dKm)) {
                                var mxy1 = linePoints[0], mxy2 = linePoints[1];
                                var mmid = currentTransform.apply([(mxy1[0] + mxy2[0]) / 2, (mxy1[1] + mxy2[1]) / 2]);
                                var mrect = getMapRect();
                                measureResultLabel.textContent = fmtNum(Math.round(dKm)) + ' ' + t('measureKmUnit');
                                measureResultLabel.style.left = (mrect.left + mmid[0]) + 'px';
                                measureResultLabel.style.top = (mrect.top + mmid[1]) + 'px';
                                measureResultLabel.style.display = '';
                            }
                        }
                        return;
                    }

                    if (measurePoints.length === 2) {
                        var xy1 = proj(measurePoints[0]);
                        var xy2 = proj(measurePoints[1]);
                        if (xy1 && xy2 && !isNaN(xy1[0]) && !isNaN(xy2[0])) {
                            gMeasure.insert('line', ':first-child')
                                .attr('x1', xy1[0]).attr('y1', xy1[1])
                                .attr('x2', xy2[0]).attr('y2', xy2[1])
                                .attr('stroke', 'var(--brand-accent, #14B8A6)').attr('stroke-width', 2).attr('stroke-dasharray', '6,4');
                            var distanceKm = measureDistanceKm(measurePoints[0], measurePoints[1], proj);
                            if (isFinite(distanceKm)) {
                                var midX = (xy1[0] + xy2[0]) / 2;
                                var midY = (xy1[1] + xy2[1]) / 2;
                                var screenMid = currentTransform.apply([midX, midY]);
                                var rect = getMapRect();
                                measureResultLabel.textContent = fmtNum(Math.round(distanceKm)) + ' ' + t('measureKmUnit');
                                measureResultLabel.style.left = (rect.left + screenMid[0]) + 'px';
                                measureResultLabel.style.top = (rect.top + screenMid[1]) + 'px';
                                measureResultLabel.style.display = '';
                            }
                        }
                    }
                }

export function handleCountryActivate(e, d) {
                    if (measureActive) return;
                    if (annotateActive) return;
                    if (e.shiftKey && selectedCountry) {
                        setState('compareCountry', d);
                        renderComparePanel(selectedCountry, compareCountry);
                    } else {
                        setState('selectedCountry', d);
                        setState('compareCountry', null);
                        openCountryPanel(d);
                        highlightSelectedCountry(d);
                    }
                }

export function renderCountries(features) {
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

                setState('allCountryFeatures', features);
                setState('countryNamesList', features.map(f => f.properties?.name || '').filter(n => n));
                extraIslands.forEach(is => {
                    if (!countryNamesList.includes(is.name)) countryNamesList.push(is.name);
                });
                if (!countryNamesList.includes('Bahrain')) countryNamesList.push('Bahrain');

                gCountries.selectAll('*').remove();
                setState('countryPaths', gCountries.selectAll('path')
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
                    .attr('aria-label', d => getDisplayName(d.properties?.name || '')));

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
                            `<div>${t('tooltipGDP')}: ${gdp !== null ? '$' + fmtNum(gdp) : t('unknown')}</div>`;
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
                    setState('_pendingTooltipEvent', e);
                    if (!_tooltipRAFPending) {
                        setState('_tooltipRAFPending', true);
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
                         // Quiz mode: forward to the quiz handler via a synthetic map click
                         if (quizActive) {
                             // Let the quiz key handler attached at the map container process it.
                             // Just don't open the country panel in this branch.
                             return;
                         }
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
                syncCountryGlow();
            }

export function updateHash() {
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
                hash.set('theme', document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
                if (colorblindMode) hash.set('cb', '1');
                if (globeModeActive) hash.set('globe', '1');
                if (selectedCountry && selectedCountry.properties && selectedCountry.properties.name) {
                    hash.set('country', selectedCountry.properties.name);
                }
                hash.set('k', currentTransform.k.toFixed(2));
                hash.set('x', currentTransform.x.toFixed(0));
                hash.set('y', currentTransform.y.toFixed(0));
                history.replaceState(null, '', '#' + hash.toString());
            }

export const updateHashDebounced = debounce(updateHash, 300);

export const VALID_MODES = ['religion', 'terrain', 'density', 'precipitation', 'temperature', 'gdp', 'hdi', 'normal'];

export const VALID_FILTERS = ['all', 'muslim', 'christian', 'hindu', 'buddhist', 'jewish', 'other'];

export const VALID_LANGS = ['ar', 'en', 'ru', 'uz', 'es'];

export function loadFromHash() {
                try {
                    const hash = new URLSearchParams(window.location.hash.substring(1));
                    const langVal = hash.get('lang');
                    if (langVal && VALID_LANGS.includes(langVal)) setLanguage(langVal);
                    const themeVal = hash.get('theme');
                     if (themeVal === 'light' || themeVal === 'dark') applyTheme(themeVal);
                     if (hash.get('cb') === '1' && !colorblindMode) toggleColorblindMode();
                    // Globe must be restored BEFORE mode/filter/layers: toggleGlobeMode()
                    // calls resetLayersAndModes(), so restore those after it.
                    if (hash.get('globe') === '1' && !globeModeActive) toggleGlobeMode();
                    const modeVal = hash.get('mode');
                    if (modeVal && VALID_MODES.includes(modeVal)) setMode(modeVal);
                    const filterVal = hash.get('filter');
                    if (filterVal && VALID_FILTERS.includes(filterVal)) {
                        setState('currentReligionFilter', filterVal);
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
                            setState('selectedBloc', blocVal);
                            blocSelect.value = blocVal;
                        }
                    }
                    if (hash.has('k') && hash.has('x') && hash.has('y')) {
                        const k = +hash.get('k'),
                            x = +hash.get('x'),
                            y = +hash.get('y');
                        if (isFinite(k) && isFinite(x) && isFinite(y) && k >= 0.5 && k <= 12)
                            svg.call(zoomBehavior.transform, d3.zoomIdentity.translate(x, y).scale(k));
                    }
                    const countryVal = hash.get('country');
                    if (countryVal && allCountryFeatures) {
                        const feat = allCountryFeatures.find(function(x) { return x.properties && x.properties.name === countryVal; });
                        if (feat) {
                            setState('selectedCountry', feat);
                            setState('compareCountry', null);
                            openCountryPanel(feat);
                            highlightSelectedCountry(feat);
                        }
                    }
                    updateActiveLayerCount();
                } catch (e) {}
            }

export function copyCurrentLink() {
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

export function shareMap() {
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

export function resetLayersAndModes() {
                setState('currentReligionFilter', 'all');
                setActiveByAttr(religionButtons, '.religion-btn[data-religion="all"]');
                setMode('religion');
                if (showLabels) toggleLabels();
                if (sectMode) toggleSect();
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
                if (selectedBloc !== 'all') {
                    setState('selectedBloc', 'all');
                    document.getElementById('blocSelect').value = 'all';
                }
                if (desertsForestsVisible) toggleDesertsForests();
                if (borderDisputesVisible) toggleBorderDisputes();
            }

export function resetAll() {
                resetLayersAndModes();
                if (globeModeActive) toggleGlobeMode();
                if (!coordsVisible) toggleCoords();
                resetZoom();
                setState('selectedCountry', null);
                setState('compareCountry', null);
                highlightSelectedCountry(null);
                closeCountryPanel();
            }

export async function init() {
                setState('isMobile', window.innerWidth < 768);

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
                initDensityCanvas();
                setupZoom();
                drawGraticule();
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

                // Restore colorblind mode preference before first render so the
                // initial paint already uses the CB palette. The URL hash (applied
                // by loadFromHash below) may override this.
                try {
                    var cbSaved = localStorage.getItem('cbMode');
                    if (cbSaved === '1') {
                        setState('colorblindMode', true);
                        var cbBtn0 = document.getElementById('colorblindToggleBtn');
                        if (cbBtn0) { cbBtn0.classList.add('toggle-on'); cbBtn0.setAttribute('aria-pressed', 'true'); }
                    }
                } catch (e) {}

                renderCountries(features);
                // New session starts with a blank annotation canvas; the
                // previous session stays stored for explicit restore.
                setState('annotationsList', []);
                try {
                    var savedColor = localStorage.getItem('annotateColor');
                    if (savedColor && /^#[0-9a-f]{6}$/i.test(savedColor)) setState('annotateColor', savedColor);
                    var savedFont = localStorage.getItem('annotateFontSize');
                    if (['small', 'medium', 'large'].indexOf(savedFont) !== -1) setState('annotateFontSize', savedFont);
                } catch (e) {}
                try { redrawAnnotations(); } catch(e) { console.error('annotation draw error:', e); }
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
                            var first = document.querySelector('#shareBtn');
                            var last = document.querySelector('#coordsToggle');
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
                            return document.querySelector(mb ? '#mobileModeBtn' : '#filterRow');
                        }, icon: '🎯', titleKey: 'onboardStep5Title', textKey: 'onboardStep5Text' },
                        { getEl: function() {
                            var mb = window.innerWidth <= 768;
                            if (mb) return document.querySelector('#mobileLayersBtn');
                            var lr = document.querySelector('#layersRow');
                            if (lr && lr.offsetHeight > 0 && getComputedStyle(lr).display !== 'none') return lr;
                            return document.querySelector('#layersToggleBtn');
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
                        }, icon: '📐', titleKey: 'onboardStep12Title', textKey: 'onboardStep12Text' }
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

                    skipBtn.addEventListener('click', closeTutorial);
                    nextBtn.addEventListener('click', nextStep);
                    overlay.addEventListener('click', function(e) {
                        if (e.target === overlay) closeTutorial();
                    });

                    // Expose for replay button
                    window.startOnboarding = openTutorial;
                    // Expose so the Escape key handler can close the tutorial too
                    window.closeOnboarding = closeTutorial;

                    // Auto-show on first visit
                    var alreadyDone = false;
                    try { alreadyDone = localStorage.getItem('onboardDone') === '1'; } catch(e) {}
                    if (!alreadyDone) {
                        setTimeout(openTutorial, 800);
                    }

                    // Reposition on resize
                    onWindowResize(function() {
                        if (isOpen && steps[currentStep]) {
                            var el = steps[currentStep].getEl ? steps[currentStep].getEl() : null;
                            if (el) { positionGlow(el); positionCard(el); }
                        }
                    });
            })();

            // ── Quiz Mode ──
            initQuiz();

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
                    setState('compareSvg', d3.select(projectionCompareSvg)
                        .attr('viewBox', '0 0 ' + w + ' ' + h)
                        .attr('width', w)
                        .attr('height', h));
                    setState('compareG', compareSvg.append('g'));
                    setState('compareCountriesG', compareG.append('g'));
                    compareG.append('path')
                        .datum(d3.geoGraticule10())
                        .attr('class', 'compare-graticule')
                        .attr('fill', 'none')
                        .attr('stroke', 'rgba(255,255,255,0.08)')
                        .attr('stroke-width', 0.5);
                    setState('compareZoomBehavior', d3.zoom()
                        .scaleExtent([1, 12])
                        .on('zoom', function(e) {
                            compareG.attr('transform', e.transform);
                        }));
                    compareSvg.call(compareZoomBehavior);
                    setState('compareInitialized', true);
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
                    setState('compareProjectionType', 'mercator');
                    projTabMercator.classList.add('active');
                    projTabRobinson.classList.remove('active');
                    initProjectionCompareIfNeeded();
                    renderCompareProjection();
                }

                function closeProjectionCompare() {
                    projectionCompareOverlay.style.display = 'none';
                }
                // Expose so the Escape key handler can close the compare dock via the same function
                window.closeProjectionCompare = closeProjectionCompare;

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
                    setState('compareProjectionType', 'mercator');
                    projTabMercator.classList.add('active');
                    projTabRobinson.classList.remove('active');
                    renderCompareProjection();
                });
                projTabRobinson.addEventListener('click', function() {
                    setState('compareProjectionType', 'robinson');
                    projTabRobinson.classList.add('active');
                    projTabMercator.classList.remove('active');
                    renderCompareProjection();
                });
                onWindowResize(function() {
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
                    setState('_resizeTimer', setTimeout(function() {
                        var wasMobile = isMobile;
                        setState('isMobile', window.innerWidth < MOBILE_BREAKPOINT);
                        var dims = getContainerDimensions();
                        var width = dims.width, height = dims.height;
                        svgEl.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
                        svgEl.setAttribute('width', width);
                        svgEl.setAttribute('height', height);
                        setState('projection', setupProjection(width, height));
                        setState('_adminBakeDirty', true);
                        if (globeModeActive) {
                            initGlobeProjection();
                            setState('projection', globeProjection);
                            rebuildPathGen();
                        } else {
                            setState('pathGen', d3.geoPath(projection));
                            pathGen.pointRadius(isMobile ? 1.5 : 3);
                        }
                        if (globeModeActive) {
                            fullGlobeRedraw();
                        } else {
                            gOcean.select('rect').attr('width', width + 1000).attr('height', height + 1000);
                            drawGraticule();
                            if (allCountryFeatures.length) {
                                gCountries.selectAll('path').attr('d', pathGen);
                                syncCountryGlow();
                                if (countryLabelSelection) {
                                    countryLabelSelection.remove();
                                    setState('countryLabelSelection', null);
                                }
                                drawCountryLabels(allCountryFeatures);
                            }
                            drawPhysicalFeatures();
                            drawCorridors();
                            drawPointLayersCanvas();
                            drawCapitals();
                            drawTimezones();
                            drawMajorCities();
                            redrawAnnotations();
                            svg.call(zoomBehavior.transform, currentTransform);
                        }
                    }, 80));
                });
                resizeObserver.observe(mapContainer);

                var toolsRow = document.getElementById('toolsRow');
                var headerEl = document.querySelector('.header');
                var controlsBarEl = document.getElementById('controlsBar');
                function syncToolsRowPosition() {
                    if (!toolsRow || !headerEl || !controlsBarEl) return;
                    if (window.innerWidth >= 1024) {
                        if (toolsRow.parentElement !== headerEl) headerEl.appendChild(toolsRow);
                    } else {
                        if (toolsRow.parentElement !== controlsBarEl) controlsBarEl.insertBefore(toolsRow, controlsBarEl.firstChild);
                    }
                }
                syncToolsRowPosition();
                onWindowResize(syncToolsRowPosition);

                function syncHeaderHeight() {
                    var hdr = document.querySelector('.header');
                    if (hdr) document.documentElement.style.setProperty('--header-height', hdr.offsetHeight + 'px');
                }
                if (typeof ResizeObserver !== 'undefined') {
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
