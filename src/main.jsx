import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Import the root App component
//import './index.css'; // Optionally import global styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
