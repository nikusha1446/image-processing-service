# Image Processing Service

An image processing service offering secure uploads, cloud storage, and powerful transformations including resize, crop, rotate, flip, and filter operations—all accessible via a simple REST API

## ✨ Features

- **User Authentication** - Secure JWT-based authentication
- **Image Upload** - Upload images to cloud storage (Cloudflare R2)
- **Image Retrieval** - Get single images or paginated lists
- **Image Transformations** - Resize, crop, rotate, flip, apply filters, and convert formats
- **Rate Limiting** - Prevent abuse with request limits
- **Cloud Storage** - Scalable storage with Cloudflare R2
- **Input Validation** - Zod schema validation for all endpoints

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Cloud Storage**: Cloudflare R2 (S3-compatible)
- **Image Processing**: Sharp
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **File Upload**: Multer
- **Rate Limiting**: express-rate-limit

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB
- Cloudflare R2 account (or AWS S3)
- npm or yarn

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/nikusha1446/image-processing-service.git
cd image-processing-service
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/image_processing_db?retryWrites=true&w=majority&appName=cluster

# Cloud Storage - Cloudflare R2
CLOUD_STORAGE_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
CLOUD_STORAGE_REGION=auto
CLOUD_STORAGE_ACCESS_KEY_ID=your-access-key-id
CLOUD_STORAGE_SECRET_ACCESS_KEY=your-secret-access-key
CLOUD_STORAGE_BUCKET=your-bucket-name
CLOUD_STORAGE_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

### 4. Start the development server
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### 🔐 Authentication Endpoints

#### Register a new user
```http
POST /auth/register
Content-Type: application/json

{
  "username": "user1",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "username": "user1",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "user1",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "...",
      "username": "user1"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 🖼️ Image Endpoints

All image endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

#### Upload an image
```http
POST /images
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
  image: <file>
```

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "_id": "...",
    "userId": "...",
    "originalUrl": "https://pub-xxxxx.r2.dev/images/userId/filename.jpg",
    "filename": "uuid.jpg",
    "originalFilename": "photo.jpg",
    "format": "jpeg",
    "size": 1024000,
    "width": 1920,
    "height": 1080,
    "cloudStorageKey": "images/userId/uuid.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get a single image
```http
GET /images/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "originalUrl": "https://...",
    "transformedUrl": null,
    "filename": "uuid.jpg",
    "format": "jpeg",
    "size": 1024000,
    "width": 1920,
    "height": 1080
  }
}
```

#### List all images (with pagination)
```http
GET /images?page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Images per page

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "originalUrl": "https://...",
      "filename": "uuid.jpg",
      "format": "jpeg",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalImages": 42,
    "imagesPerPage": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

#### Transform an image
```http
POST /images/:id/transform
Authorization: Bearer <token>
Content-Type: application/json

{
  "resize": {
    "width": 500,
    "height": 500
  },
  "crop": {
    "width": 200,
    "height": 200,
    "x": 100,
    "y": 50
  },
  "rotate": 90,
  "format": "png",
  "filters": {
    "grayscale": true,
    "blur": 5
  },
  "flip": true,
  "flop": false
}
```

**Transformation Options:**

- **resize**: `{ width?: number, height?: number }`
- **crop**: `{ width: number, height: number, x: number, y: number }`
- **rotate**: `number` (-360 to 360 degrees)
- **format**: `"jpeg" | "png" | "webp" | "gif"`
- **filters**:
  - `grayscale`: `boolean`
  - `sepia`: `boolean`
  - `blur`: `number` (0.3 to 1000)
  - `sharpen`: `boolean`
- **flip**: `boolean` (vertical flip)
- **flop**: `boolean` (horizontal flip/mirror)

**Response:**
```json
{
  "success": true,
  "message": "Image transformed successfully",
  "data": {
    "originalUrl": "https://...",
    "transformedUrl": "https://.../transformed/uuid.png",
    "transformations": {
      "resize": { "width": 500, "height": 500 },
      "rotate": 90,
      "format": "png",
      "filters": { "grayscale": true }
    },
    "metadata": {
      "format": "png",
      "width": 500,
      "height": 500,
      "size": 450000
    }
  }
}
```

### 💚 Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Image Processing Service is running",
  "environment": "development"
}
```

## 🚦 Rate Limits

To prevent abuse, the following rate limits are enforced:

- **Image Upload**: 20 requests per 15 minutes per IP
- **Image Transformation**: 10 requests per 15 minutes per IP

When rate limit is exceeded:
```json
{
  "success": false,
  "message": "Too many transformation requests. Please try again later."
}
```

## 📁 Project Structure

```
image-processing-service/
├── src/
│   ├── config/
│   │   ├── cloudStorage.js         # Cloudflare R2/S3 configuration
│   │   ├── db.js                   # MongoDB connection
│   │   └── env.js                  # Environment variables
│   ├── controllers/
│   │   ├── authController.js       # Authentication logic
│   │   └── imageController.js      # Image operations logic
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT authentication
│   │   ├── rateLimitMiddleware.js  # Rate limiting
│   │   └── uploadMiddleware.js     # File upload handling
│   ├── models/
│   │   ├── imageModel.js           # Image schema
│   │   └── userModel.js            # User schema
│   ├── routes/
│   │   ├── authRoutes.js           # Authentication routes
│   │   └── imageRoutes.js          # Image routes
│   ├── utils/
│   │   ├── jwt.js                  # JWT utilities
│   │   └── password.js             # Password hashing
│   ├── validators/
│   │   ├── authValidator.js        # Auth validation schemas
│   │   └── transformValidator.js   # Transform validation schemas
│   └── server.js                   # Application entry point
├── .env                            # Environment variables (not in git)
├── .env.example                    # Environment template
├── .gitignore
├── package.json
└── README.md
```

## ⚠️ Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development)",
  "errors": [
    {
      "field": "username",
      "message": "Username is required"
    }
  ]
}
```

## 🧪 Testing with Postman

1. **Register a user** - `POST /api/v1/auth/register`
2. **Copy the JWT token** from the response
3. **Set Authorization header** for subsequent requests:
   - Type: Bearer Token
   - Token: `<paste-token-here>`
4. **Upload an image** - `POST /api/v1/images`
   - Body → form-data
   - Key: `image`, Type: File
5. **Copy the image ID** from response
6. **Transform the image** - `POST /api/v1/images/:id/transform`
   - Body → raw → JSON
   - Add transformation options

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT-based stateless authentication
- Rate limiting on all endpoints
- Input validation with Zod
- Image ownership verification
- Secure file upload validation (type, size)

## 📏 File Size Limits

- Maximum file size: **10 MB**
- Supported formats: JPEG, JPG, PNG, WEBP, GIF

## 📦 Cloud Storage Structure

```
bucket/
└── images/
    └── {userId}/
        ├── {uuid}.jpg           # Original images
        ├── {uuid}.png
        └── transformed/
            ├── {uuid}.webp      # Transformed images
            └── {uuid}.png
```

## 📄 License

ISC
