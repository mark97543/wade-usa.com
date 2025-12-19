// columns.tsx
import type { Transaction, Column, Category } from "./types";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Input } from "@/components/atoms/Input/Input";
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
    
    // Helper to get value (Draft vs Real)
    const getValue = (row: Transaction, key: keyof Transaction) => {
        if (row.id === editingId && editFormData) return editFormData[key];
        return row[key];
    };

    return [
        {
            key: 'paid', header: "Paid", rowType: 'both', render: (row) => (
                <Checkbox
                    id={`paid-${row.id}`} label="" name={`paid-${row.id}`} value={String(row.id)}
                    checked={row.paid}
                    onChange={() => handlers.updateTransaction(row.id, row.paid)}
                />
            )
        },
        {
            key: 'date', header: "Date", rowType: 'both',render: (row) => (
                row.id === editingId ? (
                    <Input
                        type="date"
                        name="date"
                        value={String(getValue(row, 'date'))}
                        onChange={handlers.handleEditChange}
                    />
                ) : (
                    <div>{row.date}</div>
                )
            )
        },
        {
            key: 'item', header: "Item", rowType:'main',render: (row) => (
                row.id === editingId ? (
                    <Input
                        type="text"
                        name="item"
                        value={String(getValue(row, 'item'))}
                        onChange={handlers.handleEditChange}
                    />
                ) : (
                    <div>{row.item}</div>
                )
            )
        },
        {
            key: 'deposit', header: "Dep", rowType:'main', render: (row) => (
                row.id === editingId ? (
                    <Input
                        type="number"
                        name="deposit"
                        value={String(getValue(row, 'deposit'))}
                        onChange={handlers.handleEditChange}
                    />
                ) : (
                    <div>$ {Number(row.deposit).toFixed(2)}</div>
                )
            )
        },
        {
            key: 'withdrawal', header: "With", rowType:'main', render: (row) => (
                row.id === editingId ? (
                    <Input
                        type="number"
                        name="withdrawal"
                        value={String(getValue(row, 'withdrawal'))}
                        onChange={handlers.handleEditChange}
                    />
                ) : (
                    <div>$ {Number(row.withdrawal).toFixed(2)}</div>
                )
            )
        },
        {
            key: 'balance', header: "Balance", rowType:'main',render: (row) => 
                <div>$ {Number(row.balance).toFixed(2)}</div>
        },
        {
            key: 'category', header: "Category",rowType:'main', render: (row) => (
                row.id === editingId ? (
                    <Dropdown 
                        trigger={
                            <span >
                                {String(getValue(row, 'category')) || 'Select'}
                                <small>▼</small>
                            </span>
                        }
                    >
                        {categories.map((cat) => (
                            <DropdownItem key={cat.id} onClick={() => handlers.handleCategoryChange(cat.item)}>
                                {cat.item}
                            </DropdownItem>
                        ))}
                    </Dropdown>
                ) : (
                    <div>{row.category}</div>
                )
            )
        },
        {
            key: 'note', header: "Note", rowType:'sub', cellProps: () => ({colSpan: 5}),render: (row) => (
                row.id === editingId ? (
                    <Input
                        type="text"
                        name="note"
                        value={String(getValue(row, 'note'))}
                        onChange={handlers.handleEditChange}
                    />
                ) : (
                    <div>{row.note ? (
                            <>
                                <strong>Note: </strong> {row.note}
                            </>
                        ) : (
                            <>
                                <strong>Note: -</strong> 
                            </>
                    )}</div>
                )
            )
        },
         {
            key:'actions', header:"Actions", rowType:'both',render: (row: Transaction) => ( 
                <div className="Transactions_Actions">
                    {row.id === editingId ? (
                        <>
                            <button onClick={handlers.saveEdit} title="Save"><img src="./save.png" alt="Save" /></button>
                            <button onClick={handlers.cancelEdit} title="Cancel"><img src="./cancel.png" alt="Cancel" /></button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => handlers.startEdit(row.id)} title="Edit"><img src="./pencil.png" alt="Edit" /></button> 
                            <button onClick={() => handlers.deleteTransaction(row.id)} title="Delete"><img src="./delete.png" alt="Delete" /></button>
                        </>
                    )}
                </div>
            )
        }
    ];
};