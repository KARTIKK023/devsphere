import { AppError } from "../../core/errors/AppError";
import { decryptSecret } from "../../core/security/encryption";
import { UserModel } from "../users/user.model";

export async function getGithubAccessToken(
  userId: string
): Promise<string> {
  const user = await UserModel.findById(userId).select(
    "githubAccessToken githubLogin"
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.githubAccessToken) {
    throw new AppError(
      "GitHub is not connected. Connect your GitHub account to continue.",
      400
    );
  }

  try {
    return decryptSecret(user.githubAccessToken);
  } catch {
    throw new AppError(
      "Stored GitHub credentials could not be read. Reconnect GitHub.",
      400
    );
  }
}

export async function disconnectGithub(
  userId: string
): Promise<{ disconnected: boolean }> {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.githubAccessToken = null;
  user.githubTokenScopes = [];
  user.githubConnectedAt = null;

  await user.save();

  return { disconnected: true };
}
