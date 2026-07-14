import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';
import bcrypt from 'bcryptjs';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res, next) => {
  const { name, email, password, avatar } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  if (name) user.name = name;
  if (email) user.email = email;
  if (avatar) user.avatar = avatar;
  if (password) {
    user.password = password; // Will be hashed by pre-save hook
  }

  await user.save();

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role
    }
  });
});
