import { useState, useEffect, useCallback } from "react";
import { Table } from '@/components/molecules/Table/Table.tsx';
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import type { ReactNode } from "react";
import { Input } from "@/components/atoms/Input/Input";

// --- Transaction and Column Interfaces (Unchanged) ---
interface Transaction {
    id: number;
    date: string;
    item: string;
    deposit: number;
    withdrawal: number;
    paid: boolean;
    category: string;
    note: string;
}

interface Column {
    key: string;
    header: string;
    render?: (row: Transaction) => ReactNode; 
}


// --Dummy Data (Unchanged)--
const TransactionsData: Transaction[] = [ 
    { id: 1, date: "2022-01-01", item: "Item 1", deposit: 100, withdrawal: 0, paid: true, category: "Category 1", note: "Note 1" },
    { id: 2, date: "2022-01-02", item: "Item 2", deposit: 0, withdrawal: 200, paid: false, category: "Category 2", note: "Note 2" },
    { id: 3, date: "2022-01-03", item: "Item 3", deposit: 0, withdrawal: 300, paid: true, category: "Category 3", note: "Note 3" },
]


export default function Transactions() {
    const [transactions, setTransactions] = useState(TransactionsData);
    const [columns, setColumns] = useState<Column[]>([]); 

    const [editingId, setEditingId] = useState<number | null>(null);
    // NEW STATE: Holds temporary changes during inline editing
    const [editFormData, setEditFormData] = useState<Transaction | null>(null);

    // --- Data Mutators (Consolidated & Optimized) ---
    
    // Only used for the Checkbox, which updates instantly
    const updateTransaction = useCallback((transactionId: number) => {
        setTransactions((prevTransactions) =>
            prevTransactions.map((t) =>
                t.id === transactionId ? { ...t, paid: !t.paid } : t
            )
        );
    }, []);

    const deleteTransaction = useCallback((transactionId: number) => {
        setTransactions((prevTransactions) =>
            prevTransactions.filter((t) => t.id !== transactionId)
        );
    }, []);
    
    // NEW: Generic handler that updates ONLY the temporary editFormData state
    const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = event.target;

        setEditFormData(prev => {
            if (!prev) return null;
            
            // Convert number inputs correctly (otherwise value is always a string)
            const newValue = (type === 'number') ? Number(value) : value;

            return {
                ...prev,
                [name]: newValue
            };
        });
    };

    // --- Editing State Handlers (Now controls batch update) ---

    const startEdit = (transactionId: number) => {
        setEditingId(transactionId);
        // Initialize temporary form data with the current transaction details
        const transactionToEdit = transactions.find(t => t.id === transactionId);
        if (transactionToEdit) {
            setEditFormData(transactionToEdit);
        }
    };
    
    const saveEdit = () => {
        if (!editFormData) return;
        
        // CRITICAL: Update the main state only ONCE with the finalized data
        setTransactions(prevTransactions =>
            prevTransactions.map(t =>
                t.id === editFormData.id ? editFormData : t
            )
        );
        setEditingId(null); 
        setEditFormData(null);
        console.log(`Saved changes for ID: ${editFormData.id}`);
    };

    const cancelEdit = () => {
        // Discard temporary changes by simply resetting editing state
        setEditingId(null); 
        setEditFormData(null); 
        // OPTIONAL: If the user changed the date, you might need to revert 'transactions' state here
    };

    // --- Column Definition ---
    useEffect(() => {
        // Helper to determine the value source: temp state if editing, permanent state otherwise
        const getValue = (row: Transaction, key: keyof Transaction) => {
            if (row.id === editingId && editFormData) {
                return editFormData[key];
            }
            return row[key];
        }

        const TransactionsColumns: Column[] = [ 
            {
                key:'paid', header:"Paid", render: (row: Transaction) => ( 
                    <Checkbox
                        id={`paid-${row.id}`} 
                        label=""
                        name={`paid-${row.id}`}
                        value={String(row.id)} 
                        checked={row.paid}
                        onChange={() => updateTransaction(row.id)}
                    />
                )
            },
            // The logic below is simplified and consolidated:
            {
                key:'date', 
                header:"Date", 
                render: (row: Transaction) => (
                    row.id === editingId ? (
                        <Input
                            type="date"
                            name="date" // Required for generic handler
                            value={String(getValue(row, 'date'))}
                            onChange={handleEditChange} // Single handler used
                            style={{ maxWidth: '140px', padding: '0.25rem 0.5rem' }} 
                        />
                    ) : (
                        <div>{row.date}</div>
                    )
                )
            },
            {
                key:'item', header:"Item", render: (row: Transaction) => (
                    row.id === editingId ? (
                        <Input
                            type="text"
                            name="item" // Required for generic handler
                            value={String(getValue(row, 'item'))}
                            onChange={handleEditChange}
                            style={{ maxWidth: '140px', padding: '0.25rem 0.5rem' }} 
                        />
                    ) : (
                        <div>{row.item}</div>
                    )
                )
            },
            {
                key:'deposit', header:"Deposit", render: (row: Transaction) => (
                    row.id === editingId ? (
                        <Input
                            type="number"
                            name="deposit" // Required for generic handler
                            value={String(getValue(row, 'deposit'))}
                            onChange={handleEditChange}
                            style={{ maxWidth: '140px', padding: '0.25rem 0.5rem' }} 
                        />
                    ) : (
                        <div>{row.deposit}</div>
                    )
                )
            },
            {
                key:'withdrawal', header:"Withdrawal", render: (row: Transaction) => (
                    row.id === editingId ? (
                        <Input
                            type="number"
                            name="withdrawal" // Required for generic handler
                            value={String(getValue(row, 'withdrawal'))}
                            onChange={handleEditChange}
                            style={{ maxWidth: '140px', padding: '0.25rem 0.5rem' }} 
                        />
                    ) : (
                        <div>{row.withdrawal}</div>
                    )
                )
            },
            {
                key:'category', header:"Category", render: (row: Transaction) => (
                    row.id === editingId ? (
                        <Input
                            type="text"
                            name="category" // Required for generic handler
                            value={String(getValue(row, 'category'))}
                            onChange={handleEditChange}
                            style={{ maxWidth: '140px', padding: '0.25rem 0.5rem' }} 
                        />
                    ) : (
                        <div>{row.category}</div>
                    )
                )
            },
            {
                key:'note', header:"Note", render: (row: Transaction) => (
                    row.id === editingId ? (
                        <Input
                            type="text"
                            name="note" // Required for generic handler
                            value={String(getValue(row, 'note'))}
                            onChange={handleEditChange}
                            style={{ maxWidth: '140px', padding: '0.25rem 0.5rem' }} 
                        />
                    ) : (
                        <div>{row.note}</div>
                    )
                )
            },
            {
                key:'actions', header:"Actions", render: (row: Transaction) => ( 
                    <div className="Transactions_Actions">
                        {row.id === editingId ? (
                            <>
                                <button onClick={saveEdit}>Save</button>
                                <button onClick={cancelEdit}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => startEdit(row.id)}>Edit</button> 
                                <button onClick={() => deleteTransaction(row.id)}>Delete</button>
                            </>
                        )}
                    </div>
                )
            }
        ]

        setColumns(TransactionsColumns);
    }, [transactions, editingId, updateTransaction, deleteTransaction]); // Included all dependencies


    return (
        <div className="Transactions_Wrapper">
            <h1>Transactions</h1>
            <Table columns={columns} data={transactions} />
        </div>
    );
}