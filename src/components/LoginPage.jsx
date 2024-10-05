// src/components/LoginPage.js
import React from 'react';

const LoginPage = () => {
  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form style={styles.form}>
        <input type="text" placeholder="Username" style={styles.input} required />
        <input type="password" placeholder="Password" style={styles.input} required />
        <button type="submit" style={styles.button}>Login</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: 'auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '10px',
    margin: '10px 0',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    backgroundColor: '#61dafb',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default LoginPage;
