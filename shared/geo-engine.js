/**
 * Lepidos Atlas & Nation Simulation — Shared Geo-Inference Engine (النواة الجغرافية المشتركة)
 * Pure GIS & cartographic intelligence library.
 * Zero external framework dependencies. Works in browsers and Node.js.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.GeoEngine = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {
    'use strict';

    // ══════════════════════════════════════════════════════════════════════════════
    // 1. GEOGRAPHICAL REFERENCE FEATURES (المعالم الجغرافية المرجعية)
    // ══════════════════════════════════════════════════════════════════════════════
    var RIVERS = [
        { name: "Nile", points: [[31.2, 22.0], [31.2, 26.0], [31.2, 30.0], [31.5, 31.5]] },
        { name: "TigrisEuphrates", points: [[44.0, 32.5], [40.5, 36.5], [43.5, 35.0], [47.5, 30.5]] },
        { name: "Indus", points: [[68.0, 25.0], [71.5, 31.0], [72.5, 33.5]] },
        { name: "DanubeRhine", points: [[18.0, 45.0], [24.0, 44.5], [12.0, 48.0]] }
    ];

    var MOUNTAINS = [
        { name: "TaurusZagros", points: [[32.5, 37.5], [36.0, 38.0], [42.0, 38.5], [46.0, 35.0], [49.0, 32.5]] },
        { name: "Caucasus", points: [[42.0, 42.5], [45.0, 42.0], [47.5, 41.5]] },
        { name: "Atlas", points: [[-6.0, 32.0], [-2.0, 33.5], [3.0, 35.0]] },
        { name: "Alps", points: [[8.0, 46.0], [11.0, 46.5], [14.0, 46.5]] },
        { name: "HinduKush", points: [[68.5, 35.0], [71.5, 36.0], [74.0, 36.5]] }
    ];

    var COASTS = [
        { name: "Mediterranean", points: [[30.0, 31.5], [34.0, 32.0], [25.0, 35.0], [15.0, 36.0], [5.0, 37.0], [-2.0, 36.0], [28.0, 36.5], [35.5, 34.5]] },
        { name: "RedSea", points: [[34.0, 27.5], [37.0, 22.0], [41.0, 16.0], [43.0, 13.0]] },
        { name: "PersianGulf", points: [[50.0, 28.0], [53.0, 25.5], [56.0, 26.5]] },
        { name: "BlackSea", points: [[30.0, 43.0], [35.0, 43.5], [39.0, 42.5]] },
        { name: "Caspian", points: [[50.0, 40.0], [51.5, 43.0], [52.0, 37.5]] },
        { name: "ArabianSea", points: [[58.0, 22.0], [64.0, 24.5], [68.0, 23.0]] }
    ];

    // Strategic Choke Points (المضائق والثغور الاستراتيجية)
    var CHOKE_POINTS_DATA = [
        { id: "mandeb", name: "مضيق باب المندب (بوابة البحر الأحمر)", shortName: "مضيق باب المندب", coords: [43.34, 12.58], controller: "desert", bonus: "+30% دفاع بحري وبري" },
        { id: "hormuz", name: "مضيق هرمز (عقدة تجارة التوابل)", shortName: "مضيق هرمز", coords: [56.45, 26.56], controller: "desert", bonus: "+30% رسوم ترانزيت" },
        { id: "cilician", name: "بوابات قيليقية (الممر الجبلي للأناضول)", shortName: "بوابات قيليقية", coords: [34.78, 37.28], controller: "anatolia", bonus: "+30% حصانة دفاعية" },
        { id: "khyber", name: "ممر خيبر (بوابة الهند وآسيا الوسطى)", shortName: "ممر خيبر", coords: [71.15, 34.10], controller: "steppes", bonus: "+30% كمائن فرسان" },
        { id: "gibraltar", name: "مضيق جبل طارق (معبر الأطلسي والمتوسط)", shortName: "مضيق جبل طارق", coords: [-5.35, 35.98], controller: "mediterranean", bonus: "+30% سيطرة بحرية" }
    ];

    var NATION_COLOR_PALETTE = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316", "#84cc16", "#a855f7", "#14b8a6"];
    var NATION_FLAG_PALETTE = ["🦅", "🏔️", "🐪", "⛵", "🏹", "🦁", "⚔️", "🌴", "👑", "🛡️"];

    // ══════════════════════════════════════════════════════════════════════════════
    // 2. MATHEMATICAL & GEODESIC HELPERS (دوال الحسابات الهندسية)
    // ══════════════════════════════════════════════════════════════════════════════

    /**
     * Calculates the spherical distance in radians between two [lng, lat] points.
     * Uses d3.geoDistance if available, otherwise Haversine great-circle formula.
     */
    function calcGeoDistanceRad(p1, p2) {
        if (!Array.isArray(p1) || !Array.isArray(p2) || p1.length < 2 || p2.length < 2) return 0;
        if (typeof d3 !== "undefined" && typeof d3.geoDistance === "function") {
            return d3.geoDistance(p1, p2);
        }
        var lon1 = p1[0] * Math.PI / 180;
        var lat1 = p1[1] * Math.PI / 180;
        var lon2 = p2[0] * Math.PI / 180;
        var lat2 = p2[1] * Math.PI / 180;
        var dLat = lat2 - lat1;
        var dLon = lon2 - lon1;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
    }

    /**
     * Calculates distance in kilometers between two [lng, lat] points.
     */
    function calcGeoDistanceKm(p1, p2) {
        var rad = calcGeoDistanceRad(p1, p2);
        return Math.max(1, Math.round(rad * 6371));
    }

    /**
     * Calculates centroid [lng, lat] of a polygon.
     */
    function calculateCentroid(points) {
        if (!points || !points.length) return [0, 0];
        var sumLng = 0, sumLat = 0;
        for (var i = 0; i < points.length; i++) {
            sumLng += points[i][0];
            sumLat += points[i][1];
        }
        return [sumLng / points.length, sumLat / points.length];
    }

    /**
     * Measures minimum Euclidean degrees distance from centroid and vertices to features.
     */
    function minDistanceToFeatures(cLng, cLat, polygonPoints, features) {
        var minDist = Infinity;
        features.forEach(function(feat) {
            feat.points.forEach(function(fp) {
                var dCentroid = Math.hypot(cLng - fp[0], cLat - fp[1]);
                if (dCentroid < minDist) minDist = dCentroid;
                polygonPoints.forEach(function(pt) {
                    var d = Math.hypot(pt[0] - fp[0], pt[1] - fp[1]);
                    if (d < minDist) minDist = d;
                });
            });
        });
        return minDist;
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // 3. CORE GEOPOLITICAL INFERENCE ENGINE (محرك الاستدلال الجيوسياسي)
    // ══════════════════════════════════════════════════════════════════════════════

    /**
     * Infers the primary biome and geographic conditions from polygon points.
     */
    function inferBiome(cLng, cLat, polygonPoints) {
        var distRiver = minDistanceToFeatures(cLng, cLat, polygonPoints, RIVERS);
        var distMountain = minDistanceToFeatures(cLng, cLat, polygonPoints, MOUNTAINS);
        var distCoast = minDistanceToFeatures(cLng, cLat, polygonPoints, COASTS);

        var isSteppe = cLat >= 37 && cLng >= 46 && distMountain > 2.5;
        var isDesert = cLat >= 12 && cLat <= 32 && cLng >= 12 && cLng <= 56 && distRiver > 2.5 && distCoast > 2.0;

        var primaryBiome = "temperate";
        if (distRiver <= 2.8 && distRiver < distMountain && distRiver < distCoast) {
            primaryBiome = "river";
        } else if (distMountain <= 3.6 && distMountain <= distRiver) {
            primaryBiome = "mountain";
        } else if (distCoast <= 2.8 && distCoast <= distMountain && distCoast <= distRiver) {
            primaryBiome = "coast";
        } else if (distRiver <= 3.2) {
            primaryBiome = "river";
        } else if (distMountain <= 4.0) {
            primaryBiome = "mountain";
        } else if (distCoast <= 3.5) {
            primaryBiome = "coast";
        } else if (isSteppe) {
            primaryBiome = "steppe";
        } else if (isDesert) {
            primaryBiome = "desert";
        } else {
            if (cLat >= 35) primaryBiome = "mountain";
            else primaryBiome = "desert";
        }

        return {
            primaryBiome: primaryBiome,
            distRiver: distRiver,
            distMountain: distMountain,
            distCoast: distCoast,
            isSteppe: isSteppe,
            isDesert: isDesert
        };
    }

    /**
     * Main Geo-Inference function: takes polygon coordinates and optional custom name,
     * returns complete realistic socio-economic-military country profile.
     *
     * @param {Array<Array<number>>} polygonPoints - Array of [lng, lat] points
     * @param {string} [customName] - Optional custom name for the nation
     * @param {number} [nationIndex] - Optional 1-based index for naming and palette assignment
     */
    function inferTerritoryGeoProfile(polygonPoints, customName, nationIndex) {
        if (!polygonPoints || polygonPoints.length < 3) return null;

        var closedTerritory = polygonPoints.slice();
        var p0 = closedTerritory[0];
        var pLast = closedTerritory[closedTerritory.length - 1];
        if (Math.abs(p0[0] - pLast[0]) > 0.001 || Math.abs(p0[1] - pLast[1]) > 0.001) {
            closedTerritory.push([p0[0], p0[1]]);
        }

        var centroid = calculateCentroid(polygonPoints);
        var cLng = centroid[0];
        var cLat = centroid[1];

        var biomeRes = inferBiome(cLng, cLat, polygonPoints);
        var primaryBiome = biomeRes.primaryBiome;

        var count = (typeof nationIndex === "number" && nationIndex > 0)
            ? nationIndex
            : ((typeof window !== "undefined" && window.simState && window.simState.customNations)
                ? Object.keys(window.simState.customNations).length + 1
                : 1);

        var color = NATION_COLOR_PALETTE[(count - 1) % NATION_COLOR_PALETTE.length];
        var flag = NATION_FLAG_PALETTE[(count - 1) % NATION_FLAG_PALETTE.length];

        var biomeTitle = "";
        var climateSummary = "";
        var climateDetailed = "";
        var initialFood = 700;
        var initialMetals = 500;
        var initialLivestock = 500;
        var initialGold = 800;
        var initialTroops = 1500;
        var consumptionRate = 75;
        var initialInfantry = 700;
        var initialArchers = 500;
        var initialCavalry = 300;
        var defenseDescription = "";
        var seasonsForecastList = [];

        if (primaryBiome === "river") {
            biomeTitle = "إقليم فيضي نهري زراعي (أحواض الأنهار والسهول الفيضية)";
            climateSummary = "فيضان موسمي متجدد وطمي عالي الخصوبة";
            climateDetailed = "مورد مائي عذب دائم وتربة طميية تجدد خصوبة الأراضي سنوياً، مما يمنح وفرة كبرى في الغلال وتفوقاً في الاستقرار السكاني وتغذية الجيوش.";
            initialFood = 1450;
            initialMetals = 330;
            initialLivestock = 350;
            initialGold = 950;
            initialTroops = 1600;
            consumptionRate = 85;
            initialInfantry = 900;
            initialArchers = 450;
            initialCavalry = 250;
            defenseDescription = "حواجز مائية طبيعية وسهولة نقل الحاميات بالقوارب النهرية؛ ركزوا على صيانة وحماية الجسور والسدود الكبرى ضد التخريب.";
            seasonsForecastList = [
                "🌱 ربيع: انطلاق مواسم البذر وتصريف مياه الجداول واعتدال المجرى النهري.",
                "☀️ صيف: موسم الفيضان الموسمي وارتفاع منسوب النهر وجلب الطمي الخصب (+25% إنتاج غلال).",
                "🍂 خريف: حصاد الحبوب وتعبئة الصوامع الكبرى وتأمين السدود.",
                "❄️ شتاء: اعتدال دافئ وانطلاق القوافل النهرية والبرية نحو الموانئ."
            ];
        } else if (primaryBiome === "mountain") {
            biomeTitle = "إقليم تضاريسي جبلي ومناجم حصينة";
            climateSummary = "شتاء مثلج قارس وثروات معدنية وحصانة ثغور";
            climateDetailed = "مرتفعات شاهقة غنية بركاز الحديد والنحاس والأحجار الكريمة، وممرات وعرة تمنح تفوقاً دفاعياً هائلاً يجعل الغزو الخارجي شبه مستحيل.";
            initialFood = 620;
            initialMetals = 1180;
            initialLivestock = 400;
            initialGold = 820;
            initialTroops = 1850;
            consumptionRate = 70;
            initialInfantry = 1200;
            initialArchers = 400;
            initialCavalry = 250;
            defenseDescription = "حصانة تضاريسية مطلقة؛ تمنح الخوانق والممرات حامياتكم +35% قدرة صد هجومي ومكافأة كاسحة في معارك الثغور.";
            seasonsForecastList = [
                "🌱 ربيع: ذوبان الثلوج وفتح الممرات وتدفق مياه الينابيع العذبة.",
                "☀️ صيف: ذروة استخراج المعادن وتشغيل أفران الحدادة وصناعة الدروع والسيوف.",
                "🍂 خريف: تخزين الحطب والعتاد وإحكام إغلاق الثغور قبل الصقيع.",
                "❄️ شتاء: ثلوج كثيفة تغلق الممرات الجبلية وتشل حركة أي غزو خارجي بنسبة 100%."
            ];
        } else if (primaryBiome === "coast") {
            biomeTitle = "إقليم ساحلي بحري وموانئ تجارية";
            climateSummary = "رياح بحرية مواتية للتجارة وعواصف خريفية";
            climateDetailed = "واجهة بحرية استراتيجية ومرافئ طبيعية عميقة تؤمن أساطيل تجارية عابرة، وثروة نقدية هائلة من الرسوم الجمركية والمقايضات البحرية.";
            initialFood = 760;
            initialMetals = 480;
            initialLivestock = 300;
            initialGold = 1450;
            initialTroops = 1450;
            consumptionRate = 75;
            initialInfantry = 700;
            initialArchers = 500;
            initialCavalry = 250;
            defenseDescription = "أساطيل بحرية وموانئ مسورة تؤمن خطوط الإمداد وتحمي ثغور الساحل؛ تحكمكم بالممر المائي يدر رسوم ترانزيت مستمرة.";
            seasonsForecastList = [
                "🌱 ربيع: إبحار الأساطيل التجارية واعتدال حركة الرياح والملاحة البحرية.",
                "☀️ صيف: ذروة التبادل التجاري ووصول السفن المحملة بالتوابل والحرير (+20% دخل ذهبي).",
                "🍂 خريف: عواصف موسمية تتطلب الحذر ورسو السفن في المرافئ الآمنة.",
                "❄️ شتاء: أمطار شتوية غزيرة تدعم الزراعة البعلية ومخازن المؤن الساحلية."
            ];
        } else if (primaryBiome === "steppe") {
            biomeTitle = "إقليم سهوب ومراعي قارية فسيحة";
            climateSummary = "شتاء متجمد يشل الحركة؛ صيف مرعى فسيح للجياد";
            climateDetailed = "مراعي لا نهائية تدعم تربية خيرة سلالات الخيل وتدريب فرق الخيالة السريعة، وتفوق هجومي بحركات الفرسان والالتفاف العسكري.";
            initialFood = 780;
            initialMetals = 450;
            initialLivestock = 1300;
            initialGold = 760;
            initialTroops = 2150;
            consumptionRate = 90;
            initialInfantry = 600;
            initialArchers = 650;
            initialCavalry = 900;
            defenseDescription = "مرونة استراتيجية فائقة؛ قدرة مباغتة سريعة بالخيالة ورصد استباقي لأي تقدم للخصوم عبر السهول الشاسعة.";
            seasonsForecastList = [
                "🌱 ربيع: اخضرار المراعي وتكاثر قطعان الخيل والمواشي وتدريب الفرسان.",
                "☀️ صيف: سهولة تنقل القوافل والخيالة عبر مسارات طريق الحرير دون عوائق.",
                "🍂 خريف: جمع الأعلاف وتسمين الجياد استعداداً لموسم الصقيع القاري.",
                "❄️ شتاء: صقيع قاري شديد البرودة ورياح جليدية تحد من نشاط التجارة."
            ];
        } else {
            biomeTitle = "إقليم صحراوي وتجارة قوافل وواحات";
            climateSummary = "قيظ صيفي شديد؛ رحلة شتاء رعي وتجارة ذهبية";
            climateDetailed = "عمق استراتيجي صحراوي شاسع وواحات نخيل وآبار حيوية، واعتماد كلي على قوافل الإبل وخطوط المقايضة الطويلة التي لا تجرؤ الجيوش الثقيلة على خوضها.";
            initialFood = 580;
            initialMetals = 410;
            initialLivestock = 920;
            initialGold = 1180;
            initialTroops = 1350;
            consumptionRate = 65;
            initialInfantry = 550;
            initialArchers = 350;
            initialCavalry = 450;
            defenseDescription = "عمق صحراوي جاف يشكل خط دفاع طبيعي ينهك أي جيش غازٍ لا يملك أدلة متمرسين وخبرة بطرق الآبار والمسالك.";
            seasonsForecastList = [
                "🌱 ربيع: اعتدال الطقس ورعي الإبل في الفياض والمراعي الموسمية.",
                "☀️ صيف: قيظ صيفي شديد يتطلب التمركز في الواحات والآبار المحمية وتجنب الحركة النهارية.",
                "🍂 خريف: انكسار موجة الحر وتجهيز القوافل الكبرى لنقل التمور والتوابل.",
                "❄️ شتاء: رحلة الشتاء الذهبية وانطلاق القوافل التجارية في أبهى مواسمها (+20% أرباح)."
            ];
        }

        var defaultName = "";
        if (primaryBiome === "river") defaultName = "مملكة الأحواض النهرية " + count;
        else if (primaryBiome === "mountain") defaultName = "إمارة القمم الحصينة " + count;
        else if (primaryBiome === "coast") defaultName = "جمهورية السواحل والتجارة " + count;
        else if (primaryBiome === "steppe") defaultName = "خانية السهوب والخيالة " + count;
        else defaultName = "سلطنة الواحات والرمال " + count;

        var nationName = (customName && customName.trim().length > 0) ? customName.trim() : defaultName;
        var capitalName = "حاضرة " + (customName && customName.trim().length > 0 ? customName.trim().split(" ").slice(-1)[0] : ("الإقليم " + count));
        var customId = "custom_" + Date.now() + "_" + Math.floor(Math.random() * 1000);

        return {
            id: customId,
            name: nationName,
            flag: flag,
            capital: capitalName,
            coords: [parseFloat(cLng.toFixed(2)), parseFloat(cLat.toFixed(2))],
            color: color,
            biome: biomeTitle,
            climate: climateSummary,
            climateDesc: climateDetailed,
            territory: closedTerritory,
            food: initialFood,
            metals: initialMetals,
            livestock: initialLivestock,
            gold: initialGold,
            troops: initialTroops,
            consumption: consumptionRate,
            infantry: initialInfantry,
            archers: initialArchers,
            cavalry: initialCavalry,
            allies: [],
            enemies: [],
            truces: [],
            budget: { economy: 100, military: 100, planning: 100, intelligence: 100 },
            taxPolicy: "moderate",
            expeditionaryForce: null,
            decrees: ["📜 وثيقة تأسيس الأمة وترسيم الحدود السيادية على الخريطة الجغرافية."],
            seasonsForecast: seasonsForecastList,
            defenseDesc: defenseDescription,
            assignedTeam: null
        };
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // 4. DISTANCE, TERRAIN FRICTION & TRAVEL TIME (حساب المسافات واحتكاك التضاريس)
    // ══════════════════════════════════════════════════════════════════════════════

    /**
     * Calculates geodesic distance, terrain friction multiplier, and travel times.
     *
     * @param {Array<number>} origCoords - [lng, lat] of origin
     * @param {Array<number>} targCoords - [lng, lat] of target
     * @param {string} [origKey] - Origin key or region type (e.g. "anatolia", "desert", "steppes")
     * @param {string} [targKey] - Target key or region type
     */
    function calculateDistanceAndFriction(origCoords, targCoords, origKey, targKey) {
        if (!Array.isArray(origCoords) || !Array.isArray(targCoords) || origCoords.length < 2 || targCoords.length < 2) {
            return null;
        }

        var distRad = calcGeoDistanceRad(origCoords, targCoords);
        var distKm = Math.max(1, Math.round(distRad * 6371));
        var friction = 1.0;
        var frictionLabel = "1.0x (سهول ممهدة وطرق نهرية)";

        if (origKey === "anatolia" || targKey === "anatolia") {
            friction = 1.35;
            frictionLabel = "1.35x (ممرات جبلية شديدة الوعورة)";
        } else if (origKey === "desert" || targKey === "desert") {
            friction = 1.25;
            frictionLabel = "1.25x (كثبان رملية ومسافات بين الآبار)";
        } else if (origKey === "steppes" || targKey === "steppes") {
            friction = 1.15;
            frictionLabel = "1.15x (سهوب فسيحة وسرعة فرسان)";
        }

        var hours = Math.max(4, Math.round((distKm * friction) / 25));
        var daysHist = Math.max(1, Math.round(hours / 2));

        return {
            distRad: distRad,
            distKm: distKm,
            friction: friction,
            frictionLabel: frictionLabel,
            hours: hours,
            daysHist: daysHist
        };
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // 5. CIVILIZATION POWER SCORE INDEX (مؤشر القوة الحضارية وترتيب القوى)
    // ══════════════════════════════════════════════════════════════════════════════

    /**
     * Calculates the Civilization Power Index scores for all nations and returns them sorted descending.
     * Formula: (food*0.5) + (metals*1.2) + (livestock*1.0) + (gold*1.5) + (troops*0.8) + (cpCount*300) + (treatiesCount*150)
     *
     * @param {Object} nationsData - Map of nation id to nation object
     * @param {Array<Object>} [chokePoints] - Optional array of choke points (defaults to CHOKE_POINTS_DATA)
     * @returns {Array<{id: string, name: string, score: number}>} Sorted rankings
     */
    function calculateCivilizationScores(nationsData, chokePoints) {
        if (!nationsData || typeof nationsData !== "object") return [];
        var cps = Array.isArray(chokePoints) ? chokePoints : CHOKE_POINTS_DATA;

        var ranked = Object.keys(nationsData).map(function(k) {
            var n = nationsData[k];
            if (!n) return { id: k, name: k, score: 0 };
            var cpCount = cps.filter(function(cp) { return cp.controller === n.id; }).length;
            var treatiesCount = (n.allies ? n.allies.length : 0) + (n.truces ? n.truces.length : 0);
            var score = Math.round(
                ((n.food || 0) * 0.5) +
                ((n.metals || 0) * 1.2) +
                ((n.livestock || 0) * 1.0) +
                ((n.gold || 0) * 1.5) +
                ((n.troops || 0) * 0.8) +
                (cpCount * 300) +
                (treatiesCount * 150)
            );
            return { id: n.id, name: n.name || k, score: score };
        });

        ranked.sort(function(a, b) { return b.score - a.score; });
        return ranked;
    }

    /**
     * Returns a deep clone of the strategic choke points dataset.
     */
    function getChokePoints() {
        return JSON.parse(JSON.stringify(CHOKE_POINTS_DATA));
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // 6. PUBLIC API EXPORTS (واجهة الاستدعاء العامة)
    // ══════════════════════════════════════════════════════════════════════════════
    return {
        RIVERS: RIVERS,
        MOUNTAINS: MOUNTAINS,
        COASTS: COASTS,
        CHOKE_POINTS_DATA: CHOKE_POINTS_DATA,
        getChokePoints: getChokePoints,
        calcGeoDistanceRad: calcGeoDistanceRad,
        calcGeoDistanceKm: calcGeoDistanceKm,
        calculateCentroid: calculateCentroid,
        inferBiome: inferBiome,
        inferTerritoryGeoProfile: inferTerritoryGeoProfile,
        calculateDistanceAndFriction: calculateDistanceAndFriction,
        calculateCivilizationScores: calculateCivilizationScores
    };
}));
