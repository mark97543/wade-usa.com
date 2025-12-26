//Desktop.tsx

/* --------------------------------- Imports -------------------------------- */
//#region
    import React from "react";
    import styles from "./Template.module.css"
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

        return(
            <div className={styles.Budget_Desktop_Wrapper}> 
                <aside className={styles.Budget_Desktop_Sidebar} >
                    {sidebar}
                </aside>

                <div className={styles.Budget_Desktop_Viewport} >
                    {viewport}
                </div>
            </div>
        )
    }


//#endregion
