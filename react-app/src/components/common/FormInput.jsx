import React from 'react';

const FormInput = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  error,
  placeholder = '',
  required = false
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 ${
          error 
            ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
            : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormInput;
