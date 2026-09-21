import { useEffect, useState } from "react";

import {
  Building2,
  CircleDollarSign,
  Loader2,
  TrendingUp,
  Users,
  UserSquare2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { getData } from "@/lib/api-client";
import {
  formatNumber,
  formatRelativeTime,
} from "@/lib/format";
import { getApiErrorMessage } from "@/lib/get-api-error";

import type { PlatformStats } from "@/types/admin";

function StatCard({
  label,
  value,
  icon: Icon,
  detail,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  detail?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>

        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>

      <CardContent>
        <p className="text-3xl font-semibold tracking-tight">
          {formatNumber(value)}
        </p>

        {detail && (
          <p className="mt-1 text-xs text-muted-foreground">
            {detail}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] =
    useState<PlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getData<PlatformStats>("/admin/stats")
      .then((data) => {
        if (active) {
          setStats(data);
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

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Platform overview
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Monitor workspaces, users, and billing across
          DevSphere.
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading platform stats...
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}

      {!isLoading && stats && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Organizations"
              value={stats.organizations.total}
              icon={Building2}
              detail={`${formatNumber(stats.organizations.active)} active · ${formatNumber(stats.organizations.suspended)} suspended`}
            />

            <StatCard
              label="Users"
              value={stats.users.total}
              icon={Users}
              detail={`${formatNumber(stats.users.active)} active · ${formatNumber(stats.users.suspended)} suspended`}
            />

            <StatCard
              label="Active memberships"
              value={stats.memberships.active}
              icon={UserSquare2}
            />

            <StatCard
              label="Subscriptions"
              value={stats.subscriptions.total}
              icon={CircleDollarSign}
              detail={`${formatNumber(stats.subscriptions.premium)} premium · ${formatNumber(stats.subscriptions.free)} free`}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              label="New users (30 days)"
              value={stats.users.new30d}
              icon={TrendingUp}
            />

            <StatCard
              label="New organizations (30 days)"
              value={stats.organizations.new30d}
              icon={Building2}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Recent users
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {stats.recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(
                          user.createdAt
                        )}
                      </span>

                      <Badge
                        variant={
                          user.status === "ACTIVE"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                ))}

                {stats.recentUsers.length === 0 && (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    No users yet.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Recent organizations
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {stats.recentOrganizations.map(
                  (organization) => (
                    <div
                      key={organization.id}
                      className="flex items-center justify-between gap-4"
                    >
                      <p className="min-w-0 truncate text-sm font-medium">
                        {organization.name}
                      </p>

                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(
                            organization.createdAt
                          )}
                        </span>

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
                      </div>
                    </div>
                  )
                )}

                {stats.recentOrganizations.length === 0 && (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    No organizations yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </section>
  );
}