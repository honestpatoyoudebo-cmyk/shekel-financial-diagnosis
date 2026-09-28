import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { activateAccount, getAccounts, saveToken } from "../data/store";

function apiMessage(error, fallback) { return error?.response?.data?.message || error?.response?.data?.error || fallback; }
export default function Login(){
 const nav=useNavigate(); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
 const savedAccounts=getAccounts();
 async function submit(){
  setError(""); if(!email.trim()||!password){setError("Enter your email and password.");return;} setLoading(true);
  try { const r=await loginUser({email:email.trim(),password}); const data=r.data?.data; if(!data?.token||!data?.user) throw new Error("The server did not return complete login information."); activateAccount(data.user.email,{id:data.user.id,name:data.user.name,email:data.user.email}); saveToken(data.token); nav("/dashboard"); }
  catch(e){setError(apiMessage(e,"Login failed. Please check your email, password, and internet connection."));}
  finally{setLoading(false);}
 }
 return <div className="auth-page"><div className="auth-card"><Link className="mini-brand" to="/"><span className="brand-mark">Shekɛl</span><span>Financial wellness, for real life</span></Link><div className="eyebrow">WELCOME BACK</div><h1>Let's continue.</h1><p>Log in to see your financial picture and what deserves attention first.</p>{savedAccounts.length>0&&<div className="saved-account-list"><small>Accounts used on this device</small>{savedAccounts.map(a=><button key={a.email} className="saved-account" onClick={()=>{setEmail(a.email);setError("")}}><span>{a.avatar?<img src={a.avatar} alt=""/>:<b>{(a.name||"U").split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase()}</b>}<span><strong>{a.name}</strong><em>{a.email}</em></span></span><span>›</span></button>)}</div>}{error&&<div className="form-error">{error}</div>}<label>Email address<input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password"/></label><button className="btn primary full" disabled={loading} onClick={submit}>{loading?"Logging in...":"Log in"}</button><p className="center">Don't have an account? <Link to="/register" className="text-link">Create one</Link></p></div></div>
}
