// src/githubApi.ts
import axios from 'axios';

const githubRequest = async (url: string,githubToken:string, method = 'get', data = {}): Promise<any> => {
    
    const headers = {
    Authorization: `Bearer ${githubToken}`, 
  };

  try {
    const response = await axios({ url, method, headers, data });
    return response.data;
  } catch (error:any) {
    throw new Error(error.response ? error.response.data.message : error.message);
  }
};

export { githubRequest };
