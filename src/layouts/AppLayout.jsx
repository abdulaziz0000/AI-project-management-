import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import {
    Box,
    useMediaQuery,
    useTheme
} from "@mui/material";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function AppLayout() {

    const theme = useTheme();

    const isMobile = useMediaQuery(
        theme.breakpoints.down("md")
    );

    const [sidebarOpen, setSidebarOpen] = useState(
        !isMobile
    );

    const handleMenuClick = () => {
        setSidebarOpen(prev => !prev);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    return (

        <Box
            sx={{
                minHeight: "100vh",
                background: "#F5F7FA"
            }}
        >

            <Navbar
                onMenuClick={handleMenuClick}
            />

            <Sidebar
                open={sidebarOpen}
                onClose={handleSidebarClose}
            />

            <Box
                component="main"
                sx={{
                    marginTop: "64px",

                    marginLeft:
                        isMobile
                            ? 0
                            : sidebarOpen
                                ? "240px"
                                : "70px",

                    padding: {
                        xs: 2,
                        sm: 3,
                        md: 4
                    },

                    minHeight: "calc(100vh - 64px)",

                    transition: "margin-left 0.25s ease"
                }}
            >

                <Outlet />

            </Box>

        </Box>

    );

}

export default AppLayout;