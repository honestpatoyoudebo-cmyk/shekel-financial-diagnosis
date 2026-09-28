import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useLocation, Navigate } from "react-router-dom";
import Icon from "./Icon";
import { store } from "../data/store";
import Toast from "./Toast";

const items=[["dashboard","/dashboard","Home"],["budget","/budget","Budget"],["savings","/savings","Savings"],["debt","/debts","Debt"],["profile","/profile","Profile"]];
export function AppShell(){
 const [open,setOpen]=useState(false);const [user,setUser]=useState(()=>store.getUser());const [settings,setSettings]=useState(()=>store.getSettings());const location=useLocation();
 useEffect(()=>{const r=()=>{setUser(store.getUser());setSettings(store.getSettings())};window.addEventListener("shekel-storage",r);return()=>window.removeEventListener("shekel-storage",r)},[]);
 useEffect(()=>{document.documentElement.dataset.theme=settings.theme.includes("Fresh")?"fresh":"warm"},[settings.theme]);
 if(!localStorage.getItem("shekel_token")) return <Navigate to="/login" replace />;
 const name=user?.name||"User";const initials=name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase()||"U";
 return <><div className="app-shell"><header className="topbar"><button className="icon-btn mobile-only" onClick={()=>setOpen(!open)} aria-label="Menu"><Icon name={open?"close":"menu"}/></button><NavLink to="/dashboard" className="brand"><span className="brand-mark">Shekɛl</span><span className="brand-sub">Financial wellness, for real life</span></NavLink><div className="topbar-actions"><NavLink to="/notifications" className="icon-btn" aria-label="Notifications"><Icon name="bell"/></NavLink><NavLink to="/profile" className="avatar">{user?.avatar?<img src={user.avatar} alt="" className="avatar-image"/>:initials}</NavLink></div></header><aside className={`sidebar ${open?"open":""}`}><nav>{items.map(([icon,to,label])=><NavLink key={to} to={to} onClick={()=>setOpen(false)} className={({isActive})=>`side-link ${isActive?"active":""}`}><Icon name={icon} size={19}/><span>{label}</span></NavLink>)}</nav></aside><main className="main-content"><Outlet key={location.pathname}/></main><nav className="mobile-nav">{items.map(([icon,to,label])=><NavLink key={to} to={to} className={({isActive})=>isActive?"active":""}><Icon name={icon} size={18}/><span>{label}</span></NavLink>)}</nav></div><Toast /></>;
}
