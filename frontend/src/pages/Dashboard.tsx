import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowUpRight,
  FolderGit2,
  GitBranch,
  LayoutTemplate,
  Loader2,
  Lock,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { getApiErrorMessage } from "@/lib/get-api-error";
import {
  formatNumber,
  formatRelativeTime,
} from "@/lib/format";
import {
  getDashboardOverview,
  type DashboardOverview,
} from "@/api/dashboard";

export default function Dashboard() {
  const [overview, setOverview] =
    useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getDashboardOverview()
      .then((data) => {
        if (active) {
          setOverview(data);
          setError(null);
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(getApiErrorMessage(requestError));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const stats = [
    {
      title: "Repositories",
      value: overview?.stats.repositories ?? 0,
      description: `${overview?.stats.privateRepositories ?? 0} private`,
      icon: GitBranch,
    },
    {
      title: "Architectures",
      value: overview?.stats.architectures ?? 0,
      description: "Design boards",
      icon: LayoutTemplate,
    },
    {
      title: "Teammates",
      value: overview?.stats.members ?? 0,
      description: "Active members",
      icon: Users,
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center gap-2 p-6 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading overview...
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Overview
        </h1>

        <p className="text-sm text-muted-foreground">
          Here's what's happening in your development
          workspace.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>

                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(stat.value)}
                </div>

                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Recent Repositories</CardTitle>

              <CardDescription>
                The latest repositories in this workspace.
              </CardDescription>
            </div>

            <Button
              variant="ghost"
              size="sm"
              render={
                <Link to="/dashboard/repositories" />
              }
            >
              View all
            </Button>
          </CardHeader>

          <CardContent>
            {overview && overview.recentRepositories.length > 0 ? (
              <div className="space-y-2">
                {overview.recentRepositories.map(
                  (repository) => (
                    <Link
                      key={repository.id}
                      to={`/dashboard/repositories/${repository.id}`}
                      className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/40"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-muted/40">
                          <GitBranch className="size-4" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium">
                              {repository.name}
                            </p>

                            {repository.private && (
                              <Lock className="size-3 shrink-0 text-muted-foreground" />
                            )}
                          </div>

                          <p className="truncate text-xs text-muted-foreground">
                            {repository.fullName}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatRelativeTime(
                          repository.lastSyncedAt
                        )}
                      </span>
                    </Link>
                  )
                )}
              </div>
            ) : (
              <EmptyState
                icon={FolderGit2}
                title="No repositories yet"
                description="Connect a GitHub repository to get started."
              />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Recent Architectures</CardTitle>

              <CardDescription>
                Your latest design boards.
              </CardDescription>
            </div>

            <Button
              variant="ghost"
              size="sm"
              render={
                <Link to="/dashboard/architecture" />
              }
            >
              View all
            </Button>
          </CardHeader>

          <CardContent>
            {overview && overview.recentArchitectures.length > 0 ? (
              <div className="space-y-2">
                {overview.recentArchitectures.map(
                  (architecture) => (
                    <Link
                      key={architecture.id}
                      to={`/dashboard/architecture/${architecture.id}`}
                      className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/40"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-muted/40">
                          <LayoutTemplate className="size-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {architecture.title}
                          </p>

                          <p className="truncate text-xs text-muted-foreground">
                            {architecture.repositoryName ??
                              "No repository"}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatRelativeTime(
                          architecture.updatedAt
                        )}
                      </span>
                    </Link>
                  )
                )}
              </div>
            ) : (
              <EmptyState
                icon={LayoutTemplate}
                title="No architectures yet"
                description="Create your first architecture board."
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Workspace plan</CardTitle>

            <CardDescription>
              Your current subscription.
            </CardDescription>
          </div>

          {overview?.subscription && (
            <Badge variant="secondary">
              {overview.subscription.plan.name}
            </Badge>
          )}
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(overview?.subscription?.plan.features ?? []).map(
              (feature) => (
                <Badge
                  key={feature}
                  variant="outline"
                  className="capitalize"
                >
                  {feature.replace(/-/g, " ")}
                </Badge>
              )
            )}

            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              render={<Link to="/dashboard/settings" />}
            >
              Manage
              <ArrowUpRight className="size-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof GitBranch;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed">
      <Icon className="mb-3 size-8 text-muted-foreground" />

      <p className="text-sm font-medium">{title}</p>

      <p className="mt-1 text-center text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
