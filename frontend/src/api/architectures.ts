import {
  deleteData,
  getData,
  patchData,
  postData,
} from "@/lib/api-client";

import type {
  Architecture,
  ArchitectureDocument,
} from "@/types/architecture";

export async function getArchitectures(): Promise<
  Architecture[]
> {
  const { architectures } = await getData<{
    architectures: Architecture[];
  }>("/architectures");

  return architectures;
}

export async function getArchitecture(
  architectureId: string
): Promise<Architecture> {
  const { architecture } = await getData<{
    architecture: Architecture;
  }>(`/architectures/${architectureId}`);

  return architecture;
}

export async function createArchitecture(data: {
  title: string;
  description?: string;
  repositoryId?: string | null;
}): Promise<Architecture> {
  const { architecture } = await postData<{
    architecture: Architecture;
  }>("/architectures", data);

  return architecture;
}

export async function updateArchitecture(
  architectureId: string,
  data: {
    title?: string;
    description?: string;
    repositoryId?: string | null;
    document?: ArchitectureDocument;
  }
): Promise<Architecture> {
  const { architecture } = await patchData<{
    architecture: Architecture;
  }>(`/architectures/${architectureId}`, data);

  return architecture;
}

export async function deleteArchitecture(
  architectureId: string
): Promise<void> {
  await deleteData<{ deleted: boolean }>(
    `/architectures/${architectureId}`
  );
}
