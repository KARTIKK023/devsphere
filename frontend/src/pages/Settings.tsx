import { useSearchParams } from "react-router-dom";

import SettingsSidebar from "@/components/settings/SettingsSidebar";
import { useVisibleSettingsSections } from "@/components/settings/settings-sections";
import GeneralSettings from "@/components/settings/GeneralSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import AccountSettings from "@/components/settings/AccountSettings";
import MembersSettings from "@/components/settings/MembersSettings";
import BillingSettings from "@/components/settings/BillingSettings";
import IntegrationSettings from "@/components/settings/IntegrationSettings";
import AISettings from "@/components/settings/AISettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import DangerZone from "@/components/settings/DangerZone";

export type SettingsSection =
  | "general"
  | "account"
  | "members"
  | "billing"
  | "appearance"
  | "integrations"
  | "ai"
  | "security"
  | "danger";

export default function Settings() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const sections = useVisibleSettingsSections();

  const requested = searchParams.get(
    "section"
  ) as SettingsSection | null;

  const section =
    requested &&
    sections.some((item) => item.id === requested)
      ? requested
      : sections[0]?.id ?? "general";

  const handleSectionChange = (
    next: SettingsSection
  ) => {
    setSearchParams(
      { section: next },
      { replace: true }
    );
  };

  return (
    <div className="min-h-full bg-background">
      <div className="flex w-full min-w-0 gap-8 p-6 lg:p-8">
        <SettingsSidebar
          activeSection={section}
          onSectionChange={handleSectionChange}
        />

        <main className="min-w-0 flex-1">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Settings
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage your workspace.
              </p>
            </div>
          </div>

          <nav className="-mx-4 mb-6 overflow-x-auto scrollbar-none lg:hidden">
            <div className="flex w-max gap-1 px-4">
              {sections.map((item) => {
                const Icon = item.icon;
                const isActive = section === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      handleSectionChange(item.id)
                    }
                    className={`
                      flex
                      shrink-0
                      items-center
                      gap-2
                      rounded-full
                      border
                      px-3
                      py-1.5
                      text-sm
                      font-medium
                      transition-colors
                      ${
                        isActive
                          ? "border-foreground bg-accent"
                          : "border-border text-muted-foreground"
                      }
                    `}
                  >
                    <Icon className="size-3.5" />

                    {item.label}
                  </button>
                );
              })}
            </div>
          </nav>

          {section === "general" && <GeneralSettings />}
          {section === "account" && <AccountSettings />}
          {section === "members" && <MembersSettings />}
          {section === "billing" && <BillingSettings />}
          {section === "appearance" && (
            <AppearanceSettings />
          )}
          {section === "integrations" && (
            <IntegrationSettings />
          )}
          {section === "ai" && <AISettings />}
          {section === "security" && (
            <SecuritySettings />
          )}
          {section === "danger" && <DangerZone />}
        </main>
      </div>
    </div>
  );
}
