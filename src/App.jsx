import React from 'react';
import MapComponent from './components/MapComponent';
import HeaderComponent from './components/HeaderComponent';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';



function App() {
    // Function to handle the search from the header
    const handleSearchLocation = (location) => {
      console.log('Search for location:', location);
      // You can use a geocoding service to get coordinates from location name
      // Once you have the coordinates, pass them to the MapComponent to pan/zoom the map
    };
  
    return (
      <div className="App">
        <HeaderComponent onSearch={handleSearchLocation} />
        <MapComponent />
      </div>
    );
  }
  
  export default App;
  