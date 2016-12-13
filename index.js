const private = {};

private.removeDuplicatesFromPolygon = (polygon) => {

    const cleanPolygon = [];
    polygon.forEach(ring => {

        const coordinateIndex = {};
        const cleanRing = [];
        ring.forEach((coordPair, i) => {

            const key = JSON.stringify(coordPair);

            if(i == (ring.length - 1) || ! (key in coordinateIndex)) {
                coordinateIndex[key] = true;
                cleanRing.push(coordPair);
            }
        });

        cleanPolygon.push(cleanRing);
    });

    return cleanPolygon;
};

private.detectDuplicatesOnPolygon = (polygon) => {

    const dupesOnPolygon = [];
    polygon.forEach(ring => {

        const coordinateIndex = {};
        ring.forEach((coordPair, i) => {

            const key = JSON.stringify(coordPair);

            if(i != (ring.length - 1) && (key in coordinateIndex)) {
                dupesOnPolygon.push(coordPair);
            }

            coordinateIndex[key] = true;
        });

    });

    return dupesOnPolygon;
};

exports.detectDupeCoords = (geoJsonFeature) => {

    if (typeof geoJsonFeature == 'string') {
        geoJsonFeature = JSON.parse(geoJsonFeature);
    }

    var dupeCoords = [];

    if (geoJsonFeature.geometry.type == 'MultiPolygon') {

        geoJsonFeature.geometry.coordinates.forEach((polygon) => {
            const dupesOnPolygon = private.detectDuplicatesOnPolygon(polygon);
            dupeCoords = dupeCoords.concat(dupesOnPolygon);
        });
    } else if (geoJsonFeature.geometry.type == 'Polygon') {

        const dupesOnPolygon = private.detectDuplicatesOnPolygon(geoJsonFeature.geometry.coordinates);
        dupeCoords = dupesOnPolygon;
    }

    if (dupeCoords.length) {
        return dupeCoords;
    }

    return false;
};


exports.removeDupeCoords = (geoJsonFeature) => {

    if (typeof geoJsonFeature == 'object') {
        geoJsonFeature = JSON.stringify(geoJsonFeature);
    }

    const cleaned = JSON.parse(geoJsonFeature);

    if (cleaned.geometry.type == 'MultiPolygon') {

        const cleanedPolygons = [];
        cleaned.geometry.coordinates.forEach((polygon) => {
            cleanedPolygons.push(private.removeDuplicatesFromPolygon(polygon));
        });

        cleaned.geometry.coordinates = cleanedPolygons;
    } else if (cleaned.geometry.type == 'Polygon') {

        const cleanedPolygon = private.removeDuplicatesFromPolygon(cleaned.geometry.coordinates);
        cleaned.geometry.coordinates = cleanedPolygon;
    }

    return cleaned;
};

exports.detectAndRemoveDupeCoords = (geoJsonFeature, logFunction) => {
    const dupes = exports.detectDupeCoords(geoJsonFeature);
    if (dupes) {
        if (typeof logFunction == 'function') {
            logFunction(`Attempting to remove dupe coordinates.\n` +
            `   ${JSON.stringify(dupes)}`);
        }

        return exports.removeDupeCoords(geoJsonFeature);
    }

    return geoJsonFeature;
};


