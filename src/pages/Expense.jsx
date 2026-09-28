import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { store } from "../data/store";
import { showToast } from "../components/Toast";

const cats = [["food","Food"],["car","Transport"],["bolt","Bills"],["heart","Lifestyle"],["users","Family"],["receipt","Other"]];

export default function Expense(){
  const nav = useNavigate();
  const location = useLocation();
  const editId = new URLSearchParams(location.search).get("edit");
  const existing = editId ? store.getExpenses().find(e => String(e.id) === String(editId)) : null;
  const [category,setCategory] = useState(existing?.category || "food");
  const [amount,setAmount] = useState(existing?.amount?.toString() || "");
  const [note,setNote] = useState(existing?.note || "");
  const [recurring,setRecurring] = useState(Boolean(existing?.recurring));
  const [receipt,setReceipt] = useState(existing?.receipt || null);
  const [error,setError] = useState("");

  function handleReceipt(e){
    const file=e.target.files?.[0];
    if(!file) return;
    if(!file.type.startsWith("image/")){setError("Please select an image file."); return;}
    if(file.size > 6 * 1024 * 1024){setError("Please choose an image smaller than 6 MB."); return;}
    const reader=new FileReader();
    reader.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        const max=1200; const scale=Math.min(1,max/Math.max(img.width,img.height));
        const canvas=document.createElement("canvas"); canvas.width=Math.max(1,Math.round(img.width*scale)); canvas.height=Math.max(1,Math.round(img.height*scale));
        const ctx=canvas.getContext("2d"); ctx.drawImage(img,0,0,canvas.width,canvas.height);
        setReceipt({name:file.name,data:canvas.toDataURL("image/jpeg",0.78)});
      };
      img.onerror=()=>setError("The receipt image could not be read."); img.src=reader.result;
    };
    reader.readAsDataURL(file); e.target.value="";
  }

  function saveExpense(){
    const numericAmount=Number(String(amount).replace(/,/g,""));
    if(!numericAmount || numericAmount<=0){setError("Please enter a valid expense amount."); return;}
    const label=cats.find(([id])=>id===category)?.[1] || "Other";
    const current=store.getExpenses();
    const expense={id:existing?.id || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`),amount:numericAmount,category,label,note:note.trim(),recurring,receipt,createdAt:existing?.createdAt || new Date().toISOString(),updatedAt:new Date().toISOString()};
    try {
      store.saveExpenses(existing ? current.map(e=>String(e.id)===String(existing.id)?expense:e) : [expense,...current]);
      showToast(existing ? "Expense updated successfully." : "Expense saved successfully.");
      nav("/budget");
    } catch { setError("The expense could not be saved. The receipt may be too large; remove it and try again."); }
  }

  return <div className="page narrow">
    <div className="back-link" onClick={()=>nav("/budget")}>← Budget</div>
    <div className="section-title"><h1>{existing ? "Edit expense" : "Add expense"}</h1></div>
    <section className="card expense-form">
      {error && <div className="form-error">{error}</div>}
      <div className="amount-input"><span>₦</span><input autoFocus inputMode="numeric" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0"/></div>
      <div className="eyebrow">SELECT CATEGORY</div>
      <div className="cat-grid">{cats.map(([icon,label])=><button type="button" key={label} className={`cat-btn ${category===icon?"selected":""}`} onClick={()=>setCategory(icon)}><Icon name={icon}/><span>{label}</span></button>)}</div>
      <label className="switch-row"><span><b>Recurring expense?</b><small>Mark this expense as recurring</small></span><input type="checkbox" checked={recurring} onChange={e=>setRecurring(e.target.checked)}/></label>
      <label>Add a note<input value={note} onChange={e=>setNote(e.target.value)} placeholder="What was this for? (e.g. Grocery shopping)"/></label>
      <div>
        <input id="receipt-photo" className="hidden-file" type="file" accept="image/*" onChange={handleReceipt}/>
        {!receipt ? <label htmlFor="receipt-photo" className="upload"><Icon name="receipt"/> Add receipt photo</label> : <div className="receipt-preview"><img src={receipt.data} alt="Receipt preview"/><div className="receipt-file-info"><b>{receipt.name}</b><small>Receipt attached</small></div><div className="receipt-actions"><label htmlFor="receipt-photo" className="btn secondary small">Change</label><button type="button" className="btn ghost small" onClick={()=>setReceipt(null)}>Remove</button></div></div>}
      </div>
      <button className="btn primary full" onClick={saveExpense} disabled={!amount}>{existing ? "Save changes" : "Save expense"}</button>
    </section>
  </div>;
}
