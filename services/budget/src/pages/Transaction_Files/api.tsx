// api.ts
import { readItems, createItem, deleteItem, updateItem } from "@directus/sdk";
import { client } from "@/lib/directus";
import type { Transaction, NewData } from "./types";

export const api = {
    fetchTransactions: async () => {
        return await client.request(
            readItems('transactions', {
                sort: ['date'],
                limit: -1,
                filter: { item: { _neq: `cache_bust_${Date.now()}` } }
            })
        );
    },

    fetchCategories: async () => {
        return await client.request(readItems('budget_categories', { sort: ['item'] }));
    },

    createTransaction: async (newItem: NewData) => {
        return await client.request(createItem('transactions', newItem));
    },

    updateTransaction: async (id: number, data: Partial<Transaction>) => {
        return await client.request(updateItem('transactions', id, data));
    },

    deleteTransaction: async (id: number) => {
        return await client.request(deleteItem('transactions', id));
    }
};