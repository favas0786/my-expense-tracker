// src/components/ExpenseChart.tsx

import { useMemo } from 'react';
import type { Transaction } from '../types';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// --- Define the props it will receive ---
interface ExpenseChartProps {
  transactions: Transaction[];
}

// --- Define the shape of our chart data ---
// Recharts PieChart needs an array of objects like:
// { name: "Food", value: 400 }
interface ChartData {
  name: string;
  value: number;
  // Index signature to satisfy Recharts' ChartDataInput which allows additional keys
  [key: string]: any;
}

// --- Define some colors for the pie slices ---
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'
];

export function ExpenseChart({ transactions }: ExpenseChartProps) {
  
  // We use `useMemo` to process the data.
  // This is a performance optimization: this code will only re-run
  // if the 'transactions' prop changes.
  const chartData: ChartData[] = useMemo(() => {
    // 1. Create a map to hold the totals for each category
    //    e.g. { food: 50, transport: 20 }
    const categoryTotals = transactions
      // First, only get the expenses (amount < 0)
      .filter((tx) => tx.amount < 0)
      // Now, group and sum them
      .reduce((acc, tx) => {
        const category = tx.category;
        // We use Math.abs() to make the expense a positive number
        // since charts can't have negative values.
        const amount = Math.abs(tx.amount);
        
        // Add the amount to the accumulator for that category
        acc[category] = (acc[category] || 0) + amount;
        
        return acc;
      }, {} as { [key: string]: number }); // Type assertion for the accumulator

    // 2. Convert the map into an array for Recharts
    //    From: { food: 50, transport: 20 }
    //    To: [ { name: "Food", value: 50 }, { name: "Transport", value: 20 } ]
    return Object.entries(categoryTotals).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize name
      value: value,
    }));
  }, [transactions]); // The dependency: re-run when 'transactions' changes

  // If there's no data, show a message
  if (chartData.length === 0) {
    return (
      <div className="expense-chart-container empty">
        <h3>Expense Breakdown</h3>
        <p>No expense data to display. Add some expenses!</p>
      </div>
    );
  }

  return (
    <div className="expense-chart-container">
      <h3>Expense Breakdown</h3>
      {/* ResponsiveContainer makes the chart fit its parent div */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"    // The object key to use for the size
            nameKey="name"      // The object key to use for the label
            cx="50%"            // Center X
            cy="50%"            // Center Y
            outerRadius={80}   // Size of the pie
            fill="#8884d8"
            labelLine={false}
            label={({ percent = 0 }) => `${(percent * 100).toFixed(0)}%`}
          >
            {/* Map over our data to create a <Cell> for each slice
                This is how we give each slice a different color */}
            {chartData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          {/* Tooltip shows details on hover */}
          <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
          {/* Legend lists the categories below */}
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}