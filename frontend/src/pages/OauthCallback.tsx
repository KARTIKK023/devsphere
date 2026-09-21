import { useEffect, useRef } from "react";

import { Loader2 } from "lucide-react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useAuthStore } from "@/store/auth.store";

export default function OauthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const setAccessToken = useAuthStore(
    (state) => state.setAccessToken
  );

  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) {
      return;
    }

    handled.current = true;

    const error = searchParams.get("error");
    const token = searchParams.get("token");

    if (error) {
      navigate(
        `/login?error=${encodeURIComponent(error)}`,
        { replace: true }
      );

      return;
    }

    if (!token) {
      navigate(
        "/login?error=Missing+authentication+token",
        { replace: true }
      );

      return;
    }

    setAccessToken(token)
      .then(() => {
        navigate("/dashboard", { replace: true });
      })
      .catch(() => {
        navigate(
          "/login?error=OAuth+sign-in+failed",
          { replace: true }
        );
      });
  }, [navigate, searchParams, setAccessToken]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />

      <p className="text-sm text-muted-foreground">
        Completing sign in...
      </p>
    </main>
  );
}
