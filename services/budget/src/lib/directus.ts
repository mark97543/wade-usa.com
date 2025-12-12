// services/main/src/lib/directus.ts
import { createDirectus, rest, authentication } from '@directus/sdk';


interface Schema {
    Global_Theme: {
        site_name: string;
        primary_color: string;
        secondary_color: string;
        site_logo: string;
        font_family: string;
        accent_color: string;
        surface_color: string;
        danger_color: string;
        success_color: string;
    };
    budget_categories: {
        id: number;
        item: string;
    }[];
    // CHANGE: Renamed from 'Transaction' to 'transactions' to match your readItems() call
    transactions: {
        id: number;
        date: string;
        item: string;
        deposit: number | string; 
        withdrawal: number | string;
        paid: boolean;
        category: string;
        note: string;
    }[];
}


// Environment Variables
export const ROLES = {
  ADMIN: import.meta.env.VITE_ROLE_ADMIN || '',
  BASIC: import.meta.env.VITE_ROLE_BASIC || '',
  PENDING: import.meta.env.VITE_ROLE_PENDING || '',
  PUBLIC: null
};

const apiUrl = import.meta.env.VITE_API_URL || 'https://api.wade-usa.com';

// 1. Create Client
export const client = createDirectus<Schema>(apiUrl)
    .with(rest({ 
        // CRITICAL: This allows cookies to be sent/received across domains
        credentials: 'include',
        
        // ✅ FIX: Use the 'onRequest' hook to disable caching globally
        onRequest: (options) => ({
            ...options,
            cache: 'no-store', 
        }),
    })) 
    .with(authentication('cookie', { 
        autoRefresh: true,
    }));