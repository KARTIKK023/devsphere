import RepositoryCodeViewer from "./RepositoryCodeViewer";
import RepositoryFileTree from "./RepositoryFileTree";

import type {
  RepositoryFile,
  RepositoryFileContent,
} from "@/types/repository";

type Props = {
  files: RepositoryFile[];
  selectedFile: string;
  onFileSelect: (path: string) => void;
  search: string;
  content: RepositoryFileContent | null;
  contentLoading: boolean;
  contentError: string | null;
};

export default function RepositoryFileBrowser({
  files,
  selectedFile,
  onFileSelect,
  search,
  content,
  contentLoading,
  contentError,
}: Props) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <RepositoryFileTree
        files={files}
        selectedFile={selectedFile}
        onFileSelect={onFileSelect}
        search={search}
      />

      <RepositoryCodeViewer
        file={content}
        loading={contentLoading}
        error={contentError}
      />
    </div>
  );
}
