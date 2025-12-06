// services/main/src/pages/Transactions.tsx
import { useState, useEffect, useCallback } from "react";
import { Table } from '@/components/molecules/Table/Table.tsx';
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import type { ReactNode } from "react";
import { Input } from "@/components/atoms/Input/Input";
import { Dropdown, DropdownItem } from "@/components/molecules/Dropdown/Dropdown";
import { Pagination } from "@/components/molecules/Pagination/Pagination";
import { Button } from "@/components/atoms/Button/Button";
import { readItems } from "@directus/sdk";
import { client } from "@/lib/directus";

// --- Interfaces ---
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

interface Category{
    id:number;
    item:string;
}
// -- Dummy Data --
const TransactionsData: Transaction[] = [ 
    { id: 1, date: "2022-01-01", item: "Item 1", deposit: 100, withdrawal: 0, paid: true, category: "Category 1", note: "Note 1" },
    { id: 2, date: "2022-01-02", item: "Item 2", deposit: 0, withdrawal: 200, paid: false, category: "Category 2", note: "Note 2" },
    { id: 3, date: "2022-01-03", item: "Item 3", deposit: 0, withdrawal: 300, paid: true, category: "Category 3", note: "Note 3" },
]

export default function Transactions() {
    const [transactions, setTransactions] = useState(TransactionsData);
    const [columns, setColumns] = useState<Column[]>([]); 

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editFormData, setEditFormData] = useState<Transaction | null>(null);
    const [newItem, setNewItem]=useState<Transaction | null>(null)
    const [category, setCategory]=useState<Category[]>([])


    // Checkbox updates immediately (often preferred for toggles)
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
    
    // Updates the DRAFT state only (Input fields)
    const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = event.target;
        setEditFormData(prev => {
            if (!prev) return null;
            const newValue = (type === 'number') ? Number(value) : value;
            return { ...prev, [name]: newValue };
        });
    };

    // Updates the DRAFT state only (Dropdown selection)
    const handleCategoryChange = (newCategory: string) => {
        setEditFormData(prev => {
            if (!prev) return null;
            return { ...prev, category: newCategory };
        });
    };

    // --- Edit Flow ---

    const startEdit = (transactionId: number) => {
        setEditingId(transactionId);
        const transactionToEdit = transactions.find(t => t.id === transactionId);
        if (transactionToEdit) {
            // Copy current data to Draft
            setEditFormData(transactionToEdit);
        }
    };
    
    const saveEdit = () => {
        if (!editFormData) return;
        
        // CRITICAL: This is the ONLY place where the real 'transactions' list is updated
        setTransactions(prevTransactions =>
            prevTransactions.map(t =>
                t.id === editFormData.id ? editFormData : t
            )
        );
        
        // Cleanup
        setEditingId(null); 
        setEditFormData(null);
    };

    const cancelEdit = () => {
        // Discard the Draft
        setEditingId(null); 
        setEditFormData(null); 
    };

    // --- EFFECT 1: Fetch Categories ---
    useEffect(() => {
        async function fetchCategory(){
            try{
                const response = await client.request(
                    readItems('budget_categories',{
                        sort:['item']
                    })
                )
                setCategory(response)
            } catch(error){
                console.error("Failed to fetch Categories: ", error)
            }
        }
        fetchCategory()
    }, []); // Empty dependency array = Run once on mount


    // --- Column Definition // Category Definition ---
    useEffect(() => {

        // Helper: If editing, show Draft value. If not, show Real value.
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
            {
                key:'date', header:"Date", render: (row: Transaction) => (
                    row.id === editingId ? (
                        <Input
                            type="date"
                            name="date"
                            value={String(getValue(row, 'date'))}
                            onChange={handleEditChange}
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
                            name="item"
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
                            name="deposit"
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
                            name="withdrawal"
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
                        <Dropdown 
                            trigger={
                                // Display DRAFT value dynamically
                                <span style={{ 
                                    cursor: 'pointer', 
                                    padding: '0.25rem 0.5rem', 
                                    border: '1px solid rgba(255,255,255,0.1)', 
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    minWidth: '120px',
                                    justifyContent: 'space-between',
                                    userSelect: 'none'
                                }}>
                                    {String(getValue(row, 'category')) || 'Select...'} 
                                    <small style={{ opacity: 0.5 }}>▼</small>
                                </span>
                            }
                        >
                            {/* Update DRAFT state on click */}
                            {category.map((item)=>(
                                <DropdownItem key={item.id} onClick={()=> handleCategoryChange(item.item)}>{item.item}</DropdownItem>
                            ))}
                        </Dropdown>
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
                            name="note"
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
                                <button onClick={saveEdit} title="Save Changes"><img src="./save.png" alt="Save" /></button>
                                <button onClick={cancelEdit} title="Cancel Editing"><img src="./cancel.png" alt="Cancel" /></button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => startEdit(row.id)} title="Edit Row"><img src="./pencil.png" alt="Edit" /></button> 
                                <button onClick={() => deleteTransaction(row.id)} title="Delete Row"><img src="./delete.png" alt="Delete" /></button>
                            </>
                        )}
                    </div>
                )
            }
        ]

        setColumns(TransactionsColumns);
    }, [transactions, editingId, updateTransaction, deleteTransaction, editFormData, category]); 

    return (
        <div className="Transactions_Wrapper">
            <h1>Transactions</h1>
            <Table columns={columns} data={transactions} />
            <div>
                <p>Add Item</p>

                <div className="Transactions_Add_Form">
                    
                    <Button>+</Button>
                    
                    <Input type="date" onChange={(e)=>setNewItem(
                        prev => {
                            if(!prev) return null;
                            return{
                                ...prev, 
                                date:e.target.value
                            }
                        })}>
                    </Input>

                </div>
            </div>
        </div>
    );
}