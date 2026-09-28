import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/demo";
import Icon from "../components/Icon";
import { store } from "../data/store";
export default function Perception(){
 const [selected,setSelected]=useState(store.getPerception()||"fixedCosts"); const nav=useNavigate();
 return <div className="flow-page"><div className="flow-card"><div className="mini-brand"><span className="brand-mark">Shekɛl</span><span>Financial wellness, for real life</span></div><div className="step-count">01 / 02</div><h1>What is your biggest financial pressure?</h1><p>Choose the area you believe is putting the most pressure on your finances.</p><div className="choice-list">{categories.map(c=><button key={c.id} className={`choice ${selected===c.id?"selected":""}`} onClick={()=>setSelected(c.id)}><span className="choice-icon"><Icon name={c.icon} size={18}/></span><span>{c.label}</span><span className="radio">{selected===c.id?"●":""}</span></button>)}</div><button className="btn primary full" onClick={()=>{store.savePerception(selected);store.saveDiagnosis(null);store.saveAlerts([]);nav("/snapshot")}}>Next Question</button></div></div>
}
