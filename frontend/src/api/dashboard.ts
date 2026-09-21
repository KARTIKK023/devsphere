import { getData } from "@/lib/api-client";

import type { Architecture } from "@/types/architecture";
import type { Repository } from "@/types/repository";
import type { Subscription } from "@/types/auth";

export type DashboardOverview = {
  stats: {
    repositories: number;
    privateRepositories: number;
    architectures: number;
    members: number;
  };
  recentRepositories: Repository[];
  recentArchitectures: Architecture[];
  subscription: Subscription | null;
};

export async function getDashboardOverview(): Promise<DashboardOverview> {
  return getData<DashboardOverview>("/dashboard");
}
