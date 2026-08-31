import {
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    Stack,
    Box
} from "@mui/material";

const priorityColor = {
    LOW: "success",
    MEDIUM: "warning",
    HIGH: "error"
};

const statusColor = {
    PENDING: "default",
    IN_PROGRESS: "info",
    COMPLETED: "success",
    ACTIVE: "success"
};

function ProjectCard({
    name,
    description,
    priority,
    status,
    onClick
}) {

    return (
        <Card
            sx={{
                width: "100%",
                maxWidth: "100%",
                height: "100%",
                boxSizing: "border-box",

                display: "flex",
                flexDirection: "column",

                borderRadius: 4,

                border: "1px solid #E5E7EB",

                boxShadow:
                    "0 4px 15px rgba(0,0,0,.06)",

                transition:
                    "transform .25s ease, box-shadow .25s ease",

                "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow:
                        "0 12px 28px rgba(37,99,235,.18)"
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

                    display: "flex",
                    flexDirection: "column",

                    flexGrow: 1,

                    "&:last-child": {
                        pb: {
                            xs: 2,
                            sm: 2.5,
                            md: 3
                        }
                    }
                }}
            >

                {/* PROJECT NAME */}

                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                        height: {
                            xs: "50px",
                            sm: "56px"
                        },

                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",

                        overflow: "hidden",

                        lineHeight: 1.4,

                        wordBreak: "break-word"
                    }}
                >
                    {name}
                </Typography>


                {/* DESCRIPTION */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 1,

                        height: "48px",

                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",

                        overflow: "hidden",

                        lineHeight: 1.5,

                        wordBreak: "break-word"
                    }}
                >
                    {description ||
                        "No description available."}
                </Typography>


                {/* PRIORITY + STATUS */}

                <Box
                    sx={{
                        mt: 3,
                        minHeight: 32
                    }}
                >

                    <Stack
                        direction="row"
                        spacing={1}
                        useFlexGap
                        flexWrap="wrap"
                    >

                        <Chip
                            label={priority || "N/A"}
                            color={
                                priorityColor[priority] ||
                                "default"
                            }
                            size="small"
                            sx={{
                                fontWeight: 600,
                                borderRadius: 2
                            }}
                        />

                        <Chip
                            label={
                                status
                                    ? status.replaceAll(
                                        "_",
                                        " "
                                    )
                                    : "N/A"
                            }
                            color={
                                statusColor[status] ||
                                "default"
                            }
                            size="small"
                            sx={{
                                fontWeight: 600,
                                borderRadius: 2
                            }}
                        />

                    </Stack>

                </Box>


                {/* VIEW PROJECT BUTTON */}

                <Button
                    fullWidth
                    variant="contained"
                    onClick={onClick}
                    sx={{
                        mt: "auto",

                        pt: 1.2,
                        pb: 1.2,

                        borderRadius: 3,

                        textTransform: "none",

                        fontWeight: 700,

                        fontSize: {
                            xs: "0.9rem",
                            sm: "0.95rem"
                        },

                        background:
                            "linear-gradient(135deg,#2563EB,#4F46E5)",

                        boxShadow:
                            "0 6px 18px rgba(37,99,235,.28)",

                        "&:hover": {
                            background:
                                "linear-gradient(135deg,#1D4ED8,#4338CA)"
                        }
                    }}
                >
                    View Project
                </Button>

            </CardContent>

        </Card>
    );
}

export default ProjectCard;

