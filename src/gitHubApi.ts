// src/githubApi.ts
import axios from 'axios';

const githubRequest = async (url: string, method = 'get', data = {}): Promise<any> => {
    const githubToken = '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';
    const headers = {
    Authorization: `Bearer ${githubToken}`, // Replace with your GitHub token
  };

  try {
    const response = await axios({ url, method, headers, data });
    return response.data;
  } catch (error:any) {
    throw new Error(error.response ? error.response.data.message : error.message);
  }
};

export { githubRequest };
