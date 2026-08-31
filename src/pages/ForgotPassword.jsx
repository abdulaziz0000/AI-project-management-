import React, { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Alert
} from "@mui/material";

import axios from "axios";

function ForgotPassword() {

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");
        setError("");

        if (!email.trim()) {
            setError("Please enter your email.");
            return;
        }

        try {

            setLoading(true);

            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`,
                {
                    email: email.trim()
                }
            );

            setMessage(response.data.message);

        } catch (error) {

            console.error(
                "Forgot password error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to process your request."
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
                    Forgot Password
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={3}
                >
                    Enter your email address and we'll
                    send you a password reset link.
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
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
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
                            ? "Sending..."
                            : "Send Reset Link"}
                    </Button>

                </Box>

            </Paper>

        </Box>
    );
}

export default ForgotPassword;