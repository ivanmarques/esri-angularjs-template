/**
 * @author rrubalcava@odoe.net (Rene Rubalcava)
 */
/*global define:true*/
(function (angular) {
    "use strict";
    

    

    function setMapHeight() {
        angular.element(document.querySelector('#map-container'))[0].style.height = (angular.element(document.querySelector('body'))[0].offsetHeight - angular.element(document.querySelector('.navbar'))[0].offsetHeight) + "px";
        angular.element(document.querySelector('#map-container'))[0].style.maxHeight = (angular.element(document.querySelector('body'))[0].offsetHeight - angular.element(document.querySelector('.navbar'))[0].offsetHeight) + "px";
        angular.element(document.querySelector('#map'))[0].style.height = (angular.element(document.querySelector('body'))[0].offsetHeight - angular.element(document.querySelector('.navbar'))[0].offsetHeight) + "px";
        angular.element(document.querySelector('#map'))[0].style.maxHeight = (angular.element(document.querySelector('body'))[0].offsetHeight - angular.element(document.querySelector('.navbar'))[0].offsetHeight) + "px";
    }
    
    function initMap(MapService, AppConfig) {
        setMapHeight();
        angular.element(window).bind('resize', function () {
            setMapHeight();
        });
        MapService.MapGen('map', AppConfig.initialExtent, AppConfig.basemaps, AppConfig.layers);
    }
    
    var app = angular.module("app");
    app.controller('AppCtrl', ['$scope', 'MapService', 'AppConfig', function ($scope,  MapService, AppConfig) {
        initMap(MapService, AppConfig);
        $scope.BaseMaps = function () {
            return MapService.GetBaseMaps();
        };
        $scope.Layers = function () {
            return MapService.GetOperationalLayers();
        };
        $scope.ChangeBaseMap = function (id) {
            return MapService.SetBaseMap(id);
        };
        $scope.GetLayerVisibility = function (id) {
            return MapService.getLayerVisibility(id);
            /*var lyr =  MapService.GetLayer(id);
            if(lyr != null){
                return lyr.visible;
            }else{
                return false;
            }*/
        };
    }]).config(['$provide', '$routeProvider', function ($provide, $routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'index.html'
            })
            .when('/:templateFile', {
                templateUrl: function (param) { return param.templateFile + '.html'; }
            });
    }]);
}(angular));