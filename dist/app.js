"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const app = (0, express_1.default)();
const port = 3000;
// Middleware to parse JSON in requests
app.use(express_1.default.json());
// Use the routes defined in the routes.ts file
app.use('/', routes_1.router);
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
