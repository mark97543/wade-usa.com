import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner = ({ size = 'md', className }: SpinnerProps) => {
  // Grab the specific class for the size (e.g., styles.sm, styles.md)
  const sizeClass = styles[size];

  return (
    <div 
      className={`${styles.spinner} ${sizeClass} ${className || ''}`} 
      role="status"
    />
  );
};