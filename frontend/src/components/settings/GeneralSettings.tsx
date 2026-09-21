import { useState } from "react";

import { Check, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";

import { usePermissions } from "@/hooks/use-permissions";
import { patchData } from "@/lib/api-client";
import { getApiErrorMessage } from "@/lib/get-api-error";
import { useAuthStore } from "@/store/auth.store";

import type { Organization } from "@/types/auth";

export default function GeneralSettings() {
  const organization = useAuthStore(
    (state) => state.organization
  );
  const subscription = useAuthStore(
    (state) => state.subscription
  );
  const { isOwner } = usePermissions();

  const [name, setName] = useState(
    organization?.name ?? ""
  );
  const [status, setStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");
  const [error, setError] = useState("");

  const normalizedName = name.trim();

  const isDirty =
    normalizedName.length >= 2 &&
    normalizedName !== (organization?.name ?? "");

  const handleSave = async () => {
    setError("");
    setStatus("saving");

    try {
      const data = await patchData<{
        organization: Organization;
      }>("/organizations/current", {
        name: normalizedName,
      });

      useAuthStore.setState((state) => ({
        organization: state.organization
          ? {
              ...state.organization,
              ...data.organization,
            }
          : data.organization,
      }));

      setStatus("saved");

      setTimeout(() => setStatus("idle"), 2000);
    } catch (saveError) {
      setStatus("idle");
      setError(getApiErrorMessage(saveError));
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          General
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage the basic configuration of your
          workspace.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>

          <CardDescription>
            Configure how your DevSphere workspace is
            identified.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="workspace-name">
              Workspace name
            </Label>

            <Input
              id="workspace-name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              disabled={!isOwner}
            />

            {!isOwner && (
              <p className="text-xs text-muted-foreground">
                Only the workspace owner can rename
                it.
              </p>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}

          <Separator />

          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium">
                Workspace ID
              </p>

              <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
                {organization?.slug ?? "-"}
              </p>
            </div>

            <Badge variant="outline">
              {subscription?.plan.name ?? "No plan"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                Created
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {organization?.createdAt
                  ? new Date(
                      organization.createdAt
                    ).toLocaleDateString()
                  : "-"}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium">
                Members
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {organization?.memberCount ?? "-"}
              </p>
            </div>
          </div>

          {isOwner && (
            <div className="flex justify-end">
              <Button
                onClick={() => void handleSave()}
                disabled={
                  status === "saving" || !isDirty
                }
              >
                {status === "saving" && (
                  <Loader2 className="size-4 animate-spin" />
                )}

                {status === "saved" && (
                  <Check className="size-4" />
                )}

                {status === "saved"
                  ? "Saved"
                  : "Save changes"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
