
import Map from 'ol/Map.js';            // a core component of OpenLayers module 
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import TileWMS from 'ol/source/TileWMS.js';
import View from 'ol/View.js';
// import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo.js';

const layers =  [
  new TileLayer({
    source: new OSM(),    // basic map 
  }),

  // new TileLayer({
  //   extent: [650000, 590000, 1774447, 7473282], // anpassen entsprechend Layer !!!!
  //   source: new TileWMS({
  //     url: 'http://localhost:8080/geoserver/Umwelt-Gesundheit/wms',  // url zum geoserver  

  //     params: {'LAYERS': 'EwDichte', 'TILED': true},
  //     serverType: 'geoserver',
      
  //     transition: 0, // Countries have transparency, so do not fade tiles:
  //   }),
  // }),

  new TileLayer({
    //extent: [650000, 590000, 1774447, 7473282], // anpassen entsprechend Layer !!!!
    source: new TileWMS({
      url: 'http://localhost:8080/geoserver/Umwelt-Gesundheit/wms',  // url zum geoserver  

      params: {'LAYERS': 'R_PM10_2021', 'TILED': true},
      serverType: 'geoserver',
      
      transition: 0, // Countries have transparency, so do not fade tiles:
    }),
  }),
  
  new TileLayer({
    //extent: [650000, 590000, 1774447, 7473282], // anpassen entsprechend Layer !!!!
    source: new TileWMS({
      url: 'http://localhost:8080/geoserver/Umwelt-Gesundheit/wms',  // url zum geoserver  

      params: {'LAYERS': 'V_O3_2021', 'TILED': true},
      serverType: 'geoserver',
      
      transition: 0, // Countries have transparency, so do not fade tiles:
    }),
  }),
];

const map = new Map({
  layers: layers,
  target: 'map',
  view: new View({
    center: [1141371, 6735169], // center auf Deutschland geändert 
    zoom: 4,        // zoom-Level 
    // projection, 
  }),
});

// export default map;



