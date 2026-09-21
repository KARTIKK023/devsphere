import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import RepositoryHeader from "@/components/repositories/RepositoryHeader";
import RepositoryFilters from "@/components/repositories/RepositoryFilters";
import RepositoryList from "@/components/repositories/RepositoryList";
import RepositoryPagination from "@/components/repositories/RepositoryPagination";
import EmptyRepositories from "@/components/repositories/EmptyRepositories";
import ConnectRepositoryDialog from "@/components/repositories/ConnectRepositoryDialog";

import { getApiErrorMessage } from "@/lib/get-api-error";
import { startOAuth } from "@/lib/oauth";
import {
  disconnectRepository,
  getConnectedRepositories,
} from "@/api/repositories";

import { useAuthStore } from "@/store/auth.store";
import { usePermissions } from "@/hooks/use-permissions";

import type { Repository } from "@/types/repository";

const ITEMS_PER_PAGE = 6;

export default function Repositories() {
  const { can } = usePermissions();
  const githubConnected = useAuthStore(
    (state) => state.user?.githubConnected ?? false
  );

  const [repositories, setRepositories] = useState<
    Repository[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const canConnect = can("repository:create");
  const canDisconnect = can("repository:delete");

  useEffect(() => {
    let active = true;

    setLoading(true);

    getConnectedRepositories()
      .then((data) => {
        if (active) {
          setRepositories(data);
          setError(null);
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
  }, []);

  const filteredRepositories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return repositories;
    }

    return repositories.filter((repository) =>
      `${repository.name} ${repository.fullName}`
        .toLowerCase()
        .includes(query)
    );
  }, [repositories, search]);

  const totalPages = Math.ceil(
    filteredRepositories.length / ITEMS_PER_PAGE
  );

  const paginatedRepositories = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredRepositories.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredRepositories, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleConnected = (repository: Repository) => {
    setRepositories((current) => {
      const withoutRepository = current.filter(
        (item) => item.id !== repository.id
      );

      return [repository, ...withoutRepository];
    });
  };

  const handleDisconnect = async (repository: Repository) => {
    const confirmed = window.confirm(
      `Disconnect ${repository.fullName}? You can connect it again later.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await disconnectRepository(repository.id);

      setRepositories((current) =>
        current.filter((item) => item.id !== repository.id)
      );
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  };

  return (
    <div className="min-w-0 flex-1">
      <div className="mx-auto w-full max-w-7xl space-y-6 p-6 lg:p-8">
        <RepositoryHeader
          canConnect={canConnect}
          onConnect={() => setDialogOpen(true)}
        />

        <RepositoryFilters
          search={search}
          onSearchChange={setSearch}
        />

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading repositories...
          </div>
        ) : filteredRepositories.length > 0 ? (
          <>
            <RepositoryList
              repositories={paginatedRepositories}
              canDisconnect={canDisconnect}
              onDisconnect={handleDisconnect}
            />

            {totalPages > 1 && (
              <RepositoryPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <EmptyRepositories
            canConnect={canConnect}
            onConnect={() => setDialogOpen(true)}
          />
        )}
      </div>

      <ConnectRepositoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        githubConnected={githubConnected}
        onConnectGithub={() => startOAuth("github")}
        onConnected={handleConnected}
      />
    </div>
  );
}
