import { Bot } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default function AISettings() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          AI
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Configure the AI systems powering DevSphere.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/40">
              <Bot className="size-5" />
            </div>

            <div>
              <CardTitle>Agent configuration</CardTitle>

              <CardDescription>
                Configure your default coding agent.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Default model</Label>

            <Select defaultValue="llama">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="llama">
                  Llama 3.1 8B
                </SelectItem>

                <SelectItem value="gemini">
                  Gemini
                </SelectItem>

                <SelectItem value="openai">
                  OpenAI
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperature">
              Temperature
            </Label>

            <Input
              id="temperature"
              type="number"
              min="0"
              max="2"
              step="0.1"
              defaultValue="0"
            />

            <p className="text-xs text-muted-foreground">
              Lower values make responses more deterministic.
            </p>
          </div>

          <Separator />

          <SettingRow
            title="Memory"
            description="Allow the agent to use stored workspace context."
          >
            <Switch defaultChecked />
          </SettingRow>

          <SettingRow
            title="Tool execution"
            description="Allow the agent to execute enabled tools."
          >
            <Switch defaultChecked />
          </SettingRow>

          <SettingRow
            title="File access"
            description="Allow the agent to read and modify workspace files."
          >
            <Switch defaultChecked />
          </SettingRow>

          <Separator />

          <div className="flex justify-end">
            <Button>
              Save AI settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
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