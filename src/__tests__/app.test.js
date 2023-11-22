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
// __tests__/app.test.ts
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const routes_1 = require("../src/routes");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/', routes_1.router);
describe('GET /repositories', () => {
    it('should return a list of repositories', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/repositories')
            .set("githubtoken", "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");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.any(Array));
    }));
    it('should handle errors when fetching repositories', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock the githubRequest function to simulate an error
        jest.mock('../src/githubApi', () => ({
            githubRequest: jest.fn().mockRejectedValue(new Error('GitHub API error')),
        }));
        const response = yield (0, supertest_1.default)(app).get('/repositories/123')
            .set("githubtoken", "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");
        expect(response.status).toBe(404);
    }));
});
describe('GET /repository/:owner/:repo1/:repo2?', () => {
    it('should return details of one repository', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/repository/irshadali0806/repoA')
            .set("githubtoken", "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");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.any(Object));
    }));
    it('should return details of two repositories', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/repository/irshadali0806/repoA/repoA')
            .set("githubtoken", "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");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.any(Array));
    }));
    it('should handle errors when fetching repository details', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock the getRepositoryDetails function to simulate an error
        jest.mock('../src/repositoryService', () => ({
            getRepositoryDetails: jest.fn().mockRejectedValue(new Error('Repository details error')),
        }));
        const response = yield (0, supertest_1.default)(app).get('/repository/irshadali0806/repoA1/repoA1')
            .set("githubtoken", "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");
        //expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('error', 'Not Found');
    }));
});
