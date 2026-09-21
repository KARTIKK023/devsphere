import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";

import RepositoryDetailHeader from "@/components/repositories/RepositoryDetailHeader";
import RepositoryDetailTabs from "@/components/repositories/RepositoryDetailTabs";
import RepositoryToolbar from "@/components/repositories/RepositoryToolbar";
import RepositoryFileBrowser from "@/components/repositories/RepositoryFileBrowser";
import RepositoryReadme from "@/components/repositories/RepositoryReadme";

import { getApiErrorMessage } from "@/lib/get-api-error";
import { buildRepositoryTree } from "@/lib/repository-tree";
import {
  getRepository,
  getRepositoryBranches,
  getRepositoryFile,
  getRepositoryTree,
} from "@/api/repositories";

import type {
  Repository,
  RepositoryFileContent,
  RepositoryTreeEntry,
} from "@/types/repository";

function findDefaultFile(
  entries: RepositoryTreeEntry[]
): string {
  const readme = entries.find(
    (entry) =>
      entry.type === "file" &&
      /^readme(\.md|\.mdx|\.txt)?$/i.test(entry.path)
  );

  if (readme) {
    return readme.path;
  }

  const firstFile = entries.find(
    (entry) => entry.type === "file"
  );

  return firstFile?.path ?? "";
}

export default function RepositoryDetail() {
  const { repositoryId } = useParams();

  const [repository, setRepository] =
    useState<Repository | null>(null);
  const [entries, setEntries] = useState<
    RepositoryTreeEntry[]
  >([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [branch, setBranch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState("");
  const [content, setContent] =
    useState<RepositoryFileContent | null>(null);
  const [contentLoading, setContentLoading] =
    useState(false);
  const [contentError, setContentError] = useState<
    string | null
  >(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!repositoryId) {
      return;
    }

    let active = true;

    setLoading(true);
    setError(null);

    getRepository(repositoryId)
      .then((data) => {
        if (!active) {
          return;
        }

        setRepository(data);
        setBranch(data.defaultBranch);

        return Promise.all([
          getRepositoryTree(
            repositoryId,
            data.defaultBranch
          ),
          getRepositoryBranches(repositoryId).catch(() => [
            data.defaultBranch,
          ]),
        ]);
      })
      .then((result) => {
        if (!active || !result) {
          return;
        }

        const [tree, branchList] = result;

        setEntries(tree.files);
        setBranches(branchList);
        setSelectedFile(findDefaultFile(tree.files));
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
  }, [repositoryId]);

  useEffect(() => {
    if (!repositoryId || !selectedFile || !branch) {
      setContent(null);
      return;
    }

    let active = true;

    setContentLoading(true);
    setContentError(null);

    getRepositoryFile(repositoryId, selectedFile, branch)
      .then((file) => {
        if (active) {
          setContent(file);
        }
      })
      .catch((requestError) => {
        if (active) {
          setContent(null);
          setContentError(
            getApiErrorMessage(requestError)
          );
        }
      })
      .finally(() => {
        if (active) {
          setContentLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [repositoryId, selectedFile, branch]);

  const handleBranchChange = async (
    nextBranch: string
  ) => {
    if (!repositoryId || nextBranch === branch) {
      return;
    }

    setBranch(nextBranch);

    try {
      const tree = await getRepositoryTree(
        repositoryId,
        nextBranch
      );

      setEntries(tree.files);
      setSelectedFile(findDefaultFile(tree.files));
    } catch (requestError) {
      setContentError(getApiErrorMessage(requestError));
    }
  };

  const files = useMemo(
    () => buildRepositoryTree(entries),
    [entries]
  );

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading repository...
      </div>
    );
  }

  if (error || !repository) {
    return (
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <AlertCircle className="size-6 text-destructive" />

          <p className="text-sm font-medium">
            {error ?? "Repository not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 flex-1">
      <div className="mx-auto w-full max-w-[1600px]">
        <RepositoryDetailHeader
          owner={repository.owner}
          repo={repository.name}
          branch={branch}
          branches={branches}
          isPrivate={repository.private}
          htmlUrl={repository.htmlUrl}
          onBranchChange={handleBranchChange}
        />

        <RepositoryDetailTabs />

        <div className="space-y-6 p-6 lg:p-8">
          <RepositoryToolbar
            search={search}
            onSearchChange={setSearch}
            branch={branch}
            branches={branches}
            onBranchChange={handleBranchChange}
          />

          <RepositoryFileBrowser
            files={files}
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
            search={search}
            content={content}
            contentLoading={contentLoading}
            contentError={contentError}
          />

          {repositoryId && (
            <RepositoryReadme
              repositoryId={repositoryId}
              branch={branch}
            />
          )}
        </div>
      </div>
    </div>
  );
}
