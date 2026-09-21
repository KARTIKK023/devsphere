import { Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RepositoryFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function RepositoryFilters({
  search,
  onSearchChange,
}: RepositoryFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search repositories..."
          className="pl-9"
        />
      </div>

      <Button variant="outline">
        <SlidersHorizontal className="size-4" />
        Filters
      </Button>
    </div>
  );
}