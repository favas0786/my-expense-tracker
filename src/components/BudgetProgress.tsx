import { useMemo } from "react";
import { type Transaction, type BudgetMap, categories, type TransactionCategory } from "../types";

interface BudgetProgressProps {
  transactions: Transaction[];
  budgets: BudgetMap;
}

const formatCurrency = (amount: number) => {
  return `$${amount.toFixed(0)}`;
};

export function BudgetProgress({
  transactions,
  budgets,
}: BudgetProgressProps) {


  const spendingMap = useMemo(() => {
    return transactions
      .filter((tx) => tx.amount < 0) 
      .reduce((acc, tx) => {
        const amount = Math.abs(tx.amount);
        acc[tx.category] = (acc[tx.category] || 0) + amount;
        return acc;
      }, {} as { [key in TransactionCategory]?: number });
  }, [transactions]);

  const budgetedCategories = categories.filter(
    (cat) => budgets[cat] && budgets[cat]! > 0
  );

  if (budgetedCategories.length === 0) {
    return (
      <div className="budget-progress-container empty">
        <h3>Budget Progress</h3>
        <p>You haven't set any budgets for this month. Set one below!</p>
      </div>
    );
  }

  return (
    <div className="budget-progress-container">
      <h3>Budget Progress</h3>
      <div className="budget-list">
        {budgetedCategories.map((category) => {
          const budgetAmount = budgets[category] || 0;
          const spentAmount = spendingMap[category] || 0;
          
         
          const percentage = Math.min((spentAmount / budgetAmount) * 100, 100);
    
          let progressBarClass = "progress-bar";
          if (percentage > 90) progressBarClass += " danger";
          else if (percentage > 70) progressBarClass += " warning";

          return (
            <div className="budget-item" key={category}>
              <div className="budget-item-header">
                <span className="budget-item-category">
               
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
                <span className="budget-item-amount">
                  {formatCurrency(spentAmount)} / {formatCurrency(budgetAmount)}
                </span>
              </div>
              <div className="progress-track">
                <div
                  className={progressBarClass}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}