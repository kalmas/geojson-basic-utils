Library module with some *very* basic helper methods for working with GeoJSON objects.

* **detectDupeCoords(geoJsonFeature)** - find any duplicate points in [GeoJSON Feature](http://geojson.org/geojson-spec.html#feature-objects). Return list of points.
* **removeDupeCoords(geoJsonFeature)** - remove duplicate points from [GeoJSON Feature](http://geojson.org/geojson-spec.html#feature-objects), keeping the first. Return new cleaned object.
* **detectAndRemoveDupeCoords(geoJsonFeature)** - Check for duplicates, print any that are found and remove them.