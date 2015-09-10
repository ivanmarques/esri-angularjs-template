(function (angular) {
    "use strict";
    var app = angular.module("app");
    app.value("AppConfig", function () {
        return {
            initialExtent: {
                "xmin": -738387.10,
                "ymin": 5182411.57,
                "xmax": -463213.80,
                "ymax": 5365860.44,
                "spatialReference": { "wkid": 102100 }
            },
            basemaps: [
                {
                    'id': 'base1',
                    'label': 'World topo',
                    'type': 'ArcGISTiledMapServiceLayer',
                    'visible': false,
                    'url': 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer',
                },
                {
                    'id': 'base3',
                    'label': 'World Imagery',
                    'type': 'ArcGISTiledMapServiceLayer',
                    'visible': true,
                    'url': 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
                },
                {
                    'id': 'base4',
                    'label': 'World Street Map',
                    'type': 'ArcGISTiledMapServiceLayer',
                    'visible': false,
                    'url': 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer',
                }
            ]
        };
    });
}(angular));