import React, { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Alert
} from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPassword() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");
        setError("");

        if (!token) {
            setError("Invalid or missing reset token.");
            return;
        }

        if (!password || !confirmPassword) {
            setError("Please enter both passwords.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        try {

            setLoading(true);

            const response = await axios.post(
               `${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`,
                {
                    token: token,
                    newPassword: password
                }
            );

            setMessage(
                response.data.message ||
                "Password reset successfully."
            );

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (error) {

            console.error(
                "Reset password error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to reset password."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f5f7fa"
            }}
        >

            <Paper
                elevation={4}
                sx={{
                    width: 400,
                    p: 4,
                    borderRadius: 3
                }}
            >

                <Typography
                    variant="h5"
                    fontWeight={700}
                    mb={1}
                >
                    Reset Password
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={3}
                >
                    Enter your new password below.
                </Typography>

                {message && (
                    <Alert
                        severity="success"
                        sx={{ mb: 2 }}
                    >
                        {message}
                    </Alert>
                )}

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>
                )}

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >

                    <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) =>
                            setConfirmPassword(event.target.value)
                        }
                        sx={{ mb: 2 }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Resetting..."
                            : "Reset Password"}
                    </Button>

                </Box>

            </Paper>

        </Box>
    );
}

export default ResetPassword;