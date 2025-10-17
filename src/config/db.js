import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(config.database.uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// handle connection events
mongoose.connection.on('error', (error) => {
  console.error('MongoDB error:', error);
});
