import React, { useEffect, useRef } from 'react';
import 'ol/ol.css'; // Import the OpenLayers default CSS
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Fill, Stroke, Style, Circle as CircleStyle } from 'ol/style';
import Feature from 'ol/Feature';
import TileWMS from 'ol/source/TileWMS';
import LayerSwitcher from 'ol-layerswitcher';
import 'ol-layerswitcher/dist/ol-layerswitcher.css'; // LayerSwitcher CSS
import LayerGroup from 'ol/layer/Group';
import XYZ from 'ol/source/XYZ';

const MapComponent = () => {
  const mapRef = useRef(null); // Create a ref for the map container div

  useEffect(() => {
    // Define base layers (OSM, satellite)
    const osm = new TileLayer({
      title: 'OSM',
      type: 'base',
      visible: true,
      source: new OSM(),
    });

    const satelliteLayer = new TileLayer({
      title: 'Satellite Map',
      type: 'base',
      visible: false,
      source: new XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        maxZoom: 19,
      }),
    });

    // Define WMS layer (for example, 'ne:countries')
    const wmsLayer = new TileLayer({
      title: 'Geo Map',
      type: 'base',
      visible: false,
      source: new TileWMS({
        url: 'http://localhost:8080/geoserver/wms',
        params: { LAYERS: 'ne:countries' },
        ratio: 1.2,
        serverType: 'geoserver',
      }),
    });

    // Define Vector layer for GeoJSON (landfill example)
    const vectorSource = new VectorSource({
      projection: 'EPSG:4326',
      url: 'landfill.geojson.geojson', // Adjust to your actual GeoJSON URL
      format: new GeoJSON(),
    });

    const vectorLayer = new VectorLayer({
      title: 'Landfill Data',
      visible: false,
      source: vectorSource,
      style: new Style({
        image: new CircleStyle({
          radius: 10,
          fill: new Fill({ color: 'red' }),
          stroke: new Stroke({ color: 'red', width: 6 }),
        }),
        stroke: new Stroke({
          color: 'blue',
          width: 2,
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)',
        }),
      }),
    });

    // Create a layer group for base maps
    const baseMaps = new LayerGroup({
      title: 'Base maps',
      layers: [osm, wmsLayer, satelliteLayer],
    });

    // Create a layer group for overlays
    const overlayGroup = new LayerGroup({
      title: 'Overlays',
      layers: [vectorLayer],
    });

    // Initialize the OpenLayers map
    const map = new Map({
      target: mapRef.current, // Target the div using useRef
      layers: [baseMaps, overlayGroup], // Add both base maps and overlays
      view: new View({
        center: [52.5243700, 13.4105300], // Adjusted to the center coordinates
        zoom: 2,
      }),
    });

    // Add LayerSwitcher control
    const layerSwitcher = new LayerSwitcher({
      tipLabel: 'Layers', // Optional label for the layer switcher button
    });
    map.addControl(layerSwitcher);

    // Add click event listener to fit map to feature on click
    map.on('singleclick', (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
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
