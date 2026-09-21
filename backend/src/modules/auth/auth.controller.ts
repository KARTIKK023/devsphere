import type { Request, Response } from "express";

import {
  loginSchema,
  signupSchema,
  switchOrganizationSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "./auth.validation";

import {
  login,
  signup,
  switchOrganization,
  logout,
  logoutAllSessions,
  getCurrentAuth,
  listSessions,
  updateProfile,
  changePassword,
  revokeSession,
} from "./auth.service";

import { sendMessage, sendSuccess } from "../../core/http/response";
import { getDeviceInfo } from "../../core/security/device";

export async function signupController(req: Request, res: Response) {
  const input = signupSchema.parse(req.body);
  const result = await signup(input, getDeviceInfo(req.get("user-agent")));

  return sendSuccess(res, result, 201);
}

export async function loginController(req: Request, res: Response) {
  const input = loginSchema.parse(req.body);
  const result = await login(input, getDeviceInfo(req.get("user-agent")));

  return sendSuccess(res, result);
}

export async function meController(req: Request, res: Response) {
  const result = await getCurrentAuth(
    req.auth!.userId.toString(),
    req.auth!.organizationId.toString(),
    req.auth!.sessionId.toString()
  );

  return sendSuccess(res, result);
}

export async function switchOrganizationController(
  req: Request,
  res: Response
) {
  const input = switchOrganizationSchema.parse(req.body);

  const result = await switchOrganization(
    req.auth!.userId.toString(),
    req.auth!.sessionId.toString(),
    input.organizationId,
    getDeviceInfo(req.get("user-agent"))
  );

  return sendSuccess(res, result);
}

export async function sessionsController(req: Request, res: Response) {
  const sessions = await listSessions(
    req.auth!.userId.toString(),
    req.auth!.sessionId.toString()
  );

  return sendSuccess(res, { sessions });
}

export async function logoutController(req: Request, res: Response) {
  await logout(
    req.auth!.sessionId.toString(),
    req.auth!.userId.toString()
  );

  return sendMessage(res, "Logged out successfully");
}

export async function logoutAllController(req: Request, res: Response) {
  await logoutAllSessions(req.auth!.userId.toString());

  return sendMessage(res, "All sessions revoked");
}

export async function updateProfileController(
  req: Request,
  res: Response
) {
  const input = updateProfileSchema.parse(req.body);

  const user = await updateProfile(
    req.auth!.userId.toString(),
    input
  );

  return sendSuccess(res, { user });
}

export async function changePasswordController(
  req: Request,
  res: Response
) {
  const input = changePasswordSchema.parse(req.body);

  await changePassword(
    req.auth!.userId.toString(),
    input.currentPassword,
    input.newPassword
  );

  return sendMessage(
    res,
    "Password updated successfully"
  );
}

export async function revokeSessionController(
  req: Request,
  res: Response
) {
  await revokeSession(
    req.auth!.userId.toString(),
    String(req.params.sessionId ?? "")
  );

  return sendMessage(res, "Session revoked");
}
