// utils.ts
import type { Transaction } from "./types";
export const calculateBalances = (items: any[]): Transaction[] => {
    // 1. Sort Chronologically
    const sorted = [...items].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let runningTotal = 0;

    return sorted.map((item) => {
        const dep = Number(item.deposit) || 0;
        const wth = Number(item.withdrawal) || 0;
        
        // 2. ALWAYS add the amount, paid or not.
        // This creates a smooth, continuous "Projected Balance" line.
        runningTotal += (dep - wth);

        return {
            ...item,
            balance: Number(runningTotal.toFixed(2))
        };
    });
};