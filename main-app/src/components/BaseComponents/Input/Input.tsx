/**
 * ⌨️ COMPONENT: Input
 * One component to rule them all. Handles text, password, number, date, and textarea.
 */

import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  renderAs?: 'input' | 'textarea'; // We only need to distinguish between these two tags
}

export default function Input({ label, error, renderAs = 'input', className, ...props }: InputProps) {
  
  const combinedClassName = `${styles.INPUT_FIELD} ${error ? styles.ERROR_BORDER : ''} ${className || ''}`;

  return (
    <div className={styles.INPUT_GROUP}>
      {label && <label className={styles.LABEL}>{label}</label>}

      {renderAs === 'textarea' ? (
        <textarea 
          className={`${combinedClassName} ${styles.TEXTAREA}`} 
          {...(props as any)} 
        />
      ) : (
        /* Handles type="text", type="password", type="number", type="date", type="email", etc. */
        <input 
          className={combinedClassName} 
          {...(props as any)} 
        />
      )}

      {error && <span className={styles.ERROR_TEXT}>{error}</span>}
    </div>
  );
}

// /* Password Field */
// <Input label="Secret Key" type="password" placeholder="••••••••" />

// /* Number Field */
// <Input label="Quantity" type="number" min="1" max="100" />

// /* Date Field */
// <Input label="Deadline" type="date" />

// /* Textarea (This is the only one that needs 'renderAs') */
// <Input label="Description" renderAs="textarea" />