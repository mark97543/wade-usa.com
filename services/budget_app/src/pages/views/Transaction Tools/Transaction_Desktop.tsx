//Transactions_Desktop.tsx

import { Table } from "@/components/molecules/Table/Table"
import style from "./Transaction.module.css"


export default function Transactions_Desktop({logic}:{logic:any}){
    const {
        desktop_columns,
        packagedData,
    } = logic;

    return(
        <div className={style.Transaction_Desktop_Wrapper}>
            <Table columns={desktop_columns} data={packagedData} />
        </div>
    )
}