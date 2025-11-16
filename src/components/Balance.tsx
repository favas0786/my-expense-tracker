import type { Transaction } from "../types";

interface BalanceProps {
  transactions: Transaction[];
}

function Balance({ transactions }: BalanceProps) {
  
  const total = transactions.reduce((acc, tx) => acc + tx.amount, 0);

  const formattedTotal = total.toFixed(2);

  const balanceClass = total < 0 ? 'expense' : 'income';

  return (
    <div className="balance">
      <h2>Your Balance</h2>
      
      <h3 key={formattedTotal} className={balanceClass}>
        ${formattedTotal}
      </h3>

     
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