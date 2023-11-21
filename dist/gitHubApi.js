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
exports.githubRequest = void 0;
// src/githubApi.ts
const axios_1 = __importDefault(require("axios"));
const githubRequest = (url, method = 'get', data = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const githubToken = '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';
    const headers = {
        Authorization: `Bearer ${githubToken}`, // Replace with your GitHub token
    };
    try {
        const response = yield (0, axios_1.default)({ url, method, headers, data });
        return response.data;
    }
    catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message);
    }
});
exports.githubRequest = githubRequest;
