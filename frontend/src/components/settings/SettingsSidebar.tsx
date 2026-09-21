import { useVisibleSettingsSections } from "@/components/settings/settings-sections";

import type { SettingsSection } from "@/pages/Settings";

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

export default function SettingsSidebar({
  activeSection,
  onSectionChange,
}: SettingsSidebarProps) {
  const sections = useVisibleSettingsSections();

  return (
    <aside className="hidden w-52 shrink-0 lg:block">
      <div className="sticky top-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight">
            Settings
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your workspace.
          </p>
        </div>

        <nav className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive =
              activeSection === section.id;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() =>
                  onSectionChange(section.id)
                }
                className={`
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-lg
                  px-3
                  py-2.5
                  text-left
                  text-sm
                  font-medium
                  transition-colors
                  ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }
                `}
              >
                <Icon className="size-4 shrink-0" />

                <span>{section.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
