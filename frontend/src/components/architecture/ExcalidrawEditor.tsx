import type { ComponentProps } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";

import "@excalidraw/excalidraw/index.css";

type ExcalidrawProps = ComponentProps<typeof Excalidraw>;

export type SceneData = {
  elements: readonly unknown[];
  appState: Record<string, unknown>;
  files: Record<string, unknown>;
};

type Props = {
  theme: "light" | "dark";
  initialData: SceneData;
  onChange: (data: SceneData) => void;
};

export default function ExcalidrawEditor({
  theme,
  initialData,
  onChange,
}: Props) {
  return (
    <div className="h-full w-full">
      <Excalidraw
        theme={theme}
        initialData={
          initialData as unknown as ExcalidrawProps["initialData"]
        }
        onChange={(elements, appState, files) =>
          onChange({
            elements,
            appState:
              appState as unknown as Record<string, unknown>,
            files: files as unknown as Record<string, unknown>,
          })
        }
      />
    </div>
  );
}
