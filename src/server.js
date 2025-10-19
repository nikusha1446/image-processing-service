import express from 'express';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';

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

app.use('/api/v1/auth', authRoutes);

// start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.log(
        `Server is running on port ${config.port} in ${config.nodeEnv} mode`
      );
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
