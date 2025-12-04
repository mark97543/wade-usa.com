// services/main/src/components/atoms/Radio/Radio.tsx
import type { InputHTMLAttributes } from 'react';
import styles from './Radio.module.css';

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  name: string; // Required for a radio group to function
  value: string; // Required for form data
}

/**
 * An individual, theme-aware radio button input.
 * Relies on the parent component (RadioGroup) for shared state management.
 */
export const Radio = ({ label, id, name, value, checked, onChange, ...props }: RadioProps) => {
  return (
    <label htmlFor={id} className={styles.label}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className={styles.input}
        {...props}
      />
      <div className={styles.indicator} />
      {label}
    </label>
  );
};