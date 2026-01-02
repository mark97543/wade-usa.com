// useCategories.ts

import {useState, useEffect, useCallback, useMemo} from "react";
import { BUCKETS, FREQUENCY, CATEGORY_COLORS } from "@/constants/constants";
import { fetchCategories, saveCategory, deleteItem } from "@/services/categoryServices";
import type { Column } from "@/components/molecules/Table/Table";
import style from "../pages/views/Budget Items Tools/BudgetViews.module.css"

export interface Category {
    id: number;
    item: string;
    color:string;
    bucket:string;
    frequency:string;
    due_date:Date | string;
    budget:number;
    contrast:string;
}



export const useCategories = ()=>{
    //States
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [addItemMenu, setAddItemMenu] = useState<boolean>(false);
    const [newColor, setNewColor]=useState<number>(0);
    const [newCat, setNewCat]=useState<string>("");
    const [newBucket, setNewBucket]=useState<number>(0);
    const [newFrequency, setNewFrequency]=useState<number>(0);
    const [newDueDate, setNewDueDate]=useState<Date>(new Date());
    const [newBudget, setNewBudget]=useState<number>(0);
    const [refreshCount, setRefreshCount]= useState(0)
    const [isModalOpen, setIsModalOpen]=useState(false);
    const [editRow, setEditRow]=useState<Category | null>(null);
    const [balance, setBalace]=useState<number>(0);

    //Functions
    const editItem = useCallback((row: Category) => {
        setEditRow(row);
        setIsModalOpen(true);
    }, []);

    const closeAddItemMenu=()=>{
        setAddItemMenu(false)
        setNewColor(0)
        setNewCat("")
        setNewBucket(0)
        setNewFrequency(0)
        setNewDueDate(new Date())
        setNewBudget(0)
    }

    const SaveNewItem= async ()=>{
        //Prepackaged Data
        const dataToSend = {
            item: newCat,
            color: CATEGORY_COLORS[newColor].value,
            contrast: CATEGORY_COLORS[newColor].contrast,
            color_label: CATEGORY_COLORS[newColor].label,
            bucket:BUCKETS[newBucket].label,
            frequency:FREQUENCY[newFrequency].label,
            due_date:newDueDate,
            budget:newBudget
        }
        
        //Requires a Category name
        if(!newCat.trim()){
            alert("Please enter a Category Name.")
            return
        }

        //Check the Item name is Unique (Case insenstative)
        const isDuplicate = categories.some(
            (cat)=>cat.item.toLowerCase()===newCat.toLowerCase()
        )

        if(isDuplicate){
            alert(`The category "${newCat}" already exists.`)
            return
        }

        //Proceed to Save 
        try{
            //setIsLoading(true)
            const response = await saveCategory(dataToSend);

            if(response){
                console.log("Success");
                //Add CLear form here 
                setRefreshCount(prev=>prev+1);
                closeAddItemMenu();
            }
            
        }catch(error){
            console.error("Error Adding New item: ",error);
        }finally{
            //setIsLoading(false)
        }
        
    }    


    const deleteCategory = async (id:number)=>{
        try{
            const response = await deleteItem(id);
            if(response){
                console.log("Success");
                setRefreshCount(prev=>prev+1);
            }
        }catch(error){
            console.error("Error Deleting item: ",error);
        }
    }

    //Effects

    useEffect(() => {
        fetchCategories()
        .then((response) => {
            // Directus returns { data: [...] }. 
            // We want to store the array, not the whole response object.
            if (response.data) {
                setCategories(response.data as Category[]);
                const data = response.data.reduce((acc, curr)=>{
                    const amount = Number(curr.budget) || 0;

                    const multipliers: Record<string, number> = {
                            "Weekly": 4,
                            "Bi-Weekly": 2,
                            "Monthly": 1
                    };

                    const multiplier = multipliers[curr.frequency] || 0; 
                    const monthlyAmount = amount * multiplier;

                    if(curr.bucket === "Income"){
                        return acc+monthlyAmount;
                    }else{
                        return acc-monthlyAmount;
                    }
                },0);
                setBalace(data);
                
            }
        })
        .catch((error) => console.error(error))
        .finally(() => setIsLoading(false));

    }, [refreshCount]);

    const columns = useMemo((): Column[] => [
        {key:'item', header:'Budget Item'},
        {key:'bucket', header:'Bucket'},
        {key:'frequency', header:'Frequency'},
        {
            key:'budget',
            header:'Budget',
            render:(row:Category)=> new Intl.NumberFormat('en-US', {
                style: 'currency', currency: 'USD'
            }).format(row.budget || 0)
        },
        {key:'monthly_budget', header:'Monthly',
            render:(row:Category)=>{
                let amount = Number(row.budget);

                if(row.frequency === "Weekly"){
                    amount = amount * 4;
                }else if(row.frequency === "Bi-Weekly"){
                    amount = amount * 2;
                }else if(row.frequency === "Monthly"){
                    amount = amount;
                }else{
                    amount = 0;
                }
                return(
                    <div>
                        {new Intl.NumberFormat('en-US', {
                            style: 'currency', currency: 'USD'
                        }).format(amount)}
                    </div>
                )              
            }
        },
        {key:'color', header:'Color',
            render:(row:Category)=>(
                <div style={{
                    backgroundColor:row.color,
                    width:"25px",
                    height:"25px",
                    borderRadius:"50%",
                    border:"1px solid #ccc",
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center"
                }}>
                    C
                </div>
            )
        },
        {
            key:'actions', 
            header:'Actions',
            render:(row:Category)=>(
                <div className={style.Cat_Action_Container} >
                    <button className={style.Cat_Action_Buttons} onClick={()=>editItem(row)}>
                        <img src="./edit.png"/>
                    </button>
                    <button className={style.Cat_Action_Buttons} onClick={()=>deleteCategory(row.id)}>
                        <img src="./delete.png"/>
                    </button>
                </div>
            )
        }
    ], [editItem]); // categories removed from here



    return{
        //States
        categories,
        setCategories,
        isLoading,
        setIsLoading,
        addItemMenu,
        setAddItemMenu,
        newColor,
        setNewColor,
        newCat,
        setNewCat,
        newBucket,
        setNewBucket,
        newFrequency,
        setNewFrequency,
        newDueDate,
        setNewDueDate,
        newBudget,
        setNewBudget,
        refreshCount,
        setRefreshCount,
        isModalOpen,
        setIsModalOpen,
        editRow,
        setEditRow,
        balance,
        setBalace,

        //Functions
        editItem,
        closeAddItemMenu,
        SaveNewItem,
        deleteCategory,
        columns
    
    
    
    
    
    }
}