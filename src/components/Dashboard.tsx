import "../App.css";
import { useReducer, useEffect, useState } from "react";
import type {
  Transaction,
  TransactionAction,
  AppState,
  TransactionFormData,
  BudgetMap,
  BudgetDocument,
} from "../types";
import { BrainCircuit, LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

// Import Firebase features
import { db, auth } from "../firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  limit,
  where,
  orderBy,
} from "firebase/firestore";
import { DateFilter } from "./DateFilter";
import type { DateRange } from "../types";
import { getThisMonthRange } from "../utils/dateHelpers";
import { BudgetManager } from "./BudgetManager";
import { BudgetProgress } from "./BudgetProgress";
import { useAuth } from "../hooks/useAuth";

// Import all components
import TransactionList from "./TransactionList";
import TransactionForm from "./TransactionForm";
import Balance from "./Balance";
import { ExpenseChart } from "./ExpenseChart";
import { AnalysisModal } from "./AnalysisModal";
import { analyzeSpending } from "../lib/gemini";

// Reducer for transaction state
const transactionReducer = (
  state: AppState,
  action: TransactionAction
): AppState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.payload, isLoading: false };

    case "START_EDIT":
      const transactionToEdit = state.transactions.find(
        (tx) => tx.id === action.payload
      );
      return {
        ...state,
        editingTransaction: transactionToEdit || null,
      };

    case "CANCEL_EDIT":
      return {
        ...state,
        editingTransaction: null,
      };

    default:
      return state;
  }
};

// Initial state for the reducer
const initialState: AppState = {
  transactions: [],
  editingTransaction: null,
  isLoading: true,
};

// Main Dashboard Component
export function Dashboard() {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // State for Budgets
  const [budgets, setBudgets] = useState<BudgetMap>({});
  const [budgetDocId, setBudgetDocId] = useState<string | null>(null);
  const [isBudgetLoading, setIsBudgetLoading] = useState(false);

  // AI Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  // Date filter state
  const [dateRange, setDateRange] = useState<DateRange>(getThisMonthRange());

  // Real-time Firebase Data Listener for transactions
  useEffect(() => {
    if (!user) return;

    dispatch({ type: "SET_LOADING", payload: true });

    // This query now filters by date and orders them
    const transactionsCollectionRef = query(
      collection(db, "users", user.uid, "transactions"),
      // --- NEW: Filter by date range ---
      where("date", ">=", dateRange.startDate.toISOString()),
      where("date", "<=", dateRange.endDate.toISOString()),
      orderBy("date", "desc") // <-- Order by date (newest first)
    );

    const unsubscribe = onSnapshot(
      transactionsCollectionRef,
      (snapshot) => {
        const transactionsFromFirebase: Transaction[] = snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          } as Transaction)
        );
        dispatch({
          type: "SET_TRANSACTIONS",
          payload: transactionsFromFirebase,
        });
      },
      (error) => {
        console.error("Error fetching transactions:", error);
        // This is a common error! You might need to create an index.
        // The error message in your console will give you a link to create it.
        dispatch({ type: "SET_LOADING", payload: false });
      }
    );

    return () => unsubscribe();
  }, [user, dateRange]);

  // Effect to load budgets for the current month
  useEffect(() => {
    if (!user) return;

    const currentMonth = new Date().toISOString().slice(0, 7);
    const budgetsCollectionRef = collection(db, "users", user.uid, "budgets");
    
    const budgetQuery = query(
      budgetsCollectionRef,
      where("month", "==", currentMonth),
      limit(1)
    );

    const unsubscribe = onSnapshot(budgetQuery, (snapshot) => {
      if (snapshot.empty) {
        setBudgets({});
        setBudgetDocId(null);
      } else {
        const budgetDoc = snapshot.docs[0].data() as BudgetDocument;
        setBudgets(budgetDoc.budgets);
        setBudgetDocId(snapshot.docs[0].id);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Helper function to get the collection ref
  const getCollectionRef = () => {
    if (!user) throw new Error("User not logged in");
    return collection(db, "users", user.uid, "transactions");
  };

  const handleAddTransaction = async (data: TransactionFormData) => {
    try {
      const newTx = {
        ...data,
        date: new Date().toISOString(),
      };
      await addDoc(getCollectionRef(), newTx);
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const handleUpdateTransaction = async (data: TransactionFormData) => {
    if (!state.editingTransaction || !user) return;
    try {
      const updatedTxData = { ...data };
      const transactionDocRef = doc(
        db,
        "users",
        user.uid,
        "transactions",
        state.editingTransaction.id
      );
      await updateDoc(transactionDocRef, updatedTxData);
      dispatch({ type: "CANCEL_EDIT" });
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!user) return;
    try {
      const transactionDocRef = doc(
        db,
        "users",
        user.uid,
        "transactions",
        id
      );
      await deleteDoc(transactionDocRef);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleStartEdit = (id: string) => {
    dispatch({ type: "START_EDIT", payload: id });
  };

  const handleCancelEdit = () => {
    dispatch({ type: "CANCEL_EDIT" });
  };

  const handleAnalyzeSpending = async () => {
    setIsModalOpen(true);
    setIsLoadingAnalysis(true);
    setAnalysis(null);
    setAnalysisError(null);
    try {
      const result = await analyzeSpending(state.transactions);
      const formattedResult = result
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\* (.*?)(?=\n\* |\n\n|$)/g, "<li>$1</li>");
      setAnalysis(formattedResult);
    } catch (err) {
      setAnalysisError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  // Handler to save budgets
  const handleSaveBudgets = async (newBudgetMap: BudgetMap) => {
    if (!user) return;
    setIsBudgetLoading(true);

    const currentMonth = new Date().toISOString().slice(0, 7);
    const budgetsCollectionRef = collection(db, "users", user.uid, "budgets");

    try {
      if (budgetDocId) {
        const budgetDocRef = doc(budgetsCollectionRef, budgetDocId);
        await updateDoc(budgetDocRef, { budgets: newBudgetMap });
      } else {
        await addDoc(budgetsCollectionRef, {
          budgets: newBudgetMap,
          month: currentMonth,
          userId: user.uid,
        });
      }
    } catch (error) {
      console.error("Error saving budgets:", error);
    } finally {
      setIsBudgetLoading(false);
    }
  };

  // The Rendered JSX
  return (
    <div className="app-container">
      <header>
        <h1>Expense Tracker</h1>
        <div className="header-actions">
          <ThemeToggle />
          <button 
            className="logout-btn" 
            onClick={handleLogout} 
            title="Logout"
            aria-label="Logout"
          >
            <LogOut size={20} strokeWidth={2.5} color="currentColor" />
          </button>
        </div>
      </header>

      {state.isLoading ? (
        <div className="global-loader">
          <div className="spinner"></div>
        </div>
      ) : (
        <main>
          <div className="dashboard-col-1">
            <DateFilter onDateRangeChange={setDateRange} currentRange={dateRange} />
            <Balance transactions={state.transactions} />
            <button
              className="btn-analyze"
              onClick={handleAnalyzeSpending}
              disabled={isLoadingAnalysis}
            >
              <BrainCircuit size={18} />
              {isLoadingAnalysis ? "Analyzing..." : "Analyze My Spending"}
            </button>
            <TransactionForm
              onAddTransaction={handleAddTransaction}
              onUpdateTransaction={handleUpdateTransaction}
              onCancelEdit={handleCancelEdit}
              transactionToEdit={state.editingTransaction}
            />
          </div>

          <div className="dashboard-col-2">
            <ExpenseChart transactions={state.transactions} />
            <BudgetProgress
              transactions={state.transactions}
              budgets={budgets}
            />
            <BudgetManager
              currentBudgets={budgets}
              onSaveBudgets={handleSaveBudgets}
              isLoading={isBudgetLoading}
            />
          </div>

          <div className="dashboard-col-3">
            <TransactionList
              transactions={state.transactions}
              onDeleteTransaction={handleDeleteTransaction}
              onStartEdit={handleStartEdit}
            />
          </div>
        </main>
      )}

      <AnalysisModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isLoading={isLoadingAnalysis}
        analysis={analysis}
        error={analysisError}
      />
    </div>
  );
}
