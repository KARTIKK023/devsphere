import type {
  RepositoryFile,
  RepositoryTreeEntry,
} from "@/types/repository";

function sortChildren(files: RepositoryFile[]): RepositoryFile[] {
  return [...files]
    .sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "folder" ? -1 : 1;
      }

      return a.name.localeCompare(b.name);
    })
    .map((file) =>
      file.type === "folder"
        ? {
            ...file,
            children: sortChildren(file.children ?? []),
          }
        : file
    );
}

export function buildRepositoryTree(
  entries: RepositoryTreeEntry[]
): RepositoryFile[] {
  const root: RepositoryFile[] = [];
  const folders = new Map<string, RepositoryFile>();

  const ensureFolder = (
    path: string
  ): RepositoryFile | null => {
    if (!path) {
      return null;
    }

    const existing = folders.get(path);

    if (existing) {
      return existing;
    }

    const segments = path.split("/");
    const name = segments[segments.length - 1] ?? path;

    const folder: RepositoryFile = {
      name,
      type: "folder",
      path,
      children: [],
    };

    folders.set(path, folder);

    const parentPath = segments
      .slice(0, -1)
      .join("/");

    const parent = ensureFolder(parentPath);

    if (parent) {
      parent.children = [...(parent.children ?? []), folder];
    } else {
      root.push(folder);
    }

    return folder;
  };

  for (const entry of entries) {
    if (entry.type === "folder") {
      ensureFolder(entry.path);
      continue;
    }

    const segments = entry.path.split("/");
    const name = segments[segments.length - 1] ?? entry.path;

    const file: RepositoryFile = {
      name,
      type: "file",
      path: entry.path,
    };

    const parentPath = segments.slice(0, -1).join("/");
    const parent = parentPath
      ? ensureFolder(parentPath)
      : null;

    if (parent) {
      parent.children = [...(parent.children ?? []), file];
    } else {
      root.push(file);
    }
  }

  return sortChildren(root);
}
