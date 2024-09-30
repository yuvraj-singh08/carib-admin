import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { SidebarLayoutWrapper } from "./components/shared/sidebar-layout-wrapper.tsx";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./provider/redux-provider.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <SidebarLayoutWrapper>
          <App />
          <Toaster />
        </SidebarLayoutWrapper>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
