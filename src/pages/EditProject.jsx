import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";

import {
    Box,
    Typography,
    Paper,
    Button,
    TextField,
    MenuItem,
    Stack,
    CircularProgress,
    Alert,
    Snackbar
} from "@mui/material";

import { getProjectById, updateProject } from "../services/projectService";

function EditProject() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [saveError, setSaveError] = useState("");

    const [form, setForm] = useState({
        name: "",
        description: "",
        priority: "",
        status: "",
        startDate: "",
        endDate: ""
    });

    useEffect(() => {

        const fetchProject = async () => {
            try {

                const response = await getProjectById(id);
                const project = response.data;

                setForm({
                    name: project.name || "",
                    description: project.description || "",
                    priority: project.priority || "",
                    status: project.status || "",
                    startDate: project.startDate || "",
                    endDate: project.endDate || ""
                });

            } catch (err) {
                console.error(err);
                setError("Unable to load project.");
            } finally {
                setLoading(false);
            }
        };

        fetchProject();

    }, [id]);

    const handleChange = (field) => (e) => {
        setForm((prev) => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleSave = async () => {

        try {

            setSaving(true);
            setSaveError("");

            await updateProject(id, form);

            navigate(`/projects/${id}`);

        } catch (err) {
            console.error(err);
            setSaveError(
                err.response?.data?.message ||
                "Unable to update project. Please try again."
            );
            setSaving(false);
        }

    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error">
                {error}
            </Typography>
        );
    }

    return (

        <>

            <Button
                startIcon={<MdArrowBack />}
                onClick={() => navigate(`/projects/${id}`)}
                sx={{ mb: 2 }}
            >
                Back to Project
            </Button>

            <Paper sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 3, maxWidth: 600 }}>

                <Typography variant="h5" fontWeight="bold" mb={3}>
                    Edit Project
                </Typography>

                <Stack spacing={3}>

                    <TextField
                        label="Project Name"
                        value={form.name}
                        onChange={handleChange("name")}
                        fullWidth
                    />

                    <TextField
                        label="Description"
                        value={form.description}
                        onChange={handleChange("description")}
                        multiline
                        rows={4}
                        fullWidth
                    />

                    <TextField
                        select
                        label="Priority"
                        value={form.priority}
                        onChange={handleChange("priority")}
                        fullWidth
                    >
                        <MenuItem value="LOW">Low</MenuItem>
                        <MenuItem value="MEDIUM">Medium</MenuItem>
                        <MenuItem value="HIGH">High</MenuItem>
                    </TextField>

                    <TextField
                        select
                        label="Status"
                        value={form.status}
                        onChange={handleChange("status")}
                        fullWidth
                    >
                        <MenuItem value="PENDING">Pending</MenuItem>
                        <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                        <MenuItem value="COMPLETED">Completed</MenuItem>
                    </TextField>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                        <TextField
                            label="Start Date"
                            type="date"
                            value={form.startDate}
                            onChange={handleChange("startDate")}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />

                        <TextField
                            label="End Date"
                            type="date"
                            value={form.endDate}
                            onChange={handleChange("endDate")}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />

                    </Stack>

                    <Stack direction="row" spacing={2} justifyContent="flex-end">

                        <Button
                            onClick={() => navigate(`/projects/${id}`)}
                            disabled={saving}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            onClick={handleSave}
                            disabled={saving || !form.name.trim()}
                            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>

                    </Stack>

                </Stack>

            </Paper>

            <Snackbar
                open={!!saveError}
                autoHideDuration={5000}
                onClose={() => setSaveError("")}
            >
                <Alert severity="error" onClose={() => setSaveError("")}>
                    {saveError}
                </Alert>
            </Snackbar>

        </>

    );

}

export default EditProject;