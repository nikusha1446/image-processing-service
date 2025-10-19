import User from '../models/userModel.js';
import { loginSchema, registerSchema } from '../validators/authValidator.js';
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

export const login = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await User.findOne({ username: validatedData.username });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isPasswordValid = await user.comparePassword(validatedData.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    const token = generateToken({ userId: user._id });

    res.status(200).json({
      success: true,
      message: 'Login successful.',
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
      message: 'Login failed.',
      error: error.message,
    });
  }
};
