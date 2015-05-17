(function (angular) {
    "use strict";
    var app = angular.module("app");
    app.factory("AppConfig", function () {
        return {

            initialExtent: {
                "xmin": -11942105,
                "ymin": 4767727,
                "xmax": -11801231,
                "ymax": 4859219,
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