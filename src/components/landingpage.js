import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './landingpage.css';
import logo from './Copy of T.png'; // Replace with your actual logo image path
import HeroImage from './one.jpg'; // Replace with your actual moving image path
import aboutImage from './two.jpeg'; // Replace with your actual About Us image path

const LandingPage = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [planType, setPlanType] = useState('All'); // State for selected plan type

  // Fetch plans from the backend
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('http://localhost:5004/services/getplans'); // Adjust endpoint as necessary
        const data = await response.json();
        setPlans(data);
        setFilteredPlans(data); // Initialize filtered plans
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    fetchPlans();
  }, []);

  // Update filtered plans based on selected type
  useEffect(() => {
    if (planType === 'All') {
      setFilteredPlans(plans);
    } else {
      setFilteredPlans(plans.filter(plan => plan.planType === planType));
    }
  }, [planType, plans]);
  const handleCustomerClick = (planId) => {
    // Store the selected plan ID in localStorage or state
    localStorage.setItem('selectedPlanId', planId);
  
    // Navigate to the registration page
    navigate('/register');
  };

  const handleAdminClick = () => {
    navigate('/admin-login');
  };

  const handleCustomerLogin = () => {
    navigate('/customer-login');
  };

  return (
    <div className="landing-page">
      {/* Navbar */}
      <header className="landing-header">
        <div className="logo">
          <img src={logo} alt="IndiTel Logo" className="logo-image" />
          <h1 className="company-name">IndiTel</h1>
        </div>
        <nav className="navbar">
          <ul className="nav-links">
            <li onClick={() => window.scrollTo(0, 0)}>Home</li>
            <li onClick={() => window.scrollTo(0, document.getElementById('about-section').offsetTop)}>About Us</li>
            <li onClick={() => window.scrollTo(0, document.getElementById('services-section').offsetTop)}>Services</li>
          </ul>
        </nav>
        <div className="login-buttons">
          <button className="admin-login" onClick={handleAdminClick}>Admin Login</button>
          <button className="customer-login" onClick={handleCustomerLogin}>Customer Login</button>
        </div>
      </header>

      {/* Hero Section */}
      <section class="hero-section">
        <div class="hero-content">
            <h1 class="hero-title">Welcome to IndiTel</h1>
            <p class="hero-subtitle">Join us today and explore amazing opportunities!</p>
            <button class="cta-button" onClick={handleCustomerLogin}>Get Started</button>
        </div>
        <div class="hero-image-container">
        <img src={HeroImage} alt="About Us" className="about-image" />
            </div>
     </section>



      {/* About Us Section */}
      <section id="about-section" className="about-section">
        <div className="about-content">
          <div className="about-image-container">
            <img src={aboutImage} alt="About Us" className="about-image" />
          </div>
          <div className="about-text">
            <h2>About Us</h2>
            <p>
              IndiTel is committed to providing reliable and affordable communication services. Our mission is to ensure seamless connectivity for all our customers, offering the best mobile and broadband solutions tailored to your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services-section" className="services-section">
        <h2>Our Plans</h2>

        {/* Dropdown for selecting plan type */}
        <div className='dropDown'>
        <select value={planType} onChange={(e) => setPlanType(e.target.value)}>
          <option value="All">All</option>
          <option value="Prepaid">Prepaid</option>
          <option value="Postpaid">Postpaid</option>
        </select>
        </div>

        <div className="catalog">
          {filteredPlans.length > 0 ? (
            filteredPlans.map((plan) => (
              <div className="catalog-item card" key={plan.id}>
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
                <p>Price: ₹{plan.price}</p>
                <div className="services-included">
                  {plan.servicesIncluded?.fiberLandline && (
                    <div>
                      <h4>Fiber + Landline</h4>
                      <p>{plan.servicesIncluded.fiberLandline.speed}</p>
                      <p>{plan.servicesIncluded.fiberLandline.calls}</p>
                    </div>
                  )}
                  {plan.servicesIncluded?.dth && (
                    <div>
                      <h4>DTH</h4>
                      <p>{plan.servicesIncluded.dth.value}</p>
                    </div>
                  )}
                </div>
                <button onClick={() => handleCustomerClick(plan.id)}>Register</button>
              </div>
            ))
          ) : (
            <p>No plans available</p>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="landing-footer">
        <div className="footer-column">
          <h3>Contact Us</h3>
          <p>Phone: 123-456-7890</p>
          <p>Email: info@inditel.com</p>
        </div>
        <div className="footer-column">
          <h3>Terms and Conditions</h3>
          <ul>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
