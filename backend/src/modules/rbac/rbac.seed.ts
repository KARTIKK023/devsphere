import { PermissionModel } from "./permission.model";
import { RoleModel } from "./role.model";

const permissions = [
  // Projects
  {
    name: "project:read",
    description: "View projects",
    resource: "project",
    action: "read",
  },
  {
    name: "project:create",
    description: "Create projects",
    resource: "project",
    action: "create",
  },
  {
    name: "project:update",
    description: "Update projects",
    resource: "project",
    action: "update",
  },
  {
    name: "project:delete",
    description: "Delete projects",
    resource: "project",
    action: "delete",
  },

  // Repositories
  {
    name: "repository:read",
    description: "View repositories",
    resource: "repository",
    action: "read",
  },
  {
    name: "repository:create",
    description: "Create repositories",
    resource: "repository",
    action: "create",
  },
  {
    name: "repository:update",
    description: "Update repositories",
    resource: "repository",
    action: "update",
  },
  {
    name: "repository:delete",
    description: "Delete repositories",
    resource: "repository",
    action: "delete",
  },

  // Architecture
  {
    name: "architecture:read",
    description: "View architectures",
    resource: "architecture",
    action: "read",
  },
  {
    name: "architecture:create",
    description: "Create architectures",
    resource: "architecture",
    action: "create",
  },
  {
    name: "architecture:update",
    description: "Update architectures",
    resource: "architecture",
    action: "update",
  },
  {
    name: "architecture:delete",
    description: "Delete architectures",
    resource: "architecture",
    action: "delete",
  },

  // Deployments
  {
    name: "deployment:read",
    description: "View deployments",
    resource: "deployment",
    action: "read",
  },
  {
    name: "deployment:create",
    description: "Create deployments",
    resource: "deployment",
    action: "create",
  },
  {
    name: "deployment:deploy",
    description: "Execute deployments",
    resource: "deployment",
    action: "deploy",
  },
  {
    name: "deployment:delete",
    description: "Delete deployments",
    resource: "deployment",
    action: "delete",
  },

  // Team
  {
    name: "member:read",
    description: "View organization members",
    resource: "member",
    action: "read",
  },
  {
    name: "member:invite",
    description: "Invite organization members",
    resource: "member",
    action: "invite",
  },
  {
    name: "member:update",
    description: "Update organization members",
    resource: "member",
    action: "update",
  },
  {
    name: "member:remove",
    description: "Remove organization members",
    resource: "member",
    action: "remove",
  },

  // Agent
  {
    name: "agent:read",
    description: "View AI agents",
    resource: "agent",
    action: "read",
  },
  {
    name: "agent:execute",
    description: "Execute AI agents",
    resource: "agent",
    action: "execute",
  },
];

export async function seedRBAC() {
  const permissionDocuments = [];

  for (const permission of permissions) {
    const document =
      await PermissionModel.findOneAndUpdate(
        { name: permission.name },
        permission,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

    permissionDocuments.push(document);
  }

  const permissionMap = new Map(
    permissionDocuments.map((permission) => [
      permission.name,
      permission._id,
    ])
  );

  const ownerPermissions = [
    ...permissionMap.keys(),
  ];

  const managerPermissions = [
    "project:read",
    "project:create",
    "project:update",
    "repository:read",
    "repository:create",
    "repository:update",
    "architecture:read",
    "architecture:create",
    "architecture:update",
    "deployment:read",
    "deployment:create",
    "deployment:deploy",
    "member:read",
    "member:invite",
    "member:update",
    "agent:read",
    "agent:execute",
  ];

  const developerPermissions = [
    "project:read",
    "repository:read",
    "repository:create",
    "repository:update",
    "architecture:read",
    "architecture:create",
    "architecture:update",
    "deployment:read",
    "agent:read",
    "agent:execute",
  ];

  await RoleModel.findOneAndUpdate(
    { name: "OWNER" },
    {
      name: "OWNER",
      description:
        "Full control over the organization",
      permissions: ownerPermissions
        .map((name) => permissionMap.get(name))
        .filter(Boolean),
      isSystemRole: true,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  await RoleModel.findOneAndUpdate(
    { name: "MANAGER" },
    {
      name: "MANAGER",
      description:
        "Manage projects, teams and development workflows",
      permissions: managerPermissions
        .map((name) => permissionMap.get(name))
        .filter(Boolean),
      isSystemRole: true,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  await RoleModel.findOneAndUpdate(
    { name: "DEVELOPER" },
    {
      name: "DEVELOPER",
      description:
        "Build and work on organization projects",
      permissions: developerPermissions
        .map((name) => permissionMap.get(name))
        .filter(Boolean),
      isSystemRole: true,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  console.log("RBAC seeded");
}