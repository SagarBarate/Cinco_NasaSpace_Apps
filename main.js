import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import GeoJSON from 'ol/format/GeoJSON';
import Feature from 'ol/Feature.js';
//import proj from 'ol/proj.js'; // OpenLayers version 4.6.5

import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';


var vectorSource = new VectorSource({
  projection : 'EPSG:4326',
  url: 'Westmeath_Athlone_Local_Area_Plan_2014_2020.geojson.geojson',
  format: new GeoJSON ,
  extent: true
});

var vectorLayer = new VectorLayer({
  source: vectorSource,
  style: {
    'fill':true,
    'fill-color': 'red',
  },
  //style: styleFunction,
});
var map = new Map({
  target: 'map',
  layers: [
     new TileLayer({
        source: new OSM()
     }),
  ],
  view: new View({
    center:[52.5243700 , 13.4105300],
    zoom:2

  })
});

map.addLayer(vectorLayer);

 let extent = map.getView().calculateExtent(map.getSize())
 console.log(extent)

map.on("singleclick", (event) => {
  // get the feature you clicked
  const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => {
    return feature;
  });
  if (feature instanceof Feature) {
    // Fit the feature geometry or extent based on the given map
    map.getView().fit(feature.getGeometry());
    // map.getView().fit(feature.getGeometry().getExtent())
  }


  
});

// var displayFeatureInfo = function(pixel) {
//   var features = [];
//   map.forEachFeatureAtPixel(pixel, function(feature, layer) {
//     features.push(feature);
//   });
//   var container = document.getElementById('information');
//   if (features.length > 0) {
//     var info = [];
//     for (var i = 0, ii = features.length; i < ii; ++i) {
//       info.push(features[i].get('N3NM'));
//     }
//     container.innerHTML = info.join(', ') || '(unknown)';
//   } else {
//     container.innerHTML = '&nbsp;';
//   }
// };

// map.on('click', function(evt) {
//   var pixel = evt.pixel;
//   displayFeatureInfo(pixel);
// });

