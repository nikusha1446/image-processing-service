import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { config } from './env.js';

export const s3Client = new S3Client({
  region: config.cloudStorage.region,
  endpoint: config.cloudStorage.endpoint,
  credentials: {
    accessKeyId: config.cloudStorage.accessKeyId,
    secretAccessKey: config.cloudStorage.secretAccessKey,
  },
});

export const uploadToCloud = async (buffer, key, contentType) => {
  const command = new PutObjectCommand({
    Bucket: config.cloudStorage.bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);

  return `${config.cloudStorage.publicUrl}/${key}`;
};

export const deleteFromCloud = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: config.cloudStorage.bucket,
    Key: key,
  });

  await s3Client.send(command);
};

export const getFromCloud = async (key) => {
  const command = new GetObjectCommand({
    Bucket: config.cloudStorage.bucket,
    Key: key,
  });

  const response = await s3Client.send(command);

  const chunks = [];

  for await (const chunk of response.Body) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
};
