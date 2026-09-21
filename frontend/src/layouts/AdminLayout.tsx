import { ArrowLeft, Shield } from "lucide-react";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { Button } from "@/components/ui/button";

import { useAuthStore } from "@/store/auth.store";

const links = [
  { to: "/admin", label: "Overview", end: true },
  {
    to: "/admin/organizations",
    label: "Organizations",
    end: false,
  },
  {
    to: "/admin/users",
    label: "Users",
    end: false,
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen min-w-0 bg-background">
      <header className="border-b">
        <div className="flex min-w-0 items-center gap-4 px-4 py-3 sm:px-6">
          <div className="flex shrink-0 items-center gap-2 font-semibold">
            <Shield className="size-4" />
            <span className="hidden sm:inline">
              Platform Admin
            </span>
          </div>

          <nav className="flex min-w-0 items-center gap-1 overflow-x-auto">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-3">
            <span className="hidden text-sm text-muted-foreground md:inline">
              {user?.email}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="size-4" />
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl min-w-0 p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}
