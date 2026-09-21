import {
  GitBranch,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

import type { Architecture } from "@/types/architecture";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { formatRelativeTime } from "@/lib/format";

type Props = {
  architecture: Architecture;
  canDelete: boolean;
  onOpen: (architecture: Architecture) => void;
  onDelete: (architecture: Architecture) => void;
};

export default function ArchitectureCard({
  architecture,
  canDelete,
  onOpen,
  onDelete,
}: Props) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      onClick={() => onOpen(architecture)}
    >
      <div className="relative h-44 overflow-hidden border-b bg-muted/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] bg-[size:20px_20px]" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <PreviewNode label="Client" />
            <PreviewLine />
            <PreviewNode label="API" />
            <PreviewLine />
            <PreviewNode label="DB" />
          </div>
        </div>

        <div className="absolute left-3 top-3">
          <Badge variant="secondary">Architecture</Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="line-clamp-1 text-base">
            {architecture.title}
          </CardTitle>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0"
                  onClick={(event) => event.stopPropagation()}
                />
              }
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onOpen(architecture)}
              >
                Open
              </DropdownMenuItem>

              {canDelete && (
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDelete(architecture)}
                >
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {architecture.description || "No description"}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
        {architecture.repositoryName ? (
          <div className="flex items-center gap-1.5">
            <GitBranch className="size-3.5" />
            {architecture.repositoryName}
          </div>
        ) : (
          <span>No repository</span>
        )}

        <span>{formatRelativeTime(architecture.updatedAt)}</span>
      </CardFooter>
    </Card>
  );
}

function PreviewNode({ label }: { label: string }) {
  return (
    <div className="rounded-md border bg-background px-3 py-2 text-[10px] font-medium shadow-sm">
      {label}
    </div>
  );
}

function PreviewLine() {
  return <div className="h-px w-5 bg-border" />;
}
