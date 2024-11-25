import { Navigate, useLocation } from "react-router-dom";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

export const ProtectedRoute = ({ children }) => {
    const { instance } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const location = useLocation();

    // Check if MSAL is initialized and has accounts
    const accounts = instance.getAllAccounts();
    const isInitialized = accounts.length > 0 || isAuthenticated;

    if (!isInitialized || !isAuthenticated) {
        // Redirect to login page with the intended destination
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};
