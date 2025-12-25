import React from 'react';
import styles from './AuthLayout.module.css';

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};
