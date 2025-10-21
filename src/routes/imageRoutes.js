import express from 'express';
import { uploadImage } from '../controller/imageController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  uploadSingle,
  handleMulterError,
} from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', authenticate, uploadSingle, handleMulterError, uploadImage);

export default router;
