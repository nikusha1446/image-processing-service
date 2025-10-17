import express from 'express';
import { config } from './config/env.js';

const app = express();

// middleware
app.use(express.json());

// routes
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Image Processing Service is running',
    environment: config.nodeEnv,
  });
});

// start server
app.listen(config.port, () => {
  console.log(
    `Server is running on port ${config.port} in ${config.nodeEnv} mode`
  );
});
