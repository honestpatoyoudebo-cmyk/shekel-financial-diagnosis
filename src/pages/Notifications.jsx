import React, { useEffect, useState } from "react";
import { getAlerts } from "../api/financial";
import SectionTitle from "../components/SectionTitle";
import Icon from "../components/Icon";
import { store } from "../data/store";

export default function Notifications(){
 const [alerts,setAlerts]=useState(()=>store.getAlerts());
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 useEffect(()=>{
   const id=store.getSnapshotId();
   if(!id){setAlerts([]);setLoading(false);return}
   setLoading(true);setError("");
   getAlerts(id).then(r=>{const items=r.data?.data?.alerts||r.data?.alerts||[];store.saveAlerts(items);setAlerts(items)}).catch(e=>{console.warn("Could not load alerts",e);setError("We couldn't refresh your alerts. Showing the last saved alerts instead.")}).finally(()=>setLoading(false));
 },[]);
 const enabled=store.getSettings().notifications;
 return <div className="page"><SectionTitle eyebrow="NOTIFICATIONS & ALERTS" title="Stay in the know."/>
 {!enabled?<section className="card empty-state"><div className="empty-icon"><Icon name="bell"/></div><h2>Notifications are off</h2><p>Turn them on from Profile → Notifications & Alerts.</p></section>:loading?<section className="card empty-state"><p>Checking your financial alerts...</p></section>:<>{error&&<div className="form-error">{error}</div>}{alerts.length===0?<section className="card empty-state"><div className="empty-icon"><Icon name="bell"/></div><h2>No alerts yet</h2><p>There are no backend alerts for your current financial snapshot.</p></section>:<div className="notification-list">{alerts.map((a,i)=><section className="card notification" key={a.id||`${a.type}-${a.category}-${i}`}><div className={`alert-icon ${(a.severity||"").toLowerCase()}`}><Icon name="bell"/></div><div><div className="notification-top"><h2>{a.title||"Financial alert"}</h2><span>{a.severity||"Info"}</span></div><p>{a.message||"Review this area in your financial diagnosis."}</p><div className="notification-meta"><small>Category: {a.category||"Financial pressure"}</small>{a.score!==undefined&&<small>Score: {a.score}</small>}</div></div></section>)}</div>}</>}
 </div>
}
