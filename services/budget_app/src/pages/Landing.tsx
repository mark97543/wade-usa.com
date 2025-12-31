//Landing.tsx

/* --------------------------------- Imports -------------------------------- */
//#region

    import { BudgetDesktop } from "@/context/Templates/Desktop";
    import { BudgetMobile } from "@/context/Templates/Mobil";
    import Sidebar from "./SideBar";
    import { useStatess } from "@/context/StateContext";
    import Dashboard from "./views/Dashboard";
    import Transactions from "./views/Transactions";
    import Categories from "./views/Budget_Items";

    // import styles from "./Budget.module.css"


//#endregion


export default function Landing() {

    const {selectedView}= useStatess();


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
                        {selectedView === 'dashboard' && <Dashboard />}
                        {selectedView === 'transactions' && <Transactions />}
                        {selectedView === 'categories' && <Categories />}
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
                        {selectedView === 'dashboard' && <Dashboard />}
                        {selectedView === 'transactions' && <Transactions />}
                        {selectedView === 'categories' && <Categories />}
                    </div>
                }
            />

        </div>
    );
}

//For transaction import
// const loadData = async () => {
//     const response = await fetchRecentTransactions(0);
//     if (response.data) {
//         setTransactions(response.data);
//         console.log("Total matches in DB:", response.meta.filter_count);
//     }
// };