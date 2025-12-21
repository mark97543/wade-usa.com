import { Table } from "@/components/molecules/Table/Table";
import { Input } from "@/components/atoms/Input/Input";
import { Dropdown, DropdownItem } from "@/components/molecules/Dropdown/Dropdown";
import { Button } from "@/components/atoms/Button/Button";
import { Pagination } from "@/components/molecules/Pagination/Pagination";
import { useTransactions } from "./Transaction_Files/useTransactions.tsx";
import TransactionModal from "./Transaction_Files/Transaction_modal.tsx";
import Transaction_Card from "./Transaction_Files/Transaction_Card.tsx";

export default function Transactions() {
    const {
        columns,
        currentData,
        page,
        totalPages,
        handlePageChange,
        saveNewItem,
        newItem,
        setNewItem,
        categories,
        isOpen,
        setIsOpen,
        selectedItem,
        setSelectedItem,
        setTransactions
    } = useTransactions();

    return (
        <div className="Transactions_Wrapper">
            <h1>Transactions</h1>
            
            <div className="Transactions_table_container">
                <Table columns={columns} data={currentData} />
            </div>

            <div className="Transactions_Card_Container">
                <Transaction_Card columns={columns} data={currentData}/>
            </div>

            <div className="Transactions_Edit_Form_Div">
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    pageRange={1}
                />
                
                <div className="Transactions_Add_Form">
                    
                    {/* 1. Add Button */}
                    <Button onClick={() => saveNewItem()}>+</Button>
                    
                    {/* 2. Date */}
                    <div className="form-item-wrapper">
                        <Input 
                            type="date" 
                            value={newItem.date} 
                            onChange={(e) => setNewItem(prev => ({ ...prev, date: e.target.value }))} 
                        />
                    </div>

                    {/* 3. Item Name */}
                    <div className="form-item-wrapper">
                        <Input 
                            type="text" 
                            placeholder="Item" 
                            value={newItem.item} 
                            onChange={(e) => setNewItem(prev => ({ ...prev, item: e.target.value }))} 
                        />
                    </div>

                    {/* 4. Deposit */}
                    <div className="form-item-wrapper">
                        <Input 
                            type="number" 
                            placeholder="Deposit" 
                            value={newItem.deposit} 
                            onChange={(e) => setNewItem(prev => ({ ...prev, deposit: e.target.value }))} 
                        />
                    </div>

                    {/* 5. Withdrawal */}
                    <div className="form-item-wrapper">
                        <Input 
                            type="number" 
                            placeholder="Withdrawal" 
                            value={newItem.withdrawal} 
                            onChange={(e) => setNewItem(prev => ({ ...prev, withdrawal: e.target.value }))} 
                        />
                    </div>

                    {/* 6. Category Dropdown */}
                    <div className="form-item-wrapper">
                        <Dropdown trigger={
                            <span style={{ 
                                cursor: 'pointer', 
                                padding: '0.25rem 0.5rem', 
                                border: '1px solid rgba(255,255,255,0.1)', 
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                width: '100%', 
                                justifyContent: 'space-between',
                                userSelect: 'none',
                                background: 'var(--secondary-color)',
                                height: '100%',
                                minHeight: '38px',
                                boxSizing: 'border-box'
                            }}> 
                                {newItem?.category || 'Select...'}
                                <small style={{ opacity: 0.5 }}>▼</small>
                            </span>
                        }>
                            {categories.map((cat) => (
                                <DropdownItem 
                                    key={cat.id} 
                                    onClick={() => setNewItem(prev => {
                                        const current = prev || { 
                                            id: 0, date: '', item: '', deposit: 0, withdrawal: 0, paid: false, category: '', note: '' 
                                        };
                                        return { ...current, category: cat.item };
                                    })}
                                >
                                    {cat.item}
                                </DropdownItem>
                            ))}
                        </Dropdown>
                    </div>

                    {/* 7. Note */}
                    <div className="form-item-wrapper">
                        <Input 
                            type="text" 
                            placeholder="Note" 
                            value={newItem.note} 
                            onChange={(e) => setNewItem(prev => ({ ...prev, note: e.target.value }))} 
                        />
                    </div>

                </div>
            </div>

            <TransactionModal 
                isOpen={isOpen} 
                setIsOpen={setIsOpen} 
                data={selectedItem} 
                setData={setSelectedItem}
                setTransactions={setTransactions}
            />
        </div>
    );
}