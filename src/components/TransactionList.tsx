import type { Transaction } from "../types";
import { Trash2, Pencil } from "lucide-react"; // 1. Import Pencil icon

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

// 2. NEW: Add onStartEdit prop
interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onStartEdit: (id: string) => void;
}

function TransactionList({
  transactions,
  onDeleteTransaction,
  onStartEdit, // 3. Get the new prop
}: TransactionListProps) {
  return (
    <div className="transaction-list">
      <h3>History</h3>
      
      {transactions.length === 0 && (
        <p>No transactions yet. Add one above!</p>
      )}

      <ul>
        {transactions.map((tx) => (
          <li
            key={tx.id}
            className={tx.amount < 0 ? "expense" : "income"}
          >
            <div className="transaction-info">
              <span className="description">{tx.description}</span>
              <div className="meta">
                <span className="category">{tx.category}</span>
                <span className="date">{formatDate(tx.date)}</span>
              </div>
            </div>
            
            <div className="transaction-actions">
              <span className="amount">
                {tx.amount < 0 ? "-" : "+"}${Math.abs(tx.amount).toFixed(2)}
              </span>
              
              {/* 4. NEW: Edit Button */}
              <button
                type="button"
                className="btn-edit"
                aria-label="Edit transaction"
                onClick={() => onStartEdit(tx.id)}
              >
                <Pencil size={16} strokeWidth={2.5} />
              </button>
              
              <button
                type="button"
                className="delete-btn"
                aria-label="Delete transaction"
                onClick={() => onDeleteTransaction(tx.id)}
              >
                <Trash2 size={16} strokeWidth={2.5} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TransactionList;