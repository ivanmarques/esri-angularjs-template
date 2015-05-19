(function (angular, define) {
    'use strict';
    var dependencies = [
        'esri/map',
        'esri/layers/ArcGISDynamicMapServiceLayer',
        'esri/layers/ArcGISTiledMapServiceLayer',
        'esri/layers/FeatureLayer',
        'esri/layers/WMSLayer',
        'esri/InfoTemplate'
    ];
    require(dependencies, function (Map, ArcGISDynamicMapServiceLayer, ArcGISTiledMapServiceLayer, FeatureLayer, WMSLayer, InfoTemplate) {

        var map, operationalLayers, baseMaps;

        /* Private Methods */
        function mapConfigs(extent) {
            var initialExtent = new esri.geometry.Extent(extent);
            return {
                extent: initialExtent,
                fadeOnZoom: true,
                maxZoom: 25
            };
        }
        
        function setBaseMaps(basemaps) {
            baseMaps = basemaps;
        }
        
        function initBaseMaps() {
            angular.forEach(baseMaps, function (value) {
                var layer = value, lyr;
                if (layer.type === 'ArcGISTiledMapServiceLayer') {
                    lyr = new ArcGISTiledMapServiceLayer(layer.url,
                        {
                            id: layer.id,
                            visible: layer.visible
                        });
                    //add to the map
                    map.addLayer(lyr);
                }
            });
        }

        function resizeMap() {
            //resize the map when the browser resizes
            if (map) {
                map.resize(true);
                map.reposition();
            } else {
                console.error('MapService map is undefined');
            }
        }

        function generateMap(elem, extent) {
            map = new Map(elem, mapConfigs(extent));
            dojo.connect(map, 'onLoad', function () {
                resizeMap();
            });
        }

        function setBaseMap(id) {
            angular.forEach(baseMaps, function (layer) {
                var lyr = map.getLayer(layer.id);
                if (layer.id === id) {
                    lyr.setVisibility(true);
                    layer.visible = true;
                } else {
                    lyr.setVisibility(false);
                    layer.visible = false;
                }
            });
        }

        function setOperationalLayers(layers) {
            operationalLayers = layers;
        }

        function setLayer(id) {
            var layer = map.getLayer(id);
            if (layer !== undefined) {
                layer.setVisibility(!layer.visible);
            } else {
                console.warn("Layer not defined in map");
            }
        }

        

        function setLayerToMap(layer) {
            var lyr;
            switch (layer.type) {
            case 'ArcGISDynamicMapServiceLayer':
                lyr = new ArcGISDynamicMapServiceLayer(layer.url,
                    {
                        id: layer.id,
                        visible: layer.visible,
                        opacity: layer.opacity
                    });
                lyr.setVisibleLayers(layer.visibleLayers);
                //console.log('Added ' + layer.id + ' to the map...');
                if (typeof layer.layerDefinitions !== "undefined") { // optional key
                    lyr.setLayerDefinitions(layer.layerDefinitions);
                }
                map.addLayer(lyr, layer.index);
                break;
            case 'FeatureLayer':
                var infoTemplate = null;
                if (layer.infoTemplateContent) {
                    infoTemplate = new InfoTemplate(layer.infoTemplateTitle, layer.infoTemplateContent);
                }

                lyr = new FeatureLayer(layer.url, {
                    id: layer.id,
                    visible: layer.visible,
                    opacity: layer.opacity,
                    mode: FeatureLayer.MODE_ONDEMAND,
                    outFields: ["*"],
                    infoTemplate: infoTemplate
                });
                if (layer.definitionQuery) { // optional key
                    lyr.setDefinitionExpression(layer.definitionQuery);
                }
                map.addLayer(lyr);
                break;
            case 'ArcGISImageServiceLayer':
                console.error('ArcGISImageServiceLayers not currently supported');
                break;
            case 'WMSLayer':
                var arrayLayerInfo = [];
                var i = 0;
                angular.forEach(layer.arrayLayers, function (item) {
                    arrayLayerInfo[i] = new Layers.WMSLayerInfo(item);
                    i = i + 1;
                });
                var resourceInfo = {
                    extent: config.initialExtent,
                    layerInfos: arrayLayerInfo
                };
                var wmsLayer = new WMSLayer(layer.url,
                    {
                        id: layer.id,
                        resourceInfo: resourceInfo,
                        visibleLayers: layer.visibleLayers,
                        opacity: layer.opacity,
                        visible: layer.visible
                    });
                if (layer.version !== null) {
                    wmsLayer.version = layer.version;
                }
                map.addLayer(wmsLayer);
                break;
            }
        }

        function initOperationalLayers() {
            angular.forEach(operationalLayers, function (value) {
                if (value.type.toLowerCase() === 'folder') {
                    angular.forEach(value.items, function (layer) {
                        setLayerToMap(layer);
                    });
                } else {
                    setLayerToMap(value);
                }
            });
        }
        
        function getLayerVisibility(id) {
            try {
                return map.getLayer(id).visible;
            } catch (e) {
                return false;
            }
        }

        var app = angular.module("app");
        app.factory('MapService', ['$rootScope', 'AppConfig', function ($rootScope, AppConfig) {
            return {
                dataPopUp: {},
                GetDataPopup: function () {
                    return this.dataPopUp;
                },
                MapGen: function (elem, extent, basemaps, layers) {
                    generateMap(elem, extent);
                    setBaseMaps(basemaps);
                    setOperationalLayers(layers);
                    initBaseMaps();
                    initOperationalLayers();
                },
                SetBaseMaps: function (basemaps) {
                    baseMaps = basemaps;
                },
                GetBaseMaps: function () {
                    return baseMaps;
                },
                SetOperationalLayers: function (layersObj) {
                    operationalLayers = layersObj;
                },
                GetOperationalLayers: function () {
                    return operationalLayers;
                },
                SetBaseMap: function (id) {
                    setBaseMap(id);
                },
                SetLayer: function (id) {
                    setLayer(id);
                },
                GetLayerVisibility: function (id) {
                    return getLayerVisibility(id);
                },
                InitOperationalLayers: function (layers) {
                    initOperationalLayers(layers);
                },
                InitMapBaseLayers: function () {
                    initBaseMaps();
                },
                GetLayer: function (id) {
                    return map.getLayer(id);
                },
                
                //Methods for testing pourposes
                
                SetMap: function (mapObj) {
                    map = mapObj;   
                },
                GetMap: function () {
                    return map;
                }
            };
        }]);
    });
}(angular, define));