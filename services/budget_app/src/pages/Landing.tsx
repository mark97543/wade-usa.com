//Landing.tsx

/* --------------------------------- Imports -------------------------------- */
//#region

    import { BudgetDesktop } from "@/context/Templates/Desktop";
    import { BudgetMobile } from "@/context/Templates/Mobil";


//#endregion


export default function Landing() {

    return (
        <>
            <BudgetDesktop
            
                sidebar={
                    <div>

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

                    </div>
                }

                viewport={
                    <div>
                        
                    </div>
                }
            />

        </>
    );
}