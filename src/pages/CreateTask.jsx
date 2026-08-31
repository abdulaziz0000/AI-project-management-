import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  TextField,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  Chip,
  Autocomplete
} from "@mui/material";

import { MdSave } from "react-icons/md";

import { createTask } from "../services/taskService";
import { getProjects, getProjectMembers } from "../services/projectService";

function CreateTask() {
  const { projectId: projectIdFromRoute } = useParams();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [task, setTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    priority: "MEDIUM",
    status: "PENDING",
    projectId: projectIdFromRoute || ""
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const organizationId = localStorage.getItem("organizationId");

        const projectResponse = await getProjects(organizationId);
        setProjects(projectResponse.data);

        if (projectIdFromRoute) {
          const membersResponse = await getProjectMembers(projectIdFromRoute);
          setProjectMembers(membersResponse.data);
        }
      } catch (err) {
        console.log("LOAD DATA ERROR:", err.response?.data || err.message);
        setError("Unable to load data");
      }
    };

    fetchData();
  }, [projectIdFromRoute]);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setTask((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === "projectId") {
      try {
        const response = await getProjectMembers(value);
        setProjectMembers(response.data);

        setTask((prev) => ({
          ...prev,
          projectId: value,
          assignedTo: ""
        }));
      } catch (err) {
        console.log(err);
        setError("Unable to load project members");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createTask(task);

      setSuccess(true);

      setTask({
        title: "",
        description: "",
        assignedTo: "",
        dueDate: "",
        priority: "MEDIUM",
        status: "PENDING",
        projectId: projectIdFromRoute || ""
      });

      setTimeout(() => {
        if (projectIdFromRoute) {
          navigate(`/projects/${projectIdFromRoute}`);
        } else {
          navigate("/tasks");
        }
      }, 1000);
    } catch (err) {
      console.log("CREATE TASK ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Unable to create task");
    }
  };

  const priorityColor = {
    LOW: "default",
    MEDIUM: "warning",
    HIGH: "error"
  };

  return (

    <>

      <Box sx={{ display: "flex", justifyContent: "center" }}>

        <Box sx={{ width: "100%", maxWidth: 720 }}>

          <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5, fontSize: { xs: "1.5rem", sm: "2.125rem" } }}>
            Create Task
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Fill in the details below to add a new task to a project.
          </Typography>

          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden"
            }}
          >
            <Box component="form" onSubmit={handleSubmit}>

              <Stack spacing={2.5} sx={{ p: { xs: 2.5, sm: 4 } }}>

                <Typography variant="overline" color="text.secondary" fontWeight={700}>
                  Basic info
                </Typography>

                <TextField
                  fullWidth
                  label="Task title"
                  name="title"
                  value={task.title}
                  onChange={handleChange}
                  required
                />

                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Description"
                  name="description"
                  value={task.description}
                  onChange={handleChange}
                  placeholder="Add any relevant context, links, or requirements..."
                />

              </Stack>

              <Divider />

              <Stack spacing={2.5} sx={{ p: { xs: 2.5, sm: 4 } }}>

                <Typography variant="overline" color="text.secondary" fontWeight={700}>
                  Assignment
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>

                  <TextField
                    select
                    fullWidth
                    label="Project"
                    name="projectId"
                    value={task.projectId}
                    onChange={handleChange}
                    disabled={Boolean(projectIdFromRoute)}
                    required
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          sx: { maxHeight: 300, borderRadius: 2 }
                        }
                      }
                    }}
                  >
                    {projects.map((project) => (
                      <MenuItem key={project.id} value={project.id}>
                        {project.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Autocomplete
                    fullWidth
                    options={projectMembers}
                    getOptionLabel={(member) =>
                      `${member.firstName} ${member.lastName} (${member.email})`
                    }
                    value={
                      projectMembers.find((member) => member.id === task.assignedTo) ||
                      null
                    }
                    onChange={(event, newValue) => {
                      setTask((prev) => ({
                        ...prev,
                        assignedTo: newValue ? newValue.id : ""
                      }));
                    }}
                    disabled={!task.projectId}
                    renderOption={(props, member) => {
                      const { key, ...optionProps } = props;

                      return (
                        <Box
                          component="li"
                          key={key}
                          {...optionProps}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            py: "8px !important",
                            px: "12px !important"
                          }}
                        >
                          <Typography fontWeight={600} variant="body2">
                            {member.firstName} {member.lastName}
                          </Typography>

                          <Typography variant="caption" color="text.secondary">
                            {member.email}
                          </Typography>
                        </Box>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Assign to"
                        placeholder="Search member..."
                        helperText={
                          !task.projectId ? "Select a project first" : " "
                        }
                      />
                    )}
                    sx={{ "& .MuiAutocomplete-listbox": { maxHeight: 300 } }}
                  />

                </Stack>

              </Stack>

              <Divider />

              <Stack spacing={2.5} sx={{ p: { xs: 2.5, sm: 4 } }}>

                <Typography variant="overline" color="text.secondary" fontWeight={700}>
                  Scheduling and status
                </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>

  <Box sx={{ width: "100%" }}>
    <Typography
      variant="caption"
      sx={{
        display: "block",
        mb: 0.5,
        color: "text.secondary",
        fontSize: "0.75rem"
      }}
    >
      Due date
    </Typography>

    <TextField
      fullWidth
      type="date"
      name="dueDate"
      value={task.dueDate}
      onChange={handleChange}
    />
  </Box>

  <TextField
    select
    fullWidth
    label="Priority"
    name="priority"
    value={task.priority}
    onChange={handleChange}
  >
    {["LOW", "MEDIUM", "HIGH"].map((level) => (
      <MenuItem key={level} value={level}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={level}
            size="small"
            color={priorityColor[level]}
            variant="outlined"
          />
        </Stack>
      </MenuItem>
    ))}
  </TextField>

  <TextField
    select
    fullWidth
    label="Status"
    name="status"
    value={task.status}
    onChange={handleChange}
  >
    <MenuItem value="PENDING">Pending</MenuItem>
    <MenuItem value="IN_PROGRESS">In progress</MenuItem>
    <MenuItem value="COMPLETED">Completed</MenuItem>
  </TextField>

</Stack>

              </Stack>

              <Divider />

              <Box
                sx={{
                  p: { xs: 2.5, sm: 4 },
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "flex-end",
                  gap: 1.5,
                  background: "#FAFBFC"
                }}
              >

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() =>
                    projectIdFromRoute
                      ? navigate(`/projects/${projectIdFromRoute}`)
                      : navigate("/tasks")
                  }
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<MdSave />}
                >
                  Create task
                </Button>

              </Box>

            </Box>

          </Paper>

        </Box>

      </Box>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          Task created successfully
        </Alert>
      </Snackbar>

      <Snackbar
        open={error !== ""}
        autoHideDuration={3000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>

    </>

  );
}

export default CreateTask;