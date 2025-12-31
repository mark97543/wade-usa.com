//Items_Mobile.tsx

import { Card } from "@/components/molecules/Card/Card";
import style from "./BudgetViews.module.css"
import { Button } from "@/components/atoms/Button/Button";
import AddItem from "./AddItems";


const Items_Mobile = ({logic}:{logic:any}) => {
    const {
        balance,
        addItemMenu,
        setAddItemMenu,
        SaveNewItem,
        closeAddItemMenu,
        categories,
        editItem,
        deleteCategory
    }=logic;

    const monthly=(budge:number, frequency:string)=>{
        if(frequency === "Weekly"){
            return budge * 4;
        }else if(frequency === "Bi-Weekly"){
            return budge * 2;
        }else if(frequency === "Monthly"){
            return budge;
        }else{
            return 0;
        }
    }

    return(
        <div>
            <h2 style={{textAlign:"right", marginTop:"1rem", marginBottom:"1rem"}}>
                {`Total Monthly Balance: ${new Intl.NumberFormat('en-US', {
                    style: 'currency', currency: 'USD'
                }).format(balance || 0)}`} {/* Use number 0, not string '0' */}
            </h2>

            {/*Card For Add Item */}
            <Card className={style.Budget_Items_Cards}>
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
            </Card>


            {/*Will map through items on this card  */}
            {categories.map((category:any)=>{
                return(
                <Card title={category.item} className={style.Budget_Item_Cards_Ledger}>
                    <div className={style.Ledger_Row}>
                        <span>Budget Amount</span>
                        <div className={style.Ledger_Dots}></div>
                        <span className={style.Ledger_Value}>
                            {new Intl.NumberFormat('en-US', {
                            style: 'currency', currency: 'USD'
                            }).format(category.budget || 0)}
                        </span>
                    </div>
                    <div className={style.Ledger_Row}>
                        <span>Bucket</span>
                        <div className={style.Ledger_Dots}></div>
                        <span className={style.Ledger_Value}>{category.bucket}</span>
                    </div>
                    <div className={style.Ledger_Row}>
                        <span>Frequency</span>
                        <div className={style.Ledger_Dots}></div>
                        <span className={style.Ledger_Value}>{category.frequency}</span>
                    </div>
                    <div className={style.Ledger_Row}>
                        <span>Monthly</span>
                        <div className={style.Ledger_Dots}></div>
                        <span className={style.Ledger_Value}>
                            {new Intl.NumberFormat('en-US', {
                            style: 'currency', currency: 'USD'
                            }).format(monthly(category.budget, category.frequency) || 0)}
                        </span>
                    </div>
                    <div className={style.Ledger_Row}>
                        <span>Color</span>
                        <div className={style.Ledger_Dots}></div>
                        <span className={style.Ledger_Value} style={{
                            backgroundColor:category.color,
                            width:"25px",
                            height:"25px",
                            borderRadius:"50%",
                            border:"1px solid #ccc",
                            display:"flex",
                            justifyContent:"center",
                            alignItems:"center"
                            }}>
                            C
                        </span>
                    </div>
                    <div className={style.Cat_Action_Container} >
                        <button className={style.Cat_Action_Buttons} onClick={()=>editItem(category)}>
                            <img src="./edit.png"/>
                        </button>
                        <button className={style.Cat_Action_Buttons} onClick={()=>deleteCategory(category.id)}>
                            <img src="./delete.png"/>
                        </button>
                    </div>
                </Card>
            )})}

        </div>
    )
}

export default Items_Mobile;

