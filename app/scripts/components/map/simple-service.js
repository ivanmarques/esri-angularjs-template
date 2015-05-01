(function(angular,define){
    'use strict';
    var dependencies = [
        'esri/map',
        'esri/layers/ArcGISDynamicMapServiceLayer',
        'esri/layers/ArcGISTiledMapServiceLayer'
    ];
    require(dependencies, function(Map , ArcGISDynamicMapServiceLayer,ArcGISTiledMapServiceLayer){
        //Map, InfoTemplate, Circle, Graphic, SimpleLineSymbol, SimpleFillSymbol,SimpleRenderer,Color,Polyline) {
        //Constructor
        var app = angular.module("app");
            app.factory('SimpleService', ['$rootScope',  function($rootScope,  $http , lodash){
            return {
                map:null,
                //basemaps: AppConfig().basemaps,
                //rightBasemaps: AppConfig().rightBaseMaps,
                splitView:false,
                earthView:true,
                semaphore:false,
                dataSwitch:false
            }
        }]);
    });
}(angular,define));