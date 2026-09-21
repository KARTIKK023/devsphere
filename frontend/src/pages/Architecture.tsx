import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";

import ArchitectureHeader from "@/components/architecture/ArchitectureHeader";
import ArchitectureFilters from "@/components/architecture/ArchitectureFilters";
import ArchitectureGrid from "@/components/architecture/ArchitectureGrid";
import CreateArchitectureDialog, {
  type CreateArchitectureInput,
} from "@/components/architecture/CreateArchitectureDialog";

import { getApiErrorMessage } from "@/lib/get-api-error";
import {
  createArchitecture,
  deleteArchitecture,
  getArchitectures,
} from "@/api/architectures";
import { getConnectedRepositories } from "@/api/repositories";

import { usePermissions } from "@/hooks/use-permissions";

import type { Architecture } from "@/types/architecture";
import type { Repository } from "@/types/repository";

export default function ArchitecturePage() {
  const navigate = useNavigate();
  const { can } = usePermissions();

  const [architectures, setArchitectures] = useState<
    Architecture[]
  >([]);
  const [repositories, setRepositories] = useState<
    Repository[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [repository, setRepository] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);

  const canCreate = can("architecture:create");
  const canDelete = can("architecture:delete");

  useEffect(() => {
    let active = true;

    setLoading(true);

    Promise.all([
      getArchitectures(),
      getConnectedRepositories().catch(() => []),
    ])
      .then(([architectureList, repositoryList]) => {
        if (active) {
          setArchitectures(architectureList);
          setRepositories(repositoryList);
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

  const filteredArchitectures = useMemo(() => {
    const query = search.trim().toLowerCase();

    return architectures.filter((architecture) => {
      const matchesSearch =
        !query ||
        architecture.title.toLowerCase().includes(query) ||
        architecture.description
          .toLowerCase()
          .includes(query);

      const matchesRepository =
        repository === "all" ||
        (repository === "none"
          ? architecture.repositoryId === null
          : architecture.repositoryName === repository);

      return matchesSearch && matchesRepository;
    });
  }, [architectures, search, repository]);

  const handleCreate = async (
    data: CreateArchitectureInput
  ) => {
    setCreating(true);
    setError(null);

    try {
      const architecture = await createArchitecture({
        title: data.title,
        description: data.description,
        repositoryId: data.repositoryId,
      });

      setArchitectures((current) => [
        architecture,
        ...current,
      ]);
      setCreateOpen(false);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (architecture: Architecture) => {
    const confirmed = window.confirm(
      `Delete "${architecture.title}"? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteArchitecture(architecture.id);

      setArchitectures((current) =>
        current.filter((item) => item.id !== architecture.id)
      );
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  };

  const handleOpen = (architecture: Architecture) => {
    navigate(`/dashboard/architecture/${architecture.id}`);
  };

  return (
    <div className="min-w-0 flex-1">
      <div className="w-full space-y-6 p-6 lg:p-8">
        <ArchitectureHeader
          canCreate={canCreate}
          onCreate={() => setCreateOpen(true)}
        />

        <ArchitectureFilters
          search={search}
          onSearchChange={setSearch}
          repository={repository}
          repositories={repositories}
          onRepositoryChange={setRepository}
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
            Loading architectures...
          </div>
        ) : (
          <ArchitectureGrid
            architectures={filteredArchitectures}
            canDelete={canDelete}
            onOpen={handleOpen}
            onDelete={handleDelete}
          />
        )}

        <CreateArchitectureDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          repositories={repositories}
          creating={creating}
          onCreate={handleCreate}
        />
      </div>
    </div>
  );
}
