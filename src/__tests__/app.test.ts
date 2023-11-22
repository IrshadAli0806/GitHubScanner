// __tests__/app.test.ts
import request from 'supertest';
import express from 'express';
import { router } from '../routes';

const app = express();
app.use(express.json());
app.use('/', router);

describe('GET /repositories', () => {
  it('should return a list of repositories', async () => {
    const response = await request(app).get('/repositories')
    .set("githubtoken","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");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Array));
  });

  it('should handle errors when fetching repositories', async () => {
    // Mock the githubRequest function to simulate an error
    jest.mock('../src/githubApi', () => ({
      githubRequest: jest.fn().mockRejectedValue(new Error('GitHub API error')),
    }));

    const response = await request(app).get('/repositories/123')
    .set("githubtoken","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");
    expect(response.status).toBe(404);
  });
});

describe('GET /repository/:owner/:repo1/:repo2?', () => {
  it('should return details of one repository', async () => {
    const response = await request(app).get('/repository/irshadali0806/repoA')
    .set("githubtoken","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");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Object));
  });

  it('should return details of two repositories', async () => {
    const response = await request(app).get('/repository/irshadali0806/repoA/repoA')
    .set("githubtoken","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");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Array));
  });

  it('should handle errors when fetching repository details', async () => {
    // Mock the getRepositoryDetails function to simulate an error
    jest.mock('../src/repositoryService', () => ({
      getRepositoryDetails: jest.fn().mockRejectedValue(new Error('Repository details error')),
    }));

    const response = await request(app).get('/repository/irshadali0806/repoA1/repoA1')
    .set("githubtoken","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");
    //expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('error', 'Not Found');
  });
});
