import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type Transaction, // <-- NEW
  categories,
  transactionFormSchema,
  type TransactionFormData,
} from "../types";
import { useEffect } from "react"; // <-- NEW

// --- 1. NEW: Update Props ---
interface TransactionFormProps {
  onAddTransaction: (data: TransactionFormData) => void;
  onUpdateTransaction: (data: TransactionFormData) => void;
  onCancelEdit: () => void;
  transactionToEdit: Transaction | null;
}

function TransactionForm({
  onAddTransaction,
  onUpdateTransaction,
  onCancelEdit,
  transactionToEdit,
}: TransactionFormProps) {
  // --- 2. NEW: Check if we are in edit mode ---
  const isEditMode = !!transactionToEdit;

  const {
    register,
    handleSubmit,
    reset, // We need reset to pre-fill the form
    formState: { errors, isSubmitting }, // Get submitting state
  } = useForm<TransactionFormData>({
    // Cast resolver to the form's field type to satisfy TypeScript
    resolver: zodResolver(transactionFormSchema) as Resolver<TransactionFormData>,
  });

  // --- 3. NEW: Pre-fill form when edit mode starts/stops ---
  useEffect(() => {
    if (transactionToEdit) {
      // If we are editing, fill form with that data
      reset(transactionToEdit);
    } else {
      // If we are adding, reset to default
      reset({
        description: "",
        amount: 0,
        category: "other",
      });
    }
  }, [transactionToEdit, reset]);

  // --- 4. NEW: Unified onSubmit handler ---
  const onSubmit = (data: TransactionFormData) => {
    if (isEditMode) {
      onUpdateTransaction(data);
    } else {
      onAddTransaction(data);
    }
    // `reset` is handled by the useEffect now
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit(onSubmit)}>
      {/* 5. NEW: Dynamic Title */}
      <h3>{isEditMode ? "Edit Transaction" : "Add New Transaction"}</h3>
      
      <div className="form-control">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          placeholder="e.g. Coffee"
          {...register("description")}
          className={errors.description ? "input-error" : ""}
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="form-error">{errors.description.message}</p>
        )}
      </div>
      
      <div className="form-control">
        <label htmlFor="amount">Amount</label>
        <input
          type="text"
          inputMode="decimal"
          id="amount"
          placeholder="e.g. -4.50"
          {...register("amount")}
          className={errors.amount ? "input-error" : ""}
          disabled={isSubmitting}
        />
        {errors.amount && (
          <p className="form-error">{errors.amount.message}</p>
        )}
      </div>
      
      <div className="form-control">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          {...register("category")}
          className={errors.category ? "input-error" : ""}
          disabled={isSubmitting}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="form-error">{errors.category.message}</p>
        )}
      </div>
      
      {/* 6. NEW: Dynamic Buttons */}
      <div className="form-buttons">
        <button type="submit" disabled={isSubmitting}>
          {isEditMode ? "Update Transaction" : "Add Transaction"}
        </button>
        {isEditMode && (
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancelEdit}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TransactionForm;