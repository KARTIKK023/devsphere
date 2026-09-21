import { Search, GitBranch } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  branch: string;
  branches: string[];
  onBranchChange: (branch: string) => void;
};

export default function RepositoryToolbar({
  search,
  onSearchChange,
  branch,
  branches,
  onBranchChange,
}: Props) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Go to file..."
            className="pl-9"
          />
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" className="gap-2" />
          }
        >
          <GitBranch className="size-4" />
          {branch}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
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
  );
}
