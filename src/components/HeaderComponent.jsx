import React, { useState } from 'react';

const HeaderComponent = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    if (searchText.trim() !== '') {
      onSearch(searchText);
    }
  };
return (
    <header style={styles.header}>
      <div style={styles.teamName}>
        <h1>EcoZone Mapper</h1>
      </div>
      <div style={styles.searchBox}>
        <input
          id="search"
          type="text"
          placeholder="Search location..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={styles.searchInput}
        />
        <button onClick={handleSearch} style={styles.searchButton}>
          Search
        </button>
      </div>
      {/* <div style={styles.authButtons}>
        <button style={styles.loginButton}>Login</button>
        <button style={styles.signupButton}>Signup</button>
      </div> */}
    </header>
  );
};

// Simple inline styles
const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#282c34',
    color: 'white',
    padding: '10px 20px',
  },
  teamName: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '5px', // Vertically center the text in the viewport
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', // Blue gradient background
    color: '#fff', // White text color
    fontFamily: "'Poppins', sans-serif", // Stylish font
    fontSize: '10px', // Smaller font size
    textShadow: '2px 4px 6px rgba(0, 0, 0, 0.3)', // Text shadow for depth
    letterSpacing: '3px', // Spacing between letters for a modern look
    borderRadius: '20px', // Rounded corners for the div
    padding: '20px 40px', // Add padding inside the div
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // Soft shadow around the div
    border: '2px solid rgba(255, 255, 255, 0.2)', // Subtle border
    marginRight:'15px'

  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    flex: 2,
    maxWidth: '400px', // Set a maximum width
    width: '100%', // Allow it to take full width of the parent element up to maxWidth
    margin: '0 auto', // Center the search box horizontally
    padding: '10px', // Optional: add some padding for aesthetics
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Optional: add a soft shadow
    borderRadius: '8px', // Optional: rounded corners
    marginRight:'50px'
  },
  searchInput: {
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginRight: '10px',
    flex: 1,
  },
  searchButton: {
    padding: '8px 16px',
    fontSize: '16px',
    backgroundColor: '#61dafb',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  authButtons: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  loginButton: {
    padding: '8px 16px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    marginRight: '10px',
    cursor: 'pointer',
  },
  signupButton: {
    padding: '8px 16px',
    fontSize: '16px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default HeaderComponent;

