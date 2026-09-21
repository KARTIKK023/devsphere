import type { Architecture } from "@/types/architecture";

import ArchitectureCard from "./ArchitectureCard";

type Props = {
  architectures: Architecture[];
  canDelete: boolean;
  onOpen: (architecture: Architecture) => void;
  onDelete: (architecture: Architecture) => void;
};

export default function ArchitectureGrid({
  architectures,
  canDelete,
  onOpen,
  onDelete,
}: Props) {
  if (architectures.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed">
        <div className="text-center">
          <h3 className="font-medium">
            No architectures found
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Create a new architecture or adjust your filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {architectures.map((architecture) => (
        <ArchitectureCard
          key={architecture.id}
          architecture={architecture}
          canDelete={canDelete}
          onOpen={onOpen}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
