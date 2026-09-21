import {
  Bot,
  CreditCard,
  GitBranchIcon,
  Palette,
  Settings2,
  Shield,
  Trash2,
  User,
  Users,
} from "lucide-react";

import { usePermissions } from "@/hooks/use-permissions";

import type { SettingsSection } from "@/pages/Settings";

export type SettingsSectionDefinition = {
  id: SettingsSection;
  label: string;
  icon: React.ElementType;
  permission?: string;
  ownerOnly?: boolean;
};

export const settingsSections: SettingsSectionDefinition[] =
  [
    {
      id: "general",
      label: "General",
      icon: Settings2,
    },
    {
      id: "account",
      label: "Account",
      icon: User,
    },
    {
      id: "members",
      label: "Team",
      icon: Users,
      permission: "member:read",
    },
    {
      id: "billing",
      label: "Billing",
      icon: CreditCard,
      ownerOnly: true,
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: Palette,
    },
    {
      id: "integrations",
      label: "Integrations",
      icon: GitBranchIcon,
    },
    {
      id: "ai",
      label: "AI",
      icon: Bot,
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
    },
    {
      id: "danger",
      label: "Danger Zone",
      icon: Trash2,
      ownerOnly: true,
    },
  ];

export function useVisibleSettingsSections() {
  const { can, isOwner } = usePermissions();

  return settingsSections.filter((section) => {
    if (
      section.permission &&
      !can(section.permission)
    ) {
      return false;
    }

    if (section.ownerOnly && !isOwner) {
      return false;
    }

    return true;
  });
}
