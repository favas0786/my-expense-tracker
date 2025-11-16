🚀 Full-Stack AI-Powered Expense Tracker

This is a feature-rich, full-stack expense tracking application built with React, TypeScript, and Firebase. It's a professional-grade dashboard that goes beyond simple CRUD, incorporating secure user authentication, a real-time cloud database, data visualization, and AI-powered spending analysis.

my-expense-tracker-psi.vercel.app




✨ Core Features

This application is built to demonstrate a wide range of modern web development skills.

🔒 Secure User Authentication: Full email/password sign-up and login system using Firebase Authentication.

☁️ Real-time Cloud Database: All user data (transactions, budgets) is securely stored in Firestore, updating in real-time across all logged-in devices.

💸 Full CRUD Functionality: Users can Create, Read, Update, and Delete all of their transactions.

🎯 Monthly Budgeting: Users can set monthly budgets for each spending category (e.g., "Food: $300") and track their progress with visual bars.

📊 Interactive Dashboard:

A 3-column professional layout that is fully responsive.

An interactive pie chart (using Recharts) to visualize spending breakdowns.

A real-time balance card.

🧠 AI Spending Analysis: A "wow" feature using the Google Gemini API. Users can click a button to receive a custom, AI-generated analysis of their spending habits and get actionable advice.

📅 Date Range Filtering: The entire dashboard (Balance, Chart, History) can be filtered by date range ("This Month", "Last Month", "All Time").

🛡️ Professional Form Validation: Advanced, real-time, inline validation using react-hook-form and zod for a seamless user experience.

🌗 Light/Dark Mode: A UI theme toggle that respects user preference and saves it to localStorage.

⚛️ Advanced State Management: Uses React's useReducer hook for clean, predictable, and scalable state logic.

🛠️ Tech Stack

Frontend

React (with Hooks)

TypeScript

Vite (Build Tool)

React Hook Form (Form Management)

Zod (Schema Validation)

Recharts (Data Visualization)

Lucide-react (Icons)

Custom CSS (with CSS Variables for theming)

Backend & Services

Firebase Authentication (User Management)

Firestore (Real-time NoSQL Database)

Google Gemini API (AI Analysis)

Vercel (Deployment)

🚀 Getting Started

To run this project locally, follow these steps:

1. Prerequisites

Node.js (v18 or later)

npm or yarn

A Firebase project (with Auth and Firestore enabled)

A Google Gemini API Key

2. Clone the Repository

git clone https://github.com/favas0786/my-expense-tracker.git
cd my-expense-tracker


3. Install Dependencies

npm install


4. Set Up Environment Variables

This is the most important step. Create a new file in the root of your project named .env.local.

Your app will not run without these keys.

# --- Your Firebase Project Config ---
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# --- Your Google AI API Key ---
VITE_GEMINI_API_KEY=AIza...


5. Configure Firebase Security Rules

To secure your database, you must set up Firestore rules.

Go to your Firebase Console -> Firestore Database -> Rules.

Replace the default rules with these:

rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
  
    // Allow users to read/write only their *own* data
    match /users/{userId}/transactions/{transactionId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Allow users to read/write their *own* budget docs
    match /users/{userId}/budgets/{budgetId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}


Click "Publish".

6. Create Firestore Index

The date-range filtering query requires a custom index in Firestore.

Run the app locally (npm run dev).

Open the Developer Console (F12).

You will see a Firebase error with a long URL in it. Click that link.

It will take you to the Firebase console to auto-create the required index. Click "Create Index" and wait for it to build (this can take a few minutes).

7. Run the Application

Once your index is built, you're ready to go!

npm run dev


The app will be running at http://localhost:5173.
