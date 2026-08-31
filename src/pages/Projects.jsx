import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Typography,
    Grid,
    Paper,
    Button,
    TextField,
    MenuItem,
    Stack,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useMediaQuery,
    useTheme
} from "@mui/material";

import { MdAdd, MdPersonAdd, MdSearch } from "react-icons/md";

import ProjectCard from "../components/ProjectCard";

import { getProjects } from "../services/projectService";

function Projects() {

    const navigate = useNavigate();

    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.down("md"));

    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState("");

    /*
     * ==========================================
     * FETCH PROJECTS
     * ==========================================
     */

    useEffect(() => {

        const fetchProjects = async () => {

            try {

                const organization = JSON.parse(
                    localStorage.getItem("organization")
                );

                if (!organization?.id) {
                    console.error("Organization not found");
                    return;
                }

                const response = await getProjects(
                    organization.id
                );

                setProjects(response.data);

            } catch (err) {

                console.error(
                    "Failed to fetch projects:",
                    err
                );

            } finally {

                setLoading(false);

            }
        };

        fetchProjects();

    }, []);


    /*
     * ==========================================
     * FILTER PROJECTS
     * ==========================================
     */

    const filteredProjects = projects.filter((project) => {

        const matchesStatus =
            !status ||
            project.status === status;

        const matchesSearch =
            !search ||
            project.name
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
            project.description
                ?.toLowerCase()
                .includes(search.toLowerCase());

        return matchesStatus && matchesSearch;

    });


    /*
     * ==========================================
     * ADD EMPLOYEES
     * ==========================================
     */

    const handleAddEmployeesClick = () => {

        if (projects.length === 0) {
            return;
        }

        if (projects.length === 1) {

            navigate(
                `/projects/${projects[0].id}/invite`
            );

            return;
        }

        setSelectedProjectId("");
        setInviteDialogOpen(true);

    };


    /*
     * ==========================================
     * INVITE CONTINUE
     * ==========================================
     */

    const handleInviteContinue = () => {

        if (!selectedProjectId) {
            return;
        }

        setInviteDialogOpen(false);

        navigate(
            `/projects/${selectedProjectId}/invite`
        );

    };


    return (

        <Box
            sx={{
                width: "100%",
                maxWidth: "100%",
                overflow: "hidden"
            }}
        >

            {/* ==========================================
                PAGE HEADER
            ========================================== */}

            <Box
                sx={{
                    mb: {
                        xs: 2,
                        sm: 3,
                        md: 4
                    }
                }}
            >

                <Typography
                    variant={
                        isMobile
                            ? "h5"
                            : isTablet
                                ? "h4"
                                : "h4"
                    }
                    fontWeight={700}
                    sx={{
                        fontSize: {
                            xs: "1.5rem",
                            sm: "1.8rem",
                            md: "2.125rem"
                        }
                    }}
                >
                    Projects
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{
                        mt: 0.5,
                        fontSize: {
                            xs: 13,
                            sm: 14,
                            md: 16
                        }
                    }}
                >
                    Manage all organization projects
                </Typography>

            </Box>


            {/* ==========================================
                FILTER / ACTION PANEL
            ========================================== */}

            <Paper
                elevation={0}
                sx={{
                    p: {
                        xs: 2,
                        sm: 2.5,
                        md: 3
                    },

                    mb: {
                        xs: 2.5,
                        sm: 3,
                        md: 4
                    },

                    borderRadius: {
                        xs: 2,
                        sm: 3
                    },

                    border: "1px solid",
                    borderColor: "divider"
                }}
            >

                <Stack spacing={2.5}>

                    {/* SEARCH + STATUS */}

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row"
                        }}
                        spacing={2}
                        sx={{
                            width: "100%"
                        }}
                    >

                        <TextField
                            fullWidth
                            label="Search Project"
                            placeholder="Search by name..."
                            variant="outlined"
                            size="small"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            InputProps={{
                                startAdornment: (
                                    <MdSearch
                                        size={20}
                                        style={{
                                            marginRight: 8,
                                            opacity: 0.6
                                        }}
                                    />
                                )
                            }}
                            sx={{
                                flex: 1
                            }}
                        />

                        <TextField
                            select
                            label="Status"
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value)
                            }
                            size="small"
                            sx={{
                                width: {
                                    xs: "100%",
                                    sm: 180
                                }
                            }}
                        >

                            <MenuItem value="">
                                All
                            </MenuItem>

                            <MenuItem value="PENDING">
                                Pending
                            </MenuItem>

                            <MenuItem value="IN_PROGRESS">
                                In Progress
                            </MenuItem>

                            <MenuItem value="COMPLETED">
                                Completed
                            </MenuItem>

                        </TextField>

                    </Stack>


                    {/* ACTION BUTTONS */}

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row"
                        }}
                        spacing={2}
                        sx={{
                            justifyContent: {
                                xs: "stretch",
                                sm: "flex-end"
                            }
                        }}
                    >

                        <Button
                            variant="contained"
                            startIcon={
                                <MdPersonAdd />
                            }
                            color="success"
                            onClick={
                                handleAddEmployeesClick
                            }
                            fullWidth={isMobile}
                            sx={{
                                minHeight: 42,
                                px: 3
                            }}
                        >
                            Add Employees
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={
                                <MdAdd />
                            }
                            onClick={() =>
                                navigate(
                                    "/projects/create"
                                )
                            }
                            fullWidth={isMobile}
                            sx={{
                                minHeight: 42,
                                px: 3
                            }}
                        >
                            Create Project
                        </Button>

                    </Stack>

                </Stack>

            </Paper>


            {/* ==========================================
                LOADING
            ========================================== */}

            {loading ? (

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: {
                            xs: 200,
                            sm: 250
                        }
                    }}
                >

                    <CircularProgress />

                </Box>

            ) : filteredProjects.length === 0 ? (

                /* ==========================================
                   NO PROJECTS
                ========================================== */

                <Paper
                    elevation={0}
                    sx={{
                        py: {
                            xs: 5,
                            sm: 7
                        },

                        px: 2,

                        textAlign: "center",

                        border: "1px solid",
                        borderColor: "divider",

                        borderRadius: 3
                    }}
                >

                    <Typography
                        color="text.secondary"
                        sx={{
                            fontSize: {
                                xs: 14,
                                sm: 16
                            }
                        }}
                    >
                        {search || status
                            ? "No projects match your filters."
                            : "No projects found."
                        }
                    </Typography>

                </Paper>

            ) : (

                /* ==========================================
                   PROJECT GRID
                ========================================== */



<Box
    sx={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box"
    }}
>
    <Grid
        container
        spacing={{ xs: 2, sm: 3 }}
    >

        {filteredProjects.map((project) => (

            <Grid
                key={project.id}
                size={{
                    xs: 12,
                    sm: 6,
                    lg: 4
                }}
                sx={{
                    minWidth: 0
                }}
            >

                <ProjectCard
                    name={project.name}
                    description={project.description}
                    priority={project.priority}
                    status={project.status}
                    onClick={() => {
                        navigate(
                            `/projects/${project.id}`
                        );
                    }}
                />

            </Grid>

        ))}

    </Grid>
</Box>



            )}


            {/* ==========================================
                SELECT PROJECT DIALOG
            ========================================== */}

            <Dialog
                open={inviteDialogOpen}
                onClose={() =>
                    setInviteDialogOpen(false)
                }
                fullWidth
                fullScreen={isMobile}
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        borderRadius: {
                            xs: 0,
                            sm: 3
                        }
                    }
                }}
            >

                <DialogTitle
                    sx={{
                        fontWeight: 700,
                        fontSize: {
                            xs: "1.15rem",
                            sm: "1.25rem"
                        }
                    }}
                >
                    Select a project
                </DialogTitle>

                <DialogContent>

                    <Typography
                        color="text.secondary"
                        sx={{
                            mb: 2,
                            fontSize: {
                                xs: 13,
                                sm: 14
                            }
                        }}
                    >
                        Choose which project to
                        invite the employee to.
                    </Typography>

                    <TextField
                        select
                        fullWidth
                        label="Project"
                        value={selectedProjectId}
                        onChange={(e) =>
                            setSelectedProjectId(
                                e.target.value
                            )
                        }
                    >

                        {projects.map(
                            (project) => (

                                <MenuItem
                                    key={project.id}
                                    value={project.id}
                                >
                                    {project.name}
                                </MenuItem>

                            )
                        )}

                    </TextField>

                </DialogContent>

                <DialogActions
                    sx={{
                        flexDirection: {
                            xs: "column-reverse",
                            sm: "row"
                        },

                        alignItems: "stretch",

                        gap: {
                            xs: 1,
                            sm: 0
                        },

                        px: {
                            xs: 2,
                            sm: 3
                        },

                        pb: {
                            xs: 2,
                            sm: 2
                        }
                    }}
                >

                    <Button
                        onClick={() =>
                            setInviteDialogOpen(false)
                        }
                        fullWidth={isMobile}
                        sx={{
                            minHeight: 42
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={
                            handleInviteContinue
                        }
                        disabled={
                            !selectedProjectId
                        }
                        fullWidth={isMobile}
                        sx={{
                            minHeight: 42
                        }}
                    >
                        Continue
                    </Button>

                </DialogActions>

            </Dialog>

        </Box>
    );
}

export default Projects;

