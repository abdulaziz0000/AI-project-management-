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
    Alert
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
    const organization = JSON.parse(storage.getItem("organization") || "{}");

    const [invitation, setInvitation] = useState({
        email: "",
        role: "DEVELOPER",
        organizationId: organization.id,
        projectId,
        invitedBy: user.id
    });

    const [success, setSuccess] = useState(false);

    const [error, setError] = useState("");

    const handleChange = (e) => {

        setInvitation({

            ...invitation,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await inviteEmployee(invitation);

            setSuccess(true);

            setTimeout(() => {

                navigate(`/projects/${projectId}`);

            }, 1000);

        }
        catch (err) {

            console.log(err);

            setError(
                err.response?.data?.message ||
                "Unable to send invitation."
            );

        }

    };

    return (

        <>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center"
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        width: "100%",
                        maxWidth: 620,
                        borderRadius: 4,
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "grey.200",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
                        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                        "&:hover": {
                            boxShadow: "0 25px 50px -12px rgba(79, 70, 229, 0.15)",
                        },
                    }}
                >

                    <Box
                        sx={{
                            background: "linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)",
                            color: "white",
                            px: { xs: 3, sm: 5 },
                            py: { xs: 4, sm: 5 },
                            position: "relative",
                            overflow: "hidden",
                            "&::after": {
                                content: '""',
                                position: "absolute",
                                top: -40,
                                right: -40,
                                width: 160,
                                height: 160,
                                borderRadius: "50%",
                                background: "rgba(255, 255, 255, 0.1)",
                                pointerEvents: "none",
                            },
                        }}
                    >
                        <Typography variant="h4" fontWeight={800} letterSpacing="-0.02em">
                            Invite Employee
                        </Typography>

                        <Typography sx={{ opacity: 0.88, mt: 1, fontSize: "0.95rem" }}>
                            Invite a team member to collaborate on this project.
                        </Typography>
                    </Box>

                    <Box sx={{ p: { xs: 3, sm: 5 }, background: "#ffffff" }}>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Employee Email"
                                        name="email"
                                        type="email"
                                        value={invitation.email}
                                        onChange={handleChange}
                                        placeholder="john@company.com"
                                        variant="outlined"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 2.5,
                                                backgroundColor: "#f8fafc",
                                                "&:hover fieldset": { borderColor: "#6366f1" },
                                                "&.Mui-focused": {
                                                    backgroundColor: "#ffffff",
                                                },
                                            },
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Project Role"
                                        name="role"
                                        value={invitation.role}
                                        onChange={handleChange}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 2.5,
                                                backgroundColor: "#f8fafc",
                                                "&:hover fieldset": { borderColor: "#6366f1" },
                                                "&.Mui-focused": {
                                                    backgroundColor: "#ffffff",
                                                },
                                            },
                                        }}
                                    >
                                        <MenuItem value="DEVELOPER" sx={{ py: 1.5, borderRadius: 1 }}>
                                            👨‍💻 &nbsp; Developer
                                        </MenuItem>
                                        <MenuItem value="TESTER" sx={{ py: 1.5, borderRadius: 1 }}>
                                            🧪 &nbsp; Tester
                                        </MenuItem>
                                        <MenuItem value="PROJECT_MANAGER" sx={{ py: 1.5, borderRadius: 1 }}>
                                            📋 &nbsp; Project Manager
                                        </MenuItem>
                                    </TextField>
                                </Grid>

                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        startIcon={<MdPersonAdd />}
                                        sx={{
                                            mt: 1,
                                            py: 1.8,
                                            fontSize: "1rem",
                                            fontWeight: 700,
                                            borderRadius: 2.5,
                                            textTransform: "none",
                                            background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                                            boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)",
                                            transition: "all 0.2s ease-in-out",
                                            "&:hover": {
                                                background: "linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%)",
                                                boxShadow: "0 14px 20px -3px rgba(79, 70, 229, 0.4)",
                                                transform: "translateY(-1px)",
                                            },
                                            "&:active": {
                                                transform: "translateY(0)",
                                            },
                                        }}
                                    >
                                        Send Invitation
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Paper>
            </Box>

            <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
                <Alert severity="success" variant="filled" sx={{ borderRadius: 2, fontWeight: 600 }}>
                    Invitation sent successfully 🎉
                </Alert>
            </Snackbar>

            <Snackbar open={error !== ""} autoHideDuration={3000} onClose={() => setError("")}>
                <Alert severity="error" variant="filled" sx={{ borderRadius: 2, fontWeight: 600 }}>
                    {error}
                </Alert>
            </Snackbar>

        </>

    );
}

export default InviteEmployee;