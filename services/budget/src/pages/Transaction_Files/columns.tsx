// columns.tsx
import type { Transaction, Column, Category } from "./types";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Dropdown, DropdownItem } from "@/components/molecules/Dropdown/Dropdown";


interface ColumnProps {
    editingId: number | null;
    editFormData: Transaction | null;
    categories: Category[];
    handlers: {
        updateTransaction: (id: number, paid: boolean) => void;
        handleEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        handleCategoryChange: (cat: string) => void;
        saveEdit: () => void;
        cancelEdit: () => void;
        startEdit: (id: number) => void;
        deleteTransaction: (id: number) => void;
    };
}

export const getColumns = ({ editingId, editFormData, categories, handlers }: ColumnProps): Column[] => {
    
    // Helper to get value
    const getValue = (row: Transaction, key: keyof Transaction) => {
        if (row.id === editingId && editFormData) return editFormData[key];
        return row[key];
    };

    return [
        {
            key: 'paid', header: "Paid", render: (row) => (
                <Checkbox
                    id={`paid-${row.id}`} label="" name={`paid-${row.id}`} value={String(row.id)}
                    checked={row.paid}
                    onChange={() => handlers.updateTransaction(row.id, row.paid)}
                />
            )
        },
        // ... (Paste your Date, Item, Deposit, Withdrawal columns here) ...
        {
            key: 'balance', header: "Balance", render: (row) => 
                <div>$ {Number(row.balance).toFixed(2)}</div>
        },
        {
            key: 'category', header: "Category", render: (row) => (
                row.id === editingId ? (
                    <Dropdown trigger={<span>{String(getValue(row, 'category')) || 'Select'}</span>}>
                        {categories.map((cat) => (
                            <DropdownItem key={cat.id} onClick={() => handlers.handleCategoryChange(cat.item)}>
                                {cat.item}
                            </DropdownItem>
                        ))}
                    </Dropdown>
                ) : <div>{row.category}</div>
            )
        },
        // ... (Paste Note and Actions columns here) ...
         {
            key:'actions', header:"Actions", render: (row: Transaction) => ( 
                <div className="Transactions_Actions">
                    {row.id === editingId ? (
                        <>
                            <button onClick={handlers.saveEdit}><img src="./save.png" alt="Save" /></button>
                            <button onClick={handlers.cancelEdit}><img src="./cancel.png" alt="Cancel" /></button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => handlers.startEdit(row.id)}><img src="./pencil.png" alt="Edit" /></button> 
                            <button onClick={() => handlers.deleteTransaction(row.id)}><img src="./delete.png" alt="Delete" /></button>
                        </>
                    )}
                </div>
            )
        }
    ];
};