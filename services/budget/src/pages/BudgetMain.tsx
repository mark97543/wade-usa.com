import {useState} from "react";

// --Import Pages--
import Dashboard from "./Dashboard";
import Transactions from "./Transactions";

export default function BudgetMain() {

    const [isOpen, setIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState("Dashboard");

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    
    return (
        <div className={`BudgetMainWrapper`}>
            <div className={`BudgetMain_Navbar ${isOpen ? "open" : ""}`}>

                <button onClick={toggleMenu}>
                    {isOpen ? <img src="./left.png" alt="" /> : <img src="./right.png" alt="" />}
                </button>

                <button className={`BudgetMain_Navbar_Button ${currentPage === "Dashboard" ? "selected" : ""}`} onClick={() => setCurrentPage("Dashboard")}>
                    <div className={`BudgetMain_Navbar_Button ${isOpen ? "open" : ""}`}>
                        <img src="./dashboard.png" alt="" />
                        {isOpen ? <p>Dashboard</p> : ""}
                    </div>
                </button>

                <button className={`BudgetMain_Navbar_Button ${currentPage === "Transactions" ? "selected" : ""}`} onClick={() => setCurrentPage("Transactions")}>
                    <div className={`BudgetMain_Navbar_Button ${isOpen ? "open" : ""}`}>
                        <img src="./transaction.png" alt="" />
                        {isOpen ? <p>Transactions</p> : ""}
                    </div>
                </button>
                
            </div>
            
            {currentPage === "Dashboard" ? <Dashboard /> : ""}
            {currentPage === "Transactions" ? <Transactions /> : ""}

        </div>
    );
}