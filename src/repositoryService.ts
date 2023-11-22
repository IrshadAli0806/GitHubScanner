import { githubRequest } from "./gitHubApi";

const getRepositoryDetails = async (owner: string, repo: string,githubToken:string): Promise<any> => {
  try {
    const repoDetails : any = await githubRequest(`${process.env.GIT_HUB_BASE_URL}/repos/${owner}/${repo}`,githubToken);
    const repoSize : number = repoDetails.size;
    const isPrivate :boolean = repoDetails.private;
    
    // Fetching the contents of 1 YAML file
    const contents:any[] = await githubRequest(`${process.env.GIT_HUB_BASE_URL}/repos/${owner}/${repo}/contents`,githubToken);
    const yamlFiles = await githubRequest(`${process.env.GIT_HUB_BASE_URL}/repos/${owner}/${repo}/contents/.github/workflows`,githubToken)
   
   let ymlFileContent:any = {};
   if (yamlFiles && yamlFiles?.length>0) {
   // If the repository has at least one YAML file
     const ymlFile = yamlFiles.find((file: { name: string; }) => file.name.endsWith('.yml') || file.name.endsWith('.yaml'));
     if (ymlFile) {
       ymlFileContent = await githubRequest(ymlFile.url,githubToken); // Fetch content of the YAML file
       ymlFileContent = Buffer.from(ymlFileContent.content, 'base64').toString();
     }
   }

   //Fetching active webhooks
   const webhooks = await githubRequest(`${process.env.GIT_HUB_BASE_URL}/repos/${owner}/${repo}/hooks`,githubToken);

   return {
     name: repoDetails.name,
     size: repoSize,
     owner: owner,
     private: isPrivate,
     numFiles: contents.length,
     ymlFileContent: ymlFileContent,
     activeWebhooks:webhooks.map((webhook: { config: { url: any; }; }) => webhook.config.url),
   };
  } catch (error:any) {
    throw new Error(error.message);
  }
};

export { getRepositoryDetails };