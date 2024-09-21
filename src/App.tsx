import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/dashboard";
import SupplierFirewallPage from "./pages/supplier-firewall";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/supplier" element={<SupplierFirewallPage />} />
      </Routes>
    </>
  );
}

export default App;
