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


interface ExpenseChartProps {
  transactions: Transaction[];
}


interface ChartData {
  name: string;
  value: number;
  
  [key: string]: any;
}


const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'
];

export function ExpenseChart({ transactions }: ExpenseChartProps) {
  

  const chartData: ChartData[] = useMemo(() => {
   
    const categoryTotals = transactions
      
      .filter((tx) => tx.amount < 0)
      
      .reduce((acc, tx) => {
        const category = tx.category;
        
        const amount = Math.abs(tx.amount);
        
        
        acc[category] = (acc[category] || 0) + amount;
        
        return acc;
      }, {} as { [key: string]: number }); 

   
    return Object.entries(categoryTotals).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1), 
      value: value,
    }));
  }, [transactions]); 

 
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
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"    
            nameKey="name"      
            cx="50%"            
            cy="50%"            
            outerRadius={80}   
            fill="#8884d8"
            labelLine={false}
            label={({ percent = 0 }) => `${(percent * 100).toFixed(0)}%`}
          >
          
            {chartData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          
          <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
  
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}