const removeDuplicatesFromPolygon = (polygon) => {

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

const detectDuplicatesOnPolygon = (polygon) => {

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

module.exports.detectDupeCoords = (geoJsonFeature) => {

    if (typeof geoJsonFeature == 'string') {
        geoJsonFeature = JSON.parse(geoJsonFeature);
    }

    var dupeCoords = [];

    if (geoJsonFeature.geometry.type == 'MultiPolygon') {

        geoJsonFeature.geometry.coordinates.forEach((polygon) => {
            const dupesOnPolygon = detectDuplicatesOnPolygon(polygon);
            dupeCoords = dupeCoords.concat(dupesOnPolygon);
        });
    } else if (geoJsonFeature.geometry.type == 'Polygon') {

        const dupesOnPolygon = detectDuplicatesOnPolygon(geoJsonFeature.geometry.coordinates);
        dupeCoords = dupesOnPolygon;
    } else {

        throw new Error(`Feature type ${geoJsonFeature.geometry.type} not supported.`);
    }

    if (dupeCoords.length) {
        return dupeCoords;
    }

    return false;
};


module.exports.removeDupeCoords = (geoJsonFeature) => {

    if (typeof geoJsonFeature == 'object') {
        geoJsonFeature = JSON.stringify(geoJsonFeature);
    }

    const cleaned = JSON.parse(geoJsonFeature);

    if (cleaned.geometry.type == 'MultiPolygon') {

        const cleanedPolygons = [];
        cleaned.geometry.coordinates.forEach((polygon) => {
            cleanedPolygons.push(removeDuplicatesFromPolygon(polygon));
        });

        cleaned.geometry.coordinates = cleanedPolygons;
    } else if (cleaned.geometry.type == 'Polygon') {

        const cleanedPolygon = removeDuplicatesFromPolygon(cleaned.geometry.coordinates);
        cleaned.geometry.coordinates = cleanedPolygon;
    } else {

        throw new Error(`Feature type ${cleaned.geometry.type} not supported.`);
    }

    return cleaned;
};
