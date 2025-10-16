import express from 'express';

const PORT = process.env.PORT || 3000;
const app = express();

// middleware
app.use(express.json());

// routes
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Image Processing Service is running',
  });
});

// start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
