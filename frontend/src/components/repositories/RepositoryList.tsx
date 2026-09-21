import RepositoryCard from "./RepositoryCard";

import type { Repository } from "@/types/repository";

type Props = {
  repositories: Repository[];
  canDisconnect: boolean;
  onDisconnect: (repository: Repository) => void;
};

export default function RepositoryList({
  repositories,
  canDisconnect,
  onDisconnect,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="hidden grid-cols-[minmax(0,2fr)_1fr_1fr_1fr_auto] gap-4 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground md:grid">
        <span>Repository</span>
        <span>Branch</span>
        <span>Language</span>
        <span>Status</span>
        <span />
      </div>

      {repositories.map((repository) => (
        <RepositoryCard
          key={repository.id}
          repository={repository}
          canDisconnect={canDisconnect}
          onDisconnect={onDisconnect}
        />
      ))}
    </div>
  );
}
