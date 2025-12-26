import React, { Fragment } from 'react';
import styles from './Table.module.css';

export interface Column {
  key: string;
  header: string;
  /**
   * Controls where this column is rendered in the split-row layout.
   * - 'main': Top row only (default)
   * - 'sub':  Bottom row only (e.g. Notes)
   * - 'both': Spans vertically across both rows (e.g. Checkbox, Actions)
   */
  rowType?: 'main' | 'sub' | 'both';
  render?: (row: any) => React.ReactNode;
  /**
   * Dynamic props for the <td> element. 
   * Use this for colSpan, style, or specific classNames.
   */
  cellProps?: (row: any) => React.TdHTMLAttributes<HTMLTableCellElement>;
}

interface TableProps {
  columns: Column[];
  data: any[];
  /** Optional: Pass a specific key field if 'id' is not unique */
  rowKey?: string;
}

export const Table = ({ columns, data, rowKey = 'id' }: TableProps) => {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => {
              // We only render headers for columns that appear in the top row.
              // 'sub' columns (like notes) usually don't have their own header 
              // because they sit underneath other columns.
              if (col.rowType === 'sub') return null;
              
              return (
                <th key={col.key}>
                  {col.header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            // 1. Explicit Striping Logic
            // We calculate this in JS to ensure the "Block" (Row 1 + Row 2) 
            // gets the same background color.
            const isStriped = i % 2 === 1; 
            const stripeClass = isStriped ? styles.striped : '';
            const key = row[rowKey] || i;

            return (
              <Fragment key={key}>
                {/* --- TOP ROW (Main Data) --- */}
                <tr className={`${styles.mainRow} ${stripeClass}`}>
                  {columns.map((col) => {
                    // Skip columns meant for the bottom row
                    if (col.rowType === 'sub') return null;

                    // If 'both', we span 2 rows. Otherwise 1.
                    const isVerticalSpan = col.rowType === 'both';
                    const extraProps = col.cellProps ? col.cellProps(row) : {};

                    return (
                      <td 
                        key={`${key}-${col.key}`} 
                        rowSpan={isVerticalSpan ? 2 : 1}
                        {...extraProps}
                      >
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    );
                  })}
                </tr>

                {/* --- BOTTOM ROW (Note/Details) --- */}
                <tr className={`${styles.noteRow} ${stripeClass}`}>
                  {columns.map((col) => {
                    // Only render 'sub' columns here.
                    if (col.rowType !== 'sub') return null;

                    const extraProps = col.cellProps ? col.cellProps(row) : {};

                    return (
                      <td 
                        key={`${key}-${col.key}-sub`} 
                        {...extraProps}
                      >
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    );
                  })}
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};