import {useState} from "react";

export default function BudgetMain() {

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    
    return (
        <div className={`BudgetMainWrapper`}>
            <div className={`BudgetMain_Navbar ${isOpen ? "open" : ""}`}>

                <button onClick={toggleMenu}>
                    {isOpen ? <img src="./left.png" alt="" /> : <img src="./right.png" alt="" />}
                </button>
                
            </div>
            
        </div>
    );
}