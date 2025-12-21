//Transaction_modal.tsx
import {useCallback  } from "react";
import { Modal } from "@/components/molecules/Modal/Modal";
import { TextArea } from "@/components/atoms/TextArea/TextArea";
import { Button } from "@/components/atoms/Button/Button";
import type { Transaction } from "./types";
import { calculateBalances } from "./utils";
import { api } from "./api";


interface TransactionModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  data: Transaction | null; 
  setData: React.Dispatch<React.SetStateAction<Transaction | null>>; 
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  //onConfirm: () => void;
}

const TransactionModal = ({isOpen, setIsOpen, data, setData, setTransactions}: TransactionModalProps) => {

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    const handleSave = useCallback(async () => {
        //0. Check if Data Exists
        if(!data) return;
        //1. Get the Current Date
        const today = new Date().toISOString().split('T')[0];
        //2. Map through to find and update the Item 
        setTransactions(prev=>{
            const updatedList = prev.map(t=>{
                if(t.id !== data.id) return t;
                return{
                    ...t,
                    paid:!t.paid,
                    date:!t.paid ? today :t.date,
                    note:data.note || t.note
                };
            });
            //3. Recalucalte Balances. 
            return calculateBalances(updatedList);
        });

        //4. Send the data to be saved 
        try{
            await api.updateTransaction(data.id, {
                paid: !data.paid,
                date: !data.paid ? today : data.date,
                note: data.note
            });
        }catch(e){
            console.error("Error updating transaction",e);
            return;
        }

        //5. Close the modal
        setIsOpen(false);
    }, [setIsOpen, data, setTransactions]);


    return(
        <div>
            <Modal isOpen={isOpen} title="WARNING!" onClose={handleClose}>
                <div className="Transaction_Paid_Modal">
                    <h3>This Transaction Will Be Archived. The Date Will Be Set To Today (Paid Date). This Version Does Not Allow The User To Revert Back. </h3>

                    <TextArea
                        label="Would you like to update your note?"
                        placeholder="Note"
                        rows={8}
                        value={data?.note || ""}
                        onChange={(e) => {
                             const newNote = e.target.value;
                             setData(prev => prev ? ({...prev, note: newNote}) : null);
                        }}
                    />
                    <div className="Transaction_Paid_Modal_Buttons">
                        <Button onClick={()=>handleSave()}>  
                            Save
                        </Button>
                        <Button variant="outline" onClick={()=>setIsOpen(false)}>
                            Cancel
                        </Button>
                    </div>

                </div>
            </Modal>
        </div>
    )
}

export default TransactionModal