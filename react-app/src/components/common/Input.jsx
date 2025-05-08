// src/components/common/Input.jsx
import React from 'react';

const Input = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-gray-700 font-medium mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`form-input ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;