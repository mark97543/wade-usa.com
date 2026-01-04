require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// --- CONFIGURATION CONSTANTS ---
const COLLECTIONS = {
    BUDGETS: 'budget_categories',
    TRANSACTIONS: 'transactions'
};

const FIELDS = {
    BUDGET_CATEGORY_SELECTOR: 'bucket',   
    TRANSACTION_CATEGORY_NAME: 'category',
    TRANSACTION_DATE_FIELD: 'date' 
};

const { DIRECTUS_URL, DIRECTUS_TOKEN, PORT = 3000 } = process.env;

const api = axios.create({
    baseURL: DIRECTUS_URL,
    headers: { 'Authorization': `Bearer ${DIRECTUS_TOKEN}` }
});

async function runReconciliation() {
    console.log('--- Starting Reconciliation ---');

    // 1. Fetch Data
    const [budgetsRes, transRes] = await Promise.all([
        api.get(`/items/${COLLECTIONS.BUDGETS}?limit=-1`),
        api.get(`/items/${COLLECTIONS.TRANSACTIONS}?limit=-1&fields=id,id_to_cats,paid,${FIELDS.TRANSACTION_DATE_FIELD},item,${FIELDS.TRANSACTION_CATEGORY_NAME}`)
    ]);

    const budgets = budgetsRes.data.data;
    const transactions = transRes.data.data;
    const budgetIds = budgets.map(b => b.id);

    // 2. THE PURGE: Remove old unpaid projections to avoid duplicates
    const purgeIds = transactions
        .filter(t => budgetIds.includes(Number(t.id_to_cats)) && (t.paid === false || t.paid === 0))
        .map(t => t.id);

    if (purgeIds.length > 0) {
        console.log(`Purging ${purgeIds.length} unpaid items...`);
        await api.delete(`/items/${COLLECTIONS.TRANSACTIONS}`, { data: purgeIds });
    }

    // 3. THE GENERATION: 13-Month Inclusive Loop
    const toCreate = [];
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 13);

    for (const budget of budgets) {
        // Anchor the day to the original due date (e.g., always the 1st)
        const originalDueDate = new Date(budget.due_date);
        const anchorDay = originalDueDate.getUTCDate();

        // Find the most recent PAID transaction for this budget
        const latestPaid = transactions
            .filter(t => Number(t.id_to_cats) === budget.id && t.paid === true)
            .sort((a, b) => new Date(b[FIELDS.TRANSACTION_DATE_FIELD]) - new Date(a[FIELDS.TRANSACTION_DATE_FIELD]))[0];
        
        // Starting Point: If paid, start from next cycle. If not, start at due_date
        let rollingDate = new Date(latestPaid ? latestPaid[FIELDS.TRANSACTION_DATE_FIELD] : budget.due_date);
        rollingDate.setUTCHours(12, 0, 0, 0); 

        const freq = budget.frequency;

        // If we found a PAID record, jump forward one cycle immediately
        if (latestPaid) {
            if (freq === 1 || freq === 'Weekly') rollingDate.setUTCDate(rollingDate.getUTCDate() + 7);
            else if (freq === 2 || freq === 'Bi-Weekly') rollingDate.setUTCDate(rollingDate.getUTCDate() + 14);
            else if (freq === 3 || freq === 'Monthly') {
                rollingDate.setUTCMonth(rollingDate.getUTCMonth() + 1);
                rollingDate.setUTCDate(anchorDay);
            } else if (freq === 4 || freq === 'Quarterly') {
                rollingDate.setUTCMonth(rollingDate.getUTCMonth() + 3);
                rollingDate.setUTCDate(anchorDay);
            } else if (freq === 5 || freq === 'Yearly') {
                rollingDate.setUTCFullYear(rollingDate.getUTCFullYear() + 1);
                rollingDate.setUTCDate(anchorDay);
            }
        }

        // Generate until end date
        while (rollingDate < endDate) {
            const dateString = rollingDate.toISOString().split('T')[0];
            const categoryValue = budget[FIELDS.BUDGET_CATEGORY_SELECTOR];

            toCreate.push({
                [FIELDS.TRANSACTION_DATE_FIELD]: dateString,
                id_to_cats: budget.id,
                item: budget.item,
                [FIELDS.TRANSACTION_CATEGORY_NAME]: categoryValue,
                paid: false,
                deposit: categoryValue === "Income" ? budget.budget : 0,
                withdrawal: categoryValue !== "Income" ? budget.budget : 0
            });

            // Increment for next iteration
            if (freq === 1 || freq === 'Weekly') rollingDate.setUTCDate(rollingDate.getUTCDate() + 7);
            else if (freq === 2 || freq === 'Bi-Weekly') rollingDate.setUTCDate(rollingDate.getUTCDate() + 14);
            else if (freq === 3 || freq === 'Monthly') {
                rollingDate.setUTCMonth(rollingDate.getUTCMonth() + 1);
                rollingDate.setUTCDate(anchorDay);
            } else if (freq === 4 || freq === 'Quarterly') {
                rollingDate.setUTCMonth(rollingDate.getUTCMonth() + 3);
                rollingDate.setUTCDate(anchorDay);
            } else if (freq === 5 || freq === 'Yearly') {
                rollingDate.setUTCFullYear(rollingDate.getUTCFullYear() + 1);
                rollingDate.setUTCDate(anchorDay);
            } else break;
        }
    }

    // 4. THE COMMIT: Batch upload results to Directus
    if (toCreate.length > 0) {
        console.log(`Creating ${toCreate.length} new projections...`);
        await api.post(`/items/${COLLECTIONS.TRANSACTIONS}`, toCreate);
    }

    console.log('--- Reconciliation Complete ---');
    return { purged: purgeIds.length, created: toCreate.length };
}

app.all('/reconcile', async (req, res) => {
    try {
        const results = await runReconciliation();
        res.json({ success: true, ...results });
    } catch (error) {
        const errorData = error.response?.data || error.message;
        console.error('Failed:', JSON.stringify(errorData, null, 2));
        res.status(500).json({ success: false, error: errorData });
    }
});

app.listen(PORT, () => console.log(`🚀 Worker online at port ${PORT}`));