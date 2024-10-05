// src/components/SignupPage.js
import React, { useState } from 'react';

const SignupPage = () => {
  const [userType, setUserType] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle signup logic here
    console.log('User Type:', userType);
  };

  return (
    <div style={styles.container}>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" placeholder="Username" style={styles.input} required />
        <input type="email" placeholder="Email" style={styles.input} required />
        <input type="password" placeholder="Password" style={styles.input} required />
        <select value={userType} onChange={(e) => setUserType(e.target.value)} style={styles.input} required>
          <option value="">Select User Type</option>
          <option value="Municipalities and Local Governments">Municipalities and Local Governments</option>
          <option value="Environmental Agencies">Environmental Agencies</option>
          <option value="Waste Management Companies">Waste Management Companies</option>
          <option value="Business and Corporations">Business and Corporations</option>
          <option value="Nonprofit and Advocacy Groups">Nonprofit and Advocacy Groups</option>
          <option value="Research Institutions">Research Institutions</option>
        </select>
        <button type="submit" style={styles.button}>Signup</button>
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

export default SignupPage;
