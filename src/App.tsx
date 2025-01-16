import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/dashboard";
import SupplierFirewallPage from "./pages/supplier-firewall";
import ManageCommisionPage from "./pages/manage-commission";
import { UserManagementPage } from "./pages/user-management";
import SettingsPage from "./pages/settings";
import LandingPageSettings from "./pages/landing-page-settings";
import ProfilePage from "./pages/profile";
import CustomerDetailsPage from "./pages/customers-details";
import TicketsPage from "./pages/tickets";
import SearchManagementPage from "./pages/search-management";
import { LoginPage } from "./pages/login";
import { useAuthMiddleware } from "./authMiddleware";
import AddBlogPage from "./components/landing-settings/add-blog";
import EditBlogPage from "./components/landing-settings/edit-blog";
import BlogPage from "./pages/blog/blog-page";
import FlightBooking from "./components/dashboard/components/FlightBooking";
import ForgotPasswordComponent from "./components/forgot-password/forgot-password";
import ResetPasswordPage from "./components/reset-password/reset-password";

function App() {
  useAuthMiddleware();
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordComponent />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Private Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/flightdetails" element={<FlightBooking />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/supplier" element={<SupplierFirewallPage />} />
        <Route path="/manage-commission" element={<ManageCommisionPage />} />
        <Route path="/manage-user" element={<UserManagementPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/landing-settings" element={<LandingPageSettings />} />
        <Route path="/add-blog" element={<AddBlogPage />} />
        <Route path="/edit-blog/:id" element={<EditBlogPage />} />
        <Route path="/blog/:id" element={<BlogPage />} />
        <Route path="/customer-details" element={<CustomerDetailsPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/search-management" element={<SearchManagementPage />} />
      </Routes>
    </>
  );
}

export default App;
