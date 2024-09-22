import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/dashboard";
import SupplierFirewallPage from "./pages/supplier-firewall";
import ManageAirlinesPage from "./pages/manage-airlines";
import { UserManagementPage } from "./pages/user-management";
import SettingsPage from "./pages/settings";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/supplier" element={<SupplierFirewallPage />} />
        <Route path="/manage-airlines" element={<ManageAirlinesPage />} />
        <Route path="/manage-user" element={<UserManagementPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </>
  );
}

export default App;
