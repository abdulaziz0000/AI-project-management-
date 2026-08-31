import {
    Card,
    CardContent,
    Typography,
    Chip,
    Stack,
    Box,
    Button
} from "@mui/material";

const getPriorityColor = (priority = "") => {
    switch (priority.toUpperCase()) {
        case "HIGH":
        case "URGENT":
            return {
                bg: "#fef2f2",
                text: "#dc2626",
                border: "#fecaca"
            };

        case "MEDIUM":
            return {
                bg: "#fffbeb",
                text: "#d97706",
                border: "#fde68a"
            };

        case "LOW":
            return {
                bg: "#f0fdf4",
                text: "#16a34a",
                border: "#bbf7d0"
            };

        default:
            return {
                bg: "#f8fafc",
                text: "#64748b",
                border: "#e2e8f0"
            };
    }
};

const getStatusColor = (status = "") => {
    switch (status.toUpperCase()) {
        case "COMPLETED":
        case "DONE":
            return {
                bg: "#dcfce7",
                text: "#15803d"
            };

        case "IN_PROGRESS":
        case "IN PROGRESS":
            return {
                bg: "#e0e7ff",
                text: "#4338ca"
            };

        case "PENDING":
        case "TODO":
            return {
                bg: "#f3f4f6",
                text: "#374151"
            };

        default:
            return {
                bg: "#f1f5f9",
                text: "#475569"
            };
    }
};

function TaskCard({
    title,
    assignedTo,
    priority,
    status,
    onViewDetails
}) {
    const priorityStyle = getPriorityColor(priority);
    const statusStyle = getStatusColor(status);

    return (
        <Card
            elevation={0}
            sx={{
                width: "100%",
                boxSizing: "border-box",
                borderRadius: 3.5,
                border: "1px solid",
                borderColor: "grey.200",
                background: "#ffffff",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",

                "&:hover": {
                    borderColor: "grey.300",
                    transform: "translateY(-3px)",
                    boxShadow:
                        "0 12px 24px -10px rgba(0, 0, 0, 0.08)"
                }
            }}
        >
            <CardContent
                sx={{
                    p: {
                        xs: 2,
                        sm: 2.5,
                        md: 3
                    },

                    "&:last-child": {
                        pb: {
                            xs: 2,
                            sm: 2.5,
                            md: 3
                        }
                    }
                }}
            >
                {/* TITLE */}
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        fontSize: {
                            xs: "0.98rem",
                            sm: "1.05rem"
                        },
                        color: "grey.900",
                        lineHeight: 1.3,
                        mb: 1,
                        wordBreak: "break-word"
                    }}
                >
                    {title}
                </Typography>

                {/* ASSIGNED TO */}
                <Typography
                    variant="body2"
                    sx={{
                        color: "text.secondary",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mb: 2
                    }}
                >
                    <Box
                        component="span"
                        sx={{
                            color: "grey.500"
                        }}
                    >
                        Assigned to:
                    </Box>

                    <Box
                        component="span"
                        sx={{
                            color: "grey.800",
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                        }}
                    >
                        {assignedTo || "Unassigned"}
                    </Box>
                </Typography>

                {/* CHIPS */}
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    flexWrap="wrap"
                    useFlexGap
                    sx={{
                        mb: 2
                    }}
                >
                    <Chip
                        label={priority || "Normal"}
                        size="small"
                        sx={{
                            fontWeight: 700,
                            fontSize: "0.725rem",
                            letterSpacing: "0.02em",
                            backgroundColor:
                                priorityStyle.bg,
                            color:
                                priorityStyle.text,
                            border:
                                `1px solid ${priorityStyle.border}`,
                            borderRadius: 1.5
                        }}
                    />

                    <Chip
                        label={status || "Pending"}
                        size="small"
                        sx={{
                            fontWeight: 700,
                            fontSize: "0.725rem",
                            letterSpacing: "0.02em",
                            backgroundColor:
                                statusStyle.bg,
                            color:
                                statusStyle.text,
                            borderRadius: 1.5
                        }}
                    />
                </Stack>

                {/* VIEW DETAILS */}
                {onViewDetails && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            width: "100%"
                        }}
                    >
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={onViewDetails}
                            sx={{
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: 2,
                                minWidth: "auto",
                                px: 1.75,
                                py: 0.6,
                                fontSize: "0.8rem"
                            }}
                        >
                            View Details
                        </Button>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}

export default TaskCard;

