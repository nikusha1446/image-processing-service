import User from '../models/userModel.js';
import { registerSchema } from '../validators/authValidator.js';
import { generateToken } from '../utils/jwt.js';

export const register = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const existingUser = await User.findOne({
      username: validatedData.username,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Username already exists.',
      });
    }

    const user = await User.create(validatedData);

    const token = generateToken({ userId: user._id });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error.',
        errors: error.issues.map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed.',
      error: error.message,
    });
  }
};
