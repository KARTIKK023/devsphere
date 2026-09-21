import { getApiBaseUrl } from "@/lib/api-config";

export type OAuthStartProvider =
  | "google"
  | "github";

export function startOAuth(
  provider: OAuthStartProvider
): void {
  window.location.href = `${getApiBaseUrl()}/auth/oauth/${provider}`;
}
