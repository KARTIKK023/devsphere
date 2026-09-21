import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import OauthCallback from "@/pages/OauthCallback";

import Dashboard from "@/pages/Dashboard";
import DashboardLayout from "@/layouts/DashboardLayout";

import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminOrganizations from "@/pages/admin/AdminOrganizations";
import AdminUsers from "@/pages/admin/AdminUsers";

import Settings from "@/pages/Settings";
import Repositories from "@/pages/Repositories";
import RepositoryDetail from "@/pages/RepositoryDetail";

import Architecture from "@/pages/Architecture";
import ArchitectureEditor from "@/components/architecture/ArchitectureEditor";

import ProtectedRoute from "./components/auth/protected-route";
import GuestRoute from "./components/auth/guest-route";
import AdminRoute from "./components/auth/admin-route";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}

          <Route element={<GuestRoute />}>
            <Route
              path="/"
              element={<Landing />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/signup"
              element={<Signup />}
            />
          </Route>

          {/* OAuth callback */}

          <Route
            path="/auth/callback"
            element={<OauthCallback />}
          />

          {/* Platform admin */}

          <Route element={<AdminRoute />}>
            <Route
              path="/admin"
              element={<AdminLayout />}
            >
              <Route
                index
                element={<AdminDashboard />}
              />

              <Route
                path="organizations"
                element={<AdminOrganizations />}
              />

              <Route
                path="users"
                element={<AdminUsers />}
              />
            </Route>
          </Route>

          {/* Protected dashboard */}

          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={<DashboardLayout />}
            >
              {/* Dashboard */}

              <Route
                index
                element={<Dashboard />}
              />

              {/* Workspace */}

              <Route
                path="projects"
                element={
                  <div className="p-6">
                    Projects
                  </div>
                }
              />

              <Route
                path="repositories"
                element={<Repositories />}
              />

              <Route
                path="repositories/:repositoryId"
                element={<RepositoryDetail />}
              />

              <Route
                path="agent"
                element={
                  <div className="p-6">
                    AI Agent
                  </div>
                }
              />

              {/* Development */}

              <Route
                path="code"
                element={
                  <div className="p-6">
                    Code
                  </div>
                }
              />

              <Route
                path="architecture"
                element={<Architecture />}
              />

              <Route
                path="architecture/:architectureId"
                element={<ArchitectureEditor />}
              />

              <Route
                path="deployments"
                element={
                  <div className="p-6">
                    Deployments
                  </div>
                }
              />

              {/* Knowledge */}

              <Route
                path="meetings"
                element={
                  <div className="p-6">
                    Meetings
                  </div>
                }
              />

              <Route
                path="decisions"
                element={
                  <div className="p-6">
                    Decisions
                  </div>
                }
              />

              {/* Settings */}

              <Route
                path="settings"
                element={<Settings />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
  );
}