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
        var getService, map, div, basemaps,basemapsMultiple,operationalLayers;
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
            
           basemapsMultiple =[
                {
                    'id': 'base1',
                    'label': 'World topo',
                    'type': 'ArcGISTiledMapServiceLayer',
                    'visible': false,
                    'url': 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer',
                },
                { 
                    'id': 'base2',
                    'label': 'World Imagery',
                    'type': 'ArcGISTiledMapServiceLayer',
                    'visible': false,
                    'url': 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
                }
            ];
            
            operationalLayers =[
                {
                    'id': 'layer1',
                    'label': 'River Mile Markers',
                    'type': 'FeatureLayer',
                    'visible': false,
                    'url': 'https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer',
                    visibleLayers:[7]
                },
                { 
                    'id': 'layer2',
                    'label': 'World Imagery',
                    'type': 'FeatureLayer',
                    'visible': false,
                    'url': 'https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer',
                    visibleLayers:[8]
                }
            ];
            
            
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
        
        
        it('InitMapBaseLayers should add the basemaps to the map object' , function(){
            var service = getService();
            service.SetMap(map);
            service.SetBaseMaps(basemaps);
            service.InitMapBaseLayers();
            expect(map.layerIds.length > 0).toBeTruthy();
        });
        
        it('SetBaseMap must put a certain basemap as visible' , function(){
            var service = getService();
            service.SetMap(map);
            service.SetBaseMaps(basemapsMultiple);
            service.InitMapBaseLayers();
            
            //At first, all basemaps got visible property = false
            expect(service.GetLayerVisibility("base1")).toBeFalsy();
            expect(service.GetLayerVisibility("base2")).toBeFalsy();
            service.SetBaseMap("base1");
            expect(service.GetLayerVisibility("base1")).toBeTruthy();
        });
        

        it('GetLayerVisibility must return a certain layer visibility as a boolean' , function(){
            var service = getService();
            service.SetMap(map);
            service.SetBaseMaps(basemapsMultiple);
            service.InitMapBaseLayers();
            
            //At first, all basemaps got visible property = false
            expect(service.GetLayerVisibility("base1")).toBeFalsy();
            expect(service.GetLayerVisibility("base2")).toBeFalsy();
            service.SetBaseMap("base1");
            expect(service.GetLayerVisibility("base1")).toBeTruthy();
        });
        
        it('InitOperationalLayers must add the operationalLayers to the map' , function(){
            var service = getService();
            service.SetMap(map);
            service.SetOperationalLayers(operationalLayers);
            service.InitOperationalLayers();
            
            
            //map.graphicsLayerIds returns an array of graphiclayer and featurelayer ids
            expect(map.graphicsLayerIds.length).toBe(2);
        });
        
        it('GetLayer must return a layer object assigned to the map' , function(){
            var service = getService();
            service.SetMap(map);
            service.SetOperationalLayers(operationalLayers);
            service.InitOperationalLayers();
            var layer = service.GetLayer("layer2");
            expect(layer.id).toBe("layer2");
            expect(layer.url).toBe('https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer');
            
        });
    });
});