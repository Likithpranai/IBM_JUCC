import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/navigation.css';

// University Exchange Logo SVG
const ExchangeLogo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 0L37.3205 10V30L20 40L2.67949 30V10L20 0Z" fill="#1e40af"/>
    <path d="M20 5L32.3205 12V26L20 33L7.67949 26V12L20 5Z" fill="white" fillOpacity="0.2"/>
    <path d="M20 10L27.3205 14V22L20 26L12.6795 22V14L20 10Z" fill="#f59e0b"/>
  </svg>
);

const Navigation: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path ? 'nav-item active' : 'nav-item';
  };

  return (
    <nav className="navigation">
      <div className="nav-header">
        <div className="nav-branding">
          <div className="exchange-logo">
            <ExchangeLogo />
          </div>
          <div className="nav-titles">
            <h1 className="nav-title">Exchange Connect</h1>
            <div className="nav-subtitle">
              <span className="watson-icon">🎓</span>
              <span>Global Student Exchange</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="nav-profile">
        <div className="profile-image">
          <img src="/profile-placeholder.png" alt="Profile" />
        </div>
        <div className="profile-info">
          <p className="profile-name">John Doe</p>
          <p className="profile-university">HKUST</p>
        </div>
      </div>
      
      <ul className="nav-menu">
        <li className={isActive('/profile')}>
          <Link to="/profile">
            <i className="nav-icon">👤</i>
            <span>Student Profile</span>
          </Link>
        </li>
        <li className={isActive('/chatbot')}>
          <Link to="/chatbot">
            <i className="nav-icon">🤖</i>
            <span>AI Assistant</span>
          </Link>
        </li>
        <li className={isActive('/matchmaking')}>
          <Link to="/matchmaking">
            <i className="nav-icon">🌟</i>
            <span>University Matchmaking</span>
          </Link>
        </li>
        <li className={isActive('/admin')}>
          <Link to="/admin">
            <i className="nav-icon">⚙️</i>
            <span>Admin Panel</span>
          </Link>
        </li>
      </ul>
      
      <div className="nav-footer">
        <button className="btn-logout">
          <i className="nav-icon">🚪</i>
          <span>Logout</span>
        </button>
        <p className="nav-version">v1.0.0</p>
      </div>
    </nav>
  );
};

export default Navigation;
