import {
  ArrowLeft,
  ExternalLink,
  GitBranch,
  Lock,
  Unlock,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  owner: string;
  repo: string;
  branch: string;
  branches: string[];
  isPrivate: boolean;
  htmlUrl: string;
  onBranchChange: (branch: string) => void;
};

export default function RepositoryDetailHeader({
  owner,
  repo,
  branch,
  branches,
  isPrivate,
  htmlUrl,
  onBranchChange,
}: Props) {
  return (
    <div className="border-b">
      <div className="flex flex-col gap-4 px-6 py-5 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/dashboard/repositories"
              className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
            </Link>

            <div className="flex min-w-0 items-center gap-2 text-sm">
              <span className="truncate font-medium text-muted-foreground">
                {owner}
              </span>

              <span className="text-muted-foreground">/</span>

              <span className="truncate font-semibold">
                {repo}
              </span>

              <Badge
                variant="outline"
                className="ml-1 gap-1 rounded-full text-xs"
              >
                {isPrivate ? (
                  <Lock className="size-3" />
                ) : (
                  <Unlock className="size-3" />
                )}
                {isPrivate ? "Private" : "Public"}
              </Badge>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 gap-2"
            render={
              <a
                href={htmlUrl}
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            <ExternalLink className="size-4" />
            <span className="hidden sm:inline">
              View on GitHub
            </span>
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                />
              }
            >
              <GitBranch className="size-4" />
              {branch}
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              {branches.map((item) => (
                <DropdownMenuItem
                  key={item}
                  onClick={() => onBranchChange(item)}
                >
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
