// src/components/Balance.tsx

// src/components/Balance.tsx
import type { Transaction } from "../types";


// Define the props. This component just needs the
// array of transactions to do its calculation.
interface BalanceProps {
  transactions: Transaction[];
}

function Balance({ transactions }: BalanceProps) {
  // --- Calculation Logic ---
  // We use .reduce() to "boil down" the array to a single number.
  // 'acc' is the "accumulator" (the total, starting at 0).
  // 'tx' is the current transaction in the loop.
  // For each transaction, we add its 'amount' to the accumulator.
  const total = transactions.reduce((acc, tx) => acc + tx.amount, 0);

  // Format the total to 2 decimal places for currency
  const formattedTotal = total.toFixed(2);
  
  // Determine the class for styling (green or red)
  const balanceClass = total < 0 ? 'expense' : 'income';

  return (
    <div className="balance">
      <h2>Your Balance</h2>
      {/* We use the 'balanceClass' to conditionally apply styling.
        We also use the 'key' prop on <h3>. This is a small React
        trick. When the 'formattedTotal' changes, React sees the 
        key changing and will re-render the element, which can
        be useful for triggering animations if you add them later.
      */}
      <h3 key={formattedTotal} className={balanceClass}>
        ${formattedTotal}
      </h3>

      {/* Basic Styling */}
      <style>{`
        .balance {
          text-align: center;
          margin-bottom: 20px;
        }
        .balance h2 {
          margin: 0;
          color: #555;
          font-weight: 500;
        }
        .balance h3 {
          margin: 5px 0 0 0;
          font-size: 2.5rem;
          letter-spacing: 1px;
        }
        .balance h3.income {
          color: #2ecc71;
        }
        .balance h3.expense {
          color: #e74c3c;
        }
      `}</style>
    </div>
  );
}

export default Balance;