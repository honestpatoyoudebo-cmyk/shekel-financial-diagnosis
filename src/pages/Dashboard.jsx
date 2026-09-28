import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import StatCard from "../components/StatCard";
import ProgressBar from "../components/ProgressBar";
import Icon from "../components/Icon";
import { getDiagnosis, getSnapshots } from "../api/financial";
import { store } from "../data/store";

const cats=[
  ["fixedCosts","Fixed costs","home"],["dayToDaySpending","Day-to-day spending","shopping"],["debtRepayments","Debt / repayments","credit"],["unexpectedExpenses","Unexpected expenses","alert"],["obligations","Family / obligations","users"]
];
const n=v=>Number(v)||0;

export default function Dashboard(){
 const [snapshot,setSnapshot]=useState(()=>store.getSnapshot());
 const [expenses,setExpenses]=useState(()=>store.getExpenses());
 const [diagnosis,setDiagnosis]=useState(()=>store.getDiagnosis());
 const [loading,setLoading]=useState(false);
 useEffect(()=>{
   const r=()=>{setSnapshot(store.getSnapshot());setExpenses(store.getExpenses());setDiagnosis(store.getDiagnosis())};
   window.addEventListener("shekel-storage",r);
   (async()=>{
     let current=store.getSnapshot();
     try{
       if(!current){
         const res=await getSnapshots();
         const rows=Array.isArray(res.data?.data)?res.data.data:(res.data?.data?.snapshots||res.data?.data?.items||[]);
         if(rows.length){const latest=[...rows].sort((a,b)=>new Date(b.updatedAt||b.createdAt)-new Date(a.updatedAt||a.createdAt))[0];store.saveSnapshot(latest);store.saveSnapshotId(latest._id||latest.id||null);current=latest;setSnapshot(latest);}
       }
       const id=store.getSnapshotId();
       if(current && id && !store.getDiagnosis()){
         setLoading(true);
         const d=await getDiagnosis(id); const value=d.data?.data||d.data?.diagnosis||null;
         if(value){store.saveDiagnosis(value);setDiagnosis(value);}
       }
     }catch(e){console.warn("Could not refresh dashboard data",e)}finally{setLoading(false)}
   })();
   return()=>window.removeEventListener("shekel-storage",r)
 },[]);
 const income=n(snapshot?.income);
 const baseExpenses=cats.reduce((s,[k])=>s+n(snapshot?.[k]),0);
 const logged=expenses.reduce((s,e)=>s+n(e.amount),0);
 const total=baseExpenses+logged;
 const balance=income-total;
 const score=income>0?Math.max(0,Math.min(100,Math.round((balance/income)*100))):0;
 const categoryData=useMemo(()=>cats.map(([key,name,icon])=>({key,name,icon,value:n(snapshot?.[key])})),[snapshot]);
 const top=diagnosis?.priority;
 if(!snapshot) return <div className="page"><SectionTitle eyebrow="OVERVIEW" title="Build a calmer money life."/><section className="card empty-state"><h2>Your dashboard is waiting for your numbers.</h2><p>Enter your monthly financial information so every amount on this dashboard comes from you.</p><Link className="btn primary" to="/snapshot">Add financial information</Link></section></div>;
 return <div className="page"><SectionTitle eyebrow="OVERVIEW" title="Your financial picture." action={<Link to="/notifications" className="icon-btn"><Icon name="bell"/></Link>}/>
 <div className="stats-grid"><StatCard label="Monthly income" value={`₦${income.toLocaleString()}`} note="Your entered amount"/><StatCard label="Expenses" value={`₦${total.toLocaleString()}`} note="Snapshot + logged expenses"/><StatCard label="Available balance" value={`₦${balance.toLocaleString()}`} note="Income minus expenses"/></div>
 <div className="dashboard-grid"><section className="card chart-card"><div className="card-head"><div><span className="eyebrow">THIS MONTH'S CASHFLOW</span><h2>Money in vs. money out</h2></div><span className={`pill ${balance>=0?"green":""}`}>{balance>=0?"Within income":"Over income"}</span></div><div className="cashflow-bars"><div><span>Income</span><b>₦{income.toLocaleString()}</b><i><em style={{width:"100%"}}/></i></div><div><span>Expenses</span><b>₦{total.toLocaleString()}</b><i><em style={{width:`${income?Math.min(100,(total/income)*100):0}%`}}/></i></div></div></section>
 <section className="card"><div className="card-head"><div><span className="eyebrow">FINANCIAL HEALTH</span><h2>{score} <small>/ 100</small></h2></div><div className="score-ring">{score}</div></div><p className="muted">Based on the income and expenses you entered.</p><Link className="text-link" to="/diagnosis">View full diagnosis →</Link></section></div>
 <div className="dashboard-grid"><section className="card"><div className="card-head"><h2>Category breakdown</h2><Link to="/budget" className="text-link">View all</Link></div>{categoryData.map(c=><div className="category-row" key={c.key}><div className="category-icon"><Icon name={c.icon}/></div><div className="category-main"><div><span>{c.name}</span><b>₦{c.value.toLocaleString()}</b></div><ProgressBar value={Math.min(c.value,income||1)} max={income||1}/></div></div>)}</section>
 <section className="card"><div className="card-head"><div><span className="eyebrow">DIAGNOSIS</span><h2>{top?.label||"Your diagnosis"}</h2></div></div>{loading?<div className="empty-state compact"><p>Loading your diagnosis...</p></div>:top?<><p className="muted">Your highest current pressure area based on the backend diagnosis.</p><p>{diagnosis.recommendation?.action}</p><Link className="text-link" to="/diagnosis">See diagnosis →</Link></>:<div className="empty-state compact"><p>Complete your diagnosis to see your priority and recommendation.</p><Link className="text-link" to="/diagnosis">Open diagnosis →</Link></div>}</section></div>
 <section className="card"><div className="card-head"><div><span className="eyebrow">RECOMMENDED NEXT STEP</span><h2>{diagnosis?.recommendation?.action||"Your personalized action will appear here."}</h2></div></div>{diagnosis?.gapCheck?.explanation&&<p className="muted">{diagnosis.gapCheck.explanation}</p>}<Link className="btn secondary" to="/diagnosis">Review diagnosis</Link></section>
 <section className="card"><div className="card-head"><h2>Upcoming bills</h2></div><div className="empty-state compact"><Icon name="calendar"/><p>No bills added yet.</p><span className="muted">Upcoming bills are not part of the current financial diagnosis backend.</span></div></section>
 </div>
}
