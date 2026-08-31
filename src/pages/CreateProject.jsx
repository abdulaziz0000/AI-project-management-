import { useNavigate } from "react-router-dom";
import { useState } from "react";

import {
    Box,
    Typography,
    Paper,
    Stack,
    TextField,
    MenuItem,
    Button,
    Snackbar,
    Alert,
    useMediaQuery,
    useTheme
} from "@mui/material";

import { MdSave } from "react-icons/md";

import { createProject } from "../services/projectService";

function CreateProject() {

    const navigate = useNavigate();

    const theme = useTheme();

    const isMobile = useMediaQuery(
        theme.breakpoints.down("sm")
    );


    /*
     * ==========================================
     * GET USER + ORGANIZATION
     * ==========================================
     */

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const organization = JSON.parse(
        localStorage.getItem("organization") || "{}"
    );

    const organizationId = organization.id;
    const createdBy = user.id;


    /*
     * ==========================================
     * PROJECT STATE
     * ==========================================
     */

    const [project, setProject] = useState({

        name: "",
        description: "",
        startDate: "",
        endDate: "",
        priority: "MEDIUM",
        status: "IN_PROGRESS",
        organizationId,
        createdBy

    });


    const [success, setSuccess] = useState(false);

    const [error, setError] = useState("");


    /*
     * ==========================================
     * HANDLE INPUT
     * ==========================================
     */

    const handleChange = (e) => {

        setProject({

            ...project,

            [e.target.name]: e.target.value

        });

    };


    /*
     * ==========================================
     * CREATE PROJECT
     * ==========================================
     */

    const handleSubmit = async (e) => {

        e.preventDefault();

        const payload = {

            ...project,

            startDate:
                project.startDate || null,

            endDate:
                project.endDate || null

        };

        console.log(
            "Sending:",
            payload
        );


        try {

            const response =
                await createProject(payload);

            console.log(
                "SUCCESS",
                response
            );

            setSuccess(true);


            /*
             * Optional:
             * Go back to projects after success
             */

            setTimeout(() => {

                navigate("/projects");

            }, 1500);


        } catch (err) {

            console.error(
                "Create project error:",
                err
            );

            console.error(
                err.response
            );

            console.error(
                err.response?.data
            );

            console.error(
                err.response?.status
            );

            setError(
                err.response?.data?.message ||
                "Unable to create project."
            );

        }

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
                        xs: 2.5,
                        sm: 3,
                        md: 4
                    }
                }}
            >

                <Typography
                    variant={
                        isMobile
                            ? "h5"
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
                    Create Project
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
                    Create a new project for your organization
                </Typography>

            </Box>


            {/* ==========================================
                FORM CARD
            ========================================== */}

            <Paper
                elevation={0}
                sx={{
                    width: "100%",

                    maxWidth: {
                        xs: "100%",
                        sm: 650,
                        md: 700
                    },

                    p: {
                        xs: 2,
                        sm: 3,
                        md: 4
                    },

                    borderRadius: {
                        xs: 2.5,
                        sm: 3
                    },

                    border:
                        "1px solid",

                    borderColor:
                        "divider"
                }}
            >

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >

                    <Stack
                        spacing={{
                            xs: 2,
                            sm: 2.5,
                            md: 3
                        }}
                    >

                        {/* PROJECT NAME */}

                        <TextField
                            fullWidth
                            label="Project Name"
                            name="name"
                            value={project.name}
                            onChange={handleChange}
                            required
                        />


                        {/* DESCRIPTION */}

                        <TextField
                            fullWidth
                            multiline
                            rows={
                                isMobile
                                    ? 4
                                    : 5
                            }
                            label="Description"
                            name="description"
                            value={
                                project.description
                            }
                            onChange={handleChange}
                        />


                        {/* START DATE */}

                        <TextField
                            fullWidth
                            type="date"
                            label="Start Date"
                            name="startDate"
                            value={
                                project.startDate
                            }
                            onChange={handleChange}
                            slotProps={{
                                inputLabel: {
                                    shrink: true
                                }
                            }}
                        />


                        {/* END DATE */}

                        <TextField
                            fullWidth
                            type="date"
                            label="End Date"
                            name="endDate"
                            value={
                                project.endDate
                            }
                            onChange={handleChange}
                            slotProps={{
                                inputLabel: {
                                    shrink: true
                                }
                            }}
                        />


                        {/* PRIORITY */}

                        <TextField
                            select
                            fullWidth
                            label="Priority"
                            name="priority"
                            value={
                                project.priority
                            }
                            onChange={handleChange}
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


                        {/* STATUS */}

                        <TextField
                            select
                            fullWidth
                            label="Status"
                            name="status"
                            value={
                                project.status
                            }
                            onChange={handleChange}
                        >

                            <MenuItem value="IN_PROGRESS">
                                IN_PROGRESS
                            </MenuItem>

                            <MenuItem value="COMPLETED">
                                COMPLETED
                            </MenuItem>

                        </TextField>


                        {/* CREATE BUTTON */}

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            startIcon={
                                <MdSave />
                            }
                            fullWidth={isMobile}
                            sx={{
                                alignSelf: {
                                    xs: "stretch",
                                    sm: "flex-start"
                                },

                                minHeight: 46,

                                px: {
                                    xs: 2,
                                    sm: 4
                                },

                                borderRadius: 2,

                                textTransform:
                                    "none",

                                fontWeight: 600
                            }}
                        >
                            Create Project
                        </Button>

                    </Stack>

                </Box>

            </Paper>


            {/* ==========================================
                SUCCESS MESSAGE
            ========================================== */}

            <Snackbar
                open={success}
                autoHideDuration={3000}
                onClose={() =>
                    setSuccess(false)
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
            >

                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() =>
                        setSuccess(false)
                    }
                >
                    Project Created Successfully
                </Alert>

            </Snackbar>


            {/* ==========================================
                ERROR MESSAGE
            ========================================== */}

            <Snackbar
                open={error !== ""}
                autoHideDuration={3000}
                onClose={() =>
                    setError("")
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
            >

                <Alert
                    severity="error"
                    variant="filled"
                    onClose={() =>
                        setError("")
                    }
                >
                    {error}
                </Alert>

            </Snackbar>

        </Box>

    );

}

export default CreateProject;

