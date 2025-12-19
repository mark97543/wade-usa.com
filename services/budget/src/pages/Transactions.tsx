import { Table } from "@/components/molecules/Table/Table";
import { Input } from "@/components/atoms/Input/Input";
import { Dropdown, DropdownItem } from "@/components/molecules/Dropdown/Dropdown";
import { Button } from "@/components/atoms/Button/Button";
import { Pagination } from "@/components/molecules/Pagination/Pagination";
import { useTransactions } from "./Transaction_Files/useTransactions.tsx";

export default function Transactions() {

    const{
        columns,
        currentData,
        page,
        totalPages,
        handlePageChange,
        saveNewItem,
        newItem,
        setNewItem,
        categories
    } = useTransactions()

    return (
        <div className="Transactions_Wrapper">
            <h1>Transactions</h1>
            <div className="Transactions_table_container">
                <Table columns={columns} data={currentData} />
            </div>

            <div className="Transactions_Edit_Form_Div">
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    pageRange={1}
                />
                <div className="Transactions_Add_Form">
                    
                    <Button onClick={()=>saveNewItem()}>+</Button>
                    
                    <Input type="date" value={newItem.date} onChange={(e)=>setNewItem(
                        prev => {
                            return{
                                ...prev, 
                                date:e.target.value
                            }
                        })}>
                    </Input>

                    <Input type="text" placeholder={"Item"} value={newItem.item} onChange={(e)=>setNewItem(
                        prev => {
                            return{
                                ...prev, 
                                item:e.target.value
                            }
                        })}>
                    </Input>

                    <Input type="number" placeholder={"Deposit"} value={newItem.deposit} onChange={(e)=>setNewItem(
                        prev => {
                            return{
                                ...prev, 
                                deposit:e.target.value
                            }
                        })}>
                    </Input>

                    <Input type="number" placeholder={"Withdrawal"} value={newItem.withdrawal} onChange={(e)=>setNewItem(
                        prev => {;
                            return{
                                ...prev, 
                                withdrawal:e.target.value
                            }
                        })}>
                    </Input>

                    <Dropdown trigger={
                        <span style={{ 
                            cursor: 'pointer', 
                            padding: '0.25rem 0.5rem', 
                            border: '1px solid rgba(255,255,255,0.1)', 
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            minWidth: '120px',
                            justifyContent: 'space-between',
                            userSelect: 'none'
                        }}> 
                            {newItem?.category || 'Select...'}
                            <small style={{ opacity: 0.5 }}>▼</small>
                        </span>
                    }>

                        {categories.map((cat)=>(
                            <DropdownItem 
                                key={cat.id} 
                                onClick={() => setNewItem(prev => {
                                    // 1. If 'prev' is null, create a blank default object
                                    const current = prev || { 
                                        id: 0, date: '', item: '', deposit: 0, withdrawal: 0, paid: false, category: '', note: '' 
                                    };
                                    
                                    // 2. Now update the category
                                    return { ...current, category: cat.item };
                                })}
                            >
                                {cat.item}
                            </DropdownItem>
                        ))}

                    </Dropdown>

                    <Input type="text" placeholder={"Note"} value={newItem.note} onChange={(e)=>setNewItem(
                        prev => {
                            return{
                                ...prev, 
                                note:e.target.value
                            }
                        })}>
                    </Input>

                </div>
            </div>
        </div>
    );


    //TODO: Need to Make Cell GUI
    //TODO: Need to Make Tablet Gui

    //TODO: Need to Add Ballance Column
        //TODO: Added Cell But now need to reformat the whole table. 
        //TODO: Need to make it so the function takes the completed transactions first then goes through remaining transactions. Filtering out paid Items should be 

    //TODO: Need to shrink the useTransactions.tsx
    //TODO: Need to Center and format Title
    //TODO: Need to fit more items on a page (15-20)
    //TODO: Maybe conver the Edits to a modal to save some formating 
    //TODO: Need to Filter out the paid items. 
    //TODO: Need to reastablish security 
    //TODO: Befor Hiding Checke need note update so we could review Items or confirmation numbers. 


}