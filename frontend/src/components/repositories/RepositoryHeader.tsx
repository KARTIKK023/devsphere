import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  canConnect: boolean;
  onConnect: () => void;
};

export default function RepositoryHeader({
  canConnect,
  onConnect,
}: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Repositories
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Connect and manage the repositories used by your projects.
        </p>
      </div>

      {canConnect && (
        <Button onClick={onConnect}>
          <Plus className="size-4" />
          Connect repository
        </Button>
      )}
    </div>
  );
}
