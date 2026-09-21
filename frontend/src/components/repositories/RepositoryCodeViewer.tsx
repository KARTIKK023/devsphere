import {
  AlertCircle,
  Copy,
  FileCode2,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { RepositoryFileContent } from "@/types/repository";

type Props = {
  file: RepositoryFileContent | null;
  loading: boolean;
  error: string | null;
};

export default function RepositoryCodeViewer({
  file,
  loading,
  error,
}: Props) {
  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-1 items-center justify-center rounded-xl border bg-background">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading file...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-1 items-center justify-center rounded-xl border bg-background px-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className="size-5 text-destructive" />

          <p className="text-sm text-muted-foreground">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="flex min-h-[400px] flex-1 items-center justify-center rounded-xl border bg-background">
        <p className="text-sm text-muted-foreground">
          Select a file to view its contents.
        </p>
      </div>
    );
  }

  const lines = file.content.split("\n");

  const copyCode = async () => {
    await navigator.clipboard.writeText(file.content);
  };

  return (
    <div className="min-w-0 flex-1 overflow-hidden rounded-xl border bg-background">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <FileCode2 className="size-4 shrink-0 text-muted-foreground" />

          <span className="truncate text-sm font-medium">
            {file.path}
          </span>

          <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
            {file.language}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 gap-2"
          onClick={copyCode}
        >
          <Copy className="size-4" />
          <span className="hidden sm:inline">Copy</span>
        </Button>
      </div>

      <div className="max-h-[600px] overflow-auto">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {lines.map((line, index) => (
              <tr
                key={index}
                className="hover:bg-muted/50"
              >
                <td className="sticky left-0 w-12 select-none border-r bg-background px-3 py-0 text-right align-top font-mono text-xs leading-6 text-muted-foreground">
                  {index + 1}
                </td>

                <td className="whitespace-pre px-4 py-0 font-mono text-[13px] leading-6">
                  {line || " "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
