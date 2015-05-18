/* global describe, it, expect, beforeEach, afterEach, module, inject */
'use strict';
define([
    'dojo/dom-construct',
    'esri/map',
    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/layers/ArcGISTiledMapServiceLayer',
    'esri/layers/FeatureLayer',
    'esri/layers/WMSLayer',
    'esri/InfoTemplate'
], function(domConstruct, Map, ArcGISDynamicMapServiceLayer, ArcGISTiledMapServiceLayer, FeatureLayer, WMSLayer, InfoTemplate) {
    describe('Map service spec' , function(){
        var getService, map, div, basemaps;
        beforeEach(module('app'));
        
        beforeEach(inject(function(_MapService_){
            getService = function() {
                console.dir(_MapService_);
                return _MapService_;
            };
            var frag = document.createDocumentFragment();
            //var div = angular.element('<div style="width:300px;height:200px"></div>');
            //frag.appendChild(div[0]);
            var div = domConstruct.create('div', {style: 'width:300px;height:200px'});
            domConstruct.place(div, frag);
            map = new Map(div, {
              basemap: "topo",
              center: [-122.45, 37.75],
              zoom: 13
            });
            
            //stub basemaps object
            basemaps =  [{
                    'id': 'base1',
                    'label': 'World topo',
                    'type': 'ArcGISTiledMapServiceLayer',
                    'visible': false,
                    'url': 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer',
                }];
        }));

        it('GetBaseMaps Should return an array of basemaps', function() {
            var service = getService();
            service.SetMap(map);
            var nullbasemaps = service.GetBaseMaps();
            expect(nullbasemaps).toBe(undefined);
            
            service.SetBaseMaps(basemaps);
            expect(service.GetBaseMaps()).toBeDefined();
            expect(service.GetBaseMaps().length).toBe(1);

        });

    });
});