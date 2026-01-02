//Transactions.tsx
import style from "./Transaction Tools/Transaction.module.css"
import Transactions_Desktop from "./Transaction Tools/Transaction_Desktop.tsx"
import Transactions_Mobile from "./Transaction Tools/Transaction_Mobile.tsx"
import { useTransactions } from "@/hooks/useTransactions.tsx"
import { Spinner } from "@/components/atoms/Spinner/Spinner"

export default function Transactions(){
    const logic = useTransactions();

    const {
        isLoading,
        setIsLoading
    } = logic;

    if(isLoading){
        return( 
            <div className={style.Transactions_Main_Wrapper} style={{display:'flex', justifyContent:'center', padding:'2rem'}}>
                <Spinner/>
            </div>
        )
    }

    return(
        <div>

            <div className={style.Transaction_Desktop_View}>
                <Transactions_Desktop logic={logic}/>
            </div>
            <div className={style.Transaction_Mobile_View}>
                <Transactions_Mobile/>
            </div>


        </div>
    )
}