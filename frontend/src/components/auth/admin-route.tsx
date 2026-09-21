import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuthStore } from "@/store/auth.store";

export default function AdminRoute() {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );
  const isPlatformAdmin = useAuthStore(
    (state) => state.isPlatformAdmin
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isPlatformAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
