import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";
import { clearStarterDemoData, store } from "./data/store";

clearStarterDemoData();
const legacySnapshot = localStorage.getItem("shekel_snapshot");
if (!store.getSnapshot() && legacySnapshot) {
  try { store.saveSnapshot(JSON.parse(legacySnapshot)); } catch {}
  localStorage.removeItem("shekel_snapshot");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
