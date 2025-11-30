import React from 'react';
import styles from './Button.module.css';
import { Spinner } from '../Spinner/Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'danger';
  isLoading?: boolean;
}

export const Button = ({ 
  variant = 'primary', 
  isLoading, 
  children, 
  className, 
  disabled,
  ...props 
}: ButtonProps) => {
  return (
    <button 
      className={`${styles.btn} ${styles[variant]} ${className || ''}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner size="sm" className={styles.spinner} />}
      {children}
    </button>
  );
};