import { useEffect, useState } from "react";

import { GithubIcon } from "@/components/icons/GithubIcon";
import { Button } from "@/components/ui/button";

import { getData } from "@/lib/api-client";
import { getApiBaseUrl } from "@/lib/api-config";

import type { OAuthProviders } from "@/types/auth";

function GoogleIcon() {
  return (
    <svg
      className="size-4"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

type OAuthButtonsProps = {
  disabled?: boolean;
};

export function OAuthButtons({
  disabled,
}: OAuthButtonsProps) {
  const [providers, setProviders] =
    useState<OAuthProviders | null>(null);

  useEffect(() => {
    let active = true;

    getData<OAuthProviders>("/auth/oauth/providers")
      .then((data) => {
        if (active) {
          setProviders(data);
        }
      })
      .catch(() => {
        if (active) {
          setProviders(null);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (
    !providers ||
    (!providers.google && !providers.github)
  ) {
    return null;
  }

  const start = (provider: "google" | "github") => {
    window.location.href = `${getApiBaseUrl()}/auth/oauth/${provider}`;
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>

        <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {providers.google && (
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={() => start("google")}
          >
            <GoogleIcon />
            Google
          </Button>
        )}

        {providers.github && (
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={() => start("github")}
          >
            <GithubIcon className="size-4" />
            GitHub
          </Button>
        )}
      </div>
    </div>
  );
}
