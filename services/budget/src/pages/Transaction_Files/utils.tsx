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
        
        // If this is a "Rebalance" row, we RESET the math.
        // We use the deposit amount as the new absolute truth.
        if (item.category === 'Rebalance' || item.item === 'Starting Balance') {
            runningTotal = dep; 
        } else {
            // Otherwise, just do normal math
            runningTotal += (dep - wth);
        }

        return {
            ...item,
            balance: Number(runningTotal.toFixed(2))
        };
    });
};