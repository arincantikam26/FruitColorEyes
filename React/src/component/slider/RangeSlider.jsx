import React from 'react';

const RangeSlider = ({ label, name, min, max, value, onChange, style, disabled }) => {
  return (
    <div className="mb-3 range-slider">
      <label htmlFor={name} className="form-label">
        {label}:
      </label>
      <input
        type="range"
        name={name}
        min={min}
        max={max}
        id={name}
        value={value}
        onChange={onChange}
        style={style}
        className="slider-input"
        disabled={disabled}
      />
      <span className="slider-value">{value}</span>
    </div>
  );
};

export default RangeSlider;
