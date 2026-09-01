import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    MenuItem,
    Button,
    Snackbar,
    Alert,
    CircularProgress
} from "@mui/material";

import { MdPersonAdd } from "react-icons/md";

import { inviteEmployee } from "../services/invitationService";

function InviteEmployee() {

    const navigate = useNavigate();
    const { projectId } = useParams();

    const storage =
        localStorage.getItem("accessToken")
            ? localStorage
            : sessionStorage;

    const user = JSON.parse(storage.getItem("user") || "{}");
    const organization = JSON.parse(
        storage.getItem("organization") || "{}"
    );

    const [invitation, setInvitation] = useState({
        email: "",
        role: "DEVELOPER",
        organizationId: organization.id,
        projectId,
        invitedBy: user.id
    });

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setInvitation({
            ...invitation,
            [e.target.name]: e.target.value
        });

    };

const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
        await inviteEmployee(invitation);

        setSuccess(true);

        setTimeout(() => {
            navigate(`/projects/${projectId}`);
        }, 1000);

    } catch (err) {

        console.error("Invitation error:", err);

        setError(
            err.response?.data?.message ||
            "Unable to send invitation."
        );

        setLoading(false);
    }
};
    return (
        <Box
            sx={{
                width: "100%",
                minHeight: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                px: {
                    xs: 1,
                    sm: 2,
                    md: 3
                },
                py: {
                    xs: 2,
                    sm: 3,
                    md: 5
                },
                boxSizing: "border-box"
            }}
        >

            <Paper
                elevation={0}
                sx={{
                    width: "100%",
                    maxWidth: 620,
                    borderRadius: {
                        xs: 2.5,
                        sm: 3,
                        md: 4
                    },
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "grey.200",
                    boxShadow:
                        "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
                    transition:
                        "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",

                    "&:hover": {
                        boxShadow:
                            "0 25px 50px -12px rgba(79, 70, 229, 0.15)"
                    }
                }}
            >

                {/* HEADER */}

                <Box
                    sx={{
                        background:
                            "linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)",
                        color: "white",
                        px: {
                            xs: 2.5,
                            sm: 4,
                            md: 5
                        },
                        py: {
                            xs: 3,
                            sm: 4,
                            md: 5
                        },
                        position: "relative",
                        overflow: "hidden",

                        "&::after": {
                            content: '""',
                            position: "absolute",
                            top: {
                                xs: -60,
                                sm: -40
                            },
                            right: {
                                xs: -60,
                                sm: -40
                            },
                            width: {
                                xs: 130,
                                sm: 160
                            },
                            height: {
                                xs: 130,
                                sm: 160
                            },
                            borderRadius: "50%",
                            background:
                                "rgba(255, 255, 255, 0.1)",
                            pointerEvents: "none"
                        }
                    }}
                >

                    <Typography
                        variant="h4"
                        fontWeight={800}
                        letterSpacing="-0.02em"
                        sx={{
                            fontSize: {
                                xs: "1.75rem",
                                sm: "2.125rem"
                            },
                            lineHeight: 1.2
                        }}
                    >
                        Invite Employee
                    </Typography>

                    <Typography
                        sx={{
                            opacity: 0.88,
                            mt: 1,
                            fontSize: {
                                xs: "0.85rem",
                                sm: "0.95rem"
                            },
                            lineHeight: 1.5,
                            maxWidth: 500
                        }}
                    >
                        Invite a team member to collaborate on this project.
                    </Typography>

                </Box>

                {/* FORM */}

                <Box
                    sx={{
                        p: {
                            xs: 2.5,
                            sm: 4,
                            md: 5
                        },
                        background: "#ffffff"
                    }}
                >

                    <form onSubmit={handleSubmit}>

                        <Grid container spacing={{ xs: 2.5, sm: 3 }}>

                            {/* EMAIL */}

                            <Grid item xs={12}>

                                <TextField
                                    fullWidth
                                    required
                                    disabled={loading}
                                    label="Employee Email"
                                    name="email"
                                    type="email"
                                    value={invitation.email}
                                    onChange={handleChange}
                                    placeholder="john@company.com"
                                    variant="outlined"
                                    size="medium"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2.5,
                                            backgroundColor: "#f8fafc",

                                            "&:hover fieldset": {
                                                borderColor: "#6366f1"
                                            },

                                            "&.Mui-focused": {
                                                backgroundColor: "#ffffff"
                                            }
                                        }
                                    }}
                                />

                            </Grid>

                            {/* ROLE */}

                            <Grid item xs={12}>

                                <TextField
                                    select
                                    fullWidth
                                    disabled={loading}
                                    label="Project Role"
                                    name="role"
                                    value={invitation.role}
                                    onChange={handleChange}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2.5,
                                            backgroundColor: "#f8fafc",

                                            "&:hover fieldset": {
                                                borderColor: "#6366f1"
                                            },

                                            "&.Mui-focused": {
                                                backgroundColor: "#ffffff"
                                            }
                                        }
                                    }}
                                >

                                    <MenuItem
                                        value="DEVELOPER"
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 1
                                        }}
                                    >
                                        👨‍💻 &nbsp; Developer
                                    </MenuItem>

                                    <MenuItem
                                        value="TESTER"
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 1
                                        }}
                                    >
                                        🧪 &nbsp; Tester
                                    </MenuItem>

                                    <MenuItem
                                        value="PROJECT_MANAGER"
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 1
                                        }}
                                    >
                                        📋 &nbsp; Project Manager
                                    </MenuItem>

                                </TextField>

                            </Grid>

                            {/* BUTTON */}

                            <Grid item xs={12}>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    disabled={loading}
                                    startIcon={
                                        loading ? (
                                            <CircularProgress
                                                size={20}
                                                color="inherit"
                                            />
                                        ) : (
                                            <MdPersonAdd />
                                        )
                                    }
                                    sx={{
                                        mt: 0.5,
                                        py: {
                                            xs: 1.5,
                                            sm: 1.8
                                        },
                                        minHeight: {
                                            xs: 52,
                                            sm: 56
                                        },
                                        fontSize: {
                                            xs: "0.95rem",
                                            sm: "1rem"
                                        },
                                        fontWeight: 700,
                                        borderRadius: 2.5,
                                        textTransform: "none",

                                        background:
                                            "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",

                                        boxShadow:
                                            "0 10px 15px -3px rgba(79, 70, 229, 0.3)",

                                        transition:
                                            "all 0.2s ease-in-out",

                                        "&:hover": {
                                            background:
                                                "linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%)",

                                            boxShadow:
                                                "0 14px 20px -3px rgba(79, 70, 229, 0.4)",

                                            transform:
                                                "translateY(-1px)"
                                        },

                                        "&:active": {
                                            transform:
                                                "translateY(0)"
                                        },

                                        "&.Mui-disabled": {
                                            background:
                                                "linear-gradient(135deg, #93c5fd 0%, #a5b4fc 100%)",

                                            color: "#ffffff"
                                        }
                                    }}
                                >
                                    {loading
                                        ? "Sending..."
                                        : "Send Invitation"}
                                </Button>

                            </Grid>

                        </Grid>

                    </form>

                </Box>

            </Paper>

            {/* SUCCESS */}

            <Snackbar
                open={success}
                autoHideDuration={3000}
                onClose={() => setSuccess(false)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    sx={{
                        borderRadius: 2,
                        fontWeight: 600,
                        width: {
                            xs: "calc(100vw - 32px)",
                            sm: "auto"
                        }
                    }}
                >
                    Invitation sent successfully 🎉
                </Alert>
            </Snackbar>

            {/* ERROR */}

            <Snackbar
                open={error !== ""}
                autoHideDuration={3000}
                onClose={() => setError("")}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
            >
                <Alert
                    severity="error"
                    variant="filled"
                    sx={{
                        borderRadius: 2,
                        fontWeight: 600,
                        width: {
                            xs: "calc(100vw - 32px)",
                            sm: "auto"
                        }
                    }}
                >
                    {error}
                </Alert>
            </Snackbar>

        </Box>
    );
}

export default InviteEmployee;


