'use strict';

if(window.__karma__) {
	var allTestFiles = [];
	var TEST_REGEXP = /-spec\.js$/;

	var pathToModule = function(path) {
		return path.replace(/^\/base\//, '').replace(/\.js$/, '');
	};

	Object.keys(window.__karma__.files).forEach(function(file) {
		if (TEST_REGEXP.test(file)) {
			// Normalize paths to RequireJS module names.
			allTestFiles.push(pathToModule(file));
		}
	});
}

require.config({
	paths: {
		angular: 'bower_components/angular/angular',
		angularRoute: 'bower_components/angular-route/angular-route',
		angularMocks: 'bower_components/angular-mocks/angular-mocks',
		text: 'bower_components/requirejs-text/text',
        esri:'http://js.arcgis.com/3.13/esri',
        dojo:'http://js.arcgis.com/3.13/dojo',
        dojox:'http://js.arcgis.com/3.13/dojox',
        dijit:'http://js.arcgis.com/3.13/dijit'
	},
	shim: {
		'angular' : {'exports' : 'angular'},
		'angularRoute': ['angular'],
		'angularMocks': {
			deps:['angular'],
			'exports':'angular.mock'
		}
	},
	priority: [
		"angular"
	],
	deps: window.__karma__ ? allTestFiles : [],
	callback: window.__karma__ ? window.__karma__.start : null,
	baseUrl: window.__karma__ ? '/base' : '',
});

require([
	'angular',
    'app/scripts/app',
	'app/scripts/config',
    'app/scripts/components/map/map-service',
    'app/scripts/theme/templates/templates',
    'esri/map',
    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/layers/ArcGISTiledMapServiceLayer'
	], function(angular, app) {
		var $html = angular.element(document.getElementsByTagName('html')[0]);
		angular.element().ready(function() {
			// bootstrap the app manually
			angular.bootstrap(document, ['app']);
		});
	}
);