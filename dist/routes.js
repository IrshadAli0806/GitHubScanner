"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
// src/routes.ts
const express_1 = __importDefault(require("express"));
const repositoryService_1 = require("./repositoryService");
const gitHubApi_1 = require("./gitHubApi");
const router = express_1.default.Router();
exports.router = router;
router.get('/repositories', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const githubToken = req.headers["githubtoken"];
        const data = yield (0, gitHubApi_1.githubRequest)('https://api.github.com/user/repos', githubToken);
        const repositories = data.map((repo) => ({
            name: repo.name,
            size: repo.size,
            owner: repo.owner.login,
        }));
        res.json(repositories);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
router.get('/repository/:owner/:repo1/:repo2?/:repo3?', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { owner, repo1, repo2, repo3 } = req.params;
    const githubToken = req.headers["githubtoken"];
    try {
        // Ensure at most 2 repositories are scanned in parallel
        const repoPromises = [(0, repositoryService_1.getRepositoryDetails)(owner, repo1, githubToken)];
        if (repo2) {
            repoPromises.push((0, repositoryService_1.getRepositoryDetails)(owner, repo2, githubToken));
        }
        const repoDetails = yield Promise.all(repoPromises);
        if (repo3)
            repoDetails.push(yield (0, repositoryService_1.getRepositoryDetails)(owner, repo3, githubToken));
        res.json(repoDetails);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
