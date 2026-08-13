import { MAP_COLORS } from './data.js';
import { APP_VERSION, controlsBar, coordinatesDisplay, countryPanel, currentTransform, exportInProgress, gMap, globeModeActive, setState, svg, tooltip, zoomBehavior } from './state.js';
import { fmtDate, t } from './i18n.js';
import { renderTextBlockToImage } from './quiz.js';
import { getActiveLayerMetaGroups } from './ui.js';

// Module: export
// Extracted from app.js by scripts/split-modules.js


            // ── Export Map to PDF ──

export function exportMapPDFCore() {
                if (exportInProgress) return;
                setState('exportInProgress', true);
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
                    setState('currentTransform', d3.zoomIdentity);
                    if (zoomBehavior) svg.call(zoomBehavior.transform, d3.zoomIdentity);
                }

                // Render text blocks as images (supports Arabic/Cyrillic/Unicode)
                var headerDate = fmtDate(new Date());
                var exportProjKey = globeModeActive ? 'globeProjectionType' : 'headerProjectionType';
                var headerImgPromise = renderTextBlockToImage(
                    [t('appName'), t(exportProjKey) + ' \u2014 ' + headerDate],
                    800, 80
                );
                var citationText = t('pdfCitationLabel').replace('{date}', headerDate);
                var footerLines = [citationText, t('pdfVersionLine').replace('{version}', APP_VERSION)];
                var activeMetaGroups = getActiveLayerMetaGroups();
                if (activeMetaGroups.length) {
                    footerLines.push(t('layerMetaPdfLabel') + ': ' + activeMetaGroups.map(function(g) { return t(g.nameKey); }).join(' \u00b7 '));
                }
                var footerImgPromise = renderTextBlockToImage(footerLines, 800, 64);

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
                            var footerAspect = 800 / 64;
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
                            setState('currentTransform', savedTransform);
                            if (zoomBehavior && savedTransform) svg.call(zoomBehavior.transform, savedTransform);
                        }
                        setState('exportInProgress', false);
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
                        setState('currentTransform', savedTransform);
                        if (zoomBehavior && savedTransform) svg.call(zoomBehavior.transform, savedTransform);
                    }
                    setState('exportInProgress', false);
                    if (exportOverlay) exportOverlay.style.display = 'none';
                });
            }

export function exportMapPDF() {
                if (exportInProgress) return;
                var basePath = window.location.pathname.replace(/\/[^\/]*$/, '/');
                var needs = [];
                if (typeof html2canvas !== 'function') needs.push(basePath + 'vendor/html2canvas.min.js');
                if (!window.jspdf) needs.push(basePath + 'vendor/jspdf.umd.min.js');
                function loadScript(src) {
                    return new Promise(function(res, rej) {
                        var el = document.createElement('script');
                        el.src = src;
                        el.onload = res;
                        el.onerror = function() { rej(new Error('Failed to load ' + src)); };
                        document.head.appendChild(el);
                    });
                }
                var chain = Promise.resolve();
                needs.forEach(function(src) { chain = chain.then(function() { return loadScript(src); }); });
                chain.then(exportMapPDFCore).catch(function(err) { console.error('PDF export library load failed:', err); });
            }
