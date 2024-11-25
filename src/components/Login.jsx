import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { Button, Container, Box, Typography, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const Login = () => {
    const { instance } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuthAndRedirect = async () => {
            try {
                await instance.handleRedirectPromise();
                
                if (isAuthenticated) {
                    const destination = location.state?.from?.pathname || "/";
                    navigate(destination);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthAndRedirect();
    }, [instance, isAuthenticated, navigate, location]);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            await instance.loginRedirect(loginRequest);
        } catch (error) {
            console.error("Login failed:", error);
            setIsLoading(false);
        }
    };

    const content = isLoading ? (
        <CircularProgress />
    ) : (
        <>
            <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                Welcome to PMS
            </Typography>
            <Button
                fullWidth
                variant="contained"
                onClick={handleLogin}
                disabled={isLoading}
                sx={{ minWidth: '200px' }}
            >
                Sign in with Microsoft
            </Button>
        </>
    );

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default'
            }}
        >
            <Container maxWidth="xs" sx={{ margin: 'auto' }}>
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 4,
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        boxShadow: 1
                    }}
                >
                    {content}
                </Box>
            </Container>
        </Box>
    );
};
