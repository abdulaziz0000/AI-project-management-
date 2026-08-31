import React, { useEffect, useState } from "react";

import {
    AppBar,
    Toolbar,
    Typography,
    Avatar,
    Box,
    IconButton,
    useMediaQuery,
    useTheme
} from "@mui/material";

import { MdMenu } from "react-icons/md";

function Navbar({ onMenuClick }) {

    const theme = useTheme();

    const isMobile = useMediaQuery(
        theme.breakpoints.down("md")
    );

    const [user, setUser] = useState(null);
    const [organization, setOrganization] = useState(null);


    /*
     * ==========================================
     * LOAD LOGGED-IN USER AND ORGANIZATION
     * ==========================================
     */

    useEffect(() => {

        try {

            const storedUser =
                localStorage.getItem("user");

            const storedOrganization =
                localStorage.getItem("organization");


            if (storedUser) {

                setUser(
                    JSON.parse(storedUser)
                );

            }


            if (storedOrganization) {

                setOrganization(
                    JSON.parse(storedOrganization)
                );

            }

        } catch (error) {

            console.error(
                "Failed to load navbar data:",
                error
            );

        }

    }, []);


    /*
     * ==========================================
     * USER NAME
     * ==========================================
     */

    const firstName =
        user?.firstName || "";

    const lastName =
        user?.lastName || "";

    const fullName =
        `${firstName} ${lastName}`.trim();


    /*
     * ==========================================
     * AVATAR
     * ==========================================
     */

    const avatarLetter =
        firstName
            ? firstName.charAt(0).toUpperCase()
            : "U";


    /*
     * ==========================================
     * ORGANIZATION NAME
     * ==========================================
     */

    const organizationName =
        organization?.name ||
        "Organization";


    return (

        <AppBar
            position="fixed"
            sx={{
                backgroundColor: "#fff",
                color: "#000",
                boxShadow: 2,

                zIndex:
                    theme.zIndex.drawer + 1
            }}
        >

            <Toolbar>

                {/* ==================================
                    SIDEBAR TOGGLE
                ================================== */}

                <IconButton
                    onClick={onMenuClick}
                    sx={{
                        mr: 2,
                        color: "#0F172A"
                    }}
                >

                    <MdMenu size={28} />

                </IconButton>


                {/* ==================================
                    ORGANIZATION NAME
                ================================== */}

                <Typography
                    variant={
                        isMobile
                            ? "h6"
                            : "h5"
                    }
                    sx={{
                        fontWeight: "bold",
                        color: "#1976d2",

                        whiteSpace: "nowrap",

                        overflow: "hidden",

                        textOverflow: "ellipsis",

                        maxWidth: {
                            xs: "180px",
                            sm: "350px",
                            md: "500px"
                        }
                    }}
                >
                    {organizationName}
                </Typography>


                <Box
                    sx={{
                        flexGrow: 1
                    }}
                />


                {/* ==================================
                    LOGGED-IN USER
                ================================== */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5
                    }}
                >

                    <Avatar
                        sx={{
                            bgcolor: "#1976d2",

                            width: {
                                xs: 36,
                                sm: 40
                            },

                            height: {
                                xs: 36,
                                sm: 40
                            }
                        }}
                    >
                        {avatarLetter}
                    </Avatar>


                    {!isMobile && (

                        <Box>

                            <Typography
                                fontWeight="bold"
                                sx={{
                                    lineHeight: 1.3
                                }}
                            >
                                {fullName || "User"}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="gray"
                                sx={{
                                    maxWidth: 220,

                                    overflow: "hidden",

                                    textOverflow:
                                        "ellipsis",

                                    whiteSpace:
                                        "nowrap"
                                }}
                            >
                                {organizationName}
                            </Typography>

                        </Box>

                    )}

                </Box>

            </Toolbar>

        </AppBar>

    );

}

export default Navbar;
