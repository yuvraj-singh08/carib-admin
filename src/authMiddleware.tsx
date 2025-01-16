import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Custom hook for middleware to protect routes
export const useAuthMiddleware = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isLoggedIn = checkIfUserIsLoggedIn();
    const publicRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"]; // Only login and signup routes are public

    // Redirect to login page if user is not logged in and trying to access a private route
    if (!isLoggedIn && !publicRoutes.includes(location.pathname)) {
      navigate("/login", { replace: true });
    }

    // Redirect logged-in users away from login or signup page to the home page
    if (isLoggedIn && publicRoutes.includes(location.pathname)) {
      navigate("/", { replace: true }); // Redirect to the home page
    }
  }, [navigate, location]);
};

// Function to check if the user is logged in
const checkIfUserIsLoggedIn = (): boolean => {
  const token = localStorage.getItem("authToken"); // Replace with your actual auth token logic
  return !!token; // Returns true if the token exists
};

// Logout function to clear the token and redirect
export const handleLogout = (navigate: any) => {
  localStorage.removeItem("authToken"); // Remove the auth token from localStorage
  localStorage.removeItem("userId"); // Optionally remove user-related data
  navigate("/login", { replace: true }); // Redirect to login or signup page
};
