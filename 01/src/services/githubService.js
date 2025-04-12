// Service for interacting with GitHub API

const GITHUB_API = 'https://api.github.com';

export const getRepositories = async (token) => {
  try {
    const response = await fetch(`${GITHUB_API}/user/repos`, {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
};

export const getRepository = async (token, owner, repo) => {
  try {
    const response = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch repository: ${owner}/${repo}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching repository ${owner}/${repo}:`, error);
    throw error;
  }
};

export const getFileContent = async (token, owner, repo, path) => {
  try {
    const response = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${path}`);
    }

    const data = await response.json();
    // GitHub API returns content as base64
    return {
      content: atob(data.content),
      sha: data.sha,
    };
  } catch (error) {
    console.error(`Error fetching file ${path}:`, error);
    throw error;
  }
};