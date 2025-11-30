import styles from './Alert.module.css';

interface AlertProps {
  type?: 'error' | 'success';
  message: string;
}

export const Alert = ({ type = 'error', message }: AlertProps) => {
  if (!message) return null;
  
  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <span>{message}</span>
    </div>
  );
};
