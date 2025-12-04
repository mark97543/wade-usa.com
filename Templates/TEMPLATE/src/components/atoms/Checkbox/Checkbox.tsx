// services/main/src/components/atoms/Checkbox/Checkbox.tsx

import type { InputHTMLAttributes } from 'react'; // Fix for verbatimModuleSyntax
import styles from './Checkbox.module.css';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  name: string; // Required for form data
  value: string; // Required for form data
}

/**
 * An individual, theme-aware checkbox input element.
 */
export const Checkbox = ({ label, id, name, value, checked, onChange, ...props }: CheckboxProps) => {
  return (
    <label htmlFor={id} className={styles.label}>
      <input
        type="checkbox"
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