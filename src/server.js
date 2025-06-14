import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import router from './routers/index.js';

import { getEnvVar } from './utils/getEnvVar.js';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/index.js';

import { swaggerDocs } from './middlewares/swaggerDocs.js';

export function setupServer() {
  const PORT = Number(getEnvVar('PORT', '3000'));

  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerDocs());

  app.use(router);

  app.use(errorHandler);
  app.use(notFoundHandler);

  app.use('/uploads', express.static(UPLOAD_DIR));

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
