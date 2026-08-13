        (function() {
            const BASE = window.__BASE_PATH || './';

            // ── Utility: debounce ─────────────────────────────────────
            function debounce(fn, delay) {
                let timer;
                return function(...args) {
                    clearTimeout(timer);
                    timer = setTimeout(() => fn.apply(this, args), delay);
                };
            }

            // ── DOM refs ──────────────────────────────────────────────
            const svgEl = document.getElementById('mapSvg');
            const tooltip = document.getElementById('tooltip');
            const legendEl = document.getElementById('legend');
            const infoOverlay = document.getElementById('infoOverlay');
            const coordinatesDisplay = document.getElementById('coordinatesDisplay');
            const copyNotification = document.getElementById('copyNotification');
            const langToggle = document.getElementById('langToggle');
            const modeButtons = document.querySelectorAll('.mode-btn');
            const religionButtons = document.querySelectorAll('.religion-btn');
            const labelsToggle = document.getElementById('labelsToggle');
            const sectToggle = document.getElementById('sectToggle');
            const corridorsToggle = document.getElementById('routesToggle');
            const densitySpotsToggle = document.getElementById('densitySpotsToggle');
            const capitalsToggle = document.getElementById('capitalsToggle');
            const timezonesToggle = document.getElementById('timezonesToggle');
            const majorCitiesToggle = document.getElementById('majorCitiesToggle');
            const coordsToggle = document.getElementById('coordsToggle');
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
            const layersToggleBtn = document.getElementById('layersToggleBtn');
            const layersModal = document.getElementById('layersModal');
            const layersModalBackdrop = document.getElementById('layersModalBackdrop');
            const layersModalClose = document.getElementById('layersModalClose');
            const shortcutsOverlay = document.getElementById('shortcutsOverlay');
            const shortcutsBtn = document.getElementById('shortcutsBtn');
            const shortcutsClose = document.getElementById('shortcutsClose');
            const onboardingHint = document.getElementById('onboardingHint');
            const mapContainer = document.getElementById('mapContainer');
            const densityCanvas = document.getElementById('densityCanvas');
            let densityCtx = null;

            function initDensityCanvas() {
                const rect = mapContainer.getBoundingClientRect();
                const dpr = window.devicePixelRatio || 1;
                densityCanvas.width = rect.width * dpr;
                densityCanvas.height = rect.height * dpr;
                densityCanvas.style.width = rect.width + 'px';
                densityCanvas.style.height = rect.height + 'px';
                densityCtx = densityCanvas.getContext('2d');
                densityCtx.scale(dpr, dpr);
            }

            let currentReligionFilter = 'all';
            let colorMode = 'religion';
            let showLabels = false;
            let sectMode = false;
            let corridorsVisible = false;
            let riversVisible = false;
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
            let geopoliticalBlocsVisible = false;
            let desertsForestsVisible = false;
            let borderDisputesVisible = false;
            let coordsVisible = true;
            let lang = 'ar';
            let allCountryFeatures = [];
            let countryPaths = null;
            let selectedCountry = null;
            let compareCountry = null;
            let _lastPanelRenderTime = 0;
            let selectedFeature = null;
            let selectedFeatureType = null; // 'mountain' | 'river' | null
            let gCapitals, gTimezones, gMajorCities, gNaturalResources, gEthnicGroups, gOceanCurrents, gWinds, gEarthquakes, gVolcanoes, gBorderDisputes, gGeopoliticalBlocs, gDesertsForests;
            let projection, pathGen;
            let svg, gMap, gCountries, gGraticule, gOcean, gCorridors, gPhysical, gTemperature;
            let currentTransform = d3.zoomIdentity;
            let _tooltipSize = { w: 180, h: 60 };
            let lastCanvasTransform = d3.zoomIdentity;
            let zoomBehavior;
            let countryNamesList = [];
            let highlightTimeout = null;
            let countryLabelSelection = null;
            const MOBILE_BREAKPOINT = 768;
            let isMobile = window.innerWidth < MOBILE_BREAKPOINT;


            function t(key, params = {}) {
                let s = i18n[lang]?.[key] || i18n.en[key] || key;
                for (let [k, v] of Object.entries(params)) s = s.replace(`{${k}}`, v);
                return s;
            }

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

            function getDisplayName(name) {
                if (!name) return '';
                if (lang === 'ar') return getArabicName(name);
                if (lang === 'ru') return getRussianName(name);
                return name;
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

            function getCountryFill(d) {
                const name = d.properties?.name || '';
                if (colorMode === 'normal') return MAP_COLORS.country.normal;
                if (colorMode === 'terrain') return getTerrainColor(getElevation(name));
                if (colorMode === 'density') return getDensityColor(getDensity(name));
                if (colorMode === 'precipitation') return getPrecipitationColor(getPrecipitation(name));
                if (colorMode === 'temperature') return getTempColor(getTemperature(name, d));
                if (colorMode === 'gdp') return getGDPColor(getGDP(name));
                if (colorMode === 'hdi') return getHDIColor(getHDI(name));
                if (sectMode) return denominationColors[getDenomination(name)] || MAP_COLORS.country.defaultFill;
                const rel = getReligion(name);
                if (currentReligionFilter === 'all') return religionColors[rel] || MAP_COLORS.country.defaultFill;
                if (rel === currentReligionFilter) return d3.color(religionColors[rel] || MAP_COLORS.country.defaultFill).brighter(0.6)
                    .toString();
                return MAP_COLORS.country.filterDim;
            }

            function getStroke(d) {
                if (colorMode === 'normal') return MAP_COLORS.country.stroke;
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

            function getCorridorColor() {
                if (colorMode === 'terrain') return MAP_COLORS.corridor.terrain;
                if (colorMode === 'density') return MAP_COLORS.corridor.density;
                if (colorMode === 'precipitation') return MAP_COLORS.corridor.precipitation;
                if (colorMode === 'temperature') return MAP_COLORS.corridor.temperature;
                if (colorMode === 'normal') return MAP_COLORS.corridor.normal;
                return MAP_COLORS.corridor.other;
            }




            // --- Resources Data ---
            // --- Ethnic Groups Data ---
            function showEthnicGroupDetail(d) {
                selectedFeature = d;
                selectedFeatureType = 'ethnicGroup';
                var displayName = lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):d.name_en;
                var html = '<h3>👥 '+displayName+'</h3>';
                if (d.population_ar||d.population_en) html += '<p><strong>'+t('populationTitle')+':</strong> '+(lang==='ar'?d.population_ar:lang==='ru'?(d.population_ru||d.population_en):d.population_en)+'</p>';
                if (d.countries_ar||d.countries_en) html += '<p><strong>'+t('featureCountries')+':</strong> '+(lang==='ar'?d.countries_ar:lang==='ru'?(d.countries_ru||d.countries_en):d.countries_en)+'</p>';
                if (d.language_ar||d.language_en) html += '<p><strong>'+t('languageTitle')+':</strong> '+(lang==='ar'?d.language_ar:lang==='ru'?(d.language_ru||d.language_en):d.language_en)+'</p>';
                if (d.religion_ar||d.religion_en) html += '<p><strong>'+t('tooltipReligion')+':</strong> '+(lang==='ar'?d.religion_ar:lang==='ru'?(d.religion_ru||d.religion_en):d.religion_en)+'</p>';
                if (d.description_ar||d.description_en) html += '<p><strong>'+t('featureDescription')+':</strong> '+(lang==='ar'?d.description_ar:lang==='ru'?(d.description_ru||d.description_en):d.description_en)+'</p>';
                _lastPanelRenderTime = performance.now();
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }





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


            function getContainerDimensions() {
                const r = mapContainer.getBoundingClientRect();
                return { width: r.width, height: r.height };
            }

            function setupProjection(w, h) {
                const precision = isMobile ? 0.8 : 0.3;
                return d3.geoPolyhedralWaterman().scale(Math.min(w, h) * 0.38).translate([w / 2, h / 2]).rotate([0, 0])
                    .precision(precision);
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
                        return { offset: ['0%','30%','60%','100%'][i], color: c };
                    }))
                    .join('stop')
                    .attr('offset', d => d.offset)
                    .attr('stop-color', d => d.color);

                const shadowFilter = defs.append('filter')
                    .attr('id', 'countryShadow')
                    .attr('x', '-10%').attr('y', '-10%')
                    .attr('width', '120%').attr('height', '120%')
                    .attr('color-interpolation-filters', 'sRGB');
                if (isMobile) {
                    shadowFilter.append('feFlood').attr('flood-color', 'transparent');
                } else {
                    shadowFilter.append('feDropShadow')
                        .attr('dx', '0')
                        .attr('dy', '2')
                        .attr('stdDeviation', '4')
                        .attr('flood-color', 'rgba(0,0,0,0.6)')
                        .attr('flood-opacity', '0.5');
                }

                gOcean = svg.append('g');
                gOcean.append('rect')
                    .attr('x', -500).attr('y', -500)
                    .attr('width', width + 1000).attr('height', height + 1000)
                    .attr('fill', 'url(#oceanGradient)');

                gGraticule = svg.append('g');
                gCountries = svg.append('g');
                if (!isMobile) {
                    gCountries.style('filter', 'url(#countryShadow)');
                }
                gPhysical = svg.append('g');
                gCorridors = svg.append('g');
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
                gDesertsForests = svg.append('g');
                gBorderDisputes = svg.append('g');

                gMap = svg.append('g').attr('class', 'map-transform-group');
                [gOcean, gGraticule, gCountries, gPhysical, gCorridors, gTemperature, gCapitals, gTimezones, gMajorCities, gNaturalResources, gEthnicGroups, gOceanCurrents, gWinds, gEarthquakes, gVolcanoes, gGeopoliticalBlocs, gDesertsForests, gBorderDisputes]
                    .forEach(g => gMap.append(() => g.node()));

                projection = setupProjection(width, height);
                pathGen = d3.geoPath(projection);
                pathGen.pointRadius(isMobile ? 1.5 : 3);
            }

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
                    .attr('stroke-width', 1.2)
                    .attr('d', pathGen);
            }

            function showRouteDetail(d) {
                selectedFeature = d;
                selectedFeatureType = 'route';
                var displayName = lang==='ar'?d.name_ar:lang==='ru'?(d.name_ru||d.name_en):d.name_en;
                var icon = d.type==='land'?'🚛':d.type==='sea'?'🚢':d.type==='air'?'✈️':d.type==='pipeline'?'🛢️':d.type==='canal'?'🚰':'🌊';
                var html = '<h3>'+icon+' '+displayName+'</h3>';
                if (d.length_km) html += '<p><strong>'+t('featureLength')+':</strong> '+d.length_km+' '+t('featureKm')+'</p>';
                if (d.countries_ar||d.countries_en) html += '<p><strong>'+t('featureCountries')+':</strong> '+(lang==='ar'?d.countries_ar:lang==='ru'?(d.countries_ru||d.countries_en):d.countries_en)+'</p>';
                var typeLabel = d.type==='land'?t('landRoute'):d.type==='sea'?t('seaRoute'):d.type==='canal'?t('canal'):d.type==='strait'?t('strait'):d.type==='air'?t('airRoute'):d.type==='pipeline'?t('pipeline'):d.type;
                html += '<p><strong>'+t('routeType')+':</strong> '+typeLabel+'</p>';
                _lastPanelRenderTime = performance.now();
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }
            function drawRoutes() {
                gCorridors.selectAll('*').remove();
                if (!corridorsVisible && !additionalWaterwaysVisible) return;
                var renderList = [];
                if (corridorsVisible) renderList = renderList.concat(corridorsData);
                if (additionalWaterwaysVisible) {
                    var existingNames = new Set(renderList.map(function(c) { return c.name_en; }));
                    var deduped = additionalWaterwaysData.filter(function(w) { return !existingNames.has(w.name_en); });
                    renderList = renderList.concat(deduped.map(function(w){
                        return { name_ar: w.name, name_en: w.name_en, coords: w.coords, type: w.type==='canal'?'canal':w.type==='strait'?'strait':'sea', length_km: w.length_km, countries_ar: w.countries_ar, countries_en: w.countries_en };
                    }));
                }
                renderList.forEach(function(c) {
                    var color = MAP_COLORS.routes[c.type] || MAP_COLORS.routes.other;
                    var points = c.coords;
                    gCorridors.append('path').datum({type:'LineString', coordinates:points}).attr('d',pathGen).attr('fill','none').attr('stroke',color).attr('stroke-width',isMobile?7:10).attr('opacity',0.35).attr('vector-effect','non-scaling-stroke').style('cursor','pointer').on('click',function(){showRouteDetail(c);});
                    gCorridors.append('path').datum({type:'LineString', coordinates:points}).attr('d',pathGen).attr('fill','none').attr('stroke',color).attr('stroke-width',isMobile?2.5:3).attr('opacity',1).attr('vector-effect','non-scaling-stroke').style('pointer-events','none');
                    var first = points[0], last = points[points.length-1];
                    [first,last].forEach(function(p){
                        var xy = projection(p);
                        if (!xy||isNaN(xy[0])) return;
                        gCorridors.append('circle').attr('cx',xy[0]).attr('cy',xy[1]).attr('r',isMobile?2.5:3.5).attr('fill',color).attr('stroke','#fff').attr('stroke-width',0.5).attr('vector-effect','non-scaling-stroke').style('pointer-events','none');
                    });
                    var mid = points[Math.floor(points.length/2)];
                    var mxy = projection(mid);
                    if (mxy&&!isNaN(mxy[0])) {
                        gCorridors.append('text').attr('x',mxy[0]).attr('y',mxy[1]-4).text(function(){return lang==='ar'?c.name_ar:lang==='ru'?(c.name_ru||c.name_en):c.name_en;}).attr('fill','#fff').attr('font-size',isMobile?6:8).attr('opacity',0.85).attr('text-anchor','middle').style('pointer-events','none');
                    }
                });
            }
            // Legacy draw functions redirect to unified drawRoutes
            function drawCorridors() { drawRoutes(); }
            function drawAdditionalWaterways() { drawRoutes(); }

            function drawCapitals() {
                gCapitals.selectAll('*').remove();
            }

            function drawMajorCities() {
                gMajorCities.selectAll('*').remove();
            }

            function drawTimezones() {
                gTimezones.selectAll('*').remove();
                if (!timezonesVisible) return;
                const timezoneData = [
                    { offset: -12, coords: [
                            [-180, 90],
                            [180, 90],
                            [180, -90],
                            [-180, -90]
                        ] },
                    { offset: -11, coords: [
                            [-165, 90],
                            [-150, 90],
                            [-150, -90],
                            [-165, -90]
                        ] },
                    { offset: -10, coords: [
                            [-150, 90],
                            [-135, 90],
                            [-135, -90],
                            [-150, -90]
                        ] },
                    { offset: -9, coords: [
                            [-135, 90],
                            [-120, 90],
                            [-120, -90],
                            [-135, -90]
                        ] },
                    { offset: -8, coords: [
                            [-120, 90],
                            [-105, 90],
                            [-105, -90],
                            [-120, -90]
                        ] },
                    { offset: -7, coords: [
                            [-105, 90],
                            [-90, 90],
                            [-90, -90],
                            [-105, -90]
                        ] },
                    { offset: -6, coords: [
                            [-90, 90],
                            [-75, 90],
                            [-75, -90],
                            [-90, -90]
                        ] },
                    { offset: -5, coords: [
                            [-75, 90],
                            [-60, 90],
                            [-60, -90],
                            [-75, -90]
                        ] },
                    { offset: -4, coords: [
                            [-60, 90],
                            [-45, 90],
                            [-45, -90],
                            [-60, -90]
                        ] },
                    { offset: -3, coords: [
                            [-45, 90],
                            [-30, 90],
                            [-30, -90],
                            [-45, -90]
                        ] },
                    { offset: -2, coords: [
                            [-30, 90],
                            [-15, 90],
                            [-15, -90],
                            [-30, -90]
                        ] },
                    { offset: -1, coords: [
                            [-15, 90],
                            [0, 90],
                            [0, -90],
                            [-15, -90]
                        ] },
                    { offset: 0, coords: [
                            [0, 90],
                            [15, 90],
                            [15, -90],
                            [0, -90]
                        ] },
                    { offset: 1, coords: [
                            [15, 90],
                            [30, 90],
                            [30, -90],
                            [15, -90]
                        ] },
                    { offset: 2, coords: [
                            [30, 90],
                            [45, 90],
                            [45, -90],
                            [30, -90]
                        ] },
                    { offset: 3, coords: [
                            [45, 90],
                            [60, 90],
                            [60, -90],
                            [45, -90]
                        ] },
                    { offset: 4, coords: [
                            [60, 90],
                            [75, 90],
                            [75, -90],
                            [60, -90]
                        ] },
                    { offset: 5, coords: [
                            [75, 90],
                            [90, 90],
                            [90, -90],
                            [75, -90]
                        ] },
                    { offset: 6, coords: [
                            [90, 90],
                            [105, 90],
                            [105, -90],
                            [90, -90]
                        ] },
                    { offset: 7, coords: [
                            [105, 90],
                            [120, 90],
                            [120, -90],
                            [105, -90]
                        ] },
                    { offset: 8, coords: [
                            [120, 90],
                            [135, 90],
                            [135, -90],
                            [120, -90]
                        ] },
                    { offset: 9, coords: [
                            [135, 90],
                            [150, 90],
                            [150, -90],
                            [135, -90]
                        ] },
                    { offset: 10, coords: [
                            [150, 90],
                            [165, 90],
                            [165, -90],
                            [150, -90]
                        ] },
                    { offset: 11, coords: [
                            [165, 90],
                            [180, 90],
                            [180, -90],
                            [165, -90]
                        ] },
                    { offset: 12, coords: [
                            [180, 90],
                            [-180, 90],
                            [-180, -90],
                            [180, -90]
                        ] }
                ];
                timezoneData.forEach(tz => {
                    gTimezones.append('path')
                        .datum({ type: 'Polygon', coordinates: [tz.coords] })
                        .attr('d', pathGen)
                        .attr('fill', 'none')
                        .attr('stroke', 'rgba(255,255,255,0.2)')
                        .attr('stroke-width', 0.8)
                        .attr('stroke-dasharray', '4,4')
                        .attr('vector-effect', 'non-scaling-stroke');
                });
            }

            function drawPhysicalFeatures() {
                gPhysical.selectAll('*').remove();

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
                            .datum({ type: 'LineString', coordinates: m.coords })
                            .attr('d', pathGen)
                            .attr('fill', 'none')
                            .attr('stroke', MAP_COLORS.physical.mountainShadow)
                            .attr('stroke-width', w * (isMobile ? 2.2 : 3.8))
                            .attr('stroke-linecap', 'round')
                            .attr('stroke-linejoin', 'round')
                            .attr('vector-effect', 'non-scaling-stroke')
                            .attr('opacity', 0.45);
                        const mainPath = grp.append('path')
                            .datum({ type: 'LineString', coordinates: m.coords })
                            .attr('d', pathGen)
                            .attr('fill', 'none')
                            .attr('stroke', w === 3 ? MAP_COLORS.physical.mountainMajor : w === 2 ? MAP_COLORS.physical.mountainImportant : MAP_COLORS.physical.mountainMinor)
                            .attr('stroke-width', w * (isMobile ? 1.1 : 1.8))
                            .attr('stroke-linecap', 'round')
                            .attr('stroke-linejoin', 'round')
                            .attr('vector-effect', 'non-scaling-stroke')
                            .attr('opacity', 0.95)
                            .attr('data-feature', 'mountain')
                            .attr('data-name', m.name);
                        const step = w === 3 ? 1 : 2;
                        m.coords.forEach((coord, i) => {
                            if (i % step !== 0) return;
                            const pr = projection(coord);
                            if (!pr || isNaN(pr[0])) return;
                            const [px, py] = pr;
                            const s = w * (isMobile ? 2 : 3.2);
                            grp.append('path')
                                .attr('d', `M${px},${py - s} L${px - s * 0.75},${py + s * 0.55} L${px + s * 0.75},${py + s * 0.55} Z`)
                                .attr('fill', w === 3 ? MAP_COLORS.physical.mountainPeakMajor : w === 2 ? MAP_COLORS.physical.mountainPeakImportant : MAP_COLORS.physical.mountainPeakMinor)
                                .attr('stroke', MAP_COLORS.physical.mountainShadow)
                                .attr('stroke-width', 0.3)
                                .attr('opacity', 0.9);
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
                                .datum({ type: 'LineString', coordinates: r.coords })
                                .attr('d', pathGen)
                                .attr('fill', 'none')
                                .attr('stroke', MAP_COLORS.physical.riverHalo)
                                .attr('stroke-width', w * (isMobile ? 1.8 : 2.8))
                                .attr('stroke-linecap', 'round')
                                .attr('stroke-linejoin', 'round')
                                .attr('vector-effect', 'non-scaling-stroke')
                                .attr('opacity', 0.3);
                            const mainPath = grp.append('path')
                                .datum({ type: 'LineString', coordinates: r.coords })
                                .attr('d', pathGen)
                                .attr('fill', 'none')
                                .attr('stroke', w === 3 ? MAP_COLORS.physical.riverMajor : w === 2 ? MAP_COLORS.physical.riverImportant : MAP_COLORS.physical.riverMinor)
                                .attr('stroke-width', w * (isMobile ? 0.9 : 1.4))
                                .attr('stroke-linecap', 'round')
                                .attr('stroke-linejoin', 'round')
                                .attr('vector-effect', 'non-scaling-stroke')
                                .attr('opacity', 0.88)
                                .attr('data-feature', 'river')
                                .attr('data-name', r.name);
                            grp.on('mouseenter', function() { mainPath.attr('stroke', MAP_COLORS.physical.riverHover).attr('opacity', 1); })
                                .on('mouseleave', function() { mainPath.attr('stroke', w === 3 ? MAP_COLORS.physical.riverMajor : w === 2 ? MAP_COLORS.physical.riverImportant : MAP_COLORS.physical.riverMinor).attr('opacity', 0.88); })
                                .on('click', function(e) { e.stopPropagation(); showFeatureDetail('river', r); });
                        });
                    });
                }
            }

            // ── New layer drawing functions ──
            function showResourceDetail(d) {
                selectedFeature = d;
                selectedFeatureType = 'resource';
                var displayName = lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):d.name_en;
                var typeLabel = d.type==='oil'?'🛢️':d.type==='gas'?'🔥':d.type==='coal'?'⛏️':d.type==='metal'?'🔩':d.type==='precious'?'💎':d.type==='nuclear'?'☢️':d.type==='renewable'?'♻️':d.type==='water'?'💧':d.type==='forest'?'🌲':'🗿';
                var html = '<h3>'+typeLabel+' '+displayName+'</h3>';
                if (d.countries_ar||d.countries_en) html += '<p><strong>'+t('featureCountries')+':</strong> '+(lang==='ar'?d.countries_ar:lang==='ru'?(d.countries_ru||d.countries_en):d.countries_en)+'</p>';
                if (d.reserves) html += '<p><strong>'+t('reserves')+':</strong> '+d.reserves+'</p>';
                if (d.production) html += '<p><strong>'+t('production')+':</strong> '+d.production+'</p>';
                if (d.capacity) html += '<p><strong>'+t('capacity')+':</strong> '+d.capacity+'</p>';
                if (d.description_ar||d.description_en) html += '<p><strong>'+t('featureDescription')+':</strong> '+(lang==='ar'?d.description_ar:lang==='ru'?(d.description_ru||d.description_en):d.description_en)+'</p>';
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
                var r = Math.max(4, (isMobile ? 6 : 10) / k);
                var fontSize = Math.max(3, Math.min(16, (isMobile ? 9 : 12) / k));
                if (!gNaturalResources.on('click')) {
                    gNaturalResources.on('click', function(e) {
                        if (e.target.tagName === 'circle') {
                            var dd = d3.select(e.target).datum();
                            if (dd) showResourceDetail(dd);
                        }
                    });
                }
                naturalResourcesData.forEach(function(d) {
                    var xy = projection(Array.isArray(d.coords[0]) ? d.coords[0] : d.coords);
                    if (!xy || isNaN(xy[0])) return;
                    var color = resourceColorMap[d.type] || MAP_COLORS.naturalResources.default;
                    gNaturalResources.append('circle').datum(d).attr('cx',xy[0]).attr('cy',xy[1]).attr('r',r).attr('fill',color).attr('opacity',0.85).attr('stroke','#fff').attr('stroke-width',1.2).style('cursor','pointer');
                    gNaturalResources.append('text').attr('x',xy[0]+r+3/k).attr('y',xy[1]+2/k).text(function(){return lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):d.name_en;}).attr('fill','#fff').attr('font-size',fontSize+'px').attr('font-weight','bold').style('pointer-events','none');
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
                ethnicGroupsData.forEach(function(d,i) {
                    var xy = projection(Array.isArray(d.coords[0]) ? d.coords[0] : d.coords);
                    if (!xy || isNaN(xy[0])) return;
                    var k = Math.max(0.4, currentTransform.k);
                    var color = ethnicColors[i%ethnicColors.length];
                    var r = Math.max(4, (isMobile?6:10)/k);
                    var fs = Math.max(3, Math.min(16, (isMobile?9:12)/k));
                    gEthnicGroups.append('circle').datum(d).attr('cx',xy[0]).attr('cy',xy[1]).attr('r',r).attr('fill',color).attr('opacity',0.6).attr('stroke','#fff').attr('stroke-width',1).style('cursor','pointer');
                    gEthnicGroups.append('text').attr('x',xy[0]+r+3/k).attr('y',xy[1]+2/k).text(function(){return lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):d.name_en;}).attr('fill','#fff').attr('font-size',fs+'px').attr('font-weight','bold').style('pointer-events','none');
                });
            }
            function showOceanCurrentDetail(d) {
                selectedFeature = d;
                selectedFeatureType = 'oceanCurrent';
                var displayName = lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):d.name_en;
                var html = '<h3>🌊 '+displayName+'</h3>';
                if (d.type==='warm'||d.type==='cold') {
                    var typeLabel = d.type==='warm'?t('warmCurrent'):t('coldCurrent');
                    html += '<p><strong>'+t('currentType')+':</strong> '+typeLabel+'</p>';
                    if (d.temperature) html += '<p><strong>'+t('temperature')+':</strong> '+d.temperature+'°C</p>';
                    if (d.speed) html += '<p><strong>'+t('speed')+':</strong> '+d.speed+'</p>';
                } else if (d.type==='gyre') {
                    html += '<p><strong>'+t('currentType')+':</strong> '+t('gyre')+'</p>';
                } else if (d.type==='trench') {
                    html += '<p><strong>'+t('currentType')+':</strong> '+t('trenchDepth')+'</p>';
                    if (d.depth) html += '<p><strong>'+t('trenchDepth')+':</strong> '+d.depth.toLocaleString('en')+' '+t('elevationUnit')+'</p>';
                }
                if (d.description_ar||d.description_en) html += '<p><strong>'+t('featureDescription')+':</strong> '+(lang==='ar'?d.description_ar:lang==='ru'?(d.description_ru||d.description_en):d.description_en)+'</p>';
                _lastPanelRenderTime = performance.now();
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }
            function drawOceanCurrents() {
                gOceanCurrents.selectAll('*').remove();
                if (!oceanCurrentsVisible) return;
                oceanCurrentsData.forEach(function(d) {
                    if (d.type==='trench') {
                        var xy = projection(Array.isArray(d.coords[0])?d.coords[0]:d.coords);
                        if (!xy||isNaN(xy[0])) return;
                        var s = isMobile?10:16;
                        gOceanCurrents.append('rect').attr('x',xy[0]-s-6).attr('y',xy[1]-s-6).attr('width',(s+6)*2).attr('height',(s+6)*2).attr('fill','transparent').style('cursor','pointer').on('click',function(){showOceanCurrentDetail(d);});
                        gOceanCurrents.append('path').attr('d','M'+(xy[0]-s)+','+(xy[1]-s)+' L'+(xy[0]+s)+','+(xy[1]+s)+' M'+(xy[0]-s)+','+(xy[1]+s)+' L'+(xy[0]+s)+','+(xy[1]-s)).attr('stroke',MAP_COLORS.oceanCurrents.trench).attr('stroke-width',isMobile?3:4).attr('opacity',0.9).style('pointer-events','none');
                        gOceanCurrents.append('text').attr('x',xy[0]+s+6).attr('y',xy[1]+3).text(function(){return lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):d.name_en;}).attr('fill',MAP_COLORS.oceanCurrents.trench).attr('font-size',isMobile?8:11).attr('font-weight','bold').style('pointer-events','none');
                        return;
                    }
                    if (d.type==='gyre') {
                        var color = MAP_COLORS.oceanCurrents.gyre;
                        var line = gOceanCurrents.append('path').datum({type:'LineString', coordinates:d.coords}).attr('d', pathGen).attr('fill','none').attr('stroke',color).attr('stroke-width',isMobile?2.5:4).attr('opacity',0.6).attr('stroke-dasharray','4,8').attr('vector-effect','non-scaling-stroke').style('cursor','pointer').on('click',function(){showOceanCurrentDetail(d);});
                        var expanded = d.coords.slice();
                        if (expanded.length>1) { expanded.push(d.coords[d.coords.length-2]); expanded.push(d.coords[d.coords.length-1]); }
                        gOceanCurrents.append('path').datum({type:'LineString', coordinates:d.coords}).attr('d', pathGen).attr('fill','none').attr('stroke','transparent').attr('stroke-width',isMobile?16:24).style('cursor','pointer').on('click',function(){showOceanCurrentDetail(d);});
                        var mid = d.coords[Math.floor(d.coords.length/2)];
                        var mxy = projection(mid);
                        if (mxy&&!isNaN(mxy[0])) {
                            gOceanCurrents.append('text').attr('x',mxy[0]).attr('y',mxy[1]-10).text(function(){return lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):d.name_en;}).attr('fill',color).attr('font-size',isMobile?8:11).attr('font-weight','bold').attr('text-anchor','middle').style('pointer-events','none');
                        }
                        return;
                    }
                    var color = d.type === 'warm' ? MAP_COLORS.oceanCurrents.warm : MAP_COLORS.oceanCurrents.cold;
                    var arrow = d.type === 'warm' ? '▶' : '◀';
                    var line = gOceanCurrents.append('path').datum({type:'LineString', coordinates:d.coords}).attr('d', pathGen).attr('fill','none').attr('stroke',color).attr('stroke-width',isMobile?3:5).attr('opacity',0.8).attr('stroke-dasharray','8,4').attr('vector-effect','non-scaling-stroke').style('cursor','pointer').on('click',function(){showOceanCurrentDetail(d);});
                    gOceanCurrents.append('path').datum({type:'LineString', coordinates:d.coords}).attr('d', pathGen).attr('fill','none').attr('stroke','transparent').attr('stroke-width',isMobile?18:28).style('cursor','pointer').on('click',function(){showOceanCurrentDetail(d);});
                    var last = d.coords[d.coords.length-1];
                    var xy = projection(last);
                    if (xy && !isNaN(xy[0])) {
                        gOceanCurrents.append('text').attr('x',xy[0]).attr('y',xy[1]).text(arrow).attr('fill',color).attr('font-size',isMobile?16:22).attr('opacity',0.9).style('pointer-events','none');
                        var first = d.coords[0];
                        var fxy = projection(first);
                        if (fxy && !isNaN(fxy[0])) {
                            var mid = d.coords[Math.floor(d.coords.length/2)];
                            var mxy = projection(mid);
                            if (mxy && !isNaN(mxy[0])) {
                                gOceanCurrents.append('text').attr('x',mxy[0]-10).attr('y',mxy[1]-6).text(function(){return lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):d.name_en;}).attr('fill','#fff').attr('font-size',isMobile?7:10).attr('opacity',0.95).attr('font-weight','bold').style('pointer-events','none');
                            }
                        }
                    }
                });
            }
            function drawWinds() {
                gWinds.selectAll('*').remove();
                if (!windsVisible) return;
                windsData.forEach(function(d) {
                    var color = d.type === 'trade' ? MAP_COLORS.winds.trade : d.type === 'westerly' ? MAP_COLORS.winds.westerly : d.type === 'polar' ? MAP_COLORS.winds.polar : d.type === 'monsoon' ? MAP_COLORS.winds.monsoon : MAP_COLORS.winds.other;
                    var line = gWinds.append('path').datum({type:'LineString', coordinates:d.coords}).attr('d', pathGen).attr('fill','none').attr('stroke',color).attr('stroke-width',isMobile?3:5).attr('opacity',0.7).attr('stroke-dasharray','5,5').attr('vector-effect','non-scaling-stroke').style('cursor','pointer').on('click',function(){showFeatureDetail('wind',d);});
                    gWinds.append('path').datum({type:'LineString', coordinates:d.coords}).attr('d', pathGen).attr('fill','none').attr('stroke','transparent').attr('stroke-width',isMobile?16:24).style('cursor','pointer').on('click',function(){showFeatureDetail('wind',d);});
                    var last = d.coords[d.coords.length-1];
                    var xy = projection(last);
                    if (xy && !isNaN(xy[0])) {
                        gWinds.append('text').attr('x',xy[0]).attr('y',xy[1]).text('➤').attr('fill',color).attr('font-size',isMobile?14:20).attr('opacity',0.85).style('pointer-events','none').style('cursor','pointer');
                    }
                    var mid = d.coords[Math.floor(d.coords.length/2)];
                    var mxy = projection(mid);
                    if (mxy && !isNaN(mxy[0])) {
                        gWinds.append('text').attr('x',mxy[0]).attr('y',mxy[1]-8).text(function(){return lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):d.name_en;}).attr('fill','#fff').attr('font-size',isMobile?9:13).attr('font-weight','bold').attr('opacity',0.95).style('pointer-events','none').style('text-shadow','0 0 5px rgba(0,0,0,0.7)');
                    }
                });
            }
            function showEarthquakeDetail(d) {
                selectedFeature = d;
                selectedFeatureType = 'earthquake';
                var displayName = lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):d.name_en;
                var html = '<h3>🏚️ '+displayName+'</h3>';
                if (d.magnitude) html += '<p><strong>'+t('magnitude')+':</strong> '+d.magnitude+'</p>';
                if (d.year) html += '<p><strong>'+t('year')+':</strong> '+d.year+'</p>';
                if (d.plate_ar||d.plate_en) html += '<p><strong>'+t('tectonicPlate')+':</strong> '+(lang==='ar'?d.plate_ar:lang==='ru'?(d.plate_ru||d.plate_en):d.plate_en)+'</p>';
                if (d.description_ar||d.description_en) html += '<p><strong>'+t('featureDescription')+':</strong> '+(lang==='ar'?d.description_ar:lang==='ru'?(d.description_ru||d.description_en):d.description_en)+'</p>';
                _lastPanelRenderTime = performance.now();
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }
            function showTectonicPlateDetail(d) {
                selectedFeature = d;
                selectedFeatureType = 'tectonicPlate';
                var displayName = lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):d.name_en;
                var html = '<h3>🗿 '+displayName+'</h3>';
                html += '<p>'+t('tectonicPlates')+'</p>';
                _lastPanelRenderTime = performance.now();
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }
            function drawEarthquakes() {
                gEarthquakes.selectAll('*').remove();
                if (!earthquakesVisible) return;
                var plateColors = MAP_COLORS.tectonicPlates;
                tectonicPlatesData.forEach(function(p,i){
                    var pathD = pathGen({type:'Polygon',coordinates:[p.coords]});
                    if (pathD) {
                        gEarthquakes.append('path').attr('d',pathD).attr('fill',plateColors[i%plateColors.length]).attr('opacity',0.04).attr('stroke',plateColors[i%plateColors.length]).attr('stroke-width',1).attr('stroke-dasharray','3,3').attr('vector-effect','non-scaling-stroke').style('cursor','pointer').on('click',function(){showTectonicPlateDetail(p);});
                        var mid = p.coords[Math.floor(p.coords.length/2)];
                        var mxy = projection(mid);
                        if (mxy&&!isNaN(mxy[0])) {
                            gEarthquakes.append('text').attr('x',mxy[0]).attr('y',mxy[1]).text(function(){return lang==='ar'?p.name:lang==='ru'?(p.name_ru||p.name_en):p.name_en;}).attr('fill','#fff').attr('font-size',isMobile?8:11).attr('opacity',0.7).attr('text-anchor','middle').style('pointer-events','none');
                        }
                    }
                });
                earthquakesData.forEach(function(d) {
                    var coordsList = Array.isArray(d.coords[0]) ? d.coords : [d.coords];
                    var mainCoord = coordsList[0];
                    var xy = projection(mainCoord);
                    if (!xy || isNaN(xy[0])) return;
                    var eqColor = d.magnitude >= 9 ? MAP_COLORS.earthquakes.major9 : d.magnitude >= 8 ? MAP_COLORS.earthquakes.major8 : d.magnitude >= 7 ? MAP_COLORS.earthquakes.major7 : d.magnitude >= 6 ? MAP_COLORS.earthquakes.major6 : MAP_COLORS.earthquakes.below6;
                    var r = isMobile ? 8 : 12;
                    gEarthquakes.append('circle').attr('cx',xy[0]).attr('cy',xy[1]).attr('r',r).attr('fill',eqColor).attr('opacity',0.85).attr('stroke','#fff').attr('stroke-width',1.5).style('cursor','pointer').on('click',function(){showEarthquakeDetail(d);});
                    gEarthquakes.append('circle').attr('cx',xy[0]).attr('cy',xy[1]).attr('r',r+4).attr('fill','transparent').style('cursor','pointer').on('click',function(){showEarthquakeDetail(d);});
                });
            }
            function showVolcanoDetail(d) {
                selectedFeature = d;
                selectedFeatureType = 'volcano';
                var displayName = lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):d.name_en;
                var html = '<h3>🌋 '+displayName+'</h3>';
                if (d.elevation) html += '<p><strong>'+t('tooltipElevation')+':</strong> '+d.elevation.toLocaleString('en')+' '+t('elevationUnit')+'</p>';
                if (d.type) html += '<p><strong>'+t('volcanoType')+':</strong> '+(lang==='ar'?d.type_ar||d.type:lang==='ru'?(d.type_ru||d.type_en||d.type):d.type_en||d.type)+'</p>';
                if (d.lastEruption) html += '<p><strong>'+t('lastEruption')+':</strong> '+d.lastEruption+'</p>';
                if (d.description_ar||d.description_en) html += '<p><strong>'+t('featureDescription')+':</strong> '+(lang==='ar'?d.description_ar:lang==='ru'?(d.description_ru||d.description_en):d.description_en)+'</p>';
                _lastPanelRenderTime = performance.now();
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }
            function drawVolcanoes() {
                gVolcanoes.selectAll('*').remove();
                if (!volcanoesVisible) return;
                volcanoesData.forEach(function(d) {
                    var xy = projection(Array.isArray(d.coords[0]) ? d.coords[0] : d.coords);
                    if (!xy || isNaN(xy[0])) return;
                    var px = xy[0], py = xy[1];
                    var s = isMobile ? 8 : 13;
                    var group = gVolcanoes.append('g').style('cursor','pointer').on('click',function(){showVolcanoDetail(d);});
                    group.append('path').attr('d','M'+px+','+(py-s)+' L'+(px-s*0.7)+','+(py+s*0.5)+' L'+(px+s*0.7)+','+(py+s*0.5)+' Z').attr('fill',MAP_COLORS.volcanoes.fill).attr('stroke',MAP_COLORS.volcanoes.stroke).attr('stroke-width',1).attr('opacity',0.9);
                    group.append('circle').attr('cx',px).attr('cy',py-s*0.2).attr('r',isMobile?3:4).attr('fill',MAP_COLORS.volcanoes.glow).attr('opacity',0.8);
                    group.append('text').attr('x',px+s+3).attr('y',py+2).text(function(){return lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):d.name_en;}).attr('fill',MAP_COLORS.volcanoes.fill).attr('font-size',isMobile?9:12).attr('font-weight','bold').style('pointer-events','none');
                });
            }
            function drawGeopoliticalBlocs() {
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
                            var cleanName = getCleanName(name);
                            if (bloc.members.some(function(m){return getCleanName(m)===cleanName;})) {
                                var pathData = pathGen(f);
                                if (pathData) {
                                    gGeopoliticalBlocs.append('path').attr('d',pathData).attr('fill',blocColor).attr('opacity',0.3).attr('stroke',blocColor).attr('stroke-width',1.5).attr('vector-effect','non-scaling-stroke').style('pointer-events','none');
                                    var centroid = d3.geoPath().projection(projection).centroid(f);
                                    if (centroid && !isNaN(centroid[0])) {
                                        gGeopoliticalBlocs.append('text').attr('x',centroid[0]).attr('y',centroid[1]).text(function(){return getDisplayName(name);}).attr('fill','#fff').attr('font-size',fs).attr('font-weight','bold').attr('text-anchor','middle').attr('pointer-events','none').attr('opacity',0.9);
                                    }
                                }
                            }
                        });
                    }
                }
            }
            function showDesertForestDetail(d) {
                selectedFeature = d;
                selectedFeatureType = 'desertForest';
                var displayName = lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):d.name_en;
                var typeIcon = d.type==='desert'?'🏜️':'🌲';
                var html = '<h3>'+typeIcon+' '+displayName+'</h3>';
                if (d.area_km2) html += '<p><strong>'+t('areaTitle')+':</strong> '+d.area_km2.toLocaleString('en')+' '+t('km2')+'</p>';
                if (d.countries_ar||d.countries_en) html += '<p><strong>'+t('featureCountries')+':</strong> '+(lang==='ar'?d.countries_ar:lang==='ru'?(d.countries_ru||d.countries_en):d.countries_en)+'</p>';
                if (d.biome_ar||d.biome_en) html += '<p><strong>'+t('biome')+':</strong> '+(lang==='ar'?d.biome_ar:lang==='ru'?(d.biome_ru||d.biome_en):d.biome_en)+'</p>';
                if (d.description_ar||d.description_en) html += '<p><strong>'+t('featureDescription')+':</strong> '+(lang==='ar'?d.description_ar:lang==='ru'?(d.description_ru||d.description_en):d.description_en)+'</p>';
                _lastPanelRenderTime = performance.now();
                panelContent.innerHTML = html;
                countryPanel.style.display = 'block';
                requestAnimationFrame(function(){requestAnimationFrame(function(){countryPanel.classList.add('visible');});});
            }
            function drawDesertsForests() {
                gDesertsForests.selectAll('*').remove();
                if (!desertsForestsVisible) return;
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
                        var mxy = projection(mid);
                        if (mxy && !isNaN(mxy[0])) {
                            var labelText = lang === 'ar' ? d.name : lang === 'ru' ? (d.name_ru || d.name_en) : d.name_en;
                            var fontSize = Math.max(3, Math.min(15, (isMobile ? 9 : 12) / k));
                            gDesertsForests.append('text').attr('x',mxy[0]).attr('y',mxy[1]).text(labelText).attr('fill','#fff').attr('font-size',fontSize).attr('font-weight','bold').attr('text-anchor','middle').attr('opacity',0.95).style('pointer-events','none');
                            gDesertsForests.append('circle').datum(d).attr('cx',mxy[0]).attr('cy',mxy[1]).attr('r',isMobile?20:30).attr('fill','transparent').style('cursor','pointer').on('click',function(e,dd){showDesertForestDetail(dd);});
                        }
                    }
                });
            }
            function drawBorderDisputes() {
                gBorderDisputes.selectAll('*').remove();
                if (!borderDisputesVisible) return;
                borderDisputesData.forEach(function(d) {
                    var p = projection(d.coords);
                    if (!p || isNaN(p[0])) return;
                    var color = d.type === 'active' ? MAP_COLORS.borderDisputes.active : d.type === 'ceasefire' ? MAP_COLORS.borderDisputes.ceasefire : MAP_COLORS.borderDisputes.maritime;
                    var k = Math.max(0.4, currentTransform.k);
                    var rBase = isMobile ? 7 : 11;
                    var r = rBase / k;
                    var x = p[0], y = p[1];
                    gBorderDisputes.append('circle').attr('cx',x).attr('cy',y).attr('r',Math.max(2, r*2.2)).attr('fill',color).attr('opacity',0.12).attr('vector-effect','non-scaling-stroke').style('pointer-events','none');
                    gBorderDisputes.append('circle').attr('cx',x).attr('cy',y).attr('r',Math.max(1.5, r*1.4)).attr('fill',color).attr('opacity',0.2).attr('vector-effect','non-scaling-stroke').style('pointer-events','none');
                    gBorderDisputes.append('circle').datum(d).attr('cx',x).attr('cy',y).attr('r',Math.max(1, r)).attr('fill',color).attr('stroke','#fff').attr('stroke-width',(isMobile?1:1.5)).attr('opacity',0.9).attr('vector-effect','non-scaling-stroke').style('cursor','pointer').on('click',function(e,dd){showBorderDisputeDetail(dd);});
                    gBorderDisputes.append('circle').attr('cx',x).attr('cy',y).attr('r',Math.max(3, r*3)).attr('fill','transparent').attr('stroke',color).attr('stroke-width',(isMobile?0.8:1.2)).attr('opacity',0.25).attr('vector-effect','non-scaling-stroke').style('pointer-events','none');
                    var labelText = lang === 'ar' ? d.name_ar : lang === 'ru' ? (d.name_ru || d.name_en) : d.name_en;
                    var fs = Math.max(3, Math.min(14, (isMobile ? 7 : 10) / k));
                    gBorderDisputes.append('text').attr('x',x).attr('y',y-r-3/k).text(labelText).attr('fill',color).attr('font-size',fs).attr('font-weight','bold').attr('text-anchor','middle').style('pointer-events','none');
                });
                var activeCount = borderDisputesData.filter(function(d){return d.type==='active';}).length;
                var ceasefireCount = borderDisputesData.filter(function(d){return d.type==='ceasefire';}).length;
                var maritimeCount = borderDisputesData.filter(function(d){return d.type==='maritime';}).length;
                gBorderDisputes.append('text').attr('x',10).attr('y',isMobile?12:16).text('⚔️ '+activeCount+'  ☮️ '+ceasefireCount+'  🌊 '+maritimeCount).attr('fill','rgba(255,255,255,0.6)').attr('font-size',isMobile?8:10).attr('font-weight','bold').style('pointer-events','none');
            }
            function showBorderDisputeDetail(d) {
                if (!d) return;
                var content = document.getElementById('panelContent');
                if (!content) return;
                var typeIcon = d.type === 'active' ? '⚔️' : d.type === 'ceasefire' ? '☮️' : '🌊';
                var typeLabel = d.type === 'active' ? (lang==='ar'?'نزاع نشط':lang==='ru'?'Активный конфликт':'Active Conflict') : d.type === 'ceasefire' ? (lang==='ar'?'وقف إطلاق نار':lang==='ru'?'Перемирие':'Ceasefire') : (lang==='ar'?'نزاع بحري':lang==='ru'?'Морской спор':'Maritime Dispute');
                var html = '<h3>'+(lang==='ar'?d.name_ar:lang==='ru'?(d.name_ru||d.name_en):d.name_en)+'</h3>';
                html += '<div style="margin-bottom:8px"><span style="font-size:1.4em">'+typeIcon+'</span> <strong style="color:'+(d.type==='active'?MAP_COLORS.borderDisputes.active:d.type==='ceasefire'?MAP_COLORS.borderDisputes.ceasefire:MAP_COLORS.borderDisputes.maritime)+'">'+typeLabel+'</strong></div>';
                html += '<p><strong>'+t('featureCountries')+':</strong> '+(lang==='ar'?d.countries_ar:lang==='ru'?(d.countries_ru||d.countries_en):d.countries_en)+'</p>';
                html += '<p><strong>'+(lang==='ar'?'الأسباب':lang==='ru'?'Причины':'Causes')+':</strong> '+(lang==='ar'?d.causes_ar:lang==='ru'?(d.causes_ru||d.causes_en):d.causes_en)+'</p>';
                _lastPanelRenderTime = performance.now();
                content.innerHTML = html;
                var panel = document.getElementById('countryPanel');
                if (panel) { panel.style.display = 'block';
                requestAnimationFrame(function(){requestAnimationFrame(function(){panel.classList.add('visible');});}); }
                selectedFeature = d;
                selectedFeatureType = 'borderDispute';
            }
            // ── Toggle functions ──
            function toggleNaturalResources() {
                naturalResourcesVisible = !naturalResourcesVisible;
                var btn = document.getElementById('naturalResourcesToggle');
                if (btn) btn.classList.toggle('toggle-on', naturalResourcesVisible);
                if (naturalResourcesVisible) setMode('normal');
                drawNaturalResources();
                updateLegend();
                updateHash();
                updateActiveLayerCount();
            }
            function toggleEthnicGroups() {
                ethnicGroupsVisible = !ethnicGroupsVisible;
                var btn = document.getElementById('ethnicGroupsToggle');
                if (btn) btn.classList.toggle('toggle-on', ethnicGroupsVisible);
                if (ethnicGroupsVisible) setMode('normal');
                drawEthnicGroups();
                updateLegend();
                updateHash();
                updateActiveLayerCount();
            }
            function toggleOceanCurrents() {
                oceanCurrentsVisible = !oceanCurrentsVisible;
                var btn = document.getElementById('oceanCurrentsToggle');
                if (btn) btn.classList.toggle('toggle-on', oceanCurrentsVisible);
                if (oceanCurrentsVisible) setMode('normal');
                drawOceanCurrents();
                updateLegend();
                updateHash();
                updateActiveLayerCount();
            }
            function toggleWinds() {
                windsVisible = !windsVisible;
                var btn = document.getElementById('windsToggle');
                if (btn) btn.classList.toggle('toggle-on', windsVisible);
                if (windsVisible) setMode('normal');
                drawWinds();
                updateLegend();
                updateHash();
                updateActiveLayerCount();
            }
            function toggleEarthquakes() {
                earthquakesVisible = !earthquakesVisible;
                var btn = document.getElementById('earthquakesToggle');
                if (btn) btn.classList.toggle('toggle-on', earthquakesVisible);
                if (earthquakesVisible) setMode('normal');
                drawEarthquakes();
                updateLegend();
                updateHash();
                updateActiveLayerCount();
            }
            function toggleVolcanoes() {
                volcanoesVisible = !volcanoesVisible;
                var btn = document.getElementById('volcanoesToggle');
                if (btn) btn.classList.toggle('toggle-on', volcanoesVisible);
                drawVolcanoes();
                updateLegend();
                updateHash();
                updateActiveLayerCount();
            }
            function toggleGeopoliticalBlocs() {
                geopoliticalBlocsVisible = !geopoliticalBlocsVisible;
                var btn = document.getElementById('geopoliticalBlocsToggle');
                if (btn) btn.classList.toggle('toggle-on', geopoliticalBlocsVisible);
                if (geopoliticalBlocsVisible) setMode('normal');
                if (!geopoliticalBlocsVisible) { selectedBloc = 'all'; var bs = document.getElementById('blocSelect'); if (bs) bs.value = 'all'; }
                drawGeopoliticalBlocs();
                updateLegend();
                updateHash();
                updateActiveLayerCount();
            }
            function toggleDesertsForests() {
                desertsForestsVisible = !desertsForestsVisible;
                var btn = document.getElementById('desertsForestsToggle');
                if (btn) btn.classList.toggle('toggle-on', desertsForestsVisible);
                if (desertsForestsVisible) setMode('normal');
                drawDesertsForests();
                updateLegend();
                updateHash();
                updateActiveLayerCount();
            }
            function toggleBorderDisputes() {
                borderDisputesVisible = !borderDisputesVisible;
                var btn = document.getElementById('borderDisputesToggle');
                if (btn) btn.classList.toggle('toggle-on', borderDisputesVisible);
                if (borderDisputesVisible) setMode('normal');
                drawBorderDisputes();
                updateLegend();
                updateHash();
                updateActiveLayerCount();
            }
            function toggleRivers() {
                riversVisible = !riversVisible;
                const btn = document.getElementById('riversToggle');
                if (btn) btn.classList.toggle('toggle-on', riversVisible);
                drawPhysicalFeatures();
                updateLegend();
                updateHash();
                updateActiveLayerCount();
            }

            function showWindDetail(d) {
                selectedFeature = d;
                selectedFeatureType = 'wind';
                var displayName = lang==='ar'?d.name:lang==='ru'?(d.name_ru||d.name_en):d.name_en;
                var typeLabels = {trade: lang==='ar'?'تجارية':lang==='ru'?'Пассаты':'Trade Winds', westerly: lang==='ar'?'غربية':lang==='ru'?'Западные':'Westerlies', polar: lang==='ar'?'قطبية':lang==='ru'?'Полярные':'Polar Easterlies', monsoon: lang==='ar'?'موسمية':lang==='ru'?'Муссоны':'Monsoon', seasonal: lang==='ar'?'موسمية':lang==='ru'?'Сезонные':'Seasonal'};
                var html = '<h3>💨 '+displayName+'</h3>';
                html += '<p><strong>'+t('windType')+':</strong> '+(typeLabels[d.type]||d.type)+'</p>';
                if (d.description_ar||d.description_en) html += '<p><strong>'+t('featureDescription')+':</strong> '+(lang==='ar'?d.description_ar:lang==='ru'?(d.description_ru||d.description_en):d.description_en)+'</p>';
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

                const isMountain = (type === 'mountain');
                const displayName = lang === 'ar' ? data.name : lang === 'ru' ? (data.name_ru || data.name_en || data.name) : (data.name_en || data.name);
                let html = `<h3>${isMountain ? t('featureMountainTitle') : t('featureRiverTitle')}: ${displayName}</h3>`;
                if (data.length) {
                    html += `<p><strong>${t('featureLength')}:</strong> ${data.length.toLocaleString('en')} ${t('featureKm')}</p>`;
                }
                if (isMountain) {
                    if (data.highestPeak) {
                        const peakName = lang === 'ar' ? data.highestPeak : lang === 'ru' ? (data.highestPeak_ru || data.highestPeak_en || data.highestPeak) : (data.highestPeak_en || data.highestPeak);
                        html += `<p><strong>${t('featureHighestPeak')}:</strong> ${peakName}`;
                        if (data.highestElevation) html += ` (${data.highestElevation.toLocaleString('en')} ${t('elevationUnit')})`;
                        html += `</p>`;
                    }
                } else {
                    if (data.source_ar || data.source_en) {
                        const src = lang === 'ar' ? data.source_ar : lang === 'ru' ? (data.source_ru || data.source_en) : data.source_en;
                        html += `<p><strong>${t('featureSource')}:</strong> ${src}</p>`;
                    }
                    if (data.mouth_ar || data.mouth_en) {
                        const mth = lang === 'ar' ? data.mouth_ar : lang === 'ru' ? (data.mouth_ru || data.mouth_en) : data.mouth_en;
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
                    const cnt = lang === 'ar' ? data.countries_ar : lang === 'ru' ? (data.countries_ru || data.countries_en) : data.countries_en;
                    html += `<p><strong>${t('featureCountries')}:</strong> ${cnt}</p>`;
                }
                if (data.description_ar || data.description_en) {
                    const desc = lang === 'ar' ? data.description_ar : lang === 'ru' ? (data.description_ru || data.description_en) : data.description_en;
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

            function drawPointLayersCanvas() {
                if (!densityCtx) return;
                const rect = mapContainer.getBoundingClientRect();
                const dpr = window.devicePixelRatio || 1;
                const targetW = rect.width * dpr;
                const targetH = rect.height * dpr;
                if (densityCanvas.width !== targetW || densityCanvas.height !== targetH) {
                    densityCanvas.width = targetW;
                    densityCanvas.height = targetH;
                    densityCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
                }
                densityCtx.clearRect(0, 0, rect.width, rect.height);
                const k = Math.max(0.4, currentTransform.k);
                const tx = currentTransform.x;
                const ty = currentTransform.y;
                var hasAny = false;

                // ── Density spots ──
                if (colorMode === 'density' && densitySpotsMode) {
                    hasAny = true;
                    const spots = isMobile ? densitySpots.slice(0, 40) : densitySpots;
                    const fontSize = Math.max(11, Math.round((isMobile ? 13 : 18) / k));
                    densityCtx.font = 'bold ' + fontSize + 'px -apple-system, BlinkMacSystemFont, "Noto Sans Arabic", Tahoma, sans-serif';
                    densityCtx.textBaseline = 'middle';
                    spots.forEach(s => {
                        const [x, y] = projection(s.coords);
                        if (isNaN(x) || isNaN(y)) return;
                        const sx = x * k + tx;
                        const sy = y * k + ty;
                        const margin = 60;
                        if (sx < -margin || sx > rect.width + margin || sy < -margin || sy > rect.height + margin) return;
                        const baseR = Math.max(3, Math.sqrt(s.density) / (isMobile ? 40 : 30));
                        const color = s.density > 10000 ? MAP_COLORS.densitySpots.high : s.density > 4000 ? MAP_COLORS.densitySpots.medium : MAP_COLORS.densitySpots.low;
                        const r1 = Math.max(3, baseR / k);
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
                        densityCtx.beginPath();
                        densityCtx.arc(sx, sy, r1, 0, Math.PI * 2);
                        densityCtx.globalAlpha = 0.95;
                        densityCtx.fill();
                        densityCtx.strokeStyle = MAP_COLORS.ui.white;
                        densityCtx.lineWidth = 1.2;
                        densityCtx.stroke();
                        densityCtx.globalAlpha = 1;
                        var label = lang === 'ar' ? s.name : lang === 'ru' ? (densitySpotRussian[s.name] || densitySpotEnglish[s.name] || s.name) : (densitySpotEnglish[s.name] || s.name);
                        densityCtx.lineWidth = 3;
                        densityCtx.strokeStyle = MAP_COLORS.ui.textStroke;
                        densityCtx.lineJoin = 'round';
                        densityCtx.strokeText(label, sx + r1 + 3 / k, sy);
                        densityCtx.fillStyle = MAP_COLORS.ui.white;
                        densityCtx.fillText(label, sx + r1 + 3 / k, sy);
                    });
                }

                // ── Capitals ──
                if (capitalsVisible) {
                    hasAny = true;
                    const dotSize = Math.max(3.5, (isMobile ? 4 : 5.5) / k);
                    const haloSize = Math.max(5, (isMobile ? 7 : 10) / k);
                    const fontSize = Math.max(11, Math.round((isMobile ? 12 : 15) / k));
                    densityCtx.font = 'bold ' + fontSize + 'px -apple-system, BlinkMacSystemFont, "Noto Sans Arabic", Tahoma, sans-serif';
                    densityCtx.textBaseline = 'middle';
                    Object.entries(countryInfo).forEach(([name, info]) => {
                        if (!info.capital_coords) return;
                        const [x, y] = projection(info.capital_coords);
                        if (isNaN(x) || isNaN(y)) return;
                        const sx = x * k + tx;
                        const sy = y * k + ty;
                        const margin = 60;
                        if (sx < -margin || sx > rect.width + margin || sy < -margin || sy > rect.height + margin) return;
                        densityCtx.beginPath();
                        densityCtx.arc(sx, sy, haloSize, 0, Math.PI * 2);
                        densityCtx.fillStyle = MAP_COLORS.capitals.fill;
                        densityCtx.globalAlpha = 0.15;
                        densityCtx.fill();
                        densityCtx.beginPath();
                        densityCtx.arc(sx, sy, dotSize, 0, Math.PI * 2);
                        densityCtx.fillStyle = MAP_COLORS.capitals.fill;
                        densityCtx.globalAlpha = 0.95;
                        densityCtx.fill();
                        densityCtx.strokeStyle = MAP_COLORS.capitals.stroke;
                        densityCtx.lineWidth = 1;
                        densityCtx.stroke();
                        const label = lang === 'ar' ? info.capital_ar : lang === 'ru' ? (info.capital_ru || info.capital_en) : info.capital_en;
                        densityCtx.globalAlpha = 1;
                        densityCtx.lineWidth = 3;
                        densityCtx.strokeStyle = MAP_COLORS.ui.textStroke;
                        densityCtx.lineJoin = 'round';
                        densityCtx.strokeText(label, sx + dotSize + 3 / k, sy);
                        densityCtx.fillStyle = MAP_COLORS.ui.white;
                        densityCtx.fillText(label, sx + dotSize + 3 / k, sy);
                    });
                }

                // ── Major cities ──
                if (majorCitiesVisible) {
                    hasAny = true;
                    const citySize = Math.max(4.5, (isMobile ? 7 : 10) / k);
                    const cityCatColors = MAP_COLORS.cities;
                    const fontSize = Math.max(11, Math.round((isMobile ? 13 : 17) / k));
                    densityCtx.font = 'bold ' + fontSize + 'px -apple-system, BlinkMacSystemFont, "Noto Sans Arabic", Tahoma, sans-serif';
                    densityCtx.textBaseline = 'middle';
                    majorCitiesData.forEach(city => {
                        const [x, y] = projection(city.coords);
                        if (isNaN(x) || isNaN(y)) return;
                        const sx = x * k + tx;
                        const sy = y * k + ty;
                        const margin = 60;
                        if (sx < -margin || sx > rect.width + margin || sy < -margin || sy > rect.height + margin) return;
                        const fillColor = cityCatColors[city.category] || MAP_COLORS.cities.other;
                        densityCtx.beginPath();
                        densityCtx.arc(sx, sy, citySize, 0, Math.PI * 2);
                        densityCtx.fillStyle = fillColor;
                        densityCtx.globalAlpha = 0.9;
                        densityCtx.fill();
                        densityCtx.strokeStyle = MAP_COLORS.ui.white;
                        densityCtx.lineWidth = 1.2;
                        densityCtx.stroke();
                        const label = lang === 'ar' ? city.name : lang === 'ru' ? (city.name_ru || city.name_en || city.name) : (city.name_en || city.name);
                        densityCtx.globalAlpha = 1;
                        densityCtx.lineWidth = 3;
                        densityCtx.strokeStyle = MAP_COLORS.ui.textStroke;
                        densityCtx.lineJoin = 'round';
                        densityCtx.strokeText(label, sx + citySize + 3 / k, sy);
                        densityCtx.fillStyle = MAP_COLORS.ui.white;
                        densityCtx.fillText(label, sx + citySize + 3 / k, sy);
                    });
                }
            }

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
                const labelGroup = gCountries.append('g').attr('class', 'country-label-group');
                const featuresToLabel = isMobile ? features.filter(d => d3.geoArea(d) > 0.005) : features;
                featuresToLabel.forEach(d => {
                    const name = d.properties?.name || '';
                    const displayName = getDisplayName(name);
                    const area = d3.geoArea(d);
                    if (threshold >= 0 && area < threshold) return;

                    let centroid;
                    if (labelPositions[name]) {
                        const [lon, lat] = labelPositions[name];
                        centroid = projection([lon, lat]);
                    } else {
                        const c = d3.geoCentroid(d);
                        centroid = projection(c);
                    }
                    if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1])) {
                        try {
                            const c = d3.geoPath(projection).centroid(d);
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
                if (countryLabelSelection) {
                    countryLabelSelection.remove();
                    countryLabelSelection = null;
                }
                if (showLabels) {
                    drawCountryLabels(allCountryFeatures);
                } else {
                    gCountries.selectAll('.country-label-group').remove();
                    countryLabelSelection = null;
                }
                updateLegend();
                updateHash();
                updateActiveLayerCount();
            }

            function updateCoordinatesDisplay(event) {
                if (!coordsVisible) {
                    coordinatesDisplay.classList.add('hidden');
                    return;
                }
                coordinatesDisplay.classList.remove('hidden');
                const rect = mapContainer.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                // Account for the zoom/pan transform when inverting screen coords
                // back through the projection. Without this, invert() returns
                // wrong coordinates whenever the user has zoomed or panned.
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

            function updateAllStyles() {
                if (!countryPaths) return;
                countryPaths.transition().duration(400)
                    .attr('fill', d => getCountryFill(d))
                    .attr('opacity', d => getOpacity(d));
                countryPaths.attr('stroke', d => getStroke(d))
                    .attr('stroke-width', d => getStrokeWidth(d));
                if (countryLabelSelection) {
                    countryLabelSelection.remove();
                    countryLabelSelection = null;
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
                var toggles = document.querySelectorAll('.layers-row .btn.toggle-on');
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
                    html += `<div style="font-size:0.8em;color:var(--text-secondary);margin-top:2px">${lang==='ar'?'نسمة/كم²':lang==='ru'?'чел/км²':'people/km²'}</div>`;
                } else if (colorMode === 'precipitation') {
                    html += `<div style="font-weight:700;margin-bottom:4px">${t('precipitationLegend')}</div>`;
                    const stops = [getPrecipitationColor(30),getPrecipitationColor(200),getPrecipitationColor(700),getPrecipitationColor(1800),getPrecipitationColor(3200)].join(',');
                    html += `<div class="legend-gradient-labels"><span>&lt;100</span><span>&gt;3000</span></div>`;
                    html += `<div class="legend-gradient-bar" style="background:linear-gradient(to right,${stops})"></div>`;
                    html += `<div style="font-size:0.8em;color:var(--text-secondary);margin-top:2px">${lang==='ar'?'مم/سنة':lang==='ru'?'мм/год':'mm/year'}</div>`;
                } else if (colorMode === 'temperature') {
                    html += `<div style="font-weight:700;margin-bottom:4px">${t('temperatureLegend')}</div>`;
                    const stops = [getTempColor(-15),getTempColor(-3),getTempColor(8),getTempColor(18),getTempColor(28),getTempColor(35)].join(',');
                    html += `<div class="legend-gradient-labels"><span>&lt;0°</span><span>&gt;30°</span></div>`;
                    html += `<div class="legend-gradient-bar" style="background:linear-gradient(to right,${stops})"></div>`;
                    html += `<div style="font-size:0.8em;color:var(--text-secondary);margin-top:2px">${lang==='ar'?'درجة مئوية':lang==='ru'?'°C':'°C'}</div>`;
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
                        const label = sectMode ? (lang === 'ar' ? (denominationArabic[k] || k) : lang === 'ru' ? (denominationRussian[k] || k) : k) : (lang === 'ar' ? (religionArabic[k] || k) : lang === 'ru' ? (religionRussian[k] || k) : k);
                        html +=
                            `<div class="legend-item"><span class="legend-color" style="background:${v}"></span>${label}</div>`;
                    });
                }
                if (corridorsVisible||additionalWaterwaysVisible) html += `<div>🛣️ ${t('routes')}</div>`;
                if (riversVisible) html += `<div>${t('riversOn')}</div>`;
                if (densitySpotsMode && colorMode === 'density') html += `<div>${t('spotsOn')}</div>`;
                if (capitalsVisible) html += `<div>${t('capitalsOn')}</div>`;
                if (timezonesVisible) html += `<div>${t('timezonesOn')}</div>`;
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
                    html += `<div style="font-size:0.8em;color:var(--text-secondary)">${lang==='ar'?'كل نقطة بلون مختلف تمثل مجموعة عرقية مستقلة — انقر لعرض التفاصيل':lang==='ru'?'Каждая цветная точка представляет отдельную этническую/культурную группу — нажмите для подробностей':'Each colored dot represents a distinct ethnic/cultural group — click for details'}</div>`;
                }
                if (oceanCurrentsVisible) {
                    html += `<div style="font-weight:700;margin-bottom:4px">${t('oceanCurrentsLegend')}</div>`;
                    var currentLegendItems = [
                        { c: MAP_COLORS.oceanCurrents.warm, l: lang==='ar'?'تيار دافئ':lang==='ru'?'Тёплое течение':'Warm current' },
                        { c: MAP_COLORS.oceanCurrents.cold, l: lang==='ar'?'تيار بارد':lang==='ru'?'Холодное течение':'Cold current' },
                        { c: MAP_COLORS.oceanCurrents.gyre, l: lang==='ar'?'دوامة محيطية':lang==='ru'?'Океанский круговорот':'Ocean gyre' },
                        { c: MAP_COLORS.oceanCurrents.trench, l: lang==='ar'?'خندق محيطي':lang==='ru'?'Океанский жёлоб':'Ocean trench' }
                    ];
                    currentLegendItems.forEach(function(it){ html += `<div class="legend-item"><span class="legend-color" style="background:${it.c}"></span>${it.l}</div>`; });
                }
                if (windsVisible) {
                    html += `<div style="font-weight:700;margin-bottom:4px">${t('windsLegend')}</div>`;
                    var windLegendItems = [
                        { c: MAP_COLORS.winds.trade, l: lang==='ar'?'رياح تجارية':lang==='ru'?'Пассаты':'Trade winds' },
                        { c: MAP_COLORS.winds.westerly, l: lang==='ar'?'رياح غربية':lang==='ru'?'Западные':'Westerlies' },
                        { c: MAP_COLORS.winds.polar, l: lang==='ar'?'رياح قطبية':lang==='ru'?'Полярные':'Polar winds' },
                        { c: MAP_COLORS.winds.monsoon, l: lang==='ar'?'رياح موسمية':lang==='ru'?'Муссоны':'Monsoon winds' }
                    ];
                    windLegendItems.forEach(function(it){ html += `<div class="legend-item"><span class="legend-color" style="background:${it.c}"></span>${it.l}</div>`; });
                }
                if (earthquakesVisible) {
                    html += `<div style="font-weight:700;margin-bottom:4px">${t('earthquakesLegend')}</div>`;
                    var quakeLegendItems = [
                        { c: MAP_COLORS.earthquakes.major9, l: lang==='ar'?'≥ 9.0 درجة':lang==='ru'?'Магнитуда ≥ 9.0':'Magnitude ≥ 9.0' },
                        { c: MAP_COLORS.earthquakes.major8, l: lang==='ar'?'8.0 – 8.9':lang==='ru'?'8.0 – 8.9':'8.0 – 8.9' },
                        { c: MAP_COLORS.earthquakes.major7, l: lang==='ar'?'7.0 – 7.9':lang==='ru'?'7.0 – 7.9':'7.0 – 7.9' },
                        { c: MAP_COLORS.earthquakes.major6, l: lang==='ar'?'6.0 – 6.9':lang==='ru'?'6.0 – 6.9':'6.0 – 6.9' },
                        { c: MAP_COLORS.earthquakes.below6, l: lang==='ar'?'أقل من 6.0':lang==='ru'?'Ниже 6.0':'Below 6.0' }
                    ];
                    quakeLegendItems.forEach(function(it){ html += `<div class="legend-item"><span class="legend-color" style="background:${it.c}"></span>${it.l}</div>`; });
                }
                if (volcanoesVisible) {
                    html += `<div style="font-weight:700;margin-bottom:4px">${t('volcanoesLegend')}</div>`;
                    html += `<div style="font-size:0.8em;color:var(--text-secondary)">${lang==='ar'?'▲ يمثل كل رمز مثلثي بركاناً — انقر لعرض التفاصيل':lang==='ru'?'▲ Каждый треугольник — вулкан — нажмите для подробностей':'▲ Each triangle marker is a volcano — click for details'}</div>`;
                }
                if (geopoliticalBlocsVisible) {
                    html += `<div style="font-weight:700;margin-bottom:4px">${t('geopoliticalBlocsLegend')}</div>`;
                    if (selectedBloc !== 'all') {
                        var selBloc = geopoliticalBlocsData.find(function(b){return b.name_en===selectedBloc||b.name===selectedBloc;});
                        if (selBloc) html += `<div style="font-size:0.85em;color:${selBloc.color};margin-top:2px">◉ ${lang==='ar'?selBloc.name:selBloc.name_en}</div>`;
                    } else {
                        html += `<div style="font-size:0.8em;color:var(--text-secondary)">${lang==='ar'?'اختر تكتلاً من القائمة المنسدلة لتظليل أعضائه على الخريطة':lang==='ru'?'Выберите блок из списка, чтобы подсветить его членов на карте':'Pick a bloc from the dropdown to highlight its members on the map'}</div>`;
                    }
                }
                if (desertsForestsVisible) {
                    html += `<div style="font-weight:700;margin-bottom:4px">${t('desertsForestsLegend')}</div>`;
                    html += `<div class="legend-item"><span class="legend-color" style="background:${MAP_COLORS.desertsForests.desert}"></span>${lang==='ar'?'صحراء':lang==='ru'?'Пустыня':'Desert'}</div>`;
                    html += `<div class="legend-item"><span class="legend-color" style="background:${MAP_COLORS.desertsForests.forest}"></span>${lang==='ar'?'غابة':lang==='ru'?'Лес':'Forest'}</div>`;
                }
                if (borderDisputesVisible) {
                    html += `<div style="font-weight:700;margin-bottom:4px">${t('borderDisputesLegend')}</div>`;
                    html += `<div class="legend-item"><span class="legend-color" style="background:${MAP_COLORS.borderDisputes.active}"></span>${lang==='ar'?'نزاع نشط':lang==='ru'?'Активный конфликт':'Active conflict'}</div>`;
                    html += `<div class="legend-item"><span class="legend-color" style="background:${MAP_COLORS.borderDisputes.ceasefire}"></span>${lang==='ar'?'وقف إطلاق نار':lang==='ru'?'Перемирие':'Ceasefire'}</div>`;
                    html += `<div class="legend-item"><span class="legend-color" style="background:${MAP_COLORS.borderDisputes.maritime}"></span>${lang==='ar'?'نزاع بحري':lang==='ru'?'Морской спор':'Maritime dispute'}</div>`;
                }
                if (colorMode === 'terrain' || riversVisible) html += `<div style="margin-top:4px;font-size:0.85em;color:var(--text-secondary)">${t('featureClickHint')}</div>`;
                legendEl.innerHTML = html;
            }

            function setMode(mode) {
                if (colorMode === mode) return;
                const previousMode = colorMode;
                colorMode = mode;
                if (previousMode === 'density' && mode !== 'density' && densitySpotsMode) {
                    densitySpotsMode = false;
                    densitySpotsToggle.classList.remove('toggle-on');
                    if (densityCtx) densityCtx.clearRect(0, 0, densityCanvas.width, densityCanvas.height);
                }
                modeButtons.forEach(b => b.classList.remove('active'));
                document.querySelector(`.mode-btn[data-mode="${mode}"]`).classList.add('active');
                requestAnimationFrame(function() { updateAllStyles(); });
                updateCoordinatesDisplay({ clientX: 0, clientY: 0 });
            }

            function toggleSect() {
                sectMode = !sectMode;
                sectToggle.classList.toggle('toggle-on', sectMode);
                if (sectMode && colorMode !== 'religion') setMode('religion');
                else updateAllStyles();
                updateActiveLayerCount();
            }

            function toggleRoutes() {
                corridorsVisible = !corridorsVisible;
                additionalWaterwaysVisible = corridorsVisible;
                corridorsToggle.classList.toggle('toggle-on', corridorsVisible);
                drawRoutes();
                updateLegend();
                updateActiveLayerCount();
            }
            function toggleCorridors() { toggleRoutes(); }
            function toggleAdditionalWaterways() { toggleRoutes(); }

            function toggleDensitySpots() {
                densitySpotsMode = !densitySpotsMode;
                densitySpotsToggle.classList.toggle('toggle-on', densitySpotsMode);
                if (densitySpotsMode && colorMode !== 'density') {
                    setMode('density');
                } else {
                    drawPointLayersCanvas();
                    updateLegend();
                }
                updateActiveLayerCount();
            }

            function toggleCapitals() {
                capitalsVisible = !capitalsVisible;
                capitalsToggle.classList.toggle('toggle-on', capitalsVisible);
                drawCapitals();
                drawPointLayersCanvas();
                updateLegend();
                updateActiveLayerCount();
            }

            function toggleTimezones() {
                timezonesVisible = !timezonesVisible;
                timezonesToggle.classList.toggle('toggle-on', timezonesVisible);
                drawTimezones();
                updateLegend();
                updateActiveLayerCount();
            }

            function toggleMajorCities() {
                majorCitiesVisible = !majorCitiesVisible;
                majorCitiesToggle.classList.toggle('toggle-on', majorCitiesVisible);
                drawMajorCities();
                drawPointLayersCanvas();
                updateLegend();
                updateActiveLayerCount();
            }

            function toggleCoords() {
                coordsVisible = !coordsVisible;
                coordsToggle.classList.toggle('toggle-on', coordsVisible);
                if (coordsVisible) {
                    coordinatesDisplay.classList.remove('hidden');
                } else {
                    coordinatesDisplay.classList.add('hidden');
                }
                updateHash();
                updateActiveLayerCount();
            }

            function setLanguage(l) {
                lang = l;
                applyLanguage();
            }

            function setBtnText(el, text) {
                var span = el.querySelector('.btn-text');
                if (span) { span.textContent = text; }
                else { el.textContent = text; }
            }
            function applyLanguage() {
                document.documentElement.setAttribute('lang', lang === 'ar' ? 'ar' : lang === 'ru' ? 'ru' : 'en');
                document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
                var rowLangLabel = document.getElementById('rowLangLabel');
                if (rowLangLabel) rowLangLabel.textContent = t('rowLangLabel');
                var rowModeLabel = document.getElementById('rowModeLabel');
                if (rowModeLabel) rowModeLabel.textContent = t('rowModeLabel');
                setBtnText(document.getElementById('rowFilterLabel'), t('rowFilterLabel'));
                setBtnText(document.getElementById('mobileFilterLabel'), t('rowFilterLabel'));
                setBtnText(document.getElementById('sectionToolsLabel'), t('sectionTools'));
                setBtnText(document.getElementById('sectionBaseMapLabel'), t('sectionBaseMap'));
                setBtnText(document.getElementById('sectionDataLayersLabel'), t('sectionDataLayers'));
                if (layersToggleBtn) layersToggleBtn.title = t('layersToggle');
                var layersTitle = document.getElementById('layersModalTitle');
                setBtnText(layersTitle, t('layersModalTitle'));

                setBtnText(labelsToggle, t('labelsToggle'));
                var langToggleText = document.getElementById('langToggleText');
                if (langToggleText) langToggleText.textContent = t('langButton');
                var mobileLangToggleText = document.getElementById('mobileLangToggleText');
                if (mobileLangToggleText) mobileLangToggleText.textContent = t('langButton');
                document.querySelectorAll('.lang-option').forEach(function(opt) {
                    opt.classList.toggle('active', opt.dataset.lang === lang);
                });
                setBtnText(sectToggle, t('sectToggle'));
                setBtnText(corridorsToggle, t('corridorsToggle'));
                setBtnText(riversToggle, t('riversToggle'));
                setBtnText(densitySpotsToggle, t('densitySpotsToggle'));
                setBtnText(capitalsToggle, t('capitalsToggle'));
                setBtnText(timezonesToggle, t('timezonesToggle'));
                setBtnText(majorCitiesToggle, t('majorCitiesToggle'));
                setBtnText(coordsToggle, t('coordsToggle'));
                setBtnText(document.getElementById('naturalResourcesToggle'), t('naturalResources'));
                setBtnText(document.getElementById('ethnicGroupsToggle'), t('ethnicGroups'));
                setBtnText(document.getElementById('oceanCurrentsToggle'), t('oceanCurrents'));
                setBtnText(document.getElementById('windsToggle'), t('winds'));
                setBtnText(document.getElementById('earthquakesToggle'), t('earthquakes'));
                setBtnText(document.getElementById('volcanoesToggle'), t('volcanoes'));
                setBtnText(document.getElementById('geopoliticalBlocsToggle'), t('geopoliticalBlocs'));
                var blocSelect = document.getElementById('blocSelect');
                var currentVal = blocSelect.value;
                blocSelect.options.length = 1;
                geopoliticalBlocsData.forEach(function(b) {
                    var opt = document.createElement('option');
                    opt.value = b.name_en;
                    opt.textContent = (lang === 'ar' ? b.name : lang === 'ru' ? (b.name_ru || b.name_en) : b.name_en) + ' (' + (lang === 'ar' ? b.members_ar : lang === 'ru' ? (b.members_ru || b.members_en) : b.members_en) + ')';
                    blocSelect.appendChild(opt);
                });
                blocSelect.options[0].textContent = t('blocAll');
                blocSelect.title = t('blocSelect_title');
                blocSelect.value = currentVal;
                setBtnText(document.getElementById('desertsForestsToggle'), t('desertsForests'));
                setBtnText(document.getElementById('borderDisputesToggle'), t('borderDisputes'));
                labelsToggle.title = t('labelsToggle_title');
                sectToggle.title = t('sectToggle_title');
                corridorsToggle.title = t('routesToggle_title');
                riversToggle.title = t('riversToggle_title');
                densitySpotsToggle.title = t('densitySpotsToggle_title');
                capitalsToggle.title = t('capitalsToggle_title');
                timezonesToggle.title = t('timezonesToggle_title');
                majorCitiesToggle.title = t('majorCitiesToggle_title');
                coordsToggle.title = t('coordsToggle_title');
                document.getElementById('naturalResourcesToggle').title = t('naturalResourcesToggle_title');
                document.getElementById('ethnicGroupsToggle').title = t('ethnicGroupsToggle_title');
                document.getElementById('oceanCurrentsToggle').title = t('oceanCurrentsToggle_title');
                document.getElementById('windsToggle').title = t('windsToggle_title');
                document.getElementById('earthquakesToggle').title = t('earthquakesToggle_title');
                document.getElementById('volcanoesToggle').title = t('volcanoesToggle_title');
                document.getElementById('geopoliticalBlocsToggle').title = t('geopoliticalBlocsToggle_title');
                document.getElementById('desertsForestsToggle').title = t('desertsForestsToggle_title');
                document.getElementById('borderDisputesToggle').title = t('borderDisputesToggle_title');
                shareBtn.title = t('shareBtn');
                resetBtn.title = t('resetBtn_title');
                setBtnText(resetBtn, t('resetBtn'));
                langToggle.title = t('langToggle_title');
                searchInput.title = t('searchInput_title');
                document.getElementById('shortcutsBtn').title = t('shortcutsBtn_title');
                document.getElementById('pdfExportBtn').title = t('pdfExportBtn_title');
                modeButtons.forEach(b => {
                    setBtnText(b, t(`mode_${b.dataset.mode}`));
                    b.title = t(`mode_${b.dataset.mode}_tip`) || b.textContent;
                });
                religionButtons.forEach(b => {
                    b.textContent = t(`religion_${b.dataset.religion}`);
                    b.title = t(`filter_${b.dataset.religion}_tip`) || b.textContent;
                });
                zoomInBtn.title = t('zoomIn');
                zoomOutBtn.title = t('zoomOut');
                zoomResetBtn.title = t('zoomReset');
                searchInput.placeholder = t('searchPlaceholder');
                var mobileSearchInput = document.getElementById('mobileSearchInput');
                if (mobileSearchInput) mobileSearchInput.placeholder = t('searchPlaceholder');
                var mobileShareBtn = document.getElementById('mobileShareBtn');
                if (mobileShareBtn) mobileShareBtn.title = t('shareBtn');
                setBtnText(document.getElementById('mobileModeBtn'), t('mobileMode'));
                setBtnText(document.getElementById('mobileLayersBtn'), t('mobileLayers'));
                setBtnText(document.getElementById('mobileInfoBtn'), t('mobileInfo'));
                setBtnText(document.getElementById('mobileResetBtn'), t('resetBtn'));
                var mobileModeBtn = document.getElementById('mobileModeBtn');
                if (mobileModeBtn) mobileModeBtn.title = t('mobileMode_title');
                var mobileLayersBtn = document.getElementById('mobileLayersBtn');
                if (mobileLayersBtn) mobileLayersBtn.title = t('mobileLayers_title');
                var mobileInfoBtn = document.getElementById('mobileInfoBtn');
                if (mobileInfoBtn) mobileInfoBtn.title = t('mobileInfo_title');
                var mobileResetBtn = document.getElementById('mobileResetBtn');
                if (mobileResetBtn) mobileResetBtn.title = t('mobileReset_title');
                setBtnText(document.getElementById('mobileModeSheetTitle'), t('mobileModeSheetTitle'));
                document.querySelectorAll('#mobileModeButtons .mode-btn').forEach(function(b) {
                    setBtnText(b, t('mode_' + b.dataset.mode));
                });
                document.querySelectorAll('#mobileFilterButtons .religion-btn').forEach(function(b) {
                    b.textContent = t('religion_' + b.dataset.religion);
                });
                exportBtn.title = t('exportLabel');
                updateInfoOverlay();
                if (allCountryFeatures.length) {
                    if (countryLabelSelection) {
                        countryLabelSelection.remove();
                        countryLabelSelection = null;
                    }
                    drawCountryLabels(allCountryFeatures);
                }
                updateAllStyles();
                if (naturalResourcesVisible) drawNaturalResources();
                if (ethnicGroupsVisible) drawEthnicGroups();
                if (oceanCurrentsVisible) drawOceanCurrents();
                if (windsVisible) drawWinds();
                if (earthquakesVisible) drawEarthquakes();
                if (volcanoesVisible) drawVolcanoes();
                if (geopoliticalBlocsVisible) drawGeopoliticalBlocs();
                if (desertsForestsVisible) drawDesertsForests();
                if (borderDisputesVisible) drawBorderDisputes();
                updateCoordinatesDisplay({ clientX: 0, clientY: 0 });
            }

            function updateInfoOverlay() {
                infoOverlay.textContent = t('infoOverlay', { zoom: currentTransform.k.toFixed(1) });
            }

            function resetZoom() {
                svg.transition().duration(600).ease(d3.easeCubicInOut).call(zoomBehavior.transform, d3.zoomIdentity);
            }

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
                svg.transition().duration(800).ease(d3.easeCubicInOut).call(zoomBehavior.transform, transform)
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

                const displayName = getDisplayName(name);

                let population = info ? info.population_2026 : null;
                let area = info ? info.area : null;
                let density = getDensity(name);
                let capital = info ? (lang === 'ar' ? info.capital_ar : lang === 'ru' ? (info.capital_ru || info.capital_en) : info.capital_en) : (lang === 'ar' ? 'غير محدد' : lang === 'ru' ? 'Н/Д' : 'N/A');
                let language = info ? (lang === 'ar' ? info.lang_ar : lang === 'ru' ? (info.lang_ru || info.lang_en) : info.lang_en) : (lang === 'ar' ? 'غير محدد' : lang === 'ru' ? 'Н/Д' : 'N/A');

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
                const continentLabel = lang === 'ar' ? (continentArabic[continent] || continent) : lang === 'ru' ? (continentRussian[continent] || continent) : continent;
                const govLabel = lang === 'ar' ? (governmentArabic[government] || government) : lang === 'ru' ? (governmentRussian[government] || government) : government;

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
                const relLabel1 = lang === 'ar' ? (religionArabic[rel1] || rel1) : lang === 'ru' ? (religionRussian[rel1] || rel1) : rel1;
                const relLabel2 = lang === 'ar' ? (religionArabic[rel2] || rel2) : lang === 'ru' ? (religionRussian[rel2] || rel2) : rel2;

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
                    '<td style="padding:4px;">' + e('' + dens1) + ' ' + e(t('densityUnit')) + '<br><span class="compare-bar" style="width:' + bar1Dens + '%;background:#ffa726;"></span></td>' +
                    '<td style="padding:4px;">' + e('' + dens2) + ' ' + e(t('densityUnit')) + '<br><span class="compare-bar" style="width:' + bar2Dens + '%;background:#ffa726;"></span></td></tr>';

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
                    circleNodes[i].setAttribute('r', rVal);
                }
                for (var i = 0; i < textNodes.length; i++) {
                    var t = textNodes[i];
                    t.setAttribute('font-size', fsVal + 'px');
                    var c = circleNodes[i];
                    if (c) {
                        t.setAttribute('x', parseFloat(c.getAttribute('cx')) + rVal + ox);
                        t.setAttribute('y', parseFloat(c.getAttribute('cy')) + oy);
                    }
                }
            }

            function updateOverlayPositions() {
                const k = Math.max(0.4, currentTransform.k);
                if (naturalResourcesVisible) {
                    const r2 = Math.max(4, (isMobile ? 6 : 10) / k);
                    const fs2 = Math.max(8, Math.round((isMobile ? 9 : 12) / k));
                    fastUpdateLabels(gNaturalResources, gNaturalResources.selectAll('circle'), k, r2, fs2, 3, 2);
                }
                if (ethnicGroupsVisible) {
                    const r3 = Math.max(4, (isMobile ? 6 : 10) / k);
                    const fs3 = Math.max(8, Math.round((isMobile ? 9 : 12) / k));
                    fastUpdateLabels(gEthnicGroups, gEthnicGroups.selectAll('circle'), k, r3, fs3, 3, 2);
                }
            }

            function setupZoom() {
                const { width, height } = getContainerDimensions();
                let _pointLayersRAFPending = false;

                function schedulePointLayersRedraw() {
                    if (_pointLayersRAFPending) return;
                    _pointLayersRAFPending = true;
                    requestAnimationFrame(function() {
                        _pointLayersRAFPending = false;
                        drawPointLayersCanvas();
                    });
                }

                zoomBehavior = d3.zoom().scaleExtent([0.5, 12]).translateExtent([
                    [-width * 2, -height * 2],
                    [width * 3, height * 3]
                ]).on('zoom', function(e) {
                    currentTransform = e.transform;
                    applyMapTransform(currentTransform);
                    updateInfoOverlay();
                    updateHashDebounced();
                    schedulePointLayersRedraw();
                }).on('end', function() {
                    updateOverlayPositions();
                    updateLabels();
                    drawPointLayersCanvas();
                });
                svg.call(zoomBehavior);
                svg.on('dblclick.zoom', null);
            }

            async function loadWorld() {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 15000);
                try {
                    const response = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json', { signal: controller.signal });
                    if (!response.ok) throw new Error('HTTP ' + response.status);
                    const data = await response.json();
                    return topojson.feature(data, data.objects.countries).features;
                } finally {
                    clearTimeout(timeout);
                }
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
                    .attr('cursor', 'pointer')
                    .attr('vector-effect', 'non-scaling-stroke');

                countryPaths.on('mouseenter', function(e, d) {
                    const name = d.properties?.name || '';
                    let displayName = getDisplayName(name);
                    const rel = getReligion(name);
                    const denom = sectMode ? getDenomination(name) : null;
                    let html = `<div class="country-name"><strong>${displayName}</strong></div>`;
                    if (colorMode === 'religion' && sectMode && denom) {
                        const denomLabel = lang === 'ar' ? (denominationArabic[denom] || religionArabic[rel] || denom) : lang === 'ru' ? (denominationRussian[denom] || religionRussian[rel] || denom) : denom;
                        html += `<div>${t('tooltipDenom')}: ${denomLabel}</div>`;
                    } else if (colorMode === 'religion') {
                        const relLabel = lang === 'ar' ? (religionArabic[rel] || rel) : lang === 'ru' ? (religionRussian[rel] || rel) : rel;
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
                    d3.select(this).attr('stroke', '#fff').attr('stroke-width', 1.5);
                }).on('mousemove', function(e, d) {
                    const r = mapContainer.getBoundingClientRect();
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
                    updateCoordinatesDisplay(e);
                }).on('mouseleave', function() {
                    tooltip.classList.remove('visible');
                    const _leaving = d3.select(this).datum();
                    if (_leaving !== selectedCountry) {
                        d3.select(this).attr('stroke', d => getStroke(d)).attr('stroke-width', d => getStrokeWidth(d));
                    }
                }).on('click', function(e, d) {
                    if (e.shiftKey && selectedCountry) {
                        compareCountry = d;
                        renderComparePanel(selectedCountry, compareCountry);
                    } else {
                        selectedCountry = d;
                        compareCountry = null;
                        openCountryPanel(d);
                        highlightSelectedCountry(d);
                    }
                });

                // ── Touch support (mobile peek tooltip — لا stopPropagation حتى يتلقى D3 الأحداث) ───
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
                        const relLabel = lang === 'ar' ? (religionArabic[rel] || rel) : lang === 'ru' ? (religionRussian[rel] || rel) : rel;
                        let html = `<div><strong>${displayName}</strong></div>`;
                        if (colorMode === 'religion') html += `<div>${t('tooltipReligion')}: ${relLabel}</div>`;
                        tooltip.textContent = '';
                        const tmpDiv2 = document.createElement('div');
                        tmpDiv2.innerHTML = html;
                        while (tmpDiv2.firstChild) tooltip.appendChild(tmpDiv2.firstChild);
                        const r = mapContainer.getBoundingClientRect();
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

            function updateHash() {
                const hash = new URLSearchParams();
                hash.set('lang', lang);
                hash.set('mode', colorMode);
                hash.set('filter', currentReligionFilter);
                hash.set('labels', showLabels ? '1' : '0');
                hash.set('sect', sectMode ? '1' : '0');
                hash.set('corridors', corridorsVisible ? '1' : '0');
                hash.set('rivers', riversVisible ? '1' : '0');
                hash.set('natres', naturalResourcesVisible ? '1' : '0');
                hash.set('ethnic', ethnicGroupsVisible ? '1' : '0');
                hash.set('currents', oceanCurrentsVisible ? '1' : '0');
                hash.set('winds', windsVisible ? '1' : '0');
                hash.set('quakes', earthquakesVisible ? '1' : '0');
                hash.set('volcanoes', volcanoesVisible ? '1' : '0');
                hash.set('blocs', geopoliticalBlocsVisible ? '1' : '0');
                if (selectedBloc !== 'all') hash.set('bloc', selectedBloc);
                hash.set('deserts', desertsForestsVisible ? '1' : '0');
                hash.set('borderdisputes', borderDisputesVisible ? '1' : '0');
                hash.set('spots', densitySpotsMode ? '1' : '0');
                hash.set('capitals', capitalsVisible ? '1' : '0');
                hash.set('timezones', timezonesVisible ? '1' : '0');
                hash.set('majorcities', majorCitiesVisible ? '1' : '0');
                hash.set('coords', coordsVisible ? '1' : '0');
                hash.set('k', currentTransform.k.toFixed(2));
                hash.set('x', currentTransform.x.toFixed(0));
                hash.set('y', currentTransform.y.toFixed(0));
                window.location.hash = hash.toString();
            }
            // Debounced version used during zoom to avoid 60 writes/sec
            const updateHashDebounced = debounce(updateHash, 300);

            const VALID_MODES = ['religion', 'terrain', 'density', 'precipitation', 'temperature', 'gdp', 'hdi', 'normal'];
            const VALID_FILTERS = ['all', 'muslim', 'christian', 'hindu', 'buddhist', 'jewish', 'other'];
            const VALID_LANGS = ['ar', 'en', 'ru'];

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
                        religionButtons.forEach(b => b.classList.remove('active'));
                        const btn = document.querySelector(
                            `.religion-btn[data-religion="${currentReligionFilter}"]`);
                        if (btn) btn.classList.add('active');
                    }
                    if (hash.get('labels') === '1' && !showLabels) toggleLabels();
                    if (hash.get('sect') === '1' && !sectMode) toggleSect();
                    if (hash.get('corridors') === '1' && !corridorsVisible) toggleCorridors();
                    if (hash.get('rivers') === '1' && !riversVisible) toggleRivers();
                    if (hash.get('natres') === '1' && !naturalResourcesVisible) toggleNaturalResources();
                    if (hash.get('ethnic') === '1' && !ethnicGroupsVisible) toggleEthnicGroups();
                    if (hash.get('currents') === '1' && !oceanCurrentsVisible) toggleOceanCurrents();
                    if (hash.get('winds') === '1' && !windsVisible) toggleWinds();
                    if (hash.get('quakes') === '1' && !earthquakesVisible) toggleEarthquakes();
                    if (hash.get('volcanoes') === '1' && !volcanoesVisible) toggleVolcanoes();
                    if (hash.get('blocs') === '1' && !geopoliticalBlocsVisible) toggleGeopoliticalBlocs();
                    if (hash.has('bloc')) {
                        const blocVal = hash.get('bloc');
                        const blocSelect = document.getElementById('blocSelect');
                        const blocOpt = Array.from(blocSelect.options).find(function(o) { return o.value === blocVal; });
                        if (blocOpt) {
                            selectedBloc = blocVal;
                            blocSelect.value = blocVal;
                        }
                    }
                    if (hash.get('deserts') === '1' && !desertsForestsVisible) toggleDesertsForests();
                    if (hash.get('borderdisputes') === '1' && !borderDisputesVisible) toggleBorderDisputes();
                    if (hash.get('spots') === '1' && !densitySpotsMode) toggleDensitySpots();
                    if (hash.get('capitals') === '1' && !capitalsVisible) toggleCapitals();
                    if (hash.get('timezones') === '1' && !timezonesVisible) toggleTimezones();
                    if (hash.get('majorcities') === '1' && !majorCitiesVisible) toggleMajorCities();
                    if (hash.get('coords') === '0') {
                        coordsVisible = false;
                        coordsToggle.classList.remove('toggle-on');
                        coordinatesDisplay.classList.add('hidden');
                    } else {
                        coordsVisible = true;
                        coordsToggle.classList.add('toggle-on');
                        coordinatesDisplay.classList.remove('hidden');
                    }
                    if (hash.has('k') && hash.has('x') && hash.has('y')) {
                        const k = +hash.get('k'),
                            x = +hash.get('x'),
                            y = +hash.get('y');
                        if (isFinite(k) && isFinite(x) && isFinite(y) && k >= 0.1 && k <= 50)
                            svg.call(zoomBehavior.transform, d3.zoomIdentity.translate(x, y).scale(k));
                    }
                    updateActiveLayerCount();
                } catch (e) {}
            }

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

            function resetAll() {
                currentReligionFilter = 'all';
                religionButtons.forEach(b => b.classList.remove('active'));
                document.querySelector('.religion-btn[data-religion="all"]').classList.add('active');
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
                    selectedBloc = 'all';
                    document.getElementById('blocSelect').value = 'all';
                }
                if (desertsForestsVisible) toggleDesertsForests();
                if (borderDisputesVisible) toggleBorderDisputes();
                if (!coordsVisible) toggleCoords();
                resetZoom();
                selectedCountry = null;
                compareCountry = null;
                highlightSelectedCountry(null);
                closeCountryPanel();
            }

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

            function setupKeyboard() {
                document.addEventListener('keydown', function(e) {
                    if (e.target.tagName === 'INPUT') return;
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
                        updateAllStyles(); } else if (code === 'Escape') {
                            if (shortcutsOverlay.classList.contains('visible')) {
                                shortcutsOverlay.classList.remove('visible');
                            } else {
                                resetBtn.click();
                            }
                        } else if (code ===
                        'Equal' || code === 'NumpadAdd') { svg.transition().duration(300).ease(d3.easeCubicOut).call(zoomBehavior
                        .scaleBy, 1.35); } else if (code === 'Minus' || code === 'NumpadSubtract') { svg
                        .transition().duration(300).ease(d3.easeCubicOut).call(zoomBehavior.scaleBy, 0.74); }
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

            function updateReligionButtons() {
                religionButtons.forEach(b => b.classList.remove('active'));
                const btn = document.querySelector(`.religion-btn[data-religion="${currentReligionFilter}"]`);
                if (btn) btn.classList.add('active');
            }

            async function init() {
                isMobile = window.innerWidth < 768;

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
                if (typeof densitySpotEnglish !== 'undefined') {
                    densitySpots.forEach(function(d) { d.name_en = densitySpotEnglish[d.name]; d.name_ru = densitySpotRussian[d.name]; });
                    majorCitiesData.forEach(function(d) { d.name_en = d.name_en || densitySpotEnglish[d.name]; d.name_ru = d.name_ru || densitySpotRussian[d.name]; });
                }
                if (typeof capitalsRussian !== 'undefined') {
                    Object.keys(countryInfo).forEach(function(c) {
                        var info = countryInfo[c];
                        info.capital_ru = info.capital_ru || capitalsRussian[info.capital_en];
                        info.lang_ru = info.lang_ru || langsRussian[info.lang_en];
                    });
                }

                if (typeof lucide !== 'undefined' && lucide.createIcons) {
                    lucide.createIcons();
                    document.querySelectorAll('svg').forEach(function(el) {
                        if (!el.closest('.lucide-icon, [class*="lucide"]')) return;
                        var tag = el.closest('.btn, .control-label, .zoom-btn, .logo-icon, .menu-toggle, .layers-toggle, .mobile-nav-btn, .onboarding-hint, .export-btn, .close-btn, .layers-modal-close, .mobile-mode-sheet-close, .country-panel');
                        if (!tag) { el.style.setProperty('width', '14px', 'important'); el.style.setProperty('height', '14px', 'important'); return; }
                        if (tag.matches('.btn') && !tag.matches('.zoom-btn')) { el.style.setProperty('width', '7px', 'important'); el.style.setProperty('height', '7px', 'important'); }
                        else if (tag.matches('.control-label')) { el.style.setProperty('width', '6px', 'important'); el.style.setProperty('height', '6px', 'important'); }
                        else if (tag.matches('.zoom-btn')) { el.style.setProperty('width', '16px', 'important'); el.style.setProperty('height', '16px', 'important'); }
                        else if (tag.matches('.logo-icon')) { el.style.setProperty('width', '20px', 'important'); el.style.setProperty('height', '20px', 'important'); }
                        else if (tag.matches('.menu-toggle, .layers-toggle')) { el.style.setProperty('width', '20px', 'important'); el.style.setProperty('height', '20px', 'important'); }
                        else if (tag.matches('.mobile-nav-btn')) { el.style.setProperty('width', '18px', 'important'); el.style.setProperty('height', '18px', 'important'); }
                        else if (tag.matches('.onboarding-hint')) { el.style.setProperty('width', '14px', 'important'); el.style.setProperty('height', '14px', 'important'); }
                        else { el.style.setProperty('width', '14px', 'important'); el.style.setProperty('height', '14px', 'important'); }
                    });
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
                loadText.textContent = lang === 'ar' ? 'جاري تحميل الخريطة...' : lang === 'ru' ? 'Загрузка карты...' : 'Loading map...';
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
                    errorText.textContent = lang === 'ar'
                        ? 'تعذّر تحميل بيانات الخريطة. يرجى التحقق من الاتصال بالإنترنت والمحاولة مرة أخرى.'
                        : lang === 'ru'
                        ? 'Не удалось загрузить данные карты. Проверьте интернет-соединение и попробуйте снова.'
                        : 'Could not load map data. Please check your internet connection and try again.';
                    const retryBtn = document.createElement('button');
                    retryBtn.textContent = lang === 'ar' ? '↺ إعادة المحاولة' : lang === 'ru' ? '↺ Повторить' : '↺ Retry';
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
                applyLanguage();
                loadFromHash();
                updateHash();

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
                        pathGen = d3.geoPath(projection);
                        pathGen.pointRadius(isMobile ? 1.5 : 3);
                        gOcean.select('rect').attr('width', width + 1000).attr('height', height + 1000);
                        drawGraticule();
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
                    }, 80);
                });
                resizeObserver.observe(mapContainer);

                if ('serviceWorker' in navigator) {
                    try {
                        const basePath = window.location.pathname.replace(/\/[^\/]*$/, '/');
                        navigator.serviceWorker.register(basePath + 'sw.js', { scope: basePath })
                            .then(reg => console.log('✅ Service Worker:', reg))
                            .catch(() => {});
                    } catch (e) {}
                }

                updateActiveLayerCount();
                console.log('🦋 جميع التحسينات مطبقة بنجاح!');
            }

            // ── Export Map to PDF ────────────────────────────────────
            function exportMapPDF() {
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
                [...overlayEls, ...qEls].forEach(el => {
                    if (el) {
                        saved.push({ el, display: el.style.display });
                        el.style.display = 'none';
                    }
                });
                var savedTransform = currentTransform;
                gMap.attr('transform', null);
                currentTransform = d3.zoomIdentity;
                if (zoomBehavior) svg.call(zoomBehavior.transform, d3.zoomIdentity);
                requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                html2canvas(document.getElementById('mapContainer'), {
                    scale: 2,
                    backgroundColor: MAP_COLORS.ui.pdfBg,
                    useCORS: true,
                    logging: false,
                }).then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    const { jsPDF } = window.jspdf;
                    const pdf = new jsPDF('l', 'mm', 'a4');
                    const pw = pdf.internal.pageSize.getWidth();
                    const ph = pdf.internal.pageSize.getHeight();
                    const ratio = canvas.width / canvas.height;
                    let iw, ih;
                    if (ratio > pw / ph) { iw = pw; ih = pw / ratio; }
                    else { ih = ph; iw = ph * ratio; }
                    pdf.addImage(imgData, 'PNG', (pw - iw) / 2, (ph - ih) / 2, iw, ih);
                    const dateStr = new Date().toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric',
                    });
                    pdf.setFontSize(9);
                    pdf.setTextColor(120);
                    pdf.text(
                        'This map was created using the Waterman Map tool. Extraction date: ' + dateStr,
                        pw / 2, ph - 5, { align: 'center' }
                    );
                    pdf.save('Waterman_Map_Export.pdf');
                }).catch(err => {
                    console.error('PDF export error:', err);
                }).finally(() => {
                    saved.forEach(({ el, display }) => { el.style.display = display; });
                    gMap.attr('transform', savedTransform);
                    currentTransform = savedTransform;
                    if (zoomBehavior && savedTransform) svg.call(zoomBehavior.transform, savedTransform);
                });
                });
                });
            }

            modeButtons.forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
            labelsToggle.addEventListener('click', toggleLabels);
            sectToggle.addEventListener('click', toggleSect);
            corridorsToggle.addEventListener('click', toggleCorridors);

            const riversToggle = document.getElementById('riversToggle');
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

            const blocSelect = document.getElementById('blocSelect');
            geopoliticalBlocsData.forEach(function(b) {
                var opt = document.createElement('option');
                opt.value = b.name_en;
                opt.textContent = (lang === 'ar' ? b.name : lang === 'ru' ? (b.name_ru || b.name_en) : b.name_en) + ' (' + (lang === 'ar' ? b.members_ar : lang === 'ru' ? (b.members_ru || b.members_en) : b.members_en) + ')';
                blocSelect.appendChild(opt);
            });
            blocSelect.addEventListener('change', function() {
                selectedBloc = this.value;
                if (geopoliticalBlocsVisible) drawGeopoliticalBlocs();
                if (geopoliticalBlocsVisible && selectedBloc !== 'all') setMode('normal');
                updateLegend();
                updateHash();
            });

            function toggleLangDropdown(btn, menu) {
                var isVisible = menu.classList.contains('visible');
                document.querySelectorAll('.lang-dropdown-menu.visible').forEach(function(m) { m.classList.remove('visible'); });
                if (!isVisible) menu.classList.toggle('visible');
            }
            langToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleLangDropdown(langToggle, document.getElementById('langDropdownMenu'));
            });
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

            religionButtons.forEach(b => b.addEventListener('click', () => {
                currentReligionFilter = b.dataset.religion;
                religionButtons.forEach(bb => bb.classList.remove('active'));
                b.classList.add('active');
                updateAllStyles();
            }));

            zoomInBtn.addEventListener('click', () => { svg.transition().duration(300).ease(d3.easeCubicOut).call(zoomBehavior.scaleBy,
                1.35); });
            zoomOutBtn.addEventListener('click', () => { svg.transition().duration(300).ease(d3.easeCubicOut).call(zoomBehavior.scaleBy,
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
            var mobileInfoBtn = document.getElementById('mobileInfoBtn');
            var mobileResetBtn = document.getElementById('mobileResetBtn');
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
                    ms.style.display = '';
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
            if (mobileLayersBtn) mobileLayersBtn.addEventListener('click', function() { openLayersModal(); });
            if (mobileInfoBtn) mobileInfoBtn.addEventListener('click', function() { shortcutsOverlay.classList.add('visible'); });
            if (mobileResetBtn) mobileResetBtn.addEventListener('click', resetAll);
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

            function openLayersModal() {
                var layersRow = document.querySelector('.layers-row');
                var body = document.getElementById('layersModalBody');
                if (layersRow && body) {
                    var btnRow = document.createElement('div');
                    btnRow.style.cssText = 'display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap;';
                    var allOffBtn = document.createElement('button');
                    allOffBtn.className = 'btn';
                    allOffBtn.textContent = lang === 'ar' ? '🔴 إيقاف الكل' : lang === 'ru' ? '🔴 Выкл. всё' : '🔴 All Off';
                    allOffBtn.addEventListener('click', function() {
                        document.querySelectorAll('.layers-row .btn.toggle-on').forEach(function(b) { b.click(); });
                        updateActiveLayerCount();
                        closeLayersModal();
                    });
                    btnRow.appendChild(allOffBtn);
                    var resetLayersBtn = document.createElement('button');
                    resetLayersBtn.className = 'btn';
                    resetLayersBtn.textContent = lang === 'ar' ? '↺ إعادة الطبقات' : lang === 'ru' ? '↺ Сброс слоёв' : '↺ Reset Layers';
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
                            selectedBloc = 'all';
                            document.getElementById('blocSelect').value = 'all';
                        }
                        updateActiveLayerCount();
                        closeLayersModal();
                    });
                    btnRow.appendChild(resetLayersBtn);
                    body.appendChild(btnRow);
                    var categories = [
                        { labelAr: 'عام', labelEn: 'General', labelRu: 'Общие', ids: ['labelsToggle','sectToggle','coordsToggle'] },
                        { labelAr: 'سكان', labelEn: 'Population', labelRu: 'Население', ids: ['capitalsToggle','majorCitiesToggle','timezonesToggle','densitySpotsToggle'] },
                        { labelAr: 'نقل', labelEn: 'Transport', labelRu: 'Транспорт', ids: ['routesToggle','riversToggle'] },
                        { labelAr: 'سياسة', labelEn: 'Politics', labelRu: 'Политика', ids: ['geopoliticalBlocsToggle','blocSelect','borderDisputesToggle'] },
                        { labelAr: 'بيئة', labelEn: 'Environment', labelRu: 'Окружение', ids: ['naturalResourcesToggle','ethnicGroupsToggle','desertsForestsToggle'] },
                        { labelAr: 'مناخ وجيولوجيا', labelEn: 'Climate & Geology', labelRu: 'Климат и геология', ids: ['oceanCurrentsToggle','windsToggle','earthquakesToggle','volcanoesToggle'] },
                    ];
                    body.innerHTML = '';
                    var temp = document.createDocumentFragment();
                    categories.forEach(function(cat) {
                        var catDiv = document.createElement('div');
                        catDiv.className = 'layers-category';
                        var h4 = document.createElement('h4');
                        h4.textContent = cat.labelAr + ' / ' + cat.labelEn + ' / ' + (cat.labelRu || cat.labelEn);
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
            }
            function closeLayersModal() {
                var layersRow = document.querySelector('.layers-row');
                var body = document.getElementById('layersModalBody');
                if (layersRow && body) {
                    var all = body.querySelectorAll('.btn, .bloc-select');
                    Array.prototype.forEach.call(all, function(el) { layersRow.appendChild(el); });
                    body.innerHTML = '';
                }
                layersModal.classList.remove('visible');
            }
            if (layersToggleBtn) layersToggleBtn.addEventListener('click', openLayersModal);
            if (layersModalClose) layersModalClose.addEventListener('click', closeLayersModal);
            if (layersModalBackdrop) layersModalBackdrop.addEventListener('click', closeLayersModal);
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && layersModal && layersModal.classList.contains('visible')) {
                    closeLayersModal();
                }
                if (e.key === 'Escape') {
                    document.querySelectorAll('.lang-dropdown-menu.visible').forEach(function(m) { m.classList.remove('visible'); });
                }
            });

            closePanelBtn.addEventListener('click', () => {
                closeCountryPanel();
            });
            exportBtn.addEventListener('click', function() {
                if (!selectedCountry) return;
                const name = selectedCountry.properties?.name || '';
                const info = countryInfo[name] || countryInfo[getCleanName(name)];
                let text = `Country: ${name}\n`;
                if (info) {
                    text += `Capital: ${info.capital_en}\n`;
                    text += `Area: ${info.area} km²\n`;
                    text += `Population (2026 est.): ${info.population_2026} million\n`;
                    text += `Language: ${info.lang_en}\n`;
                    text += `Density: ${getDensity(name)} people/km²\n`;
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

            init();
        })();
