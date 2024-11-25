import { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { Box, Typography, Button, Avatar, Menu, MenuItem } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';

export const UserProfile = () => {
    const { instance } = useMsal();
    const [userData, setUserData] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const open = Boolean(anchorEl);

    useEffect(() => {
        const fetchUserData = async () => {
            const account = instance.getActiveAccount();
            if (account) {
                try {
                    const response = await instance.acquireTokenSilent({
                        ...loginRequest,
                        account: account
                    });

                    const graphResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
                        headers: {
                            Authorization: `Bearer ${response.accessToken}`
                        }
                    });

                    const data = await graphResponse.json();
                    setUserData(data);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUserData();
    }, [instance]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();

        // Clear MSAL cache and tokens
        instance.clearCache();
        
        // Set active account to null
        instance.setActiveAccount(null);

        // Clear browser storage
        localStorage.clear();
        sessionStorage.clear();

        // Clear state
        setUserData(null);

        // Force navigation to login
        window.location.href = '/login';
    };

    if (!userData) {
        return null;
    }

    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
                color="inherit"
                onClick={handleClick}
                startIcon={
                    <Avatar 
                        sx={{ width: 32, height: 32 }}
                        alt={userData.displayName}
                    >
                        <AccountCircle />
                    </Avatar>
                }
            >
                {userData.displayName}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
            >
                <MenuItem disabled>
                    <Typography variant="body2" color="textSecondary">
                        {userData.userPrincipalName}
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
            </Menu>
        </Box>
    );
};
