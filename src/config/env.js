export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  database: {
    uri:
      process.env.MONGODB_URI ||
      'mongodb://localhost:27017/image_processing_db',
  },
  cloudStorage: {
    endpoint: process.env.CLOUD_STORAGE_ENDPOINT,
    region: process.env.CLOUD_STORAGE_REGION || 'auto',
    accessKeyId: process.env.CLOUD_STORAGE_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUD_STORAGE_SECRET_ACCESS_KEY,
    bucket: process.env.CLOUD_STORAGE_BUCKET,
    publicUrl: process.env.CLOUD_STORAGE_PUBLIC_URL,
  },
};
