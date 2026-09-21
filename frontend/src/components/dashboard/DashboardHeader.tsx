import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/components/dashboard/UserProfile";

import { useAuthStore } from "@/store/auth.store";
import { usePermissions } from "@/hooks/use-permissions";
import { ROLE_LABELS } from "@/lib/permissions";

export function DashboardHeader() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const organization = useAuthStore(
    (state) => state.organization
  );
  const logout = useAuthStore((state) => state.logout);

  const { primaryRole, isPlatformAdmin } =
    usePermissions();

  const handleLogout = async () => {
    await logout();

    navigate("/login", { replace: true });
  };

  const firstName =
    user?.name?.trim().split(/\s+/)[0] ?? "there";

  return (
    <header className="flex h-16 shrink-0 items-center gap-1 border-b px-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger />

        <Separator
          orientation="vertical"
          className="mr-1 h-4 sm:mr-2"
        />

        <div className="flex min-w-0 items-center gap-2 text-sm">
          <span className="hidden text-muted-foreground md:inline">
            Hello, {firstName}
          </span>

          {primaryRole && (
            <Badge
              variant="secondary"
              className="hidden sm:inline-flex"
            >
              {ROLE_LABELS[primaryRole]}
            </Badge>
          )}

          {isPlatformAdmin && (
            <Badge
              variant="outline"
              className="hidden sm:inline-flex"
            >
              Platform Admin
            </Badge>
          )}

          {primaryRole && (
            <ChevronRight className="hidden size-4 shrink-0 text-muted-foreground sm:block" />
          )}

          <span className="truncate font-medium">
            {organization?.name ?? ""}
          </span>
        </div>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <UserProfile
          user={{
            id: user?.id ?? "unknown",
            name: user?.name ?? "Developer",
            email: user?.email ?? "",
            avatar: user?.avatar ?? null,
            isOnline: true,
          }}
          onSettings={() => navigate("/dashboard/settings")}
          onLogout={() => void handleLogout()}
        />
      </div>
    </header>
  );
}
