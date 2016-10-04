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


module.exports.removeDuplicateCoordinates = (geoJsonFeature) => {

    if (typeof geoJsonFeature == 'object') {
        geoJsonFeature = JSON.stringify(geoJsonFeature);
    }

    const feature = JSON.parse(geoJsonFeature);

    if (feature.geometry.type == 'MultiPolygon') {

        const cleanedPolygons = [];
        feature.geometry.coordinates.forEach((polygon) => {
            cleanedPolygons.push(removeDuplicatesFromPolygon(polygon));
        });

        feature.geometry.coordinates = cleanedPolygons;
    } else if (feature.geometry.type == 'Polygon') {

        const cleanedPolygon = removeDuplicatesFromPolygon(feature.geometry.coordinates);
        feature.geometry.coordinates = cleanedPolygon;
    } else {

        throw new Error(`Feature type ${feature.geometry.type} not supported.`);
    }

    return feature;
};
