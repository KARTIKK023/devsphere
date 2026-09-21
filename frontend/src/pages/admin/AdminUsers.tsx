import { useEffect, useState } from "react";

import { Loader2, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { getData, patchData } from "@/lib/api-client";
import { formatRelativeTime } from "@/lib/format";
import { getApiErrorMessage } from "@/lib/get-api-error";

import type {
  AdminProvider,
  AdminUser,
  AdminUserStatus,
} from "@/types/admin";

const PROVIDER_LABELS: Record<AdminProvider, string> = {
  EMAIL: "Email",
  GOOGLE: "Google",
  GITHUB: "GitHub",
};

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingId, setPendingId] = useState<
    string | null
  >(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getData<{ users: AdminUser[] }>("/admin/users")
      .then((data) => {
        if (active) {
          setUsers(data.users ?? []);
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(getApiErrorMessage(loadError));
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const updateStatus = async (
    id: string,
    status: AdminUserStatus
  ) => {
    setPendingId(id);
    setError("");

    try {
      await patchData(`/admin/users/${id}`, {
        status,
      });

      setUsers((previous) =>
        previous.map((user) =>
          user.id === id ? { ...user, status } : user
        )
      );
    } catch (updateError) {
      setError(getApiErrorMessage(updateError));
    } finally {
      setPendingId(null);
    }
  };

  const query = search.trim().toLowerCase();

  const filteredUsers = query
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      )
    : users;

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Users
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Review and moderate every account.
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center gap-2 border-b p-4">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by name or email..."
                className="pl-9"
              />
            </div>

            <span className="ml-auto text-xs text-muted-foreground">
              {filteredUsers.length} of {users.length}
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading users...
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3 font-medium">
                      User
                    </th>
                    <th className="px-4 py-3 font-medium">
                      Sign-in
                    </th>
                    <th className="px-4 py-3 font-medium">
                      Verified
                    </th>
                    <th className="px-4 py-3 font-medium">
                      Joined
                    </th>
                    <th className="px-4 py-3 font-medium">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b last:border-0"
                    >
                      <td className="px-4 py-3">
                        <p className="flex items-center gap-2 font-medium">
                          {user.name}

                          {user.isPlatformAdmin && (
                            <Badge variant="outline">
                              Admin
                            </Badge>
                          )}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {user.providers.length > 0 ? (
                            user.providers.map((provider) => (
                              <Badge
                                key={provider}
                                variant="secondary"
                                className="font-normal"
                              >
                                {
                                  PROVIDER_LABELS[
                                    provider
                                  ]
                                }
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              —
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {user.emailVerified ? (
                          <Badge variant="secondary">
                            Yes
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            No
                          </Badge>
                        )}
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {formatRelativeTime(
                          user.createdAt
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            user.status === "ACTIVE"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {user.status}
                        </Badge>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={pendingId === user.id}
                          onClick={() =>
                            void updateStatus(
                              user.id,
                              user.status === "ACTIVE"
                                ? "SUSPENDED"
                                : "ACTIVE"
                            )
                          }
                        >
                          {pendingId === user.id && (
                            <Loader2 className="size-3.5 animate-spin" />
                          )}

                          {user.status === "ACTIVE"
                            ? "Suspend"
                            : "Activate"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <p className="p-6 text-center text-sm text-muted-foreground">
                  {search
                    ? "No users match your search."
                    : "No users found."}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
