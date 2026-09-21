import { useEffect, useState } from "react";

import { useAuthStore } from "@/store/auth.store";

type AuthInitializerProps = {
  children: React.ReactNode;
};

export function AuthInitializer({
  children,
}: AuthInitializerProps) {
  const accessToken = useAuthStore(
    (state) => state.accessToken
  );

  const fetchMe = useAuthStore(
    (state) => state.fetchMe
  );

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        if (accessToken) {
          await fetchMe();
        }
      } catch (error) {
        /*
         * fetchMe() handles invalid 401 tokens itself.
         *
         * We intentionally do not remove the token here because
         * a server/network error does not necessarily mean that
         * the session is invalid.
         */
        console.error(
          "Failed to restore authentication:",
          error
        );
      } finally {
        if (mounted) {
          setInitialized(true);
        }
      }
    };

    void initializeAuth();

    return () => {
      mounted = false;
    };
  }, [accessToken, fetchMe]);

  if (!initialized) {
    return null;
  }

  return <>{children}</>;
}