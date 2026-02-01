/**
 * Checkbox Component
 * * Logic:
 * 1. A theme-aware custom checkbox that hides the native input.
 * 2. Uses a custom 'indicator' div to render the checkmark.
 * 3. Supports all standard HTML input properties via inheritance.
 * * Wade-Template Integration:
 * - Uses CSS variables for --accent-color and --surface-color.
 * - Accessible via focus-visible outlines.
 */

import type { InputHTMLAttributes } from 'react'; 
import styles from './Checkbox.module.css';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  // name and value are inherited from InputHTMLAttributes, making them optional but available
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