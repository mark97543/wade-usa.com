import type { ReactNode } from "react";

export interface Transaction {
    id: number;
    date: string;
    item: string;
    deposit: number | string;
    withdrawal: number | string;
    paid: boolean;
    category: string;
    balance: number | null;
    note: string;
}

export interface Column {
  key: string;
  header: string;
  // 'both' = spans vertical (ID/Actions)
  // 'main' = top row only (Date, Item...)
  // 'sub'  = bottom row only (Note)
  rowType?: 'main' | 'sub' | 'both'; 
  render?: (row: any) => React.ReactNode;
  cellProps?: (row: any) => React.TdHTMLAttributes<HTMLTableCellElement>;
}

export interface Category{
    id:number;
    item:string;
}

export interface NewData{
    date: string;
    item: string;
    deposit: number | string;
    withdrawal: number | string;
    paid: boolean;
    category: string;
    note: string;
}
