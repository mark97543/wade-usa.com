import { useState, useEffect } from "react";
import { Modal } from "@/components/molecules/Modal/Modal";
import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import style from "../BudgetViews.module.css";
import { Dropdown, DropdownItem } from "@/components/molecules/Dropdown/Dropdown";
import { FREQUENCY, BUCKETS, CATEGORY_COLORS} from "@/constants/constants";
import { saveCategory } from "@/services/categoryServices";

interface ItemModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
    row: any;
    setRefreshCount: (count: number) => void;
    refreshCount: number;
}

export default function ItemModal({ isModalOpen, setIsModalOpen, row, setRefreshCount, refreshCount}: ItemModalProps) {
    const [item, setItem] = useState(row?.item || "");
    const [budget, setBudget] = useState(row?.budget || 0);
    const [dueDate, setDueDate] = useState(row?.due_date || new Date());
    const [newFrequency, setNewFrequency] = useState(row?.frequency || "Select Frequency");
    const [newColor, setNewColor]=useState(row?.label || "Color: None");
    const [colorId, setColorId]=useState(0)
    const [newBucket, setNewBucket]=useState(row?.bucket || "None");
    // const [bucketId, setBucketId]=useState(0);
    
    const SaveNewItem= async ()=>{
        //Prepackaged Data
        const dataToSend = {
            item: item,
            color: CATEGORY_COLORS[colorId].value,
            contrast: CATEGORY_COLORS[colorId].contrast,
            color_label: CATEGORY_COLORS[colorId].label,
            bucket:newBucket,
            frequency:newFrequency,
            due_date:dueDate,
            budget:budget
        }

        try{
            const response = await saveCategory(dataToSend, row?.id);
            if(response){
                console.log("Success");
                setIsModalOpen(false);
            }
        }catch(error){
            console.error("Error Adding New item: ",error); 
        }finally{
            setRefreshCount(refreshCount+1)
        }
    }



    useEffect(() => {
        if (row) {
            setItem(row.item);
            setBudget(row.budget);
            setDueDate(new Date(row.due_date));
            setNewFrequency(row.frequency ?? 0);
            setNewColor(row.color_label ?? "Color: None")
            const foundColor = CATEGORY_COLORS.find((c) => c.label === row.color_label);
            if (foundColor) {
                setColorId(foundColor.id);
            }
            setNewBucket(row.bucket ?? "None");
            // const foundBucket = BUCKETS.find((b) => b.label === row.bucket);
            // if (foundBucket) {
            //     setBucketId(foundBucket.id);
            // }

        }
    }, [row?.id]); 

    return (
        <Modal title="Edit Item" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className={style.Budget_Item_Modal_Child_Wrapper}>
                <Input 
                    label="Category"
                    type="text"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}    
                />

                <Input
                    label="Budget Amount"
                    type="number"
                    value={budget === 0 ? "" : budget}
                    step="0.01"
                    onChange={(e) => {
                        const val = e.target.value;
                        setBudget(val === "" ? 0 : Number(val));
                    }}
                />

                <div className={style.Budget_Categories_Edit_Dropdowns}>
                    <Input 
                        label="Next Due Date"
                        type="date"
                        value={dueDate instanceof Date ? dueDate.toISOString().split('T')[0] : ""}                    
                        onChange={(e) => setDueDate(new Date(e.target.value))}               
                    />

                    <Dropdown trigger={
                        <Button className={style.Budget_Categories_Frequency_Button}>
                            {newFrequency}
                        </Button>}
                    >
                        {FREQUENCY.map((freq) => (
                            <DropdownItem
                                key={freq.id}
                                onClick={() => setNewFrequency(FREQUENCY[freq.id].label)}
                            >
                                    {freq.label}
                            </DropdownItem>)
                        )}
                    </Dropdown>

                    <Dropdown trigger={
                        <Button 
                            style={{ backgroundColor:CATEGORY_COLORS[colorId].value, color:CATEGORY_COLORS[colorId].contrast }}>
                            {newColor}
                        </Button>}
                    >
                        {CATEGORY_COLORS.map((color) => (
                            <DropdownItem style={{ 
                                backgroundColor:color.value, color:color.contrast }}
                                onClick={()=>{
                                    setColorId(color.id)
                                    setNewColor(color.label)
                            }}>
                                    {color.label}
                            </DropdownItem>
                        ))}
                    </Dropdown>

                    <Dropdown trigger={
                        <Button>
                            {newBucket}
                        </Button>}
                    >
                        {BUCKETS.map((bucket) => (
                            <DropdownItem
                                key={bucket.id}
                                onClick={() => {
                                    // setBucketId(bucket.id)
                                    setNewBucket(BUCKETS[bucket.id].label)}}
                            >
                                    {bucket.label}
                            </DropdownItem>
                        ))}
                    
                    </Dropdown>


                </div> 

                <div className={style.Item_Modal_Buttons_Wrapper}>
                    <Button variant="danger" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button onClick={()=>{
                        SaveNewItem()}}>
                            Save</Button>
                </div>
            </div>
        </Modal>
    );
}