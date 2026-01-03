// services/main/src/services/transactionServices.ts
import { getDirectusItems, deleteDirectusItem, saveItem } from '../api/api';

/**
 * Fetch transactions from the Last Rebalance up to X months in the future.
 * @param rebalanceDate - The ISO string from your last checkpoint (e.g. "2023-10-01")
 * @param monthsForward - How far into the future to look (e.g. 3)
 */
export const fetchTransactionsByRange = async (
    rebalanceDate: string | null, 
    monthsForward: number
) => {
    //Safety Fallback: If no rebalance exists, start from "Beginning of Time" (or 1 year ago)
    const startDate = rebalanceDate || '$NOW(-1 year)';

    return await getDirectusItems('transactions', {
        limit: 2000, //Limits pull to 2000 items
        sort: ['date'], 
        
        filter: {
            _and: [
                // 1. START: After the Rebalance
                {
                    date: { _gte: startDate }
                },
                // 2. END: Before the Future Limit
                {
                    date: { _lte: `$NOW(+${monthsForward} months)` }
                },
                // 3. CLEANUP: Ignore the 'Rebalance' entry itself
                {
                    category: { _neq: 'Rebalance' }
                }
            ]
        }
    });
};




/**
 * Fetch strictly the last Rebalance/Checkpoint
 */
export const fetchLastRebalance = async () => {
    const response = await getDirectusItems('transactions', {
        filter: { category: { _eq: 'Rebalance' } },
        sort: ['-date'], 
        limit: 1
    });
    return response.data?.[0] || null;
}

/**
 * Delete transaction
 */
export const deleteTransaction = async (id: string | number) => {
    return await deleteDirectusItem('transactions', id);
}


/**
 * Update Transaction
 */
export const updateTransaction = async (id: string | number, data: any) => {
    return await saveItem('transactions', data, id);
}