import type { ElementType } from "react";

import {
  Bot,
  Code2,
  CreditCard,
  FolderGit2,
  GitBranch,
  LayoutDashboard,
  Network,
  Rocket,
  Scale,
  Settings,
  Shield,
  Users,
  Video,
} from "lucide-react";

import {
  NavLink,
  useLocation,
} from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { usePermissions } from "@/hooks/use-permissions";

type NavItem = {
  title: string;
  url: string;
  icon: ElementType;
  permission?: string;
  anyOf?: string[];
  ownerOnly?: boolean;
  platformAdmin?: boolean;
  search?: string;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navigationGroups: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      {
        title: "Overview",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Projects",
        url: "/dashboard/projects",
        icon: FolderGit2,
        permission: "project:read",
      },
      {
        title: "Repositories",
        url: "/dashboard/repositories",
        icon: GitBranch,
        permission: "repository:read",
      },
      {
        title: "AI Agent",
        url: "/dashboard/agent",
        icon: Bot,
        permission: "agent:read",
      },
    ],
  },
  {
    label: "Development",
    items: [
      {
        title: "Code",
        url: "/dashboard/code",
        icon: Code2,
        permission: "repository:read",
      },
      {
        title: "Architecture",
        url: "/dashboard/architecture",
        icon: Network,
        permission: "architecture:read",
      },
      {
        title: "Deployments",
        url: "/dashboard/deployments",
        icon: Rocket,
        permission: "deployment:read",
      },
    ],
  },
  {
    label: "Knowledge",
    items: [
      {
        title: "Meetings",
        url: "/dashboard/meetings",
        icon: Video,
      },
      {
        title: "Decisions",
        url: "/dashboard/decisions",
        icon: Scale,
      },
    ],
  },
  {
    label: "Organization",
    items: [
      {
        title: "Team",
        url: "/dashboard/settings",
        search: "section=members",
        icon: Users,
        permission: "member:read",
      },
      {
        title: "Billing",
        url: "/dashboard/settings",
        search: "section=billing",
        icon: CreditCard,
        ownerOnly: true,
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        title: "Admin Console",
        url: "/admin",
        icon: Shield,
        platformAdmin: true,
      },
    ],
  },
];

function NavigationItem({ item }: { item: NavItem }) {
  const { pathname, search } = useLocation();
  const Icon = item.icon;

  const isActive =
    item.search !== undefined
      ? pathname.startsWith(item.url) &&
        search.includes(item.search)
      : item.url === "/dashboard"
        ? pathname === "/dashboard"
        : pathname.startsWith(item.url);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={item.title}
        isActive={isActive}
        className="
          h-9
          w-full
          rounded-lg
          px-3
          text-sm
          font-medium
          text-muted-foreground
          transition-colors
          duration-200
          hover:bg-sidebar-accent
          hover:text-sidebar-accent-foreground
          data-active:bg-sidebar-accent
          data-active:text-sidebar-accent-foreground
        "
        render={
          <NavLink
            to={item.url}
            end={item.url === "/dashboard"}
          />
        }
      >
        <Icon className="size-[17px] shrink-0" />
        <span className="truncate">{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function NavigationGroup({
  group,
  items,
}: {
  group: string;
  items: NavItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <SidebarGroup className="px-3 py-2">
      <SidebarGroupLabel
        className="
          mb-1
          px-2
          text-[11px]
          font-semibold
          uppercase
          tracking-wider
          text-muted-foreground/70
        "
      >
        {group}
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {items.map((item) => (
            <NavigationItem
              key={`${item.url}-${item.title}`}
              item={item}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const {
    can,
    canAny,
    isOwner,
    isPlatformAdmin,
  } = usePermissions();

  const groups = navigationGroups
    .map((group) => ({
      label: group.label,
      items: group.items.filter((item) => {
        if (
          item.platformAdmin &&
          !isPlatformAdmin
        ) {
          return false;
        }

        if (item.ownerOnly && !isOwner) {
          return false;
        }

        if (item.permission && !can(item.permission)) {
          return false;
        }

        if (item.anyOf && !canAny(item.anyOf)) {
          return false;
        }

        return true;
      }),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="DevSphere"
              className="
                h-12
                rounded-xl
                px-2
                hover:bg-sidebar-accent
              "
              render={<NavLink to="/dashboard" />}
            >
              <div
                className="
                  flex
                  size-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-foreground
                  text-background
                  shadow-sm
                "
              >
                <Code2 className="size-5" />
              </div>

              <div
                className="
                  flex
                  min-w-0
                  flex-1
                  flex-col
                  justify-center
                  text-left
                "
              >
                <span className="truncate text-sm font-semibold tracking-tight">
                  DevSphere
                </span>

                <span className="truncate text-[11px] text-muted-foreground">
                  Developer Workspace
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-0">
        {groups.map((group) => (
          <NavigationGroup
            key={group.label}
            group={group.label}
            items={group.items}
          />
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Settings"
              className="
                h-9
                rounded-lg
                px-3
                text-sm
                font-medium
                text-muted-foreground
                transition-all
                duration-200
                hover:bg-sidebar-accent
                hover:text-sidebar-accent-foreground
                data-active:bg-sidebar-accent
                data-active:text-sidebar-accent-foreground
              "
              render={
                <NavLink
                  to="/dashboard/settings"
                  end
                />
              }
            >
              <Settings className="size-[17px] shrink-0" />
              <span className="truncate">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
