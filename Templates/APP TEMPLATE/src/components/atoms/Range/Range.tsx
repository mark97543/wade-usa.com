// services/main/src/components/atoms/Range/Range.tsx

import React, { useState, useEffect } from 'react';
import type { InputHTMLAttributes } from 'react';
import styles from './Range.module.css';

interface RangeProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  id: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  initialValue?: number;
  onChange?: (value: number) => void;
}

/**
 * An accessible, theme-aware range slider component.
 */
export const Range = ({ 
  id, 
  label, 
  min, 
  max, 
  step = 1, 
  initialValue, 
  onChange, 
  ...props 
}: RangeProps) => {
  
  // Use a controlled input pattern, defaulting to min value if initialValue is not provided
  const [currentValue, setCurrentValue] = useState(initialValue ?? min);

  // Sync internal state if initialValue prop changes externally
  useEffect(() => {
    if (initialValue !== undefined && initialValue !== currentValue) {
      setCurrentValue(initialValue);
    }
  }, [initialValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setCurrentValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={styles.container}>
      <label htmlFor={id} className={styles.label}>
        {label}
        <span className={styles.value}>{currentValue}</span>
      </label>
      <input
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={handleChange}
        className={styles.input}
        {...props}
      />
    </div>
  );
};