import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css'; // Custom CSS for admin login
import logo from './Copy of T.png'; // Same logo as used in CustomerLogin

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [formValid, setFormValid] = useState(true);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !password || !/\S+@\S+\.\S+/.test(email)) {
      setFormValid(false);
      return false;
    }
    setFormValid(true);
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:5004/admin/login', { email, password });

      if (response.status === 200) {
        // Redirect to the admin dashboard upon successful login
        localStorage.setItem('token', response.data.token);
        navigate('/admin-dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error('Error during admin login:', error);
    }
  };

  // Navigate to the registration page
  const goToRegister = () => {
    navigate('/admin-register');
  };

  // Navigate to forgot password page
  const goToForgotPassword = () => {
    navigate('/admin-forgot');
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="logo">
          <img src={logo} alt="IndiTel Logo" className="logo-image" />
          <h1 className="company-name">Welcome to IndiTel</h1>
        </div>
      </header>

      <main className="login-main">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Admin Login</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin Email"
            className={!formValid && (!email || !/\S+@\S+\.\S+/.test(email)) ? 'input-error' : ''}
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={!formValid && !password ? 'input-error' : ''}
            required
          />
          <button type="submit" className="login-button">Login</button>
          {error && <p className="error-message">{error}</p>}
          {!formValid && <p className="error-message">Please enter valid details</p>}
          <p className="forgot-password" onClick={goToForgotPassword}>Forgot Password?</p>
        </form>
        {/* <p className="register-link" onClick={goToRegister}>New admin? Register here</p> */}
      </main>
    </div>
  );
};

export default AdminLogin;
