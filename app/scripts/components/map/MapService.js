(function(angular,define){
    'use strict';
    var dependencies = [
        'esri/map',
        'esri/layers/ArcGISDynamicMapServiceLayer',
        'esri/layers/ArcGISTiledMapServiceLayer',
        'esri/layers/FeatureLayer',
        'esri/layers/WMSLayer',
        'esri/InfoTemplate',
        'esri/geometry/Circle',
        'esri/graphic',
        'esri/symbols/SimpleLineSymbol',
        'esri/symbols/SimpleFillSymbol',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/renderers/SimpleRenderer',
        'esri/Color',
        'esri/geometry/Polyline',
        'esri/geometry/Polygon',
        'esri/tasks/QueryTask',
        'esri/tasks/query'
    ];
    require(dependencies, function(Map , ArcGISDynamicMapServiceLayer,ArcGISTiledMapServiceLayer, FeatureLayer , WMSLayer , InfoTemplate , Circle , Graphic, SimpleLineSymbol, SimpleFillSymbol ,SimpleMarkerSymbol , SimpleRenderer , Color , Polyline , Polygon,QueryTask , Query){
        //Map, InfoTemplate, Circle, Graphic, SimpleLineSymbol, SimpleFillSymbol,SimpleRenderer,Color,Polyline) {
        //Constructor
        var app = angular.module("app");
            app.factory('MapService', ['$rootScope', 'AppConfig' , '$http' , 'lodash' , function($rootScope, AppConfig , $http , lodash){
            return {
                map:null,
                basemaps: AppConfig().basemaps,
                rightBasemaps: AppConfig().rightBaseMaps,
                splitView:false,
                earthView:false,
                semaphore:false,
                dataSwitch:false,
                dataPopUp:{},
                legends:[],
                rightConnections:[],
                leftConnections:[],
                operationalLayers: AppConfig().layers,
                rightOperationalLayers: AppConfig().rightLayers,
                GetDataPopup: function(){
                    return this.dataPopUp;
                },
                mapConfigs: function(extent) {
                    var initialExtent = new esri.geometry.Extent(extent);
                    return {
                        extent: initialExtent,
                        fadeOnZoom: true,
                        maxZoom: 25
                    };
                },
                MapGen:function(elem ,extent) {
                    this.map = new Map(elem, this.mapConfigs(extent));
                    var self = this;
                    dojo.connect(this.map , 'onLoad', function(){
                        self.resizeMap();
                    });
                },
                setBaseMaps: function(basemaps){
                    this.baseMaps = basemaps;
                },
                setOperationalLayers: function(layers){
                    this.operationalLayers = layers;
                },
                GetBaseMaps:function(){
                    return this.baseMaps;
                },
                GetOperationalLayers:function(){
                    //return this.operationalLayers.concat(this.rightOperationalLayers);
                    return this.operationalLayers;
                },
                SetBaseMap: function (basemap){
                    var self = this;
                    angular.forEach(this.baseMaps , function(layer){
                        var lyr = self.map.getLayer(layer.id);
                        if (layer.id == basemap) {
                            lyr.setVisibility(true);
                            layer.visible = true;
                        } else {
                            lyr.setVisibility(false);
                            layer.visible = false;
                        }
                    });
                },
                SetLayer:function(id){
                    var layer = this.map.getLayer(id);
                    if(layer !== undefined){
                        layer.setVisibility(!layer.visible);
                    }else{
                        console.warn("Layer not defined in map");
                    }
                },                
                InitOperationalLayers:function (map, layers){
                    var self = this;
                    angular.forEach(layers, function(value){
                        if(value.type.toLowerCase() == 'folder'){
                            angular.forEach(value.items , function(layer){
                                self.SetLayerToMap(map, layer);
                            });
                        }else{
                            self.SetLayerToMap(map, value);
                        }
                    });

                    this.legends = this.GenerateLegends();
                },
                SetLayerToMap:function(map, layer){
                    var self = this;
                    switch (layer.type) {
                        case 'ArcGISDynamicMapServiceLayer':
                            var lyr = new ArcGISDynamicMapServiceLayer(layer.url,
                            {
                                id: layer.id,
                                visible: layer.visible,
                                opacity: layer.opacity
                            });
                            lyr.setVisibleLayers(layer.visibleLayers);
                            //console.log('Added ' + layer.id + ' to the map...');
                            if (layer.layerDefinitions) { // optional key
                                lyr.setLayerDefinitions(layer.layerDefinitions);
                            }
                            if (layer.index) {
                                map.addLayer(lyr, layer.index);
                            } else {
                                map.addLayer(lyr);
                            }
                            break;
                        case 'FeatureLayer':
                            var infoTemplate = null;
                            if (layer.infoTemplateContent) {
                                infoTemplate = new InfoTemplate(layer.infoTemplateTitle, layer.infoTemplateContent);
                            }

                            var lyr = new FeatureLayer(layer.url, {
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
                            //alert('ArcGISImageServiceLayers not currently supported');
                            break;
                        case 'WMSLayer':
                            var arrayLayerInfo = [];
                            var i = 0;
                            angular.forEach(layer.arrayLayers, function (item) {
                                arrayLayerInfo[i] = new Layers.WMSLayerInfo(item);
                                i = i + 1;
                            });
                            var resourceInfo = {
                                extent: this.config.initialExtent,
                                layerInfos: arrayLayerInfo
                            };
                            var wmsLayer = new WMSLayer(layer.url,
                              {
                                  id: layer.id,
                                  resourceInfo: resourceInfo,
                                  visibleLayers: layer.visibleLayers,
                                  opacity: layer.opacity,
                                  visible: layer.visible
                              }
                            );
                            if (layer.version !== null) {
                                wmsLayer.version = layer.version;
                            }
                            self.map.addLayer(wmsLayer);
                            break;
                        }
                    
                },

                InitMapBaseLayers: function(){
                    this.InitBaseMaps(this.map , this.baseMaps);
                },
                InitBaseMaps: function(map, basemaps){
                    var self = this;
                    angular.forEach(basemaps, function( value){
                        var layer = value;
                        if (layer.type == 'ArcGISTiledMapServiceLayer') {
                            var lyr = new ArcGISTiledMapServiceLayer(layer.url,
                            {
                                id: layer.id,
                                visible: layer.visible
                            });
                            //add to the map                
                            map.addLayer(lyr);
                        }
                    });
                },
                resizeMap: function () {
                    //console.log('MapModule:Controller:resizeMap');
                    //resize the map when the browser resizes
                    //debugger;
                    if (this.map) {
                        this.map.resize(true);
                        this.map.reposition();
                    } else {
                        console.error('MapService map is undefined');
                    }
                },
                WebMercatorToGeographic: function(x,y){
                    var radius = 6378137,
                    num3 = x / 6378137.0,
                    num4 = num3 * 57.295779513082323,
                    num5 = Math.floor((num4 + 180.0) / 360.0),
                    num6 = num4 - (num5 * 360.0),
                    num7 = 1.5707963267948966 - (2.0 * Math.atan(Math.exp((-1.0 * y) / 6378137.0))),
                    lat, lon;
                    lat = num7 * 57.295779513082323;
                    lon = num6;
                    return {lat:lat,lon:lon};
                },
                GeographicToWebMercator: function(lon,lat){
                    var Radians_Per_Degrees = Math.PI / 180,
                    radius = 6378137,
                    x, y, loc1, loc2;
                    x = lon * Radians_Per_Degrees * radius;
                    loc1 = lat * Radians_Per_Degrees;
                    loc2 = Math.sin(loc1);
                    y = radius * 0.5 * Math.log((1 + loc2) / (1 - loc2));
                    return { x: x , y: y};
                },
                GetLayer:function(id){
                    return this.map.getLayer(id);
                },
                setLocationAndZoom:function(){
                
                }
            };
        }]);
        
    });
}(angular,define));