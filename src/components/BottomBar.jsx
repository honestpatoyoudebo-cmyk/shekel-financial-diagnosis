import React from "react";
import { NavLink } from "react-router-dom";
import Icon from "./Icon";
export default function BottomBar() {
  return (
    <nav className="mobile-nav">
      {[
        ["dashboard","/dashboard","Home"],["budget","/budget","Budget"],
        ["savings","/savings","Savings"],["debt","/debts","Debt"],["profile","/profile","Profile"]
      ].map(([icon,to,label]) => (
        <NavLink key={to} to={to} className={({isActive})=>isActive?"active":""}>
          <Icon name={icon} size={18}/><span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
