// src/pages/Dash.tsx (or similar)
import { Button } from '@/components/atoms/Button/Button'

export default function Dash() {
    const budgetUrl = import.meta.env.VITE_APP_BUDGET_URL;

    const buttonClicker = () => {
        // Debugging: Check console to ensure URL is actually there
        console.log("Navigating to:", budgetUrl); 
        
        if (budgetUrl) {
            window.location.href = budgetUrl;
        } else {
            alert("Error: Budget URL not configured!");
        }
    }

    return (
        <div>
            <h1>Wade Updates</h1>
            <Button variant="danger" onClick={buttonClicker}>Go to Budget</Button>
            <p>12/3/25: Added dashboard and updated the Auth...</p>
            <p>12/12/25: Added DB options to the budget transaction page. | Added Pagination to budget transactions</p>
        </div>
    );
}