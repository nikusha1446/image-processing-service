import express from 'express';
import {
  getImageById,
  listImages,
  uploadImage,
} from '../controller/imageController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  uploadSingle,
  handleMulterError,
} from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', authenticate, listImages);
router.get('/:id', authenticate, getImageById);
router.post('/', authenticate, uploadSingle, handleMulterError, uploadImage);

export default router;
