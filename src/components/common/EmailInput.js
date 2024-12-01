'use client';

import { useState, useEffect, useRef } from 'react';
import { validateEmail } from '@/utils/emailValidation';
import { Icon } from '@iconify/react';

export default function EmailInput({
  value,
  onChange,
  onValidation,
  placeholder = "Enter your email",
  required = true,
  className = "",
  validateOnChange = true,
  showIcon = true,
  disabled = false
}) {
  const [validation, setValidation] = useState({ isValid: true, error: null });
  const [isValidating, setIsValidating] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const validationTimeout = useRef(null);

  useEffect(() => {
    return () => {
      if (validationTimeout.current) {
        clearTimeout(validationTimeout.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Reset validation if empty
    if (!newValue.trim()) {
      setValidation({ isValid: true, error: null });
      setIsValidating(false);
      setShowValidation(false);
      if (validationTimeout.current) {
        clearTimeout(validationTimeout.current);
      }
      return;
    }

    // Only start validation after @ is typed
    if (newValue.includes('@')) {
      setShowValidation(true);
      setIsValidating(true);
      
      if (validationTimeout.current) {
        clearTimeout(validationTimeout.current);
      }

      validationTimeout.current = setTimeout(() => {
        const result = validateEmail(newValue);
        setValidation(result);
        setIsValidating(false);
        onValidation?.(result);
      }, 500);
    } else {
      setShowValidation(false);
      setValidation({ isValid: true, error: null });
    }
  };

  const handleBlur = () => {
    if (value) {
      const result = validateEmail(value);
      setValidation(result);
      onValidation?.(result);
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="email"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full px-4 py-2.5 rounded-lg transition-all duration-200
            ${showValidation
              ? validation.error
                ? 'border-2 border-red-500 bg-white focus:ring-2 focus:ring-red-200'
                : 'border-2 border-green-500 bg-white focus:ring-2 focus:ring-green-200'
              : 'border border-gray-200 bg-gray-50 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white'
            }
            ${showIcon ? 'pr-10' : ''}
            outline-none shadow-sm text-gray-900 placeholder-gray-400
            disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
            ${className}
          `}
        />
        {showIcon && showValidation && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {isValidating ? (
              <Icon 
                icon="mdi:loading" 
                className="w-5 h-5 text-indigo-600 animate-spin" 
              />
            ) : validation.error ? (
              <Icon 
                icon="mdi:alert-circle" 
                className="w-5 h-5 text-red-500" 
              />
            ) : (
              <Icon 
                icon="mdi:check-circle" 
                className="w-5 h-5 text-green-500" 
              />
            )}
          </div>
        )}
      </div>
      {validation.error && showValidation && (
        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
          <Icon icon="mdi:alert-circle-outline" className="w-4 h-4" />
          {validation.error}
        </p>
      )}
    </div>
  );
}
