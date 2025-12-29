//transactionServices.ts

import { getDirectusItems } from '../api/api';

export const fetchRecentTransactions = async (pageOffset = 0 )=>{
    return await getDirectusItems('transactions',{
        limit:50,
        offset: pageOffset,
        sort:'-date',
        // Directus Dynamic Filter: Greater than or equal to 3 months ago
        'filter[date][_gte]': '$NOW(-3 months)',
        'meta': 'filter_count' // Useful for infinite scroll to know when to stop
    })
}