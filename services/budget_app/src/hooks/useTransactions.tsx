//useTransactions.tsx
import { fetchLastRebalance, fetchTransactionsByRange } from "@/services/transactionServices"
import { useState, useEffect, useMemo, use } from "react";
import type { Column } from "@/components/molecules/Table/Table";
import {CATEGORY_COLORS} from '@/constants/constants.ts'
import type { Category } from "./useCategories";
import { fetchCategories} from "@/services/categoryServices";


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
    const [currentBalance, setCurrentBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [colorPalat, setColorPalat] = useState<Category[]>([]);


    // --- USER CONTROLS ---
    const [timeRange, setTimeRange] = useState<3 | 6 | 9 | 12>(3); // Default 3 months
    const [showPaid, setShowPaid] = useState(false);

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
    }, []);

    /* -------------------------- Desktop Table Columns ------------------------- */

    const desktop_columns: Column[] = [
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
        {key:'date', header:'Due Date'}
    ]

    /* ------------- This is data we will send down that is filtered ------------ */
    
    const packagedData = useMemo(()=>{
        const allItems = [...lastRebalance, ...rawTransactions];

        const filteredPaid = allItems.filter((t)=>{
            return t.paid === true || t.paid === "true"; //Keep if paid
        });

        //1. Add up all paid Items 

        //2. Filter Unpaid Items 

        //3. Add up all Unpdaid items but set starting balance === filterpaid total 
        //3a. Make a new Column for balance 


        //console.log(allItems);


        return allItems;
    },[lastRebalance, rawTransactions])



    return{
    isLoading,
    setIsLoading,
    desktop_columns,
    packagedData,


    
    }
}
