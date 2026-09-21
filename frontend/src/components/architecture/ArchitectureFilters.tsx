import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Repository } from "@/types/repository";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  repository: string;
  repositories: Repository[];
  onRepositoryChange: (value: string) => void;
};

export default function ArchitectureFilters({
  search,
  onSearchChange,
  repository,
  repositories,
  onRepositoryChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search architectures..."
          className="pl-9"
        />
      </div>

      <Select
        value={repository}
        onValueChange={(value) =>
          onRepositoryChange(value ?? "all")
        }
      >
        <SelectTrigger className="w-full sm:w-[220px]">
          <SelectValue placeholder="Repository" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All repositories
          </SelectItem>

          {repositories.map((item) => (
            <SelectItem key={item.id} value={item.name}>
              {item.name}
            </SelectItem>
          ))}

          <SelectItem value="none">
            No repository
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
