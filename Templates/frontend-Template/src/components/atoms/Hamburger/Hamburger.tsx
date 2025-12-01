import styles from './Hamburger.module.css';

interface HamburgerProps {
  isOpen: boolean;
  toggle: () => void;
  className?: string;
}

export const Hamburger = ({ isOpen, toggle, className }: HamburgerProps) => {
  return (
    <button 
      className={`${styles.button} ${isOpen ? styles.open : ''} ${className || ''}`} 
      onClick={toggle}
      aria-label="Toggle navigation"
      aria-expanded={isOpen}
    >
      <div className={styles.line} />
      <div className={styles.line} />
      <div className={styles.line} />
    </button>
  );
};
