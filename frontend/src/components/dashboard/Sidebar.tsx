import {
  LayoutDashboard,
  FolderGit2,
  Bot,
  Settings,
} from "lucide-react";

import { Link } from "react-router-dom";

const navigation = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Repositories",
    icon: FolderGit2,
    path: "/dashboard",
  },
  {
    label: "AI Agent",
    icon: Bot,
    path: "/dashboard",
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/dashboard",
  },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-background md:block">

      {/* Logo */}

      <div className="flex h-16 items-center border-b px-6">

        <Link
          to="/dashboard"
          className="text-xl font-bold"
        >
          DevSphere
        </Link>

      </div>

      {/* Navigation */}

      <nav className="space-y-1 p-4">

        {navigation.map((item) => {

          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              to={item.path}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Icon className="h-4 w-4" />

              {item.label}
            </Link>
          );
        })}

      </nav>

    </aside>
  );
}