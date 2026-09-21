import {
  useEffect,
  useState,
} from "react";

import {
  Loader2,
  Mail,
  UserPlus,
} from "lucide-react";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { usePermissions } from "@/hooks/use-permissions";
import {
  getData,
  postData,
} from "@/lib/api-client";
import { getApiErrorMessage } from "@/lib/get-api-error";
import { ROLE_LABELS } from "@/lib/permissions";

import type {
  AssignableRole,
  Member,
  SystemRole,
} from "@/types/auth";

const FALLBACK_ROLES: AssignableRole[] = [
  {
    name: "OWNER",
    description: "Full control",
  },
  {
    name: "MANAGER",
    description: "Manage projects and teams",
  },
  {
    name: "DEVELOPER",
    description: "Build and ship",
  },
];

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function MembersSettings() {
  const { can } = usePermissions();
  const canInvite = can("member:invite");

  const [members, setMembers] = useState<Member[]>([]);
  const [roles, setRoles] =
    useState<AssignableRole[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [dialogOpen, setDialogOpen] =
    useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] =
    useState<SystemRole>("DEVELOPER");
  const [inviteStatus, setInviteStatus] = useState<
    "idle" | "sending" | "sent"
  >("idle");
  const [inviteError, setInviteError] = useState("");

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const data = await getData<{
          members: Member[];
        }>("/organizations/members");

        if (active) {
          setMembers(data.members ?? []);
        }
      } catch (loadError) {
        if (active) {
          setError(
            getApiErrorMessage(loadError)
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!canInvite) {
      return;
    }

    getData<{ roles: AssignableRole[] }>(
      "/organizations/roles"
    )
      .then((data) =>
        setRoles(
          data.roles?.length
            ? data.roles
            : FALLBACK_ROLES
        )
      )
      .catch(() => setRoles(FALLBACK_ROLES));
  }, [canInvite]);

  const handleInvite = async () => {
    setInviteError("");
    setInviteStatus("sending");

    try {
      await postData<{ invitation?: unknown }>(
        "/invitations",
        {
          email: inviteEmail.trim(),
          role: inviteRole,
        }
      );

      setInviteStatus("sent");
      setInviteEmail("");

      setTimeout(() => {
        setInviteStatus("idle");
        setDialogOpen(false);
      }, 1500);
    } catch (inviteFailure) {
      setInviteStatus("idle");
      setInviteError(
        getApiErrorMessage(inviteFailure)
      );
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Team
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage who has access to this workspace.
          </p>
        </div>

        {canInvite && (
          <Button
            onClick={() => setDialogOpen(true)}
          >
            <UserPlus className="size-4" />
            Invite member
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>

          <CardDescription>
            Active members of this workspace.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {isLoading && (
            <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading members...
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}

          {!isLoading &&
            !error &&
            members.map((member) => (
              <div
                key={member.membershipId}
                className="flex items-center gap-4 rounded-lg border p-3"
              >
                <Avatar className="size-9">
                  {member.avatar && (
                    <AvatarImage
                      src={member.avatar}
                      alt={member.name}
                    />
                  )}

                  <AvatarFallback>
                    {getInitials(member.name || "?")}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {member.name}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    {member.email}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap justify-end gap-1">
                  {member.roles.map((role) => (
                    <Badge
                      key={role}
                      variant="secondary"
                    >
                      {ROLE_LABELS[role] ?? role}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}

          {!isLoading &&
            !error &&
            members.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No members yet.
              </p>
            )}
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Invite a member
            </DialogTitle>

            <DialogDescription>
              Send an invitation to join this
              workspace.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">
                Email
              </Label>

              <Input
                id="invite-email"
                type="email"
                placeholder="teammate@example.com"
                value={inviteEmail}
                onChange={(event) =>
                  setInviteEmail(event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>

              <Select
                value={inviteRole}
                onValueChange={(value) =>
                  setInviteRole(
                    (value as SystemRole) ??
                      "DEVELOPER"
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {(roles.length
                    ? roles
                    : FALLBACK_ROLES
                  ).map((role) => (
                    <SelectItem
                      key={role.name}
                      value={role.name}
                    >
                      {ROLE_LABELS[role.name] ??
                        role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {inviteError && (
              <p className="text-sm text-destructive">
                {inviteError}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={inviteStatus === "sending"}
            >
              Cancel
            </Button>

            <Button
              onClick={() => void handleInvite()}
              disabled={
                inviteStatus !== "idle" ||
                !inviteEmail.trim()
              }
            >
              {inviteStatus === "sending" && (
                <Loader2 className="size-4 animate-spin" />
              )}

              {inviteStatus === "sent" ? (
                <>
                  <Mail className="size-4" />
                  Sent
                </>
              ) : (
                "Send invitation"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
