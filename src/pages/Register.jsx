import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { registerUser, loginUser } from "../api/auth";
import { activateAccount, saveToken, store } from "../data/store";

function apiMessage(error, fallback) {
  return error?.response?.data?.message || error?.response?.data?.error || fallback;
}

export default function Register() {
  const nav = useNavigate();
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({name:"",email:"",password:"",confirm:""});
  const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  async function submit(){
    setError("");
    if(!form.name.trim() || !form.email.trim() || form.password.length<8 || form.password!==form.confirm){
      setError("Please complete the form. Passwords must match and be at least 8 characters."); return;
    }
    setLoading(true);
    try {
      const registered = await registerUser({name:form.name.trim(),email:form.email.trim(),password:form.password});
      const registeredUser = registered.data?.data;
      const login = await loginUser({email:form.email.trim(),password:form.password});
      const data = login.data?.data;
      if(!data?.token) throw new Error("The server did not return a login token.");
      activateAccount(data.user?.email || registeredUser?.email || form.email, { id:data.user?.id || registeredUser?.id, name:data.user?.name || registeredUser?.name || form.name.trim(), email:data.user?.email || registeredUser?.email || form.email.trim(), avatar:null });
      saveToken(data.token);
      store.saveSnapshot(null); store.saveSnapshotId(null); store.savePerception(null); store.saveExpenses([]); store.saveGoals([]); store.saveDebts([]);
      nav("/perception");
    } catch (e) {
      setError(apiMessage(e,"Registration failed. Please check your internet connection and try again."));
    } finally { setLoading(false); }
  }
  return <div className="auth-page"><div className="auth-card"><Link className="mini-brand" to="/"><span className="brand-mark">Shekɛl</span><span>Financial wellness, for real life</span></Link><div className="eyebrow">MONEY, MADE CALMER</div><h1>Build a calmer<br/>money life.</h1><p>Create your account to plan, save, and make progress at your own pace—without judgment.</p>{error&&<div className="form-error">{error}</div>}<label>Full name<input placeholder="Enter your full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Email address<input type="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>Password><div className="password-wrap"><input type={show?"text":"password"} placeholder="At least 8 characters" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/><button type="button" onClick={()=>setShow(!show)}><Icon name={show?"eyeOff":"eye"}/></button></div></label><label>Confirm password<input type="password" placeholder="Re-enter your password" value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})}/></label><button className="btn primary full" disabled={loading} onClick={submit}>{loading?"Creating account...":"Create account"}</button><div className="divider">or</div><p className="center">Already have an account? <Link to="/login" className="text-link">Log in</Link></p></div></div>
}
