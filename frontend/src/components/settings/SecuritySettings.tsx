import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Check,
  KeyRound,
  Laptop,
  Loader2,
  LogOut,
  Monitor,
  ShieldCheck,
  Smartphone,
  Tablet,
} from "lucide-react";

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

import { getData } from "@/lib/api-client";
import {
  formatDateTime,
  formatDuration,
  formatRelativeTime,
} from "@/lib/format";
import { getApiErrorMessage } from "@/lib/get-api-error";
import { useAuthStore } from "@/store/auth.store";

import type {
  SessionDevice,
  SessionSummary,
} from "@/types/auth";

const DEVICE_ICONS = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
} as const;

function DeviceGlyph({
  deviceType,
}: {
  deviceType: SessionDevice["deviceType"];
}) {
  const Icon = DEVICE_ICONS[deviceType] ?? Laptop;

  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/40">
      <Icon className="size-5" />
    </span>
  );
}

function getDeviceLabel(
  device: SessionDevice | null
): string {
  if (!device) {
    return "Unknown device";
  }

  const parts = [device.browser, device.os].filter(
    Boolean
  );

  return parts.length > 0 ? parts.join(" · ") : "Unknown device";
}

export default function SecuritySettings() {
  const changePassword = useAuthStore(
    (state) => state.changePassword
  );
  const revokeSession = useAuthStore(
    (state) => state.revokeSession
  );
  const logoutAll = useAuthStore(
    (state) => state.logoutAll
  );

  const [currentPassword, setCurrentPassword] =
    useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [passwordStatus, setPasswordStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");
  const [passwordError, setPasswordError] =
    useState("");

  const [sessions, setSessions] = useState<
    SessionSummary[]
  >([]);
  const [sessionsLoading, setSessionsLoading] =
    useState(true);
  const [revokingId, setRevokingId] = useState<
    string | null
  >(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 30000);

    return () => window.clearInterval(interval);
  }, []);

  const fetchSessions = useCallback(async () => {
    const data = await getData<{
      sessions: SessionSummary[];
    }>("/auth/sessions");

    return data.sessions ?? [];
  }, []);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const list = await fetchSessions();

        if (active) {
          setSessions(list);
        }
      } catch {
        if (active) {
          setSessions([]);
        }
      } finally {
        if (active) {
          setSessionsLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [fetchSessions]);

  const handleChangePassword = async () => {
    setPasswordError("");

    if (newPassword.length < 8) {
      setPasswordError(
        "New password must be at least 8 characters."
      );

      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");

      return;
    }

    setPasswordStatus("saving");

    try {
      await changePassword(
        currentPassword,
        newPassword
      );

      setPasswordStatus("saved");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(
        () => setPasswordStatus("idle"),
        2000
      );
    } catch (error) {
      setPasswordStatus("idle");
      setPasswordError(getApiErrorMessage(error));
    }
  };

  const handleRevoke = async (sessionId: string) => {
    setRevokingId(sessionId);

    try {
      await revokeSession(sessionId);
      setSessions(await fetchSessions());
    } catch {
      /* handled globally */
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Security
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage authentication and account security.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>

          <CardDescription>
            Change your account password.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">
              Current password
            </Label>

            <Input
              id="current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) =>
                setCurrentPassword(event.target.value)
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">
                New password
              </Label>

              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">
                Confirm password
              </Label>

              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
              />
            </div>
          </div>

          {passwordError && (
            <p className="text-sm text-destructive">
              {passwordError}
            </p>
          )}

          <div className="flex justify-end">
            <Button
              onClick={() =>
                void handleChangePassword()
              }
              disabled={
                passwordStatus === "saving" ||
                !currentPassword ||
                !newPassword
              }
            >
              {passwordStatus === "saving" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : passwordStatus === "saved" ? (
                <Check className="size-4" />
              ) : (
                <KeyRound className="size-4" />
              )}

              {passwordStatus === "saved"
                ? "Updated"
                : "Update password"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-5" />

              <div>
                <CardTitle>Active sessions</CardTitle>

                <CardDescription>
                  Devices currently signed in to your
                  account.
                </CardDescription>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => void logoutAll()}
            >
              <LogOut className="size-4" />
              Sign out everywhere
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {sessionsLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading sessions...
            </div>
          )}

          {!sessionsLoading &&
            sessions.map((session) => (
              <div
                key={session.id}
                className={`flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between ${
                  session.isCurrent
                    ? "border-foreground/20 bg-accent/40"
                    : ""
                }`}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <DeviceGlyph
                    deviceType={
                      session.device?.deviceType ?? "desktop"
                    }
                  />

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-medium">
                        {getDeviceLabel(session.device)}
                      </p>

                      {session.isCurrent && (
                        <Badge variant="secondary">
                          This device
                        </Badge>
                      )}
                    </div>

                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {session.organization?.name ??
                        "Workspace"}
                    </p>

                    <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                      <span>
                        Signed in{" "}
                        {formatDuration(
                          session.startedAt,
                          now
                        )}
                        ago
                      </span>

                      {session.lastActiveAt && (
                        <span>
                          Last active{" "}
                          {formatRelativeTime(
                            session.lastActiveAt
                          )}
                        </span>
                      )}

                      <span>
                        Expires{" "}
                        {formatRelativeTime(
                          session.expiresAt
                        )}
                      </span>
                    </div>

                    <p className="mt-1 hidden text-[11px] text-muted-foreground/80 sm:block">
                      Started {formatDateTime(session.startedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 sm:justify-end">
                  {session.isCurrent ? (
                    <span className="text-xs text-muted-foreground">
                      Current session
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={revokingId === session.id}
                      onClick={() =>
                        void handleRevoke(session.id)
                      }
                    >
                      {revokingId === session.id && (
                        <Loader2 className="size-3.5 animate-spin" />
                      )}
                      Revoke
                    </Button>
                  )}
                </div>
              </div>
            ))}

          {!sessionsLoading &&
            sessions.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No active sessions.
              </p>
            )}
        </CardContent>
      </Card>
    </section>
  );
}
