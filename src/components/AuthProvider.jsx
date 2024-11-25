import { MsalProvider, useMsal } from "@azure/msal-react";
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { msalConfig } from "../authConfig";
import { setMsalInstance } from "../api/axios";

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

const AuthStateHandler = ({ children }) => {
    const { instance } = useMsal();
    const navigate = useNavigate();
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Set the MSAL instance for axios
                setMsalInstance(instance);

                // Handle redirect promise
                await instance.handleRedirectPromise();

                // Set active account if available
                const accounts = instance.getAllAccounts();
                if (accounts.length > 0 && !instance.getActiveAccount()) {
                    instance.setActiveAccount(accounts[0]);
                }

                setIsInitialized(true);
            } catch (error) {
                console.error("Auth initialization error:", error);
                setIsInitialized(true); // Still set initialized to prevent infinite loading
            }
        };

        initializeAuth();

        // Event handler for login/logout
        const authEventHandler = (event) => {
            if (event.eventType === EventType.LOGIN_SUCCESS) {
                const account = event.payload.account;
                instance.setActiveAccount(account);
                navigate("/");
            }
            if (event.eventType === EventType.LOGOUT_SUCCESS) {
                navigate("/login");
            }
        };

        // Register event handler
        const callbackId = instance.addEventCallback(authEventHandler);

        return () => {
            if (callbackId) {
                instance.removeEventCallback(callbackId);
            }
        };
    }, [instance, navigate]);

    if (!isInitialized) {
        return null; // or a loading spinner
    }

    return children;
};

export const AuthProvider = ({ children }) => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            try {
                await msalInstance.initialize();
                setIsReady(true);
            } catch (error) {
                console.error("MSAL initialization failed:", error);
            }
        };

        initialize();
    }, []);

    if (!isReady) {
        return null; // or a loading spinner
    }

    return (
        <MsalProvider instance={msalInstance}>
            <AuthStateHandler>
                {children}
            </AuthStateHandler>
        </MsalProvider>
    );
};
