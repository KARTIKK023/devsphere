import {
  ChevronDown,
  ChevronRight,
  File,
  FileCode2,
  FileJson,
  Folder,
  FolderOpen,
} from "lucide-react";

import type { RepositoryFile } from "@/types/repository";

type Props = {
  item: RepositoryFile;
  level: number;
  selectedFile: string;
  expandedFolders: Set<string>;
  onToggleFolder: (path: string) => void;
  onFileSelect: (path: string) => void;
};

export default function RepositoryFileTreeItem({
  item,
  level,
  selectedFile,
  expandedFolders,
  onToggleFolder,
  onFileSelect,
}: Props) {
  const isFolder = item.type === "folder";
  const isExpanded = expandedFolders.has(item.path);
  const isSelected = selectedFile === item.path;

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          isFolder
            ? onToggleFolder(item.path)
            : onFileSelect(item.path)
        }
        className={`
          flex w-full items-center gap-2 rounded-md py-1.5
          text-left text-sm transition-colors
          ${
            isSelected
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }
        `}
        style={{
          paddingLeft: `${12 + level * 18}px`,
          paddingRight: "12px",
        }}
      >
        {isFolder ? (
          <>
            {isExpanded ? (
              <ChevronDown className="size-3.5 shrink-0" />
            ) : (
              <ChevronRight className="size-3.5 shrink-0" />
            )}

            {isExpanded ? (
              <FolderOpen className="size-4 shrink-0" />
            ) : (
              <Folder className="size-4 shrink-0" />
            )}
          </>
        ) : (
          <>
            <span className="size-3.5 shrink-0" />

            {item.name.endsWith(".tsx") ||
            item.name.endsWith(".ts") ? (
              <FileCode2 className="size-4 shrink-0" />
            ) : item.name.endsWith(".json") ? (
              <FileJson className="size-4 shrink-0" />
            ) : (
              <File className="size-4 shrink-0" />
            )}
          </>
        )}

        <span className="truncate">{item.name}</span>
      </button>

      {isFolder && isExpanded && item.children && (
        <div>
          {item.children.map((child) => (
            <RepositoryFileTreeItem
              key={child.path}
              item={child}
              level={level + 1}
              selectedFile={selectedFile}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}