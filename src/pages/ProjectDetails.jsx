import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdAdd, MdArrowBack, MdPersonAdd, MdEdit, MdDelete } from "react-icons/md";
import { getProjectStandup } from "../services/taskAiService";

import {
    Box,
    Typography,
    Grid,
    Paper,
    Button,
    Chip,
    Stack,
    Divider,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Alert,
    Snackbar
} from "@mui/material";

import TaskCard from "../components/TaskCard";

import { getProjectById, deleteProject } from "../services/projectService";
import { getTasksByProject } from "../services/taskService";

const priorityColor = {
    LOW: "success",
    MEDIUM: "warning",
    HIGH: "error"
};


const statusColor = {
    PENDING: "default",
    IN_PROGRESS: "info",
    COMPLETED: "success"
};

function ProjectDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [project, setProject] = useState(null);

    const [tasks, setTasks] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");
    const [standup, setStandup] = useState(null);

    const [standupOpen, setStandupOpen] = useState(false);

    const [standupLoading, setStandupLoading] = useState(false);

    const [standupError, setStandupError] = useState("");

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    useEffect(() => {

        const fetchData = async () => {
            try {

                const projectResponse = await getProjectById(id);
                const tasksResponse = await getTasksByProject(id);

                setProject(projectResponse.data);
                setTasks(tasksResponse);

            } catch (err) {
                console.log(err.response?.data);
                setError("Unable to load project details.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

    }, [id]);

    const handleGenerateStandup = async () => {

        try {

            setStandupLoading(true);
            setStandupError("");
            setStandupOpen(true);

            const response = await generateProjectStandup(id);

            setStandup(response.data);

        } catch (error) {
            console.error("Standup Error:", error);
            setStandupError(
                error.response?.data?.message ||
                "Unable to generate daily standup."
            );
        } finally {
            setStandupLoading(false);
        }
    };

    const handleDeleteProject = async () => {

        try {

            setDeleting(true);
            setDeleteError("");

            await deleteProject(id);

            navigate("/projects");

        } catch (error) {
            console.error("Delete Error:", error);
            setDeleteError(
                error.response?.data?.message ||
                "Unable to delete project. Please try again."
            );
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !project) {
        return (
            <Typography color="error">
                {error || "Project not found."}
            </Typography>
        );
    }

    return (

        <>

            <Button
                startIcon={<MdArrowBack />}
                onClick={() => navigate("/projects")}
                sx={{ mb: 1.5 }}
            >
                Back to Projects
            </Button>

            <Paper
                sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: 3,
                    mb: 2
                }}
            >

                <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    alignItems="flex-start"
                    flexWrap="wrap"
                    spacing={1.5}
                >

                    <Box>

                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ pt: 1, pb: 1 }}>

                            <Typography variant="h5" fontWeight="bold" sx={{ fontSize: { xs: "1.35rem", sm: "1.6rem" } }}>
                                {project.name}
                            </Typography>

                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => navigate(`/projects/${id}/edit`)}
                            >
                                <MdEdit />
                            </IconButton>

                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => setDeleteDialogOpen(true)}
                            >
                                <MdDelete />
                            </IconButton>

                        </Stack>

                        <Typography color="gray" sx={{ fontSize: "0.9rem", pt: 0.5, pb: 1.5 }}>
                            {project.description}
                        </Typography>

                        <Stack direction="row" spacing={1} sx={{ pt: 1, pb: 1 }}>

                            <Chip
                                label={project.priority}
                                color={priorityColor[project.priority] || "default"}
                                size="small"
                            />

                            <Chip
                                label={project.status}
                                color={statusColor[project.status] || "default"}
                                size="small"
                            />

                        </Stack>

                    </Box>

                    <Stack direction="row" spacing={2}>

                        <Box textAlign="right">

                            <Typography variant="caption" color="gray">
                                Start Date
                            </Typography>

                            <Typography variant="body2">
                                {project.startDate || "-"}
                            </Typography>

                        </Box>

                        <Divider orientation="vertical" flexItem />

                        <Box textAlign="right">

                            <Typography variant="caption" color="gray">
                                End Date
                            </Typography>

                            <Typography variant="body2">
                                {project.endDate || "-"}
                            </Typography>

                        </Box>

                    </Stack>

                </Stack>

            </Paper>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 3 }}>

                <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(`/projects/${id}/invite`)}
                    sx={{
                        backgroundColor: "#7C3AED",
                        "&:hover": { backgroundColor: "#6D28D9" }
                    }}
                >
                    Invite Employee
                </Button>

                <Button
                    variant="contained"
                    size="small"
                    onClick={handleGenerateStandup}
                    sx={{
                        backgroundColor: "#0EA5A5",
                        "&:hover": { backgroundColor: "#0C8B8B" }
                    }}
                >
                    📋 Generate Standup
                </Button>

                <Button
                    variant="contained"
                    size="small"
                    startIcon={<MdAdd />}
                    onClick={() => navigate(`/projects/${id}/tasks/create`)}
                >
                    Add Task
                </Button>

            </Stack>

            <Dialog
                open={standupOpen}
                onClose={() => {
                    if (!standupLoading) setStandupOpen(false);
                }}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>📋 Daily Standup</DialogTitle>
                <DialogContent dividers>

                    {standupLoading ? (

                        <Box sx={{ minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 1.5 }}>
                            <CircularProgress />
                            <Typography color="text.secondary">Generating daily standup...</Typography>
                        </Box>

                    ) : standupError ? (

                        <Typography color="error">{standupError}</Typography>

                    ) : standup?.developers?.length === 0 ? (

                        <Typography color="text.secondary">No developer activity found in the last 24 hours.</Typography>

                    ) : (

                        <Stack spacing={2}>

                            {standup?.developers?.map((developer, index) => (

                                <Paper key={index} elevation={0} sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>

                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                                        {developer.developer}
                                    </Typography>

                                    <Box sx={{ mb: 1 }}>
                                        <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>✅ Completed</Typography>
                                        {developer.completed?.length > 0 ? (
                                            <Stack spacing={0.25}>
                                                {developer.completed.map((item, i) => (
                                                    <Typography key={i} variant="body2" color="text.secondary">• {item}</Typography>
                                                ))}
                                            </Stack>
                                        ) : (
                                            <Typography color="text.secondary" variant="body2">No completed work reported.</Typography>
                                        )}
                                    </Box>

                                    <Divider sx={{ my: 1 }} />

                                    <Box sx={{ mb: 1 }}>
                                        <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>🔄 In Progress</Typography>
                                        {developer.inProgress?.length > 0 ? (
                                            <Stack spacing={0.25}>
                                                {developer.inProgress.map((item, i) => (
                                                    <Typography key={i} variant="body2" color="text.secondary">• {item}</Typography>
                                                ))}
                                            </Stack>
                                        ) : (
                                            <Typography color="text.secondary" variant="body2">No work currently in progress.</Typography>
                                        )}
                                    </Box>

                                    <Divider sx={{ my: 1 }} />

                                    <Box>
                                        <Typography variant="body2" fontWeight="bold" color="error" sx={{ mb: 0.5 }}>🚫 Blocked</Typography>
                                        {developer.blocked?.length > 0 ? (
                                            <Stack spacing={0.25}>
                                                {developer.blocked.map((item, i) => (
                                                    <Typography key={i} variant="body2" color="error">• {item}</Typography>
                                                ))}
                                            </Stack>
                                        ) : (
                                            <Typography color="text.secondary" variant="body2">No blockers reported.</Typography>
                                        )}
                                    </Box>

                                </Paper>

                            ))}

                        </Stack>

                    )}

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setStandupOpen(false)} disabled={standupLoading}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => { if (!deleting) setDeleteDialogOpen(false); }}
            >
                <DialogTitle>Delete Project?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete <b>{project.name}</b>? This action cannot be undone, and all tasks and comments under this project may be removed.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>Cancel</Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleDeleteProject}
                        disabled={deleting}
                        startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={!!deleteError} autoHideDuration={5000} onClose={() => setDeleteError("")}>
                <Alert severity="error" onClose={() => setDeleteError("")}>{deleteError}</Alert>
            </Snackbar>

            {tasks.length === 0 ? (

                <Typography color="gray">No tasks yet for this project.</Typography>

            ) : (
<Box
    sx={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
    }}
>
    <Grid
        container
        spacing={{ xs: 2, sm: 2.5, md: 3 }}
        sx={{
            width: "100%",
            margin: 0,
        }}
    >
        {tasks.map((task) => (
            <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={4}
                key={task.id}
                sx={{
                    width: "100%",
                    maxWidth: "100%",
                    minWidth: 0,
                    boxSizing: "border-box",
                }}
            >
                <TaskCard
                    title={task.title || task.name}
                    assignedTo={task.assignedToName}
                    priority={task.priority}
                    status={task.status}
                    onViewDetails={() =>
                        navigate(`/tasks/${task.id}`)
                    }
                />
            </Grid>
        ))}
    </Grid>
</Box>
            )}

        </>

    );

}

export default ProjectDetails;