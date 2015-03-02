/**
 * @author rrubalcava@odoe.net (Rene Rubalcava)
 */
/*global define:true*/
(function(angular){
    "use strict";
        var app = angular.module("app");
        app.controller('AppCtrl', ['$scope','MapService' , 'AppConfig', function($scope ,  MapService, AppConfig){
            // '$timeout',  'progressLoader', '$location',  function($scope){
            initMap($scope,MapService , AppConfig());
            $scope.BaseMaps = function(){
                return MapService.GetBaseMaps();
            };
            $scope.Layers = function(){
                return MapService.GetOperationalLayers();
            };
            $scope.ChangeBaseMap = function(id){
                return MapService.SetBaseMap(id);
            };
            $scope.GetLayerVisibility = function(id){
                var lyr =  MapService.GetLayer(id);
                if(lyr != null){
                    return lyr.visible;
                }else{
                    return false;
                }
            };
        }]).config(['$provide', '$routeProvider' , function ($provide, $routeProvider ) {
            $routeProvider
              .when('/', {
                templateUrl: 'views/index.html'
              })
              .when('/:templateFile', {
                templateUrl: function (param) { return 'views/'+param.templateFile+'.html' }
              });
        }]);

        function initMap($scope,MapService , AppConfig){
            setMapHeight();
            angular.element(window).bind('resize', function() {
                setMapHeight();
            })

            MapService.MapGen('map' , AppConfig.initialExtent);
            MapService.setBaseMaps(AppConfig.basemaps);
            MapService.setOperationalLayers(AppConfig.layers);
            MapService.InitMapBaseLayers();
        }

        function setMapHeight(){
            angular.element(document.querySelector('#map-container'))[0].style.height = ( angular.element(document.querySelector('body'))[0].offsetHeight - angular.element(document.querySelector('.navbar'))[0].offsetHeight) + "px";
            angular.element(document.querySelector('#map-container'))[0].style.maxHeight = ( angular.element(document.querySelector('body'))[0].offsetHeight - angular.element(document.querySelector('.navbar'))[0].offsetHeight) + "px";
            angular.element(document.querySelector('#map'))[0].style.height = ( angular.element(document.querySelector('body'))[0].offsetHeight - angular.element(document.querySelector('.navbar'))[0].offsetHeight) + "px";
            angular.element(document.querySelector('#map'))[0].style.maxHeight = ( angular.element(document.querySelector('body'))[0].offsetHeight - angular.element(document.querySelector('.navbar'))[0].offsetHeight) + "px";
        }
}(angular));