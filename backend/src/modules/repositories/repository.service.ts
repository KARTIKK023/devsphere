import mongoose from "mongoose";

import { AppError } from "../../core/errors/AppError";

import { RepositoryModel } from "./repository.model";
import { getGithubAccessToken } from "./github-token.service";
import {
  getFileContent,
  getGithubRepository,
  getRepositoryTree as fetchRepositoryTree,
  listBranches,
  listUserRepositories,
} from "./github.service";

import type { Repository } from "./repository.types";

const EXTENSION_LANGUAGES: Record<string, string> = {
  ts: "TypeScript",
  tsx: "TypeScript",
  js: "JavaScript",
  jsx: "JavaScript",
  mjs: "JavaScript",
  cjs: "JavaScript",
  json: "JSON",
  md: "Markdown",
  mdx: "Markdown",
  css: "CSS",
  scss: "SCSS",
  html: "HTML",
  py: "Python",
  rb: "Ruby",
  go: "Go",
  rs: "Rust",
  java: "Java",
  kt: "Kotlin",
  swift: "Swift",
  c: "C",
  h: "C",
  cpp: "C++",
  cs: "C#",
  php: "PHP",
  sh: "Shell",
  yml: "YAML",
  yaml: "YAML",
  toml: "TOML",
  sql: "SQL",
  xml: "XML",
  vue: "Vue",
  svelte: "Svelte",
};

function detectLanguage(path: string): string {
  const fileName = path.split("/").pop() ?? path;

  if (fileName === "Dockerfile") {
    return "Dockerfile";
  }

  if (fileName === "Makefile") {
    return "Makefile";
  }

  const extension = fileName.includes(".")
    ? fileName.split(".").pop()?.toLowerCase()
    : undefined;

  return (extension && EXTENSION_LANGUAGES[extension]) || "Plain Text";
}

function serializeRepository(repository: Repository) {
  return {
    id: repository._id.toString(),
    name: repository.name,
    fullName: repository.fullName,
    owner: repository.owner,
    private: repository.private,
    defaultBranch: repository.defaultBranch,
    language: repository.language ?? null,
    description: repository.description ?? null,
    htmlUrl: repository.htmlUrl,
    cloneUrl: repository.cloneUrl ?? null,
    provider: repository.provider,
    status: repository.status,
    lastSyncedAt: repository.lastSyncedAt ?? null,
    createdAt: repository.createdAt,
    updatedAt: repository.updatedAt,
  };
}

async function getRepositoryDocument(
  organizationId: string,
  repositoryId: string
): Promise<Repository> {
  if (!mongoose.Types.ObjectId.isValid(repositoryId)) {
    throw new AppError("Invalid repository ID", 400);
  }

  const repository = await RepositoryModel.findOne({
    _id: repositoryId,
    organizationId,
  });

  if (!repository) {
    throw new AppError("Repository not found", 404);
  }

  return repository;
}

export async function listAvailableGithubRepositories(
  userId: string
) {
  const token = await getGithubAccessToken(userId);
  const repositories = await listUserRepositories(token);

  return repositories.map((repository) => ({
    id: String(repository.id),
    name: repository.name,
    fullName: repository.full_name,
    owner: repository.owner.login,
    private: repository.private,
    defaultBranch: repository.default_branch,
    language: repository.language,
    description: repository.description,
    htmlUrl: repository.html_url,
    stars: repository.stargazers_count,
    updatedAt: repository.updated_at,
  }));
}

export async function connectRepository(
  organizationId: string,
  userId: string,
  fullName: string
) {
  const token = await getGithubAccessToken(userId);

  const githubRepository = await getGithubRepository(
    token,
    fullName
  );

  const existing = await RepositoryModel.findOne({
    organizationId,
    githubRepoId: String(githubRepository.id),
  });

  if (existing) {
    existing.name = githubRepository.name;
    existing.fullName = githubRepository.full_name;
    existing.owner = githubRepository.owner.login;
    existing.private = githubRepository.private;
    existing.defaultBranch = githubRepository.default_branch;
    existing.language = githubRepository.language;
    existing.description = githubRepository.description;
    existing.htmlUrl = githubRepository.html_url;
    existing.cloneUrl = githubRepository.clone_url;
    existing.status = "CONNECTED";
    existing.lastSyncedAt = new Date();

    await existing.save();

    return serializeRepository(existing);
  }

  const repository = await RepositoryModel.create({
    organizationId,
    connectedBy: userId,
    provider: "GITHUB",
    githubRepoId: String(githubRepository.id),
    name: githubRepository.name,
    fullName: githubRepository.full_name,
    owner: githubRepository.owner.login,
    private: githubRepository.private,
    defaultBranch: githubRepository.default_branch,
    language: githubRepository.language,
    description: githubRepository.description,
    htmlUrl: githubRepository.html_url,
    cloneUrl: githubRepository.clone_url,
    status: "CONNECTED",
    lastSyncedAt: new Date(),
  });

  return serializeRepository(repository);
}

export async function listRepositories(
  organizationId: string
) {
  const repositories = await RepositoryModel.find({
    organizationId,
  }).sort({ updatedAt: -1 });

  return repositories.map(serializeRepository);
}

export async function getRepository(
  organizationId: string,
  repositoryId: string
) {
  const repository = await getRepositoryDocument(
    organizationId,
    repositoryId
  );

  return serializeRepository(repository);
}

export async function disconnectRepository(
  organizationId: string,
  repositoryId: string
) {
  const repository = await getRepositoryDocument(
    organizationId,
    repositoryId
  );

  await RepositoryModel.deleteOne({
    _id: repository._id,
    organizationId,
  });

  return { disconnected: true };
}

export async function getRepositoryTree(
  organizationId: string,
  repositoryId: string,
  ref?: string
) {
  const repository = await getRepositoryDocument(
    organizationId,
    repositoryId
  );

  const token = await getGithubAccessToken(
    repository.connectedBy.toString()
  );

  const branch = ref ?? repository.defaultBranch;

  const tree = await fetchRepositoryTree(
    token,
    repository.fullName,
    branch
  );

  return {
    ref: branch,
    truncated: tree.truncated,
    files: tree.tree.map((entry) => ({
      path: entry.path,
      type: entry.type === "tree" ? "folder" : "file",
      size: entry.size ?? null,
    })),
  };
}

export async function getRepositoryFile(
  organizationId: string,
  repositoryId: string,
  path: string,
  ref?: string
) {
  const repository = await getRepositoryDocument(
    organizationId,
    repositoryId
  );

  const token = await getGithubAccessToken(
    repository.connectedBy.toString()
  );

  const branch = ref ?? repository.defaultBranch;

  const file = await getFileContent(
    token,
    repository.fullName,
    path,
    branch
  );

  return {
    path: file.path,
    size: file.size,
    language: detectLanguage(file.path),
    content: file.content,
  };
}

export async function listRepositoryBranches(
  organizationId: string,
  repositoryId: string
) {
  const repository = await getRepositoryDocument(
    organizationId,
    repositoryId
  );

  const token = await getGithubAccessToken(
    repository.connectedBy.toString()
  );

  const branches = await listBranches(
    token,
    repository.fullName
  );

  return branches.map((branch) => branch.name);
}
