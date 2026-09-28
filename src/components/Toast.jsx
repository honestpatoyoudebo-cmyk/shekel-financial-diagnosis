import React, { useEffect, useState } from "react";

export default function Toast(){
  const [toast,setToast]=useState(null);
  useEffect(()=>{
    const onToast=e=>{
      setToast(e.detail||null);
      window.clearTimeout(window.__shekelToastTimer);
      window.__shekelToastTimer=window.setTimeout(()=>setToast(null),3200);
    };
    window.addEventListener("shekel-toast",onToast);
    return()=>{window.removeEventListener("shekel-toast",onToast);window.clearTimeout(window.__shekelToastTimer)};
  },[]);
  if(!toast)return null;
  return <div className={`toast ${toast.type||"success"}`} role="status" aria-live="polite"><span className="toast-icon">{toast.type==="error"?"!":"✓"}</span><span>{toast.message}</span><button onClick={()=>setToast(null)} aria-label="Dismiss message">×</button></div>;
}
export function showToast(message,type="success"){window.dispatchEvent(new CustomEvent("shekel-toast",{detail:{message,type}}))}
