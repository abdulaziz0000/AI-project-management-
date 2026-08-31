import React from "react";

import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    useMediaQuery,
    useTheme
} from "@mui/material";

import {
    MdDashboard,
    MdFolder,
    MdPeople,
    MdLogout
} from "react-icons/md";

import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ open, onClose }) {

    const navigate = useNavigate();
    const location = useLocation();

    const theme = useTheme();

    const isMobile = useMediaQuery(
        theme.breakpoints.down("md")
    );


    const menu = [

        {
            name: "Dashboard",
            icon: <MdDashboard />,
            path: "/dashboard"
        },

        {
            name: "Projects",
            icon: <MdFolder />,
            path: "/projects"
        },

        {
            name: "Users",
            icon: <MdPeople />,
            path: "/users"
        },

        {
            name: "Logout",
            icon: <MdLogout />,
            path: "/login"
        }

    ];


    const handleClick = (item) => {

        if (item.name === "Logout") {

            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("organization");

            onClose();

            navigate("/login");

            return;
        }


        navigate(item.path);


        // Close drawer after navigation on mobile
        if (isMobile) {
            onClose();
        }

    };


    return (

        <Drawer
            variant={
                isMobile
                    ? "temporary"
                    : "permanent"
            }

            open={open}

            onClose={onClose}

            ModalProps={{
                keepMounted: true
            }}

            sx={{

                width:
                    isMobile
                        ? 0
                        : open
                            ? 240
                            : 70,

                flexShrink: 0,

                "& .MuiDrawer-paper": {

                    width:
                        isMobile
                            ? 260
                            : open
                                ? 240
                                : 70,

                    boxSizing: "border-box",

                    backgroundColor: "#0F172A",

                    color: "white",

                    /*
                     * IMPORTANT:
                     * Keep sidebar below the navbar
                     */
                    marginTop: "64px",

                    height:
                        "calc(100vh - 64px)",

                    transition:
                        "width 0.25s ease",

                    overflowX: "hidden",

                    overflowY: "auto",

                    /*
                     * Makes scrolling smoother
                     */
                    WebkitOverflowScrolling: "touch",

                    /*
                     * Prevent horizontal scrollbar
                     */
                    scrollbarWidth: "thin"
                }

            }}

        >

            {/* Sidebar content */}

            <Box
                sx={{
                    width: "100%",
                    minHeight: "100%"
                }}
            >

                <List
                    sx={{
                        pt: 1
                    }}
                >

                    {menu.map((item) => {

                        const isActive =
                            location.pathname === item.path ||
                            (
                                item.path !== "/dashboard" &&
                                location.pathname.startsWith(
                                    item.path
                                )
                            );

                        return (

                            <ListItemButton
                                key={item.name}
                                onClick={() =>
                                    handleClick(item)
                                }

                                sx={{
                                    minHeight: 52,

                                    justifyContent:
                                        !isMobile && !open
                                            ? "center"
                                            : "initial",

                                    px: 2.5,

                                    mb: 0.5,

                                    borderRadius: 1,

                                    backgroundColor:
                                        isActive
                                            ? "rgba(255,255,255,0.12)"
                                            : "transparent",

                                    "&:hover": {
                                        backgroundColor:
                                            "rgba(255,255,255,0.08)"
                                    }
                                }}
                            >

                                <ListItemIcon
                                    sx={{
                                        color: "white",

                                        minWidth:
                                            !isMobile && !open
                                                ? "auto"
                                                : 40,

                                        justifyContent:
                                            "center",

                                        fontSize: 22
                                    }}
                                >

                                    {item.icon}

                                </ListItemIcon>


                                {/*
                                 * On mobile always show text.
                                 *
                                 * On desktop show text only
                                 * when sidebar is expanded.
                                 */}

                                {(isMobile || open) && (

                                    <ListItemText
                                        primary={item.name}
                                        primaryTypographyProps={{
                                            fontSize: 15,
                                            fontWeight:
                                                isActive
                                                    ? 600
                                                    : 400
                                        }}
                                    />

                                )}

                            </ListItemButton>

                        );

                    })}

                </List>

            </Box>

        </Drawer>

    );

}

export default Sidebar;

