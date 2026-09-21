import type {
  Request,
  Response,
} from "express";

import {
  createInvitationSchema,
} from "./invitation.validation";

import {
  createInvitation,
  acceptInvitation,
} from "./invitation.service";

export async function createInvitationController(
  req: Request,
  res: Response
) {
  if (!req.auth) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const input =
    createInvitationSchema.parse(
      req.body
    );

  const result =
    await createInvitation(
      req.auth.organizationId.toString(),
      req.auth.userId.toString(),
      input.email,
      input.role
    );

  return res.status(201).json({
    success: true,
    data: result,
  });
}

export async function acceptInvitationController(
  req: Request,
  res: Response
) {
  if (!req.auth) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const token =
    req.body.token;

  if (
    typeof token !== "string" ||
    !token
  ) {
    return res.status(400).json({
      success: false,
      message: "Invitation token is required",
    });
  }

  const result =
    await acceptInvitation(
      token,
      req.auth.userId.toString()
    );

  return res.status(200).json({
    success: true,
    data: result,
  });
}