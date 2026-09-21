import { Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import { useTheme } from "@/components/theme-provider";
import { useAppearanceStore } from "@/store/appearance.store";

type ThemeValue = "light" | "dark" | "system";

const themeOptions: {
  id: ThemeValue;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
];

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  const compactSidebar = useAppearanceStore(
    (state) => state.compactSidebar
  );
  const reduceMotion = useAppearanceStore(
    (state) => state.reduceMotion
  );
  const setCompactSidebar = useAppearanceStore(
    (state) => state.setCompactSidebar
  );
  const setReduceMotion = useAppearanceStore(
    (state) => state.setReduceMotion
  );

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Appearance
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Customize how DevSphere looks and behaves.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>

          <CardDescription>
            Choose the appearance of your workspace.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            {themeOptions.map((option) => (
              <ThemeOption
                key={option.id}
                icon={option.icon}
                label={option.label}
                active={theme === option.id}
                onClick={() =>
                  setTheme(option.id)
                }
              />
            ))}
          </div>

          <Separator />

          <SettingRow
            title="Compact sidebar"
            description="Use a smaller sidebar while navigating."
          >
            <Switch
              checked={compactSidebar}
              onCheckedChange={setCompactSidebar}
            />
          </SettingRow>

          <SettingRow
            title="Reduce motion"
            description="Reduce animations and transitions."
          >
            <Switch
              checked={reduceMotion}
              onCheckedChange={setReduceMotion}
            />
          </SettingRow>
        </CardContent>
      </Card>
    </section>
  );
}

function ThemeOption({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={`
        h-auto
        flex-col
        gap-3
        py-5
        ${
          active
            ? "border-foreground bg-accent"
            : ""
        }
      `}
    >
      <Icon className="size-5" />

      <span>{label}</span>
    </Button>
  );
}

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div className="min-w-0">
        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      {children}
    </div>
  );
}
