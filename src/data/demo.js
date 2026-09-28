export const categories = [
  { id: "income", label: "Low or irregular income", icon: "wallet" },
  { id: "fixedCosts", label: "High fixed costs (rent, transport)", icon: "home" },
  { id: "dayToDaySpending", label: "High day-to-day spending", icon: "shopping" },
  { id: "unexpectedExpenses", label: "Unexpected emergency expenses", icon: "alert" },
  { id: "debtRepayments", label: "Debt repayment pressures", icon: "credit" },
  { id: "obligations", label: "Family/community obligations", icon: "users" }
];

export const demoDashboard = {
  balance: 350000,
  income: 350000,
  expenses: 310000,
  budget: 350000,
  spent: 248000,
  categories: [
    { name: "Rent", value: 150000, limit: 150000, icon: "home" },
    { name: "Food", value: 45000, limit: 60000, icon: "food" },
    { name: "Transport", value: 22000, limit: 30000, icon: "car" },
    { name: "Bills", value: 18000, limit: 25000, icon: "bolt" },
    { name: "Lifestyle", value: 8000, limit: 15000, icon: "heart" }
  ],
  bills: [
    { name: "Rent Contribution", amount: 150000, due: "Oct 1" },
    { name: "Electricity Token", amount: 15000, due: "Oct 5" }
  ]
};

export const demoGoals = [
  { name: "Emergency Fund", target: 300000, saved: 85000, due: "Dec 2026" },
  { name: "New Laptop", target: 250000, saved: 60000, due: "Aug 2026" },
  { name: "Rent Deposit", target: 200000, saved: 40000, due: "Jan 2027" }
];

export const demoDebts = [
  { name: "Business Loan", balance: 800000, monthly: 55000, apr: "18% APR", progress: 40 },
  { name: "Personal Loan", balance: 250000, monthly: 20000, apr: "12% APR", progress: 60 },
  { name: "Buy Now Pay Later", balance: 150000, monthly: 10000, apr: "15% APR", progress: 30 }
];
