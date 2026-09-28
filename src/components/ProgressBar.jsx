import React from "react";
export default function ProgressBar({ value, max = 100, tone = "" }) {
  const width = Math.min(100, Math.max(0, (value / max) * 100));
  return <div className={`progress ${tone}`}><span style={{ width: `${width}%` }} /></div>;
}
