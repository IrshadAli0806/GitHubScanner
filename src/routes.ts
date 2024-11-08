// src/routes.ts

import express from 'express';
import { getRepositoryDetails } from './repositoryService';
import { githubRequest } from './gitHubApi';
import { Repositories } from './types/repositories';
import { Repository } from './types/repository';

const router = express.Router();

router.get('/repositories', async (req, res) => {
  try {
    const githubToken = req.headers["githubtoken"] as string;
    const data = await githubRequest(`${process.env.GIT_HUB_BASE_URL}/user/repos`,githubToken);
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

    const githubToken = req.headers["githubtoken"] as string;

    try {
      // Ensure at most 2 repositories are scanned in parallel
      const repoPromises : Promise<Repository>[] = [getRepositoryDetails(owner, repo1,githubToken)];
      if (repo2) {
        repoPromises.push(getRepositoryDetails(owner, repo2,githubToken));
      }
      
      const repoDetails = await Promise.all(repoPromises);
  
      if(repo3)
       repoDetails.push(await  getRepositoryDetails(owner,repo3,githubToken));
  
      res.json(repoDetails);
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
});

export { router };
