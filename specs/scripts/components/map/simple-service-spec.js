/* global describe, it, expect, beforeEach, afterEach, module, inject */
'use strict';
define(['app/scripts/app', 'app/scripts/config','app/scripts/components/map/simple-service','esri/map',
        'esri/layers/ArcGISDynamicMapServiceLayer',
        'esri/layers/ArcGISTiledMapServiceLayer'], function(app,config, simpleService) {
    describe('Simple service spec' , function(){
        var getService;
        beforeEach(module('app'));
        
        beforeEach(inject(function(_SimpleService_){
           getService = function(){
               return _SimpleService_;
           }
        }));
        
        it('service.semaphore should be true', function() {
            var service = getService();
            expect(service.semaphore).toBe(false);
        });
        
        
        it('service.semaphore should be true', function() {
            var service = getService();
             expect(service.earthView).toBe(true);
        });
        
    });
});