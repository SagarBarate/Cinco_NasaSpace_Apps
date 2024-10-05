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
        <h1>Cinco Voyagers</h1>
      </div>
      <div style={styles.searchBox}>
        <input
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
      <div style={styles.authButtons}>
        <button style={styles.loginButton}>Login</button>
        <button style={styles.signupButton}>Signup</button>
      </div>
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
    flex: 1,
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    flex: 2,
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

