import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { SidebarLayoutWrapper } from "./components/shared/sidebar-layout-wrapper.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SidebarLayoutWrapper>
        <App />
      </SidebarLayoutWrapper>
    </BrowserRouter>
  </React.StrictMode>
);
