import React, { useState } from "react";
import { askWorkspace } from "../services/workspaceAiService";
import ReactMarkdown from "react-markdown";

import {
    Box,
    Paper,
    Typography,
    TextField,
    IconButton,
    Fab,
    Avatar,
    CircularProgress
} from "@mui/material";

import {
    MdSmartToy,
    MdClose,
    MdSend
} from "react-icons/md";

import { getAuthStorage } from "../utils/authStorage";



function WorkspaceChatbot() {

    const storage = getAuthStorage();

    const token = storage?.getItem("accessToken");

    const organization = JSON.parse(
        storage?.getItem("organization") || "null"
    );

    /*
     * Conversation ID returned by backend.
     *
     * It starts as null.
     *
     * Backend generates the ID for the first question.
     */
    const [conversationId, setConversationId] = useState(null);

    const [open, setOpen] = useState(false);

    const [question, setQuestion] = useState("");

    const [loading, setLoading] = useState(false);

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content:
                "Hi! I'm your Workspace Knowledge Assistant. Ask me about your projects, tasks, blockers, or comments."
        }
    ]);


const askQuestion = async () => {

    if (!question.trim()) {
        return;
    }

    console.log("========== WORKSPACE AI DEBUG ==========");
    console.log("Organization:", organization);
    console.log("Organization ID:", organization?.id);
    console.log("Conversation ID:", conversationId);
    console.log("Question:", question);
    console.log("=========================================");

    const currentQuestion = question.trim();

    setMessages(prev => [
        ...prev,
        {
            role: "user",
            content: currentQuestion
        }
    ]);

    setQuestion("");
    setLoading(true);

    try {

        const response = await askWorkspace(
            organization.id,
            conversationId,
            currentQuestion
        );

        console.log("RAG RESPONSE:", response);

        setConversationId(
            response.conversationId
        );

        setMessages(prev => [
            ...prev,
            {
                role: "assistant",
                content: response.answer
            }
        ]);

    } catch (error) {

        console.error(
            "Workspace RAG request failed:",
            error
        );

        console.error(
            "Response:",
            error.response?.data
        );

        setMessages(prev => [
            ...prev,
            {
                role: "assistant",
                content:
                    "Sorry, I couldn't retrieve information from your workspace."
            }
        ]);

    } finally {

        setLoading(false);

    }
};


    const handleKeyDown = (event) => {

        if (event.key === "Enter" && !event.shiftKey) {

            event.preventDefault();

            askQuestion();

        }

    };


    return (
        <>
            {/* =====================================================
                CHAT TOGGLE BUTTON
            ====================================================== */}
{/* =====================================================
    CHAT TOGGLE BUTTON
====================================================== */}
{!open && (
    <Button
        variant="contained"
        startIcon={<MdSmartToy />}
        onClick={() => setOpen(true)}
        sx={{
            position: "fixed",
            right: { xs: 16, sm: 24, md: 30 },
            bottom: { xs: 16, sm: 24, md: 30 },

            minWidth: { xs: 56, sm: 150 },
            width: { xs: 56, sm: "auto" },
            height: { xs: 56, sm: 52 },

            px: { xs: 0, sm: 2.5 },

            borderRadius: 3,
            zIndex: 2000,

            textTransform: "none",
            fontWeight: 700,

            whiteSpace: "nowrap",

            boxShadow: "0 8px 25px rgba(37,99,235,.35)",

            "&:hover": {
                boxShadow: "0 10px 30px rgba(37,99,235,.45)"
            },

            // Hide text on mobile
            "& .MuiButton-startIcon": {
                margin: { xs: 0, sm: "0 8px 0 0" }
            }
        }}
    >
        <Box
            component="span"
            sx={{
                display: { xs: "none", sm: "inline" }
            }}
        >
            Ask AI
        </Box>
    </Button>
)}



            {/* =====================================================
                CHAT WINDOW
            ====================================================== */}

            {open && (

                <Paper
                    elevation={10}
                   sx={{
    position: "fixed",

    right: {
        xs: 8,
        sm: 16,
        md: 30
    },

    bottom: {
        xs: 8,
        sm: 16,
        md: 30
    },

    width: {
        xs: "calc(100vw - 16px)",
        sm: 380,
        md: 380
    },

    height: {
        xs: "calc(100vh - 16px)",
        sm: 560,
        md: 560
    },

    maxWidth: "100vw",
    maxHeight: "calc(100vh - 16px)",

    borderRadius: {
        xs: 2,
        sm: 4
    },

    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    zIndex: 2000
}}
                >

                    {/* ================= HEADER ================= */}

                    <Box
                        sx={{
                            background:
                                "linear-gradient(135deg,#4F46E5,#2563EB)",
                            color: "white",
                            p: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                                "space-between"
                        }}
                    >

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5
                            }}
                        >

                            <Avatar
                                sx={{
                                    background:
                                        "rgba(255,255,255,0.2)"
                                }}
                            >
                                <MdSmartToy />
                            </Avatar>

                            <Box>

                                <Typography
                                    fontWeight={700}
                                >
                                     AI Assistant
                                </Typography>

                                <Typography
                                    variant="caption"
                                    sx={{
                                        opacity: 0.8
                                    }}
                                >
                                    Ask about your workspace
                                </Typography>

                            </Box>

                        </Box>


                        <IconButton
                            onClick={() => setOpen(false)}
                            sx={{
                                color: "white"
                            }}
                        >

                            <MdClose />




                        </IconButton>

                    </Box>


                    {/* ================= MESSAGES ================= */}

                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            p: 2,
                            background: "#F5F7FA"
                        }}
                    >

                        {messages.map(
                            (message, index) => (

                                <Box
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        justifyContent:
                                            message.role ===
                                            "user"
                                                ? "flex-end"
                                                : "flex-start",
                                        mb: 2
                                    }}
                                >

                                    <Box
                                        sx={{
                                            maxWidth: "80%",
                                            background:
                                                message.role ===
                                                "user"
                                                    ? "#2563EB"
                                                    : "white",
                                            color:
                                                message.role ===
                                                "user"
                                                    ? "white"
                                                    : "#222",
                                            padding: "10px 14px",
                                            borderRadius: 3,
                                            boxShadow:
                                                message.role ===
                                                "assistant"
                                                    ? 1
                                                    : 0
                                        }}
                                    >

                                       <ReactMarkdown
    components={{
        p: ({ children }) => (
            <Typography
                variant="body2"
                sx={{ mb: 1 }}
            >
                {children}
            </Typography>
        ),

        strong: ({ children }) => (
            <strong>{children}</strong>
        ),

        li: ({ children }) => (
            <li>
                <Typography variant="body2">
                    {children}
                </Typography>
            </li>
        ),

        ul: ({ children }) => (
            <Box
                component="ul"
                sx={{
                    pl: 2.5,
                    mb: 1
                }}
            >
                {children}
            </Box>
        ),

        ol: ({ children }) => (
            <Box
                component="ol"
                sx={{
                    pl: 2.5,
                    mb: 1
                }}
            >
                {children}
            </Box>
        ),

        h1: ({ children }) => (
            <Typography
                variant="h6"
                fontWeight={700}
                sx={{ mb: 1 }}
            >
                {children}
            </Typography>
        ),

        h2: ({ children }) => (
            <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{ mb: 1 }}
            >
                {children}
            </Typography>
        ),

        h3: ({ children }) => (
            <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{ mb: 1 }}
            >
                {children}
            </Typography>
        )
    }}
>
    {message.content}
</ReactMarkdown>

                                    </Box>

                                </Box>

                            )
                        )}


                        {/* AI LOADING */}

                        {loading && (

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent:
                                        "flex-start",
                                    mb: 2
                                }}
                            >

                                <Box
                                    sx={{
                                        background: "white",
                                        padding:
                                            "10px 14px",
                                        borderRadius: 3
                                    }}
                                >

                                    <CircularProgress
                                        size={18}
                                    />

                                </Box>

                            </Box>

                        )}

                    </Box>


                    {/* ================= INPUT ================= */}

                   <Box
    sx={{
        p: { xs: 1, sm: 1.5 },
        borderTop: "1px solid #eee",
        display: "flex",
        alignItems: "center",
        gap: 1,
        background: "white",
        minWidth: 0
    }}
>

                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Ask about your workspace..."
                            value={question}
                            onChange={(event) =>
                                setQuestion(
                                    event.target.value
                                )
                            }
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                        />

                        <IconButton
                            color="primary"
                            onClick={askQuestion}
                            disabled={
                                loading ||
                                !question.trim()
                            }
                        >

                            <MdSend />

                        </IconButton>

                    </Box>

                </Paper>

            )}

        </>
    );
}

export default WorkspaceChatbot;