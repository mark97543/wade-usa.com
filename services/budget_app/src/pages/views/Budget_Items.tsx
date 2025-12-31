//Categories.tsx

import { Spinner } from "@/components/atoms/Spinner/Spinner.tsx";
import style from "./Budget Items Tools/BudgetViews.module.css"
import ItemModal from "./Budget Items Tools/ItemModal.tsx";
import { useCategories } from "@/hooks/useCategories.tsx";
import Items_Desktop from "./Budget Items Tools/Items_Desktop.tsx";
import Items_Mobile from "./Budget Items Tools/Items_Mobile.tsx";




export default function Categories(){
    const logic = useCategories();
    const { 
        //States
        isLoading,
        refreshCount,
        setRefreshCount,
        isModalOpen,
        setIsModalOpen,
        editRow,
        //Functions
    } = logic;  

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                <Spinner />
            </div>
        );
    }

    return(
        <div className={style.Budget_Categories_Wrapper}>

           {isModalOpen && editRow && (
                <ItemModal 
                    isModalOpen={isModalOpen} 
                    setIsModalOpen={setIsModalOpen} 
                    row={editRow} 
                    setRefreshCount={setRefreshCount}
                    refreshCount={refreshCount}
                />
            )}

            <div className={style.Budget_Items_Desktop_View}>
                <Items_Desktop logic={logic}/>
            </div>

            <div className={style.Budget_Items_Mobile_View}>
                <Items_Mobile logic={logic}/>
            </div>
            

        </div>
    )
}





