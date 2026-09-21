import { useEffect, useState } from "react";

import { Check, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { getData } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth.store";

import type { Subscription } from "@/types/auth";

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleDateString();
}

export default function BillingSettings() {
  const storeSubscription = useAuthStore(
    (state) => state.subscription
  );

  const [subscription, setSubscription] =
    useState<Subscription | null>(storeSubscription);

  const [isLoading, setIsLoading] = useState(
    !storeSubscription
  );

  useEffect(() => {
    let active = true;

    getData<{ subscription: Subscription | null }>(
      "/billing/subscription"
    )
      .then((data) => {
        if (active) {
          setSubscription(data.subscription);
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const plan = subscription?.plan;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Billing
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Review your workspace plan and usage.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>
                {plan?.name ?? "Subscription"}
              </CardTitle>

              <CardDescription>
                {plan?.description ??
                  "Your current workspace plan."}
              </CardDescription>
            </div>

            {subscription && (
              <Badge
                variant={
                  subscription.status === "ACTIVE"
                    ? "secondary"
                    : "outline"
                }
              >
                {subscription.status}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading subscription...
            </div>
          )}

          {!isLoading && !subscription && (
            <p className="text-sm text-muted-foreground">
              No active subscription was found for
              this workspace.
            </p>
          )}

          {subscription && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">
                    Started
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(
                      subscription.startedAt
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Renews
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(
                      subscription.expiresAt
                    )}
                  </p>
                </div>
              </div>

              {plan?.features &&
                plan.features.length > 0 && (
                  <>
                    <Separator />

                    <div>
                      <p className="mb-3 text-sm font-medium">
                        Plan features
                      </p>

                      <ul className="space-y-2">
                        {plan.features.map(
                          (feature) => (
                            <li
                              key={feature}
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                              <Check className="size-4 shrink-0 text-emerald-500" />
                              {feature}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </>
                )}
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
