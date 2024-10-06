
import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css'; // Import the OpenLayers default CSS
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import '../css/MapComponent.css';
import Geocoder from 'ol-geocoder/dist/ol-geocoder';
import {fromLonLat, toLonLat} from 'ol/proj'; 
import { Fill, Stroke, Style, Circle as CircleStyle,Icon } from 'ol/style';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LayerSwitcher from 'ol-layerswitcher';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';
import XYZ from 'ol/source/XYZ';
import LayerGroup from 'ol/layer/Group';



const MapComponent = () => {
    const mapRef = useRef(null); // Create a ref for the map container div

    // State to track the checkbox for "Landfilled", "Recycling" and "Plastic Consumption" countries
    const [isLandfilledChecked, setIsLandfilledChecked] = useState(false);
    const [isRecyclingChecked, setIsRecyclingChecked] = useState(false);
    const [isPlasticChecked, setIsPlasticChecked] = useState(false); // New state for plastic consumption

    // Define the list of landfilled countries
    const countriesList = [
        'Serbia', 'Bulgaria', 'Spain', 'Greece', 'Lithuania', 'Ireland', 'Hungary',
        'Italy', 'United Kingdom', 'Germany', 'Greece', 'Latvia', 'France', 'Finland',
        'Romania', 'Austria', 'Slovakia', 'Montenegro', 'Malta', 'Norway', 'Denmark',
        'Netherlands', 'Belgium', 'Czechia', 'Switzerland', 'Turkiye', 'Albania', 'Cyprus',
        'Sweden', 'Iceland'
    ];

    // Define and sort the list of recycling countries
    const recyclingCountriesList = [
        "Germany", "Austria", "Slovenia", "Netherlands", "Denmark", "Belgium", "Luxembourg",
        "Italy", "Slovakia", "Lithuania", "Latvia", "France", "Czechia", "Ireland",
        "Poland", "Sweden", "Finland", "Spain", "Hungary", "Croatia", "Portugal",
        "Estonia", "Bulgaria", "Greece", "Cyprus", "Malta", "Romania"
    ];

    // New list for plastic consumption
    const plasticConsumptionList = [
        'Albania', 'Montenegro', 'Lithuania', 'Cyprus', 'Greece', 'Serbia', 'Romania', 
        'Bulgaria', 'Hungary', 'Slovakia', 'Latvia', 'Czechia', 'Finland', 'Malta', 'Sweden', 
        'Norway', 'Spain', 'Turkey', 'Austria', 'Ireland', 'Denmark', 'Iceland', 'Switzerland', 
        'Belgium', 'France', 'Netherlands', 'Germany', 'United Kingdom', 'Italy'
    ];

    // Create a color gradient from green to red
    const getColor = (index, total) => {
        const ratio = index / total;
        const r = Math.floor(255 * ratio); // Red increases with index
        const g = 255 - r; // Green decreases with index
        return `rgba(${r}, ${g}, 0, 0.6)`; // Set alpha to 0.6
    };

    const handleLandfilledCheckboxChange = () => {
        setIsLandfilledChecked(prev => !prev); // Toggle the landfilled checkbox
    };

    const handleRecyclingCheckboxChange = () => {
        setIsRecyclingChecked(prev => !prev); // Toggle the recycling checkbox
    };

    const handlePlasticCheckboxChange = () => {
        setIsPlasticChecked(prev => !prev); // Toggle the plastic consumption checkbox
    };

    useEffect(() => {
        // Define base layers (OSM)
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
 // Create a layer group for base maps
            const baseMaps = new LayerGroup({
            title: 'Base maps',
            layers: [osm, satelliteLayer],
            });
        // Define Vector layer for GeoJSON (countries example)
        const vectorSource = new VectorSource({
            url: 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json', // GeoJSON source
            format: new GeoJSON(),
        });

        const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: (feature) => {
                // Get the country name from the feature properties
                const countryName = feature.get('name');

                // Color coding for landfilled countries
                if (isLandfilledChecked) {
                    const countryIndex = countriesList.indexOf(countryName);
                    if (countryIndex !== -1) {
                        const color = getColor(countryIndex, countriesList.length);
                        return new Style({
                            fill: new Fill({
                                color: color,
                            }),
                            stroke: new Stroke({
                                color: '#000000',
                                width: 1,
                            }),
                        });
                    }
                }

                // Color coding for recycling countries
                if (isRecyclingChecked) {
                    const recyclingIndex = recyclingCountriesList.indexOf(countryName);
                    if (recyclingIndex !== -1) {
                        const color = getColor(recyclingIndex, recyclingCountriesList.length);
                        return new Style({
                            fill: new Fill({
                                color: color,
                            }),
                            stroke: new Stroke({
                                color: '#000000',
                                width: 1,
                            }),
                        });
                    }
                }

                // Color coding for plastic consumption countries
                if (isPlasticChecked) {
                    const plasticIndex = plasticConsumptionList.indexOf(countryName);
                    if (plasticIndex !== -1) {
                        const color = getColor(plasticIndex, plasticConsumptionList.length);
                        return new Style({
                            fill: new Fill({
                                color: color,
                            }),
                            stroke: new Stroke({
                                color: '#000000',
                                width: 1,
                            }),
                        });
                    }
                }

                // Default style for countries not in the list or when all checkboxes are unchecked
                return new Style({
                    fill: new Fill({
                        color: 'rgba(200, 200, 200, 0.6)', // Light gray for others
                    }),
                    stroke: new Stroke({
                        color: '#000000',
                        width: 1,
                    }),
                });
            },
        });

        //search button
        document.getElementById('search').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
              var query = this.value;
              searchLocation(query);
            }
          });
          
        // Initialize the OpenLayers map
        const map = new Map({
            target: mapRef.current,
            layers: [baseMaps, vectorLayer],
            view: new View({
                center: fromLonLat([15, 54]), // Center of Europe
                zoom: 4,
            }),
        });
 // Add LayerSwitcher control
            const layerSwitcher = new LayerSwitcher({
            tipLabel: 'Layers', // Optional label for the layer switcher button
            });
            map.addControl(layerSwitcher);
        
function searchLocation(query) {
    // Nominatim API request URL
    var url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          var location = data[0]; // Take the first result from the response
          var lon = parseFloat(location.lon);
          var lat = parseFloat(location.lat);
  
          // Step 4: Pan and zoom to the location on the map
          var view = map.getView();
          var coord = fromLonLat([lon, lat]); 
          view.setCenter(fromLonLat([lon, lat]));
          view.setZoom(10);
  
          var marker = new Feature({
            geometry: new Point(coord)
          });
          const markerStyle = new Style({
            image: new Icon({
              anchor: [0.5, 1], // Anchor the icon at the bottom middle
              src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // URL of the icon image
              scale: 0.05 // Scale the icon (adjust as necessary)
            })
          });
          marker.setStyle(markerStyle);
          var vectorSource_geo = new VectorSource({
            features: [marker],
            
          });
  
          var markerLayer = new VectorLayer({
            source: vectorSource_geo
          });
  
          map.addLayer(markerLayer);
          
        }
      })
    }

        return () => {
            map.setTarget(null); // Cleanup map on component unmount
        };
    }, [isLandfilledChecked, isRecyclingChecked, isPlasticChecked]); // Re-run effect when checkbox states change

    return (
        <div>
            {/* Checkbox to toggle landfilled, recycling, and plastic consumption color coding */}
            <div style={{ position: 'absolute', top: '350px', right: '20px', background: 'rgba(255, 255, 255, 0.9)', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)', zIndex: 1000, width: '200px' }}>
                <input
                    type="checkbox"
                    checked={isLandfilledChecked}
                    onChange={handleLandfilledCheckboxChange}
                />
                <label>Landfilled</label>
                <br/>
                <input
                    type="checkbox"
                    checked={isRecyclingChecked}
                    onChange={handleRecyclingCheckboxChange}
                />
                <label>Recycling</label>
                <br/>
                <input
                    type="checkbox"
                    checked={isPlasticChecked}
                    onChange={handlePlasticCheckboxChange}
                />
                <label>Plastic Consumption</label>
            </div>

            {/* The div where the map will be rendered */}
            <div ref={mapRef} style={{ width: '100%', height: '600px' }}></div>
        </div>
    );
};

export default MapComponent;





















// // import React, { useEffect, useRef } from 'react';
// // import 'ol/ol.css'; // Import the OpenLayers default CSS
// // import { Map, View } from 'ol';
// // import TileLayer from 'ol/layer/Tile';
// // import OSM from 'ol/source/OSM';
// // import VectorLayer from 'ol/layer/Vector';
// // import VectorSource from 'ol/source/Vector';
// // import GeoJSON from 'ol/format/GeoJSON';
// // import { Fill, Stroke, Style, Circle as CircleStyle } from 'ol/style';
// // import Feature from 'ol/Feature';
// // import TileWMS from 'ol/source/TileWMS';
// // import LayerSwitcher from 'ol-layerswitcher';
// // import 'ol-layerswitcher/dist/ol-layerswitcher.css'; // LayerSwitcher CSS
// // import LayerGroup from 'ol/layer/Group';
// // import XYZ from 'ol/source/XYZ';
// // import '../css/MapComponent.css';

// // const MapComponent = () => {
// //   const mapRef = useRef(null); // Create a ref for the map container div

// //   useEffect(() => {
// //     // Define base layers (OSM, satellite)
// //     const osm = new TileLayer({
// //       title: 'OSM',
// //       type: 'base',
// //       visible: true,
// //       source: new OSM(),
// //     });

// //     const satelliteLayer = new TileLayer({
// //       title: 'Satellite Map',
// //       type: 'base',
// //       visible: false,
// //       source: new XYZ({
// //         url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
// //         maxZoom: 19,
// //       }),
// //     });

// //     // Define WMS layer (for example, 'ne:countries')
// //     const wmsLayer = new TileLayer({
// //       title: 'Geo Map',
// //       type: 'base',
// //       visible: false,
// //       source: new TileWMS({
// //         url: 'http://localhost:8080/geoserver/wms',
// //         params: { LAYERS: 'ne:countries' },
// //         ratio: 1.2,
// //         serverType: 'geoserver',
// //       }),
// //     });

// //     // Define Vector layer for GeoJSON (landfill example)
// //     const vectorSource = new VectorSource({
// //       projection: 'EPSG:4326',
// //       url: 'landfill.geojson.geojson', // Adjust to your actual GeoJSON URL
// //       format: new GeoJSON(),
// //     });
// //     console.log(vectorSource);

   
  
     

// //     // Create a layer group for base maps
// //     const baseMaps = new LayerGroup({
// //       title: 'Base maps',
// //       layers: [osm, wmsLayer, satelliteLayer],
// //     });

// //     // Create a layer group for overlays
// //     const overlayGroup = new LayerGroup({
// //       title: 'Overlays',
// //       layers: [vectorLayer],
// //     });

// //     // Initialize the OpenLayers map
// //     const map = new Map({
// //       target: mapRef.current, // Target the div using useRef
// //       layers: [baseMaps, overlayGroup], // Add both base maps and overlays
// //       view: new View({
// //         center: [52.5243700, 13.4105300], // Adjusted to the center coordinates
// //         zoom: 2,
// //       }),
// //     });

// //     // Add LayerSwitcher control
// //     const layerSwitcher = new LayerSwitcher({
// //       tipLabel: 'Layers', // Optional label for the layer switcher button
// //     });
// //     map.addControl(layerSwitcher);

// //     // Add click event listener to fit map to feature on click
// //     map.on('singleclick', (event) => {
// //       const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
// //       if (feature instanceof Feature) {
// //         map.getView().fit(feature.getGeometry());
// //       }
// //     });

    

// //     return () => {
// //       map.setTarget(null); // Cleanup map on component unmount
// //     };
// //   }, []);

// //   return (
// //     <div>
// //       {/* The div where the map will be rendered */}
// //       <div ref={mapRef} style={{ width: '100%', height: '600px' }}></div>

// //     </div>
// //   );
// // };


// // export default MapComponent;

// import React, { useEffect, useRef } from 'react';
// import 'ol/ol.css'; // Import the OpenLayers default CSS
// import { Map, View } from 'ol';
// import TileLayer from 'ol/layer/Tile';
// import OSM from 'ol/source/OSM';
// import VectorLayer from 'ol/layer/Vector';
// import VectorSource from 'ol/source/Vector';
// import GeoJSON from 'ol/format/GeoJSON';
// import { Fill, Stroke, Style } from 'ol/style';
// import { fromLonLat } from 'ol/proj'; // Import the fromLonLat function
// import '../css/MapComponent.css';

// const MapComponent = () => {
//     const mapRef = useRef(null); // Create a ref for the map container div

//     useEffect(() => {
//         // Define base layers (OSM)
//         const osm = new TileLayer({
//             source: new OSM(),
//         });

//         // Define Vector layer for GeoJSON (countries example)
//         const vectorSource = new VectorSource({
//             url: 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json', // GeoJSON source
//             format: new GeoJSON(),
//         });

//         const vectorLayer = new VectorLayer({
//             source: vectorSource,
//             style: (feature) => {
//                 // Define default style
//                 const defaultStyle = new Style({
//                     fill: new Fill({
//                         color: 'rgba(255, 255, 255, 0.6)', // Normal country color
//                     }),
//                     stroke: new Stroke({
//                         color: '#319FD3',
//                         width: 1,
//                     }),
//                 });

//                 // Define highlight style for Ireland
//                 const irelandStyle = new Style({
//                     fill: new Fill({
//                         color: 'rgba(0, 128, 0, 0.6)', // Green color for Ireland
//                     }),
//                     stroke: new Stroke({
//                         color: '#000000',
//                         width: 1,
//                     }),
//                 });

//                 // Check if the feature is Ireland and return the appropriate style
//                 if (feature.get('name') === 'Ireland') {
//                     return irelandStyle;
//                 }

//                 return defaultStyle; // Return the default style for other countries
//             },
//         });

//         // Initialize the OpenLayers map
//         const map = new Map({
//             target: mapRef.current,
//             layers: [osm, vectorLayer],
//             view: new View({
//                 center: fromLonLat([-7.065, 53.4129]), // Center of Ireland
//                 zoom: 5,
//             }),
//         });

//         return () => {
//             map.setTarget(null); // Cleanup map on component unmount
//         };
//     }, []);

//     return (
//         <div>
//             {/* The div where the map will be rendered */}
//             <div ref={mapRef} style={{ width: '100%', height: '600px' }}></div>
//         </div>
//     );
// };

// export default MapComponent;


// import React, { useEffect, useRef } from 'react';
// import 'ol/ol.css'; // Import the OpenLayers default CSS
// import { Map, View } from 'ol';
// import TileLayer from 'ol/layer/Tile';
// import OSM from 'ol/source/OSM';
// import VectorLayer from 'ol/layer/Vector';
// import VectorSource from 'ol/source/Vector';
// import GeoJSON from 'ol/format/GeoJSON';
// import { Fill, Stroke, Style } from 'ol/style';
// import { fromLonLat } from 'ol/proj'; // Import the fromLonLat function
// import '../css/MapComponent.css';

// const MapComponent = () => {
//     const mapRef = useRef(null); // Create a ref for the map container div

//     // Define the list of countries
//     const countriesList = [
// 'Serbia',
// 'Bulgaria',
// 'Spain',
// 'Greece',
// 'Lithuania',
// 'Ireland',
// 'Hungary',
// 'Italy',
// 'United Kingdom',
// 'Germany',
// 'Greece',
// 'Latvia',
// 'France',
// 'Finland',
// 'Romania',
// 'Austria',
// 'Slovakia',
// 'Montenegro',
// 'Malta',
// 'Norway',
// 'Denmark',
// 'Netherlands',
// 'Belgium',
// 'Czechia',
// 'Switzerland',
// 'Turkiye',
// 'Albania',
// 'Cyprus',
// 'Sweden',
// 'Iceland'];

//     // Create a color gradient from green to red
//     const getColor = (index, total) => {
//         const ratio = index / total;
//         const r = Math.floor(255 * ratio); // Red increases with index
//         const g = 255 - r; // Green decreases with index
//         return `rgba(${r}, ${g}, 0, 0.6)`; // Set alpha to 0.6
//     };

//     useEffect(() => {
//         // Define base layers (OSM)
//         const osm = new TileLayer({
//             source: new OSM(),
//         });

//         // Define Vector layer for GeoJSON (countries example)
//         const vectorSource = new VectorSource({
//             url: 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json', // GeoJSON source
//             format: new GeoJSON(),
//         });

//         const vectorLayer = new VectorLayer({
//             source: vectorSource,
//             style: (feature) => {
//                 // Get the country name from the feature properties
//                 const countryName = feature.get('name');

//                 // Find the index of the country in the list
//                 const countryIndex = countriesList.indexOf(countryName);

//                 // If the country is in the list, get the corresponding color
//                 if (countryIndex !== -1) {
//                     const color = getColor(countryIndex, countriesList.length);
//                     return new Style({
//                         fill: new Fill({
//                             color: color,
//                         }),
//                         stroke: new Stroke({
//                             color: '#000000',
//                             width: 1,
//                         }),
//                     });
//                 }

//                 // Default style for countries not in the list
//                 return new Style({
//                     fill: new Fill({
//                         color: 'rgba(200, 200, 200, 0.6)', // Light gray for others
//                     }),
//                     stroke: new Stroke({
//                         color: '#000000',
//                         width: 1,
//                     }),
//                 });
//             },
//         });

//         // Initialize the OpenLayers map
//         const map = new Map({
//             target: mapRef.current,
//             layers: [osm, vectorLayer],
//             view: new View({
//                 center: fromLonLat([15, 54]), // Center of Europe
//                 zoom: 4,
//             }),
//         });

//         return () => {
//             map.setTarget(null); // Cleanup map on component unmount
//         };
//     }, []);

//     return (
//         <div>
//             {/* The div where the map will be rendered */}
//             <div ref={mapRef} style={{ width: '100%', height: '600px' }}></div>
//         </div>
//     );
// };

// export default MapComponent;

// import React, { useEffect, useRef, useState } from 'react';
// import 'ol/ol.css'; // Import the OpenLayers default CSS
// import { Map, View } from 'ol';
// import TileLayer from 'ol/layer/Tile';
// import OSM from 'ol/source/OSM';
// import VectorLayer from 'ol/layer/Vector';
// import VectorSource from 'ol/source/Vector';
// import GeoJSON from 'ol/format/GeoJSON';
// import { Fill, Stroke, Style } from 'ol/style';
// import { fromLonLat } from 'ol/proj'; // Import the fromLonLat function
// import '../css/MapComponent.css';

// const MapComponent = () => {
//     const mapRef = useRef(null); // Create a ref for the map container div

//     // State to track whether the "Landfilled" checkbox is checked
//     const [isLandfilledChecked, setIsLandfilledChecked] = useState(false);

//     // Define the list of countries
//     const countriesList = [
//         'Serbia', 'Bulgaria', 'Spain', 'Greece', 'Lithuania', 'Ireland', 'Hungary',
//         'Italy', 'United Kingdom', 'Germany', 'Greece', 'Latvia', 'France', 'Finland',
//         'Romania', 'Austria', 'Slovakia', 'Montenegro', 'Malta', 'Norway', 'Denmark',
//         'Netherlands', 'Belgium', 'Czechia', 'Switzerland', 'Turkiye', 'Albania', 'Cyprus',
//         'Sweden', 'Iceland'
//     ];



//     // Create a color gradient from green to red
//     const getColor = (index, total) => {
//         const ratio = index / total;
//         const r = Math.floor(255 * ratio); // Red increases with index
//         const g = 255 - r; // Green decreases with index
//         return `rgba(${r}, ${g}, 0, 0.6)`; // Set alpha to 0.6
//     };

//     const handleCheckboxChange = () => {
//         setIsLandfilledChecked(prev => !prev); // Toggle the checkbox
//     };

//     useEffect(() => {
//         // Define base layers (OSM)
//         const osm = new TileLayer({
//             source: new OSM(),
//         });

//         // Define Vector layer for GeoJSON (countries example)
//         const vectorSource = new VectorSource({
//             url: 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json', // GeoJSON source
//             format: new GeoJSON(),
//         });

//         const vectorLayer = new VectorLayer({
//             source: vectorSource,
//             style: (feature) => {
//                 // Get the country name from the feature properties
//                 const countryName = feature.get('name');

//                 // If the checkbox is checked, apply the color coding
//                 if (isLandfilledChecked) {
//                     // Find the index of the country in the list
//                     const countryIndex = countriesList.indexOf(countryName);

//                     // If the country is in the list, get the corresponding color
//                     if (countryIndex !== -1) {
//                         const color = getColor(countryIndex, countriesList.length);
//                         return new Style({
//                             fill: new Fill({
//                                 color: color,
//                             }),
//                             stroke: new Stroke({
//                                 color: '#000000',
//                                 width: 1,
//                             }),
//                         });
//                     }
//                 }

//                 // Default style for countries not in the list or when the checkbox is unchecked
//                 return new Style({
//                     fill: new Fill({
//                         color: 'rgba(200, 200, 200, 0.6)', // Light gray for others
//                     }),
//                     stroke: new Stroke({
//                         color: '#000000',
//                         width: 1,
//                     }),
//                 });
//             },
//         });

//         // Initialize the OpenLayers map
//         const map = new Map({
//             target: mapRef.current,
//             layers: [osm, vectorLayer],
//             view: new View({
//                 center: fromLonLat([15, 54]), // Center of Europe
//                 zoom: 4,
//             }),
//         });

//         return () => {
//             map.setTarget(null); // Cleanup map on component unmount
//         };
//     }, [isLandfilledChecked]); // Re-run effect when checkbox state changes

//     return (
//         <div>
//             {/* Checkbox to toggle landfilled color coding */}
//             <div style={{ position: 'absolute',
//                 top: '150px',
//                 right: '20px',
//                 background: 'rgba(255, 255, 255, 0.9)',
//                 padding: '15px',
//                 borderRadius: '8px',
//                 boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
//                 zIndex: 1000, // Set z-index to ensure it's on top of the map
//                 width: '200px',}}>
//                 <input
//                     type="checkbox"
//                     checked={isLandfilledChecked}
//                     onChange={handleCheckboxChange}
//                 />
//                 <label>Landfilled</label>
//             </div>
            
//                 {/* top: '10px',
//                 left: '10px',
//                 background: 'rgba(255, 255, 255, 0.8)',
//                 padding: '10px',
//                 borderRadius: '5px',
//                 boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', */}

//             {/* The div where the map will be rendered */}
//             <div ref={mapRef} style={{ width: '100%', height: '600px' }}></div>
//         </div>
//     );
// };

// export default MapComponent;

// import React, { useEffect, useRef, useState } from 'react';
// import 'ol/ol.css'; // Import the OpenLayers default CSS
// import { Map, View } from 'ol';
// import TileLayer from 'ol/layer/Tile';
// import OSM from 'ol/source/OSM';
// import VectorLayer from 'ol/layer/Vector';
// import VectorSource from 'ol/source/Vector';
// import GeoJSON from 'ol/format/GeoJSON';
// import { Fill, Stroke, Style } from 'ol/style';
// import { fromLonLat } from 'ol/proj'; // Import the fromLonLat function
// import '../css/MapComponent.css';

// const MapComponent = () => {
//     const mapRef = useRef(null); // Create a ref for the map container div

//     // State to track the checkbox for "Landfilled" and "Recycling" countries
//     const [isLandfilledChecked, setIsLandfilledChecked] = useState(false);
//     const [isRecyclingChecked, setIsRecyclingChecked] = useState(false);

//     // Define the list of landfilled countries
//     const countriesList = [
//         'Serbia', 'Bulgaria', 'Spain', 'Greece', 'Lithuania', 'Ireland', 'Hungary',
//         'Italy', 'United Kingdom', 'Germany', 'Greece', 'Latvia', 'France', 'Finland',
//         'Romania', 'Austria', 'Slovakia', 'Montenegro', 'Malta', 'Norway', 'Denmark',
//         'Netherlands', 'Belgium', 'Czechia', 'Switzerland', 'Turkiye', 'Albania', 'Cyprus',
//         'Sweden', 'Iceland'
//     ];

//     // Define and sort the list of recycling countries
//     const recyclingCountriesList = [
//         "Germany", "Austria", "Slovenia", "Netherlands", "Denmark", "Belgium", "Luxembourg",
//         "Italy", "Slovakia", "Lithuania", "Latvia", "France", "Czechia", "Ireland",
//         "Poland", "Sweden", "Finland", "Spain", "Hungary", "Croatia", "Portugal",
//         "Estonia", "Bulgaria", "Greece", "Cyprus", "Malta", "Romania"
//     ];

//     // Create a color gradient from green to red
//     const getColor = (index, total) => {
//         const ratio = index / total;
//         const r = Math.floor(255 * ratio); // Red increases with index
//         const g = 255 - r; // Green decreases with index
//         return `rgba(${r}, ${g}, 0, 0.6)`; // Set alpha to 0.6
//     };

//     const handleLandfilledCheckboxChange = () => {
//         setIsLandfilledChecked(prev => !prev); // Toggle the landfilled checkbox
//     };

//     const handleRecyclingCheckboxChange = () => {
//         setIsRecyclingChecked(prev => !prev); // Toggle the recycling checkbox
//     };

//     useEffect(() => {
//         // Define base layers (OSM)
//         const osm = new TileLayer({
//             source: new OSM(),
//         });

//         // Define Vector layer for GeoJSON (countries example)
//         const vectorSource = new VectorSource({
//             url: 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json', // GeoJSON source
//             format: new GeoJSON(),
//         });

//         const vectorLayer = new VectorLayer({
//             source: vectorSource,
//             style: (feature) => {
//                 // Get the country name from the feature properties
//                 const countryName = feature.get('name');

//                 // Color coding for landfilled countries
//                 if (isLandfilledChecked) {
//                     const countryIndex = countriesList.indexOf(countryName);
//                     if (countryIndex !== -1) {
//                         const color = getColor(countryIndex, countriesList.length);
//                         return new Style({
//                             fill: new Fill({
//                                 color: color,
//                             }),
//                             stroke: new Stroke({
//                                 color: '#000000',
//                                 width: 1,
//                             }),
//                         });
//                     }
//                 }

//                 // Color coding for recycling countries
//                 if (isRecyclingChecked) {
//                     const recyclingIndex = recyclingCountriesList.indexOf(countryName);
//                     if (recyclingIndex !== -1) {
//                         const color = getColor(recyclingIndex, recyclingCountriesList.length);
//                         return new Style({
//                             fill: new Fill({
//                                 color: color,
//                             }),
//                             stroke: new Stroke({
//                                 color: '#000000',
//                                 width: 1,
//                             }),
//                         });
//                     }
//                 }

//                 // Default style for countries not in the list or when both checkboxes are unchecked
//                 return new Style({
//                     fill: new Fill({
//                         color: 'rgba(200, 200, 200, 0.6)', // Light gray for others
//                     }),
//                     stroke: new Stroke({
//                         color: '#000000',
//                         width: 1,
//                     }),
//                 });
//             },
//         });

//         // Initialize the OpenLayers map
//         const map = new Map({
//             target: mapRef.current,
//             layers: [osm, vectorLayer],
//             view: new View({
//                 center: fromLonLat([15, 54]), // Center of Europe
//                 zoom: 4,
//             }),
//         });

//         return () => {
//             map.setTarget(null); // Cleanup map on component unmount
//         };
//     }, [isLandfilledChecked, isRecyclingChecked]); // Re-run effect when checkbox states change

//     return (
//         <div>
//             {/* Checkbox to toggle landfilled color coding */}
//             <div style={{ position: 'absolute', top: '150px', right: '20px', background: 'rgba(255, 255, 255, 0.9)', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)', zIndex: 1000, width: '200px' }}>
//                 <input
//                     type="checkbox"
//                     checked={isLandfilledChecked}
//                     onChange={handleLandfilledCheckboxChange}
//                 />
//                 <label>Landfilled</label>
//                 <br/>
//                 <input
//                     type="checkbox"
//                     checked={isRecyclingChecked}
//                     onChange={handleRecyclingCheckboxChange}
//                 />
//                 <label>Recycling</label>
//             </div>

//             {/* The div where the map will be rendered */}
//             <div ref={mapRef} style={{ width: '100%', height: '600px' }}></div>
//         </div>
//     );
// };

// export default MapComponent;