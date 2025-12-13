import type { ReactNode } from "react";

export interface Transaction {
    id: number;
    date: string;
    item: string;
    deposit: number | string;
    withdrawal: number | string;
    paid: boolean;
    category: string;
    note: string;
}

export interface Column {
    key: string;
    header: string;
    render?: (row: Transaction) => ReactNode; 
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