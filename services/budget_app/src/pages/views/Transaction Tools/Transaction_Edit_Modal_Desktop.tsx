// Transaction_Add_Modal_Desktop.tsx
import { Modal } from "@/components/molecules/Modal/Modal"
import { Input } from "@/components/atoms/Input/Input"
import { Button } from "@/components/atoms/Button/Button"
import { Dropdown } from "@/components/molecules/Dropdown/Dropdown"
import { DropdownItem } from "@/components/molecules/Dropdown/Dropdown"
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox"
import style from "./Transaction.module.css"
import { BUCKETS } from "@/constants/constants"


export default function Transaction_Edit_Modal_Desktop({logic}:{logic:any}){

    const{
        isModalOpen,
        setIsModalOpen,
        editRow,
        setEditRow,
        DeleteItems,
        UpdateItem
    } = logic

    return(
        <Modal isOpen={isModalOpen} title="Edit Transaction" onClose={() => setIsModalOpen(false)}>
            <div>

                <div className={style.Transaction_Modal_Desktop_Row1}>
                    <Input label="Item" value={editRow?.item || ""} onChange={(e)=>setEditRow((prev:any)=>({...prev,item:e.target.value}))}/> 
                    <Dropdown trigger={
                        <Button>
                            {editRow?.category || "None"}
                        </Button>
                    }>
                        {BUCKETS.map((bucket) => (
                            <DropdownItem
                                key={bucket.id}
                                onClick={() => setEditRow((prev:any)=>({...prev,category:bucket.label}))}
                            >
                                {bucket.label}
                            </DropdownItem>
                        ))}
                    </Dropdown>
                </div>
                
                <div className={style.Transaction_Modal_Desktop_Row2}>
                    <Input type="number" label="Withdrawal" value={ editRow?.withdrawal || 0} onChange={(e)=>setEditRow((prev:any)=>({...prev,withdrawal:parseFloat(e.target.value) || 0}))}/> 
                    <Input type="number" label="Deposit" value={editRow?.deposit || 0} onChange={(e)=>setEditRow((prev:any)=>({...prev,deposit:parseFloat(e.target.value) || 0}))}/> 
                </div>

                <div className={style.Transaction_Modal_Desktop_Row3}>
                    <Checkbox
                        label="Item Paid"
                        id="item_paid"
                        name="item_paid"
                        value={editRow?.paid || false}
                        onChange={(e)=>setEditRow((prev:any)=>({...prev,paid:e.target.checked}))}
                        checked={editRow?.paid || false}
                    />
                </div>

                <div className={style.Transaction_Modal_Desktop_Row4}>
                    <Input disabled={!editRow?.item_paid} type="date" label="Date Paid" value={editRow?.paid_date} onChange={(e)=>setEditRow((prev:any)=>({...prev,paid_date:e.target.value}))}/> 
                    <Input type="date" label="Transaction Planned Date" value={editRow?.date} onChange={(e)=>setEditRow((prev:any)=>({...prev,date:e.target.value}))}/> 
                </div>

                <div className={style.Transaction_Modal_Desktop_Row5}>
                    <Input label="Notes" value={editRow?.note || ""} onChange={(e)=>setEditRow((prev:any)=>({...prev,note:e.target.value}))}/> 
                </div>

                <div className={style.Transaction_Modal_Desktop_Row6}>
                    <Button variant="outline" onClick={()=>setIsModalOpen(false)}>Cancel</Button>
                    <Button variant="primary" onClick={()=>UpdateItem(editRow?.id, editRow)}>Save</Button>
                    <Button variant="danger" onClick={()=>DeleteItems(editRow?.id)}>Delete</Button>
                </div>

            </div>
        </Modal>

    )
}