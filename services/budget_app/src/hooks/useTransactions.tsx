//useTransactions.tsx
import { fetchLastRebalance, fetchTransactionsByRange, deleteTransaction, updateTransaction } from "@/services/transactionServices"
import { useState, useEffect, useMemo } from "react";
import type { Column } from "@/components/molecules/Table/Table";
import type { Category } from "./useCategories";
import { fetchCategories} from "@/services/categoryServices";
import style from "../pages/views/Transaction Tools/Transaction.module.css"


export interface Transaction{
    paid:boolean | string,
    paid_date: Date | string,
    date: Date | string,
    item: string,
    deposit: number | string,
    withdrawal: number | string,
    category: string,
    note:string
}

export const useTransactions = ()=>{
    //--- State ---
    const [rawTransactions, setRawTransactions] = useState<Transaction[]>([]);
    const [lastRebalance, setLastRebalance] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [colorPalat, setColorPalat] = useState<Category[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editRow, setEditRow] = useState<Transaction | null>(null);
    const [reload, setReload]=useState(0);



    // --- USER CONTROLS ---
    const [timeRange, setTimeRange] = useState<3 | 6 | 9 | 12>(3); // Default 3 months
    //const [showPaid, setShowPaid] = useState(false);

    /* -------------------------------- Functions ------------------------------- */
    const itemEdit = (row:Transaction) =>{
        //console.log(row);
        setEditRow(row);
        setIsModalOpen(true)
    }

    const DeleteItems =async (id:string)=>{
        await deleteTransaction(id)
        setIsModalOpen(false);
        setReload(prev=>prev+1);
    }

    const UpdateItem = async (id:string | number, data:any )=>{
        //Packageding Items for Directus to read (Striping Calculated Coloumns)
        const dataPackage={
            id:data.id,
            paid_date:data.paid_date,
            paid:data.paid,
            date:data.date,
            item:data.item,
            deposit:data.deposit,
            withdrawal:data.withdrawal,
            category:data.category,
            note:data.note
        }


        await updateTransaction(id, dataPackage);
        setIsModalOpen(false);
        setReload(prev=>prev+1);
    }

    /* -------------------------------- Load Data ------------------------------- */
    useEffect(() => {

        async function loadData(){
            setIsLoading(true);
            try{
                const rebalanceItem = await fetchLastRebalance();

                if(rebalanceItem){
                    setLastRebalance([rebalanceItem]);
                }

                const startDate = rebalanceItem ? String(rebalanceItem.date) : null;
                const response = await fetchTransactionsByRange(startDate, timeRange);

                if (response && response.data) {
                    setRawTransactions(response.data);
                }

                const colors = await fetchCategories();
                if(colors && colors.data){
                    setColorPalat(colors.data)
                }

            }catch(error){
                console.error("Error loading date: ", error);
            }finally{
                setIsLoading(false)
            }
        }

        loadData();
    }, [reload]);

    /* -------------------------- Desktop Table Columns ------------------------- */

    const desktop_columns: Column[] = [
        {key:'edit', header:'Edit',
            render:(row)=>{
                return(
                    <div>
                        <button
                            className={style.Transaction_Edit_Button}
                            onClick={()=>itemEdit(row)}
                        >
                            <img src="./edit.png"/>
                        </button>
                    </div>
                )
        }},
        {key:'date', header:'Due Date'},
        {key:"item", header:"Item",
            render:(row)=>{
                const colorData = colorPalat.find(c => c.item === row.item)
                const backgroundColor = colorData ? colorData.color : '#7c3aed';
                const contrast = colorData ? colorData.contrast : 'white';

                return(
                    <div style={{
                        backgroundColor:backgroundColor,
                        color:contrast,
                        borderRadius:'2rem',
                        padding:'0.25rem',
                        textAlign:'center',
                        cursor:'pointer'
                        }}>
                            {row.item}
                    </div>
            )}
        },
        {
            key: 'deposit', 
            header: 'Deposit',
            render: (row) => {
                const val = Number(row.deposit) || 0;
                
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                }).format(val);
            }
        },
        {key:'withdrawal', header:'Withdrawal',
            render:(row)=>{
                const val = Number(row.withdrawal) || 0;
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                }).format(val)
            }
        },
        {key:'balance', header:'Balance',
            render:(row)=>{
                const val = Number(row.withdrawal) || 0;
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                }).format(val)
        }},
        {key:'note', header:'Note'}
      
    ]

    /* ------------- This is data we will send down that is filtered ------------ */
    
    const packagedData = useMemo(() => {
        const allItems = [...lastRebalance, ...rawTransactions];

        // 1. Calculate the 'Base' Balance from ALL paid items
        //    (Safeguard: check for valid numbers or use 0)
        const filteredPaid = allItems.filter((t) => {
            return t.paid === true || t.paid === "true"; 
        });

        const paidTotal = filteredPaid.reduce((sum, item) => {
            const dep = Number(item.deposit) || 0;    // Fix NaN issue
            const withdr = Number(item.withdrawal) || 0; // Fix NaN issue
            return sum + dep - withdr;
        }, 0);
 
        // 2. Filter Unpaid Items
        const unpaidItems = allItems.filter((t) => {
            return t.paid === false || t.paid === "false"; 
        });

        // 3. Initialize running balance
        //    (If lastRebalance is part of allItems, paidTotal likely already covers the starting point. 
        //     If you strictly want to start at paidTotal, just use that.)
        let runningBalance = paidTotal;

        const unpaidBalance = unpaidItems.map((item) => {
            const dep = Number(item.deposit) || 0;
            const withdr = Number(item.withdrawal) || 0;
            const newAmount = dep - withdr;
            
            runningBalance += newAmount;

            return {
                ...item,
                balance: runningBalance
            };
        });

        return unpaidBalance; 

    }, [lastRebalance, rawTransactions]);



    return{
    isLoading,
    setIsLoading,
    desktop_columns,
    packagedData,
    isModalOpen,
    setIsModalOpen,
    editRow,
    setEditRow,
    DeleteItems,
    UpdateItem


    
    }
}
