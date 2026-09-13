!function() {
    const e = window.__BASE_PATH || "./";
    function t() {
        if ("undefined" != typeof lucide && lucide && lucide.createIcons) try {
            lucide.createIcons();
        } catch (e) {}
    }
    function n() {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    function i(e) {
        document.documentElement.setAttribute("data-theme", e);
        try {
            localStorage.setItem("theme", e);
        } catch (e) {}
    }
    window.APP_BUILD && "2026-08-19A" !== window.APP_BUILD && "1" !== sessionStorage.getItem("lepidosBuildChecked") && (sessionStorage.setItem("lepidosBuildChecked", "1"), 
    location.reload()), window.refreshLucideIcons = t, window.switchSection = function(e) {
        window.applySection && window.applySection(e);
    }, i(function() {
        var e = null;
        try {
            e = localStorage.getItem("theme");
        } catch (e) {}
        return "light" === e || "dark" === e ? e : window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }());
    const a = document.getElementById("mapSvg"), r = document.getElementById("tooltip"), o = document.getElementById("legend"), s = document.getElementById("infoOverlay"), l = document.getElementById("coordinatesDisplay"), c = document.getElementById("copyNotification"), d = document.getElementById("langToggle");
    var u = document.getElementById("langDropdownMenu");
    function p() {
        if (d && u) {
            var e = d.getBoundingClientRect();
            u.style.top = e.bottom + 4 + "px", "rtl" === document.documentElement.dir ? (u.style.right = window.innerWidth - e.right + "px", 
            u.style.left = "auto") : (u.style.left = e.left + "px", u.style.right = "auto");
        }
    }
    function m(e, t) {
        e.forEach(function(e) {
            e.classList.remove("active"), e.setAttribute("aria-pressed", "false");
        }), document.querySelectorAll(t).forEach(function(e) {
            e.classList.add("active"), e.setAttribute("aria-pressed", "true");
        });
    }
    u && (document.body.appendChild(u), u.style.position = "fixed");
    const f = document.querySelectorAll(".mode-btn");
    var h = [];
    const y = document.getElementById("labelsToggle"), g = document.getElementById("sectToggle"), v = document.getElementById("routesToggle"), b = document.getElementById("densitySpotsToggle"), w = document.getElementById("capitalsToggle"), E = document.getElementById("timezonesToggle"), k = document.getElementById("majorCitiesToggle"), x = document.getElementById("coordsToggle"), _ = document.getElementById("adminBoundariesToggle"), C = document.getElementById("globeViewBtn"), L = document.getElementById("shareBtn"), B = document.getElementById("resetBtn"), S = document.getElementById("zoomInBtn"), I = document.getElementById("zoomOutBtn"), z = document.getElementById("zoomResetBtn"), A = document.getElementById("searchInput"), M = document.getElementById("suggestionsList"), T = document.getElementById("countryPanel"), P = document.getElementById("panelContent"), q = document.getElementById("closePanelBtn"), O = document.getElementById("exportBtn"), R = document.getElementById("menuToggle"), N = document.getElementById("controlsBar"), D = document.getElementById("layersModal"), F = document.getElementById("divisionPopover"), H = document.getElementById("shortcutsOverlay"), j = document.getElementById("shortcutsBtn"), W = document.getElementById("shortcutsClose"), U = document.getElementById("dataTableOverlay"), $ = document.getElementById("dataTableBtn"), K = document.getElementById("dataTableClose"), G = document.getElementById("dataTableSearch"), Y = document.getElementById("dataTableBody"), V = document.getElementById("onboardingHint"), Q = document.getElementById("mapContainer");
    function X(e) {
        var t = document.getElementById("srLiveAnnouncer");
        t && e && (t.textContent = "", setTimeout(function() {
            t && (t.textContent = e);
        }, 50));
    }
    function J(e) {
        if (e) {
            var t = null;
            new MutationObserver(function() {
                var n = e.classList.contains("visible") || e.classList.contains("open") || !e.hasAttribute("hidden") && "none" !== e.style.display && (e.offsetWidth > 0 || e.offsetHeight > 0);
                n && !t ? t = function(e) {
                    function t() {
                        return Array.prototype.slice.call(e.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(function(e) {
                            return null !== e.offsetParent;
                        });
                    }
                    var n = document.activeElement;
                    function i(n) {
                        if ("Tab" === n.key) {
                            var i = t();
                            if (i.length) {
                                var a = i[0], r = i[i.length - 1];
                                n.shiftKey && document.activeElement === a ? (n.preventDefault(), r.focus()) : n.shiftKey || document.activeElement !== r && e.contains(document.activeElement) || (n.preventDefault(), 
                                a.focus());
                            }
                        }
                    }
                    if (e.addEventListener("keydown", i), !e.contains(document.activeElement)) {
                        var a = t();
                        a.length && a[0].focus();
                    }
                    return function() {
                        e.removeEventListener("keydown", i), n && "function" == typeof n.focus && n.isConnected && null !== n.offsetParent && n.focus();
                    };
                }(e) : !n && t && (t(), t = null);
            }).observe(e, {
                attributes: !0,
                attributeFilter: [ "class", "style", "hidden" ]
            });
        }
    }
    window.announceToScreenReader = X, [ "countryPanel", "layersModal", "divisionPopover", "annotationsModal", "annotationLabelModal", "annotationPlaceModal", "mobileModeSheet", "shortcutsOverlay", "dataTableOverlay", "histPolityCompareModal", "histSourcesPanel", "histWaypointPopup", "histTravelerCard", "eraQuizModal", "eraCompareModal" ].forEach(function(e) {
        J(document.getElementById(e));
    }), document.addEventListener("keydown", function(e) {
        if ("Escape" === e.key) {
            var t = c("layersModal") || c("divisionPopover") || c("annotationsModal") || c("annotationLabelModal");
            if (c("histPolityCompareModal")) {
                e.stopImmediatePropagation();
                var n = document.getElementById("histPolityCompareModal");
                n && (n.setAttribute("hidden", ""), n.style.display = "none", n.classList.remove("visible"));
            } else {
                if (c("histWaypointPopup")) return e.stopImmediatePropagation(), void lc();
                if (c("histTravelerCard")) {
                    e.stopImmediatePropagation();
                    var i = document.getElementById("histTravelerCard");
                    i && (i.style.display = "none");
                } else if (c("histSourcesPanel")) {
                    e.stopImmediatePropagation();
                    var a = document.getElementById("histSourcesPanel");
                    a && (a.style.display = "none");
                } else if (c("eraQuizModal")) {
                    e.stopImmediatePropagation();
                    var r = document.getElementById("eraQuizModal");
                    r && (r.style.display = "none", r.classList.remove("visible"));
                } else {
                    if (!c("eraCompareModal")) {
                        if (!t && c("dataTableOverlay")) return e.stopImmediatePropagation(), void document.getElementById("dataTableOverlay").classList.remove("visible");
                        if (!t && c("shortcutsOverlay")) return e.stopImmediatePropagation(), void document.getElementById("shortcutsOverlay").classList.remove("visible");
                        if (c("annotationPlaceModal")) {
                            var o = document.getElementById("annotationPlaceModal");
                            return o && "function" == typeof o._placeCleanup && o._placeCleanup(), void e.stopImmediatePropagation();
                        }
                        if (c("annotationLabelModal")) {
                            var s = document.getElementById("annotationLabelInput");
                            return s && "function" == typeof s.onkeydown && s.onkeydown({
                                key: "Escape",
                                preventDefault: function() {}
                            }), void e.stopImmediatePropagation();
                        }
                        return !t && c("countryPanel") ? (e.stopImmediatePropagation(), void Eo()) : !t && c("mobileModeSheet") ? (e.stopImmediatePropagation(), 
                        void document.getElementById("mobileModeSheet").classList.remove("visible")) : void cl(!0);
                    }
                    e.stopImmediatePropagation();
                    var l = document.getElementById("eraCompareModal");
                    l && (l.style.display = "none", l.classList.remove("visible"));
                }
            }
        }
        function c(e) {
            var t = document.getElementById(e);
            return !!t && (t.classList.contains("visible") || t.classList.contains("open") || !t.hasAttribute("hidden") && "none" !== t.style.display && null !== t.offsetParent);
        }
    }, !0);
    const Z = document.getElementById("densityCanvas");
    let ee = null;
    const te = document.getElementById("adminBoundariesCanvas");
    let ne = null;
    let ie = "all", ae = "normal", re = "all", oe = !1, se = !1, le = !1, ce = !1, de = !1, ue = !1, pe = !1, me = !1, fe = !1, he = !1, ye = !1, ge = !1, ve = !1, be = !1, we = !1, Ee = !1, ke = !1, xe = !1, _e = !1, Ce = !1, Le = !1, Be = !1, Se = null, Ie = [ 0, -20 ], ze = !1, Ae = !1, Me = null, Te = !1, Pe = !1, qe = null, Oe = null, Re = null, Ne = null, De = null, Fe = null, He = null, je = !1, We = null, Ue = [], $e = null, Ke = "geo", Ge = "all", Ye = "all", Ve = "", Qe = .55, Xe = "start", Je = "start", Ze = null, et = null;
    var tt = 0;
    let nt = "undefined" != typeof historicalWarsData ? historicalWarsData : [];
    window.historyWarData = nt;
    let it = "all", at = "all";
    var rt = [ {
        id: "ancient",
        key: "warEpochAncient",
        icon: "landmark",
        labelAr: "العصور القديمة"
    }, {
        id: "medieval",
        key: "warEpochMedieval",
        icon: "shield",
        labelAr: "العصور الوسطى"
    }, {
        id: "early-modern",
        key: "warEpochEarlyModern",
        icon: "compass",
        labelAr: "العصر الحديث المبكر"
    }, {
        id: "nineteenth",
        key: "warEpoch19th",
        icon: "feather",
        labelAr: "القرن التاسع عشر"
    }, {
        id: "modern",
        key: "warEpochModern",
        icon: "zap",
        labelAr: "القرن العشرون والمعاصر"
    } ];
    function ot(e) {
        if (!e) return "ancient";
        if (e.epoch) return e.epoch;
        var t = e.sort || 0;
        return t <= 500 ? "ancient" : t <= 1500 ? "medieval" : t < 1800 ? "early-modern" : t <= 1900 ? "nineteenth" : "modern";
    }
    window.getEraEpoch = ot;
    let st = !1, lt = [], ct = null, dt = !1, ut = "pin", pt = "#eab308", mt = 10, ft = [], ht = null, yt = [];
    var gt = [ 8, 10, 12, 14, 16, 20, 24 ], vt = null, bt = !1, wt = null, Et = null, kt = 0, xt = null, _t = null, Ct = null, Lt = !1;
    let Bt = !1, St = !1, It = null, zt = null, At = null, Mt = !0, Tt = null, Pt = null, qt = null, Ot = null, Rt = null, Nt = null, Dt = null, Ft = null, Ht = (jt = localStorage.getItem("mapLang")) && [ "ar", "en", "ru", "uz", "es" ].includes(jt) ? jt : "ar";
    var jt;
    function Wt() {
        return Ht || "ar";
    }
    window.getCurrentLang = Wt;
    let Ut, $t, Kt, Gt, Yt, Vt, Qt, Xt, Jt, Zt, en, tn, nn, an, rn, on, sn, ln, cn, dn, un, pn, mn, fn = [], hn = [], yn = null, gn = null, vn = null, bn = null, wn = 0, En = null, kn = "name", xn = !0, _n = null, Cn = null, Ln = null, Bn = null, Sn = null, In = null, zn = null, An = null, Mn = [], Tn = 0, Pn = null, qn = !1, On = !1, Rn = !1, Nn = !1, Dn = !1, Fn = !1, Hn = !1, jn = -1500, Wn = !1, Un = null;
    const $n = [ -3e3, -2500, -2e3, -1500, -1e3, -500, 1, 500, 1e3, 1500, 2e3 ];
    let Kn, Gn, Yn, Vn, Qn, Xn, Jn, Zn, ei, ti, ni, ii, ai, ri, oi, si, li = d3.zoomIdentity, ci = {
        w: 180,
        h: 60
    }, di = (d3.zoomIdentity, "mercator"), ui = null, pi = null, mi = null, fi = null, hi = !1, yi = !1, gi = [], vi = null, bi = null, wi = null, Ei = 0;
    function ki() {
        const e = performance.now();
        return wi && Math.abs(e - Ei) < 16 || (wi = Q.getBoundingClientRect(), Ei = e), 
        wi;
    }
    let xi = window.innerWidth < 768;
    const _i = [ "historicalRoutes", "histCapitals", "histBattles", "histWonders", "histSacredSites", "histModernBorders", "histModernLabels" ], Ci = [ "labels", "sect", "corridors", "riversAndGlaciers", "densitySpots", "capitals", "timezones", "majorCities", "naturalResources", "ethnicGroups", "oceanCurrents", "winds", "earthquakes", "volcanoes", "geopoliticalBlocs", "desertsForests", "borderDisputes", "adminBoundaries", "coords" ], Li = {
        labels: {
            getFlag: function() {
                return oe;
            },
            setFlag: function(e) {
                oe = e;
            },
            btnId: "labelsToggle",
            drawFn: null,
            hashKey: "labels",
            skip: !0
        },
        sect: {
            getFlag: function() {
                return se;
            },
            setFlag: function(e) {
                se = e;
            },
            btnId: "sectToggle",
            drawFn: null,
            hashKey: "sect",
            skip: !0
        },
        corridors: {
            getFlag: function() {
                return le;
            },
            setFlag: function(e) {
                le = e;
            },
            btnId: "corridorsToggle",
            drawFn: null,
            hashKey: "corridors",
            skip: !0
        },
        historicalRoutes: {
            getFlag: function() {
                return ke;
            },
            setFlag: function(e) {
                ke = e;
            },
            btnId: "historicalRoutesToggle",
            drawFn: qa,
            hashKey: "histroutes",
            setNorm: !1
        },
        riversAndGlaciers: {
            getFlag: function() {
                return ce;
            },
            setFlag: function(e) {
                ce = e;
            },
            btnId: "riversGlaciersToggle",
            drawFn: function() {
                Fa(), ar();
            },
            hashKey: "riversglaciers",
            setNorm: !0
        },
        densitySpots: {
            getFlag: function() {
                return ue;
            },
            setFlag: function(e) {
                ue = e;
            },
            btnId: "densitySpotsToggle",
            drawFn: null,
            hashKey: "spots",
            skip: !0
        },
        capitals: {
            getFlag: function() {
                return pe;
            },
            setFlag: function(e) {
                pe = e;
            },
            btnId: "capitalsToggle",
            drawFn: Oa,
            postDrawFn: Tr,
            hashKey: "capitals"
        },
        timezones: {
            getFlag: function() {
                return me;
            },
            setFlag: function(e) {
                me = e;
            },
            btnId: "timezonesToggle",
            drawFn: Na,
            hashKey: "timezones"
        },
        majorCities: {
            getFlag: function() {
                return fe;
            },
            setFlag: function(e) {
                fe = e;
            },
            btnId: "majorCitiesToggle",
            drawFn: Ra,
            postDrawFn: Tr,
            hashKey: "majorcities"
        },
        naturalResources: {
            getFlag: function() {
                return he;
            },
            setFlag: function(e) {
                he = e;
            },
            btnId: "naturalResourcesToggle",
            drawFn: ja,
            hashKey: "natres",
            setNorm: !0
        },
        ethnicGroups: {
            getFlag: function() {
                return ye;
            },
            setFlag: function(e) {
                ye = e;
            },
            btnId: "ethnicGroupsToggle",
            drawFn: Wa,
            hashKey: "ethnic",
            setNorm: !0
        },
        oceanCurrents: {
            getFlag: function() {
                return ge;
            },
            setFlag: function(e) {
                ge = e;
            },
            btnId: "oceanCurrentsToggle",
            drawFn: $a,
            hashKey: "currents",
            setNorm: !0
        },
        winds: {
            getFlag: function() {
                return ve;
            },
            setFlag: function(e) {
                ve = e;
            },
            btnId: "windsToggle",
            drawFn: Ka,
            hashKey: "winds",
            setNorm: !0
        },
        earthquakes: {
            getFlag: function() {
                return be;
            },
            setFlag: function(e) {
                be = e;
            },
            btnId: "earthquakesToggle",
            drawFn: Va,
            hashKey: "quakes",
            setNorm: !0
        },
        volcanoes: {
            getFlag: function() {
                return we;
            },
            setFlag: function(e) {
                we = e;
            },
            btnId: "volcanoesToggle",
            drawFn: Xa,
            hashKey: "volcanoes"
        },
        geopoliticalBlocs: {
            getFlag: function() {
                return xe;
            },
            setFlag: function(e) {
                xe = e;
            },
            btnId: "geopoliticalBlocsToggle",
            drawFn: Ja,
            hashKey: "blocs",
            setNorm: !0,
            on: function(e) {
                if (!e) {
                    re = "all";
                    var t = document.getElementById("blocSelect");
                    t && (t.value = "all");
                }
            }
        },
        desertsForests: {
            getFlag: function() {
                return _e;
            },
            setFlag: function(e) {
                _e = e;
            },
            btnId: "desertsForestsToggle",
            drawFn: tr,
            hashKey: "deserts",
            setNorm: !0
        },
        borderDisputes: {
            getFlag: function() {
                return Ce;
            },
            setFlag: function(e) {
                Ce = e;
            },
            btnId: "borderDisputesToggle",
            drawFn: nr,
            hashKey: "borderdisputes",
            setNorm: !0
        },
        adminBoundaries: {
            getFlag: function() {
                return Le;
            },
            setFlag: function(e) {
                Le = e;
            },
            btnId: "adminBoundariesToggle",
            drawFn: cr,
            hashKey: "adminbounds"
        },
        histCapitals: {
            getFlag: function() {
                return qn;
            },
            setFlag: function(e) {
                qn = e;
            },
            btnId: "histCapitalsToggle",
            drawFn: function() {
                window.drawHistCapitals && Nc();
            },
            hashKey: "histcaps",
            setNorm: !1
        },
        histBattles: {
            getFlag: function() {
                return On;
            },
            setFlag: function(e) {
                On = e;
            },
            btnId: "histBattlesToggle",
            drawFn: function() {
                window.drawHistBattles && Dc();
            },
            hashKey: "histbattles",
            setNorm: !1
        },
        histWonders: {
            getFlag: function() {
                return Rn;
            },
            setFlag: function(e) {
                Rn = e;
            },
            btnId: "histWondersToggle",
            drawFn: function() {
                window.drawHistWonders && Fc();
            },
            hashKey: "histwonders",
            setNorm: !1
        },
        histSacredSites: {
            getFlag: function() {
                return Nn;
            },
            setFlag: function(e) {
                Nn = e;
            },
            btnId: "histSacredSitesToggle",
            drawFn: function() {
                window.drawHistSacredSites && Hc();
            },
            hashKey: "histsacred",
            setNorm: !1
        },
        histModernBorders: {
            getFlag: function() {
                return Dn;
            },
            setFlag: function(e) {
                Dn = e;
            },
            btnId: "histModernBordersToggle",
            drawFn: function() {
                window.updateHistModernBorders && window.updateHistModernBorders();
            },
            hashKey: "histmodern",
            setNorm: !1,
            on: function(e) {
                var t;
                e ? (t = document.getElementById("histModernLabelsToggle")) && (t.style.display = "") : (Fn = !1, 
                (t = document.getElementById("histModernLabelsToggle")) && (t.classList.remove("toggle-on"), 
                t.setAttribute("aria-pressed", "false"), t.style.display = "none"), Xn && (Xn.style("display", "none"), 
                bi && (bi.remove(), bi = null)));
            }
        },
        histModernLabels: {
            getFlag: function() {
                return Fn;
            },
            setFlag: function(e) {
                if (Fn = e, e && !Dn) {
                    Dn = !0;
                    var t = document.getElementById("histModernBordersToggle");
                    t && (t.classList.add("toggle-on"), t.setAttribute("aria-pressed", "true"));
                }
            },
            btnId: "histModernLabelsToggle",
            drawFn: function() {
                window.updateHistModernBorders && window.updateHistModernBorders();
            },
            hashKey: "histmodernlabels",
            setNorm: !1
        },
        coords: {
            getFlag: function() {
                return Mt;
            },
            setFlag: function(e) {
                Mt = e;
            },
            btnId: "coordsToggle",
            drawFn: null,
            hashKey: "coords",
            skip: !0,
            on: function(e) {
                var t = document.getElementById("coordinatesDisplay");
                t && t.classList.toggle("hidden", !e);
            }
        }
    }, Bi = {
        labels: Rr,
        sect: Qr,
        corridors: Xr,
        densitySpots: Zr,
        coords: io
    };
    function Si(e) {
        var t = Li[e];
        if (t) if (t.skip) {
            var n = Bi[e];
            n && n();
        } else Ii(e);
    }
    function Ii(e) {
        var t = Li[e];
        if (t && !t.skip) {
            var n = _i.includes(e), i = void 0 !== Ke && "history" === Ke || void 0 !== Pe && Pe;
            if ((!n || i) && (n || !i)) {
                var a = !t.getFlag();
                t.setFlag(a);
                var r = document.getElementById(t.btnId);
                r && (r.classList.toggle("toggle-on", a), r.setAttribute("aria-pressed", a ? "true" : "false")), 
                a && t.setNorm && !i && Vr("normal"), t.drawFn && t.drawFn(), t.postDrawFn && t.postDrawFn(), 
                t.on && t.on(a, r), Yr(), Cs(), Gr();
            }
        }
    }
    function zi(e, t = {}) {
        let n = i18n[Ht]?.[e] || i18n.en[e] || e;
        for (let [e, i] of Object.entries(t)) n = n.replace(`{${e}}`, i);
        return n;
    }
    function Ai(e, t) {
        if (!e) return "";
        var n = e[t + "_" + Ht];
        return null == n && (n = t ? e[t] : void 0), null == n && (n = e[t + "_en"]), null == n && (n = e[t + "_ar"]), 
        null == n && (n = ""), String(n);
    }
    function Mi(e, t) {
        if (!e || !t) return "";
        var n = void 0 !== Ht ? Ht : "undefined" != typeof currentLang ? currentLang : "ar", i = e["sides_" + n];
        return i && i[t] ? i[t] : "ar" !== n && e.sides_en && e.sides_en[t] ? e.sides_en[t] : e.sides && e.sides[t] ? zi(e.sides[t]) : "";
    }
    function Ti(e) {
        const t = document.createElement("div");
        return t.textContent = e, t.innerHTML;
    }
    function Pi(e) {
        return e ? e.replace(/^(Islamic Republic of|Republic of|State of|Kingdom of|Federal Republic of|Democratic Republic of|Commonwealth of|People's Republic of|United States of America|United Kingdom of Great Britain and Northern Ireland)\s+/i, "").replace(/\s*\(.*\)\s*/g, "").replace(/^Rep\.\s*/i, "").trim() : "";
    }
    window.toggleLayerByName = Si, window.toggleLayer = Ii;
    const qi = {
        "czech republic": "czechia",
        "dr congo": "dem. rep. congo",
        "ivory coast": "côte d'ivoire",
        "south sudan": "s. sudan",
        "north macedonia": "macedonia",
        "east timor": "timor-leste",
        "cape verde": "cabo verde",
        burma: "myanmar",
        holland: "netherlands",
        swaziland: "eswatini",
        "united states": "united states of america",
        czechia: "czechia",
        "central african republic": "central african rep.",
        "equatorial guinea": "eq. guinea",
        "dominican republic": "dominican rep."
    };
    function Oi(e) {
        var t = Pi(e).toLowerCase();
        return qi[t] || t;
    }
    function Ri(e) {
        if (!e) return "";
        let t = Pi(e);
        if (arabicNames[t]) return arabicNames[t];
        if (arabicNames[e]) return arabicNames[e];
        for (let [e, n] of Object.entries(arabicNames)) if (t.toLowerCase().includes(e.toLowerCase()) || e.toLowerCase().includes(t.toLowerCase())) return n;
        return e;
    }
    function Ni(e) {
        if (!e) return "";
        let t = Pi(e);
        if (russianNames[t]) return russianNames[t];
        if (russianNames[e]) return russianNames[e];
        for (let [e, n] of Object.entries(russianNames)) if (t.toLowerCase().includes(e.toLowerCase()) || e.toLowerCase().includes(t.toLowerCase())) return n;
        return e;
    }
    function Di(e) {
        if (!e) return "";
        let t = Pi(e);
        if (uzbekNames[t]) return uzbekNames[t];
        if (uzbekNames[e]) return uzbekNames[e];
        for (let [e, n] of Object.entries(uzbekNames)) if (t.toLowerCase().includes(e.toLowerCase()) || e.toLowerCase().includes(t.toLowerCase())) return n;
        return e;
    }
    function Fi(e) {
        if (!e) return "";
        let t = Pi(e);
        if (spanishNames[t]) return spanishNames[t];
        if (spanishNames[e]) return spanishNames[e];
        for (let [e, n] of Object.entries(spanishNames)) if (t.toLowerCase().includes(e.toLowerCase()) || e.toLowerCase().includes(t.toLowerCase())) return n;
        return e;
    }
    function Hi(e) {
        return e ? "ar" === Ht ? Ri(e) : "ru" === Ht ? Ni(e) : "uz" === Ht ? Di(e) : "es" === Ht ? Fi(e) : e : "";
    }
    function ji(e) {
        return e ? String(e).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[\u064B-\u065F\u0670\u0640]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ة/g, "ه").replace(/[ىي]/g, "ي").replace(/ؤ/g, "و").replace(/ئ/g, "ي").replace(/ё/g, "е").replace(/['`’‘ʻ]/g, "").replace(/[.,;:!?()\[\]{}\-_/\\|،؛؟]/g, " ").replace(/\s+/g, " ").trim() : "";
    }
    function Wi(e, t) {
        var n = ji(e), i = ji(t);
        if (!i) return 100;
        if (!n) return 0;
        if (n === i) return 100;
        if (0 === n.indexOf(i)) return 90;
        if (-1 !== n.indexOf(" " + i)) return 85;
        if (-1 !== n.indexOf(i)) return 75;
        var a = i.split(" ").filter(Boolean);
        if (a.length > 1) {
            for (var r = !0, o = 0; o < a.length; o++) if (-1 === n.indexOf(a[o])) {
                r = !1;
                break;
            }
            if (r) return 60;
        }
        return 0;
    }
    function Ui(e, t) {
        return Wi(e, t) > 0;
    }
    function $i(e) {
        if (!e) return [];
        var t = [ e, Pi(e), Ri(e), Ni(e), Di(e), Fi(e) ], n = da(e);
        return n && n.capital && (t.push(n.capital), n.capital_ar && t.push(n.capital_ar), 
        n.capital_ru && t.push(n.capital_ru), n.capital_uz && t.push(n.capital_uz), n.capital_es && t.push(n.capital_es)), 
        t;
    }
    function Ki(e, t) {
        if (!t) return 100;
        for (var n = $i(e), i = 0, a = 0; a < n.length; a++) if (n[a]) {
            var r = Wi(n[a], t);
            r > i && (i = r);
        }
        return i;
    }
    function Gi(e, t) {
        return Ki(e, t) > 0;
    }
    function Yi(e) {
        if (e) {
            var t = {
                properties: {
                    name: e.name_en || e.name_ar || e.id
                },
                _polity: e
            };
            if (e.origin_coords && Array.isArray(e.origin_coords)) {
                var i = ao()(e.origin_coords);
                if (i && !isNaN(i[0])) {
                    var a = d3.select("#mapSvg"), r = La(), o = d3.zoomIdentity.translate(r.width / 2 - 3.5 * i[0], r.height / 2 - 3.5 * i[1]).scale(3.5);
                    a.transition().duration(n() ? 0 : 750).call(si.transform, o);
                }
            }
            "function" == typeof openHistoryPanel && openHistoryPanel(t);
        }
    }
    function Vi(e) {
        if (!e) return "";
        if (Nt && Nt[Ht]) {
            var t = Nt[Ht], n = t[e] || t[Pi(e)];
            if (n) return n;
        }
        let i = Pi(e), a = null;
        return "ar" === Ht ? a = arabicNames[i] || arabicNames[e] : "ru" === Ht ? a = russianNames[i] || russianNames[e] : "uz" === Ht ? a = uzbekNames[i] || uzbekNames[e] : "es" === Ht && (a = spanishNames[i] || spanishNames[e]), 
        a || e;
    }
    function Qi(e) {
        if (!e) return "unknown";
        if (religionByCountry[e]) return religionByCountry[e];
        const t = Pi(e);
        if (religionByCountry[t]) return religionByCountry[t];
        for (let [e, n] of Object.entries(religionByCountry)) if (t.toLowerCase().includes(e.toLowerCase()) || e.toLowerCase().includes(t.toLowerCase())) return n;
        return "unknown";
    }
    function Xi(e) {
        if (!e) return Qi(e);
        if (denominationByCountry[e]) return denominationByCountry[e];
        const t = Pi(e);
        if (denominationByCountry[t]) return denominationByCountry[t];
        for (let [e, n] of Object.entries(denominationByCountry)) if (t.toLowerCase().includes(e.toLowerCase()) || e.toLowerCase().includes(t.toLowerCase())) return n;
        return Qi(e);
    }
    function Ji(e) {
        if (!e) return null;
        if (void 0 !== elevationByCountry[e]) return elevationByCountry[e];
        const t = Pi(e);
        return void 0 !== elevationByCountry[t] ? elevationByCountry[t] : null;
    }
    function Zi(e) {
        if (!e) return null;
        if (void 0 !== densityByCountry[e]) return densityByCountry[e];
        const t = Pi(e);
        if (void 0 !== densityByCountry[t]) return densityByCountry[t];
        for (let [e, n] of Object.entries(densityByCountry)) if (t.toLowerCase().includes(e.toLowerCase()) || e.toLowerCase().includes(t.toLowerCase())) return n;
        return null;
    }
    function ea(e) {
        if (!e) return null;
        if (void 0 !== precipitationByCountry[e]) return precipitationByCountry[e];
        const t = Pi(e);
        return void 0 !== precipitationByCountry[t] ? precipitationByCountry[t] : null;
    }
    function ta(e, t) {
        if (!e) return null;
        if (void 0 !== tempByCountry[e]) return tempByCountry[e];
        const n = Pi(e);
        if (void 0 !== tempByCountry[n]) return tempByCountry[n];
        if (t && t.geometry) {
            const e = d3.geoCentroid(t);
            if (e && !isNaN(e[1])) {
                const t = Math.abs(e[1]);
                let n = 28 - .8 * t;
                return t > 60 && (n = -20 - 1.2 * (t - 60)), t > 80 && (n = -20), Math.round(n);
            }
        }
        return null;
    }
    function na(e) {
        return null == e || isNaN(e) ? MAP_COLORS.terrain[0] : e < 0 ? MAP_COLORS.terrain[1] : e < 50 ? MAP_COLORS.terrain[2] : e < 200 ? MAP_COLORS.terrain[3] : e < 400 ? MAP_COLORS.terrain[4] : e < 700 ? MAP_COLORS.terrain[5] : e < 1200 ? MAP_COLORS.terrain[6] : e < 2e3 ? MAP_COLORS.terrain[7] : e < 3e3 ? MAP_COLORS.terrain[8] : e < 4e3 ? MAP_COLORS.terrain[9] : MAP_COLORS.terrain[10];
    }
    function ia(e) {
        return null == e || isNaN(e) ? MAP_COLORS.density[0] : e < 1 ? MAP_COLORS.density[1] : e < 10 ? MAP_COLORS.density[2] : e < 50 ? MAP_COLORS.density[3] : e < 100 ? MAP_COLORS.density[4] : e < 200 ? MAP_COLORS.density[5] : e < 500 ? MAP_COLORS.density[6] : e < 1e3 ? MAP_COLORS.density[7] : MAP_COLORS.density[8];
    }
    function aa(e) {
        return null == e || isNaN(e) ? MAP_COLORS.precipitation[0] : e < 100 ? MAP_COLORS.precipitation[1] : e < 300 ? MAP_COLORS.precipitation[2] : e < 600 ? MAP_COLORS.precipitation[3] : e < 1e3 ? MAP_COLORS.precipitation[4] : e < 1500 ? MAP_COLORS.precipitation[5] : e < 2e3 ? MAP_COLORS.precipitation[6] : e < 3e3 ? MAP_COLORS.precipitation[7] : MAP_COLORS.precipitation[8];
    }
    function ra(e) {
        return null == e || isNaN(e) ? MAP_COLORS.temperature[0] : e < -10 ? MAP_COLORS.temperature[1] : e < 0 ? MAP_COLORS.temperature[2] : e < 10 ? MAP_COLORS.temperature[3] : e < 15 ? MAP_COLORS.temperature[4] : e < 20 ? MAP_COLORS.temperature[5] : e < 25 ? MAP_COLORS.temperature[6] : e < 30 ? MAP_COLORS.temperature[7] : MAP_COLORS.temperature[8];
    }
    function oa(e) {
        return null == e || isNaN(e) ? MAP_COLORS.gdp[0] : e < 1e3 ? MAP_COLORS.gdp[1] : e < 3e3 ? MAP_COLORS.gdp[2] : e < 7e3 ? MAP_COLORS.gdp[3] : e < 15e3 ? MAP_COLORS.gdp[4] : e < 3e4 ? MAP_COLORS.gdp[5] : e < 5e4 ? MAP_COLORS.gdp[6] : e < 8e4 ? MAP_COLORS.gdp[7] : MAP_COLORS.gdp[8];
    }
    function sa(e) {
        return null == e || isNaN(e) ? MAP_COLORS.hdi[0] : e < .55 ? MAP_COLORS.hdi[1] : e < .7 ? MAP_COLORS.hdi[2] : e < .8 ? MAP_COLORS.hdi[3] : e < .9 ? MAP_COLORS.hdi[4] : MAP_COLORS.hdi[5];
    }
    function la(e) {
        if (!e) return null;
        if (void 0 !== gdpByCountry[e]) return gdpByCountry[e];
        const t = Pi(e);
        return void 0 !== gdpByCountry[t] ? gdpByCountry[t] : null;
    }
    function ca(e) {
        if (!e) return null;
        if (void 0 !== hdiByCountry[e]) return hdiByCountry[e];
        const t = Pi(e);
        return void 0 !== hdiByCountry[t] ? hdiByCountry[t] : null;
    }
    function da(e) {
        if (!e) return null;
        const t = Pi(e);
        let n = countryInfo[e] || countryInfo[t];
        if (!n) {
            const i = {
                "United States": "United States of America",
                USA: "United States of America",
                "United States of America": "United States",
                UK: "United Kingdom",
                "Great Britain": "United Kingdom",
                Britain: "United Kingdom",
                Russia: "Russian Federation",
                Congo: "Republic of the Congo",
                "DR Congo": "Democratic Republic of the Congo",
                "Dem. Rep. Congo": "Democratic Republic of the Congo",
                Czechia: "Czech Republic",
                "Ivory Coast": "Côte d'Ivoire",
                "Western Sahara": "W. Sahara"
            };
            if (i[e] && (n = countryInfo[i[e]]), !n && i[t] && (n = countryInfo[i[t]]), !n) for (let [i, a] of Object.entries(arabicNames)) if (a === e || a === t) {
                n = countryInfo[i];
                break;
            }
        }
        return n || null;
    }
    function ua(e) {
        const t = d3.color(MAP_COLORS.country.normal), n = .16 * (function(e) {
            let t = 0;
            for (let n = 0; n < e.length; n++) t = 31 * t + e.charCodeAt(n) | 0;
            return Math.abs(t) % 1e3 / 1e3;
        }(e || "") - .5);
        return n >= 0 ? t.brighter(1.6 * n).toString() : t.darker(1.6 * -n).toString();
    }
    function pa() {
        return void 0 !== Pe && Pe || void 0 !== Ke && "history" === Ke ? null : "normal" === ae ? "url(#countryShadow)" : null;
    }
    function ma(e) {
        const t = e.properties?.name || "";
        if ("normal" === ae) return ua(t);
        let n;
        if ("terrain" === ae) n = na(Ji(t)); else if ("density" === ae) n = ia(Zi(t)); else if ("precipitation" === ae) n = aa(ea(t)); else if ("temperature" === ae) n = ra(ta(t, e)); else if ("gdp" === ae) n = oa(la(t)); else if ("hdi" === ae) n = sa(ca(t)); else if (se) n = denominationColors[Xi(t)] || MAP_COLORS.country.defaultFill; else {
            const e = Qi(t);
            n = religionColors[e] || MAP_COLORS.country.defaultFill;
        }
        if ("all" === ie) return n;
        return Qi(t) === ie ? d3.color(n).brighter(.6).toString() : MAP_COLORS.country.filterDim;
    }
    function fa(e) {
        if ("normal" === ae) return MAP_COLORS.country.normalStroke;
        const t = e.properties?.name || "";
        return "all" !== ie && Qi(t) === ie ? "#fff" : MAP_COLORS.country.dimStroke;
    }
    function ha() {
        if (void 0 !== Pe && Pe || void 0 !== Ke && "history" === Ke) {
            var e = "terrain" === ae, t = "dark" === document.documentElement.getAttribute("data-theme") ? "rgba(255,255,255,0.75)" : "rgba(65,45,25,0.72)", n = document.getElementById("histModernBordersToggle");
            n && (n.classList.toggle("toggle-on", Dn), n.setAttribute("aria-pressed", Dn ? "true" : "false"));
            var i = document.getElementById("histModernLabelsToggle");
            i && (i.style.display = Dn ? "" : "none", i.classList.toggle("toggle-on", Dn && Fn), 
            i.setAttribute("aria-pressed", Dn && Fn ? "true" : "false")), e ? (Jn && Jn.style("display", "none"), 
            Qn && Qn.style("display", null), yn && (yn.attr("fill", function(e) {
                return ma(e);
            }).attr("opacity", 1).attr("filter", null).style("pointer-events", Dn ? null : "none"), 
            Dn ? yn.attr("stroke", t).attr("stroke-width", 1.1).attr("stroke-dasharray", "4,3").attr("vector-effect", "non-scaling-stroke") : yn.attr("stroke", "none").attr("stroke-width", 0).attr("stroke-dasharray", "none")), 
            ii && (ii.style("display", null), Fa())) : (Jn && (Jn.style("display", null), _s()), 
            yn && Qn && (Dn ? (Qn.style("display", null), yn.attr("fill", "none").attr("stroke", t).attr("stroke-width", 1.1).attr("stroke-dasharray", "4,3").attr("vector-effect", "non-scaling-stroke").attr("filter", null).style("pointer-events", "none")) : Qn.style("display", "none")), 
            ii && (ii.style("display", ce ? null : "none"), ce && Fa())), Xn && (Dn && Fn ? (Xn.style("display", null), 
            Or(fn)) : (Xn.style("display", "none"), bi && (bi.remove(), bi = null)));
        }
    }
    function ya(e) {
        return "normal" === ae ? .95 : "all" === ie ? .9 : Qi(e.properties?.name || "") === ie ? 1 : .35;
    }
    function ga() {
        var e = Yn.select("defs");
        if (e.empty() || e.select("#cbpat-0").empty()) for (var t = [ "M0,12 L12,0 M-6,6 L6,-6 M6,18 L18,6", "M3,3 L3,3.01 M9,9 L9,9.01", "M0,0 L12,12 M12,0 L0,12", "M0,3 L12,3 M0,9 L12,9", "M3,0 L3,12 M9,0 L9,12", "M0,0 L12,12 M-6,-6 L6,6 M6,18 L18,6", "M6,2.2 L6,2.21", "M3,9 L6,4 L9,9" ], n = 0; n < t.length; n++) {
            var i = e.append("pattern").attr("id", "cbpat-" + n).attr("width", 12).attr("height", 12).attr("patternUnits", "userSpaceOnUse"), a = "";
            a = 1 === n ? '<circle cx="3" cy="3" r="1.7" fill="rgba(255,255,255,0.6)"/><circle cx="9" cy="9" r="1.7" fill="rgba(255,255,255,0.6)"/><circle cx="3" cy="3" r="0.9" fill="rgba(0,0,0,0.5)"/><circle cx="9" cy="9" r="0.9" fill="rgba(0,0,0,0.5)"/>' : 6 === n ? '<g stroke="rgba(255,255,255,0.55)" stroke-width="2.2" fill="none"><circle cx="6" cy="6" r="3"/></g><g stroke="rgba(0,0,0,0.45)" stroke-width="1" fill="none"><circle cx="6" cy="6" r="3"/></g>' : '<g transform="translate(0.8,0.8)" stroke="rgba(255,255,255,0.55)" stroke-width="2.4" fill="none" stroke-linecap="round"><path d="' + t[n] + '"/></g><g stroke="rgba(0,0,0,0.45)" stroke-width="1" fill="none" stroke-linecap="round"><path d="' + t[n] + '"/></g>', 
            i.html(a);
        }
    }
    function va(e) {
        const t = e.properties?.name || "";
        if ("normal" === ae) return -1;
        if ("all" !== ie && "terrain" !== ae && Qi(t) !== ie) return -1;
        let n = -1;
        if ("terrain" === ae) {
            const e = Ji(t);
            if (null == e || isNaN(e)) return -1;
            const i = na(e);
            n = MAP_COLORS.terrain.indexOf(i);
        } else if ("density" === ae) {
            const e = Zi(t);
            n = null == e || isNaN(e) ? -1 : MAP_COLORS.density.indexOf(ia(e));
        } else if ("precipitation" === ae) {
            const e = ea(t);
            n = null == e || isNaN(e) ? -1 : MAP_COLORS.precipitation.indexOf(aa(e));
        } else if ("temperature" === ae) {
            const i = ta(t, e);
            n = null == i || isNaN(i) ? -1 : MAP_COLORS.temperature.indexOf(ra(i));
        } else if ("gdp" === ae) {
            const e = la(t);
            n = null == e || isNaN(e) ? -1 : MAP_COLORS.gdp.indexOf(oa(e));
        } else if ("hdi" === ae) {
            const e = ca(t);
            n = null == e || isNaN(e) ? -1 : MAP_COLORS.hdi.indexOf(sa(e));
        } else if (se) {
            const e = Xi(t);
            n = e && denominationColors[e] ? Object.keys(denominationColors).indexOf(e) : -1;
        } else {
            const e = Qi(t);
            n = e && religionColors[e] ? Object.keys(religionColors).indexOf(e) : -1;
        }
        return n;
    }
    function ba(e, t) {
        if (!e || !e.sides) return 0;
        var n = Object.keys(e.sides).indexOf(t);
        -1 === n && (n = 0);
        var i = [ 0, 2, 1, 3, 4, 5, 6, 7 ];
        return i[n % i.length];
    }
    function wa() {
        if (!de) return d3.selectAll(".hist-cbpat").remove(), "function" == typeof renderHistoryLegend && void 0 !== Pe && Pe && renderHistoryLegend(), 
        void (void 0 !== Fe && "faiths" === Fe && Wl(El));
        ga(), void 0 !== Pe && Pe && (void 0 !== Fe && "wars" === Fe ? "function" == typeof drawHistoryScenario && drawHistoryScenario(!0) : void 0 !== Fe && "eras" === Fe ? "function" == typeof drawEraScene && drawEraScene(!0) : void 0 !== Fe && "faiths" === Fe && jl(El, !0));
    }
    function Ea() {
        if (gn && yn) if (de && "normal" !== ae) {
            ga();
            var e = fn.filter(function(e) {
                return va(e) >= 0;
            }), t = gn.selectAll("path.cbpat").data(e, function(e) {
                return e.properties && e.properties.name || "";
            });
            t.exit().remove(), t.enter().append("path").attr("class", "cbpat").attr("stroke", "none").style("pointer-events", "none"), 
            gn.selectAll("path.cbpat").attr("d", function(e) {
                return Gn(e);
            }).attr("fill", function(e) {
                return "url(#cbpat-" + (va(e) % 8 + 8) % 8 + ")";
            });
        } else gn.selectAll("path.cbpat").remove();
        wa();
    }
    function ka() {
        de = !de;
        try {
            localStorage.setItem("cbPatterns", de ? "1" : "0");
        } catch (e) {}
        var e = document.getElementById("colorblindToggle");
        e && (e.classList.toggle("toggle-on", de), e.setAttribute("aria-pressed", de ? "true" : "false")), 
        Ea(), Gr(), X(de ? zi("colorblindToggleOn") || "تم تفعيل أنماط عمى الألوان" : zi("colorblindToggleOff") || "تم إيقاف أنماط عمى الألوان");
    }
    function xa(e) {
        En = e, _n = "ethnicGroup";
        var t = "<h3>👥 " + ("ar" === Ht ? e.name : "ru" === Ht ? e.name_ru || e.name_en : "uz" === Ht ? e.name_uz || e.name_en : "es" === Ht && e.name_es || e.name_en) + "</h3>";
        (e.population_ar || e.population_en) && (t += "<p><strong>" + zi("populationTitle") + ":</strong> " + ("ar" === Ht ? e.population_ar : "ru" === Ht ? e.population_ru || e.population_en : "uz" === Ht ? e.population_uz || e.population_en : "es" === Ht && e.population_es || e.population_en) + "</p>"), 
        (e.countries_ar || e.countries_en) && (t += "<p><strong>" + zi("featureCountries") + ":</strong> " + ("ar" === Ht ? e.countries_ar : "ru" === Ht ? e.countries_ru || e.countries_en : "uz" === Ht ? e.countries_uz || e.countries_en : "es" === Ht && e.countries_es || e.countries_en) + "</p>"), 
        (e.language_ar || e.language_en) && (t += "<p><strong>" + zi("languageTitle") + ":</strong> " + ("ar" === Ht ? e.language_ar : "ru" === Ht ? e.language_ru || e.language_en : "uz" === Ht ? e.language_uz || e.language_en : "es" === Ht && e.language_es || e.language_en) + "</p>"), 
        (e.religion_ar || e.religion_en) && (t += "<p><strong>" + zi("tooltipReligion") + ":</strong> " + ("ar" === Ht ? e.religion_ar : "ru" === Ht ? e.religion_ru || e.religion_en : "uz" === Ht ? e.religion_uz || e.religion_en : "es" === Ht && e.religion_es || e.religion_en) + "</p>"), 
        (e.description_ar || e.description_en) && (t += "<p><strong>" + zi("featureDescription") + ":</strong> " + ("ar" === Ht ? e.description_ar : "ru" === Ht ? e.description_ru || e.description_en : "uz" === Ht ? e.description_uz || e.description_en : "es" === Ht && e.description_es || e.description_en) + "</p>"), 
        wn = performance.now(), P.innerHTML = t, T.style.display = "block", requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                T.classList.add("visible");
            });
        });
    }
    function _a(e) {
        if (!e || "ar" === Ht) return e;
        var t = e.match(/^([\d,.+]+)\s+(.+)$/);
        if (!t) return e;
        var n = t[1], i = t[2], a = i18n[Ht] || {}, r = {
            "مليار برميل": a.unitBillionBarrels,
            "تريليون م³": a.unitTrillionM3,
            "تريليون م³/سنة": a.unitTrillionM3Year,
            "تريليون متر مكعب": a.unitTrillionCubicMeters,
            "جيجاواط": a.unitGigawatts,
            "طن": a.unitTons,
            "طن/سنة": a.unitTonsYear,
            "مليون برميل/يوم": a.unitMillionBarrelsDay,
            "ملايين برميل/يوم": a.unitMillionBarrelsDayPlural,
            "مليون طن": a.unitMillionTons,
            "ملايين طن": a.unitMillionTonsPlural,
            "مليون طن/سنة": a.unitMillionTonsYear,
            "ملايين طن/سنة": a.unitMillionTonsYearPlural,
            "مليار طن": a.unitBillionTons,
            "مليار طن/سنة": a.unitBillionTonsYear,
            "مليار قيراط": a.unitBillionCarats,
            "مليار م³/سنة": a.unitBillionM3Year,
            "مليار متر مكعب/سنة": a.unitBillionCubicMetersYear,
            "مليارات هكتار": a.unitBillionHectares,
            "مليون قيراط": a.unitMillionCarats,
            "مليون قيراط/سنة": a.unitMillionCaratsYear
        }[i];
        return r ? n + " " + r : e;
    }
    function Ca(e) {
        if (!e) return "Unknown";
        const t = Pi(e);
        if (continentByCountry[t]) return continentByCountry[t];
        if (continentByCountry[e]) return continentByCountry[e];
        const n = fn.find(n => n.properties?.name === e || Pi(n.properties?.name) === t);
        if (n && n.geometry) {
            const e = d3.geoCentroid(n);
            if (e && !isNaN(e[0])) {
                const t = e[1], n = e[0];
                if (t > 60) return "Europe";
                if (t < -50) return "Antarctica";
                if (n > -25 && n < 50 && t > -35 && t < 37) return "Africa";
                if (n > -130 && n < -60 && t > 20) return "North America";
                if (n > -85 && n < -30 && t < 10) return "South America";
                if (n > 70 && n < 150 && t > 10) return "Asia";
                if (n > 110 && n < 180 && t < -10) return "Oceania";
                if (n > -10 && n < 40 && t > 35) return "Europe";
            }
        }
        return "Unknown";
    }
    function La() {
        const e = Q.getBoundingClientRect();
        return {
            width: e.width,
            height: e.height
        };
    }
    function Ba(e, t) {
        const n = xi ? .8 : .3, i = d3.geoPolyhedralWaterman().scale(.38 * Math.min(e, t)).translate([ e / 2, t / 2 ]).rotate([ 0, 0 ]).precision(n);
        try {
            const n = d3.geoPath(i).bounds({
                type: "Sphere"
            }), a = n[1][0] - n[0][0], r = n[1][1] - n[0][1];
            a > 0 && r > 0 && i.scale(i.scale() * Math.min(e / a, t / r) * .96);
        } catch (e) {}
        return i;
    }
    function Sa() {
        Zn.selectAll("*").remove();
        const e = d3.geoGraticule10();
        Zn.append("path").datum(e).attr("fill", "none").attr("stroke", MAP_COLORS.graticule.line).attr("stroke-width", .5).attr("d", Gn);
        const t = {
            type: "LineString",
            coordinates: d3.range(-180, 181, 10).map(e => [ e, 0 ])
        };
        Zn.append("path").datum(t).attr("fill", "none").attr("stroke", MAP_COLORS.graticule.equator).attr("stroke-width", 1.2).attr("stroke-dasharray", "4,4").attr("opacity", .6).attr("d", Gn);
        const n = {
            type: "LineString",
            coordinates: d3.range(-180, 181, 5).map(e => [ e, 23.44 ])
        };
        Zn.append("path").datum(n).attr("fill", "none").attr("stroke", MAP_COLORS.graticule.tropic).attr("stroke-width", .8).attr("stroke-dasharray", "6,3").attr("opacity", .5).attr("d", Gn);
        const i = {
            type: "LineString",
            coordinates: d3.range(-180, 181, 5).map(e => [ e, -23.44 ])
        };
        Zn.append("path").datum(i).attr("fill", "none").attr("stroke", MAP_COLORS.graticule.tropic).attr("stroke-width", .8).attr("stroke-dasharray", "6,3").attr("opacity", .5).attr("d", Gn);
        Zn.append("path").datum({
            type: "LineString",
            coordinates: [ [ 0, -90 ], [ 0, 90 ] ]
        }).attr("fill", "none").attr("stroke", MAP_COLORS.graticule.meridian).attr("stroke-width", .8).attr("opacity", .4).attr("d", Gn);
        Zn.append("path").datum({
            type: "LineString",
            coordinates: [ [ 180, -90 ], [ 180, 90 ] ]
        }).attr("fill", "none").attr("stroke", MAP_COLORS.graticule.meridian).attr("stroke-width", .8).attr("opacity", .4).attr("d", Gn);
        const a = {
            type: "LineString",
            coordinates: d3.range(-180, 181, 5).map(e => [ e, 66.56 ])
        };
        Zn.append("path").datum(a).attr("fill", "none").attr("stroke", MAP_COLORS.graticule.polar).attr("stroke-width", .6).attr("stroke-dasharray", "2,6").attr("opacity", .4).attr("d", Gn);
        const r = {
            type: "LineString",
            coordinates: d3.range(-180, 181, 5).map(e => [ e, -66.56 ])
        };
        Zn.append("path").datum(r).attr("fill", "none").attr("stroke", MAP_COLORS.graticule.polar).attr("stroke-width", .6).attr("stroke-dasharray", "2,6").attr("opacity", .4).attr("d", Gn), 
        Zn.append("path").datum({
            type: "Sphere"
        }).attr("fill", "none").attr("stroke", MAP_COLORS.graticule.sphere).attr("stroke-width", .6).attr("opacity", .25).attr("d", Gn);
    }
    function Ia() {
        if (!ei) return;
        ei.selectAll("*").remove();
        const e = d3.geoCircle().center([ 0, 90 ]).radius(23.44).precision(1)(), t = Jo(e, ao(), .55 * Math.min(ki().width, ki().height));
        (Array.isArray(t) ? t : [ e ]).forEach(function(e, t) {
            const n = "Polygon" === e.type ? e.coordinates[0] : e.coordinates, i = Da(n[Math.floor(n.length / 2)]), a = "all" === ie || i === ie ? 1 : .35;
            ei.append("path").datum(e).attr("class", "arctic-ice").attr("d", Gn).style("opacity", a).attr("tabindex", 0 === t ? 0 : -1).attr("role", "button").attr("aria-label", function() {
                return zi("arcticName");
            }).on("mouseenter", function(e) {
                if (Te || st || dt) return;
                r.textContent = "";
                const t = document.createElement("div");
                for (t.innerHTML = "<div><strong>" + zi("arcticName") + "</strong></div>"; t.firstChild; ) r.appendChild(t.firstChild);
                Hr = e, jr(), r.classList.add("visible");
            }).on("mousemove", function(e) {
                Te || st || dt || (Hr = e, Fr || (Fr = !0, requestAnimationFrame(jr)));
            }).on("mouseleave", function() {
                r.classList.remove("visible");
            }).on("click", function(e) {
                Te || st || dt || (e.stopPropagation(), za());
            }).on("keydown", function(e) {
                "Enter" !== e.key && " " !== e.key || (e.preventDefault(), za());
            });
        });
    }
    function za() {
        Mr(), wn = performance.now();
        let e = "<h3>🧊 " + zi("arcticName") + "</h3>";
        e += "<p><strong>" + zi("arcticArea") + ":</strong> 14,056,000 " + zi("km2") + "</p>", 
        e += "<p><strong>" + zi("arcticAvgDepth") + ":</strong> ~1,205 m</p>", e += "<p><strong>" + zi("arcticMaxDepth") + ":</strong> 5,549 m</p>", 
        e += "<p>" + zi("arcticDesc") + "</p>", P.innerHTML = e, T.style.display = "block", 
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                T.classList.add("visible");
            });
        });
    }
    function Aa(e) {
        En = e, _n = "route";
        var t = "ar" === Ht ? e.name_ar : "ru" === Ht ? e.name_ru || e.name_en : "uz" === Ht ? e.name_uz || e.name_en : "es" === Ht && e.name_es || e.name_en, n = "<h3>" + ("land" === e.type ? "🚛" : "sea" === e.type ? "🚢" : "air" === e.type ? "✈️" : "pipeline" === e.type ? "🛢️" : "canal" === e.type ? "🚰" : "🌊") + " " + t + "</h3>";
        e.length_km && (n += "<p><strong>" + zi("featureLength") + ":</strong> " + e.length_km + " " + zi("featureKm") + "</p>"), 
        (e.countries_ar || e.countries_en) && (n += "<p><strong>" + zi("featureCountries") + ":</strong> " + ("ar" === Ht ? e.countries_ar : "ru" === Ht ? e.countries_ru || e.countries_en : "uz" === Ht ? e.countries_uz || e.countries_en : "es" === Ht && e.countries_es || e.countries_en) + "</p>");
        var i = "land" === e.type ? zi("landRoute") : "sea" === e.type ? zi("seaRoute") : "canal" === e.type ? zi("canal") : "strait" === e.type ? zi("strait") : "air" === e.type ? zi("airRoute") : "pipeline" === e.type ? zi("pipeline") : e.type;
        n += "<p><strong>" + zi("routeType") + ":</strong> " + i + "</p>", wn = performance.now(), 
        P.innerHTML = n, T.style.display = "block", requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                T.classList.add("visible");
            });
        });
    }
    function Ma(e) {
        if (ni.selectAll("*").remove(), le || Ee) {
            var t = ao(), i = [];
            if (le && (i = i.concat(corridorsData)), Ee) {
                var a = new Set(i.map(function(e) {
                    return e.name_en;
                })), r = additionalWaterwaysData.filter(function(e) {
                    return !a.has(e.name_en);
                });
                i = i.concat(r.map(function(e) {
                    return {
                        name_ar: e.name,
                        name_en: e.name_en,
                        name_ru: e.name_ru || featureRussian.corridors[e.name_en] || e.name_en,
                        name_uz: e.name_uz || featureUzbek.corridors[e.name_en] || e.name_en,
                        name_es: e.name_es || "undefined" != typeof featureSpanish && featureSpanish.corridors && featureSpanish.corridors[e.name_en] || e.name_en,
                        coords: e.coords,
                        type: "canal" === e.type ? "canal" : "strait" === e.type ? "strait" : "sea",
                        length_km: e.length_km,
                        countries_ar: e.countries_ar,
                        countries_en: e.countries_en,
                        countries_ru: e.countries_ru || e.countries_en,
                        countries_uz: e.countries_uz || e.countries_en,
                        countries_es: e.countries_es || e.countries_en
                    };
                }));
            }
            i.forEach(function(i) {
                var a = MAP_COLORS.routes[i.type] || MAP_COLORS.routes.other, r = i.coords, o = ni.append("path").datum({
                    type: "LineString",
                    coordinates: r
                }).attr("d", Gn).attr("fill", "none").attr("stroke", a).attr("stroke-width", xi ? 7 : 10).attr("vector-effect", "non-scaling-stroke").style("cursor", "pointer").on("click", function() {
                    Aa(i);
                });
                e ? o.attr("opacity", .35) : o.attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .35), 
                o = ni.append("path").datum({
                    type: "LineString",
                    coordinates: r
                }).attr("d", Gn).attr("fill", "none").attr("stroke", a).attr("stroke-width", xi ? 2.5 : 3).attr("vector-effect", "non-scaling-stroke").style("pointer-events", "none"), 
                e ? o.attr("opacity", 1) : o.attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", 1);
                var s = r[0], l = r[r.length - 1], c = Math.max(.4, li.k), d = (xi ? 2 : 2.8) / c, u = (xi ? 6.5 : 8.5) / c;
                [ s, l ].forEach(function(i) {
                    var r = t(i);
                    if (r && !isNaN(r[0])) {
                        var o = ni.append("circle").attr("cx", r[0]).attr("cy", r[1]).attr("r", d).attr("fill", a).attr("stroke", "#fff").attr("stroke-width", .5 / c).style("pointer-events", "none");
                        e ? o.attr("opacity", 1) : o.attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", 1);
                    }
                });
                var p = r[Math.floor(r.length / 2)], m = t(p);
                if (m && !isNaN(m[0])) {
                    var f = ni.append("text").attr("x", m[0]).attr("y", m[1] - 4 / c).text(function() {
                        return "ar" === Ht ? i.name_ar : "ru" === Ht ? i.name_ru || i.name_en : "uz" === Ht ? i.name_uz || i.name_en : "es" === Ht && i.name_es || i.name_en;
                    }).attr("fill", "#fff").attr("font-size", u + "px").attr("text-anchor", "middle").style("pointer-events", "none").style("text-shadow", "0 1px 3px rgba(0,0,0,0.9)");
                    e ? f.attr("opacity", .85) : f.attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .85);
                }
            });
        }
    }
    function Ta() {
        Ma();
    }
    function Pa(e) {
        En = e, _n = "histRoute";
        var t = "<h3>📜 " + Ti(Ai(e, "name")) + "</h3>", n = Ai(e, "era");
        n && (t += "<p><strong>" + zi("histRouteEra") + ":</strong> " + Ti(n) + "</p>");
        var i = Ai(e, "desc");
        i && (t += "<p>" + Ti(i) + "</p>"), e.src && (t += '<p class="hist-disclaimer-mini"><strong>' + zi("histRouteSource") + ":</strong> " + Ti(e.src) + "</p>"), 
        wn = performance.now(), P.innerHTML = t, T.style.display = "block", requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                T.classList.add("visible");
            });
        });
    }
    function qa(e) {
        if (sn && (sn.selectAll("*").remove(), ke && (void 0 === Ke || "geo" !== Ke) && (void 0 === Pe || Pe))) {
            var t = ao(), i = n() ? 0 : 300, a = li && li.k || 1, r = window.innerWidth <= 768, o = r ? 11.5 : 13.5, s = r ? 13.5 : 15.5, l = Math.max(o, Math.min(s, o * Math.pow(a, .15))) / a, c = 6 / a, d = (r ? 3 : 4) / a, u = 1 / a, p = "undefined" != typeof historicalRoutesData && Array.isArray(historicalRoutesData) ? historicalRoutesData : "undefined" != typeof window && Array.isArray(window.historicalRoutesData) ? window.historicalRoutesData : null;
            p && p.forEach(function(n) {
                var a = n.coords, o = _o(Ai(n, "name")), s = sn.append("path").datum({
                    type: "LineString",
                    coordinates: a
                }).attr("d", Gn).attr("fill", "none").attr("stroke", n.color).attr("stroke-width", r ? 8 : 11).attr("stroke-opacity", .22).attr("vector-effect", "non-scaling-stroke").attr("class", "hist-route-path").attr("role", "button").attr("tabindex", "0").attr("aria-label", (zi("histRoutePinLabel") || "طريق تاريخي") + ": " + o).style("cursor", "pointer").on("click", function() {
                    Pa(n);
                }).on("keydown", function(e) {
                    "Enter" !== e.key && " " !== e.key || (e.preventDefault && e.preventDefault(), Pa(n));
                }), p = sn.append("path").datum({
                    type: "LineString",
                    coordinates: a
                }).attr("d", Gn).attr("fill", "none").attr("stroke", n.color).attr("stroke-width", r ? 2.5 : 3).attr("stroke-dasharray", "10,6").attr("vector-effect", "non-scaling-stroke").style("pointer-events", "none");
                [ a[0], a[a.length - 1] ].forEach(function(e) {
                    var i = t(e);
                    i && !isNaN(i[0]) && sn.append("circle").attr("class", "hist-route-node").attr("cx", i[0]).attr("cy", i[1]).attr("r", d).attr("fill", n.color).attr("stroke", "#fff").attr("stroke-width", u).attr("vector-effect", "non-scaling-stroke").style("pointer-events", "none");
                });
                var m = a[Math.floor(a.length / 2)], f = t(m);
                if (f && !isNaN(f[0])) {
                    var h = _o(Ai(n, "name"));
                    sn.append("text").attr("class", "hist-route-label").attr("data-cy", f[1]).attr("x", f[0]).attr("y", f[1] - c).text(h).attr("fill", n.color || "#fbbf24").attr("font-size", l + "px").attr("font-weight", "700").attr("text-anchor", "middle").attr("style", "text-shadow: 0 1px 3px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.85); pointer-events: none;");
                }
                e ? (s.attr("opacity", 1), p.attr("opacity", .95)) : (s.attr("opacity", 0).transition().duration(i).attr("opacity", 1), 
                p.attr("opacity", 0).transition().duration(i).attr("opacity", .95));
            });
        }
    }
    function Oa() {
        Ut.selectAll("*").remove();
    }
    function Ra() {
        Kt.selectAll("*").remove();
    }
    function Na(e) {
        $t.selectAll("*").remove(), me && timezoneBoundariesData.forEach(function(e) {
            var t, n, i = e.coordinates, a = {
                type: "Feature",
                geometry: i.length > 1 ? {
                    type: "MultiLineString",
                    coordinates: i
                } : {
                    type: "LineString",
                    coordinates: i[0]
                },
                properties: {
                    zone: e.zone,
                    label: e.label,
                    places: e.places
                }
            }, o = (t = e.zone, n = MAP_COLORS.timezones, t <= -12 ? n[0] : t <= -9 ? n[1] : t <= -6 ? n[2] : t <= -3 ? n[3] : t <= 0 ? n[4] : t <= 3 ? n[5] : t <= 6 ? n[6] : t <= 9 ? n[7] : n[8]);
            $t.append("path").datum(a).attr("d", Gn).attr("fill", "none").attr("stroke", o).attr("stroke-width", xi ? 3 : 5).attr("stroke-opacity", .25).attr("vector-effect", "non-scaling-stroke").style("pointer-events", "none");
            var s = $t.append("path").datum(a).attr("d", Gn).attr("fill", "none").attr("stroke", o).attr("stroke-width", xi ? 1.2 : 1.8).attr("stroke-opacity", .9).attr("vector-effect", "non-scaling-stroke").style("cursor", "pointer").on("mouseenter", function(t) {
                s.attr("stroke-width", xi ? 2 : 3);
                var n = "undefined" != typeof timezoneTranslations && timezoneTranslations[e.places] ? Ai(timezoneTranslations[e.places], "places") : e.places;
                r.textContent = e.label + " — " + n, r.classList.add("visible");
            }).on("mousemove", function(e) {
                Hr = e, Fr || (Fr = !0, requestAnimationFrame(jr));
            }).on("mouseleave", function() {
                s.attr("stroke-width", xi ? 1.2 : 1.8), r.classList.remove("visible");
            }).on("click", function() {
                Ar("timezone", e);
            }), l = d3.geoCentroid(a), c = ao()(l);
            if (c && !isNaN(c[0]) && !isNaN(c[1])) {
                var d = Math.max(.4, li.k), u = (xi ? 2.5 : 3.5) / d;
                $t.append("circle").attr("cx", c[0]).attr("cy", c[1]).attr("r", u).attr("fill", o).attr("fill-opacity", .85).attr("stroke", "#fff").attr("stroke-width", .5 / d).style("cursor", "pointer").on("mouseenter", function(t) {
                    s.attr("stroke-width", xi ? 2 : 3), r.textContent = e.label + " — " + e.places, 
                    r.classList.add("visible");
                }).on("mousemove", function(e) {
                    Hr = e, Fr || (Fr = !0, requestAnimationFrame(jr));
                }).on("mouseleave", function() {
                    s.attr("stroke-width", xi ? 1.2 : 1.8), r.classList.remove("visible");
                }).on("click", function() {
                    Ar("timezone", e);
                });
            }
        });
    }
    function Da(e) {
        if (!e) return "unknown";
        for (let t = 0; t < fn.length; t++) try {
            if (d3.geoContains(fn[t], e)) return Qi(fn[t].properties?.name || "");
        } catch (e) {}
        return "unknown";
    }
    function Fa() {
        ii.selectAll("*").remove();
        var e = ao();
        const t = "terrain" === ae, i = "terrain" === ae || ce;
        (t || i) && (t && mountainRanges.forEach(t => {
            const i = Da(t.coords[Math.floor(t.coords.length / 2)]), a = "all" === ie || i === ie ? 1 : .35, r = t.weight || 1, o = ii.append("g").attr("class", "terrain-feature").style("cursor", "pointer");
            o.append("path").datum({
                type: "LineString",
                coordinates: t.coords
            }).attr("d", Gn).attr("fill", "none").attr("stroke", MAP_COLORS.physical.mountainShadow).attr("stroke-width", r * (xi ? 2.2 : 3.8)).attr("stroke-linecap", "round").attr("stroke-linejoin", "round").attr("vector-effect", "non-scaling-stroke").attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .45 * a);
            const s = o.append("path").datum({
                type: "LineString",
                coordinates: t.coords
            }).attr("d", Gn).attr("fill", "none").attr("stroke", 3 === r ? MAP_COLORS.physical.mountainMajor : 2 === r ? MAP_COLORS.physical.mountainImportant : MAP_COLORS.physical.mountainMinor).attr("stroke-width", r * (xi ? 1.1 : 1.8)).attr("stroke-linecap", "round").attr("stroke-linejoin", "round").attr("vector-effect", "non-scaling-stroke").attr("data-feature", "mountain").attr("data-name", t.name).attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .95 * a), l = 3 === r ? 1 : 2;
            t.coords.forEach((t, i) => {
                if (i % l !== 0) return;
                const s = e(t);
                if (!s || isNaN(s[0])) return;
                const c = s[0], d = s[1], u = Math.max(.4, li.k), p = r * (xi ? 1.5 : 2.2) / u;
                o.append("path").attr("d", `M${c},${d - p} L${c - .75 * p},${d + .55 * p} L${c + .75 * p},${d + .55 * p} Z`).attr("fill", 3 === r ? MAP_COLORS.physical.mountainPeakMajor : 2 === r ? MAP_COLORS.physical.mountainPeakImportant : MAP_COLORS.physical.mountainPeakMinor).attr("stroke", MAP_COLORS.physical.mountainShadow).attr("stroke-width", .3 / u).attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .9 * a);
            }), o.on("mouseenter", function() {
                s.attr("stroke", MAP_COLORS.physical.mountainHover).attr("opacity", Math.min(1, a));
            }).on("mouseleave", function() {
                s.attr("stroke", 3 === r ? MAP_COLORS.physical.mountainMajor : 2 === r ? MAP_COLORS.physical.mountainImportant : MAP_COLORS.physical.mountainMinor).attr("opacity", .95 * a);
            }).on("click", function(e) {
                e.stopPropagation(), Ar("mountain", t);
            });
        }), i && [ 1, 2, 3 ].forEach(e => {
            rivers.filter(t => (t.weight || 1) === e).forEach(e => {
                const t = Da(e.coords[Math.floor(e.coords.length / 2)]), i = "all" === ie || t === ie ? 1 : .35, a = e.weight || 1, r = ii.append("g").attr("class", "terrain-feature").style("cursor", "pointer");
                r.append("path").datum({
                    type: "LineString",
                    coordinates: e.coords
                }).attr("d", Gn).attr("fill", "none").attr("stroke", MAP_COLORS.physical.riverHalo).attr("stroke-width", a * (xi ? 1.8 : 2.8)).attr("stroke-linecap", "round").attr("stroke-linejoin", "round").attr("vector-effect", "non-scaling-stroke").attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .3 * i);
                const o = r.append("path").datum({
                    type: "LineString",
                    coordinates: e.coords
                }).attr("d", Gn).attr("fill", "none").attr("stroke", 3 === a ? MAP_COLORS.physical.riverMajor : 2 === a ? MAP_COLORS.physical.riverImportant : MAP_COLORS.physical.riverMinor).attr("stroke-width", a * (xi ? .9 : 1.4)).attr("stroke-linecap", "round").attr("stroke-linejoin", "round").attr("vector-effect", "non-scaling-stroke").attr("data-feature", "river").attr("data-name", e.name).attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .88 * i);
                r.on("mouseenter", function() {
                    o.attr("stroke", MAP_COLORS.physical.riverHover).attr("opacity", Math.min(1, i));
                }).on("mouseleave", function() {
                    o.attr("stroke", 3 === a ? MAP_COLORS.physical.riverMajor : 2 === a ? MAP_COLORS.physical.riverImportant : MAP_COLORS.physical.riverMinor).attr("opacity", .88 * i);
                }).on("click", function(t) {
                    t.stopPropagation(), Ar("river", e);
                });
            });
        }));
    }
    function Ha(e) {
        En = e, _n = "resource";
        var t = "ar" === Ht ? e.name : "ru" === Ht ? e.name_ru || e.name_en : "uz" === Ht ? e.name_uz || e.name_en : "es" === Ht && e.name_es || e.name_en, n = "<h3>" + ("oil" === e.type ? "🛢️" : "gas" === e.type ? "🔥" : "coal" === e.type ? "⛏️" : "metal" === e.type ? "🔩" : "precious" === e.type ? "💎" : "nuclear" === e.type ? "☢️" : "renewable" === e.type ? "♻️" : "water" === e.type ? "💧" : "forest" === e.type ? "🌲" : "🗿") + " " + t + "</h3>";
        (e.countries_ar || e.countries_en) && (n += "<p><strong>" + zi("featureCountries") + ":</strong> " + ("ar" === Ht ? e.countries_ar : "ru" === Ht ? e.countries_ru || e.countries_en : "uz" === Ht ? e.countries_uz || e.countries_en : "es" === Ht && e.countries_es || e.countries_en) + "</p>"), 
        e.reserves && (n += "<p><strong>" + zi("reserves") + ":</strong> " + _a(e.reserves) + "</p>"), 
        e.production && (n += "<p><strong>" + zi("production") + ":</strong> " + _a(e.production) + "</p>"), 
        e.capacity && (n += "<p><strong>" + zi("capacity") + ":</strong> " + _a(e.capacity) + "</p>"), 
        (e.description_ar || e.description_en) && (n += "<p><strong>" + zi("featureDescription") + ":</strong> " + ("ar" === Ht ? e.description_ar : "ru" === Ht ? e.description_ru || e.description_en : "uz" === Ht ? e.description_uz || e.description_en : "es" === Ht && e.description_es || e.description_en) + "</p>"), 
        wn = performance.now(), P.innerHTML = n, T.style.display = "block", requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                T.classList.add("visible");
            });
        });
    }
    function ja() {
        if (Gt.selectAll("*").remove(), he) {
            var e = Math.max(.4, li.k), t = MAP_COLORS.naturalResources, i = (xi ? 5.5 : 7) / e, a = (xi ? 12 : 14) / e;
            Gt.on("click") || Gt.on("click", function(e) {
                if ("circle" === e.target.tagName) {
                    var t = d3.select(e.target).datum();
                    t && Ha(t);
                }
            });
            var r = ao();
            naturalResourcesData.forEach(function(o) {
                var s = r(Array.isArray(o.coords[0]) ? o.coords[0] : o.coords);
                if (s && !isNaN(s[0])) {
                    var l = t[o.type] || MAP_COLORS.naturalResources.default;
                    Gt.append("circle").attr("cx", s[0]).attr("cy", s[1]).attr("r", 1.5 * i).attr("fill", l).style("pointer-events", "none").attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .2), 
                    Gt.append("circle").datum(o).attr("cx", s[0]).attr("cy", s[1]).attr("r", i).attr("fill", l).attr("stroke", "#fff").attr("stroke-width", 1.2 / e).style("cursor", "pointer").attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .88), 
                    Gt.append("text").attr("x", s[0] + i + 5 / e).attr("y", s[1] + 4.5 / e).text(function() {
                        return "ar" === Ht ? o.name : "ru" === Ht ? o.name_ru || o.name_en : "uz" === Ht ? o.name_uz || o.name_en : "es" === Ht && o.name_es || o.name_en;
                    }).attr("fill", "#fff").attr("font-size", a + "px").attr("font-weight", "bold").style("pointer-events", "none").style("text-shadow", "0 1px 3px rgba(0,0,0,0.95), 0 0 4px rgba(0,0,0,0.85)");
                }
            });
        }
    }
    function Wa() {
        if (Yt.selectAll("*").remove(), ye) {
            var e = MAP_COLORS.ethnicGroups, t = xi, i = Math.max(.4, li.k), a = (t ? 5.5 : 7) / i, r = (t ? 12 : 14) / i;
            Yt.on("click") || Yt.on("click", function(e) {
                if ("circle" === e.target.tagName) {
                    var t = d3.select(e.target).datum();
                    t && xa(t);
                }
            });
            var o = ao();
            ethnicGroupsData.forEach(function(t, s) {
                var l = o(Array.isArray(t.coords[0]) ? t.coords[0] : t.coords);
                if (l && !isNaN(l[0])) {
                    var c = e[s % e.length];
                    Yt.append("circle").attr("cx", l[0]).attr("cy", l[1]).attr("r", 1.5 * a).attr("fill", c).style("pointer-events", "none").attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .2), 
                    Yt.append("circle").datum(t).attr("cx", l[0]).attr("cy", l[1]).attr("r", a).attr("fill", c).attr("stroke", "#fff").attr("stroke-width", 1.2 / i).style("cursor", "pointer").attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .7), 
                    Yt.append("text").attr("x", l[0] + a + 5 / i).attr("y", l[1] + 4.5 / i).text(function() {
                        return "ar" === Ht ? t.name : "ru" === Ht ? t.name_ru || t.name_en : "uz" === Ht ? t.name_uz || t.name_en : "es" === Ht && t.name_es || t.name_en;
                    }).attr("fill", "#fff").attr("font-size", r + "px").attr("font-weight", "bold").style("pointer-events", "none").style("text-shadow", "0 1px 3px rgba(0,0,0,0.95), 0 0 4px rgba(0,0,0,0.85)");
                }
            });
        }
    }
    function Ua(e) {
        En = e, _n = "oceanCurrent";
        var t = "<h3>🌊 " + ("ar" === Ht ? e.name : "ru" === Ht ? e.name_ru || e.name_en : "uz" === Ht ? e.name_uz || e.name_en : "es" === Ht && e.name_es || e.name_en) + "</h3>";
        if ("warm" === e.type || "cold" === e.type) {
            var n = "warm" === e.type ? zi("warmCurrent") : zi("coldCurrent");
            t += "<p><strong>" + zi("currentType") + ":</strong> " + n + "</p>", e.temperature && (t += "<p><strong>" + zi("temperature") + ":</strong> " + e.temperature + "°C</p>"), 
            e.speed && (t += "<p><strong>" + zi("speed") + ":</strong> " + e.speed + " " + zi("speedUnit") + "</p>");
        } else "gyre" === e.type ? t += "<p><strong>" + zi("currentType") + ":</strong> " + zi("gyre") + "</p>" : "trench" === e.type && (t += "<p><strong>" + zi("currentType") + ":</strong> " + zi("trenchDepth") + "</p>", 
        e.depth && (t += "<p><strong>" + zi("trenchDepth") + ":</strong> " + e.depth.toLocaleString("en") + " " + zi("elevationUnit") + "</p>"));
        (e.description_ar || e.description_en) && (t += "<p><strong>" + zi("featureDescription") + ":</strong> " + ("ar" === Ht ? e.description_ar : "ru" === Ht ? e.description_ru || e.description_en : "uz" === Ht ? e.description_uz || e.description_en : "es" === Ht && e.description_es || e.description_en) + "</p>"), 
        wn = performance.now(), P.innerHTML = t, T.style.display = "block", requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                T.classList.add("visible");
            });
        });
    }
    function $a(e) {
        if (Vt.selectAll("*").remove(), !(!ge || void 0 !== Ke && "history" === Ke || void 0 !== Pe && Pe)) {
            var t = ao(), i = Math.max(.4, li.k);
            oceanCurrentsData.forEach(function(a) {
                if ("trench" === a.type) {
                    if (!(l = t(Array.isArray(a.coords[0]) ? a.coords[0] : a.coords)) || isNaN(l[0])) return;
                    var r = (xi ? 4.5 : 6.5) / i;
                    Vt.append("rect").attr("x", l[0] - r - 4 / i).attr("y", l[1] - r - 4 / i).attr("width", 2 * (r + 4 / i)).attr("height", 2 * (r + 4 / i)).attr("fill", "transparent").style("cursor", "pointer").on("click", function() {
                        Ua(a);
                    });
                    var o = Vt.append("path").attr("d", "M" + (l[0] - r) + "," + (l[1] - r) + " L" + (l[0] + r) + "," + (l[1] + r) + " M" + (l[0] - r) + "," + (l[1] + r) + " L" + (l[0] + r) + "," + (l[1] - r)).attr("stroke", MAP_COLORS.oceanCurrents.trench).attr("stroke-width", (xi ? 1.5 : 2) / i).style("pointer-events", "none");
                    return e ? o.attr("opacity", .9) : o.attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .9), 
                    o = Vt.append("text").attr("x", l[0] + r + 3 / i).attr("y", l[1] + 2 / i).text(function() {
                        return "ar" === Ht ? a.name : "ru" === Ht ? a.name_ru || a.name_en : "uz" === Ht ? a.name_uz || a.name_en : "es" === Ht && a.name_es || a.name_en;
                    }).attr("fill", MAP_COLORS.oceanCurrents.trench).attr("font-size", (xi ? 11.5 : 13.5) / i + "px").attr("font-weight", "bold").style("pointer-events", "none").style("text-shadow", "0 1px 3px rgba(0,0,0,0.9)"), 
                    void (e ? o.attr("opacity", 1) : o.attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", 1));
                }
                if ("gyre" !== a.type) {
                    f = "warm" === a.type ? MAP_COLORS.oceanCurrents.warm : MAP_COLORS.oceanCurrents.cold;
                    var s = "warm" === a.type ? "▶" : "◀";
                    h = Vt.append("path").datum({
                        type: "LineString",
                        coordinates: a.coords
                    }).attr("d", Gn).attr("fill", "none").attr("stroke", f).attr("stroke-width", xi ? 3 : 5).attr("stroke-dasharray", "8,4").attr("vector-effect", "non-scaling-stroke").style("cursor", "pointer").on("click", function() {
                        Ua(a);
                    });
                    e ? h.attr("opacity", .8) : h.attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .8), 
                    Vt.append("path").datum({
                        type: "LineString",
                        coordinates: a.coords
                    }).attr("d", Gn).attr("fill", "none").attr("stroke", "transparent").attr("stroke-width", xi ? 18 : 28).style("cursor", "pointer").on("click", function() {
                        Ua(a);
                    });
                    var l, c = a.coords[a.coords.length - 1];
                    if ((l = t(c)) && !isNaN(l[0])) {
                        var d = Vt.append("text").attr("x", l[0]).attr("y", l[1]).text(s).attr("fill", f).attr("font-size", (xi ? 9 : 12) / i + "px").style("pointer-events", "none");
                        e ? d.attr("opacity", .9) : d.attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .9);
                        var u = a.coords[0], p = t(u);
                        if (p && !isNaN(p[0])) {
                            v = a.coords[Math.floor(a.coords.length / 2)];
                            if ((g = t(v)) && !isNaN(g[0])) {
                                var m = Vt.append("text").attr("x", g[0] - 6 / i).attr("y", g[1] - 4 / i).text(function() {
                                    return "ar" === Ht ? a.name : "ru" === Ht ? a.name_ru || a.name_en : "uz" === Ht ? a.name_uz || a.name_en : "es" === Ht && a.name_es || a.name_en;
                                }).attr("fill", "#fff").attr("font-size", (xi ? 11.5 : 13.5) / i + "px").attr("font-weight", "bold").style("pointer-events", "none").style("text-shadow", "0 1px 3px rgba(0,0,0,0.9)");
                                e ? m.attr("opacity", .95) : m.attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .95);
                            }
                        }
                    }
                } else {
                    var f = MAP_COLORS.oceanCurrents.gyre, h = Vt.append("path").datum({
                        type: "LineString",
                        coordinates: a.coords
                    }).attr("d", Gn).attr("fill", "none").attr("stroke", f).attr("stroke-width", xi ? 2.5 : 4).attr("stroke-dasharray", "4,8").attr("vector-effect", "non-scaling-stroke").style("cursor", "pointer").on("click", function() {
                        Ua(a);
                    });
                    e ? h.attr("opacity", .6) : h.attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .6);
                    var y = a.coords.slice();
                    y.length > 1 && (y.push(a.coords[a.coords.length - 2]), y.push(a.coords[a.coords.length - 1])), 
                    Vt.append("path").datum({
                        type: "LineString",
                        coordinates: a.coords
                    }).attr("d", Gn).attr("fill", "none").attr("stroke", "transparent").attr("stroke-width", xi ? 16 : 24).style("cursor", "pointer").on("click", function() {
                        Ua(a);
                    });
                    var g, v = a.coords[Math.floor(a.coords.length / 2)];
                    if ((g = t(v)) && !isNaN(g[0])) {
                        var b = Vt.append("text").attr("x", g[0]).attr("y", g[1] - 6 / i).text(function() {
                            return "ar" === Ht ? a.name : "ru" === Ht ? a.name_ru || a.name_en : "uz" === Ht ? a.name_uz || a.name_en : "es" === Ht && a.name_es || a.name_en;
                        }).attr("fill", f).attr("font-size", (xi ? 11.5 : 13.5) / i + "px").attr("font-weight", "bold").attr("text-anchor", "middle").style("pointer-events", "none").style("text-shadow", "0 1px 3px rgba(0,0,0,0.9)");
                        e ? b.attr("opacity", 1) : b.attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", 1);
                    }
                }
            });
        }
    }
    function Ka(e) {
        if (Qt.selectAll("*").remove(), !(!ve || void 0 !== Ke && "history" === Ke || void 0 !== Pe && Pe)) {
            var t = ao(), i = Math.max(.4, li.k);
            windsData.forEach(function(a) {
                var r = "trade" === a.type ? MAP_COLORS.winds.trade : "westerly" === a.type ? MAP_COLORS.winds.westerly : "polar" === a.type ? MAP_COLORS.winds.polar : "monsoon" === a.type ? MAP_COLORS.winds.monsoon : MAP_COLORS.winds.other, o = Qt.append("path").datum({
                    type: "LineString",
                    coordinates: a.coords
                }).attr("d", Gn).attr("fill", "none").attr("stroke", r).attr("stroke-width", xi ? 3 : 5).attr("stroke-dasharray", "5,5").attr("vector-effect", "non-scaling-stroke").style("cursor", "pointer").on("click", function() {
                    Ar("wind", a);
                });
                e ? o.attr("opacity", .7) : o.attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .7), 
                Qt.append("path").datum({
                    type: "LineString",
                    coordinates: a.coords
                }).attr("d", Gn).attr("fill", "none").attr("stroke", "transparent").attr("stroke-width", xi ? 16 : 24).style("cursor", "pointer").on("click", function() {
                    Ar("wind", a);
                });
                var s = a.coords[a.coords.length - 1], l = t(s);
                if (l && !isNaN(l[0])) {
                    var c = Qt.append("text").attr("x", l[0]).attr("y", l[1]).text("➤").attr("fill", r).attr("font-size", (xi ? 9 : 12) / i + "px").style("pointer-events", "none").style("cursor", "pointer");
                    e ? c.attr("opacity", .85) : c.attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .85);
                }
                var d = a.coords[Math.floor(a.coords.length / 2)], u = t(d);
                if (u && !isNaN(u[0])) {
                    var p = Qt.append("text").attr("x", u[0]).attr("y", u[1] - 5 / i).text(function() {
                        return "ar" === Ht ? a.name : "ru" === Ht ? a.name_ru || a.name_en : "uz" === Ht ? a.name_uz || a.name_en : "es" === Ht && a.name_es || a.name_en;
                    }).attr("fill", "#fff").attr("font-size", (xi ? 11.5 : 13.5) / i + "px").attr("font-weight", "bold").style("pointer-events", "none").style("text-shadow", "0 1px 3px rgba(0,0,0,0.95), 0 0 5px rgba(0,0,0,0.85)");
                    e ? p.attr("opacity", .95) : p.attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .95);
                }
            });
        }
    }
    function Ga(e) {
        En = e, _n = "earthquake";
        var t = "<h3>🏚️ " + ("ar" === Ht ? e.name : "ru" === Ht ? e.name_ru || e.name_en : "uz" === Ht ? e.name_uz || e.name_en : "es" === Ht && e.name_es || e.name_en) + "</h3>";
        e.magnitude && (t += "<p><strong>" + zi("magnitude") + ":</strong> " + e.magnitude + "</p>"), 
        e.year && (t += "<p><strong>" + zi("year") + ":</strong> " + e.year + "</p>"), (e.plate_ar || e.plate_en) && (t += "<p><strong>" + zi("tectonicPlate") + ":</strong> " + ("ar" === Ht ? e.plate_ar : "ru" === Ht ? e.plate_ru || e.plate_en : "uz" === Ht ? e.plate_uz || e.plate_en : "es" === Ht && e.plate_es || e.plate_en) + "</p>"), 
        (e.description_ar || e.description_en) && (t += "<p><strong>" + zi("featureDescription") + ":</strong> " + ("ar" === Ht ? e.description_ar : "ru" === Ht ? e.description_ru || e.description_en : "uz" === Ht ? e.description_uz || e.description_en : "es" === Ht && e.description_es || e.description_en) + "</p>"), 
        wn = performance.now(), P.innerHTML = t, T.style.display = "block", requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                T.classList.add("visible");
            });
        });
    }
    function Ya(e) {
        En = e, _n = "tectonicPlate";
        var t = "<h3>🗿 " + ("ar" === Ht ? e.name : "ru" === Ht ? e.name_ru || e.name_en : "uz" === Ht ? e.name_uz || e.name_en : "es" === Ht && e.name_es || e.name_en) + "</h3>";
        t += "<p>" + zi("tectonicPlates") + "</p>", wn = performance.now(), P.innerHTML = t, 
        T.style.display = "block", requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                T.classList.add("visible");
            });
        });
    }
    function Va(e) {
        if (Xt.selectAll("*").remove(), !(!be || void 0 !== Ke && "history" === Ke || void 0 !== Pe && Pe)) {
            var t = ao(), i = Math.max(.4, li.k), a = MAP_COLORS.tectonicPlates;
            tectonicPlatesData.forEach(function(r, o) {
                var s = Gn({
                    type: "Polygon",
                    coordinates: [ r.coords ]
                });
                if (s) {
                    var l = Xt.append("path").attr("d", s).attr("fill", a[o % a.length]).attr("stroke", a[o % a.length]).attr("stroke-width", 1).attr("stroke-dasharray", "3,3").attr("vector-effect", "non-scaling-stroke").style("cursor", "pointer").on("click", function() {
                        Ya(r);
                    });
                    e ? l.attr("opacity", .04) : l.attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .04);
                    var c = r.coords[Math.floor(r.coords.length / 2)], d = t(c);
                    if (d && !isNaN(d[0])) {
                        var u = Xt.append("text").attr("x", d[0]).attr("y", d[1]).text(function() {
                            return "ar" === Ht ? r.name : "ru" === Ht ? r.name_ru || r.name_en : "uz" === Ht ? r.name_uz || r.name_en : "es" === Ht && r.name_es || r.name_en;
                        }).attr("fill", "#fff").attr("font-size", (xi ? 11.5 : 13.5) / i + "px").attr("text-anchor", "middle").style("pointer-events", "none").style("text-shadow", "0 1px 3px rgba(0,0,0,0.9)");
                        e ? u.attr("opacity", .7) : u.attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .7);
                    }
                }
            }), earthquakesData.forEach(function(a) {
                var r = (Array.isArray(a.coords[0]) ? a.coords : [ a.coords ])[0], o = t(r);
                if (o && !isNaN(o[0])) {
                    var s = a.magnitude >= 9 ? MAP_COLORS.earthquakes.major9 : a.magnitude >= 8 ? MAP_COLORS.earthquakes.major8 : a.magnitude >= 7 ? MAP_COLORS.earthquakes.major7 : a.magnitude >= 6 ? MAP_COLORS.earthquakes.major6 : MAP_COLORS.earthquakes.below6, l = (xi ? 3.5 : 5) / i, c = Xt.append("circle").attr("cx", o[0]).attr("cy", o[1]).attr("r", l).attr("fill", s).attr("stroke", "#fff").attr("stroke-width", .8 / i).style("cursor", "pointer").on("click", function() {
                        Ga(a);
                    });
                    e ? c.attr("opacity", .85) : c.attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .85), 
                    Xt.append("circle").attr("cx", o[0]).attr("cy", o[1]).attr("r", l + 3.5 / i).attr("fill", "transparent").style("cursor", "pointer").on("click", function() {
                        Ga(a);
                    });
                }
            });
        }
    }
    function Qa(e) {
        En = e, _n = "volcano";
        var t = "<h3>🌋 " + ("ar" === Ht ? e.name : "ru" === Ht ? e.name_ru || e.name_en : "uz" === Ht ? e.name_uz || e.name_en : "es" === Ht && e.name_es || e.name_en) + "</h3>";
        e.elevation && (t += "<p><strong>" + zi("tooltipElevation") + ":</strong> " + e.elevation.toLocaleString("en") + " " + zi("elevationUnit") + "</p>"), 
        e.type && (t += "<p><strong>" + zi("volcanoType") + ":</strong> " + ("ar" === Ht ? e.type_ar || e.type : "ru" === Ht ? e.type_ru || e.type_en || e.type : "uz" === Ht ? e.type_uz || e.type_en || e.type : "es" === Ht ? e.type_es || e.type_en || e.type : e.type_en || e.type) + "</p>"), 
        e.lastEruption && (t += "<p><strong>" + zi("lastEruption") + ":</strong> " + e.lastEruption + "</p>"), 
        (e.description_ar || e.description_en) && (t += "<p><strong>" + zi("featureDescription") + ":</strong> " + ("ar" === Ht ? e.description_ar : "ru" === Ht ? e.description_ru || e.description_en : "uz" === Ht ? e.description_uz || e.description_en : "es" === Ht && e.description_es || e.description_en) + "</p>"), 
        wn = performance.now(), P.innerHTML = t, T.style.display = "block", requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                T.classList.add("visible");
            });
        });
    }
    function Xa(e) {
        if (Jt.selectAll("*").remove(), !(!we || void 0 !== Ke && "history" === Ke || void 0 !== Pe && Pe)) {
            var t = ao(), i = Math.max(.4, li.k);
            volcanoesData.forEach(function(a) {
                var r = t(Array.isArray(a.coords[0]) ? a.coords[0] : a.coords);
                if (r && !isNaN(r[0])) {
                    var o = r[0], s = r[1], l = (xi ? 3.5 : 5) / i, c = Jt.append("g").style("cursor", "pointer").on("click", function() {
                        Qa(a);
                    }), d = c.append("path").attr("d", "M" + o + "," + (s - l) + " L" + (o - .7 * l) + "," + (s + .5 * l) + " L" + (o + .7 * l) + "," + (s + .5 * l) + " Z").attr("fill", MAP_COLORS.volcanoes.fill).attr("stroke", MAP_COLORS.volcanoes.stroke).attr("stroke-width", .8 / i);
                    e ? d.attr("opacity", .9) : d.attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .9), 
                    d = c.append("circle").attr("cx", o).attr("cy", s - .2 * l).attr("r", (xi ? 1.5 : 2.2) / i).attr("fill", MAP_COLORS.volcanoes.glow), 
                    e ? d.attr("opacity", .8) : d.attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .8), 
                    c.append("text").attr("x", o + l + 2.5 / i).attr("y", s + 2 / i).text(function() {
                        return "ar" === Ht ? a.name : "ru" === Ht ? a.name_ru || a.name_en : "uz" === Ht ? a.name_uz || a.name_en : "es" === Ht && a.name_es || a.name_en;
                    }).attr("fill", MAP_COLORS.volcanoes.fill).attr("font-size", (xi ? 11.5 : 13.5) / i + "px").attr("font-weight", "bold").style("pointer-events", "none").style("text-shadow", "0 1px 3px rgba(0,0,0,0.9)");
                }
            });
        }
    }
    function Ja(e) {
        if (nn.selectAll("*").remove(), !(!xe || void 0 !== Ke && "history" === Ke || void 0 !== Pe && Pe) && "all" !== re) {
            var t = geopoliticalBlocsData.find(function(e) {
                return e.name_en === re || e.name === re;
            });
            if (t && t.members && t.members.length) {
                var i = t.color || MAP_COLORS.blocDefault, a = Math.max(.4, li.k), r = Math.max(3, Math.min(15, (xi ? 7 : 10) / a));
                fn.forEach(function(a) {
                    var o = a.properties?.name;
                    if (t.members.some(function(e) {
                        return n = e, !(!(t = o) || !n) && Oi(t) === Oi(n);
                        var t, n;
                    })) {
                        var s = Gn(a);
                        if (s) {
                            var l = nn.append("path").attr("d", s).attr("fill", i).attr("stroke", i).attr("stroke-width", 1.5).attr("vector-effect", "non-scaling-stroke").style("pointer-events", "none");
                            e ? l.attr("opacity", .3) : l.attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .3);
                            var c = d3.geoPath().projection(ao()).centroid(a);
                            if (c && !isNaN(c[0])) {
                                var d = nn.append("text").attr("x", c[0]).attr("y", c[1]).text(function() {
                                    return Hi(o);
                                }).attr("fill", "#fff").attr("font-size", r).attr("font-weight", "bold").attr("text-anchor", "middle").attr("pointer-events", "none");
                                e ? d.attr("opacity", .9) : d.attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .9);
                            }
                        }
                    }
                });
            }
        }
    }
    function Za(e) {
        En = e, _n = "city";
        var t = "ar" === Ht ? e.name : "ru" === Ht ? e.name_ru || e.name_en || e.name : "uz" === Ht ? e.name_uz || e.name_en || e.name : "es" === Ht ? e.name_es || e.name_en || e.name : e.name_en || e.name, n = zi("cityCategory" + e.category.charAt(0).toUpperCase() + e.category.slice(1)) || e.category, i = MAP_COLORS.cities[e.category] || MAP_COLORS.cities.other, a = "<h3>🏙️ " + t + "</h3>";
        a += "<p><strong>" + zi("featureCategory") + ':</strong> <span style="color:' + i + '">●</span> ' + n + "</p>";
        var r = function(e) {
            for (let t = 0; t < fn.length; t++) {
                const n = fn[t];
                try {
                    if (d3.geoContains(n, e.coords)) return Hi(n.properties?.name || "");
                } catch (e) {}
            }
            return null;
        }(e);
        r && (a += "<p><strong>" + zi("featureCountry") + ":</strong> " + r + "</p>");
        var o = function(e) {
            const t = majorCitiesData.filter(t => t.category === e.category);
            return t.sort((e, t) => (t.pop || 0) - (e.pop || 0)), {
                rank: t.findIndex(t => t === e) + 1,
                total: t.length
            };
        }(e);
        o.rank > 0 && (a += "<p><strong>" + zi("categoryRank") + ":</strong> " + o.rank + " / " + o.total + "</p>"), 
        e.pop && (a += "<p><strong>" + zi("population") + ":</strong> " + e.pop + " " + zi("millionPeople") + "</p>"), 
        wn = performance.now(), P.innerHTML = a, T.style.display = "block", requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                T.classList.add("visible");
            });
        });
    }
    function er(e) {
        En = e, _n = "desertForest";
        var t = "ar" === Ht ? e.name : "ru" === Ht ? e.name_ru || e.name_en : "uz" === Ht ? e.name_uz || e.name_en : "es" === Ht && e.name_es || e.name_en, n = "<h3>" + ("desert" === e.type ? "🏜️" : "🌲") + " " + t + "</h3>";
        e.area_km2 && (n += "<p><strong>" + zi("areaTitle") + ":</strong> " + e.area_km2.toLocaleString("en") + " " + zi("km2") + "</p>"), 
        (e.countries_ar || e.countries_en) && (n += "<p><strong>" + zi("featureCountries") + ":</strong> " + ("ar" === Ht ? e.countries_ar : "ru" === Ht ? e.countries_ru || e.countries_en : "uz" === Ht ? e.countries_uz || e.countries_en : "es" === Ht && e.countries_es || e.countries_en) + "</p>"), 
        (e.biome_ar || e.biome_en) && (n += "<p><strong>" + zi("biome") + ":</strong> " + ("ar" === Ht ? e.biome_ar : "ru" === Ht ? e.biome_ru || e.biome_en : "uz" === Ht ? e.biome_uz || e.biome_en : "es" === Ht && e.biome_es || e.biome_en) + "</p>"), 
        (e.description_ar || e.description_en) && (n += "<p><strong>" + zi("featureDescription") + ":</strong> " + ("ar" === Ht ? e.description_ar : "ru" === Ht ? e.description_ru || e.description_en : "uz" === Ht ? e.description_uz || e.description_en : "es" === Ht && e.description_es || e.description_en) + "</p>"), 
        wn = performance.now(), P.innerHTML = n, T.style.display = "block", requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                T.classList.add("visible");
            });
        });
    }
    function tr(e) {
        if (an.selectAll("*").remove(), !(!_e || void 0 !== Ke && "history" === Ke || void 0 !== Pe && Pe)) {
            var t = ao(), i = Math.max(.4, li.k);
            desertsForestsData.forEach(function(a) {
                var r = "desert" === a.type ? MAP_COLORS.desertsForests.desert : MAP_COLORS.desertsForests.forest, o = "desert" === a.type ? MAP_COLORS.desertsForests.desertHalo : MAP_COLORS.desertsForests.forestHalo;
                if (Array.isArray(a.coords[0])) {
                    var s = a.coords, l = [];
                    s.forEach(function(e) {
                        l.push(e);
                    }), l.push(s[0]), an.append("path").datum({
                        type: "Polygon",
                        coordinates: [ l ],
                        _data: a
                    }).attr("d", Gn).attr("fill", "none").attr("stroke", o).attr("stroke-width", xi ? 4 : 7).attr("vector-effect", "non-scaling-stroke").style("pointer-events", "none"), 
                    an.append("path").datum({
                        type: "Polygon",
                        coordinates: [ l ],
                        _data: a
                    }).attr("d", Gn).attr("fill", "none").attr("stroke", r).attr("stroke-width", xi ? 2 : 4).attr("stroke-opacity", 1).attr("stroke-dasharray", "6,3").attr("vector-effect", "non-scaling-stroke").style("cursor", "pointer").on("click", function(e, t) {
                        er(t._data);
                    });
                    var c = a.coords[Math.floor(a.coords.length / 2)], d = t(c);
                    if (d && !isNaN(d[0])) {
                        var u = "ar" === Ht ? a.name : "ru" === Ht ? a.name_ru || a.name_en : "uz" === Ht ? a.name_uz || a.name_en : "es" === Ht && a.name_es || a.name_en, p = Math.max(3, Math.min(16, (xi ? 10.5 : 13.5) / i)), m = an.append("text").attr("x", d[0]).attr("y", d[1]).text(u).attr("fill", "#fff").attr("font-size", p + "px").attr("font-weight", "bold").attr("text-anchor", "middle").style("pointer-events", "none").style("text-shadow", "0 1px 3px rgba(0,0,0,0.95), 0 0 5px rgba(0,0,0,0.85)");
                        e ? m.attr("opacity", .95) : m.attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .95), 
                        an.append("circle").datum(a).attr("cx", d[0]).attr("cy", d[1]).attr("r", (xi ? 10 : 15) / i).attr("fill", "transparent").style("cursor", "pointer").on("click", function(e, t) {
                            er(t);
                        });
                    }
                }
            });
        }
    }
    function nr(e) {
        Zt.selectAll("*").remove();
        var t = document.getElementById("borderDisputesCounter");
        if (!Ce || void 0 !== Ke && "history" === Ke || void 0 !== Pe && Pe) t && (t.style.display = "none"); else {
            var i = ao();
            borderDisputesData.forEach(function(t) {
                var a = i(t.coords);
                if (a && !isNaN(a[0])) {
                    var r = "active" === t.type ? MAP_COLORS.borderDisputes.active : "ceasefire" === t.type ? MAP_COLORS.borderDisputes.ceasefire : MAP_COLORS.borderDisputes.maritime, o = Math.max(.4, li.k), s = (xi ? 3 : 4.2) / o, l = a[0], c = a[1], d = Zt.append("circle").attr("cx", l).attr("cy", c).attr("r", 2 * s).attr("fill", r).style("pointer-events", "none");
                    e ? d.attr("opacity", .12) : d.attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .12), 
                    d = Zt.append("circle").attr("cx", l).attr("cy", c).attr("r", 1.4 * s).attr("fill", r).style("pointer-events", "none"), 
                    e ? d.attr("opacity", .2) : d.attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .2), 
                    d = Zt.append("circle").datum(t).attr("cx", l).attr("cy", c).attr("r", s).attr("fill", r).attr("stroke", "#fff").attr("stroke-width", (xi ? .7 : 1) / o).style("cursor", "pointer").on("click", function(e, t) {
                        !function(e) {
                            if (!e) return;
                            var t = document.getElementById("panelContent");
                            if (!t) return;
                            var n = "active" === e.type ? "⚔️" : "ceasefire" === e.type ? "☮️" : "🌊", i = "active" === e.type ? "ar" === Ht ? "نزاع نشط" : "ru" === Ht ? "Активный конфликт" : "uz" === Ht ? "Faol nizo" : "es" === Ht ? "Conflicto activo" : "Active Conflict" : "ceasefire" === e.type ? "ar" === Ht ? "وقف إطلاق نار" : "ru" === Ht ? "Перемирие" : "uz" === Ht ? "O't ochishni to'xtatish" : "es" === Ht ? "Alto el fuego" : "Ceasefire" : "ar" === Ht ? "نزاع بحري" : "ru" === Ht ? "Морской спор" : "uz" === Ht ? "Dengiz nizosi" : "es" === Ht ? "Disputa marítima" : "Maritime Dispute", a = "<h3>" + ("ar" === Ht ? e.name_ar : "ru" === Ht ? e.name_ru || e.name_en : "uz" === Ht ? e.name_uz || e.name_en : "es" === Ht && e.name_es || e.name_en) + "</h3>";
                            a += '<div style="margin-bottom:8px"><span style="font-size:1.4em">' + n + '</span> <strong style="color:' + ("active" === e.type ? MAP_COLORS.borderDisputes.active : "ceasefire" === e.type ? MAP_COLORS.borderDisputes.ceasefire : MAP_COLORS.borderDisputes.maritime) + '">' + i + "</strong></div>", 
                            a += "<p><strong>" + zi("featureCountries") + ":</strong> " + ("ar" === Ht ? e.countries_ar : "ru" === Ht ? e.countries_ru || e.countries_en : "uz" === Ht ? e.countries_uz || e.countries_en : "es" === Ht && e.countries_es || e.countries_en) + "</p>", 
                            a += "<p><strong>" + ("ar" === Ht ? "الأسباب" : "ru" === Ht ? "Причины" : "uz" === Ht ? "Sabablar" : "es" === Ht ? "Causas" : "Causes") + ":</strong> " + ("ar" === Ht ? e.causes_ar : "ru" === Ht ? e.causes_ru || e.causes_en : "uz" === Ht ? e.causes_uz || e.causes_en : "es" === Ht && e.causes_es || e.causes_en) + "</p>", 
                            wn = performance.now(), t.innerHTML = a;
                            var r = document.getElementById("countryPanel");
                            r && (r.style.display = "block", requestAnimationFrame(function() {
                                requestAnimationFrame(function() {
                                    r.classList.add("visible");
                                });
                            }));
                            En = e, _n = "borderDispute";
                        }(t);
                    }), e ? d.attr("opacity", .9) : d.attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .9), 
                    d = Zt.append("circle").attr("cx", l).attr("cy", c).attr("r", 2.6 * s).attr("fill", "transparent").attr("stroke", r).attr("stroke-width", (xi ? .6 : .9) / o).style("pointer-events", "none"), 
                    e ? d.attr("opacity", .25) : d.attr("opacity", 0).transition().duration(n() ? 0 : 300).attr("opacity", .25);
                    var u = "ar" === Ht ? t.name_ar : "ru" === Ht ? t.name_ru || t.name_en : "uz" === Ht ? t.name_uz || t.name_en : "es" === Ht && t.name_es || t.name_en, p = (xi ? 10.5 : 12.5) / o;
                    Zt.append("text").attr("x", l).attr("y", c - s - 2.5 / o).text(u).attr("fill", r).attr("font-size", p + "px").attr("font-weight", "bold").attr("text-anchor", "middle").style("pointer-events", "none").style("text-shadow", "0 1px 3px rgba(0,0,0,0.95), 0 0 4px rgba(0,0,0,0.85)");
                }
            });
            var a = borderDisputesData.filter(function(e) {
                return "active" === e.type;
            }).length, r = borderDisputesData.filter(function(e) {
                return "ceasefire" === e.type;
            }).length, o = borderDisputesData.filter(function(e) {
                return "maritime" === e.type;
            }).length;
            t && (t.textContent = "⚔️ " + a + "  ☮️ " + r + "  🌊 " + o, t.style.display = "");
        }
    }
    function ir() {
        if (Tt) return Promise.resolve(Tt);
        if (Pt) return Pt;
        var e = window.location.pathname.replace(/\/[^\/]*$/, "/");
        return Pt = fetch(e + "admin-boundaries-data.json").then(function(e) {
            return e.json();
        }).then(function(e) {
            Tt = e;
            try {
                sr(e);
            } catch (e) {}
            return e;
        }).catch(function(e) {
            return console.error("Failed to load admin boundaries:", e), Pt = null, c.textContent = zi("adminBoundariesLoadError"), 
            c.classList.add("show"), setTimeout(function() {
                c.classList.remove("show");
            }, 3e3), [];
        }), Pt;
    }
    function ar(e) {
        tn.selectAll("*").remove(), ce && function() {
            if (qt) return Promise.resolve(qt);
            if (Ot) return Ot;
            c && (c.textContent = zi("glaciatedAreasLoading"), c.classList.add("show"));
            var e = window.location.pathname.replace(/\/[^\/]*$/, "/");
            return Ot = fetch(e + "glaciated-areas-data.json").then(function(e) {
                return e.json();
            }).then(function(e) {
                return qt = e || [], c && c.classList.remove("show"), qt;
            }).catch(function(e) {
                return console.error("Failed to load glaciated areas:", e), Ot = null, c && (c.textContent = zi("glaciatedAreasLoadError"), 
                setTimeout(function() {
                    c.classList.remove("show");
                }, 3e3)), [];
            }), Ot;
        }().then(function(e) {
            if (e && e.length && ce && !Be) {
                var t = ao(), n = .55 * Math.min(ki().width, ki().height), i = xi ? 1 : 1.4;
                e.forEach(function(e) {
                    var a = Jo({
                        type: e.type,
                        coordinates: e.coordinates
                    }, t, n);
                    (Array.isArray(a) ? a : [ a ]).forEach(function(e) {
                        var n;
                        if ("LineString" === e.type) n = [ e.coordinates ]; else if ("MultiLineString" === e.type) n = e.coordinates; else if ("Polygon" === e.type) n = [ e.coordinates[0] ]; else {
                            if ("MultiPolygon" !== e.type) return;
                            n = [];
                            for (var a = 0; a < e.coordinates.length; a++) n.push(e.coordinates[a][0]);
                        }
                        n.forEach(function(e) {
                            var n = e.map(function(e) {
                                return t(e);
                            }).filter(function(e) {
                                return e && !isNaN(e[0]);
                            });
                            if (!(n.length < 2)) {
                                var a = "M" + n.map(function(e) {
                                    return e[0] + "," + e[1];
                                }).join("L");
                                tn.append("path").attr("d", a).attr("fill", "none").attr("stroke", MAP_COLORS.glaciatedAreas.halo).attr("stroke-width", i + (xi ? 2.5 : 3.5)).attr("vector-effect", "non-scaling-stroke").style("pointer-events", "none"), 
                                tn.append("path").attr("d", a).attr("fill", "none").attr("stroke", MAP_COLORS.glaciatedAreas.stroke).attr("stroke-width", i).attr("stroke-opacity", .95).attr("vector-effect", "non-scaling-stroke").style("pointer-events", "none");
                            }
                        });
                    });
                });
            }
        });
    }
    window.smartSearchScore = Wi, window.getCountryMatchScore = Ki, window.showHistoricalPolityDetail = Yi, 
    window.smartNormalizeSearch = ji, window.smartFuzzyMatch = Ui, window.updateHistModernBorders = ha, 
    window.getHistSidePattern = ba, window.updateHistoryColorblindOverlay = wa, window.drawHistoricalRoutes = qa, 
    window.drawNaturalResources = ja;
    let rr = null, or = null;
    function sr(e) {
        if (rr && or === e) return rr;
        var t = e.map(function(e, t) {
            return {
                i: t,
                name: e.name,
                centroid: d3.geoCentroid({
                    type: "Feature",
                    geometry: {
                        type: e.type,
                        coordinates: e.coordinates
                    }
                }),
                area: d3.geoArea({
                    type: "Feature",
                    geometry: {
                        type: e.type,
                        coordinates: e.coordinates
                    }
                })
            };
        });
        return t.sort(function(e, t) {
            return t.area - e.area;
        }), rr = {
            items: t,
            total: t.length
        }, or = e, rr;
    }
    const lr = [ [ 4, .12 ], [ 6, .25 ], [ 8, .4 ], [ 10, .55 ], [ 13, .7 ], [ 17, .85 ], [ 21, .97 ], [ 24, 1 ] ];
    function cr() {
        if (en.selectAll("*").remove(), Le) ir().then(function(e) {
            e && e.length && Le && (Be ? wr(e) : vr(e));
        }); else if (ne) {
            var e = ki();
            ne.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0), 
            ne.clearRect(0, 0, e.width, e.height);
        }
    }
    var dr = null, ur = null, pr = null, mr = !0, fr = null, hr = null, yr = null;
    function gr(e) {
        var t = ao();
        if (fr && hr === t && yr === e) return fr;
        for (var n = {
            minX: 1 / 0,
            minY: 1 / 0,
            maxX: -1 / 0,
            maxY: -1 / 0,
            moveTo: function(e, t) {
                e < this.minX && (this.minX = e), e > this.maxX && (this.maxX = e), t < this.minY && (this.minY = t), 
                t > this.maxY && (this.maxY = t);
            },
            lineTo: function(e, t) {
                e < this.minX && (this.minX = e), e > this.maxX && (this.maxX = e), t < this.minY && (this.minY = t), 
                t > this.maxY && (this.maxY = t);
            },
            closePath: function() {},
            reset: function() {
                this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0;
            }
        }, i = d3.geoPath(t, n), a = new Array(e.length), r = 0; r < e.length; r++) {
            n.reset();
            i({
                type: "Feature",
                geometry: {
                    type: e[r].type,
                    coordinates: e[r].coordinates
                }
            });
            a[r] = isFinite(n.minX) ? [ n.minX, n.minY, n.maxX, n.maxY ] : null;
        }
        return fr = a, hr = t, yr = e, a;
    }
    function vr(e) {
        if (ne) {
            var t = ki(), n = window.devicePixelRatio || 1, i = t.width * n, a = t.height * n;
            if (te.width === i && te.height === a || (te.width = i, te.height = a), ne.setTransform(n, 0, 0, n, 0, 0), 
            ne.clearRect(0, 0, t.width, t.height), Le && (!mr && dr && pr || function(e) {
                var t = ki(), n = window.devicePixelRatio || 1;
                dr || (dr = document.createElement("canvas"), ur = dr.getContext("2d"));
                var i = Math.max(1, Math.round(t.width * n)), a = Math.max(1, Math.round(t.height * n));
                dr.width === i && dr.height === a || (dr.width = i, dr.height = a);
                var r = li && li.k || 1, o = li && li.x || 0, s = li && li.y || 0;
                ur.setTransform(r * n, 0, 0, r * n, o * n, s * n), ur.clearRect(-t.width, -t.height, 3 * t.width, 3 * t.height);
                for (var l = ki(), c = 8 / r, d = -o / r - c, u = -s / r - c, p = (l.width - o) / r + c, m = (l.height - s) / r + c, f = gr(e), h = [], y = 0; y < e.length; y++) {
                    var g = f[y];
                    g && g[0] <= p && g[1] <= m && g[2] >= d && g[3] >= u && h.push({
                        type: e[y].type,
                        coordinates: e[y].coordinates
                    });
                }
                var v = {
                    type: "GeometryCollection",
                    geometries: h
                }, b = ao(), w = b.precision();
                b.precision(5);
                var E = d3.geoPath(b, ur);
                ur.beginPath(), E(v), ur.strokeStyle = MAP_COLORS.adminBoundaries.stroke, ur.lineWidth = (xi ? .4 : .6) / r, 
                ur.globalAlpha = .5, ur.setLineDash([ 2 / r, 2 / r ]), ur.stroke(), b.precision(w), 
                pr = {
                    k: r,
                    tx: o,
                    ty: s
                }, mr = !1;
            }(e), dr)) {
                var r = li && li.k || 1, o = li && li.x || 0, s = li && li.y || 0, l = pr, c = r / l.k;
                ne.save(), ne.beginPath(), ne.rect(0, 0, t.width, t.height), ne.clip(), ne.globalAlpha = 1, 
                ne.setTransform(c * n, 0, 0, c * n, (o - c * l.tx) * n, (s - c * l.ty) * n), ne.drawImage(dr, 0, 0), 
                ne.restore(), ne.setTransform(n, 0, 0, n, 0, 0);
            }
        }
    }
    function br() {
        Le && !Be && (br.pending || (br.pending = !0, requestAnimationFrame(function() {
            br.pending = !1, Le && !Be && ir().then(function(e) {
                e && e.length && Le && !Be && vr(e);
            });
        })));
    }
    function wr(e) {
        if (ne) {
            var t = ki(), n = window.devicePixelRatio || 1, i = t.width * n, a = t.height * n;
            if (te.width === i && te.height === a || (te.width = i, te.height = a, ne.setTransform(n, 0, 0, n, 0, 0)), 
            ne.clearRect(0, 0, t.width, t.height), Le) {
                var r = function(e) {
                    return Rt || (Rt = {
                        type: "GeometryCollection",
                        geometries: e.map(function(e) {
                            return {
                                type: e.type,
                                coordinates: e.coordinates
                            };
                        })
                    }), Rt;
                }(e), o = ao(), s = o.precision();
                o.precision(5);
                var l = d3.geoPath(o, ne);
                ne.save(), ne.beginPath(), l(r), ne.strokeStyle = MAP_COLORS.adminBoundaries.stroke, 
                ne.lineWidth = xi ? .4 : .6, ne.globalAlpha = .5, ne.setLineDash([ 2, 2 ]), ne.stroke(), 
                ne.restore(), o.precision(s);
            }
        }
    }
    function Er() {
        Ii("naturalResources");
    }
    function kr() {
        Ii("ethnicGroups");
    }
    function xr() {
        Ii("oceanCurrents");
    }
    function _r() {
        Ii("winds");
    }
    function Cr() {
        Ii("earthquakes");
    }
    function Lr() {
        Ii("volcanoes");
    }
    function Br() {
        Ii("desertsForests");
    }
    function Sr() {
        Ii("borderDisputes");
    }
    function Ir() {
        Ii("riversAndGlaciers");
    }
    function zr() {
        Ii("geopoliticalBlocs");
    }
    function Ar(e, t) {
        if (En = t, _n = e, "resource" === e) return void Ha(t);
        if ("ethnicGroup" === e) return void xa(t);
        if ("oceanCurrent" === e) return void Ua(t);
        if ("earthquake" === e) return void Ga(t);
        if ("volcano" === e) return void Qa(t);
        if ("tectonicPlate" === e) return void Ya(t);
        if ("desertForest" === e) return void er(t);
        if ("route" === e) return void Aa(t);
        if ("wind" === e) return void function(e) {
            En = e, _n = "wind";
            var t = "ar" === Ht ? e.name : "ru" === Ht ? e.name_ru || e.name_en : "uz" === Ht ? e.name_uz || e.name_en : "es" === Ht && e.name_es || e.name_en, n = {
                trade: "ar" === Ht ? "تجارية" : "ru" === Ht ? "Пассаты" : "uz" === Ht ? "Passatlar" : "es" === Ht ? "Vientos alisios" : "Trade Winds",
                westerly: "ar" === Ht ? "غربية" : "ru" === Ht ? "Западные" : "uz" === Ht ? "G'arbiy" : "es" === Ht ? "Vientos del oeste" : "Westerlies",
                polar: "ar" === Ht ? "قطبية" : "ru" === Ht ? "Полярные" : "uz" === Ht ? "Qutbiy" : "es" === Ht ? "Vientos polares" : "Polar Easterlies",
                monsoon: "ar" === Ht ? "موسمية" : "ru" === Ht ? "Муссоны" : "uz" === Ht ? "Mussonlar" : "es" === Ht ? "Monzones" : "Monsoon",
                seasonal: "ar" === Ht ? "موسمية" : "ru" === Ht ? "Сезонные" : "uz" === Ht ? "Mevsimiy" : "es" === Ht ? "Estacional" : "Seasonal"
            }, i = "<h3>💨 " + t + "</h3>";
            i += "<p><strong>" + zi("windType") + ":</strong> " + (n[e.type] || e.type) + "</p>", 
            (e.description_ar || e.description_en) && (i += "<p><strong>" + zi("featureDescription") + ":</strong> " + ("ar" === Ht ? e.description_ar : "ru" === Ht ? e.description_ru || e.description_en : "uz" === Ht ? e.description_uz || e.description_en : "es" === Ht && e.description_es || e.description_en) + "</p>"), 
            wn = performance.now(), P.innerHTML = i, T.style.display = "block", requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    T.classList.add("visible");
                });
            });
        }(t);
        if ("timezone" === e) {
            var n = "<h3>" + zi("timezonesLegend") + ": " + t.label + "</h3>";
            return n += "<p><strong>" + zi("timezonePlaces") + ":</strong> " + t.places + "</p>", 
            n += "<p><strong>" + zi("timezoneOffset") + ":</strong> UTC" + (t.zone >= 0 ? "+" : "") + t.zone + "</p>", 
            wn = performance.now(), P && (P.innerHTML = n), void (T && (T.style.display = "block", 
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    T.classList.add("visible");
                });
            })));
        }
        const i = "mountain" === e, a = "ar" === Ht ? t.name : "ru" === Ht ? t.name_ru || t.name_en || t.name : "uz" === Ht ? t.name_uz || t.name_en || t.name : "es" === Ht ? t.name_es || t.name_en || t.name : t.name_en || t.name;
        let r = `<h3>${zi(i ? "featureMountainTitle" : "featureRiverTitle")}: ${a}</h3>`;
        if (t.length && (r += `<p><strong>${zi("featureLength")}:</strong> ${t.length.toLocaleString("en")} ${zi("featureKm")}</p>`), 
        i) {
            if (t.highestPeak) {
                const e = "ar" === Ht ? t.highestPeak : "ru" === Ht ? t.highestPeak_ru || t.highestPeak_en || t.highestPeak : "uz" === Ht ? t.highestPeak_uz || t.highestPeak_en || t.highestPeak : "es" === Ht ? t.highestPeak_es || t.highestPeak_en || t.highestPeak : t.highestPeak_en || t.highestPeak;
                r += `<p><strong>${zi("featureHighestPeak")}:</strong> ${e}`, t.highestElevation && (r += ` (${t.highestElevation.toLocaleString("en")} ${zi("elevationUnit")})`), 
                r += "</p>";
            }
        } else {
            if (t.source_ar || t.source_en) {
                const e = "ar" === Ht ? t.source_ar : "ru" === Ht ? t.source_ru || t.source_en : "uz" === Ht ? t.source_uz || t.source_en : "es" === Ht && t.source_es || t.source_en;
                r += `<p><strong>${zi("featureSource")}:</strong> ${e}</p>`;
            }
            if (t.mouth_ar || t.mouth_en) {
                const e = "ar" === Ht ? t.mouth_ar : "ru" === Ht ? t.mouth_ru || t.mouth_en : "uz" === Ht ? t.mouth_uz || t.mouth_en : "es" === Ht && t.mouth_es || t.mouth_en;
                r += `<p><strong>${zi("featureMouth")}:</strong> ${e}</p>`;
            }
            t.discharge && (r += `<p><strong>${zi("featureDischarge")}:</strong> ${t.discharge.toLocaleString("en")} ${zi("featureM3s")}</p>`), 
            t.basinArea && (r += `<p><strong>${zi("featureBasinArea")}:</strong> ${t.basinArea.toLocaleString("en")} ${zi("featureKm2")}</p>`);
        }
        if (t.countries_ar || t.countries_en) {
            const e = "ar" === Ht ? t.countries_ar : "ru" === Ht ? t.countries_ru || t.countries_en : "uz" === Ht ? t.countries_uz || t.countries_en : "es" === Ht && t.countries_es || t.countries_en;
            r += `<p><strong>${zi("featureCountries")}:</strong> ${e}</p>`;
        }
        if (t.description_ar || t.description_en) {
            const e = "ar" === Ht ? t.description_ar : "ru" === Ht ? t.description_ru || t.description_en : "uz" === Ht ? t.description_uz || t.description_en : "es" === Ht && t.description_es || t.description_en;
            r += `<p><strong>${zi("featureDescription")}:</strong> ${e}</p>`;
        }
        wn = performance.now(), P.innerHTML = r, T.style.display = "block", requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                T.classList.add("visible");
            });
        });
    }
    function Mr() {
        En = null, _n = null;
    }
    function Tr() {
        if (!ee) return;
        var e = void 0 !== Pe && Pe || void 0 !== Ke && "history" === Ke;
        const t = ki(), n = window.devicePixelRatio || 1, i = t.width * n, a = t.height * n;
        if (Z.width === i && Z.height === a || (Z.width = i, Z.height = a, ee.setTransform(n, 0, 0, n, 0, 0)), 
        ee.clearRect(0, 0, t.width, t.height), e) return;
        const r = ao(), o = Math.max(.4, li.k), s = li.x, l = li.y;
        if ("density" === ae && ue) {
            0;
            const u = xi ? densitySpots.filter((e, t) => t % Math.ceil(densitySpots.length / 40) === 0) : densitySpots, p = xi ? 9 : 11;
            yi || (ee.font = "bold " + p + 'px -apple-system, BlinkMacSystemFont, "Noto Sans Arabic", Tahoma, sans-serif', 
            ee.textBaseline = "middle"), u.forEach(e => {
                if (Be && !oo(e.coords)) return;
                const [n, i] = r(e.coords);
                if (isNaN(n) || isNaN(i)) return;
                const a = n * o + s, c = i * o + l;
                if (a < -60 || a > t.width + 60 || c < -60 || c > t.height + 60) return;
                const d = Math.max(2.5, Math.sqrt(e.density) / (xi ? 50 : 38)), u = e.density > 1e4 ? MAP_COLORS.densitySpots.high : e.density > 4e3 ? MAP_COLORS.densitySpots.medium : MAP_COLORS.densitySpots.low, p = Math.max(2.5, d);
                if (!yi) {
                    const e = 1.5 * d, t = 2.2 * d;
                    ee.beginPath(), ee.arc(a, c, t, 0, 2 * Math.PI), ee.fillStyle = u, ee.globalAlpha = .12, 
                    ee.fill(), ee.beginPath(), ee.arc(a, c, e, 0, 2 * Math.PI), ee.globalAlpha = .35, 
                    ee.fill();
                }
                if (ee.beginPath(), ee.arc(a, c, p, 0, 2 * Math.PI), ee.fillStyle = u, ee.globalAlpha = .95, 
                ee.fill(), ee.strokeStyle = MAP_COLORS.ui.white, ee.lineWidth = 1, ee.stroke(), 
                ee.globalAlpha = 1, !yi) {
                    var m = "ar" === Ht ? e.name : "ru" === Ht ? densitySpotRussian[e.name] || densitySpotEnglish[e.name] || e.name : "uz" === Ht ? densitySpotUzbek[e.name] || densitySpotEnglish[e.name] || e.name : "es" === Ht ? densitySpotSpanish[e.name] || densitySpotEnglish[e.name] || e.name : densitySpotEnglish[e.name] || e.name;
                    ee.lineWidth = 3, ee.strokeStyle = MAP_COLORS.ui.textStroke, ee.lineJoin = "round", 
                    ee.strokeText(m, a + p + 3, c), ee.fillStyle = MAP_COLORS.ui.white, ee.fillText(m, a + p + 3, c);
                }
            });
        }
        if (pe) {
            0;
            const m = xi ? 9 : 11;
            yi || (ee.font = "bold " + m + 'px -apple-system, BlinkMacSystemFont, "Noto Sans Arabic", Tahoma, sans-serif', 
            ee.textBaseline = "middle", ee.textAlign = "center"), Object.entries(countryInfo).forEach(([e, n]) => {
                if (!n.capital_coords) return;
                if (Be && !oo(n.capital_coords)) return;
                const [i, a] = r(n.capital_coords);
                if (isNaN(i) || isNaN(a)) return;
                const c = i * o + s, d = a * o + l;
                if (c < -60 || c > t.width + 60 || d < -60 || d > t.height + 60) return;
                const u = xi ? 3.5 : 4.5, p = "#ffd700";
                if (yi || (ee.beginPath(), ee.arc(c, d, 1.6 * u, 0, 2 * Math.PI), ee.fillStyle = p, 
                ee.globalAlpha = .15, ee.fill(), ee.beginPath(), ee.arc(c, d, 1.3 * u, 0, 2 * Math.PI), 
                ee.globalAlpha = .3, ee.fill()), ee.beginPath(), ee.arc(c, d, u, 0, 2 * Math.PI), 
                ee.fillStyle = p, ee.globalAlpha = .9, ee.fill(), ee.strokeStyle = MAP_COLORS.ui.white, 
                ee.lineWidth = 1, ee.stroke(), ee.globalAlpha = 1, !yi) {
                    const e = "ar" === Ht ? n.capital_ar : "ru" === Ht ? n.capital_ru || n.capital_en : "uz" === Ht ? n.capital_uz || n.capital_en : "es" === Ht && n.capital_es || n.capital_en;
                    ee.lineWidth = 3, ee.strokeStyle = MAP_COLORS.ui.textStroke, ee.lineJoin = "round", 
                    ee.strokeText(e, c, d - u - 4), ee.fillStyle = MAP_COLORS.ui.white, ee.fillText(e, c, d - u - 4);
                }
            });
        }
        if (fe) {
            0;
            const f = xi ? 3 : 4, h = MAP_COLORS.cities;
            majorCitiesData.forEach(e => {
                if (Be && !oo(e.coords)) return;
                const [n, i] = r(e.coords);
                if (isNaN(n) || isNaN(i)) return;
                const a = n * o + s, c = i * o + l;
                if (a < -60 || a > t.width + 60 || c < -60 || c > t.height + 60) return;
                const d = h[e.category] || MAP_COLORS.cities.other;
                yi || (ee.beginPath(), ee.arc(a, c, 1.5 * f, 0, 2 * Math.PI), ee.fillStyle = d, 
                ee.globalAlpha = .15, ee.fill()), ee.beginPath(), ee.arc(a, c, f, 0, 2 * Math.PI), 
                ee.fillStyle = d, ee.globalAlpha = .9, ee.fill(), ee.strokeStyle = MAP_COLORS.ui.white, 
                ee.lineWidth = 1, ee.stroke();
            });
        }
        if (Le && Tt && li.k >= 4 && !yi) {
            const y = sr(Tt), g = function(e, t) {
                for (var n = 0, i = 0; i < lr.length; i++) e >= lr[i][0] && (n = lr[i][1]);
                return Math.max(1, Math.round(t * n));
            }(o, y.total), v = gr(Tt), b = 32, w = new Map;
            function c(e, t, n, i) {
                const a = Math.floor(e / b), r = Math.floor(t / b), o = Math.floor(n / b), s = Math.floor(i / b);
                for (let l = a; l <= o; l++) for (let a = r; a <= s; a++) {
                    const r = w.get(l + "," + a);
                    if (r) for (let a = 0; a < r.length; a++) {
                        const o = r[a];
                        if (o.x0 < n && o.x1 > e && o.y0 < i && o.y1 > t) return !0;
                    }
                }
                return !1;
            }
            function d(e, t, n, i) {
                const a = Math.floor(e / b), r = Math.floor(t / b), o = Math.floor(n / b), s = Math.floor(i / b);
                for (let l = a; l <= o; l++) for (let a = r; a <= s; a++) {
                    const r = l + "," + a;
                    let o = w.get(r);
                    o || (o = [], w.set(r, o)), o.push({
                        x0: e,
                        y0: t,
                        x1: n,
                        y1: i
                    });
                }
            }
            ee.textBaseline = "middle", ee.textAlign = "center", ee.lineWidth = 3, ee.strokeStyle = MAP_COLORS.ui.textStroke, 
            ee.fillStyle = "rgba(255,255,255,0.9)", ee.lineJoin = "round";
            const E = '-apple-system, BlinkMacSystemFont, "Noto Sans Arabic", Tahoma, sans-serif', k = 60;
            for (let x = 0; x < y.items.length && x < g; x++) {
                const _ = y.items[x], C = v[_.i];
                if (!C) continue;
                const L = (C[0] + C[2]) / 2, B = (C[1] + C[3]) / 2;
                if (isNaN(L) || isNaN(B)) continue;
                const S = L * o + s, I = B * o + l;
                if (S < -k || S > t.width + k || I < -k || I > t.height + k) continue;
                if (Be && !oo(_.centroid)) continue;
                const z = Vi(_.name);
                if (!z) continue;
                const A = (C[2] - C[0]) * o, M = (C[3] - C[1]) * o;
                if (A < 2 || M < 2) continue;
                let T = Math.min(A / (.6 * z.length), M / 1.5, 16);
                if (T < 9) continue;
                ee.font = T + "px " + E;
                const P = ee.measureText(z).width;
                if (P > A) {
                    if (T = Math.floor(T * A / P), T < 9) continue;
                    ee.font = T + "px " + E;
                }
                const q = 1.4 * T, O = S - P / 2 - 2, R = I - q / 2 - 2, N = S + P / 2 + 2, D = I + q / 2 + 2;
                c(O, R, N, D) || (d(O, R, N, D), ee.strokeText(z, S, I), ee.fillText(z, S, I));
            }
        }
    }
    function Pr() {
        const e = li.k;
        if (e > 1.5) return -1;
        let t = .001 / (e + .1);
        return xi && (t *= 1.2), t;
    }
    function qr() {
        const e = li.k || 1, t = xi ? 12 : 16, n = xi ? 18 : 24;
        return Math.max(t, Math.min(n, t * Math.pow(e, .45))) / e;
    }
    function Or(e) {
        if (bi && (bi.remove(), bi = null), !(void 0 !== Pe && Pe || void 0 !== Ke && "history" === Ke ? Dn && Fn : oe)) return;
        const t = Pr(), n = qr(), i = ao(), a = Xn.append("g").attr("class", "country-label-group");
        (xi ? e.filter(e => d3.geoArea(e) > .005) : e).forEach(e => {
            const r = e.properties?.name || "", o = Hi(r), s = d3.geoArea(e);
            if (t >= 0 && s < t) return;
            let l;
            if (labelPositions[r]) {
                const [e, t] = labelPositions[r];
                l = i([ e, t ]);
            } else {
                const t = d3.geoCentroid(e);
                l = i(t);
            }
            if (!l || isNaN(l[0]) || isNaN(l[1])) try {
                const t = d3.geoPath(i).centroid(e);
                !t || isNaN(t[0]) || isNaN(t[1]) || (l = t);
            } catch (e) {}
            if (!l || isNaN(l[0]) || isNaN(l[1])) return;
            const c = l[0], d = l[1];
            a.append("text").attr("x", c).attr("y", d).attr("class", "country-label").text(o).attr("font-size", n + "px").attr("fill", MAP_COLORS.ui.white).attr("font-weight", 600).attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("vector-effect", "non-scaling-stroke").attr("style", "text-shadow: 0 1px 3px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.7); letter-spacing: 0.3px;").datum({
                feature: e,
                area: s,
                name: r,
                displayName: o
            });
        }), bi = a.selectAll(".country-label");
    }
    function Rr() {
        oe = !oe, y.classList.toggle("toggle-on", oe), y.setAttribute("aria-pressed", oe ? "true" : "false"), 
        bi && (bi.remove(), bi = null), oe ? Or(fn) : (Xn.selectAll(".country-label-group").remove(), 
        bi = null), Yr(), Cs(), Gr();
    }
    let Nr = !1, Dr = null, Fr = !1, Hr = null;
    function jr() {
        if (Fr = !1, !Hr) return;
        const e = Hr;
        Hr = null;
        const t = ki(), n = e.clientX - t.left, i = e.clientY - t.top, a = ci.w;
        let o = n + 16, s = i - ci.h - 16;
        o + a > t.width && (o = n - a - 16), s < 0 && (s = i + 16), o < 0 && (o = 16), r.style.left = o + "px", 
        r.style.top = s + "px";
    }
    function Wr() {
        if (Nr = !1, !Dr) return;
        var e = Dr;
        if (Dr = null, !Mt) return void l.classList.add("hidden");
        l.classList.remove("hidden");
        const t = ki(), n = e.clientX - t.left, i = e.clientY - t.top, a = li && "function" == typeof li.invert ? li.invert([ n, i ]) : [ n, i ], r = ao(), o = r && "function" == typeof r.invert ? r.invert(a) : null, s = zi(`mode_${ae}`) || ae, c = zi(`religion_${ie}`) || ie, d = li && li.k ? li.k.toFixed(1) : "1.0";
        if (!o || isNaN(o[0]) || isNaN(o[1])) l.textContent = `${zi("lon")}: — | ${zi("lat")}: — | ${zi("zoom")}: ${li.k.toFixed(1)}x | ${zi("mode")}: ${s} | ${zi("filter")}: ${c}`; else {
            const e = o[0].toFixed(2), t = o[1].toFixed(2);
            l.textContent = `${zi("lon")}: ${e} | ${zi("lat")}: ${t} | ${zi("zoom")}: ${d}x | ${zi("mode")}: ${s} | ${zi("filter")}: ${c}`;
        }
    }
    function Ur(e) {
        Dr = e, Nr || (Nr = !0, requestAnimationFrame(Wr));
    }
    function $r() {
        if (yn) {
            var e = void 0 !== Pe && Pe || void 0 !== Ke && "history" === Ke;
            if (e ? (ha(), window.drawHistoricalTravelers && window.drawHistoricalTravelers(), 
            window.drawHistCapitals && window.drawHistCapitals(), window.drawHistBattles && window.drawHistBattles(), 
            window.drawHistWonders && window.drawHistWonders(), window.drawHistSacredSites && window.drawHistSacredSites()) : (yn.transition().duration(n() ? 0 : 400).attr("fill", e => ma(e)).attr("opacity", e => ya(e)), 
            yn.attr("stroke", e => fa(e)).attr("stroke-width", e => .8).attr("stroke-dasharray", "none").attr("filter", pa).attr("aria-label", e => Hi(e.properties?.name || "")).style("pointer-events", null), 
            bi && (bi.remove(), bi = null), Or(fn), Ea(), Fa(), Ia(), Ta(), Tr(), Oa(), Na(), 
            Ra(), ja(), Wa(), $a(), Ka(), Va(), Xa(), Ja(), tr(), nr()), !vt || !vt.length) try {
                ns(), "region" === ut && ft && ft.length > 0 && as();
            } catch (e) {}
            Yr(), vn && "block" === T.style.display && !bn && ko(vn), !En || "block" !== T.style.display || vn || bn || Ar(_n, En), 
            vn && !e && Kr(vn), Cs();
        }
    }
    function Kr(e) {
        yn.classed("highlighted-country", !1), yn.attr("stroke", e => fa(e)).attr("stroke-width", e => .8), 
        yn.each(function() {
            this.style.removeProperty("filter");
        }), e && yn.filter(t => t === e).classed("highlighted-country", !0);
    }
    function Gr() {
        var e = document.getElementById("layerCounter");
        if (e) {
            var t = 0, n = document.querySelectorAll("#layersModalBody .btn.toggle-on");
            n && (t = n.length), e.textContent = t;
        }
    }
    function Yr() {
        if (Pe) return void renderHistoryLegend();
        let e = "";
        if ("terrain" === ae) {
            e += `<div style="font-weight:700;margin-bottom:4px">${zi("terrainLegend")}</div>`;
            [ {
                l: `<0${zi("elevationUnit")}`,
                c: na(-1)
            }, {
                l: "0-200",
                c: na(100)
            }, {
                l: "200-700",
                c: na(500)
            }, {
                l: "700-2000",
                c: na(1500)
            }, {
                l: ">3000",
                c: na(3500)
            } ].forEach(t => e += `<div class="legend-item"><span class="legend-color" style="background:${t.c}"></span>${t.l}</div>`);
        } else if ("density" === ae) {
            e += `<div style="font-weight:700;margin-bottom:4px">${zi("densityLegend")}</div>`;
            const t = [ ia(1), ia(20), ia(80), ia(250), ia(700) ].join(",");
            e += '<div class="legend-gradient-labels"><span>&lt;1</span><span>&gt;500</span></div>', 
            e += `<div class="legend-gradient-bar" style="background:linear-gradient(to right,${t})"></div>`, 
            e += `<div style="font-size:0.8em;color:var(--text-secondary);margin-top:2px">${zi("densityUnit")}</div>`;
        } else if ("precipitation" === ae) {
            e += `<div style="font-weight:700;margin-bottom:4px">${zi("precipitationLegend")}</div>`;
            const t = [ aa(30), aa(200), aa(700), aa(1800), aa(3200) ].join(",");
            e += '<div class="legend-gradient-labels"><span>&lt;100</span><span>&gt;3000</span></div>', 
            e += `<div class="legend-gradient-bar" style="background:linear-gradient(to right,${t})"></div>`, 
            e += `<div style="font-size:0.8em;color:var(--text-secondary);margin-top:2px">${zi("precipYear")}</div>`;
        } else if ("temperature" === ae) {
            e += `<div style="font-weight:700;margin-bottom:4px">${zi("temperatureLegend")}</div>`;
            const t = [ ra(-15), ra(-3), ra(8), ra(18), ra(28), ra(35) ].join(",");
            e += '<div class="legend-gradient-labels"><span>&lt;0°</span><span>&gt;30°</span></div>', 
            e += `<div class="legend-gradient-bar" style="background:linear-gradient(to right,${t})"></div>`, 
            e += `<div style="font-size:0.8em;color:var(--text-secondary);margin-top:2px">${zi("celsiusLabel")}</div>`;
        } else if ("gdp" === ae) {
            e += `<div style="font-weight:700;margin-bottom:4px">${zi("gdpLegend")}</div>`;
            const t = MAP_COLORS.gdp.slice(1).join(",");
            e += '<div class="legend-gradient-labels"><span>&lt;$1k</span><span>&gt;$80k</span></div>', 
            e += `<div class="legend-gradient-bar" style="background:linear-gradient(to right,${t})"></div>`, 
            e += `<div style="font-size:0.8em;color:var(--text-secondary);margin-top:2px">${zi("gdpUnit")}</div>`;
        } else if ("hdi" === ae) {
            e += `<div style="font-weight:700;margin-bottom:4px">${zi("hdiLegend")}</div>`;
            const t = MAP_COLORS.hdi.slice(1).join(",");
            e += '<div class="legend-gradient-labels"><span>&lt;0.55</span><span>&gt;0.90</span></div>', 
            e += `<div class="legend-gradient-bar" style="background:linear-gradient(to right,${t})"></div>`;
        } else "normal" === ae ? e += `<div>${zi("normalLegend")}</div>` : (e += `<div style="font-weight:700;margin-bottom:4px">${zi("religionLegend")}</div>`, 
        Object.entries(se ? denominationColors : religionColors).forEach(([t, n]) => {
            const i = se ? "ar" === Ht ? denominationArabic[t] || t : "ru" === Ht ? denominationRussian[t] || t : "uz" === Ht ? denominationUzbek[t] || t : "es" === Ht && denominationSpanish[t] || t : "ar" === Ht ? religionArabic[t] || t : "ru" === Ht ? religionRussian[t] || t : "uz" === Ht ? religionUzbek[t] || t : "es" === Ht && religionSpanish[t] || t;
            e += `<div class="legend-item"><span class="legend-color" style="background:${n}"></span>${i}</div>`;
        }));
        if ((le || Ee) && (e += `<div>🛣️ ${zi("routes")}</div>`), ce && (e += `<div>${zi("riversOn")}</div>`), 
        ue && "density" === ae && (e += `<div>${zi("spotsOn")}</div>`), pe && (e += `<div>${zi("capitalsOn")}</div>`), 
        me) {
            e += '<div style="font-weight:700;margin-bottom:4px">' + zi("timezonesLegend") + "</div>";
            var t = MAP_COLORS.timezones.join(",");
            e += '<div class="legend-gradient-labels"><span>UTC-12</span><span>UTC+14</span></div>', 
            e += '<div class="legend-gradient-bar" style="background:linear-gradient(to right,' + t + ')"></div>';
        }
        if (fe) {
            e += `<div style="font-weight:700;margin-bottom:4px">${zi("cityLegend")}</div>`;
            var n = MAP_COLORS.cities, i = {
                tourist: zi("cityCategoryTourist"),
                commercial: zi("cityCategoryCommercial"),
                industrial: zi("cityCategoryIndustrial"),
                agricultural: zi("cityCategoryAgricultural")
            };
            Object.entries(n).forEach(function(t) {
                e += `<div class="legend-item"><span class="legend-color" style="background:${t[1]}"></span>${i[t[0]]}</div>`;
            });
        }
        if (he) {
            e += `<div style="font-weight:700;margin-bottom:4px">${zi("naturalResourcesLegend")}</div>`;
            var a = {};
            Object.keys(MAP_COLORS.naturalResources).forEach(function(e) {
                "default" !== e && (a[e] = MAP_COLORS.naturalResources[e]);
            });
            var r = {
                oil: zi("resourceOil"),
                gas: zi("resourceGas"),
                coal: zi("resourceCoal"),
                copper: zi("resourceCopper"),
                gold: zi("resourceGold"),
                iron: zi("resourceIron"),
                diamond: zi("resourceDiamond"),
                phosphate: zi("resourcePhosphate"),
                uranium: zi("resourceUranium"),
                lithium: zi("resourceLithium"),
                cobalt: zi("resourceCobalt"),
                rareEarth: zi("resourceRareEarths"),
                silver: zi("resourceSilver"),
                platinum: zi("resourcePlatinum"),
                bauxite: zi("resourceBauxite"),
                nickel: zi("resourceNickel"),
                tin: zi("resourceTin"),
                zinc: zi("resourceZinc"),
                potash: zi("resourcePotash"),
                renewable: zi("resourceRenewable"),
                water: zi("resourceWater"),
                forest: zi("resourceForest")
            };
            Object.entries(a).forEach(function(t) {
                e += `<div class="legend-item"><span class="legend-color" style="background:${t[1]}"></span>${r[t[0]]}</div>`;
            });
        }
        (ye && (e += `<div style="font-weight:700;margin-bottom:4px">${zi("ethnicGroupsLegend")}</div>`, 
        e += `<div style="font-size:0.8em;color:var(--text-secondary)">${zi("ethnicLegendDesc")}</div>`), 
        ge) && (e += `<div style="font-weight:700;margin-bottom:4px">${zi("oceanCurrentsLegend")}</div>`, 
        [ {
            c: MAP_COLORS.oceanCurrents.warm,
            l: zi("warmCurrent")
        }, {
            c: MAP_COLORS.oceanCurrents.cold,
            l: zi("coldCurrent")
        }, {
            c: MAP_COLORS.oceanCurrents.gyre,
            l: zi("gyre")
        }, {
            c: MAP_COLORS.oceanCurrents.trench,
            l: zi("oceanTrench")
        } ].forEach(function(t) {
            e += `<div class="legend-item"><span class="legend-color" style="background:${t.c}"></span>${t.l}</div>`;
        }));
        ve && (e += `<div style="font-weight:700;margin-bottom:4px">${zi("windsLegend")}</div>`, 
        [ {
            c: MAP_COLORS.winds.trade,
            l: zi("tradeWinds")
        }, {
            c: MAP_COLORS.winds.westerly,
            l: zi("westerlyWinds")
        }, {
            c: MAP_COLORS.winds.polar,
            l: zi("polarWinds")
        }, {
            c: MAP_COLORS.winds.monsoon,
            l: zi("monsoonWinds")
        } ].forEach(function(t) {
            e += `<div class="legend-item"><span class="legend-color" style="background:${t.c}"></span>${t.l}</div>`;
        }));
        be && (e += `<div style="font-weight:700;margin-bottom:4px">${zi("earthquakesLegend")}</div>`, 
        [ {
            c: MAP_COLORS.earthquakes.major9,
            l: zi("magAbove9")
        }, {
            c: MAP_COLORS.earthquakes.major8,
            l: "8.0 – 8.9"
        }, {
            c: MAP_COLORS.earthquakes.major7,
            l: "7.0 – 7.9"
        }, {
            c: MAP_COLORS.earthquakes.major6,
            l: "6.0 – 6.9"
        }, {
            c: MAP_COLORS.earthquakes.below6,
            l: zi("belowMag6")
        } ].forEach(function(t) {
            e += `<div class="legend-item"><span class="legend-color" style="background:${t.c}"></span>${t.l}</div>`;
        }));
        if (we && (e += `<div style="font-weight:700;margin-bottom:4px">${zi("volcanoesLegend")}</div>`, 
        e += `<div style="font-size:0.8em;color:var(--text-secondary)">${zi("volcanoLegendDesc")}</div>`), 
        xe) if (e += `<div style="font-weight:700;margin-bottom:4px">${zi("geopoliticalBlocsLegend")}</div>`, 
        "all" !== re) {
            var s = geopoliticalBlocsData.find(function(e) {
                return e.name_en === re || e.name === re;
            });
            s && (e += `<div style="font-size:0.85em;color:${s.color};margin-top:2px">◉ ${"ar" === Ht ? s.name : "ru" === Ht ? s.name_ru || s.name_en : "uz" === Ht ? s.name_uz || s.name_en : "es" === Ht && s.name_es || s.name_en}</div>`);
        } else e += `<div style="font-size:0.8em;color:var(--text-secondary)">${zi("geopoliticalBlocHint")}</div>`;
        _e && (e += `<div style="font-weight:700;margin-bottom:4px">${zi("desertsForestsLegend")}</div>`, 
        e += `<div class="legend-item"><span class="legend-color" style="background:${MAP_COLORS.desertsForests.desert}"></span>${zi("desertLabel")}</div>`, 
        e += `<div class="legend-item"><span class="legend-color" style="background:${MAP_COLORS.desertsForests.forest}"></span>${zi("forestLabel")}</div>`), 
        Ce && (e += `<div style="font-weight:700;margin-bottom:4px">${zi("borderDisputesLegend")}</div>`, 
        e += `<div class="legend-item"><span class="legend-color" style="background:${MAP_COLORS.borderDisputes.active}"></span>${zi("activeConflict")}</div>`, 
        e += `<div class="legend-item"><span class="legend-color" style="background:${MAP_COLORS.borderDisputes.ceasefire}"></span>${zi("ceasefireLabel")}</div>`, 
        e += `<div class="legend-item"><span class="legend-color" style="background:${MAP_COLORS.borderDisputes.maritime}"></span>${zi("maritimeDispute")}</div>`), 
        ("terrain" === ae || ce) && (e += `<div style="margin-top:4px;font-size:0.85em;color:var(--text-secondary)">${zi("featureClickHint")}</div>`), 
        o.innerHTML = e;
    }
    function Vr(e) {
        if (ae === e) return;
        const t = ae;
        ae = e, "density" === t && "density" !== e && ue && (ue = !1, b.classList.remove("toggle-on"), 
        ee && ee.clearRect(0, 0, Z.width, Z.height)), m(f, `.mode-btn[data-mode="${e}"]`), 
        requestAnimationFrame(function() {
            $r();
        }), Ur({
            clientX: 0,
            clientY: 0
        });
    }
    function Qr() {
        se = !se, g.classList.toggle("toggle-on", se), g.setAttribute("aria-pressed", se ? "true" : "false"), 
        se && "religion" !== ae ? Vr("religion") : $r(), Gr();
    }
    function Xr() {
        le = !le, Ee = le, v.classList.toggle("toggle-on", le), v.setAttribute("aria-pressed", le ? "true" : "false"), 
        Ma(), Yr(), Gr();
    }
    function Jr() {
        Xr();
    }
    function Zr() {
        ue = !ue, b.classList.toggle("toggle-on", ue), b.setAttribute("aria-pressed", ue ? "true" : "false"), 
        ue && "density" !== ae ? Vr("density") : (Tr(), Yr()), Gr();
    }
    function eo() {
        Ii("capitals");
    }
    function to() {
        Ii("timezones");
    }
    function no() {
        Ii("majorCities");
    }
    function io() {
        Mt = !Mt, x && (x.classList.toggle("toggle-on", Mt), x.setAttribute("aria-pressed", Mt ? "true" : "false"));
        var e = document.getElementById("coordinatesDisplay");
        e && e.classList.toggle("hidden", !Mt), Gr(), Cs();
    }
    function ao() {
        return Be && Se ? Se : Kn;
    }
    function ro() {
        Gn = d3.geoPath(ao()), Gn.pointRadius(xi ? 1.5 : 3);
    }
    function oo(e) {
        if (!Be) return !0;
        var t = Se.rotate(), n = [ -t[0], -t[1] ];
        return d3.geoDistance(e, n) < Math.PI / 2;
    }
    function so(e) {
        var t = QUIZ_LAYERS.find(function(t) {
            return t.id === e.layerId;
        });
        if (!t) return null;
        if ("polygon" === t.checkType) try {
            return d3.geoCentroid(e.item);
        } catch (e) {
            return null;
        }
        if ("bloc" === t.checkType) return e.item.coords || null;
        if ("line" === t.checkType && e.item.coords && e.item.coords.length >= 2) {
            var n = Math.floor(e.item.coords.length / 2);
            return e.item.coords[n];
        }
        return getItemCoords(e.item, e.layerId) || null;
    }
    function lo(e, t, i) {
        if (Be && Se && e) {
            var a = [ -e[0], .6 * -e[1] ], r = Se.rotate();
            if (oo(e) && d3.geoDistance(e, [ -r[0], -r[1] ]) < Math.PI / 3) i && i(); else {
                if (n()) return Ie = a, Se.rotate(Ie), uo(!1), void (i && i());
                var o = d3.interpolate(r, a), s = null;
                requestAnimationFrame(function e(n) {
                    s || (s = n);
                    var a = Math.min(1, (n - s) / (t || 600));
                    Ie = o(a * (2 - a)), Se.rotate(Ie), a < 1 ? (uo(!0), requestAnimationFrame(e)) : (uo(!1), 
                    i && i());
                });
            }
        } else i && i();
    }
    function co() {
        var e = La(), t = Math.min(e.width, e.height);
        Se = d3.geoOrthographic().scale(.42 * t).translate([ e.width / 2, e.height / 2 ]).rotate(Ie).clipAngle(90);
    }
    function uo(e) {
        if (Be && Se) {
            ro(), ti.selectAll("*").remove();
            var t = La(), n = Se.scale();
            ti.append("circle").attr("cx", t.width / 2).attr("cy", t.height / 2).attr("r", n + 12).attr("fill", "url(#atmosphereGlow)").attr("filter", "url(#atmosphereBlur)"), 
            ti.append("circle").attr("cx", t.width / 2).attr("cy", t.height / 2).attr("r", n).attr("fill", "url(#globeShading)"), 
            Sa(), Ia(), Jn && Jn.selectAll("path").attr("d", Gn), Qn.selectAll("path").attr("d", Gn).attr("fill", e ? "var(--panel-bg, #3a4a5c)" : function(e) {
                return ma(e);
            }).attr("stroke", e ? "rgba(255,255,255,0.5)" : function(e) {
                return fa(e);
            }).attr("stroke-width", e ? .6 : function(e) {
                return .8;
            }).attr("opacity", e ? .9 : function(e) {
                return ya(e);
            }), e || (bi && (bi.remove(), bi = null), Or(fn), Fa(), Ta(), Na(), Ja(), tr(), 
            nr(), clearTimeout(Ft), Ft = setTimeout(function() {
                Be ? (en.selectAll("*").remove(), ir().then(wr)) : cr();
            }, 200), ja(), Wa(), $a(), Ka(), Va(), Xa(), Tr());
        }
    }
    function po() {
        uo(!1);
    }
    function mo() {
        if (As(), mr = !0, Be = !Be, C && C.classList.toggle("toggle-on", Be), Be) {
            var e = document.getElementById("quizBtn");
            e && (e.disabled = !0, e.classList.add("quiz-disabled"), e.title = zi("quizUnavailableOnGlobe")), 
            To(), (t = document.getElementById("headerProjectionLabel")) && (t.setAttribute("data-i18n", "globeProjectionType"), 
            t.textContent = zi("globeProjectionType")), co(), function() {
                if (!document.getElementById("globeShading")) {
                    var e = Yn.select("defs").empty() ? Yn.append("defs") : Yn.select("defs"), t = e.append("radialGradient").attr("id", "globeShading").attr("cx", "35%").attr("cy", "35%").attr("r", "70%");
                    t.append("stop").attr("offset", "0%").attr("stop-color", "#2a5580"), t.append("stop").attr("offset", "100%").attr("stop-color", "#0d1e30");
                    var n = e.append("radialGradient").attr("id", "atmosphereGlow").attr("cx", "50%").attr("cy", "50%").attr("r", "50%");
                    n.append("stop").attr("offset", "85%").attr("stop-color", "transparent"), n.append("stop").attr("offset", "100%").attr("stop-color", "rgba(70,160,255,0.25)"), 
                    e.append("filter").attr("id", "atmosphereBlur").attr("x", "-20%").attr("y", "-20%").attr("width", "140%").attr("height", "140%").append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", "6");
                }
            }(), Kn = Se, ro(), li = d3.zoomIdentity, Io(d3.zoomIdentity), Yn.on(".zoom", null), 
            Me || (Me = d3.drag().on("start", function() {
                ze = !0;
            }).on("drag", function(e) {
                Ie[0] += .25 * e.dx, Ie[1] = Math.max(-90, Math.min(90, Ie[1] - .25 * e.dy)), Se.rotate(Ie), 
                Ae || (Ae = !0, requestAnimationFrame(function() {
                    Ae = !1, uo(!0);
                }));
            }).on("end", function() {
                ze = !1, po();
            })), Yn.call(Me), Zn.selectAll("*").remove(), Qn.selectAll("*").remove(), bi && (bi.remove(), 
            bi = null), fn && fn.length && (Jn && Jn.selectAll("path").attr("d", Gn), yn = Qn.selectAll("path").data(fn).join("path").attr("d", Gn).attr("fill", function(e) {
                return ma(e);
            }).attr("stroke", function(e) {
                return fa(e);
            }).attr("stroke-width", function(e) {
                return .8;
            }).attr("opacity", function(e) {
                return ya(e);
            }).attr("filter", pa).attr("cursor", "pointer").attr("vector-effect", "non-scaling-stroke").on("click", Uo)), 
            lt.length > 0 && (ct || (ct = Vn.append("g").attr("class", "measure-layer")), Wo()), 
            is(), po();
        } else {
            var t, i = document.getElementById("quizBtn");
            i && (i.disabled = !1, i.classList.remove("quiz-disabled"), i.title = zi("quizMode")), 
            To(), (t = document.getElementById("headerProjectionLabel")) && (t.setAttribute("data-i18n", "headerProjectionType"), 
            t.textContent = zi("headerProjectionType")), Yn.on(".drag", null), si && Yn.call(si);
            var a = La();
            Kn = Ba(a.width, a.height), ro(), ti.selectAll("*").remove(), ti.append("rect").attr("x", -500).attr("y", -500).attr("width", a.width + 1e3).attr("height", a.height + 1e3).attr("fill", "url(#oceanGradient)"), 
            Zn.selectAll("*").remove(), Sa(), Ia(), fn && fn.length && (Jn && Jn.selectAll("path").attr("d", Gn), 
            Qn.selectAll("*").remove(), yn = Qn.selectAll("path").data(fn).join("path").attr("class", "country-path").attr("d", Gn).attr("fill", function(e) {
                return ma(e);
            }).attr("stroke", function(e) {
                return fa(e);
            }).attr("stroke-width", function(e) {
                return .8;
            }).attr("stroke-dasharray", function(e) {
                return (void 0 !== Pe && Pe || void 0 !== Ke && "history" === Ke) && Dn ? "4,3" : "none";
            }).attr("opacity", function(e) {
                return ya(e);
            }).attr("filter", pa).attr("cursor", "pointer").attr("vector-effect", "non-scaling-stroke").attr("tabindex", 0).attr("role", "button").attr("aria-label", function(e) {
                return Hi(e.properties?.name || "");
            }), yn.on("mouseenter", function(e, t) {
                if (!Te) {
                    var i = t.properties?.name || "", a = Hi(i), o = Qi(i), s = (se && Xi(i), '<div class="country-name"><strong>' + a + "</strong></div>");
                    if ("religion" === ae) {
                        var l = "ar" === Ht ? religionArabic[o] || o : "ru" === Ht ? religionRussian[o] || o : "uz" === Ht ? religionUzbek[o] || o : "es" === Ht && religionSpanish[o] || o;
                        s += "<div>" + zi("tooltipReligion") + ": " + l + "</div>";
                    }
                    r.innerHTML = s, r.classList.add("visible"), d3.select(this).transition().duration(n() ? 0 : 120).attr("stroke", "#fff").attr("stroke-width", 1.5);
                }
            }).on("mousemove", function(e) {
                r.style.left = e.offsetX + 14 + "px", r.style.top = e.offsetY - 10 + "px", Ur(e);
            }).on("mouseleave", function() {
                r.classList.remove("visible"), d3.select(this).datum() !== vn && d3.select(this).transition().duration(n() ? 0 : 120).attr("stroke", function(e) {
                    return fa(e);
                }).attr("stroke-width", function(e) {
                    return .8;
                });
            }).on("click", Uo)), bi && (bi.remove(), bi = null), Or(fn), Ea();
            try {
                ns();
            } catch (e) {}
            Ls();
        }
    }
    function fo(e) {
        Ht = e;
        try {
            localStorage.setItem("mapLang", e);
        } catch (e) {}
        yo();
    }
    function ho(e, t) {
        if (e) {
            var n = e.querySelector(".btn-text");
            n ? n.textContent = t : e.textContent = t;
        }
    }
    function yo() {
        document.querySelectorAll("[data-i18n]").forEach(function(e) {
            ho(e, zi(e.dataset.i18n));
        }), document.querySelectorAll("[data-i18n-title]").forEach(function(e) {
            var t = e.dataset.i18nTitle;
            e.title = zi(t), e.setAttribute("data-tooltip", zi(t));
        }), document.querySelectorAll(".btn[title]").forEach(function(e) {
            e.getAttribute("data-tooltip") || e.setAttribute("data-tooltip", e.title);
        }), document.querySelectorAll("[data-i18n-placeholder]").forEach(function(e) {
            var t = e.dataset.i18nPlaceholder;
            e.placeholder = zi(t);
        }), document.querySelectorAll("[data-i18n-aria-label]").forEach(function(e) {
            var t = e.dataset.i18nAriaLabel;
            e.setAttribute("aria-label", zi(t));
        }), document.documentElement.setAttribute("lang", "ar" === Ht ? "ar" : "ru" === Ht ? "ru" : "uz" === Ht ? "uz" : "es" === Ht ? "es" : "en"), 
        document.documentElement.setAttribute("dir", "ar" === Ht ? "rtl" : "ltr"), document.title = zi("appName"), 
        document.querySelectorAll(".lang-option").forEach(function(e) {
            e.classList.toggle("active", e.dataset.lang === Ht);
        });
        var e = document.getElementById("blocSelect"), t = e.value;
        e.options.length = 1, geopoliticalBlocsData.forEach(function(t) {
            var n = document.createElement("option");
            n.value = t.name_en, n.textContent = ("ar" === Ht ? t.name : "ru" === Ht ? t.name_ru || t.name_en : "uz" === Ht ? t.name_uz || t.name_en : "es" === Ht && t.name_es || t.name_en) + " (" + ("ar" === Ht ? t.members_ar : "ru" === Ht ? t.members_ru || t.members_en : "uz" === Ht ? t.members_uz || t.members_en : "es" === Ht && t.members_es || t.members_en) + ")", 
            e.appendChild(n);
        }), e.options[0].textContent = zi("blocAll"), e.value = t, f.forEach(e => {
            ho(e, zi(`mode_${e.dataset.mode}`)), e.title = zi(`mode_${e.dataset.mode}_tip`) || e.textContent;
        }), h.forEach(e => {
            e.textContent = zi(`religion_${e.dataset.religion}`), e.title = zi(`filter_${e.dataset.religion}_tip`) || e.textContent;
        });
        var n = document.querySelector("#mobileCoordsBtn .btn-text");
        if (n && (n.textContent = zi("coordsToggle").replace(/^.{1,2}\s*/, "")), go(), fn.length && (bi && (bi.remove(), 
        bi = null), Or(fn)), $r(), Object.keys(Li).forEach(function(e) {
            var t = Li[e];
            t.drawFn && t.getFlag() && t.drawFn();
        }), Tr(), Ur({
            clientX: 0,
            clientY: 0
        }), U && U.classList.contains("visible") && Ps(), window.historyIsActive && window.historyIsActive() && (window.renderHistoryBar(), 
        window.drawHistoryScenario(!0), vn && "history" === _n && T.classList.contains("visible") && window.openHistoryPanel(vn)), 
        void 0 !== Hn && Hn) {
            Gc(jn, !0);
            var i = document.getElementById("histTerrainYearBadge");
            i && (i.textContent = Wc(jn));
        }
        En && T && T.classList.contains("visible") && ("histPhysical" === _n ? Yc(En, jn) : "histSacredSite" === _n && Pc(En));
    }
    function go() {
        s.textContent = zi("infoOverlay", {
            zoom: li.k.toFixed(1)
        });
    }
    function vo() {
        Yn.transition().duration(n() ? 0 : 600).ease(d3.easeCubicInOut).call(si.transform, d3.zoomIdentity);
    }
    function bo(e) {
        const t = {
            Afghanistan: "🇦🇫",
            Albania: "🇦🇱",
            Algeria: "🇩🇿",
            Angola: "🇦🇴",
            Argentina: "🇦🇷",
            Armenia: "🇦🇲",
            Australia: "🇦🇺",
            Austria: "🇦🇹",
            Azerbaijan: "🇦🇿",
            Andorra: "🇦🇩",
            "Antigua and Barbuda": "🇦🇬",
            Kiribati: "🇰🇮",
            Liechtenstein: "🇱🇮",
            "Marshall Islands": "🇲🇭",
            Micronesia: "🇫🇲",
            Monaco: "🇲🇨",
            Nauru: "🇳🇷",
            Palau: "🇵🇼",
            "Saint Kitts and Nevis": "🇰🇳",
            "Saint Vincent and the Grenadines": "🇻🇨",
            "San Marino": "🇸🇲",
            Tuvalu: "🇹🇻",
            "Vatican City": "🇻🇦",
            Bahrain: "🇧🇭",
            Bangladesh: "🇧🇩",
            Belarus: "🇧🇾",
            Belgium: "🇧🇪",
            Belize: "🇧🇿",
            Benin: "🇧🇯",
            Bhutan: "🇧🇹",
            Bolivia: "🇧🇴",
            Bosnia: "🇧🇦",
            Botswana: "🇧🇼",
            Brazil: "🇧🇷",
            Brunei: "🇧🇳",
            Bulgaria: "🇧🇬",
            "Burkina Faso": "🇧🇫",
            Burundi: "🇧🇮",
            Cambodia: "🇰🇭",
            Cameroon: "🇨🇲",
            Canada: "🇨🇦",
            "Cape Verde": "🇨🇻",
            "Central African Republic": "🇨🇫",
            Chad: "🇹🇩",
            Chile: "🇨🇱",
            China: "🇨🇳",
            Colombia: "🇨🇴",
            Comoros: "🇰🇲",
            Congo: "🇨🇬",
            "Costa Rica": "🇨🇷",
            Croatia: "🇭🇷",
            Cuba: "🇨🇺",
            Cyprus: "🇨🇾",
            "Czech Republic": "🇨🇿",
            Denmark: "🇩🇰",
            Djibouti: "🇩🇯",
            "Dominican Republic": "🇩🇴",
            "DR Congo": "🇨🇩",
            Ecuador: "🇪🇨",
            Egypt: "🇪🇬",
            "El Salvador": "🇸🇻",
            "Equatorial Guinea": "🇬🇶",
            Eritrea: "🇪🇷",
            Estonia: "🇪🇪",
            Eswatini: "🇸🇿",
            Ethiopia: "🇪🇹",
            Fiji: "🇫🇯",
            Finland: "🇫🇮",
            France: "🇫🇷",
            Gabon: "🇬🇦",
            Gambia: "🇬🇲",
            Georgia: "🇬🇪",
            Germany: "🇩🇪",
            Ghana: "🇬🇭",
            Greece: "🇬🇷",
            Greenland: "🇬🇱",
            Guatemala: "🇬🇹",
            Guinea: "🇬🇳",
            "Guinea-Bissau": "🇬🇼",
            Guyana: "🇬🇾",
            Haiti: "🇭🇹",
            Honduras: "🇭🇳",
            Hungary: "🇭🇺",
            Iceland: "🇮🇸",
            India: "🇮🇳",
            Indonesia: "🇮🇩",
            Iran: "🇮🇷",
            Iraq: "🇮🇶",
            Ireland: "🇮🇪",
            Israel: "🇮🇱",
            Italy: "🇮🇹",
            Jamaica: "🇯🇲",
            Japan: "🇯🇵",
            Jordan: "🇯🇴",
            Kazakhstan: "🇰🇿",
            Kenya: "🇰🇪",
            Kuwait: "🇰🇼",
            Kyrgyzstan: "🇰🇬",
            Laos: "🇱🇦",
            Latvia: "🇱🇻",
            Lebanon: "🇱🇧",
            Lesotho: "🇱🇸",
            Liberia: "🇱🇷",
            Libya: "🇱🇾",
            Lithuania: "🇱🇹",
            Luxembourg: "🇱🇺",
            Madagascar: "🇲🇬",
            Malawi: "🇲🇼",
            Malaysia: "🇲🇾",
            Maldives: "🇲🇻",
            Mali: "🇲🇱",
            Malta: "🇲🇹",
            Mauritania: "🇲🇷",
            Mauritius: "🇲🇺",
            Mexico: "🇲🇽",
            Moldova: "🇲🇩",
            Mongolia: "🇲🇳",
            Montenegro: "🇲🇪",
            Morocco: "🇲🇦",
            Mozambique: "🇲🇿",
            Myanmar: "🇲🇲",
            Namibia: "🇳🇦",
            Nepal: "🇳🇵",
            Netherlands: "🇳🇱",
            "New Zealand": "🇳🇿",
            Nicaragua: "🇳🇮",
            Niger: "🇳🇪",
            Nigeria: "🇳🇬",
            "North Korea": "🇰🇵",
            "North Macedonia": "🇲🇰",
            Norway: "🇳🇴",
            Oman: "🇴🇲",
            Pakistan: "🇵🇰",
            Palestine: "🇵🇸",
            Panama: "🇵🇦",
            "Papua New Guinea": "🇵🇬",
            Paraguay: "🇵🇾",
            Peru: "🇵🇪",
            Philippines: "🇵🇭",
            Poland: "🇵🇱",
            Portugal: "🇵🇹",
            Qatar: "🇶🇦",
            Romania: "🇷🇴",
            Russia: "🇷🇺",
            Rwanda: "🇷🇼",
            "Saudi Arabia": "🇸🇦",
            Senegal: "🇸🇳",
            Serbia: "🇷🇸",
            "Sierra Leone": "🇸🇱",
            Singapore: "🇸🇬",
            Slovakia: "🇸🇰",
            Slovenia: "🇸🇮",
            Somalia: "🇸🇴",
            "South Africa": "🇿🇦",
            "South Korea": "🇰🇷",
            "South Sudan": "🇸🇸",
            Spain: "🇪🇸",
            "Sri Lanka": "🇱🇰",
            Sudan: "🇸🇩",
            Suriname: "🇸🇷",
            Sweden: "🇸🇪",
            Switzerland: "🇨🇭",
            Syria: "🇸🇾",
            Taiwan: "🇹🇼",
            Tajikistan: "🇹🇯",
            Tanzania: "🇹🇿",
            Thailand: "🇹🇭",
            "Timor-Leste": "🇹🇱",
            Togo: "🇹🇬",
            Tonga: "🇹🇴",
            "Trinidad and Tobago": "🇹🇹",
            Tunisia: "🇹🇳",
            Turkey: "🇹🇷",
            Turkmenistan: "🇹🇲",
            Uganda: "🇺🇬",
            Ukraine: "🇺🇦",
            "United Arab Emirates": "🇦🇪",
            "United Kingdom": "🇬🇧",
            "United States": "🇺🇸",
            "United States of America": "🇺🇸",
            Uruguay: "🇺🇾",
            Uzbekistan: "🇺🇿",
            Vanuatu: "🇻🇺",
            Venezuela: "🇻🇪",
            Vietnam: "🇻🇳",
            Yemen: "🇾🇪",
            Zambia: "🇿🇲",
            Zimbabwe: "🇿🇼",
            Kosovo: "🇽🇰",
            "Western Sahara": "🇪🇭",
            Czechia: "🇨🇿",
            "Ivory Coast": "🇨🇮",
            "Puerto Rico": "🇵🇷",
            Samoa: "🇼🇸",
            "Solomon Islands": "🇸🇧",
            Seychelles: "🇸🇨",
            Bahamas: "🇧🇸",
            Antarctica: "🇦🇶"
        }, n = Pi(e);
        if (t[e]) return t[e];
        if (t[n]) return t[n];
        for (let [e, i] of Object.entries(t)) if (n.toLowerCase().includes(e.toLowerCase()) || e.toLowerCase().includes(n.toLowerCase())) return i;
        return "🌍";
    }
    function wo(e) {
        const t = fn.find(t => t.properties?.name === e);
        if (!t) {
            for (let t of fn) if (Hi(t.properties?.name) === e) return void wo(t.properties?.name);
            return;
        }
        const i = d3.geoCentroid(t);
        if (!i || isNaN(i[0])) return;
        const {width: a, height: r} = La(), [o, s] = Kn(i), l = a / 2 - 3 * o, c = r / 2 - 3 * s, d = d3.zoomIdentity.translate(l, c).scale(3);
        Yn.transition().duration(n() ? 0 : 800).ease(d3.easeCubicInOut).call(si.transform, d).on("end", () => {
            !function(e) {
                if (!e || !yn) return;
                yn.classed("highlighted-country", !1);
                const t = yn.filter(t => t === e);
                t.classed("highlighted-country", !0), vi && clearTimeout(vi);
                vi = setTimeout(() => {
                    yn.classed("highlighted-country", !1);
                }, 3e3);
            }(t);
        });
    }
    function Eo() {
        if (T.classList.remove("visible"), xi) {
            const e = document.querySelector(".zoom-controls");
            e && (e.style.opacity = ""), e && (e.style.pointerEvents = ""), o.style.opacity = "", 
            o.style.pointerEvents = "";
        }
        setTimeout(() => {
            T.classList.contains("visible") || (T.style.display = "none");
        }, 220), vn = null, bn = null, Kr(null), Mr(), void 0 !== $e && $e && ($e = null, 
        "function" == typeof drawEraScene && void 0 !== Pe && Pe && void 0 !== Fe && "eras" === Fe && drawEraScene(!0));
    }
    function ko(e) {
        wn = performance.now();
        const t = e.properties?.name || "", n = Pi(t);
        let i = da(t);
        const a = Hi(t);
        let r = i ? i.population_2026 : null, o = i ? i.area : null, s = Zi(t), l = i ? Ai(i, "capital") || i.capital_en : zi("unknown"), c = i ? Ai(i, "lang") || i.lang_en : zi("unknown"), d = zi("unknown");
        if (i && i.capital_coords) {
            let e;
            const a = timezoneOffsets[t] || timezoneOffsets[n];
            if (a) {
                const t = a.match(/UTC([+-])(\d+)(?::(\d+))?/);
                t && (e = parseInt(t[2]) + (t[3] ? parseInt(t[3]) / 60 : 0), "-" === t[1] && (e = -e));
            }
            void 0 === e && (e = Math.round(i.capital_coords[0] / 15));
            const r = new Date, o = r.getUTCMonth(), s = new Set([ "Albania", "Andorra", "Austria", "Belgium", "Bosnia and Herzegovina", "Bosnia and Herz.", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Czechia", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", "North Macedonia", "Norway", "Poland", "Portugal", "Romania", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "Ukraine", "United Kingdom", "Vatican City", "United States", "Canada", "Mexico", "Bahamas", "Bermuda", "Cuba", "Haiti", "Turks and Caicos", "Australia", "New Zealand", "Fiji", "Samoa", "Tonga", "Vanuatu", "New Caledonia", "Chile", "Paraguay", "Uruguay", "Brazil", "Bolivia", "Egypt", "Israel", "Jordan", "Lebanon", "Syria", "Iran", "Morocco", "Western Sahara", "W. Sahara", "Greenland", "Puerto Rico" ]), l = s.has(t) || s.has(n);
            let c = !1;
            if (l) {
                c = e >= -5 && e <= 4 ? o >= 2 && o <= 9 : o <= 2 || o >= 9;
            }
            const u = l && c ? e + 1 : e, p = u >= 0 ? "+" : "", m = ((r.getUTCHours() + u) % 24 + 24) % 24, f = String(r.getUTCMinutes()).padStart(2, "0");
            let h = "";
            if (l) {
                const t = e >= 0 ? "+" : "", n = e + 1 >= 0 ? "+" : "";
                h = c ? ` (${zi("dstActive")}، UTC${t}${e} ${zi("dstInactive")} -> UTC${n}${e + 1} ${zi("dstActive")})` : ` (${zi("dstInactive")}، UTC${n}${e + 1} ${zi("dstActive")} -> UTC${t}${e} ${zi("dstInactive")})`;
            }
            d = `${String(m).padStart(2, "0")}:${f} (UTC${p}${u}${h})`;
        }
        const u = Ca(t), p = function(e) {
            if (!e) return "Unknown";
            const t = Pi(e);
            return governmentByCountry[t] ? governmentByCountry[t] : governmentByCountry[e] ? governmentByCountry[e] : "Unknown";
        }(t), m = "ar" === Ht ? continentArabic[u] || u : "ru" === Ht ? continentRussian[u] || u : "uz" === Ht ? continentUzbek[u] || u : "es" === Ht && continentSpanish[u] || u, f = "ar" === Ht ? governmentArabic[p] || p : "ru" === Ht ? governmentRussian[p] || p : "uz" === Ht ? governmentUzbek[p] || p : "es" === Ht && governmentSpanish[p] || p;
        let h = `<h3>${bo(t)} ${a}</h3>`;
        h += `<p><strong>${zi("continent")}:</strong> ${m}</p>`, h += `<p><strong>${zi("government")}:</strong> ${f}</p>`, 
        h += `<p><strong>${zi("capital")}:</strong> ${l}</p>`, h += `<p><strong>${zi("areaTitle")}:</strong> ${o ? o.toLocaleString("en") : zi("unknown")} ${zi("km2")}</p>`, 
        h += `<p><strong>${zi("densityTitle")}:</strong> ${null !== s ? s + " " + zi("densityUnit") : zi("unknown")}</p>`, 
        h += `<p><strong>${zi("populationTitle")}:</strong> ${r ? "~" + r + " " + zi("million") : zi("unknown")}</p>`, 
        h += `<p><strong>${zi("languageTitle")}:</strong> ${c}</p>`, h += `<p><strong>🕒 ${zi("localTime")}:</strong> ${d}</p>`;
        const y = la(t);
        null !== y && (h += `<p><strong>💰 ${zi("tooltipGDP")}:</strong> $${y.toLocaleString("en-US")}</p>`);
        const g = ca(t);
        null !== g && (h += `<p><strong>📊 ${zi("tooltipHDI")}:</strong> ${g.toFixed(3)}</p>`);
        const v = timezoneOffsets[t] || timezoneOffsets[n];
        if (v && (h += `<p><strong>🕐 ${zi("timezone")}:</strong> ${v}</p>`), !window.historyIsActive || !window.historyIsActive()) {
            const e = window.warsForCountry ? window.warsForCountry(t) : [];
            e.length && (h += `<div class="panel-related-wars"><h4>⚔️ ${zi("histRelatedWars")}</h4>`, 
            e.forEach(e => {
                h += `<button class="btn panel-related-war-btn" data-hist-war-id="${e.id}" type="button">📜 ${zi("histSegWars")}: ${e.name} (${e.years})</button>`;
            }), h += "</div>");
        }
        h += `<br><button class="btn" id="compareBtn" title="${zi("compareWith")}">📊 ${zi("compareTitle")}</button>`, 
        P.innerHTML = h, T.style.display = "block", P.querySelectorAll("[data-hist-war-id]").forEach(e => {
            e.addEventListener("click", () => {
                const t = e.getAttribute("data-hist-war-id");
                Eo(), window.applySection && window.applySection("history"), window.focusHistoryWar && window.focusHistoryWar(t);
            });
        }), document.getElementById("compareBtn")?.addEventListener("click", () => {
            const e = P.querySelector(".compare-search-container");
            e && e.remove();
            const n = document.createElement("input");
            n.type = "text", n.placeholder = zi("searchPlaceholder"), n.style.cssText = "width:100%;margin:6px 0;padding:4px;border-radius:6px;border:1px solid #555;background:#2a2d35;color:#fff;";
            const i = document.createElement("div");
            i.className = "compare-search-container", i.style.marginTop = "8px", i.appendChild(n), 
            P.appendChild(i), n.focus();
            let a = !1;
            const r = (e, t) => {
                e.preventDefault(), e.stopPropagation();
                const n = t.getAttribute("data-name");
                if (!n || a) return;
                a = !0;
                const i = fn.find(e => e.properties?.name === n);
                i ? (bn = i, xo(vn, i)) : a = !1;
            };
            i.addEventListener("mousedown", function(e) {
                const t = e.target.closest(".suggest-item");
                t && r(e, t);
            }), i.addEventListener("touchend", function(e) {
                const t = e.target.closest(".suggest-item");
                t && r(e, t);
            }, {
                passive: !1
            }), n.addEventListener("input", function() {
                const e = this.value.trim().toLowerCase(), n = gi.filter(n => {
                    const i = Hi(n).toLowerCase();
                    return (n.toLowerCase().includes(e) || i.includes(e)) && n !== t;
                }).slice(0, xi ? 4 : 6);
                i.querySelectorAll(".suggest-item").forEach(e => e.remove()), n.forEach(e => {
                    const t = document.createElement("div");
                    t.className = "suggest-item", t.setAttribute("data-name", e), t.style.cssText = "padding:4px 8px;cursor:pointer;border-bottom:1px solid #333;display:flex;align-items:center;gap:6px;";
                    const n = bo(e), a = document.createElement("span");
                    a.textContent = n, t.appendChild(a), t.appendChild(document.createTextNode(" " + Hi(e))), 
                    i.appendChild(t);
                });
            });
        });
    }
    function xo(e, t) {
        wn = performance.now();
        const n = e.properties?.name || "", i = t.properties?.name || "", a = Hi(n), r = Hi(i), o = countryInfo[n] || countryInfo[Pi(n)], s = countryInfo[i] || countryInfo[Pi(i)], l = o ? o.area : null, c = s ? s.area : null, d = Zi(n), u = Zi(i), p = o ? o.population_2026 : null, m = s ? s.population_2026 : null, f = Qi(n), h = Qi(i), y = "ar" === Ht ? religionArabic[f] || f : "ru" === Ht ? religionRussian[f] || f : "uz" === Ht ? religionUzbek[f] || f : "es" === Ht && religionSpanish[f] || f, g = "ar" === Ht ? religionArabic[h] || h : "ru" === Ht ? religionRussian[h] || h : "uz" === Ht ? religionUzbek[h] || h : "es" === Ht && religionSpanish[h] || h, v = Math.max(l || 1, c || 1), b = Math.max(p || 1, m || 1), w = Math.max(d || 1, u || 1), E = Ti;
        let k = "<h3>📊 " + E(zi("compareTitle")) + " " + E(a) + " ↔ " + E(r) + "</h3>";
        k += '<table style="width:100%;font-size:0.85em;text-align:center;border-collapse:collapse;">', 
        k += '<tr><th style="padding:4px;"></th><th style="padding:4px;">' + E(a) + '</th><th style="padding:4px;">' + E(r) + "</th></tr>";
        const x = l ? l / v * 100 : 0, _ = c ? c / v * 100 : 0;
        k += '<tr><td style="padding:4px;">' + E(zi("areaTitle")) + '</td><td style="padding:4px;">' + (l ? E(l.toLocaleString("en")) + " km²" : "?") + '<br><span class="compare-bar" style="width:' + x + '%;background:#42a5f5;"></span></td><td style="padding:4px;">' + (c ? E(c.toLocaleString("en")) + " km²" : "?") + '<br><span class="compare-bar" style="width:' + _ + '%;background:#42a5f5;"></span></td></tr>';
        const C = d ? d / w * 100 : 0, L = u ? u / w * 100 : 0;
        k += '<tr><td style="padding:4px;">' + E(zi("densityTitle")) + '</td><td style="padding:4px;">' + (d ? E("" + d) : "?") + " " + E(zi("densityUnit")) + '<br><span class="compare-bar" style="width:' + C + '%;background:#ffa726;"></span></td><td style="padding:4px;">' + (u ? E("" + u) : "?") + " " + E(zi("densityUnit")) + '<br><span class="compare-bar" style="width:' + L + '%;background:#ffa726;"></span></td></tr>';
        const B = p ? p / b * 100 : 0, S = m ? m / b * 100 : 0;
        k += '<tr><td style="padding:4px;">' + E(zi("populationTitle")) + '</td><td style="padding:4px;">' + (p ? "~" + p + " " + E(zi("million")) : "?") + '<br><span class="compare-bar" style="width:' + B + '%;background:#66bb6a;"></span></td><td style="padding:4px;">' + (m ? "~" + m + " " + E(zi("million")) : "?") + '<br><span class="compare-bar" style="width:' + S + '%;background:#66bb6a;"></span></td></tr>', 
        k += '<tr><td style="padding:4px;">' + E(zi("tooltipReligion")) + '</td><td style="padding:4px;">' + E(y) + '</td><td style="padding:4px;">' + E(g) + "</td></tr>";
        const I = la(n), z = la(i);
        k += '<tr><td style="padding:4px;">💰 ' + E(zi("tooltipGDP")) + '</td><td style="padding:4px;">' + (null !== I ? "$" + E(I.toLocaleString("en-US")) : "?") + '</td><td style="padding:4px;">' + (null !== z ? "$" + E(z.toLocaleString("en-US")) : "?") + "</td></tr>";
        const A = ca(n), M = ca(i);
        k += '<tr><td style="padding:4px;">📊 ' + E(zi("tooltipHDI")) + '</td><td style="padding:4px;">' + (null !== A ? E(A.toFixed(3)) : "?") + '</td><td style="padding:4px;">' + (null !== M ? E(M.toFixed(3)) : "?") + "</td></tr>";
        const q = timezoneOffsets[n] || timezoneOffsets[Pi(n)] || "?", O = timezoneOffsets[i] || timezoneOffsets[Pi(i)] || "?";
        k += '<tr><td style="padding:4px;">🕐 ' + E(zi("timezone")) + '</td><td style="padding:4px;">' + E(q) + '</td><td style="padding:4px;">' + E(O) + "</td></tr>", 
        k += "</table>", k += '<br><button class="btn" id="closeCompareBtn">' + E(zi("closeCompare")) + "</button>", 
        P.innerHTML = k, T.style.display = "block", requestAnimationFrame(() => requestAnimationFrame(() => T.classList.add("visible"))), 
        document.getElementById("closeCompareBtn")?.addEventListener("click", () => {
            bn = null, vn && (ko(vn), requestAnimationFrame(() => requestAnimationFrame(() => T.classList.add("visible"))));
        });
    }
    function _o(e) {
        return e ? String(e).replace(/\s*\([^)]*\)/g, "").replace(/\s*\/.*$/, "").replace(/\s{2,}/g, " ").trim() : "";
    }
    function Co(e) {
        if (rn) {
            var t = e || li && li.k || 1, n = xi ? 11 : 14, i = xi ? 16 : 22, a = Math.max(n, Math.min(i, n * Math.pow(t, .35))) / t + "px";
            rn.selectAll("text.hist-era-label, text.hist-war-label").attr("font-size", a);
        }
    }
    window.getColorMode = function() {
        return ae;
    }, window.setMode = Vr, window.setLanguage = fo, window.getLang = function() {
        return Ht;
    }, window.locField = Ai, window.cleanHistoricalName = _o, window.updateHistoryLabels = Co;
    var Lo = null;
    function Bo(e) {
        var t = document.getElementById("histWaypointPopup");
        if (t && "none" !== t.style.display && e && Yn) {
            var n = ao()(e);
            if (n && !isNaN(n[0])) {
                var i = Yn.node(), a = i ? i.getBoundingClientRect() : {
                    left: 0,
                    top: 0,
                    width: window.innerWidth,
                    height: window.innerHeight
                }, r = li && li.k || 1, o = li && li.x || 0, s = li && li.y || 0, l = a.left + o + n[0] * r, c = a.top + s + n[1] * r, d = t.offsetWidth || 340, u = t.offsetHeight || 240, p = l - d / 2, m = c - u - 20;
                m < 70 && (m = c + 24), p = Math.max(16, Math.min(window.innerWidth - d - 16, p)), 
                m = Math.max(65, Math.min(window.innerHeight - u - 85, m)), t.style.left = p + "px", 
                t.style.top = m + "px";
            }
        }
    }
    function So(e) {
        var t = e || li && li.k || 1, n = window.innerWidth <= 768;
        if (cn) {
            var i = n ? 11.5 : 13.5, a = n ? 13.5 : 15.5, r = Math.max(i, Math.min(a, i * Math.pow(t, .15))), o = (n ? 4.5 : 5.5) / t, s = r / t, l = ((n ? 5.5 : 6.5) + .7 * r) / t, c = 1.4 / t;
            cn.selectAll("circle.hist-capital-circle").attr("r", o).attr("stroke-width", c), 
            cn.selectAll("text.hist-capital-label").each(function() {
                var e = d3.select(this), t = parseFloat(e.attr("data-cy") || 0);
                t && e.attr("y", t - l), e.attr("font-size", s + "px");
            });
        }
        if (dn) {
            var d = n ? 11.5 : 13.5, u = n ? 13.5 : 15.5, p = Math.max(d, Math.min(u, d * Math.pow(t, .15))), m = (n ? 5 : 6) / t, f = p / t, h = (n ? 7.5 : 9) / t, y = ((n ? 6 : 7) + .7 * p) / t, g = 3.5 / t, v = 1.4 / t;
            dn.selectAll("circle.hist-battle-circle").attr("r", m).attr("stroke-width", v), 
            dn.selectAll("text.hist-battle-icon").each(function() {
                var e = d3.select(this), t = parseFloat(e.attr("data-cy") || 0);
                t && e.attr("y", t + g), e.attr("font-size", h + "px");
            }), dn.selectAll("text.hist-battle-label").each(function() {
                var e = d3.select(this), t = parseFloat(e.attr("data-cy") || 0);
                t && e.attr("y", t - y), e.attr("font-size", f + "px");
            });
        }
        if (un) {
            var b = n ? 11.5 : 13.5, w = n ? 13.5 : 15.5, E = Math.max(b, Math.min(w, b * Math.pow(t, .15))), k = (n ? 5 : 6) / t, x = E / t, _ = (n ? 7.5 : 9) / t, C = ((n ? 6 : 7) + .7 * E) / t, L = 3.5 / t, B = 1.4 / t;
            un.selectAll("circle.hist-wonder-circle").attr("r", k).attr("stroke-width", B), 
            un.selectAll("text.hist-wonder-icon").each(function() {
                var e = d3.select(this), t = parseFloat(e.attr("data-cy") || 0);
                t && e.attr("y", t + L), e.attr("font-size", _ + "px");
            }), un.selectAll("text.hist-wonder-label").each(function() {
                var e = d3.select(this), t = parseFloat(e.attr("data-cy") || 0);
                t && e.attr("y", t - C), e.attr("font-size", x + "px");
            });
        }
        if (pn) {
            var S = n ? 11.5 : 13.5, I = n ? 13.5 : 15.5, z = Math.max(S, Math.min(I, S * Math.pow(t, .15))), A = (n ? 5 : 6) / t, M = (n ? 7.5 : 9) / t, T = z / t, P = (n ? 8 : 9.5) / t, q = ((n ? 6.5 : 7.5) + .7 * z) / t, O = 3 / t, R = 1.4 / t;
            pn.selectAll("circle.hist-sacred-site-ring").attr("r", M).attr("stroke-width", .8 / t).attr("stroke-dasharray", 2 / t + "," + 2 / t), 
            pn.selectAll("circle.hist-sacred-site-circle").attr("r", A).attr("stroke-width", R), 
            pn.selectAll("text.hist-sacred-site-icon").each(function() {
                var e = d3.select(this), t = parseFloat(e.attr("data-cy") || 0);
                t && e.attr("y", t + O), e.attr("font-size", P + "px");
            }), pn.selectAll("text.hist-sacred-site-label").each(function() {
                var e = d3.select(this), t = parseFloat(e.attr("data-cy") || 0), n = e.attr("data-dir") || "above";
                if (t) {
                    var i = "below" === n ? t + q + .75 * T : t - q;
                    e.attr("y", i);
                }
                e.attr("font-size", T + "px");
            });
        }
        if (mn) {
            var N = (n ? 4 : 5) / t, D = (n ? 7 : 8.5) / t, F = Math.max(9, Math.min(13, (n ? 10 : 12) / Math.pow(t, .8))), H = ((n ? 7 : 9) + .7 * F) / t;
            mn.selectAll("circle.hist-pass-ring").attr("r", D).attr("stroke-width", .8 / t).attr("stroke-dasharray", 2 / t + "," + 2 / t), 
            mn.selectAll("circle.hist-pass-circle").attr("r", N).attr("stroke-width", 1.2 / t), 
            mn.selectAll("text.hist-pass-label").each(function() {
                var e = d3.select(this), n = parseFloat(e.attr("data-cy") || 0);
                n && e.attr("y", n - H), e.attr("font-size", F / t + "px");
            });
        }
        if (ln) {
            var j = n ? 11 : 13, W = n ? 13 : 15, U = Math.max(j, Math.min(W, j * Math.pow(t, .15))), $ = U / t;
            ln.selectAll("circle.hist-wp-circle").each(function() {
                var e = d3.select(this), i = e.classed("active-wp"), a = (i ? n ? 6.5 : 8 : n ? 4 : 5) / t;
                e.attr("r", a).attr("stroke-width", (i ? 2.5 : 1.5) / t);
            }), ln.selectAll("text.hist-wp-label").each(function() {
                var e = d3.select(this), n = parseFloat(e.attr("data-cy") || 0), i = ((e.classed("active-wp") ? 8.5 : 6) + .7 * U) / t;
                n && e.attr("y", n - i), e.attr("font-size", $ + "px");
            });
        }
        if (sn && ke) {
            var K = n ? 11.5 : 13.5, G = n ? 13.5 : 15.5, Y = Math.max(K, Math.min(G, K * Math.pow(t, .15))) / t, V = 6 / t, Q = (n ? 3 : 4) / t, X = 1 / t;
            sn.selectAll("circle.hist-route-node").attr("r", Q).attr("stroke-width", X), sn.selectAll("text.hist-route-label").each(function() {
                var e = d3.select(this), t = parseFloat(e.attr("data-cy") || 0);
                t && e.attr("y", t - V), e.attr("font-size", Y + "px");
            });
        }
        Lo && Bo(Lo);
    }
    function Io(e) {
        window.currentTransform = e, Vn.attr("transform", e.toString());
    }
    function zo(e, t, n, i, a, r, o) {
        if (e && e.node()) {
            for (var s = t.nodes(), l = e.node().querySelectorAll("text"), c = Math.max(.2 / n, i), d = a, u = r / n, p = o / n, m = 0; m < s.length; m++) {
                var f = m % 2 == 0;
                s[m].setAttribute("r", f ? 1.5 * c : c), f || s[m].setAttribute("stroke-width", 1.2 / n);
            }
            for (m = 0; m < l.length; m++) {
                var h = l[m];
                h.setAttribute("font-size", d + "px");
                var y = s[2 * m + 1];
                y && (h.setAttribute("x", parseFloat(y.getAttribute("cx")) + c + u), h.setAttribute("y", parseFloat(y.getAttribute("cy")) + p));
            }
        }
    }
    function Ao() {
        const e = Math.max(.4, li.k);
        if (Co(e), So(e), he && Gt) {
            const t = (xi ? 5.5 : 7) / e, n = (xi ? 12 : 14) / e;
            zo(Gt, Gt.selectAll("circle"), e, t, n, 5, 4.5);
        }
        if (ye && Yt) {
            const t = (xi ? 5.5 : 7) / e, n = (xi ? 12 : 14) / e;
            zo(Yt, Yt.selectAll("circle"), e, t, n, 5, 4.5);
        }
    }
    function Mo() {
        const {width: e, height: t} = La();
        let n = !1, i = null;
        si = d3.zoom().scaleExtent([ .5, 24 ]).translateExtent([ [ 2 * -e, 2 * -t ], [ 3 * e, 3 * t ] ]).clickDistance(8).on("zoom", function(e) {
            yi || (yi = !0, Vn.classed("zooming-active", !0)), li = e.transform, Io(li), So(li && li.k), 
            Lo && Bo(Lo), Ao(), go(), Ls(), n || (n = !0, requestAnimationFrame(function() {
                n = !1, Tr();
            })), br();
        }).on("end", function() {
            clearTimeout(i), i = setTimeout(function() {
                yi = !1, Vn.classed("zooming-active", !1), Ao(), function() {
                    if (Co(li && li.k), So(li && li.k), !bi) return;
                    if (!(void 0 !== Pe && Pe || void 0 !== Ke && "history" === Ke ? Dn && Fn : oe)) return void bi.style("opacity", 0);
                    const e = Pr(), t = qr();
                    bi.each(function(n) {
                        const i = d3.select(this), a = i.datum();
                        if (!a) return;
                        const r = a.area;
                        i.attr("font-size", t + "px"), e < 0 ? i.style("opacity", 1) : r < e ? i.style("opacity", 0) : i.style("opacity", 1);
                        const o = Hi(a.name);
                        i.text() !== o && i.text(o);
                    });
                }(), Tr(), mr = !0, br();
                var e = void 0 !== Pe && Pe || void 0 !== Ke && "history" === Ke, t = [ [ !e && (le || Ee), function() {
                    Ma(!0);
                } ], [ !e && Ce, function() {
                    nr(!0);
                } ], [ !e && _e, function() {
                    tr(!0);
                } ], [ e ? "terrain" === ae || ce : ce || "terrain" === ae, function() {
                    Fa(), e || ar();
                } ], [ !e && de, function() {
                    Ea();
                } ], [ !e && xe, function() {
                    Ja(!0);
                } ], [ !e && ge, function() {
                    $a(!0);
                } ], [ !e && ve, function() {
                    Ka(!0);
                } ], [ !e && be, function() {
                    Va(!0);
                } ], [ !e && we, function() {
                    Xa(!0);
                } ], [ !e && me, function() {
                    Na();
                } ], [ !e && he, function() {
                    ja();
                } ], [ !e && ye, function() {
                    Wa();
                } ], [ e && ke, function() {
                    qa(!0);
                } ], [ e && Nn, function() {
                    Hc();
                } ], [ e && Hn, function() {
                    window.drawHistPhysicalFeatures && Gc(jn, !0);
                } ], [ e && Dn && Fn, function() {
                    Or(fn);
                } ] ].filter(function(e) {
                    return e[0];
                }), n = 0;
                !function e() {
                    n >= t.length || (t[n][1](), n++, requestAnimationFrame(e));
                }();
            }, 200);
        }), window.zoomBehavior = si, Yn.call(si), Yn.on("dblclick.zoom", null);
    }
    function To() {
        lt = [], ct && ct.selectAll("*").remove(), measureResultLabel.style.display = "none";
    }
    function Po() {
        st = !st, document.getElementById("measureToolBtn").classList.toggle("toggle-on", st), 
        To(), document.body.classList.toggle("measure-active", st), st && dt && hs();
    }
    function qo() {
        Bt = !Bt, document.body.classList.toggle("presentation-mode", Bt), document.getElementById("presentationExitBtn").style.display = Bt ? "" : "none", 
        Bt ? N.classList.contains("active") && (N.classList.remove("active"), R.classList.remove("active")) : (st && Po(), 
        dt && hs());
    }
    async function Oo(e, t, n, i) {
        var a = e.value.trim(), r = t.value.trim().toUpperCase();
        if (a) {
            if (r || (r = function() {
                for (var e = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", t = "", n = 0; n < 6; n++) t += e.charAt(Math.floor(32 * Math.random()));
                return t;
            }(), t.value = r), "function" == typeof window.firebaseCreateSession) {
                i.disabled = !0;
                var o = await window.firebaseCreateSession(r, {
                    createdAt: Date.now()
                });
                if (i.disabled = !1, !o) return void alert(zi("sessionCreateFailed"));
            }
            It = r, zt = a, n.textContent = zi("quizSessionCreated") + ": " + r, n.style.display = "", 
            i.style.display = "none", No();
        } else e.focus();
    }
    function Ro(e, t) {
        var n = e && e.value ? e.value.trim() : "", i = t && t.value ? t.value.trim().toUpperCase() : "";
        n && i && (It = i, zt = n);
    }
    function No() {
        var e = document.getElementById("quizViewResultsBtn");
        if (e) {
            It ? (e.style.display = "", e.textContent = zi("quizViewResults") + " (" + It + ")") : e.style.display = "none";
        }
    }
    async function Do(e, t, n, i) {
        if (It && zt) {
            var a = e.map(function(e) {
                return {
                    questionId: void 0 !== e.questionId ? e.questionId : e.questionIndex,
                    layerType: e.layerType || null,
                    promptText: e.promptText || null,
                    correct: e.correct,
                    status: e.status || (!0 === e.correct ? "correct" : !1 === e.correct ? "incorrect" : "skipped")
                };
            });
            try {
                var r = "lepidos_quiz_submissions_" + It, o = JSON.parse(localStorage.getItem(r) || "[]");
                o.push({
                    studentName: zt,
                    score: t,
                    totalQuestions: n,
                    total: n,
                    timeTaken: i,
                    submittedAt: (new Date).toISOString(),
                    answers: a
                }), localStorage.setItem(r, JSON.stringify(o));
            } catch (e) {
                console.warn("Local quiz submission storage fallback failed:", e);
            }
            if ("function" == typeof window.firebaseSaveQuizResult) try {
                await window.firebaseSaveQuizResult(It, zt, t, n, i, a);
            } catch (e) {
                console.warn("Firebase submission failed, maintained in local fallback:", e);
            }
        }
    }
    async function Fo(e) {
        var t = [];
        if ("function" == typeof window.firebaseGetResultsForSession) try {
            t = await window.firebaseGetResultsForSession(e);
        } catch (e) {
            console.warn("Could not fetch class results from Firebase:", e);
        }
        try {
            var n = JSON.parse(localStorage.getItem("lepidos_quiz_submissions_" + e) || "[]");
            if (n && n.length > 0) {
                var i = new Set(t.map(function(e) {
                    return e.studentName;
                }));
                n.forEach(function(e) {
                    i.has(e.studentName) || t.push(e);
                });
            }
        } catch (e) {
            console.warn("Failed reading local submissions:", e);
        }
        var a = document.getElementById("quizResultsOverlay"), r = document.getElementById("quizResultsBody");
        document.getElementById("quizResultsSessionCode").innerHTML = zi("quizSessionCode") + ": <strong>" + Ti(e) + "</strong>", 
        document.getElementById("quizResultsTitle").textContent = zi("quizViewResults"), 
        document.getElementById("quizResultsSummaryTab").textContent = zi("quizResultsSummary"), 
        document.getElementById("quizResultsDetailTab").textContent = zi("quizResultsDetail"), 
        document.getElementById("quizResultsCloseBtn").textContent = zi("quizResultsClose"), 
        0 === t.length ? r.innerHTML = '<div class="quiz-results-empty">' + zi("quizResultsEmpty") + "</div>" : Ho(r, t), 
        a.style.display = "", document.getElementById("quizResultsSummaryTab").onclick = function() {
            this.classList.add("active"), document.getElementById("quizResultsDetailTab").classList.remove("active"), 
            Ho(r, t);
        }, document.getElementById("quizResultsDetailTab").onclick = function() {
            this.classList.add("active"), document.getElementById("quizResultsSummaryTab").classList.remove("active"), 
            function(e, t) {
                e.innerHTML = "", t.forEach(function(t) {
                    var n = document.createElement("div");
                    n.className = "quiz-results-detail-card";
                    var i = t.total > 0 ? t.score + "/" + t.total + " (" + Math.round(t.score / t.total * 100) + "%)" : "—";
                    if (n.innerHTML = '<div class="quiz-results-detail-name">' + jo(t.studentName) + '</div><div class="quiz-results-detail-meta">' + i + (t.timeTaken ? " | " + function(e) {
                        var t = Math.floor(e / 60), n = e % 60;
                        return t + ":" + (n < 10 ? "0" : "") + n;
                    }(t.timeTaken) : "") + "</div>", t.answers && t.answers.length > 0) {
                        var a = document.createElement("div");
                        a.className = "quiz-results-detail-answers", t.answers.forEach(function(e) {
                            var t = !0 === e.correct ? "correct" : !1 === e.correct ? "incorrect" : "skipped", n = !0 === e.correct ? "✓" : !1 === e.correct ? "✗" : "—", i = document.createElement("div");
                            i.className = "quiz-results-detail-answer " + t, i.innerHTML = '<span class="quiz-results-detail-status">' + n + '</span><span class="quiz-results-detail-prompt">' + jo(e.promptText || e.layerType || "Question") + "</span>", 
                            a.appendChild(i);
                        }), n.appendChild(a);
                    }
                    e.appendChild(n);
                });
            }(r, t);
        };
    }
    function Ho(e, t) {
        var n = t.length, i = 0, a = '<table class="quiz-results-table"><thead><tr>';
        if (a += "<th>" + zi("quizStudentName") + "</th>", a += "<th>" + zi("quizFinalScore") + "</th>", 
        a += "</tr></thead><tbody>", t.forEach(function(e) {
            var t = e.total > 0 ? Math.round(e.score / e.total * 100) : 0;
            i += t, a += "<tr><td>" + jo(e.studentName) + "</td>", a += '<td class="quiz-results-score">' + e.score + "/" + e.total + " (" + t + "%)</td></tr>";
        }), n > 1) {
            var r = Math.round(i / n);
            a += '<tr style="font-weight:700;border-top:2px solid var(--border)"><td>' + zi("quizResultsAverage") + "</td>", 
            a += '<td class="quiz-results-score">' + r + "%</td></tr>";
        }
        a += "</tbody></table>", e.innerHTML = a;
    }
    function jo(e) {
        return e ? e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;") : "";
    }
    function Wo() {
        ct || (ct = Vn.append("g").attr("class", "measure-layer")), ct.selectAll("*").remove();
        var e, t, n, i, a, r, o, s, l = ao();
        if (lt.forEach(function(e) {
            var t = l(e);
            t && !isNaN(t[0]) && ct.append("circle").attr("cx", t[0]).attr("cy", t[1]).attr("r", 5).attr("fill", "var(--brand-accent, #14B8A6)").attr("stroke", "#fff").attr("stroke-width", 1.5);
        }), 2 === lt.length) {
            var c = l(lt[0]), d = l(lt[1]);
            if (c && d && !isNaN(c[0]) && !isNaN(d[0])) {
                ct.insert("line", ":first-child").attr("x1", c[0]).attr("y1", c[1]).attr("x2", d[0]).attr("y2", d[1]).attr("stroke", "var(--brand-accent, #14B8A6)").attr("stroke-width", 2).attr("stroke-dasharray", "6,4");
                var u = (e = lt[0], t = lt[1], i = (n = function(e) {
                    return e * Math.PI / 180;
                })(t[1] - e[1]), a = n(t[0] - e[0]), r = n(e[1]), o = n(t[1]), s = Math.sin(i / 2) * Math.sin(i / 2) + Math.sin(a / 2) * Math.sin(a / 2) * Math.cos(r) * Math.cos(o), 
                2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s)) * 6371), p = (c[0] + d[0]) / 2, m = (c[1] + d[1]) / 2, f = li.apply([ p, m ]), h = ki();
                measureResultLabel.textContent = Math.round(u).toLocaleString() + " " + zi("measureKmUnit"), 
                measureResultLabel.style.left = h.left + f[0] + "px", measureResultLabel.style.top = h.top + f[1] + "px", 
                measureResultLabel.style.display = "";
            }
        }
    }
    function Uo(e, t) {
        e && e.defaultPrevented || st || dt || (window.historyIsActive && window.historyIsActive() ? window.openHistoryPanel(t) : e.shiftKey && vn ? (bn = t, 
        xo(vn, bn)) : (vn = t, bn = null, function(e) {
            if (Mr(), ko(e), xi) {
                const e = document.querySelector(".zoom-controls");
                e && (e.style.opacity = "0"), e && (e.style.pointerEvents = "none"), o.style.opacity = "0", 
                o.style.pointerEvents = "none";
            }
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    T.classList.add("visible");
                });
            });
        }(t), Kr(t)));
    }
    window.positionWaypointPopup = Bo, window.updateHistoricalLandmarkLabels = So;
    const $o = "lepidosAnnotations";
    function Ko() {
        try {
            if (Ko.done) return;
            Ko.done = !0;
            var e = localStorage.getItem($o);
            if (!e) return;
            var t = JSON.parse(e);
            if (!Array.isArray(t)) return;
            var n = t.filter(function(e) {
                if (!e || "region" !== e.type) return !0;
                var t = String(e.label || "").toLowerCase();
                if (-1 !== t.indexOf("north pole") || -1 !== t.indexOf("القطب الشمالي") || -1 !== t.indexOf("северный полюс") || -1 !== t.indexOf("shimoliy qutb") || -1 !== t.indexOf("polo norte")) return !1;
                if (Array.isArray(e.coords) && e.coords.length > 0 && e.coords.length <= 14) {
                    for (var n = 0, i = 90, a = 0; a < e.coords.length; a++) n += e.coords[a][1], e.coords[a][1] < i && (i = e.coords[a][1]);
                    if (n / e.coords.length > 86 && i > 82) return !1;
                }
                return !0;
            });
            n.length !== t.length && localStorage.setItem($o, JSON.stringify(n));
        } catch (e) {}
    }
    function Go(e) {
        c && (c.textContent = e, c.classList.add("show"), setTimeout(function() {
            c.classList.remove("show");
        }, 2e3));
    }
    function Yo() {
        Ko();
        try {
            var e = localStorage.getItem($o), t = e ? JSON.parse(e) : [];
            return Array.isArray(t) ? t : [];
        } catch (e) {
            return [];
        }
    }
    function Vo() {
        try {
            localStorage.setItem($o, JSON.stringify(yt));
        } catch (e) {}
    }
    function Qo(e, t) {
        var n = (t = t || ao()).invert(e);
        if (n && !isNaN(n[0]) && !isNaN(n[1])) return n;
        for (var i = [ [ 2, 0 ], [ -2, 0 ], [ 0, 2 ], [ 0, -2 ], [ 2, 2 ], [ -2, 2 ], [ 2, -2 ], [ -2, -2 ], [ 4, 0 ], [ 0, 4 ] ], a = 0; a < i.length; a++) {
            var r = t.invert([ e[0] + i[a][0], e[1] + i[a][1] ]);
            if (r && !isNaN(r[0]) && !isNaN(r[1])) return r;
        }
        return n;
    }
    function Xo(e, t) {
        var n = ki(), i = Qo(li.invert([ e - n.left, t - n.top ]));
        return !i || isNaN(i[0]) || isNaN(i[1]) ? null : [ i[0], i[1] ];
    }
    function Jo(e, t, n) {
        var i = function(e) {
            for (var i = [], a = [], r = null, o = null, s = 0; s < e.length; s++) {
                var l = t(e[s]);
                l && !isNaN(l[0]) ? (o && Math.sqrt(Math.pow(l[0] - r[0], 2) + Math.pow(l[1] - r[1], 2)) > n ? (a.length >= 2 && i.push(a), 
                a = [ e[s] ]) : a.push(e[s]), o = e[s], r = l) : (a.length >= 2 && i.push(a), a = [], 
                o = null, r = null);
            }
            return a.length >= 2 && i.push(a), i;
        }, a = [], r = !1;
        if ("Polygon" === e.type) return function(e) {
            for (var t = 0; t < e.length; t++) {
                var n = i(e[t]);
                if (n.length > 1) {
                    r = !0;
                    for (var o = 0; o < n.length; o++) a.push({
                        type: "LineString",
                        coordinates: n[o]
                    });
                } else a.push({
                    type: "LineString",
                    coordinates: e[t]
                });
            }
        }(e.coordinates), r ? a : e;
        if ("MultiPolygon" === e.type) {
            for (var o = [], s = 0; s < e.coordinates.length; s++) {
                for (var l = e.coordinates[s], c = [], d = !1, u = 0; u < l.length; u++) {
                    var p = i(l[u]);
                    if (p.length > 1) {
                        d = !0;
                        for (var m = 0; m < p.length; m++) c.push({
                            type: "LineString",
                            coordinates: p[m]
                        });
                    } else c.push({
                        type: "LineString",
                        coordinates: l[u]
                    });
                }
                if (d) for (var f = 0; f < c.length; f++) o.push(c[f]); else o.push({
                    type: "MultiPolygon",
                    coordinates: [ l ]
                });
            }
            return e.coordinates.length === o.length && o.length && "MultiPolygon" === o[0].type ? e : o;
        }
        if ("LineString" === e.type) {
            var h = i(e.coordinates);
            if (h.length > 1) {
                for (var y = [], g = 0; g < h.length; g++) y.push({
                    type: "LineString",
                    coordinates: h[g]
                });
                return y;
            }
            return e;
        }
        if ("MultiLineString" === e.type) {
            for (var v = [], b = !1, w = 0; w < e.coordinates.length; w++) {
                var E = i(e.coordinates[w]);
                if (E.length > 1) {
                    b = !0;
                    for (var k = 0; k < E.length; k++) v.push({
                        type: "LineString",
                        coordinates: E[k]
                    });
                } else v.push({
                    type: "LineString",
                    coordinates: e.coordinates[w]
                });
            }
            return b ? v : e;
        }
        return e;
    }
    function Zo(e, t) {
        var n = [], i = [];
        return e.forEach(function(e) {
            var a = t(e);
            !a || isNaN(a[0]) ? (i.length >= 2 && n.push(i), i = []) : i.push(a);
        }), i.length >= 2 && n.push(i), n;
    }
    function es(e) {
        return "pin" === e.type ? zi("annotationPin") : "region" === e.type ? zi("annotationRegion") : "arrow" === e.type ? zi("annotationArrow") : zi("annotationDraw");
    }
    function ts(e) {
        if ("small" === e) return 8;
        if ("large" === e) return 16;
        if ("medium" === e || null == e || "" === e) return 10;
        var t = parseInt(String(e), 10);
        return isNaN(t) ? 10 : t;
    }
    function ns() {
        ht || (ht = Vn.append("g").attr("class", "annotation-layer")), ht.selectAll("*").remove();
        var e = ao(), t = null, n = Math.min(4, Math.max(1, li.k));
        yt.forEach(function(i) {
            if (!i.hidden) {
                var a = i.color || "#eab308", r = function(e) {
                    return ts(e && e.size) / 10;
                }(i);
                if ("pin" === i.type) {
                    var o = e(i.coords);
                    if (!o || isNaN(o[0])) return;
                    ht.append("circle").attr("class", "annotation-pin-circle").attr("cx", o[0]).attr("cy", o[1]).attr("r", 6 * r).style("fill", a).style("stroke-width", 1.5 * r * n), 
                    i.label && ht.append("text").attr("class", "annotation-pin-label").attr("x", o[0] + 9).attr("y", o[1] + 4).text(i.label);
                } else if ("region" === i.type && Array.isArray(i.coords) && i.coords.length >= 3) {
                    var s = i.coords.slice();
                    !s.length || s[0][0] === s[s.length - 1][0] && s[0][1] === s[s.length - 1][1] || s.push(s[0]);
                    var l = .55 * Math.min(ki().width, ki().height), c = {
                        type: "Polygon",
                        coordinates: [ s ]
                    }, d = Jo(c, e, l), u = Array.isArray(d) ? d : [ c ], p = !1;
                    if (u.forEach(function(t) {
                        var i = ("Polygon" === t.type ? t.coordinates[0] : t.coordinates).map(function(t) {
                            return e(t);
                        }).filter(function(e) {
                            return e && !isNaN(e[0]);
                        });
                        if (!(i.length < 3)) {
                            var o = "M" + i.map(function(e) {
                                return e[0] + "," + e[1];
                            }).join("L") + "Z";
                            ht.append("path").attr("class", "annotation-region-poly").attr("d", o).style("stroke", a).style("fill", a + "26").style("stroke-width", 2 * r * n), 
                            p = !0;
                        }
                    }), p && i.label) {
                        var m = i.coords.map(function(t) {
                            return e(t);
                        }).filter(function(e) {
                            return e && !isNaN(e[0]);
                        });
                        if (m.length) {
                            var f = 0, h = 0;
                            m.forEach(function(e) {
                                f += e[0], h += e[1];
                            }), f /= m.length, h /= m.length, ht.append("text").attr("class", "annotation-pin-label").attr("x", f).attr("y", h).attr("text-anchor", "middle").text(i.label);
                        }
                    }
                } else if ("freehand" === i.type && Array.isArray(i.coords) && i.coords.length >= 2) {
                    if (!(t = Zo(i.coords, e)).length) return;
                    var y = null;
                    t.forEach(function(e) {
                        var t = "M" + e.map(function(e) {
                            return e[0] + "," + e[1];
                        }).join("L");
                        ht.append("path").attr("class", "annotation-freehand-path").attr("d", t).style("stroke", a).style("stroke-width", 2.5 * r * n), 
                        !y && e.length && (y = e[0]);
                    }), i.label && y && ht.append("text").attr("class", "annotation-pin-label").attr("x", y[0] + 9).attr("y", y[1] + 4).text(i.label);
                } else if ("arrow" === i.type && Array.isArray(i.coords) && i.coords.length >= 2) {
                    if (!(t = Zo(i.coords, e)).length) return;
                    var g = i.coords[i.coords.length - 1], v = null;
                    t.forEach(function(e) {
                        var t = "M" + e.map(function(e) {
                            return e[0] + "," + e[1];
                        }).join("L");
                        ht.append("path").attr("class", "annotation-arrow-line").attr("d", t).style("stroke", a).style("stroke-width", 2.5 * r * n), 
                        e.length > 1 && (v = e[0]);
                    });
                    var b = e(g);
                    if (b && !isNaN(b[0])) {
                        var w = null, E = null;
                        t.forEach(function(e) {
                            if (!(e.length < 2)) {
                                var t = e[e.length - 1];
                                Math.abs(t[0] - b[0]) < .5 && Math.abs(t[1] - b[1]) < .5 && (w = t, E = e[e.length - 2]);
                            }
                        }), w || (w = b, E = t[t.length - 1][t[t.length - 1].length - 2]);
                        var k = Math.atan2(w[1] - E[1], w[0] - E[0]), x = 13 * r, _ = 6 * r, C = w[0], L = w[1], B = C - x * Math.cos(k), S = L - x * Math.sin(k), I = -Math.sin(k), z = Math.cos(k);
                        ht.append("path").attr("class", "annotation-arrow-head").attr("d", "M" + C + "," + L + "L" + (B + _ * I) + "," + (S + _ * z) + "L" + (B - _ * I) + "," + (S - _ * z) + "Z").style("fill", a), 
                        i.label && v && ht.append("text").attr("class", "annotation-pin-label").attr("x", v[0] + 9).attr("y", v[1] + 4).text(i.label);
                    }
                }
            }
        });
    }
    function is() {
        ht && ht.selectAll("*").remove();
    }
    function as() {
        ht || (ht = Vn.append("g").attr("class", "annotation-layer")), ht.selectAll(".annotation-draw-vertex, .annotation-draw-poly").remove();
        var e = ao(), t = document.getElementById("annotationFinishBtn");
        t && (t.style.display = ft.length >= 3 ? "" : "none");
        var n = ts(mt) / 10, i = Math.min(4, Math.max(1, li.k));
        if (ft.forEach(function(t) {
            var i = e(t);
            i && !isNaN(i[0]) && ht.append("circle").attr("class", "annotation-region-vertex annotation-draw-vertex").attr("cx", i[0]).attr("cy", i[1]).attr("r", 4 * n).style("fill", pt);
        }), ft.length >= 2) {
            var a = ft.map(function(t) {
                return e(t);
            }).filter(function(e) {
                return e && !isNaN(e[0]);
            });
            if (a.length >= 2) {
                var r = "M" + a.map(function(e) {
                    return e[0] + "," + e[1];
                }).join("L");
                ft.length >= 3 && (r += "Z"), ht.append("path").attr("class", "annotation-region-poly annotation-draw-poly").attr("d", r).style("stroke", pt).style("fill", pt + "1f").style("stroke-width", 2 * n * i);
            }
        }
    }
    function rs(e) {
        for (var t = 0, n = 1; n < e.length; n++) {
            var i = d3.geoDistance(e[n - 1], e[n]);
            isNaN(i) || (t += 6371 * i);
        }
        return Math.round(t);
    }
    function os() {
        if (_t = null, bt && xt) {
            var e = xt;
            if (xt = null, !vt.length) return vt.push(Xo(e[0], e[1])), void (Et = e);
            ki();
            var t = e[0] - Et[0], n = e[1] - Et[1], i = Math.sqrt(t * t + n * n);
            if (kt += i, i >= 2) {
                var a = Xo(e[0], e[1]);
                a && (vt.push(a), Et = e, ss());
            }
        }
    }
    function ss() {
        if (vt && vt.length) {
            ht || (ht = Vn.append("g").attr("class", "annotation-layer"));
            var e, t = ao(), n = document.getElementById("annotationFinishBtn");
            if (!Ct || !Ct.isConnected) {
                if (!vt.length) return;
                ht.selectAll(".annotation-draw-poly").remove(), (Ct = ht.append("path").attr("class", "annotation-region-poly annotation-draw-poly").node()).style.stroke = pt, 
                Ct.style.fill = pt + "1f", Ct.style.strokeWidth = String(("region" === ut ? 2 : 2.5) * (ts(mt) / 10) * Math.min(4, Math.max(1, li.k)));
            }
            if (n && (n.style.display = ""), "arrow" === ut && vt.length >= 2) {
                var i = t(vt[0]), a = t(vt[vt.length - 1]);
                i && a && !isNaN(i[0]) && !isNaN(a[0]) && (e = "M" + i[0] + "," + i[1] + "L" + a[0] + "," + a[1], 
                Ct && !Ct.style.stroke && (Ct.style.stroke = pt));
            } else if ("freehand" === ut && vt.length >= 2) {
                e = Zo(vt, t).map(function(e) {
                    return "M" + e.map(function(e) {
                        return e[0] + "," + e[1];
                    }).join("L");
                }).join("");
            }
            e && (Ct.setAttribute("d", e), Ct.style.strokeWidth = String(("region" === ut ? 2 : 2.5) * (ts(mt) / 10) * Math.min(4, Math.max(1, li.k))));
        }
    }
    function ls() {
        _t && (cancelAnimationFrame(_t), _t = null), bt = !1, wt = null, vt = null, Et = null, 
        kt = 0, xt = null, Ct = null, ft = [];
        var e = document.getElementById("annotationFinishBtn");
        e && (e.style.display = "none"), ns();
    }
    function cs() {
        return !!(bt || vt && vt.length) && (ls(), Go(zi("annotationStrokeCancelled")), 
        !0);
    }
    function ds(e) {
        Lt = e;
    }
    function us(e) {
        if (vt && vt.length) {
            var t = vt.filter(function(e) {
                return e;
            }), n = "arrow" === ut;
            if (kt >= 10) if (t.length < 2) ls(); else {
                bt = !1, _t && (cancelAnimationFrame(_t), _t = null);
                var i = n ? [ t[0], t[t.length - 1] ] : t, a = rs(n ? i : t);
                Ct = null, ft = [], ls(), yt.push({
                    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                    type: n ? "arrow" : "freehand",
                    coords: i,
                    label: "",
                    color: pt,
                    size: mt,
                    distanceKm: a,
                    createdAt: Date.now()
                }), Vo(), ns(), Go(zi("annotationAdded")), e || Go(zi("annotationLengthLabel").replace("{km}", a.toLocaleString("en")));
            } else ls();
        }
    }
    function ps(e) {
        bt && e.pointerId === wt && (e.preventDefault(), e.stopPropagation(), ms(e));
    }
    function ms(e) {
        if (bt) {
            if (bt = !1, wt = null, _t && (cancelAnimationFrame(_t), _t = null), xt) {
                var t = xt;
                xt = null;
                ki();
                var n = t[0] - Et[0], i = t[1] - Et[1];
                kt += Math.sqrt(n * n + i * i);
                var a = Xo(t[0], t[1]);
                a && vt.push(a), ss();
            }
            us(!1);
        }
    }
    function fs() {
        var e = document.getElementById("annotationKindPin"), t = document.getElementById("annotationKindRegion"), n = document.getElementById("annotationKindDraw"), i = document.getElementById("annotationKindArrow");
        e && (e.classList.toggle("toggle-on", "pin" === ut), e.setAttribute("aria-pressed", String("pin" === ut))), 
        t && (t.classList.toggle("toggle-on", "region" === ut), t.setAttribute("aria-pressed", String("region" === ut))), 
        n && (n.classList.toggle("toggle-on", "freehand" === ut), n.setAttribute("aria-pressed", String("freehand" === ut))), 
        i && (i.classList.toggle("toggle-on", "arrow" === ut), i.setAttribute("aria-pressed", String("arrow" === ut))), 
        document.querySelectorAll("#annotationToolbar .annotation-color-swatch").forEach(function(e) {
            var t = e.getAttribute("data-color") === pt;
            e.classList.toggle("toggle-on", t), e.setAttribute("aria-pressed", String(t));
        });
        var a = ts(mt), r = {};
        r.small = a === gt[0], r.medium = 10 === a, r.large = a === gt[gt.length - 1], Object.keys(r).forEach(function(e) {
            var t = document.getElementById("annotationFont" + e.charAt(0).toUpperCase() + e.slice(1) + "Btn");
            t && (t.classList.toggle("toggle-on", r[e]), t.setAttribute("aria-pressed", String(r[e])));
        });
        var o = document.getElementById("annotationFontValue");
        o && (o.textContent = String(a)), "region" === ut && ft.length > 0 ? as() : ns();
    }
    function hs() {
        dt = !dt;
        var e = document.getElementById("annotateBtn");
        e && (e.classList.toggle("toggle-on", dt), e.setAttribute("aria-pressed", String(dt)));
        var t = document.getElementById("mobileAnnotateBtn");
        t && (t.classList.toggle("toggle-on", dt), t.setAttribute("aria-pressed", String(dt))), 
        document.body.classList.toggle("annotate-active", dt);
        var n = document.getElementById("annotationToolbar");
        n && (n.style.display = dt ? "flex" : "none", n.setAttribute("aria-hidden", String(!dt))), 
        dt ? (yt = [], ls(), is(), st && Po(), fs(), Go(zi("annotationModeOn")), function() {
            try {
                if ("1" === localStorage.getItem("annotateExplained")) return;
            } catch (e) {}
            setTimeout(function() {
                window.startAnnotationTutorial && window.startAnnotationTutorial();
            }, 300);
        }()) : (Vo(), yt = [], ls(), is(), Go(zi("annotationModeOff")));
    }
    function ys() {
        var e = Yo();
        e && e.length ? (yt = e, ns(), ks && ks(), Go(zi("annotationSessionRestored"))) : Go(zi("annotationNoSavedSession"));
    }
    function gs(e) {
        var t = ts(mt), n = gt.indexOf(t);
        -1 === n && (n = gt.indexOf(10)), n = Math.max(0, Math.min(gt.length - 1, n + e)), 
        vs(gt[n]);
    }
    function vs(e) {
        if (-1 !== gt.indexOf(e)) {
            mt = e;
            try {
                localStorage.setItem("annotateFontSize", String(e));
            } catch (e) {}
            fs();
            var t = e / 10;
            Ct && bt ? Ct.style.strokeWidth = String(("region" === ut ? 2 : 2.5) * t * Math.min(4, Math.max(1, li.k))) : "region" === ut && ft.length > 0 && as();
        }
    }
    function bs() {
        if (yt.length) {
            var e = zi("annotationClearConfirm");
            window.confirm(e) && (yt = [], Vo(), ls(), is(), ks(), Go(zi("annotationCleared")));
        } else Go(zi("annotationModeEmpty"));
    }
    function ws() {
        if (yt.length) {
            var e = {
                app: "lepidos-atlas",
                kind: "annotations",
                version: 1,
                exportedAt: (new Date).toISOString(),
                annotations: yt
            }, t = new Blob([ JSON.stringify(e, null, 2) ], {
                type: "application/json"
            }), n = URL.createObjectURL(t), i = document.createElement("a");
            i.href = n, i.download = "lepidos_annotations_" + (new Date).toISOString().slice(0, 10) + ".json", 
            i.click(), setTimeout(function() {
                URL.revokeObjectURL(n);
            }, 500), Go(zi("annotationExport") + " ✓");
        } else Go(zi("annotationExportEmpty"));
    }
    function Es(e) {
        var t = document.createElement("div");
        t.style.display = "flex", t.style.flexWrap = "wrap", t.style.gap = "8px", t.style.justifyContent = "center", 
        t.style.marginTop = "10px";
        var n = document.createElement("button");
        n.className = "btn annotation-export-btn", n.textContent = zi("annotationExport"), 
        n.addEventListener("click", ws);
        var i = document.createElement("button");
        i.className = "btn annotation-import-btn", i.textContent = zi("annotationImport");
        var a = document.createElement("input");
        a.type = "file", a.accept = ".json,application/json", a.style.display = "none", 
        a.addEventListener("change", function() {
            a.files && a.files[0] && function(e) {
                if (e) {
                    var t = new FileReader;
                    t.onload = function() {
                        try {
                            var e = JSON.parse(t.result), n = Array.isArray(e) ? e : e && Array.isArray(e.annotations) ? e.annotations : null;
                            if (!n) throw new Error("bad shape");
                            var i = n.filter(function(e) {
                                return e && -1 !== [ "pin", "region", "freehand", "arrow" ].indexOf(e.type) && Array.isArray(e.coords) && e.coords.length;
                            }).map(function(e) {
                                return {
                                    id: e.id || "ann_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
                                    type: e.type,
                                    coords: e.coords,
                                    label: "string" == typeof e.label ? e.label : "",
                                    color: /^#[0-9a-fA-F]{3,8}$/.test(e.color || "") ? e.color : "#eab308",
                                    size: "number" == typeof e.size && isFinite(e.size) ? e.size : 10,
                                    distanceKm: "number" == typeof e.distanceKm ? e.distanceKm : null,
                                    hidden: !!e.hidden,
                                    createdAt: e.createdAt || Date.now()
                                };
                            });
                            if (!i.length) return void Go(zi("annotationImportError"));
                            var a = new Set(yt.map(function(e) {
                                return e.id;
                            })), r = 0;
                            i.forEach(function(e) {
                                a.has(e.id) || (yt.push(e), r++);
                            }), Vo(), ns(), ks(), Go(zi("annotationImported").replace("{n}", r));
                        } catch (e) {
                            Go(zi("annotationImportError"));
                        }
                    }, t.onerror = function() {
                        Go(zi("annotationImportError"));
                    }, t.readAsText(e);
                }
            }(a.files[0]), a.value = "";
        }), i.addEventListener("click", function() {
            a.click();
        }), t.appendChild(n), t.appendChild(i), t.appendChild(a), e.appendChild(t);
    }
    function ks() {
        var e = document.getElementById("annotationsModalBody");
        if (e) {
            if (0 === yt.length) {
                var t = Yo(), n = '<p style="color:var(--text-secondary);font-size:0.78em;text-align:center;">' + zi("annotationEmpty") + "</p>";
                return t && t.length && (n += '<button class="btn annotation-restore-btn" id="annotationRestoreBtn" data-i18n="annotationRestoreSession">' + zi("annotationRestoreSession") + "</button>"), 
                e.innerHTML = n, (r = document.getElementById("annotationRestoreBtn")) && r.addEventListener("click", ys), 
                void Es(e);
            }
            e.innerHTML = "", yt.forEach(function(t, n) {
                var i = jo(t.label || es(t)), a = jo(es(t)), r = "freehand" !== t.type && "arrow" !== t.type || !t.distanceKm ? "" : ' <span class="annotation-item-dist">' + jo(t.distanceKm.toLocaleString("en")) + " km</span>", o = t.hidden ? ' <span class="annotation-hidden-label">' + jo(zi("annotationHidden")) + "</span>" : "", s = document.createElement("div");
                s.className = "annotation-item";
                var l = document.createElement("span");
                l.className = "annotation-item-type", l.textContent = a;
                var c = document.createElement("span");
                c.className = "annotation-item-label", c.innerHTML = jo(i) + r + o;
                var d = document.createElement("div");
                d.className = "annotation-item-actions";
                var u = document.createElement("button");
                u.className = "annotation-label-btn", u.textContent = zi("annotationLabelTitle"), 
                u.addEventListener("click", function() {
                    !function(e, t, n, i) {
                        var a = document.getElementById("annotationLabelModal"), r = document.getElementById("annotationLabelInput"), o = document.getElementById("annotationLabelSave"), s = document.getElementById("annotationLabelCancel"), l = document.getElementById("annotationLabelClose");
                        if (a && r) {
                            var c = document.activeElement, d = document.getElementById("annotationLabelPrompt");
                            d && (d.textContent = e || ""), r.value = null != t ? String(t) : "", a.classList.add("visible"), 
                            a.style.display = "flex", o && (o.textContent = zi("addLabel")), s && (s.textContent = zi("quizCancel")), 
                            r.focus(), r.select(), o && (o.onclick = p), s && (s.onclick = u), l && (l.onclick = u), 
                            r.onkeydown = function(e) {
                                "Enter" === e.key && (e.preventDefault(), p()), "Escape" === e.key && u();
                            }, r.onblur = function() {}, a.addEventListener("click", function(e) {
                                e.target !== a.querySelector(".layers-modal-backdrop") && e.target !== a || u();
                            }, {
                                once: !0
                            });
                        }
                        function u() {
                            a.classList.remove("visible"), a.style.display = "none", c && c.isConnected ? c.focus() : document.getElementById("mapContainer") && document.getElementById("mapContainer").focus();
                        }
                        function p() {
                            var e = r.value.trim();
                            (e || i) && n && n(e), u();
                        }
                    }(zi("annotationLabelTitle"), t.label || "", function(e) {
                        yt[n].label = e, Vo(), ks(), ns();
                    }, !1);
                });
                var p = document.createElement("button");
                p.className = "annotation-vis-btn", p.textContent = zi("annotationShow"), p.addEventListener("click", function() {
                    yt[n].hidden = !yt[n].hidden, Vo(), ks(), ns();
                });
                var m = document.createElement("button");
                m.className = "annotation-del-btn", m.textContent = zi("annotationDelete"), m.addEventListener("click", function() {
                    window.confirm(zi("annotationDeleteConfirm", {
                        label: t.label || a
                    })) && (yt.splice(n, 1), Vo(), ks(), ns());
                }), d.appendChild(u), d.appendChild(p), d.appendChild(m), s.appendChild(l), s.appendChild(c), 
                s.appendChild(d), e.appendChild(s);
            });
            var i = document.createElement("div");
            i.style.display = "flex", i.style.flexWrap = "wrap", i.style.gap = "8px", i.style.justifyContent = "center", 
            i.style.marginTop = "12px";
            var a = document.createElement("button");
            a.className = "btn annotation-del-all-btn", a.id = "annotationDeleteAllBtn", a.textContent = zi("annotationDeleteAll"), 
            a.addEventListener("click", bs), i.appendChild(a), e.appendChild(i);
            t = Yo();
            var r, o = document.createElement("div");
            o.style.textAlign = "center", o.style.marginTop = "10px", (r = document.createElement("button")).className = "btn annotation-restore-btn", 
            r.id = "annotationRestoreBtn", r.textContent = zi("annotationRestoreSession"), r.disabled = !(t && t.length), 
            r.addEventListener("click", ys), o.appendChild(r), e.appendChild(o), Es(e);
        }
    }
    function xs() {
        var e = document.getElementById("annotationsModal");
        e && e.classList.remove("visible");
    }
    function _s() {
        if (Jn && hn && hn.length) {
            var e = MAP_COLORS && MAP_COLORS.country && MAP_COLORS.country.normal || "#d4c5a0";
            Jn.selectAll("*").remove(), Jn.selectAll("path").data(hn).join("path").attr("class", "history-land-path").attr("d", Gn).attr("fill", e).attr("stroke", "none").attr("stroke-width", 0).attr("filter", null).style("pointer-events", "none");
        }
    }
    function Cs() {
        const e = new URLSearchParams;
        e.set("lang", Ht), e.set("mode", ae), e.set("filter", ie), Object.keys(Li).forEach(function(t) {
            var n = Li[t];
            e.set(n.hashKey, n.getFlag() ? "1" : "0");
        }), "all" !== re && e.set("bloc", re), "history" === Ke && (e.set("sec", "history"), 
        e.set("tab", Fe), "eras" === Fe ? (He && e.set("era", He), e.set("reg", Ge), e.set("q", encodeURIComponent(Ve))) : "faiths" === Fe ? e.set("yr", El) : (qe && e.set("war", qe), 
        Oe && e.set("scen", Oe), e.set("reg", Ge), e.set("rel", Ye), e.set("q", encodeURIComponent(Ve)))), 
        e.set("k", li.k.toFixed(2)), e.set("x", li.x.toFixed(0)), e.set("y", li.y.toFixed(0)), 
        history.replaceState(null, "", "#" + e.toString());
    }
    Ko(), window.renderHistoryLand = _s;
    const Ls = function(e, t) {
        let n;
        return function(...i) {
            clearTimeout(n), n = setTimeout(() => e.apply(this, i), t);
        };
    }(Cs, 300);
    window.updateHash = Cs;
    const Bs = [ "religion", "terrain", "density", "precipitation", "temperature", "gdp", "hdi", "normal" ], Ss = [ "all", "muslim", "christian", "hindu", "buddhist", "jewish", "other" ], Is = [ "ar", "en", "ru", "uz", "es" ];
    function zs() {
        const e = window.location.href.split("#")[0] + window.location.hash, t = zi(`mode_${ae}`) || ae, n = zi("shareText", {
            mode: t
        });
        navigator.share ? navigator.share({
            title: zi("shareTitle"),
            text: n,
            url: e
        }).catch(() => {}) : function() {
            const e = window.location.href.split("#")[0] + window.location.hash;
            navigator.clipboard.writeText(e).then(() => {
                c.textContent = zi("copySuccess"), c.classList.add("show"), setTimeout(() => c.classList.remove("show"), 2e3);
            }).catch(() => {
                c.textContent = zi("copyFail"), c.classList.add("show"), setTimeout(() => c.classList.remove("show"), 2e3);
            });
        }();
    }
    function As() {
        ie = "all", m(h, '.religion-btn[data-religion="all"]'), Vr("religion"), oe && Rr(), 
        se && Qr(), de && ka(), le && Jr(), ce && Ir(), ue && Zr(), pe && eo(), me && to(), 
        fe && no(), he && Er(), ye && kr(), ge && xr(), ve && _r(), be && Cr(), we && Lr(), 
        xe && zr(), "all" !== re && (re = "all", document.getElementById("blocSelect").value = "all"), 
        _e && Br(), Ce && Sr();
    }
    function Ms() {
        As(), Be && mo(), Mt || io(), vo(), vn = null, bn = null, Kr(null), Eo();
    }
    function Ts() {
        U.classList.remove("visible");
    }
    function Ps() {
        if (!Y) return;
        const e = G ? G.value.trim() : "";
        let t = [];
        gi.forEach(function(n) {
            const i = da(n);
            if (!i) return;
            const a = Hi(n);
            if (e && !Gi(n, e)) return;
            const r = i ? i.population_2026 : null, o = i ? i.area : null, s = Zi(n), l = la(n), c = ca(n), d = Qi(n), u = Ca(n);
            var p;
            t.push({
                name: a,
                continent: u,
                population: r,
                area: o,
                density: s,
                gdp: l,
                hdi: c,
                religion: d,
                religionLabel: (p = d, p ? "ar" === Ht ? religionArabic[p] || p : "ru" === Ht ? religionRussian[p] || p : "uz" === Ht ? religionUzbek[p] || p : "es" === Ht && religionSpanish[p] || p : zi("unknown"))
            });
        }), t.sort(function(e, t) {
            let n = e[kn], i = t[kn];
            if ("name" === kn || "continent" === kn || "religion" === kn) {
                if (n = (n || "").toString(), i = (i || "").toString(), !n && !i) return 0;
                if (!n) return 1;
                if (!i) return -1;
                const e = n.localeCompare(i, void 0, {
                    sensitivity: "base"
                });
                return xn ? e : -e;
            }
            if (null == n && null == i) return 0;
            if (null == n) return 1;
            if (null == i) return -1;
            const a = n - i;
            return xn ? a : -a;
        });
        let n = "";
        t.forEach(function(e) {
            n += "<tr>", n += "<td>" + Ti(e.name) + "</td>";
            const t = "ar" === Ht ? continentArabic[e.continent] || e.continent : "ru" === Ht ? continentRussian[e.continent] || e.continent : "uz" === Ht ? continentUzbek[e.continent] || e.continent : "es" === Ht && continentSpanish[e.continent] || e.continent;
            n += "<td>" + Ti(t) + "</td>", n += "<td>" + (null != e.population ? e.population.toLocaleString("en-US") : zi("unknown")) + "</td>", 
            n += "<td>" + (null != e.area ? e.area.toLocaleString("en-US") : zi("unknown")) + "</td>", 
            n += "<td>" + (null != e.density ? e.density + " " + zi("densityUnit") : zi("unknown")) + "</td>", 
            n += "<td>" + (null != e.gdp ? "$" + e.gdp.toLocaleString("en-US") : zi("unknown")) + "</td>", 
            n += "<td>" + (null != e.hdi ? e.hdi.toFixed(3) : zi("unknown")) + "</td>", n += "<td>" + Ti(e.religionLabel) + "</td>", 
            n += "</tr>";
        }), Y.innerHTML = n, U.querySelectorAll("th[data-sort-key]").forEach(function(e) {
            e.getAttribute("data-sort-key") === kn ? e.setAttribute("aria-sort", xn ? "ascending" : "descending") : e.removeAttribute("aria-sort");
        });
    }
    j && j.addEventListener("click", () => H.classList.add("visible")), W && W.addEventListener("click", () => H.classList.remove("visible")), 
    H && H.addEventListener("click", function(e) {
        e.target === H && H.classList.remove("visible");
    }), $ && $.addEventListener("click", function() {
        Ps(), U.classList.add("visible");
    }), K && K.addEventListener("click", Ts), U && U.addEventListener("click", function(e) {
        e.target === U && Ts();
    }), G && G.addEventListener("input", function() {
        Ps();
    }), U && U.querySelectorAll("th[data-sort-key]").forEach(function(e) {
        e.addEventListener("click", function() {
            var t = e.getAttribute("data-sort-key");
            t === kn ? xn = !xn : (kn = t, xn = !0), Ps();
        });
    });
    var qs = document.getElementById("onboardBtn");
    function Os() {
        m(h, `.religion-btn[data-religion="${ie}"]`);
    }
    async function Rs() {
        function t() {
            var e = document.querySelector(".stepped-dock-group"), t = document.getElementById("filterRow");
            if (e && t) {
                var n = e.offsetWidth, i = e.offsetHeight;
                if (window.innerWidth < 1024 || 0 === n || 0 === i) return e.style.webkitMaskImage = "none", 
                void (e.style.maskImage = "none");
                var a, r = e.getBoundingClientRect(), o = t.getBoundingClientRect(), s = "rtl" === getComputedStyle(e).direction, l = Math.round((s ? o.right : o.left) - r.left), c = parseFloat(getComputedStyle(e).borderBottomLeftRadius) || 12, d = 1 + t.offsetHeight;
                a = s ? "M0 0 H" + n + " V" + i + " H" + l + " V" + (d + c) + " A" + c + " " + c + " 0 0 0 " + (l - c) + " " + d + " H" + c + " A" + c + " " + c + " 0 0 1 0 " + (d - c) + " V0 Z" : "M0 0 H" + n + " V" + (d - c) + " A" + c + " " + c + " 0 0 0 " + (n - c) + " " + d + " H" + (l + c) + " A" + c + " " + c + " 0 0 0 " + l + " " + (d + c) + " V" + i + " H" + c + " A" + c + " " + c + " 0 0 1 0 " + (i - c) + " V0 Z";
                var u = 'url("data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 ' + n + " " + i + '"><path d="' + a + '" fill="white"/></svg>') + '")';
                e.style.webkitMaskImage = u, e.style.maskImage = u;
            }
        }
        if (xi = window.innerWidth < 768, !window.__dockMaskSynced && "undefined" != typeof ResizeObserver) {
            var i = document.querySelector(".stepped-dock-group"), o = document.getElementById("filterRow");
            if (i && o) {
                var s = new ResizeObserver(t);
                s.observe(i), s.observe(o), window.__dockMaskSynced = !0, t();
            }
        }
        if ("undefined" != typeof featureRussian) {
            if (corridorsData.forEach(function(e) {
                e.name_ru = e.name_ru || featureRussian.corridors[e.name_en];
            }), mountainRanges.forEach(function(e) {
                e.name_ru = e.name_ru || function(e, t) {
                    if (e && t) {
                        if (e[t]) return e[t];
                        var n = t.replace(/\s+(Mountains|Mountain|Range|Highlands|Hills|Alps)$/i, "").trim();
                        return e[n] ? e[n] : void 0;
                    }
                }(featureRussian.mountains, e.name_en);
            }), rivers.forEach(function(e) {
                e.name_ru = e.name_ru || featureRussian.rivers[e.name_en];
            }), naturalResourcesData.forEach(function(e) {
                e.name_ru = e.name_ru || featureRussian.resources[e.name_en];
            }), ethnicGroupsData.forEach(function(e) {
                e.name_ru = e.name_ru || featureRussian.ethnicGroups[e.name_en];
            }), oceanCurrentsData.forEach(function(e) {
                e.name_ru = e.name_ru || featureRussian.currents[e.name_en];
            }), windsData.forEach(function(e) {
                e.name_ru = e.name_ru || featureRussian.winds[e.name_en];
            }), earthquakesData.forEach(function(e) {
                e.name_ru = e.name_ru || featureRussian.earthquakes[e.name_en];
            }), volcanoesData.forEach(function(e) {
                e.name_ru = e.name_ru || featureRussian.volcanoes[e.name_en];
            }), tectonicPlatesData.forEach(function(e) {
                e.name_ru = e.name_ru || featureRussian.plates[e.name_en];
            }), desertsForestsData.forEach(function(e) {
                e.name_ru = e.name_ru || featureRussian.deserts[e.name_en];
            }), borderDisputesData.forEach(function(e) {
                e.name_ru = e.name_ru || featureRussian.disputes[e.name_en];
            }), "undefined" != typeof russianNames) {
                var l = russianNames, d = function(e) {
                    return e ? e.split(",").map(function(e) {
                        return l[e.trim()] || e.trim();
                    }).join(", ") : e;
                };
                ethnicGroupsData.forEach(function(e) {
                    e.countries_ru = e.countries_ru || d(e.countries_en);
                }), mountainRanges.forEach(function(e) {
                    e.countries_ru = e.countries_ru || d(e.countries_en);
                }), rivers.forEach(function(e) {
                    e.countries_ru = e.countries_ru || d(e.countries_en);
                });
            }
        }
        if ("undefined" != typeof featureUzbek) {
            if (corridorsData.forEach(function(e) {
                e.name_uz = e.name_uz || featureUzbek.corridors[e.name_en];
            }), mountainRanges.forEach(function(e) {
                e.name_uz = e.name_uz || featureUzbek.mountains[e.name_en];
            }), rivers.forEach(function(e) {
                e.name_uz = e.name_uz || featureUzbek.rivers[e.name_en];
            }), naturalResourcesData.forEach(function(e) {
                e.name_uz = e.name_uz || featureUzbek.resources[e.name_en];
            }), ethnicGroupsData.forEach(function(e) {
                e.name_uz = e.name_uz || featureUzbek.ethnicGroups[e.name_en];
            }), oceanCurrentsData.forEach(function(e) {
                e.name_uz = e.name_uz || featureUzbek.currents[e.name_en];
            }), windsData.forEach(function(e) {
                e.name_uz = e.name_uz || featureUzbek.winds[e.name_en];
            }), earthquakesData.forEach(function(e) {
                e.name_uz = e.name_uz || featureUzbek.earthquakes[e.name_en];
            }), volcanoesData.forEach(function(e) {
                e.name_uz = e.name_uz || featureUzbek.volcanoes[e.name_en];
            }), tectonicPlatesData.forEach(function(e) {
                e.name_uz = e.name_uz || featureUzbek.plates[e.name_en];
            }), desertsForestsData.forEach(function(e) {
                e.name_uz = e.name_uz || featureUzbek.deserts[e.name_en];
            }), borderDisputesData.forEach(function(e) {
                e.name_uz = e.name_uz || featureUzbek.disputes[e.name_en];
            }), featureUzbek.earthquakePlates && earthquakesData.forEach(function(e) {
                e.plate_uz = e.plate_uz || featureUzbek.earthquakePlates[e.plate_en];
            }), featureUzbek.volcanoTypes && volcanoesData.forEach(function(e) {
                e.type_uz = e.type_uz || featureUzbek.volcanoTypes[e.type_en];
            }), featureUzbek.countries) {
                var u = featureUzbek.countries, p = function(e) {
                    return e ? e.split(",").map(function(e) {
                        return u[e.trim()] || e.trim();
                    }).join(", ") : e;
                };
                earthquakesData.forEach(function(e) {
                    e.description_uz = e.description_uz || e.description_en;
                }), volcanoesData.forEach(function(e) {
                    e.description_uz = e.description_uz || e.description_en;
                }), naturalResourcesData.forEach(function(e) {
                    e.countries_uz = e.countries_uz || p(e.countries_en), e.description_uz = e.description_uz || e.description_en;
                }), ethnicGroupsData.forEach(function(e) {
                    e.countries_uz = e.countries_uz || p(e.countries_en), e.description_uz = e.description_uz || e.description_en;
                }), mountainRanges.forEach(function(e) {
                    e.countries_uz = e.countries_uz || p(e.countries_en), e.description_uz = e.description_uz || e.description_en;
                }), rivers.forEach(function(e) {
                    e.countries_uz = e.countries_uz || p(e.countries_en), e.description_uz = e.description_uz || e.description_en;
                }), desertsForestsData.forEach(function(e) {
                    e.countries_uz = e.countries_uz || p(e.countries_en), e.description_uz = e.description_uz || e.description_en;
                }), additionalWaterwaysData.forEach(function(e) {
                    e.countries_uz = e.countries_uz || p(e.countries_en);
                });
            }
            featureUzbek.biomes && desertsForestsData.forEach(function(e) {
                e.biome_uz = e.biome_uz || featureUzbek.biomes[e.biome_en], e.description_uz = e.description_uz || e.description_en;
            }), featureUzbek.ethnicPopulation && ethnicGroupsData.forEach(function(e) {
                e.population_uz = e.population_uz || featureUzbek.ethnicPopulation[e.population_en];
            }), featureUzbek.ethnicLanguages && ethnicGroupsData.forEach(function(e) {
                e.language_uz = e.language_uz || featureUzbek.ethnicLanguages[e.language_en];
            }), featureUzbek.ethnicReligions && ethnicGroupsData.forEach(function(e) {
                e.religion_uz = e.religion_uz || featureUzbek.ethnicReligions[e.religion_en];
            }), featureUzbek.riverSources && rivers.forEach(function(e) {
                e.source_uz = e.source_uz || featureUzbek.riverSources[e.source_en];
            }), featureUzbek.riverMouths && rivers.forEach(function(e) {
                e.mouth_uz = e.mouth_uz || featureUzbek.riverMouths[e.mouth_en];
            }), featureUzbek.mountainPeaks && mountainRanges.forEach(function(e) {
                e.highestPeak_uz = e.highestPeak_uz || featureUzbek.mountainPeaks[e.highestPeak_en];
            }), featureUzbek.disputeCauses && borderDisputesData.forEach(function(e) {
                e.causes_uz = e.causes_uz || e.causes_en;
            }), featureUzbek.oceanCurrentDescriptions && oceanCurrentsData.forEach(function(e) {
                e.description_uz = e.description_uz || featureUzbek.oceanCurrentDescriptions[e.description_en] || e.description_en;
            }), featureUzbek.resourceDescriptions && naturalResourcesData.forEach(function(e) {
                e.description_uz = e.description_uz || featureUzbek.resourceDescriptions[e.description_en] || e.description_en;
            }), oceanCurrentsData.forEach(function(e) {
                e.description_uz = e.description_uz || e.description_en;
            }), windsData.forEach(function(e) {
                e.description_uz = e.description_uz || e.description_en;
            }), borderDisputesData.forEach(function(e) {
                e.causes_uz = e.causes_uz || e.causes_en;
            });
        }
        if ("undefined" != typeof featureSpanish) {
            if (corridorsData.forEach(function(e) {
                e.name_es = e.name_es || featureSpanish.corridors[e.name_en];
            }), mountainRanges.forEach(function(e) {
                e.name_es = e.name_es || featureSpanish.mountains[e.name_en];
            }), rivers.forEach(function(e) {
                e.name_es = e.name_es || featureSpanish.rivers[e.name_en];
            }), naturalResourcesData.forEach(function(e) {
                e.name_es = e.name_es || featureSpanish.resources[e.name_en];
            }), ethnicGroupsData.forEach(function(e) {
                e.name_es = e.name_es || featureSpanish.ethnicGroups[e.name_en];
            }), oceanCurrentsData.forEach(function(e) {
                e.name_es = e.name_es || featureSpanish.currents[e.name_en];
            }), windsData.forEach(function(e) {
                e.name_es = e.name_es || featureSpanish.winds[e.name_en];
            }), earthquakesData.forEach(function(e) {
                e.name_es = e.name_es || featureSpanish.earthquakes[e.name_en];
            }), volcanoesData.forEach(function(e) {
                e.name_es = e.name_es || featureSpanish.volcanoes[e.name_en];
            }), tectonicPlatesData.forEach(function(e) {
                e.name_es = e.name_es || featureSpanish.plates[e.name_en];
            }), desertsForestsData.forEach(function(e) {
                e.name_es = e.name_es || featureSpanish.deserts[e.name_en];
            }), borderDisputesData.forEach(function(e) {
                e.name_es = e.name_es || featureSpanish.disputes[e.name_en];
            }), featureSpanish.earthquakePlates && earthquakesData.forEach(function(e) {
                e.plate_es = e.plate_es || featureSpanish.earthquakePlates[e.plate_en];
            }), featureSpanish.volcanoTypes && volcanoesData.forEach(function(e) {
                e.type_es = e.type_es || featureSpanish.volcanoTypes[e.type_en];
            }), featureSpanish.countries) {
                var f = featureSpanish.countries, y = function(e) {
                    return e ? e.split(",").map(function(e) {
                        return f[e.trim()] || e.trim();
                    }).join(", ") : e;
                };
                featureSpanish.earthquakeDescriptions && earthquakesData.forEach(function(e) {
                    e.description_es = e.description_es || featureSpanish.earthquakeDescriptions[e.description_en] || e.description_en;
                }), featureSpanish.volcanoDescriptions && volcanoesData.forEach(function(e) {
                    e.description_es = e.description_es || featureSpanish.volcanoDescriptions[e.description_en] || e.description_en;
                }), featureSpanish.desertForestDescriptions && desertsForestsData.forEach(function(e) {
                    e.description_es = e.description_es || featureSpanish.desertForestDescriptions[e.description_en] || e.description_en;
                }), naturalResourcesData.forEach(function(e) {
                    e.countries_es = e.countries_es || y(e.countries_en), e.description_es = e.description_es || e.description_en;
                }), ethnicGroupsData.forEach(function(e) {
                    e.countries_es = e.countries_es || y(e.countries_en), e.description_es = e.description_es || e.description_en;
                }), mountainRanges.forEach(function(e) {
                    e.countries_es = e.countries_es || y(e.countries_en), e.description_es = e.description_es || e.description_en;
                }), rivers.forEach(function(e) {
                    e.countries_es = e.countries_es || y(e.countries_en), e.description_es = e.description_es || e.description_en;
                }), desertsForestsData.forEach(function(e) {
                    e.countries_es = e.countries_es || y(e.countries_en), e.description_es = e.description_es || e.description_en;
                }), borderDisputesData.forEach(function(e) {
                    e.countries_es = e.countries_es || y(e.countries_en);
                }), additionalWaterwaysData.forEach(function(e) {
                    e.countries_es = e.countries_es || y(e.countries_en);
                });
            }
            featureSpanish.biomes && desertsForestsData.forEach(function(e) {
                e.biome_es = e.biome_es || featureSpanish.biomes[e.biome_en];
            }), featureSpanish.ethnicPopulation && ethnicGroupsData.forEach(function(e) {
                e.population_es = e.population_es || featureSpanish.ethnicPopulation[e.population_en];
            }), featureSpanish.ethnicLanguages && ethnicGroupsData.forEach(function(e) {
                e.language_es = e.language_es || featureSpanish.ethnicLanguages[e.language_en];
            }), featureSpanish.ethnicReligions && ethnicGroupsData.forEach(function(e) {
                e.religion_es = e.religion_es || featureSpanish.ethnicReligions[e.religion_en];
            }), featureSpanish.riverSources && rivers.forEach(function(e) {
                e.source_es = e.source_es || featureSpanish.riverSources[e.source_en];
            }), featureSpanish.riverMouths && rivers.forEach(function(e) {
                e.mouth_es = e.mouth_es || featureSpanish.riverMouths[e.mouth_en];
            }), featureSpanish.mountainPeaks && mountainRanges.forEach(function(e) {
                e.highestPeak_es = e.highestPeak_es || featureSpanish.mountainPeaks[e.highestPeak_en];
            }), featureSpanish.causeTranslations && borderDisputesData.forEach(function(e) {
                e.causes_es = e.causes_es || featureSpanish.causeTranslations[e.causes_en] || e.causes_en;
            }), featureSpanish.oceanCurrentDescriptions && oceanCurrentsData.forEach(function(e) {
                e.description_es = e.description_es || featureSpanish.oceanCurrentDescriptions[e.description_en] || e.description_en;
            }), featureSpanish.resourceDescriptions && naturalResourcesData.forEach(function(e) {
                e.description_es = e.description_es || featureSpanish.resourceDescriptions[e.description_en] || e.description_en;
            }), oceanCurrentsData.forEach(function(e) {
                e.description_es = e.description_es || e.description_en;
            }), windsData.forEach(function(e) {
                e.description_es = e.description_es || e.description_en;
            });
        }
        "undefined" != typeof densitySpotEnglish && (densitySpots.forEach(function(e) {
            e.name_en = densitySpotEnglish[e.name], e.name_ru = densitySpotRussian[e.name], 
            e.name_uz = densitySpotUzbek[e.name], e.name_es = densitySpotSpanish[e.name];
        }), majorCitiesData.forEach(function(e) {
            e.name_en = e.name_en || densitySpotEnglish[e.name], e.name_ru = e.name_ru || densitySpotRussian[e.name], 
            e.name_uz = e.name_uz || densitySpotUzbek[e.name], e.name_es = e.name_es || densitySpotSpanish[e.name];
        })), "undefined" != typeof capitalsRussian && Object.keys(countryInfo).forEach(function(e) {
            var t = countryInfo[e];
            t.capital_ru = t.capital_ru || capitalsRussian[t.capital_en], t.lang_ru = t.lang_ru || langsRussian[t.lang_en];
        }), "undefined" != typeof capitalsUzbek && Object.keys(countryInfo).forEach(function(e) {
            var t = countryInfo[e];
            t.capital_uz = t.capital_uz || capitalsUzbek[t.capital_en], t.lang_uz = t.lang_uz || langsUzbek[t.lang_en];
        }), "undefined" != typeof capitalsSpanish && Object.keys(countryInfo).forEach(function(e) {
            var t = countryInfo[e];
            t.capital_es = t.capital_es || capitalsSpanish[t.capital_en], t.lang_es = t.lang_es || langsSpanish[t.lang_en];
        }), "undefined" != typeof featureRussian && featureRussian.blocs && geopoliticalBlocsData.forEach(function(e) {
            e.name_ru = e.name_ru || featureRussian.blocs[e.name_en], e.members_ru = e.members_ru || e.members_en;
        }), "undefined" != typeof featureUzbek && featureUzbek.blocs && geopoliticalBlocsData.forEach(function(e) {
            e.name_uz = e.name_uz || featureUzbek.blocs[e.name_en], e.members_uz = e.members_uz || e.members_en;
        }), "undefined" != typeof featureSpanish && featureSpanish.blocs && geopoliticalBlocsData.forEach(function(e) {
            e.name_es = e.name_es || featureSpanish.blocs[e.name_en], e.members_es = e.members_es || e.members_en;
        }), "undefined" != typeof lucide && lucide.createIcons && lucide.createIcons(), 
        function() {
            const {width: e, height: t} = La();
            a.setAttribute("viewBox", `0 0 ${e} ${t}`), a.setAttribute("width", e), a.setAttribute("height", t), 
            Yn = d3.select(a), window.svg = Yn, Yn.selectAll("*").remove();
            const n = Yn.append("defs");
            n.append("radialGradient").attr("id", "oceanGradient").attr("cx", "50%").attr("cy", "50%").attr("r", "70%").selectAll("stop").data(MAP_COLORS.oceanGradient.map(function(e, t) {
                return {
                    offset: [ "0%", "15%", "20%", "100%" ][t],
                    color: e
                };
            })).join("stop").attr("offset", e => e.offset).attr("stop-color", e => e.color);
            const i = n.append("filter").attr("id", "countryShadow").attr("x", "-20%").attr("y", "-20%").attr("width", "140%").attr("height", "140%").attr("color-interpolation-filters", "sRGB");
            xi ? i.append("feFlood").attr("flood-color", "transparent") : i.append("feDropShadow").attr("dx", 0).attr("dy", 1.5).attr("stdDeviation", 2.5).attr("flood-color", "#000000").attr("flood-opacity", .35), 
            ti = Yn.append("g").style("cursor", "default").on("click", function(e) {
                e && e.defaultPrevented || (window.historyIsActive && window.historyIsActive() ? void 0 !== $e && $e && "function" == typeof deselectHistoryPolity ? deselectHistoryPolity() : Eo() : vn && Eo());
            }), ti.append("rect").attr("x", -500).attr("y", -500).attr("width", e + 1e3).attr("height", t + 1e3).attr("fill", "url(#oceanGradient)").style("pointer-events", "all"), 
            Zn = Yn.append("g"), ei = Yn.append("g"), Jn = Yn.append("g").attr("id", "gHistoryLand").style("display", "none"), 
            Qn = Yn.append("g").attr("id", "gCountries"), gn = Yn.append("g").attr("id", "gColorblindPatterns"), 
            Xn = Yn.append("g"), window.syncOceanBackground = function() {
                var e = document.getElementById("oceanGradient"), t = e ? e.querySelectorAll("stop") : [], n = t[t.length - 1], i = n ? n.getAttribute("stop-color") : null;
                if (i && "none" !== i) {
                    var a = document.getElementById("mapContainer");
                    a && (a.style.backgroundColor = i), document.body.style.backgroundColor = i;
                }
            }, ii = Yn.append("g").attr("id", "physicalLayer"), ni = Yn.append("g").attr("id", "corridorsLayer"), 
            sn = Yn.append("g").attr("id", "historicalRoutesLayer"), ai = Yn.append("g").attr("id", "temperatureLayer"), 
            Ut = Yn.append("g").attr("id", "capitalsLayer"), $t = Yn.append("g").attr("id", "timezonesLayer"), 
            Kt = Yn.append("g").attr("id", "majorCitiesLayer"), Gt = Yn.append("g").attr("id", "naturalResourcesLayer"), 
            Yt = Yn.append("g").attr("id", "ethnicGroupsLayer"), Vt = Yn.append("g").attr("id", "oceanCurrentsLayer"), 
            Qt = Yn.append("g").attr("id", "windsLayer"), Xt = Yn.append("g").attr("id", "earthquakesLayer"), 
            Jt = Yn.append("g").attr("id", "volcanoesLayer"), nn = Yn.append("g").attr("id", "geopoliticalBlocsLayer"), 
            rn = Yn.append("g").attr("id", "historyOverlayLayer"), on = Yn.append("g").attr("id", "historyCompareOverlayLayer").style("pointer-events", "none"), 
            ln = Yn.append("g").attr("id", "histTravelersLayer"), cn = Yn.append("g").attr("id", "histCapitalsLayer"), 
            dn = Yn.append("g").attr("id", "histBattlesLayer"), un = Yn.append("g").attr("id", "histWondersLayer"), 
            pn = Yn.append("g").attr("id", "histSacredSitesLayer"), mn = Yn.append("g").attr("id", "histPhysicalLayer"), 
            an = Yn.append("g").attr("id", "desertsForestsLayer"), Zt = Yn.append("g").attr("id", "borderDisputesLayer"), 
            en = Yn.append("g").attr("id", "adminBoundariesLayer"), tn = Yn.append("g").attr("id", "glaciatedAreasLayer"), 
            ri = Yn.append("g").attr("id", "authoringMarkersLayer"), oi = Yn.append("g").attr("id", "quizMarkersLayer"), 
            Vn = Yn.append("g").attr("class", "map-transform-group"), [ ti, Zn, ei, Jn, Qn, gn, en, tn, Xn, ii, ni, sn, ai, Ut, $t, Kt, Gt, Yt, Vt, Qt, Xt, Jt, nn, rn, on, ln, cn, dn, un, pn, mn, an, Zt, ri, oi ].forEach(e => Vn.append(() => e.node())), 
            Kn = Ba(e, t), Gn = d3.geoPath(Kn), Gn.pointRadius(xi ? 1.5 : 3);
        }(), "function" == typeof window.syncOceanBackground && window.syncOceanBackground(), 
        function() {
            const e = Q.getBoundingClientRect(), t = window.devicePixelRatio || 1;
            Z.width = e.width * t, Z.height = e.height * t, Z.style.width = e.width + "px", 
            Z.style.height = e.height + "px", ee = Z.getContext("2d"), ee.scale(t, t), te && (te.width = e.width * t, 
            te.height = e.height * t, te.style.width = e.width + "px", te.style.height = e.height + "px", 
            ne = te.getContext("2d"), ne.scale(t, t));
        }(), Mo(), Sa(), Ia(), A.addEventListener("input", function() {
            const e = this.value.trim();
            if (M.innerHTML = "", !e) return void (M.style.display = "none");
            var t = [];
            if (void 0 !== Ke && "history" === Ke || void 0 !== Pe && Pe) {
                var n = "undefined" != typeof window && (window.HISTORICAL_POLITIES_DATA || window.historicalPolitiesData) || ("undefined" != typeof HISTORICAL_POLITIES_DATA ? HISTORICAL_POLITIES_DATA : null);
                if (n) for (var i in n) {
                    for (var a = n[i], r = [ a.id, a.name_ar, a.name_en, a.name_ru, a.name_uz, a.name_es, a.founder, a.founder_en, a.capital, a.capital_en ].filter(Boolean), o = 0, s = 0; s < r.length; s++) {
                        var l = Wi(r[s], e);
                        l > o && (o = l);
                    }
                    o > 0 && t.push({
                        type: "polity",
                        polity: a,
                        name: Ai(a, "name") || a.name_ar || a.name_en,
                        score: o
                    });
                }
            }
            gi.forEach(function(n) {
                var i = Ki(n, e);
                i > 0 && t.push({
                    type: "country",
                    country: n,
                    name: Hi(n),
                    score: i
                });
            }), t.sort(function(e, t) {
                return t.score - e.score;
            });
            const c = t.slice(0, xi ? 6 : 8);
            c.length ? (c.forEach(e => {
                const t = document.createElement("li"), n = document.createElement("span");
                n.className = "flag-icon", "polity" === e.type ? (n.textContent = "📜", t.appendChild(n), 
                t.appendChild(document.createTextNode(" " + e.name))) : (n.textContent = bo(e.country), 
                t.appendChild(n), t.appendChild(document.createTextNode(" " + e.name)));
                const i = t => {
                    t.preventDefault(), t.stopPropagation(), A.value = "", M.style.display = "none", 
                    A.blur(), "polity" === e.type ? Yi(e.polity) : wo(e.country);
                };
                t.addEventListener("mousedown", i), t.addEventListener("touchend", i, {
                    passive: !1
                }), M.appendChild(t);
            }), M.style.display = "block") : M.style.display = "none";
        }), A.addEventListener("blur", () => setTimeout(() => M.style.display = "none", 200)), 
        document.addEventListener("keydown", function(e) {
            if ("INPUT" === e.target.tagName) return;
            if (Te) return;
            if (D && D.classList.contains("visible")) return;
            if (F && F.classList.contains("visible")) return;
            if (yd && yd.classList.contains("visible")) return;
            if ((e.ctrlKey || e.metaKey || e.altKey) && (!e.ctrlKey || "KeyS" !== e.code)) return;
            const t = e.code;
            "KeyR" === t ? Vr("religion") : "KeyT" === t ? Vr("terrain") : "KeyD" !== t || e.shiftKey ? "KeyP" === t ? Vr("precipitation") : "KeyH" === t ? Vr("temperature") : "KeyW" === t ? Vr("gdp") : "KeyI" === t ? Vr("hdi") : "KeyN" !== t || e.shiftKey ? "KeyA" === t ? eo() : "KeyZ" === t ? to() : "KeyL" === t ? Rr() : "KeyM" === t ? no() : "KeyC" === t ? Jr() : "KeyB" !== t || e.shiftKey ? "Slash" === t || "KeySlash" === t ? H.classList.toggle("visible") : "KeyS" === t && e.ctrlKey ? (e.preventDefault(), 
            Qr()) : "Digit1" === t ? (ie = "all", Os(), $r()) : "Digit2" === t ? (ie = "muslim", 
            Os(), $r()) : "Digit3" === t ? (ie = "christian", Os(), $r()) : "Digit4" === t ? (ie = "hindu", 
            Os(), $r()) : "Digit5" === t ? (ie = "buddhist", Os(), $r()) : "Digit6" === t ? (ie = "jewish", 
            Os(), $r()) : "Digit7" === t ? (ie = "other", Os(), $r()) : "Escape" === t ? U && U.classList.contains("visible") ? Ts() : H.classList.contains("visible") ? H.classList.remove("visible") : B.click() : "Equal" === t || "NumpadAdd" === t ? Yn.transition().duration(n() ? 0 : 300).ease(d3.easeCubicOut).call(si.scaleBy, 1.35) : "Minus" === t || "NumpadSubtract" === t ? Yn.transition().duration(n() ? 0 : 300).ease(d3.easeCubicOut).call(si.scaleBy, .74) : "KeyE" === t ? Cr() : "KeyV" === t ? Lr() : "KeyO" === t ? xr() : "KeyG" === t ? zr() : "KeyY" === t ? kr() : "KeyN" === t && e.shiftKey ? Er() : "KeyD" === t && e.shiftKey ? Br() : "KeyB" === t && e.shiftKey && Sr() : Zr() : Vr("normal") : Vr("density");
        });
        const g = document.createElement("div");
        g.style.cssText = "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:1em;z-index:5;background:rgba(0,0,0,0.55);padding:16px 28px;border-radius:16px;display:flex;flex-direction:column;align-items:center;gap:10px;backdrop-filter:blur(6px);";
        const v = document.createElement("div");
        v.style.cssText = "width:36px;height:36px;border:3px solid rgba(255,255,255,0.2);border-top-color:#80c8ff;border-radius:50%;animation:spin 0.8s linear infinite;";
        const b = document.createElement("style");
        b.textContent = "@keyframes spin{to{transform:rotate(360deg)}}";
        const w = document.createElement("span");
        let E;
        w.textContent = zi("loadingMap"), g.appendChild(v), g.appendChild(w), g.appendChild(b), 
        Q.appendChild(g);
        try {
            E = await async function() {
                const e = new AbortController, t = setTimeout(() => e.abort(), 15e3);
                try {
                    const t = window.location.pathname.replace(/\/[^\/]*$/, "/"), [n, i] = await Promise.all([ fetch(t + "countries-110m.json", {
                        signal: e.signal
                    }), fetch(t + "microstates-data.json", {
                        signal: e.signal
                    }).catch(() => null) ]);
                    if (!n.ok) throw new Error("HTTP " + n.status);
                    const a = await n.json();
                    let r = topojson.feature(a, a.objects.countries).features, o = [];
                    if (i && i.ok) try {
                        const e = await i.json();
                        e && Array.isArray(e.features) && (o = e.features, r = r.concat(o));
                    } catch (e) {
                        console.warn("Could not parse microstates data:", e);
                    }
                    if (a.objects && a.objects.land) {
                        const e = topojson.feature(a, a.objects.land);
                        hn = (e.features || [ e ]).concat(o), window.allLandFeatures = hn;
                    }
                    return r;
                } finally {
                    clearTimeout(t);
                }
            }();
        } catch (e) {
            g.remove();
            const t = document.createElement("div");
            t.style.cssText = "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:0.95em;z-index:5;background:rgba(20,20,25,0.95);padding:24px 28px;border-radius:16px;display:flex;flex-direction:column;align-items:center;gap:12px;max-width:320px;text-align:center;border:1px solid rgba(255,90,90,0.4);box-shadow:0 8px 32px rgba(0,0,0,0.5);";
            const n = document.createElement("div");
            n.style.cssText = "font-size:2em;", n.textContent = "⚠️";
            const i = document.createElement("div");
            i.textContent = zi("errorLoadingMap");
            const a = document.createElement("button");
            return a.textContent = zi("retryBtn"), a.style.cssText = "padding:8px 20px;border-radius:20px;border:1px solid rgba(255,255,255,0.3);background:#2a3a58;color:#9dd0ff;cursor:pointer;font-size:1em;font-family:inherit;", 
            a.addEventListener("click", function() {
                location.reload();
            }), t.appendChild(n), t.appendChild(i), t.appendChild(a), void Q.appendChild(t);
        }
        g.remove(), function(e) {
            fn = e, window.allCountryFeatures = fn, gi = e.map(e => e.properties?.name || "").filter(e => e), 
            Qn.selectAll("*").remove(), yn = Qn.selectAll("path").data(e).join("path").attr("class", "country-path").attr("d", Gn).attr("fill", e => ma(e)).attr("stroke", e => fa(e)).attr("stroke-width", e => .8).attr("stroke-dasharray", e => (void 0 !== Pe && Pe || void 0 !== Ke && "history" === Ke) && Dn ? "4,3" : "none").attr("opacity", e => ya(e)).attr("filter", pa).attr("cursor", "pointer").attr("vector-effect", "non-scaling-stroke").attr("tabindex", 0).attr("role", "button").attr("aria-label", e => Hi(e.properties?.name || "")), 
            yn.on("mouseenter", function(e, t) {
                if (Te) return;
                var i = void 0 !== Pe && Pe || void 0 !== Ke && "history" === Ke;
                if (i && !Dn) return;
                const a = t.properties?.name || "";
                let o = Hi(a);
                i && Dn && (o += " (" + ("ar" === Ht ? "حدود معاصرة للمقارنة" : "ru" === Ht ? "современные границы" : "uz" === Ht ? "zamonaviy chegara" : "es" === Ht ? "frontera moderna" : "modern reference") + ")");
                const s = Qi(a), l = se ? Xi(a) : null;
                let c = `<div class="country-name"><strong>${o}</strong></div>`;
                if ("religion" === ae && se && l) {
                    const e = "ar" === Ht ? denominationArabic[l] || religionArabic[s] || l : "ru" === Ht ? denominationRussian[l] || religionRussian[s] || l : "uz" === Ht ? denominationUzbek[l] || religionUzbek[s] || l : "es" === Ht && (denominationSpanish[l] || religionSpanish[s]) || l;
                    c += `<div>${zi("tooltipDenom")}: ${e}</div>`;
                } else if ("religion" === ae) {
                    const e = "ar" === Ht ? religionArabic[s] || s : "ru" === Ht ? religionRussian[s] || s : "uz" === Ht ? religionUzbek[s] || s : "es" === Ht && religionSpanish[s] || s;
                    c += `<div>${zi("tooltipReligion")}: ${e}</div>`;
                }
                if ("terrain" === ae) {
                    const e = Ji(a);
                    c += `<div>${zi("tooltipElevation")}: ${null !== e ? e + " " + zi("elevationUnit") : zi("unknown")}</div>`;
                }
                if ("density" === ae) {
                    const e = Zi(a);
                    c += `<div>${zi("tooltipDensity")}: ${null !== e ? e + " " + zi("densityUnit") : zi("unknown")}</div>`;
                }
                if ("precipitation" === ae) {
                    const e = ea(a);
                    c += `<div>${zi("tooltipPrecipitation")}: ${null !== e ? e + " " + zi("precipitationUnit") : zi("unknown")}</div>`;
                }
                if ("temperature" === ae) {
                    const e = ta(a, t);
                    c += `<div>${zi("temperature")}: ${null !== e ? e + "°C" : zi("unknown")}</div>`;
                }
                if ("gdp" === ae) {
                    const e = la(a);
                    c += `<div>${zi("tooltipGDP")}: ${null !== e ? "$" + e.toLocaleString("en-US") : zi("unknown")}</div>`;
                }
                if ("hdi" === ae) {
                    const e = ca(a);
                    c += `<div>${zi("tooltipHDI")}: ${null !== e ? e.toFixed(3) : zi("unknown")}</div>`;
                }
                r.textContent = "";
                const d = document.createElement("div");
                for (d.innerHTML = c; d.firstChild; ) r.appendChild(d.firstChild);
                r.classList.add("visible"), ci.w = r.offsetWidth || 180, ci.h = r.offsetHeight || 60, 
                d3.select(this).transition().duration(n() ? 0 : 120).attr("stroke", "#fff").attr("stroke-width", 1.5);
            }).on("mousemove", function(e, t) {
                Hr = e, Fr || (Fr = !0, requestAnimationFrame(jr)), Ur(e);
            }).on("mouseleave", function() {
                r.classList.remove("visible"), d3.select(this).datum() !== vn && d3.select(this).transition().duration(n() ? 0 : 120).attr("stroke", e => fa(e)).attr("stroke-width", e => .8);
            }).on("click", Uo).on("keydown", function(e, t) {
                "Enter" !== e.key && " " !== e.key || (e.preventDefault(), Uo(e, t));
            });
            let t = 0, i = 0, a = null;
            yn.on("touchstart.peek", function(e, n) {
                1 === e.touches.length && (t = e.touches[0].clientX, i = e.touches[0].clientY, clearTimeout(a), 
                a = setTimeout(() => {
                    const e = n.properties?.name || "", a = Hi(e), o = Qi(e), s = "ar" === Ht ? religionArabic[o] || o : "ru" === Ht ? religionRussian[o] || o : "uz" === Ht ? religionUzbek[o] || o : "es" === Ht && religionSpanish[o] || o;
                    let l = `<div><strong>${a}</strong></div>`;
                    "religion" === ae && (l += `<div>${zi("tooltipReligion")}: ${s}</div>`), r.textContent = "";
                    const c = document.createElement("div");
                    for (c.innerHTML = l; c.firstChild; ) r.appendChild(c.firstChild);
                    const d = ki(), u = t - d.left, p = i - d.top;
                    r.style.left = Math.min(u + 12, d.width - 180) + "px", r.style.top = Math.max(p - 72, 4) + "px", 
                    r.classList.add("visible");
                }, 160));
            }, {
                passive: !0
            }).on("touchmove.peek", function(e) {
                if (1 !== e.touches.length) return;
                const n = e.touches[0].clientX - t, o = e.touches[0].clientY - i;
                (Math.abs(n) > 6 || Math.abs(o) > 6) && (clearTimeout(a), r.classList.remove("visible"));
            }, {
                passive: !0
            }).on("touchend.peek touchcancel.peek", function() {
                clearTimeout(a), r.classList.remove("visible");
            }, {
                passive: !0
            }), Or(e), Ta(), Fa(), Tr(), Oa(), Na(), Ra(), _s(), Yr(), Ur({
                clientX: 0,
                clientY: 0
            });
        }(E), yt = [];
        try {
            var k = localStorage.getItem("annotateColor");
            k && /^#[0-9a-f]{6}$/i.test(k) && (pt = k);
            var x = localStorage.getItem("annotateFontSize");
            x && -1 !== gt.indexOf(ts(x)) && (mt = ts(x));
        } catch (e) {}
        try {
            ns();
        } catch (e) {
            console.error("annotation draw error:", e);
        }
        !function() {
            if (Nt) return Promise.resolve(Nt);
            if (Dt) return Dt;
            var e = window.location.pathname.replace(/\/[^\/]*$/, "/");
            Dt = fetch(e + "admin-name-translations.json").then(function(e) {
                return e.ok ? e.json() : {};
            }).then(function(e) {
                return Nt = e || {}, Nt;
            }).catch(function(e) {
                return console.error("Failed to load admin name translations:", e), Dt = null, Nt = {}, 
                Nt;
            });
        }();
        try {
            !function() {
                try {
                    const u = new URLSearchParams(window.location.hash.substring(1)), p = u.get("lang");
                    p && Is.includes(p) && fo(p);
                    const f = u.get("mode");
                    f && Bs.includes(f) && Vr(f);
                    const y = u.get("filter");
                    if (y && Ss.includes(y) && (ie = y, m(h, `.religion-btn[data-religion="${ie}"]`)), 
                    Object.keys(Li).forEach(function(e) {
                        var t = Li[e];
                        "coords" !== e ? "1" !== u.get(t.hashKey) || t.getFlag() || Si(e) : "0" === u.get("coords") && t.getFlag() && Si("coords");
                    }), u.has("bloc")) {
                        const e = u.get("bloc"), t = document.getElementById("blocSelect");
                        Array.from(t.options).find(function(t) {
                            return t.value === e;
                        }) && (re = e, t.value = e);
                    }
                    if ("history" === u.get("sec")) {
                        var e = u.get("era"), t = u.get("war"), n = u.get("scen"), i = u.get("tab"), a = u.get("reg"), r = u.get("rel"), o = u.get("q"), s = u.get("yr");
                        if (a) {
                            Ge = a;
                            var l = document.getElementById("histFilterRegion");
                            l && (l.value = a);
                        }
                        if (r) {
                            Ye = r;
                            var c = document.getElementById("histFilterReligion");
                            c && (c.value = r);
                        }
                        if (null !== o) {
                            try {
                                Ve = decodeURIComponent(o);
                            } catch (e) {
                                Ve = o;
                            }
                            var d = document.getElementById("histSearchInput");
                            d && (d.value = Ve);
                        }
                        window.applySectionWhenReady && window.applySectionWhenReady("history", function() {
                            var a = Promise.resolve();
                            "faiths" === i || s ? a = a.then(function() {
                                return vl ? null : Nl();
                            }) : e && (a = a.then(function() {
                                return "function" != typeof fetchHistoricalEras || Ne ? null : fetchHistoricalEras();
                            })), a.then(function() {
                                if ("faiths" === i) Fe = "faiths"; else if (e) Fe = "eras", He = e; else if (t && nt.length) {
                                    Fe = "wars", qe = t;
                                    var a = nt.find(function(e) {
                                        return e.id === t;
                                    });
                                    a && (Oe = n && a.scenarios.some(function(e) {
                                        return e.id === n;
                                    }) ? n : a.scenarios[0].id);
                                } else "eras" === i ? Fe = "eras" : "wars" === i && (Fe = "wars");
                                if ("faiths" === i && s) {
                                    var r = parseInt(s, 10);
                                    !isNaN(r) && window.setReligionsYear && window.setReligionsYear(r);
                                }
                                window.renderHistoryBar && window.renderHistoryBar(), e || t ? window.drawHistoryScenario && window.drawHistoryScenario(!0) : "faiths" === i ? window.renderFaithsMode && window.renderFaithsMode() : (window.clearHistoryOverlay && window.clearHistoryOverlay(), 
                                window.renderHistoryEmptyState && window.renderHistoryEmptyState());
                            });
                        });
                    }
                    if (u.has("k") && u.has("x") && u.has("y")) {
                        const e = +u.get("k"), t = +u.get("x"), n = +u.get("y");
                        isFinite(e) && isFinite(t) && isFinite(n) && e >= .5 && e <= 12 && Yn.call(si.transform, d3.zoomIdentity.translate(t, n).scale(e));
                    }
                    Gr();
                } catch (e) {}
            }();
        } catch (e) {}
        try {
            yo();
        } catch (e) {
            console.error("applyLanguage error:", e);
        }
        try {
            Cs();
        } catch (e) {}
        Q.addEventListener("mousemove", Ur), Q.addEventListener("click", function(e) {
            e && e.defaultPrevented || "block" === T.style.display && !T.contains(e.target) && performance.now() - wn > 50 && Eo();
        }), Q.addEventListener("click", function(e) {
            if (e && e.defaultPrevented) return;
            if (!fe) return;
            const t = ki(), n = e.clientX - t.left, i = e.clientY - t.top, a = Math.max(.4, li.k), r = li.x, o = li.y, s = Math.max(5, Math.min(18, (xi ? 8 : 10) * Math.pow(a, .4))) + 6;
            let l = null, c = s;
            majorCitiesData.forEach(function(e) {
                if (Be && !oo(e.coords)) return;
                const [t, s] = ao()(e.coords);
                if (isNaN(t) || isNaN(s)) return;
                const d = t * a + r, u = s * a + o, p = Math.sqrt((n - d) ** 2 + (i - u) ** 2);
                p < c && (c = p, l = e);
            }), l && (e.stopPropagation(), Za(l));
        }, !0), sessionStorage.getItem("map_onboarded") ? V.style.display = "none" : (V.style.display = "block", 
        setTimeout(() => {
            V.classList.add("fade-out"), setTimeout(() => {
                V.style.display = "none";
            }, 600);
        }, 5e3), sessionStorage.setItem("map_onboarded", "1")), function() {
            var e = document.getElementById("onboardOverlay"), t = document.getElementById("onboardGlow"), n = document.getElementById("onboardCard"), i = document.getElementById("onboardCardIcon"), a = document.getElementById("onboardCardTitle"), r = document.getElementById("onboardCardText"), o = document.getElementById("onboardCardDots"), s = document.getElementById("onboardSkip"), l = document.getElementById("onboardNext");
            if (e && t && n) {
                var c = [ {
                    getEl: function() {
                        var e = window.innerWidth <= 768;
                        return document.querySelector(e ? "#mobileSearchInput" : ".search-box");
                    },
                    icon: "🔍",
                    titleKey: "onboardStep1Title",
                    textKey: "onboardStep1Text"
                }, {
                    getEl: function() {
                        return document.querySelector("#sectionToggle") || document.querySelector("#sectionGeoBtn");
                    },
                    icon: "🗺️",
                    titleKey: "onboardSectionToggleTitle",
                    textKey: "onboardSectionToggleText"
                }, {
                    getEl: function() {
                        var e = window.innerWidth <= 768;
                        return document.querySelector(e ? "#mobileLangToggle" : "#langToggle");
                    },
                    icon: "🌐",
                    titleKey: "onboardStep2Title",
                    textKey: "onboardStep2Text"
                }, {
                    getEl: function() {
                        return document.querySelector("#themeToggleBtn");
                    },
                    icon: "🌓",
                    titleKey: "onboardThemeToggleTitle",
                    textKey: "onboardThemeToggleText"
                }, {
                    getEl: function() {
                        return document.querySelector("#colorblindToggle");
                    },
                    icon: "👁️",
                    titleKey: "onboardColorblindTitle",
                    textKey: "onboardColorblindText"
                }, {
                    getEl: function() {
                        if (window.innerWidth <= 768) return document.querySelector("#mobileToolsBtn");
                        var e = document.querySelector("#toolsBtn"), t = document.querySelector("#toolsBtn");
                        if (!e || !t) return null;
                        var n = e.getBoundingClientRect(), i = t.getBoundingClientRect(), a = document.getElementById("onboardToolZone");
                        a || ((a = document.createElement("div")).id = "onboardToolZone", a.style.cssText = "position:fixed;pointer-events:none;z-index:-1;", 
                        document.body.appendChild(a));
                        var r = Math.min(n.left, i.left), o = Math.min(n.top, i.top), s = Math.max(n.right, i.right) - r, l = Math.max(n.bottom, i.bottom) - o;
                        return a.style.left = r + "px", a.style.top = o + "px", a.style.width = s + "px", 
                        a.style.height = l + "px", a;
                    },
                    icon: "🔧",
                    titleKey: "onboardStep3Title",
                    textKey: "onboardStep3Text"
                }, {
                    getEl: function() {
                        var e = window.innerWidth <= 768;
                        return document.querySelector(e ? "#mobileModeBtn" : "#modeButtons");
                    },
                    icon: "🎨",
                    titleKey: "onboardStep4Title",
                    textKey: "onboardStep4Text"
                }, {
                    getEl: function() {
                        return window.innerWidth <= 768 ? document.querySelector("#mobileModeBtn") : document.querySelector("#barDivisionBtn") || document.querySelector("#filterRow");
                    },
                    icon: "🎯",
                    titleKey: "onboardStep5Title",
                    textKey: "onboardStep5Text"
                }, {
                    getEl: function() {
                        return window.innerWidth <= 768 ? document.querySelector("#mobileLayersBtn") : document.querySelector("#barLayersBtn") || document.querySelector("#layersToggleBtn");
                    },
                    icon: "🗂️",
                    titleKey: "onboardStep6Title",
                    textKey: "onboardStep6Text"
                }, {
                    getEl: function() {
                        return document.getElementById("legend") || document.querySelector("#mapSvg");
                    },
                    icon: "📋",
                    titleKey: "onboardStep7Title",
                    textKey: "onboardStep7Text"
                }, {
                    getEl: function() {
                        return document.querySelector(".zoom-controls");
                    },
                    icon: "🔍",
                    titleKey: "onboardStep8Title",
                    textKey: "onboardStep8Text"
                }, {
                    getEl: function() {
                        var e = document.querySelector(".country-panel");
                        return e && "none" !== getComputedStyle(e).display ? e : document.querySelector("#mapSvg");
                    },
                    icon: "🌍",
                    titleKey: "onboardStep9Title",
                    textKey: "onboardStep9Text"
                }, {
                    getEl: function() {
                        var e = window.innerWidth <= 768;
                        return document.querySelector(e ? "#mobileToolsBtn" : "#quizBtn");
                    },
                    icon: "🎯",
                    titleKey: "onboardStep10Title",
                    textKey: "onboardStep10Text"
                }, {
                    getEl: function() {
                        var e = window.innerWidth <= 768;
                        return document.querySelector(e ? "#mobileToolsBtn" : "#globeViewBtn");
                    },
                    icon: "🌏",
                    titleKey: "onboardStep11Title",
                    textKey: "onboardStep11Text"
                }, {
                    getEl: function() {
                        var e = window.innerWidth <= 768;
                        return document.querySelector(e ? "#mobileToolsBtn" : "#compareProjectionsBtn");
                    },
                    icon: "📐",
                    titleKey: "onboardStep12Title",
                    textKey: "onboardStep12Text"
                }, {
                    getEl: function() {
                        var e = window.innerWidth <= 768;
                        return document.querySelector(e ? "#mobileToolsBtn" : "#annotateBtn");
                    },
                    icon: "✏️",
                    titleKey: "onboardStep13Title",
                    textKey: "onboardStep13Text"
                } ], d = [ {
                    getEl: function() {
                        window.innerWidth;
                        return document.querySelector("#historyModeDock") || document.querySelector("#histErasPopoverBtn");
                    },
                    icon: "📜",
                    titleKey: "histOnboard1Title",
                    textKey: "histOnboard1Text"
                }, {
                    getEl: function() {
                        var e = document.getElementById("historyBottomBar");
                        if (e) {
                            if ("none" === getComputedStyle(e).display) {
                                e.style.display = "flex", e.setAttribute("data-onboard-forced", "true");
                                var t = document.getElementById("historyEraTimelineWrap");
                                t && !e.querySelector('.history-bottom-inner > div:not([style*="none"])') && (t.style.display = "flex", 
                                t.setAttribute("data-onboard-forced", "true"));
                            }
                            return e;
                        }
                        return document.querySelector("#histErasTimelineWrap") || document.querySelector("#historySliderWrap");
                    },
                    icon: "⏳",
                    titleKey: "histOnboard2Title",
                    textKey: "histOnboard2Text"
                }, {
                    getEl: function() {
                        return document.getElementById("histTerrainBtn") || document.getElementById("histModernBordersToggle") || document.getElementById("histOpacityControl");
                    },
                    icon: "🏔️",
                    titleKey: "histOnboard3Title",
                    textKey: "histOnboard3Text"
                }, {
                    getEl: function() {
                        return window.innerWidth <= 768 ? document.querySelector("#mobileLayersBtn") : (document.querySelector("#barLayersBtn") || document.querySelector("#layersToggleBtn"));
                    },
                    icon: "🗂️",
                    titleKey: "histOnboardLayersTitle",
                    textKey: "histOnboardLayersText"
                }, {
                    getEl: function() {
                        return window.innerWidth <= 768 ? document.querySelector("#mobileToolsBtn") : document.querySelector("#annotateBtn");
                    },
                    icon: "✏️",
                    titleKey: "histOnboardAnnotateTitle",
                    textKey: "histOnboardAnnotateText"
                }, {
                    getEl: function() {
                        return window.innerWidth <= 768 ? document.querySelector("#mobileToolsBtn") : document.querySelector("#quizBtn");
                    },
                    icon: "🧠",
                    titleKey: "histOnboardQuizTitle",
                    textKey: "histOnboardQuizText"
                }, {
                    getEl: function() {
                        var e = window.innerWidth <= 768;
                        return document.querySelector(e ? "#mobileSearchInput" : "#searchInput") || document.querySelector(".search-box");
                    },
                    icon: "🔍",
                    titleKey: "histOnboard4Title",
                    textKey: "histOnboard4Text"
                }, {
                    getEl: function() {
                        var e = document.getElementById("onboardHistExploreZone");
                        return e && e.parentNode && e.parentNode.removeChild(e), document.getElementById("mapContainer") || document.getElementById("mapSvg") || document.querySelector("svg");
                    },
                    icon: "🏛️",
                    titleKey: "histOnboard5Title",
                    textKey: "histOnboard5Text"
                }, {
                    getEl: function() {
                        return document.getElementById("legend");
                    },
                    icon: "🎨",
                    titleKey: "histOnboard6Title",
                    textKey: "histOnboard6Text"
                }, {
                    getEl: function() {
                        return (window.innerWidth <= 768 ? document.querySelector("#mobileToolsBtn") : document.querySelector("#toolsBtn")) || document.getElementById("toolsDropdown");
                    },
                    icon: "📚",
                    titleKey: "histOnboard7Title",
                    textKey: "histOnboard7Text"
                }, {
                    getEl: function() {
                        return document.querySelector("#sectionToggle") || document.querySelector("#sectionHistoryBtn");
                    },
                    icon: "🗺️",
                    titleKey: "onboardSectionToggleTitle",
                    textKey: "onboardSectionToggleText"
                }, {
                    getEl: function() {
                        var e = window.innerWidth <= 768;
                        return document.querySelector(e ? "#mobileLangToggle" : "#langToggle");
                    },
                    icon: "🌐",
                    titleKey: "histOnboardLangTitle",
                    textKey: "histOnboardLangText"
                }, {
                    getEl: function() {
                        return document.querySelector("#themeToggleBtn");
                    },
                    icon: "🌓",
                    titleKey: "onboardThemeToggleTitle",
                    textKey: "onboardThemeToggleText"
                }, {
                    getEl: function() {
                        return document.querySelector("#colorblindToggle");
                    },
                    icon: "👁️",
                    titleKey: "onboardColorblindTitle",
                    textKey: "onboardColorblindText"
                } ], u = 0, p = !1;
                s.addEventListener("click", function() {
                    y ? B() : _();
                }), l.addEventListener("click", function() {
                    y ? function() {
                        if (++g >= v.length) return void B();
                        n.style.animation = "none", n.offsetHeight, n.style.animation = "onboardCardIn 0.35s ease both", 
                        L();
                    }() : ++u >= w().length ? _() : (n.style.animation = "none", n.offsetHeight, n.style.animation = "onboardCardIn 0.35s ease both", 
                    x());
                }), e.addEventListener("click", function(t) {
                    t.target === e && n && (n.classList.remove("onboard-pulse-hint"), n.offsetWidth, 
                    n.classList.add("onboard-pulse-hint"));
                });
                var m = C;
                window.startOnboarding = function() {
                    m();
                };
                var f = void 0 !== Ke && "history" === Ke ? "history" : "geo", h = !1;
                try {
                    h = "1" === localStorage.getItem("onboardDone_" + f) || "1" === localStorage.getItem("onboardCompleted_" + f);
                } catch (e) {}
                h || setTimeout(function() {
                    p || C();
                }, 800), window.addEventListener("resize", function() {
                    var e = w();
                    if (p && e && e[u]) {
                        var t = e[u].getEl ? e[u].getEl() : null;
                        t && (E(t), k(t));
                    }
                });
                var y = !1, g = 0, v = [ {
                    el: function() {
                        return document.getElementById("annotateBtn");
                    },
                    textKey: "annotationTutorialIntro"
                }, {
                    el: function() {
                        return document.getElementById("annotationKindRegion");
                    },
                    textKey: "annotationTutorialRegion"
                }, {
                    el: function() {
                        return document.getElementById("annotationKindDraw");
                    },
                    textKey: "annotationTutorialDraw"
                }, {
                    el: function() {
                        return document.getElementById("annotationManageBtn");
                    },
                    textKey: "annotationTutorialManage"
                }, {
                    el: function() {
                        return document.getElementById("annotationKindPin");
                    },
                    textKey: "annotationTutorialPin"
                } ];
                window.startAnnotationTutorial = function() {
                    e && t && n && (y || (y = !0, g = 0, L(), e.classList.add("active")));
                }, window.closeAnnotationTutorial = B;
            }
            function b(e) {
                var t = document.getElementById("historyBottomBar");
                if (t) if (void 0 !== Ke && "history" === Ke && 1 === e) {
                    if ("none" === getComputedStyle(t).display) {
                        t.style.display = "flex", t.setAttribute("data-onboard-forced", "true");
                        var n = document.getElementById("historyEraTimelineWrap");
                        n && !t.querySelector('.history-bottom-inner > div:not([style*="none"])') && (n.style.display = "flex", 
                        n.setAttribute("data-onboard-forced", "true"));
                    }
                    var i = document.getElementById("histTimeline");
                    !i || "none" !== getComputedStyle(i).display && i.children.length || (i.style.display = "block", 
                    i.innerHTML = '<div class="history-era-timeline-thumb" style="left:38%;"></div><span class="history-tl-dot" style="left:12%;"></span><span class="history-tl-dot active" style="left:38%;"></span><span class="history-tl-dot" style="left:64%;"></span><span class="history-tl-dot" style="left:88%;"></span>', 
                    i.setAttribute("data-onboard-forced", "true"));
                    var a = document.getElementById("histCurrentYearBadge");
                    a && !a.textContent.trim() && (a.textContent = Wc(1250), a.setAttribute("data-onboard-forced", "true"));
                } else {
                    if ("true" === t.getAttribute("data-onboard-forced")) {
                        t.removeAttribute("data-onboard-forced");
                        var r = t.querySelector('#historyEraTimelineWrap[data-onboard-forced="true"]');
                        r && (r.removeAttribute("data-onboard-forced"), r.style.display = "none"), "function" == typeof renderHistoryBar ? renderHistoryBar() : t.style.display = "none";
                    }
                    var o = document.querySelector('#histTimeline[data-onboard-forced="true"]');
                    o && (o.removeAttribute("data-onboard-forced"), o.innerHTML = "", He || (o.style.display = "none"));
                    var s = document.querySelector('#histCurrentYearBadge[data-onboard-forced="true"]');
                    s && (s.removeAttribute("data-onboard-forced"), s.textContent = "");
                }
            }
            function w() {
                return void 0 !== Ke && "history" === Ke ? d : c;
            }
            function E(e) {
                if (e) {
                    var n = e.getBoundingClientRect();
                    t.style.left = n.left - 8 + "px", t.style.top = n.top - 8 + "px", t.style.width = n.width + 16 + "px", 
                    t.style.height = n.height + 16 + "px";
                }
            }
            function k(e) {
                if (e) {
                    var t, i, a = e.getBoundingClientRect(), r = n.offsetWidth || 300, o = n.offsetHeight || 200, s = window.innerWidth, l = window.innerHeight;
                    i = a.bottom + 14, t = a.left + a.width / 2 - r / 2, i + o > l - 10 && (i = a.top - o - 14), 
                    i < 10 && (i = l / 2 - o / 2, t = s / 2 - r / 2), t < 10 && (t = 10), t + r > s - 10 && (t = s - r - 10), 
                    n.style.left = t + "px", n.style.top = i + "px";
                }
            }
            function x() {
                b(u);
                var e = w()[u], c = e.getEl ? e.getEl() : null;
                c ? (t.style.display = "", n.style.transform = "") : (t.style.display = "none", 
                n.style.left = "50%", n.style.top = "50%", n.style.transform = "translate(-50%,-50%)"), 
                i.textContent = e.icon, a.textContent = zi(e.titleKey), r.textContent = zi(e.textKey), 
                o.innerHTML = "", w().forEach(function(e, t) {
                    var n = document.createElement("span");
                    n.className = "onboard-dot" + (t === u ? " active" : ""), o.appendChild(n);
                }), s.textContent = zi("onboardSkip"), u === w().length - 1 ? l.textContent = zi("onboardFinish") : l.textContent = zi("onboardNext"), 
                l.textContent = "ar" === Ht ? l.textContent.replace("←", "→") : l.textContent.replace("→", "→"), 
                c && (E(c), k(c));
            }
            function _() {
                b(-1), e.classList.remove("active"), p = !1, t.style.width = "0", t.style.height = "0", 
                t.style.opacity = "0";
                var n = void 0 !== Ke && "history" === Ke ? "history" : "geo";
                try {
                    localStorage.setItem("onboardDone_" + n, "1");
                } catch (e) {}
                try {
                    localStorage.setItem("onboardCompleted_" + n, "1");
                } catch (e) {}
                try {
                    localStorage.setItem("onboardDone", "1");
                } catch (e) {}
                try {
                    localStorage.setItem("onboardCompleted", "1");
                } catch (e) {}
            }
            function C() {
                var n = document.getElementById("langOverlay"), i = document.getElementById("sectionPickerOverlay"), a = document.getElementById("projectionOverlay");
                n && "none" !== getComputedStyle(n).display || i && "none" !== getComputedStyle(i).display || a && a.classList.contains("active") || (u = 0, 
                e.classList.add("active"), p = !0, t.style.opacity = "1", x());
            }
            function L() {
                var e = v[g];
                i.textContent = "📝", a.textContent = zi("annotationTutorialTitle"), r.textContent = zi(e.textKey), 
                o.innerHTML = "", v.forEach(function(e, t) {
                    var n = document.createElement("span");
                    n.className = "onboard-dot" + (t === g ? " active" : ""), o.appendChild(n);
                }), s.textContent = zi("onboardSkip"), l.textContent = g === v.length - 1 ? zi("onboardFinish") : zi("onboardNext"), 
                l.textContent = "ar" === Ht ? l.textContent.replace("←", "→") : l.textContent.replace("→", "→");
                var t = e.el();
                t && (E(t), k(t));
            }
            function B() {
                if (y) {
                    y = !1, e.classList.remove("active"), t.style.width = "0", t.style.height = "0", 
                    t.style.opacity = "0";
                    try {
                        localStorage.setItem("annotateExplained", "1");
                    } catch (e) {}
                }
            }
        }(), function() {
            var t = [], i = 0, a = 0, r = [], o = null, s = 0, l = 0, d = null, u = null, p = null, f = document.getElementById("quizBtn"), y = document.getElementById("quizModeChoiceOverlay"), g = document.getElementById("quizChoiceSelective"), v = document.getElementById("quizChoiceCustom"), b = document.getElementById("quizCustomSetupOverlay"), w = document.getElementById("quizCustomCloseBtn"), E = document.getElementById("quizCustomList"), k = document.getElementById("quizCustomEmptyMsg"), x = document.getElementById("quizCustomStartBtn"), _ = document.getElementById("quizCreateBtn"), L = document.getElementById("quizCustomSearch"), B = document.getElementById("quizClearAllBtn"), S = document.getElementById("quizCustomTimeNone"), I = document.getElementById("quizCustomTimeSet"), z = document.getElementById("quizCustomTimeInputWrap"), A = document.getElementById("quizCustomTimeInput"), M = document.getElementById("quizAuthoringBanner"), P = document.getElementById("quizAuthoringInstruction"), q = document.getElementById("quizCancelAuthoringBtn"), O = document.getElementById("quizAuthoringOverlay"), R = document.getElementById("quizAuthoringStatusRow"), N = document.getElementById("quizAuthoringStatus"), D = document.getElementById("quizAuthoringFormFields"), F = document.getElementById("quizAuthoringActions"), H = document.getElementById("quizMarkerPoint"), j = document.getElementById("quizMarkerLine"), W = document.getElementById("quizPromptInput"), U = document.getElementById("quizSaveQuestionBtn"), $ = document.getElementById("quizSaveCancelBtn"), K = document.getElementById("quizAuthoringAnswerFormatRow"), G = document.getElementById("quizAnswerFormatTF"), Y = document.getElementById("quizAnswerFormatWritten"), V = document.getElementById("quizAnswerFormatMC"), J = document.getElementById("quizAuthoringMCChoicesRow"), te = document.getElementById("quizAuthoringChoicesList"), ne = document.getElementById("quizAddChoiceBtn"), re = document.getElementById("quizHudWrittenRow"), oe = document.getElementById("quizWrittenInput"), se = document.getElementById("quizWrittenSubmitBtn"), ce = document.getElementById("quizHudMCRow"), ue = document.getElementById("quizAuthoringTFAnswerRow"), pe = document.getElementById("quizTFAnswerTrue"), me = (document.getElementById("quizTFAnswerFalse"), 
            document.getElementById("quizHudTFRow")), fe = document.getElementById("quizTFTrueBtn"), he = document.getElementById("quizTFFalseBtn"), ye = document.getElementById("quizReviewOverlay"), ge = document.getElementById("quizReviewProgress"), ve = document.getElementById("quizReviewCard"), be = document.getElementById("quizReviewPrompt"), we = document.getElementById("quizReviewClickInfo"), Ee = document.getElementById("quizReviewCorrectBtn"), xe = document.getElementById("quizReviewIncorrectBtn"), _e = document.getElementById("quizReviewDone"), Ce = document.getElementById("quizReviewBackBtn"), Le = [], Se = [], Ie = [], ze = [], Ae = [], Me = 0, lt = 0, ct = null, dt = null, ut = 0, pt = null, mt = null, ft = !1, ht = "point", yt = [], gt = null, vt = null, bt = null, wt = [], Et = [], kt = 0, xt = null, _t = document.getElementById("quizSetupOverlay"), Ct = document.getElementById("quizScopeChips"), Lt = document.getElementById("quizScopeTabs"), Bt = document.getElementById("quizContinentsList"), St = document.getElementById("quizCountriesList"), Mt = document.getElementById("quizCountryChecklist"), Tt = document.getElementById("quizCountrySearch"), Pt = document.getElementById("quizBlocsList"), qt = document.getElementById("quizLayerCheckboxes"), Ot = document.getElementById("quizNumInput"), Rt = document.getElementById("quizTimeModeSet"), Nt = document.getElementById("quizTimeInputWrap"), Dt = document.getElementById("quizTimeInput"), Ft = document.getElementById("quizStartBtn"), jt = document.getElementById("quizHudOverlay"), Wt = document.getElementById("quizHudQuestion"), hn = document.getElementById("quizHudPrompt"), gn = document.getElementById("quizHudScore"), bn = document.getElementById("quizHudTimer"), En = document.getElementById("quizFeedback"), kn = (document.getElementById("measureResultLabel"), 
            document.getElementById("quizEndOverlay")), xn = document.getElementById("quizFinalScore"), Cn = document.getElementById("quizMissedList"), Ln = document.getElementById("quizExitBtn"), Sn = document.getElementById("quizEndEarlyBtn"), In = document.getElementById("quizTypedAnswerInput"), zn = document.getElementById("quizTypedSubmitBtn"), An = {
                continents: [],
                countries: [],
                blocs: []
            };
            function Tn(e) {
                return Hi(e) || e;
            }
            function Pn(e) {
                var t = geopoliticalBlocsData.find(function(t) {
                    return t.name_en === e;
                });
                return t ? "ar" === Ht ? t.name : "ru" === Ht ? t.name_ru || t.name_en : "uz" === Ht ? t.name_uz || t.name_en : "es" === Ht && t.name_es || t.name_en : e;
            }
            function Dn(e, t) {
                An[e] = An[e].filter(function(e) {
                    return e !== t;
                }), jn(), Wn();
            }
            function Fn(e, t) {
                -1 !== An[e].indexOf(t) ? Dn(e, t) : function(e, t) {
                    -1 === An[e].indexOf(t) && An[e].push(t), jn(), Wn();
                }(e, t);
            }
            function jn() {
                Ct.innerHTML = "";
                var e = [];
                An.continents.forEach(function(t) {
                    e.push({
                        type: "continents",
                        enName: t,
                        label: Tn(t)
                    });
                }), An.countries.forEach(function(t) {
                    e.push({
                        type: "countries",
                        enName: t,
                        label: Tn(t)
                    });
                }), An.blocs.forEach(function(t) {
                    e.push({
                        type: "blocs",
                        enName: t,
                        label: Pn(t)
                    });
                }), e.forEach(function(e) {
                    var t = document.createElement("span");
                    t.className = "quiz-scope-chip", t.textContent = e.label + " ";
                    var n = document.createElement("span");
                    n.className = "quiz-scope-chip-remove", n.textContent = "×", n.addEventListener("click", function(e, t) {
                        return function(n) {
                            n.stopPropagation(), Dn(e, t);
                        };
                    }(e.type, e.enName)), t.appendChild(n), Ct.appendChild(t);
                });
            }
            function Wn() {
                Bt.querySelectorAll('input[type="checkbox"]').forEach(function(e) {
                    e.checked = -1 !== An.continents.indexOf(e.value);
                }), Mt.querySelectorAll('input[type="checkbox"]').forEach(function(e) {
                    e.checked = -1 !== An.countries.indexOf(e.value);
                }), Pt.querySelectorAll('input[type="checkbox"]').forEach(function(e) {
                    e.checked = -1 !== An.blocs.indexOf(e.value);
                });
            }
            function Un() {
                var e, t;
                Bt.innerHTML = "", (e = {}, Object.values(continentByCountry).forEach(function(t) {
                    e[t] = !0;
                }), Object.keys(e).sort()).forEach(function(e) {
                    var t = document.createElement("label");
                    t.className = "quiz-scope-item";
                    var n, i, a = document.createElement("input");
                    a.type = "checkbox", a.value = e, a.checked = -1 !== An.continents.indexOf(e), a.addEventListener("change", (n = e, 
                    function() {
                        Fn("continents", n);
                    })), t.appendChild(a), t.appendChild(document.createTextNode(" " + (i = e, "ar" === Ht ? continentArabic[i] || i : "ru" === Ht ? continentRussian[i] || i : "uz" === Ht ? continentUzbek[i] || i : "es" === Ht && continentSpanish[i] || i))), 
                    Bt.appendChild(t);
                }), Mt.innerHTML = "", Tt && (Tt.value = ""), (t = Object.keys(continentByCountry), 
                t.sort(), t).forEach(function(e) {
                    var t = document.createElement("label");
                    t.className = "quiz-scope-item";
                    var n, i = document.createElement("input");
                    i.type = "checkbox", i.value = e, i.checked = -1 !== An.countries.indexOf(e), i.addEventListener("change", (n = e, 
                    function() {
                        Fn("countries", n);
                    })), t.appendChild(i), t.appendChild(document.createTextNode(" " + Tn(e))), Mt.appendChild(t);
                }), Pt.innerHTML = "", geopoliticalBlocsData.map(function(e) {
                    return e.name_en;
                }).sort().forEach(function(e) {
                    var t = document.createElement("label");
                    t.className = "quiz-scope-item";
                    var n, i = document.createElement("input");
                    i.type = "checkbox", i.value = e, i.checked = -1 !== An.blocs.indexOf(e), i.addEventListener("change", (n = e, 
                    function() {
                        Fn("blocs", n);
                    })), t.appendChild(i), t.appendChild(document.createTextNode(" " + Pn(e))), Pt.appendChild(t);
                });
            }
            var $n = !1;
            function Yn(e) {
                if (!e || e.length < 2) return null;
                var t = Array.isArray(e[0]) ? e[0] : e;
                if ("number" != typeof t[0]) return null;
                for (var n = 0; n < fn.length; n++) {
                    var i = fn[n];
                    try {
                        if (d3.geoContains(i, t)) return i.properties?.name || null;
                    } catch (e) {}
                }
                return null;
            }
            function Vn(e, t, n) {
                if (0 === n.continents.length && 0 === n.countries.length && 0 === n.blocs.length) return !0;
                var i = function(e, t) {
                    if ("countries" === t) return [ e.properties?.name || "" ];
                    if ("capitals" === t) {
                        var n = Yn(e.capital_coords);
                        return n ? [ n ] : [];
                    }
                    if ("geopoliticalBlocs" === t) return e.members || [];
                    var i = e.countries_en || e.countries_ar || "";
                    if (i) return i.split(",").map(function(e) {
                        return e.trim();
                    }).filter(Boolean);
                    var a = ei(e, t);
                    if (a) {
                        var r = Yn(a);
                        return r ? [ r ] : [];
                    }
                    return [];
                }(e, t);
                return i.some(function(e) {
                    return -1 !== n.countries.indexOf(e) || (-1 !== n.continents.indexOf(continentByCountry[e]) || n.blocs.some(function(t) {
                        var n = geopoliticalBlocsData.find(function(e) {
                            return e.name_en === t;
                        });
                        return n && -1 !== n.members.indexOf(e);
                    }));
                });
            }
            var Zn = [ {
                id: "countries",
                labelKey: "quizCountries",
                checkType: "polygon"
            }, {
                id: "naturalResources",
                labelKey: "quizNaturalResources",
                checkType: "point"
            }, {
                id: "ethnicGroups",
                labelKey: "quizEthnicGroups",
                checkType: "point"
            }, {
                id: "corridors",
                labelKey: "quizCorridors",
                checkType: "line"
            }, {
                id: "borderDisputes",
                labelKey: "quizBorderDisputes",
                checkType: "point"
            }, {
                id: "desertsForests",
                labelKey: "quizDesertsForests",
                checkType: "polygon"
            }, {
                id: "geopoliticalBlocs",
                labelKey: "quizGeopoliticalBlocs",
                checkType: "bloc"
            }, {
                id: "volcanoes",
                labelKey: "quizVolcanoes",
                checkType: "point"
            }, {
                id: "earthquakes",
                labelKey: "quizEarthquakes",
                checkType: "point"
            }, {
                id: "majorCities",
                labelKey: "quizMajorCities",
                checkType: "point"
            }, {
                id: "capitals",
                labelKey: "quizCapitals",
                checkType: "point"
            }, {
                id: "rivers",
                labelKey: "quizRivers",
                checkType: "line"
            } ];
            function ei(e, t) {
                return "countries" === t ? e.properties?.centroid || null : "capitals" === t ? e.capital_coords || null : e.coords || null;
            }
            function ti() {
                Un(), function() {
                    if (!$n) {
                        $n = !0;
                        var e = Lt.querySelectorAll(".quiz-scope-tab"), t = [ Bt, St, Pt ];
                        e.forEach(function(n, i) {
                            n.addEventListener("click", function() {
                                e.forEach(function(e) {
                                    e.classList.remove("active");
                                }), n.classList.add("active"), t.forEach(function(e, t) {
                                    e.style.display = t === i ? "" : "none";
                                });
                            });
                        }), Tt.addEventListener("input", function(e) {
                            var t = e.target.value.trim();
                            Mt.querySelectorAll(".quiz-scope-item").forEach(function(e) {
                                if (t) {
                                    var n = e.querySelector("input"), i = n ? n.value : "", a = !!i && Gi(i, t);
                                    a || (a = Ui(e.textContent.trim(), t)), e.style.display = a ? "" : "none";
                                } else e.style.display = "";
                            });
                        });
                    }
                }(), jn();
                var e = Lt.querySelectorAll(".quiz-scope-tab");
                e[0].textContent = zi("quizTabContinents"), e[1].textContent = zi("quizTabCountries"), 
                e[2].textContent = zi("quizTabBlocs"), qt.innerHTML = "", Zn.forEach(function(e) {
                    var t = document.createElement("label");
                    t.className = "quiz-checkbox-label";
                    var n = document.createElement("input");
                    n.type = "checkbox", n.value = e.id, n.checked = !0, t.appendChild(n), t.appendChild(document.createTextNode(" " + zi(e.labelKey))), 
                    qt.appendChild(t);
                }), document.getElementById("quizSetupTitle").textContent = zi("quizSetup"), document.getElementById("quizRegionLabel").textContent = zi("quizRegion"), 
                document.getElementById("quizLayersLabel").textContent = zi("quizLayers"), document.getElementById("quizNumLabel").textContent = zi("quizNumQuestions"), 
                document.getElementById("quizTimeLabel").textContent = zi("quizTimeLimit"), document.getElementById("quizNoLimitText").textContent = zi("quizNoLimit"), 
                document.getElementById("quizSetLimitText").textContent = zi("quizSetLimitText"), 
                document.getElementById("quizMinutesText").textContent = zi("quizMinutes"), Ft.textContent = zi("quizStart");
                var qEnd = document.getElementById("quizEndEarlyBtn");
                if (qEnd) qEnd.textContent = zi("quizEndEarlyBtn");
                if (zn) zn.textContent = zi("quizTypedAnswerSubmit");
                if (Tt) Tt.placeholder = zi("quizSearchCountry");
                var sni = document.getElementById("quizStudentNameInput");
                if (sni) sni.placeholder = zi("quizStudentNamePlaceholder");
                var sci = document.getElementById("quizSessionCodeInput");
                if (sci) sci.placeholder = zi("quizSessionCodePlaceholder");
                var t = document.getElementById("quizCreateSessionBtn");
                if (t) {
                    t.textContent = zi("quizCreateSession");
                    t.style.display = "";
                    var sc = document.getElementById("quizSessionCreated");
                    if (sc) sc.style.display = "none";
                    if (It && sci && sni) { sci.value = It; sni.value = zt || ""; }
                }
                No();
            }
            function ai() {
                var e = [];
                if (qt.querySelectorAll('input[type="checkbox"]:checked').forEach(function(t) {
                    e.push(t.value);
                }), 0 === e.length) return [];
                var t = parseInt(Ot.value) || 10;
                t = Math.max(5, Math.min(30, t));
                var n = [];
                if (e.forEach(function(e) {
                    var t = function(e) {
                        if ("countries" === e) return fn || [];
                        if ("naturalResources" === e) return naturalResourcesData || [];
                        if ("ethnicGroups" === e) return ethnicGroupsData || [];
                        if ("corridors" === e) return corridorsData || [];
                        if ("borderDisputes" === e) return borderDisputesData || [];
                        if ("desertsForests" === e) return desertsForestsData || [];
                        if ("geopoliticalBlocs" === e) return geopoliticalBlocsData || [];
                        if ("volcanoes" === e) return volcanoesData || [];
                        if ("earthquakes" === e) return earthquakesData || [];
                        if ("majorCities" === e) return majorCitiesData || [];
                        if ("capitals" === e) {
                            var t = [];
                            return Object.entries(countryInfo).forEach(function(e) {
                                var n = e[1];
                                n.capital_coords && t.push({
                                    name: e[0],
                                    capital_ar: n.capital_ar,
                                    capital_en: n.capital_en,
                                    capital_ru: n.capital_ru,
                                    capital_uz: n.capital_uz,
                                    capital_es: n.capital_es,
                                    capital_coords: n.capital_coords
                                });
                            }), t;
                        }
                        return "rivers" === e && rivers || [];
                    }(e);
                    t.forEach(function(t) {
                        if (Vn(t, e, An)) {
                            var i = function(e, t) {
                                return "countries" === t ? Hi(e.properties?.name || "") : "capitals" === t ? "ar" === Ht ? e.capital_ar : "ru" === Ht ? e.capital_ru || e.capital_en : "uz" === Ht ? e.capital_uz || e.capital_en : "es" === Ht && e.capital_es || e.capital_en : "corridors" === t || "borderDisputes" === t ? "ar" === Ht ? e.name_ar : "ru" === Ht ? e.name_ru || e.name_en : "uz" === Ht ? e.name_uz || e.name_en : "es" === Ht && e.name_es || e.name_en : "geopoliticalBlocs" === t ? "ar" === Ht ? e.name : "ru" === Ht ? e.name_ru || e.name_en : "uz" === Ht ? e.name_uz || e.name_en : "es" === Ht && e.name_es || e.name_en : "ar" === Ht ? e.name : "ru" === Ht ? e.name_ru || e.name_en : "uz" === Ht ? e.name_uz || e.name_en : "es" === Ht ? e.name_es || e.name_en : e.name_en || e.name;
                            }(t, e);
                            i && n.push({
                                item: t,
                                layerId: e,
                                name: i
                            });
                        }
                    });
                }), 0 === n.length) return [];
                var i = {}, a = [];
                n.forEach(function(e) {
                    var t = e.layerId + "::" + e.name.trim().toLowerCase();
                    i[t] || (i[t] = !0, a.push(e));
                });
                var r = a.sort(function() {
                    return Math.random() - .5;
                });
                return r.slice(0, Math.min(t, r.length));
            }
            function ci(e) {
                return "histRole" + e.charAt(0).toUpperCase() + e.slice(1);
            }
            var di = {
                allies: "blue",
                entente: "blue",
                axis: "red",
                central: "red",
                delian: "blue",
                persia: "gold",
                coalition: "blue",
                axis_coalition: "red",
                republic: "blue",
                empire: "purple",
                confederacy: "gold",
                union: "blue",
                islamic: "green",
                crusaders: "red",
                byzantine: "purple",
                rome: "red",
                carthage: "teal",
                athens: "blue",
                sparta: "red"
            }, ui = {
                blue: {
                    major: "#1d4ed8",
                    primary: "#1d4ed8",
                    ally: "#3b82f6",
                    dominion: "#0284c7",
                    colony: "#38bdf8",
                    protectorate: "#7dd3fc",
                    occupied: "#64748b"
                },
                red: {
                    major: "#b91c1c",
                    primary: "#b91c1c",
                    ally: "#ef4444",
                    dominion: "#dc2626",
                    colony: "#f87171",
                    protectorate: "#fca5a5",
                    occupied: "#64748b"
                },
                green: {
                    major: "#15803d",
                    primary: "#15803d",
                    ally: "#22c55e",
                    dominion: "#16a34a",
                    colony: "#4ade80",
                    protectorate: "#86efac",
                    occupied: "#64748b"
                },
                purple: {
                    major: "#7e22ce",
                    primary: "#7e22ce",
                    ally: "#a855f7",
                    dominion: "#9333ea",
                    colony: "#c084fc",
                    protectorate: "#d8b4fe",
                    occupied: "#64748b"
                },
                gold: {
                    major: "#b45309",
                    primary: "#b45309",
                    ally: "#f59e0b",
                    dominion: "#d97706",
                    colony: "#fbbf24",
                    protectorate: "#fde68a",
                    occupied: "#64748b"
                },
                teal: {
                    major: "#0f766e",
                    primary: "#0f766e",
                    ally: "#14b8a6",
                    dominion: "#0d9488",
                    colony: "#2dd4bf",
                    protectorate: "#99f6e4",
                    occupied: "#64748b"
                }
            };
            function pi(e, t) {
                if (!e || "neutral" === e.role) return null;
                t = t || mi();
                var n = function(e, t) {
                    if (!e) return "blue";
                    var n = String(e).toLowerCase();
                    if (di[n]) return di[n];
                    if ((t = t || mi()) && t.sides) {
                        var i = Object.keys(t.sides).indexOf(e), a = [ "green", "purple", "gold", "red", "blue", "teal" ];
                        if (i >= 0) return a[i % a.length];
                    }
                    return "blue";
                }(e.side, t), i = ui[n] || ui.blue;
                return "occupied" === e.role ? i.occupied || i.major : i[e.role] || i.major || "#8d97a5";
            }
            function mi() {
                return qe && nt.find(function(e) {
                    return e.id === qe;
                }) || null;
            }
            function fi(e, t) {
                if (!e) return null;
                if (t = t || Xe || "peak", e._phaseScenarios || (e._phaseScenarios = {}), e._phaseScenarios[t]) return e._phaseScenarios[t];
                var n = e.scenarios && e.scenarios[0] || {
                    participants: [],
                    empires: []
                }, i = e.years_ar || e.years_en || n && n.year || "", a = i.match(/(\d+)(?:[^\d]+(\d+))?/), r = a ? parseInt(a[1], 10) : 0, o = a && a[2] ? parseInt(a[2], 10) : r ? r + 4 : 0, s = -1 !== i.indexOf("BCE") || -1 !== i.indexOf("ق.م"), l = s ? " ق.م" : " م", c = r ? r + l : n.year || "", d = o ? o + l : r ? r + (s ? -4 : 4) + l : "", u = r && o ? Math.round((r + o) / 2) : r, p = u ? u + l : n.year || "";
                if ("wwi" === e.id || "ww1-1914" === e.id || "ww1" === e.id) {
                    if ("start" === t) return e._phaseScenarios.start = {
                        id: "ww1-start",
                        year: "1914 م",
                        phase: "start",
                        title_ar: "المرحلة الأولى: اندلاع الحرب واغتيال الأرشيدوق (1914 م)",
                        title_en: "Outbreak Phase: Declarations of War (1914)",
                        title_ru: "Первый этап: Начало войны и сараевское убийство (1914 г.)",
                        title_uz: "Birinchi bosqich: Urush boshlanishi va Saraevo suiqasdi (1914-y.)",
                        title_es: "Primera fase: Estallido de la guerra y asesinato de Sarajevo (1914)",
                        desc_ar: "اندلاع الحرب إثر اغتيال الأرشيدوق فرانز فرديناند؛ النمسا-المجر وألمانيا تعلنان الحرب على صربيا وروسيا وفرنسا، وبريطانيا تتدخل بعد غزو بلجيكا.",
                        desc_en: "Outbreak of WWI following the Sarajevo assassination; Germany and Austria-Hungary vs Serbia, Russia, France, Belgium, and Britain.",
                        desc_ru: "Начало Первой мировой войны после убийства эрцгерцога Франца Фердинанда: Австро-Венгрия и Германия против Сербии, России, Франции, Бельгии и Великобритании.",
                        desc_uz: "Ertsgersog Frans Ferdinand suiqasdidan so‘ng Birinchi jahon urushining boshlanishi: Avstriya-Vengriya va Germaniya Serbiya, Rossiya va Fransiyaga urush e’lon qildi.",
                        desc_es: "Estallido de la Primera Guerra Mundial tras el magnicidio de Sarajevo: Austria-Hungría y Alemania contra Serbia, Rusia, Francia, Bélgica y Gran Bretaña.",
                        participants: [ {
                            c: "Austria",
                            side: "central",
                            role: "major"
                        }, {
                            c: "Hungary",
                            side: "central",
                            role: "major"
                        }, {
                            c: "Germany",
                            side: "central",
                            role: "major"
                        }, {
                            c: "Serbia",
                            side: "allies",
                            role: "major"
                        }, {
                            c: "Russia",
                            side: "allies",
                            role: "major"
                        }, {
                            c: "France",
                            side: "allies",
                            role: "major"
                        }, {
                            c: "Belgium",
                            side: "allies",
                            role: "major"
                        }, {
                            c: "United Kingdom",
                            side: "allies",
                            role: "major"
                        } ],
                        empires: [ {
                            id: "austria_hungary",
                            side: "central",
                            role: "major",
                            members: [ "Austria", "Hungary", "Czech Republic", "Slovakia", "Bosnia and Herzegovina", "Croatia", "Slovenia" ]
                        } ]
                    }, e._phaseScenarios.start;
                    if ("end" === t) return e._phaseScenarios.end = {
                        id: "ww1-end",
                        year: "1918–1919 م",
                        phase: "end",
                        title_ar: "المرحلة الثالثة: الهدنة ومعاهدة فرساي وتفكك الإمبراطوريات (1919 م)",
                        title_en: "Final Phase: Armistice, Versailles & Fall of Empires (1919)",
                        title_ru: "Третий этап: Перемирие, Версальский мир и распад империй (1919 г.)",
                        title_uz: "Uchinchi bosqich: Sulh, Versal shartnomasi va imperiyalarning qulashi (1919-y.)",
                        title_es: "Tercera fase: Armisticio, Tratado de Versalles y caída de imperios (1919)",
                        desc_ar: "انهيار دول المركز واستسلام ألمانيا والنمسا؛ توقيع معاهدة فرساي، تفكك إمبراطورية هابسبورغ والدولة العثمانية، ونشأة دول جديدة في أوروبا والشرق.",
                        desc_en: "Armistice and Treaty of Versailles: Collapse and partition of Austro-Hungarian, Ottoman, and Russian empires.",
                        desc_ru: "Крах Центральных держав и капитуляция Германии и Австро-Венгрии; Версальский мир, распад империй и возникновение новых государств.",
                        desc_uz: "Markaziy davlatlarning mag‘lubiyati, Germaniya va Avstriyaning taslim bo‘lishi; Versal tinchlik shartnomasi, imperiyalarning parchalanishi.",
                        desc_es: "Capitulación de las Potencias Centrales y firma del Tratado de Versalles: partición de los imperios austrohúngaro y otomano.",
                        participants: [ {
                            c: "United States",
                            side: "allies",
                            role: "major"
                        }, {
                            c: "United Kingdom",
                            side: "allies",
                            role: "major"
                        }, {
                            c: "France",
                            side: "allies",
                            role: "major"
                        }, {
                            c: "Italy",
                            side: "allies",
                            role: "major"
                        }, {
                            c: "Germany",
                            side: "central",
                            role: "occupied"
                        }, {
                            c: "Austria",
                            side: "central",
                            role: "occupied"
                        }, {
                            c: "Hungary",
                            side: "central",
                            role: "occupied"
                        }, {
                            c: "Turkey",
                            side: "central",
                            role: "occupied"
                        } ],
                        empires: []
                    }, e._phaseScenarios.end;
                }
                if ("wwii" === e.id || "ww2-1939" === e.id || "ww2" === e.id) {
                    if ("start" === t) return e._phaseScenarios.start = {
                        id: "ww2-start",
                        year: "1939 م",
                        phase: "start",
                        title_ar: "المرحلة الأولى: غزو بولندا واندلاع الحرب في أوروبا (1939 م)",
                        title_en: "Outbreak Phase: Invasion of Poland (1939)",
                        title_ru: "Первый этап: Вторжение в Польшу и начало войны в Европе (1939 г.)",
                        title_uz: "Birinchi bosqich: Polshaga bostirib kirish va Yevropada urush boshlanishi (1939-y.)",
                        title_es: "Primera fase: Invasión de Polonia y estallido en Europa (1939)",
                        desc_ar: "ألمانيا تشن هجوم البليتزكريغ (الحرب الخاطفة) على بولندا في سبتمبر 1939؛ بريطانيا وفرنسا تعلنان الحرب دعماً لبولندا، بينما بقيت الولايات المتحدة والاتحاد السوفيتي على الحياد.",
                        desc_en: "German Blitzkrieg invasion of Poland; Britain and France declare war while the US and USSR remain neutral.",
                        desc_ru: "Германия начинает блицкриг против Польши; Великобритания и Франция объявляют войну Германии в поддержку Польши.",
                        desc_uz: "Germaniyaning Polshaga qarshi blitskrigi; Buyuk Britaniya va Fransiya Polshani himoya qilib urush e’lon qiladi.",
                        desc_es: "Invasión alemana de Polonia mediante guerra relámpago; Gran Bretaña y Francia declaran la guerra en apoyo a Polonia.",
                        participants: [ {
                            c: "Germany",
                            side: "axis",
                            role: "major"
                        }, {
                            c: "Poland",
                            side: "allies",
                            role: "occupied"
                        }, {
                            c: "United Kingdom",
                            side: "allies",
                            role: "major"
                        }, {
                            c: "France",
                            side: "allies",
                            role: "major"
                        }, {
                            c: "Australia",
                            side: "allies",
                            role: "ally"
                        }, {
                            c: "New Zealand",
                            side: "allies",
                            role: "ally"
                        } ],
                        empires: []
                    }, e._phaseScenarios.start;
                    if ("end" === t) return e._phaseScenarios.end = {
                        id: "ww2-end",
                        year: "1945 م",
                        phase: "end",
                        title_ar: "المرحلة الثالثة: استسلام المحور وتأسيس النظام العالمي الجديد (1945 م)",
                        title_en: "Final Phase: Unconditional Surrender & New World Order (1945)",
                        title_ru: "Третий этап: Капитуляция стран Оси и новый мировой порядок (1945 г.)",
                        title_uz: "Uchinchi bosqich: O‘q davlatlarining taslim bo‘lishi va yangi dunyo tartibi (1945-y.)",
                        title_es: "Tercera fase: Rendición del Eje y nuevo orden mundial (1945)",
                        desc_ar: "استسلام ألمانيا في مايو واليابان في سبتمبر 1945 إثر القنبلتين النوويتين؛ تقسيم ألمانيا والنمسا لمناطق احتلال، وانتصار الحلفاء وتأسيس الأمم المتحدة.",
                        desc_en: "Unconditional surrender of Axis powers; Allied victory, partition of Germany into occupation zones, and founding of the UN.",
                        desc_ru: "Безоговорочная капитуляция Германии и Японии; раздел Германии на зоны оккупации, победа союзников и создание ООН.",
                        desc_uz: "Germaniya va Yaponiyaning so‘zsiz taslim bo‘lishi; Germaniyaning ishg‘ol zonalariga bo‘linishi, Ittifoqchilar g‘alabasi va BMT tashkil etilishi.",
                        desc_es: "Rendición incondicional de las potencias del Eje; victoria aliada, división de Alemania en zonas de ocupación y creación de la ONU.",
                        participants: [ {
                            c: "United States",
                            side: "allies",
                            role: "major"
                        }, {
                            c: "Russia",
                            side: "allies",
                            role: "major"
                        }, {
                            c: "United Kingdom",
                            side: "allies",
                            role: "major"
                        }, {
                            c: "France",
                            side: "allies",
                            role: "major"
                        }, {
                            c: "China",
                            side: "allies",
                            role: "major"
                        }, {
                            c: "Germany",
                            side: "axis",
                            role: "occupied"
                        }, {
                            c: "Japan",
                            side: "axis",
                            role: "occupied"
                        }, {
                            c: "Italy",
                            side: "allies",
                            role: "ally"
                        } ],
                        empires: []
                    }, e._phaseScenarios.end;
                }
                if ("alexander-334" === e.id) {
                    if ("start" === t) return e._phaseScenarios.start = {
                        id: "alex-start",
                        year: "334 ق.م",
                        phase: "start",
                        title_ar: "المرحلة الأولى: عبور الدردنيل ومعركة الغرانيكوس (334 ق.م)",
                        title_en: "Initial Phase: Crossing the Hellespont (334 BCE)",
                        title_ru: "Первый этап: Переправа через Геллеспонт и битва при Гранике (334 г. до н.э.)",
                        title_uz: "Birinchi bosqich: Dardanel bo‘g‘ozidan o‘tish va Granik jangi (mil. avv. 334-y.)",
                        title_es: "Primera fase: Cruce del Helesponto y batalla del Gránico (334 a.C.)",
                        desc_ar: "الإسكندر الأكبر يعبر مضيق الدردنيل بجيش مقدوني وإغريقي مشترك محققاً نصره الأول على السطارفة الفرس في معركة نهر الغرانيكوس غرب الأناضول.",
                        desc_en: "Alexander crosses into Asia Minor and wins the Battle of the Granicus against Persian satraps.",
                        desc_ru: "Александр Македонский переправляется через Геллеспонт и одерживает победу над персидскими сатрапами в битве при Гранике.",
                        desc_uz: "Iskandar Zulqarnayn birlashgan qo‘shini bilan Dardanel bo‘g‘ozidan o‘tib, Granik jangida forslarni mag‘lub etadi.",
                        desc_es: "Alejandro Magno cruza hacia Asia Menor con el ejército greco-macedonio y vence a los sátrapas persas en el Gránico.",
                        participants: [ {
                            c: "Greece",
                            side: "delian",
                            role: "major",
                            polity_id: "macedonian-empire"
                        }, {
                            c: "North Macedonia",
                            side: "delian",
                            role: "major",
                            polity_id: "macedonian-empire"
                        }, {
                            c: "Turkey",
                            side: "persia",
                            role: "occupied",
                            polity_id: "achaemenid"
                        }, {
                            c: "Iran",
                            side: "persia",
                            role: "major",
                            polity_id: "achaemenid"
                        } ],
                        empires: []
                    }, e._phaseScenarios.start;
                    if ("end" === t) return e._phaseScenarios.end = {
                        id: "alex-end",
                        year: "323 ق.م",
                        phase: "end",
                        title_ar: "المرحلة الثالثة: وفاة الإسكندر وتقسيم ملوك الطوائف (323 ق.م)",
                        title_en: "Final Phase: Death in Babylon & Division of Diadochi (323 BCE)",
                        title_ru: "Третий этап: Смерть Александра и раздел диадохов (323 г. до н.э.)",
                        title_uz: "Uchinchi bosqich: Iskandarning vafoti va diodoxlar taqsimoti (mil. avv. 323-y.)",
                        title_es: "Tercera fase: Muerte de Alejandro y división de los diádocos (323 a.C.)",
                        desc_ar: "وفاة الإسكندر المفاجئة في قصر نبوخذ نصر ببابل دون وريث ناضج؛ قادته يقتسمون الإمبراطورية إلى ممالك هيلينستية (البطالمة في مصر، السلوقيون في الشام والعراق، والأنتيجونيون في مقدونيا).",
                        desc_en: "Alexander dies in Babylon; his generals (Diadochi) partition the vast empire into Ptolemaic, Seleucid, and Antigonid realms.",
                        desc_ru: "Смерть Александра в Вавилоне; его военачальники (диадохи) делят империю на царства Птолемеев, Селевкидов и Антигонидов.",
                        desc_uz: "Iskandarning Bobilda vafoti; lashkarboshilari imperiyani ellinistik saltanatlarga (Ptolemeylar, Salavkiylar, Antigoniylar) bo‘lib olishadi.",
                        desc_es: "Muerte repentina de Alejandro en Babilonia; sus generales (diádocos) dividen el imperio en reinos helenísticos.",
                        participants: [ {
                            c: "Egypt",
                            side: "delian",
                            role: "major",
                            polity_id: "macedonian-empire"
                        }, {
                            c: "Syria",
                            side: "delian",
                            role: "major",
                            polity_id: "macedonian-empire"
                        }, {
                            c: "Iraq",
                            side: "delian",
                            role: "major",
                            polity_id: "macedonian-empire"
                        }, {
                            c: "Iran",
                            side: "delian",
                            role: "major",
                            polity_id: "macedonian-empire"
                        }, {
                            c: "Greece",
                            side: "delian",
                            role: "major",
                            polity_id: "macedonian-empire"
                        }, {
                            c: "North Macedonia",
                            side: "delian",
                            role: "major",
                            polity_id: "macedonian-empire"
                        } ],
                        empires: []
                    }, e._phaseScenarios.end;
                }
                if ("peak" === t) return e._phaseScenarios.peak = {
                    id: e.id + "-phase-peak",
                    year: p || n.year,
                    phase: "peak",
                    title_ar: "المرحلة الثانية: أوج الاتساع والاشتباك الشامل (" + (p || n.year) + ")",
                    title_en: "Peak Phase: Total Mobilization (" + (p || n.year) + ")",
                    title_ru: "Второй этап: Наибольший размах и всеобщая мобилизация (" + (p || n.year) + ")",
                    title_uz: "Ikkinchi bosqich: Eng kengaygan davr va umumiy safarbarlik (" + (p || n.year) + ")",
                    title_es: "Segunda fase: Máxima extensión y movilización total (" + (p || n.year) + ")",
                    desc_ar: (n.desc_ar ? n.desc_ar + " — " : "") + "ذروة تصعيد العمليات الحربية واكتمال التحالفات والامتداد العسكري الأقصى.",
                    desc_en: (n.desc_en ? n.desc_en + " — " : "") + "Peak escalation and maximum territorial involvement.",
                    desc_ru: (n.desc_ru ? n.desc_ru + " — " : "") + "Пик эскалации боевых действий и максимальный территориальный охват.",
                    desc_uz: (n.desc_uz ? n.desc_uz + " — " : "") + "Jangovar harakatlarning eng yuqori cho‘qqisi va maksimal hududiy kengayishi.",
                    desc_es: (n.desc_es ? n.desc_es + " — " : "") + "Punto álgido de las operaciones y máxima extensión territorial.",
                    participants: (n.participants || []).slice(),
                    empires: (n.empires || []).slice()
                }, e._phaseScenarios.peak;
                if ("start" === t) {
                    var m = (n.participants || []).filter(function(e, t) {
                        return "major" === e.role || "primary" === e.role || "colony" !== e.role && "dominion" !== e.role && "occupied" !== e.role && t < 3;
                    });
                    !m.length && n.participants.length && (m = n.participants.slice(0, 2));
                    var f = (n.empires || []).filter(function(e) {
                        return !e.joinYr || e.joinYr <= (r || 9999);
                    });
                    return e._phaseScenarios.start = {
                        id: e.id + "-phase-start",
                        year: c || n.year,
                        phase: "start",
                        title_ar: "المرحلة الأولى: اندلاع الحرب والشرارة الأولى (" + (c || n.year) + ")",
                        title_en: "Initial Phase: Outbreak (" + (c || n.year) + ")",
                        title_ru: "Первый этап: Начало войны (" + (c || n.year) + ")",
                        title_uz: "Birinchi bosqich: Urushning boshlanishi (" + (c || n.year) + ")",
                        title_es: "Primera fase: Estallido del conflicto (" + (c || n.year) + ")",
                        desc_ar: "اندلاع الصراع بين الأطراف المفجرة للحرب وبدء أولى المواجهات العسكرية على الجبهات الحدودية في عام " + (c || "") + ".",
                        desc_en: "Outbreak of conflict between primary belligerents and initial frontier clashes.",
                        desc_ru: "Начало конфликта между противоборствующими сторонами и первые столкновения на фронтах.",
                        desc_uz: "Urushayotgan tomonlar o‘rtasidagi to‘qnashuvlarning boshlanishi va birinchi chegara janglari.",
                        desc_es: "Estallido del conflicto entre los beligerantes principales y primeros enfrentamientos bélicos.",
                        participants: m,
                        empires: f
                    }, e._phaseScenarios.start;
                }
                if ("end" === t) {
                    var h = (n.participants || []).map(function(e, t) {
                        var n = Object.assign({}, e);
                        return "occupied" === e.role || t % 2 == 1 ? n.role = "occupied" : n.role = "major", 
                        n;
                    });
                    return e._phaseScenarios.end = {
                        id: e.id + "-phase-end",
                        year: d || n.year,
                        phase: "end",
                        title_ar: "المرحلة الثالثة: حسم الحرب ومعاهدات الصلح (" + (d || n.year) + ")",
                        title_en: "Final Phase: Settlement & Aftermath (" + (d || n.year) + ")",
                        title_ru: "Третий этап: Исход войны и мирные договоры (" + (d || n.year) + ")",
                        title_uz: "Uchinchi bosqich: Urush yakuni va sulh shartnomalari (" + (d || n.year) + ")",
                        title_es: "Tercera fase: Conclusión y tratados de paz (" + (d || n.year) + ")",
                        desc_ar: "حسم الصراع وتوقيع معاهدات السلام وإعادة ترسيم الحدود السياسية والنتائج الجيوسياسية في عام " + (d || "") + ".",
                        desc_en: "Conclusion, armistice, peace treaties and redrawn geopolitical borders.",
                        desc_ru: "Завершение конфликта, подписание мирных договоров и передел политических границ.",
                        desc_uz: "Mojaroning yakunlanishi, tinchlik shartnomalarining imzolanishi va chegaralarning qayta belgilanishi.",
                        desc_es: "Conclusión del conflicto, firma de tratados de paz y reconfiguración de fronteras políticas.",
                        participants: h,
                        empires: (n.empires || []).map(function(e, t) {
                            var n = Object.assign({}, e);
                            return t % 2 == 1 && (n.role = "occupied"), n;
                        })
                    }, e._phaseScenarios.end;
                }
                return n;
            }
            function hi(e) {
                return (e = e || mi()) ? fi(e, Xe || "peak") : null;
            }
            function yi(e, t) {
                var n = Pi(t);
                if (!e || !n) return !1;
                if (n === e) return !0;
                var i = e.toLowerCase(), a = n.toLowerCase();
                if (Math.min(i.length, a.length) < 4) return !1;
                function r(e, t) {
                    for (var n = t.indexOf(e); -1 !== n; ) {
                        if (0 === n || /[\s.\-]/.test(t.charAt(n - 1))) return !0;
                        n = t.indexOf(e, n + 1);
                    }
                    return !1;
                }
                return i.length <= a.length ? r(i, a) : r(a, i);
            }
            function gi(e, t, n) {
                if (!e) return null;
                var i, a, r, o = n && n.properties && (n.properties.polity_id || n.properties.id) || null;
                for (i = 0; i < e.participants.length; i++) {
                    var s = e.participants[i];
                    if (o && s.polity_id && s.polity_id === o) return s;
                    if (t && s.polity_id && (s.polity_id === t || s.polity_id.replace(/-/g, "") === t.replace(/-/g, ""))) return s;
                    if (t && yi(t, s.c)) return s;
                }
                for (i = 0; i < (e.empires || []).length; i++) {
                    if (r = e.empires[i], o && r.id === o) return {
                        side: r.side,
                        role: r.role,
                        n: null,
                        yr: r.joinYr || null,
                        _empire: r
                    };
                    for (a = 0; a < r.members.length; a++) if (t && yi(t, r.members[a])) return {
                        side: r.side,
                        role: r.role,
                        n: null,
                        yr: r.joinYr || null,
                        _empire: r
                    };
                }
                return null;
            }
            function vi(e, t) {
                if (!e) return null;
                if (e.rings && Array.isArray(e.rings) && e.rings.length) return {
                    feature: za(e),
                    polity: e
                };
                var n = e.polity_id;
                if (!n) return null;
                var i = void 0 !== Ne && Array.isArray(Ne) ? Ne : "undefined" != typeof window && Array.isArray(window.historicalErasData) ? window.historicalErasData : null;
                if (i && i.length) {
                    for (var a = null, r = 1 / 0, o = 0; o < i.length; o++) {
                        var s = i[o], l = (s.polities || []).slice();
                        s.phases && (s.phases.peak && s.phases.peak.polities && (l = l.concat(s.phases.peak.polities)), 
                        s.phases.start && s.phases.start.polities && (l = l.concat(s.phases.start.polities)), 
                        s.phases.end && s.phases.end.polities && (l = l.concat(s.phases.end.polities)));
                        for (var c = 0; c < l.length; c++) if (l[c].id === n && l[c].rings && l[c].rings.length) {
                            var d = "number" == typeof t && "number" == typeof s.sort ? Math.abs(t - s.sort) : 0;
                            d < r && (r = d, a = l[c]);
                        }
                    }
                    if (a) return {
                        feature: za(a),
                        polity: a
                    };
                }
                var u = "undefined" != typeof window && (window.HISTORICAL_POLITIES_DATA || window.historicalPolitiesData) || ("undefined" != typeof HISTORICAL_POLITIES_DATA ? HISTORICAL_POLITIES_DATA : "undefined" != typeof historicalPolitiesData ? historicalPolitiesData : null);
                return u && u[n] && u[n].rings && u[n].rings.length ? {
                    feature: za(u[n]),
                    polity: u[n]
                } : null;
            }
            function bi(e, t, n) {
                if (!e || !e.geometry) return e;
                if ("MultiPolygon" !== e.geometry.type) return e;
                var i = t && t.region || "", a = t && t.id || "";
                if ("ww2-1939" === a || "ww1-1914" === a || "seven-years-1756" === a || "cold-war-1947" === a || "world" === i) return e;
                var r = e.geometry.coordinates, o = r.filter(function(e) {
                    if (!e || !e.length || !e[0].length) return !1;
                    for (var t = e[0], n = 0, a = 0, r = 0; r < t.length; r++) n += t[r][0], a += t[r][1];
                    if (n /= t.length, a /= t.length, "europe" === i || "me" === i || "asia" === i || "africa" === i) {
                        if (n < -26) return !1;
                        if (("europe" === i || "me" === i) && a < 20 && n > 30) return !1;
                    } else if ("americas" === i && n > -26) return !1;
                    return !0;
                });
                return 0 === o.length ? null : o.length === r.length ? e : {
                    type: "Feature",
                    properties: e.properties,
                    geometry: {
                        type: "MultiPolygon",
                        coordinates: o
                    }
                };
            }
            function wi(e) {
                var t = document.getElementById("histEmptyState");
                t && (t.style.display = "none");
                var i = document.getElementById("histWarCardDetails");
                i && (i.style.display = "block");
                var a = document.getElementById("histScenarioBtns");
                if (a && a.style.removeProperty("display"), "eras" !== Fe) if ("faiths" !== Fe) {
                    if (rn && (rn.selectAll("*").remove(), Pe)) {
                        var r = hi();
                        if (!r) return ca(), void da();
                        var o = null;
                        if (r && r.year) {
                            var s = String(r.year).match(/(\d+)\s*(BCE|BC|ق\.م)?/i);
                            if (s) {
                                var l = parseInt(s[1], 10);
                                o = s[2] || /BCE|BC|ق\.م/i.test(String(r.year)) ? -l : l;
                            }
                        }
                        var c = Math.max(.4, li.k), d = Math.max(4, Math.min(16, (xi ? 8 : 11) / c)), u = n() ? 0 : 300;
                        (r.empires || []).forEach(function(t) {
                            var n = pi(t) || "#7b8794", i = 0, a = 0, r = 0, o = !1, s = _o(Ai(histEmpireNames[t.id], "name"));
                            if (t.members.forEach(function(l) {
                                var c = fn.find(function(e) {
                                    return yi(Pi(e.properties && e.properties.name), l);
                                });
                                if (c) {
                                    var d = bi(c, mi());
                                    if (d) {
                                        var p = Gn(d);
                                        if (p) {
                                            var m = rn.append("path").attr("d", p).attr("fill", n).attr("fill-opacity", Qe).style("fill-opacity", Qe).attr("stroke", "#ffffff").attr("stroke-width", 1.2).attr("stroke-dasharray", "5,3").attr("vector-effect", "non-scaling-stroke").attr("role", "button").attr("tabindex", "0").attr("aria-label", s || d.properties && d.properties.name || "").style("cursor", "pointer").style("pointer-events", "auto"), f = 0, h = 0, y = 0;
                                            if (m.on("pointerdown", function(e) {
                                                f = e.clientX, h = e.clientY, y = Date.now();
                                            }).on("pointerup", function(e) {
                                                Math.hypot(e.clientX - f, e.clientY - h) < 8 && Date.now() - y < 600 && (e.stopPropagation && e.stopPropagation(), 
                                                ji(d));
                                            }).on("click", function() {
                                                ji(d);
                                            }).on("keydown", function(e) {
                                                "Enter" !== e.key && " " !== e.key || (e.preventDefault && e.preventDefault(), ji(d));
                                            }), e ? m.attr("opacity", 1).style("opacity", 1) : m.attr("opacity", 0).style("opacity", 0).transition().duration(u).attr("opacity", 1).style("opacity", 1), 
                                            de) {
                                                ga();
                                                var g = ba(mi(), t.side);
                                                rn.append("path").attr("class", "hist-cbpat").attr("d", p).attr("fill", "url(#cbpat-" + g + ")").attr("stroke", "none").style("pointer-events", "none");
                                            }
                                        }
                                        try {
                                            var v = d3.geoCentroid(d), b = Math.max(.001, d3.geoArea(d)), w = ao()(v);
                                            w && !isNaN(w[0]) && (i += w[0] * b, a += w[1] * b, r += b, o = !0);
                                        } catch (e) {}
                                    }
                                }
                            }), o && r > 0) {
                                var l = s, c = t.joinYr ? " (" + t.joinYr + ")" : t.endYr ? " (†" + t.endYr + ")" : "", p = rn.append("text").attr("class", "hist-war-label").attr("x", i / r).attr("y", a / r).text(l + c).attr("fill", "#ffffff").attr("font-size", d + "px").attr("font-weight", "bold").attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("pointer-events", "none").attr("style", "text-shadow: 0 1px 3px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.85); letter-spacing: 0.3px;");
                                e ? p.attr("opacity", .95) : p.attr("opacity", 0).transition().duration(u).attr("opacity", .95);
                            }
                        }), r.participants.forEach(function(t) {
                            var n = pi(t);
                            if (n) {
                                var i = "undefined" != typeof histCountryNames && histCountryNames[t.c] && Ai(histCountryNames[t.c], "name") || t.c || "", a = t.polity_id || t.rings ? vi(t, o) : null;
                                if (a && a.feature) {
                                    var r = Gn(a.feature);
                                    if (r) {
                                        var s = "protectorate" === t.role || "colony" === t.role || "dominion" === t.role, l = a.polity && Ai(a.polity, "name") || Ai(t, "name") || i, c = t.polity_id || a.polity && a.polity.id || "", p = {
                                            type: "Feature",
                                            properties: {
                                                name: l,
                                                polity_id: c
                                            },
                                            _polity: a.polity,
                                            _warParticipant: t
                                        }, m = rn.append("path").attr("class", "hist-polity-boundary").attr("data-polity-id", c).attr("d", r).attr("fill", n).attr("fill-opacity", Qe).style("fill-opacity", Qe).attr("stroke", n).attr("stroke-width", s ? 2.2 : 1.5).attr("vector-effect", "non-scaling-stroke").attr("role", "button").attr("tabindex", "0").attr("aria-label", l).style("cursor", "pointer").style("pointer-events", "auto"), f = 0, h = 0, y = 0;
                                        if (m.on("pointerdown", function(e) {
                                            f = e.clientX, h = e.clientY, y = Date.now();
                                        }).on("pointerup", function(e) {
                                            Math.hypot(e.clientX - f, e.clientY - h) < 8 && Date.now() - y < 600 && (e.stopPropagation && e.stopPropagation(), 
                                            ji(p));
                                        }).on("click", function() {
                                            ji(p);
                                        }).on("keydown", function(e) {
                                            "Enter" !== e.key && " " !== e.key || (e.preventDefault && e.preventDefault(), ji(p));
                                        }), e ? m.attr("opacity", 1).style("opacity", 1) : m.attr("opacity", 0).style("opacity", 0).transition().duration(u).attr("opacity", 1).style("opacity", 1), 
                                        de) {
                                            ga();
                                            var g = ba(mi(), t.side);
                                            rn.append("path").attr("class", "hist-cbpat").attr("d", r).attr("fill", "url(#cbpat-" + g + ")").attr("stroke", "none").style("pointer-events", "none");
                                        }
                                        try {
                                            var v = d3.geoCentroid(a.feature), b = ao()(v);
                                            if (b && !isNaN(b[0])) {
                                                var w = rn.append("text").attr("class", "hist-war-label").attr("x", b[0]).attr("y", b[1]).text(_o(l)).attr("fill", "#ffffff").attr("font-size", d + "px").attr("font-weight", "bold").attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("pointer-events", "none").attr("style", "text-shadow: 0 1px 3px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.85); letter-spacing: 0.3px;");
                                                e ? w.attr("opacity", .95) : w.attr("opacity", 0).transition().duration(u).attr("opacity", .95);
                                            }
                                        } catch (e) {}
                                    }
                                } else fn.forEach(function(a) {
                                    if (yi(Pi(a.properties && a.properties.name || ""), t.c)) {
                                        var r = bi(a, mi());
                                        if (r) {
                                            var o = Gn(r);
                                            if (o) {
                                                var s = "protectorate" === t.role || "colony" === t.role || "dominion" === t.role, l = r.properties && r.properties.name || i, c = rn.append("path").attr("class", "hist-country-boundary").attr("data-country-name", r.properties && r.properties.name || t.c || "").attr("d", o).attr("fill", n).attr("fill-opacity", Qe).style("fill-opacity", Qe).attr("stroke", n).attr("stroke-width", s ? 2.2 : 1.2).attr("vector-effect", "non-scaling-stroke").attr("role", "button").attr("tabindex", "0").attr("aria-label", l).style("cursor", "pointer").style("pointer-events", "auto"), d = 0, p = 0, m = 0;
                                                if (c.on("pointerdown", function(e) {
                                                    d = e.clientX, p = e.clientY, m = Date.now();
                                                }).on("pointerup", function(e) {
                                                    Math.hypot(e.clientX - d, e.clientY - p) < 8 && Date.now() - m < 600 && (e.stopPropagation && e.stopPropagation(), 
                                                    ji(r));
                                                }).on("click", function() {
                                                    ji(r);
                                                }).on("keydown", function(e) {
                                                    "Enter" !== e.key && " " !== e.key || (e.preventDefault && e.preventDefault(), ji(r));
                                                }), e ? c.attr("opacity", 1).style("opacity", 1) : c.attr("opacity", 0).style("opacity", 0).transition().duration(u).attr("opacity", 1).style("opacity", 1), 
                                                de) {
                                                    ga();
                                                    var f = ba(mi(), t.side);
                                                    rn.append("path").attr("class", "hist-cbpat").attr("d", o).attr("fill", "url(#cbpat-" + f + ")").attr("stroke", "none").style("pointer-events", "none");
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        });
                        var p = mi(), m = [];
                        r.battles && Array.isArray(r.battles) && (m = m.concat(r.battles)), r.battle_ids && Array.isArray(r.battle_ids) && Bn && r.battle_ids.forEach(function(e) {
                            var t = Bn.find(function(t) {
                                return t.id === e;
                            });
                            t && !m.some(function(e) {
                                return e.id === t.id;
                            }) && m.push(t);
                        }), p && Bn && Bn.forEach(function(e) {
                            e.war_id !== p.id || m.some(function(t) {
                                return t.id === e.id;
                            }) || m.push(e);
                        });
                        var f = ao(), h = window.innerWidth <= 768, y = li && li.k || 1;
                        m.forEach(function(e) {
                            var t = e.coords || [ e.lon, e.lat ];
                            if (t) {
                                var n = f(t);
                                if (n && !isNaN(n[0])) {
                                    var i = _o(Ai(e, "name"));
                                    rn.append("circle").attr("class", "hist-tactical-radius").attr("cx", n[0]).attr("cy", n[1]).attr("r", (e.radius || (h ? 24 : 32)) / Math.max(.7, Math.pow(y, .4))).attr("fill", "#ef4444").attr("fill-opacity", .18).attr("stroke", "#ef4444").attr("stroke-width", (h ? 1.6 : 2) / y).attr("stroke-dasharray", "5,3").attr("pointer-events", "none");
                                    var a = h ? 13 : 15.5, r = h ? 15.5 : 18, o = Math.max(a, Math.min(r, a * Math.pow(y, .15))), s = o / y, l = ((h ? 7 : 8.5) + .7 * o) / y, c = rn.append("g").attr("class", "hist-war-battle-pin hist-landmark-pin").attr("data-battle-id", e.id || "").attr("role", "button").attr("tabindex", "0").attr("aria-label", (zi("histBattlePinLabel") || "معركة فاصلة") + ": " + i).style("cursor", "pointer").on("click", function(t) {
                                        t && t.stopPropagation && t.stopPropagation(), window.showHistoricalBattleDetail && window.showHistoricalBattleDetail(e);
                                    }).on("keydown", function(t) {
                                        "Enter" !== t.key && " " !== t.key || (t.preventDefault && t.preventDefault(), window.showHistoricalBattleDetail && window.showHistoricalBattleDetail(e));
                                    });
                                    c.append("circle").attr("cx", n[0]).attr("cy", n[1]).attr("r", (h ? 6.5 : 8) / y).attr("fill", "#dc2626").attr("stroke", "#ffffff").attr("stroke-width", 2 / y).attr("vector-effect", "non-scaling-stroke"), 
                                    c.append("text").attr("x", n[0]).attr("y", n[1] + 3.8 / y).text("⚔").attr("fill", "#ffffff").attr("font-size", (h ? 9 : 11) / y + "px").attr("text-anchor", "middle").style("pointer-events", "none"), 
                                    c.append("text").attr("class", "hist-war-battle-label").attr("x", n[0]).attr("y", n[1] - l).text(i).attr("fill", "#fecaca").attr("font-size", s + "px").attr("font-weight", "bold").attr("text-anchor", "middle").attr("style", "text-shadow: 0 1px 3px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.85); pointer-events: none;");
                                }
                            }
                        }), Co(c), ke && window.drawHistoricalRoutes && window.drawHistoricalRoutes(!0), 
                        window.drawHistoricalTravelers && window.drawHistoricalTravelers(), window.drawHistCapitals && window.drawHistCapitals(), 
                        window.drawHistBattles && window.drawHistBattles(), window.drawHistWonders && window.drawHistWonders(), 
                        Fa();
                    }
                } else window.religionsStillActive && window.religionsStillActive() && window.drawReligionsSceneNow && window.drawReligionsSceneNow(e); else Aa(e);
            }
            function Ei(e, t) {
                return Ui(e, t);
            }
            window.getPolityFeatureForScenario = vi, window.getTheaterFilteredFeature = bi;
            var _i = {}, Bi = {};
            function Ii(e) {
                if (_i[e.id]) return _i[e.id];
                var t = {}, n = {};
                var i = function(e) {
                    if (Bi[e.id]) return Bi[e.id];
                    var t = {};
                    return e.scenarios.forEach(function(e) {
                        (e.participants || []).forEach(function(e) {
                            "major" === e.role && (t[Pi(e.c)] = !0);
                        }), (e.empires || []).forEach(function(e) {
                            "major" === e.role && (e.name && (t[Pi(e.name)] = !0), (e.members || []).forEach(function(e) {
                                t[Pi(e)] = !0;
                            }));
                        });
                    }), Bi[e.id] = t, t;
                }(e);
                Object.keys(i).forEach(function(e) {
                    if (e) {
                        var i = Qi(e);
                        i && "unknown" !== i && (n[i] = !0);
                        var a = function(e) {
                            if (!e || isNaN(e[0]) || isNaN(e[1])) return null;
                            var t = e[0], n = e[1];
                            return t < -25 ? "americas" : t >= 34 && t <= 63 && n >= 12 && n <= 42 ? "me" : n >= 36 && t <= 45 ? "europe" : n > -40 && n < 36 && t >= -20 && t <= 52 ? "africa" : "asia";
                        }(function(e) {
                            for (var t = null, n = 0; n < fn.length; n++) {
                                var i = fn[n].properties && fn[n].properties.name;
                                if (i === e || Pi(i) === e) {
                                    t = fn[n];
                                    break;
                                }
                            }
                            if (!t) return null;
                            try {
                                var a = d3.geoCentroid(t);
                                return isNaN(a[0]) ? null : a;
                            } catch (e) {
                                return null;
                            }
                        }(Pi(e)));
                        a && (t[a] = !0);
                    }
                });
                var a = Object.keys(t), r = {
                    regions: a.length >= 3 ? [ "world" ] : a,
                    religions: n
                };
                return _i[e.id] = r, r;
            }
            function qi() {
                if (window.__histWarsLoaded) return Promise.resolve(nt);
                if (window.__histWarsLoading) return window.__histWarsLoading;
                return window.__histWarsLoading = fetch(e + "historical-wars-data.json", {
                    cache: "reload"
                }).then(function(e) {
                    if (!e.ok) throw new Error("HTTP " + e.status);
                    return e.json();
                }).then(function(e) {
                    var t = e && e.wars || [], n = {};
                    return nt.forEach(function(e) {
                        n[e.id] = e;
                    }), t.forEach(function(e) {
                        n[e.id] = e;
                    }), nt = Object.keys(n).map(function(e) {
                        return n[e];
                    }), window.historyWarData = nt, window.__histWarsLoaded = !0, window.__histWarsLoading = null, 
                    nt;
                }).catch(function(e) {
                    return window.__histWarsLoading = null, "undefined" != typeof console && console.error("Failed to load wars:", e), 
                    window.__histWarsLoaded = !0, Promise.resolve(nt);
                }), window.__histWarsLoading;
            }
            function Oi(e) {
                if ("all" !== it && e.epoch !== it) return !1;
                var t = Ii(e);
                return ("all" === Ge || -1 !== t.regions.indexOf(Ge) || -1 !== t.regions.indexOf("world")) && (!("all" !== Ye && !t.religions[Ye]) && !(Ve && !Ei(function(e) {
                    if (!e) return "";
                    var t = [ e.id || "", Ai(e, "years") ];
                    return [ "name", "years", "desc" ].forEach(function(n) {
                        [ "", "_ar", "_en", "_ru", "_uz", "_es" ].forEach(function(i) {
                            var a = e[n + i];
                            a && "string" == typeof a && t.push(a);
                        });
                    }), (e.scenarios || []).forEach(function(e) {
                        [ "title", "desc" ].forEach(function(n) {
                            [ "", "_ar", "_en", "_ru", "_uz", "_es" ].forEach(function(i) {
                                var a = e[n + i];
                                a && "string" == typeof a && t.push(a);
                            });
                        }), void 0 !== e.year && null !== e.year && t.push(String(e.year)), (e.participants || []).forEach(function(e) {
                            e && e.c && (t.push(e.c), $i(e.c).forEach(function(e) {
                                t.push(e);
                            }));
                        }), (e.empires || []).forEach(function(e) {
                            e.name && t.push(e.name), [ "", "_ar", "_en", "_ru", "_uz", "_es" ].forEach(function(n) {
                                var i = e["name" + n];
                                i && "string" == typeof i && t.push(i);
                            }), (e.members || []).forEach(function(e) {
                                t.push(e), $i(e).forEach(function(e) {
                                    t.push(e);
                                });
                            });
                        });
                    }), t.join(" ");
                }(e), Ve)));
            }
            function Ri(e) {
                return ("all" === at || ot(e) === at) && (("all" === Ge || e.region === Ge || "world" === e.region) && !(Ve && !Ei(function(e) {
                    if (!e) return "";
                    var t = [ e.id || "", e.yearLabel || "", String(void 0 !== e.sort && null !== e.sort ? e.sort : "") ];
                    return [ "title", "desc" ].forEach(function(n) {
                        [ "", "_ar", "_en", "_ru", "_uz", "_es" ].forEach(function(i) {
                            var a = e[n + i];
                            a && "string" == typeof a && t.push(a);
                        });
                    }), (e.polities || []).forEach(function(e) {
                        [ "name", "founder", "capital", "religion", "language", "ethnicity" ].forEach(function(n) {
                            [ "", "_ar", "_en", "_ru", "_uz", "_es" ].forEach(function(i) {
                                var a = e[n + i];
                                a && "string" == typeof a && t.push(a);
                            });
                        });
                    }), t.join(" ");
                }(e), Ve)));
            }
            function Ni() {
                var e = "eras" === Fe, t = "faiths" === Fe, n = "wars" === Fe, i = "travelers" === Fe, a = document.getElementById("histWarTabs"), r = document.getElementById("histScenarioBtns"), o = document.getElementById("historyEraGroup"), s = document.getElementById("histWarsPopoverBtn"), l = document.getElementById("histErasPopoverBtn"), c = document.getElementById("histFaithsPopoverBtn"), d = document.getElementById("histTravelersPopoverBtn"), u = document.getElementById("historyBottomBar"), p = document.getElementById("historyEraTimelineWrap"), m = document.getElementById("historyFaithsTimelineWrap"), f = document.getElementById("historyTravelersTimelineWrap"), h = document.getElementById("historyTerrainTimelineWrap");
                a && a.style.setProperty("display", n ? "grid" : "none", "important"), r && r.style.setProperty("display", n ? "flex" : "none", "important"), 
                o && o.style.setProperty("display", e ? "grid" : "none", "important"), u && "true" !== u.getAttribute("data-onboard-forced") && (u.style.display = Hn || e || t || i && Mn && Mn.length > 0 ? "flex" : "none"), 
                h && (h.style.display = Hn ? "flex" : "none"), p && "true" !== p.getAttribute("data-onboard-forced") && (p.style.display = !Hn && e ? "flex" : "none"), 
                m && (m.style.display = !Hn && t ? "flex" : "none"), f && (f.style.display = !Hn && i ? "flex" : "none"), 
                s && (s.classList.toggle("active", n), s.setAttribute("aria-selected", n ? "true" : "false")), 
                l && (l.classList.toggle("active", e), l.setAttribute("aria-selected", e ? "true" : "false")), 
                c && (c.classList.toggle("active", t), c.setAttribute("aria-selected", t ? "true" : "false")), 
                d && (d.classList.toggle("active", i), d.setAttribute("aria-selected", i ? "true" : "false"));
                var y = document.getElementById("histFilterReligion");
                y && y.style.setProperty("display", n ? "" : "none", n ? "" : "important"), n || (Ye = "all");
            }
            function Di() {
                if (window.__histWarsLoaded || window.__histWarsLoading) {
                    "wars" === Fe && (Ne || Ba().then(function() {
                        "wars" === Fe && wi(!0);
                    }).catch(function() {}), Bn || Ac().then(function() {
                        "wars" === Fe && wi(!0);
                    }).catch(function() {}));
                    var e = mi();
                    Ni();
                    var t = document.getElementById("histWarTabs");
                    t.innerHTML = "";
                    var n = nt.filter(Oi);
                    if ("wars" === Fe) {
                        if (!n.length) {
                            var i = zi("all" !== Ye && "all" === Ge && !Ve ? "histNoResultsReligion" : "histNoResults");
                            ua(t, i);
                            var a = document.getElementById("histScenarioBtns");
                            a && (a.innerHTML = "");
                            var r = document.getElementById("histWarCardDetails");
                            r && (r.style.display = "none");
                            var o = document.getElementById("histEmptyState");
                            o && (o.style.display = "block"), rn && rn.selectAll("*").remove();
                            var s = document.getElementById("legend");
                            return s && Pe && (s.innerHTML = ""), void (Pe && window.updateHash && window.updateHash());
                        }
                        n.some(function(e) {
                            return e.id === qe;
                        }) ? e = mi() : qe ? (e = n[0], qe = e.id, Oe = e.scenarios[0].id) : e = null;
                    }
                    if (rt.forEach(function(e) {
                        var i = n.filter(function(t) {
                            return t.epoch === e.id;
                        });
                        if ("all" === it || it === e.id) {
                            var a = document.createElement("div");
                            a.className = "hist-epoch-col", a.setAttribute("data-epoch", e.id);
                            var r = document.createElement("div");
                            r.className = "hist-epoch-col-header", r.innerHTML = '<span class="hist-epoch-col-title">' + Ti(zi(e.key)) + '</span><span class="hist-epoch-col-count">' + i.length + " " + Ti(zi("histItemCountWars") || "") + "</span>", 
                            a.appendChild(r);
                            var o = document.createElement("div");
                            if (o.className = "hist-epoch-col-items", i.length) i.forEach(function(e) {
                                var t = document.createElement("button");
                                t.type = "button", t.className = "btn history-war-tab" + ("wars" === Fe && e.id === qe ? " active" : ""), 
                                t.setAttribute("role", "tab"), t.setAttribute("aria-selected", "wars" === Fe && e.id === qe ? "true" : "false"), 
                                t.innerHTML = '<span class="war-tab-name">' + Ti(Ai(e, "name")) + '</span><span class="war-tab-years">' + Ti(Ai(e, "years")) + "</span>", 
                                t.addEventListener("click", function() {
                                    if ("wars" === Fe && qe === e.id) return qe = null, Oe = null, $e = null, Di(), 
                                    ca(), void da();
                                    Fe = "wars", qe = e.id, Oe = e.scenarios && e.scenarios[0] ? e.scenarios[0].id : null, 
                                    $e = null, X((zi("histTabWars") || "حرب") + ": " + Ai(e, "name") + " (" + (e.years_ar || e.years_en || "") + ")"), 
                                    window.innerWidth <= 680 && cl(), Di(), wi();
                                }), o.appendChild(t);
                            }); else {
                                var s = document.createElement("div");
                                s.className = "hist-col-empty-msg", s.textContent = "—", o.appendChild(s);
                            }
                            a.appendChild(o), t.appendChild(a);
                        }
                    }), "eras" !== Fe) {
                        var l = document.getElementById("histEmptyState"), c = document.getElementById("histWarCardDetails"), d = document.getElementById("histWarCardTitle"), u = document.getElementById("histWarCardEpoch"), p = document.getElementById("histWarCardYears"), m = document.getElementById("histWarCardDesc"), f = document.getElementById("histScenarioBtns");
                        if (f && (f.innerHTML = ""), !e) return Ni(), l && (l.style.display = "block"), 
                        c && (c.style.display = "none"), ca(), void da();
                        l && (l.style.display = "none"), c && (c.style.display = "block"), d && (d.textContent = Ai(e, "name"));
                        var h = rt.find(function(t) {
                            return t.id === e.epoch;
                        });
                        u && (u.textContent = h ? zi(h.key) : e.epoch);
                        var y = hi(e) || e.scenarios && e.scenarios.find(function(e) {
                            return e.id === Oe;
                        }) || e.scenarios && e.scenarios[0];
                        p && (p.textContent = y && y.year || Ai(e, "years") || ""), m && (m.textContent = y && Ai(y, "desc") || Ai(e, "desc") || Ai(e, "name")), 
                        Fi(e, y), e.scenarios.forEach(function(e) {
                            var t = document.createElement("button");
                            t.type = "button", t.className = "btn history-scenario-btn" + (e.id === Oe ? " active" : ""), 
                            t.textContent = e.year + " · " + Ai(e, "title"), t.title = Ai(e, "desc"), t.addEventListener("click", function() {
                                Oe = e.id, cl(), Di(), wi(), vn && T.classList.contains("visible") && ji(vn);
                            }), f && f.appendChild(t);
                        }), Fa();
                        var g = document.getElementById("histSourcesPanel");
                        g && (g.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;"><h4>' + Ti(zi("histSourcesTitle")) + '</h4><button type="button" class="hist-drawer-close-btn" style="width:24px;height:24px;font-size:1rem;" onclick="document.getElementById(\'histSourcesPanel\').style.display=\'none\'">&times;</button></div><ul>' + ta(e.sources) + "</ul>"), 
                        oa(), Pe && window.updateHash && window.updateHash();
                    } else Da();
                } else qi().then(function() {
                    Ba().catch(function() {}), Ac().catch(function() {}), Di(), "wars" === Fe && wi();
                }).catch(function(e) {
                    "undefined" != typeof console && console.error("Failed to load wars:", e);
                });
            }
            function Fi(e, t) {
                var n = document.getElementById("histWarPhaseGroup");
                n && e && n.querySelectorAll(".hist-phase-btn").forEach(function(e) {
                    e.classList.toggle("active", e.getAttribute("data-phase") === Xe);
                });
            }
            function ji(e) {
                if (cl(), "eras" !== Fe) if ("faiths" === Fe || "religions" === Fe || "function" == typeof window.religionsStillActive && window.religionsStillActive()) Eo(); else {
                    var t = document.getElementById("panelContent"), n = document.getElementById("countryPanel");
                    if (t && n) {
                        Mr(), vn = e, _n = "history";
                        var i = e.properties && e.properties.name || "", a = Pi(i), r = hi(), o = mi(), s = e && e._warParticipant || gi(r, a, e), l = Hi(i), c = bo(i);
                        if ("wars" !== Fe || s) {
                            var d = null;
                            e && e._polity && (d = e._polity), "function" == typeof getHistoricalPolityProfile && (!d && s && s._empire && (d = getHistoricalPolityProfile(s._empire.id)), 
                            !d && s && s.polity_id && (d = getHistoricalPolityProfile(s.polity_id)), !d && e && e.properties && e.properties.polity_id && (d = getHistoricalPolityProfile(e.properties.polity_id)), 
                            !d && s && s.c && (d = getHistoricalPolityProfile(s.c)), d || "wars" === Fe || (d = getHistoricalPolityProfile(a) || getHistoricalPolityProfile(l) || getHistoricalPolityProfile(i)));
                            var u, p = '<div class="hist-profile-card">';
                            if (p += '<div class="hist-profile-header">', p += '<h3 class="hist-profile-title">' + (c || "📜") + " " + Ti(d && Ai(d, "name") || s && ("undefined" != typeof histCountryNames && histCountryNames[s.c] ? Ai(histCountryNames[s.c], "name") : s.c) || l) + "</h3>", 
                            o && (p += '<p class="hist-profile-subtitle"><strong>' + Ti(Ai(o, "name")) + "</strong> — " + (r ? r.year + " · " + Ti(Ai(r, "title")) : "") + "</p>"), 
                            p += "</div>", s) {
                                var m = pi(s) || "#9aa5b1", f = zi(ci(s.role)), h = "neutral" !== s.side && o ? Mi(o, s.side) : "";
                                if (p += '<div class="hist-status-block" style="border-inline-start-color:' + m + '; margin-bottom: 8px;"><div class="hist-status-role"><span class="hist-chip-swatch" style="background:' + m + '"></span> <strong>' + Ti(f) + "</strong></div>" + (h ? '<div class="hist-status-side">' + Ti(h) + (s.yr ? " · " + Ti(s.yr) : "") + "</div>" : "") + "</div>", 
                                s.n && histNotes[s.n] && (p += '<p class="hist-note">' + Ti((u = histNotes[s.n]) ? void 0 !== u[Ht] && null !== u[Ht] ? u[Ht] : void 0 !== u.en ? u.en : "" : "") + "</p>"), 
                                s._empire) {
                                    var y = s._empire, g = y.members.map(function(e) {
                                        return Hi(e);
                                    }).join("، ");
                                    p += '<div class="hist-empire-box" style="margin-bottom: 8px;">', p += "<strong>" + Ti(Ai(histEmpireNames[y.id], "name")) + "</strong>", 
                                    p += '<div class="hist-empire-members">' + Ti(zi("histCompositionLabel")) + " " + Ti(g) + "</div>";
                                    var v = Ai(y, "partial");
                                    v && (p += '<div class="hist-empire-partial">' + Ti(zi("histPartialNoteLabel")) + " " + Ti(v) + ".</div>"), 
                                    p += "</div>";
                                }
                            } else d || (p += '<p class="hist-note">' + Ti(zi("histNoData")) + "</p>");
                            if (d) {
                                var b = Ai(d, "founder"), w = Ai(d, "capital"), E = Ai(d, "religion"), k = Ai(d, "language"), x = Ai(d, "ethnicity"), _ = Ai(d, "origin"), C = Ai(d, "fall");
                                p += '<div class="hist-profile-grid">', b && (p += '<div class="hist-profile-item"><div class="hist-profile-item-label">' + Ti(zi("histFounderTitle")) + '</div><div class="hist-profile-item-val">' + Ti(b) + "</div></div>"), 
                                w && (p += '<div class="hist-profile-item"><div class="hist-profile-item-label">' + Ti(zi("histCapitalTitle")) + '</div><div class="hist-profile-item-val">' + Ti(w) + "</div></div>"), 
                                E && (p += '<div class="hist-profile-item full-width"><div class="hist-profile-item-label">' + Ti(zi("histReligionTitle")) + '</div><div class="hist-profile-item-val">' + Ti(E) + "</div></div>"), 
                                k && (p += '<div class="hist-profile-item"><div class="hist-profile-item-label">' + Ti(zi("histLanguageTitle")) + '</div><div class="hist-profile-item-val">' + Ti(k) + "</div></div>"), 
                                x && (p += '<div class="hist-profile-item"><div class="hist-profile-item-label">' + Ti(zi("histEthnicityTitle")) + '</div><div class="hist-profile-item-val">' + Ti(x) + "</div></div>"), 
                                p += "</div>", _ && (p += '<div class="hist-narrative-box origin-box"><div class="hist-narrative-title">' + Ti(zi("histHowStartedTitle")) + '</div><p class="hist-narrative-text">' + Ti(_) + "</p></div>"), 
                                C && (p += '<div class="hist-narrative-box fall-box"><div class="hist-narrative-title">' + Ti(zi("histHowEndedTitle")) + '</div><p class="hist-narrative-text">' + Ti(C) + "</p></div>");
                            }
                            o && o.sources && (p += '<details class="hist-sources-mini"><summary>' + Ti(zi("histSourcesBtn")) + " (" + Ti(zi("histSourcesTitle")) + ")</summary><ul>" + ta(o.sources) + "</ul></details>"), 
                            p += '<p class="hist-disclaimer-mini">' + Ti(zi("histDisclaimer")) + "</p></div>", 
                            wn = performance.now(), t.innerHTML = p, n.style.display = "block", requestAnimationFrame(function() {
                                requestAnimationFrame(function() {
                                    n.classList.add("visible");
                                });
                            }), oa();
                        } else Eo();
                    }
                } else !function(e) {
                    var t = document.getElementById("panelContent"), n = document.getElementById("countryPanel");
                    if (!t || !n) return;
                    cl();
                    Mr(), vn = e, _n = "history";
                    var i = Sa(), a = e.properties && e.properties.name || "", r = (Hi(a), Pi(a)), o = i && i.phases && i.phases[Je] ? i.phases[Je] : null, s = o && Array.isArray(o.polities) && o.polities.length ? o.polities : i && i.polities || [], l = null;
                    if (s.length && (l = s.find(function(e) {
                        var t = Pi(e.id || Ai(e, "name"));
                        return yi(r, t) || r === t;
                    }), !l)) {
                        var c = null;
                        try {
                            c = d3.geoCentroid(e);
                        } catch (e) {}
                        if (c && !isNaN(c[0])) for (var d = 0; d < s.length && !l; d++) for (var u = s[d], p = 0; p < (u.rings || []).length && !l; p++) try {
                            d3.geoContains({
                                type: "Polygon",
                                coordinates: [ Ia(u.rings[p]) ]
                            }, c) && (l = u);
                        } catch (e) {}
                    }
                    if (l) return void Pa(l, i);
                    $e ? Ta() : Eo();
                }(e);
            }
            function Wi(e) {
                if (!e || !e.region) return "";
                var t = "region" + String(e.region).toUpperCase();
                return zi({
                    ME: "regionME",
                    EU: "regionEU",
                    AS: "regionAS",
                    AF: "regionAF",
                    AM: "regionAM",
                    WORLD: "regionWorld"
                }[String(e.region).toUpperCase()] || t) || e.region;
            }
            function Ki(e) {
                return (e.polities || []).map(function(e) {
                    var t = Ai(e, "name");
                    return e.foundingYear && (t += " (" + e.foundingYear + ")"), e.endYear && (t += "–" + e.endYear), 
                    t;
                });
            }
            function Yi(e) {
                if (e || (e = Sa()), e) {
                    var t = window.location.href.split("#")[0] + "#sec=history&era=" + encodeURIComponent(e.id) + "&lang=" + (Ht || "en");
                    navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(t).then(n).catch(function() {
                        Vi(t, n);
                    }) : Vi(t, n);
                }
                function n() {
                    document.getElementById("copyNotification").textContent = zi("histCopyLinkCopied"), 
                    document.getElementById("copyNotification").classList.add("show"), setTimeout(function() {
                        document.getElementById("copyNotification").classList.remove("show");
                    }, 2200);
                }
            }
            function Vi(e, t) {
                var n = document.createElement("textarea");
                n.value = e, n.style.position = "fixed", n.style.opacity = "0", document.body.appendChild(n), 
                n.select();
                try {
                    document.execCommand("copy");
                } catch (e) {}
                document.body.removeChild(n), t();
            }
            function Xi(e) {
                e || (e = Sa());
                var t = document.getElementById("eraQuizModal"), n = document.getElementById("eraQuizModalBody");
                if (t && n) {
                    var i = e && e.quiz ? e.quiz : null, a = e ? Ai(e, "title") + " — " + (e.yearLabel || "") : "";
                    if (!i || !i.q_en) return n.innerHTML = '<p class="hist-note">' + Ti(zi("histEraQuizNone")) + "</p>" + (e ? '<p class="hist-entity-details"><div class="hist-detail-row"><dt>' + Ti(Ai(e, "title")) + "</dt><dd>" + Ti(e.yearLabel || "") + "</dd></div></p>" : ""), 
                    void t.classList.add("visible");
                    var r = i[c("q")] || i.q_en, o = i[c("a")] || i.a_en;
                    n.innerHTML = '<p class="hist-panel-context"><strong>' + Ti(a) + '</strong></p><p class="hist-quiz-q">' + Ti(r) + '</p><button type="button" class="btn history-action-btn" id="eraQuizReveal">' + Ti(zi("histEraQuizReveal")) + '</button><p class="hist-quiz-a" id="eraQuizAnswer" hidden>' + Ti(o) + "</p>";
                    var s = n.querySelector("#eraQuizReveal"), l = n.querySelector("#eraQuizAnswer");
                    s && l && s.addEventListener("click", function() {
                        var e = l.hasAttribute("hidden");
                        l.toggleAttribute("hidden"), s.textContent = zi(e ? "histEraQuizHide" : "histEraQuizReveal");
                    }), t.classList.add("visible");
                }
                function c(e) {
                    return e + "_" + (Ht || "en");
                }
            }
            function Ji(e) {
                e || (e = Sa());
                var t = document.getElementById("eraCompareModal"), n = document.getElementById("eraCompareModalBody");
                if (t && n && Ne) {
                    var i = e ? e.id : Ne[0] && Ne[0].id, a = Ne, r = i, o = a.filter(function(e) {
                        return e.id !== i;
                    })[0], s = o ? o.id : i, l = a.map(function(e) {
                        return '<option value="' + Ti(e.id) + '">' + Ti(Ai(e, "title") + " — " + (e.yearLabel || "")) + "</option>";
                    }).join("");
                    n.innerHTML = '<div class="hist-compare-pick"><label>' + Ti(zi("histCompareEraA")) + '</label><select id="cmpA" class="history-region-select">' + l + '</select></div><div class="hist-compare-pick"><label>' + Ti(zi("histCompareEraB")) + '</label><select id="cmpB" class="history-region-select">' + l + '</select></div><div class="hist-compare-table" id="cmpTable"></div><div class="hist-compare-overlay-row"><button type="button" class="btn history-action-btn" id="btnOverlayCompareOnMap">' + Ti(zi("histCompareOverlayBtn")) + "</button></div>", 
                    n.querySelector("#cmpA").value = r, n.querySelector("#cmpB").value = s, n.querySelector("#cmpA").addEventListener("change", d), 
                    n.querySelector("#cmpB").addEventListener("change", d);
                    var c = n.querySelector("#btnOverlayCompareOnMap");
                    c && c.addEventListener("click", function() {
                        var e = a.find(function(e) {
                            return e.id === n.querySelector("#cmpA").value;
                        }), t = a.find(function(e) {
                            return e.id === n.querySelector("#cmpB").value;
                        });
                        e && t && (sa(), ia(e.id, t.id));
                    }), d(), t.classList.add("visible");
                }
                function d() {
                    var e = a.find(function(e) {
                        return e.id === n.querySelector("#cmpA").value;
                    }), t = a.find(function(e) {
                        return e.id === n.querySelector("#cmpB").value;
                    });
                    function i(e) {
                        return '<div class="hist-cmp-cell"><strong>' + Ti(Ai(e, "title")) + "</strong><div>" + Ti(e.yearLabel || "") + "</div><div>" + Ti(Wi(e)) + "</div><div>" + Ti(e.desc && (Ai(e, "desc") || e.desc_en) || "") + '</div><div class="hist-cmp-polities">' + Ki(e).map(Ti).join(" · ") + "</div></div>";
                    }
                    e && t && (n.querySelector("#cmpTable").innerHTML = '<div class="hist-cmp-head">' + Ti(zi("histComparePeriod")) + '</div><div class="hist-cmp-head">' + Ti(zi("histCompareEraA")) + '</div><div class="hist-cmp-head">' + Ti(zi("histCompareEraB")) + '</div><div class="hist-cmp-label">' + Ti(zi("histCompareRegion")) + "</div>" + i(e) + i(t));
                }
            }
            function Zi(e) {
                if (e || (e = Sa()), e) {
                    var t = document.getElementById("studySheetPrintContent");
                    if (t) {
                        var n = "<h1>" + Ti(zi("histStudyTitle")) + "</h1><h2>" + Ti(Ai(e, "title")) + '</h2><p class="ss-meta">' + Ti(e.yearLabel || "") + " · " + Ti(Wi(e)) + '</p><p class="ss-desc">' + Ti(Ai(e, "desc") || e.desc_en || "") + "</p><h3>" + Ti(zi("histComparePolities")) + "</h3><ul>" + Ki(e).map(function(e) {
                            return "<li>" + Ti(e) + "</li>";
                        }).join("") + "</ul><h3>" + Ti(zi("histSourcesBtn")) + "</h3><ol>" + ta(e.sources) + '</ol><p class="ss-disclaimer">' + Ti(zi("histEraDisclaimer")) + "</p>";
                        t.innerHTML = n, window.print();
                    } else window.print();
                }
            }
            function ea(e) {
                var t = String(null == e ? "" : e).trim();
                if (!t) return "";
                var n = null, i = t, a = t.match(/(10\.\d{4,9}\/[^\s"'"()<>]+)/i), r = /https?:\/\/\S+/i.test(t);
                if (a && !r) n = "https://doi.org/" + a[1].replace(/[.,;]$/, ""); else if (r) {
                    var o = t.match(/https?:\/\/[^\s"'"()<>]+/i);
                    n = o ? o[0] : null, o && (i = t.replace(o[0], "").trim() || o[0]);
                } else n = "https://scholar.google.com/scholar?q=" + encodeURIComponent(t);
                return '<a href="' + Ti(n) + '" target="_blank" rel="noopener noreferrer" class="hist-source-link">' + Ti(i) + ' <i data-lucide="external-link"></i></a>';
            }
            function ta(e) {
                return (e || []).map(function(e) {
                    return "<li>" + ea(e) + "</li>";
                }).join("");
            }
            function na(e) {
                if (e || (e = Sa()), e && e.polities && e.polities.length) {
                    var t = e.polities.map(function(e) {
                        var t;
                        e.geoJSON && e.geoJSON.type ? t = e.geoJSON : t = {
                            type: "MultiPolygon",
                            coordinates: (e.rings || []).map(function(e) {
                                return za({
                                    rings: [ e ]
                                }).coordinates[0];
                            })
                        };
                        var n = {
                            polityId: e.id,
                            name_ar: e.name_ar,
                            name_en: e.name_en
                        };
                        return e.color && (n.color = e.color), e.capital && (n.capital = e.capital), e.founder && (n.founder = e.founder), 
                        e.religion && (n.religion = e.religion), e.foundingYear && (n.foundingYear = e.foundingYear), 
                        e.endYear && (n.endYear = e.endYear), {
                            type: "Feature",
                            properties: n,
                            geometry: t
                        };
                    }), n = {
                        type: "FeatureCollection",
                        metadata: {
                            source: "Lepidos Atlas",
                            eraId: e.id,
                            title: Ai(e, "title"),
                            year: e.sort,
                            yearLabel: e.yearLabel || "",
                            sources: e.sources || []
                        },
                        features: t
                    }, i = JSON.stringify(n, null, 2), a = String(e.id).replace(/[^a-z0-9_-]/gi, "_") + "_" + (e.yearLabel || String(e.sort || "")).replace(/[^a-z0-9]/gi, "_") + ".geojson", r = new Blob([ i ], {
                        type: "application/geo+json"
                    }), o = URL.createObjectURL(r), s = document.createElement("a");
                    s.href = o, s.download = a, document.body.appendChild(s), s.click(), document.body.removeChild(s), 
                    setTimeout(function() {
                        URL.revokeObjectURL(o);
                    }, 1e3), c && (c.textContent = zi("exportGeoJSONSuccess"), c.classList.add("show"), 
                    setTimeout(function() {
                        c.classList.remove("show");
                    }, 2e3));
                }
            }
            function ia(e, t) {
                if (rn && on && Pe && "eras" === Fe) {
                    var n = Ne.find(function(t) {
                        return t.id === e;
                    }), i = Ne.find(function(e) {
                        return e.id === t;
                    });
                    n && i && (He = n.id, "history" === _n && T.classList.contains("visible") && vn && ji(vn), 
                    Aa(!0), on && on.selectAll("*").remove(), i.polities.forEach(function(e) {
                        var t = za(e), n = Gn(t);
                        n && on.append("path").attr("d", n).attr("fill", "#f59e0b").attr("fill-opacity", .25).attr("stroke", "#f59e0b").attr("stroke-width", 2.5).attr("stroke-opacity", .9).attr("stroke-dasharray", "4,4").attr("vector-effect", "non-scaling-stroke");
                    }), function(e, t) {
                        ra();
                        var n = document.createElement("div");
                        n.className = "hist-compare-floating-banner", n.id = "histCompareFloatingBanner";
                        var i = document.createElement("div");
                        i.textContent = zi("histCompareOverlayTitle").replace("{a}", Ai(e, "title") + " (" + (e.yearLabel || "") + ")").replace("{b}", Ai(t, "title") + " (" + (t.yearLabel || "") + ")");
                        var a = document.createElement("button");
                        a.type = "button", a.className = "hist-compare-close-btn", a.setAttribute("aria-label", zi("histCompareOverlayClose")), 
                        a.innerHTML = "&times;", a.addEventListener("click", function() {
                            aa(), Ne.find(function(e) {
                                return e.id === He;
                            }) && Aa(!0);
                        }), n.appendChild(i), n.appendChild(a), document.body.appendChild(n), window.__histCompareBanner = n;
                    }(n, i), window.updateHash && window.updateHash());
                }
            }
            function aa() {
                on && on.selectAll("*").remove(), ra();
            }
            function ra() {
                var e = document.getElementById("histCompareFloatingBanner");
                e && e.parentNode && e.parentNode.removeChild(e);
            }
            function oa() {
                if ("undefined" != typeof lucide && lucide.createIcons) try {
                    lucide.createIcons();
                } catch (e) {}
            }
            function sa() {
                [ "eraQuizModal", "eraCompareModal" ].forEach(function(e) {
                    var t = document.getElementById(e);
                    t && t.classList.remove("visible");
                });
            }
            function la(forceQuiz) {
                if ((Te && !forceQuiz) || Pe) return;
                Be && mo(), Re = {
                    colorMode: ae,
                    currentReligionFilter: ie
                }, Ci.forEach(function(e) {
                    Re[e] = Li[e].getFlag();
                }), "all" !== ie && (ie = "all", m(h, '.religion-btn[data-religion="all"]')), "normal" !== ae && Vr("normal"), 
                Pe = !0, qe || He || window.religionsStillActive && window.religionsStillActive() || (Fe = null), 
                Di(), wa(), Ca("history"), Rn && window.drawHistWonders && Fc(), qn && window.drawHistCapitals && Nc(), 
                On && window.drawHistBattles && Dc(), Nn && window.drawHistSacredSites && Hc(), 
                ke && window.drawHistoricalRoutes && qa(), "wars" === Fe && window.historyWarSelected() ? wi() : "eras" === Fe && He ? Aa() : (ca(), 
                da());
            }
            function ca() {
                rn && rn.selectAll("*").remove(), "faiths" !== Fe && Bl && Bl.selectAll("*").remove();
                var e = document.getElementById("legend");
                e && Pe && (e.innerHTML = "");
            }
            function da() {
                var e = document.getElementById("histSourcesPanel");
                e && (e.innerHTML = ""), rn && rn.selectAll("*").remove();
                var t = document.getElementById("histEmptyState");
                t && (t.style.display = "block", t.innerHTML = '<div class="hist-empty-title">' + Ti(zi("histSelectToBegin")) + '</div><div class="hist-empty-cue">' + Ti(zi("histSelectCue")) + "</div>");
                var i = document.getElementById("histWarCardDetails");
                i && (i.style.display = "none");
                var a = document.getElementById("histEraEmptyState");
                a && (a.style.display = "block");
                var r = document.getElementById("histEraCardDetails");
                r && (r.style.display = "none"), function() {
                    if (ya) return;
                    if (n()) return void (ya = !0);
                    var e;
                    ya = !0, e = "eras" === Fe ? document.getElementById("historyEraGroup") : document.getElementById("histWarTabs");
                    if (!e) return;
                    e.classList.remove("hist-pulse"), e.offsetWidth, e.classList.add("hist-pulse"), 
                    setTimeout(function() {
                        e && e.classList.remove("hist-pulse");
                    }, 1800);
                }();
            }
            function ua(e, t) {
                if (e) {
                    e.innerHTML = '<div class="history-empty-state-box"><p class="history-empty-msg">' + Ti(t || zi("histNoResults")) + '</p><button type="button" class="btn btn-reset-hist-filters" id="resetHistFiltersBtn">' + Ti(zi("resetBtn")) + "</button></div>";
                    var n = e.querySelector("#resetHistFiltersBtn");
                    n && n.addEventListener("click", function() {
                        Ve = "";
                        var e = document.getElementById("histSearchInput");
                        e && (e.value = "");
                        var t = document.getElementById("histErasSearchInput");
                        t && (t.value = ""), Ge = "all";
                        var n = document.getElementById("histFilterRegion");
                        n && (n.value = "all");
                        var i = document.getElementById("histErasFilterRegion");
                        i && (i.value = "all"), Ye = "all";
                        var a = document.getElementById("histFilterReligion");
                        a && (a.value = "all"), dl();
                    });
                }
            }
            window.fetchHistoricalWars = qi, window.updateHistSubmodeVis = Ni, Ze = function(e) {
                Xe = e;
                var t = mi();
                if (t) {
                    var n = fi(t, e);
                    if (n) {
                        Oe = n.id, Fi(t);
                        var i = document.getElementById("histWarCardYears"), a = document.getElementById("histWarCardDesc");
                        i && (i.textContent = n.year || t.years_ar || ""), a && (a.textContent = Ai(n, "desc") || Ai(t, "desc") || ""), 
                        Di(), wi();
                        var r = zi("start" === e ? "histPhaseStart" : "peak" === e ? "histPhasePeak" : "histPhaseEnd") || e;
                        X(Ai(t, "name") + " — " + r + " (" + (n.year || "") + ")");
                        var o = document.getElementById("countryPanel");
                        vn && o && o.classList.contains("visible") && ji(vn);
                    }
                }
            }, window.setHistWarPhase = Ze, window.exportEraGeoJSON = na, window.renderMapComparisonOverlay = ia, 
            window.clearMapComparisonOverlay = aa, window.formatAcademicSource = ea, window.closeEraModals = sa, 
            window.eraOpenQuiz = Xi, window.eraOpenCompare = Ji, window.eraPrintStudySheet = Zi, 
            window.eraCopyLink = Yi, window.historyWarSelected = function() {
                return !!qe && nt.some(function(e) {
                    return e.id === qe;
                });
            };
            var ya = !1;
            function va(e) {
                !function() {
                    Ha(), Gl(), rn && rn.selectAll("*").interrupt().remove(), on && on.selectAll("*").interrupt().remove(), 
                    Bl && Bl.selectAll("*").interrupt().remove(), ln && ln.selectAll("*").interrupt().remove(), 
                    sn && sn.selectAll("*").interrupt().remove(), cn && cn.selectAll("*").interrupt().remove(), 
                    dn && dn.selectAll("*").interrupt().remove(), un && un.selectAll("*").interrupt().remove(), 
                    pn && pn.selectAll("*").interrupt().remove(), ra(), $e = null;
                    var e = document.getElementById("legend");
                    e && Pe && (e.innerHTML = "");
                }(), Pe = !1;
                var t = document.getElementById("histSourcesPanel");
                t && (t.style.display = "none");
                var n = document.getElementById("histWarTabs");
                n && n.style.setProperty("display", "none", "important");
                var i = document.getElementById("histScenarioBtns");
                i && i.style.setProperty("display", "none", "important");
                var a = document.getElementById("historyEraGroup");
                a && a.style.setProperty("display", "none", "important");
                var r = document.getElementById("historyBottomBar");
                r && (r.style.display = "none");
                var o = document.getElementById("historyFaithsTimelineWrap");
                o && (o.style.display = "none");
                var s = document.getElementById("historyEraTimelineWrap");
                s && (s.style.display = "none");
                var l = document.getElementById("historyTerrainTimelineWrap");
                l && (l.style.display = "none"), $c(), Ha(), Gl(), uc(), window.deactivateTravelersMode && window.deactivateTravelersMode(), 
                Hn = !1;
                var c = document.getElementById("histTerrainBtn");
                if (c && (c.classList.remove("toggle-on"), c.setAttribute("aria-pressed", "false")), 
                "history" === _n && T.classList.contains("visible") && Eo(), wa(), Ca("geo"), !1 !== e && Re) {
                    var d = Re;
                    Ci.forEach(function(e) {
                        d[e] && !Li[e].getFlag() && Si(e);
                    }), "all" !== d.currentReligionFilter && (ie = d.currentReligionFilter, m(h, '.religion-btn[data-religion="' + d.currentReligionFilter + '"]')), 
                    d.colorMode !== ae && Vr(d.colorMode);
                }
                Re = null;
            }
            function wa() {
                var e = document.getElementById("globeViewBtn"), t = Pe;
                e && e.style.setProperty("display", t ? "none" : "", "important");
            }
            function Ea() {
                var e = "history" === Ke;
                document.body.classList.toggle("section-history", e), document.body.classList.toggle("section-geo", !e);
                var t = document.getElementById("sectionGeoBtn"), n = document.getElementById("sectionHistoryBtn");
                t && (t.classList.toggle("active", !e), t.setAttribute("aria-pressed", e ? "false" : "true")), 
                n && (n.classList.toggle("active", e), n.setAttribute("aria-pressed", e ? "true" : "false")), 
                wa();
            }
            var ka = [ "#modeButtons", "#sectionBaseMapLabel", "#compareProjectionsBtn", "#barDivisionBtn" ], xa = [ "#historyModeDock", "#histTerrainBtn", "#histSourcesBtn", "#histOpacityControl" ];
            function _a(e, t) {
                e && (t ? e.style.setProperty("display", "flex", "important") : e.style.setProperty("display", "none", "important"));
            }
            function Ca(e) {
                var t = "history" === e, n = [ un, cn, dn, sn, ln, pn, mn, rn, on ];
                [ ni, ii, tn, Ut, $t, Kt, Gt, Yt, Vt, Qt, Xt, Jt, nn, an, Zt, en, Xn ].forEach(function(e) {
                    e && e.style("display", t ? "none" : null);
                }), n.forEach(function(e) {
                    e && e.style("display", t ? null : "none");
                }), t ? (ee && Z && ee.clearRect(0, 0, Z.width, Z.height), Jn && (Jn.style("display", null), 
                _s()), ha()) : (Tr(), Jn && Jn.style("display", "none"), Qn && Qn.style("display", null), 
                yn && yn.attr("fill", function(e) {
                    return ma(e);
                }).attr("stroke", function(e) {
                    return fa(e);
                }).attr("stroke-width", function(e) {
                    return .8;
                }).attr("stroke-dasharray", "none").attr("filter", pa).style("pointer-events", null));
            }
            function La(e) {
                var t = "history" === e;
                ka.forEach(function(e) {
                    _a(document.querySelector(e), !t);
                }), xa.forEach(function(e) {
                    _a(document.querySelector(e), t);
                }), document.querySelectorAll(".geo-layer").forEach(function(e) {
                    _a(e, !t);
                }), document.querySelectorAll(".hist-layer").forEach(function(e) {
                    _a(e, t);
                }), Ca(e);
            }
            function Ba() {
                return Ne ? Promise.resolve(Ne) : (De || (De = fetch(e + "historical-eras-data.json").then(function(e) {
                    if (!e.ok) throw new Error("HTTP " + e.status);
                    return e.json();
                }).then(function(e) {
                    return Ne = e.eras || [], Ne.forEach(function(e) {
                        e.epoch = ot(e);
                    }), window.historicalErasData = Ne, Ne;
                }).catch(function(e) {
                    throw De = null, e;
                })), De);
            }
            function Sa() {
                return Ne && Ne.length && He && Ne.find(function(e) {
                    return e.id === He;
                }) || null;
            }
            function Ia(e) {
                for (;Array.isArray(e) && 1 === e.length && Array.isArray(e[0]); ) e = e[0];
                if (Array.isArray(e) && "number" == typeof e[0]) {
                    for (var t = [], n = 0; n + 1 < e.length; n += 2) t.push([ e[n], e[n + 1] ]);
                    e = t;
                }
                return e;
            }
            function za(e, t) {
                t || (t = void 0 !== Je && Je ? Je : "peak");
                var n = e && e.rings || [];
                return n.length ? {
                    type: "MultiPolygon",
                    coordinates: n.map(function(e) {
                        var t = Ia(e);
                        !t.length || t[0][0] === t[t.length - 1][0] && t[0][1] === t[t.length - 1][1] || (t = t.concat([ t[0].slice() ]));
                        try {
                            d3.geoArea({
                                type: "Polygon",
                                coordinates: [ t ]
                            }) > 2 * Math.PI && (t = t.slice().reverse());
                        } catch (e) {}
                        return t;
                    }).map(function(e) {
                        return [ e ];
                    })
                } : {
                    type: "MultiPolygon",
                    coordinates: []
                };
            }
            function Aa(e) {
                var t = document.getElementById("histEmptyState");
                t && (t.style.display = "none");
                var i = document.getElementById("histEraEmptyState");
                i && (i.style.display = "none");
                var a = document.getElementById("histEraCardDetails");
                if (a && (a.style.display = "block"), rn && (e || aa(), rn.selectAll("*").interrupt(), 
                e || !1 !== n() ? rn.selectAll("*").remove() : rn.selectAll("path,text").transition().duration(220).style("opacity", "0").on("end", function() {
                    d3.select(this).remove();
                }), Pe && "eras" === Fe)) {
                    var r = Sa();
                    if (!r) return ca(), void da();
                    var o = Math.max(.4, li.k), s = Math.max(4, Math.min(15, (xi ? 8 : 11) / o)), l = n() ? 0 : 300, c = r.phases && r.phases[Je] ? r.phases[Je] : null, d = c && Array.isArray(c.polities) && c.polities.length ? c.polities : r.polities, u = 0;
                    d.forEach(function(t) {
                        var n = za(t, Je), i = Gn(n);
                        if (i) {
                            var a = _o(Ai(t, "name")), o = $e === t || $e && t && $e.id && t.id && $e.id === t.id, s = rn.append("path").attr("d", i).attr("fill", t.color).attr("fill-opacity", Qe).style("fill-opacity", Qe).attr("stroke", o ? "#ffffff" : t.color).attr("stroke-width", o ? 3 : 1.8).attr("stroke-dasharray", o ? "none" : "7,4").attr("vector-effect", "non-scaling-stroke").attr("class", "hist-polity-boundary").attr("role", "button").attr("tabindex", "0").attr("aria-label", a).style("cursor", "pointer").style("pointer-events", "auto"), c = 0, p = 0, m = 0;
                            if (s.on("pointerdown", function(e) {
                                c = e.clientX, p = e.clientY, m = Date.now();
                            }).on("pointerup", function(e) {
                                Math.hypot(e.clientX - c, e.clientY - p) < 8 && Date.now() - m < 600 && (e.stopPropagation && e.stopPropagation(), 
                                u = Date.now(), $e === t || $e && t && $e.id && t.id && $e.id === t.id ? Ta() : Pa(t, r));
                            }).on("click", function(e) {
                                e && e.stopPropagation && e.stopPropagation(), Date.now() - u < 500 || ($e === t || $e && t && $e.id && t.id && $e.id === t.id ? Ta() : Pa(t, r));
                            }).on("keydown", function(e) {
                                "Enter" !== e.key && " " !== e.key || (e.preventDefault && e.preventDefault(), $e === t || $e && t && $e.id && t.id && $e.id === t.id ? Ta() : Pa(t, r));
                            }), e ? s.attr("opacity", 1).style("opacity", 1) : s.attr("opacity", 0).style("opacity", 0).transition().duration(l).attr("opacity", 1).style("opacity", 1), 
                            de) {
                                ga();
                                var f = d.indexOf(t), h = (f >= 0 ? f : 0) % 8;
                                rn.append("path").attr("class", "hist-cbpat").attr("d", i).attr("fill", "url(#cbpat-" + h + ")").attr("stroke", "none").style("pointer-events", "none");
                            }
                        }
                    }), d.forEach(function(t) {
                        var n = t.label, i = ao()(n || [ 0, 0 ]);
                        if (i && !isNaN(i[0])) {
                            var a = _o(Ai(t, "name")), r = rn.append("text").attr("x", i[0]).attr("y", i[1]).attr("class", "hist-era-label").text(a).attr("fill", "#ffffff").attr("font-size", s + "px").attr("font-weight", "bold").attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("pointer-events", "none").attr("style", "text-shadow: 0 1px 3px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.85); letter-spacing: 0.3px;");
                            e ? r.attr("opacity", .95) : r.attr("opacity", 0).transition().duration(l).attr("opacity", .95);
                        }
                    }), Co(o), ke && window.drawHistoricalRoutes && window.drawHistoricalRoutes(!0), 
                    window.drawHistoricalTravelers && window.drawHistoricalTravelers(), window.drawHistCapitals && window.drawHistCapitals(), 
                    window.drawHistBattles && window.drawHistBattles(), window.drawHistWonders && window.drawHistWonders(), 
                    Fa();
                }
            }
            function Ta() {
                $e = null, Mr(), Eo(), Aa(!0);
            }
            function Pa(e, t) {
                var n = document.getElementById("panelContent"), i = document.getElementById("countryPanel");
                if (n && i) {
                    cl(), $e = e, Mr(), vn = null, _n = "history", Aa(!0);
                    var a = "function" == typeof getHistoricalPolityProfile ? getHistoricalPolityProfile(e.id || Ai(e, "name") || t && t.id) : null, r = a && Ai(a, "founder") || Ai(e, "founder") || e.foundingYear || "", o = a && Ai(a, "religion") || Ai(e, "religion") || "", s = a && Ai(a, "language") || Ai(e, "language") || "", l = a && Ai(a, "ethnicity") || Ai(e, "ethnicity") || "", c = a && Ai(a, "capital") || Ai(e, "capital") || "", d = a && Ai(a, "origin") || Ai(e, "origin") || "", u = a && Ai(a, "fall") || Ai(e, "fall") || e.endYear || "", p = '<div class="hist-profile-card"><div class="hist-profile-header"><h3 class="hist-profile-title">🏛️ ' + Ti(_o(a && Ai(a, "name") || Ai(e, "name"))) + '</h3><p class="hist-profile-subtitle"><strong>' + Ti(_o(Ai(t, "title"))) + "</strong> — " + Ti(t.yearLabel || "") + "</p></div>";
                    p += '<div class="hist-profile-grid">', r && (p += '<div class="hist-profile-item"><div class="hist-profile-item-label">' + Ti(zi("histFounderTitle")) + '</div><div class="hist-profile-item-val">' + Ti(r) + "</div></div>"), 
                    c && (p += '<div class="hist-profile-item"><div class="hist-profile-item-label">' + Ti(zi("histCapitalTitle")) + '</div><div class="hist-profile-item-val">' + Ti(c) + "</div></div>"), 
                    o && (p += '<div class="hist-profile-item full-width"><div class="hist-profile-item-label">' + Ti(zi("histReligionTitle")) + '</div><div class="hist-profile-item-val">' + Ti(o) + "</div></div>"), 
                    s && (p += '<div class="hist-profile-item"><div class="hist-profile-item-label">' + Ti(zi("histLanguageTitle")) + '</div><div class="hist-profile-item-val">' + Ti(s) + "</div></div>"), 
                    l && (p += '<div class="hist-profile-item"><div class="hist-profile-item-label">' + Ti(zi("histEthnicityTitle")) + '</div><div class="hist-profile-item-val">' + Ti(l) + "</div></div>"), 
                    p += "</div>", d && (p += '<div class="hist-narrative-box origin-box"><div class="hist-narrative-title">' + Ti(zi("histHowStartedTitle")) + '</div><p class="hist-narrative-text">' + Ti(d) + "</p></div>"), 
                    u && (p += '<div class="hist-narrative-box fall-box"><div class="hist-narrative-title">' + Ti(zi("histHowEndedTitle")) + '</div><p class="hist-narrative-text">' + Ti(u) + "</p></div>");
                    var m = Ai(t, "desc");
                    m && !d && (p += '<p class="hist-note">' + Ti(m) + "</p>");
                    var f = zi("exportGeoJSONBtn"), h = zi("histEraStudyBtn"), y = zi("histEraQuizBtn"), g = zi("histEraCompareBtn"), v = zi("histEraCopyLink");
                    p += '<div class="history-actions"><button type="button" class="btn history-action-btn" id="eraActStudy">' + Ti(h) + '</button><button type="button" class="btn history-action-btn" id="eraActQuiz">' + Ti(y) + '</button><button type="button" class="btn history-action-btn" id="eraActCompare">' + Ti(g) + '</button><button type="button" class="btn history-action-btn" id="eraActExportGeoJSON">' + Ti(f) + '</button><button type="button" class="btn history-action-btn" id="eraActCopyLink">' + Ti(v) + "</button></div>", 
                    p += '<details class="hist-sources-mini"><summary>' + Ti(zi("histSourcesBtn")) + "</summary><ul>" + ta(t.sources) + "</ul></details>", 
                    p += '<p class="hist-disclaimer-mini">' + Ti(zi("histEraDisclaimer")) + "</p></div>", 
                    wn = performance.now(), n.innerHTML = p, i.style.display = "block", requestAnimationFrame(function() {
                        requestAnimationFrame(function() {
                            i.classList.add("visible");
                        });
                    }), function(e) {
                        if (!e) return;
                        var t = document.getElementById("panelContent");
                        if (!t) return;
                        var n = t.querySelector("#eraActStudy"), i = t.querySelector("#eraActQuiz"), a = t.querySelector("#eraActCompare"), r = t.querySelector("#eraActCopyLink"), o = t.querySelector("#eraActExportGeoJSON");
                        n && (n.onclick = function() {
                            Zi(e);
                        });
                        i && (i.onclick = function() {
                            Xi(e);
                        });
                        a && (a.onclick = function() {
                            Ji(e);
                        });
                        r && (r.onclick = function() {
                            Yi(e);
                        });
                        o && (o.onclick = function() {
                            na(e);
                        });
                    }(t), oa();
                }
            }
            function Oa(e) {
                var t = document.getElementById("histCurrentYearBadge"), n = document.getElementById("histTimelineCaption"), i = document.getElementById("histTimeline");
                if (e) {
                    var a = null;
                    "function" == typeof getHistoricalPolityProfile && (a = getHistoricalPolityProfile(e.id) || e.polities && e.polities[0] && getHistoricalPolityProfile(e.polities[0].id || Ai(e.polities[0], "name")));
                    var r = e && e.phases && e.phases[Je] ? e.phases[Je] : null;
                    if (r) {
                        t && (t.textContent = r.yearLabel || e.yearLabel || "");
                        var o = Ai(r, "title"), s = Ai(r, "desc");
                        n && (n.textContent = (o ? o + " — " : "") + s);
                    } else if (a && a.phases && a.phases[Je]) {
                        var l = a.phases[Je];
                        t && (t.textContent = l.year);
                        var c = Ai(l, "title"), d = Ai(l, "desc");
                        n && (n.textContent = (c ? c + " — " : "") + d);
                    } else t && (t.textContent = e.yearLabel || ""), n && (n.textContent = Ai(e, "desc") || Ai(e, "title") || "");
                    if (i && Ne && Ne.length) {
                        var u = Ne.map(function(e) {
                            return e.sort || 0;
                        }), p = Math.min.apply(null, u) - 50, m = Math.max.apply(null, u) + 50, f = Math.max(0, Math.min(100, (e.sort - p) / (m - p) * 100));
                        i.style.setProperty("--era-pct", f + "%"), i.setAttribute("aria-valuenow", e.sort || 0), 
                        i.setAttribute("aria-valuemin", p), i.setAttribute("aria-valuemax", m), i.setAttribute("aria-valuetext", (e.yearLabel ? e.yearLabel + " - " : "") + Ai(e, "title"));
                    }
                } else t && (t.textContent = ""), n && (n.textContent = "");
            }
            function Ra(e) {
                var t = document.getElementById("histEraPhaseGroup");
                t && e && t.querySelectorAll(".hist-phase-btn").forEach(function(e) {
                    e.classList.toggle("active", e.getAttribute("data-phase") === Je);
                });
            }
            function Na(e) {
                var t = document.getElementById("histEraEmptyState"), n = document.getElementById("histEraCardDetails"), i = document.getElementById("histEraCardTitle"), a = document.getElementById("histEraCardEpoch"), r = document.getElementById("histEraCardYears"), o = document.getElementById("histEraCardDesc"), s = document.getElementById("histEraCardPolities");
                if (!e) return t && (t.style.display = "block"), void (n && (n.style.display = "none"));
                t && (t.style.display = "none"), n && (n.style.display = "block");
                var l = e.phases && e.phases[Je] ? e.phases[Je] : null;
                l && Array.isArray(l.polities) && l.polities.length ? l.polities : e.polities;
                if (i) {
                    var c = l ? Ai(l, "title") : "";
                    i.textContent = c || (e.yearLabel ? e.yearLabel + " · " : "") + Ai(e, "title");
                }
                var d = ot(e), u = rt.find(function(e) {
                    return e.id === d;
                });
                a && (a.textContent = u ? zi(u.key) : d), Ra(e), r && (r.textContent = l && l.yearLabel || e.yearLabel || ""), 
                o && (o.textContent = l && Ai(l, "desc") || Ai(e, "desc") || Ai(e, "title") || ""), 
                s && (s.innerHTML = "");
            }
            function Da() {
                var e = document.getElementById("histSourcesPanel"), t = document.getElementById("histTimeline"), n = document.getElementById("historyEraGroup");
                if (n) {
                    if (n.innerHTML = "", !Ne || !Ne.length) return n.innerHTML = '<span class="history-loading">' + Ti(zi("histEraLoading")) + "</span>", 
                    t && (t.style.display = "none"), e && (e.innerHTML = ""), void Ba().then(function() {
                        "eras" === Fe && (Di(), He && Ne.some(function(e) {
                            return e.id === He;
                        }) ? Aa() : (ca(), da()));
                    }).catch(function() {
                        "eras" === Fe && (n.innerHTML = '<span class="history-loading">' + Ti(zi("histEraLoadError")) + "</span>");
                    });
                    var i = Sa(), a = Ne.filter(Ri);
                    if (a.sort(function(e, t) {
                        return (e.sort || 0) - (t.sort || 0);
                    }), Ue = a.slice(), !a.length) {
                        ua(n, zi("histNoResults")), t && (t.style.display = "none"), e.innerHTML = "", rn && rn.selectAll("*").remove();
                        var r = document.getElementById("legend");
                        return r && Pe && (r.innerHTML = ""), void Na(null);
                    }
                    if (!a.some(function(e) {
                        return e.id === He;
                    }) && He && a.length && (He = a[0].id, i = Sa()), Oa(i), Na(i), rt.forEach(function(e) {
                        var t = a.filter(function(t) {
                            return ot(t) === e.id;
                        });
                        if ("all" === at || at === e.id) {
                            var i = document.createElement("div");
                            i.className = "hist-epoch-col", i.setAttribute("data-epoch", e.id);
                            var r = document.createElement("div");
                            r.className = "hist-epoch-col-header", r.innerHTML = '<span class="hist-epoch-col-title">' + Ti(zi(e.key)) + '</span><span class="hist-epoch-col-count">' + t.length + " " + Ti(zi("histItemCountEras") || "") + "</span>", 
                            i.appendChild(r);
                            var o = document.createElement("div");
                            if (o.className = "hist-epoch-col-items", t.length) t.forEach(function(e) {
                                var t = document.createElement("button");
                                t.type = "button", t.className = "btn history-scenario-btn" + (e.id === He ? " active" : ""), 
                                t.innerHTML = '<span class="hist-tab-title">' + Ti(Ai(e, "title")) + "</span>" + (e.yearLabel ? ' <span class="hist-tab-years">' + Ti(e.yearLabel) + "</span>" : ""), 
                                t.title = (e.yearLabel || "") + " · " + Ai(e, "title"), t.addEventListener("click", function() {
                                    if (Ha(), "eras" === Fe && He === e.id) return He = null, $e = null, Di(), ca(), 
                                    void da();
                                    Fe = "eras", He = e.id, $e = null, X((zi("histTabEras") || "حقبة") + ": " + Ai(e, "title") + " (" + (e.yearLabel || "") + ")"), 
                                    window.innerWidth <= 680 && cl(), Di(), Aa(), vn && "history" === _n && T.classList.contains("visible") && ji(vn);
                                }), o.appendChild(t);
                            }); else {
                                var s = document.createElement("div");
                                s.className = "hist-col-empty-msg", s.textContent = "—", o.appendChild(s);
                            }
                            i.appendChild(o), n.appendChild(i);
                        }
                    }), !He || !i) return t && (t.style.display = "none"), ca(), da(), void Na(null);
                    var o = Ne && Ne.length ? Ne.map(function(e) {
                        return e.sort || 0;
                    }) : a.map(function(e) {
                        return e.sort || 0;
                    }), s = (o.length ? Math.min.apply(null, o) : -2500) - 50, l = (o.length ? Math.max.apply(null, o) : 1962) + 50;
                    if (t) {
                        t.style.display = "block", t.innerHTML = "";
                        var c = Math.max(0, Math.min(100, (i.sort - s) / (l - s) * 100));
                        t.style.setProperty("--era-pct", c + "%");
                        var d = document.createElement("div");
                        d.className = "history-era-timeline-thumb", t.appendChild(d);
                    }
                    if (a.forEach(function(e) {
                        var n = document.createElement("button");
                        n.type = "button", n.className = "history-tl-dot" + (e.id === He ? " active" : ""), 
                        n.style.left = Math.max(0, Math.min(100, (e.sort - s) / (l - s) * 100)) + "%", n.title = (e.yearLabel || "") + " · " + Ai(e, "title"), 
                        n.setAttribute("aria-label", n.title), n.dataset.eraId = e.id, n.addEventListener("click", function(t) {
                            t.stopPropagation(), Ha(), Fe = "eras", He = e.id, Oa(e), Di(), Aa();
                        }), t && t.appendChild(n);
                    }), t && !t._eventsBound) {
                        t._eventsBound = !0, t.style.cursor = "pointer", t.style.touchAction = "none";
                        var u = !1;
                        function p(e) {
                            var n = t.getBoundingClientRect();
                            if (n.width) {
                                var i = Math.max(0, Math.min(1, (e - n.left) / n.width)), a = Ne && Ne.length ? Ne : [];
                                if (a.length) {
                                    var r = a.map(function(e) {
                                        return e.sort || 0;
                                    }), o = Math.min.apply(null, r) - 50, s = Math.max.apply(null, r) + 50, l = o + i * (s - o), c = null, d = 1 / 0;
                                    if ((Ue && Ue.length ? Ue : a).forEach(function(e) {
                                        var t = Math.abs((e.sort || 0) - l);
                                        t < d && (d = t, c = e);
                                    }), c) {
                                        var u = Math.max(0, Math.min(100, (c.sort - o) / (s - o) * 100));
                                        t.style.setProperty("--era-pct", u + "%"), c.id !== He && (Fe = "eras", He = c.id, 
                                        $e = null, Oa(c), Na(c), Aa(!0), t.querySelectorAll(".history-tl-dot").forEach(function(e) {
                                            e.classList.toggle("active", e.dataset.eraId === c.id);
                                        }));
                                    }
                                }
                            }
                        }
                        t.addEventListener("pointerdown", function(e) {
                            tt = Date.now(), Ha(), u = !0;
                            try {
                                t.setPointerCapture(e.pointerId);
                            } catch (e) {}
                            p(e.clientX), e.preventDefault();
                        }), t.addEventListener("pointermove", function(e) {
                            u && (tt = Date.now(), p(e.clientX));
                        }), t.addEventListener("pointerup", function() {
                            tt = Date.now(), u && (u = !1, Di(), vn && "history" === _n && T.classList.contains("visible") && ji(vn));
                        }), t.addEventListener("pointercancel", function() {
                            u = !1;
                        }), t.addEventListener("keydown", function(e) {
                            var t = Ue && Ue.length ? Ue : Ne || [];
                            if (t.length) {
                                var n = t.findIndex(function(e) {
                                    return e.id === He;
                                }), i = null;
                                if ("ArrowRight" === e.key || "ArrowUp" === e.key) e.preventDefault(), i = t[-1 === n ? 0 : Math.min(t.length - 1, n + 1)]; else if ("ArrowLeft" === e.key || "ArrowDown" === e.key) {
                                    e.preventDefault(), i = t[-1 === n ? 0 : Math.max(0, n - 1)];
                                } else "Home" === e.key ? (e.preventDefault(), i = t[0]) : "End" === e.key && (e.preventDefault(), 
                                i = t[t.length - 1]);
                                i && (window.selectHistEra(i.id), X((i.yearLabel ? i.yearLabel + " - " : "") + Ai(i, "title")));
                            }
                        });
                    }
                    Fa(), e && (e.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;"><h4>' + Ti(zi("histSourcesTitle")) + '</h4><button type="button" class="hist-drawer-close-btn" style="width:24px;height:24px;font-size:1rem;" onclick="document.getElementById(\'histSourcesPanel\').style.display=\'none\'">&times;</button></div><ul>' + ta(i.sources) + "</ul>"), 
                    oa(), Pe && window.updateHash && window.updateHash();
                }
            }
            function Fa() {
                var e = document.getElementById("legend");
                if (e && (e.innerHTML = "", Pe)) {
                    if ("eras" === Fe) {
                        var t = Sa();
                        if (!t) return;
                        var n = t.phases && t.phases[Je] ? t.phases[Je] : null, i = n && Array.isArray(n.polities) && n.polities.length ? n.polities : t.polities || [];
                        return e.innerHTML = '<div style="font-weight:700;margin-bottom:4px">' + Ti(zi("histLegendLabel")) + "</div>", 
                        void i.forEach(function(t, n) {
                            var i = document.createElement("div");
                            i.className = "legend-item", i.title = Ai(t, "name");
                            var a = document.createElement("span");
                            if (a.className = "legend-color", a.style.background = t.color || "#14B8A6", de) {
                                ga();
                                var r = n % 8;
                                a.innerHTML = '<svg width="18" height="12" style="display:block;border-radius:2px;"><rect width="18" height="12" fill="' + (t.color || "#14B8A6") + '"/><rect width="18" height="12" fill="url(#cbpat-' + r + ')"/></svg>';
                            }
                            i.appendChild(a), i.appendChild(document.createTextNode(_o(Ai(t, "name")))), e.appendChild(i);
                        });
                    }
                    var a = mi();
                    if (a) {
                        var r = hi(a);
                        if (r) {
                            e.innerHTML = '<div style="font-weight:700;margin-bottom:4px">' + Ti(zi("histLegendLabel")) + "</div>";
                            var o = {};
                            (r.participants || []).forEach(function(t) {
                                var n = t.side + "_" + t.role;
                                if (!o[n]) {
                                    o[n] = !0;
                                    var i = document.createElement("div");
                                    i.className = "legend-item";
                                    var r = Mi(a, t.side), s = r ? r.split("—")[0].trim() : "";
                                    i.title = s ? s + " — " + zi(ci(t.role)) : zi(ci(t.role));
                                    var l = document.createElement("span");
                                    l.className = "legend-color";
                                    var c = pi(t) || "transparent";
                                    if (l.style.background = c, pi(t) || (l.style.border = "1px solid #9aa5b1"), de) {
                                        ga();
                                        var d = ba(a, t.side);
                                        l.innerHTML = '<svg width="18" height="12" style="display:block;border-radius:2px;"><rect width="18" height="12" fill="' + (pi(t) || "#9aa5b1") + '"/><rect width="18" height="12" fill="url(#cbpat-' + d + ')"/></svg>';
                                    }
                                    i.appendChild(l), i.appendChild(document.createTextNode(zi(ci(t.role)) + (s ? " · " + s : ""))), 
                                    e.appendChild(i);
                                }
                            }), (r.empires || []).forEach(function(t) {
                                var n = t.side + "_" + t.role;
                                if (!o[n]) {
                                    o[n] = !0;
                                    var i = document.createElement("div");
                                    i.className = "legend-item";
                                    var r = Mi(a, t.side), s = r ? r.split("—")[0].trim() : "";
                                    i.title = s ? s + " — " + zi(ci(t.role)) : zi(ci(t.role));
                                    var l = document.createElement("span");
                                    if (l.className = "legend-color", l.style.background = pi(t) || "transparent", l.style.backgroundImage = "repeating-linear-gradient(45deg, rgba(255,255,255,.85) 0 2px, transparent 2px 5px)", 
                                    de) {
                                        ga();
                                        var c = ba(a, t.side);
                                        l.innerHTML = '<svg width="18" height="12" style="display:block;border-radius:2px;"><rect width="18" height="12" fill="' + (pi(t) || "#9aa5b1") + '"/><rect width="18" height="12" fill="url(#cbpat-' + c + ')"/></svg>';
                                    }
                                    i.appendChild(l), i.appendChild(document.createTextNode(zi(ci(t.role)) + (s ? " · " + s : ""))), 
                                    e.appendChild(i);
                                }
                            });
                        }
                    }
                }
            }
            function Ha() {
                je = !1, We && (clearInterval(We), We = null);
                var e = document.getElementById("histPlayBtn");
                if (e) {
                    e.setAttribute("aria-pressed", "false");
                    var t = e.querySelector("[data-lucide]");
                    t && (t.setAttribute("data-lucide", "play"), lucide && lucide.createIcons && lucide.createIcons());
                }
            }
            function ja() {
                if (!(Ue.length < 2)) if (je) Ha(); else {
                    He && !Ue.every(function(e) {
                        return e.id !== He;
                    }) || Ue.length && (He = Ue[0].id, Di(), Aa()), je = !0;
                    var e = document.getElementById("histPlayBtn");
                    if (e) {
                        e.setAttribute("aria-pressed", "true");
                        var t = e.querySelector("[data-lucide]");
                        t && (t.setAttribute("data-lucide", "pause"), lucide && lucide.createIcons && lucide.createIcons());
                    }
                    We = setInterval(function() {
                        if (je && Ue.length) {
                            var e = -1;
                            Ue.forEach(function(t, n) {
                                t.id === He && (e = n);
                            });
                            var t = Ue[(e + 1) % Ue.length];
                            t && t.id !== He && (He = t.id, $e = null, Di(), Aa());
                        }
                    }, 3600);
                }
            }
            function Wa() {
                je ? Ha() : ja();
            }
            window.updateSvgSectionLayers = Ca, window.applySection = function(e, t, forceQuiz) {
                if (!("geo" !== e && "history" !== e || (Te && !forceQuiz && "geo" === e))) if (La(e), e !== Ke) {
                    if ("history" === e ? (Ke = "history", la(forceQuiz)) : (Ke = "geo", va(), le && Ma(!0)), 
                    La(e), !1 !== t) try {
                        localStorage.setItem("lepidosSection", e);
                    } catch (e) {}
                    Ea(), Yr(), window.updateHash && window.updateHash();
                    var n = !1;
                    try {
                        n = "1" === localStorage.getItem("onboardCompleted_" + e) || "1" === localStorage.getItem("onboardDone_" + e);
                    } catch (e) {}
                    n || setTimeout(function() {
                        var e = document.getElementById("langOverlay"), t = document.getElementById("sectionPickerOverlay"), n = document.getElementById("projectionOverlay");
                        e && "none" !== getComputedStyle(e).display || t && "none" !== getComputedStyle(t).display || n && n.classList.contains("active") || "function" == typeof window.startOnboarding && window.startOnboarding();
                    }, 700);
                } else Ea();
            }, window.applySectionWhenReady = function(e, t) {
                var n = 0;
                !function i() {
                    if (window.applySection) return window.applySection(e, !1), void (t && t());
                    ++n > 150 || setTimeout(i, 60);
                }();
            }, window.enterHistoryMode = la, window.exitHistoryMode = va, window.renderHistoryBar = Di, 
            window.renderEraTabContent = Da, window.drawHistoryScenario = wi, window.drawEraScene = Aa, 
            window.openHistoryPanel = ji, window.deselectHistoryPolity = Ta, window.showEraPolityPanel = Pa, 
            window.historyIsActive = function() {
                return Pe;
            }, window.selectHistoryWar = function(e) {
                return Promise.all([ qi(), Ba(), Ac() ]).then(function() {
                    var t = (nt || []).find(function(t) {
                        return t.id === e;
                    });
                    if (!t) throw new Error("War not found: " + e);
                    Fe = "wars", qe = t.id, Oe = t.scenarios && t.scenarios[0] ? t.scenarios[0].id : null, 
                    $e = null, Di(), wi();
                });
            }, void 0 !== si && si && si.on("end.histzoom", function() {
                Pe && window.drawHistoryScenario && window.drawHistoryScenario(!0);
            }), window.historyModeIsEras = function() {
                return "eras" === Fe;
            }, window.__buildEraFeature = za, window.__normalizeEraRing = Ia, et = function(e) {
                Je = e;
                var t = Sa();
                if (t) {
                    Ra(t), Na(t);
                    var n = t.phases && t.phases[e] ? t.phases[e] : null, i = document.getElementById("histCurrentYearBadge"), a = document.getElementById("histTimelineCaption");
                    n && (i && (i.textContent = n.yearLabel || ""), a && (a.textContent = (Ai(n, "title") ? Ai(n, "title") + " — " : "") + (Ai(n, "desc") || ""))), 
                    Aa(!0);
                    var r = zi("start" === e ? "histPhaseStart" : "peak" === e ? "histPhasePeak" : "histPhaseEnd") || e;
                    X(Ai(t, "title") + " — " + r + (n && n.yearLabel ? " (" + n.yearLabel + ")" : ""));
                }
            }, window.setHistEraPhase = et, window.selectHistEra = function(e) {
                function t(e) {
                    if (e) {
                        Ha(), Fe = "eras", He = e.id, $e = null, Mr();
                        var t = document.getElementById("countryPanel");
                        t && (t.classList.remove("visible"), t.style.display = "none"), Di(), Aa(), X((zi("histTabEras") || "حقبة") + ": " + Ai(e, "title") + " (" + (e.yearLabel || "") + ")");
                    }
                }
                if (!Ne || !Ne.length) return Ba().then(function() {
                    var n = (Ne || []).find(function(t) {
                        return t.id === e;
                    });
                    return t(n), n;
                });
                var n = (Ne || []).find(function(t) {
                    return t.id === e;
                });
                return t(n), Promise.resolve(n);
            }, window.renderHistoryLegend = Fa, window.selectHistoryTab = function(e) {
                Ha(), Gl(), Fe = e, $e = null, "faiths" !== e && (Ql(), window.deactivateFaithsMode && window.deactivateFaithsMode(), 
                Fl(), "histReligion" === _n && Mr());
                "travelers" !== e && window.deactivateTravelersMode && window.deactivateTravelersMode();
                rn && rn.selectAll("*").interrupt().remove();
                if ("faiths" === e) return Di(), void (window.renderFaithsMode && window.renderFaithsMode());
                if ("travelers" === e) return Di(), void (window.renderTravelersMode && window.renderTravelersMode());
                if ("eras" === e) return Ne ? (Di(), void (He && Ne.some(function(e) {
                    return e.id === He;
                }) ? Aa() : (ca(), da()))) : (He = null, Di(), void Ba().then(function() {
                    "eras" === Fe && (Di(), He && Ne.some(function(e) {
                        return e.id === He;
                    }) ? Aa() : (ca(), da()));
                }).catch(function() {
                    var e = document.querySelector("#historyEraGroup .history-scenarios") || document.getElementById("historyEraGroup");
                    e && "eras" === Fe && (e.innerHTML = '<span class="history-loading">' + Ti(zi("histEraLoadError")) + "</span>");
                }));
                Di(), window.historyWarSelected() ? wi() : (ca(), da());
            }, window.getHistEra = Sa, window.getHistWar = mi, window.warsForCountry = function(e) {
                var t = Pi(e || "");
                return t ? nt.filter(function(e) {
                    return e.scenarios.some(function(e) {
                        return !!gi(e, t);
                    });
                }).map(function(e) {
                    return {
                        id: e.id,
                        name: Ai(e, "name"),
                        years: Ai(e, "years")
                    };
                }) : [];
            }, window.focusHistoryWar = function(e) {
                for (var t = null, n = 0; n < nt.length; n++) if (nt[n].id === e) {
                    t = nt[n];
                    break;
                }
                return !!t && (Fe = "wars", qe = t.id, Oe = t.scenarios[0].id, Di(), wi(), !0);
            };
            var Ua = document.getElementById("histPlayBtn");
            Ua && Ua.addEventListener("click", function() {
                Wa();
            }), window.stopHistPlay = Ha, window.startHistPlay = ja, window.toggleHistPlay = Wa, 
            window.histSyncPlayBtn = function() {
                var e = document.getElementById("histPlayBtn");
                e && e.setAttribute("aria-pressed", je ? "true" : "false");
            };
            var $a = null;
            function Ka(keepHistory) {
                var wasHist = "history" === Ke || (window.historyIsActive && window.historyIsActive());
                $a = {
                    colorMode: ae,
                    currentReligionFilter: ie,
                    initialSection: Ke || "geo",
                    initialHistoryActive: wasHist,
                    initialHistoryTab: Fe || "eras",
                    initialEraId: He || null,
                    initialEraPhase: (typeof historyEraPhase !== "undefined" ? historyEraPhase : 0),
                    initialWarId: qe || null,
                    initialWarPhase: (typeof historyWarPhase !== "undefined" ? historyWarPhase : 0),
                    initialReligionsYear: (typeof religionsYear !== "undefined" ? religionsYear : null)
                }, !keepHistory && window.historyIsActive && window.historyIsActive() && va(!0), Object.keys(Li).forEach(function(e) {
                    $a[e] = Li[e].getFlag();
                }), Object.keys(Li).forEach(function(e) {
                    Li[e].getFlag() && Si(e);
                }), "all" !== ie && (ie = "all", m(h, '.religion-btn[data-religion="all"]')), "normal" !== ae && Vr("normal");
            }
            function Ga() {
                if ($a) {
                    var e = $a;
                    $a = null;
                    if (e.initialSection === "history" || e.initialHistoryActive) {
                        window.applySection && window.applySection("history", !1, !0);
                        if (e.initialHistoryTab && window.selectHistoryTab) {
                            window.selectHistoryTab(e.initialHistoryTab);
                        }
                        if (e.initialHistoryTab === "eras" && e.initialEraId && window.drawEraScene) {
                            He = e.initialEraId;
                            historyEraPhase = e.initialEraPhase || 0;
                            window.drawEraScene(!0);
                        } else if (e.initialHistoryTab === "wars" && e.initialWarId && window.drawHistoryScenario) {
                            qe = e.initialWarId;
                            historyWarPhase = e.initialWarPhase || 0;
                            window.drawHistoryScenario(!0);
                        } else if (e.initialHistoryTab === "faiths" && typeof drawReligionsScene === "function") {
                            if (e.initialReligionsYear != null) religionsYear = e.initialReligionsYear;
                            drawReligionsScene(!0);
                        }
                    } else {
                        window.applySection && window.applySection("geo", !1, !0);
                    }
                    Object.keys(Li).forEach(function(t) {
                        e[t] && !Li[t].getFlag() && Si(t);
                    }), "all" !== e.currentReligionFilter && (ie = e.currentReligionFilter, m(h, '.religion-btn[data-religion="' + e.currentReligionFilter + '"]')), 
                    e.colorMode !== ae && Vr(e.colorMode);
                }
            }
            function Ya() {
                Ka(), Te = !0, C && (C.disabled = !0, C.classList.add("quiz-disabled")), i = 0, 
                a = 0, r = [], At = Date.now(), 0 !== (t = ai()).length ? (document.body.classList.add("quiz-active"), 
                Q.classList.add("quiz-active"), _t.style.display = "none", kn.style.display = "none", 
                jt.style.display = "", Qa(), Rt.checked ? (s = 60 * (parseInt(Dt.value) || 5), bn.style.display = "", 
                Xa(), o = setInterval(function() {
                    s--, Xa(), s <= 0 && tr("timeUp");
                }, 1e3)) : bn.style.display = "none", p = function(e) {
                    Te && (st || e.target.closest(".quiz-overlay, .quiz-hud-prompt-banner, .quiz-hud-meta-row, .quiz-feedback") || (e.preventDefault(), 
                    e.stopPropagation(), function(e) {
                        var n = ki(), o = e.clientX - n.left, s = e.clientY - n.top, c = li.invert([ o, s ]), d = ao().invert(c);
                        if (!d || isNaN(d[0]) || isNaN(d[1])) return;
                        var u = t[i], p = function(e, t, n, i) {
                            var a = Zn.find(function(t) {
                                return t.id === e.layerId;
                            });
                            if (!a) return !1;
                            var r = e.item;
                            if ("polygon" === a.checkType) return function(e, t, n) {
                                if ("desertsForests" === t && e.coords) {
                                    var i = e.coords;
                                    if (i.length >= 3) {
                                        var a = {
                                            type: "Polygon",
                                            coordinates: [ i.concat([ i[0] ]) ]
                                        };
                                        try {
                                            if (d3.geoContains(a, n)) return !0;
                                        } catch (e) {}
                                    }
                                }
                                if ("countries" === t) try {
                                    if (d3.geoContains(e, n)) return !0;
                                } catch (e) {}
                                return !1;
                            }(r, e.layerId, t);
                            if ("bloc" === a.checkType) return function(e, t) {
                                for (var n = 0; n < fn.length; n++) {
                                    var i = fn[n], a = i.properties?.name || "";
                                    if (e.members.some(function(e) {
                                        return Pi(e) === Pi(a);
                                    })) try {
                                        if (d3.geoContains(i, t)) return !0;
                                    } catch (e) {}
                                }
                                return !1;
                            }(r, t);
                            if ("line" === a.checkType) return function(e, t, n, i) {
                                var a = e.coords;
                                if (!a || a.length < 2) return !1;
                                for (var r = ao(), o = Math.max(.4, li.k), s = li.x, l = li.y, c = 1 / 0, d = 0; d < a.length - 1; d++) {
                                    var u = r(a[d]), p = r(a[d + 1]);
                                    if (u && p && !isNaN(u[0]) && !isNaN(p[0])) {
                                        var m = u[0] * o + s, f = u[1] * o + l, h = p[0] * o + s - m, y = p[1] * o + l - f, g = h * h + y * y, v = 0 === g ? 0 : Math.max(0, Math.min(1, ((n - m) * h + (i - f) * y) / g)), b = m + v * h, w = f + v * y, E = Math.sqrt(Math.pow(n - b, 2) + Math.pow(i - w, 2));
                                        E < c && (c = E);
                                    }
                                }
                                return c < 20;
                            }(r, 0, n, i);
                            return function(e, t, n, i) {
                                var a = ei(e, t);
                                if (!a || a.length < 2) return !1;
                                var r = ao()(a);
                                if (!r || isNaN(r[0])) return !1;
                                var o = Math.max(.4, li.k), s = li.x, l = li.y, c = r[0] * o + s, d = r[1] * o + l, u = Math.sqrt(Math.pow(n - c, 2) + Math.pow(i - d, 2));
                                return u < 32;
                            }(r, e.layerId, n, i);
                        }(u, d, o, s), m = (performance.now() - l) / 1e3;
                        r.push({
                            questionId: i,
                            layerType: u.layerId,
                            studentAnswer: {
                                x: d[0],
                                y: d[1]
                            },
                            correct: p,
                            timeTakenSeconds: Math.round(10 * m) / 10
                        }), p ? (a++, Za(!0, u)) : Za(!1, u);
                    }(e)));
                }, Q.addEventListener("click", p, !0), l = performance.now()) : Va();
            }
            function Va() {
                Te = !1, hr(), C && (C.disabled = !1, C.classList.remove("quiz-disabled")), f && (f.disabled = !1, 
                f.classList.remove("quiz-disabled"), f.title = zi("quizMode")), document.body.classList.remove("quiz-active"), 
                Q.classList.remove("quiz-active"), _t.style.display = "none", jt.style.display = "none", 
                kn.style.display = "none", En.style.display = "none", Ja(), Ga(), p && (Q.removeEventListener("click", p, !0), 
                p = null), clearTimeout(d), clearTimeout(u);
            }
            function Qa() {
                var e = t[i];
                if (Wt.textContent = zi("quizQuestionOf", {
                    current: i + 1,
                    total: t.length
                }), hn.textContent = zi("quizFind") + ": " + e.name, gn.textContent = zi("quizScore") + ": " + a, 
                In.value = "", Be) {
                    var n = so(e);
                    n && lo(n);
                }
            }
            function Xa() {
                var e = Math.floor(s / 60), t = s % 60;
                bn.textContent = zi("quizTimeRemaining") + ": " + e + ":" + (t < 10 ? "0" : "") + t;
            }
            function Ja() {
                o && (clearInterval(o), o = null);
            }
            function Za(e, n) {
                clearTimeout(d), clearTimeout(u), En.style.display = "", En.className = "quiz-feedback " + (e ? "correct" : "incorrect"), 
                En.textContent = e ? zi("quizCorrect") : zi("quizIncorrect") + " " + zi("quizTheAnswerWas") + " " + n.name, 
                u = setTimeout(function() {
                    En.style.display = "none", ++i >= t.length ? tr("completed") : (l = performance.now(), 
                    Qa());
                }, e ? 1500 : 2500);
            }
            function er() {
                if (Te) {
                    var e = In.value.trim();
                    if (e) {
                        var n = t[i], a = (performance.now() - l) / 1e3;
                        r.push({
                            questionId: i,
                            layerType: n.layerId,
                            studentAnswer: e,
                            correct: null,
                            status: "pending",
                            promptText: zi("quizFind") + ": " + n.name,
                            timeTakenSeconds: Math.round(10 * a) / 10
                        }), In.value = "", clearTimeout(d), clearTimeout(u), En.style.display = "", En.className = "quiz-feedback pending", 
                        En.textContent = zi("quizAnswerSubmittedPending"), u = setTimeout(function() {
                            En.style.display = "none", ++i >= t.length ? tr("completed") : (l = performance.now(), 
                            Qa());
                        }, 1200);
                    }
                }
            }
            function tr(e) {
                var t = r.filter(function(e) {
                    return "pending" === e.status;
                });
                t.length > 0 ? qr(t, function() {
                    ye.style.display = "none", nr(e);
                }) : nr(e);
            }
            function nr(e) {
                if (Ja(), Te = !1, C && (C.disabled = !1, C.classList.remove("quiz-disabled")), 
                f && (f.disabled = !1, f.classList.remove("quiz-disabled"), f.title = zi("quizMode")), 
                clearTimeout(d), clearTimeout(u), p && (Q.removeEventListener("click", p, !0), p = null), 
                "endedEarly" === e) for (var n = i; n < t.length; n++) r.push({
                    questionId: n,
                    layerType: t[n].layerId,
                    studentAnswer: null,
                    correct: null,
                    status: "skipped"
                });
                var a = r.filter(function(e) {
                    return "skipped" !== e.status;
                }), o = r.filter(function(e) {
                    return !0 === e.correct;
                });
                r.filter(function(e) {
                    return "skipped" === e.status;
                });
                document.body.classList.remove("quiz-active"), Q.classList.remove("quiz-active"), 
                jt.style.display = "none", En.style.display = "none", kn.style.display = "";
                var s = document.getElementById("quizEndTitle");
                s.textContent = zi("endedEarly" === e ? "quizEndedEarly" : "timeUp" === e ? "quizTimeUp" : "quizComplete"), 
                xn.textContent = zi("quizFinalScore") + ": " + o.length + "/" + a.length + " " + zi("quizAnswered"), 
                Cn.innerHTML = "";
                var l = r.filter(function(e) {
                    return !1 === e.correct;
                });
                l.length > 0 ? (document.getElementById("quizMissedLabel").textContent = zi("quizMissedQuestions"), 
                l.forEach(function(e) {
                    var n = t[e.questionId], i = zi(Zn.find(function(e) {
                        return e.id === n.layerId;
                    }).labelKey), a = document.createElement("div");
                    a.className = "quiz-missed-item", a.innerHTML = "<div>" + jo(n.name) + '</div><div class="quiz-missed-layer">' + jo(i) + "</div>", 
                    Cn.appendChild(a);
                })) : document.getElementById("quizMissedLabel").textContent = "";
                var c = At ? Math.round((Date.now() - At) / 1e3) : null;
                Do(r, o.length, a.length, c);
            }
            function ir(e) {
                try {
                    localStorage.setItem("lepidosCustomQuestions", JSON.stringify(e));
                } catch (e) {}
            }
            function ar() {
                try {
                    var e = localStorage.getItem("lepidosCustomQuestions");
                    return e ? JSON.parse(e) : [];
                } catch (e) {
                    return [];
                }
            }
            function rr() {
                _t.style.display = "none", y.style.display = "none", b.style.display = "none", O.style.display = "none", 
                M.style.display = "none", ye.style.display = "none", kn.style.display = "none", 
                jt.style.display = "none", En.style.display = "none";
            }
            function or() {
                C && (C.disabled = !1, C.classList.remove("quiz-disabled")), f && (f.disabled = !1, 
                f.classList.remove("quiz-disabled"), f.title = zi("quizMode")), rr(), kr(), function() {
                    Te = !1, hr(), C && (C.disabled = !1, C.classList.remove("quiz-disabled"));
                    f && (f.disabled = !1, f.classList.remove("quiz-disabled"), f.title = zi("quizMode"));
                    ct && (Q.removeEventListener("click", ct, !0), ct = null);
                    Br(), clearTimeout(pt), clearTimeout(mt), jt.style.display = "none", En.style.display = "none", 
                    kn.style.display = "none", Ga(), document.body.classList.remove("quiz-active"), 
                    Q.classList.remove("quiz-active");
                }(), document.body.classList.remove("quiz-active"), Q.classList.remove("quiz-active");
            }
            function sr(e) {
                document.getElementById("quizCustomSetupTitle").textContent = zi("quizCustomSetup"), 
                document.getElementById("quizTimeLabel2").textContent = zi("quizTimeLimit"), document.getElementById("quizNoLimitText2").textContent = zi("quizNoLimit"), 
                document.getElementById("quizSetLimitText2").textContent = zi("quizSetLimitText"), 
                document.getElementById("quizMinutesText2").textContent = zi("quizMinutes"), document.getElementById("quizSelectedLabel").textContent = zi("quizSelectedQuestions"), 
                document.getElementById("quizCustomSelectedEmpty").textContent = zi("quizClickToAdd"), 
                document.getElementById("quizLibraryTitle").textContent = zi("quizLibrary"), document.getElementById("quizSessionNewLabel").textContent = zi("quizSessionNewLabel"), 
                document.getElementById("quizSessionNewEmpty").textContent = zi("quizSessionNewEmpty"), 
                x.textContent = zi("quizStartCustomQuiz");
                var assignBtn = document.getElementById("quizCustomAssignBtn");
                if (assignBtn) assignBtn.textContent = zi("quizAssignToStudents");
                L.placeholder = zi("quizSearchQuestions"), 
                B.textContent = zi("quizClearAll"), L.value = "", Le = ar(), e && (Se = [], Ie = []), 
                lr(), pr(), dr(), ur();
                var csni = document.getElementById("quizCustomStudentNameInput");
                if (csni) csni.placeholder = zi("quizStudentNamePlaceholder");
                var csci = document.getElementById("quizCustomSessionCodeInput");
                if (csci) csci.placeholder = zi("quizSessionCodePlaceholder");
                var t = document.getElementById("quizCustomCreateSessionBtn");
                if (t) {
                    t.textContent = zi("quizCreateSession"), t.style.display = "";
                    var csc = document.getElementById("quizCustomSessionCreated");
                    if (csc) csc.style.display = "none";
                    if (It && csci && csni) { csci.value = It; csni.value = zt || ""; }
                }
            }
            function lr() {
                if (E.innerHTML = "", 0 === Le.length) return k.style.display = "", void (B.style.display = "none");
                k.style.display = "none", B.style.display = "", Le.forEach(function(e, t) {
                    if (-1 === Ie.indexOf(e.id)) {
                        var n = document.createElement("div");
                        n.className = "quiz-custom-item", n.dataset.idx = t;
                        var i = document.createElement("span");
                        if (i.className = "quiz-custom-item-check", -1 !== Se.indexOf(t)) {
                            n.classList.add("quiz-custom-item-selected");
                            var a = document.createElement("span");
                            a.className = "quiz-custom-item-check-mark", a.textContent = "✓", i.appendChild(a);
                        }
                        var r = document.createElement("span");
                        r.className = "quiz-custom-item-text", r.textContent = e.promptText || "Q" + (t + 1);
                        if (e.isHistorical && e.historyContextLabel) {
                            var hb = document.createElement("span");
                            hb.className = "quiz-custom-item-hist-badge";
                            hb.style.cssText = "display:inline-flex;align-items:center;gap:3px;font-size:0.75rem;padding:2px 6px;margin-inline-start:6px;background:rgba(217,119,6,0.15);color:#d97706;border:1px solid rgba(217,119,6,0.3);border-radius:4px;vertical-align:middle;font-weight:normal;";
                            hb.textContent = "🏛️ " + e.historyContextLabel;
                            r.appendChild(hb);
                        }
                        var delBtn = document.createElement("span");
                        delBtn.className = "quiz-custom-item-delete", delBtn.textContent = "×", delBtn.addEventListener("click", function(e) {
                            e.preventDefault(), e.stopPropagation(), Le.splice(t, 1), ir(Le), Se = Se.filter(function(e) {
                                return e !== t;
                            }).map(function(e) {
                                return e > t ? e - 1 : e;
                            }), lr(), dr();
                        }), n.addEventListener("click", function(e) {
                            e.target === delBtn || e.target.closest(".quiz-custom-item-delete") || cr(t);
                        }), n.appendChild(i), n.appendChild(r), n.appendChild(delBtn), E.appendChild(n);
                    }
                }), ur();
            }
            function cr(e) {
                var t = Se.indexOf(e);
                -1 === t ? Se.push(e) : Se.splice(t, 1), lr(), dr(), ur();
            }
            function dr() {
                var e = document.getElementById("quizCustomSelectedList"), t = document.getElementById("quizCustomSelectedEmpty");
                e.innerHTML = "", 0 !== Se.length ? (t.style.display = "none", Se.forEach(function(t) {
                    var n = Le[t];
                    if (n) {
                        var i = document.createElement("span");
                        i.className = "quiz-selected-tag";
                        var a = document.createElement("span");
                        a.className = "quiz-selected-tag-text", a.textContent = n.promptText || "Q" + (t + 1);
                        var r = document.createElement("span");
                        r.className = "quiz-selected-tag-remove", r.textContent = "×", r.addEventListener("click", function(e) {
                            e.stopPropagation(), cr(t);
                        }), i.appendChild(a), i.appendChild(r), e.appendChild(i);
                    }
                })) : t.style.display = "";
            }
            function ur() {
                var hasQ = !(0 === Se.length && 0 === Ie.length);
                x.disabled = !hasQ;
                var assignBtn = document.getElementById("quizCustomAssignBtn");
                if (assignBtn) assignBtn.disabled = !hasQ;
            }
            function pr() {
                var e = document.getElementById("quizSessionNewList"), t = document.getElementById("quizSessionNewEmpty");
                e && t && (e.innerHTML = "", 0 !== Ie.length ? (t.style.display = "none", Ie.forEach(function(t) {
                    var n = Le.findIndex(function(e) {
                        return e.id === t;
                    });
                    if (-1 !== n) {
                        var i = Le[n], a = document.createElement("div");
                        a.className = "quiz-session-new-item";
                        var r = document.createElement("span");
                        r.className = "quiz-session-new-item-text", r.textContent = i.promptText || "Q" + (n + 1);
                        if (i.isHistorical && i.historyContextLabel) {
                            var hb2 = document.createElement("span");
                            hb2.className = "quiz-custom-item-hist-badge";
                            hb2.style.cssText = "display:inline-flex;align-items:center;gap:3px;font-size:0.75rem;padding:2px 6px;margin-inline-start:6px;background:rgba(217,119,6,0.15);color:#d97706;border:1px solid rgba(217,119,6,0.3);border-radius:4px;vertical-align:middle;font-weight:normal;";
                            hb2.textContent = "🏛️ " + i.historyContextLabel;
                            r.appendChild(hb2);
                        }
                        var o = document.createElement("span");
                        o.className = "quiz-session-new-item-remove", o.textContent = "×", o.addEventListener("click", function(e) {
                            e.stopPropagation(), Le.splice(n, 1), ir(Le), Ie = Ie.filter(function(e) {
                                return e !== t;
                            }), lr(), pr(), dr(), ur();
                        }), a.appendChild(r), a.appendChild(o), e.appendChild(a);
                    }
                })) : t.style.display = "");
            }
            function mr() {
                ri.selectAll("*").remove();
            }
            function fr(e, t) {
                var n = ao()(e);
                if (n && !isNaN(n[0])) if ("point" === t) ri.append("circle").attr("cx", n[0]).attr("cy", n[1]).attr("r", 8).attr("fill", "var(--brand-accent)").attr("stroke", "#fff").attr("stroke-width", 2).attr("vector-effect", "non-scaling-stroke"); else if ("line-start" === t) ri.append("circle").attr("class", "authoring-line-start").attr("cx", n[0]).attr("cy", n[1]).attr("r", 6).attr("fill", "var(--brand-accent)").attr("stroke", "#fff").attr("stroke-width", 2).attr("vector-effect", "non-scaling-stroke"); else if ("line-end" === t) {
                    ri.append("circle").attr("cx", n[0]).attr("cy", n[1]).attr("r", 6).attr("fill", "var(--brand-accent)").attr("stroke", "#fff").attr("stroke-width", 2).attr("vector-effect", "non-scaling-stroke");
                    var i = ao()(yt[0]);
                    ri.append("line").attr("x1", i[0]).attr("y1", i[1]).attr("x2", n[0]).attr("y2", n[1]).attr("stroke", "var(--brand-accent)").attr("stroke-width", 3).attr("vector-effect", "non-scaling-stroke");
                }
            }
            function hr() {
                oi.selectAll("*").remove();
            }
            function yr(e, t) {
                var n = ao(), i = n(e);
                if (i && !isNaN(i[0])) if ("point" === t) oi.append("circle").attr("cx", i[0]).attr("cy", i[1]).attr("r", 8).attr("fill", "var(--brand-accent)").attr("stroke", "#fff").attr("stroke-width", 2).attr("vector-effect", "non-scaling-stroke"); else if ("line-start" === t) oi.append("circle").attr("cx", i[0]).attr("cy", i[1]).attr("r", 6).attr("fill", "var(--brand-accent)").attr("stroke", "#fff").attr("stroke-width", 2).attr("vector-effect", "non-scaling-stroke"); else if ("line-end" === t) {
                    oi.append("circle").attr("cx", i[0]).attr("cy", i[1]).attr("r", 6).attr("fill", "var(--brand-accent)").attr("stroke", "#fff").attr("stroke-width", 2).attr("vector-effect", "non-scaling-stroke");
                    var a = n(e._startCoords);
                    a && !isNaN(a[0]) && oi.append("line").attr("x1", a[0]).attr("y1", a[1]).attr("x2", i[0]).attr("y2", i[1]).attr("stroke", "var(--brand-accent)").attr("stroke-width", 3).attr("vector-effect", "non-scaling-stroke");
                }
            }
            function gr(e) {
                if (e && !(e.length < 2)) for (var t = ao(), n = 0; n < e.length; n++) {
                    var i = 0 === n ? "line-start" : "line-end";
                    if (n === e.length - 1 && n > 0) {
                        i = "line-end";
                        e[0];
                        var a = t(e[n]);
                        if (!a || isNaN(a[0])) continue;
                        oi.append("circle").attr("cx", a[0]).attr("cy", a[1]).attr("r", 6).attr("fill", "var(--brand-accent)").attr("stroke", "#fff").attr("stroke-width", 2).attr("vector-effect", "non-scaling-stroke");
                        var r = t(e[0]);
                        oi.append("line").attr("x1", r[0]).attr("y1", r[1]).attr("x2", a[0]).attr("y2", a[1]).attr("stroke", "var(--brand-accent)").attr("stroke-width", 3).attr("vector-effect", "non-scaling-stroke");
                    } else yr(e[n], i);
                }
            }
            function vr() {
                "line" === ht && yt.length > 0 ? P.textContent = zi("quizClickMapLineInstruction") + " (" + yt.length + ")" : P.textContent = zi("line" === ht ? "quizClickMapLineInstruction" : "quizClickMapInstruction");
            }
            function getHistoricalContextSummary() {
                var hTab = Fe || "eras";
                if ("eras" === hTab) {
                    var era = (typeof Sa === "function" ? Sa() : null) || (Ne && Ne.find(function(e) { return e.id === He; }));
                    if (era) {
                        var eraTitle = (typeof Ai === "function" ? Ai(era, "title") : null) || era[Ht] || era.label || era.title || era.year || era.id;
                        var phaseSuffix = (typeof historyEraPhase !== "undefined" && historyEraPhase) ? (" (" + (zi("histPhase" + historyEraPhase.charAt(0).toUpperCase() + historyEraPhase.slice(1)) || historyEraPhase) + ")") : "";
                        return eraTitle + phaseSuffix;
                    }
                } else if ("wars" === hTab) {
                    var war = (typeof mi === "function" ? mi() : null) || (typeof nt !== "undefined" && nt && nt.find(function(w) { return w.id === qe; }));
                    if (war) {
                        var warTitle = (typeof Ai === "function" ? Ai(war, "title") : null) || war[Ht] || war.title || war.name || war.id;
                        var warPhaseSuffix = (typeof historyWarPhase !== "undefined" && historyWarPhase) ? (" (" + (zi("histPhase" + historyWarPhase.charAt(0).toUpperCase() + historyWarPhase.slice(1)) || historyWarPhase) + ")") : "";
                        return warTitle + warPhaseSuffix;
                    }
                } else if ("faiths" === hTab) {
                    var ry = (typeof religionsYear !== "undefined") ? religionsYear : 2000;
                    return (typeof formatHistTerrainYear === "function") ? formatHistTerrainYear(ry) : (ry + " CE");
                } else if ("travelers" === hTab) {
                    return zi("historyTabTravelers") || "Travelers";
                } else if ("terrain" === hTab) {
                    return zi("histTerrainTitle") || "Terrain";
                }
                return zi("sectionHistory") || "History";
            }
            function br() {
                wr(), "line" === ht ? (vt = function(e) {
                    if (ft && !e.target.closest(".quiz-overlay, .quiz-authoring-banner, .quiz-feedback")) {
                        e.preventDefault(), e.stopPropagation();
                        var t = ki(), n = e.clientX - t.left, i = e.clientY - t.top, a = li.invert([ n, i ]), r = ao().invert(a);
                        !r || isNaN(r[0]) || isNaN(r[1]) || (yt.push(r), fr(r, 1 === yt.length ? "line-start" : "line-end"), 
                        yt.length >= 2 ? Er() : vr());
                    }
                }, Q.addEventListener("click", vt, !0)) : (gt = function(e) {
                    if (ft && !e.target.closest(".quiz-overlay, .quiz-authoring-banner, .quiz-feedback")) {
                        e.preventDefault(), e.stopPropagation();
                        var t = ki(), n = e.clientX - t.left, i = e.clientY - t.top, a = li.invert([ n, i ]), r = ao().invert(a);
                        !r || isNaN(r[0]) || isNaN(r[1]) || (fr(r, "point"), Er(r));
                    }
                }, Q.addEventListener("click", gt, !0));
            }
            function wr() {
                gt && (Q.removeEventListener("click", gt, !0), gt = null), vt && (Q.removeEventListener("click", vt, !0), 
                vt = null), bt && (Q.removeEventListener("dblclick", bt, !0), bt = null);
            }
            function Er(e) {
                e && (yt = [ e ]), wr(), ft = !1, M.style.display = "none", R.style.display = "", 
                N.textContent = zi("quizMarkerPlaced");
                var isHist = ("history" === Ke || (window.historyIsActive && window.historyIsActive()));
                var histBadge = document.getElementById("quizAuthoringHistoryBadge");
                if (!histBadge && R) {
                    histBadge = document.createElement("div");
                    histBadge.id = "quizAuthoringHistoryBadge";
                    histBadge.className = "quiz-authoring-hist-badge";
                    histBadge.style.cssText = "display:inline-flex;align-items:center;gap:6px;padding:4px 10px;background:rgba(217,119,6,0.15);border:1px solid rgba(217,119,6,0.4);border-radius:6px;color:#f59e0b;font-size:0.82rem;font-weight:600;margin-top:6px;";
                    R.appendChild(histBadge);
                }
                if (histBadge) {
                    if (isHist) {
                        var histLabel = getHistoricalContextSummary();
                        histBadge.innerHTML = '<i data-lucide="landmark" style="width:14px;height:14px;"></i> ' + (zi("quizHistoryContext") || "الحقبة التاريخية") + ": " + String(histLabel).replace(/[&<>"']/g, function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];});
                        histBadge.style.display = "inline-flex";
                        if (window.lucide && lucide.createIcons) lucide.createIcons();
                    } else {
                        histBadge.style.display = "none";
                    }
                }
                D.style.display = "", K.style.display = "", 
                G.checked = !1, Y.checked = !1, V.checked = !1, ue.style.display = "none", J.style.display = "none", 
                F.style.display = "";
            }
            function kr() {
                ft = !1, yt = [], wt = [ {
                    text: "",
                    correct: !1
                }, {
                    text: "",
                    correct: !1
                } ], wr(), mr(), M.style.display = "none", O.style.display = "none", K.style.display = "none", 
                J.style.display = "none", document.body.classList.remove("quiz-active"), Q.classList.remove("quiz-active");
            }
            function xr() {
                var e = G.checked ? "true_false" : Y.checked ? "written" : V.checked ? "mc" : null;
                ue.style.display = "true_false" === e ? "" : "none", J.style.display = "mc" === e ? "" : "none", 
                W.placeholder = zi("true_false" === e ? "quizTrueFalsePlaceholder" : "quizPromptPlaceholder");
            }
            function _r() {
                te.innerHTML = "", wt.forEach(function(e, t) {
                    var n = document.createElement("div");
                    n.className = "quiz-choice-row" + (e.correct ? " correct-selected" : "");
                    var i = document.createElement("input");
                    i.type = "radio", i.name = "quizChoiceCorrect", i.checked = e.correct, i.addEventListener("change", function() {
                        wt.forEach(function(e) {
                            e.correct = !1;
                        }), e.correct = !0, te.querySelectorAll(".quiz-choice-row").forEach(function(e) {
                            e.classList.remove("correct-selected");
                        }), n.classList.add("correct-selected");
                    });
                    var a = document.createElement("input");
                    if (a.type = "text", a.className = "quiz-input quiz-choice-input", a.value = e.text, 
                    a.placeholder = zi("quizChoicePlaceholder", {
                        n: t + 1
                    }), a.addEventListener("input", function() {
                        e.text = a.value;
                    }), n.appendChild(i), n.appendChild(a), wt.length > 2) {
                        var r = document.createElement("button");
                        r.type = "button", r.className = "btn quiz-choice-remove", r.textContent = "✕", 
                        r.addEventListener("click", function() {
                            wt.splice(t, 1), wt.some(function(e) {
                                return e.correct;
                            }) || (wt[0].correct = !0), _r();
                        }), n.appendChild(r);
                    }
                    te.appendChild(n);
                }), ne.style.display = wt.length >= 4 ? "none" : "", document.getElementById("quizChoicesInstruction").textContent = zi("quizSelectCorrectInstruction");
            }
            function Cr(e) {
                ce.innerHTML = "", ce.style.display = "";
                var t = e.choices.slice();
                e.correctChoiceText;
                (function(e) {
                    for (var t = e.length - 1; t > 0; t--) {
                        var n = Math.floor(Math.random() * (t + 1)), i = e[t];
                        e[t] = e[n], e[n] = i;
                    }
                    return e;
                })(t).forEach(function(t) {
                    var n = document.createElement("button");
                    n.className = "btn quiz-mc-btn", n.textContent = t, n.addEventListener("click", function(n) {
                        n.stopPropagation(), function(e, t) {
                            var n = ze[Me], i = e === t.correctChoiceText;
                            Ae.push({
                                questionIndex: Me,
                                libraryIdx: n.libraryIdx,
                                clickCoords: null,
                                studentAnswer: e,
                                correct: i,
                                status: "graded",
                                promptText: t.promptText
                            }), i && lt++;
                            Ar(i, t), ce.style.display = "none";
                        }(t, e);
                    }), ce.appendChild(n);
                });
            }
            function Lr() {
                var e = oe.value.trim();
                if (e) {
                    var t = ze[Me];
                    Ae.push({
                        questionIndex: Me,
                        libraryIdx: t.libraryIdx,
                        clickCoords: null,
                        studentAnswer: e,
                        correct: null,
                        status: "pending",
                        promptText: t.question.promptText
                    }), oe.value = "", clearTimeout(pt), clearTimeout(mt), En.style.display = "", En.className = "quiz-feedback correct", 
                    En.textContent = zi("quizRecordedPending"), mt = setTimeout(function() {
                        En.style.display = "none", ++Me >= ze.length ? Pr("completed") : Sr();
                    }, 1800);
                }
            }
            function Br() {
                dt && (clearInterval(dt), dt = null);
            }
            function Sr() {
                var e = ze[Me], t = e.question;
                function n() {
                    if (t.type === "line" && t.coords && t.coords.length >= 2) {
                        gr(t.coords);
                    } else if (t.coords && t.coords.length >= 2) {
                        yr(t.coords, "point");
                    }
                }
                var qTitle = zi("quizQuestionOf", {
                    current: Me + 1,
                    total: ze.length
                });
                if (t.isHistorical && t.historyContextLabel) {
                    qTitle += " • 🏛️ " + t.historyContextLabel;
                }
                if (Wt.textContent = qTitle, hn.textContent = t.promptText, gn.textContent = zi("quizScore") + ": " + lt, 
                hr(), me.style.display = "none", re.style.display = "none", ce.style.display = "none", 
                se.textContent = zi("quizSubmitAnswer"), oe.placeholder = zi("quizWrittenAnswerPlaceholder"), 
                "true_false" === t.answerFormat ? me.style.display = "" : "written" === t.answerFormat ? (re.style.display = "", 
                oe.value = "", oe.focus()) : "mc" === t.answerFormat && Cr(t),
                t.isHistorical ? (
                    ("history" !== Ke || !Pe) && window.applySection && window.applySection("history", !1, !0),
                    (function() {
                        var targetTab = t.historyTab || "eras";
                        if (Fe !== targetTab && window.selectHistoryTab) {
                            window.selectHistoryTab(targetTab);
                        }
                        if ("eras" === targetTab) {
                            if (t.eraId) {
                                He = t.eraId;
                                historyEraPhase = t.eraPhase || 0;
                            }
                            window.drawEraScene && window.drawEraScene(!0);
                        } else if ("wars" === targetTab) {
                            if (t.warId) {
                                qe = t.warId;
                                historyWarPhase = t.warPhase || 0;
                            }
                            window.drawHistoryScenario && window.drawHistoryScenario(!0);
                        } else if ("faiths" === targetTab) {
                            if (t.religionsYear != null) religionsYear = t.religionsYear;
                            if (typeof drawReligionsScene === "function") drawReligionsScene(!0);
                        }
                    })()
                ) : (
                    ("history" === Ke || Pe) && window.applySection && window.applySection("geo", !1, !0)
                ),
                Be) {
                    var i = function(e) {
                        var t = e.question;
                        if (!t.coords) return null;
                        if ("line" === t.type && Array.isArray(t.coords[0])) {
                            var n = Math.floor(t.coords.length / 2);
                            return t.coords[n];
                        }
                        return Array.isArray(t.coords) && t.coords.length >= 2 && !Array.isArray(t.coords[0]) ? t.coords : null;
                    }(e);
                    i ? lo(i, void 0, n) : n();
                } else {
                    var targetPt = null;
                    if (t.type === "line" && t.coords && t.coords.length >= 2) {
                        targetPt = [(t.coords[0][0] + t.coords[1][0]) / 2, (t.coords[0][1] + t.coords[1][1]) / 2];
                    } else if (t.coords && t.coords.length >= 2) {
                        targetPt = t.coords;
                    }
                    if (targetPt && window.centerMapOnCoords) {
                        window.centerMapOnCoords(targetPt);
                    }
                    n();
                }
            }
            function Ir() {
                var e = Math.floor(ut / 60), t = ut % 60;
                bn.textContent = zi("quizTimeRemaining") + ": " + e + ":" + (t < 10 ? "0" : "") + t;
            }
            function zr(e) {
                if (Te && 0 !== ze.length) {
                    var t = ze[Me], n = t.question, i = e === n.correctAnswer;
                    Ae.push({
                        questionIndex: Me,
                        libraryIdx: t.libraryIdx,
                        clickCoords: null,
                        studentAnswer: e,
                        correct: i,
                        status: "graded",
                        promptText: n.promptText
                    }), i && lt++, Ar(i, n);
                }
            }
            function Ar(e, t) {
                clearTimeout(pt), clearTimeout(mt), hr(), En.style.display = "", En.className = "quiz-feedback " + (e ? "correct" : "incorrect"), 
                En.textContent = zi(e ? "quizCorrect" : "quizIncorrect"), mt = setTimeout(function() {
                    En.style.display = "none", ++Me >= ze.length ? Pr("completed") : Sr();
                }, e ? 1500 : 2500);
            }
            function Pr(e) {
                if (Br(), Te = !1, C && (C.disabled = !1, C.classList.remove("quiz-disabled")), 
                f && (f.disabled = !1, f.classList.remove("quiz-disabled"), f.title = zi("quizMode")), 
                clearTimeout(pt), clearTimeout(mt), hr(), me.style.display = "none", re.style.display = "none", 
                ce.style.display = "none", ce.innerHTML = "", ct && (Q.removeEventListener("click", ct, !0), 
                ct = null), "endedEarly" === e) for (var t = Me; t < ze.length; t++) Ae.push({
                    questionIndex: t,
                    libraryIdx: ze[t].libraryIdx,
                    clickCoords: null,
                    correct: null,
                    status: "skipped",
                    promptText: ze[t].question.promptText
                });
                document.body.classList.remove("quiz-active"), Q.classList.remove("quiz-active"), 
                jt.style.display = "none", En.style.display = "none";
                var n = Ae.filter(function(e) {
                    return "graded" === e.status;
                }), i = Ae.filter(function(e) {
                    return !0 === e.correct;
                }), a = Ae.filter(function(e) {
                    return "pending" === e.status;
                });
                Ae.filter(function(e) {
                    return "skipped" === e.status;
                });
                kn.style.display = "";
                var r = document.getElementById("quizEndTitle");
                r.textContent = zi("endedEarly" === e ? "quizEndedEarly" : "timeUp" === e ? "quizTimeUp" : "quizComplete");
                var o = zi("quizFinalScore") + ": " + i.length + "/" + n.length + " " + zi("quizGradedQuestions");
                a.length > 0 && (o += " | " + a.length + " " + zi("quizPendingReview")), xn.textContent = o, 
                Cn.innerHTML = "";
                var s = Ae.filter(function(e) {
                    return !1 === e.correct;
                });
                if (s.length > 0 ? (document.getElementById("quizMissedLabel").textContent = zi("quizMissedQuestions"), 
                s.forEach(function(e) {
                    var t = document.createElement("div");
                    t.className = "quiz-missed-item", t.innerHTML = "<div>" + jo(e.promptText || "Q") + "</div>", 
                    Cn.appendChild(t);
                })) : document.getElementById("quizMissedLabel").textContent = "", a.length > 0) {
                    var l = document.getElementById("quizDynamicReviewBtn");
                    l && l.remove();
                    var c = document.createElement("button");
                    c.id = "quizDynamicReviewBtn", c.className = "btn quiz-start-btn", c.style.marginTop = "10px", 
                    c.textContent = zi("quizReviewPendingAnswers"), c.addEventListener("click", function() {
                        kn.style.display = "none", qr(a);
                    }), kn.querySelector(".quiz-form-actions").appendChild(c);
                } else {
                    var d = document.getElementById("quizDynamicReviewBtn");
                    d && d.remove();
                }
                var u = At ? Math.round((Date.now() - At) / 1e3) : null;
                Do(Ae, i.length, n.length, u);
            }
            function qr(e, t) {
                Et = e.slice(), kt = 0, xt = t || function() {
                    ye.style.display = "none", sr(!1), b.style.display = "";
                }, ye.style.display = "", document.getElementById("quizReviewTitle").textContent = zi("quizReviewPendingAnswers"), 
                document.getElementById("quizReviewDisclaimer").textContent = zi("quizReviewDisclaimer"), 
                _e.style.display = "none", ve.style.display = "", Ee.parentElement.style.display = "", 
                Or();
            }
            function Or() {
                if (kt >= Et.length) return ve.style.display = "none", Ee.parentElement.style.display = "none", 
                _e.style.display = "", document.getElementById("quizReviewCompleteMsg").textContent = zi("quizReviewComplete"), 
                void (Ce.textContent = zi("quizBackToSetupBtn"));
                var e = Et[kt];
                ge.textContent = zi("quizReviewOf", {
                    current: kt + 1,
                    total: Et.length
                }), be.textContent = e.promptText || "Q", e.clickCoords ? we.textContent = "Click: " + e.clickCoords[0].toFixed(2) + ", " + e.clickCoords[1].toFixed(2) : e.studentAnswer ? we.textContent = zi("quizAnswered") + ": " + e.studentAnswer : we.textContent = zi("quizAnswered") + ": —", 
                Ee.textContent = zi("quizMarkCorrect"), xe.textContent = zi("quizMarkIncorrect");
            }
            Le = ar(), f.addEventListener("click", function() {
                Te || (C && (C.disabled = !0, C.classList.add("quiz-disabled")), rr(), hn.textContent = "", 
                Wt.textContent = "", gn.textContent = "", bn.textContent = "", 
                ("history" === Ke || (window.historyIsActive && window.historyIsActive())) ? (sr(!0), b.style.display = "") : (
                    document.getElementById("quizModeChoiceTitle").textContent = zi("quizModeChoiceTitle"), 
                    document.getElementById("quizSelectiveQuestionsLabel").textContent = zi("quizSelectiveQuestions"), 
                    document.getElementById("quizSelectiveDescLabel").textContent = zi("quizSelectiveDesc"), 
                    document.getElementById("quizSetQuestionsLabel").textContent = zi("quizSetQuestions"), 
                    document.getElementById("quizSetDescLabel").textContent = zi("quizSetDesc"), 
                    y.style.display = ""
                ));
            }), y.addEventListener("click", function(e) {
                e.target === y && or();
            }), g.addEventListener("click", function() {
                y.style.display = "none", ti(), _t.style.display = "";
            }), v.addEventListener("click", function() {
                y.style.display = "none", sr(!0), b.style.display = "";
            }), w.addEventListener("click", function() {
                or();
            }), _.addEventListener("click", function() {
                b.style.display = "none", ft = !0, mr(), ht = "point", yt = [], wt = [ {
                    text: "",
                    correct: !1
                }, {
                    text: "",
                    correct: !1
                } ], H.checked = !0, G.checked = !1, Y.checked = !1, V.checked = !1, W.value = "", 
                R.style.display = "none", D.style.display = "none", ue.style.display = "none", J.style.display = "none", 
                F.style.display = "none", document.getElementById("quizAuthoringTitle").textContent = zi("quizCreateTitle"), 
                document.getElementById("quizMarkerTypeLabel").textContent = zi("quizMarkerType"), 
                document.getElementById("quizPointMarkerLabel").textContent = zi("quizPointMarker"), 
                document.getElementById("quizLineMarkerLabel").textContent = zi("quizLineMarker"), 
                document.getElementById("quizPromptLabel").textContent = zi("quizPromptLabel"), 
                W.placeholder = zi("quizPromptPlaceholder"), document.getElementById("quizAnswerFormatLabel").textContent = zi("quizAnswerFormat"), 
                document.getElementById("quizTrueFalseStatementLabel").textContent = zi("quizTrueFalseStatement"), 
                document.getElementById("quizWrittenAnswerLabel").textContent = zi("quizWrittenAnswerLabel"), 
                document.getElementById("quizMultipleChoiceLabel").textContent = zi("quizMultipleChoiceLabel"), 
                document.getElementById("quizChoicesLabel").textContent = zi("quizChoicesLabel"), 
                document.getElementById("quizCorrectAnswerLabel").textContent = zi("quizCorrectAnswer"), 
                document.getElementById("quizTrueLabel").textContent = zi("quizTrue"), document.getElementById("quizFalseLabel").textContent = zi("quizFalse"), 
                pe.checked = !0, _r(), U.textContent = zi("quizSaveQuestion"), $.textContent = zi("quizCancel"), 
                ne.textContent = "+ " + zi("quizAddChoiceLabel"), M.style.display = "", vr(), O.style.display = "", 
                document.body.classList.add("quiz-active"), Q.classList.add("quiz-active"), br();
            }), I.addEventListener("change", function() {
                z.style.display = I.checked ? "" : "none";
            }), S.addEventListener("change", function() {
                z.style.display = "none";
            }), x.addEventListener("click", function() {
                Ro(document.getElementById("quizCustomStudentNameInput"), document.getElementById("quizCustomSessionCodeInput")), 
                function() {
                    if (Ka(!0), ze = [], Ae = [], Me = 0, lt = 0, At = Date.now(), Se.forEach(function(e) {
                        Le[e] && ze.push({
                            libraryIdx: e,
                            question: Le[e]
                        });
                    }), Ie.forEach(function(e) {
                        var t = Le.findIndex(function(t) {
                            return t.id === e;
                        });
                        -1 !== t && -1 === Se.indexOf(t) && ze.push({
                            libraryIdx: t,
                            question: Le[t]
                        });
                    }), 0 === ze.length) return;
                    Te = !0, C && (C.disabled = !0, C.classList.add("quiz-disabled"));
                    b.style.display = "none", document.body.classList.add("quiz-active"), Q.classList.add("quiz-active"), 
                    jt.style.display = "", fe.textContent = zi("quizTrue"), he.textContent = zi("quizFalse"), 
                    me.style.display = "none", Sr(), I.checked ? (ut = 60 * (parseInt(A.value) || 5), 
                    bn.style.display = "", Ir(), dt = setInterval(function() {
                        ut--, Ir(), ut <= 0 && Pr("timeUp");
                    }, 1e3)) : bn.style.display = "none";
                }();
            }), L.addEventListener("input", function(e) {
                var t = e.target.value.trim();
                E.querySelectorAll(".quiz-custom-item").forEach(function(e) {
                    var n = e.querySelector(".quiz-custom-item-text").textContent;
                    e.style.display = "" === t || Ui(n, t) ? "" : "none";
                });
            }), B.addEventListener("click", function() {
                0 !== Le.length && (confirm(zi("quizClearAllConfirm", {
                    count: Le.length
                })) && (Se = [], ir(Le = []), lr(), dr(), ur()));
            }), H.addEventListener("change", function() {
                H.checked && (ht = "point", yt = [], vr(), wr(), br());
            }), j.addEventListener("change", function() {
                j.checked && (ht = "line", yt = [], vr(), wr(), br());
            }), G.addEventListener("change", xr), Y.addEventListener("change", xr), V.addEventListener("change", xr), 
            ne.addEventListener("click", function() {
                wt.length >= 4 || (wt.push({
                    text: "",
                    correct: !1
                }), _r());
            }), se.addEventListener("click", function(e) {
                e.stopPropagation(), Lr();
            }), oe.addEventListener("keydown", function(e) {
                "Enter" === e.key && (e.stopPropagation(), Lr());
            }), q.addEventListener("click", function() {
                kr(), sr(!1), b.style.display = "";
            }), $.addEventListener("click", function() {
                kr(), sr(!1), b.style.display = "";
            }), U.addEventListener("click", function() {
                var e = W.value.trim();
                if (e) {
                    var t = G.checked ? "true_false" : Y.checked ? "written" : V.checked ? "mc" : null;
                    if (t) {
                        if ("mc" === t) {
                            var n = wt.filter(function(e) {
                                return e.text.trim().length > 0;
                            });
                            if (n.length < 2 || n.length > 4) return void alert(zi("quizChoicesRequired"));
                            if (!wt.find(function(e) {
                                return e.correct && e.text.trim().length > 0;
                            })) return void alert(zi("quizMustMarkCorrect"));
                        }
                        var isHist = ("history" === Ke || (window.historyIsActive && window.historyIsActive()));
                        var i = {
                            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                            type: ht,
                            coords: "line" === ht ? yt.slice() : yt.length > 0 ? yt[0] : [],
                            answerFormat: t,
                            promptText: e,
                            createdAt: Date.now(),
                            isHistorical: !!isHist
                        };
                        if (isHist) {
                            i.historyTab = Fe || "eras";
                            i.eraId = He || null;
                            i.eraPhase = (typeof historyEraPhase !== "undefined") ? historyEraPhase : 0;
                            i.warId = qe || null;
                            i.warPhase = (typeof historyWarPhase !== "undefined") ? historyWarPhase : 0;
                            i.religionsYear = (typeof religionsYear !== "undefined") ? religionsYear : null;
                            i.historyContextLabel = (typeof getHistoricalContextSummary === "function") ? getHistoricalContextSummary() : "";
                        }
                        if ("true_false" === t && (i.correctAnswer = pe.checked), "mc" === t) {
                            var a = wt.filter(function(e) {
                                return e.text.trim().length > 0;
                            }), r = wt.find(function(e) {
                                return e.correct && e.text.trim().length > 0;
                            });
                            i.choices = a.map(function(e) {
                                return e.text.trim();
                            }), i.correctChoiceText = r.text.trim();
                        }
                        Le.push(i), Ie.push(i.id), ir(Le), kr(), sr(!1), b.style.display = "";
                    } else alert(zi("quizAnswerFormatRequired"));
                } else alert(zi("quizPromptRequired"));
            }), Ce.addEventListener("click", function() {
                ye.style.display = "none", "function" == typeof xt && xt();
            }), fe.addEventListener("click", function(e) {
                e.stopPropagation(), zr(!0);
            }), he.addEventListener("click", function(e) {
                e.stopPropagation(), zr(!1);
            }), Ee.addEventListener("click", function() {
                kt >= Et.length || (Et[kt].correct = !0, Et[kt].status = "graded", kt++, Or());
            }), xe.addEventListener("click", function() {
                kt >= Et.length || (Et[kt].correct = !1, Et[kt].status = "graded", kt++, Or());
            }), ye.addEventListener("click", function(e) {
                e.target === ye && (ye.style.display = "none");
            }), Sn.addEventListener("click", function() {
                Te && confirm(zi("quizEndEarlyConfirm")) && (ze.length > 0 ? Pr("endedEarly") : tr("endedEarly"));
            }), zn.addEventListener("click", function(e) {
                e.stopPropagation(), er();
            }), In.addEventListener("keydown", function(e) {
                "Enter" === e.key && (e.preventDefault(), er());
            }), Ft.addEventListener("click", function() {
                var sni = document.getElementById("quizStudentNameInput"), sci = document.getElementById("quizSessionCodeInput");
                if (sni && sci) Ro(sni, sci);
                _t.style.display = "none", Ya();
            });
            var csBtn = document.getElementById("quizCreateSessionBtn");
            if (csBtn) csBtn.addEventListener("click", function() {
                Oo(document.getElementById("quizStudentNameInput"), document.getElementById("quizSessionCodeInput"), document.getElementById("quizSessionCreated"), this);
            });
            var ccsBtn = document.getElementById("quizCustomCreateSessionBtn");
            if (ccsBtn) ccsBtn.addEventListener("click", function() {
                Oo(document.getElementById("quizCustomStudentNameInput"), document.getElementById("quizCustomSessionCodeInput"), document.getElementById("quizCustomSessionCreated"), this);
            });
            var vrBtn = document.getElementById("quizViewResultsBtn");
            if (vrBtn) vrBtn.addEventListener("click", function() {
                It && Fo(It);
            });
            var resClose = document.getElementById("quizResultsCloseBtn");
            if (resClose) resClose.addEventListener("click", function() {
                document.getElementById("quizResultsOverlay").style.display = "none";
            });
            var resOverlay = document.getElementById("quizResultsOverlay");
            if (resOverlay) resOverlay.addEventListener("click", function(e) {
                e.target === this && (this.style.display = "none");
            });
            var choiceCloseBtn = document.getElementById("quizModeChoiceCloseBtn");
            if (choiceCloseBtn) choiceCloseBtn.addEventListener("click", function() {
                or();
            });
            var setupCloseBtn = document.getElementById("quizSetupCloseBtn");
            if (setupCloseBtn) setupCloseBtn.addEventListener("click", function() {
                _t.style.display = "none", or();
            });
            var thShortcutBtn = document.getElementById("quizOpenTeacherHubBtn");
            if (thShortcutBtn) thShortcutBtn.addEventListener("click", function() {
                or();
                var e = document.getElementById("teacherHubBtn");
                if (e) e.click();
            });
            var customAssignBtn = document.getElementById("quizCustomAssignBtn");
            if (customAssignBtn) customAssignBtn.addEventListener("click", async function() {
                var qList = [];
                Se.forEach(function(e) { if (Le[e]) qList.push(Le[e]); });
                Ie.forEach(function(e) {
                    var t = Le.findIndex(function(t) { return t.id === e; });
                    if (-1 !== t && -1 === Se.indexOf(t)) qList.push(Le[t]);
                });
                if (0 === qList.length) return;
                or();
                var e = document.getElementById("teacherHubBtn");
                if (e) e.click();
                var titleInp = document.getElementById("teacherAssignmentTitleInput");
                if (titleInp) titleInp.value = "واجب: أسئلة الخريطة المخصصة (" + qList.length + " أسئلة)";
                var genBtn = document.getElementById("teacherGenerateSessionBtn");
                if (genBtn) genBtn.click();
            });
            Rt.addEventListener("change", function() {
                Nt.style.display = Rt.checked ? "" : "none";
            }), document.getElementById("quizTimeModeNone").addEventListener("change", function() {
                Nt.style.display = "none";
            }), Ln.addEventListener("click", function() {
                Va();
            }), _t.addEventListener("click", function(e) {
                e.target === _t && Va();
            }), kn.addEventListener("click", function(e) {
                e.target === kn && Va();
            });
        }(), function() {
            var e = document.getElementById("projectionCompareOverlay"), t = document.getElementById("projectionCompareSvg"), n = document.getElementById("projTabMercator"), i = document.getElementById("projTabRobinson"), a = document.getElementById("compareProjectionsBtn");
            function r() {
                if (hi) {
                    var e = t.getBoundingClientRect(), n = e.width || 800, i = e.height || 500;
                    t.setAttribute("viewBox", "0 0 " + n + " " + i), t.setAttribute("width", n), t.setAttribute("height", i);
                    var a = function(e, t, n) {
                        var i = "robinson" === e ? d3.geoRobinson() : d3.geoMercator();
                        return i.fitSize([ t, n ], {
                            type: "FeatureCollection",
                            features: fn
                        }), i;
                    }(di, n, i), r = d3.geoPath(a);
                    pi.select(".compare-graticule").attr("d", r), mi.selectAll("path").data(fn).join("path").attr("d", r).attr("fill", function(e) {
                        return ma(e);
                    }).attr("stroke", function(e) {
                        return fa(e);
                    }).attr("stroke-width", function(e) {
                        return .8;
                    }).attr("opacity", function(e) {
                        return ya(e);
                    }), pi.attr("transform", null), fi && ui.call(fi.transform, d3.zoomIdentity);
                }
            }
            a && a.addEventListener("click", function() {
                e.style.display = "flex", di = "mercator", n.classList.add("active"), i.classList.remove("active"), 
                function() {
                    if (!hi) {
                        var e = t.getBoundingClientRect(), n = e.width || 800, i = e.height || 500;
                        ui = d3.select(t).attr("viewBox", "0 0 " + n + " " + i).attr("width", n).attr("height", i), 
                        pi = ui.append("g"), mi = pi.append("g"), pi.append("path").datum(d3.geoGraticule10()).attr("class", "compare-graticule").attr("fill", "none").attr("stroke", "rgba(255,255,255,0.08)").attr("stroke-width", .5), 
                        fi = d3.zoom().scaleExtent([ 1, 12 ]).on("zoom", function(e) {
                            pi.attr("transform", e.transform);
                        }), ui.call(fi), hi = !0;
                    }
                }(), r();
            });
            var o = document.getElementById("projectionCompareCloseBtn");
            o && o.addEventListener("click", function() {
                e.style.display = "none";
            });
            var s = document.getElementById("projectionCompareRefreshBtn");
            s && s.addEventListener("click", function() {
                r();
            }), n.addEventListener("click", function() {
                di = "mercator", n.classList.add("active"), i.classList.remove("active"), r();
            }), i.addEventListener("click", function() {
                di = "robinson", i.classList.add("active"), n.classList.remove("active"), r();
            }), window.addEventListener("resize", function() {
                "flex" === e.style.display && hi && r();
            });
        }();
        let _ = 0;
        T.addEventListener("touchstart", function(e) {
            _ = e.touches[0].clientY;
        }, {
            passive: !0
        }), T.addEventListener("touchend", function(e) {
            e.changedTouches[0].clientY - _ > 60 && Eo();
        }, {
            passive: !0
        });
        let L = window.innerWidth, S = null;
        new ResizeObserver(function(e) {
            var t = window.innerWidth;
            Math.abs(t - L) > 5 || !xi ? (L = t, clearTimeout(S), S = setTimeout(function() {
                xi = window.innerWidth < 768;
                var e = La(), t = e.width, n = e.height;
                a.setAttribute("viewBox", "0 0 " + t + " " + n), a.setAttribute("width", t), a.setAttribute("height", n), 
                Kn = Ba(t, n), mr = !0, Be ? (co(), Kn = Se, ro()) : (Gn = d3.geoPath(Kn), Gn.pointRadius(xi ? 1.5 : 3)), 
                Be ? po() : (ti.select("rect").attr("width", t + 1e3).attr("height", n + 1e3), Sa(), 
                Ia(), fn.length && (Qn.selectAll("path").attr("d", Gn), Jn && Jn.selectAll("path").attr("d", Gn), 
                bi && (bi.remove(), bi = null), Or(fn)), Fa(), Ta(), Tr(), Oa(), Na(), Ra(), Yn.call(si.transform, li));
            }, 80)) : Io(li);
        }).observe(Q);
        var I = document.getElementById("toolsRowStart"), z = document.querySelector(".header"), P = document.querySelector(".header-right-group"), q = document.getElementById("controlsBar");
        function O() {
            I && z && P && q && (window.innerWidth >= 1024 ? I.parentElement !== P && P.appendChild(I) : window.innerWidth <= 768 ? I.parentElement !== q && q.insertBefore(I, q.firstChild) : I.parentElement !== P && P.appendChild(I));
        }
        function R() {
            var e = document.querySelector(".header");
            e && document.documentElement.style.setProperty("--header-height", e.offsetHeight + "px");
        }
        (O(), window.addEventListener("resize", O), "undefined" != typeof ResizeObserver) && ((z = document.querySelector(".header")) && new ResizeObserver(function() {
            R();
        }).observe(z));
        if (window.addEventListener("load", R), R(), "serviceWorker" in navigator) try {
            const e = window.location.pathname.replace(/\/[^\/]*$/, "/");
            navigator.serviceWorker.register(e + "sw.js", {
                scope: e
            }).then(e => console.log("✅ Service Worker:", e)).catch(() => {});
        } catch (e) {}
        Gr();
    }
    qs && qs.addEventListener("click", function() {
        "function" == typeof window.startOnboarding && window.startOnboarding();
    });
    var Ns = !1;
    function Ds(e) {
        return new Promise(function(t, n) {
            var i = document.createElement("script"), a = window.location.pathname.replace(/\/[^\/]*$/, "/");
            i.src = a + "vendor/" + e, i.onload = function() {
                t();
            }, i.onerror = function() {
                n(new Error("Failed to load " + e));
            }, document.head.appendChild(i);
        });
    }
    function Fs() {
        var e = [];
        return "function" != typeof html2canvas && e.push(Ds("html2canvas.min.js")), window.jspdf || e.push(Ds("jspdf.umd.min.js")), 
        Promise.all(e);
    }
    function Hs(e, t, n) {
        var i = document.createElement("div");
        return i.style.cssText = "position:fixed;left:-9999px;top:0;width:" + t + "px;height:" + n + "px;background:#f0f0f0;display:flex;flex-direction:column;justify-content:center;padding:0 12px;font-family:Inter,Arial,sans-serif;box-sizing:border-box;direction:" + ("ar" === Ht ? "rtl" : "ltr") + ";", 
        e.forEach(function(e, t) {
            var n = document.createElement("div");
            n.style.cssText = 0 === t ? "font-size:20px;font-weight:700;color:#282828;" : "font-size:13px;color:#505050;margin-top:2px;", 
            n.textContent = e, i.appendChild(n);
        }), document.body.appendChild(i), html2canvas(i, {
            scale: 3,
            backgroundColor: "#f0f0f0",
            logging: !1
        }).then(function(e) {
            return document.body.removeChild(i), e.toDataURL("image/png");
        });
    }
    function js() {
        if (St) return;
        if ("function" != typeof html2canvas || !window.jspdf) return void (Ns || (Ns = !0, 
        Fs().then(function() {
            js();
        }).catch(function(e) {
            Ns = !1, console.error("PDF libraries failed to load:", e);
        })));
        St = !0;
        const e = document.getElementById("exportBlockingOverlay");
        e && (e.style.display = "flex");
        var t = document.getElementById("legend"), n = [], i = [];
        if (t) {
            t.querySelectorAll(".legend-item").forEach(function(e) {
                var t = e.querySelector(".legend-color"), i = e.textContent.trim();
                t && i && n.push({
                    color: t.style.background || t.style.backgroundColor,
                    label: i
                });
            });
            var a = t.querySelector(".legend-gradient-bar");
            if (a) {
                var o = a.style.background, s = o && o.match(/linear-gradient\(to right,\s*(.+)\)/);
                s && (i = s[1].split(",").map(function(e) {
                    return e.trim();
                }));
            }
        }
        const c = [ r, t, T, l ], d = [ document.querySelector(".zoom-controls"), document.getElementById("copyNotification"), document.querySelector(".menu-toggle"), document.getElementById("onboardingHint"), document.getElementById("shortcutsOverlay"), N, document.querySelector(".mobile-topbar"), document.querySelector(".mobile-bottom-nav"), document.querySelector(".mobile-mode-sheet") ], u = [];
        [ ...c, ...d ].forEach(function(e) {
            e && (u.push({
                el: e,
                display: e.style.display
            }), e.style.display = "none");
        });
        var p = li;
        Be || (Vn.attr("transform", null), li = d3.zoomIdentity, si && Yn.call(si.transform, d3.zoomIdentity));
        var m = (new Date).toLocaleDateString(), f = Be ? "globeProjectionType" : "headerProjectionType", h = Hs([ zi("appName"), zi(f) + " — " + m ], 800, 80), y = Hs([ zi("pdfCitationLabel").replace("{date}", m) ], 800, 36);
        Promise.all([ h, y ]).then(function(t) {
            var a = t[0], r = t[1];
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    html2canvas(document.getElementById("mapContainer"), {
                        scale: 3,
                        backgroundColor: MAP_COLORS.ui.pdfBg,
                        useCORS: !0,
                        logging: !1,
                        ignoreElements: function(e) {
                            return "exportBlockingOverlay" === e.id;
                        }
                    }).then(function(e) {
                        var t = e.toDataURL("image/png"), {jsPDF: o} = window.jspdf, s = new o("l", "mm", "a4"), l = s.internal.pageSize.getWidth(), c = s.internal.pageSize.getHeight(), d = e.width / e.height, u = c - 32, p = u * d;
                        p > l && (u = (p = l) / d), s.setFillColor(240, 240, 240), s.rect(0, 0, l, 18, "F");
                        var m = 120, h = m / 10;
                        h > 14 && (m = 10 * (h = 14)), s.addImage(a, "PNG", 8, 9 - h / 2, m, h), s.addImage(t, "PNG", (l - p) / 2, 18, p, u), 
                        s.setFillColor(240, 240, 240), s.rect(0, c - 14, l, 14, "F");
                        var y = 8, g = [];
                        return n.forEach(function(e) {
                            var t = e.color.replace(/rgb\(|rgba\(|\)/g, "").split(",").map(function(e) {
                                return parseInt(e.trim());
                            });
                            t.length >= 3 && (s.setFillColor(t[0], t[1], t[2]), s.rect(y, c - 11, 3, 3, "F"));
                            var n = y;
                            g.push(Hs([ e.label ], 200, 24).then(function(t) {
                                return {
                                    labelImg: t,
                                    labelW: Math.min(1.8 * s.getTextWidth(e.label), 40),
                                    x: n
                                };
                            })), y += 36;
                        }), Promise.all(g).then(function(e) {
                            if (e.forEach(function(e) {
                                s.addImage(e.labelImg, "PNG", e.x + 4, c - 12, e.labelW, 5);
                            }), i.length >= 2) {
                                var t = l - y - 8;
                                t > 20 && i.forEach(function(e, n) {
                                    var a = e.replace(/rgb\(|rgba\(|\)/g, "").split(",").map(function(e) {
                                        return parseInt(e.trim());
                                    });
                                    if (a.length >= 3) {
                                        s.setFillColor(a[0], a[1], a[2]);
                                        var r = t / i.length;
                                        s.rect(y + n * r, c - 11, r + .5, 3, "F");
                                    }
                                });
                            }
                            var n = 800 / 36, a = 140, o = a / n;
                            o > 8 && (a = (o = 8) * n), s.addImage(r, "PNG", (l - a) / 2, c - 7 - o / 2, a, o), 
                            s.setProperties({
                                title: zi("appName"),
                                author: "Lepidos Atlas",
                                subject: zi(f),
                                keywords: "waterman, butterfly, map, atlas, lepidos"
                            }), s.save("Waterman_Map_Export.pdf");
                        }).catch(function(e) {
                            console.error("PDF legend label error:", e), s.save("Waterman_Map_Export.pdf");
                        });
                    }).catch(function(e) {
                        console.error("PDF export error:", e);
                    }).finally(function() {
                        u.forEach(function(e) {
                            e.el.style.display = e.display;
                        }), Be || (Vn.attr("transform", p), li = p, si && p && Yn.call(si.transform, p)), 
                        St = !1, e && (e.style.display = "none");
                    });
                });
            });
        }).catch(function(t) {
            console.error("PDF text render error:", t), u.forEach(function(e) {
                e.el.style.display = e.display;
            }), Be || (Vn.attr("transform", p), li = p, si && p && Yn.call(si.transform, p)), 
            St = !1, e && (e.style.display = "none");
        });
    }
    f.forEach(e => e.addEventListener("click", () => Vr(e.dataset.mode))), y.addEventListener("click", Rr), 
    g.addEventListener("click", Qr), v.addEventListener("click", Jr);
    const Ws = document.getElementById("riversGlaciersToggle");
    Ws && Ws.addEventListener("click", Ir);
    const Us = document.getElementById("colorblindToggle");
    Us && Us.addEventListener("click", ka);
    try {
        "1" !== localStorage.getItem("cbPatterns") || de || ka();
    } catch (Yd) {}
    b.addEventListener("click", Zr), w.addEventListener("click", eo), E.addEventListener("click", to), 
    k.addEventListener("click", no), x.addEventListener("click", io), document.getElementById("naturalResourcesToggle").addEventListener("click", Er), 
    document.getElementById("ethnicGroupsToggle").addEventListener("click", kr), document.getElementById("oceanCurrentsToggle").addEventListener("click", xr), 
    document.getElementById("windsToggle").addEventListener("click", _r), document.getElementById("earthquakesToggle").addEventListener("click", Cr), 
    document.getElementById("volcanoesToggle").addEventListener("click", Lr), document.getElementById("geopoliticalBlocsToggle").addEventListener("click", zr), 
    document.getElementById("desertsForestsToggle").addEventListener("click", Br), document.getElementById("borderDisputesToggle").addEventListener("click", Sr);
    const $s = document.getElementById("historicalRoutesToggle");
    $s && $s.addEventListener("click", function() {
        Si("historicalRoutes");
    });
    const Ks = document.getElementById("histCapitalsToggle");
    Ks && Ks.addEventListener("click", function() {
        Si("histCapitals");
    });
    const Gs = document.getElementById("histBattlesToggle");
    Gs && Gs.addEventListener("click", function() {
        Si("histBattles");
    });
    const Ys = document.getElementById("histWondersToggle");
    Ys && Ys.addEventListener("click", function() {
        Si("histWonders");
    });
    const Vs = document.getElementById("histSacredSitesToggle");
    Vs && Vs.addEventListener("click", function() {
        Si("histSacredSites");
    });
    const Qs = document.getElementById("histModernBordersToggle");
    Qs && Qs.addEventListener("click", function() {
        Si("histModernBorders");
    });
    const Xs = document.getElementById("histModernLabelsToggle");
    Xs && Xs.addEventListener("click", function() {
        Si("histModernLabels");
    }), _ && _.addEventListener("click", function() {
        Ii("adminBoundaries");
    }), C && C.addEventListener("click", function() {
        Te || window.historyIsActive && window.historyIsActive() || mo();
    });
    const Js = document.getElementById("blocSelect");
    geopoliticalBlocsData.forEach(function(e) {
        var t = document.createElement("option");
        t.value = e.name_en, t.textContent = ("ar" === Ht ? e.name : "ru" === Ht ? e.name_ru || e.name_en : "uz" === Ht ? e.name_uz || e.name_en : "es" === Ht && e.name_es || e.name_en) + " (" + ("ar" === Ht ? e.members_ar : "ru" === Ht ? e.members_ru || e.members_en : "uz" === Ht ? e.members_uz || e.members_en : "es" === Ht && e.members_es || e.members_en) + ")", 
        Js.appendChild(t);
    }), Js.addEventListener("change", function() {
        if (re = this.value, xe) "all" !== re && Vr("normal"), Ja(); else {
            xe = !0;
            var e = document.getElementById("geopoliticalBlocsToggle");
            e && (e.classList.add("toggle-on"), e.setAttribute("aria-pressed", "true")), Ja(), 
            Vr("normal");
        }
        Yr(), Cs(), Gr();
    });
    var Zs = document.getElementById("sectionGeoBtn");
    Zs && Zs.addEventListener("click", function() {
        window.applySection && window.applySection("geo");
    });
    var el = document.getElementById("sectionHistoryBtn");
    el && el.addEventListener("click", function() {
        Te || window.applySection && window.applySection("history");
    });
    var tl = document.getElementById("histTerrainBtn");
    tl && tl.addEventListener("click", function() {
        Vc();
    });
    var nl = document.getElementById("histSourcesBtn");
    nl && nl.addEventListener("click", function(e) {
        e.stopPropagation();
        var t = document.getElementById("histSourcesPanel");
        if (t) {
            var n = "none" === t.style.display || !t.style.display, i = "function" == typeof getHistEra ? getHistEra() : window.getHistEra ? window.getHistEra() : He, a = "function" == typeof getHistWar ? getHistWar() : window.getHistWar ? window.getHistWar() : qe;
            !n || i || a || (t.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;"><h4>' + Ti(zi("histSourcesTitle")) + '</h4><button type="button" class="hist-drawer-close-btn" style="width:24px;height:24px;font-size:1rem;" onclick="document.getElementById(\'histSourcesPanel\').style.display=\'none\'">&times;</button></div><p class="hist-empty-cue" style="margin:8px 0;font-size:0.85rem;color:var(--text-muted);">' + Ti(zi("histSelectEraCue")) + "</p>"), 
            t.style.display = n ? "block" : "none";
        }
        var r = document.getElementById("toolsDropdownMenu");
        r && (r.classList.remove("visible"), r.setAttribute("hidden", ""));
        var o = document.getElementById("toolsBtn");
        o && o.setAttribute("aria-expanded", "false");
    });
    var il = document.getElementById("histOpacitySlider");
    if (il) {
        il.value = Qe;
        var al = document.getElementById("histOpacityVal");
        al && (al.textContent = Math.round(100 * Qe) + "%"), il.addEventListener("input", function() {
            Qe = parseFloat(this.value);
            var e = Math.round(100 * Qe) + "%";
            al && (al.textContent = e), rn && rn.selectAll("path").attr("fill-opacity", Qe).style("fill-opacity", Qe).attr("opacity", 1).style("opacity", 1);
        });
    }
    var rl = document.getElementById("histWarPhaseGroup");
    rl && rl.addEventListener("click", function(e) {
        var t = e.target.closest(".hist-phase-btn");
        if (t) {
            var n = t.getAttribute("data-phase"), i = "function" == typeof Ze ? Ze : "function" == typeof window.setHistWarPhase ? window.setHistWarPhase : null;
            n && i && i(n);
        }
    });
    var ol = document.getElementById("histEraPhaseGroup");
    ol && ol.addEventListener("click", function(e) {
        var t = e.target.closest(".hist-phase-btn");
        if (t) {
            var n = t.getAttribute("data-phase"), i = "function" == typeof et ? et : "function" == typeof window.setHistEraPhase ? window.setHistEraPhase : null;
            n && i && i(n);
        }
    });
    var sl = [ {
        btnId: "histWarsPopoverBtn",
        menuId: "histWarsPopoverMenu",
        tab: "wars"
    }, {
        btnId: "histErasPopoverBtn",
        menuId: "histErasPopoverMenu",
        tab: "eras"
    }, {
        btnId: "histFaithsPopoverBtn",
        menuId: "histFaithsPopoverMenu",
        tab: "faiths"
    }, {
        btnId: "histTravelersPopoverBtn",
        menuId: "histTravelersPopoverMenu",
        tab: "travelers"
    } ], ll = null;
    function cl(e) {
        var t = ll;
        sl.forEach(function(e) {
            var n = document.getElementById(e.btnId), i = document.getElementById(e.menuId);
            n && "true" === n.getAttribute("aria-expanded") && (t = n), n && n.setAttribute("aria-expanded", "false"), 
            i && (i.classList.remove("visible"), i.setAttribute("hidden", ""));
        }), e && t && "function" == typeof t.focus && t.focus(), ll = null, qe || He || window.religionsStillActive && window.religionsStillActive() || Mn && Mn.length || (Fe = null, 
        "function" == typeof updateHistSubmodeVis && updateHistSubmodeVis());
    }
    function dl() {
        Pe && (window.renderHistoryBar && window.renderHistoryBar(), "eras" === Fe ? window.drawEraScene && window.drawEraScene() : window.drawHistoryScenario && window.drawHistoryScenario());
    }
    window.closeAllHistPopovers = cl, sl.forEach(function(e) {
        var t = document.getElementById(e.btnId), n = document.getElementById(e.menuId);
        if (t && n && !t.dataset.menuBound) {
            t.dataset.menuBound = "1", t.addEventListener("click", function(i) {
                i.stopPropagation();
                var a = n.classList.contains("visible");
                cl(), a || (ll = t, Fe !== e.tab && window.selectHistoryTab && window.selectHistoryTab(e.tab), 
                n.classList.add("visible"), n.removeAttribute("hidden"), t.setAttribute("aria-expanded", "true"), 
                "wars" === e.tab ? window.renderHistoryBar && renderHistoryBar() : "eras" === e.tab ? window.renderEraTabContent && renderEraTabContent() : "faiths" === e.tab ? window.renderFaithsPopoverList && renderFaithsPopoverList() : "travelers" === e.tab && window.renderTravelersPopoverList && pc(), 
                Dd(n, t), setTimeout(function() {
                    var e = n.querySelectorAll('input:not([disabled]), select:not([disabled]), button:not([disabled]), [tabindex="0"]');
                    e.length && e[0].focus();
                }, 60));
            }), n.addEventListener("click", function(e) {
                e.stopPropagation();
            });
            var i = n.querySelector(".hist-drawer-close-btn");
            i && !i.dataset.bound && (i.dataset.bound = "1", i.addEventListener("click", function(e) {
                e.stopPropagation(), cl(!0);
            }));
        }
    }), document.addEventListener("click", function(e) {
        Date.now() - tt < 350 || e.target.closest("#historyBottomBar") || e.target.closest(".hist-popover-menu") || e.target.closest(".hist-popover-btn") || cl();
    }), window.addEventListener("resize", function() {
        sl.forEach(function(e) {
            var t = document.getElementById(e.menuId), n = document.getElementById(e.btnId);
            t && t.classList.contains("visible") && n && Dd(t, n);
        });
    }), document.addEventListener("keydown", function(e) {
        "Escape" === e.key && cl(!0);
    }), document.addEventListener("pointerdown", function(e) {
        e.target && e.target.closest && e.target.closest("#historyBottomBar") && (tt = Date.now());
    }, !0), document.querySelectorAll("#histWarEpochTabs .war-epoch-tab").forEach(function(e) {
        e.addEventListener("click", function() {
            document.querySelectorAll("#histWarEpochTabs .war-epoch-tab").forEach(function(e) {
                e.classList.remove("active");
            }), this.classList.add("active"), it = this.getAttribute("data-epoch") || "all", 
            dl();
        });
    }), document.querySelectorAll("#histEraEpochTabs .era-epoch-tab").forEach(function(e) {
        e.addEventListener("click", function() {
            document.querySelectorAll("#histEraEpochTabs .era-epoch-tab").forEach(function(e) {
                e.classList.remove("active");
            }), this.classList.add("active"), at = this.getAttribute("data-epoch") || "all", 
            dl();
        });
    });
    var ul = document.getElementById("histFilterRegion");
    ul && !ul.options.length && ([ {
        v: "all",
        k: "regionAll"
    }, {
        v: "me",
        k: "regionME"
    }, {
        v: "europe",
        k: "regionEU"
    }, {
        v: "asia",
        k: "regionAS"
    }, {
        v: "africa",
        k: "regionAF"
    }, {
        v: "americas",
        k: "regionAM"
    } ].forEach(function(e) {
        var t = document.createElement("option");
        t.value = e.v, t.textContent = zi(e.k), t.setAttribute("data-i18n", e.k), e.v === Ge && (t.selected = !0), 
        ul.appendChild(t);
    }), ul.addEventListener("change", function() {
        Ge = this.value;
        var e = document.getElementById("histErasFilterRegion");
        e && e.value !== this.value && (e.value = this.value), dl();
    }));
    var pl = document.getElementById("histFilterReligion");
    pl && !pl.options.length && ([ {
        v: "all",
        k: "histReligionAll"
    }, {
        v: "muslim",
        k: "religion_muslim"
    }, {
        v: "christian",
        k: "religion_christian"
    }, {
        v: "hindu",
        k: "religion_hindu"
    }, {
        v: "buddhist",
        k: "religion_buddhist"
    }, {
        v: "jewish",
        k: "religion_jewish"
    }, {
        v: "other",
        k: "religion_other"
    } ].forEach(function(e) {
        var t = document.createElement("option");
        t.value = e.v, t.textContent = zi(e.k), t.setAttribute("data-i18n", e.k), e.v === Ye && (t.selected = !0), 
        pl.appendChild(t);
    }), pl.addEventListener("change", function() {
        Ye = this.value, dl();
    }));
    var ml = document.getElementById("histSearchInput");
    if (ml) {
        var fl = null;
        ml.addEventListener("input", function() {
            var e = this.value;
            clearTimeout(fl), fl = setTimeout(function() {
                Ve = e.trim();
                var t = document.getElementById("histErasSearchInput");
                t && t.value !== e && (t.value = e), dl();
            }, 200);
        });
    }
    var hl = document.getElementById("histErasFilterRegion");
    hl && !hl.options.length && ([ {
        v: "all",
        k: "regionAll"
    }, {
        v: "me",
        k: "regionME"
    }, {
        v: "europe",
        k: "regionEU"
    }, {
        v: "asia",
        k: "regionAS"
    }, {
        v: "africa",
        k: "regionAF"
    }, {
        v: "americas",
        k: "regionAM"
    } ].forEach(function(e) {
        var t = document.createElement("option");
        t.value = e.v, t.textContent = zi(e.k), t.setAttribute("data-i18n", e.k), e.v === Ge && (t.selected = !0), 
        hl.appendChild(t);
    }), hl.addEventListener("change", function() {
        Ge = this.value;
        var e = document.getElementById("histFilterRegion");
        e && e.value !== this.value && (e.value = this.value), dl();
    }));
    var yl = document.getElementById("histErasSearchInput");
    if (yl) {
        var gl = null;
        yl.addEventListener("input", function() {
            var e = this.value;
            clearTimeout(gl), gl = setTimeout(function() {
                Ve = e.trim();
                var t = document.getElementById("histSearchInput");
                t && t.value !== e && (t.value = e), dl();
            }, 200);
        });
    }
    var vl = null, bl = null, wl = !1, El = 0, kl = [], xl = !1, _l = null, Cl = -2200, Ll = 2e3, Bl = null, Sl = document.getElementById("historyFaithsTimelineWrap"), Il = document.getElementById("religionsYearValue"), zl = document.getElementById("religionsTimeline"), Al = (document.getElementById("legend"), 
    document.getElementById("religionsCaption")), Ml = document.getElementById("religionsPlayBtn"), Tl = "";
    function Pl(e) {
        var t = kl.indexOf(e);
        -1 !== t ? kl.splice(t, 1) : kl.push(e);
    }
    function ql(e) {
        if (null == e) return "";
        var t = Math.abs(e), n = window.currentLang || ("undefined" != typeof currentLanguage ? currentLanguage : "ar");
        return "ar" === n ? e < 0 ? t + " ق.م" : 0 === e ? "1 ق.م" : e + " م" : "ru" === n ? e < 0 ? t + " до н.э." : 0 === e ? "1 до н.э." : e + " н.э." : "uz" === n ? e < 0 ? t + " m.a." : 0 === e ? "1 m.a." : e + " m." : "es" === n ? e < 0 ? t + " a.C." : 0 === e ? "1 a.C." : e + " d.C." : e < 0 ? t + " BCE" : 0 === e ? "1 BCE" : e + " CE";
    }
    function Ol(e, t) {
        return ql(e) + " — " + (null == t ? zi("faithsOngoing") || "الحاضر" : ql(t));
    }
    var Rl = function(e) {
        return ql(e);
    };
    function Nl() {
        return vl ? Promise.resolve(vl) : (bl || (bl = fetch(e + "religions-history-data.json").then(function(e) {
            if (!e.ok) throw new Error("HTTP " + e.status);
            return e.json();
        }).then(function(e) {
            return vl = e.religions || [];
        }).catch(function(e) {
            throw bl = null, e;
        })), bl);
    }
    function Dl() {
        if (Bl && Bl.node() && Bl.node().isConnected) return Bl;
        var e = document.getElementById("mapSvg");
        if (!e) return null;
        Bl && Bl.selectAll("*").remove();
        var t = Vn || d3.select(e);
        return Bl = t.append("g").attr("id", "religionsOverlayLayer").attr("class", "religions-overlay-layer");
    }
    function Fl() {
        Bl && Bl.selectAll("*").remove();
    }
    function Hl(e) {
        return vl ? vl.filter(function(t) {
            return e >= t.startYear && (null === t.endYear || void 0 === t.endYear || e <= t.endYear);
        }) : [];
    }
    function jl(e, t) {
        var i = Dl();
        if (i) {
            var a = document.getElementById("religionsYearValue");
            if (a && (a.textContent = Rl(e)), i.selectAll("*").interrupt(), t || !1 !== n() ? i.selectAll("*").remove() : i.selectAll("path,text,g").transition().duration(220).style("opacity", "0").on("end", function() {
                d3.select(this).remove();
            }), !wl || !kl || 0 === kl.length) return Fl(), Wl(e, []), void Ul(e, []);
            var r = Hl(e).filter(function(e) {
                return -1 !== kl.indexOf(e.id);
            }), o = Math.max(.4, li.k), s = Math.max(3, Math.min(12, (xi ? 7 : 10) / o)), l = n() ? 0 : 300, c = 1 === kl.length;
            r.forEach(function(n) {
                var a = function(e, t) {
                    if (!e.slices || !e.slices.length) return null;
                    var n = null;
                    return e.slices.forEach(function(e) {
                        e.year <= t && (!n || e.year > n.year) && (n = e);
                    }), n || e.slices[0];
                }(n, e);
                if (a && a.rings && a.rings.length) {
                    n.rings = n.rings || [];
                    var o = a.rings.map(function(e) {
                        return window.__normalizeEraRing(e);
                    }), s = c ? .55 : .4, d = c ? 2.6 : 1.8;
                    o.forEach(function(e) {
                        var a;
                        try {
                            a = window.__buildEraFeature({
                                rings: [ e ]
                            });
                        } catch (e) {
                            return;
                        }
                        var o = Gn(a);
                        if (o) {
                            var c = i.append("path").attr("d", o).attr("fill", n.color).attr("fill-opacity", s).attr("stroke", n.color).attr("stroke-width", d).attr("vector-effect", "non-scaling-stroke").style("cursor", "default").style("pointer-events", "none");
                            if (t ? c.attr("opacity", 1) : c.attr("opacity", 0).transition().duration(l).attr("opacity", 1), 
                            de) {
                                ga();
                                var u = r.indexOf(n), p = (u >= 0 ? u : 0) % 8;
                                i.append("path").attr("class", "hist-cbpat").attr("d", o).attr("fill", "url(#cbpat-" + p + ")").attr("stroke", "none").style("pointer-events", "none");
                            }
                        }
                    });
                }
            }), r.forEach(function(e) {
                var n = ao()(e.origin);
                if (n && !isNaN(n[0])) {
                    var a = c ? Math.max(5, 8 / o) : Math.max(4, 6.5 / o), r = i.append("g").attr("class", "rel-origin-pin").attr("data-faith-id", e.id).attr("role", "button").attr("tabindex", "0").attr("aria-label", Ai(e, "name") || e.id).style("cursor", "pointer").style("pointer-events", "all").on("click", function(t) {
                        t && t.stopPropagation && t.stopPropagation(), $l(e);
                    }).on("keydown", function(t) {
                        "Enter" !== t.key && " " !== t.key || (t.preventDefault && t.preventDefault(), $l(e));
                    });
                    c && r.append("circle").attr("cx", n[0]).attr("cy", n[1]).attr("r", a + 3.5 / o).attr("fill", "none").attr("stroke", e.color).attr("stroke-width", 2 / o).attr("opacity", .85), 
                    r.append("circle").attr("cx", n[0]).attr("cy", n[1]).attr("r", a).attr("fill", e.color).attr("stroke", "#ffffff").attr("stroke-width", (c ? 2.2 : 1.5) / o).attr("opacity", 1), 
                    r.append("text").attr("x", n[0]).attr("y", n[1] - (c ? 9 : 7) / o).text(Ai(e, "name")).attr("fill", "#ffffff").attr("font-size", c ? 1.15 * s : s).attr("font-weight", "bold").attr("text-anchor", "middle").attr("opacity", 1).attr("style", "text-shadow: 0 1px 3px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.85); pointer-events: none;"), 
                    t || r.attr("opacity", 0).transition().duration(l).attr("opacity", 1);
                }
            }), Wl(e, r), Ul(e, r);
        }
    }
    function Wl(e, t) {
        var n, i = document.getElementById("legend");
        i && ("faiths" === Fe && (kl && 0 !== kl.length ? (n = (t = t || Hl(e).filter(function(e) {
            return -1 !== kl.indexOf(e.id);
        })).length ? '<div class="legend-title">' + Ti(zi("religionsListBtn")) + '</div><div class="religions-legend">' + t.map(function(e, t) {
            var n = de ? '<svg width="16" height="12" style="display:inline-block;vertical-align:middle;border-radius:2px;margin-inline-end:6px;"><rect width="16" height="12" fill="' + e.color + '"/><rect width="16" height="12" fill="url(#cbpat-' + t % 8 + ')"/></svg>' : '<span class="religions-legend-swatch" style="background:' + e.color + '"></span>';
            return '<div class="religions-legend-item selected" data-faith-id="' + e.id + '" style="cursor:pointer; font-weight:bold; color:#14B8A6;" title="' + Ti(Ai(e, "name")) + '" role="button" tabindex="0">' + n + '<span class="religions-legend-name">' + Ti(Ai(e, "name")) + " ✓</span></div>";
        }).join("") + "</div>" : '<div class="legend-title">' + Ti(zi("religionsListBtn")) + '</div><div class="religions-legend-empty">' + Ti(zi("religionsInactiveAt")) + "</div>", 
        i.innerHTML = n, i.querySelectorAll(".religions-legend-item").forEach(function(e) {
            function t() {
                var t = e.getAttribute("data-faith-id");
                t && window.showReligionDetailById && window.showReligionDetailById(t);
            }
            e.addEventListener("click", t), e.addEventListener("keydown", function(e) {
                "Enter" !== e.key && " " !== e.key || (e.preventDefault && e.preventDefault(), t());
            });
        })) : i.innerHTML = '<div class="legend-title">' + Ti(zi("religionsListBtn")) + '</div><div class="religions-legend-empty" style="font-size:12px;opacity:0.75;padding:4px 0;">' + Ti(zi("faithsSelectPrompt")) + "</div>"));
    }
    function Ul(e, t) {
        if (Al) if (kl && 0 !== kl.length) {
            t = t || Hl(e).filter(function(e) {
                return -1 !== kl.indexOf(e.id);
            });
            var n = [];
            vl ? (vl.filter(function(e) {
                return -1 !== kl.indexOf(e.id);
            }).forEach(function(t) {
                e === t.startYear && n.push(Ti(Ai(t, "name")) + " " + Ti(zi("religionsEmerged"))), 
                null !== t.endYear && void 0 !== t.endYear && e === t.endYear && n.push(Ti(Ai(t, "name")) + " " + Ti(zi("religionsDisappeared")));
            }), Al.innerHTML = n.length ? n.join(" &nbsp;·&nbsp; ") : "") : Al.textContent = "";
        } else Al.textContent = zi("faithsSelectPrompt");
    }
    function $l(e) {
        if (e) {
            var n = document.getElementById("panelContent"), i = document.getElementById("countryPanel");
            if (n && i) {
                cl(), Mr(), vn = null, En = e, _n = "histReligion";
                var a = Ai(e, "name") || e.id, r = e.symbol || "🕊️", o = Ai(e, "founder") || "", s = Ai(e, "origin_era") || "", l = Ai(e, "origin_place") || "", c = s ? s + (l ? " — " + l : "") : l, d = Ai(e, "calendar") || "", u = Ai(e, "classification") || "", p = Ai(e, "sacred_texts") || "", m = Ai(e, "sacred_sites") || "", f = Ai(e, "adherents") || "", h = Ai(e, "modern_distribution") || "", y = Ai(e, "summary") || "", g = -1 !== kl.indexOf(e.id), v = Ol(e.startYear, e.endYear), b = '<div class="hist-profile-card"><div class="hist-profile-header" style="border-inline-start: 4px solid ' + e.color + '; padding-inline-start: 10px;"><h3 class="hist-profile-title"><span style="color:' + e.color + ';">' + Ti(r) + "</span> " + Ti(a) + '</h3><p class="hist-profile-subtitle"><strong>' + Ti(zi("religionsListBtn") || "أديان ومعتقدات") + "</strong> &nbsp;·&nbsp; " + Ti(v) + "</p></div>";
                y && (b += '<div class="hist-narrative-box origin-box" style="border-inline-start-color:' + e.color + "; background: " + e.color + "14; border-color: " + e.color + '33;"><div class="hist-narrative-title" style="color:' + e.color + ';">' + Ti(r) + " " + Ti(zi("histRelSummary") || "الجوهر والملخص") + '</div><p class="hist-narrative-text">' + Ti(y) + "</p></div>"), 
                b += '<div class="hist-profile-grid">', u && (b += '<div class="hist-profile-item full-width"><div class="hist-profile-item-label">🧭 ' + Ti(zi("histRelClassification")) + '</div><div class="hist-profile-item-val">' + Ti(u) + "</div></div>"), 
                o && (b += '<div class="hist-profile-item"><div class="hist-profile-item-label">👤 ' + Ti(zi("histRelFounder")) + '</div><div class="hist-profile-item-val">' + Ti(o) + "</div></div>"), 
                c && (b += '<div class="hist-profile-item"><div class="hist-profile-item-label">📍 ' + Ti(zi("histRelOriginPlace")) + '</div><div class="hist-profile-item-val">' + Ti(c) + "</div></div>"), 
                d && (b += '<div class="hist-profile-item"><div class="hist-profile-item-label">📅 ' + Ti(zi("histRelCalendar")) + '</div><div class="hist-profile-item-val">' + Ti(d) + "</div></div>"), 
                f && (b += '<div class="hist-profile-item"><div class="hist-profile-item-label">👥 ' + Ti(zi("histRelAdherents")) + '</div><div class="hist-profile-item-val">' + Ti(f) + "</div></div>"), 
                p && (b += '<div class="hist-profile-item full-width"><div class="hist-profile-item-label">📖 ' + Ti(zi("histRelTexts")) + '</div><div class="hist-profile-item-val">' + Ti(p) + "</div></div>"), 
                m && (b += '<div class="hist-profile-item full-width"><div class="hist-profile-item-label">🕌 ' + Ti(zi("histRelSites")) + '</div><div class="hist-profile-item-val">' + Ti(m) + "</div></div>"), 
                h && (b += '<div class="hist-profile-item full-width"><div class="hist-profile-item-label">🌍 ' + Ti(zi("histRelDistribution")) + '</div><div class="hist-profile-item-val">' + Ti(h) + "</div></div>"), 
                b += "</div>";
                var w = g ? zi("faithsClearAll") || "إلغاء التحديد" : zi("histRelHighlight") || "تسليط الضوء على الخريطة";
                b += '<div class="history-actions" style="margin-top:10px;"><button type="button" class="btn history-action-btn" id="relActHighlight" style="width:100%; justify-content:center; background:' + (g ? "var(--card-bg, #1e293b)" : e.color) + '; color:#ffffff; border:none; padding:8px 14px; border-radius:8px; font-weight:700; cursor:pointer;">' + (g ? "✕ " : "🔍 ") + Ti(w) + "</button></div>", 
                b += "</div>", wn = performance.now(), n.innerHTML = b, i.style.display = "block", 
                requestAnimationFrame(function() {
                    requestAnimationFrame(function() {
                        i.classList.add("visible");
                    });
                });
                var E = n.querySelector("#relActHighlight");
                E && (E.onclick = function() {
                    Pl(e.id), -1 !== kl.indexOf(e.id) && window.setReligionsYear && (El < e.startYear || e.endYear && El > e.endYear) && Kl(e.startYear), 
                    window.renderFaithsPopoverList && window.renderFaithsPopoverList(), jl(El, !0), 
                    Wl(El), $l(e);
                }), t();
            }
        }
    }
    function Kl(e) {
        if (e = Math.max(Cl, Math.min(Ll, Math.round(e))), El = e, Il && (Il.textContent = Rl(e)), 
        zl) {
            var t = (e - Cl) / (Ll - Cl) * 100;
            zl.style.setProperty("--religions-pct", t + "%"), zl.setAttribute("aria-valuenow", e), 
            zl.setAttribute("aria-valuemin", Cl), zl.setAttribute("aria-valuemax", Ll), zl.setAttribute("aria-valuetext", Rl(e));
        }
        jl(e, !0);
    }
    function Gl() {
        if (xl = !1, _l && (clearInterval(_l), _l = null), Ml) {
            Ml.setAttribute("aria-pressed", "false");
            var e = Ml.querySelector("[data-lucide]");
            e && (e.setAttribute("data-lucide", "play"), lucide && lucide.createIcons && lucide.createIcons());
        }
    }
    function Yl() {
        if (xl) Gl(); else {
            if (xl = !0, Ml) {
                Ml.setAttribute("aria-pressed", "true");
                var e = Ml.querySelector("[data-lucide]");
                e && (e.setAttribute("data-lucide", "pause"), lucide && lucide.createIcons && lucide.createIcons());
            }
            _l = setInterval(function() {
                var e = El + 20;
                e > Ll ? Gl() : Kl(e);
            }, 200);
        }
    }
    function Vl() {
        wl = !0, Sl && (Sl.style.display = "flex");
        var e = document.getElementById("historyBottomBar");
        e && (e.style.display = "flex");
        var t = document.getElementById("historyEraTimelineWrap");
        t && (t.style.display = "none");
        var n = document.getElementById("historyTravelersTimelineWrap");
        n && (n.style.display = "none"), Dl(), Nl().then(function() {
            wl && (El || (El = 0), Kl(El), window.renderFaithsPopoverList && window.renderFaithsPopoverList());
        }).catch(function(e) {
            console.error("Religions load error:", e), Al && (Al.textContent = zi("religionsLoadError"));
        });
    }
    function Ql() {
        wl = !1, kl = [], Gl(), Sl && (Sl.style.display = "none"), Fl();
    }
    if (window.showReligionDetail = $l, window.showReligionDetailById = function(e) {
        if (vl) {
            var t = (vl || []).find(function(t) {
                return t.id === e;
            });
            t && $l(t);
        } else Nl().then(function() {
            var t = (vl || []).find(function(t) {
                return t.id === e;
            });
            t && $l(t);
        });
    }, window.renderFaithsPopoverList = function() {
        var e = document.getElementById("histFaithsList");
        if (e) {
            if (!vl) return e.innerHTML = '<div class="history-loading">' + Ti(zi("religionsLoading")) + "</div>", 
            void Nl().then(function() {
                e.isConnected && window.renderFaithsPopoverList();
            }).catch(function() {
                e.isConnected && (e.innerHTML = '<div class="history-loading">' + Ti(zi("religionsLoadError")) + "</div>");
            });
            var t = document.getElementById("histFaithsSearchInput");
            t && !t._bound && (t._bound = !0, t.addEventListener("input", function() {
                Tl = this.value.trim().toLowerCase(), window.renderFaithsPopoverList();
            }));
            var n = document.getElementById("histFaithsSelectAllBtn");
            n && !n._bound && (n._bound = !0, n.addEventListener("click", function() {
                kl = (vl || []).map(function(e) {
                    return e.id;
                }), window.renderFaithsPopoverList(), jl(El, !0), Wl(El);
            }));
            var i = document.getElementById("histFaithsClearBtn");
            i && !i._bound && (i._bound = !0, i.addEventListener("click", function() {
                kl = [], window.renderFaithsPopoverList(), jl(El, !0), Wl(El);
            }));
            var a = vl.filter(function(e) {
                if (!Tl) return !0;
                var t = (Ai(e, "name") || "").toLowerCase(), n = (Ai(e, "classification") || "").toLowerCase(), i = (Ai(e, "founder") || "").toLowerCase(), a = (Ai(e, "summary") || "").toLowerCase();
                return -1 !== t.indexOf(Tl) || -1 !== n.indexOf(Tl) || -1 !== i.indexOf(Tl) || -1 !== a.indexOf(Tl);
            });
            if (a.length) {
                e.innerHTML = a.map(function(e) {
                    var t = -1 !== kl.indexOf(e.id), n = El >= e.startYear && (null === e.endYear || void 0 === e.endYear || El <= e.endYear), i = Ol(e.startYear, e.endYear);
                    return '<div class="faiths-popover-item' + (t ? " selected active" : "") + '" data-faith-id="' + e.id + '" role="checkbox" aria-checked="' + t + '" tabindex="0"><span class="religions-legend-swatch" style="background:' + e.color + '"></span><span class="faiths-popover-name">' + Ti(Ai(e, "name")) + (n && t ? ' <span style="font-size:10px;opacity:0.8;">●</span>' : "") + "</span>" + (t ? '<span class="faiths-selected-check">✓</span>' : "") + '<span class="faiths-popover-range" dir="ltr">' + Ti(i) + '</span><span class="faiths-item-info-btn" role="button" tabindex="0" title="' + Ti(Ai(e, "name")) + '">ℹ</span></div>';
                }).join("");
                var r = document.getElementById("histFaithsScrollCue");
                o(), e.onscroll = o, e.querySelectorAll(".faiths-popover-item").forEach(function(e) {
                    var t = e.getAttribute("data-faith-id"), n = (vl || []).find(function(e) {
                        return e.id === t;
                    });
                    if (n) {
                        var i = e.querySelector(".faiths-item-info-btn");
                        i && (i.addEventListener("click", function(e) {
                            e.stopPropagation(), $l(n);
                        }), i.addEventListener("keydown", function(e) {
                            "Enter" !== e.key && " " !== e.key || (e.stopPropagation(), e.preventDefault && e.preventDefault(), 
                            $l(n));
                        })), e.addEventListener("click", function(e) {
                            e.target && e.target.closest(".faiths-item-info-btn") || a();
                        }), e.addEventListener("keydown", function(e) {
                            e.target && e.target.closest(".faiths-item-info-btn") || "Enter" !== e.key && " " !== e.key || (e.preventDefault && e.preventDefault(), 
                            a());
                        });
                    }
                    function a() {
                        Pl(t), -1 !== kl.indexOf(t) ? (X((zi("histTabFaiths") || "دين") + ": " + Ai(n, "name")), 
                        (El < n.startYear || n.endYear && El > n.endYear) && window.setReligionsYear && Kl(n.startYear)) : X(zi("faithsClearAll") || "إلغاء التحديد"), 
                        "faiths" !== Fe && window.selectHistoryTab && selectHistoryTab("faiths"), window.renderFaithsPopoverList(), 
                        jl(El, !0), Wl(El);
                    }
                });
            } else e.innerHTML = '<div class="history-empty-state" style="padding:16px;text-align:center;opacity:0.7;">' + Ti(zi("noDataFound") || "لا توجد نتائج مطابقة") + "</div>";
        }
        function o() {
            if (r) {
                var t = e.scrollHeight > e.clientHeight + 8 && e.scrollTop + e.clientHeight < e.scrollHeight - 16;
                r.classList.toggle("hidden", !t);
            }
        }
    }, Ml && Ml.addEventListener("click", function() {
        Yl();
    }), zl) {
        var Xl = !1;
        function Jl(e) {
            var t = zl.getBoundingClientRect();
            if (t.width) {
                var n = Math.max(0, Math.min(1, (e - t.left) / t.width));
                Kl(Math.round(Cl + n * (Ll - Cl)));
            }
        }
        zl.addEventListener("pointerdown", function(e) {
            tt = Date.now(), Xl = !0, Jl(e.clientX), e.preventDefault();
        }), document.addEventListener("pointermove", function(e) {
            Xl && Jl(e.clientX);
        }), document.addEventListener("pointerup", function() {
            Xl = !1;
        }), zl.addEventListener("keydown", function(e) {
            var t = e.shiftKey ? 100 : 20;
            "ArrowRight" === e.key || "ArrowUp" === e.key ? (e.preventDefault(), Kl(El + t), 
            X(Rl(El))) : "ArrowLeft" === e.key || "ArrowDown" === e.key ? (e.preventDefault(), 
            Kl(El - t), X(Rl(El))) : "Home" === e.key ? (e.preventDefault(), Kl(Cl), X(Rl(Cl))) : "End" === e.key && (e.preventDefault(), 
            Kl(Ll), X(Rl(Ll)));
        });
    }
    window.renderFaithsMode = Vl, window.deactivateFaithsMode = Ql, window.activateReligionsMode = Vl, 
    window.deactivateReligionsMode = Ql, window.setReligionsYear = Kl, window.toggleReligionsPlay = Yl, 
    window.getActiveReligionsAtYear = Hl, window.religionsStillActive = function() {
        return wl;
    }, window.fetchReligionsData = Nl, window.drawReligionsSceneNow = function(e) {
        jl(El, e);
    }, window.getSelectedFaithIds = function() {
        return kl;
    }, window.setSelectedFaithIds = function(e) {
        kl = Array.isArray(e) ? e.slice() : [], window.renderFaithsPopoverList && window.renderFaithsPopoverList(), 
        jl(El, !0), Wl(El);
    };
    var Zl = "";
    function ec() {
        return Cn ? Promise.resolve(Cn) : fetch(e + "historical-travelers-data.json").then(function(e) {
            if (!e.ok) throw new Error("HTTP " + e.status + " loading travelers");
            return e.json();
        }).then(function(e) {
            return Cn = e && e.travelers ? e.travelers : Array.isArray(e) ? e : [], Cn;
        }).catch(function(e) {
            return console.warn("Failed to load historical travelers:", e), Cn = [], Cn;
        });
    }
    window.fetchHistoricalTravelers = ec, window.renderTravelersMode = function() {
        ec().then(function() {
            pc(), mc(), ac(), fc();
        }).catch(function(e) {
            "undefined" != typeof console && console.error("Failed to load travelers:", e);
        });
    };
    var tc = null;
    function nc() {
        return Mn && Mn.length && Cn ? (Tn < 0 && (Tn = 0), Tn >= Mn.length && (Tn = Mn.length - 1), 
        Cn.find(function(e) {
            return e.id === Mn[Tn];
        })) : null;
    }
    function ic(e, t) {
        if (e && Yn && si) {
            var i = ao()(e);
            if (i && !isNaN(i[0])) {
                var a = La(), r = t || Math.max(2.8, li && li.k || 1), o = a.width / 2 - i[0] * r, s = a.height / 2 - i[1] * r, l = d3.zoomIdentity.translate(o, s).scale(r);
                Yn.transition().duration(n() ? 0 : 700).ease(d3.easeCubicInOut).call(si.transform, l);
            }
        }
    }
    function ac() {
        if (ln && (ln.selectAll("*").remove(), Mn && Mn.length && Cn && (void 0 === Ke || "geo" !== Ke) && (void 0 === Pe || Pe))) {
            var e = ao(), t = window.innerWidth <= 768, n = li && li.k || 1;
            Mn.forEach(function(i, a) {
                var r = Cn.find(function(e) {
                    return e.id === i;
                });
                if (r && r.track && !(r.track.length < 2)) {
                    var o = a === Tn, s = r.color || "#14b8a6";
                    ln.append("path").datum({
                        type: "LineString",
                        coordinates: r.track
                    }).attr("d", Gn).attr("fill", "none").attr("stroke", s).attr("stroke-width", o ? t ? 9 : 13 : t ? 5 : 7).attr("stroke-opacity", o ? .32 : .16).attr("vector-effect", "non-scaling-stroke").style("cursor", "pointer").on("click", function() {
                        Tn = a, Pn = null, lc(), fc(), mc(), ac();
                    }), ln.append("path").datum({
                        type: "LineString",
                        coordinates: r.track
                    }).attr("d", Gn).attr("fill", "none").attr("stroke", s).attr("stroke-width", o ? t ? 2.8 : 3.5 : t ? 1.8 : 2.2).attr("stroke-dasharray", o ? "none" : "8,5").attr("vector-effect", "non-scaling-stroke").style("pointer-events", "none"), 
                    Array.isArray(r.waypoints) && r.waypoints.forEach(function(i, l) {
                        var c = i.coords || [ i.lon, i.lat ];
                        if (c) {
                            var d = e(c);
                            if (d && !isNaN(d[0])) {
                                var u = o && Pn === l, p = ln.append("g").attr("class", "hist-wp-marker").style("cursor", "pointer").on("click", function(e) {
                                    e && e.stopPropagation && e.stopPropagation(), Tn = a, cc(r, l, !1);
                                }), m = t ? 11 : 13, f = t ? 13 : 15, h = Math.max(m, Math.min(f, m * Math.pow(n, .15))), y = (u ? t ? 6.5 : 8 : t ? 4 : 5) / n, g = (u ? 2.5 : 1.5) / n;
                                if (p.append("circle").attr("class", "hist-wp-circle" + (u ? " active-wp" : "")).attr("cx", d[0]).attr("cy", d[1]).attr("r", y).attr("fill", u ? "#ffffff" : s).attr("stroke", u ? s : "#ffffff").attr("stroke-width", g).attr("vector-effect", "non-scaling-stroke"), 
                                u || o && 0 === l) {
                                    var v = _o(Ai(i, "name")), b = h / n, w = ((u ? 8.5 : 6) + .7 * h) / n;
                                    p.append("text").attr("class", "hist-wp-label" + (u ? " active-wp" : "")).attr("data-cy", d[1]).attr("x", d[0]).attr("y", d[1] - w).text(v).attr("fill", "#ffffff").attr("font-size", b + "px").attr("font-weight", u ? "bold" : "normal").attr("text-anchor", "middle").attr("style", "text-shadow: 0 1px 3px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.85); pointer-events: none;");
                                }
                            }
                        }
                    });
                }
            });
        }
    }
    function rc(e, t) {
        var n = document.getElementById("histWaypointPopup");
        if (n && e && e.waypoints && e.waypoints[t]) {
            var i = e.waypoints[t], a = document.getElementById("histWpStepNum"), r = document.getElementById("histWpTitle"), o = document.getElementById("histWpYear"), s = document.getElementById("histWpDuration"), l = document.getElementById("histWpEvents"), c = document.getElementById("histWpQuoteWrap"), d = document.getElementById("histWpQuote"), u = document.getElementById("histWpStageIndicator"), p = document.getElementById("histWpPrevBtn"), m = document.getElementById("histWpNextBtn"), f = document.getElementById("histWpContextGrid"), h = document.getElementById("histWpRulerVal"), y = document.getElementById("histWpPolityVal"), g = document.getElementById("histWpCondBadge"), v = document.getElementById("histWpCondDesc");
            a && (a.textContent = t + 1), r && (r.textContent = _o(Ai(i, "name"))), o && (o.textContent = i.year ? i.year + " " + zi("ceYearSuffix") : "");
            var b = Ai(i, "duration");
            s && (s.textContent = b || "", s.style.display = b ? "inline-block" : "none");
            var w = Ai(i, "ruler"), E = Ai(i, "polity"), k = Ai(i, "condition"), x = i.condition_type || "stable";
            if (f) if (w || E || k) {
                if (h && (h.textContent = w || "—"), y && (y.textContent = E || "—"), g) {
                    g.className = "hist-cond-badge cond-" + x;
                    var _ = "histCond" + x.charAt(0).toUpperCase() + x.slice(1);
                    g.textContent = zi(_) || x;
                }
                v && (v.textContent = k || ""), f.style.display = "flex";
            } else f.style.display = "none";
            var C = Ai(i, "events") || Ai(i, "event");
            l && (C ? (l.innerHTML = '<span class="hist-wp-ev-label">' + Ti(zi("histEventsLabel") || "الحدث:") + "</span> " + Ti(C), 
            l.style.display = "block") : l.style.display = "none");
            var L = Ai(i, "quote");
            c && d && (L ? (d.textContent = "«" + L + "»", c.style.display = "block") : c.style.display = "none"), 
            u && (u.textContent = t + 1 + " / " + e.waypoints.length), p && (p.disabled = t <= 0), 
            m && (m.disabled = t >= e.waypoints.length - 1);
            var B = document.getElementById("histWpClimate"), S = document.getElementById("histWpClimateText");
            if (B && S) if (i.climate_context) {
                var I = Ai(i.climate_context, "") || i.climate_context[Ht] || i.climate_context.ar || i.climate_context.en;
                S.textContent = I, B.style.display = "flex";
            } else B.style.display = "none";
            var z = document.getElementById("histWpCrossroadsWrap"), A = document.getElementById("histWpCrossroadsBtn"), M = document.getElementById("histWpCrossroadsBtnText");
            if (z && A) if (i.crossroad_hub_id) {
                var T = oc(i.crossroad_hub_id);
                T && T.length > 1 ? (M && (M.textContent = zi("histCrossroadsBadge") + " (" + T.length + " " + (zi("histSegTravelers") || "رحالة") + ")"), 
                A.onclick = function() {
                    sc(i.crossroad_hub_id, i);
                }, z.style.display = "block") : z.style.display = "none";
            } else z.style.display = "none";
            n.style.display = "block", window.lucide && "function" == typeof lucide.createIcons && lucide.createIcons();
            var P = i.coords || [ i.lon, i.lat ];
            Lo = P, Bo(P);
        }
    }
    function oc(e) {
        if (!e || !Cn) return [];
        var t = [];
        return Cn.forEach(function(n) {
            var i = (n.waypoints || []).filter(function(t) {
                return t.crossroad_hub_id === e;
            });
            i.length && i.forEach(function(e) {
                t.push({
                    traveler: n,
                    waypoint: e,
                    sortYear: parseInt(e.year, 10) || n.birth_year || 0
                });
            });
        }), t.sort(function(e, t) {
            return e.sortYear - t.sortYear;
        }), t;
    }
    function sc(e, t) {
        var n = document.getElementById("histCrossroadsModal"), i = document.getElementById("histCrossroadsTitle"), a = document.getElementById("histCrossroadsSubtitle"), r = document.getElementById("histCrossroadsBody"), o = document.getElementById("histCrossroadsCloseBtn"), s = document.getElementById("histCrossroadsBackdrop");
        if (n && r) {
            var l = oc(e), c = {
                constantinople: {
                    ar: "القسطنطينية (بيزنطة / إسطنبول)",
                    en: "Constantinople (Byzantium / Istanbul)",
                    ru: "Константинополь (Византия / Стамбул)",
                    uz: "Konstantinopol (Vizantiya / Istanbul)",
                    es: "Constantinopla (Bizancio / Estambul)"
                },
                baghdad: {
                    ar: "بغداد (دار السلام وعاصمة الخلافة)",
                    en: "Baghdad (City of Peace)",
                    ru: "Багдад (Город мира)",
                    uz: "Bag'dod (Tinchlik shahri)",
                    es: "Bagdad (Ciudad de la Paz)"
                },
                alexandria_cairo: {
                    ar: "القاهرة والإسكندرية (حاضرة وادي النيل)",
                    en: "Cairo & Alexandria",
                    ru: "Каир и Александрия",
                    uz: "Qohira va Iskandariya",
                    es: "El Cairo y Alejandría"
                },
                damascus_jerusalem: {
                    ar: "دمشق والقدس (قلب الشام وأرض المقدسات)",
                    en: "Damascus & Jerusalem",
                    ru: "Дамаск и Иерусалим",
                    uz: "Damashq va Quddus",
                    es: "Damasco y Jerusalén"
                },
                mecca_medina: {
                    ar: "مكة المكرمة والمدينة المنورة (الحرمان الشريفان)",
                    en: "Mecca & Medina",
                    ru: "Мекка и Медина",
                    uz: "Makka va Madina",
                    es: "La Meca y Medina"
                },
                samarkand_bukhara: {
                    ar: "سمرقند وبخارى (حواضر ما وراء النهر وسوغديانا)",
                    en: "Samarkand & Bukhara",
                    ru: "Самарканд и Бухара",
                    uz: "Samarqand va Buxoro",
                    es: "Samarcanda y Bujará"
                },
                kashgar: {
                    ar: "كاشغر (بوابة حوض تاريم ومفترق طريق الحرير)",
                    en: "Kashgar (Gateway to Tarim Basin)",
                    ru: "Кашгар",
                    uz: "Qashqar",
                    es: "Kashgar"
                },
                hormuz: {
                    ar: "هرمز (بوابة تجارة الخليج وبحر فارس)",
                    en: "Hormuz (Gateway of the Persian Gulf)",
                    ru: "Ормуз",
                    uz: "Hurmuz",
                    es: "Ormuz"
                },
                calicut: {
                    ar: "كاليكوت ومليبار (سوق التوابل وعاصمة الفلفل بالهند)",
                    en: "Calicut & Malabar",
                    ru: "Каликут и Малабар",
                    uz: "Kalikut va Malabar",
                    es: "Calicut y Malabar"
                },
                quanzhou: {
                    ar: "ميناء الزيتون / تشوانتشو (أعظم موانئ بحر الصين)",
                    en: "Quanzhou / Zaiton",
                    ru: "Цюаньчжоу / Зайтун",
                    uz: "Syuanjou / Zaytun",
                    es: "Quanzhou / Zaiton"
                },
                timbuktu: {
                    ar: "تمبكتو (حاضرة الذهب والعلم على نهر النيجر)",
                    en: "Timbuktu",
                    ru: "Тимбукту",
                    uz: "Timbuktu",
                    es: "Tombuctú"
                }
            }[e] || {}, d = c[Ht] || c.ar || _o(Ai(t, "name"));
            i && (i.textContent = d), a && (a.textContent = zi("histCrossroadsDesc") || "تفاوت الرؤى وسجل التحول التاريخي للمدينة باختلاف العصور وخلفيات الرحالة");
            var u = l.map(function(e) {
                var t = e.traveler, n = e.waypoint, i = Ai(t, "name"), a = Ai(t, "title") || "", r = n.year ? n.year + " " + zi("ceYearSuffix") : Ai(t, "period") || "", o = Ai(n, "ruler"), s = Ai(n, "polity"), l = Ai(n, "quote"), c = Ai(n, "condition"), d = '<div class="crossroads-traveler-card">';
                return d += '<div class="crossroads-card-top">', d += '<div class="crossroads-tr-name-wrap">', 
                d += '<span class="crossroads-tr-color-dot" style="background:' + t.color + '"></span>', 
                d += '<span class="crossroads-tr-name">' + Ti(i) + "</span>", a && (d += '<span class="crossroads-tr-role">(' + Ti(a) + ")</span>"), 
                d += "</div>", d += '<span class="crossroads-year-badge">' + Ti(r) + "</span>", 
                d += "</div>", d += '<div class="crossroads-ctx-row">', o && (d += "<span><strong>" + Ti(zi("histWpRuler") || "الحاكم:") + "</strong> " + Ti(o) + "</span>"), 
                s && (d += "<span><strong>" + Ti(zi("histWpPolity") || "الدولة:") + "</strong> " + Ti(s) + "</span>"), 
                d += "</div>", c && (d += '<div style="font-size:11.5px;color:#94a3b8;margin-bottom:6px;">' + Ti(c) + "</div>"), 
                l && (d += '<div class="crossroads-quote-box">«' + Ti(l) + "»</div>"), d += "</div>";
            }).join("");
            r.innerHTML = u, n.style.display = "flex", window.lucide && "function" == typeof lucide.createIcons && lucide.createIcons(), 
            o && (o.onclick = p), s && (s.onclick = p);
        }
        function p() {
            n.style.display = "none";
        }
    }
    function lc() {
        var e = document.getElementById("histWaypointPopup");
        e && (e.style.display = "none"), Lo = null, Pn = null;
        var t = document.getElementById("histTravelerTimeline");
        t && t.querySelectorAll(".hist-traveler-wp-node").forEach(function(e) {
            e.classList.remove("active");
        });
        var n = document.getElementById("histTravelerCardBody");
        n && n.querySelectorAll(".hist-traveler-station-pill").forEach(function(e) {
            e.classList.remove("active");
        });
        var i = document.getElementById("histTravelerCard");
        i && "none" !== i.style.display && fc(), ac();
    }
    function cc(e, t, n) {
        if (e && Array.isArray(e.waypoints) && e.waypoints.length) {
            t < 0 && (t = 0), t >= e.waypoints.length && (t = e.waypoints.length - 1), Pn = t;
            var i = e.waypoints[t], a = i.coords || [ i.lon, i.lat ];
            Lo = a;
            var r = document.getElementById("histTravelerTimeline");
            r && r.querySelectorAll(".hist-traveler-wp-node").forEach(function(e, n) {
                var i = n === t;
                if (e.classList.toggle("active", i), i) try {
                    e.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                        inline: "center"
                    });
                } catch (e) {}
            });
            var o = document.getElementById("histTravelerStageBadge");
            if (o) {
                var s = i.year ? i.year + " " + zi("ceYearSuffix") + " · " : "", l = zi("histStationWord") + " " + (t + 1) + " / " + e.waypoints.length;
                o.textContent = s + l;
            }
            var c = document.getElementById("histTravelerStepPrev"), d = document.getElementById("histTravelerStepNext");
            c && (c.disabled = !1), d && (d.disabled = !1);
            var u = document.getElementById("histTravelerCard");
            u && "none" !== u.style.display ? fc() : cardBody && cardBody.querySelectorAll(".hist-traveler-station-pill").forEach(function(e, n) {
                e.classList.toggle("active", n === t);
            }), ac(), rc(e, t), n && a && ic(a);
        }
    }
    function dc() {
        tc ? uc() : function() {
            var e = nc();
            if (!e || !e.waypoints || !e.waypoints.length) return;
            var t = document.getElementById("histTravelerPlayBtn");
            t && (t.classList.add("playing"), t.setAttribute("aria-pressed", "true"), t.innerHTML = '<i data-lucide="pause" class="lucide-icon"></i>', 
            window.lucide && "function" == typeof lucide.createIcons && lucide.createIcons());
            (null === Pn || Pn >= e.waypoints.length - 1) && cc(e, 0, !0);
            tc = setInterval(function() {
                var e = nc();
                if (e && e.waypoints && e.waypoints.length) {
                    var t = null === Pn ? 0 : Pn + 1;
                    t >= e.waypoints.length && (t = 0), cc(e, t, !0);
                } else uc();
            }, 3200);
        }();
    }
    function uc() {
        tc && (clearInterval(tc), tc = null);
        var e = document.getElementById("histTravelerPlayBtn");
        e && (e.classList.remove("playing"), e.setAttribute("aria-pressed", "false"), e.innerHTML = '<i data-lucide="play" class="lucide-icon"></i>', 
        window.lucide && "function" == typeof lucide.createIcons && lucide.createIcons());
    }
    function pc() {
        var e = document.getElementById("histTravelersList");
        if (e) {
            if (!Cn) return e.innerHTML = '<div class="history-loading">' + Ti(zi("histEraLoading") || "جاري التحميل...") + "</div>", 
            void ec().then(function() {
                pc();
            });
            var t = (Zl || "").trim(), n = Cn.filter(function(e) {
                if (!t) return !0;
                var n = [ e.id || "", e.dates || "", String(e.birth_year || ""), String(e.death_year || "") ];
                return [ "name", "title", "bio", "period", "motive", "religion", "language", "ethnicity", "birth_place", "death_place" ].forEach(function(t) {
                    [ "", "_ar", "_en", "_ru", "_uz", "_es" ].forEach(function(i) {
                        var a = e[t + i];
                        a && "string" == typeof a && n.push(a);
                    });
                }), (e.waypoints || []).forEach(function(e) {
                    [ "name", "year", "duration", "events", "quote", "ruler", "polity" ].forEach(function(t) {
                        [ "", "_ar", "_en", "_ru", "_uz", "_es" ].forEach(function(i) {
                            var a = e[t + i];
                            a && "string" == typeof a && n.push(a);
                        });
                    });
                }), Ui(n.join(" "), t);
            });
            if (n.length) {
                e.innerHTML = n.map(function(e) {
                    var t = -1 !== Mn.indexOf(e.id), n = Ai(e, "period") || e.dates || "", i = Ai(e, "name");
                    return '<div class="hist-traveler-item' + (t ? " selected" : "") + '" data-traveler-id="' + e.id + '" role="checkbox" aria-checked="' + t + '" tabindex="0" aria-label="' + Ti(i) + '"><div class="hist-traveler-color-bar" style="background:' + e.color + '"></div><div class="hist-traveler-info"><div class="hist-traveler-title-row"><span class="hist-traveler-name">' + Ti(i) + '</span><span class="hist-traveler-dates">' + Ti(n) + '</span></div><div class="hist-traveler-desc-line">' + Ti(Ai(e, "title") || Ai(e, "bio") || "") + '</div></div><input type="checkbox" class="hist-traveler-checkbox" ' + (t ? "checked" : "") + ' tabindex="-1" aria-hidden="true" /></div>';
                }).join("");
                var i = document.getElementById("histTravelersScrollCue");
                a(), e.onscroll = a, e.querySelectorAll(".hist-traveler-item").forEach(function(e) {
                    function t() {
                        var t = e.getAttribute("data-traveler-id"), n = (Cn || []).find(function(e) {
                            return e.id === t;
                        }), i = n ? Ai(n, "name") : t, a = Mn.indexOf(t);
                        -1 === a ? (Mn.push(t), Tn = Mn.length - 1, X(zi("histSelectedAnnounce", {
                            name: i
                        }))) : (Mn.splice(a, 1), Tn >= Mn.length && (Tn = Math.max(0, Mn.length - 1)), X(zi("histDeselectedAnnounce", {
                            name: i
                        }))), Pn = null, lc(), pc(), mc(), ac(), fc(), window.updateHistSubmodeVis && window.updateHistSubmodeVis();
                    }
                    e.addEventListener("click", function(e) {
                        t();
                    }), e.addEventListener("keydown", function(e) {
                        " " !== e.key && "Enter" !== e.key || (e.preventDefault(), t());
                    });
                });
            } else e.innerHTML = '<div class="hist-col-empty-msg" style="padding:16px;text-align:center;">' + Ti(zi("histNoResults") || "لا توجد نتائج") + "</div>";
        }
        function a() {
            if (i) {
                var t = e.scrollHeight > e.clientHeight + 8 && e.scrollTop + e.clientHeight < e.scrollHeight - 16;
                i.classList.toggle("hidden", !t);
            }
        }
    }
    function mc() {
        var e = document.getElementById("histTravelersChips"), t = document.getElementById("histTravelerTimeline"), n = document.getElementById("histTravelerStageBadge"), i = document.getElementById("histTravelerStepPrev"), a = document.getElementById("histTravelerStepNext"), r = document.getElementById("histTravelerPlayBtn");
        if (e && (Mn && Mn.length && Cn ? (e.innerHTML = Mn.map(function(e, t) {
            var n = Cn.find(function(t) {
                return t.id === e;
            });
            return n ? '<button type="button" class="hist-traveler-chip' + (t === Tn ? " active" : "") + '" data-tidx="' + t + '"><span class="hist-traveler-chip-dot" style="background:' + n.color + '"></span><span>' + Ti(Ai(n, "name")) + "</span></button>" : "";
        }).join(""), e.querySelectorAll(".hist-traveler-chip").forEach(function(e) {
            e.addEventListener("click", function() {
                var e = parseInt(this.getAttribute("data-tidx"), 10);
                Tn = e, Pn = null, lc(), fc(), mc(), ac();
            });
        })) : e.innerHTML = '<span style="color:#94a3b8;font-size:12px;">' + Ti(zi("histSelectTravelerCue") || "اختر رحالة من القائمة أعلاه") + "</span>"), 
        t) {
            if (!Mn || !Mn.length || !Cn) return uc(), t.innerHTML = '<span class="hist-stepper-empty-cue" style="color:#94a3b8;font-size:12px;padding:0 8px;">' + Ti(zi("histSelectTravelerCue") || "اختر رحالة من القائمة أعلاه") + "</span>", 
            n && (n.textContent = ""), i && (i.disabled = !0), a && (a.disabled = !0), void (r && (r.disabled = !0));
            i && (i.disabled = !1), a && (a.disabled = !1), r && (r.disabled = !1);
            var o = nc();
            if (!o || !Array.isArray(o.waypoints) || !o.waypoints.length) return t.innerHTML = '<span class="hist-stepper-empty-cue" style="color:#94a3b8;font-size:12px;padding:0 8px;">' + Ti(Ai(o, "name")) + "</span>", 
            void (n && (n.textContent = Ai(o, "period") || o.dates || ""));
            var s = o.waypoints.map(function(e, t) {
                var n = Pn === t, i = _o(Ai(e, "name")), a = Ai(e, "name") + (e.year ? " (" + e.year + ")" : "");
                return '<button type="button" class="hist-traveler-wp-node' + (n ? " active" : "") + '" data-wp-idx="' + t + '" title="' + Ti(a) + '" aria-label="' + Ti(a) + '" aria-pressed="' + n + '"><span class="hist-traveler-node-dot"></span><span class="hist-traveler-node-label">' + (t + 1) + ". " + Ti(i) + "</span></button>";
            }).join("");
            if (t.innerHTML = s, n) if (null !== Pn && o.waypoints[Pn]) {
                var l = o.waypoints[Pn], c = l.year ? l.year + " " + zi("ceYearSuffix") + " · " : "";
                n.textContent = c + zi("histStationWord") + " " + (Pn + 1) + " / " + o.waypoints.length;
            } else {
                var d = Ai(o, "period") || o.dates || "";
                n.textContent = o.waypoints.length + " " + (zi("travelerStations") || "محطات") + (d ? " · " + d : "");
            }
            t.setAttribute("aria-valuemin", "1"), t.setAttribute("aria-valuemax", o.waypoints.length), 
            t.setAttribute("aria-valuenow", null !== Pn ? Pn + 1 : 0), t.setAttribute("aria-valuetext", n ? n.textContent : ""), 
            t.querySelectorAll(".hist-traveler-wp-node").forEach(function(e) {
                e.addEventListener("click", function() {
                    var e = parseInt(this.getAttribute("data-wp-idx"), 10);
                    cc(o, e, !0);
                });
            }), t._kbBound || (t._kbBound = !0, t.addEventListener("keydown", function(e) {
                var t = nc();
                if (t && t.waypoints && t.waypoints.length) {
                    var n = null === Pn ? -1 : Pn;
                    if ("ArrowRight" === e.key || "ArrowDown" === e.key) e.preventDefault(), cc(t, Math.min(t.waypoints.length - 1, n + 1), !0); else if ("ArrowLeft" === e.key || "ArrowUp" === e.key) {
                        e.preventDefault(), cc(t, Math.max(0, n - 1), !0);
                    } else "Home" === e.key ? (e.preventDefault(), cc(t, 0, !0)) : "End" === e.key && (e.preventDefault(), 
                    cc(t, t.waypoints.length - 1, !0));
                }
            }));
        }
    }
    function fc() {
        var e = document.getElementById("histTravelerCard");
        if (e) if (Mn && Mn.length && Cn) {
            e.style.display = "flex", Tn < 0 && (Tn = 0), Tn >= Mn.length && (Tn = Mn.length - 1);
            var t = Cn.find(function(e) {
                return e.id === Mn[Tn];
            });
            if (t) {
                var n = document.getElementById("histTravelerPrevBtn"), i = document.getElementById("histTravelerNextBtn"), a = document.getElementById("histTravelerNavCounter"), r = document.getElementById("histTravelerNavName"), o = document.getElementById("histTravelerCardBody");
                a && (a.textContent = Tn + 1 + " / " + Mn.length), r && (r.textContent = Ai(t, "name"));
                var s = Mn.length > 1;
                n && (n.disabled = !s), i && (i.disabled = !s);
                var l = Ai(t, "period") || t.dates || "", c = "";
                c += '<div class="hist-traveler-badges">', l && (c += '<span class="hist-traveler-badge">' + Ti(l) + "</span>"), 
                t.distance_km && (c += '<span class="hist-traveler-badge badge-dist">' + Ti(t.distance_km.toLocaleString()) + " " + Ti(zi("km") || "كم") + "</span>"), 
                Ai(t, "title") && (c += '<span class="hist-traveler-badge">' + Ti(Ai(t, "title")) + "</span>"), 
                c += "</div>";
                var d = Ai(t, "primary_source");
                d && (c += '<div class="hist-traveler-source"><strong>' + Ti(zi("histTravelerQuote") || "المصدر التاريخي الأصيل") + ":</strong> «" + Ti(d) + "»</div>");
                var u = Ai(t, "bio");
                u && (c += '<div class="hist-traveler-bio">' + Ti(u) + "</div>");
                var p = Ai(t, "route_summary");
                p && (c += '<div class="hist-traveler-section-title"><i data-lucide="route" class="lucide-icon"></i> ' + Ti(zi("corridorsToggle") || "ملخص خط السير") + "</div>", 
                c += '<div class="hist-traveler-details" style="font-size:12px;margin-bottom:10px;">' + Ti(p) + "</div>");
                var m = t.academic_reception;
                if (m) {
                    c += '<div class="hist-reception-box">', c += '<div class="hist-reception-header">', 
                    c += '<span class="reception-icon"><i data-lucide="scale" class="lucide-icon"></i></span>', 
                    c += '<div class="reception-title-col">', c += "<strong>" + Ti(zi("histReceptionTitle") || "النقد التاريخي والمصادر الأكاديمية") + "</strong>";
                    var f = Ai(m, "status");
                    f && (c += '<span class="reception-status-badge">' + Ti(f) + "</span>"), c += "</div>", 
                    c += "</div>";
                    var h = Ai(m, "contemporary_verdict");
                    h && (c += '<div class="reception-item reception-verdict">', c += '<div class="reception-item-lbl"><strong><i data-lucide="users" class="lucide-icon"></i> ' + Ti(zi("histContemporaryVerdict") || "رأي المعاصرين والمجتمع العلمي:") + "</strong></div>", 
                    c += '<div class="reception-item-desc">' + Ti(h) + "</div>", c += "</div>");
                    var y = Ai(m, "doubt_reasons");
                    y && (c += '<div class="reception-item reception-doubts">', c += '<div class="reception-item-lbl"><strong><i data-lucide="help-circle" class="lucide-icon"></i> ' + Ti(zi("histDoubtReasons") || "أسباب التشكيك أو الجدل:") + "</strong></div>", 
                    c += '<div class="reception-item-desc">' + Ti(y) + "</div>", c += "</div>");
                    var g = Ai(m, "modern_archaeology");
                    g && (c += '<div class="reception-item reception-arch">', c += '<div class="reception-item-lbl"><strong><i data-lucide="check-circle-2" class="lucide-icon"></i> ' + Ti(zi("histModernCorroboration") || "شهادة الآثار والتحقيق الحديث:") + "</strong></div>", 
                    c += '<div class="reception-item-desc">' + Ti(g) + "</div>", c += "</div>"), c += "</div>";
                }
                if (Array.isArray(t.waypoints) && t.waypoints.length) {
                    if (c += '<div class="hist-traveler-section-title"><i data-lucide="map-pin" class="lucide-icon"></i> ' + Ti(zi("travelerStations") || "محطات الرحلة") + " (" + t.waypoints.length + ")</div>", 
                    c += '<div class="hist-traveler-stations-overview">', t.waypoints.forEach(function(e, t) {
                        var n = Pn === t, i = _o(Ai(e, "name"));
                        c += '<button type="button" class="hist-traveler-station-pill' + (n ? " active" : "") + '" data-wp-idx="' + t + '">', 
                        c += '<span class="pill-num">' + (t + 1) + "</span>", c += "<span>" + Ti(i) + "</span>", 
                        c += "</button>";
                    }), c += "</div>", null !== Pn && t.waypoints[Pn]) {
                        var v = t.waypoints[Pn], b = Ai(v, "ruler"), w = Ai(v, "polity"), E = Ai(v, "condition"), k = v.condition_type || "stable", x = "histCond" + k.charAt(0).toUpperCase() + k.slice(1);
                        (b || w || E) && (c += '<div class="hist-card-active-wp-context">', c += '<div class="hist-card-wp-ctx-header"><strong>' + Ti(_o(Ai(v, "name"))) + (v.year ? " · " + Ti(v.year) : "") + '</strong><span class="hist-cond-badge cond-' + k + '">' + Ti(zi(x) || k) + "</span></div>", 
                        b && (c += '<div class="hist-card-wp-ctx-row"><span class="ctx-lbl"><i data-lucide="crown" class="lucide-icon"></i> ' + Ti(zi("histWpRuler") || "الحاكم:") + "</span> <strong>" + Ti(b) + "</strong></div>"), 
                        w && (c += '<div class="hist-card-wp-ctx-row"><span class="ctx-lbl"><i data-lucide="landmark" class="lucide-icon"></i> ' + Ti(zi("histWpPolity") || "الدولة:") + "</span> <strong>" + Ti(w) + "</strong></div>"), 
                        E && (c += '<div class="hist-card-wp-ctx-desc">' + Ti(E) + "</div>"), c += "</div>");
                    }
                    c += '<div class="hist-traveler-station-hint"><i data-lucide="info" class="lucide-icon"></i> ' + Ti(zi("clickStationHint") || "اضغط على أي محطة أو استخدم الشريط السفلي لاستكشاف نصوص وتفاصيل الرحالة على الخريطة") + "</div>";
                }
                o.innerHTML = c, window.lucide && "function" == typeof lucide.createIcons && lucide.createIcons(), 
                o.querySelectorAll(".hist-traveler-station-pill").forEach(function(e) {
                    e.addEventListener("click", function() {
                        var e = parseInt(this.getAttribute("data-wp-idx"), 10);
                        cc(t, e, !0);
                    });
                });
            }
        } else e.style.display = "none";
    }
    window.centerMapOnCoords = ic, window.drawTravelerRoutes = ac, window.openWaypointPopup = rc, 
    window.openCrossroadsModal = sc, window.closeWaypointPopup = lc, window.goToWaypoint = cc, 
    window.toggleTravelerPlay = dc, window.stopTravelerPlay = uc, window.deactivateTravelersMode = function() {
        uc();
        var e = document.getElementById("historyTravelersTimelineWrap");
        e && (e.style.display = "none");
        var t = document.getElementById("histTravelerCard");
        t && (t.style.display = "none"), ln && ln.selectAll("*").remove();
    }, window.renderTravelersPopoverList = pc, window.renderTravelersBottomBar = mc, 
    window.updateTravelerCard = fc;
    var hc = document.getElementById("histTravelerPrevBtn");
    hc && hc.addEventListener("click", function() {
        !Mn || Mn.length <= 1 || (Tn = (Tn - 1 + Mn.length) % Mn.length, Pn = null, lc(), 
        fc(), mc(), ac());
    });
    var yc = document.getElementById("histTravelerNextBtn");
    yc && yc.addEventListener("click", function() {
        !Mn || Mn.length <= 1 || (Tn = (Tn + 1) % Mn.length, Pn = null, lc(), fc(), mc(), 
        ac());
    });
    var gc = document.getElementById("histTravelerCardClose");
    gc && gc.addEventListener("click", function() {
        uc(), Mn = [], Tn = 0, Pn = null, lc();
        var e = document.getElementById("histTravelerCard");
        e && (e.style.display = "none"), pc(), mc(), ac(), window.updateHistSubmodeVis && window.updateHistSubmodeVis();
    });
    var vc = document.getElementById("histTravelersClearBtn");
    vc && vc.addEventListener("click", function() {
        uc(), Mn = [], Tn = 0, Pn = null, lc(), pc(), mc(), ac(), fc(), window.updateHistSubmodeVis && window.updateHistSubmodeVis();
    }), (_c = document.getElementById("histTravelersSearchInput")) && _c.addEventListener("input", function() {
        Zl = this.value, pc();
    });
    var bc = document.getElementById("histTravelerStepPrev");
    bc && bc.addEventListener("click", function() {
        var e = nc();
        e && e.waypoints && e.waypoints.length && cc(e, null === Pn || Pn <= 0 ? e.waypoints.length - 1 : Pn - 1, !0);
    });
    var wc = document.getElementById("histTravelerStepNext");
    wc && wc.addEventListener("click", function() {
        var e = nc();
        e && e.waypoints && e.waypoints.length && cc(e, null === Pn || Pn >= e.waypoints.length - 1 ? 0 : Pn + 1, !0);
    });
    var Ec = document.getElementById("histTravelerPlayBtn");
    Ec && Ec.addEventListener("click", function() {
        dc();
    });
    var kc = document.getElementById("histWpCloseBtn");
    kc && kc.addEventListener("click", function() {
        lc();
    });
    var xc = document.getElementById("histWpPrevBtn");
    xc && xc.addEventListener("click", function() {
        var e = nc();
        !e || null === Pn || Pn <= 0 || cc(e, Pn - 1, !0);
    });
    var _c, Cc = document.getElementById("histWpNextBtn");
    Cc && Cc.addEventListener("click", function() {
        var e = nc();
        !e || null === Pn || Pn >= e.waypoints.length - 1 || cc(e, Pn + 1, !0);
    }), (_c = document.getElementById("histTravelersSearchInput")) && _c.addEventListener("input", function() {
        Zl = this.value, pc();
    });
    var Lc = [ {
        id: "abbasid",
        name: {
            ar: "الخلافة العباسية",
            en: "Abbasid Caliphate",
            ru: "Аббасидский халифат",
            uz: "Abbosiylar xalifaligi",
            es: "Califato Abasí"
        },
        eraRange: [ 750, 1258 ],
        capital: {
            ar: "بغداد (مدينة السلام)",
            en: "Baghdad (Round City)",
            ru: "Багдад",
            uz: "Bogʻdod",
            es: "Bagdad"
        },
        system: {
            ar: "خلافة إسلامية مركزية جامعة",
            en: "Centralized Islamic Caliphate",
            ru: "Централизованный халифат",
            uz: "Markazlashgan islom xalifaligi",
            es: "Califato islámico centralizado"
        },
        vitality: {
            ar: "العصر الذهبي والذروة العلمية والحضارية",
            en: "Golden Age peak of science & culture",
            ru: "Золотой век науки и культуры",
            uz: "Ilm-fan va madaniyatning Oltin davri",
            es: "Edad de Oro de ciencia y cultura"
        },
        religion: {
            ar: "الإسلام (مع تنوع فكري وفلسفي واسع)",
            en: "Islam (rich scholastic & philosophical diversity)",
            ru: "Ислам",
            uz: "Islom",
            es: "Islam"
        },
        military: {
            ar: "جيش بري محترف وشبكة بريد ومراكز حراسة وتجارة عالمية",
            en: "Professional land army, global trade routes",
            ru: "Профессиональная армия, торговые пути",
            uz: "Professional armiya, savdo yoʻllari",
            es: "Ejército profesional y rutas globales"
        }
    }, {
        id: "tang",
        name: {
            ar: "سلالة تانغ الصينية",
            en: "Tang Dynasty",
            ru: "Династия Тан",
            uz: "Tang sulolasi",
            es: "Dinastía Tang"
        },
        eraRange: [ 618, 907 ],
        capital: {
            ar: "تشانغآن (شيان حالياً)",
            en: "Chang'an (modern Xi'an)",
            ru: "Чанъань",
            uz: "Chanʼan",
            es: "Chang'an"
        },
        system: {
            ar: "إمبراطورية كونفوشية مركزية مع نظام امتحانات مدنية",
            en: "Centralized Confucian bureaucracy with imperial examinations",
            ru: "Конфуцианская империя",
            uz: "Konfutsiychilik imperiyasi",
            es: "Imperio burocrático confuciano"
        },
        vitality: {
            ar: "ذروة الازدهار التجاري عبر طريق الحرير والشعر والفنون",
            en: "Cosmopolitan zenith via Silk Road commerce & arts",
            ru: "Зенит космополитизма и Великого шелкового пути",
            uz: "Buyuk Ipak yoʻli savdosi choʻqqisi",
            es: "Cénit cosmopolita de la Ruta de la Seda"
        },
        religion: {
            ar: "البوذية والطاوية والكونفوشية",
            en: "Buddhism, Taoism & Confucianism",
            ru: "Буддизм, даосизм и конфуцианство",
            uz: "Buddizm, daosizm va konfutsiychilik",
            es: "Budismo, taoísmo y confucianismo"
        },
        military: {
            ar: "جيش مشاة وفرسان ضخم مع نظام التجنيد ومطوعي الحدود",
            en: "Massive cavalry & infantry with border garrisons",
            ru: "Массивная пехота и конница",
            uz: "Katta otliq va piyoda qoʻshin",
            es: "Poderosa caballería e infantería"
        }
    }, {
        id: "byzantine",
        name: {
            ar: "الإمبراطورية البيزنطية (الروم)",
            en: "Byzantine Empire",
            ru: "Византийская империя",
            uz: "Vizantiya imperiyasi",
            es: "Imperio Bizantino"
        },
        eraRange: [ 330, 1453 ],
        capital: {
            ar: "القسطنطينية (إسطنبول)",
            en: "Constantinople",
            ru: "Константинополь",
            uz: "Konstantinopol",
            es: "Constantinopla"
        },
        system: {
            ar: "إمبراطورية قيصرية مسيحية أرثوذكسية",
            en: "Autocratic Christian Empire",
            ru: "Самодержавная христианская империя",
            uz: "Xristian imperiyasi",
            es: "Imperio autocrático cristiano"
        },
        vitality: {
            ar: "دفاع استراتيجي وتوازن متجدد بين الشرق والغرب",
            en: "Strategic defense & trade nexus between East & West",
            ru: "Стратегический мост между Востоком и Западом",
            uz: "Sharq va Gʻarb oʻrtasidagi strategik koʻprik",
            es: "Nexo estratégico entre Oriente y Occidente"
        },
        religion: {
            ar: "المسيحية الأرثوذكسية الشرقية",
            en: "Eastern Orthodox Christianity",
            ru: "Православное христианство",
            uz: "Sharqiy pravoslav xristianligi",
            es: "Cristianismo ortodoxo"
        },
        military: {
            ar: "جيش الثغور (الـ Themes) والأسطول المجهز بالنار الإغريقية",
            en: "Thematic army & fleet with Greek Fire",
            ru: "Фемная армия и флот с греческим огнём",
            uz: "Fem armiyasi va flot",
            es: "Ejército temático y Fuego Griego"
        }
    }, {
        id: "holy_roman",
        name: {
            ar: "الإمبراطورية الرومانية المقدسة",
            en: "Holy Roman Empire",
            ru: "Священная Римская империя",
            uz: "Muqaddas Rim imperiyasi",
            es: "Sacro Imperio Romano Germánico"
        },
        eraRange: [ 962, 1806 ],
        capital: {
            ar: "مقر متنقل (آخن / فرانكفورت / فيينا)",
            en: "Itinerant (Aachen / Frankfurt / Vienna)",
            ru: "Ахен / Вена",
            uz: "Axen / Vena",
            es: "Aquisgrán / Viena"
        },
        system: {
            ar: "اتحاد إقطاعي إمبراطوري لدويلات وأسقفيات منتخبة",
            en: "Feudal elective confederation of principalities",
            ru: "Выборная феодальная конфедерация",
            uz: "Feodal konfederatsiya",
            es: "Confederación feudal electiva"
        },
        vitality: {
            ar: "تشتت سياسي مع نمو المدن التجارية والحرفية",
            en: "Decentralized political landscape with rising merchant cities",
            ru: "Децентрализованная структура с ростом торговых городов",
            uz: "Savdo shaharlarining yuksalishi",
            es: "Descentralizado con auge comercial urbano"
        },
        religion: {
            ar: "المسيحية الكاثوليكية (ثم صراع بروتستانتي لاحق)",
            en: "Roman Catholicism (later Reformation struggles)",
            ru: "Католицизм",
            uz: "Katolitsizm",
            es: "Catolicismo romano"
        },
        military: {
            ar: "فرسان إقطاعيون وميليشيات مدنية تحت رايات الأمراء",
            en: "Feudal knights and imperial prince levies",
            ru: "Рыцарское феодальное ополчение",
            uz: "Ritsarlar va knyaz qoʻshinlari",
            es: "Caballeros feudales y levas de príncipes"
        }
    }, {
        id: "srivijaya",
        name: {
            ar: "إمبراطورية سريفيجايا البحرية",
            en: "Srivijaya Maritime Empire",
            ru: "Империя Шривиджая",
            uz: "Shrivijaya dengiz imperiyasi",
            es: "Imperio Marítimo de Srivijaya"
        },
        eraRange: [ 650, 1377 ],
        capital: {
            ar: "بالمبانغ (سومطرة)",
            en: "Palembang (Sumatra)",
            ru: "Палембанг",
            uz: "Palembang",
            es: "Palembang"
        },
        system: {
            ar: "ثالاسوقراطية (إمبراطورية بحرية تجارية مهيمنة على المضائق)",
            en: "Thalassocracy controlling Malacca Straits",
            ru: "Талассократия контролирующая Малаккский пролив",
            uz: "Malakka boʻgʻozini boshqargan dengiz imperiyasi",
            es: "Talasocracia comercial del estrecho de Malaca"
        },
        vitality: {
            ar: "احتكار تجارة التوابل والحرير البحرية بين الصين والهند",
            en: "Monopoly on maritime spice & silk trade between China & India",
            ru: "Монополия на морскую торговлю пряностями",
            uz: "Ziravorlar savdosi monopoliyasi",
            es: "Monopolio del comercio marítimo de especias"
        },
        religion: {
            ar: "البوذية فاجرايانا مع تقاليد ملاوية أصلية",
            en: "Vajrayana Buddhism & Malay traditions",
            ru: "Буддизм Ваджраяны",
            uz: "Buddizm",
            es: "Budismo Vajrayana"
        },
        military: {
            ar: "أساطيل بحرية خفيفة وسريعة للسيطرة على السواحل والملاحة",
            en: "Swift coastal navies and corsair enforcement",
            ru: "Быстрый каботажный флот",
            uz: "Tezkor dengiz floti",
            es: "Flotas navales rápidas de control costero"
        }
    }, {
        id: "maya",
        name: {
            ar: "المدن-الدول المايانية (العصر الكلاسيكي)",
            en: "Maya City-States (Classic Period)",
            ru: "Города-государства Майя",
            uz: "Mayya shahar-davlatlari",
            es: "Ciudades-Estado Mayas"
        },
        eraRange: [ 250, 950 ],
        capital: {
            ar: "مراكز متعددة (تيكال، كالاكمول، بالينكي)",
            en: "Multiple centres (Tikal, Calakmul, Palenque)",
            ru: "Тикаль, Калакмуль",
            uz: "Tikal, Kalakmul",
            es: "Tikal, Calakmul, Palenque"
        },
        system: {
            ar: "دويلات مدن متنافسة يقودها ملوك كهنة (أهاو)",
            en: "Competing divine kingships (K'uhul Ajaw)",
            ru: "Города-государства под властью царей-жрецов",
            uz: "Raqobatchi shahar-davlatlar",
            es: "Ciudades-estado divinizadas en pugna"
        },
        vitality: {
            ar: "قمة الإنجاز الفلكي والرياضي والمعماري الأهرامي في أمريكا",
            en: "Pinnacle of Mesoamerican astronomy, mathematics and architecture",
            ru: "Вершина астрономии, математики и пирамид Америки",
            uz: "Astronomiya, matematika va meʼmorchilik choʻqqisi",
            es: "Cúspide de astronomía, matemáticas y pirámides"
        },
        religion: {
            ar: "ديانة المايا المتعددة الآلهة وعبادة قوى الطبيعة والكون",
            en: "Polytheistic Maya pantheon & cosmic cycles",
            ru: "Политеизм майя",
            uz: "Koʻpxudolik",
            es: "Politeísmo maya y ciclos cósmicos"
        },
        military: {
            ar: "محاربو النخبة والاشتباك القريب لأسر النبلاء والسيطرة المحدودة",
            en: "Elite warrior orders and dynastic capture warfare",
            ru: "Элитные воинские ордена",
            uz: "Elita jangchilari",
            es: "Guerreros de élite y capturas dinásticas"
        }
    } ];
    function Bc(e, t) {
        var n = document.getElementById("histPolityCompareModal");
        if (n) {
            var i = "function" == typeof getHistEra ? getHistEra() : null, a = document.getElementById("histComparePolity1Select"), r = document.getElementById("histComparePolity2Select"), o = [];
            if (i) (i.phases && i.phases[Je] && i.phases[Je].polities || i.polities || []).forEach(function(e, t) {
                o.push({
                    id: "era_polity_" + t,
                    name: {
                        ar: e.name,
                        en: e.name_en || e.name,
                        ru: e.name_ru || e.name,
                        uz: e.name_uz || e.name,
                        es: e.name_es || e.name
                    },
                    capital: {
                        ar: e.capital || "—",
                        en: e.capital_en || e.capital || "—",
                        ru: e.capital_ru || e.capital || "—",
                        uz: e.capital_uz || e.capital || "—",
                        es: e.capital_es || e.capital || "—"
                    },
                    system: {
                        ar: e.system || "إمبراطورية كبرى",
                        en: e.system_en || "Major Empire",
                        ru: "Империя",
                        uz: "Imperiya",
                        es: "Gran Imperio"
                    },
                    vitality: {
                        ar: e.desc || "قوة مهيمنة في هذه الحقبة",
                        en: e.desc_en || "Dominant power of the era",
                        ru: "Ведущая сила эпохи",
                        uz: "Davrning yetakchi kuchi",
                        es: "Poder dominante de la era"
                    },
                    religion: {
                        ar: e.religion || "عقيدة الدولة السائدة",
                        en: e.religion_en || "State religion",
                        ru: "Гос. религия",
                        uz: "Davlat dini",
                        es: "Religión estatal"
                    },
                    military: {
                        ar: "جيش إمبراطوري بري وبحري",
                        en: "Imperial land & naval forces",
                        ru: "Имперские силы",
                        uz: "Imperiya qoʻshinlari",
                        es: "Fuerzas imperiales"
                    }
                });
            });
            Lc.forEach(function(e) {
                o.some(function(t) {
                    return t.id === e.id;
                }) || o.push(e);
            }), a.innerHTML = o.map(function(e) {
                return '<option value="' + e.id + '">' + Ti(Ai(e, "name")) + "</option>";
            }).join(""), r.innerHTML = o.map(function(e) {
                return '<option value="' + e.id + '">' + Ti(Ai(e, "name")) + "</option>";
            }).join(""), e ? a.value = e : o.length > 0 && (a.value = o[0].id), t ? r.value = t : o.length > 1 && (r.value = o[1].id), 
            a.onchange = s, r.onchange = s, s(), n.removeAttribute("hidden"), n.style.display = "block", 
            n.classList.add("visible"), X(zi("histCompareTitle") || "مقارنة القوى التاريخية المتزامنة"), 
            setTimeout(function() {
                a && a.focus();
            }, 60);
        }
        function s() {
            var e = o.find(function(e) {
                return e.id === a.value;
            }) || o[0], t = o.find(function(e) {
                return e.id === r.value;
            }) || o[1], n = document.getElementById("histCompareGrid");
            if (n && e && t) {
                var i = Ai(e, "name"), s = Ai(t, "name"), l = "", c = "";
                e.id === t.id ? (l = zi("histCompareSame"), c = zi("histCompareSameDesc")) : "abbasid" === e.id && "tang" === t.id || "tang" === e.id && "abbasid" === t.id ? (l = zi("histRelTradeDiplomacy"), 
                c = zi("histRelTradeDiplomacyDesc")) : "abbasid" === e.id && "byzantine" === t.id || "byzantine" === e.id && "abbasid" === t.id ? (l = zi("histRelGeopoliticalClash"), 
                c = zi("histRelGeopoliticalClashDesc")) : "maya" === e.id || "maya" === t.id ? (l = zi("histRelDistantCoexistence"), 
                c = zi("histRelDistantCoexistenceDesc")) : (l = zi("histRelIndirectTrade"), c = zi("histRelIndirectTradeDesc"));
                var d = [ {
                    title: zi("histCompareTrajectory"),
                    valA: Ai(e, "vitality"),
                    valB: Ai(t, "vitality")
                }, {
                    title: zi("capitalsToggle"),
                    valA: Ai(e, "capital"),
                    valB: Ai(t, "capital")
                }, {
                    title: zi("histGovernmentTitle"),
                    valA: Ai(e, "system"),
                    valB: Ai(t, "system")
                }, {
                    title: zi("religionsListBtn"),
                    valA: Ai(e, "religion"),
                    valB: Ai(t, "religion")
                }, {
                    title: zi("histMilitaryTitle"),
                    valA: Ai(e, "military"),
                    valB: Ai(t, "military")
                } ], u = "";
                d.forEach(function(e) {
                    u += '<div class="hist-compare-row"><div class="hist-compare-row-title">' + Ti(e.title) + '</div><div class="hist-compare-row-values"><div class="hist-compare-val val-a"><strong>' + Ti(i) + ":</strong> " + Ti(e.valA) + '</div><div class="hist-compare-val val-b"><strong>' + Ti(s) + ":</strong> " + Ti(e.valB) + "</div></div></div>";
                }), u += '<div class="hist-compare-relation-box"><div class="hist-compare-relation-title"><i data-lucide="git-merge" class="lucide-icon"></i> ' + Ti(zi("histCompareRelation") || "طبيعة العلاقة بين الكيانين") + ": " + Ti(l) + '</div><div class="hist-compare-relation-desc">' + Ti(c) + "</div></div>", 
                n.innerHTML = u, window.lucide && "function" == typeof lucide.createIcons && lucide.createIcons();
            }
        }
    }
    window.openContemporaryPolityCompare = Bc;
    var Sc = document.getElementById("histCompareModalClose");
    Sc && Sc.addEventListener("click", function() {
        var e = document.getElementById("histPolityCompareModal");
        e && (e.setAttribute("hidden", ""), e.style.display = "none", e.classList.remove("visible"));
        var t = document.getElementById("histComparePolitiesBtn");
        t && "function" == typeof t.focus && t.focus();
    });
    var Ic = document.getElementById("histComparePolitiesBtn");
    function zc() {
        return Ln ? Promise.resolve(Ln) : fetch(e + "historical-capitals-data.json").then(function(e) {
            if (!e.ok) throw new Error("HTTP " + e.status + " loading capitals");
            return e.json();
        }).then(function(e) {
            return Ln = e && e.capitals ? e.capitals : Array.isArray(e) ? e : [], Ln;
        }).catch(function(e) {
            return console.warn("Failed to load historical capitals:", e), Ln = [], Ln;
        });
    }
    function Ac() {
        return Bn ? Promise.resolve(Bn) : fetch(e + "historical-battles-data.json").then(function(e) {
            if (!e.ok) throw new Error("HTTP " + e.status + " loading battles");
            return e.json();
        }).then(function(e) {
            return Bn = e && e.battles ? e.battles : Array.isArray(e) ? e : [], window.historicalBattlesData = Bn, 
            Bn;
        }).catch(function(e) {
            return console.warn("Failed to load historical battles:", e), Bn = [], window.historicalBattlesData = Bn, 
            Bn;
        });
    }
    function Mc() {
        return Sn ? Promise.resolve(Sn) : fetch(e + "historical-wonders-data.json").then(function(e) {
            if (!e.ok) throw new Error("HTTP " + e.status + " loading wonders");
            return e.json();
        }).then(function(e) {
            return Sn = e && e.wonders ? e.wonders : Array.isArray(e) ? e : [], Sn;
        }).catch(function(e) {
            return console.warn("Failed to load historical wonders:", e), Sn = [], Sn;
        });
    }
    function Tc() {
        return In ? Promise.resolve(In) : fetch(e + "historical-sacred-sites-data.json").then(function(e) {
            if (!e.ok) throw new Error("HTTP " + e.status + " loading sacred sites");
            return e.json();
        }).then(function(e) {
            return In = e && (e.sites || e.sacred_sites) ? e.sites || e.sacred_sites : Array.isArray(e) ? e : [], 
            window.historicalSacredSitesData = In, In;
        }).catch(function(e) {
            return console.warn("Failed to load sacred sites:", e), In = [], window.historicalSacredSitesData = In, 
            In;
        });
    }
    function Pc(e) {
        if (e) {
            var n = document.getElementById("panelContent"), i = document.getElementById("countryPanel");
            if (n && i) {
                cl(), Mr(), vn = null, En = e, _n = "histSacredSite";
                var a = _o(Ai(e, "name")), r = Ai(e, "location"), o = Ai(e, "current_status"), s = Ai(e, "summary"), l = e.timeline || [], c = e.significance || {}, d = e.icon || "🕊️", u = '<div class="hist-profile-card"><div class="hist-profile-header" style="border-inline-start: 4px solid #f59e0b; padding-inline-start: 10px;"><h3 class="hist-profile-title"><span style="color:#f59e0b;">' + d + "</span> " + Ti(a) + '</h3><p class="hist-profile-subtitle"><strong>' + Ti(zi("histSacredSitesToggle") || "مقدسات ونزاعات تاريخية") + "</strong>" + (r ? " &nbsp;·&nbsp; 📍 " + Ti(r) : "") + "</p></div>";
                s && (u += '<div class="hist-narrative-box origin-box" style="border-inline-start-color: #f59e0b; background: rgba(245, 158, 11, 0.08); border-color: rgba(245, 158, 11, 0.22);"><div class="hist-narrative-title" style="color: #d97706;">' + d + " " + Ti(zi("histRelSummary") || "الجوهر والملخص") + '</div><p class="hist-narrative-text">' + Ti(s) + "</p></div>");
                var p = e.religions_involved || Object.keys(c).map(function(e) {
                    return e.replace(/_ar|_en|_ru|_uz|_es/, "");
                }).filter(function(e, t, n) {
                    return n.indexOf(e) === t;
                }), m = {
                    islam: "#10b981",
                    christianity: "#3b82f6",
                    judaism: "#6366f1",
                    hinduism: "#f97316",
                    buddhism: "#eab308",
                    jainism: "#14b8a6",
                    sikhism: "#f59e0b",
                    bon: "#8b5cf6",
                    shinto: "#ec4899",
                    zoroastrianism: "#e0a020"
                }, f = {
                    ar: {
                        islam: "الإسلام",
                        christianity: "المسيحية",
                        judaism: "اليهودية",
                        hinduism: "الهندوسية",
                        buddhism: "البوذية",
                        jainism: "الجاينية",
                        sikhism: "السيخية",
                        bon: "البون التبتية",
                        shinto: "الشنتو",
                        zoroastrianism: "الزرادشتية"
                    },
                    en: {
                        islam: "Islam",
                        christianity: "Christianity",
                        judaism: "Judaism",
                        hinduism: "Hinduism",
                        buddhism: "Buddhism",
                        jainism: "Jainism",
                        sikhism: "Sikhism",
                        bon: "Tibetan Bön",
                        shinto: "Shinto",
                        zoroastrianism: "Zoroastrianism"
                    },
                    ru: {
                        islam: "Ислам",
                        christianity: "Христианство",
                        judaism: "Иудаизм",
                        hinduism: "Индуизм",
                        buddhism: "Буддизм",
                        jainism: "Джайнизм",
                        sikhism: "Сикхизм",
                        bon: "Тибетский бон",
                        shinto: "Синтоизм",
                        zoroastrianism: "Зороастризм"
                    },
                    uz: {
                        islam: "Islom",
                        christianity: "Xristianlik",
                        judaism: "Yahudiylik",
                        hinduism: "Hinduiylik",
                        buddhism: "Buddaviylik",
                        jainism: "Jaynizm",
                        sikhism: "Sikxizm",
                        bon: "Tibet bon",
                        shinto: "Sintoizm",
                        zoroastrianism: "Zardushtiylik"
                    },
                    es: {
                        islam: "Islam",
                        christianity: "Cristianismo",
                        judaism: "Judaísmo",
                        hinduism: "Hinduismo",
                        buddhism: "Budismo",
                        jainism: "Jainismo",
                        sikhism: "Sijismo",
                        bon: "Bön tibetano",
                        shinto: "Sintoísmo",
                        zoroastrianism: "Zoroastrismo"
                    }
                }, h = f[Ht] || f.en;
                p.length && (u += '<div style="margin-top: 8px;"><div class="hist-profile-item-label" style="font-size: 0.78rem; color: #f59e0b; margin-bottom: 6px;">🕊️ ' + Ti(zi("histSacredParties") || "الأديان والمعتقدات المرتبطة") + '</div><div class="hist-sacred-faiths-grid">', 
                p.forEach(function(e) {
                    var t = h[e] || f.en && f.en[e] || e, n = m[e] || "#14b8a6", i = c[e + "_" + Ht] || c[e + "_en"] || c[e + "_ar"] || ("string" == typeof c[e] ? c[e] : c[e] && (c[e][Ht] || c[e].en || c[e].ar)) || "";
                    u += '<div class="hist-profile-item" style="border-inline-start: 3px solid ' + n + '; padding: 8px 10px; background: rgba(0,0,0,0.18); border-radius: 8px;"><div class="hist-profile-item-label" style="color: ' + n + '; font-weight: 700; margin-bottom: 4px; font-size: 0.8rem;">' + Ti(t) + "</div>" + (i ? '<div class="hist-profile-item-val" style="font-size: 0.78rem; line-height: 1.45; color: var(--text);">' + Ti(i) + "</div>" : "") + "</div>";
                }), u += "</div></div>"), l.length && (u += '<div style="margin-top: 10px;"><div class="hist-profile-item-label" style="font-size: 0.78rem; color: #0d9488; margin-bottom: 6px;">⏳ ' + Ti(zi("histSacredTimeline") || "التسلسل الزمني للتحولات والنزاعات") + '</div><div class="hist-sacred-timeline-grid">', 
                l.forEach(function(e) {
                    var t = Ai(e, "era"), n = e.year_label || "", i = Ai(e, "desc") || Ai(e, "event");
                    u += '<div style="background: rgba(0,0,0,0.14); border: 1px solid var(--border, rgba(255,255,255,0.08)); border-radius: 8px; padding: 7px 10px;"><div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;"><span style="font-weight: 700; font-size: 0.76rem; color: #14b8a6;">' + Ti(t) + "</span>" + (n ? '<span style="font-size: 0.7rem; color: var(--text-muted, #94a3b8); font-weight: 600;">' + Ti(n) + "</span>" : "") + '</div><div style="font-size: 0.77rem; color: var(--text, #e2e8f0); line-height: 1.42;">' + Ti(i) + "</div></div>";
                }), u += "</div></div>"), o && (u += '<div class="hist-narrative-box" style="border-inline-start-color: #3b82f6; background: rgba(59, 130, 246, 0.08); border-color: rgba(59, 130, 246, 0.22); margin-top: 10px;"><div class="hist-narrative-title" style="color: #60a5fa;">⚖️ ' + Ti(zi("histSacredCurrentStatus") || "الوضع الراهن وإدارته اليوم") + '</div><p class="hist-narrative-text" style="font-size: 0.79rem; line-height: 1.45;">' + Ti(o) + "</p></div>"), 
                e.coords && 2 === e.coords.length && (u += '<div class="history-actions" style="margin-top: 12px; margin-bottom: 6px;"><button type="button" class="btn history-action-btn" id="sacredSiteCenterBtn" style="width: 100%; justify-content: center; background: #f59e0b; color: #ffffff; border: none; padding: 9px 14px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 0.85rem;">📍 ' + Ti(zi("centerOnMap") || ("ar" === Ht ? "التركيز على الموقع في الخريطة" : "Center on Map")) + "</button></div>"), 
                u += "</div>", wn = performance.now(), n.innerHTML = u, i.style.display = "block", 
                requestAnimationFrame(function() {
                    requestAnimationFrame(function() {
                        i.classList.add("visible");
                    });
                });
                var y = n.querySelector("#sacredSiteCenterBtn");
                y && e.coords && (y.onclick = function() {
                    var t = e.coords;
                    "function" == typeof zoomToCoords ? zoomToCoords(t[0], t[1], 4) : "function" == typeof panToLocation && panToLocation(t[0], t[1], 4);
                }), t();
            }
        }
    }
    function qc(e) {
        En = e, _n = "histCapital";
        var t = Ai(e, "name"), n = Ai(e, "ancient_name"), i = "<h3>🏛️ " + Ti(t) + (n && n !== t ? " (" + Ti(n) + ")" : "") + "</h3>";
        e.modern_location && (i += "<p><strong>" + zi("country") + ":</strong> " + Ti(Ai(e, "modern_location")) + "</p>");
        var a = Ai(e, "founder");
        e.founded && (i += "<p><strong>" + Ti(zi("histFoundedLabel")) + ":</strong> " + Ti(e.founded) + (a ? " — " + Ti(a) : "") + "</p>");
        var r = e["empires_" + Wt()] || e.empires_en || e.empires_ar || e.empires;
        if (Array.isArray(r) && r.length) {
            var o = r.map(function(e) {
                return "object" == typeof e ? Ai(e, "name") : e;
            }).join("، ");
            i += "<p><strong>" + Ti(zi("histEmpiresStatesLabel")) + ":</strong> " + Ti(o) + "</p>";
        }
        var s = Ai(e, "significance");
        s && (i += "<p>" + Ti(s) + "</p>"), wn = performance.now(), P.innerHTML = i, T.style.display = "block", 
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                T.classList.add("visible");
            });
        });
    }
    function Oc(e) {
        En = e, _n = "histBattle";
        var t = Ai(e, "name"), n = Ai(e, "date_str") || e.year, i = "<h3>⚔️ " + Ti(t) + (n ? " (" + Ti(n) + ")" : "") + "</h3>", a = Ai(e, "belligerents");
        a && (i += "<p><strong>" + Ti(zi("histBelligerentsLabel")) + ":</strong> " + Ti(a) + "</p>");
        var r = Ai(e, "outcome");
        r && (i += "<p><strong>" + Ti(zi("histOutcomeLabel")) + ":</strong> " + Ti(r) + "</p>");
        var o = Ai(e, "significance");
        o && (i += "<p><strong>" + Ti(zi("histStrategicImpactLabel")) + ":</strong> " + Ti(o) + "</p>"), 
        wn = performance.now(), P.innerHTML = i, T.style.display = "block", requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                T.classList.add("visible");
            });
        });
    }
    function Rc(e) {
        En = e, _n = "histWonder";
        var t = "<h3>🏺 " + Ti(Ai(e, "name")) + "</h3>", n = Ai(e, "category");
        n && (t += "<p><strong>" + Ti(zi("histCategoryLabel")) + ":</strong> " + Ti(n) + "</p>");
        var i = Ai(e, "builder"), a = Ai(e, "date_built") || Ai(e, "built") || e.date_built || e.built;
        a && (t += "<p><strong>" + Ti(zi("histDateBuiltLabel")) + ":</strong> " + Ti(a) + (i ? " — " + Ti(i) : "") + "</p>");
        var r = Ai(e, "status");
        r ? t += "<p><strong>" + Ti(zi("histStatusLabel")) + ":</strong> " + Ti(r) + "</p>" : void 0 !== e.extant && (t += "<p><strong>" + Ti(zi("histStatusLabel")) + ":</strong> " + (e.extant ? Ti(zi("histWonderExtant")) : Ti(zi("histWonderRuins"))) + "</p>");
        var o = Ai(e, "purpose");
        o && (t += "<p><strong>" + Ti(zi("histPurposeLabel")) + ":</strong> " + Ti(o) + "</p>");
        var s = Ai(e, "disputes");
        s && (t += "<p><strong>" + Ti(zi("histNotesLabel")) + ":</strong> " + Ti(s) + "</p>");
        var l = Ai(e, "significance");
        l && (t += "<p>" + Ti(l) + "</p>"), wn = performance.now(), P.innerHTML = t, T.style.display = "block", 
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                T.classList.add("visible");
            });
        });
    }
    function Nc() {
        if (cn && (cn.selectAll("*").remove(), qn && (void 0 === Ke || "geo" !== Ke) && (void 0 === Pe || Pe))) if (Ln) {
            var e = ao(), t = window.innerWidth <= 768, n = li && li.k || 1;
            Ln.forEach(function(i) {
                var a = i.coords || [ i.lon, i.lat ];
                if (a) {
                    var r = e(a);
                    if (r && !isNaN(r[0])) {
                        var o = _o(Ai(i, "name")), s = cn.append("g").attr("class", "hist-capital-pin hist-landmark-pin").attr("role", "button").attr("tabindex", "0").attr("aria-label", (zi("histCapitalPinLabel") || "عاصمة تاريخية") + ": " + o).style("cursor", "pointer").on("click", function(e) {
                            e && e.stopPropagation && e.stopPropagation(), qc(i);
                        }).on("keydown", function(e) {
                            "Enter" !== e.key && " " !== e.key || (e.preventDefault && e.preventDefault(), qc(i));
                        }), l = t ? 11.5 : 13.5, c = t ? 13.5 : 15.5, d = Math.max(l, Math.min(c, l * Math.pow(n, .15))), u = d / n, p = ((t ? 5.5 : 6.5) + .7 * d) / n;
                        s.append("circle").attr("class", "hist-capital-circle").attr("cx", r[0]).attr("cy", r[1]).attr("r", (t ? 4.5 : 5.5) / n).attr("fill", "#a855f7").attr("stroke", "#fff").attr("stroke-width", 1.4 / n).attr("vector-effect", "non-scaling-stroke"), 
                        s.append("text").attr("class", "hist-capital-label").attr("data-cy", r[1]).attr("x", r[0]).attr("y", r[1] - p).text(o).attr("fill", "#e9d5ff").attr("font-size", u + "px").attr("font-weight", "600").attr("text-anchor", "middle").attr("style", "text-shadow: 0 1px 3px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.85); pointer-events: none;");
                    }
                }
            });
        } else zc().then(function() {
            Nc();
        });
    }
    function Dc() {
        if (dn && (dn.selectAll("*").remove(), On && (void 0 === Ke || "geo" !== Ke) && (void 0 === Pe || Pe))) if (Bn) {
            var e = ao(), t = window.innerWidth <= 768, n = li && li.k || 1;
            Bn.forEach(function(i) {
                var a = i.coords || [ i.lon, i.lat ];
                if (a) {
                    var r = e(a);
                    if (r && !isNaN(r[0])) {
                        var o = _o(Ai(i, "name")), s = dn.append("g").attr("class", "hist-battle-pin hist-landmark-pin").attr("role", "button").attr("tabindex", "0").attr("aria-label", (zi("histBattlePinLabel") || "معركة فاصلة") + ": " + o).style("cursor", "pointer").on("click", function(e) {
                            e && e.stopPropagation && e.stopPropagation(), Oc(i);
                        }).on("keydown", function(e) {
                            "Enter" !== e.key && " " !== e.key || (e.preventDefault && e.preventDefault(), Oc(i));
                        }), l = t ? 11.5 : 13.5, c = t ? 13.5 : 15.5, d = Math.max(l, Math.min(c, l * Math.pow(n, .15))), u = d / n, p = ((t ? 6 : 7) + .7 * d) / n;
                        s.append("circle").attr("class", "hist-battle-circle").attr("cx", r[0]).attr("cy", r[1]).attr("r", (t ? 5 : 6) / n).attr("fill", "#ef4444").attr("stroke", "#fff").attr("stroke-width", 1.4 / n).attr("vector-effect", "non-scaling-stroke"), 
                        s.append("text").attr("class", "hist-battle-icon").attr("data-cy", r[1]).attr("x", r[0]).attr("y", r[1] + 3.5 / n).text("⚔").attr("fill", "#fff").attr("font-size", (t ? 7.5 : 9) / n + "px").attr("text-anchor", "middle").style("pointer-events", "none"), 
                        s.append("text").attr("class", "hist-battle-label").attr("data-cy", r[1]).attr("x", r[0]).attr("y", r[1] - p).text(o).attr("fill", "#fca5a5").attr("font-size", u + "px").attr("font-weight", "600").attr("text-anchor", "middle").attr("style", "text-shadow: 0 1px 3px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.85); pointer-events: none;");
                    }
                }
            });
        } else Ac().then(function() {
            Dc();
        });
    }
    function Fc() {
        if (un && (un.selectAll("*").remove(), Rn && (void 0 === Ke || "geo" !== Ke) && (void 0 === Pe || Pe))) if (Sn) {
            var e = ao(), t = window.innerWidth <= 768, n = li && li.k || 1;
            Sn.forEach(function(i) {
                var a = i.coords || [ i.lon, i.lat ];
                if (a) {
                    var r = e(a);
                    if (r && !isNaN(r[0])) {
                        var o = _o(Ai(i, "name")), s = un.append("g").attr("class", "hist-wonder-pin hist-landmark-pin").attr("role", "button").attr("tabindex", "0").attr("aria-label", (zi("histWonderPinLabel") || "معلم تاريخي") + ": " + o).style("cursor", "pointer").on("click", function(e) {
                            e && e.stopPropagation && e.stopPropagation(), Rc(i);
                        }).on("keydown", function(e) {
                            "Enter" !== e.key && " " !== e.key || (e.preventDefault && e.preventDefault(), Rc(i));
                        }), l = t ? 11.5 : 13.5, c = t ? 13.5 : 15.5, d = Math.max(l, Math.min(c, l * Math.pow(n, .15))), u = d / n, p = ((t ? 6 : 7) + .7 * d) / n;
                        s.append("circle").attr("class", "hist-wonder-circle").attr("cx", r[0]).attr("cy", r[1]).attr("r", (t ? 5 : 6) / n).attr("fill", "#eab308").attr("stroke", "#fff").attr("stroke-width", 1.4 / n).attr("vector-effect", "non-scaling-stroke"), 
                        s.append("text").attr("class", "hist-wonder-icon").attr("data-cy", r[1]).attr("x", r[0]).attr("y", r[1] + 3.5 / n).text("★").attr("fill", "#fff").attr("font-size", (t ? 7.5 : 9) / n + "px").attr("text-anchor", "middle").style("pointer-events", "none"), 
                        s.append("text").attr("class", "hist-wonder-label").attr("data-cy", r[1]).attr("x", r[0]).attr("y", r[1] - p).text(o).attr("fill", "#fde047").attr("font-size", u + "px").attr("font-weight", "600").attr("text-anchor", "middle").attr("style", "text-shadow: 0 1px 3px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.85); pointer-events: none;");
                    }
                }
            });
        } else Mc().then(function() {
            Fc();
        });
    }
    function Hc() {
        if (pn && (pn.selectAll("*").remove(), Nn && (void 0 === Ke || "geo" !== Ke) && (void 0 === Pe || Pe))) if (In) {
            var e = ao(), t = window.innerWidth <= 768, n = li && li.k || 1;
            In.forEach(function(i) {
                var a = i.coords || [ i.lon, i.lat ];
                if (a) {
                    var r = e(a);
                    if (r && !isNaN(r[0])) {
                        var o = _o(Ai(i, "name"));
                        "jerusalem-holy-esplanade" === i.id ? o = "ar" === Ht ? "القدس الشريف" : "ru" === Ht ? "Иерусалим" : "uz" === Ht ? "Quddus" : "es" === Ht ? "Jerusalén" : "Jerusalem" : "cave-of-the-patriarchs" === i.id && (o = "ar" === Ht ? "الحرم الإبراهيمي" : "ru" === Ht ? "Мечеть Ибрахима" : "uz" === Ht ? "Ibrohim masjidi" : "es" === Ht ? "Mezquita de Ibrahimi" : "Ibrahimi Mosque");
                        var s = "cave-of-the-patriarchs" === i.id, l = pn.append("g").attr("class", "hist-sacred-site-pin hist-landmark-pin").attr("data-site-id", i.id).attr("role", "button").attr("tabindex", "0").attr("aria-label", (zi("histSacredSiteTitle") || "مكان مقدس مشترك") + ": " + o).style("cursor", "pointer").on("click", function(e) {
                            e && e.stopPropagation && e.stopPropagation(), Pc(i);
                        }).on("keydown", function(e) {
                            "Enter" !== e.key && " " !== e.key || (e.preventDefault && e.preventDefault(), Pc(i));
                        }), c = t ? 11.5 : 13.5, d = t ? 13.5 : 15.5, u = Math.max(c, Math.min(d, c * Math.pow(n, .15))), p = (t ? 5 : 6) / n, m = (t ? 7.5 : 9) / n, f = u / n, h = (t ? 8 : 9.5) / n, y = ((t ? 6.5 : 7.5) + .7 * u) / n, g = 3 / n, v = 1.4 / n, b = s ? r[1] + y + .75 * f : r[1] - y;
                        l.append("circle").attr("class", "hist-sacred-site-ring").attr("cx", r[0]).attr("cy", r[1]).attr("r", m).attr("fill", "rgba(245, 158, 11, 0.22)").attr("stroke", "#f59e0b").attr("stroke-width", .8 / n).attr("stroke-dasharray", 2 / n + "," + 2 / n), 
                        l.append("circle").attr("class", "hist-sacred-site-circle").attr("cx", r[0]).attr("cy", r[1]).attr("r", p).attr("fill", "#d97706").attr("stroke", "#ffffff").attr("stroke-width", v).attr("vector-effect", "non-scaling-stroke"), 
                        l.append("text").attr("class", "hist-sacred-site-icon").attr("data-cy", r[1]).attr("x", r[0]).attr("y", r[1] + g).text("✦").attr("fill", "#ffffff").attr("font-size", h + "px").attr("text-anchor", "middle").style("pointer-events", "none"), 
                        l.append("text").attr("class", "hist-sacred-site-label").attr("data-cy", r[1]).attr("data-dir", s ? "below" : "above").attr("x", r[0]).attr("y", b).text(o).attr("fill", "#fef3c7").attr("font-size", f + "px").attr("font-weight", "700").attr("text-anchor", "middle").attr("style", "text-shadow: 0 1px 3px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.85); pointer-events: none;");
                    }
                }
            });
        } else Tc().then(function() {
            Hc();
        });
    }
    function jc() {
        return zn ? Promise.resolve(zn) : (An || (An = fetch(e + "historical-terrain-data.json").then(function(e) {
            if (!e.ok) throw new Error("HTTP " + e.status);
            return e.json();
        }).then(function(e) {
            return zn = e, window.histTerrainData = e, e;
        }).catch(function(e) {
            throw An = null, e;
        })), An);
    }
    function Wc(e) {
        if (null == e) return "";
        var t = Math.abs(e), n = void 0 !== Ht ? Ht : window.currentLang || ("undefined" != typeof currentLanguage ? currentLanguage : "ar");
        return "ar" === n ? e < 0 ? t + " ق.م" : 0 === e ? "1 ق.م" : e + " م" : "ru" === n ? e < 0 ? t + " до н.э." : 0 === e ? "1 до н.э." : e + " н.э." : "uz" === n ? e < 0 ? t + " m.a." : 0 === e ? "1 m.a." : e + " m." : "es" === n ? e < 0 ? t + " a.C." : 0 === e ? "1 a.C." : e + " d.C." : e < 0 ? t + " BCE" : 0 === e ? "1 BCE" : e + " CE";
    }
    function Uc() {
        var e = document.getElementById("histTerrainTimeline");
        if (e && !e._initialized) {
            function t(t) {
                var n = e.getBoundingClientRect();
                if (n.width) {
                    var i = Math.max(0, Math.min(1, (t - n.left) / n.width)), a = Math.round(i * ($n.length - 1));
                    Kc($n[a]);
                }
            }
            e._initialized = !0, e.innerHTML = '<div class="hist-terrain-timeline-thumb" id="histTerrainThumb"></div>', 
            $n.forEach(function(t, n) {
                var i = n / ($n.length - 1) * 100, a = document.createElement("div");
                a.className = "hist-terrain-tl-dot" + (t === jn ? " active" : ""), a.style.left = i + "%", 
                a.setAttribute("data-year", t), a.setAttribute("title", Wc(t)), a.addEventListener("pointerdown", function(e) {
                    e.stopPropagation();
                }), a.addEventListener("click", function(e) {
                    e.stopPropagation(), Kc(t);
                }), e.appendChild(a);
            });
            var n = !1;
            e.addEventListener("pointerdown", function(e) {
                n = !0, t(e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX), e.preventDefault();
            }), document.addEventListener("pointermove", function(e) {
                n && t(e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX);
            }), document.addEventListener("pointerup", function() {
                n = !1;
            }), e.addEventListener("keydown", function(e) {
                var t = $n.indexOf(jn);
                if (-1 === t && (t = 0), "ArrowRight" === e.key || "ArrowUp" === e.key) {
                    e.preventDefault();
                    var n = Math.min($n.length - 1, t + 1);
                    Kc($n[n]);
                } else if ("ArrowLeft" === e.key || "ArrowDown" === e.key) {
                    e.preventDefault();
                    var i = Math.max(0, t - 1);
                    Kc($n[i]);
                }
            });
            var i = document.getElementById("histTerrainPlayBtn");
            i && i.addEventListener("click", function() {
                Wn ? $c() : function() {
                    Wn = !0;
                    var e = document.getElementById("histTerrainPlayBtn");
                    if (e) {
                        e.setAttribute("aria-pressed", "true");
                        var t = e.querySelector(".lucide-icon, i");
                        t && (t.setAttribute("data-lucide", "pause"), "undefined" != typeof lucide && lucide.createIcons && lucide.createIcons());
                    }
                    Un && clearInterval(Un);
                    Un = setInterval(function() {
                        var e = $n.indexOf(jn);
                        -1 === e && (e = 0);
                        var t = (e + 1) % $n.length;
                        Kc($n[t]);
                    }, 1700);
                }();
            });
        }
    }
    function $c() {
        Wn = !1, Un && (clearInterval(Un), Un = null);
        var e = document.getElementById("histTerrainPlayBtn");
        if (e) {
            e.setAttribute("aria-pressed", "false");
            var t = e.querySelector(".lucide-icon, i");
            t && (t.setAttribute("data-lucide", "play"), "undefined" != typeof lucide && lucide.createIcons && lucide.createIcons());
        }
    }
    function Kc(e) {
        jn = e;
        var t = $n.indexOf(e);
        -1 === t && (t = 0);
        var n = t / ($n.length - 1) * 100, i = document.getElementById("histTerrainTimeline");
        i && (i.style.setProperty("--terrain-pct", n + "%"), i.querySelectorAll(".hist-terrain-tl-dot").forEach(function(e, n) {
            e.classList.toggle("active", n === t);
        }), i.setAttribute("aria-valuenow", e));
        var a = document.getElementById("histTerrainYearBadge");
        a && (a.textContent = Wc(e));
        var r = document.getElementById("histTimelineCaption");
        if (r && zn && zn.epochs) {
            var o = zn.epochs.find(function(t) {
                return t.year === e;
            });
            if (o) {
                var s = Ai(o, "summary") || Ai(o, "title");
                r.textContent = s;
            }
        }
        Gc(e);
    }
    function Gc(e, t) {
        if (mn && (mn.selectAll("*").remove(), Hn && zn)) {
            var n = ao();
            if (n) {
                var i = Math.max(.4, li.k), a = xi;
                (zn.rivers || []).forEach(function(t) {
                    for (var n = Object.keys(t.courses_by_epoch).map(Number).sort(function(e, t) {
                        return e - t;
                    }), i = n[0], r = 0; r < n.length; r++) n[r] <= e && (i = n[r]);
                    (t.courses_by_epoch[i] || t.courses_by_epoch[n[0]] || []).forEach(function(n, i) {
                        var r = n.coords;
                        if (r && !(r.length < 2)) {
                            var o = n.weight || 2, s = mn.append("g").attr("class", "hist-river-group").attr("data-river-id", t.id).attr("data-branch-index", i).style("cursor", "pointer").on("click", function(n) {
                                n && n.stopPropagation && n.stopPropagation(), Yc(t, e);
                            });
                            s.append("path").datum({
                                type: "LineString",
                                coordinates: r
                            }).attr("d", Gn).attr("fill", "none").attr("class", "hist-river-halo").attr("stroke", "rgba(56, 189, 248, 0.35)").attr("stroke-width", o * (a ? 2.8 : 4.5)).attr("stroke-linecap", "round").attr("stroke-linejoin", "round").attr("vector-effect", "non-scaling-stroke");
                            var l = 3 === o ? "#0284c7" : 2 === o ? "#0ea5e9" : "#38bdf8";
                            s.append("path").datum({
                                type: "LineString",
                                coordinates: r
                            }).attr("d", Gn).attr("fill", "none").attr("class", "hist-river-main").attr("stroke", l).attr("stroke-width", o * (a ? 1.3 : 2.2)).attr("stroke-linecap", "round").attr("stroke-linejoin", "round").attr("vector-effect", "non-scaling-stroke");
                        }
                    });
                }), (zn.mountains_and_passes || []).forEach(function(t) {
                    var r = t.coords;
                    if (r) {
                        var o = n(r);
                        if (o && !isNaN(o[0])) {
                            var s = (a ? 4 : 5) / i, l = (a ? 7 : 8.5) / i, c = Math.max(9, Math.min(13, (a ? 10 : 12) / Math.pow(i, .8))), d = ((a ? 7 : 9) + .7 * c) / i, u = "pass" === t.type, p = mn.append("g").attr("class", "hist-mountain-pass-marker").attr("data-pass-id", t.id).attr("role", "button").attr("tabindex", "0").attr("aria-label", Ai(t, "name")).style("cursor", "pointer").on("click", function(n) {
                                n && n.stopPropagation && n.stopPropagation(), Yc(t, e);
                            }).on("keydown", function(n) {
                                "Enter" !== n.key && " " !== n.key || (n.preventDefault && n.preventDefault(), Yc(t, e));
                            });
                            p.append("circle").attr("class", "hist-pass-ring").attr("cx", o[0]).attr("cy", o[1]).attr("r", l).attr("fill", u ? "rgba(245, 158, 11, 0.22)" : "rgba(16, 185, 129, 0.22)").attr("stroke", u ? "#f59e0b" : "#10b981").attr("stroke-width", .8 / i).attr("stroke-dasharray", 2 / i + "," + 2 / i), 
                            p.append("circle").attr("class", "hist-pass-circle").attr("cx", o[0]).attr("cy", o[1]).attr("r", s).attr("fill", u ? "#d97706" : "#059669").attr("stroke", "#ffffff").attr("stroke-width", 1.2 / i).attr("vector-effect", "non-scaling-stroke"), 
                            p.append("text").attr("class", "hist-pass-label").attr("data-cy", o[1]).attr("x", o[0]).attr("y", o[1] - d).text(Ai(t, "name")).attr("fill", "#fef3c7").attr("font-size", c / i + "px").attr("font-weight", "700").attr("text-anchor", "middle").attr("style", "text-shadow: 0 1px 3px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.9); pointer-events: none;");
                        }
                    }
                });
            }
        }
    }
    function Yc(e, t) {
        if (e) {
            var n = document.getElementById("panelContent"), i = document.getElementById("countryPanel");
            if (n && i) {
                cl(), Mr(), vn = null, En = e, _n = "histTerrainFeature";
                var a = "river_system" === e.type || "river" === e.type, r = e.icon || (a ? "🌊" : "⛰️"), o = Ai(e, "name"), s = Ai(e, "category"), l = Ai(e, "region"), c = Ai(e, "strategic_importance"), d = e.names_by_era || [], u = e.historical_events || [], p = e.quotes || [], m = a ? zi("histTerrainRiverCategory") || "نهر تاريخي ومجرى مائي" : zi("histTerrainPassCategory") || "ممر جبلي استراتيجي", f = '<div class="hist-profile-card"><div class="hist-profile-header" style="border-inline-start: 4px solid ' + (a ? "#0284c7" : "#d97706") + '; padding-inline-start: 10px;"><h3 class="hist-profile-title"><span style="color:' + (a ? "#38bdf8" : "#f59e0b") + ';">' + r + "</span> " + Ti(o) + '</h3><p class="hist-profile-subtitle"><strong>' + Ti(s || m) + "</strong>" + (l ? " &nbsp;·&nbsp; 📍 " + Ti(l) : "") + (t ? " &nbsp;·&nbsp; ⏳ " + Ti(Wc(t)) : "") + "</p></div>";
                c && (f += '<div class="hist-narrative-box origin-box" style="border-inline-start-color: ' + (a ? "#0284c7" : "#d97706") + "; background: " + (a ? "rgba(2, 132, 199, 0.09)" : "rgba(245, 158, 11, 0.08)") + "; border-color: " + (a ? "rgba(2, 132, 199, 0.25)" : "rgba(245, 158, 11, 0.22)") + ';"><div class="hist-narrative-title" style="color: ' + (a ? "#0284c7" : "#d97706") + ';">🛡️ ' + Ti(zi("histTerrainBarrierSignificance") || "الأهمية العسكرية والاستراتيجية كحاجز طبيعي") + '</div><p class="hist-narrative-text" style="line-height:1.55;">' + Ti(c) + "</p></div>"), 
                d.length && (f += '<div style="margin-top: 10px;"><div class="hist-profile-item-label" style="font-size: 0.8rem; color: ' + (a ? "#0284c7" : "#f59e0b") + '; margin-bottom: 6px; font-weight:700;">📜 ' + Ti(zi("histTerrainAncientNames") || "الأسماء عبر العصور واللغات القديمة") + '</div><div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 8px;">', 
                d.forEach(function(e) {
                    var t = Ai(e, "era"), n = e.name || "", i = Ai(e, "meaning");
                    f += '<div style="background: rgba(0,0,0,0.18); border-inline-start: 3px solid ' + (a ? "#0ea5e9" : "#f59e0b") + '; border-radius: 8px; padding: 7px 10px;"><div style="font-size:0.75rem; color: var(--text-muted); font-weight:600;">' + Ti(t) + '</div><div style="font-size:0.86rem; font-weight:700; color: var(--text); margin: 2px 0;">' + Ti(n) + "</div>" + (i ? '<div style="font-size:0.76rem; color: var(--text-secondary);">' + Ti(i) + "</div>" : "") + "</div>";
                }), f += "</div></div>"), u.length && (f += '<div style="margin-top: 12px;"><div class="hist-profile-item-label" style="font-size: 0.8rem; color: #10b981; margin-bottom: 6px; font-weight:700;">⚔️ ' + Ti(zi("histTerrainDecisiveEvents") || "سجل المعارك والحوادث التاريخية الفاصلة") + '</div><div style="display:flex; flex-direction:column; gap: 7px;">', 
                u.forEach(function(e) {
                    var t = Ai(e, "title"), n = Ai(e, "desc"), i = e.year_label || (e.year ? Wc(e.year) : "");
                    f += '<div style="background: rgba(0,0,0,0.14); border: 1px solid var(--border, rgba(255,255,255,0.08)); border-radius: 8px; padding: 8px 10px;"><div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 3px;"><span style="font-weight:700; font-size:0.82rem; color: #10b981;">' + Ti(t) + "</span>" + (i ? '<span style="font-size:0.72rem; color: var(--text-muted); font-weight:700; background:rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 6px;">' + Ti(i) + "</span>" : "") + '</div><div style="font-size:0.78rem; color: var(--text); line-height: 1.46;">' + Ti(n) + "</div></div>";
                }), f += "</div></div>"), p.length && (f += '<div style="margin-top: 12px;"><div class="hist-profile-item-label" style="font-size: 0.8rem; color: #8b5cf6; margin-bottom: 6px; font-weight:700;">📖 ' + Ti(zi("histTerrainAncientQuotes") || "أقوال المؤرخين القدماء والمصادر") + '</div><div style="display:flex; flex-direction:column; gap: 6px;">', 
                p.forEach(function(e) {
                    var t = Ai(e, "author"), n = Ai(e, "text");
                    f += '<div style="font-style: italic; background: rgba(139, 92, 246, 0.08); border-inline-start: 3px solid #8b5cf6; border-radius: 6px; padding: 7px 10px;"><div style="font-size:0.79rem; color: var(--text); line-height: 1.45;">' + Ti(n) + "</div>" + (t ? '<div style="font-size:0.72rem; color: #a78bfa; font-weight:600; margin-top: 3px; text-align: end;">— ' + Ti(t) + "</div>" : "") + "</div>";
                }), f += "</div></div>"), f += "</div>", wn = performance.now(), n.innerHTML = f, 
                i.style.display = "block", requestAnimationFrame(function() {
                    requestAnimationFrame(function() {
                        i.classList.add("visible");
                    });
                });
            }
        }
    }
    function Vc(e) {
        if (void 0 !== Pe && Pe || void 0 !== Ke && "history" === Ke) {
            Hn = "boolean" == typeof e ? e : !Hn;
            var t = document.getElementById("histTerrainBtn");
            t && (t.classList.toggle("toggle-on", Hn), t.setAttribute("aria-pressed", Hn ? "true" : "false"));
            var n = document.getElementById("historyBottomBar"), i = document.getElementById("historyTerrainTimelineWrap"), a = document.getElementById("historyEraTimelineWrap"), r = document.getElementById("historyFaithsTimelineWrap"), o = document.getElementById("historyTravelersTimelineWrap");
            Hn ? (n && (n.style.display = "flex"), i && (i.style.display = "flex"), a && (a.style.display = "none"), 
            r && (r.style.display = "none"), o && (o.style.display = "none"), jc().then(function(e) {
                Uc(), Kc(jn);
            }).catch(function(e) {
                console.error("Failed to load historical terrain data:", e);
            })) : ($c(), i && (i.style.display = "none"), mn && mn.selectAll("*").remove(), 
            "function" == typeof updateHistSubmodeVis && updateHistSubmodeVis(void 0 !== Fe ? Fe : "eras"));
        }
    }
    Ic && Ic.addEventListener("click", function() {
        Bc();
    }), window.fetchHistoricalCapitals = zc, window.fetchHistoricalBattles = Ac, window.fetchHistoricalWonders = Mc, 
    window.fetchHistoricalSacredSites = Tc, window.showSacredSiteDetail = Pc, window.showHistoricalBattleDetail = Oc, 
    window.drawHistCapitals = Nc, window.drawHistBattles = Dc, window.drawHistWonders = Fc, 
    window.drawHistSacredSites = Hc, window.fetchHistTerrainData = jc, window.formatHistTerrainYear = Wc, 
    window.setHistTerrainYear = Kc, window.drawHistPhysicalFeatures = Gc, window.showHistoricalPhysicalFeatureDetail = Yc, 
    window.toggleHistTerrain = Vc, window.getHistTerrainActive = function() {
        return Hn;
    }, window.getHistTerrainYear = function() {
        return jn;
    }, d.addEventListener("click", function(e) {
        e.stopPropagation();
        var t = document.getElementById("langDropdownMenu");
        t && (t.classList.contains("visible") || p(), t.classList.toggle("visible"));
    }), window.addEventListener("resize", function() {
        u && u.classList.contains("visible") && p();
    }), document.getElementById("themeToggleBtn").addEventListener("click", function() {
        i("light" === document.documentElement.getAttribute("data-theme") ? "dark" : "light"), 
        ha(), _s();
    }), document.getElementById("measureToolBtn").addEventListener("click", Po), document.getElementById("presentationModeBtn").addEventListener("click", qo), 
    document.getElementById("presentationExitBtn").addEventListener("click", qo), Q.addEventListener("click", function(e) {
        if (st) {
            var t = ki(), n = e.clientX - t.left, i = e.clientY - t.top, a = li.invert([ n, i ]), r = ao().invert(a);
            !r || isNaN(r[0]) || isNaN(r[1]) || (lt.length >= 2 && To(), lt.push(r), Wo());
        }
    }, !0), document.querySelectorAll(".lang-option").forEach(function(e) {
        e.addEventListener("click", function(e) {
            e.stopPropagation();
            var t = this.dataset.lang;
            t !== Ht && fo(t), document.querySelectorAll(".lang-dropdown-menu.visible").forEach(function(e) {
                e.classList.remove("visible");
            });
        });
    }), document.addEventListener("click", function() {
        document.querySelectorAll(".lang-dropdown-menu.visible").forEach(function(e) {
            e.classList.remove("visible");
        });
    }), document.addEventListener("DOMContentLoaded", function() {
        const e = document.getElementById("toolsBtn"), t = document.getElementById("toolsDropdownMenu");
        e && t ? e.dataset.menuBound || (e.dataset.menuBound = "1", e.addEventListener("click", function(n) {
            n.stopPropagation(), t.classList.contains("visible") ? (t.classList.remove("visible"), 
            t.setAttribute("hidden", ""), e.setAttribute("aria-expanded", "false")) : (t.classList.add("visible"), 
            t.removeAttribute("hidden"), e.setAttribute("aria-expanded", "true"));
        }), t.addEventListener("click", e => {
            e.stopPropagation();
        }), document.addEventListener("click", () => {
            t.classList.remove("visible"), t.setAttribute("hidden", ""), e.setAttribute("aria-expanded", "false");
        })) : console.error("Tools elements not found:", {
            toolsBtn: e,
            toolsMenu: t
        });
    }), (h = document.querySelectorAll(".religion-btn")).forEach(function(e) {
        e.addEventListener("click", function() {
            ie = e.dataset.religion, m(h, '.religion-btn[data-religion="' + e.dataset.religion + '"]'), 
            $r();
        });
    }), S.addEventListener("click", () => {
        Yn.transition().duration(n() ? 0 : 300).ease(d3.easeCubicOut).call(si.scaleBy, 1.35);
    }), I.addEventListener("click", () => {
        Yn.transition().duration(n() ? 0 : 300).ease(d3.easeCubicOut).call(si.scaleBy, .74);
    }), z.addEventListener("click", vo), L.addEventListener("click", zs), B.addEventListener("click", Ms), 
    document.getElementById("pdfExportBtn").addEventListener("click", js);
    var Qc = document.getElementById("mobileLangToggle"), Xc = document.getElementById("mobileSearchInput"), Jc = document.getElementById("mobileShareBtn"), Zc = document.getElementById("mobileModeBtn"), ed = document.getElementById("mobileLayersBtn"), td = document.getElementById("mobileResetBtn2"), nd = document.getElementById("mobileToolsBtn"), id = document.getElementById("mobileToolsMenu"), ad = document.getElementById("mobileOnboardBtn"), rd = document.getElementById("mobileShortcutsBtn"), od = document.getElementById("mobilePdfBtn"), sd = document.getElementById("mobileCoordsBtn"), ld = document.getElementById("mobileModeSheet"), cd = document.getElementById("mobileModeSheetBackdrop"), dd = document.getElementById("mobileModeSheetClose"), ud = document.querySelectorAll("#mobileModeButtons .mode-btn"), pd = document.querySelectorAll("#mobileFilterButtons .religion-btn");
    function md() {
        id && id.classList.remove("open");
    }
    Qc && Qc.addEventListener("click", function(e) {
        e.stopPropagation(), document.querySelectorAll(".lang-dropdown-menu.visible").forEach(function(e) {
            e.classList.remove("visible");
        });
        var t = document.getElementById("mobileLangDropdownMenu");
        t && t.classList.toggle("visible");
    }), Xc && Xc.addEventListener("input", function() {
        var e = this.value.trim(), t = document.getElementById("mobileSuggestionsList");
        if (t) if (t.innerHTML = "", e) {
            var n = [];
            if (void 0 !== Ke && "history" === Ke || void 0 !== Pe && Pe) {
                var i = "undefined" != typeof window && (window.HISTORICAL_POLITIES_DATA || window.historicalPolitiesData) || ("undefined" != typeof HISTORICAL_POLITIES_DATA ? HISTORICAL_POLITIES_DATA : null);
                if (i) for (var a in i) {
                    for (var r = i[a], o = [ r.id, r.name_ar, r.name_en, r.name_ru, r.name_uz, r.name_es, r.founder, r.founder_en, r.capital, r.capital_en ].filter(Boolean), s = 0, l = 0; l < o.length; l++) {
                        var c = Wi(o[l], e);
                        c > s && (s = c);
                    }
                    s > 0 && n.push({
                        type: "polity",
                        polity: r,
                        name: Ai(r, "name") || r.name_ar || r.name_en,
                        score: s
                    });
                }
            }
            gi.forEach(function(t) {
                var i = Ki(t, e);
                i > 0 && n.push({
                    type: "country",
                    country: t,
                    name: Hi(t),
                    score: i
                });
            }), n.sort(function(e, t) {
                return t.score - e.score;
            });
            var d = n.slice(0, 6);
            d.length ? (d.forEach(function(e) {
                var n = document.createElement("li"), i = document.createElement("span");
                i.className = "flag-icon", "polity" === e.type ? (i.textContent = "📜", n.appendChild(i), 
                n.appendChild(document.createTextNode(" " + e.name))) : (i.textContent = bo(e.country), 
                n.appendChild(i), n.appendChild(document.createTextNode(" " + e.name)));
                var a = function(n) {
                    n.preventDefault(), n.stopPropagation(), Xc.value = "", t.style.display = "none", 
                    Xc.blur(), "polity" === e.type ? Yi(e.polity) : wo(e.country);
                };
                n.addEventListener("touchend", a, {
                    passive: !1
                }), n.addEventListener("mousedown", a), t.appendChild(n);
            }), t.style.display = "block") : t.style.display = "none";
        } else t.style.display = "none";
    }), Xc && Xc.addEventListener("blur", function() {
        setTimeout(function() {
            var e = document.getElementById("mobileSuggestionsList");
            e && (e.style.display = "none");
        }, 200);
    }), Jc && Jc.addEventListener("click", zs), Zc && Zc.addEventListener("click", function() {
        ld.classList.add("visible");
    }), td && td.addEventListener("click", function() {
        md(), Ms();
    }), sd && sd.addEventListener("click", function() {
        md(), io();
    }), nd && nd.addEventListener("click", function(e) {
        e.stopPropagation(), md(), id && id.classList.toggle("open");
    }), ad && ad.addEventListener("click", function() {
        md(), Td(!0);
    }), rd && rd.addEventListener("click", function() {
        md(), H.classList.add("visible");
    }), od && od.addEventListener("click", function() {
        md(), js();
    }), document.addEventListener("click", function(e) {
        id && id.classList.contains("open") && !id.contains(e.target) && e.target !== nd && !nd.contains(e.target) && md();
    }), cd && cd.addEventListener("click", function() {
        ld.classList.remove("visible");
    }), dd && dd.addEventListener("click", function() {
        ld.classList.remove("visible");
    }), ud.forEach(function(e) {
        e.addEventListener("click", function() {
            var e = this.dataset.mode, t = document.querySelector('#modeButtons .mode-btn[data-mode="' + e + '"]');
            t && t.click(), ld.classList.remove("visible");
        });
    }), pd.forEach(function(e) {
        e.addEventListener("click", function() {
            var e = this.dataset.religion, t = document.querySelector('#religionButtons .religion-btn[data-religion="' + e + '"]');
            t && t.click();
        });
    }), document.addEventListener("keydown", function(e) {
        if ("Escape" === e.key && yd && yd.classList.contains("visible") && xs(), "Escape" === e.key && "function" == typeof window.closeEraModals) {
            var t = document.getElementById("eraQuizModal"), n = document.getElementById("eraCompareModal");
            if (t && t.classList.contains("visible") || n && n.classList.contains("visible")) return void window.closeEraModals();
        }
        "Escape" === e.key && "function" == typeof window.closeAnnotationTutorial && window.closeAnnotationTutorial(), 
        "Escape" === e.key && Bt && qo(), "Escape" === e.key && document.querySelectorAll(".lang-dropdown-menu.visible").forEach(function(e) {
            e.classList.remove("visible");
        });
    });
    var fd = document.getElementById("annotateBtn"), hd = document.getElementById("mobileAnnotateBtn"), yd = document.getElementById("annotationsModal");
    fd && fd.addEventListener("click", hs), hd && hd.addEventListener("click", function() {
        var e = document.getElementById("mobileToolsMenu");
        e && e.classList.contains("open") && e.classList.remove("open"), hs();
    });
    var gd = {
        pin: document.getElementById("annotationKindPin"),
        region: document.getElementById("annotationKindRegion"),
        draw: document.getElementById("annotationKindDraw"),
        arrow: document.getElementById("annotationKindArrow")
    }, vd = document.getElementById("annotationAddByNameBtn");
    vd && vd.addEventListener("click", function() {
        dt && ("pin" === ut || "region" === ut ? function(e) {
            var t = document.getElementById("annotationPlaceModal"), n = document.getElementById("annotationPlaceInput"), i = document.getElementById("annotationPlaceResults"), a = document.getElementById("annotationPlaceNoResults"), r = document.getElementById("annotationPlaceCancel"), o = document.getElementById("annotationPlaceClose"), s = document.getElementById("annotationPlaceTitle");
            if (t && n && i) {
                var l = document.activeElement;
                s && (s.textContent = zi("region" === e ? "placeModalTitleRegion" : "placeModalTitlePin")), 
                n.value = "", i.innerHTML = "", i.style.display = "none", a && (a.style.display = "none"), 
                n.setAttribute("aria-expanded", "false"), t.classList.add("visible"), t.style.display = "flex", 
                t._placeCleanup = u, r && (r.onclick = u), o && (o.onclick = u), n.onkeydown = function(e) {
                    if ("ArrowDown" === e.key) {
                        e.preventDefault();
                        var t = i.querySelector("button");
                        t && t.focus();
                    } else if ("Enter" === e.key) {
                        e.preventDefault();
                        var a = i.querySelectorAll("button");
                        1 === a.length ? p(c(n.value.trim().toLowerCase())[0]) : a.length && (e.preventDefault(), 
                        a[0].focus());
                    } else "Escape" === e.key && (e.preventDefault(), u());
                }, i.addEventListener("keydown", function(e) {
                    var t = [ ...i.querySelectorAll("button") ], a = t.indexOf(document.activeElement);
                    "ArrowDown" === e.key ? (e.preventDefault(), a > -1 && a < t.length - 1 ? t[a + 1].focus() : t.length && t[0].focus()) : "ArrowUp" === e.key ? (e.preventDefault(), 
                    a > 0 ? t[a - 1].focus() : n.focus()) : "Escape" === e.key && (e.preventDefault(), 
                    u());
                }), t.addEventListener("click", function(e) {
                    e.target !== t.querySelector(".layers-modal-backdrop") && e.target !== t || u();
                }, {
                    once: !0
                }), n.addEventListener("input", d), n.focus(), d();
            }
            function c(e) {
                return gi.filter(function(t) {
                    var n = Hi(t).toLowerCase();
                    return t.toLowerCase().includes(e) || n.includes(e);
                }).slice(0, 8);
            }
            function d() {
                var e = n.value.trim().toLowerCase();
                if (i.innerHTML = "", !e) return i.style.display = "none", a && (a.style.display = "none"), 
                void n.setAttribute("aria-expanded", "false");
                var t = c(e);
                t.forEach(function(e, t) {
                    var n = document.createElement("li");
                    n.setAttribute("role", "option"), n.id = "placeOpt-" + t;
                    var a = document.createElement("button");
                    a.type = "button", a.className = "place-result-btn quiz-suggestion", a.style.cssText = "display:flex;width:100%;text-align:" + ("rtl" === document.documentElement.dir ? "right" : "left") + ";gap:6px;align-items:center;padding:6px 10px;background:none;border:none;cursor:pointer;color:inherit;font:inherit;", 
                    a.textContent = bo(e) + " " + Hi(e), a.addEventListener("click", function() {
                        p(e);
                    }), n.appendChild(a), i.appendChild(n);
                }), i.style.display = "block", n.setAttribute("aria-expanded", "true"), n.setAttribute("aria-activedescendant", t.length ? "placeOpt-0" : ""), 
                a && (a.style.display = t.length ? "none" : "block");
            }
            function u() {
                t.classList.remove("visible"), t.style.display = "none", t._placeCleanup = null, 
                l && l.isConnected && null !== l.offsetParent ? l.focus() : document.getElementById("annotateBtn") && document.getElementById("annotateBtn").focus();
            }
            function p(t) {
                var n = fn.find(function(e) {
                    return e.properties && e.properties.name === t;
                });
                if (n) {
                    if ("pin" === e) {
                        var i = d3.geoCentroid(n);
                        i && !isNaN(i[0]) && yt.push({
                            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                            type: "pin",
                            coords: [ i[0], i[1] ],
                            label: Hi(t),
                            color: pt,
                            size: mt,
                            createdAt: Date.now()
                        });
                    } else {
                        var a = d3.geoBounds(n);
                        if (a && !isNaN(a[0][0])) {
                            var r = a[0][0], o = a[0][1], s = a[1][0], l = a[1][1];
                            if (r > s) {
                                var c = r;
                                r = s, s = c;
                            }
                            yt.push({
                                id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                                type: "region",
                                coords: [ [ r, l ], [ s, l ], [ s, o ], [ r, o ] ],
                                label: Hi(t),
                                color: pt,
                                size: mt,
                                createdAt: Date.now()
                            });
                        }
                    }
                    Vo(), ns(), Go(zi("annotationAdded"));
                }
                u();
            }
        }(ut) : Go(zi("placeKindToast")));
    }), Object.keys(gd).forEach(function(e) {
        var t = gd[e];
        t && t.addEventListener("click", function() {
            !function(e) {
                if (-1 !== [ "pin", "region", "freehand", "arrow" ].indexOf(e)) {
                    ut = e, ft = [], ls(), fs();
                    var t = zi("pin" === e ? "annotationPin" : "region" === e ? "annotationRegion" : "arrow" === e ? "annotationArrow" : "annotationDraw");
                    Go(zi("annotationToolActive").replace("{tool}", t));
                }
            }("draw" === e ? "freehand" : e);
        });
    });
    var bd = document.getElementById("annotationFinishBtn");
    bd && bd.addEventListener("click", function() {
        dt && ("region" !== ut ? "freehand" !== ut && "arrow" !== ut || (bt || vt && vt.length >= 2) && us(!1) : function() {
            if (ft.length < 3) return;
            var e = ft.slice();
            ft = [], yt.push({
                id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                type: "region",
                coords: e,
                label: "",
                color: pt,
                size: mt,
                createdAt: Date.now()
            }), Vo(), ns(), Go(zi("annotationAdded"));
        }());
    });
    var wd = document.getElementById("annotationClearBtn");
    wd && wd.addEventListener("click", function() {
        cs() || (yt.length ? (yt.pop(), Vo(), ls(), ns(), ks(), Go(zi("annotationUndone"))) : Go(zi("annotationModeEmpty")));
    });
    var Ed = document.getElementById("annotationManageBtn");
    Ed && Ed.addEventListener("click", function() {
        ks();
        var e = document.getElementById("annotationsModal");
        e && e.classList.add("visible");
    });
    var kd = document.getElementById("annotationHelpBtn");
    kd && kd.addEventListener("click", function() {
        window.startAnnotationTutorial && window.startAnnotationTutorial();
    }), document.querySelectorAll("#annotationToolbar .annotation-color-swatch").forEach(function(e) {
        e.addEventListener("click", function() {
            !function(e) {
                if (/^#[0-9a-f]{6}$/i.test(e)) {
                    pt = e;
                    try {
                        localStorage.setItem("annotateColor", e);
                    } catch (e) {}
                    fs();
                }
            }(e.getAttribute("data-color"));
        });
    });
    var xd = document.getElementById("annotationFontSmallBtn"), _d = document.getElementById("annotationFontMediumBtn"), Cd = document.getElementById("annotationFontLargeBtn");
    xd && xd.addEventListener("click", function() {
        gs(-1);
    }), _d && _d.addEventListener("click", function() {
        vs(10);
    }), Cd && Cd.addEventListener("click", function() {
        gs(1);
    });
    var Ld = document.getElementById("annotationsModalClose"), Bd = document.getElementById("annotationsModalBackdrop");
    Ld && Ld.addEventListener("click", xs), Bd && Bd.addEventListener("click", xs);
    var Sd = document.getElementById("eraQuizModalClose"), Id = document.getElementById("eraQuizModalBackdrop"), zd = document.getElementById("eraCompareModalClose"), Ad = document.getElementById("eraCompareModalBackdrop");
    Sd && Sd.addEventListener("click", function() {
        var e = document.getElementById("eraQuizModal");
        e && e.classList.remove("visible");
    }), Id && Id.addEventListener("click", function() {
        var e = document.getElementById("eraQuizModal");
        e && e.classList.remove("visible");
    }), zd && zd.addEventListener("click", function() {
        var e = document.getElementById("eraCompareModal");
        e && e.classList.remove("visible");
    }), Ad && Ad.addEventListener("click", function() {
        var e = document.getElementById("eraCompareModal");
        e && e.classList.remove("visible");
    });
    var Md = document.getElementById("mapSvg");
    function Td(e) {
        var t = document.getElementById("projectionOverlay"), n = !1;
        if (!e) try {
            n = "1" === localStorage.getItem("projectionExplainerDone");
        } catch (e) {}
        if (t && (!n || e)) {
            var i = document.getElementById("projectionTitle"), a = document.getElementById("projectionBody"), r = document.getElementById("projectionContinue");
            i && (i.textContent = zi("projectionTitle")), a && (a.innerHTML = zi("projectionBody")), 
            r && (r.textContent = zi("onboardNext")), t.classList.add("active"), r && r.addEventListener("click", o), 
            t.addEventListener("click", function(e) {
                e.target === t && o();
            });
        }
        function o() {
            t.classList.remove("active");
            try {
                localStorage.setItem("projectionExplainerDone", "1");
            } catch (e) {}
            var e = void 0 !== Ke && "history" === Ke ? "history" : "geo", n = !1;
            try {
                n = "1" === localStorage.getItem("onboardCompleted_" + e) || "1" === localStorage.getItem("onboardDone_" + e);
            } catch (e) {}
            if (!n && "function" == typeof window.startOnboarding) {
                try {
                    localStorage.removeItem("onboardDone"), localStorage.removeItem("onboardDone_" + e);
                } catch (e) {}
                setTimeout(function() {
                    window.startOnboarding();
                }, 300);
            }
        }
    }
    function Pd(e, t) {
        var n = 0;
        !function i() {
            if (window.applySection) return window.applySection(e, !1), void (t && t());
            ++n > 150 || setTimeout(i, 60);
        }();
    }
    function qd() {
        var e = null;
        try {
            e = localStorage.getItem("lepidosSection");
        } catch (e) {}
        if ("history" !== e && Pd("geo"), "geo" !== e && "history" !== e) {
            var t = document.getElementById("sectionPickerOverlay");
            if (t) {
                t.style.display = "flex";
                var n = !1;
                t.querySelectorAll(".section-card").forEach(function(e) {
                    e.addEventListener("click", function() {
                        !function(e) {
                            if (!n) {
                                n = !0;
                                var i = document.getElementById("sectionRemember");
                                if (!i || i.checked) try {
                                    localStorage.setItem("lepidosSection", e);
                                } catch (e) {}
                                try {
                                    localStorage.setItem("lepidosSectionChoice", "1");
                                } catch (e) {}
                                t.style.display = "none", Pd(e, Td);
                            }
                        }(this.dataset.section);
                    });
                });
            } else Td();
        } else Pd(e, Td);
    }
    window.__annotDebug = function() {
        return {
            annotateActive: dt,
            annotateKind: ut,
            annotateColor: pt,
            annotateFontSize: mt,
            panSpaceHeld: Lt,
            strokeActive: bt,
            strokePoints: vt ? vt.length : 0,
            pathLen: kt,
            kindPinOn: !(!document.getElementById("annotationKindPin") || !document.getElementById("annotationKindPin").classList.contains("toggle-on"))
        };
    }, Md && (Md.addEventListener("pointerdown", function(e) {
        if (dt && ("freehand" === ut || "arrow" === ut) && e.target && e.target.closest && e.target.closest("#mapSvg") && !Lt && 2 !== e.button && 1 !== e.button) return bt ? (bt = !1, 
        void cs()) : void (("touch" !== e.pointerType || e.isPrimary) && (e.preventDefault(), 
        e.stopPropagation(), wt = e.pointerId, bt = !0, [ e.clientX, e.clientY ], Et = [ e.clientX, e.clientY ], 
        kt = 0, vt = [], xt = [ e.clientX, e.clientY ], os(), vt.length && ss()));
    }), Md.addEventListener("pointermove", function(e) {
        bt && e.pointerId === wt && (e.target && e.target.closest && e.target.closest("#mapSvg") ? (e.preventDefault(), 
        e.stopPropagation(), xt = [ e.clientX, e.clientY ], _t || (_t = requestAnimationFrame(os))) : ms());
    }), Md.addEventListener("pointerup", ps), Md.addEventListener("pointercancel", ps)), 
    Q && Q.addEventListener("click", function(e) {
        if (dt && (!e.target || !e.target.closest || e.target.closest("#mapSvg")) && !(e.target && e.target.closest && e.target.closest(".annotation-pin-circle, .annotation-pin-label, .annotation-region-poly"))) {
            var t = ki(), n = e.clientX - t.left, i = e.clientY - t.top, a = Qo(li.invert([ n, i ]));
            !a || isNaN(a[0]) || isNaN(a[1]) || ("pin" === ut ? (yt.push({
                id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                type: "pin",
                coords: [ a[0], a[1] ],
                label: "",
                color: pt,
                size: mt,
                createdAt: Date.now()
            }), Vo(), ns(), Go(zi("annotationAdded"))) : "region" === ut && (ft.push([ a[0], a[1] ]), 
            as()));
        }
    }, !0), document.addEventListener("keydown", function(e) {
        "Space" === e.code && !e.repeat && e.target && "INPUT" !== e.target.tagName && ds(!0);
    }), document.addEventListener("keyup", function(e) {
        "Space" === e.code && ds(!1);
    }), document.addEventListener("blur", function() {
        ds(!1);
    }), q.addEventListener("click", () => {
        Eo();
    }), O.addEventListener("click", function() {
        if (!vn) return;
        const e = vn.properties?.name || "", t = countryInfo[e] || countryInfo[Pi(e)];
        let n = `${zi("continent")}: ${Hi(e)}\n`;
        t && (n += `${zi("capital")}: ${"ar" === Ht ? t.capital_ar || t.capital_en : "ru" === Ht ? t.capital_ru || t.capital_en : "uz" === Ht ? t.capital_uz || t.capital_en : "es" === Ht && t.capital_es || t.capital_en}\n`, 
        n += `${zi("areaTitle")}: ${t.area} ${zi("km2")}\n`, n += `${zi("populationTitle")}: ${t.population_2026} ${zi("million")}\n`, 
        n += `${zi("languageTitle")}: ${"ar" === Ht ? t.lang_ar || t.lang_en : "ru" === Ht ? t.lang_ru || t.lang_en : "uz" === Ht ? t.lang_uz || t.lang_en : "es" === Ht && t.lang_es || t.lang_en}\n`, 
        n += `${zi("densityTitle")}: ${Zi(e)} ${zi("densityUnit")}\n`);
        const i = new Blob([ n ], {
            type: "text/plain"
        }), a = URL.createObjectURL(i), r = document.createElement("a");
        r.href = a, r.download = `${zi("exportFilename")}_${e.replace(/\s/g, "_")}.txt`, 
        r.click(), URL.revokeObjectURL(a);
    }), R && R.addEventListener("click", function() {
        const e = N.classList.toggle("active");
        this.classList.toggle("active");
        const t = document.getElementById("legend");
        t.style.display = e ? "none" : "flex";
    }), window.applySectionWhenReady = Pd, function() {
        var e = document.getElementById("langOverlay");
        if (!e) return Rs(), void qd();
        var t = document.getElementById("langModalTitle");
        t && (t.textContent = "Lepidos Atlas");
        var n = null;
        try {
            n = localStorage.getItem("mapLang");
        } catch (e) {}
        if (n && [ "ar", "en", "ru", "uz", "es" ].includes(n)) return e.remove(), Rs(), 
        void qd();
        try {
            localStorage.removeItem("onboardDone"), localStorage.removeItem("onboardDone_geo"), 
            localStorage.removeItem("onboardDone_history"), localStorage.removeItem("onboardCompleted_geo"), 
            localStorage.removeItem("onboardCompleted_history");
        } catch (e) {}
        e.querySelectorAll(".lang-overlay-btn").forEach(function(t) {
            t.addEventListener("click", function() {
                var t = this.dataset.lang;
                Ht = t;
                try {
                    localStorage.setItem("mapLang", t);
                } catch (e) {}
                e.style.cssText = "display:none !important;visibility:hidden;pointer-events:none;opacity:0;z-index:-1;", 
                e.classList.add("hidden"), e.remove();
                var n = !1;
                try {
                    n = "1" === localStorage.getItem("projectionExplainerDone");
                } catch (e) {}
                if (!n) try {
                    localStorage.setItem("onboardDone", "1");
                } catch (e) {}
                Rs(), qd();
            });
        });
    }();
    var Od = document.getElementById("layersToggleBtn"), Rd = document.getElementById("barLayersBtn"), Nd = document.getElementById("barDivisionBtn");
    function Dd(e, t) {
        if (e && t) {
            var n = t.getBoundingClientRect(), i = e.offsetWidth, a = e.offsetHeight, r = window.innerWidth, o = window.innerHeight, s = "rtl" === document.documentElement.dir;
            if (e.classList.contains("hist-popover-menu")) {
                var l = Math.max(54, Math.round(n.bottom + 8));
                return e.style.top = l + "px", e.style.bottom = "82px", e.style.maxHeight = "calc(100vh - " + (l + 90) + "px)", 
                r > 680 ? s ? (e.style.right = "16px", e.style.left = "auto") : (e.style.left = "16px", 
                e.style.right = "auto") : (e.style.left = "8px", e.style.right = "8px", e.style.width = "calc(100vw - 16px)", 
                e.style.bottom = "12px"), void (e.style.transformOrigin = s ? "top right" : "top left");
            }
            var c = s ? n.right - i : n.left;
            c = Math.max(8, Math.min(c, r - i - 8));
            var d = n.bottom + 8, u = !1;
            d + a > o - 8 && n.top - a - 8 >= 8 && (d = n.top - a - 8, u = !0), d = Math.max(8, Math.min(d, o - a - 8)), 
            e.style.left = c + "px", e.style.top = d + "px", e.style.transformOrigin = (u ? "bottom" : "top") + " " + (s ? "right" : "left");
        }
    }
    function Fd(e, t) {
        e && e.setAttribute("aria-expanded", t ? "true" : "false");
    }
    function Hd(e) {
        if (D.classList.contains("visible")) jd(); else {
            !function() {
                var e = document.getElementById("layersModalBody");
                if (e && !e.dataset.gridBuilt) {
                    var t = document.createElement("div");
                    t.className = "menu-popover-actions";
                    var n = document.createElement("button");
                    n.className = "btn", n.id = "btn-turn-off-all", n.setAttribute("data-i18n", "allOff"), 
                    n.textContent = zi("allOff"), n.addEventListener("click", function() {
                        e.querySelectorAll(".btn.toggle-on").forEach(function(e) {
                            e.click();
                        }), Gr();
                    }), t.appendChild(n);
                    var i = document.createElement("button");
                    i.className = "btn", i.id = "btn-reset-layers", i.setAttribute("data-i18n", "resetLayers"), 
                    i.textContent = zi("resetLayers"), i.addEventListener("click", function() {
                        le && Jr(), de && ka(), ce && Ir(), ue && Zr(), pe && eo(), me && to(), fe && no(), 
                        he && Er(), ye && kr(), ge && xr(), ve && _r(), be && Cr(), we && Lr(), xe && zr(), 
                        _e && Br(), Ce && Sr(), "all" !== re && (re = "all", document.getElementById("blocSelect").value = "all"), 
                        Gr();
                    }), t.appendChild(i);
                    var a = [].slice.call(e.children);
                    e.innerHTML = "", e.appendChild(t);
                    var r = document.createElement("div");
                    r.className = "layers-flat-grid";
                    var o = null;
                    a.forEach(function(e) {
                        if ("SELECT" === e.tagName) return o ? void o.appendChild(e) : void r.appendChild(e);
                        if ("geopoliticalBlocsToggle" === e.id) {
                            (o = document.createElement("div")).className = "blocs-compound-card", e.classList.add("blocs-toggle-btn");
                            var t = e.querySelector(".lucide-icon");
                            if (t) {
                                var n = document.createElement("span");
                                n.className = "layer-icon", t.replaceWith(n), n.appendChild(t);
                            }
                            var i = e.querySelector(".btn-text");
                            if (i) {
                                var a = document.createElement("span");
                                a.className = "layer-title", i.replaceWith(a), a.appendChild(i);
                            }
                            return o.appendChild(e), r.appendChild(o), void new MutationObserver(function() {
                                o.classList.toggle("active", e.classList.contains("toggle-on"));
                            }).observe(e, {
                                attributes: !0,
                                attributeFilter: [ "class" ]
                            });
                        }
                        e.classList.add("layer-card");
                        var s = e.querySelector(".lucide-icon");
                        if (s) {
                            var l = document.createElement("span");
                            l.className = "layer-icon", s.replaceWith(l), l.appendChild(s);
                        }
                        var c = e.querySelector(".btn-text");
                        if (c) {
                            var d = document.createElement("span");
                            d.className = "layer-title", c.replaceWith(d), d.appendChild(c);
                        }
                        r.appendChild(e);
                    }), e.appendChild(r), e.dataset.gridBuilt = "1";
                }
            }(), Wd(), D.classList.add("visible"), Dd(D, e || Rd || Od), Fd(e, !0);
            var t = D.querySelector(".layers-modal-body .btn, .layers-modal-body .bloc-select");
            t && setTimeout(function() {
                t.focus();
            }, 60);
        }
    }
    function jd() {
        D.classList.contains("visible") && (D.classList.remove("visible"), Fd(Rd, !1), Fd(Od, !1), 
        Fd(ed, !1));
    }
    function Wd() {
        F.classList.contains("visible") && (F.classList.remove("visible"), Fd(Nd, !1));
    }
    Od && Od.addEventListener("click", function() {
        Hd(this);
    }), Rd && Rd.addEventListener("click", function() {
        Hd(this);
    }), ed && ed.addEventListener("click", function() {
        Hd(this);
    }), Nd && Nd.addEventListener("click", function() {
        !function(e) {
            if (F.classList.contains("visible")) Wd(); else {
                jd(), F.classList.add("visible"), Dd(F, e || Nd), Fd(e, !0);
                var t = F.querySelector(".layers-modal-body .btn");
                t && setTimeout(function() {
                    t.focus();
                }, 60);
            }
        }(this);
    });
    var Ud = document.getElementById("layersModalClose"), $d = document.getElementById("divisionPopoverClose");
    Ud && Ud.addEventListener("click", jd), $d && $d.addEventListener("click", Wd), 
    document.addEventListener("click", function(e) {
        if (D && D.classList.contains("visible")) {
            if (D.contains(e.target)) return;
            if (e.target === Od || Od && Od.contains(e.target) || e.target === Rd || Rd && Rd.contains(e.target) || e.target === ed || ed && ed.contains(e.target)) return;
            jd();
        }
        if (F && F.classList.contains("visible")) {
            if (F.contains(e.target)) return;
            if (Nd && (e.target === Nd || Nd.contains(e.target))) return;
            Wd();
        }
    }), document.addEventListener("keydown", function(e) {
        "Escape" === e.key && (D && D.classList.contains("visible") && jd(), F && F.classList.contains("visible") && Wd());
    });
    var Kd = null;
    window.addEventListener("resize", function() {
        clearTimeout(Kd), Kd = setTimeout(function() {
            D.classList.contains("visible") && Dd(D, Rd || Od), F.classList.contains("visible") && Dd(F, Nd);
        }, 80);
    });
    var Gd = [ {
        id: "ne_carto",
        category: "general",
        title: "Natural Earth Vector & Raster Map Data",
        author: "Tom Patterson, Nathaniel Vaughn Kelso et al.",
        publisher: "North American Cartographic Information Society (NACIS)",
        year: "2023",
        badge: "GIS & Cartography",
        desc: "قاعدة البيانات الخرائطية المرجعية المعتمدة دولياً للحدود السياسية، السواحل، الممرات المائية والمراكز الحضرية بمقياس 1:10m و 1:50m.",
        citation: "Patterson, T., & Kelso, N. V. (2023). Natural Earth Data (Version 5.1). North American Cartographic Information Society.",
        link: "https://www.naturalearthdata.com/"
    }, {
        id: "gadm_admin",
        category: "general",
        title: "GADM Database of Global Administrative Areas",
        author: "Robert Hijmans et al.",
        publisher: "University of California, Davis",
        year: "2022",
        badge: "Administrative Boundaries",
        desc: "التوثيق الأكاديمي الشامل للتقسيمات الإدارية الفرعية (المحافظات، الولايات، والمقاطعات) لجميع دول العالم المستقلة والمناطق المتنازع عليها.",
        citation: "Hijmans, R. et al. (2022). GADM database of Global Administrative Areas (v4.1). University of California, Davis.",
        link: "https://gadm.org/"
    }, {
        id: "ut_austin_pcl",
        category: "general",
        title: "Perry-Castañeda Library Map Collection",
        author: "University of Texas at Austin",
        publisher: "PCL Map Collection Archive",
        year: "2024",
        badge: "Historical Cartography",
        desc: "أكبر أرشيف جامعي عام للخرائط الطبوغرافية والتاريخية وخرائط النزاعات الحدودية ووكالة الاستخبارات المركزية الأمريكية (CIA World Factbook Maps).",
        citation: "Perry-Castañeda Library. (2024). PCL Map Collection. University of Texas Libraries, Austin.",
        link: "https://maps.lib.utexas.edu/maps/"
    }, {
        id: "gebco_ocean",
        category: "general",
        title: "GEBCO Gridded Bathymetric Data",
        author: "GEBCO Sub-Committee on Undersea Feature Names (SCUFN)",
        publisher: "UNESCO Intergovernmental Oceanographic Commission & IHO",
        year: "2023",
        badge: "Hydrography & Oceans",
        desc: "المرجع الهيدروغرافي الموحد لقياس أعماق البحار والمحيطات والمضائق البحرية والممرات الملاحية الاستراتيجية العالمية.",
        citation: "GEBCO Compilation Group. (2023). GEBCO 2023 Grid. doi:10.5285/f98b053b-0cbc-6c23-e053-6c86abc029e5",
        link: "https://www.gebco.net/"
    }, {
        id: "cambridge_islam",
        category: "eras",
        title: "The Cambridge History of Islam (Volumes 1A, 1B, 2A, 2B)",
        author: "P. M. Holt, Ann K. S. Lambton, Bernard Lewis (Eds.)",
        publisher: "Cambridge University Press",
        year: "1977",
        badge: "Islamic Civilization",
        desc: "المرجع الأكاديمي القياسي لتاريخ ونشأة وسقوط الخلافة الراشدة، الدولة الأموية، الدولة العباسية، والإمبراطوريات الإسلامية الكبرى في آسيا وإفريقيا.",
        citation: "Holt, P. M., Lambton, A. K. S., & Lewis, B. (Eds.). (1977). The Cambridge History of Islam. Cambridge University Press.",
        link: "https://doi.org/10.1017/CHOL9780521219464"
    }, {
        id: "unesco_africa",
        category: "eras",
        title: "General History of Africa (Volumes I – VIII)",
        author: "International Scientific Committee for the Drafting of a General History of Africa",
        publisher: "UNESCO Publishing / Heinemann / University of California Press",
        year: "1981–1999",
        badge: "African History",
        desc: "المشروع الموسوعي التوثيقي الأضخم لحضارات وممالك إفريقيا عبر العصور، مع التركيز على ممالك مالي وغانا وصنغاي والمرابطين والموحدين وممالك الساحل.",
        citation: "UNESCO. (1981–1999). General History of Africa (Vols. I–VIII). UNESCO Publishing.",
        link: "https://en.unesco.org/general-history-africa"
    }, {
        id: "ibn_khaldun_muqaddimah",
        category: "eras",
        title: "مقدمة ابن خلدون (ديوان المبتدأ والخبر)",
        author: "عبد الرحمن بن خلدون الحضرمي (732 - 808 هـ)",
        publisher: "دار يعرب / تحرير د. علي عبد الواحد وافي / فرانز روزنتال (Princeton UP)",
        year: "1377 / 1958",
        badge: "Primary Arabic Chronicle",
        desc: "المؤسس الأول لعلم الاجتماع البشري وفلسفة التاريخ، وتوثيق دورات صعود وسقوط الدول والإمبراطوريات والعصبيات القبلية في المغرب والمشرق.",
        citation: "Ibn Khaldun. (1958). The Muqaddimah: An Introduction to History (F. Rosenthal, Trans.). Princeton University Press.",
        link: "https://press.princeton.edu/books/hardcover/9780691166667/the-muqaddimah"
    }, {
        id: "oxford_world_empires",
        category: "eras",
        title: "The Oxford World History of Empire (Vols 1 & 2)",
        author: "Peter Fibiger Bang, C. A. Bayly, Walter Scheidel (Eds.)",
        publisher: "Oxford University Press",
        year: "2020",
        badge: "Imperial History",
        desc: "تحليل مقارن شامل للحدود الجيوسياسية والتنظيم العسكري والإداري للإمبراطوريات القديمة والوسطى والحديثة (الرومانية، البيزنطية، الساسانية، والمغولية).",
        citation: "Bang, P. F., Bayly, C. A., & Scheidel, W. (Eds.). (2020). The Oxford World History of Empire. Oxford University Press.",
        link: "https://doi.org/10.1093/oso/9780199772261.001.0001"
    }, {
        id: "tabari_tarikh",
        category: "eras",
        title: "تاريخ الرسل والملوك (تاريخ الطبري)",
        author: "محمد بن جرير الطبري (224 - 310 هـ)",
        publisher: "دار المعارف بمصر / State University of New York Press (39 Vols)",
        year: "915 / 1985–2007",
        badge: "Primary Chronicle",
        desc: "المصدر التاريخي الأوثق والمفصل لحوادث العصور القديمة، الفتوحات الإسلامية المبكرة، ومعارك اليرموك والقادسية وتطور حدود الخلافة.",
        citation: "Al-Tabari. (1985–2007). The History of al-Tabari (Ta'rikh al-rusul wa'l-muluk) (E. Yar-Shater, Ed., 39 Vols.). SUNY Press.",
        link: "https://sunypress.edu/Series/T/The-History-of-al-Tabari"
    }, {
        id: "west_point_atlases",
        category: "wars",
        title: "West Point History of Warfare & Military Atlases",
        author: "Department of History, United States Military Academy",
        publisher: "West Point / Rowan Technology",
        year: "2020",
        badge: "Military Geography",
        desc: "الخرائط التكتيكية والاستراتيجية العسكرية المعتمدة في تدريس تاريخ الحروب العالمية، معارك نابليون، الحروب الصليبية، والحملات الجيوسياسية الكبرى.",
        citation: "United States Military Academy. (2020). West Point Military History Atlases. USMA Department of History.",
        link: "https://www.westpoint.edu/academics/academic-departments/history/digital-history-center"
    }, {
        id: "dupuy_military_encyclopedia",
        category: "wars",
        title: "The Harper Encyclopedia of Military History",
        author: "R. Ernest Dupuy, Trevor N. Dupuy",
        publisher: "HarperCollins Publishers",
        year: "1993",
        badge: "Military Chronology",
        desc: "التوثيق المرجعي الشامل لأكثر من 4500 معركة وحرب منذ عام 3500 ق.م حتى العصر المعاصر، مع إحصائيات دقيقة للقوى والضحايا.",
        citation: "Dupuy, R. E., & Dupuy, T. N. (1993). The Harper Encyclopedia of Military History: From 3500 BC to the Present (4th ed.). HarperCollins.",
        link: "https://archive.org/details/harperencycloped0000dupu"
    }, {
        id: "correlates_of_war",
        category: "wars",
        title: "Correlates of War (COW) Project Militarized Interstate Disputes",
        author: "Meredith Reid Sarkees, Frank Whelon Wayman",
        publisher: "University of Michigan & Penn State University",
        year: "2021",
        badge: "Quantitative Conflict Data",
        desc: "قاعدة البيانات الأكاديمية الأولى عالمياً لقياس كمية وتاريخ النزاعات المسلحة والحروب بين الدول منذ عام 1816.",
        citation: "Sarkees, M. R., & Wayman, F. W. (2010). Resort to War: A Data Guide to Inter-State, Extra-state, Intra-State, and Non-State Wars, 1816-2007. CQ Press.",
        link: "https://correlatesofwar.org/"
    }, {
        id: "oxford_crusades",
        category: "wars",
        title: "The Oxford Illustrated History of the Crusades",
        author: "Jonathan Riley-Smith (Ed.)",
        publisher: "Oxford University Press",
        year: "2001",
        badge: "Medieval Warfare",
        desc: "دراسة نقدية وخرائط جغرافية لمسار الحملات الصليبية في بلاد الشام ومصر والأندلس وتأثيراتها الجيوسياسية على المشرق والمغرب.",
        citation: "Riley-Smith, J. (Ed.). (2001). The Oxford Illustrated History of the Crusades. Oxford University Press.",
        link: "https://doi.org/10.1093/acprof:oso/9780192854285.001.0001"
    }, {
        id: "pew_global_religion",
        category: "religions",
        title: "The Global Religious Landscape & Future of World Religions",
        author: "Pew Research Center's Forum on Religion & Public Life",
        publisher: "Pew Research Center, Washington D.C.",
        year: "2015, 2022",
        badge: "Demography & Sociology",
        desc: "الدراسة الإحصائية الميدانية الرائدة لتوزيع أتباع الأديان الكبرى (الإسلام، المسيحية، الهندوسية، البوذية، واليهودية) ونسبهم الديموغرافية في 230 دولة وإقليماً.",
        citation: "Pew Research Center. (2015). The Future of World Religions: Population Growth Projections, 2010-2050. Washington, D.C.",
        link: "https://www.pewresearch.org/religion/"
    }, {
        id: "cambridge_hist_religions",
        category: "religions",
        title: "The Cambridge History of Religions in the Ancient World",
        author: "Michele Renee Salzman, Marvin A. Sweeney (Eds.)",
        publisher: "Cambridge University Press",
        year: "2013",
        badge: "Ancient Religions",
        desc: "المسح التاريخي والأثري الشامل لانتشار المعتقدات الدينية في الشرق الأدنى وحوض البحر المتوسط وآسيا قبل العصور الوسطى.",
        citation: "Salzman, M. R., & Sweeney, M. A. (Eds.). (2013). The Cambridge History of Religions in the Ancient World. Cambridge University Press.",
        link: "https://doi.org/10.1017/CHO9781139600507"
    }, {
        id: "world_christian_encyclopedia",
        category: "religions",
        title: "World Christian Encyclopedia: A Comparative Survey of Churches and Religions in the Modern World",
        author: "David B. Barrett, George T. Kurian, Todd M. Johnson",
        publisher: "Oxford University Press",
        year: "2001, 2019",
        badge: "Comparative Demography",
        desc: "دراسة إحصائية تاريخية مقارنة لتطور انتشار الأديان والجماعات الدينية في كل دولة من دول العالم من عام 1900 حتى الحاضر.",
        citation: "Johnson, T. M., & Zurlo, G. A. (Eds.). (2019). World Christian Encyclopedia (3rd ed.). Edinburgh University Press.",
        link: "https://edinburghuniversitypress.com/book-world-christian-encyclopedia.html"
    }, {
        id: "ibn_battuta_rihla",
        category: "travelers",
        title: "تحفة النظار في غرائب الأمصار وعجائب الأسفار (رحلة ابن بطوطة)",
        author: "محمد بن عبد الله بن بطوطة الطنجي (تحرير ابن جزي الكلبي)",
        publisher: "The Hakluyt Society / ترجمة هـ. أ. ر. جيب (H.A.R. Gibb, 5 Vols)",
        year: "1355 / 1958–2000",
        badge: "Primary Travelogue",
        desc: "أعظم وثيقة جغرافية استكشافية في العصور الوسطى غطت أكثر من 117,000 كم عبر بلاد المغرب، مصر، الشام، الحجاز، الأناضول، السند، الهند، جزر المالديف، والصين.",
        citation: "Ibn Battuta. (1958–1994). The Travels of Ibn Battuta, A.D. 1325–1354 (H. A. R. Gibb, Trans., Vols. I–IV). Cambridge University Press for the Hakluyt Society.",
        link: "https://doi.org/10.4324/9781315552460"
    }, {
        id: "marco_polo_travels",
        category: "travelers",
        title: "The Book of Ser Marco Polo, the Venetian, Concerning the Kingdoms and Marvels of the East",
        author: "Marco Polo (Edited by Sir Henry Yule & Henri Cordier)",
        publisher: "John Murray, London / Dover Publications",
        year: "1903 / 1993",
        badge: "Silk Road Geography",
        desc: "التوثيق الجغرافي الكلاسيكي لرحلة البندقية عبر طريق الحرير، إمبراطورية قوبلاي خان المغولية، بلاط الصين، وجنوب شرق آسيا.",
        citation: "Yule, H., & Cordier, H. (Eds.). (1903). The Book of Ser Marco Polo (3rd ed., 2 Vols.). John Murray.",
        link: "https://archive.org/details/bookofser01polo"
    }, {
        id: "idrisi_rogeriana",
        category: "travelers",
        title: "نزهة المشتاق في اختراق الآفاق (كتاب روجر / Tabula Rogeriana)",
        author: "محمد بن محمد الإدريسي الشريف (493 - 559 هـ)",
        publisher: "المعهد الإيطالي للشرق الأقصى / مكتبة الثقافة الدينية",
        year: "1154 / 1970",
        badge: "Masterwork of Cartography",
        desc: "قمة الإنجاز الخرائطي في العصور الوسطى، وصف تفصيلي لأقاليم العالم السبعة والموانئ البحرية وطرق التجارة لصالح الملك روجر الثاني ملك صقلية.",
        citation: "Al-Idrisi. (1970–1984). Opus Geographicum (Nuzhat al-mushtaq fi ikhtiraq al-afaq) (E. Cerulli et al., Eds., 9 Vols.). Istituto Italiano per il Medio ed Estremo Oriente.",
        link: "https://gallica.bnf.fr/ark:/12148/btv1b55002481n"
    }, {
        id: "zheng_he_voyages",
        category: "travelers",
        title: "When China Ruled the Seas: The Treasure Fleet of the Dragon Throne",
        author: "Louise Levathes",
        publisher: "Oxford University Press",
        year: "1994",
        badge: "Maritime Exploration",
        desc: "تحقيق تاريخي وملاحي لرحلات الأدميرال تشينغ خه (Zheng He) السبع في المحيط الهندي وسواحل شبه الجزيرة العربية وشرق إفريقيا (1405-1433 م).",
        citation: "Levathes, L. (1994). When China Ruled the Seas: The Treasure Fleet of the Dragon Throne, 1405-1433. Oxford University Press.",
        link: "https://global.oup.com/academic/product/when-china-ruled-the-seas-9780195112078"
    } ];
    !function() {
        var e = document.getElementById("academicSourcesBtn"), n = document.getElementById("academicSourcesOverlay"), i = document.getElementById("academicSourcesCloseBtn"), a = document.getElementById("academicSourcesSearch"), r = document.getElementById("academicSourcesContent"), o = n ? n.querySelectorAll(".academic-tab-btn") : [], s = "general";
        function l(e) {
            if (r) {
                var n = (e || "").trim().toLowerCase(), i = Gd.filter(function(e) {
                    return ("all" === s || e.category === s) && (!n || -1 !== (e.title + " " + e.author + " " + e.publisher + " " + e.desc + " " + e.citation).toLowerCase().indexOf(n));
                });
                if (0 === i.length) return r.innerHTML = '<div style="text-align:center;padding:40px 20px;color:var(--text-muted);"><i data-lucide="search-x" style="width:40px;height:40px;margin-bottom:8px;opacity:0.6;"></i><p>لم يتم العثور على مراجع مطابقة لبحثك في هذا القسم.</p></div>', 
                void t();
                var a = "";
                i.forEach(function(e) {
                    a += '<div class="academic-source-card"><div class="academic-card-top"><div class="academic-source-title">' + Ti(e.title) + '</div><span class="academic-badge">' + Ti(e.badge) + '</span></div><div class="academic-source-meta"><i data-lucide="user" style="width:13px;height:13px;vertical-align:middle;"></i> <strong>' + Ti(e.author) + "</strong> &nbsp;|&nbsp; <span>" + Ti(e.publisher) + " (" + Ti(e.year) + ')</span></div><div class="academic-source-desc">' + Ti(e.desc) + '</div><div class="academic-source-citation">' + Ti(e.citation) + "</div>" + (e.link ? '<div style="margin-top:8px;text-align:end;"><a href="' + Ti(e.link) + '" target="_blank" rel="noopener noreferrer" class="hist-source-link" style="font-size:0.82rem;">زيارة المصدر المعتمد <i data-lucide="external-link" style="width:12px;height:12px;"></i></a></div>' : "") + "</div>";
                }), r.innerHTML = a, t();
            }
        }
        function c(e) {
            e && (s = e, o.forEach(function(t) {
                t.classList.toggle("active", t.getAttribute("data-tab") === e);
            })), a && (a.value = ""), l(""), n && (n.style.display = "flex");
        }
        function d() {
            n && (n.style.display = "none");
        }
        e && e.addEventListener("click", function() {
            c("general");
        }), i && i.addEventListener("click", d), n && n.addEventListener("click", function(e) {
            e.target === n && d();
        }), o.forEach(function(e) {
            e.addEventListener("click", function() {
                o.forEach(function(e) {
                    e.classList.remove("active");
                }), this.classList.add("active"), s = this.getAttribute("data-tab") || "general", 
                l(a ? a.value : "");
            });
        }), a && a.addEventListener("input", function() {
            l(this.value);
        }), window.openAcademicSourcesModal = c;
    }(), function() {
        var e = document.getElementById("smartboardToggleBtn"), t = document.getElementById("smartboardFloatingBar"), n = document.getElementById("smartboardLaserCanvas"), i = document.getElementById("smartboardExitBtn"), a = document.getElementById("smartboardFullscreenBtn"), r = document.getElementById("smartboardClearDrawBtn"), o = document.getElementById("smartboardBarDrag"), s = t ? t.querySelectorAll(".smartboard-tool-btn[data-tool]") : [], l = t ? t.querySelectorAll(".laser-dot-swatch") : [], c = !1, d = "laser", u = "#ff3344", p = n ? n.getContext("2d") : null, m = [], f = [], h = !1, y = null, g = -100, v = -100, b = null;
        function w() {
            if (n) {
                var e = document.getElementById("mapContainer");
                if (e) {
                    var t = e.getBoundingClientRect();
                    n.width = t.width, n.height = t.height;
                }
            }
        }
        function E() {
            if (c && p && n) {
                if (p.clearRect(0, 0, n.width, n.height), f.length > 0 && (p.save(), p.lineCap = "round", 
                p.lineJoin = "round", f.forEach(function(e) {
                    p.beginPath(), p.strokeStyle = e.color, p.lineWidth = e.width || 3, p.moveTo(e.x1, e.y1), 
                    p.lineTo(e.x2, e.y2), p.stroke();
                }), p.restore()), "spotlight" === d && g >= 0 && v >= 0) {
                    p.save(), p.fillStyle = "rgba(0, 5, 12, 0.65)", p.fillRect(0, 0, n.width, n.height), 
                    p.globalCompositeOperation = "destination-out";
                    var e = 130, t = p.createRadialGradient(g, v, 52, g, v, e);
                    t.addColorStop(0, "rgba(0,0,0,1)"), t.addColorStop(1, "rgba(0,0,0,0)"), p.fillStyle = t, 
                    p.beginPath(), p.arc(g, v, e, 0, 2 * Math.PI), p.fill(), p.globalCompositeOperation = "source-over", 
                    p.lineWidth = 2.5, p.strokeStyle = u, p.beginPath(), p.arc(g, v, e, 0, 2 * Math.PI), 
                    p.stroke(), p.restore();
                }
                if ("laser" === d) {
                    var i = performance.now();
                    if ((m = m.filter(function(e) {
                        return i - e.time < 600;
                    })).length > 1) {
                        p.save();
                        for (var a = 1; a < m.length; a++) {
                            var r = m[a - 1], o = m[a], s = (i - o.time) / 600, l = Math.max(0, 1 - s);
                            p.beginPath(), p.strokeStyle = u, p.globalAlpha = l, p.lineWidth = 4 * l + 1, p.lineCap = "round", 
                            p.moveTo(r.x, r.y), p.lineTo(o.x, o.y), p.stroke();
                        }
                        p.restore();
                    }
                    g >= 0 && v >= 0 && (p.save(), p.shadowColor = u, p.shadowBlur = 16, p.fillStyle = u, 
                    p.beginPath(), p.arc(g, v, 6, 0, 2 * Math.PI), p.fill(), p.fillStyle = "#ffffff", 
                    p.beginPath(), p.arc(g, v, 2.5, 0, 2 * Math.PI), p.fill(), p.restore());
                }
                c && (b = requestAnimationFrame(E));
            }
        }
        function k(e) {
            c = !!e, document.body.classList.toggle("smartboard-active", c), t && (t.style.display = c ? "flex" : "none"), 
            n && (n.style.display = c ? "block" : "none", n.style.pointerEvents = c && "draw" === d ? "auto" : "none", 
            c && w()), c ? (cancelAnimationFrame(b), b = requestAnimationFrame(E)) : (cancelAnimationFrame(b), 
            p && n && p.clearRect(0, 0, n.width, n.height));
        }
        e && e.addEventListener("click", function() {
            k(!c);
        }), i && i.addEventListener("click", function() {
            k(!1);
        }), a && a.addEventListener("click", function() {
            var e = document.getElementById("mapContainer") || document.documentElement;
            document.fullscreenElement ? document.exitFullscreen && document.exitFullscreen() : e.requestFullscreen && e.requestFullscreen();
        }), r && r.addEventListener("click", function() {
            f = [], m = [], p && n && p.clearRect(0, 0, n.width, n.height);
        }), s.forEach(function(e) {
            e.addEventListener("click", function() {
                s.forEach(function(e) {
                    e.classList.remove("active");
                }), this.classList.add("active"), d = this.getAttribute("data-tool") || "laser", 
                n && (n.style.pointerEvents = "draw" === d ? "auto" : "none");
            });
        }), l.forEach(function(e) {
            e.addEventListener("click", function() {
                l.forEach(function(e) {
                    e.classList.remove("active");
                }), this.classList.add("active"), u = this.getAttribute("data-color") || "#ff3344";
            });
        });
        var x = document.getElementById("mapContainer");
        if (x && (x.addEventListener("mousemove", function(e) {
            if (c) {
                var t = x.getBoundingClientRect();
                g = e.clientX - t.left, v = e.clientY - t.top, "laser" === d ? m.push({
                    x: g,
                    y: v,
                    time: performance.now()
                }) : "draw" === d && h && y && (f.push({
                    x1: y.x,
                    y1: y.y,
                    x2: g,
                    y2: v,
                    color: u,
                    width: 3
                }), y = {
                    x: g,
                    y: v
                });
            }
        }), x.addEventListener("mousedown", function(e) {
            if (c && "draw" === d) {
                var t = x.getBoundingClientRect();
                h = !0, y = {
                    x: e.clientX - t.left,
                    y: e.clientY - t.top
                };
            }
        }), window.addEventListener("mouseup", function() {
            h = !1, y = null;
        }), x.addEventListener("mouseleave", function() {
            g = -100, v = -100, h = !1, y = null;
        })), o && t) {
            var _ = !1, C = 0, L = 0, B = 0, S = 0;
            o.addEventListener("mousedown", function(e) {
                _ = !0, C = e.clientX, L = e.clientY;
                var n = t.getBoundingClientRect();
                B = n.left, S = n.top, t.style.transform = "none", t.style.left = B + "px", t.style.top = S + "px", 
                t.style.bottom = "auto", e.preventDefault();
            }), window.addEventListener("mousemove", function(e) {
                if (_) {
                    var n = e.clientX - C, i = e.clientY - L;
                    t.style.left = B + n + "px", t.style.top = S + i + "px";
                }
            }), window.addEventListener("mouseup", function() {
                _ = !1;
            });
        }
        window.addEventListener("resize", function() {
            c && w();
        });
    }(), function() {
        var e = document.getElementById("blankMapWorksheetBtn"), t = document.getElementById("classWorksheetOverlay"), n = document.getElementById("classWorksheetCloseBtn"), i = document.getElementById("worksheetPrintBtn"), a = document.getElementById("worksheetPdfBtn"), r = document.getElementById("worksheetPngBtn"), o = document.getElementById("worksheetMapType"), s = document.getElementById("worksheetSchoolName"), l = document.getElementById("worksheetTeacherName"), c = document.getElementById("worksheetTitleInput"), d = document.getElementById("worksheetInstructionsInput"), u = document.getElementById("worksheetNumberedQuestionsCheck"), p = document.getElementById("worksheetEcoPrintCheck"), m = document.getElementById("worksheetA4Sheet"), f = document.getElementById("worksheetPreviewSvg"), h = document.getElementById("previewSchoolName"), y = document.getElementById("previewTeacherSign"), g = document.getElementById("previewSheetTitle"), v = document.getElementById("previewInstructions"), b = document.getElementById("worksheetSheetQuestions");
        function w() {
            h && s && (h.textContent = s.value || zi("worksheetSchoolName") || "مدرسة / مؤسسة التعليم"), 
            y && l && (y.textContent = (zi("worksheetTeacherPrefix") || "المعلم المشرف: ") + (l.value || ("ar" === Ht ? "أ. أحمد" : "Teacher"))), 
            g && c && (g.textContent = c.value || zi("teacherAssignmentTitle") || "ورقة عمل تطبيقية"), 
            v && d && (v.textContent = d.value || ""), b && u && (b.style.display = u.checked ? "block" : "none"), 
            m && p && m.classList.toggle("eco-print", !!p.checked), function() {
                if (!f) return;
                f.innerHTML = "";
                var e = o ? o.value : "modern_blank", t = document.getElementById("mapSvg");
                if (!t) return;
                var n = document.createElementNS("http://www.w3.org/2000/svg", "g");
                if ("current_era" === e) {
                    var i = t.querySelector("#historyOverlayLayer") || t.querySelector("#historyLayer");
                    if (i) (r = i.cloneNode(!0)).querySelectorAll("path").forEach(function(e) {
                        e.setAttribute("fill", "#ffffff"), e.setAttribute("stroke", "#0f172a"), e.setAttribute("stroke-width", "1");
                    }), n.appendChild(r);
                } else if ("current_traveler" === e) {
                    var a = t.querySelector("#histTravelersLayer") || t.querySelector("#travelerLayer");
                    if (a) {
                        var r = a.cloneNode(!0);
                        n.appendChild(r);
                    }
                }
                var s = t.querySelector("#gCountries") || t.querySelector("#countries") || t.querySelector("#gHistoryLand");
                if (s) {
                    (r = s.cloneNode(!0)).querySelectorAll("path").forEach(function(e) {
                        e.setAttribute("fill", "#ffffff"), e.setAttribute("stroke", "#334155"), e.setAttribute("stroke-width", "0.7"), 
                        e.removeAttribute("style");
                    }), n.appendChild(r);
                } else t.querySelectorAll("path.country, path.feature").forEach(function(e) {
                    var t = e.cloneNode(!0);
                    t.setAttribute("fill", "#ffffff"), t.setAttribute("stroke", "#334155"), t.setAttribute("stroke-width", "0.7"), 
                    n.appendChild(t);
                });
                f.appendChild(n), f.setAttribute("viewBox", t.getAttribute("viewBox") || "0 0 960 500");
            }();
        }
        function E() {
            t && (t.style.display = "none");
        }
        e && e.addEventListener("click", function() {
            t && (t.style.display = "flex"), w();
        }), n && n.addEventListener("click", E), t && t.addEventListener("click", function(e) {
            e.target === t && E();
        }), [ s, l, c, d, u, p, o ].forEach(function(e) {
            e && e.addEventListener("input", w), e && e.addEventListener("change", w);
        }), i && i.addEventListener("click", function() {
            window.print();
        }), a && a.addEventListener("click", function() {
            Fs().then(function() {
                "function" == typeof html2canvas && window.jspdf && m && html2canvas(m, {
                    scale: 2
                }).then(function(e) {
                    var t = new window.jspdf.jsPDF({
                        orientation: "landscape",
                        unit: "mm",
                        format: "a4"
                    }), n = e.toDataURL("image/png");
                    t.addImage(n, "PNG", 10, 10, 277, 190), t.save("Lepidos-Classroom-Worksheet.pdf");
                });
            });
        }), r && r.addEventListener("click", function() {
            Fs().then(function() {
                "function" == typeof html2canvas && m && html2canvas(m, {
                    scale: 2.5
                }).then(function(e) {
                    var t = document.createElement("a");
                    t.download = "Lepidos-Classroom-Worksheet.png", t.href = e.toDataURL("image/png"), 
                    t.click();
                });
            });
        });
    }(), function() {
        var e = document.getElementById("teacherHubBtn"), n = document.getElementById("teacherHubOverlay"), i = document.getElementById("teacherHubCloseBtn"), a = document.getElementById("teacherTabCreateBtn"), r = document.getElementById("teacherTabActiveBtn"), o = document.getElementById("teacherTabCreatePanel"), s = document.getElementById("teacherTabActivePanel"), l = document.getElementById("teacherAssignmentTitleInput"), c = document.getElementById("teacherAssignmentTopic"), d = document.getElementById("teacherNumQuestions"), u = document.getElementById("teacherClassName"), p = document.getElementById("teacherGenerateSessionBtn"), m = document.getElementById("teacherShareCard"), f = document.getElementById("teacherSessionCodeDisplay"), h = document.getElementById("teacherStudentDirectLink"), y = document.getElementById("teacherCopyLinkBtn"), g = document.getElementById("teacherSessionPicker"), v = document.getElementById("teacherRefreshGradebookBtn"), b = document.getElementById("teacherExportCsvBtn"), w = document.getElementById("teacherPrintGradebookBtn"), E = document.getElementById("gradebookTotalStudents"), k = document.getElementById("gradebookAvgScore"), x = document.getElementById("gradebookTopScore"), _ = document.getElementById("teacherGradebookTbody"), C = document.getElementById("studentAssignmentOverlay"), L = document.getElementById("studentFullNameInput"), B = document.getElementById("studentStartAssignmentBtn"), S = "lepidos_teacher_sessions_v1";
        function I() {
            try {
                return JSON.parse(localStorage.getItem(S) || "[]");
            } catch (e) {
                return [];
            }
        }
        function z() {
            if (g) {
                var e = I();
                g.innerHTML = "", 0 !== e.length ? e.forEach(function(e) {
                    var t = document.createElement("option");
                    t.value = e.code, t.textContent = e.title + " (" + e.code + ") — " + (e.className || ""), 
                    g.appendChild(t);
                }) : g.innerHTML = '<option value="">' + (zi("teacherNoSessionsYet") || "لا توجد واجبات مولدة بعد") + "</option>";
            }
        }
        async function A(e) {
            if (e) {
                var t = [];
                if ("function" == typeof window.firebaseGetResultsForSession) try {
                    t = await window.firebaseGetResultsForSession(e);
                } catch (e) {
                    console.warn("Could not fetch session results from Firebase:", e);
                }
                try {
                    var n = JSON.parse(localStorage.getItem("lepidos_quiz_submissions_" + e) || "[]");
                    if (n && n.length > 0) {
                        var i = new Set(t.map(function(e) {
                            return e.studentName;
                        }));
                        n.forEach(function(e) {
                            i.has(e.studentName) || t.push(e);
                        });
                    }
                } catch (e) {
                    console.warn("Could not load local session results:", e);
                }
                var a = t.length, r = 0, o = 0;
                if (0 === a) return E && (E.textContent = "0"), k && (k.textContent = "0%"), x && (x.textContent = "0%"), 
                void (_ && (_.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-muted);">' + zi("teacherNoSubmissions") + "</td></tr>"));
                t.sort(function(e, t) {
                    var n = (e.score || 0) / (e.totalQuestions || e.total || 1);
                    return (t.score || 0) / (t.totalQuestions || t.total || 1) - n;
                });
                var s = "";
                t.forEach(function(e, t) {
                    var n = e.totalQuestions || e.total || 1, i = e.score || 0, a = Math.round(i / n * 100);
                    r += a, a > o && (o = a);
                    var l = {
                        ar: "ar-EG",
                        en: "en-US",
                        ru: "ru-RU",
                        uz: "uz-UZ",
                        es: "es-ES"
                    }[Ht] || "ar-EG", c = e.submittedAt ? new Date(e.submittedAt).toLocaleDateString(l, {
                        hour: "2-digit",
                        minute: "2-digit"
                    }) : "—", d = e.timeTaken ? Math.round(e.timeTaken / 1e3) + " " + (zi("secondsShort") || "ث") : "—";
                    s += "<tr><td><strong>" + (t + 1) + "</strong></td><td><strong>" + Ti(e.studentName || zi("studentDefaultName") || "طالب") + "</strong></td><td>" + i + " / " + n + '</td><td><span class="academic-badge" style="font-size:0.85rem;">' + a + "%</span></td><td>" + d + "</td><td>" + c + "</td></tr>";
                }), E && (E.textContent = String(a)), k && (k.textContent = Math.round(r / a) + "%"), 
                x && (x.textContent = o + "%"), _ && (_.innerHTML = s);
            } else _ && (_.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-muted);">' + zi("teacherNoSubmissions") + "</td></tr>");
        }
        function M() {
            n && (n.style.display = "none");
        }
        function T() {
            var e = (window.location.hash || "").match(/#(?:assignment|quizSession)=([A-Za-z0-9_-]+)/);
            if (e) {
                var t = e[1].toUpperCase();
                if (C) {
                    C.style.display = "flex";
                    var n = document.getElementById("studentAssignmentDescDisplay");
                    n && (n.innerHTML = (zi("studentAssignmentPrompt") || "طلب منك معلمك حل الواجب الصفي (رمز: <strong>{code}</strong>). اكتب اسمك الكامل للبدء:").replace("{code}", t));
                }
                B && (B.onclick = function() {
                    var e = L && L.value.trim() || zi("studentDefaultName") || "طالب";
                    if (e) {
                        It = t, zt = e, C && (C.style.display = "none");
                        var n = document.getElementById("quizBtn") || document.getElementById("quizTab");
                        n && n.click();
                        var i = document.getElementById("quizChoiceSelective");
                        i && i.click();
                        var a = document.getElementById("quizStartBtn");
                        a && a.click();
                    } else L && L.focus();
                });
            }
        }
        e && e.addEventListener("click", function() {
            n && (n.style.display = "flex"), z();
        }), i && i.addEventListener("click", M), n && n.addEventListener("click", function(e) {
            e.target === n && M();
        }), a && r && (a.addEventListener("click", function() {
            a.classList.add("active"), r.classList.remove("active"), o && (o.style.display = "block"), 
            s && (s.style.display = "none");
        }), r.addEventListener("click", function() {
            r.classList.add("active"), a.classList.remove("active"), o && (o.style.display = "none"), 
            s && (s.style.display = "block"), g && g.value && A(g.value);
        })), p && p.addEventListener("click", async function() {
            var consentCheck = document.getElementById("teacherTermsConsentCheck");
            if (consentCheck && !consentCheck.checked) {
                alert(zi("termsMustAccept") || "يرجى الموافقة على شروط الاستخدام وسياسة حماية بيانات الطلاب قبل توليد الواجب.");
                return;
            }
            var e = l && l.value.trim() || zi("teacherDefaultAssignmentTitle") || "واجب الجغرافيا والتاريخ", t = c && c.value || "countries", n = parseInt(d && d.value || "10", 10), i = u && u.value.trim() || "", a = "ABCDEFGHJKLMNPQRSTUVWXYZ", r = "ASG-" + a.charAt(Math.floor(24 * Math.random())) + a.charAt(Math.floor(24 * Math.random())) + Math.floor(100 + 900 * Math.random()), o = {
                code: r,
                title: e,
                topic: t,
                numQuestions: n,
                className: i,
                createdAt: Date.now()
            };
            if ("function" == typeof window.firebaseCreateSession) try {
                await window.firebaseCreateSession(r, o);
            } catch (e) {
                console.warn("Firebase session creation fallback to local:", e);
            }
            !function(e) {
                var t = I();
                t = t.filter(function(t) {
                    return t.code !== e.code;
                }), t.unshift(e);
                try {
                    localStorage.setItem(S, JSON.stringify(t));
                } catch (e) {
                    console.warn("Could not save teacher session to localStorage:", e);
                }
                z();
            }(o);
            var s = window.location.origin + window.location.pathname + "#assignment=" + r;
            f && (f.textContent = r), h && (h.value = s), m && (m.style.display = "flex");
        }), y && h && y.addEventListener("click", function() {
            h.select(), navigator.clipboard.writeText(h.value).then(function() {
                y.innerHTML = '<i data-lucide="check" style="width:14px;height:14px;"></i> ' + zi("teacherLinkCopied"), 
                t(), setTimeout(function() {
                    y.innerHTML = '<i data-lucide="copy" style="width:14px;height:14px;"></i> ' + zi("teacherCopyLink"), 
                    t();
                }, 2500);
            });
        }), g && g.addEventListener("change", function() {
            A(this.value);
        }), v && v.addEventListener("click", function() {
            g && g.value && A(g.value);
        }), b && b.addEventListener("click", function() {
            var e = g ? g.value : "";
            if (e) {
                var t = [];
                t.push([ zi("csvRank") || "الترتيب", zi("csvStudent") || "اسم الطالب", zi("csvScore") || "الدرجة", zi("csvPercentage") || "النسبة المئوية", zi("csvTime") || "الوقت المستغرق", zi("csvDate") || "تاريخ التسليم" ]), 
                _ && _.querySelectorAll("tr").forEach(function(e) {
                    var n = [];
                    e.querySelectorAll("td").forEach(function(e) {
                        n.push('"' + e.textContent.trim().replace(/"/g, '""') + '"');
                    }), 6 === n.length && t.push(n);
                });
                var n = "\ufeff" + t.map(function(e) {
                    return e.join(",");
                }).join("\n"), i = new Blob([ n ], {
                    type: "text/csv;charset=utf-8;"
                }), a = URL.createObjectURL(i), r = document.createElement("a");
                r.href = a, r.download = "Lepidos-Gradebook-" + e + ".csv", r.click();
            }
        }), w && w.addEventListener("click", function() {
            window.print();
        }), window.addEventListener("hashchange", T), setTimeout(T, 400);
    }(), function() {
        var termsBtn = document.getElementById("termsOfServiceBtn"),
            termsOverlay = document.getElementById("termsOverlay"),
            termsCloseBtn = document.getElementById("termsCloseBtn"),
            termsCloseSecondaryBtn = document.getElementById("termsCloseSecondaryBtn"),
            termsAcceptBtn = document.getElementById("termsAcceptBtn"),
            academicTermsBtn = document.getElementById("academicTermsLinkBtn"),
            studentTermsLink = document.getElementById("studentTermsLink"),
            teacherTermsLink = document.getElementById("teacherTermsLink"),
            tabBtns = termsOverlay ? termsOverlay.querySelectorAll(".terms-tab-btn") : [];

        function switchTermsTab(tabName) {
            if (!termsOverlay) return;
            tabBtns.forEach(function(b) {
                b.classList.toggle("active", b.getAttribute("data-tab") === tabName);
            });
            var contents = termsOverlay.querySelectorAll(".terms-tab-content");
            contents.forEach(function(c) {
                var isActive = (c.id === "termsTab_" + tabName);
                c.style.display = isActive ? "block" : "none";
                c.classList.toggle("active", isActive);
            });
        }

        function openTerms(tabName) {
            if (!termsOverlay) return;
            termsOverlay.style.display = "flex";
            switchTermsTab(tabName || "service");
        }

        function closeTerms() {
            if (termsOverlay) termsOverlay.style.display = "none";
        }

        tabBtns.forEach(function(btn) {
            btn.addEventListener("click", function() {
                var tab = this.getAttribute("data-tab");
                if (tab) switchTermsTab(tab);
            });
        });

        if (termsBtn) termsBtn.addEventListener("click", function() { openTerms("service"); });
        if (academicTermsBtn) academicTermsBtn.addEventListener("click", function() { openTerms("cartography"); });
        if (studentTermsLink) studentTermsLink.addEventListener("click", function(e) {
            e.preventDefault();
            openTerms("service");
        });
        if (teacherTermsLink) teacherTermsLink.addEventListener("click", function(e) {
            e.preventDefault();
            openTerms("privacy");
        });

        if (termsCloseBtn) termsCloseBtn.addEventListener("click", closeTerms);
        if (termsCloseSecondaryBtn) termsCloseSecondaryBtn.addEventListener("click", closeTerms);
        if (termsAcceptBtn) termsAcceptBtn.addEventListener("click", function() {
            try {
                localStorage.setItem("lepidos_terms_accepted_v1", "1");
            } catch(e) {}
            closeTerms();
        });

        if (termsOverlay) {
            termsOverlay.addEventListener("click", function(e) {
                if (e.target === termsOverlay) closeTerms();
            });
        }
    }();
}();