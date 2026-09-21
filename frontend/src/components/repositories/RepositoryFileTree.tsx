import { useEffect, useMemo, useState } from "react";

import type { RepositoryFile } from "@/types/repository";
import RepositoryFileTreeItem from "./RepositoryFileTreeItem";

type Props = {
  files: RepositoryFile[];
  selectedFile: string;
  onFileSelect: (path: string) => void;
  search: string;
};

function filterFiles(
  files: RepositoryFile[],
  search: string
): RepositoryFile[] {
  if (!search.trim()) {
    return files;
  }

  const query = search.toLowerCase();

  return files
    .map((file) => {
      if (file.type === "file") {
        return file.name.toLowerCase().includes(query) ||
          file.path.toLowerCase().includes(query)
          ? file
          : null;
      }

      const children = filterFiles(file.children ?? [], search);

      if (
        file.name.toLowerCase().includes(query) ||
        file.path.toLowerCase().includes(query) ||
        children.length > 0
      ) {
        return {
          ...file,
          children,
        };
      }

      return null;
    })
    .filter((file): file is RepositoryFile => file !== null);
}

function collectFolders(files: RepositoryFile[]): string[] {
  const folders: string[] = [];

  for (const file of files) {
    if (file.type === "folder") {
      folders.push(file.path);

      if (file.children) {
        folders.push(...collectFolders(file.children));
      }
    }
  }

  return folders;
}

export default function RepositoryFileTree({
  files,
  selectedFile,
  onFileSelect,
  search,
}: Props) {
  const filteredFiles = useMemo(
    () => filterFiles(files, search),
    [files, search]
  );

  const [expandedFolders, setExpandedFolders] = useState<
    Set<string>
  >(new Set());

  const toggleFolder = (path: string) => {
    setExpandedFolders((current) => {
      const next = new Set(current);

      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }

      return next;
    });
  };

  useEffect(() => {
    if (!search.trim()) {
      return;
    }

    setExpandedFolders(
      new Set(collectFolders(filterFiles(files, search)))
    );
  }, [files, search]);

  return (
    <div className="w-full overflow-hidden rounded-xl border bg-background lg:w-[320px]">
      <div className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Files</p>

          {search && (
            <span className="text-xs text-muted-foreground">
              {countFiles(filteredFiles)} results
            </span>
          )}
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto p-2">
        {filteredFiles.length > 0 ? (
          filteredFiles.map((item) => (
            <RepositoryFileTreeItem
              key={item.path}
              item={item}
              level={0}
              selectedFile={selectedFile}
              expandedFolders={expandedFolders}
              onToggleFolder={toggleFolder}
              onFileSelect={onFileSelect}
            />
          ))
        ) : (
          <div className="px-3 py-8 text-center">
            <p className="text-sm font-medium">
              No files found
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Try another file name.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function countFiles(files: RepositoryFile[]): number {
  return files.reduce((count, file) => {
    if (file.type === "file") {
      return count + 1;
    }

    return count + countFiles(file.children ?? []);
  }, 0);
}
