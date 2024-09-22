import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CustomerLogin.css';
import logo from './Copy of T.png'; // Import the logo for IndiTel

const CustomerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5004/auth/login', {
        email,
        password,
      });

      const { token } = response.data; // Get both token and customerId from response

      // Save JWT token and customerEmail in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('customerEmail', email); // Store customer email to be used later in the app

      if (response.status === 200) {
        alert('Login successful');
        // Redirect to customer dashboard
        navigate('/customer-dashboard');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error('Error during customer login:', error);
    }
  };

  // Redirect to the Forgot Password page
  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="login-page">
      {/* Header matching LandingPage */}
      <header className="login-header">
        <div className="logo">
          <img src={logo} alt="IndiTel Logo" className="logo-image" />
          <h1 className="company-name">Welcome to IndiTel</h1>
        </div>
      </header>

      <main className="login-main">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Customer Login</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Customer Email"
            className="form-input"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="form-input"
            required
          />
          <button type="submit" className="login-button">Login</button>
          {error && <p className="error-message">{error}</p>}
        </form>
        <button className="forgot-password-button" onClick={handleForgotPassword}>
          Forgot Password?
        </button>
      </main>
    </div>
  );
};

export default CustomerLogin;
