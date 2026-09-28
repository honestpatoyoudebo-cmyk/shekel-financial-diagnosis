import React from "react";
import { Link } from "react-router-dom";
export default function Landing() {
  return <div className="landing">
    <div className="landing-card">
      <div className="logo-box">Shekɛl</div>
      <h1>Shekɛl</h1>
      <p>Take control of your money</p>
      <div className="orbital"><i/><i/><i/></div>
      <div className="landing-actions">
        <Link className="btn primary full" to="/register">Get Started</Link>
        <Link className="text-link" to="/login">I already have an account</Link>
      </div>
    </div>
  </div>;
}
