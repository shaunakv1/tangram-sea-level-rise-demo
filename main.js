/*jslint browser: true*/
/*global Tangram, gui */

map = (function () {
    'use strict';

    var map_start_location = [40.70531887544228, -74.00976419448853, 15]; // NYC

    /*** URL parsing ***/

    // leaflet-style URL hash pattern:
    // #[zoom],[lat],[lng]
    var url_hash = window.location.hash.slice(1, window.location.hash.length).split('/');

    if (url_hash.length == 3) {
        map_start_location = [url_hash[1],url_hash[2], url_hash[0]];
        // convert from strings
        map_start_location = map_start_location.map(Number);
    }

    /*** Map ***/

    var map = L.map('map',{
            "keyboardZoomOffset" : .05,
            "maxZoom":15.475
        }
    );

    var layer = Tangram.leafletLayer({
        scene: 'scene.yaml',
        attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>'
    });
    
    var currentSlr = 4;
    var slrLayers = { 
                        slr_0ft: L.tileLayer('https://www.coast.noaa.gov/arcgis/rest/services/dc_slr/slr_0ft/MapServer/tile/{z}/{y}/{x}',{opacity:0.7}),
                        slr_1ft: L.tileLayer('https://www.coast.noaa.gov/arcgis/rest/services/dc_slr/slr_1ft/MapServer/tile/{z}/{y}/{x}',{opacity:0.7}),
                        slr_2ft: L.tileLayer('https://www.coast.noaa.gov/arcgis/rest/services/dc_slr/slr_2ft/MapServer/tile/{z}/{y}/{x}',{opacity:0.7}),
                        slr_3ft: L.tileLayer('https://www.coast.noaa.gov/arcgis/rest/services/dc_slr/slr_3ft/MapServer/tile/{z}/{y}/{x}',{opacity:0.7}),
                        slr_4ft: L.tileLayer('https://www.coast.noaa.gov/arcgis/rest/services/dc_slr/slr_4ft/MapServer/tile/{z}/{y}/{x}',{opacity:0.7}),
                        slr_5ft: L.tileLayer('https://www.coast.noaa.gov/arcgis/rest/services/dc_slr/slr_5ft/MapServer/tile/{z}/{y}/{x}',{opacity:0.7}),
                        slr_6ft: L.tileLayer('https://www.coast.noaa.gov/arcgis/rest/services/dc_slr/slr_6ft/MapServer/tile/{z}/{y}/{x}',{opacity:0.7})
                     };

    window.layer = layer;
    var scene = layer.scene;
    window.scene = scene;

    // setView expects format ([lat, long], zoom)
    map.setView(map_start_location.slice(0, 3), map_start_location[2]);

    var hash = new L.Hash(map);

    /***** Render loop *****/

    window.addEventListener('load', function () {
        // Scene initialized
        layer.on('init', function() {
        });
        layer.addTo(map);
        slrLayers["slr_"+currentSlr+"ft"].addTo(map);

    });

    window.slrUp = function() {
        if(currentSlr + 1 <= 6){
            map.removeLayer(slrLayers["slr_"+currentSlr+"ft"]);
            currentSlr += 1;
            slrLayers["slr_"+currentSlr+"ft"].addTo(map);
        }
    }

    window.slrDown = function() {
        if(currentSlr - 1 >=0 ){
            map.removeLayer(slrLayers["slr_"+currentSlr+"ft"]);
            currentSlr -= 1;
            slrLayers["slr_"+currentSlr+"ft"].addTo(map);
        }
        
    }

    /**
     * Add custom control to change Sea level Rise
     */
    var seaLevelRiseControlUp = L.Control.extend({
      options: {
        position: 'topleft' 
        //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
      },
      onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
            container.style.backgroundColor = 'white';
            container.style.backgroundImage = "url(img/up.png)";
            container.style.backgroundSize = "50px 50px";
            container.style.cursor = "pointer";
            container.style.width = '50px';
            container.style.height = '50px';
         
            container.onclick = function(){
              window.slrUp();
            }
            return container;
      },

    });
    map.addControl(new seaLevelRiseControlUp());

    var seaLevelRiseControlDown = L.Control.extend({
      options: {
        position: 'topleft' 
        //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
      },
      onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
            container.style.backgroundColor = 'white';
            container.style.backgroundImage = "url(img/down.png)";
            container.style.backgroundSize = "50px 50px";
            container.style.cursor = "pointer";
            container.style.width = '50px';
            container.style.height = '50px';
         
            container.onclick = function(){
              window.slrDown();
            }
            return container;
      },

    });
    map.addControl(new seaLevelRiseControlDown());

    //finally return map object
    return map;

}());
