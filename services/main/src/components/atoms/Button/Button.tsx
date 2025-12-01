import React from 'react';
import styles from './Button.module.css';
import { Spinner } from '../Spinner/Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg'; // Added Size Prop
  isLoading?: boolean;
}

export const Button = ({ 
  variant = 'primary', 
  size = 'md', // Default to Medium
  isLoading, 
  children, 
  className, 
  disabled,
  ...props 
}: ButtonProps) => {
  return (
    <button 
      // Combine base class, variant class, and size class
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${className || ''}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* If loading, show spinner. If small button, use small spinner. */}
      {isLoading && <Spinner size={size === 'sm' ? 'sm' : 'md'} className={styles.spinner} />}
      {children}
    </button>
  );
};