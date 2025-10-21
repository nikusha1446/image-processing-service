import Image from '../models/imageModel.js';
import { uploadToCloud } from '../config/cloudStorage.js';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided.',
      });
    }

    const file = req.file;

    const metadata = await sharp(file.buffer).metadata();

    const fileExtension = metadata.format;
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const cloudStorageKey = `images/${req.user._id}/${uniqueFilename}`;

    const imageUrl = await uploadToCloud(
      file.buffer,
      cloudStorageKey,
      file.mimetype
    );

    const image = await Image.create({
      userId: req.user._id,
      originalUrl: imageUrl,
      filename: uniqueFilename,
      originalFilename: file.originalname,
      format: metadata.format,
      size: file.size,
      width: metadata.width,
      height: metadata.height,
      cloudStorageKey: cloudStorageKey,
    });

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully.',
      data: image,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Image upload failed.',
      error: error.message,
    });
  }
};
