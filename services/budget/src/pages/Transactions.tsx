import { useState, useEffect, useCallback } from "react";
import { Table } from '@/components/molecules/Table/Table.tsx';
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import type { ReactNode } from "react";
import { Input } from "@/components/atoms/Input/Input";
import { Dropdown, DropdownItem } from "@/components/molecules/Dropdown/Dropdown";
import { Button } from "@/components/atoms/Button/Button";
import { readItems, createItem, deleteItem, updateItem } from "@directus/sdk";
import { client } from "@/lib/directus";
import { Pagination } from "@/components/molecules/Pagination/Pagination";

// #region --- Interfaces ---
interface Transaction {
    id: number;
    date: string;
    item: string;
    deposit: number | string;
    withdrawal: number | string;
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

interface NewData{
    date: string;
    item: string;
    deposit: number | string;
    withdrawal: number | string;
    paid: boolean;
    category: string;
    note: string;
}

// #endregion

export default function Transactions() {

    // #region --- States/Variables --- 
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [columns, setColumns] = useState<Column[]>([]); 

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editFormData, setEditFormData] = useState<Transaction | null>(null);
    const [newItem, setNewItem] = useState<NewData>({
        date: '', 
        item: '', 
        deposit: '', 
        withdrawal: '', 
        paid: false, 
        category: '', 
        note: ''
    });
    const [category, setCategory]=useState<Category[]>([])

    //Paginnation
    //1. Source Data

    //const allData = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);
    const [page, setPage]=useState(1); 
    const itemsPerPage = 9;

    //2. Calculate the Data to show for the current page
    const startIndex = (page-1)*itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = transactions.slice(startIndex,endIndex);

    //3. Calculate the total pages 
    const totalPages = Math.ceil(transactions.length/itemsPerPage);
    
    const handlePageChange = (newPage:number)=>{
        setPage(newPage);
    };
    
    
    // #endregion 

    //#region --- DB Functions ---
    // Checkbox updates immediately (often preferred for toggles)
    const updateTransaction = useCallback(async (transactionId: number, currentPaidStatus: boolean) => {
        
        // 1. Update UI Immediately (Optimistic)
        setTransactions((prev) =>
            prev.map((t) => t.id === transactionId ? { ...t, paid: !t.paid } : t)
        );

        try {
            // 2. Send API Request
            await client.request(
                updateItem('transactions', transactionId, {
                    paid: !currentPaidStatus
                })
            );
        } catch (error) {
            console.error("Failed to update data: ", error);
            
            // 3. Revert UI if API fails
            setTransactions((prev) =>
                prev.map((t) => t.id === transactionId ? { ...t, paid: currentPaidStatus } : t)
            );
        }
    }, []); // 'client' is stable, usually don't need to list it, but can if linter complains

    const deleteTransaction = useCallback((transactionId: number) => {
        removeTransaction(transactionId);
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
        console.log(newCategory)
        setEditFormData(prev => {
            if (!prev) return null;
            return { ...prev, category: newCategory };
        });
    };

    const startEdit = (transactionId: number) => {
        setEditingId(transactionId);
        const transactionToEdit = transactions.find(t => t.id === transactionId);
        if (transactionToEdit) {
            // Copy current data to Draft
            setEditFormData(transactionToEdit);
        }
    };
    
    const saveEdit = async() => {
        if (!editFormData) return;
        try{
            await client.request(
                updateItem('transactions', editFormData.id, {
                    date: editFormData.date,
                    item: editFormData.item,
                    deposit: editFormData.deposit,
                    withdrawal: editFormData.withdrawal,
                    paid: editFormData.paid,
                    category: editFormData.category,
                    note: editFormData.note
                }))
        }catch(error){
            console.error("Failed to update data: ", error);
        }
        
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

    //#endregion

    //#region --- EFFECT 1: Fetch Categories ---
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

        fetchTransactions()
    }, []); // Empty dependency array = Run once on mount
    //#endregion

    //#region --- Column Definition // Category Definition ---
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
                        // FIX: Pass the second argument 'row.paid'
                        onChange={() => updateTransaction(row.id, row.paid)}
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
                key:'deposit', header:"Dep", render: (row: Transaction) => (
                    row.id === editingId ? (
                        <Input
                            type="number"
                            name="deposit"
                            value={String(getValue(row, 'deposit'))}
                            onChange={handleEditChange}
                            style={{ maxWidth: '140px', padding: '0.25rem 0.5rem' }} 
                        />
                    ) : (
                        <div>$ {Number(row.deposit).toFixed(2)}</div>
                    )
                )
            },
            {
                key:'withdrawal', header:"With", render: (row: Transaction) => (
                    row.id === editingId ? (
                        <Input
                            type="number"
                            name="withdrawal"
                            value={String(getValue(row, 'withdrawal'))}
                            onChange={handleEditChange}
                            style={{ maxWidth: '140px', padding: '0.25rem 0.5rem' }} 
                        />
                    ) : (
                        <div>$ {Number(row.withdrawal).toFixed(2)}</div>
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
                            {category.map((cat)=>(
                                <DropdownItem key={cat.id} onClick={()=> handleCategoryChange(cat.item)}>{cat.item}</DropdownItem>
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
    //#endregion

    // #region --- DB Functions ---
    async function fetchTransactions(){
        try{
            const data = await client.request(
                readItems('transactions',{
                    sort: ['date'], // or ['-date'] for newest first
                    limit: -1, // <--- Add this back to prevent missing items > 100
                    filter: {
                        item: { _neq: `cache_bust_${Date.now()}` } 
                    }
                })
            )
            console.log('data pulled: ', data)
            setTransactions(data)
        }catch(error){
            console.error("Failed to pull in Transactions: ", error)
        }
    }

    async function saveNewItem(){
        // Prevent empty saves
        if (!newItem.item) return; 

        try{
            // 1. Send to Server
            const result = await client.request(
                createItem('transactions', newItem)
            );
            console.log('Transaction Added: ', result);

            // 2. INSTANTLY update the table (Don't wait for fetch!)
            setTransactions(prev => {
                // Add the new item to the existing list immediately
                const updatedList = [...prev, result as Transaction];
                // Sort it so it appears in the correct date order
                return updatedList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            });

            // 3. Clear Form
            setNewItem({
                date: '', item: '', deposit: '', withdrawal: '', 
                paid: false, category: '', note: ''
            });
            
        } catch(error){
            console.error("Failed to save data: ", error);
        }
    }

    async function removeTransaction(id:number){
        try{
            const result = await client.request(
                deleteItem('transactions',id)
            );
            console.log('Transaction Deleted: ', result);
        } catch(error){
            console.error("Failed to delete data: ", error);
        }
    }
    // #endregion

    return (
        <div className="Transactions_Wrapper">
            <h1>Transactions</h1>
            <div className="Transactions_table_container">
                <Table columns={columns} data={currentData} />
            </div>

            <div>
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    pageRange={1}
                />
                <div className="Transactions_Add_Form">
                    
                    <Button onClick={()=>saveNewItem()}>+</Button>
                    
                    <Input type="date" value={newItem.date} onChange={(e)=>setNewItem(
                        prev => {
                            return{
                                ...prev, 
                                date:e.target.value
                            }
                        })}>
                    </Input>

                    <Input type="text" placeholder={"Item"} value={newItem.item} onChange={(e)=>setNewItem(
                        prev => {
                            return{
                                ...prev, 
                                item:e.target.value
                            }
                        })}>
                    </Input>

                    <Input type="number" placeholder={"Deposit"} value={newItem.deposit} onChange={(e)=>setNewItem(
                        prev => {
                            return{
                                ...prev, 
                                deposit:e.target.value
                            }
                        })}>
                    </Input>

                    <Input type="number" placeholder={"With"} value={newItem.withdrawal} onChange={(e)=>setNewItem(
                        prev => {;
                            return{
                                ...prev, 
                                withdrawal:e.target.value
                            }
                        })}>
                    </Input>

                    <Dropdown trigger={
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
                            {newItem?.category || 'Select...'}
                            <small style={{ opacity: 0.5 }}>▼</small>
                        </span>
                    }>

                        {category.map((cat)=>(
                            <DropdownItem 
                                key={cat.id} 
                                onClick={() => setNewItem(prev => {
                                    // 1. If 'prev' is null, create a blank default object
                                    const current = prev || { 
                                        id: 0, date: '', item: '', deposit: 0, withdrawal: 0, paid: false, category: '', note: '' 
                                    };
                                    
                                    // 2. Now update the category
                                    return { ...current, category: cat.item };
                                })}
                            >
                                {cat.item}
                            </DropdownItem>
                        ))}

                    </Dropdown>

                    <Input type="text" placeholder={"Note"} value={newItem.note} onChange={(e)=>setNewItem(
                        prev => {
                            return{
                                ...prev, 
                                note:e.target.value
                            }
                        })}>
                    </Input>

                </div>
            </div>
        </div>
    );
}