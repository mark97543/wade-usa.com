// utils.ts
import type { Transaction } from "./types";

export const calculateBalances = (items: any[]): Transaction[] => {
    let runningTotal = 0;
    
    // Sort by date first
    const sorted = [...items].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return sorted.map((item) => {
        const dep = Number(item.deposit) || 0;
        const wth = Number(item.withdrawal) || 0;
        runningTotal += (dep - wth);

        return {
            ...item,
            balance: Number(runningTotal.toFixed(2))
        };
    });
};