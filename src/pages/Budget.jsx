import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import ProgressBar from "../components/ProgressBar";
import Icon from "../components/Icon";
import { store } from "../data/store";

const baseCategories = [
  ["fixedCosts", "Fixed costs", "home"],
  ["dayToDaySpending", "Day-to-day spending", "shopping"],
  ["debtRepayments", "Debt / repayments", "credit"],
  ["unexpectedExpenses", "Unexpected expenses", "alert"],
  ["obligations", "Family / obligations", "users"],
];

function number(value) { return Number(String(value ?? "").replace(/,/g, "")) || 0; }

export default function Budget() {
  const [snapshot, setSnapshot] = useState(() => store.getSnapshot());
  const [expenses, setExpenses] = useState(() => store.getExpenses());

  useEffect(() => {
    const refresh = () => { setSnapshot(store.getSnapshot()); setExpenses(store.getExpenses()); };
    window.addEventListener("shekel-storage", refresh);
    window.addEventListener("storage", refresh);
    return () => { window.removeEventListener("shekel-storage", refresh); window.removeEventListener("storage", refresh); };
  }, []);

  const income = number(snapshot?.income);
  const snapshotExpenses = baseCategories.reduce((sum, [key]) => sum + number(snapshot?.[key]), 0);
  const loggedExpenses = expenses.reduce((sum, e) => sum + number(e.amount), 0);
  const spent = snapshotExpenses + loggedExpenses;
  const remaining = income - spent;
  const used = income > 0 ? Math.round((spent / income) * 100) : 0;

  const categories = useMemo(() => {
    const result = baseCategories.map(([key, name, icon]) => ({ key, name, icon, value: number(snapshot?.[key]) }));
    const loggedMap = new Map();
    expenses.forEach((expense) => {
      const label = expense.label || "Other";
      loggedMap.set(label, (loggedMap.get(label) || 0) + number(expense.amount));
    });
    const expenseIcons = { Food: "food", Transport: "car", Bills: "bolt", Lifestyle: "heart", Family: "users", Other: "receipt" };
    loggedMap.forEach((value, label) => result.push({ key: `logged-${label}`, name: `Added ${label} expenses`, icon: expenseIcons[label] || "receipt", value }));
    return result;
  }, [snapshot, expenses]);

  function deleteExpense(id) {
    if (!window.confirm("Delete this expense?")) return;
    store.saveExpenses(store.getExpenses().filter((e) => e.id !== id));
  }

  return <div className="page">
    <SectionTitle eyebrow="BUDGET" title="Your budget" action={<Link to="/expense" className="btn primary small"><Icon name="plus" size={16}/> Add expense</Link>}/>
    {!snapshot ? <section className="card empty-state"><h2>No financial information yet</h2><p>Add your monthly financial information first. Your budget will be calculated from your own numbers.</p><Link className="btn primary" to="/snapshot">Add financial information</Link></section> : <>
      <section className="budget-hero card">
        <div><span className="eyebrow">MONTHLY INCOME</span><strong>₦{income.toLocaleString()}</strong><p>Tracked outflow: ₦{spent.toLocaleString()} ({used}%)</p></div>
        <div className="budget-remaining"><span>REMAINING</span><strong>₦{Math.max(remaining, 0).toLocaleString()}</strong>{remaining < 0 && <small className="danger-text">₦{Math.abs(remaining).toLocaleString()} over your income</small>}</div>
        <ProgressBar value={Math.min(Math.max(spent, 0), income || 1)} max={income || 1}/>
      </section>
      <section className="card"><div className="card-head"><h2>Category breakdown</h2><span className="muted">Based on your information</span></div>
        {categories.map(c => <div className="category-row" key={c.key}><div className="category-icon"><Icon name={c.icon}/></div><div className="category-main"><div><span>{c.name}</span><b>₦{c.value.toLocaleString()}</b></div><ProgressBar value={Math.min(c.value, income || 1)} max={income || 1}/></div></div>)}
      </section>
      <section className="card expense-history"><div className="card-head"><h2>Recent expenses</h2><span className="muted">{expenses.length} added by you</span></div>
        {expenses.length === 0 ? <p className="muted">No separate expenses added yet. Your budget currently uses only the financial information you entered.</p> : expenses.map(e => <div className="expense-item" key={e.id}><div className="category-icon"><Icon name="receipt"/></div><div className="expense-info"><b>{e.label}</b><small>{e.note || "No note"} • {new Date(e.createdAt).toLocaleDateString()}</small></div><strong>₦{number(e.amount).toLocaleString()}</strong><Link className="icon-btn" to={`/expense?edit=${encodeURIComponent(e.id)}`} title="Edit expense">Edit</Link><button className="delete-btn" onClick={() => deleteExpense(e.id)} title="Delete expense" aria-label="Delete expense"><Icon name="trash" size={17}/></button></div>)}
      </section>
    </>}
  </div>;
}
