import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner = ({ className }: SpinnerProps) => {
  return <div className={`${styles.spinner} ${className || ''}`} />;
};
