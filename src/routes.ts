// src/routes.ts
import express from 'express';
import { getRepositoryDetails } from './repositoryService';
import { githubRequest } from './gitHubApi';
import { Repositories } from './types/repositories';
import { Repository } from './types/repository';

const router = express.Router();

router.get('/repositories', async (req, res) => {
  try {
    const data = await githubRequest('https://api.github.com/user/repos');
    const repositories : Repositories = data.map((repo: any) => ({
      name: repo.name,
      size: repo.size,
      owner: repo.owner.login,
    }));

    res.json(repositories);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/repository/:owner/:repo1/:repo2?/:repo3?', async (req, res) => {
    const { owner, repo1, repo2,repo3 } = req.params;

    try {
      // Ensure at most 2 repositories are scanned in parallel
      const repoPromises : Promise<Repository>[] = [getRepositoryDetails(owner, repo1)];
      if (repo2) {
        repoPromises.push(getRepositoryDetails(owner, repo2));
      }
      
      const repoDetails = await Promise.all(repoPromises);
  
      if(repo3)
       repoDetails.push(await  getRepositoryDetails(owner,repo3));
  
      res.json(repoDetails);
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
});

export { router };