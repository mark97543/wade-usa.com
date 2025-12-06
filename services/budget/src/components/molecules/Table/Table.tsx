import React from 'react'; // <--- CRITICAL: Required to handle JSX/ReactNode type
import styles from './Table.module.css';

interface Column {
  key: string;
  header: string;
  // NEW: The optional render function is the slot for your custom Checkbox/JSX
  render?: (row: any) => React.ReactNode; 
}

interface TableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (item: any) => void;
}

export const Table = ({ columns, data, onRowClick }: TableProps) => {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} onClick={() => onRowClick && onRowClick(row)}>
              {columns.map((col) => (
                <td key={`${i}-${col.key}`}>
                  {/* If a render function is provided in the column definition: */}
                  {col.render 
                    ? col.render(row) // <-- EXECUTES the function defined by the parent
                    : row[col.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};