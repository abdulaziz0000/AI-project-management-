import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WorkspaceChatbot from "../components/WorkspaceChatbot";

import {
    Box,
    Typography,
    Grid,
    Paper,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Stack,
    Chip
} from "@mui/material";

import { MdAdd } from "react-icons/md";

import DashboardCard from "../components/DashboardCard";
import ProjectCard from "../components/ProjectCard";
import TaskCard from "../components/TaskCard";

const API = import.meta.env.VITE_API_BASE_URL;
import { getAuthStorage } from "../utils/authStorage";

function Dashboard() {

    const navigate = useNavigate();

    const storage = getAuthStorage();

    const token = storage?.getItem("accessToken");

    const user = JSON.parse(
        storage?.getItem("user") || "null"
    );

    const organization = JSON.parse(
        storage?.getItem("organization") || "null"
    );

    const [dashboard, setDashboard] = useState(null);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const authConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    useEffect(() => {

        if (!token || !organization?.id) {
            navigate("/login");
            return;
        }

        const loadDashboard = async () => {
            try {
                const response = await axios.get(
                    `${API}/dashboard/${organization.id}`,
                    authConfig
                );
                setDashboard(response.data);
            }
            catch (error) {
                console.error("Dashboard loading failed:", error);
                if (error.response?.status === 401) {
                    localStorage.clear();
                    navigate("/login");
                }
            }
        };

        loadDashboard();

    }, [organization?.id]);


    useEffect(() => {

        if (!token || !organization?.id)
            return;

        const loadProjects = async () => {
            try {
                const response = await axios.get(
                    `${API}/projects/organization/${organization.id}`,
                    authConfig
                );
                setProjects(response.data);
            }
            catch (error) {
                console.error("Projects loading failed:", error);
            }
        };

        loadProjects();

    }, [organization?.id]);


    useEffect(() => {

        if (!token || !user?.id)
            return;

        const loadTasks = async () => {
            try {
                const response = await axios.get(
                    `${API}/tasks/user/${user.id}`,
                    authConfig
                );
                setTasks(response.data);
            }
            catch (error) {
                console.error("Tasks loading failed:", error);
            }
            finally {
                setLoading(false);
            }
        };

        loadTasks();

    }, [user?.id]);


    if (!user || !organization) {
        return (
            <Typography sx={{ padding: { xs: 3, md: 5 } }}>
                Authentication data missing. Please login again.
            </Typography>
        );
    }

    if (loading) {
        return (
            <Typography sx={{ padding: { xs: 3, md: 5 } }}>
                Loading dashboard...
            </Typography>
        );
    }

    return (

        <>

            <Paper
                sx={{
                    p: { xs: 2.5, sm: 3, md: 4 },
                    mb: { xs: 3, md: 4 },
                    borderRadius: 4,
                    background: "linear-gradient(135deg,#4F46E5,#2563EB)",
                    color: "white"
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" } }}
                >
                    Welcome back, {user.firstName} 👋
                </Typography>

                <Typography sx={{ opacity: 0.8, fontSize: { xs: "0.85rem", sm: "1rem" } }}>
                    {organization.name}
                </Typography>
            </Paper>

            <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 6, md: 3 }}>
                    <DashboardCard title="Projects" value={dashboard?.totalProjects || 0} color="#1976d2" />
                </Grid>
                <Grid size={{ xs: 6, sm: 6, md: 3 }}>
                    <DashboardCard title="Members" value={dashboard?.totalUsers || 0} color="#00C853" />
                </Grid>
                <Grid size={{ xs: 6, sm: 6, md: 3 }}>
                    <DashboardCard title="Open Tasks" value={dashboard?.openTasks || 0} color="#FB8C00" />
                </Grid>
                <Grid size={{ xs: 6, sm: 6, md: 3 }}>
                    <DashboardCard title="Completed" value={dashboard?.completedTasks || 0} color="#7B1FA2" />
                </Grid>
            </Grid>

            <Paper sx={{ p: { xs: 2, sm: 3 }, mt: { xs: 3, md: 4 }, borderRadius: 4 }}>

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", sm: "center" }}
                    spacing={2}
                    mb={3}
                >
                    <Typography variant="h6" fontWeight={700}>
                        Recent Projects
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<MdAdd />}
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                        onClick={() => navigate("/projects/create")}
                    >
                        Create Project
                    </Button>
                </Stack>

                <TableContainer sx={{ overflowX: "auto" }}>
                    <Table sx={{ minWidth: 500 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Priority</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {projects.map(project => (
                                <TableRow key={project.id}>
                                    <TableCell>{project.name}</TableCell>
                                    <TableCell><Chip label={project.status} /></TableCell>
                                    <TableCell>{project.priority}</TableCell>
                                    <TableCell>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => navigate(`/projects/${project.id}`)}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </Paper>

            <Box sx={{ mt: { xs: 4, md: 5 } }}>
                <Typography variant="h6" fontWeight={700} mb={3}>
                    Project Overview
                </Typography>

               <Grid container spacing={{ xs: 2, md: 4 }}>
    {projects.map((project) => (
        <Grid size={{ xs: 12, sm: 6 }} key={project.id}>
            <Box
                onClick={() => navigate(`/projects/${project.id}`)}
                sx={{
                    cursor: "pointer",
                    height: "100%",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                        transform: "translateY(-3px)",
                    }
                }}
            >
                <ProjectCard
                    name={project.name}
                    description={project.description}
                    priority={project.priority}
                    status={project.status}
                />
            </Box>
        </Grid>
    ))}
</Grid>
            </Box>

            <Box sx={{ mt: { xs: 3, md: 1 } }}>
                <Typography variant="h6" fontWeight={700} mb={3}>
                    My Tasks
                </Typography>

                <Grid container spacing={2}>
                    {tasks.map((task) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={task.id}>
                            <TaskCard
                                title={task.title}
                                assignedTo={task.createdByName}
                                priority={task.priority}
                                status={task.status}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Paper sx={{ p: { xs: 2, sm: 3 }, mt: { xs: 3, md: 2 }, borderRadius: 4 }}>
                <Typography variant="h6" fontWeight={700} mb={3}>
                    Quick Actions
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Button
                        variant="contained"
                        startIcon={<MdAdd />}
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                        onClick={() => navigate("/projects/create")}
                    >
                        Create Project
                    </Button>
                </Stack>
            </Paper>

            <WorkspaceChatbot />

        </>

    );

}

export default Dashboard;