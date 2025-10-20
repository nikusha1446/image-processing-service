import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    originalUrl: {
      type: String,
      required: [true, 'Original URL is required'],
    },
    transformedUrl: {
      type: String,
      default: null,
    },
    filename: {
      type: String,
      required: [true, 'Original filename is required'],
    },
    originalFilename: {
      type: String,
      required: [true, 'Original filename is required'],
    },
    format: {
      type: String,
      required: [true, 'Format is required'],
      enum: ['jpeg', 'jpg', 'png', 'webp', 'gif'],
    },
    size: {
      type: Number,
      required: [true, 'Size is required'],
    },
    width: {
      type: Number,
      default: null,
    },
    height: {
      type: Number,
      default: null,
    },
    transformations: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    cloudStorageKey: {
      type: String,
      required: [true, 'Cloud storage key is required'],
    },
  },
  {
    timestamps: true,
  }
);

imageSchema.index({ userId: 1, createdAt: -1 });

const Image = mongoose.model('Image', imageSchema);

export default Image;
