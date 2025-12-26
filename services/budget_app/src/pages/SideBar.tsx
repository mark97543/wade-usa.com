//Sidebar.tsx
import style from "./Budget.module.css"
import { useStatess } from "@/context/StateContext"

export default function Sidebar(){
    const {isSidebarCollapsed} = useStatess();

    return(
        <div>
            <div>
                <button className={style.Budget_Sidebar_Buttons}>
                    <div className={style.Icon_Container}>
                        <img src="./dashboard.png" alt="Dashboard Icon" />
                    </div>
                    <span className={`${style.Budget_Sidebar_Label} ${isSidebarCollapsed ? style.expanded : style.collapsed }`}>Dashboard</span>
                </button>
            </div>
            
            <div>
                <button className={style.Budget_Sidebar_Buttons}>
                    <div className={style.Icon_Container}>
                        <img src="./transactions.png" alt="Transactions Icon" />
                    </div>
                    <span className={`${style.Budget_Sidebar_Label} ${isSidebarCollapsed ? style.expanded : style.collapsed }`}>Transactions</span>
                </button>
            </div>

        </div>
    )
}