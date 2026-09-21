import { AlertTriangle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DangerZone() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Danger Zone
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Irreversible actions affecting your workspace.
        </p>
      </div>

      <Card className="border-destructive/40">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg border border-destructive/30 bg-destructive/10">
              <AlertTriangle className="size-5 text-destructive" />
            </div>

            <div>
              <CardTitle className="text-destructive">
                Delete workspace
              </CardTitle>

              <CardDescription>
                Permanently delete this workspace and its data.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex items-center justify-between gap-6">
          <p className="text-sm text-muted-foreground">
            This action cannot be undone.
          </p>

          <Button variant="destructive">
            <Trash2 className="size-4" />
            Delete workspace
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}