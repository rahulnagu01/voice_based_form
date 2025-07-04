// src/components/forms/InputField.js
import React from 'react';

const InputField = ({ 
  label, 
  type = "text", 
  name, 
  value, 
  onChange, 
  required = false, 
  error = "" 
}) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={error ? 'error' : ''}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default InputField;