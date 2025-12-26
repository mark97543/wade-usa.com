import React from 'react';
import styles from './FormGroup.module.css';

interface FormGroupProps {
  label: string;
  children: React.ReactNode; // Usually an <Input>
  error?: string;
  id?: string;
}

export const FormGroup = ({ label, children, error, id }: FormGroupProps) => {
  return (
    <div className={styles.group}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};