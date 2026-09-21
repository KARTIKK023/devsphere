import { useState } from "react";

import { Check, Loader2 } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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

import { getApiErrorMessage } from "@/lib/get-api-error";
import { useAuthStore } from "@/store/auth.store";

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function AccountSettings() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore(
    (state) => state.updateProfile
  );

  const [name, setName] = useState(user?.name ?? "");
  const [avatar, setAvatar] = useState(
    user?.avatar ?? ""
  );
  const [status, setStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");
  const [error, setError] = useState("");

  const normalizedName = name.trim();

  const isDirty =
    normalizedName.length >= 2 &&
    (normalizedName !== (user?.name ?? "") ||
      (avatar.trim() || null) !== (user?.avatar ?? null));

  const handleSave = async () => {
    setError("");
    setStatus("saving");

    try {
      await updateProfile({
        name: normalizedName,
        avatar: avatar.trim() || null,
      });

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
          Account
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal DevSphere account.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>

          <CardDescription>
            Update your personal information.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              {avatar && (
                <AvatarImage
                  src={avatar}
                  alt={normalizedName}
                />
              )}

              <AvatarFallback>
                {getInitials(normalizedName || "DS")}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate font-medium">
                {user?.name}
              </p>

              <p className="truncate text-sm text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-name">Name</Label>

            <Input
              id="account-name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-avatar">
              Avatar URL
            </Label>

            <Input
              id="account-avatar"
              type="url"
              placeholder="https://example.com/avatar.png"
              value={avatar}
              onChange={(event) =>
                setAvatar(event.target.value)
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <Label>Email</Label>

            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>

            {user?.emailVerified ? (
              <Badge variant="secondary">
                Verified
              </Badge>
            ) : (
              <Badge variant="outline">
                Unverified
              </Badge>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}

          <Separator />

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
        </CardContent>
      </Card>
    </section>
  );
}
