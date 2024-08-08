// Button.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

const Button = ({ onClick, to, children, className, buttonRef, style, primary, secondary, red, disabled }) => {
  const buttonType = () => {
    if (primary) {
      return 'btnPrimary';
    } else if (secondary) {
      return 'btnSecondary';
    } else if (red) {
      return 'btnRed';
    } else if (disabled) {
      return 'disabled';
    } else {
      return 'btn'; // Default class if none of the props are set
    }
  };

  const classNames = `btn ${buttonType()} ${className}`;

  if (to) {
    return (
      <Link
        to={to}
        ref={buttonRef}
        onClick={onClick}
        style={style}
        className={classNames}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      style={style}
      disabled={disabled}
      className={classNames}
    >
      {children}
    </button>
  );
};

export default Button;
