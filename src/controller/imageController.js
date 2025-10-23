import Image from '../models/imageModel.js';
import { getFromCloud, uploadToCloud } from '../config/cloudStorage.js';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { transformImageSchema } from '../validators/transformValidator.js';

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

export const getImageById = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await Image.findById(id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found.',
      });
    }

    if (image.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this image.',
      });
    }

    res.status(200).json({
      success: true,
      data: image,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve image.',
      error: error.message,
    });
  }
};

export const listImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalImages = await Image.countDocuments({ userId: req.user._id });
    const totalPages = Math.ceil(totalImages / limit);

    const images = await Image.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: images,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalImages: totalImages,
        imagesPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve images.',
      error: error.message,
    });
  }
};

export const transformImage = async (req, res) => {
  try {
    const { id } = req.params;
    const transformations = transformImageSchema.parse(req.body);

    const image = await Image.findById(id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found.',
      });
    }

    if (image.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this image.',
      });
    }

    const imageBuffer = await getFromCloud(image.cloudStorageKey);

    let sharpInstance = sharp(imageBuffer);

    if (transformations.resize) {
      sharpInstance = sharpInstance.resize({
        width: transformations.resize.width,
        height: transformations.resize.height,
        fit: 'inside',
      });
    }

    if (transformations.crop) {
      sharpInstance = sharpInstance.extract({
        left: transformations.crop.x,
        top: transformations.crop.y,
        width: transformations.crop.width,
        height: transformations.crop.height,
      });
    }

    if (transformations.rotate) {
      sharpInstance = sharpInstance.rotate(transformations.rotate);
    }

    if (transformations.flip) {
      sharpInstance = sharpInstance.flip();
    }

    if (transformations.flop) {
      sharpInstance = sharpInstance.flop();
    }

    if (transformations.filters) {
      if (transformations.filters.grayscale) {
        sharpInstance = sharpInstance.grayscale();
      }
      if (transformations.filters.sepia) {
        sharpInstance = sharpInstance.tint({ r: 112, g: 66, b: 20 });
      }
      if (transformations.filters.blur) {
        sharpInstance = sharpInstance.blur(transformations.filters.blur);
      }
      if (transformations.filters.sharpen) {
        sharpInstance = sharpInstance.sharpen();
      }
    }

    if (transformations.format) {
      sharpInstance = sharpInstance.toFormat(transformations.format);
    }

    const transformedBuffer = await sharpInstance.toBuffer();
    const transformedMetadata = await sharp(transformedBuffer).metadata();

    const fileExtension = transformations.format || image.format;
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const cloudStorageKey = `images/${req.user._id}/transformed/${uniqueFilename}`;

    const transformedUrl = await uploadToCloud(
      transformedBuffer,
      cloudStorageKey,
      `image/${fileExtension}`
    );

    image.transformedUrl = transformedUrl;
    image.transformations = transformations;
    await image.save();

    res.status(200).json({
      success: true,
      message: 'Image transformed successfully.',
      data: {
        originalUrl: image.originalUrl,
        transformedUrl: image.transformedUrl,
        transformations: image.transformations,
        metadata: {
          format: transformedMetadata.format,
          width: transformedMetadata.width,
          height: transformedMetadata.height,
          size: transformedBuffer.length,
        },
      },
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error.',
        errors: error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Image transformation failed.',
      error: error.message,
    });
  }
};
