import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/zen', icon: '🧘', label: 'Breathing' },
    { path: '/visual', icon: '🌸', label: 'Mindset' },
    { path: '/music', icon: '🎵', label: 'Music' },
    { path: '/reframe', icon: '💭', label: 'Journal' },
    { path: '/journal', icon: '📖', label: 'Articles' }
  ];

  return (
    <motion.div
      className="sidebar"
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="sidebar-logo">
        <span style={{ fontSize: '2rem' }}>🌸</span>
        <h1>Serenity</h1>
      </div>
      
      <nav>
        <ul className="sidebar-nav">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div style={{ marginTop: 'auto', padding: '1rem 0' }}>
        <Link to="/settings" className="sidebar-nav-item">
          <span className="sidebar-nav-icon">⚙️</span>
          Settings
        </Link>
        <div style={{ marginTop: '1rem', padding: '1rem 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Link to="/profile" className="sidebar-nav-item">
            <span className="sidebar-nav-icon">👤</span>
            Profile
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;