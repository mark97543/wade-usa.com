//Categories.tsx

import {fetchCategories, saveCategory, deleteItem} from "../../services/categoryServices.ts"
import { useMemo, useEffect, useState, useCallback } from "react";
import { Spinner } from "@/components/atoms/Spinner/Spinner.tsx";
import { Table } from "@/components/molecules/Table/Table.tsx";
import type { Column } from "@/components/molecules/Table/Table.tsx";
import style from "./BudgetViews.module.css"
import { Button } from "@/components/atoms/Button/Button.tsx";
// import { Input } from "@/components/atoms/Input/Input.tsx";
// import { Dropdown, DropdownItem } from "@/components/molecules/Dropdown/Dropdown.tsx";
import { CATEGORY_COLORS, BUCKETS, FREQUENCY } from "@/constants/constants.ts";
import AddItem from "./Categories Tools/AddItems.tsx";
import ItemModal from "./Categories Tools/ItemModal.tsx";



interface Category{
    id: number;
    item: string;
    color:string;
    bucket:string;
    frequency:number;
    due_date:Date | string;
    budget:number;
}


export default function Categories(){

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

    //The use callback makes so items dont change every rendor (Lose focus on typeing)
    const editItem = useCallback((row: Category) => {
        setEditRow(row);
        setIsModalOpen(true);
    }, []);

    //Wrapping in a useMemo prevents the lose focus condition 
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
        {key:'color', header:'Color'},
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

    useEffect(() => {
        fetchCategories()
        .then((response) => {
            // Directus returns { data: [...] }. 
            // We want to store the array, not the whole response object.
            if (response.data) {
                setCategories(response.data as Category[]);
            }
        })
        .catch((error) => console.error(error))
        .finally(() => setIsLoading(false));
    }, [refreshCount]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                <Spinner />
            </div>
        );
    }

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

    return(
        <div className={style.Budget_Categories_Wrapper}>

           {isModalOpen && editRow && (
                <ItemModal 
                    isModalOpen={isModalOpen} 
                    setIsModalOpen={setIsModalOpen} 
                    row={editRow} 
                    setRefreshCount={setRefreshCount}
                    refreshCount={refreshCount}
                />
            )}


            <div className={`${style.Add_Item_Wrapper} ${addItemMenu ? style.Add_Item_Wrapper_Visible : ''}`}>
            
         
                <AddItem
                    newColor={newColor}
                    setNewColor={setNewColor}
                    newCat={newCat}
                    setNewCat={setNewCat}
                    newBucket={newBucket}
                    setNewBucket={setNewBucket}
                    newFrequency={newFrequency}
                    setNewFrequency={setNewFrequency}
                    newDueDate={newDueDate}
                    setNewDueDate={setNewDueDate}
                    newBudget={newBudget}
                    setNewBudget={setNewBudget}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', marginTop: '1.5rem', width: '100%', maxWidth: '400px' }}>
                    <Button variant="outline" onClick={closeAddItemMenu}>Cancel</Button>
                    <Button onClick={SaveNewItem}>Save</Button>
                </div>
            </div>

            <div style={{ display: !addItemMenu ? 'block' : 'none' }}>
                <Button onClick={() => setAddItemMenu(true)}>Add Item</Button>
            </div>
            
            <Table data={categories} columns={columns}/>
            
        </div>
    )
}


//Next Steps :

//Need to add action items column 
//Need Api call for update 
// Need to build mobile view. Desktop view does not translate well into mobile view. 
//1a). Add modal tool tips. 

//Add States to modal for editing
//Incorperate staving the modal changes. 


