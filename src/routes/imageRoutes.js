import express from 'express';
import {
  getImageById,
  listImages,
  transformImage,
  uploadImage,
} from '../controller/imageController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  uploadSingle,
  handleMulterError,
} from '../middleware/uploadMiddleware.js';
import {
  transformRateLimiter,
  uploadRateLimiter,
} from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

router.get('/', authenticate, listImages);
router.get('/:id', authenticate, getImageById);
router.post(
  '/',
  uploadRateLimiter,
  authenticate,
  uploadSingle,
  handleMulterError,
  uploadImage
);
router.post(
  '/:id/transform',
  transformRateLimiter,
  authenticate,
  transformImage
);

export default router;
