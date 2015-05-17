(function (angular) {
    'use strict';
    var app = angular.module("app");
    app.controller('BasemapsController', ['$scope', 'AppConfig' , 'MapService', function ($scope, AppConfig , MapService) {

        $scope.BaseMaps = function() {
            return MapService.GetBaseMaps();
        };

        $scope.ChangeBaseMap = function(id) {
            return MapService.SetBaseMap(id);
        };

        $scope.GetLayerVisibility = function(id) {
            return MapService.GetLayerVisibility(id);
        };
    }]);
}(angular));