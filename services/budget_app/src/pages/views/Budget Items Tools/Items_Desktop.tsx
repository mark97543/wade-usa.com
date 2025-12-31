//Items_Desktop.tsx
import AddItem from "./AddItems"
import { Button } from "@/components/atoms/Button/Button"
import style from "./BudgetViews.module.css"
import { Table } from "@/components/molecules/Table/Table"


export default function Items_Desktop({logic}:{logic:any}){

    const {
        closeAddItemMenu,
        SaveNewItem,
        addItemMenu, 
        setAddItemMenu,
        balance,
        categories,
        columns
    }=logic;

    return(
        <div>
            <div className={`${style.Add_Item_Wrapper} ${addItemMenu ? style.Add_Item_Wrapper_Visible : ''}`}>
            
         
                <AddItem logic={logic}/>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', marginTop: '1.5rem', width: '100%', maxWidth: '400px' }}>
                    <Button variant="outline" onClick={closeAddItemMenu}>Cancel</Button>
                    <Button onClick={SaveNewItem}>Save</Button>
                </div>
            </div>

            <div style={{ display: !addItemMenu ? 'block' : 'none' }}>
                <Button onClick={() => setAddItemMenu(true)}>Add Item</Button>
            </div>

            <h2 style={{textAlign:"right", marginTop:"1rem", marginBottom:"1rem"}}>
                {`Total Monthly Balance: ${new Intl.NumberFormat('en-US', {
                    style: 'currency', currency: 'USD'
                }).format(balance || 0)}`} {/* Use number 0, not string '0' */}
            </h2>

            <Table data={categories} columns={columns}/>

            <p style={{textAlign:"center", marginTop:"1rem"}}><i><b>Note:</b>Monthly balances will only reflect weekly, bi-weekly and monthly expenses</i></p>
       
        </div>
    )
}