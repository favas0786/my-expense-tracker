import { z } from "zod";


export const categories = [
  "food",
  "groceries",
  "transport",
  "housing",
  "entertainment",
  "other",
] as const;


export type TransactionCategory = (typeof categories)[number];

export interface Transaction {
  id: string; // The Firestore document ID
  description: string;
  amount: number;
  date: string;
  category: TransactionCategory;
}

export type NewTransaction = Omit<Transaction, "id">;

export const transactionFormSchema = z.object({
  description: z.string().min(3, {
    message: "Description must be at least 3 characters.",
  }),
  amount: z.preprocess(
    (val) => {
      if (typeof val === "string") return parseFloat(val) || 0;
      if (typeof val === "number") return val;
      return 0;
    },
    z.number().refine((val) => val !== 0, {
      message: "Amount cannot be zero.",
    })
  ),
  category: z.enum(categories),
});

export type TransactionFormData = z.infer<typeof transactionFormSchema>;

export interface AppState {
  transactions: Transaction[];
  editingTransaction: Transaction | null;
  isLoading: boolean; // For loading state
}

type SetTransactionsAction = {
  type: "SET_TRANSACTIONS";
  payload: Transaction[];
};

type SetLoadingAction = {
  type: "SET_LOADING";
  payload: boolean;
};


export type BudgetMap = {
  [category in TransactionCategory]?: number;
};

export type DateRange = {
  startDate: Date;
  endDate: Date;
};

export interface BudgetDocument {
  id: string; 
  budgets: BudgetMap;
  month: string; 
}


type StartEditAction = {
  type: "START_EDIT";
  payload: string; // id
};

type CancelEditAction = {
  type: "CANCEL_EDIT";
};


export type TransactionAction =
  | SetTransactionsAction
  | SetLoadingAction
  | StartEditAction
  | CancelEditAction;