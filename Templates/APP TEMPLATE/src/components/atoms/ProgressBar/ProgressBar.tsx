// services/main/src/components/atoms/ProgressBar/ProgressBar.tsx

import React from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number; // Current value (0 to 100)
  label?: string;
  height?: string; // CSS value for height (e.g., '10px', '0.75rem')
  variant?: 'primary' | 'danger' | 'success';
  showLabel?: boolean;
}

/**
 * A theme-aware progress bar atom for displaying task completion or status.
 */
export const ProgressBar = ({ 
  value, 
  label, 
  height = '0.5rem', 
  variant = 'primary', 
  showLabel = true 
}: ProgressBarProps) => {
  
  // Clamp value between 0 and 100
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div 
      className={styles.container}
      style={{ '--progress-height': height } as React.CSSProperties}
    >
      {showLabel && (
        <div className={styles.labelContainer}>
          {label && <span>{label}</span>}
          <span className={styles.percentage}>{clampedValue}%</span>
        </div>
      )}
      <div className={styles.track}>
        <div 
          className={`${styles.bar} ${styles[variant]}`}
          style={{ width: `${clampedValue}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};