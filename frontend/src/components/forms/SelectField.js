// src/components/forms/SelectField.js
import React from 'react';

const SelectField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options, 
  required = false, 
  error = "" 
}) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={error ? 'error' : ''}
      >
        <option value="">Select {label}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default SelectField;