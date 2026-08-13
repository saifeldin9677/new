import { CB_COLORS, arabicNames, denominationByCountry, geopoliticalBlocsData, i18n, religionByCountry, russianNames, spanishNames, uzbekNames } from './data.js';
import { adminNameTranslations, allCountryFeatures, colorblindMode, countryLabelSelection, dataTableOverlay, lang, modeButtons, religionButtons, setState } from './state.js';
import { LAYER_DEFS, drawCountryLabels, drawPointLayersCanvas, updateAllStyles } from './layers.js';
import { renderAnnotationsModal, updateCoordinatesDisplay, updateInfoOverlay } from './map-core.js';
import { renderAboutModal, renderDataTable, renderPresetsModal } from './ui.js';

// Module: i18n
// Extracted from app.js by scripts/split-modules.js


            // ── i18n helper ──

export function t(key, params = {}) {
                let s = i18n[lang]?.[key] || i18n.en[key] || key;
                for (let [k, v] of Object.entries(params)) s = s.replace(`{${k}}`, v);
                return s;
            }

export const INTl_LOCALES = { ar: 'ar-EG-u-nu-latn', en: 'en', ru: 'ru', uz: 'uz-UZ', es: 'es' };

export function intlLocale() { return INTl_LOCALES[lang] || 'en'; }

export function fmtNum(n) {
                if (n == null || isNaN(n)) return '';
                try { return new Intl.NumberFormat(intlLocale()).format(n); } catch(e) { return String(n); }
            }

export function fmtDate(d) {
                if (!d) return '';
                try { return new Intl.DateTimeFormat(intlLocale(), { dateStyle: 'short' }).format(new Date(d)); } catch(e) { return new Date(d).toLocaleDateString(); }
            }

export function fmtTime(seconds) {
                if (seconds == null || isNaN(seconds)) return '';
                var s = Math.max(0, Math.round(seconds));
                var m = Math.floor(s / 60), r = s % 60;
                return m + ':' + (r < 10 ? '0' : '') + r;
            }

export function pluralize(count, one, few, many) {
                var n = Math.abs(count);
                if (lang === 'ar') {
                    if (n === 1) return one;
                    if (n <= 10) return few || many;
                    return many;
                }
                if (lang === 'ru') {
                    if (n === 1) return one;
                    var m10 = n % 10, m100 = n % 100;
                    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few || many;
                    return many;
                }
                return n === 1 ? one : many;
            }

export function htmlEscape(str) {
                const div = document.createElement('div');
                div.textContent = str;
                return div.innerHTML;
            }

// ── Colorblind-mode palette accessors ─────────────────────────────
// Return the active color set: normal MAP_COLORS / religionColors, or the
// WCAG-informed CB_COLORS when colorblindMode is on. Centralised here so
// both the country fills (layers.js) and the legend share one source.

export function isColorblindMode() { return !!colorblindMode; }

// Sequential scale (terrain/density/etc.) — returns the Array of hex stops.
export function getSequentialPalette(key) {
                if (colorblindMode && CB_COLORS[key]) return CB_COLORS[key];
                // Fall back to the data.js MAP_COLORS array lazily to avoid a
                // hard import cycle; callers that need MAP_COLORS keep theirs.
                return null;
            }

// Categorical country fills (religion / denomination)
export function getReligionColor(key) {
                if (colorblindMode) return CB_COLORS.religion[key] || CB_COLORS.religion.unknown;
                return null; // caller falls back to religionColors
            }
export function getDenominationColor(key) {
                if (colorblindMode) return CB_COLORS.denomination[key] || CB_COLORS.denomination.other;
                return null;
            }
export function getCBReligionColor(key) { return CB_COLORS.religion[key] || CB_COLORS.religion.unknown; }
export function getCBDenominationColor(key) { return CB_COLORS.denomination[key] || CB_COLORS.denomination.other; }
export function getDensitySpotColor(level) {
                return colorblindMode ? CB_COLORS.densitySpots[level] : null;
            }

export function getCleanName(rawName) {
                if (!rawName) return '';
                return rawName.replace(/^(Islamic Republic of|Republic of|State of|Kingdom of|Federal Republic of|Democratic Republic of|Commonwealth of|People's Republic of|United States of America|United Kingdom of Great Britain and Northern Ireland)\s+/i, '')
                    .replace(/\s*\(.*\)\s*/g, '').replace(/^Rep\.\s*/i, '').trim();
            }

export function getArabicName(enName) {
                if (!enName) return '';
                let clean = getCleanName(enName);
                if (arabicNames[clean]) return arabicNames[clean];
                if (arabicNames[enName]) return arabicNames[enName];
                for (let [k, v] of Object.entries(arabicNames))
                    if (clean.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(clean.toLowerCase()))
                        return v;
                return enName;
            }

export function getRussianName(enName) {
                if (!enName) return '';
                let clean = getCleanName(enName);
                if (russianNames[clean]) return russianNames[clean];
                if (russianNames[enName]) return russianNames[enName];
                for (let [k, v] of Object.entries(russianNames))
                    if (clean.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(clean.toLowerCase()))
                        return v;
                return enName;
            }

export function getUzbekName(enName) {
                if (!enName) return '';
                let clean = getCleanName(enName);
                if (uzbekNames[clean]) return uzbekNames[clean];
                if (uzbekNames[enName]) return uzbekNames[enName];
                for (let [k, v] of Object.entries(uzbekNames))
                    if (clean.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(clean.toLowerCase()))
                        return v;
                return enName;
            }

export function getSpanishName(enName) {
                if (!enName) return '';
                let clean = getCleanName(enName);
                if (spanishNames[clean]) return spanishNames[clean];
                if (spanishNames[enName]) return spanishNames[enName];
                for (let [k, v] of Object.entries(spanishNames))
                    if (clean.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(clean.toLowerCase()))
                        return v;
                return enName;
            }

export function getDisplayName(name) {
                if (!name) return '';
                if (lang === 'ar') return getArabicName(name);
                if (lang === 'ru') return getRussianName(name);
                if (lang === 'uz') return getUzbekName(name);
                if (lang === 'es') return getSpanishName(name);
                return name;
            }

export function getAdminDisplayName(enName) {
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

export function getReligion(name) {
                if (!name) return 'unknown';
                if (religionByCountry[name]) return religionByCountry[name];
                const clean = getCleanName(name);
                if (religionByCountry[clean]) return religionByCountry[clean];
                for (let [k, v] of Object.entries(religionByCountry))
                    if (clean.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(clean.toLowerCase()))
                        return v;
                return 'unknown';
            }

export function getDenomination(name) {
                if (!name) return getReligion(name);
                if (denominationByCountry[name]) return denominationByCountry[name];
                const clean = getCleanName(name);
                if (denominationByCountry[clean]) return denominationByCountry[clean];
                for (let [k, v] of Object.entries(denominationByCountry))
                    if (clean.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(clean.toLowerCase()))
                        return v;
                return getReligion(name);
            }

export function setLanguage(l) {
                setState('lang', l);
                try { localStorage.setItem('mapLang', l); } catch(e) {}
                applyLanguage();
            }

export function setBtnText(el, text) {
                if (!el) return;
                var span = el.querySelector('.btn-text');
                if (span) { span.textContent = text; }
                else { el.textContent = text; }
            }

export function applyDataI18nAttributes() {
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

export function applyLanguage() {
                applyDataI18nAttributes();
                const aboutModalEl = document.getElementById('aboutModal');
                if (aboutModalEl && aboutModalEl.classList.contains('visible')) renderAboutModal();
                const presetsModalEl = document.getElementById('presetsModal');
                if (presetsModalEl && presetsModalEl.classList.contains('visible')) renderPresetsModal();
                const annotationsModalEl = document.getElementById('annotationsModal');
                if (annotationsModalEl && annotationsModalEl.classList.contains('visible')) renderAnnotationsModal();
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
                        setState('countryLabelSelection', null);
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
            }
