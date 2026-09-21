import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  GitBranch,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import ExcalidrawEditor, {
  type SceneData,
} from "@/components/architecture/ExcalidrawEditor";
import { useTheme } from "@/components/theme-provider";

import { getApiErrorMessage } from "@/lib/get-api-error";
import {
  getArchitecture,
  updateArchitecture,
} from "@/api/architectures";

import type {
  Architecture,
  ArchitectureDocument,
} from "@/types/architecture";

type SaveStatus = "idle" | "saving" | "saved" | "error";

const SAVE_DELAY_MS = 1200;

export default function ArchitectureEditor() {
  const { architectureId } = useParams();
  const navigate = useNavigate();

  const { theme } = useTheme();

  const [architecture, setArchitecture] =
    useState<Architecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] =
    useState<SaveStatus>("idle");

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
    if (!architectureId) {
      return;
    }

    let active = true;

    setLoading(true);

    getArchitecture(architectureId)
      .then((data) => {
        if (active) {
          setArchitecture(data);
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
  }, [architectureId]);

  const persist = useCallback(
    async (document: ArchitectureDocument) => {
      if (!architectureId) {
        return;
      }

      setSaveStatus("saving");

      try {
        await updateArchitecture(architectureId, {
          document,
        });

        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
      }
    },
    [architectureId]
  );

  const handleChange = useCallback(
    (scene: SceneData) => {
      const document: ArchitectureDocument = {
        elements: [...scene.elements],
        appState: { ...scene.appState },
        files: { ...scene.files },
      };

      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }

      setSaveStatus("idle");

      saveTimer.current = setTimeout(() => {
        void persist(document);
      }, SAVE_DELAY_MS);
    },
    [persist]
  );

  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading architecture...
      </div>
    );
  }

  if (error || !architecture) {
    return (
      <div className="flex h-full items-center justify-center px-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <AlertCircle className="size-6 text-destructive" />

          <h1 className="text-lg font-semibold">
            Architecture not found
          </h1>

          <p className="text-sm text-muted-foreground">
            {error ??
              "The architecture you're looking for doesn't exist."}
          </p>
        </div>
      </div>
    );
  }

  const excalidrawTheme =
    theme === "dark"
      ? "dark"
      : theme === "light"
        ? "light"
        : typeof window !== "undefined" &&
            window.matchMedia(
              "(prefers-color-scheme: dark)"
            ).matches
          ? "dark"
          : "light";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex h-14 shrink-0 items-center border-b bg-background px-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard/architecture")}
          className="gap-2"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>

        <div className="mx-3 h-5 w-px bg-border" />

        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {architecture.title}
          </p>

          {architecture.repositoryName && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <GitBranch className="size-3" />
              <span>{architecture.repositoryName}</span>
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          {saveStatus === "saving" && (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              Saving...
            </>
          )}

          {saveStatus === "saved" && (
            <>
              <Check className="size-3.5" />
              Saved
            </>
          )}

          {saveStatus === "error" && (
            <span className="text-destructive">
              Could not save
            </span>
          )}
        </div>
      </header>

      <div className="min-h-0 flex-1">
        <ExcalidrawEditor
          theme={excalidrawTheme}
          initialData={{
            elements: architecture.document.elements,
            appState: architecture.document.appState,
            files: architecture.document.files,
          }}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
