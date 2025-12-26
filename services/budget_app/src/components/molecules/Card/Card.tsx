import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Card = ({ children, title, className, style }: CardProps) => {
  return (
    <div className={`${styles.card} ${className || ''}`} style={style}>
      {title && <h2 className={styles.title}>{title}</h2>}
      {children}
    </div>
  );
};
