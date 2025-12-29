//import React, {useState} from "react";
import { Input } from "@/components/atoms/Input/Input.tsx";
import { Dropdown, DropdownItem } from "@/components/molecules/Dropdown/Dropdown.tsx";
import style from "../BudgetViews.module.css";
import { Button } from "@/components/atoms/Button/Button.tsx";
import { CATEGORY_COLORS, BUCKETS, FREQUENCY } from "@/constants/constants";

interface AddItemProps {
    newColor: number;
    setNewColor: (id: number) => void;
    newCat: string;
    setNewCat: (cat: string) => void;
    newBucket: number;
    setNewBucket: (bucket: number) => void;
    newFrequency: number;
    setNewFrequency: (frequency: number) => void;
    newDueDate: Date; 
    setNewDueDate: (date: Date) => void;
    newBudget: number; 
    setNewBudget: (amount: number) => void;
}

export default function AddItem({newColor, setNewColor, newCat, setNewCat, newBucket, setNewBucket, newFrequency, setNewFrequency, newDueDate, setNewDueDate, newBudget, setNewBudget}:AddItemProps){



    return(
        <div className={style.Add_Item_Wrapper_Visible} >
            <Input 
                label="Category"
                type="text"
                value={newCat}    
                onChange={(e)=>setNewCat(e.target.value)}
            />

            <Input
                label="Budget Amount"
                type="number"
                value={newBudget === 0 ? "" : newBudget}
                step="0.01"
                onChange={(e) => {
                    const val = e.target.value;
                    setNewBudget(val === "" ? 0 : Number(val));
                }}
            />
            
            <div className={style.Budget_Categories_Dropdowns}>
                <Input 
                    label="Next Due Date"
                    type="date"
                    value={newDueDate instanceof Date ? newDueDate.toISOString().split('T')[0] : ""}                    
                    onChange={(e) => setNewDueDate(new Date(e.target.value))}               
                />

                <Dropdown trigger={
                    <Button className={style.Budget_Categories_Frequency_Button}>
                        {FREQUENCY[Number(newFrequency)].label}
                    </Button>}
                >
                    {FREQUENCY.map((freq) => (
                        <DropdownItem
                            onClick={()=>setNewFrequency(freq.id)}>
                                {freq.label}
                        </DropdownItem>)
                    )}
                </Dropdown>

            </div>

            <div className={style.Budget_Categories_Dropdowns}>
                <Dropdown trigger={
                    <Button 
                        style={{ backgroundColor:CATEGORY_COLORS[newColor].value, color:CATEGORY_COLORS[newColor].contrast }}>
                        {CATEGORY_COLORS[newColor].label}
                    </Button>}
                >
                {CATEGORY_COLORS.map((color) => (
                    <DropdownItem style={{ 
                        backgroundColor:color.value, color:color.contrast }}
                        onClick={()=>setNewColor(color.id)}>
                            {color.label}
                    </DropdownItem>
                ))}
                </Dropdown>

                <Dropdown trigger={
                    <Button>
                        {BUCKETS[newBucket].label}
                    </Button>}
                >
                    {BUCKETS.map((bucket) => (
                        <DropdownItem
                            onClick={()=>setNewBucket(bucket.id)}>
                                {bucket.label}
                        </DropdownItem>
                    ))}
                </Dropdown>
            </div>
        </div>
    )
}