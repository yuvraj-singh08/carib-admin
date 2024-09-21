import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/dashboard";
import SupplierFirewallPage from "./pages/supplier-firewall";
import ManageAirlinesPage from "./pages/manage-airlines";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/supplier" element={<SupplierFirewallPage />} />
        <Route path="/manage-airlines" element={<ManageAirlinesPage />} />
      </Routes>
    </>
  );
}

export default App;
