// MenuItem.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './layout.css';

const MenuItem = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
   
      <Link 
        to={to} 
        className={`menuItemWhite ${isActive ? 'menuItem' : ''}`}
      >
        {label}
      </Link>
   
  );
};

export default MenuItem;
