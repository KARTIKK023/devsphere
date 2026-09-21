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
  AdminOrganization,
  AdminOrganizationStatus,
} from "@/types/admin";

export default function AdminOrganizations() {
  const [organizations, setOrganizations] = useState<
    AdminOrganization[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingId, setPendingId] = useState<
    string | null
  >(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getData<{ organizations: AdminOrganization[] }>(
      "/admin/organizations"
    )
      .then((data) => {
        if (active) {
          setOrganizations(data.organizations ?? []);
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
    status: AdminOrganizationStatus
  ) => {
    setPendingId(id);
    setError("");

    try {
      await patchData(`/admin/organizations/${id}`, {
        status,
      });

      setOrganizations((previous) =>
        previous.map((organization) =>
          organization.id === id
            ? { ...organization, status }
            : organization
        )
      );
    } catch (updateError) {
      setError(getApiErrorMessage(updateError));
    } finally {
      setPendingId(null);
    }
  };

  const query = search.trim().toLowerCase();

  const filteredOrganizations = query
    ? organizations.filter(
        (organization) =>
          organization.name
            .toLowerCase()
            .includes(query) ||
          organization.slug
            .toLowerCase()
            .includes(query) ||
          organization.owner?.email
            ?.toLowerCase()
            .includes(query)
      )
    : organizations;

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Organizations
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Review and moderate every workspace.
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
                placeholder="Search by name or owner..."
                className="pl-9"
              />
            </div>

            <span className="ml-auto text-xs text-muted-foreground">
              {filteredOrganizations.length} of{" "}
              {organizations.length}
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading organizations...
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[820px] text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3 font-medium">
                      Workspace
                    </th>
                    <th className="px-4 py-3 font-medium">
                      Owner
                    </th>
                    <th className="px-4 py-3 font-medium">
                      Plan
                    </th>
                    <th className="px-4 py-3 font-medium">
                      Members
                    </th>
                    <th className="px-4 py-3 font-medium">
                      Created
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
                  {filteredOrganizations.map(
                    (organization) => (
                      <tr
                        key={organization.id}
                        className="border-b last:border-0"
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium">
                            {organization.name}
                          </p>

                          <p className="font-mono text-xs text-muted-foreground">
                            {organization.slug}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          <p>
                            {organization.owner?.name ??
                              "—"}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {organization.owner?.email ??
                              ""}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          {organization.plan ? (
                            <Badge
                              variant={
                                organization.plan ===
                                "PREMIUM"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {organization.planName ??
                                organization.plan}
                            </Badge>
                          ) : (
                            "—"
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {organization.memberCount}
                        </td>

                        <td className="px-4 py-3 text-muted-foreground">
                          {formatRelativeTime(
                            organization.createdAt
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              organization.status ===
                              "ACTIVE"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {organization.status}
                          </Badge>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={
                              pendingId ===
                              organization.id
                            }
                            onClick={() =>
                              void updateStatus(
                                organization.id,
                                organization.status ===
                                  "ACTIVE"
                                  ? "SUSPENDED"
                                  : "ACTIVE"
                              )
                            }
                          >
                            {pendingId ===
                              organization.id && (
                              <Loader2 className="size-3.5 animate-spin" />
                            )}

                            {organization.status ===
                            "ACTIVE"
                              ? "Suspend"
                              : "Activate"}
                          </Button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>

              {filteredOrganizations.length === 0 && (
                <p className="p-6 text-center text-sm text-muted-foreground">
                  {search
                    ? "No organizations match your search."
                    : "No organizations found."}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
