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
    CircularProgress
} from "@mui/material";

import { MdAdd } from "react-icons/md";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TaskCard from "../components/TaskCard";

import { getTasks } from "../services/taskService";

function Tasks() {

    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);

    const [loading, setLoading] = useState(true);

    const [status, setStatus] = useState("");

    const [priority, setPriority] = useState("");

    const [search, setSearch] = useState("");

    useEffect(() => {

        const fetchTasks = async () => {

            try {

                const data = await getTasks();

                setTasks(data);

            }
            catch (err) {

                console.log(err);

            }
            finally {

                setLoading(false);

            }

        };

        fetchTasks();

    }, []);

    const filteredTasks = tasks.filter((task) => {

        const matchesStatus = status ? task.status === status : true;

        const matchesPriority = priority ? task.priority === priority : true;

      const matchesSearch = search
    ? task.name.toLowerCase().includes(search.toLowerCase())
    : true;

        return matchesStatus && matchesPriority && matchesSearch;

    });

    return (

        <Box
            sx={{
                background: "#F4F6F9",
                minHeight: "100vh"
            }}
        >

            <Navbar />

            <Sidebar />

            <Box
                sx={{
                    ml: "240px",
                    mt: "64px",
                    p: 4
                }}
            >

                <Typography
                    variant="h4"
                    fontWeight="bold"
                >
                    Tasks
                </Typography>

                <Typography
                    color="gray"
                    mb={4}
                >
                    Track and manage all tasks across projects
                </Typography>

                <Paper
                    sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: 3
                    }}
                >

                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="space-between"
                        flexWrap="wrap"
                    >

                        <Stack
                            direction="row"
                            spacing={2}
                        >

                            <TextField
                                label="Search Task"
                                variant="outlined"
                                size="small"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <TextField
                                select
                                label="Status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                size="small"
                                sx={{ width: 160 }}
                            >

                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="PENDING">Pending</MenuItem>
                                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                                <MenuItem value="COMPLETED">Completed</MenuItem>

                            </TextField>

                            <TextField
                                select
                                label="Priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                size="small"
                                sx={{ width: 160 }}
                            >

                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="LOW">Low</MenuItem>
                                <MenuItem value="MEDIUM">Medium</MenuItem>
                                <MenuItem value="HIGH">High</MenuItem>

                            </TextField>

                        </Stack>

                        <Button
                            variant="contained"
                            startIcon={<MdAdd />}
                            onClick={() => navigate("/tasks/create")}
                        >
                            Create Task
                        </Button>

                    </Stack>

                </Paper>

                {loading ? (

                    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                        <CircularProgress />
                    </Box>

                ) : filteredTasks.length === 0 ? (

                    <Typography color="gray">
                        No tasks found.
                    </Typography>

                ) : (

                    <Grid
                        container
                        spacing={3}
                    >

                        {filteredTasks.map((task) => (

                            <Grid
                                item
                                xs={12}
                                md={6}
                                lg={4}
                                key={task.id}
                            >

<TaskCard
    title={task.name}
    assignedTo={task.assignedTo}
    priority={task.priority}
    status={task.status}
/>

<Button
    onClick={() => navigate(`/tasks/${task.id}`)}
>
    View Details
</Button>

                            </Grid>

                        ))}

                    </Grid>

                )}

            </Box>

        </Box>

    );

}

export default Tasks;
