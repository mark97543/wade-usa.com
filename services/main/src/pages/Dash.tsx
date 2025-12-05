import {Button} from '@/components/atoms/Button/Button'

export default function Dash() {

    const buttonClicker = () => {
        window.location.href = `${import.meta.env.VITE_APP_BUDGET_URL}`;
    }

    return (
        <div>
            <h1>Wade Updates</h1>
            <Button variant="danger" onClick={buttonClicker}>Go to Budget</Button>
            <p>12/3/25: Added dashboard and updated the Auth to pull the correct data from directus.</p>
        </div>
    );
}