import { connectDatabase } from "../config/database";

import {
  seedRBAC,
} from "../modules/rbac/rbac.seed";

import {
  seedBilling,
} from "../modules/billing/billing.seed";

async function run() {
  await connectDatabase();

  await seedRBAC();

  await seedBilling();

  console.log(
    "Database seeding completed"
  );

  process.exit(0);
}

run().catch((error) => {
  console.error(
    "Database seeding failed:",
    error
  );

  process.exit(1);
});