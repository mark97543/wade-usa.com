//client/src/pages/blog/Tables/Table_Budget.jsx

import React, {useState, useEffect, use} from 'react'

function Table_Budget({budget}) {

    const [tripTotal, setTripTotal] = useState();
    const [remainingCost, setRemainingCost] = useState();


    if (!budget || budget.length === 0) {
        return 
    }

    useEffect(() => {
        //Return if budget is empty
        if (!budget || budget.length === 0) {
            return 
        }

        const totalBudget = budget.reduce((runningTotal, currentItem) =>{
            // Convert the current item's amount to a number.
            const itemValueAsNumber = parseFloat(currentItem.cost)
            // In each step, we return the running total (runningTotal) plus the current number (itemValue.).
            return runningTotal + itemValueAsNumber;
        },0)// The '0' at the end is the starting value for our sum.

        setTripTotal(formatMoney(totalBudget));

        const remainingCost = budget.reduce((runningTotal, currentItem) => {
            if(currentItem.paid === true){
                return runningTotal; // Skip items that are paid
            }else if(currentItem.paid === false){
                // If the item is not paid, add its cost to the running total
                const itemValueAsNumber = parseFloat(currentItem.cost);
                return runningTotal + itemValueAsNumber;
            }
        }, 0);

        setRemainingCost(formatMoney(remainingCost));

    }, [budget]);

    const formatMoney = (amount)=>{
        //Convert the input valuse to a floating point number
        const amountAsNumber = parseFloat(amount);
        //Check if the amount is a valid number
        if (isNaN(amountAsNumber)) {
            return "Invalid amount";
        }

        //use the toFixed(2) method to format the number to two decimal places
        //this will return to a string
        const formattedNumber = amountAsNumber.toFixed(2);

        //prepend the dollar sign
        return `$${formattedNumber}`;
    }

  return (
    <div className='travel-blog-budget-table-container'>
        <h3>Travel Budget</h3>
        <table className="travel-blog-budget-table">
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Note</th>
                    <th>Paid</th>
                    <th>Cost</th>
                </tr>
            </thead>
            <tbody>
                {budget.map((item, index) => (
                    <tr key={index}>
                        <td>{item.item}</td>
                        <td dangerouslySetInnerHTML={{ __html: item.note }} />
                        <td>{item.paid ? "Yes" : "No"}</td>
                        <td>{formatMoney(item.cost)}</td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan="3"><strong>Total Trip Budget:</strong></td>
                    <td colSpan="1">{tripTotal}</td>
                </tr>
                <tr>
                    <td colSpan="3"><strong>Remaining Cost:</strong></td>
                    <td colSpan="1">{remainingCost}</td>
                </tr>
            </tfoot>
        </table>
    </div>
  )
}



export default Table_Budget
