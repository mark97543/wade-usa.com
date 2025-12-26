//Landing.tsx

/* --------------------------------- Imports -------------------------------- */
//#region

    import { BudgetDesktop } from "@/context/Templates/Desktop";
    import { BudgetMobile } from "@/context/Templates/Mobil";
    import Sidebar from "./SideBar";
    import styles from "./Budget.module.css"


//#endregion


export default function Landing() {

    return (
        <div className="style.Budget_Landing_Wrapper">
            <BudgetDesktop
            
                sidebar={
                    <div>
                        <Sidebar />
                    </div>
                }

                viewport={
                    <div>

                    </div>
                }
            />

            <BudgetMobile

                sidebar={
                    <div>
                        <Sidebar />
                    </div>
                }

                viewport={
                    <div>
                        
                    </div>
                }
            />

        </div>
    );
}