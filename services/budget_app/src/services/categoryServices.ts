// categoryServices.ts

import { getDirectusItems, saveItem } from '../api/api';

export const fetchCategories = async () => {
    return await getDirectusItems('budget_categories', {
        sort: 'item'
    })

}

export const saveCategory = async (data: any, id?: string | number) => {
    return await saveItem('budget_categories', data, id);
}