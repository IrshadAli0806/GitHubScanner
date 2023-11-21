import { githubRequest } from "./gitHubApi";

const getRepositoryDetails = async (owner: string, repo: string): Promise<any> => {
  try {
    const repoDetails : any = await githubRequest(`https://api.github.com/repos/${owner}/${repo}`);
    const repoSize : number = repoDetails.size;
    const isPrivate :boolean = repoDetails.private;

    // Fetching the contents of 1 YAML file
    const contents:any[] = await githubRequest(`https://api.github.com/repos/${owner}/${repo}/contents`);
    const yamlFiles = await githubRequest(`https://api.github.com/repos/${owner}/${repo}/contents/.github/workflows`)
   
   let ymlFileContent:any = {};
   if (contents.length > 0) {
   // If the repository has at least one YAML file
     const ymlFile = yamlFiles.find((file: { name: string; }) => file.name.endsWith('.yml') || file.name.endsWith('.yaml'));
     if (ymlFile) {
       ymlFileContent = await githubRequest(ymlFile.url); // Fetch content of the YAML file
       ymlFileContent = Buffer.from(ymlFileContent.content, 'base64').toString();
     }
   }

   //Fetching active webhooks
   const webhooks = await githubRequest(`https://api.github.com/repos/${owner}/${repo}/hooks`);

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