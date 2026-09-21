import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  canCreate: boolean;
  onCreate: () => void;
};

export default function ArchitectureHeader({
  canCreate,
  onCreate,
}: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Architecture
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Design and visualize your systems.
        </p>
      </div>

      {canCreate && (
        <Button onClick={onCreate} className="gap-2">
          <Plus className="size-4" />
          New architecture
        </Button>
      )}
    </div>
  );
}