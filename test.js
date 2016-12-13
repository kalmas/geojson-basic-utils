/*global describe*/
/*global it*/
const chai = require('chai');
const utils = require('./index');

chai.should();

function makeFeature(geometry) {
    return {
        type: 'Feature',
        properties: {},
        geometry: geometry
    };
}

describe('#detectDupeCoords()', () => {

    it('should detect duplicate coordinates on Polygon', () => {
        const geo = {
            type: 'Polygon',
            coordinates: [
                [
                    [-75.111111,40.111111],
                    [-75.123456,40.123456],
                    [-75.111111,40.111111],
                ],
                [
                    [-75.111111,40.111111],
                    [-75.123456,40.123456],
                    [-75.222222,40.222222],
                    [-75.333333,40.333333],
                    [-75.444444,40.444444],
                    [-75.123456,40.123456], // Duplicate
                    [-75.444444,40.444444],
                    [-75.111111,40.111111]
                ]
            ]
        };

        const result = utils.detectDupeCoords(makeFeature(geo));

        result.should.have.lengthOf(2);
        result[0].should.deep.equal([-75.123456,40.123456]);
        result[1].should.deep.equal([-75.444444,40.444444]);
    });

    it('should detect duplicate coordinates on MultiPolygon', () => {
        const geo = {
            type: 'MultiPolygon',
            coordinates: [
                [
                    [
                        [-75.111111,40.111111],
                        [-75.222222,40.222222],
                        [-75.222222,40.222222], // Duplicate
                        [-75.111111,40.111111]
                    ],
                    [
                        [-75.111111,40.111111],
                        [-75.123456,40.123456],
                        [-75.222222,40.222222],
                        [-75.333333,40.333333],
                        [-75.444444,40.444444],
                        [-75.123456,40.123456], // Duplicate
                        [-75.111111,40.111111]
                    ],
                    [
                        [-75.111111,40.111111],
                        [-75.222222,40.222222],
                        [-75.333333,40.333333],
                        [-75.111111,40.111111]
                    ]
                ]
            ]
        };

        const result = utils.detectDupeCoords(makeFeature(geo));

        result.should.have.lengthOf(2);
        result[0].should.deep.equal([-75.222222,40.222222]);
        result[1].should.deep.equal([-75.123456,40.123456]);
    });

    it('should return false if no duplicates', () => {
        const geo = {
            type: 'Polygon',
            coordinates: [
                [
                    [-75.111111,40.111111],
                    [-75.123456,40.123456],
                    [-75.111111,40.111111],
                ],
                [
                    [-75.111111,40.111111],
                    [-75.123456,40.123456],
                    [-75.222222,40.222222],
                    [-75.333333,40.333333],
                    [-75.444444,40.444444],
                    [-75.111111,40.111111]
                ]
            ]
        };

        const result = utils.detectDupeCoords(makeFeature(geo));

        result.should.be.false;
    });


    it('should detect multiple duplicates', () => {
        const geo = {
            type: 'Polygon',
            coordinates: [
                [
                    [-75.111111,40.111111],
                    [-75.222222,40.222222],
                    [-75.333333,40.333333],
                    [-75.111111,40.111111],
                    [-75.444444,40.444444],
                    [-75.333333,40.333333],
                    [-75.111111,40.111111]
                ]
            ]
        };

        const result = utils.detectDupeCoords(makeFeature(geo));

        result.should.have.lengthOf(2);
        result[0].should.deep.equal([-75.111111,40.111111]);
        result[1].should.deep.equal([-75.333333,40.333333]);
    });
});





describe('#removeDupeCoords()', () => {

    it('should remove duplicate coordinate from Polygon', () => {
        const geo = {
            type: 'Polygon',
            coordinates: [
                [
                    [-75.111111,40.111111],
                    [-75.123456,40.123456],
                    [-75.222222,40.222222],
                    [-75.333333,40.333333],
                    [-75.444444,40.444444],
                    [-75.123456,40.123456], // Duplicate
                    [-75.111111,40.111111]
                ]
            ]
        };

        const result = utils.removeDupeCoords(makeFeature(geo));

        // Should have duplicate removed
        result.geometry.coordinates[0].should.have.lengthOf(6);
        result.geometry.coordinates[0][0].should.deep.equal([-75.111111,40.111111]);
        result.geometry.coordinates[0][1].should.deep.equal([-75.123456,40.123456]);
        result.geometry.coordinates[0][2].should.deep.equal([-75.222222,40.222222]);
        result.geometry.coordinates[0][3].should.deep.equal([-75.333333,40.333333]);
        result.geometry.coordinates[0][4].should.deep.equal([-75.444444,40.444444]);
        result.geometry.coordinates[0][5].should.deep.equal([-75.111111,40.111111]);
    });


    it('should remove multiple duplicate coordinates from Polygon', () => {
        const geo = {
            type: 'Polygon',
            coordinates: [
                [
                    [-75.111111,40.111111],
                    [-75.222222,40.222222],
                    [-75.333333,40.333333],
                    [-75.111111,40.111111],
                    [-75.444444,40.444444],
                    [-75.333333,40.333333],
                    [-75.111111,40.111111]
                ]
            ]
        };

        const result = utils.removeDupeCoords(makeFeature(geo));

        // Should have duplicate removed
        result.geometry.coordinates[0].should.have.lengthOf(5);
        result.geometry.coordinates[0][0].should.deep.equal([-75.111111,40.111111]);
        result.geometry.coordinates[0][1].should.deep.equal([-75.222222,40.222222]);
        result.geometry.coordinates[0][2].should.deep.equal([-75.333333,40.333333]);
        result.geometry.coordinates[0][3].should.deep.equal([-75.444444,40.444444]);
        result.geometry.coordinates[0][4].should.deep.equal([-75.111111,40.111111]);
    });


    it('should remove duplicate coordinate from MultiPolygon', () => {
        const geo = {
            type: 'MultiPolygon',
            coordinates: [
                [
                    [
                        [-75.111111,40.111111],
                        [-75.222222,40.222222],
                        [-75.111111,40.111111]
                    ],
                    [
                        [-75.111111,40.111111],
                        [-75.123456,40.123456],
                        [-75.222222,40.222222],
                        [-75.333333,40.333333],
                        [-75.444444,40.444444],
                        [-75.123456,40.123456], // Duplicate
                        [-75.111111,40.111111]
                    ],
                    [
                        [-75.111111,40.111111],
                        [-75.222222,40.222222],
                        [-75.333333,40.333333],
                        [-75.111111,40.111111]
                    ]
                ]
            ]
        };

        const result = utils.removeDupeCoords(makeFeature(geo));

        // Should be unmodified
        result.geometry.coordinates[0][0].should.have.lengthOf(3);

        // Should have duplicate removed
        result.geometry.coordinates[0][1].should.have.lengthOf(6);
        result.geometry.coordinates[0][1][0].should.deep.equal([-75.111111,40.111111]);
        result.geometry.coordinates[0][1][1].should.deep.equal([-75.123456,40.123456]);
        result.geometry.coordinates[0][1][2].should.deep.equal([-75.222222,40.222222]);
        result.geometry.coordinates[0][1][3].should.deep.equal([-75.333333,40.333333]);
        result.geometry.coordinates[0][1][4].should.deep.equal([-75.444444,40.444444]);
        result.geometry.coordinates[0][1][5].should.deep.equal([-75.111111,40.111111]);

        // Should be unmodified
        result.geometry.coordinates[0][2].should.have.lengthOf(4);
    });
});
