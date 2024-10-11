import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/dashboard";
import SupplierFirewallPage from "./pages/supplier-firewall";
import ManageAirlinesPage from "./pages/manage-airlines";
import { UserManagementPage } from "./pages/user-management";
import SettingsPage from "./pages/settings";
import LandingPageSettings from "./pages/landing-page-settings";
import ProfilePage from "./pages/profile";
import CustomerDetailsPage from "./pages/customers-details";
import TicketsPage from "./pages/tickets";
import SearchManagementPage from "./pages/search-management";
import { LoginPage } from "./pages/login";
import { SignUpPage } from "./pages/signup";
import { useAuthMiddleware } from "./authMiddleware";

function App() {
  useAuthMiddleware();
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Private Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/supplier" element={<SupplierFirewallPage />} />
        <Route path="/manage-airlines" element={<ManageAirlinesPage />} />
        <Route path="/manage-user" element={<UserManagementPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/landing-settings" element={<LandingPageSettings />} />
        <Route path="/customer-details" element={<CustomerDetailsPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/search-management" element={<SearchManagementPage />} />
      </Routes>
    </>
  );
}

export default App;
