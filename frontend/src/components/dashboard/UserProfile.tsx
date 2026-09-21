import {
  Bell,
  ChevronUp,
  LogOut,
  Moon,
  Settings,
  Sun,
  User as UserIcon,
} from "lucide-react";
import { useTheme } from "../theme-provider";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { Switch } from "@/components/ui/switch";

import type { User } from "@/types/user";

type UserProfileProps = {
  user: User;
  onProfile?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function UserProfile({
  user,
  onProfile,
  onSettings,
  onLogout,
}: UserProfileProps) {
  const { state, isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();

  const isCollapsed = state === "collapsed" && !isMobile;
  const isDark = theme === "dark";

  const initials = getInitials(user.name);
  const notificationCount = user.notificationCount ?? 0;

  const toggleTheme = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div
          className={`
            flex items-center
            ${isCollapsed ? "justify-center" : "gap-2"}
          `}
        >
          {/* Notifications */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="
              relative
              size-9
              shrink-0
              rounded-lg
              text-sidebar-foreground
              hover:bg-sidebar-accent
              hover:text-sidebar-accent-foreground
            "
          >
            <Bell className="size-5" />

            {notificationCount > 0 && (
              <span
                className="
                  absolute
                  right-1
                  top-1
                  flex
                  min-w-3.5
                  h-3.5
                  items-center
                  justify-center
                  rounded-full
                  border-2
                  border-sidebar
                  bg-emerald-500
                  px-0.5
                  text-[8px]
                  font-bold
                  leading-none
                  text-white
                "
              >
                {notificationCount > 9
                  ? "9+"
                  : notificationCount}
              </span>
            )}

            <span className="sr-only">
              Notifications
            </span>
          </Button>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  tooltip={user.name}
                  className={`
                    h-auto
                    min-h-12
                    flex-1
                    rounded-lg
                    px-2
                    py-1.5
                    hover:bg-sidebar-accent
                    hover:text-sidebar-accent-foreground
                    ${isCollapsed ? "justify-center" : ""}
                  `}
                />
              }
            >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <Avatar className="size-10">
                    {user.avatar && (
                      <AvatarImage
                        src={user.avatar}
                        alt={user.name}
                      />
                    )}

                    <AvatarFallback>
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  {user.isOnline && (
                    <span
                      className="
                        absolute
                        bottom-0
                        right-0
                        size-3
                        rounded-full
                        border-2
                        border-sidebar
                        bg-emerald-500
                      "
                    />
                  )}
                </div>

                {/* User information */}
                {!isCollapsed && (
                  <>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate text-sm font-medium leading-5">
                        {user.name}
                      </p>

                      <p className="truncate text-xs leading-5 text-sidebar-foreground/60">
                        {user.email}
                      </p>
                    </div>

                    <ChevronUp className="size-4 shrink-0 text-sidebar-foreground/50" />
                  </>
                )}
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side={isMobile ? "bottom" : "top"}
              align="end"
              sideOffset={8}
              className="w-64"
            >

              {/* Profile */}
              <DropdownMenuItem onClick={onProfile}>
                <UserIcon className="size-4" />
                Profile
              </DropdownMenuItem>

              {/* Settings */}
              <DropdownMenuItem onClick={onSettings}>
                <Settings className="size-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Theme */}
              <div
                className="
                  flex
                  items-center
                  justify-between
                  rounded-sm
                  px-2
                  py-2
                "
              >
                <div className="flex items-center gap-2">
                  {isDark ? (
                    <Moon className="size-4" />
                  ) : (
                    <Sun className="size-4" />
                  )}

                  <span className="text-sm">
                    Dark mode
                  </span>
                </div>

                <Switch
                  checked={isDark}
                  onCheckedChange={toggleTheme}
                  aria-label="Toggle dark mode"
                />
              </div>

              <DropdownMenuSeparator />

              {/* Logout */}
              <DropdownMenuItem
                onClick={onLogout}
                className="
                  text-destructive
                  focus:text-destructive
                "
              >
                <LogOut className="size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}