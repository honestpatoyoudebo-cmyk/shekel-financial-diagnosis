import React from "react";
export default function StatCard({ label, value, note, icon, className="" }) {
  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-top"><span>{label}</span>{icon}</div>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </div>
  );
}
