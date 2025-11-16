import { z } from "zod";

// --- Categories Constant ---
export const categories = [
  "food",
  "groceries",
  "transport",
  "housing",
  "entertainment",
  "other",
] as const;

// --- Transaction Types ---
export type TransactionCategory = (typeof categories)[number];

export interface Transaction {
  id: string; // The Firestore document ID
  description: string;
  amount: number;
  date: string;
  category: TransactionCategory;
}

export type NewTransaction = Omit<Transaction, "id">;

// --- Zod Schema & Form Type ---
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

// --- 1. NEW: AppState for real-time data ---
export interface AppState {
  transactions: Transaction[];
  editingTransaction: Transaction | null;
  isLoading: boolean; // For loading state
}

// --- 2. NEW: Reducer Actions for real-time state ---
// This action will set the state from our Firebase listener
type SetTransactionsAction = {
  type: "SET_TRANSACTIONS";
  payload: Transaction[];
};

type SetLoadingAction = {
  type: "SET_LOADING";
  payload: boolean;
};

// --- NEW: Budget Types ---

// This defines the shape of our budget object
// e.g., { food: 300, housing: 1000, transport: 100 }
export type BudgetMap = {
  [category in TransactionCategory]?: number;
};
// --- NEW: Date Range Type ---
export type DateRange = {
  startDate: Date;
  endDate: Date;
};
// This is the shape of the document we'll save in Firestore
export interface BudgetDocument {
  id: string; // The Firestore document ID
  budgets: BudgetMap;
  month: string; // e.g., "2025-11" (YYYY-MM format)
}

// These actions are for local UI state (editing)
type StartEditAction = {
  type: "START_EDIT";
  payload: string; // id
};

type CancelEditAction = {
  type: "CANCEL_EDIT";
};

// We no longer need ADD, DELETE, UPDATE here.
// Firestore's listener will handle it!
export type TransactionAction =
  | SetTransactionsAction
  | SetLoadingAction
  | StartEditAction
  | CancelEditAction;