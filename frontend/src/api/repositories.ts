import {
  deleteData,
  getData,
  postData,
} from "@/lib/api-client";

import type {
  GithubRepository,
  Repository,
  RepositoryFileContent,
  RepositoryTree,
} from "@/types/repository";

export async function getConnectedRepositories(): Promise<
  Repository[]
> {
  const { repositories } = await getData<{
    repositories: Repository[];
  }>("/repositories");

  return repositories;
}

export async function getAvailableRepositories(): Promise<
  GithubRepository[]
> {
  const { repositories } = await getData<{
    repositories: GithubRepository[];
  }>("/repositories/available");

  return repositories;
}

export async function connectRepository(
  fullName: string
): Promise<Repository> {
  const { repository } = await postData<{
    repository: Repository;
  }>("/repositories", { fullName });

  return repository;
}

export async function getRepository(
  repositoryId: string
): Promise<Repository> {
  const { repository } = await getData<{
    repository: Repository;
  }>(`/repositories/${repositoryId}`);

  return repository;
}

export async function disconnectRepository(
  repositoryId: string
): Promise<void> {
  await deleteData<{ disconnected: boolean }>(
    `/repositories/${repositoryId}`
  );
}

export async function getRepositoryTree(
  repositoryId: string,
  ref?: string
): Promise<RepositoryTree> {
  return getData<RepositoryTree>(
    `/repositories/${repositoryId}/tree`,
    { params: ref ? { ref } : undefined }
  );
}

export async function getRepositoryFile(
  repositoryId: string,
  path: string,
  ref?: string
): Promise<RepositoryFileContent> {
  return getData<RepositoryFileContent>(
    `/repositories/${repositoryId}/contents`,
    { params: ref ? { path, ref } : { path } }
  );
}

export async function getRepositoryBranches(
  repositoryId: string
): Promise<string[]> {
  const { branches } = await getData<{
    branches: string[];
  }>(`/repositories/${repositoryId}/branches`);

  return branches;
}
