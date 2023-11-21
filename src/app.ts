// src/app.ts
import express from 'express';
import { router } from './routes';

const app = express();
const port = 3000;

// Middleware to parse JSON in requests
app.use(express.json());

// Use the routes defined in the routes.ts file
app.use('/', router);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});