import { useForm, useFieldArray } from "react-hook-form";
import { categories, type BudgetMap } from "../types";
import { Save } from "lucide-react";


type BudgetFormData = {
  budgets: {
    category: (typeof categories)[number];
    amount: number;
  }[];
};

interface BudgetManagerProps {
  currentBudgets: BudgetMap;
  onSaveBudgets: (budgets: BudgetMap) => void;
  isLoading: boolean;
}

export function BudgetManager({
  currentBudgets,
  onSaveBudgets,
  isLoading,
}: BudgetManagerProps) {
  const { register, handleSubmit, control } = useForm<BudgetFormData>({
    defaultValues: {
      budgets: categories.map((cat) => ({
        category: cat,
        amount: currentBudgets[cat] || 0, 
      })),
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "budgets",
  });

 
  const onSubmit = (data: BudgetFormData) => {
    
    const newBudgetMap: BudgetMap = data.budgets.reduce((acc, budget) => {
      acc[budget.category] = budget.amount > 0 ? budget.amount : 0;
      return acc;
    }, {} as BudgetMap);
    
    onSaveBudgets(newBudgetMap);
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit(onSubmit)}>
      <h3>Set Monthly Budgets</h3>
      
      {fields.map((field, index) => (
        <div className="form-control" key={field.id}>
          <label htmlFor={`budgets.${index}.amount`} className="budget-label">
            
            {field.category.charAt(0).toUpperCase() + field.category.slice(1)}
          </label>
          <input
            type="text"
            inputMode="decimal"
            id={`budgets.${index}.amount`}
            placeholder="0"
            {...register(`budgets.${index}.amount`, {
              valueAsNumber: true,
            })}
          />
        </div>
      ))}
      
      <button type="submit" className="btn-save-budget" disabled={isLoading}>
        <Save size={18} />
        {isLoading ? "Saving..." : "Save Budgets"}
      </button>
    </form>
  );
}