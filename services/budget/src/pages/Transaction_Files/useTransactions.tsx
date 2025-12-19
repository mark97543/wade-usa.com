import { useState, useEffect, useCallback } from "react";
import { readItems, createItem, deleteItem, updateItem } from "@directus/sdk";
import { client } from "@/lib/directus";
import type { Transaction, Category, NewData, Column } from "./types";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Input } from "@/components/atoms/Input/Input";
import { Dropdown, DropdownItem } from "@/components/molecules/Dropdown/Dropdown";


export function useTransactions() {

    // #region --------------------------------- States --------------------------------- */
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

    //#endregion

    /* #region ---------------------------- Helper Functions ---------------------------- */
    const calculateBalances = (items: any[]): Transaction[] => {
        let runningTotal = 0;
        
        // Sort by date first
        const sorted = [...items].sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        // Map and inject balance
        return sorted.map((item) => {
            const dep = Number(item.deposit) || 0;
            const wth = Number(item.withdrawal) || 0;
            runningTotal += (dep - wth);

            return {
                ...item,
                // Ensure balance is set so it matches Transaction type
                balance: Number(runningTotal.toFixed(2)) 
            };
        });
    };

    //#endregion

    // #region ------------------------------ API Functions ----------------------------- */
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

    const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = event.target;
        setEditFormData(prev => {
            if (!prev) return null;
            const newValue = (type === 'number') ? Number(value) : value;
            return { ...prev, [name]: newValue };
        });
    };

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

        
        setTransactions(prev => {
            const updatedList = prev.map(t => t.id === editFormData.id ? editFormData : t);
            return calculateBalances(updatedList);
        });
        
        // Cleanup
        setEditingId(null); 
        setEditFormData(null);
    };

    const cancelEdit = () => {
        // Discard the Draft
        setEditingId(null); 
        setEditFormData(null); 
    };

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

            const processedData = calculateBalances(data);
            setTransactions(processedData);
            
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
            
            // 2. Update State: Add new item AND Recalculate all balances
            setTransactions(prev => {
                // Combine existing list with new result
                const updatedList = [...prev, result];
                // Run the helper to Sort AND add 'balance' property
                return calculateBalances(updatedList);
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

    // #region --------------------------------- Effects -------------------------------- */
    
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
                key:'balance', header:"Balance", render: (row: Transaction) => (
                        <div>{row.balance}</div>
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
    
    
    // Return EVERYTHING the component needs
    return {
        // Data
        columns,
        currentData,
        category,
        // Pagination
        page, 
        totalPages,
        handlePageChange,
        
       

        // Actions
        saveNewItem,
        newItem,
        setNewItem
    };
}