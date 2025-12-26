//Desktop.tsx

/* --------------------------------- Imports -------------------------------- */
//#region
    import React, { use } from "react";
    import styles from "./Template.module.css"
    import { StatesProvider, useStatess } from "../StateContext";

//#endregion


/* ------------------------------ Define Props ------------------------------ */
//#region

    interface BudgetDesktopProps{
        sidebar: React.ReactNode;
        viewport: React.ReactNode;
    }

//#endregion

/* --------------------------------- Export --------------------------------- */
//#region

    export const BudgetDesktop = ({sidebar, viewport}: BudgetDesktopProps) =>{
        //State Management here
        const {isSidebarCollapsed, toggleSidebar} = useStatess();

        return(
            <div className={styles.Budget_Desktop_Wrapper}> 
                <aside className={`${styles.Budget_Desktop_Sidebar} ${isSidebarCollapsed ? styles.expanded : ""}`} >
                    <button className={`${styles.Budget_Toggle_Button}`} onClick={toggleSidebar}>{isSidebarCollapsed ? 
                        <img src="left_arrow.png" alt="<"/>
                        : <img src="right_arrow.png" alt=">"/>}
                    </button>
                    {sidebar}
                </aside>

                <div className={styles.Budget_Desktop_Viewport} >
                    {viewport}
                </div>
            </div>
        )
    }


//#endregion
