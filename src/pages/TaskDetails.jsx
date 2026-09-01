import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    Box,
    Typography,
    Paper,
    Chip,
    Divider,
    Stack,
    Avatar,
    Button,
    CircularProgress,
    Snackbar,
    Alert,
    TextField,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    useTheme,
    useMediaQuery
} from "@mui/material";

import {
    MdArrowBack,
    MdEdit,
    MdDelete,
    MdPerson,
    MdCalendarToday,
    MdSend,
    MdAccessTime,
    MdChatBubbleOutline
} from "react-icons/md";

import {
    getTaskSummary,
    getTaskRisk,
    getActionItems
} from "../services/taskAiService";

import {
    getTaskComments,
    addComment,
    deleteComment,
    updateComment
} from "../services/commentService";



import {
    getTaskById,
    updateTask,
    deleteTask
} from "../services/taskService";
import { formatCommentTime } from "../utils/dateUtils";


/* =========================================================
   AVATAR COLORS
========================================================= */

const AVATAR_COLORS = [
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
    "#F59E0B",
    "#10B981",
    "#06B6D4",
    "#EF4444"
];


const getAvatarColor = (name = "") => {

    let hash = 0;

    for (let i = 0; i < name.length; i++) {
        hash =
            name.charCodeAt(i) +
            ((hash << 5) - hash);
    }

    return AVATAR_COLORS[
        Math.abs(hash) % AVATAR_COLORS.length
    ];
};


/* =========================================================
   COMMENT TIME
========================================================= */




/* =========================================================
   COMPONENT
========================================================= */

function TaskDetails() {

    const { taskId } = useParams();

    const navigate = useNavigate();

    const theme = useTheme();

    const isMobile =
        useMediaQuery(
            theme.breakpoints.down("md")
        );

    const isSmallMobile =
        useMediaQuery(
            theme.breakpoints.down("sm")
        );


    /* =====================================================
       STATE
    ===================================================== */

    const [task, setTask] =
        useState(null);

    const [comments, setComments] =
        useState([]);

    const [newComment, setNewComment] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    /* =====================================================
       AI STATE
    ===================================================== */

    const [aiDialog, setAiDialog] =
        useState(null);

    const [summary, setSummary] =
        useState(null);

    const [risk, setRisk] =
        useState(null);

    const [actionItems, setActionItems] =
        useState([]);

    const [aiLoading, setAiLoading] =
        useState(false);

    const [aiError, setAiError] =
        useState("");

    const [aiNoComments, setAiNoComments] =
        useState(false);


    /* =====================================================
       EDIT TASK
    ===================================================== */

    const [openEdit, setOpenEdit] =
        useState(false);

    const [editTask, setEditTask] =
        useState({
            title: "",
            description: "",
            priority: "",
            status: ""
        });


    /* =====================================================
       EDIT COMMENT
    ===================================================== */

    const [editingCommentId, setEditingCommentId] =
        useState(null);

    const [editingCommentText, setEditingCommentText] =
        useState("");


    /* =====================================================
       FETCH TASK
    ===================================================== */

    useEffect(() => {

        const fetchTask = async () => {

            try {

                const taskData =
                    await getTaskById(taskId);

                setTask(taskData);


                const commentData =
                    await getTaskComments(taskId);

                setComments(commentData);

            } catch (err) {

                console.error(err);

                setError(
                    "Unable to load task details"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchTask();

    }, [taskId]);

const [, setTimeTick] = useState(0);

useEffect(() => {
    const interval = setInterval(() => {
        setTimeTick((tick) => tick + 1);
    }, 60000); // update every minute

    return () => clearInterval(interval);
}, []);

    /* =====================================================
       EDIT TASK
    ===================================================== */

    const handleEditTask = () => {

        setEditTask({
            title:
                task.title ||
                task.name ||
                "",

            description:
                task.description || "",

            priority:
                task.priority || "",

            status:
                task.status || ""
        });

        setOpenEdit(true);

    };


    const handleSaveTask = async () => {

        try {

            const updated =
                await updateTask(
                    task.id,
                    {
                        ...task,
                        ...editTask
                    }
                );

            setTask(updated);

            setOpenEdit(false);

        } catch (err) {

            console.error(err);

            setError(
                "Unable to update task"
            );

        }

    };


    /* =====================================================
       DELETE TASK
    ===================================================== */

    const handleDeleteTask = async () => {

        const confirmDelete =
            window.confirm(
                "Delete this task?"
            );

        if (!confirmDelete)
            return;

        try {

            await deleteTask(task.id);

            navigate(-1);

        } catch (err) {

            console.error(err);

            setError(
                "Unable to delete task"
            );

        }

    };


    /* =====================================================
       PRIORITY COLORS
    ===================================================== */

    const getPriorityColor = (
        priority
    ) => {

        switch (priority) {

            case "HIGH":
                return {
                    bg: "#FFEBEE",
                    text: "#D32F2F"
                };

            case "MEDIUM":
                return {
                    bg: "#FFF3E0",
                    text: "#ED6C02"
                };

            case "LOW":
                return {
                    bg: "#E8F5E9",
                    text: "#2E7D32"
                };

            default:
                return {
                    bg: "#F5F5F5",
                    text: "#616161"
                };
        }

    };


    /* =====================================================
       STATUS COLORS
    ===================================================== */

    const getStatusColor = (
        status
    ) => {

        switch (status) {

            case "COMPLETED":
                return {
                    bg: "#E8F5E9",
                    text: "#2E7D32"
                };

            case "IN_PROGRESS":
                return {
                    bg: "#E3F2FD",
                    text: "#0288D1"
                };

            case "PENDING":
            default:
                return {
                    bg: "#F5F5F5",
                    text: "#616161"
                };
        }

    };


    /* =====================================================
       AI SUMMARY
    ===================================================== */

    const handleSummary = async () => {

        setAiDialog("summary");
        setAiError("");

        if (comments.length === 0) {
            setAiNoComments(true);
            return;
        }

        setAiNoComments(false);

        try {

            setAiLoading(true);

            const data =
                await getTaskSummary(
                    taskId
                );

            setSummary(data);

        } catch (error) {

            console.error(
                "AI Summary Error:",
                error
            );

            setAiError(
                "Failed to generate AI summary."
            );

        } finally {

            setAiLoading(false);

        }

    };


    /* =====================================================
       AI RISK
    ===================================================== */

    const handleRisk = async () => {

        setAiDialog("risk");
        setAiError("");

        if (comments.length === 0) {
            setAiNoComments(true);
            return;
        }

        setAiNoComments(false);

        try {

            setAiLoading(true);

            const data =
                await getTaskRisk(
                    taskId
                );

            setRisk(data);

        } catch (error) {

            console.error(
                "AI Risk Error:",
                error
            );

            setAiError(
                "Failed to analyze task risk."
            );

        } finally {

            setAiLoading(false);

        }

    };


    /* =====================================================
       AI ACTION ITEMS
    ===================================================== */

    const handleActionItems = async () => {

        setAiDialog("actions");
        setAiError("");

        if (comments.length === 0) {
            setAiNoComments(true);
            return;
        }

        setAiNoComments(false);

        try {

            setAiLoading(true);

            const data =
                await getActionItems(
                    taskId
                );

            setActionItems(
                data.actionItems || []
            );

        } catch (error) {

            console.error(
                "Action Item Error:",
                error
            );

            setAiError(
                "Failed to extract action items."
            );

        } finally {

            setAiLoading(false);

        }

    };


    /* =====================================================
       ADD COMMENT
    ===================================================== */

    const handleAddComment = async () => {

        try {

            if (!newComment.trim())
                return;

            const commentPayload = {

                message:
                    newComment,

                taskId,

                userId:
                    localStorage.getItem(
                        "userId"
                    )

            };

            const saved =
                await addComment(
                    commentPayload
                );

            setComments(
                (prev) => [
                    ...prev,
                    saved
                ]
            );

            setNewComment("");

        } catch (err) {

            console.error(err);

            setError(
                "Unable to add comment"
            );

        }

    };


    /* =====================================================
       EDIT COMMENT
    ===================================================== */

    const handleEditComment = (
        comment
    ) => {

        setEditingCommentId(
            comment.id
        );

        setEditingCommentText(
            comment.message
        );

    };


    const handleCancelEditComment = () => {

        setEditingCommentId(null);

        setEditingCommentText("");

    };


    const handleSaveEditComment = async (
        commentId
    ) => {

        try {

            if (!editingCommentText.trim())
                return;

            const updated =
                await updateComment(
                    commentId,
                    {
                        message:
                            editingCommentText
                    }
                );

            setComments(
                (prev) =>
                    prev.map(
                        (c) =>
                            c.id === commentId
                                ? updated
                                : c
                    )
            );

            setEditingCommentId(null);

            setEditingCommentText("");

        } catch (err) {

            console.error(err);

            setError(
                "Unable to update comment"
            );

        }

    };


    /* =====================================================
       DELETE COMMENT
    ===================================================== */

    const handleDeleteComment = async (
        id
    ) => {

        try {

            await deleteComment(id);

            setComments(
                (prev) =>
                    prev.filter(
                        (comment) =>
                            comment.id !== id
                    )
            );

        } catch (err) {

            console.error(err);

            setError(
                "Unable to delete comment"
            );

        }

    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh"
                }}
            >

                <CircularProgress
                    size={48}
                    thickness={4}
                />

            </Box>

        );

    }


    if (!task)
        return null;


    const priorityTheme =
        getPriorityColor(
            task.priority
        );

    const statusTheme =
        getStatusColor(
            task.status
        );


    /* =====================================================
       MAIN UI
    ===================================================== */

    return (

    <Box
    sx={{
        width: "100%",
        minHeight: "100vh",
        background: "#F8FAFC",
        overflowX: "hidden"
    }}
>
    <Box
        sx={{
            width: "100%",
            maxWidth: "1200px",
            mx: "auto",
            px: {
                xs: 1.5,
                sm: 2.5,
                md: 4
            },
            pt: {
                xs: 8,
                sm: 10,
                md: 5
            },
            pb: 5,
            boxSizing: "border-box"
        }}
    >


            



                {/* =================================================
                    BACK BUTTON
                ================================================= */}

                <Button
                    startIcon={
                        <MdArrowBack />
                    }

                    onClick={() =>
                        navigate(-1)
                    }

                    sx={{
                        mb: {
                            xs: 2,
                            sm: 3
                        },

                        color:
                            "text.secondary",

                        textTransform:
                            "none",

                        fontWeight: 600,

                        borderRadius: 2,

                        fontSize: {
                            xs: "0.85rem",
                            sm: "0.9rem"
                        },

                        "&:hover": {
                            background:
                                "rgba(0,0,0,0.04)"
                        }
                    }}
                >

                    Back to Tasks

                </Button>


                {/* =================================================
                    MAIN CARD
                ================================================= */}

                <Paper
                    elevation={0}

                    sx={{
                        p: {
                            xs: 2,
                            sm: 3,
                            md: 4
                        },

                        borderRadius: {
                            xs: 2.5,
                            sm: 4
                        },

                        border:
                            "1px solid",

                        borderColor:
                            "divider",

                        background:
                            "#FFFFFF",

                        width: "100%",

                        boxSizing:
                            "border-box"
                    }}
                >


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row"
                        }}

                        justifyContent="space-between"

                        alignItems={{
                            xs: "stretch",
                            sm: "center"
                        }}

                        spacing={2}
                    >

                        <Box
                            sx={{
                                minWidth: 0,
                                width: "100%"
                            }}
                        >

                            <Typography
                                variant="h5"
                                fontWeight={700}
                                color="#0F172A"
                                mb={1.5}

                                sx={{
                                    fontSize: {
                                        xs: "1.25rem",
                                        sm: "1.5rem"
                                    },

                                    wordBreak:
                                        "break-word"
                                }}
                            >

                                {
                                    task.title ||
                                    task.name
                                }

                            </Typography>


                            {/* STATUS + PRIORITY */}

                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                flexWrap="wrap"
                                useFlexGap
                            >

                                <Chip
                                    label={
                                        task.status
                                            ?.replace(
                                                "_",
                                                " "
                                            )
                                    }

                                    size="small"

                                    sx={{
                                        backgroundColor:
                                            statusTheme.bg,

                                        color:
                                            statusTheme.text,

                                        fontWeight: 700,

                                        fontSize:
                                            "0.72rem",

                                        borderRadius:
                                            "6px"
                                    }}
                                />


                                <Chip
                                    label={
                                        `${task.priority} PRIORITY`
                                    }

                                    size="small"

                                    sx={{
                                        backgroundColor:
                                            priorityTheme.bg,

                                        color:
                                            priorityTheme.text,

                                        fontWeight: 700,

                                        fontSize:
                                            "0.72rem",

                                        borderRadius:
                                            "6px"
                                    }}
                                />

                            </Stack>

                        </Box>


                        {/* =================================================
                            TOP ACTIONS
                        ================================================= */}

                        <Stack
                            direction="row"
                            spacing={1}

                            sx={{
                                alignSelf: {
                                    xs: "flex-end",
                                    sm: "auto"
                                }
                            }}
                        >

                            <Tooltip
                                title="Edit Task"
                            >

                                <IconButton
                                    onClick={
                                        handleEditTask
                                    }
                                    size={
                                        isMobile
                                            ? "small"
                                            : "medium"
                                    }
                                >

                                    <MdEdit />

                                </IconButton>

                            </Tooltip>


                            <Tooltip
                                title="Delete Task"
                            >

                                <IconButton
                                    color="error"
                                    onClick={
                                        handleDeleteTask
                                    }

                                    size={
                                        isMobile
                                            ? "small"
                                            : "medium"
                                    }
                                >

                                    <MdDelete />

                                </IconButton>

                            </Tooltip>

                        </Stack>

                    </Stack>


                    <Divider
                        sx={{
                            my: {
                                xs: 2.5,
                                sm: 3.5
                            }
                        }}
                    />


                    {/* =================================================
                        METADATA
                    ================================================= */}

                    <Stack

                        direction={{
                            xs: "column",
                            sm: "row"
                        }}

                        spacing={{
                            xs: 2,
                            sm: 4
                        }}

                        sx={{
                            background:
                                "#F8FAFC",

                            p: {
                                xs: 1.75,
                                sm: 2.5
                            },

                            borderRadius: 3,

                            border:
                                "1px solid #F1F5F9"
                        }}
                    >

                        {/* ASSIGNED TO */}

                        <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                        >

                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    bgcolor:
                                        "#3B82F6",
                                    fontSize:
                                        "0.9rem",
                                    fontWeight: 700
                                }}
                            >

                                {
                                    task.assignedToName
                                        ?.charAt(0)
                                        ||
                                    <MdPerson />
                                }

                            </Avatar>


                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                    fontWeight={500}
                                >

                                    Assigned To

                                </Typography>


                                <Typography
                                    fontWeight="600"
                                    variant="body2"
                                    color="#1E293B"
                                >

                                    {
                                        task.assignedToName ||
                                        "Unassigned"
                                    }

                                </Typography>

                            </Box>

                        </Stack>


                        {/* DUE DATE */}

                        <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                        >

                            <Box
                                sx={{
                                    p: 1,
                                    borderRadius:
                                        "50%",
                                    bgcolor:
                                        "#E0F2FE",
                                    color:
                                        "#0369A1",
                                    display:
                                        "flex"
                                }}
                            >

                                <MdCalendarToday
                                    size={18}
                                />

                            </Box>


                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                    fontWeight={500}
                                >

                                    Due Date

                                </Typography>


                                <Typography
                                    fontWeight="600"
                                    variant="body2"
                                    color="#1E293B"
                                >

                                    {
                                        task.dueDate ||
                                        "No due date"
                                    }

                                </Typography>

                            </Box>

                        </Stack>

                    </Stack>


                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    <Box
                        sx={{
                            mt: {
                                xs: 3,
                                sm: 4
                            }
                        }}
                    >

                        <Typography
                            variant="subtitle1"
                            fontWeight="700"
                            color="#0F172A"
                            mb={1}
                        >

                            Description

                        </Typography>


                        <Typography
                            color="text.secondary"

                            sx={{
                                lineHeight: 1.7,

                                whiteSpace:
                                    "pre-line",

                                fontSize: {
                                    xs:
                                        "0.875rem",
                                    sm:
                                        "0.95rem"
                                },

                                wordBreak:
                                    "break-word"
                            }}
                        >

                            {
                                task.description ||
                                "No description provided for this task."
                            }

                        </Typography>

                    </Box>


                    <Divider
                        sx={{
                            my: {
                                xs: 3,
                                sm: 4
                            }
                        }}
                    />


                    {/* =================================================
                        COMMENTS
                    ================================================= */}

                    <Box>

                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            mb={3}
                        >

                            <MdChatBubbleOutline
                                size={20}
                                color="#475569"
                            />

                            <Typography
                                variant="h6"
                                fontWeight="700"
                                color="#0F172A"

                                sx={{
                                    fontSize: {
                                        xs:
                                            "1.05rem",
                                        sm:
                                            "1.25rem"
                                    }
                                }}
                            >

                                Discussion (
                                {comments.length}
                                )

                            </Typography>

                        </Stack>


                        {/* =================================================
                            COMMENT INPUT
                        ================================================= */}

                        <Paper
                            elevation={0}

                            sx={{
                                p: {
                                    xs: 1.5,
                                    sm: 2
                                },

                                border:
                                    "1px solid",

                                borderColor:
                                    "divider",

                                borderRadius: 3,

                                mb: {
                                    xs: 2.5,
                                    sm: 4
                                },

                                background:
                                    "#FAFAFA"
                            }}
                        >

                            <TextField
                                fullWidth
                                multiline
                                rows={
                                    isSmallMobile
                                        ? 3
                                        : 3
                                }

                                placeholder=
                                    "Add a comment..."

                                variant="standard"

                                InputProps={{
                                    disableUnderline:
                                        true
                                }}

                                value={
                                    newComment
                                }

                                onChange={(e) =>
                                    setNewComment(
                                        e.target.value
                                    )
                                }

                                sx={{
                                    px: 1
                                }}
                            />


                            <Stack
                                direction="row"
                                justifyContent="flex-end"
                                mt={1}
                            >

                                <Button
                                    variant="contained"

                                    endIcon={
                                        <MdSend />
                                    }

                                    onClick={
                                        handleAddComment
                                    }

                                    disabled={
                                        !newComment.trim()
                                    }

                                    sx={{
                                        borderRadius: 2,

                                        px: {
                                            xs: 2,
                                            sm: 3
                                        },

                                        textTransform:
                                            "none",

                                        fontWeight: 600,

                                        boxShadow:
                                            "none"
                                    }}
                                >

                                    Comment

                                </Button>

                            </Stack>

                        </Paper>


                        {/* =================================================
                            COMMENTS LIST
                        ================================================= */}

                        <Box
                            sx={{
                                maxHeight:
                                    comments.length > 4
                                        ? {
                                            xs: 450,
                                            sm: 560
                                        }
                                        : "none",

                                overflowY:
                                    comments.length > 4
                                        ? "auto"
                                        : "visible",

                                pr:
                                    comments.length > 4
                                        ? 1
                                        : 0
                            }}
                        >

                            <Stack spacing={1.75}>

                                {comments.length === 0 ? (

                                    <Box
                                        sx={{
                                            textAlign:
                                                "center",

                                            py: 5,

                                            color:
                                                "text.secondary"
                                        }}
                                    >

                                        <MdChatBubbleOutline
                                            size={28}
                                            color="#CBD5E1"
                                        />

                                        <Typography
                                            variant="body2"
                                            fontStyle="italic"
                                            mt={1}
                                        >

                                            No comments yet.
                                            Start the
                                            conversation!

                                        </Typography>

                                    </Box>

                                ) : (

                                    comments.map(
                                        (comment) => {

                                            const avatarColor =
                                                getAvatarColor(
                                                    comment.userName
                                                );

                                            const isEditing =
                                                editingCommentId ===
                                                comment.id;


                                            return (

                                                <Paper
                                                    key={
                                                        comment.id
                                                    }

                                                    elevation={0}

                                                    sx={{
                                                        p: {
                                                            xs: 1.5,
                                                            sm: 2.25
                                                        },

                                                        borderRadius:
                                                            3,

                                                        border:
                                                            "1px solid",

                                                        borderColor:
                                                            isEditing
                                                                ? avatarColor
                                                                : "#F1F5F9",

                                                        background:
                                                            "#FFFFFF",

                                                        overflow:
                                                            "hidden"
                                                    }}
                                                >

                                                    <Stack
                                                        direction="row"
                                                        spacing={{
                                                            xs: 1,
                                                            sm: 1.5
                                                        }}

                                                        alignItems="flex-start"
                                                    >

                                                        {/* AVATAR */}

                                                        <Avatar
                                                            sx={{
                                                                width: {
                                                                    xs: 34,
                                                                    sm: 38
                                                                },

                                                                height: {
                                                                    xs: 34,
                                                                    sm: 38
                                                                },

                                                                bgcolor:
                                                                    avatarColor,

                                                                fontSize:
                                                                    "0.85rem",

                                                                fontWeight: 700,

                                                                flexShrink:
                                                                    0
                                                            }}
                                                        >

                                                            {
                                                                comment.userName
                                                                    ?.charAt(
                                                                        0
                                                                    )
                                                                    ?.toUpperCase()
                                                                    ||
                                                                <MdPerson />
                                                            }

                                                        </Avatar>


                                                        {/* COMMENT */}

                                                        <Box
                                                            sx={{
                                                                flex: 1,
                                                                minWidth: 0
                                                            }}
                                                        >

                                                            <Stack
                                                                direction={{
                                                                    xs:
                                                                        "column",
                                                                    sm:
                                                                        "row"
                                                                }}

                                                                justifyContent="space-between"

                                                                alignItems={{
                                                                    xs:
                                                                        "stretch",
                                                                    sm:
                                                                        "flex-start"
                                                                }}
                                                            >

                                                                <Box>

                                                                    <Typography
                                                                        fontWeight={700}
                                                                        variant="body2"
                                                                        color="#0F172A"
                                                                        sx={{
                                                                            wordBreak:
                                                                                "break-word"
                                                                        }}
                                                                    >

                                                                        {
                                                                            comment.userName
                                                                        }

                                                                    </Typography>


{comment.createdAt && (
    <Typography
        variant="caption"
        color="text.secondary"
        sx={{
            fontSize: "0.72rem"
        }}
    >
        {formatCommentTime(comment.createdAt)}
    </Typography>
)}

                                                                </Box>


                                                                {/* COMMENT ACTIONS */}

                                                                {comment.canEdit &&
                                                                    !isEditing && (

                                                                        <Stack
                                                                            direction="row"
                                                                            spacing={
                                                                                0.5
                                                                            }

                                                                            sx={{
                                                                                alignSelf:
                                                                                    {
                                                                                        xs:
                                                                                            "flex-end",
                                                                                        sm:
                                                                                            "auto"
                                                                                    },

                                                                                mt:
                                                                                    {
                                                                                        xs:
                                                                                            0.5,
                                                                                        sm:
                                                                                            0
                                                                                    }
                                                                            }}
                                                                        >

                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={() =>
                                                                                    handleEditComment(
                                                                                        comment
                                                                                    )
                                                                                }
                                                                            >

                                                                                <MdEdit
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                />

                                                                            </IconButton>


                                                                            <IconButton
                                                                                size="small"
                                                                                color="error"
                                                                                onClick={() =>
                                                                                    handleDeleteComment(
                                                                                        comment.id
                                                                                    )
                                                                                }
                                                                            >

                                                                                <MdDelete
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                />

                                                                            </IconButton>

                                                                        </Stack>

                                                                    )}

                                                            </Stack>


                                                            {/* EDIT COMMENT */}

                                                            {isEditing ? (

                                                                <Box
                                                                    sx={{
                                                                        mt: 1.25
                                                                    }}
                                                                >

                                                                    <TextField
                                                                        fullWidth
                                                                        multiline
                                                                        size="small"
                                                                        value={
                                                                            editingCommentText
                                                                        }

                                                                        onChange={(e) =>
                                                                            setEditingCommentText(
                                                                                e.target.value
                                                                            )
                                                                        }

                                                                        autoFocus
                                                                    />


                                                                    <Stack
                                                                        direction="row"
                                                                        spacing={1}
                                                                        justifyContent="flex-end"
                                                                        mt={1}
                                                                    >

                                                                        <Button
                                                                            size="small"
                                                                            onClick={
                                                                                handleCancelEditComment
                                                                            }
                                                                        >

                                                                            Cancel

                                                                        </Button>


                                                                        <Button
                                                                            size="small"
                                                                            variant="contained"

                                                                            onClick={() =>
                                                                                handleSaveEditComment(
                                                                                    comment.id
                                                                                )
                                                                            }

                                                                            disabled={
                                                                                !editingCommentText.trim()
                                                                            }

                                                                            sx={{
                                                                                boxShadow:
                                                                                    "none"
                                                                            }}
                                                                        >

                                                                            Save

                                                                        </Button>

                                                                    </Stack>

                                                                </Box>

                                                            ) : (

                                                                <Typography
                                                                    color="#334155"
                                                                    variant="body2"

                                                                    sx={{
                                                                        mt: 0.75,

                                                                        lineHeight:
                                                                            1.6,

                                                                        wordBreak:
                                                                            "break-word"
                                                                    }}
                                                                >

                                                                    {
                                                                        comment.message
                                                                    }

                                                                </Typography>

                                                            )}

                                                        </Box>

                                                    </Stack>

                                                </Paper>

                                            );

                                        }
                                    )

                                )}

                            </Stack>

                        </Box>

                    </Box>


                    {/* =================================================
                        AI ASSISTANT
                    ================================================= */}

                    <Box
                        sx={{
                            mt: {
                                xs: 3,
                                sm: 4
                            }
                        }}
                    >

                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            mb={2}
                        >

                            <Typography
                                variant="h6"
                                fontWeight={700}

                                sx={{
                                    fontSize: {
                                        xs:
                                            "1.05rem",
                                        sm:
                                            "1.25rem"
                                    }
                                }}
                            >

                                ✨ AI Assistant

                            </Typography>

                        </Stack>


                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row"
                            }}

                            spacing={1.5}

                            sx={{
                                width: "100%"
                            }}
                        >

                            <Button
                                variant="contained"
                                onClick={
                                    handleSummary
                                }

                                fullWidth={
                                    isSmallMobile
                                }

                                sx={{
                                    textTransform:
                                        "none",

                                    borderRadius: 2,

                                    minHeight: 42
                                }}
                            >

                                ✨ AI Summary

                            </Button>


                            <Button
                                variant="outlined"
                                color="warning"
                                onClick={
                                    handleRisk
                                }

                                fullWidth={
                                    isSmallMobile
                                }

                                sx={{
                                    textTransform:
                                        "none",

                                    borderRadius: 2,

                                    minHeight: 42
                                }}
                            >

                                ⚠ Risk Analysis

                            </Button>


                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={
                                    handleActionItems
                                }

                                fullWidth={
                                    isSmallMobile
                                }

                                sx={{
                                    textTransform:
                                        "none",

                                    borderRadius: 2,

                                    minHeight: 42
                                }}
                            >

                                🎯 Action Items

                            </Button>

                        </Stack>

                    </Box>


                    {/* =================================================
                        AI DIALOG
                    ================================================= */}

                    <Dialog
                        open={
                            aiDialog !== null
                        }

                        onClose={() => {

                            if (!aiLoading) {
                                setAiDialog(null);
                            }

                        }}

                        fullWidth

                        fullScreen={
                            isSmallMobile
                        }

                        maxWidth="md"
                    >

                        <DialogTitle
                            sx={{
                                fontWeight: 700
                            }}
                        >

                            {aiDialog === "summary" &&
                                "✨ AI Task Summary"}

                            {aiDialog === "risk" &&
                                "⚠ AI Risk Analysis"}

                            {aiDialog === "actions" &&
                                "🎯 AI Suggested Tasks"}

                        </DialogTitle>


                        <DialogContent
                            dividers
                        >

                            {aiNoComments ? (

                                <Box
                                    sx={{
                                        display:
                                            "flex",

                                        flexDirection:
                                            "column",

                                        alignItems:
                                            "center",

                                        justifyContent:
                                            "center",

                                        textAlign:
                                            "center",

                                        minHeight:
                                            160,

                                        color:
                                            "text.secondary"
                                    }}
                                >

                                    <MdChatBubbleOutline
                                        size={32}
                                        color="#CBD5E1"
                                    />

                                    <Typography
                                        sx={{
                                            mt: 1.5,
                                            fontWeight: 600
                                        }}
                                        color="text.primary"
                                    >

                                        No comments yet

                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mt: 0.5,
                                            maxWidth: 340
                                        }}
                                    >

                                        Add a comment to this
                                        task so the AI has
                                        something to work
                                        with.

                                    </Typography>

                                </Box>

                            ) : aiLoading ? (

                                <Box
                                    sx={{
                                        display:
                                            "flex",

                                        justifyContent:
                                            "center",

                                        alignItems:
                                            "center",

                                        minHeight:
                                            200
                                    }}
                                >

                                    <CircularProgress />

                                </Box>

                            ) : aiError ? (

                                <Typography
                                    color="error"
                                >

                                    {aiError}

                                </Typography>

                            ) : (

                                <>

                                    {/* SUMMARY */}

                                    {aiDialog ===
                                        "summary" &&
                                        summary && (

                                            <Stack spacing={3}>

                                                <Box>

                                                    <Typography
                                                        variant="subtitle1"
                                                        fontWeight="bold"
                                                    >

                                                        Current Status

                                                    </Typography>

                                                    <Typography>

                                                        {
                                                            summary.currentStatus
                                                        }

                                                    </Typography>

                                                </Box>


                                                <Divider />


                                                <Box>

                                                    <Typography
                                                        variant="subtitle1"
                                                        fontWeight="bold"
                                                    >

                                                        Key Decisions

                                                    </Typography>


                                                    {summary.keyDecisions?.length >
                                                    0 ? (

                                                        summary.keyDecisions.map(
                                                            (
                                                                decision,
                                                                index
                                                            ) => (

                                                                <Typography
                                                                    key={
                                                                        index
                                                                    }

                                                                    sx={{
                                                                        mt: 0.5
                                                                    }}
                                                                >

                                                                    •{" "}
                                                                    {
                                                                        decision
                                                                    }

                                                                </Typography>

                                                            )
                                                        )

                                                    ) : (

                                                        <Typography
                                                            color="text.secondary"
                                                        >

                                                            No key decisions
                                                            identified.

                                                        </Typography>

                                                    )}

                                                </Box>


                                                <Divider />


                                                <Box>

                                                    <Typography
                                                        variant="subtitle1"
                                                        fontWeight="bold"
                                                    >

                                                        Blockers

                                                    </Typography>


                                                    {summary.blockers?.length >
                                                    0 ? (

                                                        summary.blockers.map(
                                                            (
                                                                blocker,
                                                                index
                                                            ) => (

                                                                <Typography
                                                                    key={
                                                                        index
                                                                    }

                                                                    color="error"

                                                                    sx={{
                                                                        mt: 0.5
                                                                    }}
                                                                >

                                                                    •{" "}
                                                                    {
                                                                        blocker
                                                                    }

                                                                </Typography>

                                                            )
                                                        )

                                                    ) : (

                                                        <Typography
                                                            color="text.secondary"
                                                        >

                                                            No blockers
                                                            identified.

                                                        </Typography>

                                                    )}

                                                </Box>

                                            </Stack>

                                        )}


                                    {/* RISK */}

                                    {aiDialog ===
                                        "risk" &&
                                        risk && (

                                            <Stack spacing={3}>

                                                <Box>

                                                    <Typography
                                                        variant="subtitle1"
                                                        fontWeight="bold"
                                                        mb={1}
                                                    >

                                                        Risk Level

                                                    </Typography>


                                                    <Chip
                                                        label={
                                                            risk.riskLevel
                                                        }

                                                        color={
                                                            risk.riskLevel ===
                                                            "HIGH"

                                                                ? "error"

                                                                : risk.riskLevel ===
                                                                  "MEDIUM"

                                                                    ? "warning"

                                                                    : "success"
                                                        }
                                                    />

                                                </Box>


                                                <Divider />


                                                <Box>

                                                    <Typography
                                                        variant="subtitle1"
                                                        fontWeight="bold"
                                                    >

                                                        Reasons

                                                    </Typography>


                                                    {risk.reasons?.map(
                                                        (
                                                            reason,
                                                            index
                                                        ) => (

                                                            <Typography
                                                                key={
                                                                    index
                                                                }

                                                                sx={{
                                                                    mt: 0.5
                                                                }}
                                                            >

                                                                •{" "}
                                                                {
                                                                    reason
                                                                }

                                                            </Typography>

                                                        )
                                                    )}

                                                </Box>


                                                <Divider />


                                                <Box>

                                                    <Typography
                                                        variant="subtitle1"
                                                        fontWeight="bold"
                                                    >

                                                        Suggestions

                                                    </Typography>


                                                    {risk.suggestions?.map(
                                                        (
                                                            suggestion,
                                                            index
                                                        ) => (

                                                            <Typography
                                                                key={
                                                                    index
                                                                }

                                                                sx={{
                                                                    mt: 0.5
                                                                }}
                                                            >

                                                                ✓{" "}
                                                                {
                                                                    suggestion
                                                                }

                                                            </Typography>

                                                        )
                                                    )}

                                                </Box>

                                            </Stack>

                                        )}


                                    {/* ACTION ITEMS */}

                                    {aiDialog ===
                                        "actions" && (

                                            <Stack spacing={2}>

                                                {actionItems.length ===
                                                0 ? (

                                                    <Typography
                                                        color="text.secondary"
                                                    >

                                                        No actionable items
                                                        were found.

                                                    </Typography>

                                                ) : (

                                                    actionItems.map(
                                                        (
                                                            item,
                                                            index
                                                        ) => (

                                                            <Box
                                                                key={
                                                                    index
                                                                }

                                                                sx={{
                                                                    p: {
                                                                        xs:
                                                                            1.5,
                                                                        sm:
                                                                            2
                                                                    },

                                                                    border:
                                                                        "1px solid",

                                                                    borderColor:
                                                                        "divider",

                                                                    borderRadius:
                                                                        2
                                                                }}
                                                            >

                                                                <Typography
                                                                    fontWeight="bold"

                                                                    sx={{
                                                                        wordBreak:
                                                                            "break-word"
                                                                    }}
                                                                >

                                                                    {
                                                                        item.task
                                                                    }

                                                                </Typography>


                                                                <Stack
                                                                    direction={{
                                                                        xs:
                                                                            "column",
                                                                        sm:
                                                                            "row"
                                                                    }}

                                                                    spacing={1}

                                                                    sx={{
                                                                        mt: 1
                                                                    }}
                                                                >

                                                                    <Chip
                                                                        label={
                                                                            `👤 ${item.assignee}`
                                                                        }

                                                                        size="small"

                                                                        sx={{
                                                                            width: {
                                                                                xs:
                                                                                    "100%",
                                                                                sm:
                                                                                    "auto"
                                                                            }
                                                                        }}
                                                                    />


                                                                    <Chip
                                                                        label={
                                                                            item.priority
                                                                        }

                                                                        size="small"

                                                                        color={
                                                                            item.priority ===
                                                                            "HIGH"
                                                                                ? "error"
                                                                                : "default"
                                                                        }

                                                                        sx={{
                                                                            width: {
                                                                                xs:
                                                                                    "100%",
                                                                                sm:
                                                                                    "auto"
                                                                            }
                                                                        }}
                                                                    />


                                                                    <Chip
                                                                        label={
                                                                            `📅 ${item.deadline}`
                                                                        }

                                                                        size="small"

                                                                        sx={{
                                                                            width: {
                                                                                xs:
                                                                                    "100%",
                                                                                sm:
                                                                                    "auto"
                                                                            }
                                                                        }}
                                                                    />

                                                                </Stack>

                                                            </Box>

                                                        )
                                                    )

                                                )}

                                            </Stack>

                                        )}

                                </>

                            )}

                        </DialogContent>


                        <DialogActions>

                            <Button
                                onClick={() =>
                                    setAiDialog(null)
                                }

                                disabled={
                                    aiLoading
                                }
                            >

                                Close

                            </Button>

                        </DialogActions>

                    </Dialog>


                    <Divider
                        sx={{
                            my: {
                                xs: 3,
                                sm: 4
                            }
                        }}
                    />


                    {/* =================================================
                        ACTIVITY
                    ================================================= */}

                    <Box>

                        <Typography
                            variant="subtitle1"
                            fontWeight="700"
                            color="#0F172A"
                            mb={2}
                        >

                            Activity History

                        </Typography>


                        <Paper
                            elevation={0}

                            sx={{
                                p: {
                                    xs: 1.5,
                                    sm: 2
                                },

                                borderRadius: 3,

                                background:
                                    "#F8FAFC",

                                border:
                                    "1px dashed #E2E8F0"
                            }}
                        >

                            <Stack
                                direction="row"
                                spacing={1.5}
                                alignItems="center"
                            >

                                <MdAccessTime
                                    color="#64748B"
                                />


                                <Box>

                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        color="#334155"
                                    >

                                        Task created

                                    </Typography>


                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >

                                        Initial status set to:{" "}

                                        <strong>
                                            {
                                                task.status
                                            }
                                        </strong>

                                    </Typography>

                                </Box>

                            </Stack>

                        </Paper>

                    </Box>

                </Paper>

            </Box>


            {/* =================================================
                ERROR SNACKBAR
            ================================================= */}

            <Snackbar
                open={
                    error !== ""
                }

                autoHideDuration={3000}

                onClose={() =>
                    setError("")
                }
            >

                <Alert
                    severity="error"
                    variant="filled"

                    sx={{
                        borderRadius: 2
                    }}
                >

                    {error}

                </Alert>

            </Snackbar>


            {/* =================================================
                EDIT TASK DIALOG
            ================================================= */}

            <Dialog
                open={openEdit}
                onClose={() =>
                    setOpenEdit(false)
                }

                fullWidth

                fullScreen={
                    isSmallMobile
                }

                maxWidth="sm"
            >

                <DialogTitle
                    sx={{
                        fontWeight: 700
                    }}
                >

                    Edit Task

                </DialogTitle>


                <DialogContent
                    dividers
                >

                    <TextField
                        margin="normal"
                        fullWidth
                        label="Task Name"
                        value={
                            editTask.title
                        }

                        onChange={(e) =>
                            setEditTask({
                                ...editTask,
                                title:
                                    e.target.value
                            })
                        }
                    />


                    <TextField
                        margin="normal"
                        fullWidth
                        multiline
                        rows={4}
                        label="Description"
                        value={
                            editTask.description
                        }

                        onChange={(e) =>
                            setEditTask({
                                ...editTask,
                                description:
                                    e.target.value
                            })
                        }
                    />


                    <TextField
                        select
                        margin="normal"
                        fullWidth
                        label="Priority"
                        value={
                            editTask.priority
                        }

                        onChange={(e) =>
                            setEditTask({
                                ...editTask,
                                priority:
                                    e.target.value
                            })
                        }
                    >

                        <MenuItem value="LOW">
                            LOW
                        </MenuItem>

                        <MenuItem value="MEDIUM">
                            MEDIUM
                        </MenuItem>

                        <MenuItem value="HIGH">
                            HIGH
                        </MenuItem>

                    </TextField>


                    <TextField
                        select
                        margin="normal"
                        fullWidth
                        label="Status"
                        value={
                            editTask.status
                        }

                        onChange={(e) =>
                            setEditTask({
                                ...editTask,
                                status:
                                    e.target.value
                            })
                        }
                    >

                        <MenuItem value="PENDING">
                            PENDING
                        </MenuItem>

                        <MenuItem value="IN_PROGRESS">
                            IN PROGRESS
                        </MenuItem>

                        <MenuItem value="COMPLETED">
                            COMPLETED
                        </MenuItem>

                    </TextField>

                </DialogContent>


                <DialogActions
                    sx={{
                        p: 2,

                        flexDirection: {
                            xs:
                                "column-reverse",
                            sm:
                                "row"
                        },

                        gap: {
                            xs: 1,
                            sm: 0
                        }
                    }}
                >

                    <Button
                        onClick={() =>
                            setOpenEdit(false)
                        }

                        fullWidth={
                            isSmallMobile
                        }
                    >

                        Cancel

                    </Button>


                    <Button
                        variant="contained"
                        onClick={
                            handleSaveTask
                        }

                        fullWidth={
                            isSmallMobile
                        }
                    >

                        Save

                    </Button>

                </DialogActions>

            </Dialog>

        </Box>

    );

}

export default TaskDetails;
