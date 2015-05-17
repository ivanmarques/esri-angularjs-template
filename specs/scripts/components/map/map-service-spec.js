/* global describe, it, expect, beforeEach, afterEach, module, inject */
'use strict';
define(['app/scripts/app', 'app/scripts/config','app/scripts/components/map/map-service','esri/map',
    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/layers/ArcGISTiledMapServiceLayer'], function(app,config, MapService) {
    describe('Simple service spec' , function(){
        var getService;
        beforeEach(module('app'));

        beforeEach(inject(function(_MapService_){
            getService = function() {
                return _MapService_;
            };
        }));

        it('service.semaphore should be true', function() {
            var service = getService();
            expect(service.earthView).toBe(true);
        });

    });
});