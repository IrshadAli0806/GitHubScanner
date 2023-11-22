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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepositoryDetails = void 0;
const gitHubApi_1 = require("./gitHubApi");
const getRepositoryDetails = (owner, repo, githubToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const repoDetails = yield (0, gitHubApi_1.githubRequest)(`https://api.github.com/repos/${owner}/${repo}`, githubToken);
        const repoSize = repoDetails.size;
        const isPrivate = repoDetails.private;
        // Fetching the contents of 1 YAML file
        const contents = yield (0, gitHubApi_1.githubRequest)(`https://api.github.com/repos/${owner}/${repo}/contents`, githubToken);
        const yamlFiles = yield (0, gitHubApi_1.githubRequest)(`https://api.github.com/repos/${owner}/${repo}/contents/.github/workflows`, githubToken);
        console.log("Yaml file", yamlFiles);
        let ymlFileContent = {};
        if (yamlFiles && (yamlFiles === null || yamlFiles === void 0 ? void 0 : yamlFiles.length) > 0) {
            // If the repository has at least one YAML file
            const ymlFile = yamlFiles.find((file) => file.name.endsWith('.yml') || file.name.endsWith('.yaml'));
            if (ymlFile) {
                ymlFileContent = yield (0, gitHubApi_1.githubRequest)(ymlFile.url, githubToken); // Fetch content of the YAML file
                ymlFileContent = Buffer.from(ymlFileContent.content, 'base64').toString();
            }
        }
        //Fetching active webhooks
        const webhooks = yield (0, gitHubApi_1.githubRequest)(`https://api.github.com/repos/${owner}/${repo}/hooks`, githubToken);
        return {
            name: repoDetails.name,
            size: repoSize,
            owner: owner,
            private: isPrivate,
            numFiles: contents.length,
            ymlFileContent: ymlFileContent,
            activeWebhooks: webhooks.map((webhook) => webhook.config.url),
        };
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.getRepositoryDetails = getRepositoryDetails;
