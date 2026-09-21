import {
  GitBranch,
  Lock,
  MoreHorizontal,
  Trash2,
  Unlock,
} from "lucide-react";

import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { formatRelativeTime } from "@/lib/format";

import type { Repository } from "@/types/repository";

type Props = {
  repository: Repository;
  canDisconnect: boolean;
  onDisconnect: (repository: Repository) => void;
};

export default function RepositoryCard({
  repository,
  canDisconnect,
  onDisconnect,
}: Props) {
  return (
    <Card className="transition-colors hover:bg-muted/30">
      <CardContent className="p-4">
        <div className="grid items-center gap-4 md:grid-cols-[minmax(0,2fr)_1fr_1fr_1fr_auto]">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/40">
              <GitBranch className="size-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Link
                  to={`/dashboard/repositories/${repository.id}`}
                  className="truncate font-semibold hover:underline"
                >
                  {repository.name}
                </Link>

                {repository.private ? (
                  <Lock className="size-3.5 shrink-0 text-muted-foreground" />
                ) : (
                  <Unlock className="size-3.5 shrink-0 text-muted-foreground" />
                )}
              </div>

              <p className="truncate text-xs text-muted-foreground">
                {repository.fullName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GitBranch className="size-4" />
            <span className="truncate">
              {repository.defaultBranch}
            </span>
          </div>

          <div className="truncate text-sm">
            {repository.language ?? "—"}
          </div>

          <div>
            <Badge variant="secondary">
              {repository.status === "CONNECTED"
                ? "Connected"
                : "Error"}
            </Badge>

            <p className="mt-1 text-xs text-muted-foreground">
              {formatRelativeTime(repository.lastSyncedAt)}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                />
              }
            >
              <MoreHorizontal className="size-4" />

              <span className="sr-only">
                Repository actions
              </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                render={
                  <Link
                    to={`/dashboard/repositories/${repository.id}`}
                  />
                }
              >
                Open repository
              </DropdownMenuItem>

              <DropdownMenuItem
                render={
                  <a
                    href={repository.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                  />
                }
              >
                View on GitHub
              </DropdownMenuItem>

              {canDisconnect && (
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDisconnect(repository)}
                >
                  <Trash2 className="size-4" />
                  Disconnect
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 border-t pt-3 md:hidden">
          <Badge variant="outline">
            <GitBranch className="mr-1 size-3" />
            {repository.defaultBranch}
          </Badge>

          <Badge variant="outline">
            {repository.language ?? "—"}
          </Badge>

          <Badge variant="secondary">
            {repository.status === "CONNECTED"
              ? "Connected"
              : "Error"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
