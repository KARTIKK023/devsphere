import { AppError } from "../../core/errors/AppError";

const GITHUB_API = "https://api.github.com";

const MAX_REPO_PAGES = 5;
const MAX_FILE_BYTES = 512 * 1024;

type GithubRequestParams = Record<
  string,
  string | number | undefined
>;

function githubHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "DevSphere",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function githubRequest<T>(
  token: string,
  path: string,
  params?: GithubRequestParams
): Promise<T> {
  const url = new URL(`${GITHUB_API}${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  let response: Response;

  try {
    response = await fetch(url.toString(), {
      headers: githubHeaders(token),
    });
  } catch {
    throw new AppError("Could not reach GitHub", 502);
  }

  if (response.status === 401) {
    throw new AppError(
      "GitHub credentials are invalid or expired. Reconnect GitHub.",
      401
    );
  }

  if (response.status === 403) {
    throw new AppError(
      "GitHub API rate limit reached. Try again later.",
      429
    );
  }

  if (response.status === 404) {
    throw new AppError("GitHub resource not found", 404);
  }

  if (!response.ok) {
    throw new AppError(
      `GitHub request failed (${response.status})`,
      502
    );
  }

  return (await response.json()) as T;
}

export type GithubRepo = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  default_branch: string;
  language: string | null;
  description: string | null;
  html_url: string;
  clone_url: string;
  stargazers_count: number;
  updated_at: string;
  owner: {
    login: string;
  };
};

export type GithubBranch = {
  name: string;
  protected?: boolean;
};

export type GithubTreeEntry = {
  path: string;
  mode: string;
  type: "blob" | "tree" | "commit";
  sha: string;
  size?: number;
};

export type GithubTree = {
  sha: string;
  truncated: boolean;
  tree: GithubTreeEntry[];
};

type GithubContentFile = {
  type: "file";
  name: string;
  path: string;
  sha: string;
  size: number;
  encoding?: string;
  content?: string;
  download_url?: string | null;
};

function encodePath(path: string): string {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export async function listUserRepositories(
  token: string
): Promise<GithubRepo[]> {
  const repositories: GithubRepo[] = [];

  for (let page = 1; page <= MAX_REPO_PAGES; page++) {
    const batch = await githubRequest<GithubRepo[]>(
      token,
      "/user/repos",
      {
        per_page: 100,
        page,
        sort: "updated",
        affiliation: "owner,collaborator,organization_member",
      }
    );

    repositories.push(...batch);

    if (batch.length < 100) {
      break;
    }
  }

  return repositories;
}

export async function getGithubRepository(
  token: string,
  fullName: string
): Promise<GithubRepo> {
  return githubRequest<GithubRepo>(
    token,
    `/repos/${encodePath(fullName)}`
  );
}

export async function listBranches(
  token: string,
  fullName: string
): Promise<GithubBranch[]> {
  return githubRequest<GithubBranch[]>(
    token,
    `/repos/${encodePath(fullName)}/branches`,
    { per_page: 100 }
  );
}

export async function getRepositoryTree(
  token: string,
  fullName: string,
  ref: string
): Promise<GithubTree> {
  return githubRequest<GithubTree>(
    token,
    `/repos/${encodePath(fullName)}/git/trees/${encodeURIComponent(ref)}`,
    { recursive: 1 }
  );
}

export async function getFileContent(
  token: string,
  fullName: string,
  path: string,
  ref?: string
): Promise<{ path: string; size: number; content: string }> {
  const data = await githubRequest<
    GithubContentFile | GithubContentFile[]
  >(
    token,
    `/repos/${encodePath(fullName)}/contents/${encodePath(path)}`,
    ref ? { ref } : undefined
  );

  if (Array.isArray(data)) {
    throw new AppError("Path is a directory, not a file", 400);
  }

  if (data.type !== "file") {
    throw new AppError("Unsupported GitHub content type", 400);
  }

  if (data.size > MAX_FILE_BYTES) {
    throw new AppError(
      "This file is too large to display",
      413
    );
  }

  if (data.content && data.encoding === "base64") {
    return {
      path: data.path,
      size: data.size,
      content: Buffer.from(
        data.content,
        "base64"
      ).toString("utf8"),
    };
  }

  if (data.download_url) {
    const raw = await fetch(data.download_url, {
      headers: githubHeaders(token),
    });

    if (!raw.ok) {
      throw new AppError("Could not download file", 502);
    }

    return {
      path: data.path,
      size: data.size,
      content: await raw.text(),
    };
  }

  throw new AppError("File content is unavailable", 502);
}
