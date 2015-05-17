/*global angular:true */
(function(angular, define){
    'use strict';
    require([
        'dojo/ready'
    ], function (ready) {
        ready(function () {
            angular.bootstrap(document.body, ['app']);
        });
    });
}(angular, define));