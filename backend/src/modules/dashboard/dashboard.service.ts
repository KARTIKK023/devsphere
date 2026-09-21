import { MembershipModel } from "../memberships/membership.model";
import { getOrganizationSubscription } from "../billing/billing.service";
import { listRepositories } from "../repositories/repository.service";
import { listArchitectures } from "../architectures/architecture.service";

export async function getDashboardOverview(
  organizationId: string
) {
  const [
    repositories,
    architectures,
    memberCount,
    subscription,
  ] = await Promise.all([
    listRepositories(organizationId),
    listArchitectures(organizationId),
    MembershipModel.countDocuments({
      organizationId,
      status: "ACTIVE",
    }),
    getOrganizationSubscription(organizationId),
  ]);

  return {
    stats: {
      repositories: repositories.length,
      privateRepositories: repositories.filter(
        (repository) => repository.private
      ).length,
      architectures: architectures.length,
      members: memberCount,
    },
    recentRepositories: repositories.slice(0, 4),
    recentArchitectures: architectures.slice(0, 4),
    subscription,
  };
}
