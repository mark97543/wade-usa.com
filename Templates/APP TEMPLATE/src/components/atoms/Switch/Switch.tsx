// services/main/src/components/atoms/Switch/Switch.tsx

import React from 'react';
import type { InputHTMLAttributes } from 'react'; // Fix for verbatimModuleSyntax
import styles from './Switch.module.css';

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  id: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * An accessible, theme-aware toggle switch component.
 * It is a controlled component using an internal hidden checkbox input.
 */
export const Switch = ({ label, id, checked, onChange, disabled, ...props }: SwitchProps) => {
  return (
    <label htmlFor={id} className={styles.label}>
      <input
        type="checkbox"
        role="switch" // Improve accessibility for screen readers
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={styles.input}
        {...props}
      />
      <div className={styles.indicator} />
      {label}
    </label>
  );
};