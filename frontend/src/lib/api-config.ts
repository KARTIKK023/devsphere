declare global {
  interface Window {
    __DEVSPHERE_API_URL__?: string;
  }
}

const DEFAULT_API_URL = "http://localhost:5002/api";

/**
 * Resolves the backend API base URL at runtime.
 *
 * Priority:
 *   1. `window.__DEVSPHERE_API_URL__` — injected by nginx from a `config.js`
 *      template at container start, so the deployed API URL can be changed via
 *      a runtime env var (`VITE_API_URL`) without rebuilding the image.
 *   2. `import.meta.env.VITE_API_URL` — the value Vite captured at build time.
 *   3. The localhost default.
 */
export function getApiBaseUrl(): string {
  const runtimeUrl =
    typeof window !== "undefined"
      ? window.__DEVSPHERE_API_URL__
      : "";

  const bakedUrl = import.meta.env
    .VITE_API_URL as string | undefined;

  return (runtimeUrl || bakedUrl || DEFAULT_API_URL).replace(
    /\/+$/,
    ""
  );
}