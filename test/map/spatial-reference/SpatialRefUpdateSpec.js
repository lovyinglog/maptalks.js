describe('#SpatialReference.Update', function () {
    var container;
    var map;

    beforeEach(function () {
        container = document.createElement('div');
        container.style.width = '400px';
        container.style.height = '400px';
        document.body.appendChild(container);
        map = new maptalks.Map(container, {
            'zoom' : 14,
            'center' : [0, 0]
        });
    });

    afterEach(function () {
        map.remove();
        REMOVE_CONTAINER();
    });

    it('TileLayer', function (done) {
        var tileLayer = new maptalks.TileLayer('base', {
            urlTemplate:'/resources/tile.png'
        });
        tileLayer.once('layerload', function () {
            map.setSpatialReference({
                projection : 'baidu'
            });
            var tiles = tileLayer.getTiles();
            expect(tiles.anchor.toArray()).to.be.eql([-1252144, -1252144]);
            expect(tiles.anchor.zoom).to.be.eql(14);
            done();
        });
        map.setBaseLayer(tileLayer);
        var tiles = tileLayer.getTiles();
        expect(tiles.anchor.toArray()).to.be.eql([-2096952, -2096952]);
        expect(tiles.anchor.zoom).to.be.eql(14);
    });

    var geometries = GEN_GEOMETRIES_OF_ALL_TYPES();
    geometries[0].setSymbol({
        markerType : 'ellipse',
        markerWidth : 20,
        markerHeight : 20
    });
    var counter = 0;
    function test(geo) {
        return function (done) {
            map.setCenter(geo.getFirstCoordinate());
            var layer = new maptalks.VectorLayer('base' + counter++, geo, { 'drawImmediate' : true });
            layer.once('layerload', function () {
                layer.once('layerload', function () {
                    if (geo instanceof maptalks.Sector) {
                        expect(layer).to.be.painted(-1, -1);
                    } else {
                        expect(layer).to.be.painted();
                    }
                    done();
                });
                map.setSpatialReference({
                    projection : 'baidu'
                });
            });
            layer.addTo(map);
        };
    }
    for (var i = 0; i < geometries.length; i++) {
        it('VectorLayer with geometry ' + geometries[i].getType(), test(geometries[i]));
    }
});
