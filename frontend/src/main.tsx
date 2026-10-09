import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { SiteConfigProvider } from "./context/SiteConfigContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SiteConfigProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SiteConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);
