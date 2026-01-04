//Transactions_Desktop.tsx

import { Table } from "@/components/molecules/Table/Table"
import style from "./Transaction.module.css"
import Transaction_Edit_Modal_Desktop from "./Transaction_Edit_Modal_Desktop";
import { Range } from "@/components/atoms/Range/Range";
import { Spinner } from "@/components/atoms/Spinner/Spinner";
import { Button } from "@/components/atoms/Button/Button";





export default function Transactions_Desktop({logic}:{logic:any}){

    const {
        desktop_columns,
        packagedData,
        timeRange,
        setTimeRange,
        isLoading
    } = logic;


    


    return(
        <div className={style.Transaction_Desktop_Wrapper}>

            <div className={style.Transaction_Command_Center}>
                <Range
                    id="time_step"
                    label="Time Range"
                    min={3}
                    max={12}
                    step={3}
                    initialValue={timeRange}
                    onChange={setTimeRange}
                />

                <Button>Add Item</Button>             

            </div>

            {isLoading ? 
                <div className={style.Transactions_Desktop_Spinner_Wrapper}>
                    <Spinner size="md"/> 
                </div>
                : <Table columns={desktop_columns} data={packagedData} 
            />}
            

            <Transaction_Edit_Modal_Desktop logic={logic}/>


        </div>
    )
}