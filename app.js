import path from 'node:path';
import express from 'express';
import { db } from './db/db.js';
import * as middleware from './middleware/index.js';
import {
  registerErrors,
  registerPosts,
  registerRoot,
} from './resources/index.js';

const PORT = process.env.PORT ?? 3000;

const app = express();

app.use(express.json());

app.use(express.static(path.join(import.meta.dirname, 'public')));

registerPosts(app);
registerRoot(app);
registerErrors(app);

app.use(middleware.notFound); // 404
app.use(middleware.errorHandler); // Error handler

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
