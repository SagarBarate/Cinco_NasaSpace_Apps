import React, { useEffect, useRef } from 'react';
import 'ol/ol.css'; // Import the OpenLayers default CSS
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Fill, Style } from 'ol/style';
import Feature from 'ol/Feature';

const MapComponent = () => {
  const mapRef = useRef(null); // Create a ref for the map container div

  useEffect(() => {
    // Initialize the vector source and layer
    const vectorSource = new VectorSource({
      projection: 'EPSG:4326',
      url: 'Westmeath_Athlone_Local_Area_Plan_2014_2020.geojson.geojson',
      format: new GeoJSON(),
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        fill: new Fill({
          color: 'red',
        }),
      }),
    });

    // Initialize the OpenLayers map
    const map = new Map({
      target: mapRef.current, // Target the div using useRef
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [52.5243700, 13.4105300], // Center the map at these coordinates
        zoom: 2,
      }),
    });

    // Add the vector layer to the map
    map.addLayer(vectorLayer);

    // Fit map view to the extent of the vector layer
    let extent = map.getView().calculateExtent(map.getSize());
    console.log(extent);

    // Add a single click event listener
    map.on('singleclick', (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => {
        return feature;
      });

      if (feature instanceof Feature) {
        map.getView().fit(feature.getGeometry());
      }
    });

    return () => {
      map.setTarget(null); // Cleanup map on component unmount
    };
  }, []);

  return (
    <div>
      {/* The div where the map will be rendered */}
      <div ref={mapRef} style={{ width: '100%', height: '500px' }}></div>
    </div>
  );
};

export default MapComponent;
