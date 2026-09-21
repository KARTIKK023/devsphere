import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import app from "./app";

async function startServer() {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(
      `DevSphere API running on port ${env.PORT}`
    );
  });
}

startServer().catch((error) => {
  console.error(
    "Failed to start server:",
    error
  );

  process.exit(1);
});