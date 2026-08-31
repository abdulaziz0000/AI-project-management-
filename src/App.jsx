import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Register from "./pages/Register";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";

// Protected Pages
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import CreateProject from "./pages/CreateProject";
import ProjectDetails from "./pages/ProjectDetails";
import EditProject from "./pages/EditProject";
import Tasks from "./pages/Tasks";
import CreateTask from "./pages/CreateTask";
import InviteEmployee from "./pages/InviteEmployee";
import Profile from "./pages/Profile";
import User from "./pages/User";
import TaskDetails from "./pages/TaskDetails";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* =================================================
                    PUBLIC ROUTES
                    No Navbar / Sidebar
                ================================================= */}

                <Route
                    path="/create-organization"
                    element={<Registration />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />


                {/* =================================================
                    PROTECTED ROUTES
                    Must be logged in
                ================================================= */}

                <Route element={<ProtectedRoute />}>

                    {/* =================================================
                        APPLICATION LAYOUT
                        Navbar + Sidebar
                    ================================================= */}

                    <Route element={<AppLayout />}>

                        {/* =========================
                            DASHBOARD
                        ========================= */}

                        <Route
                            path="/"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />


                        {/* =========================
                            USERS
                        ========================= */}

                        <Route
                            path="/users"
                            element={<User />}
                        />


                        {/* =========================
                            PROJECTS
                        ========================= */}

                        <Route
                            path="/projects"
                            element={<Projects />}
                        />

                        <Route
                            path="/projects/create"
                            element={<CreateProject />}
                        />

                        <Route
                            path="/projects/:id"
                            element={<ProjectDetails />}
                        />

                        <Route
                            path="/projects/:id/edit"
                            element={<EditProject />}
                        />

                        <Route
                            path="/projects/:projectId/invite"
                            element={<InviteEmployee />}
                        />


                        {/* =========================
                            TASKS
                        ========================= */}

                        <Route
                            path="/tasks"
                            element={<Tasks />}
                        />

                        <Route
                            path="/tasks/create"
                            element={<CreateTask />}
                        />

                        <Route
                            path="/tasks/:taskId"
                            element={<TaskDetails />}
                        />

                        <Route
                            path="/projects/:projectId/tasks/create"
                            element={<CreateTask />}
                        />


                        {/* =========================
                            PROFILE
                        ========================= */}

                        <Route
                            path="/profile"
                            element={<Profile />}
                        />

                    </Route>

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;

