import React from 'react';
import './Navbar.css';
import 'font-awesome/css/font-awesome.min.css';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token or authentication data
    localStorage.removeItem('token'); // Assuming JWT token is stored in localStorage

    // Navigate to the authentication page
    navigate('/auth');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>DriveSafePro</h2>
      </div>
      <div className="navbar-buttons">
        <Link to="/" className="nav-button home-button" aria-label="Home">
          <i className="fa fa-home" aria-hidden="true"></i>
        </Link>
        
        <Link to="/peaktime" className="nav-button peak-time-button" aria-label="Peak Time">
          <i className="fa fa-clock-o" aria-hidden="true"></i>
          <span>Peak Time</span>
        </Link>

        {/* Account Button - Links to AccountPage */}
        <Link to="/account" className="nav-button" aria-label="Account">
          <i className="fa fa-user" aria-hidden="true"></i>
        </Link>
        
        {/* Notification Icon as a direct Link to Notifications Page */}
        <Link to="/notifications" className="nav-button bell-button" aria-label="Notifications">
          <i className="fa fa-bell" aria-hidden="true"></i>
        </Link>
        
        <button onClick={handleLogout} className="nav-button logout" aria-label="Logout">
          <i className="fa fa-sign-out" aria-hidden="true"></i>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
