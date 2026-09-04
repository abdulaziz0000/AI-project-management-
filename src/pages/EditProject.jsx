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

import {
    getProjectById,
    updateProject
} from "../services/projectService";

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
        endDate: "",

        // Required by backend updateProject()
        organizationId: null,
        createdBy: null
    });

    // ==============================
    // LOAD PROJECT
    // ==============================
    useEffect(() => {

        const fetchProject = async () => {

            try {

                setLoading(true);
                setError("");

                console.log("FETCHING PROJECT ID:", id);

                const response = await getProjectById(id);

                const project = response.data;

                console.log("PROJECT RESPONSE:", project);

                setForm({
                    name: project.name || "",
                    description: project.description || "",
                    priority: project.priority || "",
                    status: project.status || "",
                    startDate: project.startDate || "",
                    endDate: project.endDate || "",

                    // Preserve these values for PUT request
                    organizationId: project.organizationId || null,
                    createdBy: project.createdBy || null
                });

            } catch (err) {

                console.error("GET PROJECT ERROR:", err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load project."
                );

            } finally {

                setLoading(false);

            }
        };

        if (id) {
            fetchProject();
        } else {
            setError("Project ID is missing.");
            setLoading(false);
        }

    }, [id]);


    // ==============================
    // HANDLE INPUT CHANGE
    // ==============================
    const handleChange = (field) => (e) => {

        setForm((prev) => ({
            ...prev,
            [field]: e.target.value
        }));

    };


    // ==============================
    // SAVE PROJECT
    // ==============================
    const handleSave = async () => {

        try {

            setSaving(true);
            setSaveError("");

            console.log("=================================");
            console.log("EDIT PROJECT ID:", id);
            console.log("EDIT PROJECT FORM:", form);
            console.log("ORGANIZATION ID:", form.organizationId);
            console.log("CREATED BY:", form.createdBy);
            console.log("=================================");

            // Basic validation
            if (!id) {
                throw new Error("Project ID is missing.");
            }

            if (!form.organizationId) {
                throw new Error("Organization ID is missing.");
            }

            if (!form.createdBy) {
                throw new Error("Created By user ID is missing.");
            }

            // Send update request
            await updateProject(id, form);

            console.log("PROJECT UPDATED SUCCESSFULLY");

            // Go back to project details
            navigate(`/projects/${id}`);

        } catch (err) {

            console.error("UPDATE PROJECT ERROR:", err);

            setSaveError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                "Unable to update project. Please try again."
            );

            setSaving(false);
        }

    };


    // ==============================
    // LOADING
    // ==============================
    if (loading) {

        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 5
                }}
            >
                <CircularProgress />
            </Box>
        );

    }


    // ==============================
    // LOAD ERROR
    // ==============================
    if (error) {

        return (
            <Box sx={{ p: 2 }}>

                <Button
                    startIcon={<MdArrowBack />}
                    onClick={() => navigate("/projects")}
                    sx={{ mb: 2 }}
                >
                    Back to Projects
                </Button>

                <Alert severity="error">
                    {error}
                </Alert>

            </Box>
        );

    }


    // ==============================
    // UI
    // ==============================
    return (
        <>

            {/* Back button */}
            <Button
                startIcon={<MdArrowBack />}
                onClick={() => navigate(`/projects/${id}`)}
                sx={{ mb: 2 }}
            >
                Back to Project
            </Button>


            <Paper
                sx={{
                    p: { xs: 2.5, sm: 4 },
                    borderRadius: 3,
                    maxWidth: 600
                }}
            >

                <Typography
                    variant="h5"
                    fontWeight="bold"
                    mb={3}
                >
                    Edit Project
                </Typography>


                <Stack spacing={3}>

                    {/* PROJECT NAME */}
                    <TextField
                        label="Project Name"
                        value={form.name}
                        onChange={handleChange("name")}
                        fullWidth
                        required
                    />


                    {/* DESCRIPTION */}
                    <TextField
                        label="Description"
                        value={form.description}
                        onChange={handleChange("description")}
                        multiline
                        rows={4}
                        fullWidth
                    />


                    {/* PRIORITY */}
                    <TextField
                        select
                        label="Priority"
                        value={form.priority}
                        onChange={handleChange("priority")}
                        fullWidth
                    >

                        <MenuItem value="LOW">
                            Low
                        </MenuItem>

                        <MenuItem value="MEDIUM">
                            Medium
                        </MenuItem>

                        <MenuItem value="HIGH">
                            High
                        </MenuItem>

                    </TextField>


                    {/* STATUS */}
                    <TextField
                        select
                        label="Status"
                        value={form.status}
                        onChange={handleChange("status")}
                        fullWidth
                    >

                        <MenuItem value="PENDING">
                            Pending
                        </MenuItem>

                        <MenuItem value="IN_PROGRESS">
                            In Progress
                        </MenuItem>

                        {/* Added because existing project has ACTIVE */}
                        <MenuItem value="ACTIVE">
                            Active
                        </MenuItem>

                        <MenuItem value="COMPLETED">
                            Completed
                        </MenuItem>

                    </TextField>


                    {/* DATES */}
                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row"
                        }}
                        spacing={2}
                    >

                        <TextField
                            label="Start Date"
                            type="date"
                            value={form.startDate}
                            onChange={handleChange("startDate")}
                            InputLabelProps={{
                                shrink: true
                            }}
                            fullWidth
                        />

                        <TextField
                            label="End Date"
                            type="date"
                            value={form.endDate}
                            onChange={handleChange("endDate")}
                            InputLabelProps={{
                                shrink: true
                            }}
                            fullWidth
                        />

                    </Stack>


                    {/* BUTTONS */}
                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-end"
                    >

                        <Button
                            onClick={() =>
                                navigate(`/projects/${id}`)
                            }
                            disabled={saving}
                        >
                            Cancel
                        </Button>


                        <Button
                            variant="contained"
                            onClick={handleSave}
                            disabled={
                                saving ||
                                !form.name.trim()
                            }
                            startIcon={
                                saving ? (
                                    <CircularProgress
                                        size={16}
                                        color="inherit"
                                    />
                                ) : null
                            }
                        >

                            {saving
                                ? "Saving..."
                                : "Save Changes"
                            }

                        </Button>

                    </Stack>

                </Stack>

            </Paper>


            {/* ERROR SNACKBAR */}
            <Snackbar
                open={!!saveError}
                autoHideDuration={5000}
                onClose={() => setSaveError("")}
            >

                <Alert
                    severity="error"
                    onClose={() => setSaveError("")}
                    sx={{ width: "100%" }}
                >
                    {saveError}
                </Alert>

            </Snackbar>

        </>
    );
}

export default EditProject;