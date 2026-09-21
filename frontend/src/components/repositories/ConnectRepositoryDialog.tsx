import { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  Lock,
  Search,
  Star,
} from "lucide-react";

import { GithubIcon } from "@/components/icons/GithubIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { getApiErrorMessage } from "@/lib/get-api-error";
import {
  connectRepository,
  getAvailableRepositories,
} from "@/api/repositories";

import type { GithubRepository, Repository } from "@/types/repository";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  githubConnected: boolean;
  onConnectGithub: () => void;
  onConnected: (repository: Repository) => void;
};

export default function ConnectRepositoryDialog({
  open,
  onOpenChange,
  githubConnected,
  onConnectGithub,
  onConnected,
}: Props) {
  const [repositories, setRepositories] = useState<
    GithubRepository[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [connecting, setConnecting] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!open || !githubConnected) {
      return;
    }

    let active = true;

    setLoading(true);
    setError(null);

    getAvailableRepositories()
      .then((data) => {
        if (active) {
          setRepositories(data);
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(getApiErrorMessage(requestError));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [open, githubConnected]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return repositories;
    }

    return repositories.filter((repository) =>
      repository.fullName.toLowerCase().includes(query)
    );
  }, [repositories, search]);

  const handleConnect = async (repository: GithubRepository) => {
    setConnecting(repository.id);
    setError(null);

    try {
      const connected = await connectRepository(
        repository.fullName
      );

      onConnected(connected);
      onOpenChange(false);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setConnecting(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Connect a repository</DialogTitle>

          <DialogDescription>
            Choose a GitHub repository to connect to this
            workspace.
          </DialogDescription>
        </DialogHeader>

        {!githubConnected ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl border bg-muted/40">
              <GithubIcon className="size-6" />
            </div>

            <div>
              <p className="font-medium">
                Connect your GitHub account
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Authorize DevSphere to list your repositories
                and read their contents.
              </p>
            </div>

            <Button onClick={onConnectGithub} className="gap-2">
              <GithubIcon className="size-4" />
              Connect GitHub
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search repositories..."
                className="pl-9"
              />
            </div>

            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Loading repositories...
                </div>
              ) : filtered.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  No repositories found.
                </p>
              ) : (
                filtered.map((repository) => (
                  <div
                    key={repository.id}
                    className="flex items-center justify-between gap-3 rounded-lg border p-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium">
                          {repository.name}
                        </p>

                        {repository.private && (
                          <Lock className="size-3 shrink-0 text-muted-foreground" />
                        )}

                        <Badge
                          variant="secondary"
                          className="hidden sm:inline-flex"
                        >
                          {repository.language ?? "Unknown"}
                        </Badge>
                      </div>

                      <p className="truncate text-xs text-muted-foreground">
                        {repository.fullName}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
                        <Star className="size-3" />
                        {repository.stars}
                      </span>

                      <Button
                        size="sm"
                        disabled={connecting !== null}
                        onClick={() =>
                          handleConnect(repository)
                        }
                      >
                        {connecting === repository.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          "Connect"
                        )}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
