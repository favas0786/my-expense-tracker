import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type Transaction, 
  categories,
  transactionFormSchema,
  type TransactionFormData,
} from "../types";
import { useEffect } from "react"; 


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
  
  const isEditMode = !!transactionToEdit;

  const {
    register,
    handleSubmit,
    reset, 
    formState: { errors, isSubmitting }, 
  } = useForm<TransactionFormData>({
    
    resolver: zodResolver(transactionFormSchema) as Resolver<TransactionFormData>,
  });

  useEffect(() => {
    if (transactionToEdit) {
     
      reset(transactionToEdit);
    } else {
      
      reset({
        description: "",
        amount: 0,
        category: "other",
      });
    }
  }, [transactionToEdit, reset]);


  const onSubmit = (data: TransactionFormData) => {
    if (isEditMode) {
      onUpdateTransaction(data);
    } else {
      onAddTransaction(data);
    }
   
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit(onSubmit)}>
     
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