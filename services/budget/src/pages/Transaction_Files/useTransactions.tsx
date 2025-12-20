import { useState, useEffect, useCallback } from "react";
import type { Transaction, Category, NewData, Column } from "./types";
import { api } from "./api"; 
import { calculateBalances } from "./utils"; 
import { getColumns } from "./columns"; // Ensure spelling matches columns.tsx

export function useTransactions() {
    // --- State ---
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [columns, setColumns] = useState<Column[]>([]);
    
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editFormData, setEditFormData] = useState<Transaction | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [newItem, setNewItem] = useState<NewData>({
        date: '', item: '', deposit: '', withdrawal: '', paid: false, category: '', note: ''
    });

    // --- Pagination ---
    const [page, setPage] = useState(1); 
    const itemsPerPage = 12;
    const startIndex = (page - 1) * itemsPerPage;
    const currentData = transactions
        .filter(t => t.paid === false) 
        .slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(
        transactions.filter(t => t.paid === false).length / itemsPerPage
    );
    const handlePageChange = (newPage: number) => setPage(newPage);

    // --- Actions ---
    const loadData = async () => {
        try {
            const [data, cats] = await Promise.all([api.fetchTransactions(), api.fetchCategories()]);
            setTransactions(calculateBalances(data));
            setCategories(cats);
        } catch (e) { console.error(e); }
    };

    const saveNewItem = async () => {
        if (!newItem.item) return;
        try {
            const result = await api.createTransaction(newItem);
            setTransactions(prev => calculateBalances([...prev, result]));
            setNewItem({ date: '', item: '', deposit: '', withdrawal: '', paid: false, category: '', note: '' });
        } catch (e) { console.error(e); }
    };

    const updateTx = useCallback(async (id: number, paid: boolean) => {
        // 1. Get Today's Date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];

        setTransactions(prev => {
            // 2. Map through to find and update the item
            const updatedList = prev.map(t => {
                if (t.id !== id) return t;

                return { 
                    ...t, 
                    paid: !t.paid,
                    // If we are checking it (making it paid), update the date to today
                    // If we are unchecking it, keep the date as-is (or you could revert if you saved it)
                    date: !t.paid ? today : t.date 
                };
            });
            
            // 3. Recalculate balances immediately
            return calculateBalances(updatedList);
        }); 

        try { 
            // 4. Send both changes to the API
            await api.updateTransaction(id, { 
                paid: !paid,
                date: !paid ? today : undefined // Only send date if we are marking as paid
            }); 
        }
        catch { 
            // Revert on error (omitted for brevity, but you'd flip it back)
            console.error("Failed to update");
        } 
    }, []);

    const saveEdit = async () => {
        if (!editFormData) return;
        try { await api.updateTransaction(editFormData.id, editFormData); } catch (e) { console.error(e); }
        setTransactions(prev => calculateBalances(prev.map(t => t.id === editFormData.id ? editFormData : t)));
        setEditingId(null); setEditFormData(null);
    };

    const deleteTx = useCallback(async (id: number) => {
        try {
            await api.deleteTransaction(id);
            setTransactions(prev => calculateBalances(prev.filter(t => t.id !== id)));
        } catch (e) { console.error(e); }
    }, []);

    // --- Form Handlers ---
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setEditFormData(prev => prev ? { ...prev, [name]: type === 'number' ? Number(value) : value } : null);
    };
    const startEdit = (id: number) => {
        setEditingId(id);
        setEditFormData(transactions.find(t => t.id === id) || null);
    };

    // --- Effects ---
    useEffect(() => { loadData(); }, []);

    useEffect(() => {
        // Collect all props needed for columns AND sub-rows
        const columnProps = {
            editingId,
            editFormData,
            categories,
            handlers: {
                updateTransaction: updateTx,
                handleEditChange,
                handleCategoryChange: (cat: string) => setEditFormData(prev => prev ? { ...prev, category: cat } : null),
                saveEdit,
                cancelEdit: () => { setEditingId(null); setEditFormData(null); },
                startEdit,
                deleteTransaction: deleteTx
            }
        };

        // 2. Generate Columns
        setColumns(getColumns(columnProps));


    }, [transactions, editingId, editFormData, categories]);

    return { 
        columns, 
        currentData, 
        categories, 
        page, 
        totalPages, 
        handlePageChange, 
        saveNewItem, 
        newItem, 
        setNewItem
    };
}